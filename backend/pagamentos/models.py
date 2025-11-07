
from django.db import models
from django.contrib.auth.models import User
from eventos_app.models import Evento

class Pagamento(models.Model):
    METODOS = (('pix', 'Pix'),)
    STATUS = (('pendente', 'Pendente'), ('aprovado', 'Aprovado'))

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    metodo = models.CharField(max_length=10, choices=METODOS, default='pix')
    status = models.CharField(max_length=10, choices=STATUS, default='pendente')
    codigo_pix = models.CharField(max_length=100, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pagamento {self.id} - {self.evento.nome} ({self.status})"
