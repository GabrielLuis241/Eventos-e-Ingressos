// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { apiPost, apiGet } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const data = await apiPost("/login/", {
        username,
        password: senha,
      });

      const { access, refresh } = data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const perfil = await apiGet("/usuarios/perfil/");

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          id: perfil.id,
          username: perfil.username,
          email: perfil.email,
          tipo: perfil.tipo,
        })
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setErro("Falha no login. Verifique usuário e senha.");
    }
  };

  return (
    <div className="login-container">
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
          Organizador? <Link to="/cadastro/admin">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
