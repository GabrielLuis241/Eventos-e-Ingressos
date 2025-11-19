import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">EVENTOS+</Link>
        <nav className="nav-links">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/#eventos">Eventos</NavLink>
          <NavLink to="/#contato">Contato</NavLink>
          <Link to="/admin/eventos" className="btn-admin">Modo Admin</Link>
          <Link to="/login" className="btn">Entrar</Link>
        </nav>
      </div>
    </header>
  );
}
