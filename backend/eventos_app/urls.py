
from django.urls import path
from .views import eventos_list_create, evento_detail, meus_ingressos

urlpatterns = [
    path('', eventos_list_create, name='eventos_list_create'),  
    path('<int:pk>/', evento_detail, name='evento_detail'),     
    path('meus/', meus_ingressos, name='meus_ingressos'),      
]
