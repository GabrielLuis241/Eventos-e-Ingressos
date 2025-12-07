// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { apiGet } from "../api";

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [usuario, setUsuario] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
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

  // Auto-rotate carousel
  useEffect(() => {
    if (eventos.length <= 1) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % Math.min(eventos.length, 5));
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, [eventos.length]);

  // Categorias fixas
  const categorias = ["todos", "show", "teatro", "palestra", "festa", "esporte", "outros"];

  const getCategoriaEmoji = (cat) => {
    if (cat === "todos") return "⭐";
    if (cat === "show") return "🎵";
    if (cat === "teatro") return "🎭";
    if (cat === "palestra") return "🎤";
    if (cat === "festa") return "🎉";
    if (cat === "esporte") return "⚽";
    return "📅";
  };

  const eventosFiltrados = useMemo(() => {
    if (categoriaAtiva === "todos") return eventos;
    return eventos.filter((e) => e.categoria === categoriaAtiva);
  }, [eventos, categoriaAtiva]);

  const destaques = eventos.slice(0, 5);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuarioLogado");
    setUsuario(null);
    navigate("/");
  }

  if (loading) return <div className="loading-screen">Carregando...</div>;

  return (
    <div className="home-page">
      {/* HEADER ROXO */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>EVENTOS+</h1>
            <p>Encontre e compre<br />ingressos para eventos</p>

            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Buscar eventos..." />
            </div>
          </div>

          <div className="header-actions">
            {usuario ? (
              <>
                <span className="user-greeting">Olá, {usuario.username}</span>
                <div className="nav-buttons">
                  {usuario.tipo === "organizador" ? (
                    <>
                      <Link to="/admin/eventos" className="nav-btn">Gerenciar Eventos</Link>
                      <Link to="/relatorios" className="nav-btn">Relatórios</Link>
                    </>
                  ) : (
                    <Link to="/perfil" className="nav-btn">Meu Perfil</Link>
                  )}
                  <button onClick={handleLogout} className="nav-btn logout-btn">Sair</button>
                </div>
              </>
            ) : (
              <Link to="/login" className="login-btn">Entrar</Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION - 3 IMAGENS COM INFORMAÇÕES */}
      <section className="hero-section">
        <div className="hero-grid">
          {destaques[carouselIndex] && (
            <div className="hero-card">
              <img src={destaques[carouselIndex].imagem} alt={destaques[carouselIndex].nome} />
              <div className="hero-overlay">
                <h3>{destaques[carouselIndex].nome}</h3>
                <p>{destaques[carouselIndex].data}</p>
              </div>
            </div>
          )}
          {destaques[(carouselIndex + 1) % destaques.length] && (
            <div className="hero-card center">
              <img src={destaques[(carouselIndex + 1) % destaques.length].imagem} alt={destaques[(carouselIndex + 1) % destaques.length].nome} />
              <div className="hero-overlay">
                <h3>{destaques[(carouselIndex + 1) % destaques.length].nome}</h3>
                <p>{destaques[(carouselIndex + 1) % destaques.length].data} • {destaques[(carouselIndex + 1) % destaques.length].horario}</p>
                <p className="hero-local">📍 {destaques[(carouselIndex + 1) % destaques.length].local}</p>
              </div>
            </div>
          )}
          {destaques[(carouselIndex + 2) % destaques.length] && (
            <div className="hero-card">
              <img src={destaques[(carouselIndex + 2) % destaques.length].imagem} alt={destaques[(carouselIndex + 2) % destaques.length].nome} />
              <div className="hero-overlay">
                <h3>{destaques[(carouselIndex + 2) % destaques.length].nome}</h3>
                <p>{destaques[(carouselIndex + 2) % destaques.length].data}</p>
              </div>
            </div>
          )}
        </div>

        {/* Indicadores */}
        <div className="carousel-dots">
          {destaques.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === carouselIndex ? 'active' : ''}`}
              onClick={() => setCarouselIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="categories-section">
        <h2 className="section-title">Categorias</h2>
        <div className="categories-list">
          {categorias.map((cat) => (
            <div
              key={cat}
              className={`category-card ${categoriaAtiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              <div className="cat-icon-emoji">{getCategoriaEmoji(cat)}</div>
              <span className="cat-name">
                {cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTOS */}
      <section className="events-section">
        <h2 className="section-title">Eventos</h2>
        <div className="events-grid">
          {eventosFiltrados.map((evento) => (
            <div key={evento.id} className="event-card">
              <img src={evento.imagem} alt={evento.nome} className="event-image" />
              <div className="event-details">
                <h3 className="event-title">{evento.nome}</h3>
                <p className="event-meta">{evento.data} às {evento.horario}</p>
                <div className="location-pin">
                  <span>📍</span> {evento.local}
                </div>
                <Link to={`/evento/${evento.id}`} className="event-btn">
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
