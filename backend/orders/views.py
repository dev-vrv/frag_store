from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    lookup_field = 'number'

    def get_queryset(self):
        queryset = Order.objects.prefetch_related('items__product').order_by('-created_at')

        if self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)

        return queryset.none()

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        response_serializer = OrderSerializer(order, context=self.get_serializer_context())
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
