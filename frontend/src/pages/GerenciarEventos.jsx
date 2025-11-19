import React, { useEffect, useState } from "react";
import "./GerenciarEventos.css";
import { apiGet, apiPost } from "../api";

export default function GerenciarEventos() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    data: "",
    hora: "",
    local: "",
    cidade: "",
    preco: "",
    organizador: "",
    ingressos: "",
    imagem: "",
    descricao: "",
  });

  useEffect(() => {
    apiGet("/eventos/")
      .then((res) => setEventos(res))
      .catch(() => console.warn("Não foi possível carregar eventos."));
  }, []);

  function atualizarForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function criarEvento(e) {
    e.preventDefault();

    try {
      await apiPost("/eventos/criar/", form);
      alert("Evento criado com sucesso!");
      setMostrarModal(false);
    } catch (err) {
      alert("Erro ao criar evento.");
      console.error(err);
    }
  }

  async function excluirEvento(id) {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await apiPost(`/eventos/remover/${id}/`);
      setEventos(eventos.filter((ev) => ev.id !== id));
      alert("Evento removido!");
    } catch (err) {
      alert("Erro ao excluir evento.");
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
            <img src={evento.imagem} alt={evento.titulo} />
            <div className="info">
              <h3>{evento.titulo}</h3>
              <p>{evento.data} — {evento.hora}</p>
            </div>

            <button
              onClick={() => excluirEvento(evento.id)}
              className="btn-excluir"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-bg">
          <div className="modal">
            <button className="fechar" onClick={() => setMostrarModal(false)}>
              ✖
            </button>

            <h2>Criar Novo Evento</h2>

            <form onSubmit={criarEvento} className="form-modal">
              <div className="row">
                <div className="col">
                  <label>Título do Evento *</label>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={atualizarForm}
                    required
                  />
                </div>

                <div className="col">
                  <label>Organizador</label>
                  <input
                    type="text"
                    name="organizador"
                    value={form.organizador}
                    onChange={atualizarForm}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label>Categoria *</label>
                  <input
                    type="text"
                    name="categoria"
                    value={form.categoria}
                    onChange={atualizarForm}
                    required
                  />
                </div>

                <div className="col">
                  <label>Horário *</label>
                  <input
                    type="time"
                    name="hora"
                    value={form.hora}
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
                  <label>Cidade *</label>
                  <input
                    type="text"
                    name="cidade"
                    value={form.cidade}
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
                    name="ingressos"
                    value={form.ingressos}
                    onChange={atualizarForm}
                    required
                  />
                </div>
              </div>

              <label>Preço (R$) *</label>
              <input
                type="number"
                name="preco"
                value={form.preco}
                onChange={atualizarForm}
                required
              />

              <label>URL da Imagem</label>
              <input
                type="text"
                name="imagem"
                value={form.imagem}
                onChange={atualizarForm}
              />

              <label>Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
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
              Cancelar Evento
           </button>
             </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
