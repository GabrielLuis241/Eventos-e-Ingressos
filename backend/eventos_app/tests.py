from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Evento, Ingresso


class EventosTestSuite(APITestCase):

    def setUp(self):
        # Criando admin
        self.admin = User.objects.create_superuser(
            username="admin", password="admin123"
        )
        # Criando usuário comum
        self.user = User.objects.create_user(
            username="user", password="user123"
        )

        # Criando evento base
        self.evento = Evento.objects.create(
            nome="Festival de Cinema",
            descricao="Um baita evento cultural",
            local="Teatro Municipal",
            data="2025-12-20",
            horario="19:00",
            ingressos_disponiveis=100
        )

    # ---------------------------
    # US01 – Listar eventos
    # ---------------------------
    def test_US01_listar_eventos(self):
        url = reverse("eventos-listar")  # precisa existir na tua urls.py
        response = self.client.get(url)

        print("[CHECK] Testando US01 – Listar eventos...")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("[OK] US01 – visualizar lista de eventos")

    # ---------------------------
    # US02 – Detalhes do evento
    # ---------------------------
    def test_US02_detalhes_evento(self):
        url = reverse("eventos-detalhes", args=[self.evento.id])
        response = self.client.get(url)

        print("[CHECK] Testando US02 – Detalhes do evento...")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("[OK] US02 – consultar detalhes do evento")

    # ---------------------------
    # US03 – Criar ingresso manualmente
    # (Adaptado — não existe compra nem pagamento)
    # ---------------------------
    def test_US03_criar_ingresso(self):
        ingresso = Ingresso.objects.create(
            evento=self.evento,
            quantidade=1,
            comprador_nome="Fulano de Tal",
            qr_code="qr-123"
        )

        self.assertEqual(ingresso.evento.id, self.evento.id)
        print("[OK] US03 – criação direta de ingresso funcionando")

    # ---------------------------
    # US04 – Ingresso digital (simples)
    # ---------------------------
    def test_US04_ingresso_digital(self):
        ingresso = Ingresso.objects.create(
            evento=self.evento,
            quantidade=1,
            comprador_nome="Fulano Teste",
            qr_code="qr123"
        )

        url = reverse("ingresso-digital", args=[ingresso.id])  # precisa existir
        response = self.client.get(url)

        print("[CHECK] Testando US04 – Ingresso digital...")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("[OK] US04 – ingresso digital gerado corretamente")

    # ---------------------------
    # US05 – Criação de evento (admin)
    # ---------------------------
    def test_US05_criar_evento(self):
        self.client.login(username="admin", password="admin123")

        url = reverse("eventos-criar")
        data = {
            "nome": "Show do Djonga",
            "descricao": "Show pancada",
            "local": "Arena da Cidade",
            "data": "2025-08-15",
            "horario": "21:00",
            "ingressos_disponiveis": 300
        }

        print("[CHECK] Testando US05 – Criar evento...")

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        print("[OK] US05 – cadastro de evento funcionando")

    # ---------------------
