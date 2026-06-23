from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from .models import Brand, Product, ProductCategory
from .serializers import (
    BrandSerializer,
    ProductCategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class BrandViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = BrandSerializer
    permission_classes = (AllowAny,)
    lookup_field = 'slug'

    def get_queryset(self):
        return Brand.objects.filter(is_active=True).order_by('name')


class ProductCategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = ProductCategorySerializer
    permission_classes = (AllowAny,)
    lookup_field = 'slug'

    def get_queryset(self):
        return ProductCategory.objects.filter(is_active=True).order_by('sort_order', 'name')


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    lookup_field = 'slug'
    filterset_fields = ('availability_status',)
    search_fields = ('name', 'sku', 'short_description', 'description', 'brand__name', 'category__name')
    ordering_fields = ('price', 'created_at', 'name', 'quantity_in_stock')

    def get_queryset(self):
        queryset = (
            Product.objects.filter(is_active=True)
            .select_related('category', 'brand')
            .prefetch_related('media_items', 'features', 'specifications')
            .order_by('-is_best_seller', '-is_featured', 'name')
        )

        params = self.request.query_params
        category = params.get('category')
        brand = params.get('brand')
        featured = params.get('featured')
        best_seller = params.get('best_seller')
        new_arrival = params.get('new_arrival')
        discounted = params.get('discounted')
        min_price = params.get('min_price')
        max_price = params.get('max_price')
        in_stock = params.get('in_stock')

        if category:
            queryset = queryset.filter(category__slug=category)
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if best_seller == 'true':
            queryset = queryset.filter(is_best_seller=True)
        if new_arrival == 'true':
            queryset = queryset.filter(is_new_arrival=True)
        if discounted == 'true':
            queryset = queryset.filter(old_price__isnull=False)
        if in_stock == 'true':
            queryset = queryset.filter(quantity_in_stock__gt=0)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
