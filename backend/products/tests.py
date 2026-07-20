from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from users.models import Notification
from .models import Brand, Product, ProductCategory, ProductStockSubscription


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
