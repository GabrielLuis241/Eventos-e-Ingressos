import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";



export default function CadastroAdm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    alert("Administrador cadastrado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Administrador</h2>
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar ADM</button>
      </form>
      <Link to="/login" className="voltar-link">
        Voltar ao Login
      </Link>
    </div>
  );
}
