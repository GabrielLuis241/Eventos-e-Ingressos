
from django.db import models

class Evento(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    data = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=200)
    ingressos_disponiveis = models.PositiveIntegerField(default=0)
    imagem = models.URLField(max_length=500, blank=True, null=True)
    categoria = models.CharField(max_length=50, default='outros')

    def __str__(self):
        return self.nome

class Ingresso(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='ingressos')
    quantidade = models.PositiveIntegerField(default=1)
    comprador_nome = models.CharField(max_length=100)
    qr_code = models.CharField(max_length=200) 

    def __str__(self):
        return f"{self.quantidade} ingresso(s) - {self.evento.nome}"
