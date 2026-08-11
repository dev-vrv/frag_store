from decimal import Decimal

from django.conf import settings
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
        previous_quantity = None
        if self.pk:
            previous_quantity = Product.objects.filter(pk=self.pk).values_list('quantity_in_stock', flat=True).first()
        if not self.slug:
            self.slug = self._generate_unique_slug(self.name, Brand)
        super().save(*args, **kwargs)
        if previous_quantity is not None and previous_quantity <= 0 < self.quantity_in_stock:
            from .services import create_stock_arrival_notifications
            create_stock_arrival_notifications(self.pk)

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
        CHAIR = 'chair', _('Игровое кресло')
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
        previous_quantity = None
        if self.pk:
            previous_quantity = (
                Product.objects.filter(pk=self.pk)
                .values_list('quantity_in_stock', flat=True)
                .first()
            )

        if not self.slug:
            self.slug = Brand._generate_unique_slug(self.name, Product)
        self.full_clean()
        super().save(*args, **kwargs)

        if previous_quantity is not None and previous_quantity <= 0 < self.quantity_in_stock:
            from .services import create_stock_arrival_notifications

            create_stock_arrival_notifications(self.pk)

    @property
    def active_color_options(self):
        return self.color_options.filter(is_active=True).order_by('sort_order', 'id')

    @property
    def technical_highlights(self):
        details = getattr(self, 'technical_details', None)
        if not details:
            return []
        return details.get_highlights()


