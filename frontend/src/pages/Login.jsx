// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { fazerLogin } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      // A função fazerLogin já armazena tudo no localStorage
      await fazerLogin(username, senha);

      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setErro("Falha no login. Verifique usuário e senha.");
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="btn-voltar-top">← Voltar</Link>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {erro && <div className="erro">{erro}</div>}

      <div className="cadastro-links">
        <p>
          Não tem conta? <Link to="/cadastro/usuario">Cadastre-se</Link>
        </p>
        <p>
        </p>
      </div>
    </div>
  );
}
