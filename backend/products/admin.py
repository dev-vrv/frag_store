from django.contrib import admin

from .models import Brand, Product, ProductCategory, ProductFeature, ProductMedia, ProductSpecification


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
    inlines = (ProductMediaInline, ProductFeatureInline, ProductSpecificationInline)
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
