
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/usuarios/', include('usuarios.urls')),
    path('api/eventos/', include('eventos_app.urls')),
    path('api/pagamentos/', include('pagamentos.urls')),
]

