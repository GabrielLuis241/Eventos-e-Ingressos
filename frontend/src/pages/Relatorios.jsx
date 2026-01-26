import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Relatorios.css";
import { obterDashboardCompleto, exportarRelatorioCSV, exportarRelatorioPDF } from "../api";

export default function Relatorios() {
  const [usuario, setUsuario] = useState(null);
  const [relatorios, setRelatorios] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // 🟣 ESTADOS DOS FILTROS (NOVO)
  const [filtroEvento, setFiltroEvento] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    if (!salvo) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(salvo);
      if (user.user_type !== "organizador") {
        alert("Acesso negado. Apenas organizadores podem acessar relatórios.");
        navigate("/");
        return;
      }
      setUsuario(user);
    } catch {
      navigate("/login");
      return;
    }

    buscarRelatorios();

    const intervalId = setInterval(() => {
      buscarRelatorios();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const buscarRelatorios = async () => {
    try {
      const dados = await obterDashboardCompleto();
      setRelatorios(dados);
      setCarregando(false);
      setErro("");
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      setErro("Erro ao carregar relatórios. Tente novamente mais tarde.");
      setCarregando(false);
    }
  };

  const handleExportarCSV = async () => {
    try {
      const blob = await exportarRelatorioCSV({
        evento: filtroEvento,
        periodo: filtroPeriodo
      }); 
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_vendas_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Erro ao exportar relatório CSV. Tente novamente.");
    }
  };

  const handleExportarPDF = async () => {
    try {
      const blob = await exportarRelatorioPDF({
        evento: filtroEvento,
        periodo: filtroPeriodo
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_vendas_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar relatório em PDF. Tente novamente.");
    }
  };

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("userType");
    navigate("/login");
  }

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="erro-container">
        <p className="erro-mensagem">{erro}</p>
        <button onClick={buscarRelatorios} className="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!usuario || !relatorios) {
    return <div className="loading">Carregando...</div>;
  }

  // 🟣 FUNÇÃO FILTRO POR PERÍODO (NOVO)
  const filtrarPorPeriodo = (data) => {
    if (filtroPeriodo === "todos") return true;
    const hoje = new Date();
    const dataItem = new Date(data);
    const diffDias = (hoje - dataItem) / (1000 * 60 * 60 * 24);
    if (filtroPeriodo === "7dias") return diffDias <= 7;
    if (filtroPeriodo === "15dias") return diffDias <= 15;
    if (filtroPeriodo === "30dias") return diffDias <= 30;
    return true;
  };

  // 🟣 DADOS FILTRADOS (NOVO)
  const vendasFiltradas = (relatorios.vendasPorEvento || [])
    .filter(v => filtroEvento === "todos" || String(v.id) === String(filtroEvento))
    .filter(v => filtrarPorPeriodo(v.data));

  const clientesFiltrados = (relatorios.clientes || [])
    .filter(c => filtroEvento === "todos" || String(c.eventoId) === String(filtroEvento))
    .filter(c => filtrarPorPeriodo(c.dataCompra));

  return (
    <div className="relatorios-page">
      <header className="relatorios-header">
        <div className="header-content">
          <div className="header-left">
        
            <h1>📊 Relatórios</h1>
            <p className="subtitle">Painel de controle e análises</p>
          </div>
          <div className="header-right">
            <div className="export-buttons">
              <button onClick={handleExportarCSV} className="btn btn-export-csv">📥 CSV</button>
              <button onClick={handleExportarPDF} className="btn btn-export-pdf">📄 PDF</button>
              <button onClick={() => navigate("/admin/eventos")} className="btn-gerenciar-eventos">🎭 GERENCIAR EVENTOS</button>
            </div>
            <div className="nav-buttons">
              <Link to="/" className="btn btn-nav">Home</Link>
              <button onClick={handleLogout} className="btn-nav btn-sair">SAIR</button>
            </div>
          </div>
        </div>
      </header>

        <div className="relatorios-container">
        {/* Cards de Métricas */}
        <section className="metrics-section">
          <div className="metric-card primary">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total de Vendas</h3>
              <p className="metric-value">
                R$ {(relatorios.totalVendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="metric-card secondary">
            <div className="metric-icon">🎫</div>
            <div className="metric-content">
              <h3>Ingressos Vendidos</h3>
              <p className="metric-value">{relatorios.totalIngressos || 0}</p>
            </div>
          </div>

          <div className="metric-card accent">
            <div className="metric-icon">🎉</div>
            <div className="metric-content">
              <h3>Total de Eventos</h3>
              <p className="metric-value">{relatorios.totalEventos || 0}</p>
            </div>
          </div>
        </section>

        {/* 🔎 FILTROS (NOVO) */}
        <section className="filtros">
          <div>
            <label>Evento</label>
            <select value={filtroEvento} onChange={(e) => setFiltroEvento(e.target.value)}>
              <option value="todos">Todos os eventos</option>
              {relatorios.vendasPorEvento?.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.nomeEvento}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Período</label>
            <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
              <option value="todos">Todo o período</option>
              <option value="7dias">Últimos 7 dias</option>
              <option value="15dias">Últimos 15 dias</option>
              <option value="30dias">Últimos 30 dias</option>
            </select>
          </div>
        </section>

        {/* TABELA VENDAS (USA FILTRADAS) */}
        <section className="table-section">
          <div className="section-header">
            <h2>📈 Faturamento por Evento</h2>
          </div>
          <div className="table-wrapper">
            {vendasFiltradas.length === 0 ? (
              <div className="no-data">
                <p>📭 Nenhuma venda encontrada para esse filtro.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Data</th>
                    <th>Ingressos Vendidos</th>
                    <th>Faturamento</th>
                  </tr>
                </thead>

                <tbody>
                  {vendasFiltradas.map((evento) => (
                    <tr key={evento.id}>
                      <td className="event-name">{evento.nomeEvento}</td>
                      <td>{new Date(evento.data).toLocaleDateString('pt-BR')}</td>
                      <td className="text-center">{evento.ingressosVendidos}</td>
                      <td className="value">
                        R$ {(evento.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* CLIENTES FILTRADOS */}
        <section className="table-section">
          <div className="section-header">
            <h2>👥 Clientes que Compraram Ingressos</h2>
          </div>
          <div className="table-wrapper">
            {clientesFiltrados.length === 0 ? (
              <div className="no-data">
                <p>📭 Nenhum cliente encontrado para esse filtro.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Evento</th>
                    <th>Qtd</th>
                    <th>Valor</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="client-name">{cliente.nome}</td>
                      <td className="email">{cliente.email}</td>
                      <td>{cliente.evento}</td>
                      <td className="text-center">{cliente.quantidade}</td>
                      <td className="value">
                        R$ {(cliente.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>{new Date(cliente.dataCompra).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
