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

// ========================
// Helpers base com JWT
// ========================
export async function apiGet(path) {
  const token = localStorage.getItem("accessToken");
  const url = `${API_BASE}${path}`;
  console.log("🔵 API GET:", url);
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

// ========================
// Mapeamento Evento
// ========================
function eventoParaBackend(evento) {
  const payload = {
    name: evento.nome || evento.name,
    description: evento.descricao || evento.description || "",
    date: evento.data || evento.date,
    time: evento.horario || evento.time,
    location: evento.local || evento.location,
    image: evento.imagem || evento.image || "",
    total_tickets:
      evento.total_tickets ||
      evento.ingressos_disponiveis ||
      evento.ingressos_totais ||
      0,
    price: evento.price || evento.preco || 0,
    category: evento.categoria || evento.category || "outros",
  };
  if (!payload.image) delete payload.image;
  return payload;
}

function formatarImagemUrl(imagem) {
  if (!imagem) return "";
  // Se já é uma URL completa, retorna como está
  if (imagem.startsWith("http://") || imagem.startsWith("https://")) {
    return imagem;
  }
  // Se é um caminho relativo, adiciona o prefixo do backend
  return `${API_BASE}${imagem}`;
}

function eventoParaFrontend(evento) {
  if (!evento) return null;
  const imagemOriginal = evento.image || evento.imagem;
  return {
    id: evento.id,
    nome: evento.name || evento.nome,
    descricao: evento.description || evento.descricao,
    data: evento.date || evento.data,
    horario: evento.time || evento.horario,
    local: evento.location || evento.local,
    imagem: formatarImagemUrl(imagemOriginal),
    ingressos_disponiveis:
      evento.available_tickets ?? evento.ingressos_disponiveis,
    total_tickets: evento.total_tickets,
    preco: evento.price ?? evento.preco ?? 0,
    price: evento.price ?? evento.preco ?? 0,
    available_tickets: evento.available_tickets,
    categoria: evento.category || evento.categoria || "outros",
  };
}

// ========================
// Eventos (Público)
// ========================
export async function listarEventos() {
  const eventos = await apiGet("/eventos");
  if (Array.isArray(eventos)) {
    return eventos.map(eventoParaFrontend);
  }
  return eventos;
}

export async function buscarEventoPorId(id) {
  const evento = await apiGet(`/eventos/${id}`);
  return eventoParaFrontend(evento);
}

// ========================
// Eventos (Admin)
// ========================
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

// ========================
// Ingressos / Pagamentos
// ========================
export async function comprarIngresso(evento_id, comprador_nome, quantidade) {
  return apiPost("/ingressos/", {
    evento: evento_id,
    comprador_nome,
    quantidade,
  });
}

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

// ========================
// Autenticação
// ========================
export async function registrarUsuario(
  username,
  email,
  password,
  user_type = "cliente"
) {
  const url = `${API_BASE}/auth/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, user_type }),
  });
  return handleResponse(res, "/auth/register", "POST");
}

export async function fazerLogin(username, password) {
  const url = `${API_BASE}/auth/login`;
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const data = await handleResponse(res, "/auth/login", "POST");

  if (data?.access_token) {
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("userType", data.user_type);
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({ username, user_type: data.user_type })
    );
  }

  return data;
}

// ========================
// Compras
// ========================
export async function iniciarCompra(event_id, quantity, payment_type) {
  return apiPost("/compras/", { event_id, quantity, payment_type });
}

export async function confirmarCompra(purchase_id) {
  return apiPost(`/compras/${purchase_id}/confirmar`, {});
}

export async function listarMinhasCompras() {
  return apiGet("/compras/minhas");
}

// ========================
// Relatórios
// ========================
export async function obterDashboardCompleto() {
  return apiGet("/reports/dashboard-completo");
}

export async function exportarRelatorioCSV(filtros = {}) {
  const token = localStorage.getItem("accessToken");

  const params = new URLSearchParams();
  if (filtros.evento && filtros.evento !== "todos") {
    params.append("evento", filtros.evento);
  }
  if (filtros.periodo && filtros.periodo !== "todos") {
    params.append("periodo", filtros.periodo);
  }

  const res = await fetch(`${API_BASE}/reports/exportar-csv?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao exportar relatório CSV");
  }

  return res.blob();
}

export async function exportarRelatorioPDF(filtros = {}) {
  const token = localStorage.getItem("accessToken");

  const params = new URLSearchParams();
  if (filtros.evento && filtros.evento !== "todos") {
    params.append("evento", filtros.evento);
  }
  if (filtros.periodo && filtros.periodo !== "todos") {
    params.append("periodo", filtros.periodo);
  }

  const res = await fetch(`${API_BASE}/reports/exportar-pdf-avancado?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao exportar relatório PDF");
  }

  return res.blob();
}

export async function exportarRelatorioExcel(filtros = {}) {
  const token = localStorage.getItem("accessToken");
  const query = new URLSearchParams(filtros).toString();
  const res = await fetch(`${API_BASE}/reports/exportar-excel?${query}`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao exportar relatório Excel");
  }

  return res.blob();
}


// ========================
// Export default
// ========================
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
  registrarUsuario,
  fazerLogin,
  iniciarCompra,
  confirmarCompra,
  listarMinhasCompras,
  obterDashboardCompleto,
  exportarRelatorioCSV,
  exportarRelatorioPDF,
  exportarRelatorioExcel,
};

export default api;
