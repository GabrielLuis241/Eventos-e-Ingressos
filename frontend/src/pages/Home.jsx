// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { apiGet } from "../api";

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [indexDestaque, setIndexDestaque] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    if (salvo) {
      try {
        setUsuario(JSON.parse(salvo));
      } catch {
        setUsuario(null);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const dadosTeste = [
      {
        id: 1,
        nome: "Show ao Vivo",
        descricao: "Uma noite inesquecível com muita música e luzes.",
        data: "2025-06-13",
        horario: "20:00",
        local: "Arena Central",
        categoria: "show",
        imagem:
          "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 2,
        nome: "Peça de Teatro",
        descricao: "Espetáculo emocionante com elenco premiado.",
        data: "2025-06-20",
        horario: "19:30",
        local: "Teatro Municipal",
        categoria: "teatro",
        imagem:
          "https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 3,
        nome: "Palestra de Tecnologia",
        descricao: "Especialistas falando sobre inovação e futuro digital.",
        data: "2025-07-05",
        horario: "09:00",
        local: "Centro de Convenções",
        categoria: "palestra",
        imagem:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      },
    ];

    apiGet("/eventos/")
      .then((data) => {
        if (!mounted) return;
        if (!data || data.length === 0) {
          setEventos(dadosTeste);
        } else {
          setEventos(
            data.map((ev) => ({
              ...ev,
              categoria: ev.categoria || "outros",
            }))
          );
        }
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setEventos(dadosTeste);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categorias = useMemo(() => {
    const base = ["todos"];
    eventos.forEach((e) => {
      if (e.categoria && !base.includes(e.categoria)) base.push(e.categoria);
    });
    return base;
  }, [eventos]);

  const getCategoriaEmoji = (cat) => {
    if (cat === "show") return "🎵";
    if (cat === "teatro") return "🎭";
    if (cat === "palestra") return "🎤";
    return "⭐";
  };

  const eventosFiltrados = useMemo(() => {
    if (categoriaAtiva === "todos") return eventos;
    return eventos.filter((e) => e.categoria === categoriaAtiva);
  }, [eventos, categoriaAtiva]);

  const destaques = eventos.slice(0, 3);
  const destaqueAtual = destaques[indexDestaque] || null;

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuarioLogado");
    setUsuario(null);
    navigate("/");
  }

  if (loading) return <p>Carregando eventos...</p>;

  return (
    <div className="home-page">
      {/* TOPO ROXO FULL-WIDTH COM CONTAINER CENTRALIZADO */}
      <section className="top-header">
        <div className="top-header-inner">
          <div className="top-left">
            <h1 className="logo-main">EVENTOS+</h1>
            <p className="top-subtitle">
              Encontre e compre
              <br />
              ingressos para eventos
            </p>
          </div>

          <div className="top-right">
            {usuario ? (
              <>
                <span className="login-text">Olá, {usuario.username}</span>
                {usuario.tipo === "organizador" ? (
                  <>
                    <Link to="/admin/eventos" className="btn-link">
                      Gerenciar Eventos
                    </Link>
                    <Link to="/relatorios" className="btn-link">
                      Relatórios
                    </Link>
                  </>
                ) : (
                  <Link to="/perfil" className="btn-link">
                    Meu Perfil
                  </Link>
                )}
                <button className="btn-sair" onClick={handleLogout}>
                  sair
                </button>
              </>
            ) : (
              <span className="login-text">
                <Link to="/login">login</Link>
              </span>
            )}
            <div className="ticket-icon">🎫</div>
          </div>
        </div>
      </section>

      {/* CARROSSEL DE DESTAQUE */}
      <section className="carousel-wrapper">
        <div className="banner-section">
          {destaques[0] && (
            <div className="banner-item grande">
              <img src={destaques[0].imagem} alt={destaques[0].nome} />
            </div>
          )}

          {destaqueAtual && (
            <div className="banner-item centro">
              <img src={destaqueAtual.imagem} alt={destaqueAtual.nome} />
              <div className="banner-info">
                <h3>{destaqueAtual.nome}</h3>
                <p>
                  {destaqueAtual.data} • {destaqueAtual.horario}
                </p>
                <p>{destaqueAtual.local}</p>
              </div>
            </div>
          )}

          {destaques[2] && (
            <div className="banner-item grande">
              <img src={destaques[2].imagem} alt={destaques[2].nome} />
            </div>
          )}
        </div>

        <div className="carousel-dots">
          {destaques.map((d, idx) => (
            <span
              key={d.id}
              className={`dot ${idx === indexDestaque ? "active" : ""}`}
              onClick={() => setIndexDestaque(idx)}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIAS COM FILTRO */}
      <section className="categorias-section">
        <h2>Categoria</h2>
        <div className="categorias-row">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`categoria-card ${categoriaAtiva === cat ? "ativa" : ""
                }`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              <div className="categoria-avatar">
                <span>{getCategoriaEmoji(cat)}</span>
              </div>
              <span className="categoria-label">
                {cat === "todos" ? "Todos" : cat}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* LISTA DE EVENTOS */}
      <section id="eventos" className="eventos-section">
        <h2>Eventos</h2>

        {eventosFiltrados.length === 0 ? (
          <p>Nenhum evento encontrado para esta categoria.</p>
        ) : (
          <div className="eventos-grid">
            {eventosFiltrados.map((e) => (
              <div key={e.id} className="evento-card">
                {e.imagem && (
                  <img
                    src={e.imagem}
                    alt={e.nome}
                    className="evento-thumb"
                  />
                )}

                <div className="evento-info">
                  <h3>{e.nome}</h3>
                  <p className="meta">
                    {e.data} às {e.horario}
                  </p>
                  <p className="meta-local">{e.local}</p>
                  <Link to={`/evento/${e.id}`} className="btn-roxo">
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
