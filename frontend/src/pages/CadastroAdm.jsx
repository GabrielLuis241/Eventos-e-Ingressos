import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import { registrarUsuario } from "../api";

export default function CadastroAdm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      await registrarUsuario(username, email, senha, "organizador");
      alert("Organizador cadastrado com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErro(
        err.message || "Erro ao cadastrar organizador. Verifique os dados ou tente mais tarde."
      );
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Organizador</h2>

      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome de usuário (login)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        Voltar ao Login
      </Link>
    </div>
  );
}
