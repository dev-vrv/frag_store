from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ContactMessageViewSet, CurrentUserAPIView, LoginAPIView, RegisterAPIView

router = DefaultRouter()
router.register('contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='user-register'),
    path('auth/login/', LoginAPIView.as_view(), name='user-login'),
    path('me/', CurrentUserAPIView.as_view(), name='user-me'),
    path('', include(router.urls)),
]
