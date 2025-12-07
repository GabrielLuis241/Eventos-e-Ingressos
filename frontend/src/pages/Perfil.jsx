// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Perfil.css";

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [ingressos, setIngressos] = useState([]);
    const navigate = useNavigate();

    // Mock data - preparado para receber do backend
    const mockIngressos = [
        {
            id: 1,
            evento: {
                id: 1,
                nome: "Show ao Vivo",
                data: "2025-06-13",
                horario: "20:00",
                local: "Arena Central",
                imagem: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80"
            },
            quantidade: 2,
            valorTotal: 500.00,
            dataCompra: "2025-05-15",
            qrCode: "QR123456789"
        },
        {
            id: 2,
            evento: {
                id: 2,
                nome: "Peça de Teatro",
                data: "2025-06-20",
                horario: "19:30",
                local: "Teatro Municipal",
                imagem: "https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?auto=format&fit=crop&w=900&q=80"
            },
            quantidade: 1,
            valorTotal: 200.00,
            dataCompra: "2025-05-18",
            qrCode: "QR987654321"
        },
        {
            id: 3,
            evento: {
                id: 3,
                nome: "Palestra de Tecnologia",
                data: "2025-07-05",
                horario: "09:00",
                local: "Centro de Convenções",
                imagem: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
            },
            quantidade: 1,
            valorTotal: 150.00,
            dataCompra: "2025-05-20",
            qrCode: "QR456789123"
        }
    ];

    useEffect(() => {
        const salvo = localStorage.getItem("usuarioLogado");
        if (!salvo) {
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(salvo);
            setUsuario(user);

            // TODO: Buscar ingressos reais do backend
            // fetchUserTickets(user.id);
            setIngressos(mockIngressos);
        } catch {
            navigate("/login");
        }
    }, [navigate]);

    // Função preparada para integração com backend
    const fetchUserTickets = async (userId) => {
        try {
            // const data = await apiGet(`/usuarios/${userId}/ingressos/`);
            // setIngressos(data);
        } catch (error) {
            console.error("Erro ao buscar ingressos:", error);
        }
    };

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("usuarioLogado");
        navigate("/login");
    }

    if (!usuario) {
        return <div className="loading">Carregando...</div>;
    }

    const totalGasto = ingressos.reduce((sum, ing) => sum + ing.valorTotal, 0);

    return (
        <div className="perfil-page">
            {/* Header */}
            <header className="perfil-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>👤 Meu Perfil</h1>
                    </div>
                    <div className="header-right">
                        <Link to="/" className="btn btn-ghost btn-sm">
                            Home
                        </Link>
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <div className="perfil-container">
                {/* Informações do Usuário */}
                <section className="user-info-section">
                    <div className="user-card">
                        <div className="user-avatar">
                            <span className="avatar-icon">
                                {usuario.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="user-details">
                            <h2>{usuario.username}</h2>
                            <p className="user-email">{usuario.email}</p>
                            <div className="user-badges">
                                <span className="badge">
                                    {usuario.tipo === "organizador" ? "🎯 Organizador" : "🎫 Cliente"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🎫</div>
                            <div className="stat-content">
                                <p className="stat-label">Total de Ingressos</p>
                                <p className="stat-value">
                                    {ingressos.reduce((sum, ing) => sum + ing.quantidade, 0)}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🎉</div>
                            <div className="stat-content">
                                <p className="stat-label">Eventos</p>
                                <p className="stat-value">{ingressos.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <p className="stat-label">Total Gasto</p>
                                <p className="stat-value">
                                    R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Meus Ingressos */}
                <section className="tickets-section">
                    <div className="section-header">
                        <h2>🎫 Meus Ingressos</h2>
                        <Link to="/" className="btn btn-primary btn-sm">
                            Comprar Mais Ingressos
                        </Link>
                    </div>

                    {ingressos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎭</div>
                            <h3>Você ainda não tem ingressos</h3>
                            <p>Explore nossos eventos e garanta seu lugar!</p>
                            <Link to="/" className="btn btn-primary">
                                Ver Eventos
                            </Link>
                        </div>
                    ) : (
                        <div className="tickets-grid">
                            {ingressos.map((ingresso) => (
                                <div key={ingresso.id} className="ticket-card">
                                    <div className="ticket-image">
                                        <img src={ingresso.evento.imagem} alt={ingresso.evento.nome} />
                                        <div className="ticket-badge">
                                            {ingresso.quantidade}x Ingresso{ingresso.quantidade > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <div className="ticket-content">
                                        <h3 className="ticket-title">{ingresso.evento.nome}</h3>

                                        <div className="ticket-info">
                                            <div className="info-item">
                                                <span className="info-icon">📅</span>
                                                <span>{new Date(ingresso.evento.data).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-icon">🕐</span>
                                                <span>{ingresso.evento.horario}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-icon">📍</span>
                                                <span>{ingresso.evento.local}</span>
                                            </div>
                                        </div>

                                        <div className="ticket-footer">
                                            <div className="ticket-price">
                                                <span className="price-label">Valor Total</span>
                                                <span className="price-value">
                                                    R$ {ingresso.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <button className="btn btn-outline btn-sm">
                                                Ver QR Code
                                            </button>
                                        </div>

                                        <div className="ticket-purchase-date">
                                            Comprado em {new Date(ingresso.dataCompra).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
