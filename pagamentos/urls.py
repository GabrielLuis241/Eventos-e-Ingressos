from django.urls import path
from .views import iniciar_pix, confirmar_pix

urlpatterns = [
    path('pix/', iniciar_pix, name='iniciar_pix'),
    path('pix/confirmar/', confirmar_pix, name='confirmar_pix'),
]
