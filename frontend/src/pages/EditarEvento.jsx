import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    apiGet(`/eventos/${id}/`)
      .then((res) => setForm(res))
      .catch(() => alert("Erro ao carregar evento."));
  }, [id]);

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!form.titulo || !form.data) {
      setErro("Campos obrigatórios precisam ser preenchidos.");
      return;
    }

    try {
      await apiPost(`/eventos/editar/${id}/`, form);
      alert("Evento atualizado!");
      navigate("/admin/eventos");
    } catch {
      alert("Erro ao atualizar.");
    }
  }

  if (!form) return <p>Carregando...</p>;

  return (
    <div className="container-form">
      <h2>Editar Evento</h2>

      <form onSubmit={salvar} className="form-evento">
        <label>Título *</label>
        <input name="titulo" value={form.titulo} onChange={atualizar} />

        <label>Categoria</label>
        <input name="categoria" value={form.categoria} onChange={atualizar} />

        <label>Data *</label>
        <input type="date" name="data" value={form.data} onChange={atualizar} />

        <label>Hora *</label>
        <input type="time" name="hora" value={form.hora} onChange={atualizar} />

        <label>Local *</label>
        <input name="local" value={form.local} onChange={atualizar} />

        <label>Cidade *</label>
        <input name="cidade" value={form.cidade} onChange={atualizar} />

        <label>Preço *</label>
        <input name="preco" value={form.preco} onChange={atualizar} />

        <label>Ingressos *</label>
        <input name="ingressos" value={form.ingressos} onChange={atualizar} />

        <label>Descrição</label>
        <textarea name="descricao" value={form.descricao} onChange={atualizar} />

        <div className="botoes">
          <button type="submit" className="btn-roxo">
            Salvar Alterações
          </button>

          <button className="btn-cancelar" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>

        {erro && <p className="erro">{erro}</p>}
      </form>

      <style jsx>{`
        .container-form {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(106, 13, 173, 0.2);
        }
        h2 {
          color: #6A0DAD;
          text-align: center;
          margin-bottom: 20px;
        }
        .form-evento label {
          font-weight: bold;
          color: #444;
        }
        .form-evento input,
        .form-evento textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        .botoes {
          display: flex;
          justify-content: space-between;
        }
        .btn-roxo {
          background: #6A0DAD;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-cancelar {
          background: #b30000;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .erro {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
