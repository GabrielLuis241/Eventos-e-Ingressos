<template>
  <main class="payment-bg" v-if="evento">
    <section class="payment-card">
      <h2>Finalizar Compra - {{ evento.nome }}</h2>
      <p class="subtitle">Informe a quantidade de ingressos que deseja comprar</p>

      <div class="quantity-wrapper">
        <button @click="diminuirQuantidade" :disabled="quantidadeComprar <= 1">-</button>
        <input
          type="number"
          v-model.number="quantidadeComprar"
          :max="quantidadeMaxima"
          min="1"
          aria-label="Quantidade de ingressos"
        />
        <button @click="aumentarQuantidade" :disabled="quantidadeComprar >= quantidadeMaxima">+</button>
      </div>
      <p class="disponivel">Ingressos disponíveis: <strong>{{ quantidadeMaxima }}</strong></p>

      <div class="pagamento-opcoes">
        <label>
          <input type="radio" value="cartao" v-model="metodo" /> Cartão de Crédito
        </label>
        <label>
          <input type="radio" value="pix" v-model="metodo" /> Pix
        </label>
      </div>

      <form v-if="metodo === 'cartao'" @submit.prevent="finalizarPagamento" class="form-cartao">
        <input type="text" v-model="cartao.numero" placeholder="Número do Cartão" required />
        <input type="text" v-model="cartao.nome" placeholder="Nome no Cartão" required />
        <input type="month" v-model="cartao.validade" placeholder="Validade" required />
        <input type="text" v-model="cartao.cvv" placeholder="CVV" required />
        <button type="submit" :disabled="loading">{{ loading ? 'Processando...' : 'Pagar' }}</button>
      </form>

      <div v-if="metodo === 'pix'" class="pix-info">
        <p>Escaneie o QR Code abaixo ou copie a chave Pix para pagamento:</p>
        <img src="https://via.placeholder.com/180" alt="QR Code Pix" />
        <input type="text" readonly :value="chavePix" @click="$event.target.select()" />
        <button @click="finalizarPagamento" :disabled="loading">{{ loading ? 'Confirmando...' : 'Confirmar pagamento via Pix' }}</button>
      </div>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </section>
  </main>
  <main v-else class="payment-bg">
    <p class="no-evento">Evento não encontrado.</p>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const eventos = [
  {
    id: 1,
    nome: 'Festival de Rock',
    data: '2025-11-15',
    local: 'Praça do Estádio',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=350&q=80',
    quantidadeIngressos: 150,
    ingressosVendidos: 20,
  },
  {
    id: 2,
    nome: 'Noite Eletrônica',
    data: '2025-12-02',
    local: 'Arena Multishow',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=350&q=80',
    quantidadeIngressos: 100,
    ingressosVendidos: 45,
  },
];

const evento = ref(null);
const quantidadeComprar = ref(1);
const quantidadeMaxima = ref(0);
const metodo = ref('');
const cartao = ref({
  numero: '',
  nome: '',
  validade: '',
  cvv: '',
});
const chavePix = '123e4567-e89b-12d3-a456-426614174000';
const mensagem = ref('');
const loading = ref(false);

onMounted(() => {
  const id = Number(route.query.id);
  evento.value = eventos.find(e => e.id === id) || null;
  if (evento.value) {
    quantidadeMaxima.value = evento.value.quantidadeIngressos - evento.value.ingressosVendidos;
  }
});

function aumentarQuantidade() {
  if (quantidadeComprar.value < quantidadeMaxima.value) {
    quantidadeComprar.value++;
  }
}

function diminuirQuantidade() {
  if (quantidadeComprar.value > 1) {
    quantidadeComprar.value--;
  }
}

function finalizarPagamento() {
  if (!quantidadeComprar.value || quantidadeComprar.value < 1) {
    mensagem.value = 'Informe a quantidade de ingressos a comprar';
    return;
  }
  if (quantidadeComprar.value > quantidadeMaxima.value) {
    mensagem.value = 'Quantidade maior que ingressos disponíveis';
    return;
  }
  if(metodo.value === '') {
    mensagem.value = 'Selecione o método de pagamento';
    return;
  }
  loading.value = true;
  if (metodo.value === 'cartao') {
    if (!cartao.value.numero || !cartao.value.nome || !cartao.value.validade || !cartao.value.cvv) {
      mensagem.value = 'Preencha todos os dados do cartão';
      loading.value = false;
      return;
    }
    setTimeout(() => {
      mensagem.value = `Pagamento realizado! Você comprou ${quantidadeComprar.value} ingressos.`;
      loading.value = false;
    }, 1500);
  } else if (metodo.value === 'pix') {
    setTimeout(() => {
      mensagem.value = 'Pagamento via Pix confirmado! Aguardando confirmação.';
      loading.value = false;
    }, 1500);
  }
}
</script>

<style scoped>
.payment-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3e2ff 40%, #ece3fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.payment-card {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 22px;
  box-shadow: 0 2px 20px #7b1fa248;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-card h2 {
  color: #7b1fa2;
  font-weight: 900;
  text-align: center;
}

.subtitle {
  font-weight: 600;
  color: #5a1f9c;
  text-align: center;
  margin-bottom: 1rem;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.quantity-wrapper button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: #7b1fa2;
  color: white;
  font-weight: 900;
  font-size: 1.3rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.quantity-wrapper button:disabled {
  background-color: #cdbce0;
  cursor: not-allowed;
}

.quantity-wrapper input {
  width: 70px;
  padding: 0.5rem;
  border: 1.5px solid #d2c6ec;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #5a1f9c;
  user-select: text;
  outline: none;
  transition: border-color 0.3s ease;
}

.quantity-wrapper input:focus {
  border-color: #7b1fa2;
}

.disponivel {
  text-align: center;
  font-weight: 700;
  color: #4b1fa2;
  margin-bottom: 1rem;
}

.pagamento-opcoes {
  display: flex;
  justify-content: space-around;
  font-weight: 700;
  color: #7b1fa2;
  margin-bottom: 1rem;
}

.form-cartao input,
.pix-info input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1.5px solid #d2c6ec;
  background-color: #f7f2fa;
  outline: none;
}

.form-cartao input:focus,
.pix-info input:focus {
  border-color: #7b1fa2;
  background: #ece1fa;
}

button {
  background: linear-gradient(90deg, #7b1fa2 60%, #46187e 100%);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 0.8rem 0;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 2px 12px #7b1fa229;
  transition: background 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: linear-gradient(90deg, #543293 40%, #463390 100%);
}

.pix-info p {
  font-weight: 700;
  color: #4b1fa2;
  margin-bottom: 0.7rem;
}

.pix-info img {
  display: block;
  margin: 0 auto 1rem auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px #7b1fa235;
}

.mensagem {
  font-weight: 700;
  color: #7b1fa2;
  text-align: center;
  margin-top: 1.2rem;
}
</style>
