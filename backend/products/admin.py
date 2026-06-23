from django.contrib import admin

from .models import Brand, Product, ProductCategory, ProductFeature, ProductMedia, ProductSpecification


class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 1
    fields = ('media_type', 'file', 'external_url', 'alt_text', 'is_primary', 'sort_order')


class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1
    fields = ('title', 'description', 'sort_order')


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1
    fields = ('group', 'name', 'value', 'unit', 'value_type', 'is_highlight', 'sort_order')


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
            'Core',
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
            'Pricing and stock',
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
            'Attributes',
            {
                'fields': (
                    'color',
                    'weight_grams',
                    'release_date',
                )
            },
        ),
        (
            'Display flags',
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


@admin.register(ProductMedia)
class ProductMediaAdmin(admin.ModelAdmin):
    list_display = ('product', 'media_type', 'is_primary', 'sort_order', 'updated_at')
    list_filter = ('media_type', 'is_primary')
    search_fields = ('product__name', 'alt_text', 'external_url')


@admin.register(ProductFeature)
class ProductFeatureAdmin(admin.ModelAdmin):
    list_display = ('product', 'title', 'sort_order')
    list_filter = ('product__category',)
    search_fields = ('product__name', 'title', 'description')


@admin.register(ProductSpecification)
class ProductSpecificationAdmin(admin.ModelAdmin):
    list_display = ('product', 'group', 'name', 'value', 'unit', 'is_highlight', 'sort_order')
    list_filter = ('value_type', 'is_highlight', 'product__category')
    search_fields = ('product__name', 'group', 'name', 'value')
