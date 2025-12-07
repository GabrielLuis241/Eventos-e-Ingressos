// src/pages/Relatorios.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Relatorios.css";

export default function Relatorios() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Mock data - preparado para receber do backend
  const [relatorios, setRelatorios] = useState({
    totalVendas: 45750.00,
    totalIngressos: 183,
    totalEventos: 5,
    vendasPorEvento: [
      {
        id: 1,
        nomeEvento: "Show ao Vivo",
        ingressosVendidos: 85,
        valorTotal: 21250.00,
        data: "2025-06-13"
      },
      {
        id: 2,
        nomeEvento: "Peça de Teatro",
        ingressosVendidos: 42,
        valorTotal: 8400.00,
        data: "2025-06-20"
      },
      {
        id: 3,
        nomeEvento: "Palestra de Tecnologia",
        ingressosVendidos: 56,
        valorTotal: 16100.00,
        data: "2025-07-05"
      }
    ],
    clientes: [
      {
        id: 1,
        nome: "João Silva",
        email: "joao@email.com",
        evento: "Show ao Vivo",
        quantidade: 2,
        valorTotal: 500.00,
        dataCompra: "2025-05-15"
      },
      {
        id: 2,
        nome: "Maria Santos",
        email: "maria@email.com",
        evento: "Peça de Teatro",
        quantidade: 4,
        valorTotal: 800.00,
        dataCompra: "2025-05-18"
      },
      {
        id: 3,
        nome: "Pedro Oliveira",
        email: "pedro@email.com",
        evento: "Palestra de Tecnologia",
        quantidade: 1,
        valorTotal: 150.00,
        dataCompra: "2025-05-20"
      },
      {
        id: 4,
        nome: "Ana Costa",
        email: "ana@email.com",
        evento: "Show ao Vivo",
        quantidade: 3,
        valorTotal: 750.00,
        dataCompra: "2025-05-22"
      },
      {
        id: 5,
        nome: "Carlos Ferreira",
        email: "carlos@email.com",
        evento: "Palestra de Tecnologia",
        quantidade: 2,
        valorTotal: 300.00,
        dataCompra: "2025-05-25"
      }
    ]
  });

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    if (!salvo) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(salvo);
      if (user.tipo !== "organizador") {
        alert("Acesso negado. Apenas organizadores podem acessar relatórios.");
        navigate("/");
        return;
      }
      setUsuario(user);
    } catch {
      navigate("/login");
    }

    // Simulação de auto-update (polling)
    const intervalId = setInterval(() => {
      // Aqui você faria o fetch real: fetchRelatorios();

      // Simulando atualização dos dados para demonstrar o recurso visualmente
      setRelatorios(prev => ({
        ...prev,
        totalVendas: prev.totalVendas + (Math.random() > 0.5 ? 150 : 0),
        totalIngressos: prev.totalIngressos + (Math.random() > 0.5 ? 1 : 0)
      }));
    }, 5000); // Atualiza a cada 5 segundos para demonstração (na vida real seria 30s ou mais)

    // Cleanup do intervalo ao desmontar
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Função preparada para integração com backend
  const fetchRelatorios = async () => {
    try {
      // const data = await apiGet("/relatorios/");
      // setRelatorios(data);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
    }
  };

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  if (!usuario) {
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
          </div>
        </section>

        {/* Lista de Clientes */}
        <section className="table-section">
          <div className="section-header">
            <h2>👥 Clientes que Compraram Ingressos</h2>
          </div>
          <div className="table-wrapper">
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
          </div>
        </section>
      </div>
    </div>
  );
}
