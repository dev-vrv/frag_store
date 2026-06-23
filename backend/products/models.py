from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class Brand(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    website = models.URLField(blank=True)
    country = models.CharField(max_length=80, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)
        verbose_name = 'brand'
        verbose_name_plural = 'brands'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_unique_slug(self.name, Brand)
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_unique_slug(value, model_class):
        base_slug = slugify(value) or 'item'
        slug = base_slug
        index = 2

        while model_class.objects.filter(slug=slug).exists():
            slug = f'{base_slug}-{index}'
            index += 1

        return slug


class ProductCategory(models.Model):
    class DeviceType(models.TextChoices):
        MOUSE = 'mouse', 'Mouse'
        KEYBOARD = 'keyboard', 'Keyboard'
        HEADSET = 'headset', 'Headset'
        MOUSEPAD = 'mousepad', 'Mousepad'
        CONTROLLER = 'controller', 'Controller'
        MONITOR = 'monitor', 'Monitor'
        COMPONENT = 'component', 'Component'
        ACCESSORY = 'accessory', 'Accessory'
        OTHER = 'other', 'Other'

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    device_type = models.CharField(max_length=24, choices=DeviceType.choices, default=DeviceType.OTHER)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('sort_order', 'name')
        verbose_name = 'product category'
        verbose_name_plural = 'product categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = Brand._generate_unique_slug(self.name, ProductCategory)
        super().save(*args, **kwargs)


class Product(models.Model):
    class AvailabilityStatus(models.TextChoices):
        IN_STOCK = 'in_stock', 'In stock'
        LOW_STOCK = 'low_stock', 'Low stock'
        OUT_OF_STOCK = 'out_of_stock', 'Out of stock'
        PREORDER = 'preorder', 'Preorder'
        DISCONTINUED = 'discontinued', 'Discontinued'

    class Currency(models.TextChoices):
        KGS = 'KGS', 'KGS'
        USD = 'USD', 'USD'

    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.PROTECT,
        related_name='products',
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name='products',
    )
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    sku = models.CharField(max_length=64, unique=True)
    short_description = models.CharField(max_length=280)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.KGS)
    quantity_in_stock = models.PositiveIntegerField(default=0)
    availability_status = models.CharField(
        max_length=20,
        choices=AvailabilityStatus.choices,
        default=AvailabilityStatus.IN_STOCK,
    )
    warranty_months = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=80, blank=True)
    weight_grams = models.PositiveIntegerField(blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-is_best_seller', '-is_featured', 'name')
        verbose_name = 'product'
        verbose_name_plural = 'products'
        indexes = [
            models.Index(fields=('category', 'is_active')),
            models.Index(fields=('brand', 'is_active')),
            models.Index(fields=('is_best_seller', 'is_active')),
            models.Index(fields=('is_new_arrival', 'is_active')),
            models.Index(fields=('availability_status', 'is_active')),
        ]

    def __str__(self):
        return self.name

    @property
    def has_discount(self):
        return bool(self.old_price and self.old_price > self.price)

    @property
    def discount_percent(self):
        if not self.has_discount:
            return 0

        discount = (self.old_price - self.price) / self.old_price * Decimal('100')
        return int(discount.quantize(Decimal('1')))

    def clean(self):
        super().clean()

        if self.old_price is not None and self.old_price <= self.price:
            raise ValidationError({'old_price': 'Old price must be greater than current price.'})

        if self.quantity_in_stock == 0 and self.availability_status in {
            self.AvailabilityStatus.IN_STOCK,
            self.AvailabilityStatus.LOW_STOCK,
        }:
            raise ValidationError({
                'availability_status': 'In stock and low stock statuses require a positive stock quantity.'
            })

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = Brand._generate_unique_slug(self.name, Product)
        self.full_clean()
        super().save(*args, **kwargs)


class ProductMedia(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='media_items')
    media_type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
    file = models.FileField(upload_to='products/media/', blank=True)
    external_url = models.URLField(blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = 'product media'
        verbose_name_plural = 'product media'

    def __str__(self):
        return f'{self.product.name} - {self.media_type}'

    def clean(self):
        super().clean()

        if not self.file and not self.external_url:
            raise ValidationError('Either file or external URL must be provided.')


class ProductFeature(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features')
    title = models.CharField(max_length=140)
    description = models.CharField(max_length=280, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = 'product feature'
        verbose_name_plural = 'product features'

    def __str__(self):
        return f'{self.product.name} - {self.title}'


class ProductSpecification(models.Model):
    class ValueType(models.TextChoices):
        TEXT = 'text', 'Text'
        NUMBER = 'number', 'Number'
        BOOLEAN = 'boolean', 'Boolean'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specifications')
    group = models.CharField(max_length=80, blank=True)
    name = models.CharField(max_length=120)
    value = models.CharField(max_length=255)
    unit = models.CharField(max_length=32, blank=True)
    value_type = models.CharField(max_length=16, choices=ValueType.choices, default=ValueType.TEXT)
    is_highlight = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = 'product specification'
        verbose_name_plural = 'product specifications'

    def __str__(self):
        return f'{self.product.name} - {self.name}'
