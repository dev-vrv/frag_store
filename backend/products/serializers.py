from rest_framework import serializers

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


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = (
            'id',
            'name',
            'slug',
            'website',
            'country',
        )


class ProductCategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ProductCategory
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'device_type',
            'sort_order',
            'products_count',
        )


class ProductMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = ProductMedia
        fields = (
            'id',
            'media_type',
            'file',
            'external_url',
            'alt_text',
            'is_primary',
            'sort_order',
        )

    def get_file(self, obj):
        if not obj.file:
            return None

        request = self.context.get('request')
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = (
            'id',
            'title',
            'description',
            'sort_order',
        )


class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = (
            'id',
            'group',
            'name',
            'value',
            'unit',
            'value_type',
            'is_highlight',
            'sort_order',
        )


class ProductColorOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorOption
        fields = (
            'id',
            'name',
            'hex_code',
            'sort_order',
        )


class ProductTechnicalDetailsSerializer(serializers.ModelSerializer):
    highlights = serializers.SerializerMethodField()

    class Meta:
        model = ProductTechnicalDetails
        fields = (
            'form_factor',
            'connectivity',
            'compatibility',
            'software_support',
            'battery_life_hours',
            'cable_length_m',
            'sensor_model',
            'dpi',
            'polling_rate_hz',
            'response_time_ms',
            'switch_type',
            'programmable_buttons',
            'keyboard_layout',
            'key_count',
            'switch_profile',
            'hot_swap',
            'backlight',
            'driver_size_mm',
            'microphone',
            'surround_sound',
            'frequency_response',
            'impedance_ohm',
            'sensitivity_db',
            'surface_type',
            'pad_size',
            'thickness_mm',
            'stitched_edges',
            'base_material',
            'panel_type',
            'resolution',
            'refresh_rate_hz',
            'brightness_nits',
            'contrast_ratio',
            'material',
            'extra_notes',
            'highlights',
        )

    def get_highlights(self, obj):
        return obj.get_highlights()


class ProductListSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    primary_media = serializers.SerializerMethodField()
    color_options = serializers.SerializerMethodField()
    has_discount = serializers.BooleanField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)
    technical_details = ProductTechnicalDetailsSerializer(read_only=True)
    technical_highlights = serializers.ListField(read_only=True)
    media_items = ProductMediaSerializer(many=True, read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'sku',
            'short_description',
            'price',
            'old_price',
            'currency',
            'quantity_in_stock',
            'availability_status',
            'is_featured',
            'is_best_seller',
            'is_new_arrival',
            'has_discount',
            'discount_percent',
            'color',
            'color_options',
            'category',
            'brand',
            'primary_media',
            'media_items',
            'features',
            'specifications',
            'technical_details',
            'technical_highlights',
        )

    def get_primary_media(self, obj):
        media = next((item for item in obj.media_items.all() if item.is_primary), None)
        if not media:
            media = obj.media_items.first()
        if not media:
            return None
        return ProductMediaSerializer(media, context=self.context).data

    def get_color_options(self, obj):
        return ProductColorOptionSerializer(obj.active_color_options, many=True).data


class ProductDetailSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + (
            'description',
            'warranty_months',
            'weight_grams',
            'release_date',
            'meta_title',
            'meta_description',
            'media_items',
            'features',
            'specifications',
            'created_at',
            'updated_at',
        )


class ProductStockSubscriptionSerializer(serializers.ModelSerializer):
    locale = serializers.ChoiceField(choices=('ru', 'en', 'kg'), default='ru')

    class Meta:
        model = ProductStockSubscription
        fields = ('id', 'locale', 'status', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

    def create(self, validated_data):
        subscription, _ = ProductStockSubscription.objects.update_or_create(
            product=self.context['product'], user=self.context['request'].user,
            defaults={'locale': validated_data['locale'], 'status': ProductStockSubscription.Status.ACTIVE, 'notified_at': None},
        )
        return subscription
