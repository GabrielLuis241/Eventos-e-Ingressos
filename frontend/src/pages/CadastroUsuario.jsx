import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailExiste = usuarios.some((u) => u.email === email);
    if (emailExiste) {
      setErro("Este e-mail já está cadastrado.");
      return;
    }

    const novoUsuario = { nome, email, senha };

    usuarios.push(novoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuário cadastrado com sucesso!");

    navigate("/login"); 
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Usuário</h2>

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

        <button type="submit">Cadastrar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <Link to="/login" className="voltar-link">
        Já tenho conta
      </Link>
    </div>
  );
}
