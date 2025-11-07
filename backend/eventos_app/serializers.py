
from rest_framework import serializers
from .models import Evento, Ingresso

# Serializer simples para transformar o modelo em JSON e vice-versa
class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'

class IngressoSerializer(serializers.ModelSerializer):
    evento_nome = serializers.CharField(source='evento.nome', read_only=True)

    class Meta:
        model = Ingresso
        fields = ('id', 'evento', 'evento_nome', 'quantidade', 'comprador_nome', 'qr_code')
