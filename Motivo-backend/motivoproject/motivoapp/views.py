from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
import random
import uuid
from .models import Category, Product, CartItem, WishlistItem, Order, UserProfile, OTP,OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CartItemSerializer,
    WishlistItemSerializer, OrderSerializer, UserProfileSerializer
)
from datetime import datetime, timedelta
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import filters
import stripe # type: ignore
from .models import Payment
from django.conf import settings
from django.db.models import Q
# ------------------------
# Category API (Public)
# ------------------------
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

# ------------------------
# Product API (Public with category filter)
# ------------------------
class ProductViewSet(viewsets.ModelViewSet):  # changed from ReadOnly
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # only logged-in users can create
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category__name']

    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')

        if category_slug:
            queryset = queryset.filter(category__slug__iexact=category_slug)

        return queryset

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        product = self.get_object()
        related = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
        serializer = self.get_serializer(related, many=True, context={"request": request})
        return Response(serializer.data)

# ------------------------
# UserProfile API (Authenticated user)
# ------------------------
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = UserProfile.objects.filter(user=self.request.user)
        if not qs.exists():
            UserProfile.objects.create(user=self.request.user)
            qs = UserProfile.objects.filter(user=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
# ------------------------
# CartItem API (Authenticated user)
# ------------------------
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        # Validate product_id
        try:
            product_id = int(product_id)
        except:
            return Response({"error": "Invalid product_id"}, status=400)

        product = Product.objects.get(id=product_id)

        cart_item, created = CartItem.objects.get_or_create(user=user, product=product)
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        cart_item = self.get_object()
        quantity = int(request.data.get("quantity", cart_item.quantity))
        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)
# ------------------------
# WishlistItem API (Authenticated user)
# ------------------------
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return wishlist items of the logged-in user
        return WishlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
# ------------------------
# Orders API (Read-only for authenticated user)
# ------------------------

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        user = request.user
        items_data = request.data.get("items", [])

        if not items_data:
            return Response({"detail": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = 0
        order_items_to_create = []

        for item in items_data:
            try:
                product = Product.objects.get(id=item['product'])
            except Product.DoesNotExist:
                return Response({"detail": f"Product {item['product']} not found"}, status=400)

            quantity = int(item.get('quantity', 1))
            total_price += product.price * quantity
            order_items_to_create.append({
                "product": product,
                "quantity": quantity,
                "price_at_purchase": product.price
            })

        # Create order
        order = Order.objects.create(user=user, total_price=total_price)

        # Create OrderItems
        for oi in order_items_to_create:
            OrderItem.objects.create(
                order=order,
                product=oi["product"],
                quantity=oi["quantity"],
                price_at_purchase=oi["price_at_purchase"]
            )

        # Create Payment
        Payment.objects.create(
            order=order,
            amount=total_price,
            payment_method="pending",
            payment_status="Pending"
        )

        serializer = self.get_serializer(order, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
# ------------------------
# Signup with OTP
# ------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')

    if not email or not first_name:
        return Response({"error": "Email and First name required"}, status=status.HTTP_400_BAD_REQUEST)

    user, created = User.objects.get_or_create(username=email, email=email, defaults={
        "first_name": first_name, "last_name": last_name
    })
    if not created:
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # Generate OTP
    otp_code = str(random.randint(100000, 999999))
    OTP.objects.create(user=user, code=otp_code)

    send_mail(
        'Your OTP Code',
        f'Your OTP is {otp_code}',
        'karrilokesh108@gmail.com',  # replace with your email
        [email],
        fail_silently=False
    )

    return Response({"message": "User created. OTP sent to email."})

# ------------------------
# Login with OTP
# ------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_request(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Invalidate previous OTPs
    OTP.objects.filter(user=user, verified=True).update(verified=False)

    # Generate new OTP
    otp_code = str(random.randint(100000, 999999))
    OTP.objects.create(user=user, code=otp_code)

    send_mail(
        'Your OTP Code',
        f'Your OTP is {otp_code}',
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False
    )

    return Response({"message": "OTP sent to email. Please verify to login."})


# ------------------------
# Verify OTP
# ------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get('email')
    otp_input = request.data.get('otp')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    otp_obj = OTP.objects.filter(user=user, code=otp_input, verified=False).order_by('-created_at').first()
    if not otp_obj or not otp_obj.is_valid():
        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

    otp_obj.verified = True
    otp_obj.save()

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    response = Response({
        "access": access_token,
        "user": {
            "name": user.first_name,
            "email": user.email,
        }
    })

    # ✅ Correct: Set HTTP-only refresh token cookie (7 days)
    expires_at = datetime.utcnow() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]

    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=str(refresh),
        expires=expires_at,   # <-- proper datetime expiry
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
    )

    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Delete cookie on logout
    response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    return response
@api_view(["POST"])
def generate_payment_token(request):
    # You can also verify with UPI gateway in production
    token = str(uuid.uuid4())[:8]  # short unique token
    return Response({"status": "success", "token": token})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """
    Create a Stripe PaymentIntent for the given order
    Expects: { order_id: int }
    """
    order_id = request.data.get('order_id')
    if not order_id:
        return Response({"error": "Order ID is required"}, status=400)

    from .models import Order  # import your Order model
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    # Convert to integer cents for Stripe
    amount_cents = int(order.total_price * 100)

    intent = stripe.PaymentIntent.create(
        amount=amount_cents,
        currency='inr',
        metadata={'order_id': order.id},
    )

    return Response({
        'client_secret': intent.client_secret,
        'order_id': order.id,
    })