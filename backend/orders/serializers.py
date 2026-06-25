from rest_framework import serializers

from .models import Order, OrderItem, PromoCode
from .services import create_order_from_payload


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    selected_color_id = serializers.IntegerField(required=False, allow_null=True)


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
            'selected_color_name',
            'selected_color_hex',
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
        keys = [(item['product_id'], item.get('selected_color_id')) for item in value]
        if len(keys) != len(set(keys)):
            raise serializers.ValidationError('Each order item combination must be unique.')
        return value

    def validate(self, attrs):
        delivery_method = attrs.get('delivery_method', Order.DeliveryMethod.COURIER)
        if delivery_method == Order.DeliveryMethod.COURIER and not attrs.get('delivery_address'):
            raise serializers.ValidationError({'delivery_address': 'Delivery address is required for courier orders.'})
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        items_data = validated_data.pop('items')
        promo_code_value = validated_data.pop('promo_code', '').strip().upper()
        user = request.user if request and request.user.is_authenticated else None
        return create_order_from_payload(
            user=user,
            order_data=validated_data,
            items_data=items_data,
            promo_code_value=promo_code_value,
        )
