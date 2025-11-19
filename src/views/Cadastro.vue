<template>
  <main class="auth-bg">
    <section class="auth-card">
      <h2>Criar conta</h2>
      <form @submit.prevent="fazerCadastro" novalidate>
        <label for="nome">Nome Completo</label>
        <input id="nome" type="text" v-model="nome" required placeholder="Seu nome completo" />
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required placeholder="seu@email.com" />
        <label for="senha">Senha</label>
        <input id="senha" type="password" v-model="senha" required placeholder="Crie uma senha" />
        <label for="confirmaSenha">Confirmar Senha</label>
        <input id="confirmaSenha" type="password" v-model="confirmaSenha" required placeholder="Repita a senha" />
        <label>Tipo de usuário</label>
        <div class="tipo-user">
          <label><input type="radio" value="normal" v-model="tipo" /> Usuário normal</label>
          <label><input type="radio" value="colaborador" v-model="tipo" /> Colaborador</label>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      <p class="error-msg" v-if="erro">{{ erro }}</p>
      <p class="cadastro-link">
        Já tem conta? <router-link to="/login">Entrar</router-link>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmaSenha = ref('');
const tipo = ref('normal');
const erro = ref('');
const router = useRouter();

function fazerCadastro() {
  erro.value = '';
  if (!nome.value || !email.value || !senha.value || !confirmaSenha.value) {
    erro.value = 'Preencha todos os campos.';
    return;
  }
  if (senha.value !== confirmaSenha.value) {
    erro.value = 'As senhas não coincidem.';
    return;
  }
  localStorage.setItem('tipoUsuario', tipo.value);
  alert(`Usuário ${nome.value} cadastrado com sucesso!`);
  router.push('/login');
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #36177e 0%, #7b1fa2 80%, #fff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 18px rgba(76,31,162,0.11);
  padding: 2.7rem 2.4rem 2rem;
  width: 100%;
  max-width: 340px;
  text-align: center;
}
h2 {
  color: #7b1fa2;
  margin-bottom: 2.2rem;
  font-size: 1.7rem;
  font-weight: bold;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
label {
  text-align: left;
  font-weight: 600;
  color: #6532c2;
  margin-bottom: 0.2rem;
}

input[type="text"],
input[type="email"],
input[type="password"] 
input[type="text"], input[type="email"], input[type="password"] {
  padding: 0.75rem;
  border-radius: 14px;
  border: 1px solid #d3c6ef;
  background: #f5f2fa;
  font-size: 1rem;
}
input:focus {
  border-color: #7b1fa2;
  outline: none;
  background: #ede4f7;
}
.tipo-user {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}
button {
  background: linear-gradient(90deg, #7b1fa2 60%, #36177e 100%);
  color: white;
  font-weight: 700;
  padding: 0.9rem 0;
  border: none;
  border-radius: 14px;
  box-shadow: 0 1px 9px rgba(76,31,162,0.08);
  margin-top: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
}
button:hover {
  background: linear-gradient(90deg, #6532c2 40%, #463390 100%);
}
.error-msg {
  color: #e53935;
  font-weight: 700;
  margin-top: 1rem;
}
.cadastro-link {
  margin-top: 1.5rem;
  color: #7b1fa2;
  font-size: 1rem;
}
.cadastro-link a {
  color: #2d1c99;
  text-decoration: underline;
  font-weight: 700;
}
</style>
