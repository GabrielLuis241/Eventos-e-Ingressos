from django.urls import path
from .views import registrar, login_view, perfil

urlpatterns = [
    path('registrar/', registrar, name='registrar_usuario'),
    path('login/', login_view, name='login_usuario'),
    path('perfil/', perfil, name='perfil_usuario'),
]
