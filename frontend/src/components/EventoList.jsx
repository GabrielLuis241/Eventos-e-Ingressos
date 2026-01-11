// src/components/EventoList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarEventos } from '../api';

export default function EventoList() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const dadosTeste = [
      {
        id: 1,
        nome: 'Show de Rock',
        descricao: 'Um show incrível de rock!',
        data: '2025-11-15',
        horario: '20:00',
        local: 'Arena Central',
        ingressos_disponiveis: 100,
        imagem: 'https://via.placeholder.com/320x180?text=Show+de+Rock'
      },
      {
        id: 2,
        nome: 'Festival de Música 2',
        descricao: 'Festival com várias bandas',
        data: '2025-12-01',
        horario: '18:00',
        local: 'Parque das Flores',
        ingressos_disponiveis: 500,
        imagem: 'https://via.placeholder.com/320x180?text=Festival'
      }
    ];

    listarEventos()
      .then(data => {
        if (mounted) {
          if (!data || data.length === 0) {
            setEventos(dadosTeste);
          } else {
            setEventos(data);
          }
          setLoading(false);
        }
      })
      .catch(e => {
        console.error('Erro ao carregar eventos:', e);
        if (mounted) {
          console.warn('Usando dados de teste:', e.message);
          setEventos(dadosTeste); 
          setLoading(false);
        }
      });
    return () => (mounted = false);
  }, []);

  if (loading) return <div>Carregando eventos...</div>;

  return (
    <div>
      <h2>Eventos Disponíveis</h2>
      <div className="event-list">
        {eventos.length === 0 && <p>Nenhum evento cadastrado.</p>}
        {eventos.map(ev => (
          <article key={ev.id} className="event-card">
            <img src={ev.imagem || 'https://via.placeholder.com/320x180?text=Sem+imagem'} alt={ev.nome} className="event-thumb"/>
            <div className="event-info">
              <h3>{ev.nome}</h3>
              <p className="meta">{ev.data} • {ev.horario} — {ev.local}</p>
              <p className="desc">{ev.descricao?.slice(0, 140)}{ev.descricao && ev.descricao.length > 140 ? '…' : ''}</p>
              <div className="actions">
                <Link to={`/evento/${ev.id}`} className="btn">Ver detalhes</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
