from django.urls import path
from .views import SellerSignupView, SellerProfileView,SellerOrdersView
from django.conf import settings
from . import views
from .views import my_products, seller_dashboard_stats
from django.conf.urls.static import static
urlpatterns = [
    path('signup/', SellerSignupView.as_view(), name='seller-signup'),
    path("profile/", SellerProfileView.as_view(), name="seller-profile"),
    path("my-products/", my_products, name="seller-my-products"),
    path("my-orders/",SellerOrdersView.as_view(),name="my-orders"),
    path('dashboard-stats/', seller_dashboard_stats, name='seller-dashboard-stats'),


]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)