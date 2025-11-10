// src/pages/EventoDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './EventoDetail.css';

export default function EventoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="evento-detail">
      <Link to="/" className="back-link">← Voltar</Link>

      <div className="detail-grid">
        <img
          src={`https://source.unsplash.com/800x500/?event,${id}`}
          alt="Evento"
          className="detail-img"
        />

        <div className="detail-info">
          <h2>Detalhes do Evento #{id}</h2>
          <p>
            Este é um evento incrível repleto de experiências únicas e momentos inesquecíveis.
            Garanta seu ingresso e participe!
          </p>

          <button
            className="btn"
            onClick={() => navigate(`/evento/${id}/compra`)}
          >
            Comprar Ingresso
          </button>
        </div>
      </div>
    </div>
  );
}
