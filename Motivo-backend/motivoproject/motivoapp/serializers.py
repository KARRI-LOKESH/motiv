from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Category, Product, CartItem, WishlistItem, Order, OrderItem
)
from django.contrib.auth.password_validation import validate_password
from .models import Payment
# User Serializer (basic info)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email",]

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "fname",
            "lname",
            "phone",
            "address",
            "city",
            "zip_code",
            "email",
            "profile_image",
        ]

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image and hasattr(obj.profile_image, "url"):
            return request.build_absolute_uri(obj.profile_image.url)
        return None
# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']
    
    def get_product_count(self, obj):
        return obj.products.count()  # ✅ Only products related to this category


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    discount_percentage = serializers.ReadOnlyField()

    # ✅ Add this to return full image URL
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'seller',
            'category',
            'category_id',
            'name',
            'slug',
            'description',
            'price',
            'original_price',
            'discount_percentage',
            'image',
            'rating',
            'review_count',
            'age_range',
            'is_new',
            'is_sale',
            'location',
            'created_at',
        ]
        read_only_fields = [
            'slug',
            'discount_percentage',
            'created_at',
            'rating',
            'review_count'
        ]

    def get_image(self, obj):
        request = self.context.get("request", None)  # safe default
        if obj.image and hasattr(obj.image, "url"):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url  # fallback (relative path)
        return None


# CartItem Serializer
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',   # Maps 'product_id' from input to 'product' field
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']  # Already mapped from 'product_id'
        quantity = validated_data.get('quantity', 1)

        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return cart_item  # Return the CartItem instance directly

# WishlistItem Serializer
class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id']

# OrderItem Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_at_purchase']
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'payment_method', 'payment_status', 'transaction_id', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    payment = PaymentSerializer(read_only=True)  # ✅ add this
    customer = UserSerializer(source='user', read_only=True)  

    class Meta:
        model = Order
        fields = [
            'id', 'total_price', 'status', 'created_at',
            'order_items', 'payment','customer'  # ✅ include payment
        ]

    def get_total_price(self, obj):
        return sum([item.price_at_purchase * item.quantity for item in obj.order_items.all()])

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'confirm_password', 'phone', 'location')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            username=validated_data['email'],  # use email as username
        )
        user.set_password(validated_data['password'])
        user.save()

        # Optional: Save phone and location if you have a UserProfile model
        # phone = validated_data.get('phone')
        # location = validated_data.get('location')
        # if phone or location:
        #     UserProfile.objects.create(user=user, phone=phone, location=location)

        return user

