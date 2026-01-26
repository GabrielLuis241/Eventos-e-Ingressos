// src/pages/GerenciarUsuarios.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GerenciarUsuarios.css";
import { apiGet, apiDelete } from "../api";

export default function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("todos");

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function carregarUsuarios() {
        try {
            setLoading(true);
            const data = await apiGet("/admin/usuarios");
            setUsuarios(data || []);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleExcluirUsuario(id) {
        if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

        try {
            await apiDelete(`/admin/usuarios/${id}`);
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
            alert("Usuário removido com sucesso!");
        } catch (err) {
            alert("Erro ao excluir usuário.");
            console.error(err);
        }
    }

    // Filtragem
    const usuariosFiltrados = usuarios.filter((u) => {
        const matchNome = u.username?.toLowerCase().includes(filtro.toLowerCase()) ||
            u.email?.toLowerCase().includes(filtro.toLowerCase());
        const matchTipo = tipoFiltro === "todos" || u.user_type === tipoFiltro;
        return matchNome && matchTipo;
    });

    function formatarData(dataStr) {
        if (!dataStr) return "—";
        const data = new Date(dataStr);
        return data.toLocaleDateString("pt-BR");
    }

    function getBadgeClass(tipo) {
        switch (tipo) {
            case "admin":
                return "badge-admin";
            case "cliente":
                return "badge-cliente";
            default:
                return "badge-outro";
        }
    }

    return (
        <div className="gerenciar-usuarios-page">
            <header className="admin-header">
                <div className="admin-header-content">
                    <div>
                        <h1 className="titulo">👥 Gerenciar Usuários</h1>
                        <p className="subtitulo">Visualize e gerencie os usuários cadastrados</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/" className="btn-voltar">← Home</Link>
                        <Link to="/admin/eventos" className="btn-eventos">🎭 Eventos</Link>
                        <Link to="/relatorios" className="btn-relatorios">📊 Relatórios</Link>
                    </div>
                </div>
            </header>

            <div className="admin-content">
                {/* Barra de Filtros */}
                <div className="filtros-container">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        className="filtro-tipo"
                    >
                        <option value="todos">Todos os tipos</option>
                        <option value="admin">Administradores</option>
                        <option value="cliente">Clientes</option>
                    </select>
                </div>

                {/* Estatísticas */}
                <div className="stats-container">
                    <div className="stat-card">
                        <span className="stat-number">{usuarios.length}</span>
                        <span className="stat-label">Total de Usuários</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {usuarios.filter((u) => u.user_type === "admin").length}
                        </span>
                        <span className="stat-label">Administradores</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {usuarios.filter((u) => u.user_type === "cliente").length}
                        </span>
                        <span className="stat-label">Clientes</span>
                    </div>
                </div>

                {/* Tabela de Usuários */}
                <section className="usuarios-section">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Carregando usuários...</p>
                        </div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="no-users">
                            <p>👤 Nenhum usuário encontrado.</p>
                            {filtro && <p>Tente ajustar os filtros de busca.</p>}
                        </div>
                    ) : (
                        <div className="usuarios-table-container">
                            <table className="usuarios-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuário</th>
                                        <th>Email</th>
                                        <th>Tipo</th>
                                        <th>Cadastro</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltrados.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <td className="td-id">#{usuario.id}</td>
                                            <td className="td-user">
                                                <div className="user-avatar">
                                                    {usuario.username?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <span>{usuario.username}</span>
                                            </td>
                                            <td className="td-email">{usuario.email}</td>
                                            <td>
                                                <span className={`badge ${getBadgeClass(usuario.user_type)}`}>
                                                    {usuario.user_type === "admin" ? "👨‍💼 Admin" : "👤 Cliente"}
                                                </span>
                                            </td>
                                            <td className="td-data">{formatarData(usuario.created_at)}</td>
                                            <td className="td-acoes">
                                                <button
                                                    className="btn-excluir"
                                                    onClick={() => handleExcluirUsuario(usuario.id)}
                                                    title="Excluir usuário"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
