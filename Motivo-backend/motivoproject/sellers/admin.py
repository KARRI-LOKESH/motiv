from django.contrib import admin
from django.utils.html import format_html
from .models import Seller

class SellerAdmin(admin.ModelAdmin):
    list_display = ('user', 'shop_name', 'phone_number', 'website', 'created_at', 'profile_image_preview')
    search_fields = ('user__username', 'shop_name', 'user__email', 'phone_number', 'website')
    readonly_fields = ('created_at', 'updated_at', 'profile_image_preview')
    list_filter = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('user', 'shop_name', 'phone_number', 'address', 'website', 'bio', 'profile_image', 'profile_image_preview')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="80" style="object-fit: cover; border-radius: 8px;" />', obj.profile_image.url)
        return "-"
    profile_image_preview.short_description = 'Profile Image'

admin.site.register(Seller, SellerAdmin)
