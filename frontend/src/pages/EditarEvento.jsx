import React, { useEffect, useState } from "react";
import { buscarEventoPorId, atualizarEvento } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarEventoPorId(id)
      .then((res) => setForm(res))
      .catch(() => alert("Erro ao carregar evento."));
  }, [id]);

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!form.nome || !form.data) {
      setErro("Campos obrigatórios precisam ser preenchidos.");
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      data: form.data,
      horario: form.horario,
      local: form.local,
      ingressos_disponiveis: Number(form.ingressos_disponiveis || 0),
    };

    try {
      await atualizarEvento(id, payload);
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
        <label>Nome *</label>
        <input name="nome" value={form.nome || ""} onChange={atualizar} />

        <label>Data *</label>
        <input
          type="date"
          name="data"
          value={form.data || ""}
          onChange={atualizar}
        />

        <label>Hora *</label>
        <input
          type="time"
          name="horario"
          value={form.horario || ""}
          onChange={atualizar}
        />

        <label>Local *</label>
        <input name="local" value={form.local || ""} onChange={atualizar} />

        <label>Ingressos *</label>
        <input
          type="number"
          name="ingressos_disponiveis"
          value={form.ingressos_disponiveis || 0}
          onChange={atualizar}
        />

        <label>Descrição</label>
        <textarea
          name="descricao"
          value={form.descricao || ""}
          onChange={atualizar}
        />

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
          color: #6a0dad;
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
          background: #6a0dad;
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
