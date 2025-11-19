<template>
  <main class="detalhe-bg" v-if="evento">
    <section class="detalhe-card">
      <h2>{{ evento.nome }}</h2>
      <img :src="evento.img" alt="Imagem do evento" class="detalhe-img" />
      <p><strong>Data:</strong> {{ formatarData(evento.data) }}</p>
      <p><strong>Local:</strong> {{ evento.local }}</p>
      <p><strong>Ingressos disponíveis:</strong> {{ evento.quantidadeIngressos - evento.ingressosVendidos }}</p>
      <button @click="voltar">Voltar</button>
    </section>
  </main>
  <main v-else>
    <p>Evento não encontrado.</p>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

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

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

onMounted(() => {
  const id = Number(route.params.id);
  evento.value = eventos.find(ev => ev.id === id) || null;
});

function voltar() {
  router.back();
}
</script>

<style scoped>
.detalhe-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #ede4fc 40%, #f9f7fd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.detalhe-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  max-width: 460px;
  box-shadow: 0 2px 18px rgba(123, 31, 162, 0.15);
  text-align: center;
}
.detalhe-img {
  width: 100%;
  border-radius: 18px;
  margin-bottom: 1.5rem;
}
h2 {
  color: #7b1fa2;
  font-weight: 900;
  margin-bottom: 1rem;
}
button {
  margin-top: 1.5rem;
  padding: 0.85rem 0;
  width: 100%;
  font-weight: 900;
  background: linear-gradient(90deg, #7b1fa2 60%, #46187e 100%);
  border: none;
  border-radius: 18px;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}
button:hover {
  background: linear-gradient(90deg, #543293 40%, #463390 100%);
}
</style>
