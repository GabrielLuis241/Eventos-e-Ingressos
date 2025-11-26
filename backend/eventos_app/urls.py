from django.urls import path
from . import views

urlpatterns = [
    # US01 - listar eventos
    path('', views.EventoListView.as_view(), name='eventos-listar'),

    # US02 - detalhes de um evento
    path('<int:pk>/', views.EventoDetailView.as_view(), name='eventos-detalhes'),

    # US04 - ingresso digital
    path('ingressos/<int:ingresso_id>/digital/', views.IngressoDigitalView.as_view(), name='ingresso-digital'),

    # US05 - criar evento
    path('criar/', views.EventoCreateView.as_view(), name='eventos-criar'),
]
