import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./Pagamento.css";
import { confirmarCompra } from "../api";

export default function PagamentoPix() {
  const navigate = useNavigate();
  const { purchaseId } = useParams();
  const location = useLocation();
  const { compra, evento } = location.state || {};
  
  const [loading, setLoading] = useState(false);

  const qrCode =
    "https://api.qrserver.com/v1/create-qr-code/?data=PagamentoPIX-Evento123&size=200x200";

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await confirmarCompra(purchaseId || compra?.id);
      alert("Pagamento confirmado com sucesso!");
      navigate("/confirmacao");
    } catch (err) {
      console.error(err);
      alert("Erro ao confirmar pagamento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagamento-container">
      <h2>Pagamento via PIX</h2>
      {evento && <p>Evento: <strong>{evento.nome}</strong></p>}
      {compra && <p>Quantidade: <strong>{compra.quantity}</strong> ingresso(s)</p>}
      {compra && <p>Valor total: <strong>R$ {compra.total_value?.toFixed(2)}</strong></p>}
      
      <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
      <img src={qrCode} alt="QR Code PIX" className="qr-code" />
      <p>Status: <strong>Aguardando pagamento...</strong></p>
      
      <button onClick={handleConfirmar} disabled={loading}>
        {loading ? "Confirmando..." : "Já paguei"}
      </button>
      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}
