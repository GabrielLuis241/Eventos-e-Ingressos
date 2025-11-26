import React, { useEffect, useState } from "react";
import "./GerenciarEventos.css";
import { listarEventos, criarEvento, removerEvento } from "../api";

export default function GerenciarEventos() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    data: "",
    horario: "",
    local: "",
    ingressos_disponiveis: 0,
    imagem: "",
  });

  useEffect(() => {
    listarEventos()
      .then(setEventos)
      .catch(() => console.warn("Não foi possível carregar eventos."));
  }, []);

  function atualizarForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCriarEvento(e) {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      data: form.data,
      horario: form.horario,
      local: form.local,
      ingressos_disponiveis: Number(form.ingressos_disponiveis || 0),
      imagem: form.imagem,
    };

    try {
      const novo = await criarEvento(payload);
      setEventos((prev) => [...prev, novo]);
      alert("Evento criado com sucesso!");
      setMostrarModal(false);
      setForm({
        nome: "",
        descricao: "",
        data: "",
        horario: "",
        local: "",
        ingressos_disponiveis: 0,
        imagem: "",
      });
    } catch (err) {
      alert("Erro ao criar evento.");
      console.error(err);
    }
  }

  async function handleExcluirEvento(id) {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await removerEvento(id);
      setEventos((prev) => prev.filter((ev) => ev.id !== id));
      alert("Evento removido!");
    } catch (err) {
      alert("Erro ao excluir evento.");
      console.error(err);
    }
  }

  return (
    <div className="gerenciar-container">
      <h1 className="titulo">Gerenciar Eventos</h1>

      <button className="btn-roxo" onClick={() => setMostrarModal(true)}>
        Criar Novo Evento
      </button>

      <div className="lista-eventos">
        {eventos.map((evento) => (
          <div key={evento.id} className="card-evento">
            {evento.imagem && (
              <img src={evento.imagem} alt={evento.nome} />
            )}
            <div className="info">
              <h3>{evento.nome}</h3>
              <p>
                {evento.data} — {evento.horario}
              </p>
              <p>{evento.local}</p>
            </div>

            <button
              onClick={() => handleExcluirEvento(evento.id)}
              className="btn-excluir"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="modal-bg">
          <div className="modal">
            <button className="fechar" onClick={() => setMostrarModal(false)}>
              ✖
            </button>

            <h2>Criar Novo Evento</h2>

            <form onSubmit={handleCriarEvento} className="form-modal">
              <div className="row">
                <div className="col">
                  <label>Nome do Evento *</label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={atualizarForm}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label>Data *</label>
                  <input
                    type="date"
                    name="data"
                    value={form.data}
                    onChange={atualizarForm}
                    required
                  />
                </div>

                <div className="col">
                  <label>Horário *</label>
                  <input
                    type="time"
                    name="horario"
                    value={form.horario}
                    onChange={atualizarForm}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label>Local *</label>
                  <input
                    type="text"
                    name="local"
                    value={form.local}
                    onChange={atualizarForm}
                    required
                  />
                </div>

                <div className="col">
                  <label>Ingressos Disponíveis *</label>
                  <input
                    type="number"
                    name="ingressos_disponiveis"
                    value={form.ingressos_disponiveis}
                    onChange={atualizarForm}
                    required
                    min="0"
                  />
                </div>
              </div>

              <label>Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={atualizarForm}
              />

              <label>URL da Imagem (opcional)</label>
              <input
                type="text"
                name="imagem"
                value={form.imagem}
                onChange={atualizarForm}
              />

              <div className="botoes-modal">
                <button type="submit" className="btn-roxo">
                  Criar Evento
                </button>

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
