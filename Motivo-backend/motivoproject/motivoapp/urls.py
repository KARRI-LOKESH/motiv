# urls.py
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, CartItemViewSet,
    WishlistViewSet, OrderViewSet, UserProfileViewSet,
    signup, login_request, verify_otp, create_payment_intent
)
from django.urls import path

# DRF router for viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'wishlist-items', WishlistViewSet, basename='wishlist')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    # Auth endpoints
    path('auth/signup/', signup),
    path('auth/login/', login_request),
    path('auth/verify-otp/', verify_otp),

    # Stripe payment endpoint
    path('orders/create-payment-intent/', create_payment_intent, name='create-payment-intent'),
    
]

# Include router URLs
urlpatterns += router.urls
