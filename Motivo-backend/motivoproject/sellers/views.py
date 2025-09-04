from rest_framework import generics, permissions
from .serializers import SellerSerializer
from .models import Seller
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from motivoapp.models import Product
from django.db.models import Sum, F
from motivoapp.models import Order, OrderItem
from rest_framework.views import APIView
from motivoapp.serializers import ProductSerializer, OrderSerializer
from django.db import transaction
class SellerSignupView(generics.CreateAPIView):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    permission_classes = [permissions.AllowAny]  # Public signup


class SellerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = SellerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        try:
            return user.seller_profile  # Related name from Seller model
        except Seller.DoesNotExist:
            # If profile doesn't exist, create one automatically
            with transaction.atomic():
                return Seller.objects.create(
                    user=user,
                    shop_name="",
                    phone_number="",
                    address="",
                    website="",
                    bio="",
                    profile_image=None
                )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_products(request):
    # Assuming Product.seller is a ForeignKey to User
    products = Product.objects.filter(seller=request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# sellers/views.py
class SellerOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller = request.user
        orders = Order.objects.filter(order_items__product__seller=seller).distinct()
        serializer = OrderSerializer(orders, many=True, context={"request": request})
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_dashboard_stats(request):
    seller = request.user

    # Total products listed by seller
    products_count = Product.objects.filter(seller=seller).count()

    # Total orders for seller products
    # Using OrderItem to get seller-specific product orders
    total_orders = OrderItem.objects.filter(product__seller=seller).count()

    # Total earnings
    total_earnings = OrderItem.objects.filter(product__seller=seller).aggregate(
        earnings=Sum(F('price_at_purchase') * F('quantity'))
    )['earnings'] or 0

    return Response({
        "products_listed": products_count,
        "total_orders": total_orders,
        "total_earnings": total_earnings
    })

