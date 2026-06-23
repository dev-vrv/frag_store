from rest_framework import serializers

from .models import Brand, Product, ProductCategory, ProductFeature, ProductMedia, ProductSpecification


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


class ProductListSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    primary_media = serializers.SerializerMethodField()
    has_discount = serializers.BooleanField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)

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
            'category',
            'brand',
            'primary_media',
        )

    def get_primary_media(self, obj):
        media = next((item for item in obj.media_items.all() if item.is_primary), None)
        if not media:
            media = obj.media_items.first()
        if not media:
            return None
        return ProductMediaSerializer(media, context=self.context).data


class ProductDetailSerializer(ProductListSerializer):
    media_items = ProductMediaSerializer(many=True, read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + (
            'description',
            'warranty_months',
            'color',
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
