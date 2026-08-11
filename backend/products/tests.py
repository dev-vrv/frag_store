from importlib import import_module
from types import SimpleNamespace

from django.apps import apps as django_apps
from django.contrib.auth import get_user_model
from django.db import connection
from django.test import TestCase
from rest_framework.test import APIClient

from users.models import Notification
from .models import Brand, Product, ProductCategory, ProductStockSubscription


class ProductCategoryTaxonomyTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_categories_api_exposes_gaming_chairs_without_webcams(self):
        response = self.client.get('/api/products/categories/')

        self.assertEqual(response.status_code, 200)
        categories = {category['slug']: category for category in response.data}
        self.assertIn('gaming-chairs', categories)
        self.assertEqual(categories['gaming-chairs']['device_type'], ProductCategory.DeviceType.CHAIR)
        self.assertIn('accessories', categories)
        self.assertNotIn('webcams', categories)

    def test_taxonomy_migration_moves_webcam_products_to_accessories(self):
        webcam_category = ProductCategory.objects.create(
            name='Legacy Webcams',
            slug='webcams',
            device_type=ProductCategory.DeviceType.ACCESSORY,
        )
        brand = Brand.objects.create(name='Legacy Webcam Brand')
        webcam = Product.objects.create(
            category=webcam_category,
            brand=brand,
            name='Legacy Webcam',
            sku='LEGACY-WEBCAM',
            short_description='Legacy webcam',
            description='Legacy webcam product',
            price='5000.00',
            quantity_in_stock=1,
            availability_status=Product.AvailabilityStatus.IN_STOCK,
        )
        migration = import_module('products.migrations.0008_replace_webcams_with_gaming_chairs')

        schema_editor = SimpleNamespace(connection=connection)
        migration.replace_webcams_with_gaming_chairs(django_apps, schema_editor)

        webcam.refresh_from_db()
        self.assertEqual(webcam.category.slug, 'accessories')
        self.assertFalse(ProductCategory.objects.filter(slug='webcams').exists())
        self.assertTrue(
            ProductCategory.objects.filter(
                slug='gaming-chairs',
                device_type=ProductCategory.DeviceType.CHAIR,
                is_active=True,
            ).exists()
        )


class ProductStockSubscriptionTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='client@example.com', password='strong-test-password', first_name='Client')
        category = ProductCategory.objects.create(name='Mice', device_type='mouse')
        brand = Brand.objects.create(name='Test Brand')
        self.product = Product.objects.create(
            category=category, brand=brand, name='Test Mouse', sku='TEST-MOUSE',
            short_description='Test product', description='Test product description', price='1000.00',
            quantity_in_stock=0, availability_status=Product.AvailabilityStatus.OUT_OF_STOCK,
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_subscription_creates_notification_after_restock(self):
        response = self.client.post(f'/api/products/{self.product.slug}/stock-subscription/', {'locale': 'ru'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.product.quantity_in_stock = 5
        self.product.availability_status = Product.AvailabilityStatus.IN_STOCK
        self.product.save()
        notification = Notification.objects.get(user=self.user)
        self.assertEqual(notification.notification_type, Notification.Type.STOCK)
        self.assertIn(self.product.name, notification.text)
        self.assertEqual(ProductStockSubscription.objects.get(product=self.product, user=self.user).status, ProductStockSubscription.Status.NOTIFIED)

    def test_available_product_cannot_be_subscribed(self):
        self.product.quantity_in_stock = 1
        self.product.availability_status = Product.AvailabilityStatus.IN_STOCK
        self.product.save()
        response = self.client.post(f'/api/products/{self.product.slug}/stock-subscription/', {'locale': 'ru'}, format='json')
        self.assertEqual(response.status_code, 400)
