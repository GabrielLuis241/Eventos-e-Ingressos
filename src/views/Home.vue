<template>
  <main class="home-bg">
    <!-- TOPO ESTILIZADO -->
    <header class="main-header">
      <div class="top-left">
        <h1>EVENTOS+</h1>
        <span class="subtitle">Encontre e compre<br>ingressos para eventos</span>
        <input class="busca-input" type="text" placeholder="Buscar evento..." />
      </div>
      <button class="login-area" @click="irParaLogin">
        <span class="login-text">login</span>
        <img src="https://img.icons8.com/ios-filled/50/ffffff/two-tickets.png" alt="Ícone ticket" class="login-icon" />
      </button>
    </header>
    <!-- Banner estilo carrossel, centralizado -->
    <section class="banner-area">
      <div class="banner-carousel">
        <div class="banner-img banner-left">
          <img :src="banners[0]" alt="Banner Esquerda" />
        </div>
        <div class="banner-img banner-center">
          <img :src="banners[1]" alt="Banner Central" />
        </div>
        <div class="banner-img banner-right">
          <img :src="banners[2]" alt="Banner Direita" />
        </div>
      </div>
    </section>
    <!-- ÁREA FIXA CENTRALIZADA PARA CATEGORIA E EVENTOS -->
    <section class="conteudo-central">
      <!-- Categorias -->
      <div class="sessao-lista">
        <h3 class="sessao-titulo">Categoria</h3>
        <div class="lista-itens">
          <div v-for="cat in categorias" :key="cat.nome" class="cat-card">
            <img :src="cat.img" alt="ícone" class="cat-icon" />
            <span>{{ cat.nome }}</span>
          </div>
        </div>
      </div>
      <!-- Eventos -->
      <div class="sessao-lista">
        <h3 class="sessao-titulo">Eventos</h3>
        <div class="lista-itens">
          <div v-for="ev in eventos" :key="ev.id" class="evento-card" @click="verDetalhes(ev.id)">
            <img :src="ev.img" alt="evento" class="evento-img" />
            <div class="evento-nome">{{ ev.nome }}</div>
            <div class="evento-data">{{ formatarData(ev.data) }}</div>
            <div class="evento-local">{{ ev.local }}</div>
          </div>
        </div>
      </div>
    </section>  
    <!-- Listagem de eventos -->
    <section class="eventos">
      <h2>Eventos</h2>
      <div class="eventos-grid">
        <div v-for="evento in eventos" :key="evento.nome" class="evento-card">
          <img :src="evento.img" class="evento-img" />
          <div class="evento-nome">{{ evento.nome }}</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
function irParaLogin() {
  router.push('/login');
}
function verDetalhes(id) {
  router.push(`/evento/${id}`);
}

const banners = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
];

const categorias = [
  { nome: 'Show', img: 'https://img.icons8.com/fluency/48/000000/concert.png' },
  { nome: 'Palestras', img: 'https://img.icons8.com/color/48/000000/classroom.png' },
  { nome: 'Teatro', img: 'https://img.icons8.com/fluency/48/000000/theatre-mask.png' },
  { nome: 'Exposição', img: 'https://img.icons8.com/color/48/000000/art-gallery.png' },
  { nome: 'Festa', img: 'https://img.icons8.com/fluency/48/000000/confetti.png' },
  { nome: 'Feira', img: 'https://img.icons8.com/color/48/000000/market-square.png' },
];

const eventos = [
  {
    id: 1,
    nome: 'Festival de Rock',
    data: '2025-11-15',
    local: 'Praça do Estádio',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    nome: 'Noite Eletrônica',
    data: '2025-12-02',
    local: 'Arena Multishow',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    nome: 'Stand Up Comedy',
    data: '2025-12-17',
    local: 'Teatro Central',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    nome: 'Feira Tech',
    data: '2025-10-28',
    local: 'Expo Center',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
  },
];

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}
</script>

<style scoped>
.home-bg {
  min-height: 100vh;
  background: #ece8fa;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.main-header {
  background: #4b2392;
  padding: 2.3rem 2rem 1.6rem 2.7rem;
  border-radius: 0 0 38px 38px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0 2px 12px #4b239240;
  min-height: 160px;
}

.top-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}

.main-header h1 {
  color: #fff;
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 0.2rem;
}

.subtitle {
  color: #e8dafb;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.26;
}

.busca-input {
  width: 220px;
  padding: 0.53rem 1.35rem;
  font-size: 1.17rem;
  border-radius: 14px;
  border: none;
  outline: none;
  margin-top: 8px;
  background: #fff;
  box-shadow: 0 2px 8px #6840d425;
  color: #544296;
}

.login-area {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-right: 2rem;
  transition: filter 0.2s;
  outline: none;
}
.login-area:hover, .login-area:focus {
  filter: brightness(1.15);
}
.login-text {
  color: #fff;
  font-size: 1.01rem;
  font-weight: 600;
  margin-bottom: 2px;
}
.login-icon {
  width: 39px;
  margin-top: 4px;
}

/* Banner/carrossel centralizado */
.banner-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: -25px;
  margin-bottom: 18px;
}
.banner-carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 650px;
  gap: 2.4rem;
}
.banner-img {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 22px;
  background: #2a184b;
}
.banner-left img,
.banner-right img {
  width: 175px;
  height: 110px;
  object-fit: cover;
  opacity: 0.93;
  border-radius: 22px;
  box-shadow: 0 2px 14px #6840d4a5;
}
.banner-center img {
  width: 220px;
  height: 140px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 18px #6840d47c;
}

.conteudo-central {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.0rem;
  padding-bottom: 2.5rem;
}

.sessao-lista {
  margin: 0;
}

.sessao-titulo {
  color: #6935d9;
  font-weight: 900;
  margin-bottom: 1rem;
  font-size: 1.15rem;
  text-align: left;
}

.lista-itens {
  display: flex;
  gap: 2.10rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cat-card {
  background: #6935d9;
  color: #fff;
  border-radius: 20px;
  width: 88px;
  height: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.07rem;
  margin-bottom: 0.8rem;
  transition: transform 0.22s;
  box-shadow: 0 2px 14px #7b1fa24a;
}
.cat-card:hover {
  transform: scale(1.08);
}
.cat-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 7px;
}

.evento-card {
  background: #4b2392;
  border-radius: 17px;
  padding: 1.1rem 1.2rem 1.25rem 1.2rem;
  width: 215px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 18px #6935d94c;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 10px;
}
.evento-card:hover {
  box-shadow: 0 8px 22px #5a18ae85;
  transform: scale(1.05);
}
.evento-img {
  width: 100%;
  height: 115px;
  object-fit: cover;
  border-radius: 13px;
  margin-bottom: 0.74rem;
  border: 2.5px solid #fff;
}

.evento-nome {
  font-weight: 900;
  color: #fff;
  font-size: 1.11rem;
  margin-bottom: 0.41rem;
  text-align: center;
  width: 100%;
}
.evento-data, .evento-local {
  color: #eaeaec;
  font-size: 1rem;
  line-height: 1.42;
  text-align: center;
  font-weight: 700;
  background: #6935d9;
  padding: 0.23rem 0.6rem;
  width: 99%;
  border-radius: 8px;
  margin-bottom: 6px;
}
</style>
