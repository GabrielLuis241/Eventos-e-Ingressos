from django.test import TestCase
class FluxoSimplesTestCase(TestCase):
    def setUp(self):
        self.dados_ingresso = {
            'evento': 1  
        }

    def test_01_listar_eventos(self):
        "Verifica se a rota de listagem de eventos"
        response = self.client.get('/eventos/')
        self.assertEqual(response.status_code, 200)

    def test_02_comprar_ingresso(self):
        "Verifica se a rota de compra de ingresso"
        response = self.client.post('/ingressos/', self.dados_ingresso)
        self.assertIn(response.status_code, [200, 201])
