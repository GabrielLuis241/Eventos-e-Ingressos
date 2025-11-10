import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pagamento.css";

export default function PagamentoCartao() {
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();

  const handlePagamento = (e) => {
    e.preventDefault();
    if (numero.length < 16 || !validade || cvv.length < 3) {
      alert("Preencha os dados corretamente.");
      return;
    }
    alert("Pagamento aprovado!");
    navigate("/confirmacao");
  };

  return (
    <div className="pagamento-container">
      <h2>Pagamento com Cartão</h2>
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
        <button type="submit">Confirmar Pagamento</button>
      </form>
      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}
