import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Confirmacao.css";
import { apiGet } from "../api";

export default function ConfirmacaoCompra() {
  const navigate = useNavigate();
  const location = useLocation();
  const { purchaseId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState(null);
  const [ticketAtual, setTicketAtual] = useState(0);

  useEffect(() => {
    if (purchaseId) {
      carregarTickets();
    } else {
      setLoading(false);
    }
  }, [purchaseId]);

  async function carregarTickets() {
    try {
      const data = await apiGet(`/tickets/compra/${purchaseId}`);
      setDados(data);
    } catch (err) {
      console.error("Erro ao carregar tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatarCodigo(codigo) {
    // Mostra os primeiros 8 caracteres do UUID em maiúsculo
    if (!codigo) return "";
    return codigo.substring(0, 8).toUpperCase();
  }

  function handleBaixar() {
    window.print();
  }

  function proximoTicket() {
    if (dados?.tickets && ticketAtual < dados.tickets.length - 1) {
      setTicketAtual(ticketAtual + 1);
    }
  }

  function ticketAnterior() {
    if (ticketAtual > 0) {
      setTicketAtual(ticketAtual - 1);
    }
  }

  if (loading) {
    return (
      <div className="confirmacao-container">
        <div className="loading">Carregando seus ingressos...</div>
      </div>
    );
  }

  if (!dados || !dados.tickets || dados.tickets.length === 0) {
    return (
      <div className="confirmacao-container">
        <h2>🎟️ Compra Confirmada!</h2>
        <p>Seu ingresso foi gerado com sucesso.</p>
        <p className="aviso">Os detalhes estão disponíveis em "Meus Ingressos" no seu perfil.</p>
        <div className="acoes">
          <button onClick={() => navigate("/perfil")}>Ver Meus Ingressos</button>
          <button onClick={() => navigate("/")}>Voltar à Home</button>
        </div>
      </div>
    );
  }

  const ticket = dados.tickets[ticketAtual];
  const evento = dados.evento;
  const totalTickets = dados.tickets.length;

  // URL do QR Code - usando API externa baseada no código único
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ticket.unique_code}&size=200x200`;

  return (
    <div className="confirmacao-container">
      <h2>🎟️ Compra Confirmada!</h2>

      {evento && (
        <div className="evento-info">
          <h3>{evento.nome}</h3>
          <p>📅 {evento.data} às {evento.horario}</p>
          <p>📍 {evento.local}</p>
        </div>
      )}

      <p className="instrucao">Apresente este QR Code na entrada do evento.</p>

      <div className="ticket-card">
        <div className="codigo-ingresso">
          <span className="label">Código do Ingresso:</span>
          <span className="codigo">{formatarCodigo(ticket.unique_code)}</span>
        </div>

        <img src={qrCodeUrl} alt="QR Code do Ingresso" className="qr-code" />

        <div className="codigo-completo">
          <small>Código completo: {ticket.unique_code}</small>
        </div>
      </div>

      {totalTickets > 1 && (
        <div className="navegacao-tickets">
          <button
            onClick={ticketAnterior}
            disabled={ticketAtual === 0}
            className="btn-nav"
          >
            ← Anterior
          </button>
          <span className="contador">
            Ingresso {ticketAtual + 1} de {totalTickets}
          </span>
          <button
            onClick={proximoTicket}
            disabled={ticketAtual === totalTickets - 1}
            className="btn-nav"
          >
            Próximo →
          </button>
        </div>
      )}

      <div className="acoes">
        <button onClick={handleBaixar}>📥 Baixar Ingresso</button>
        <button onClick={() => navigate("/")}>Voltar à Home</button>
      </div>
    </div>
  );
}
