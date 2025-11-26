const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

async function handleResponse(res, path, method) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} falhou (${res.status}): ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  return handleResponse(res, path, 'GET');
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res, path, 'POST');
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res, path, 'PUT');
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
  });
  return handleResponse(res, path, 'DELETE');
}

// Eventos
export async function listarEventos() {
  return apiGet('/eventos/');
}

export async function buscarEventoPorId(id) {
  return apiGet(`/eventos/${id}/`);
}

export async function criarEvento(dados) {
  return apiPost('/eventos/', dados);
}

export async function atualizarEvento(id, dados) {
  return apiPut(`/eventos/${id}/`, dados);
}

export async function removerEvento(id) {
  return apiDelete(`/eventos/${id}/`);
}

// Ingressos (compra direta)
export async function comprarIngresso(evento_id, comprador_nome, quantidade) {
  return apiPost('/ingressos/', {
    evento: evento_id,
    comprador_nome,
    quantidade,
  });
}

// Pagamento Pix
export async function iniciarPix(username, evento_id, quantidade) {
  return apiPost('/pagamentos/pix/', {
    username,
    evento_id,
    quantidade,
  });
}

export async function confirmarPix(pagamento_id) {
  return apiPost('/pagamentos/pix/confirmar/', { pagamento_id });
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
