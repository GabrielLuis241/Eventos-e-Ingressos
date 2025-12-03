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
      // 1. Login na API -> recebe tokens JWT
      const data = await apiPost("/login/", {
        username,
        password: senha,
      });

      const { access, refresh } = data;

      // 2. Guardar tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // 3. Buscar perfil autenticado (usa Authorization automático do apiGet)
      const perfil = await apiGet("/usuarios/perfil/");

      // 4. Guardar usuário logado
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          id: perfil.id,
          username: perfil.username,
          email: perfil.email,
          tipo: perfil.tipo, // "cliente" ou "organizador"
        })
      );

      // 5. Redirecionar conforme tipo
      if (perfil.tipo === "organizador") {
        navigate("/");
      } else {
        navigate("/");
      }
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

      {erro && <p className="erro">{erro}</p>}

      <div className="cadastro-links">
        <p>
          Não tem conta?{" "}
          <Link to="/cadastro/usuario">Cadastrar Usuário (cliente)</Link>
        </p>
        <p>
          É organizador e ainda não tem conta?{" "}
          <Link to="/cadastro/admin">Cadastrar Organizador</Link>
        </p>
      </div>
    </div>
  );
}
