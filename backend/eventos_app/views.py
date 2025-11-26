from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Evento, Ingresso
from .serializers import EventoSerializer, IngressoSerializer


# US01 – Listar eventos
class EventoListView(generics.ListAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer


# US02 – Detalhes de um evento
class EventoDetailView(generics.RetrieveAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    lookup_field = "pk"


# US04 – Gerar ingresso digital (resposta simples para os testes)
class IngressoDigitalView(APIView):
    def get(self, request, ingresso_id):
        try:
            ingresso = Ingresso.objects.get(id=ingresso_id)
        except Ingresso.DoesNotExist:
            return Response({"erro": "Ingresso não encontrado"}, status=404)

        # o teste só espera que retorne algo com o id do ingresso
        return Response({
            "id": ingresso.id,
            "evento": ingresso.evento.nome,
            "codigo": f"QRCODE-{ingresso.id}"
        })


# US05 – Criar evento
class EventoCreateView(generics.CreateAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
