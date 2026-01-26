// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { listarEventos } from "../api";
import { 
  FaStar, 
  FaMusic, 
  FaTheaterMasks, 
  FaMicrophone, 
  FaGlassCheers, 
  FaFutbol, 
  FaCalendarAlt,
  FaSearch,
  FaDollarSign,
  FaMapMarkerAlt,
  FaTimes
} from "react-icons/fa";

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [usuario, setUsuario] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [busca, setBusca] = useState("");
  const [buscaEventos, setBuscaEventos] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [localFiltro, setLocalFiltro] = useState("");
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

    listarEventos()
      .then((data) => {
        if (!mounted) return;
        // Remove dados de teste - mostra apenas eventos cadastrados
        if (!data || data.length === 0) {
          setEventos([]);
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
      .catch((err) => {
        console.error("Erro ao carregar eventos:", err);
        if (!mounted) return;
        setEventos([]);
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

  const getCategoriaIcon = (cat) => {
    const iconProps = { size: 32, color: "white" };
    if (cat === "todos") return <FaStar {...iconProps} />;
    if (cat === "show") return <FaMusic {...iconProps} />;
    if (cat === "teatro") return <FaTheaterMasks {...iconProps} />;
    if (cat === "palestra") return <FaMicrophone {...iconProps} />;
    if (cat === "festa") return <FaGlassCheers {...iconProps} />;
    if (cat === "esporte") return <FaFutbol {...iconProps} />;
    return <FaCalendarAlt {...iconProps} />;
  };

  // Extrair locais únicos para o dropdown
  const locaisUnicos = useMemo(() => {
    const locais = eventos.map((e) => e.local || e.location || "").filter(Boolean);
    return [...new Set(locais)];
  }, [eventos]);

  const eventosFiltrados = useMemo(() => {
    let lista = eventos;

    if (categoriaAtiva !== "todos") {
      lista = lista.filter((e) => e.categoria === categoriaAtiva);
    }

    // Busca do header
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter((e) => {
        const nome = (e.nome || e.name || "").toLowerCase();
        const local = (e.local || e.location || "").toLowerCase();
        return nome.includes(termo) || local.includes(termo);
      });
    }

    // Busca da seção de eventos
    if (buscaEventos.trim()) {
      const termo = buscaEventos.toLowerCase();
      lista = lista.filter((e) => {
        const nome = (e.nome || e.name || "").toLowerCase();
        const local = (e.local || e.location || "").toLowerCase();
        return nome.includes(termo) || local.includes(termo);
      });
    }

    // Filtro de preço mínimo
    if (precoMin !== "") {
      const min = parseFloat(precoMin);
      if (!isNaN(min)) {
        lista = lista.filter((e) => {
          const preco = e.preco || e.price || 0;
          return preco >= min;
        });
      }
    }

    // Filtro de preço máximo
    if (precoMax !== "") {
      const max = parseFloat(precoMax);
      if (!isNaN(max)) {
        lista = lista.filter((e) => {
          const preco = e.preco || e.price || 0;
          return preco <= max;
        });
      }
    }

    // Filtro de local
    if (localFiltro) {
      lista = lista.filter((e) => {
        const local = e.local || e.location || "";
        return local === localFiltro;
      });
    }

    return lista;
  }, [eventos, categoriaAtiva, busca, buscaEventos, precoMin, precoMax, localFiltro]);

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
            <p>Encontre e compre ingressos para eventos</p>

          </div>

          <div className="header-actions">
            {usuario ? (
              <>
                <span className="user-greeting">Olá, {usuario.username}</span>
                <div className="nav-buttons">
                  {usuario.user_type === "organizador" ? (
                    <>
                      <Link to="/admin/eventos" className="nav-btn">
                        Gerenciar Eventos
                      </Link>
                      <Link to="/relatorios" className="nav-btn">
                        Relatórios
                      </Link>
                    </>
                  ) : (
                    <Link to="/perfil" className="nav-btn">
                      Meu Perfil
                    </Link>
                  )}
                  <button onClick={handleLogout} className="nav-btn logout-btn">
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="login-btn">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION - 3 IMAGENS COM INFORMAÇÕES */}
      <section className="hero-section">
        <div className="hero-grid">
          {destaques[carouselIndex] && (
            <div 
              className="hero-card clickable"
              onClick={() => navigate(`/evento/${destaques[carouselIndex].id}`)}
            >
              <img
                src={destaques[carouselIndex].imagem}
                alt={destaques[carouselIndex].nome}
              />
              <div className="hero-overlay">
                <h3>{destaques[carouselIndex].nome}</h3>
                <p>{destaques[carouselIndex].data}</p>
              </div>
            </div>
          )}
          {destaques[(carouselIndex + 1) % destaques.length] && (
            <div 
              className="hero-card center clickable"
              onClick={() => navigate(`/evento/${destaques[(carouselIndex + 1) % destaques.length].id}`)}
            >
              <img
                src={destaques[(carouselIndex + 1) % destaques.length].imagem}
                alt={destaques[(carouselIndex + 1) % destaques.length].nome}
              />
              <div className="hero-overlay">
                <h3>{destaques[(carouselIndex + 1) % destaques.length].nome}</h3>
                <p>
                  {destaques[(carouselIndex + 1) % destaques.length].data} •{" "}
                  {destaques[(carouselIndex + 1) % destaques.length].horario}
                </p>
                <p className="hero-local">
                  📍 {destaques[(carouselIndex + 1) % destaques.length].local}
                </p>
              </div>
            </div>
          )}
          {destaques[(carouselIndex + 2) % destaques.length] && (
            <div 
              className="hero-card clickable"
              onClick={() => navigate(`/evento/${destaques[(carouselIndex + 2) % destaques.length].id}`)}
            >
              <img
                src={destaques[(carouselIndex + 2) % destaques.length].imagem}
                alt={destaques[(carouselIndex + 2) % destaques.length].nome}
              />
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
              className={`dot ${idx === carouselIndex ? "active" : ""}`}
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
              className={`category-card ${categoriaAtiva === cat ? "active" : ""}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              <div className="cat-icon">{getCategoriaIcon(cat)}</div>
              <span className="cat-name">
                {cat === "todos"
                  ? "Todos"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTOS */}
      <section className="events-section">
        <h2 className="section-title">Eventos</h2>

        {/* BARRA DE FILTROS */}
        <div className="events-filter-bar">
          <div className="filter-search">
            <span className="filter-search-icon"><FaSearch /></span>
            <input
              type="text"
              placeholder="Buscar por nome ou local..."
              value={buscaEventos}
              onChange={(e) => setBuscaEventos(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>
              <FaDollarSign style={{ marginRight: '5px', fontSize: '0.75rem' }} />
              Preço:
            </label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Mín"
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                min="0"
                className="filter-price-input"
              />
              <span className="filter-separator">-</span>
              <input
                type="number"
                placeholder="Máx"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                min="0"
                className="filter-price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>
              <FaMapMarkerAlt style={{ marginRight: '5px', fontSize: '0.75rem' }} />
              Local:
            </label>
            <select
              value={localFiltro}
              onChange={(e) => setLocalFiltro(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos os locais</option>
              {locaisUnicos.map((local, idx) => (
                <option key={idx} value={local}>
                  {local}
                </option>
              ))}
            </select>
          </div>

          {(buscaEventos || precoMin || precoMax || localFiltro) && (
            <button
              className="filter-clear-btn"
              onClick={() => {
                setBuscaEventos("");
                setPrecoMin("");
                setPrecoMax("");
                setLocalFiltro("");
              }}
            >
              <FaTimes style={{ marginRight: '5px', fontSize: '0.85rem' }} />
              Limpar filtros
            </button>
          )}
        </div>

        {eventosFiltrados.length === 0 ? (
          <div className="no-events">
            <p>📅 Nenhum evento cadastrado ainda.</p>
            {usuario?.user_type === "organizador" && (
              <Link to="/admin/eventos" className="create-event-btn">
                Criar Primeiro Evento
              </Link>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {eventosFiltrados.map((evento) => (
              <div key={evento.id} className="event-card">
                <img
                  src={
                    evento.imagem ||
                    "https://via.placeholder.com/400x300?text=Evento"
                  }
                  alt={evento.nome}
                  className="event-image"
                />
                <div className="event-details">
                  <h3 className="event-title">{evento.nome}</h3>
                  <p className="event-meta">
                    {evento.data} às {evento.horario}
                  </p>
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
        )}
      </section>
    </div>
  );
}
