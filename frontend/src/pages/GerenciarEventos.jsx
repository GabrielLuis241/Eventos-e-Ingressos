// src/pages/GerenciarEventos.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    preco: 0,
    imagem: "",
    categoria: "show",
  });

  const navigate = useNavigate();

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
      total_tickets: Number(form.ingressos_disponiveis || 0),
      price: Number(form.preco || 0),
      imagem: form.imagem,
      categoria: form.categoria,
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
        preco: 0,
        imagem: "",
        categoria: "show",
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
    <div className="gerenciar-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="titulo">🎭 Gerenciar Eventos</h1>
            <p className="subtitulo">Crie, edite e gerencie seus eventos</p>
          </div>
          <div className="header-actions">
            <Link to="/" className="btn-voltar">← Home</Link>
            <Link to="/cadastro/admin" className="btn-novo-admin">👨‍💼 Novo Admin</Link>
            <Link to="/relatorios" className="btn-relatorios">📊 Relatórios</Link>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <button
          className="btn-roxo-criar"
          onClick={() => setMostrarModal(true)}
        >
          ➕ Criar Novo Evento
        </button>

        {/* GRID DE CARDS ESTILO HOME */}
        <section className="eventos-section-admin">
          {eventos.length === 0 ? (
            <div className="no-events-admin">
              <p>📅 Você ainda não criou nenhum evento.</p>
              <p>Clique no botão acima para começar!</p>
            </div>
          ) : (
            <div className="eventos-grid-admin">
              {eventos.map((evento) => (
                <div key={evento.id} className="evento-card-admin">
                  <div className="evento-imagem-admin">
                    <img 
                      src={evento.imagem || 'https://via.placeholder.com/400x200?text=Sem+Imagem'} 
                      alt={evento.nome}
                    />
                    <div className="acoes-overlay">
                      <button
                        className="btn-editar-admin"
                        onClick={() => navigate(`/admin/eventos/${evento.id}/editar`)}
                        title="Editar evento"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-excluir-admin"
                        onClick={() => handleExcluirEvento(evento.id)}
                        title="Excluir evento"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>

                  <div className="evento-info-admin">
                    <h3>{evento.nome}</h3>
                    <p className="meta-admin">
                      📅 {evento.data} às {evento.horario}
                    </p>
                    <p className="meta-local-admin">📍 {evento.local}</p>
                    <div className="evento-stats">
                      <span className="stat">
                        🎫 {evento.ingressos_disponiveis || 0} disponíveis
                      </span>
                      <span className="stat">
                        💰 R$ {(evento.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODAL DE CRIAR EVENTO */}
      {mostrarModal && (
        <div className="modal-bg">
          <div className="modal">
            <button
              className="fechar"
              onClick={() => setMostrarModal(false)}
            >
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

              <div className="row">
                <div className="col">
                  <label>Preço do Ingresso (R$) *</label>
                  <input
                    type="number"
                    name="preco"
                    value={form.preco}
                    onChange={atualizarForm}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Ex: 50.00"
                  />
                </div>

                <div className="col">
                  <label>Categoria *</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={atualizarForm}
                    required
                  >
                    <option value="show">🎵 Show</option>
                    <option value="teatro">🎭 Teatro</option>
                    <option value="palestra">🎤 Palestra</option>
                    <option value="festa">🎉 Festa</option>
                    <option value="esporte">⚽ Esporte</option>
                    <option value="outros">📅 Outros</option>
                  </select>
                </div>
              </div>

              <label>Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={atualizarForm}
                rows="4"
                placeholder="Descreva o evento..."
              />

              <label>URL da Imagem (opcional)</label>
              <input
                type="text"
                name="imagem"
                value={form.imagem}
                onChange={atualizarForm}
                placeholder="https://exemplo.com/imagem.jpg"
              />

              <div className="botoes-modal">
                <button type="submit" className="btn-roxo-criar">
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
