import { createRouter, createWebHistory } from 'vue-router';

// Views do projeto:
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Eventos from '../views/Eventos.vue';
import Colaborador from '../views/Colaborador.vue';
import Cadastro from '../views/Cadastro.vue';
import Payment from '../views/Payment.vue';
import Relatorio from '../views/Relatorio.vue';
import EventoDetalhe from '../views/EventoDetalhe.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/eventos', component: Eventos },
  { path: '/colaborador', component: Colaborador },
  { path: '/cadastro', component: Cadastro },
  { path: '/pagamento', component: Payment },
  { path: '/relatorio', component: Relatorio },
  { path: '/evento/:id', component: EventoDetalhe },

  // Coloque aqui outras views/admin se precisar, como /admin/eventos!
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
