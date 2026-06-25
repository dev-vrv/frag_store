from rest_framework import serializers

from orders.services import build_order_preview


class CartItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    selected_color_id = serializers.IntegerField(required=False, allow_null=True)


class CartSummarySerializer(serializers.Serializer):
    items = CartItemInputSerializer(many=True, allow_empty=False)
    promo_code = serializers.CharField(required=False, allow_blank=True, max_length=32)

    def validate_items(self, value):
        keys = [(item['product_id'], item.get('selected_color_id')) for item in value]
        if len(keys) != len(set(keys)):
            raise serializers.ValidationError('Each cart item combination must be unique.')
        return value

    def to_representation(self, instance):
        return instance

    def create(self, validated_data):
        preview = build_order_preview(
            validated_data['items'],
            validated_data.get('promo_code', '').strip().upper(),
        )

        return {
            'items': [
                {
                    'product_id': item['product'].id,
                    'product_slug': item['product'].slug,
                    'product_name': item['product_name'],
                    'product_sku': item['product_sku'],
                    'selected_color_id': item.get('selected_color_id') or None,
                    'selected_color_name': item['selected_color_name'],
                    'selected_color_hex': item['selected_color_hex'],
                    'brand_name': item['product'].brand.name,
                    'category_name': item['product'].category.name,
                    'short_description': item['product'].short_description,
                    'quantity': item['quantity'],
                    'unit_price': item['unit_price'],
                    'unit_old_price': item['unit_old_price'],
                    'line_total': item['line_total'],
                    'currency': item['currency'],
                    'quantity_in_stock': item['product'].quantity_in_stock,
                    'primary_media': self._get_primary_media_url(item['product']),
                    'color_options': [
                        {
                            'id': color.id,
                            'name': color.name,
                            'hex_code': color.hex_code,
                        }
                        for color in item['product'].active_color_options
                    ],
                }
                for item in preview['items']
            ],
            'promo_code': preview['promo'].code if preview['promo'] else '',
            'subtotal': preview['subtotal'],
            'product_discount_total': preview['product_discount_total'],
            'promo_discount_total': preview['promo_discount_total'],
            'discount_total': preview['discount_total'],
            'total': preview['total'],
            'currency': preview['currency'],
            'items_count': len(preview['items']),
            'quantity_total': sum(item['quantity'] for item in preview['items']),
        }

    def _get_primary_media_url(self, product):
        media = next((item for item in product.media_items.all() if item.is_primary), None)
        if not media:
            media = product.media_items.first()
        if not media or not media.file:
            return None

        request = self.context.get('request')
        url = media.file.url
        return request.build_absolute_uri(url) if request else url
