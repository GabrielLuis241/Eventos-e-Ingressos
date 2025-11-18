import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const adms = JSON.parse(localStorage.getItem("adms")) || [];

    const usuarioEncontrado =
      usuarios.find((u) => u.email === email && u.senha === senha) ||
      adms.find((a) => a.email === email && a.senha === senha);

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

      navigate("/"); 
      return;
    }

    setErro("E-mail ou senha incorretos");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        <p>
          É administrador? <Link to="/cadastro/adm">Cadastrar ADM</Link>
        </p>
      </div>
    </div>
  );
}
