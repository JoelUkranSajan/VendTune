from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from app.views import business, business_unit, vendor, service, zone_busyness_score
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app.views.estimate_busyness import get_busyness_scores
from app.views.recommend_location import get_recommendations
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


router = DefaultRouter()
router.register(prefix="business_units", viewset=business_unit.BusinessUnitView, basename='business_units')
router.register(prefix="vendors", viewset=vendor.VendorView, basename='vendors')
router.register(prefix="services", viewset=service.ServiceView, basename='services')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("signup/", business.RegisterBusinessView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="get_token"),
    path("login/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api-auth", include("rest_framework.urls")),
    path("api/", include(router.urls)),
    path('api/busyness_estimates/', get_busyness_scores, name='get_busyness_scores'),
    path('api/recommendations/', get_recommendations, name='get_recommendations'),
    path('api/zones_busyness_scores/', zone_busyness_score.ZoneBusynessScoreView.as_view(), name='zones_busyness_scores'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
