import React from "react";
import { useNavigate } from "react-router-dom";
import "./Confirmacao.css";

export default function ConfirmacaoCompra() {
  const navigate = useNavigate();
  const ingressoQr =
    "https://api.qrserver.com/v1/create-qr-code/?data=IngressoDigital-Evento123&size=200x200";

  return (
    <div className="confirmacao-container">
      <h2>🎟️ Compra Confirmada!</h2>
      <p>Apresente este QR Code na entrada do evento.</p>
      <img src={ingressoQr} alt="Ingresso QR Code" className="qr-code" />

      <div className="acoes">
        <button onClick={() => window.print()}>Baixar Ingresso</button>
        <button onClick={() => navigate("/")}>Voltar à Home</button>
      </div>
    </div>
  );
}
