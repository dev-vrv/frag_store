from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Brand(models.Model):
    name = models.CharField(_('название'), max_length=120, unique=True)
    slug = models.SlugField(_('slug'), max_length=140, unique=True, blank=True)
    website = models.URLField(_('сайт'), blank=True)
    country = models.CharField(_('страна'), max_length=80, blank=True)
    is_active = models.BooleanField(_('активен'), default=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('name',)
        verbose_name = _('бренд')
        verbose_name_plural = _('бренды')

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
        MOUSE = 'mouse', _('Мышь')
        KEYBOARD = 'keyboard', _('Клавиатура')
        HEADSET = 'headset', _('Гарнитура')
        MOUSEPAD = 'mousepad', _('Коврик')
        CONTROLLER = 'controller', _('Контроллер')
        MONITOR = 'monitor', _('Монитор')
        COMPONENT = 'component', _('Компонент')
        ACCESSORY = 'accessory', _('Аксессуар')
        OTHER = 'other', _('Другое')

    name = models.CharField(_('название'), max_length=120, unique=True)
    slug = models.SlugField(_('slug'), max_length=140, unique=True, blank=True)
    description = models.TextField(_('описание'), blank=True)
    device_type = models.CharField(_('тип устройства'), max_length=24, choices=DeviceType.choices, default=DeviceType.OTHER)
    sort_order = models.PositiveIntegerField(_('порядок сортировки'), default=0)
    is_active = models.BooleanField(_('активна'), default=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('sort_order', 'name')
        verbose_name = _('категория')
        verbose_name_plural = _('категории')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = Brand._generate_unique_slug(self.name, ProductCategory)
        super().save(*args, **kwargs)


class Product(models.Model):
    class AvailabilityStatus(models.TextChoices):
        IN_STOCK = 'in_stock', _('В наличии')
        LOW_STOCK = 'low_stock', _('Мало на складе')
        OUT_OF_STOCK = 'out_of_stock', _('Нет в наличии')
        PREORDER = 'preorder', _('Предзаказ')
        DISCONTINUED = 'discontinued', _('Снят с продажи')

    class Currency(models.TextChoices):
        KGS = 'KGS', 'KGS'
        USD = 'USD', 'USD'

    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('категория'),
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('бренд'),
    )
    name = models.CharField(_('название'), max_length=180)
    slug = models.SlugField(_('slug'), max_length=220, unique=True, blank=True)
    sku = models.CharField(_('артикул'), max_length=64, unique=True)
    short_description = models.CharField(_('краткое описание'), max_length=280)
    description = models.TextField(_('описание'))
    price = models.DecimalField(_('цена'), max_digits=10, decimal_places=2)
    old_price = models.DecimalField(_('старая цена'), max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(_('валюта'), max_length=3, choices=Currency.choices, default=Currency.KGS)
    quantity_in_stock = models.PositiveIntegerField(_('остаток на складе'), default=0)
    availability_status = models.CharField(
        _('статус наличия'),
        max_length=20,
        choices=AvailabilityStatus.choices,
        default=AvailabilityStatus.IN_STOCK,
    )
    warranty_months = models.PositiveIntegerField(_('гарантия, мес.'), default=0)
    color = models.CharField(_('цвет'), max_length=80, blank=True)
    weight_grams = models.PositiveIntegerField(_('вес, г'), blank=True, null=True)
    release_date = models.DateField(_('дата релиза'), blank=True, null=True)
    is_active = models.BooleanField(_('активен'), default=True)
    is_featured = models.BooleanField(_('подборка'), default=False)
    is_best_seller = models.BooleanField(_('хит продаж'), default=False)
    is_new_arrival = models.BooleanField(_('новинка'), default=False)
    meta_title = models.CharField(_('meta title'), max_length=255, blank=True)
    meta_description = models.CharField(_('meta description'), max_length=320, blank=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('-is_best_seller', '-is_featured', 'name')
        verbose_name = _('товар')
        verbose_name_plural = _('товары')
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
            raise ValidationError({'old_price': _('Старая цена должна быть больше текущей цены.')})

        if self.quantity_in_stock == 0 and self.availability_status in {
            self.AvailabilityStatus.IN_STOCK,
            self.AvailabilityStatus.LOW_STOCK,
        }:
            raise ValidationError({
                'availability_status': _('Статусы "в наличии" и "мало на складе" требуют положительный остаток.')
            })

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = Brand._generate_unique_slug(self.name, Product)
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def active_color_options(self):
        return self.color_options.filter(is_active=True).order_by('sort_order', 'id')


class ProductMedia(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = 'image', _('Изображение')
        VIDEO = 'video', _('Видео')

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='media_items', verbose_name=_('товар'))
    media_type = models.CharField(_('тип медиа'), max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
    file = models.FileField(_('файл'), upload_to='products/media/', blank=True)
    external_url = models.URLField(_('внешняя ссылка'), blank=True)
    alt_text = models.CharField(_('alt текст'), max_length=255, blank=True)
    is_primary = models.BooleanField(_('основное'), default=False)
    sort_order = models.PositiveIntegerField(_('порядок сортировки'), default=0)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = _('медиа товара')
        verbose_name_plural = _('медиа товаров')

    def __str__(self):
        return f'{self.product.name} - {self.media_type}'

    def clean(self):
        super().clean()

        if not self.file and not self.external_url:
            raise ValidationError(_('Необходимо указать файл или внешнюю ссылку.'))


class ProductColorOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='color_options', verbose_name=_('товар'))
    name = models.CharField(_('название цвета'), max_length=80)
    hex_code = models.CharField(_('hex код'), max_length=7, blank=True)
    sort_order = models.PositiveIntegerField(_('порядок сортировки'), default=0)
    is_active = models.BooleanField(_('активен'), default=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = _('цвет товара')
        verbose_name_plural = _('цвета товара')
        constraints = [
            models.UniqueConstraint(fields=('product', 'name'), name='unique_product_color_name'),
        ]

    def __str__(self):
        return f'{self.product.name} - {self.name}'

    def clean(self):
        super().clean()

        if self.hex_code:
            normalized_hex = self.hex_code.strip().upper()
            if not normalized_hex.startswith('#') or len(normalized_hex) != 7:
                raise ValidationError({'hex_code': _('Hex код должен быть в формате #RRGGBB.')})
            self.hex_code = normalized_hex

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class ProductFeature(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features', verbose_name=_('товар'))
    title = models.CharField(_('заголовок'), max_length=140)
    description = models.CharField(_('описание'), max_length=280, blank=True)
    sort_order = models.PositiveIntegerField(_('порядок сортировки'), default=0)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = _('особенность товара')
        verbose_name_plural = _('особенности товара')

    def __str__(self):
        return f'{self.product.name} - {self.title}'


class ProductSpecification(models.Model):
    class ValueType(models.TextChoices):
        TEXT = 'text', _('Текст')
        NUMBER = 'number', _('Число')
        BOOLEAN = 'boolean', _('Логическое')

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specifications', verbose_name=_('товар'))
    group = models.CharField(_('группа'), max_length=80, blank=True)
    name = models.CharField(_('название'), max_length=120)
    value = models.CharField(_('значение'), max_length=255)
    unit = models.CharField(_('единица измерения'), max_length=32, blank=True)
    value_type = models.CharField(_('тип значения'), max_length=16, choices=ValueType.choices, default=ValueType.TEXT)
    is_highlight = models.BooleanField(_('показывать как ключевую'), default=False)
    sort_order = models.PositiveIntegerField(_('порядок сортировки'), default=0)

    class Meta:
        ordering = ('sort_order', 'id')
        verbose_name = _('характеристика товара')
        verbose_name_plural = _('характеристики товара')

    def __str__(self):
        return f'{self.product.name} - {self.name}'
