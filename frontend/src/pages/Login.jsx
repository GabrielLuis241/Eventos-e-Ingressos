import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [tipoLogin, setTipoLogin] = useState("usuario"); // valor inicial
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const adms = JSON.parse(localStorage.getItem("adms")) || [];

    let usuarioEncontrado;
    if (tipoLogin === "usuario") {
      usuarioEncontrado = usuarios.find((u) => u.email === email && u.senha === senha);
    } else if (tipoLogin === "organizador") {
      usuarioEncontrado = adms.find((a) => a.email === email && a.senha === senha);
    }

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...usuarioEncontrado, tipo: tipoLogin }));
      // depois do login, redirecionar conforme tipo
      if (tipoLogin === "usuario") {
        navigate("/"); // home usuário, lista de eventos para compra
      } else if (tipoLogin === "organizador") {
        navigate("/admin/eventos"); // admin colaborador, gerenciar eventos
      }
      return;
    }
    setErro("E-mail ou senha incorretos para o tipo selecionado");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <div className="tipo-login">
        <button
          type="button"
          onClick={() => setTipoLogin("usuario")}
          className={tipoLogin === "usuario" ? "ativo" : ""}
        >
          Usuário
        </button>
        <button
          type="button"
          onClick={() => setTipoLogin("organizador")}
          className={tipoLogin === "organizador" ? "ativo" : ""}
        >
          Organizador
        </button>
      </div>

      <form onSubmit={handleLogin}>
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
        <button type="submit">Entrar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <div className="cadastro-links">
        <p>
          Não tem conta? <Link to="/cadastro/usuario">Cadastrar Usuário</Link>
        </p>
      </div>
    </div>
  );
}
