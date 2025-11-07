
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Evento, Ingresso
from .serializers import EventoSerializer, IngressoSerializer

@api_view(['GET', 'POST'])
def eventos_list_create(request):

    if request.method == 'GET':
        eventos = Evento.objects.all().order_by('data')
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = EventoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'PUT', 'DELETE'])
def evento_detail(request, pk):
    evento = get_object_or_404(Evento, pk=pk)

    if request.method == 'GET':
        serializer = EventoSerializer(evento)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = EventoSerializer(evento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        evento.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def meus_ingressos(request):
 
    username = None
    if request.user and request.user.is_authenticated:
        username = request.user.username
  
    if not username:
        username = request.GET.get('username')

    if not username:
        return Response({"detail": "Informe o username (logado ou ?username=)."}, status=400)

    ingressos = Ingresso.objects.filter(comprador_nome=username)
    serializer = IngressoSerializer(ingressos, many=True)
    return Response(serializer.data)
