// src/api.js
// ATUALIZADO: Backend não tem prefixo /api - REMOVIDO /api
// Versão: 4.0 - FORÇANDO SEM /api - REMOVENDO VARIÁVEL DE AMBIENTE
// FORÇANDO URL SEM /api - IGNORANDO VARIÁVEL DE AMBIENTE SE TIVER /api
let envUrl = process.env.REACT_APP_API_URL || "";
if (envUrl && envUrl.includes("/api")) {
  console.warn("⚠️ REACT_APP_API_URL tem /api - REMOVENDO:", envUrl);
  envUrl = envUrl.replace("/api", "");
}
const API_BASE = envUrl || "http://localhost:8000";
console.log("🚀🚀🚀 api.js VERSÃO 4.0 CARREGADO - API_BASE:", API_BASE);
console.log("🚀🚀🚀 CÓDIGO NOVO CONFIRMADO - SEM /api");

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
  const url = `${API_BASE}${path}`;
  console.log("🔵 API GET:", url); // Debug
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse(res, path, "DELETE");
}

// Funções de mapeamento de campos: Português (frontend) ↔ Inglês (backend)
function eventoParaBackend(evento) {
  // Remove campos undefined/null para evitar enviar campos vazios
  const payload = {
    name: evento.nome || evento.name,
    description: evento.descricao || evento.description || "",
    date: evento.data || evento.date,
    time: evento.horario || evento.time,
    location: evento.local || evento.location,
    image: evento.imagem || evento.image || "",
    total_tickets: evento.total_tickets || evento.ingressos_disponiveis || evento.ingressos_totais || 0,
  };
  // Remove campos vazios que não são obrigatórios
  if (!payload.image) delete payload.image;
  return payload;
}

function eventoParaFrontend(evento) {
  if (!evento) return null;
  return {
    id: evento.id,
    nome: evento.name || evento.nome,
    descricao: evento.description || evento.descricao,
    data: evento.date || evento.data,
    horario: evento.time || evento.horario,
    local: evento.location || evento.local,
    imagem: evento.image || evento.imagem,
    ingressos_disponiveis: evento.available_tickets ?? evento.ingressos_disponiveis,
    total_tickets: evento.total_tickets,
    categoria: evento.categoria || "outros", // Campo adicional do frontend
  };
}

// Eventos - Endpoints públicos
export async function listarEventos() {
  const eventos = await apiGet("/eventos");
  // Se for array, converter cada evento
  if (Array.isArray(eventos)) {
    return eventos.map(eventoParaFrontend);
  }
  return eventos;
}

export async function buscarEventoPorId(id) {
  const evento = await apiGet(`/eventos/${id}`);
  return eventoParaFrontend(evento);
}

// Eventos - Endpoints admin (CRUD)
export async function criarEvento(dados) {
  const payload = eventoParaBackend(dados);
  const evento = await apiPost("/admin/eventos", payload);
  return eventoParaFrontend(evento);
}

export async function atualizarEvento(id, dados) {
  const payload = eventoParaBackend(dados);
  const evento = await apiPut(`/admin/eventos/${id}`, payload);
  return eventoParaFrontend(evento);
}

export async function removerEvento(id) {
  return apiDelete(`/admin/eventos/${id}`);
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
