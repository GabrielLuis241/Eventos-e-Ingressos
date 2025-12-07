import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo"></Link>
      </div>
    </header>
  );
}
