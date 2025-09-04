from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import uuid
from datetime import timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.contrib.auth import get_user_model
# Extend User with profile info (optional)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    fname = models.CharField(max_length=30, blank=True)
    lname = models.CharField(max_length=30, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} Profile"
    
User = get_user_model()


class Category(models.Model):
    CATEGORY_CHOICES = [
        ('Toys', 'Toys'),
        ('Kids Clothing', 'Kids Clothing'),
        ('Baby Care', 'Baby Care'),
        ('Sports', 'Sports'),
        ('Stationary', 'Stationary'),
        ('Arts & Crafts', 'Arts & Crafts'),
    ]

    name = models.CharField(max_length=100, unique=True, choices=CATEGORY_CHOICES)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        # auto-slugify
        if not self.slug:
            slug = slugify(self.name)
            while Category.objects.filter(slug=slug).exists():
                slug = f"{slug}-{uuid.uuid4().hex[:6]}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Product(models.Model):
    AGE_CHOICES = [
        ('0-2 years', '0-2 years'),
        ('3-5 years', '3-5 years'),
        ('6-8 years', '6-8 years'),
        ('9-12 years', '9-12 years'),
        ('13+ years', '13+ years'),
    ]

    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='products', null=True, blank=True
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products'
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='product_imgs/', blank=True, null=True)
    rating = models.FloatField(default=0)
    review_count = models.PositiveIntegerField(default=0)
    age_range = models.CharField(max_length=20, choices=AGE_CHOICES)
    is_new = models.BooleanField(default=False)
    is_sale = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # auto-slugify
        if not self.slug:
            slug = slugify(self.name)
            while Product.objects.filter(slug=slug).exists():
                slug = f"{slug}-{uuid.uuid4().hex[:6]}"
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def discount_percentage(self):
        if self.original_price and self.original_price > self.price:
            return round((self.original_price - self.price) / self.original_price * 100)
        return 0

    def __str__(self):
        return self.name
# CartItem model for user's cart with quantity (like CartSidebar)
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

# Wishlist item for user to track wished products (ProductCard wishlist toggle)
class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} wishes {self.product.name}"

# Order model to save user's placed orders (ProfilePage order history)
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    @property
    def total_items(self):
        return sum(item.quantity for item in self.order_items.all())

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

# Items inside an order
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity} (Order #{self.order.id})"

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)  # 6-digit OTP
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=5)  # OTP valid for 5 mins
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.code}"
class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=20, default='Pending')
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)