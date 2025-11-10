import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CompraIngresso.css";

export default function CompraIngresso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState(1);
  const [nome, setNome] = useState("");

  const handleAvancar = () => {
    if (!nome) {
      alert("Informe o nome do comprador!");
      return;
    }
    navigate("/pagamento/cartao", { state: { id, nome, quantidade } });
  };

  return (
    <div className="compra-container">
      <h2>Comprar Ingresso — Evento #{id}</h2>

      <label>Nome do comprador:</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Digite seu nome"
      />

      <label>Quantidade:</label>
      <input
        type="number"
        min="1"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <div className="opcoes-pagamento">
        <button onClick={() => navigate("/pagamento/cartao")}>
          Pagar com Cartão
        </button>
        <button onClick={() => navigate("/pagamento/pix")}>Pagar com PIX</button>
      </div>

      <button className="voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}
