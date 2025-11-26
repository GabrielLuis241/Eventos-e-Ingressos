import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { apiGet } from '../api';



export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const dadosTeste = [
      {
        id: 1,
        nome: 'Festival de Música Roxa',
        descricao: 'O maior festival de música da região, com artistas incríveis!',
        data: '12/11/2025',
        horario: '19:00',
        local: 'São Luís - MA',
        ingressos_disponiveis: 300,
        imagem: 'https://pixabay.com/pt/photos/perspectiva-ponte-de-madeira-7600797/'
      },
      {
        id: 2,
        nome: 'Feira de Tecnologia e Inovação',
        descricao: 'Empresas e startups mostrando as tecnologias do futuro.',
        data: '22/11/2025',
        horario: '09:00',
        local: 'Fortaleza - CE',
        ingressos_disponiveis: 500,
        imagem: 'https://source.unsplash.com/800x500/?technology,innovation'
      },
    ];

    apiGet('/eventos/')
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
        if (mounted) {
          console.warn('Usando dados de teste:', e.message);
          setEventos(dadosTeste);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  if (loading) return <p>Carregando eventos...</p>;

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Descubra os melhores eventos</h1>
          <p>Shows, palestras e experiências incríveis — tudo em um só lugar.</p>
          <Link to="#eventos" className="btn">Explorar agora</Link>
        </div>
      </section>

      <section id="eventos" className="eventos-section">
        <h2>Próximos Eventos</h2>
        <div className="eventos-grid">
          {eventos.map(e => (
            <div key={e.id} className="evento-card">
              <img src={e.imagem} alt={e.nome} className="evento-thumb" />
              <div className="evento-info">
                <h3>{e.nome}</h3>
                <p className="meta">{e.data} — {e.local}</p>
                <p className="descricao">{e.descricao}</p>
                <Link to={`/evento/${e.id}`} className="btn">Ver detalhes</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
