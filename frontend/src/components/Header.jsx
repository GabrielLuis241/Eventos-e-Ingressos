import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">EVENTOS+</Link>
        <nav className="nav-links">
          <a href="/" className="nav-link">Início</a>
          <a href="/login" className="nav-link">Entrar</a>
        </nav>
      </div>
    </header>
  );
}
