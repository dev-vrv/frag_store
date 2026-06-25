from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CartSummarySerializer


class CartSummaryAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = CartSummarySerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save())
