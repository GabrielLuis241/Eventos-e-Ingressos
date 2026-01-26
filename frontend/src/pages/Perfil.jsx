// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { listarMinhasCompras } from "../api";
import "./Perfil.css";

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [ingressos, setIngressos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedIngresso, setSelectedIngresso] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const salvo = localStorage.getItem("usuarioLogado");
        if (!salvo) {
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(salvo);
            setUsuario(user);
            fetchUserTickets();
        } catch {
            navigate("/login");
        }
    }, [navigate]);

    // Busca ingressos reais do backend
    const fetchUserTickets = async () => {
        try {
            setLoading(true);
            const data = await listarMinhasCompras();
            console.log("Dados do backend:", data); // Debug
            // Mapeia os dados do backend para o formato esperado pelo frontend
            const ingressosMapeados = (data || []).map(compra => {
                const evento = compra.evento || {};
                return {
                    id: compra.id,
                    evento: {
                        id: evento.id || null,
                        nome: evento.nome || evento.name || "Evento",
                        data: evento.data || evento.date || null,
                        horario: evento.horario || evento.time || "",
                        local: evento.local || evento.location || "",
                        imagem: evento.imagem || evento.image || ""
                    },
                    quantidade: compra.quantidade || compra.quantity || 1,
                    valorTotal: compra.valor_total || compra.total_value || 0,
                    dataCompra: compra.data_compra || compra.created_at,
                    qrCodes: compra.qr_codes || []
                };
            });
            console.log("Ingressos mapeados:", ingressosMapeados); // Debug
            setIngressos(ingressosMapeados);
        } catch (error) {
            console.error("Erro ao buscar ingressos:", error);
            setIngressos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVerQrCode = (ingresso) => {
        setSelectedIngresso(ingresso);
        setQrModalOpen(true);
    };

    const closeQrModal = () => {
        setQrModalOpen(false);
        setSelectedIngresso(null);
    };

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("usuarioLogado");
        navigate("/login");
    }

    if (!usuario || loading) {
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
                                            <button 
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleVerQrCode(ingresso)}
                                            >
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

            {/* Modal QR Code */}
            {qrModalOpen && selectedIngresso && (
                <div className="qr-modal-overlay" onClick={closeQrModal}>
                    <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="qr-modal-close" onClick={closeQrModal}>×</button>
                        <h2>QR Codes - {selectedIngresso.evento?.nome}</h2>
                        <p className="qr-modal-info">
                            {selectedIngresso.quantidade} ingresso(s) para este evento
                        </p>
                        
                        <div className="qr-codes-list">
                            {selectedIngresso.qrCodes && selectedIngresso.qrCodes.length > 0 ? (
                                selectedIngresso.qrCodes.map((qr, index) => (
                                    <div key={qr.id} className={`qr-code-item ${qr.usado ? 'usado' : ''}`}>
                                        <div className="qr-code-number">Ingresso {index + 1}</div>
                                        <div className="qr-code-image">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr.codigo)}`}
                                                alt={`QR Code ${index + 1}`}
                                            />
                                        </div>
                                        <div className="qr-code-text">{qr.codigo}</div>
                                        {qr.usado && <div className="qr-usado-badge">UTILIZADO</div>}
                                    </div>
                                ))
                            ) : (
                                <p className="no-qr">Nenhum QR Code disponível para este ingresso.</p>
                            )}
                        </div>

                        <div className="qr-modal-footer">
                            <p><strong>Evento:</strong> {selectedIngresso.evento?.nome}</p>
                            <p><strong>Data:</strong> {selectedIngresso.evento?.data ? new Date(selectedIngresso.evento.data).toLocaleDateString('pt-BR') : '-'}</p>
                            <p><strong>Local:</strong> {selectedIngresso.evento?.local}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
