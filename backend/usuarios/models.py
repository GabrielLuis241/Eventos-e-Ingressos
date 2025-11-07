
from django.db import models
from django.contrib.auth.models import User

# Não criamos usuário customizado para simplificar.
# Usamos o User padrão do Django e adicionamos um campo "tipo" separado.
class Perfil(models.Model):
    USER_TYPES = (('organizador', 'Organizador'), ('cliente', 'Cliente'))
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    tipo = models.CharField(max_length=20, choices=USER_TYPES, default='cliente')

    def __str__(self):
        return f"{self.user.username} ({self.tipo})"
