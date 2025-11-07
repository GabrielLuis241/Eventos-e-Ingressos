
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rotas dos apps (mantendo /api/... para compatibilidade com o front)
    path('api/usuarios/', include('usuarios.urls')),
    path('api/eventos/', include('eventos_app.urls')),
    path('api/pagamentos/', include('pagamentos.urls')),
]
