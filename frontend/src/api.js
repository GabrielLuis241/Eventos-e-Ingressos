// src/api.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

async function handleResponse(res, path, method) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} falhou (${res.status}): ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Helpers base com JWT (se houver token salvo)
export async function apiGet(path) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse(res, path, "GET");
}

export async function apiPost(path, body) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res, path, "POST");
}

export async function apiPut(path, body) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res, path, "PUT");
}

export async function apiDelete(path) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse(res, path, "DELETE");
}

// Eventos
export async function listarEventos() {
  return apiGet("/eventos/");
}

export async function buscarEventoPorId(id) {
  return apiGet(`/eventos/${id}/`);
}

export async function criarEvento(dados) {
  // conforme documentação: POST /api/eventos/criar/
  return apiPost("/eventos/criar/", dados);
}

export async function atualizarEvento(id, dados) {
  return apiPut(`/eventos/${id}/`, dados);
}

export async function removerEvento(id) {
  return apiDelete(`/eventos/${id}/`);
}

// Ingressos (compra direta)
export async function comprarIngresso(evento_id, comprador_nome, quantidade) {
  return apiPost("/ingressos/", {
    evento: evento_id,
    comprador_nome,
    quantidade,
  });
}

// Pagamento Pix
export async function iniciarPix(username, evento_id, quantidade) {
  return apiPost("/pagamentos/pix/", {
    username,
    evento_id,
    quantidade,
  });
}

export async function confirmarPix(pagamento_id) {
  return apiPost("/pagamentos/pix/confirmar/", { pagamento_id });
}

const api = {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  atualizarEvento,
  removerEvento,
  comprarIngresso,
  iniciarPix,
  confirmarPix,
};

export default api;
