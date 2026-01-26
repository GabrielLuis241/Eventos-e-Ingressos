import React, { useEffect, useState } from "react";
import { buscarEventoPorId, atualizarEvento } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import ImageCropper from "../components/ImageCropper";

export default function EditarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState("");
  const [novaImagem, setNovaImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState("");
  const [mostrarCropper, setMostrarCropper] = useState(false);
  const [imagemParaCrop, setImagemParaCrop] = useState(null);

  useEffect(() => {
    buscarEventoPorId(id)
      .then((res) => {
        setForm(res);
        // Se já tem imagem, mostra preview
        if (res.imagem) {
          const imgUrl = res.imagem.startsWith('http') 
            ? res.imagem 
            : `http://localhost:8000${res.imagem}`;
          setImagemPreview(imgUrl);
        }
      })
      .catch(() => alert("Erro ao carregar evento."));
  }, [id]);

  function atualizar(e) {
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
    e.target.value = '';
  }

  function handleCropComplete(croppedBlob) {
    const croppedFile = new File([croppedBlob], 'imagem-evento.jpg', { type: 'image/jpeg' });
    setNovaImagem(croppedFile);
    setImagemPreview(URL.createObjectURL(croppedBlob));
    setMostrarCropper(false);
    setImagemParaCrop(null);
  }

  function handleCropCancel() {
    setMostrarCropper(false);
    setImagemParaCrop(null);
  }

  function removerImagem() {
    setNovaImagem(null);
    setImagemPreview("");
    setForm({ ...form, imagem: "" });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!form.nome || !form.data) {
      setErro("Campos obrigatórios precisam ser preenchidos.");
      return;
    }

    try {
      // Se tem nova imagem, usa FormData
      if (novaImagem) {
        const formData = new FormData();
        formData.append("nome", form.nome);
        formData.append("descricao", form.descricao || "");
        formData.append("data", form.data);
        formData.append("horario", form.horario || "");
        formData.append("local", form.local);
        formData.append("capacidade", Number(form.ingressos_disponiveis || form.total_tickets || 0));
        formData.append("preco", Number(form.preco || form.price || 0));
        formData.append("categoria", form.categoria || "outros");
        formData.append("file", novaImagem);

        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8000/admin/eventos/${id}/upload`, {
          method: "PUT",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Erro ao atualizar evento");
        }
      } else {
        // Sem nova imagem, usa JSON normal
        const payload = {
          nome: form.nome,
          descricao: form.descricao,
          data: form.data,
          horario: form.horario,
          local: form.local,
          total_tickets: Number(form.ingressos_disponiveis || form.total_tickets || 0),
          price: Number(form.preco || form.price || 0),
          categoria: form.categoria || "outros",
        };
        await atualizarEvento(id, payload);
      }

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
          value={form.ingressos_disponiveis || form.available_tickets || 0}
          onChange={atualizar}
        />

        <label>Preço do Ingresso (R$) *</label>
        <input
          type="number"
          name="preco"
          value={form.preco || form.price || 0}
          onChange={atualizar}
          step="0.01"
          min="0"
        />

        <label>Categoria</label>
        <select
          name="categoria"
          value={form.categoria || "outros"}
          onChange={atualizar}
        >
          <option value="show">🎵 Show</option>
          <option value="teatro">🎭 Teatro</option>
          <option value="palestra">🎤 Palestra</option>
          <option value="festa">🎉 Festa</option>
          <option value="esporte">⚽ Esporte</option>
          <option value="outros">📅 Outros</option>
        </select>

        <label>Descrição</label>
        <textarea
          name="descricao"
          value={form.descricao || ""}
          onChange={atualizar}
        />

        <label>Imagem do Evento</label>
        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            id="upload-imagem-edit"
            className="input-file-hidden"
          />
          <label htmlFor="upload-imagem-edit" className="btn-upload-img">
            📷 {imagemPreview ? "Trocar Imagem" : "Escolher Imagem"}
          </label>
          
          {imagemPreview && (
            <div className="preview-container">
              <img src={imagemPreview} alt="Preview" className="preview-img" />
              <button type="button" className="btn-remover" onClick={removerImagem}>
                ✕
              </button>
            </div>
          )}
        </div>

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
        .form-evento select {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        .upload-container {
          margin-bottom: 15px;
        }
        .input-file-hidden {
          display: none;
        }
        .btn-upload-img {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #6a0dad, #8b5cf6);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-upload-img:hover {
          background: linear-gradient(135deg, #5c0d9a, #7c4dff);
          transform: translateY(-2px);
        }
        .preview-container {
          position: relative;
          display: inline-block;
          margin-top: 12px;
          max-width: 200px;
        }
        .preview-img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .btn-remover {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,0,0,0.8);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-remover:hover {
          background: red;
        }
      `}</style>

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
