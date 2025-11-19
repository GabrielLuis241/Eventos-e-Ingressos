<template>
  <div class="evento-card" @click="$emit('clicar', evento.id)" tabindex="0" role="button" @keyup.enter="$emit('clicar', evento.id)">
    <img :src="evento.img" alt="Evento" class="evento-img" />
    <h3 class="evento-nome">{{ evento.nome }}</h3>
    <p class="evento-data">{{ formatarData(evento.data) }}</p>
    <p class="evento-local">{{ evento.local }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  evento: Object
});

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}
</script>

<style scoped>
.evento-card {
  width: 230px;
  background: white;
  border-radius: 13px;
  box-shadow: 0 2px 12px #7a1fa24e;
  cursor: pointer;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s ease;
  outline: none;
}
.evento-card:hover,
.evento-card:focus {
  transform: scale(1.05);
  box-shadow: 0 5px 16px #7a1fa28e;
}
.evento-img {
  width: 100%;
  border-radius: 9px;
  height: 130px;
  object-fit: cover;
  margin-bottom: 0.5rem;
}
.evento-nome {
  color: #7b1fa2;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.evento-data,
.evento-local {
  color: #463390;
  margin: 0.1rem 0;
}
</style>
