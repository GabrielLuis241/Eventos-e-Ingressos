// src/services/api.js

// Base da API — usa variável do ambiente (.env) ou localhost por padrão
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// 🔹 Função genérica de requisição GET
export async function apiGet(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
      throw new Error(`API GET ${path} falhou (${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.error('Erro em apiGet:', error);
    throw error;
  }
}

// 🔹 Função genérica de requisição POST
export async function apiPost(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API POST ${path} falhou (${res.status}): ${text}`);
    }

    return res.json();
  } catch (error) {
    console.error('Erro em apiPost:', error);
    throw error;
  }
}

//
// 🟣 NOVAS FUNÇÕES DE INTEGRAÇÃO COM O BACKEND
//

// 🔹 Autenticação de usuário (login)
export async function loginUsuario(email, senha) {
  return apiPost('/login/', { email, senha });
}

// 🔹 Cadastro de novo usuário comum
export async function cadastrarUsuario(nome, email, senha) {
  return apiPost('/usuarios/', { nome, email, senha, tipo: 'usuario' });
}

// 🔹 Cadastro de administrador
export async function cadastrarAdm(nome, email, senha, chaveAdm) {
  return apiPost('/usuarios/', { nome, email, senha, tipo: 'admin', chaveAdm });
}

// 🔹 Listagem de eventos (para Home)
export async function listarEventos() {
  return apiGet('/eventos/');
}

// 🔹 Detalhe de um evento
export async function buscarEventoPorId(id) {
  return apiGet(`/eventos/${id}/`);
}

// 🔹 Criar compra de ingresso
export async function comprarIngresso(evento_id, nome, quantidade, metodo_pagamento) {
  return apiPost('/comprar/', { evento_id, nome, quantidade, metodo_pagamento });
}

// 🔹 Processar pagamento com cartão
export async function pagarComCartao(compraId, numero, validade, cvv) {
  return apiPost('/pagamento/cartao/', { compraId, numero, validade, cvv });
}

// 🔹 Gerar pagamento com Pix
export async function gerarPagamentoPix(compraId) {
  return apiPost('/pagamento/pix/', { compraId });
}

// 🔹 Confirmar pagamento (retornar QR Code e status)
export async function confirmarCompra(compraId) {
  return apiGet(`/compra/${compraId}/confirmacao/`);
}

// ✅ Exportação agrupada
const api = {
  apiGet,
  apiPost,
  loginUsuario,
  cadastrarUsuario,
  cadastrarAdm,
  listarEventos,
  buscarEventoPorId,
  comprarIngresso,
  pagarComCartao,
  gerarPagamentoPix,
  confirmarCompra,
};

export default api;
