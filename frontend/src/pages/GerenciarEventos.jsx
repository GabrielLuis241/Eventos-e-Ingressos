// src/pages/GerenciarEventos.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./GerenciarEventos.css";
import { listarEventos, criarEvento, removerEvento } from "../api";
import ImageCropper from "../components/ImageCropper";

export default function GerenciarEventos() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCropper, setMostrarCropper] = useState(false);
  const [imagemParaCrop, setImagemParaCrop] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    data: "",
    horario: "",
    local: "",
    ingressos_disponiveis: 0,
    preco: 0,
    imagem: null,
    imagemPreview: "",
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

  function handleImagemChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagemParaCrop(reader.result);
        setMostrarCropper(true);
      };
      reader.readAsDataURL(file);
    }
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  }

  function handleCropComplete(croppedBlob) {
    const croppedFile = new File([croppedBlob], 'imagem-evento.jpg', { type: 'image/jpeg' });
    setForm({
      ...form,
      imagem: croppedFile,
      imagemPreview: URL.createObjectURL(croppedBlob)
    });
    setMostrarCropper(false);
    setImagemParaCrop(null);
  }

  function handleCropCancel() {
    setMostrarCropper(false);
    setImagemParaCrop(null);
  }

  async function handleCriarEvento(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("descricao", form.descricao || "");
      formData.append("data", form.data);
      formData.append("horario", form.horario);
      formData.append("local", form.local);
      formData.append("capacidade", Number(form.ingressos_disponiveis || 0));
      formData.append("preco", Number(form.preco || 0));
      formData.append("categoria", form.categoria);

      if (form.imagem && form.imagem instanceof File) {
        formData.append("file", form.imagem);
      }

      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8000/admin/eventos/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const novo = await res.json();
      // Mapear para o formato do frontend
      const eventoMapeado = {
        id: novo.id,
        nome: novo.name,
        descricao: novo.description,
        data: novo.date,
        horario: novo.time,
        local: novo.location,
        imagem: novo.image,
        ingressos_disponiveis: novo.available_tickets,
        price: novo.price,
        categoria: novo.category,
      };

      setEventos((prev) => [...prev, eventoMapeado]);
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
        imagem: null,
        imagemPreview: "",
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
            <Link to="/admin/usuarios" className="btn-usuarios">👥 Usuários</Link>
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

              <label>Imagem do Evento (opcional)</label>
              <div className="upload-imagem">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                  id="upload-imagem"
                  className="input-file"
                />
                <label htmlFor="upload-imagem" className="btn-upload">
                  📷 Escolher Imagem
                </label>
                {form.imagemPreview && (
                  <div className="preview-imagem">
                    <img src={form.imagemPreview} alt="Preview" />
                    <button
                      type="button"
                      className="btn-remover-img"
                      onClick={() => setForm({ ...form, imagem: null, imagemPreview: "" })}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

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

      {/* Modal de Cortar Imagem */}
      {mostrarCropper && imagemParaCrop && (
        <ImageCropper
          imageSrc={imagemParaCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={16 / 9}
        />
      )}
    </div>
  );
}
