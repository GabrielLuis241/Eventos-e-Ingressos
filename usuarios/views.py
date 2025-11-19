from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import login as django_login
from .models import Perfil


@api_view(['POST'])
def registrar(request):
    """
    Cadastro de usuário usando e-mail como identificador principal.
    Aceita:
      - email (obrigatório)
      - password (obrigatório)
      - username (opcional, se não vier usamos o próprio e-mail)
      - tipo: "cliente" ou "organizador" (padrão = "cliente")
    """
    email = (request.data.get('email') or '').strip().lower()
    password = request.data.get('password')
    username = request.data.get('username') or email
    tipo = request.data.get('tipo', 'cliente')

    if not email or not password:
        return Response(
            {'detail': 'email e password são obrigatórios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'detail': 'Já existe um usuário com esse email.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Garante que o tipo seja válido dentro das choices do Perfil
    valid_types = dict(Perfil.USER_TYPES).keys()
    if tipo not in valid_types:
        tipo = 'cliente'

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )
    Perfil.objects.create(user=user, tipo=tipo)

    return Response(
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'tipo': tipo,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
def login_view(request):
    """
    Login por e-mail e senha.
    Espera:
      - email
      - password
    """
    email = (request.data.get('email') or '').strip().lower()
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'detail': 'email e password são obrigatórios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'detail': 'Credenciais inválidas.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(password):
        return Response(
            {'detail': 'Credenciais inválidas.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Faz login na sessão (útil se o front usar cookies no futuro)
    django_login(request, user)

    tipo = getattr(getattr(user, 'perfil', None), 'tipo', 'cliente')
    token_fake = f'token_{user.id}'

    return Response(
        {
            'message': 'Login realizado!',
            'token': token_fake,
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'tipo': tipo,
        }
    )


@api_view(['GET'])
def perfil(request):
    """
    Retorna dados do perfil do usuário.
    - Se estiver autenticado via sessão, usa request.user.
    - Caso contrário, aceita ?email= ou ?username= na query string.
    """
    user = request.user if request.user and request.user.is_authenticated else None

    if not user:
        email = request.GET.get('email')
        username = request.GET.get('username')

        try:
            if email:
                user = User.objects.get(email=email)
            elif username:
                user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    if not user:
        return Response({'detail': 'Não autenticado.'}, status=status.HTTP_401_UNAUTHORIZED)

    tipo = getattr(getattr(user, 'perfil', None), 'tipo', 'cliente')

    return Response(
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'tipo': tipo,
        }
    )
