from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from django.conf import settings
from .models import Seller

class SellerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    shop_name = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Seller
        fields = ['username', 'email', 'password', 'shop_name', 'phone_number', 'address', 'website', 'bio', 'profile_image']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        username = validated_data.pop('username', None)
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)

        with transaction.atomic():
            user = User.objects.create_user(username=username, email=email, password=password)
            seller = Seller.objects.create(user=user, **validated_data)
        return seller

    def update(self, instance, validated_data):
        instance.shop_name = validated_data.get('shop_name', instance.shop_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.website = validated_data.get('website', instance.website)
        instance.bio = validated_data.get('bio', instance.bio)
        if validated_data.get('profile_image') is not None:
            instance.profile_image = validated_data.get('profile_image')
        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = {
            'username': instance.user.username,
            'email': instance.user.email
        }
        # Provide full URL for profile_image
        if instance.profile_image:
            rep['profile_image'] = settings.MEDIA_URL + str(instance.profile_image)
        else:
            rep['profile_image'] = None
        return rep
