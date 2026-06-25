from django.contrib import admin

from .models import Order, OrderItem, PromoCode


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    verbose_name = 'Позиция заказа'
    verbose_name_plural = 'Позиции заказа'
    readonly_fields = (
        'product',
        'product_name',
        'product_sku',
        'selected_color_name',
        'selected_color_hex',
        'unit_price',
        'unit_old_price',
        'quantity',
        'line_total',
        'currency',
    )
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'number',
        'customer_name',
        'customer_phone',
        'status',
        'payment_status',
        'delivery_method',
        'promo_code_snapshot',
        'total',
        'currency',
        'created_at',
    )
    list_filter = ('status', 'payment_status', 'delivery_method', 'currency', 'created_at')
    search_fields = ('number', 'customer_name', 'customer_email', 'customer_phone')
    readonly_fields = (
        'number',
        'promo_code_snapshot',
        'promo_discount_total',
        'subtotal',
        'discount_total',
        'total',
        'currency',
        'created_at',
        'updated_at',
    )
    inlines = (OrderItemInline,)
    fieldsets = (
        (
            'Заказ',
            {
                'fields': (
                    'number',
                    'user',
                    'status',
                    'payment_status',
                    'delivery_method',
                )
            },
        ),
        (
            'Клиент',
            {
                'fields': (
                    'customer_name',
                    'customer_email',
                    'customer_phone',
                )
            },
        ),
        (
            'Скидки',
            {
                'fields': (
                    'promo_code',
                    'promo_code_snapshot',
                    'promo_discount_total',
                )
            },
        ),
        (
            'Доставка',
            {
                'fields': (
                    'delivery_city',
                    'delivery_address',
                    'comment',
                )
            },
        ),
        (
            'Итоги',
            {
                'fields': (
                    'subtotal',
                    'discount_total',
                    'total',
                    'currency',
                )
            },
        ),
        (
            'Даты',
            {
                'fields': (
                    'created_at',
                    'updated_at',
                )
            },
        ),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'selected_color_name', 'product_sku', 'quantity', 'unit_price', 'line_total')
    list_filter = ('currency', 'created_at')
    search_fields = ('order__number', 'product_name', 'product_sku')


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'title',
        'discount_type',
        'discount_value',
        'is_active',
        'usage_limit',
        'used_count',
        'used_by',
        'used_at',
        'starts_at',
        'ends_at',
    )
    list_filter = ('discount_type', 'is_active', 'starts_at', 'ends_at')
    search_fields = ('code', 'title', 'description')
    readonly_fields = ('used_count', 'used_by', 'used_by_email', 'used_at', 'created_at', 'updated_at')
    fieldsets = (
        (
            'Промокод',
            {
                'fields': (
                    'code',
                    'title',
                    'description',
                    'discount_type',
                    'discount_value',
                    'is_active',
                )
            },
        ),
        (
            'Доступность',
            {
                'fields': (
                    'starts_at',
                    'ends_at',
                    'usage_limit',
                    'used_count',
                    'used_by',
                    'used_by_email',
                    'used_at',
                )
            },
        ),
        (
            'Даты',
            {
                'fields': (
                    'created_at',
                    'updated_at',
                )
            },
        ),
    )
