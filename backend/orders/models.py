from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from products.models import Product


class PromoCode(models.Model):
    class DiscountType(models.TextChoices):
        PERCENT = 'percent', 'Percent'
        FIXED = 'fixed', 'Fixed amount'

    code = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=16, choices=DiscountType.choices, default=DiscountType.PERCENT)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(blank=True, null=True)
    ends_at = models.DateTimeField(blank=True, null=True)
    usage_limit = models.PositiveIntegerField(blank=True, null=True)
    used_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('code',)
        verbose_name = 'promo code'
        verbose_name_plural = 'promo codes'

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        self.code = self.code.strip().upper()
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()

        if self.discount_value <= 0:
            raise ValidationError({'discount_value': 'Discount value must be greater than zero.'})

        if self.discount_type == self.DiscountType.PERCENT and self.discount_value > 100:
            raise ValidationError({'discount_value': 'Percent discount cannot be greater than 100.'})

        if self.starts_at and self.ends_at and self.starts_at >= self.ends_at:
            raise ValidationError({'ends_at': 'End date must be later than start date.'})

    def is_available(self):
        now = timezone.now()

        if not self.is_active:
            return False
        if self.starts_at and now < self.starts_at:
            return False
        if self.ends_at and now > self.ends_at:
            return False
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False

        return True

    def calculate_discount_amount(self, subtotal):
        if subtotal <= 0:
            return subtotal

        if self.discount_type == self.DiscountType.PERCENT:
            amount = subtotal * (self.discount_value / 100)
        else:
            amount = self.discount_value

        return min(subtotal, amount)


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', 'New'
        CONFIRMED = 'confirmed', 'Confirmed'
        PROCESSING = 'processing', 'Processing'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELED = 'canceled', 'Canceled'

    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'

    class DeliveryMethod(models.TextChoices):
        COURIER = 'courier', 'Courier'
        PICKUP = 'pickup', 'Pickup'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='orders',
        blank=True,
        null=True,
    )
    number = models.CharField(max_length=24, unique=True, editable=False)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    payment_status = models.CharField(max_length=16, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    delivery_method = models.CharField(max_length=16, choices=DeliveryMethod.choices, default=DeliveryMethod.COURIER)
    customer_name = models.CharField(max_length=180)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=64)
    delivery_city = models.CharField(max_length=120, blank=True)
    delivery_address = models.CharField(max_length=255, blank=True)
    comment = models.TextField(blank=True)
    promo_code = models.ForeignKey(
        PromoCode,
        on_delete=models.SET_NULL,
        related_name='orders',
        blank=True,
        null=True,
    )
    promo_code_snapshot = models.CharField(max_length=32, blank=True)
    promo_discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=3, default='KGS')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name = 'order'
        verbose_name_plural = 'orders'

    def __str__(self):
        return self.number

    def save(self, *args, **kwargs):
        if not self.number:
            self.number = self._generate_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_number():
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        return f'FS-{timestamp}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    product_name = models.CharField(max_length=180)
    product_sku = models.CharField(max_length=64)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='KGS')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('id',)
        verbose_name = 'order item'
        verbose_name_plural = 'order items'

    def __str__(self):
        return f'{self.order.number} - {self.product_name}'

    def clean(self):
        super().clean()

        if self.quantity <= 0:
            raise ValidationError({'quantity': 'Quantity must be greater than zero.'})
