from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BrandViewSet, ProductCategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register('brands', BrandViewSet, basename='product-brand')
router.register('categories', ProductCategoryViewSet, basename='product-category')
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
