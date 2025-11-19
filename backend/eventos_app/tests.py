from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Evento, Ingresso, Compra
import base64

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
            quantidade_ingressos=100,
            preco=50.00
        )

    # ---------------------------
    # US01 – Lista de eventos
    # ---------------------------
    def test_US01_listar_eventos(self):
        url = reverse("eventos-listar")
        response = self.client.get(url)

        print("[CHECK] Testando US01 – Listar eventos...")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("[OK] US01 – visualizar lista de eventos")

    # ---------------------------
    # US02 – Detalhes
    # ---------------------------
    def test_US02_detalhes_evento(self):
        url = reverse("eventos-detalhes", args=[self.evento.id])
        response = self.client.get(url)

        print("[CHECK] Testando US02 – Detalhes do evento...")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("[OK] US02 – consultar detalhes do evento")

    # ---------------------------
    # US03 – Selecionar quantidade e iniciar compra
    # ---------------------------
    def test_US03_iniciar_compra(self):
        self.client.login(username="user", password="user123")
        url = reverse("comprar-ingresso", args=[self.evento.id])

        data = {"quantidade": 2}

        print("[CHECK] Testando US03 – Iniciar processo de compra...")

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        print("[OK] US03 – seleção de ingressos e início da compra")

    # ---------------------------
    # US04 – Pagamento com cartão
    # ---------------------------
    def test_US04_pagamento_cartao(self):
        self.client.login(username="user", password="user123")

        compra = Compra.objects.create(
            usuario=self.user,
            evento=self.evento,
            quantidade=1,
            valor_total=50
        )

        url = reverse("pagar-cartao", args=[compra.id])
        data = {
            "numero": "4111111111111111",
            "validade": "12/30",
            "cvv": "123"
        }

        print("[CHECK] Testando US04 – Pagamento cartão...")

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("[OK] US04 – pagamento cartão funcionando")

    # ---------------------------
    # US05 – Pagamento PIX
    # ---------------------------
    def test_US05_pagamento_pix(self):
        self.client.login(username="user", password="user123")

        compra = Compra.objects.create(
            usuario=self.user,
            evento=self.evento,
            quantidade=1,
            valor_total=50
        )

        url = reverse("pagar-pix", args=[compra.id])

        print("[CHECK] Testando US05 – Pagamento PIX...")

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("[OK] US05 – pagamento PIX funcionando")

    # ---------------------------
    # US06 – Ingresso com QR Code
    # ---------------------------
    def test_US06_gerar_ingresso(self):
        compra = Compra.objects.create(
            usuario=self.user,
            evento=self.evento,
            quantidade=1,
            valor_total=50,
            pago=True
        )

        ingresso = Ingresso.objects.create(
            compra=compra,
            qr_code="código123"
        )

        url = reverse("ingresso-digital", args=[ingresso.id])

        print("[CHECK] Testando US06 – Ingresso digital com QR...")

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("[OK] US06 – ingresso digital gerado corretamente")

    # ---------------------------
    # US07 – Cadastrar eventos (admin)
    # ---------------------------
    def test_US07_cadastrar_evento(self):
        self.client.login(username="admin", password="admin123")

        url = reverse("eventos-criar")
        data = {
            "nome": "Show do Djonga",
            "descricao": "Show pancada",
            "local": "Arena da Cidade",
            "data": "2025-08-15",
            "quantidade_ingressos": 300,
            "preco": 90
        }

        print("[CHECK] Testando US07 – Cadastrar evento...")

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        print("[OK] US07 – cadastro de evento funcionando")

    # ---------------------------
    # US08 – Editar eventos
    # ---------------------------
    def test_US08_editar_evento(self):
        self.client.login(username="admin", password="admin123")

        url = reverse("eventos-editar", args=[self.evento.id])
        data = {"nome": "Festival Atualizado"}

        print("[CHECK] Testando US08 – Editar evento...")

        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("[OK] US08 – edição funcionando")

    # ---------------------------
    # US09 – Remover eventos
    # ---------------------------
    def test_US09_remover_evento(self):
        self.client.login(username="admin", password="admin123")

        url = reverse("eventos-remover", args=[self.evento.id])

        print("[CHECK] Testando US09 – Remover evento...")

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        print("[OK] US09 – remoção funcionando")

    # ---------------------------
    # US10 – Definir quantidade ingressos
    # ---------------------------
    def test_US10_definir_quantidade(self):
        self.client.login(username="admin", password="admin123")

        url = reverse("eventos-editar", args=[self.evento.id])
        data = {"quantidade_ingressos": 500}

        print("[CHECK] Testando US10 – Definir quantidade ingressos...")

        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("[OK] US10 – definição de ingressos funcionando")

    # ---------------------------
    # US11 – Relatórios de vendas
    # ---------------------------
    def test_US11_relatorio_vendas(self):
        self.client.login(username="admin", password="admin123")

        url = reverse("relatorio-vendas")

        print("[CHECK] Testando US11 – Relatórios...")

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("[OK] US11 – relatório básico de vendas")

    # ---------------------------
    # US12 – Criar conta usuário
    # ---------------------------
    def test_US12_criar_conta_usuario(self):
        url = reverse("criar-conta")
        data = {"username": "joao", "password": "12345"}

        print("[CHECK] Testando US12 – Criar conta...")

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        print("[OK] US12 – criação de conta funcionando")
