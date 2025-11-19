<template>
  <main class="auth-bg">
    <section class="auth-card">
      <h2>Entrar</h2>
      <form @submit.prevent="fazerLogin" novalidate>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required placeholder="seu@email.com" />

        <label for="senha">Senha</label>
        <input id="senha" type="password" v-model="senha" required placeholder="Digite sua senha" />

        <label>Tipo de usuário</label>
        <div class="tipo-user">
<<<<<<< HEAD
          <label><input type="radio" value="normal" v-model="tipo" /> Usuário</label>
          <label><input type="radio" value="colaborador" v-model="tipo" /> Colaborador</label>
          <label><input type="radio" value="admin" v-model="tipo" /> Admin</label>
=======
          <label>
            <input type="radio" value="normal" v-model="tipo" />
            Usuário normal
          </label>
          <label>
            <input type="radio" value="colaborador" v-model="tipo" />
            Colaborador
          </label>
>>>>>>> e70d0f2f957ac9e23201488933f2ce74698d252d
        </div>

        <button type="submit">Entrar</button>
      </form>
<<<<<<< HEAD

      <p class="error-msg" v-if="erro">{{ erro }}</p>

      <p class="cadastro-link">
        Não tem conta?
        <button class="btn-cadastro" @click="irParaCadastro">Criar Conta</button>
=======
      <p class="error-msg" v-if="erro">{{ erro }}</p>
      <p class="cadastro-link">
        Não tem conta? <router-link to="/cadastro">Cadastre-se</router-link>
>>>>>>> e70d0f2f957ac9e23201488933f2ce74698d252d
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const senha = ref('');
const tipo = ref('normal');
const erro = ref('');
const router = useRouter();

function fazerLogin() {
  if (email.value && senha.value) {
<<<<<<< HEAD
    if (tipo.value === 'admin') router.push('/admin');
    else if (tipo.value === 'colaborador') router.push('/colaborador');
    else router.push('/eventos');
=======
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('tipoUsuario', tipo.value);
    if (tipo.value === 'colaborador') {
      router.push('/colaborador');
    } else {
      router.push('/eventos');
    }
>>>>>>> e70d0f2f957ac9e23201488933f2ce74698d252d
  } else {
    erro.value = 'Preencha email e senha.';
  }
}
<<<<<<< HEAD

function irParaCadastro() {
  router.push('/cadastro');
}
=======
>>>>>>> e70d0f2f957ac9e23201488933f2ce74698d252d
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
<<<<<<< HEAD
  background: linear-gradient(135deg, #ece1fa 40%, #f0e5fe 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.auth-card {
  background: white;
  border-radius: 18px;
  padding: 2.5rem 3rem;
  box-shadow: 0 2px 22px rgba(123, 31, 162, 0.17);
  width: 360px;
  text-align: center;
}

h2 {
  color: #7b1fa2;
  font-weight: 900;
  margin-bottom: 2rem;
}

label {
  font-weight: 700;
  color: #5a157c;
  display: block;
  margin: 0.7rem 0 0.3rem 0;
  text-align: left;
}

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 12px;
  border: 1.5px solid #d1c1eb;
  background-color: #f4ebff;
  outline: none;
}

input:focus {
  border-color: #7b1fa2;
  background-color: #eae0fd;
}

.tipo-user {
  margin: 1rem 0 1.8rem 0;
  display: flex;
  justify-content: space-between;
  color: #7b1fa2;
  font-weight: 700;
}

.tipo-user label {
  cursor: pointer;
}

button[type='submit'] {
  width: 100%;
  padding: 0.9rem;
  border-radius: 18px;
  border: none;
  background: linear-gradient(90deg, #7b1fa2 60%, #46187e 100%);
  color: white;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 14px #36177e55;
  transition: background 0.3s ease;
}

button[type='submit']:hover {
  background: linear-gradient(90deg, #543293 40%, #463390 100%);
}

.error-msg {
  margin-top: 1rem;
  color: #a12727;
  font-weight: 700;
}

.cadastro-link {
  margin-top: 2rem;
  font-weight: 700;
  color: #7b1fa2;
}

.btn-cadastro {
  background: none;
  border: none;
  color: #7b1fa2;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: underline;
  margin-left: 0.3rem;
}

.btn-cadastro:hover {
  color: #5a158e;
=======
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
  display: flex; flex-direction: column; gap: 1.2rem;
}
label {
  text-align: left;
  font-weight: 600;
  color: #6532c2;
  margin-bottom: 0.2rem;
}
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
.tipo-user label {
  color: #5341a4;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1rem;
  cursor: pointer;
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
>>>>>>> e70d0f2f957ac9e23201488933f2ce74698d252d
}
</style>
