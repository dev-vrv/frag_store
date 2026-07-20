from django.contrib import admin

from .models import (
    Brand,
    Product,
    ProductCategory,
    ProductColorOption,
    ProductFeature,
    ProductMedia,
    ProductSpecification,
    ProductStockSubscription,
    ProductTechnicalDetails,
)


@admin.register(ProductStockSubscription)
class ProductStockSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'locale', 'status', 'created_at', 'notified_at')
    list_filter = ('status', 'locale', 'created_at')
    search_fields = ('product__name', 'product__sku', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'notified_at')
    autocomplete_fields = ('product', 'user')


class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 0
    fields = ('media_type', 'file', 'external_url', 'alt_text', 'is_primary', 'sort_order')
    verbose_name = 'Медиафайл'
    verbose_name_plural = 'Медиафайлы'
    classes = ('collapse',)


class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 0
    fields = ('title', 'description', 'sort_order')
    verbose_name = 'Особенность'
    verbose_name_plural = 'Особенности'
    classes = ('collapse',)


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 0
    fields = ('group', 'name', 'value', 'unit', 'value_type', 'is_highlight', 'sort_order')
    verbose_name = 'Характеристика'
    verbose_name_plural = 'Характеристики'
    classes = ('collapse',)


class ProductColorOptionInline(admin.TabularInline):
    model = ProductColorOption
    extra = 0
    fields = ('name', 'hex_code', 'sort_order', 'is_active')
    verbose_name = 'Цвет'
    verbose_name_plural = 'Цвета'


class ProductTechnicalDetailsInline(admin.StackedInline):
    model = ProductTechnicalDetails
    extra = 1
    max_num = 1
    can_delete = False
    show_change_link = True
    verbose_name = 'Технический профиль'
    verbose_name_plural = 'Технический профиль'
    fields = (
        ('form_factor', 'connectivity'),
        ('compatibility', 'software_support'),
        ('battery_life_hours', 'cable_length_m'),
        ('sensor_model', 'dpi'),
        ('polling_rate_hz', 'response_time_ms'),
        ('switch_type', 'programmable_buttons'),
        ('keyboard_layout', 'key_count'),
        ('switch_profile', 'hot_swap'),
        ('backlight', 'driver_size_mm'),
        ('microphone', 'surround_sound'),
        ('frequency_response', 'impedance_ohm'),
        ('sensitivity_db', 'surface_type'),
        ('pad_size', 'thickness_mm'),
        ('stitched_edges', 'base_material'),
        ('panel_type', 'resolution'),
        ('refresh_rate_hz', 'brightness_nits'),
        ('contrast_ratio', 'material'),
        ('extra_notes',),
    )
    classes = ('collapse',)


@admin.register(ProductTechnicalDetails)
class ProductTechnicalDetailsAdmin(admin.ModelAdmin):
    list_display = ('product', 'product_category', 'connectivity', 'dpi', 'polling_rate_hz', 'refresh_rate_hz')
    list_filter = ('product__category', 'product__brand')
    search_fields = ('product__name', 'product__sku', 'sensor_model', 'switch_type', 'panel_type')
    autocomplete_fields = ('product',)
    fieldsets = (
        (
            'Общее',
            {
                'fields': (
                    'product',
                    ('form_factor', 'connectivity'),
                    ('compatibility', 'software_support'),
                    ('battery_life_hours', 'cable_length_m'),
                    ('material', 'extra_notes'),
                )
            },
        ),
        (
            'Мыши',
            {
                'classes': ('collapse',),
                'fields': (
                    ('sensor_model', 'dpi'),
                    ('polling_rate_hz', 'response_time_ms'),
                    ('switch_type', 'programmable_buttons'),
                ),
            },
        ),
        (
            'Клавиатуры',
            {
                'classes': ('collapse',),
                'fields': (
                    ('keyboard_layout', 'key_count'),
                    ('switch_profile', 'backlight'),
                    ('hot_swap',),
                ),
            },
        ),
        (
            'Гарнитуры',
            {
                'classes': ('collapse',),
                'fields': (
                    ('driver_size_mm', 'microphone'),
                    ('surround_sound', 'frequency_response'),
                    ('impedance_ohm', 'sensitivity_db'),
                ),
            },
        ),
        (
            'Коврики',
            {
                'classes': ('collapse',),
                'fields': (
                    ('surface_type', 'pad_size'),
                    ('thickness_mm', 'base_material'),
                    ('stitched_edges',),
                ),
            },
        ),
        (
            'Мониторы',
            {
                'classes': ('collapse',),
                'fields': (
                    ('panel_type', 'resolution'),
                    ('refresh_rate_hz', 'brightness_nits'),
                    ('contrast_ratio',),
                ),
            },
        ),
    )

    @admin.display(description='Категория')
    def product_category(self, obj):
        return obj.product.category


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'website', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'country', 'website')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'device_type', 'sort_order', 'is_active', 'updated_at')
    list_filter = ('device_type', 'is_active')
    search_fields = ('name', 'description')
    list_editable = ('sort_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'sku',
        'category',
        'brand',
        'price',
        'old_price',
        'quantity_in_stock',
        'availability_status',
        'is_best_seller',
        'is_featured',
        'is_new_arrival',
        'is_active',
    )
    list_filter = (
        'category',
        'brand',
        'availability_status',
        'is_best_seller',
        'is_featured',
        'is_new_arrival',
        'is_active',
    )
    search_fields = ('name', 'sku', 'short_description', 'description')
    list_editable = ('price', 'old_price', 'quantity_in_stock', 'availability_status', 'is_best_seller', 'is_featured', 'is_new_arrival', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = (
        ProductTechnicalDetailsInline,
        ProductColorOptionInline,
        ProductMediaInline,
        ProductFeatureInline,
        ProductSpecificationInline,
    )
    fieldsets = (
        (
            'Основное',
            {
                'fields': (
                    'category',
                    'brand',
                    'name',
                    'slug',
                    'sku',
                    'short_description',
                    'description',
                )
            },
        ),
        (
            'Цена и склад',
            {
                'fields': (
                    'price',
                    'old_price',
                    'currency',
                    'quantity_in_stock',
                    'availability_status',
                    'warranty_months',
                )
            },
        ),
        (
            'Атрибуты',
            {
                'fields': (
                    'color',
                    'weight_grams',
                    'release_date',
                )
            },
        ),
        (
            'Отображение',
            {
                'fields': (
                    'is_active',
                    'is_featured',
                    'is_best_seller',
                    'is_new_arrival',
                )
            },
        ),
        (
            'SEO',
            {
                'fields': (
                    'meta_title',
                    'meta_description',
                )
            },
        ),
    )
