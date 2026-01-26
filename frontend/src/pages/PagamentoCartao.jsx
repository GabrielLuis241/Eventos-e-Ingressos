import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./Pagamento.css";
import { confirmarCompra } from "../api";

export default function PagamentoCartao() {
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { purchaseId } = useParams();
  const location = useLocation();
  const { compra, evento } = location.state || {};

  const handlePagamento = async (e) => {
    e.preventDefault();
    if (numero.length < 16 || !validade || cvv.length < 3) {
      alert("Preencha os dados corretamente.");
      return;
    }

    setLoading(true);
    try {
      await confirmarCompra(purchaseId || compra?.id);
      alert("Pagamento aprovado!");
      navigate("/confirmacao", { state: { purchaseId: purchaseId || compra?.id } });
    } catch (err) {
      console.error(err);
      alert("Erro ao processar pagamento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagamento-container">
      <h2>Pagamento com Cartão</h2>
      {evento && <p>Evento: <strong>{evento.nome}</strong></p>}
      {compra && <p>Quantidade: <strong>{compra.quantity}</strong> ingresso(s)</p>}
      {compra && <p>Valor total: <strong>R$ {compra.total_value?.toFixed(2)}</strong></p>}

      <form onSubmit={handlePagamento}>
        <input
          type="text"
          placeholder="Número do cartão"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />
        <input
          type="text"
          placeholder="Validade (MM/AA)"
          value={validade}
          onChange={(e) => setValidade(e.target.value)}
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : "Confirmar Pagamento"}
        </button>
      </form>
      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}
