from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem, PromoCode


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.CharField(source='product.slug', read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'product_id',
            'product_slug',
            'product_name',
            'product_sku',
            'unit_price',
            'unit_old_price',
            'quantity',
            'line_total',
            'currency',
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    promo_code = serializers.CharField(source='promo_code_snapshot', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'number',
            'status',
            'payment_status',
            'delivery_method',
            'customer_name',
            'customer_email',
            'customer_phone',
            'delivery_city',
            'delivery_address',
            'comment',
            'promo_code',
            'promo_discount_total',
            'subtotal',
            'discount_total',
            'total',
            'currency',
            'items',
            'created_at',
            'updated_at',
        )


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, allow_empty=False)
    promo_code = serializers.CharField(required=False, allow_blank=True, max_length=32)

    class Meta:
        model = Order
        fields = (
            'delivery_method',
            'customer_name',
            'customer_email',
            'customer_phone',
            'delivery_city',
            'delivery_address',
            'comment',
            'promo_code',
            'items',
        )

    def validate_items(self, value):
        product_ids = [item['product_id'] for item in value]
        if len(product_ids) != len(set(product_ids)):
            raise serializers.ValidationError('Each product can only appear once in the order.')
        return value

    def validate(self, attrs):
        delivery_method = attrs.get('delivery_method', Order.DeliveryMethod.COURIER)
        if delivery_method == Order.DeliveryMethod.COURIER and not attrs.get('delivery_address'):
            raise serializers.ValidationError({'delivery_address': 'Delivery address is required for courier orders.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        items_data = validated_data.pop('items')
        promo_code_value = validated_data.pop('promo_code', '').strip().upper()
        user = request.user if request and request.user.is_authenticated else None

        product_map = {
            product.id: product
            for product in Product.objects.select_for_update().filter(
                id__in=[item['product_id'] for item in items_data],
                is_active=True,
            )
        }

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

            order_items.append(
                {
                    'product': product,
                    'product_name': product.name,
                    'product_sku': product.sku,
                    'unit_price': unit_price,
                    'unit_old_price': unit_old_price,
                    'quantity': quantity,
                    'line_total': line_total,
                    'currency': product.currency,
                }
            )

        promo = None
        promo_discount_total = Decimal('0.00')

        if promo_code_value:
            try:
                promo = PromoCode.objects.select_for_update().get(code=promo_code_value)
            except PromoCode.DoesNotExist as exc:
                raise serializers.ValidationError({'promo_code': 'Promo code was not found.'}) from exc

            if not promo.is_available():
                raise serializers.ValidationError({'promo_code': 'Promo code is inactive or unavailable.'})

            promo_discount_total = promo.calculate_discount_amount(subtotal)

        discount_total = product_discount_total + promo_discount_total
        total = subtotal - promo_discount_total

        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            discount_total=discount_total,
            total=total,
            promo_code=promo,
            promo_code_snapshot=promo.code if promo else '',
            promo_discount_total=promo_discount_total,
            currency=currency or 'KGS',
            **validated_data,
        )

        if promo:
            promo.used_count += 1
            promo.save(update_fields=['used_count', 'updated_at'])

        for item in order_items:
            product = item['product']
            OrderItem.objects.create(order=order, **item)
            product.quantity_in_stock -= item['quantity']
            if product.quantity_in_stock == 0:
                product.availability_status = Product.AvailabilityStatus.OUT_OF_STOCK
            elif product.quantity_in_stock <= 5:
                product.availability_status = Product.AvailabilityStatus.LOW_STOCK
            else:
                product.availability_status = Product.AvailabilityStatus.IN_STOCK
            product.save(update_fields=['quantity_in_stock', 'availability_status', 'updated_at'])

        return order
