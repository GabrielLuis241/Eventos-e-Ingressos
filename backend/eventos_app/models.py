
from django.db import models

# Modelo simples de Evento, com o básico para cadastro e compra
class Evento(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    data = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=200)
    ingressos_disponiveis = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nome

# Ingresso gerado após pagamento aprovado
class Ingresso(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='ingressos')
    quantidade = models.PositiveIntegerField(default=1)
    comprador_nome = models.CharField(max_length=100)
    qr_code = models.CharField(max_length=200)  # guardamos o UUID do QR aqui

    def __str__(self):
        return f"{self.quantidade} ingresso(s) - {self.evento.nome}"
