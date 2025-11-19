from django.contrib import admin
from .models import Evento


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'data', 'horario', 'local', 'ingressos_disponiveis')
    list_filter = ('data', 'local')
    search_fields = ('nome', 'local')
    ordering = ('data',)
