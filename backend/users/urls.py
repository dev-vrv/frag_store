from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ContactMessageViewSet,
    CurrentUserAPIView,
    EmailVerificationConfirmAPIView,
    EmailVerificationRequestAPIView,
    LoginAPIView,
    RegisterAPIView,
)

router = DefaultRouter()
router.register('contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='user-register'),
    path('auth/login/', LoginAPIView.as_view(), name='user-login'),
    path('me/', CurrentUserAPIView.as_view(), name='user-me'),
    path('me/email-verification/request/', EmailVerificationRequestAPIView.as_view(), name='user-email-verification-request'),
    path('me/email-verification/confirm/', EmailVerificationConfirmAPIView.as_view(), name='user-email-verification-confirm'),
    path('', include(router.urls)),
]
