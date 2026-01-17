// src/pages/Relatorios.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Relatorios.css";
import { obterDashboardCompleto, exportarRelatorioCSV } from "../api";

export default function Relatorios() {
  const [usuario, setUsuario] = useState(null);
  const [relatorios, setRelatorios] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

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

    // Buscar dados reais do backend
    buscarRelatorios();

    // Atualização automática a cada 30 segundos
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
      const blob = await exportarRelatorioCSV();
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
      alert("Erro ao exportar relatório. Tente novamente.");
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

  return (
    <div className="relatorios-page">
      {/* Header */}
      <header className="relatorios-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="back-button">← Voltar</Link>
            <h1>📊 Relatórios</h1>
            <p className="subtitle">Painel de controle e análises</p>
          </div>
          <div className="header-right">
            <span className="user-name">Olá, {usuario.username}</span>
            <button onClick={handleExportarCSV} className="btn btn-success btn-sm">
              📥 Exportar CSV
            </button>
            <Link to="/admin/eventos" className="btn btn-outline btn-sm">
              Gerenciar Eventos
            </Link>
            <Link to="/" className="btn btn-ghost btn-sm">
              Home
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Sair
            </button>
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
                R$ {relatorios.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="metric-card secondary">
            <div className="metric-icon">🎫</div>
            <div className="metric-content">
              <h3>Ingressos Vendidos</h3>
              <p className="metric-value">{relatorios.totalIngressos}</p>
            </div>
          </div>

          <div className="metric-card accent">
            <div className="metric-icon">🎉</div>
            <div className="metric-content">
              <h3>Total de Eventos</h3>
              <p className="metric-value">{relatorios.totalEventos}</p>
            </div>
          </div>
        </section>

        {/* Faturamento por Evento */}
        <section className="table-section">
          <div className="section-header">
            <h2>📈 Faturamento por Evento</h2>
          </div>
          <div className="table-wrapper">
            {relatorios.vendasPorEvento.length === 0 ? (
              <div className="no-data">
                <p>📭 Nenhuma venda registrada ainda.</p>
                <p>Quando houver vendas, os dados aparecerão aqui.</p>
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
                  {relatorios.vendasPorEvento.map((evento) => (
                    <tr key={evento.id}>
                      <td className="event-name">{evento.nomeEvento}</td>
                      <td>{new Date(evento.data).toLocaleDateString('pt-BR')}</td>
                      <td className="text-center">{evento.ingressosVendidos}</td>
                      <td className="value">
                        R$ {evento.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan="2"><strong>Total</strong></td>
                    <td className="text-center">
                      <strong>{relatorios.totalIngressos}</strong>
                    </td>
                    <td className="value">
                      <strong>
                        R$ {relatorios.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </section>

        {/* Lista de Clientes */}
        <section className="table-section">
          <div className="section-header">
            <h2>👥 Clientes que Compraram Ingressos</h2>
          </div>
          <div className="table-wrapper">
            {relatorios.clientes.length === 0 ? (
              <div className="no-data">
                <p>📭 Nenhum cliente registrado ainda.</p>
                <p>Quando houver compras, os clientes aparecerão aqui.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Evento</th>
                    <th>Quantidade</th>
                    <th>Valor Total</th>
                    <th>Data da Compra</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorios.clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="client-name">{cliente.nome}</td>
                      <td className="email">{cliente.email}</td>
                      <td>{cliente.evento}</td>
                      <td className="text-center">{cliente.quantidade}</td>
                      <td className="value">
                        R$ {cliente.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
