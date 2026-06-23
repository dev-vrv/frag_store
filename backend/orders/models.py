from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from products.models import Product


class PromoCode(models.Model):
    class DiscountType(models.TextChoices):
        PERCENT = 'percent', _('Процент')
        FIXED = 'fixed', _('Фиксированная сумма')

    code = models.CharField(_('код'), max_length=32, unique=True)
    title = models.CharField(_('название'), max_length=120)
    description = models.TextField(_('описание'), blank=True)
    discount_type = models.CharField(_('тип скидки'), max_length=16, choices=DiscountType.choices, default=DiscountType.PERCENT)
    discount_value = models.DecimalField(_('значение скидки'), max_digits=10, decimal_places=2)
    is_active = models.BooleanField(_('активен'), default=True)
    starts_at = models.DateTimeField(_('действует с'), blank=True, null=True)
    ends_at = models.DateTimeField(_('действует до'), blank=True, null=True)
    usage_limit = models.PositiveIntegerField(_('лимит использований'), blank=True, null=True)
    used_count = models.PositiveIntegerField(_('использовано'), default=0)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('code',)
        verbose_name = _('промокод')
        verbose_name_plural = _('промокоды')

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        self.code = self.code.strip().upper()
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()

        if self.discount_value <= 0:
            raise ValidationError({'discount_value': _('Значение скидки должно быть больше нуля.')})

        if self.discount_type == self.DiscountType.PERCENT and self.discount_value > 100:
            raise ValidationError({'discount_value': _('Процент скидки не может быть больше 100.')})

        if self.starts_at and self.ends_at and self.starts_at >= self.ends_at:
            raise ValidationError({'ends_at': _('Дата окончания должна быть позже даты начала.')})

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
        NEW = 'new', _('Новый')
        CONFIRMED = 'confirmed', _('Подтвержден')
        PROCESSING = 'processing', _('В обработке')
        SHIPPED = 'shipped', _('Отправлен')
        DELIVERED = 'delivered', _('Доставлен')
        CANCELED = 'canceled', _('Отменен')

    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', _('Ожидает оплаты')
        PAID = 'paid', _('Оплачен')
        FAILED = 'failed', _('Ошибка оплаты')
        REFUNDED = 'refunded', _('Возвращен')

    class DeliveryMethod(models.TextChoices):
        COURIER = 'courier', _('Курьер')
        PICKUP = 'pickup', _('Самовывоз')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='orders',
        blank=True,
        null=True,
        verbose_name=_('пользователь'),
    )
    number = models.CharField(_('номер'), max_length=24, unique=True, editable=False)
    status = models.CharField(_('статус'), max_length=16, choices=Status.choices, default=Status.NEW)
    payment_status = models.CharField(_('статус оплаты'), max_length=16, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    delivery_method = models.CharField(_('способ доставки'), max_length=16, choices=DeliveryMethod.choices, default=DeliveryMethod.COURIER)
    customer_name = models.CharField(_('имя клиента'), max_length=180)
    customer_email = models.EmailField(_('email клиента'))
    customer_phone = models.CharField(_('телефон клиента'), max_length=64)
    delivery_city = models.CharField(_('город доставки'), max_length=120, blank=True)
    delivery_address = models.CharField(_('адрес доставки'), max_length=255, blank=True)
    comment = models.TextField(_('комментарий'), blank=True)
    promo_code = models.ForeignKey(
        PromoCode,
        on_delete=models.SET_NULL,
        related_name='orders',
        blank=True,
        null=True,
        verbose_name=_('промокод'),
    )
    promo_code_snapshot = models.CharField(_('код промокода'), max_length=32, blank=True)
    promo_discount_total = models.DecimalField(_('скидка по промокоду'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    subtotal = models.DecimalField(_('сумма без скидки'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    discount_total = models.DecimalField(_('общая скидка'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(_('итоговая сумма'), max_digits=12, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(_('валюта'), max_length=3, default='KGS')
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name = _('заказ')
        verbose_name_plural = _('заказы')

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
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name=_('заказ'))
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items', verbose_name=_('товар'))
    product_name = models.CharField(_('название товара'), max_length=180)
    product_sku = models.CharField(_('артикул товара'), max_length=64)
    unit_price = models.DecimalField(_('цена за единицу'), max_digits=10, decimal_places=2)
    unit_old_price = models.DecimalField(_('старая цена за единицу'), max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.PositiveIntegerField(_('количество'))
    line_total = models.DecimalField(_('сумма позиции'), max_digits=12, decimal_places=2)
    currency = models.CharField(_('валюта'), max_length=3, default='KGS')
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)

    class Meta:
        ordering = ('id',)
        verbose_name = _('позиция заказа')
        verbose_name_plural = _('позиции заказа')

    def __str__(self):
        return f'{self.order.number} - {self.product_name}'

    def clean(self):
        super().clean()

        if self.quantity <= 0:
            raise ValidationError({'quantity': _('Количество должно быть больше нуля.')})
