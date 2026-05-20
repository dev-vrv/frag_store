from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BlogPostViewSet, ContactInfoViewSet

router = DefaultRouter()
router.register('blog-posts', BlogPostViewSet, basename='blog-post')
router.register('contact-info', ContactInfoViewSet, basename='contact-info')

urlpatterns = [
    path('', include(router.urls)),
]
