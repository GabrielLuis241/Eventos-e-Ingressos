<template>
  <main class="relatorio-bg">
    <section class="relatorio-card">
      <h2>Relatório de Vendas</h2>
      <button class="btn-gerar" @click="gerarRelatorio">Gerar Relatório</button>

      <table v-if="relatorio.length" class="relatorio-table" border="1" cellspacing="0" cellpadding="8">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Ingressos Vendidos</th>
            <th>Data do Evento</th>
            <th>Valor Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in relatorio" :key="item.eventoId">
            <td>{{ item.nomeEvento }}</td>
            <td>{{ item.ingressosVendidos }}</td>
            <td>{{ formatarData(item.data) }}</td>
            <td>{{ item.valorTotal.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="sem-relatorio">Nenhum relatório disponível.</p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';

const relatorio = ref([]);

function gerarRelatorio() {
  relatorio.value = [
    { eventoId: 1, nomeEvento: 'Festival de Rock', ingressosVendidos: 120, data: '2025-11-20', valorTotal: 6000 },
    { eventoId: 2, nomeEvento: 'Festival Jazz', ingressosVendidos: 90, data: '2025-12-05', valorTotal: 4500 }
  ];
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}
</script>

<style scoped>
.relatorio-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #ebe9ff 40%, #f2f0fa 100%);
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.relatorio-card {
  width: 650px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 24px rgba(107, 52, 196, 0.15);
  padding: 2.5rem;
  text-align: center;
}
h2 {
  color: #7b1fa2;
  margin-bottom: 2.2rem;
  font-weight: 900;
  font-size: 1.9rem;
}
.btn-gerar {
  background: #7b1fa2;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 1.8rem;
  cursor: pointer;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}
.btn-gerar:hover {
  background: #5a158e;
}
.relatorio-table {
  width: 100%;
  border-collapse: collapse;
  font-weight: 600;
  color: #4b1fa2;
}
.relatorio-table thead tr {
  background: #d0b9ff;
  color: #3a0276;
}
.relatorio-table th, .relatorio-table td {
  padding: 0.8rem;
  border: 1px solid #b29bff;
}
.sem-relatorio {
  color: #7b1fa2;
  font-weight: 700;
  margin-top: 1.4rem;
  font-size: 1.1rem;
}
</style>
