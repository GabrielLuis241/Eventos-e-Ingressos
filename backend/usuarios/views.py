
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import Perfil

# Cadastro simples: cria User + Perfil (tipo)
@api_view(['POST'])
def registrar(request):
    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')
    tipo = request.data.get('tipo', 'cliente')  # "cliente" ou "organizador"

    if not username or not password:
        return Response({'detail': 'username e password são obrigatórios.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Já existe um usuário com esse username.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    Perfil.objects.create(user=user, tipo=tipo)

    return Response({'id': user.id, 'username': user.username, 'email': user.email, 'tipo': tipo}, status=201)

# Login simples (sem JWT). Mantemos a rota /api/usuarios/login/
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'detail': 'Credenciais inválidas.'}, status=400)

    # Faz login de sessão padrão do Django (SessionAuthentication)
    login(request, user)

    # Retorna um token fake só para compatibilidade visual no front
    token_fake = 'token_' + username
    tipo = getattr(getattr(user, 'perfil', None), 'tipo', 'cliente')
    return Response({'message': 'Login realizado!', 'token': token_fake, 'username': username, 'tipo': tipo})

# Perfil simples do usuário logado (ou ?username=alice)
@api_view(['GET'])
def perfil(request):
    user = request.user if request.user.is_authenticated else None
    if not user:
        # Permite ?username= para facilitar testes
        uname = request.GET.get('username')
        if uname:
            try:
                user = User.objects.get(username=uname)
            except User.DoesNotExist:
                return Response({'detail': 'Usuário não encontrado.'}, status=404)

    if not user:
        return Response({'detail': 'Não autenticado.'}, status=401)

    tipo = getattr(getattr(user, 'perfil', None), 'tipo', 'cliente')
    return Response({'id': user.id, 'username': user.username, 'email': user.email, 'tipo': tipo})
