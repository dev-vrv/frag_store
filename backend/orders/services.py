from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem, PromoCode


def _get_product_map(items_data, *, for_update=False):
    queryset = (
        Product.objects.filter(
            id__in=[item['product_id'] for item in items_data],
            is_active=True,
        )
        .select_related('brand', 'category')
        .prefetch_related('media_items')
    )
    if for_update:
        queryset = queryset.select_for_update()

    return {product.id: product for product in queryset}


def _build_order_items(items_data, *, for_update=False):
    product_map = _get_product_map(items_data, for_update=for_update)
    missing_ids = [item['product_id'] for item in items_data if item['product_id'] not in product_map]
    if missing_ids:
        raise serializers.ValidationError({'items': f'Products not found or inactive: {missing_ids}'})

    subtotal = Decimal('0.00')
    product_discount_total = Decimal('0.00')
    currency = None
    order_items = []

    for item in items_data:
        product = product_map[item['product_id']]
        quantity = item['quantity']
        selected_color_id = item.get('selected_color_id')
        selected_color = None
        active_color_options = list(product.active_color_options)

        if product.quantity_in_stock < quantity:
            raise serializers.ValidationError({
                'items': f'Not enough stock for product "{product.name}". Available: {product.quantity_in_stock}.'
            })

        if currency is None:
            currency = product.currency
        elif currency != product.currency:
            raise serializers.ValidationError({'items': 'All products in the order must have the same currency.'})

        unit_price = product.price
        unit_old_price = product.old_price
        line_total = unit_price * quantity
        subtotal += line_total

        if unit_old_price:
            product_discount_total += (unit_old_price - unit_price) * quantity

        if active_color_options:
            if not selected_color_id:
                raise serializers.ValidationError({
                    'items': f'Color selection is required for product "{product.name}".'
                })

            selected_color = next(
                (color for color in active_color_options if color.id == selected_color_id),
                None,
            )
            if not selected_color:
                raise serializers.ValidationError({
                    'items': f'Invalid color selected for product "{product.name}".'
                })

        order_items.append(
            {
                'product': product,
                'selected_color_id': selected_color.id if selected_color else None,
                'product_name': product.name,
                'product_sku': product.sku,
                'selected_color_name': selected_color.name if selected_color else '',
                'selected_color_hex': selected_color.hex_code if selected_color else '',
                'unit_price': unit_price,
                'unit_old_price': unit_old_price,
                'quantity': quantity,
                'line_total': line_total,
                'currency': product.currency,
            }
        )

    return {
        'currency': currency or Product.Currency.KGS,
        'items': order_items,
        'product_discount_total': product_discount_total,
        'subtotal': subtotal,
    }


def _resolve_promo(promo_code_value, subtotal, *, for_update=False):
    if not promo_code_value:
        return None, Decimal('0.00')

    queryset = PromoCode.objects
    if for_update:
        queryset = queryset.select_for_update()

    try:
        promo = queryset.get(code=promo_code_value)
    except PromoCode.DoesNotExist as exc:
        raise serializers.ValidationError({'promo_code': 'Промокод не найден.'}) from exc

    if not promo.is_available():
        raise serializers.ValidationError({'promo_code': 'Промокод неактивен или уже использован.'})

    return promo, promo.calculate_discount_amount(subtotal)


def build_order_preview(items_data, promo_code_value=''):
    prepared = _build_order_items(items_data)
    promo, promo_discount_total = _resolve_promo(promo_code_value, prepared['subtotal'])
    discount_total = prepared['product_discount_total'] + promo_discount_total
    total = prepared['subtotal'] - promo_discount_total

    return {
        'currency': prepared['currency'],
        'items': prepared['items'],
        'subtotal': prepared['subtotal'],
        'product_discount_total': prepared['product_discount_total'],
        'promo': promo,
        'promo_discount_total': promo_discount_total,
        'discount_total': discount_total,
        'total': total,
    }


@transaction.atomic
def create_order_from_payload(*, user, order_data, items_data, promo_code_value=''):
    prepared = _build_order_items(items_data, for_update=True)
    promo, promo_discount_total = _resolve_promo(
        promo_code_value,
        prepared['subtotal'],
        for_update=True,
    )
    discount_total = prepared['product_discount_total'] + promo_discount_total
    total = prepared['subtotal'] - promo_discount_total

    order = Order.objects.create(
        user=user,
        subtotal=prepared['subtotal'],
        discount_total=discount_total,
        total=total,
        promo_code=promo,
        promo_code_snapshot=promo.code if promo else '',
        promo_discount_total=promo_discount_total,
        currency=prepared['currency'],
        **order_data,
    )

    if promo:
        promo.used_count += 1
        promo.used_by = user
        promo.used_by_email = order.customer_email
        promo.used_at = timezone.now()
        promo.is_active = False
        promo.save(
            update_fields=[
                'used_count',
                'used_by',
                'used_by_email',
                'used_at',
                'is_active',
                'updated_at',
            ]
        )

    for item in prepared['items']:
        product = item['product']
        order_item_data = {key: value for key, value in item.items() if key != 'selected_color_id'}
        OrderItem.objects.create(order=order, **order_item_data)
        product.quantity_in_stock -= item['quantity']
        if product.quantity_in_stock == 0:
            product.availability_status = Product.AvailabilityStatus.OUT_OF_STOCK
        elif product.quantity_in_stock <= 5:
            product.availability_status = Product.AvailabilityStatus.LOW_STOCK
        else:
            product.availability_status = Product.AvailabilityStatus.IN_STOCK
        product.save(update_fields=['quantity_in_stock', 'availability_status', 'updated_at'])

    return order
