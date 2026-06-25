from django.urls import path

from .views import CartSummaryAPIView

urlpatterns = [
    path('summary', CartSummaryAPIView.as_view(), name='cart-summary-no-slash'),
    path('summary/', CartSummaryAPIView.as_view(), name='cart-summary'),
]
