<template>
  <main class="colab-bg">
<<<<<<< HEAD
    <header class="colab-header">
      <h1>Área do Colaborador</h1>
      <button class="btn-relatorio" @click="gerarRelatorio">Gerar Relatório</button>
    </header>

    <section class="colab-card">
      <button class="btn-cadastrar" @click="mostrarForm = !mostrarForm">
        {{ mostrarForm ? 'Fechar formulário' : 'Cadastrar Novo Evento' }}
      </button>

      <form v-if="mostrarForm" @submit.prevent="cadastrarEvento" class="form-evento" novalidate>
        <label for="nome">Nome do Evento</label>
        <input id="nome" type="text" v-model="nome" placeholder="Digite o nome do evento" required />

        <label for="data">Data</label>
        <input id="data" type="date" v-model="data" required />

        <label for="local">Localização</label>
        <input id="local" type="text" v-model="local" placeholder="Local do evento" required />


        <label for="quantidadeIngressos">Quantidade de ingressos</label>
        <input id="quantidadeIngressos" type="number" v-model.number="quantidadeIngressos" min="1" required />
        <label for="img">URL da Imagem</label>
        <input id="img" type="text" v-model="img" placeholder="Cole a URL da imagem" required />

        <button type="submit" class="btn-submit">Cadastrar Evento</button>
      </form>

      <p v-if="mensagem" class="mensagem-sucesso">{{ mensagem }}</p>

      <section class="eventos">
        <h3>Meus Eventos</h3>
        <div class="eventos-grid">
          <div v-for="evento in eventos" :key="evento.id" class="evento-card" @click="verDetalhes(evento.id)">
            <img :src="evento.img" alt="Evento" class="evento-img" />
            <div class="evento-nome">{{ evento.nome }}</div>
            <div class="evento-data">{{ formatarData(evento.data) }}</div>
            <div class="evento-local">{{ evento.local }}</div>
            <div class="evento-ingressos">Ingressos disponíveis: {{ evento.quantidadeIngressos - evento.ingressosVendidos }}</div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mostrarForm = ref(false);
const nome = ref('');
const data = ref('');
const local = ref('');
const img = ref('');
const quantidadeIngressos = ref(100);
const mensagem = ref('');
const eventos = ref([
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
]);

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function cadastrarEvento() {
  if (!nome.value || !data.value || !local.value || !img.value || !quantidadeIngressos.value || quantidadeIngressos.value < 1) {
    mensagem.value = 'Por favor, preencha todos os campos corretamente.';
    return;
  }
  const novoId = eventos.value.length + 1;
  eventos.value.push({
    id: novoId,
    nome: nome.value,
    data: data.value,
    local: local.value,
    img: img.value,

    quantidadeIngressos: quantidadeIngressos.value,
    ingressosVendidos: 0,
  });
  mensagem.value = `Evento "${nome.value}" cadastrado com sucesso!`;
  nome.value = '';
  data.value = '';
  local.value = '';
  img.value = '';
  quantidadeIngressos.value = 100;
  mostrarForm.value = false;
}

function verDetalhes(id) {
  router.push(`/evento/${id}`);
}

function gerarRelatorio() {
  router.push('/relatorio');
}
</script>

<style scoped>
.colab-bg {
  min-height: 100vh;
  background: #ede8fa;
  padding: 1.5rem 1rem;
}

.colab-header {
  background: #4b2392;
  padding: 1.8rem 2.5rem;
  border-radius: 0 0 32px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 2px 16px #4b239240;
  margin-bottom: 1.6rem;
}
.colab-header h1 {
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
}
.btn-relatorio {
  background: #7b1fa2;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  color: #fff;
  padding: 0.65rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 10px #6935d948;
  transition: background-color 0.3s ease;
}
.btn-relatorio:hover {
  background: #6935d9;
}

.colab-card {
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 0 22px #7b1fa235;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
.btn-cadastrar {
  background: #6935d9;
  color: #fff;
  padding: 0.8rem 1.3rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;
}
.btn-cadastrar:hover {
  background: #774de1;
}
.form-evento {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-evento label {
  font-weight: 700;
  color: #43356c;
  font-size: 1rem;
}
.form-evento input {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1.5px solid #d9cfff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}
.form-evento input:focus {
  border-color: #6935d9;
}
.btn-submit {
  align-self: flex-start;
  background: #7b1fa2;
  color: #fff;
  padding: 0.55rem 1.8rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-submit:hover {
  background: #5b1fa8;
}

.mensagem-sucesso {
  font-weight: 700;
  font-size: 1rem;
  color: #5b1fa8;
  text-align: center;
  margin-top: 0.2rem;
}

.eventos {
  margin-top: 1rem;
}
.eventos h3 {
  color: #6c3ec8;
  font-weight: 900;
  margin-bottom: 1.3rem;
  font-size: 1.3rem;
}
.eventos-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}
.evento-card {
  background: #4a2389;
  border-radius: 18px;
  padding: 1.2rem 1.3rem;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 3px 13px #6a40dca1;
  transition: transform 0.3s, box-shadow 0.3s;
}
.evento-card:hover {
  transform: scale(1.06);
  box-shadow: 0 7px 17px #715fe6bd;
}
.evento-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 0.7rem;
  border: 3px solid #fff;
}
.evento-nome {
  font-weight: 900;
  color: #fff;
  font-size: 1.15rem;
  margin-bottom: 0.45rem;
  text-align: center;
}
.evento-data,
.evento-local {
  font-weight: 600;
  font-size: 1rem;
  color: #d0c6fc;
  margin-bottom: 0.27rem;
  text-align: center;
  width: 100%;
  background: #6739ba;
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
}
.evento-ingressos {
  font-weight: 700;
  color: #ffdb48;
  font-size: 0.95rem;
  margin-top: 0.61rem;
  background: #34206d;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  user-select: none;
  text-align: center;
  box-shadow: 0 1px 5px #bcae9f71;
}
</style>
