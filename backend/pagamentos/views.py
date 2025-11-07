from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from eventos_app.models import Evento, Ingresso
from .models import Pagamento
import uuid
from decimal import Decimal

PRECO_INGRESSO = Decimal('100.00')  

@api_view(['POST'])
def iniciar_pix(request):
    username = request.data.get('username')  
    evento_id = request.data.get('evento_id')
    quantidade = int(request.data.get('quantidade', 1))

    if not username or not evento_id:
        return Response({'detail': 'username e evento_id são obrigatórios.'}, status=400)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado.'}, status=404)

    try:
        evento = Evento.objects.get(id=evento_id)
    except Evento.DoesNotExist:
        return Response({'detail': 'Evento não encontrado.'}, status=404)

    if evento.ingressos_disponiveis < quantidade:
        return Response({'detail': 'Ingressos insuficientes.'}, status=400)

    codigo = str(uuid.uuid4())
    valor_total = PRECO_INGRESSO * quantidade

    pagamento = Pagamento.objects.create(
        usuario=user,
        evento=evento,
        quantidade=quantidade,
        valor_total=valor_total,
        metodo='pix',
        status='pendente',
        codigo_pix=codigo
    )

    return Response({
        'pagamento_id': pagamento.id,
        'status': pagamento.status,
        'codigo_pix': pagamento.codigo_pix,
        'valor_total': str(pagamento.valor_total)
    }, status=201)

@api_view(['POST'])
def confirmar_pix(request):
    pagamento_id = request.data.get('pagamento_id')
    if not pagamento_id:
        return Response({'detail': 'pagamento_id é obrigatório.'}, status=400)

    try:
        pagamento = Pagamento.objects.get(id=pagamento_id, metodo='pix')
    except Pagamento.DoesNotExist:
        return Response({'detail': 'Pagamento não encontrado.'}, status=404)

    if pagamento.status != 'pendente':
        return Response({'detail': 'Este pagamento já foi confirmado ou não está pendente.'}, status=400)

    evento = pagamento.evento

    if evento.ingressos_disponiveis < pagamento.quantidade:
        return Response({'detail': 'Ingressos insuficientes no momento da confirmação.'}, status=400)

    pagamento.status = 'aprovado'
    pagamento.save()

    evento.ingressos_disponiveis -= pagamento.quantidade
    evento.save()

    qr = str(uuid.uuid4())
    Ingresso.objects.create(
        evento=evento,
        quantidade=pagamento.quantidade,
        comprador_nome=pagamento.usuario.username,
        qr_code=qr
    )

    return Response({
        'pagamento_id': pagamento.id,
        'status': pagamento.status,
        'qr_code': qr
    })
