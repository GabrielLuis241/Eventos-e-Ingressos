import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pagamento.css";

export default function PagamentoPix() {
  const navigate = useNavigate();
  const qrCode =
    "https://api.qrserver.com/v1/create-qr-code/?data=PagamentoPIX-Evento123&size=200x200";

  return (
    <div className="pagamento-container">
      <h2>Pagamento via PIX</h2>
      <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
      <img src={qrCode} alt="QR Code PIX" className="qr-code" />
      <p>Status: <strong>Aguardando pagamento...</strong></p>
      <button onClick={() => navigate("/confirmacao")}>Já paguei</button>
      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}
