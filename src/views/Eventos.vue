<template>
<<<<<<< HEAD
  <main class="eventos-bg">
    <section class="endstadium-section">
      <h2>Eventos Disponíveis</h2>
      <p class="subtitle">Confira as atrações para você.</p>
      <div class="eventos-grid">
        <div
          v-for="evento in eventos"
          :key="evento.id"
          class="evento-card"
          @click="abrirModal(evento)"
        >
          <img :src="evento.img" alt="Capa evento" class="evento-img" />
          <div class="info">
            <span class="evento-nome">{{ evento.nome }}</span>
            <span class="evento-data">{{ formatarData(evento.data) }}</span>
            <span class="evento-local">📍 {{ evento.local }}</span>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="modalAberto" class="modal-overlay" @click="fecharModal">
        <div class="modal-content" @click.stop>
          <h3>{{ eventoSelecionado.nome }}</h3>
          <img :src="eventoSelecionado.img" alt="Imagem do evento" />
          <p>{{ eventoSelecionado.descricao }}</p>
          <button class="comprar-btn-modal" @click="comprarIngresso(eventoSelecionado.id)">Comprar ingresso</button>
          <button @click="fecharModal" class="btn-fechar">Fechar</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const eventos = [
  {
    id: 1,
    nome: "Festival de Rock",
    descricao: "Um festival com as melhores bandas de rock do momento.",
    data: "2025-11-15",
    local: "Praça do Estádio",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=350&q=80",
  },
  {
    id: 2,
    nome: "Noite Eletrônica",
    descricao: "Festa animada com discotecagem ao vivo e grandes DJs.",
    data: "2025-12-02",
    local: "Arena Multishow",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=350&q=80",
  },
  {
    id: 3,
    nome: "Stand Up Comedy",
    descricao: "Show de comédia com os melhores humoristas nacionais.",
    data: "2025-12-17",
    local: "Teatro Central",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=350&q=80",
  }
];

const modalAberto = ref(false);
const eventoSelecionado = ref(null);

function abrirModal(evento) {
  eventoSelecionado.value = evento;
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  eventoSelecionado.value = null;
}

function comprarIngresso(id) {
  router.push({ path: '/pagamento', query: { id } });
}
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}
</script>

<style scoped>
/* Background do conteúdo */
.eventos-bg {
  background: linear-gradient(135deg, #f7f2ff 40%, #f1eaff 100%);
  min-height: 100vh;
  padding: 2rem;
}

/* Container branco com arredondamento e sombra */
.endstadium-section {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 36px rgba(123, 31, 162, 0.15);
  padding: 3rem 2.5rem;
  box-sizing: border-box;
}

/* Cabeçalho título e subtítulo */
.endstadium-section h2 {
  color: #7b1fa2;
  font-weight: 900;
  font-size: 2.1rem;
  letter-spacing: 1.2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.subtitle {
  color: #46187e;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: 700;
}

/* Grid eventos */
.eventos-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* Card do evento */
.evento-card {
  background: #faf6ff;
  border-radius: 24px;
  box-shadow: 0 6px 24px rgba(120, 80, 180, 0.12);
  overflow: hidden;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.25s;
}
.evento-card:hover {
  box-shadow: 0 10px 36px rgba(123, 31, 162, 0.25);
  transform: scale(1.05);
}

.evento-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 24px 24px 0 0;
}

.info {
  width: 100%;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}

.evento-nome {
  font-weight: 900;
  font-size: 1.25rem;
  color: #601a99;
}

.evento-data {
  font-size: 1rem;
  color: #4b1f9b;
  font-weight: 700;
}

.evento-local {
  font-size: 1rem;
  color: #7b1fa2;
  display: flex;
  align-items: center;
}

/* Estilo do modal - fundo transparente escuro */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right:0;
  bottom:0;
  background-color: rgba(75, 35, 146, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

/* Conteúdo branco arredondado */
.modal-content {
  background: white;
  border-radius: 22px;
  padding: 2.5rem 3rem;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  text-align: center;
  box-shadow: 0 8px 18px #7b1fa288;
  position: relative;
}

/* Imagem dentro do modal */
.modal-content img {
  width: 100%;
  border-radius: 18px;
  margin-bottom: 1.2rem;
}

/* Título do evento no modal */
.modal-content h3 {
  margin-bottom: 1rem;
  color: #7b1fa2;
  font-weight: 900;
  font-size: 1.8rem;
}

/* Descrição do evento */
.modal-content p {
  font-size: 1.1rem;
  color: #551a8b;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Botão comprar ingresso no modal */
.comprar-btn-modal {
  background: linear-gradient(90deg, #7b1fa2 60%, #46187e 100%);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 22px;
  padding: 1.05rem 0;
  cursor: pointer;
  font-size: 1.2rem;
  width: 100%;
  box-shadow: 0 2px 12px #7b1fa229;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 1rem;
}
.comprar-btn-modal:hover {
  background: linear-gradient(90deg, #543293 40%, #36177e 100%);
  box-shadow: 0 8px 22px #5a18ae85;
}

/* Botão fechar modal */
.btn-fechar {
  font-weight: 700;
  color: #7b1fa2;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
}
.btn-fechar:hover {
  color: #46187e;
  }
</style>
