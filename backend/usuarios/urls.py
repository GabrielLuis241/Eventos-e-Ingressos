from django.urls import path
from .views import registrar, perfil

urlpatterns = [
    path('registrar/', registrar, name='registrar_usuario'),
    path('perfil/', perfil, name='perfil_usuario'),
]