class ProductStockSubscription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Активна')
        NOTIFIED = 'notified', _('Уведомлен')
        CANCELLED = 'cancelled', _('Отменена')

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_subscriptions', verbose_name=_('товар'))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='stock_subscriptions', verbose_name=_('пользователь'))
    locale = models.CharField(_('язык'), max_length=2, default='ru')
    status = models.CharField(_('статус'), max_length=16, choices=Status.choices, default=Status.ACTIVE)
    notified_at = models.DateTimeField(_('уведомлен'), blank=True, null=True)
    created_at = models.DateTimeField(_('создано'), auto_now_add=True)
    updated_at = models.DateTimeField(_('обновлено'), auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name = _('подписка на поступление')
        verbose_name_plural = _('подписки на поступление')
        constraints = [models.UniqueConstraint(fields=('product', 'user'), name='unique_product_stock_subscription')]

    def __str__(self):
        return f'{self.user.email}: {self.product.name}'


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


class ProductTechnicalDetails(models.Model):
    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name='technical_details',
        verbose_name=_('товар'),
    )

    form_factor = models.CharField(_('форм-фактор'), max_length=120, blank=True)
    connectivity = models.CharField(_('подключение'), max_length=120, blank=True)
    compatibility = models.CharField(_('совместимость'), max_length=160, blank=True)
    software_support = models.CharField(_('ПО / драйверы'), max_length=160, blank=True)
    battery_life_hours = models.PositiveIntegerField(_('автономность, ч'), blank=True, null=True)
    cable_length_m = models.DecimalField(_('длина кабеля, м'), max_digits=4, decimal_places=2, blank=True, null=True)

    sensor_model = models.CharField(_('сенсор'), max_length=120, blank=True)
    dpi = models.PositiveIntegerField(_('DPI'), blank=True, null=True)
    polling_rate_hz = models.PositiveIntegerField(_('polling rate, Гц'), blank=True, null=True)
    response_time_ms = models.DecimalField(_('время отклика, мс'), max_digits=5, decimal_places=2, blank=True, null=True)
    switch_type = models.CharField(_('тип переключателей'), max_length=120, blank=True)
    programmable_buttons = models.PositiveIntegerField(_('программируемые кнопки'), blank=True, null=True)

    keyboard_layout = models.CharField(_('раскладка / формат'), max_length=120, blank=True)
    key_count = models.PositiveIntegerField(_('количество клавиш'), blank=True, null=True)
    switch_profile = models.CharField(_('профиль свитчей'), max_length=120, blank=True)
    hot_swap = models.BooleanField(_('hot-swap'), default=False)
    backlight = models.CharField(_('подсветка'), max_length=120, blank=True)

    driver_size_mm = models.PositiveIntegerField(_('диаметр драйверов, мм'), blank=True, null=True)
    microphone = models.CharField(_('микрофон'), max_length=120, blank=True)
    surround_sound = models.CharField(_('звук / surround'), max_length=120, blank=True)
    frequency_response = models.CharField(_('частотный диапазон'), max_length=120, blank=True)
    impedance_ohm = models.PositiveIntegerField(_('сопротивление, Ом'), blank=True, null=True)
    sensitivity_db = models.PositiveIntegerField(_('чувствительность, дБ'), blank=True, null=True)

    surface_type = models.CharField(_('тип поверхности'), max_length=120, blank=True)
    pad_size = models.CharField(_('размер коврика'), max_length=120, blank=True)
    thickness_mm = models.DecimalField(_('толщина, мм'), max_digits=4, decimal_places=1, blank=True, null=True)
    stitched_edges = models.BooleanField(_('прошитые края'), default=False)
    base_material = models.CharField(_('основание'), max_length=120, blank=True)

    panel_type = models.CharField(_('тип матрицы'), max_length=120, blank=True)
    resolution = models.CharField(_('разрешение'), max_length=120, blank=True)
    refresh_rate_hz = models.PositiveIntegerField(_('частота обновления, Гц'), blank=True, null=True)
    brightness_nits = models.PositiveIntegerField(_('яркость, нит'), blank=True, null=True)
    contrast_ratio = models.CharField(_('контрастность'), max_length=120, blank=True)

    material = models.CharField(_('материал'), max_length=120, blank=True)
    extra_notes = models.CharField(_('дополнительно'), max_length=255, blank=True)

    class Meta:
        verbose_name = _('технический профиль товара')
        verbose_name_plural = _('технические профили товаров')

    def __str__(self):
        return f'{self.product.name} - tech'

    def get_highlights(self):
        category_type = self.product.category.device_type
        highlight_map = {
            ProductCategory.DeviceType.MOUSE: (
                ('DPI', self.dpi, ''),
                ('Сенсор', self.sensor_model, ''),
                ('Отклик', self.response_time_ms, ' мс'),
                ('Polling', self.polling_rate_hz, ' Гц'),
            ),
            ProductCategory.DeviceType.KEYBOARD: (
                ('Формат', self.keyboard_layout, ''),
                ('Свитчи', self.switch_type or self.switch_profile, ''),
                ('Polling', self.polling_rate_hz, ' Гц'),
                ('Hot-swap', 'Да' if self.hot_swap else '', ''),
            ),
            ProductCategory.DeviceType.HEADSET: (
                ('Драйверы', self.driver_size_mm, ' мм'),
                ('Микрофон', self.microphone, ''),
                ('Звук', self.surround_sound, ''),
                ('Диапазон', self.frequency_response, ''),
            ),
            ProductCategory.DeviceType.MOUSEPAD: (
                ('Поверхность', self.surface_type, ''),
                ('Размер', self.pad_size, ''),
                ('Толщина', self.thickness_mm, ' мм'),
                ('Основание', self.base_material, ''),
            ),
            ProductCategory.DeviceType.MONITOR: (
                ('Матрица', self.panel_type, ''),
                ('Разрешение', self.resolution, ''),
                ('Герцовка', self.refresh_rate_hz, ' Гц'),
                ('Отклик', self.response_time_ms, ' мс'),
            ),
        }
        generic_highlights = (
            ('Подключение', self.connectivity, ''),
            ('Форм-фактор', self.form_factor, ''),
            ('Автономность', self.battery_life_hours, ' ч'),
            ('Материал', self.material, ''),
        )

        source = highlight_map.get(category_type, generic_highlights)
        highlights = []

        for label, value, suffix in source:
            if value in (None, '', False):
                continue
            highlights.append({'label': label, 'value': f'{value}{suffix}'})

        if highlights:
            return highlights[:4]

        for label, value, suffix in generic_highlights:
            if value in (None, '', False):
                continue
            highlights.append({'label': label, 'value': f'{value}{suffix}'})

        return highlights[:4]
