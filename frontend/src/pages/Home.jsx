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
      {
        id: 3,
        nome: 'Conferência Mulheres na Ciência',
        descricao: 'Palestras e discussões sobre o papel das mulheres na pesquisa.',
        data: '05/12/2025',
        horario: '08:00',
        local: 'Recife - PE',
        ingressos_disponiveis: 200,
        imagem: 'https://source.unsplash.com/800x500/?conference,science'
      },
      {
        id: 4,
        nome: 'Show de Talentos Locais',
        descricao: 'Artistas e bandas da cidade mostrando todo seu talento.',
        data: '10/12/2025',
        horario: '20:00',
        local: 'Teresina - PI',
        ingressos_disponiveis: 180,
        imagem: 'https://source.unsplash.com/800x500/?music,stage'
      },
      {
        id: 5,
        nome: 'Workshop de Empreendedorismo Criativo',
        descricao: 'Aprenda a tirar sua ideia do papel com mentores de sucesso.',
        data: '15/01/2026',
        horario: '10:00',
        local: 'Natal - RN',
        ingressos_disponiveis: 120,
        imagem: 'https://source.unsplash.com/800x500/?startup,business'
      },
      {
        id: 6,
        nome: 'Festival de Cinema Independente',
        descricao: 'Mostra de curtas e longas produzidos por artistas locais.',
        data: '28/01/2026',
        horario: '18:30',
        local: 'Salvador - BA',
        ingressos_disponiveis: 400,
        imagem: 'https://source.unsplash.com/800x500/?cinema,film'
      },
      {
        id: 7,
        nome: 'Hackathon Universitário',
        descricao: '48 horas de inovação e programação intensiva entre equipes!',
        data: '10/02/2026',
        horario: '08:00',
        local: 'João Pessoa - PB',
        ingressos_disponiveis: 250,
        imagem: 'https://source.unsplash.com/800x500/?hackathon,coding'
      },
      {
        id: 8,
        nome: 'Congresso de Sustentabilidade',
        descricao: 'Encontro de especialistas para debater soluções ecológicas.',
        data: '25/02/2026',
        horario: '09:30',
        local: 'Maceió - AL',
        ingressos_disponiveis: 350,
        imagem: 'https://source.unsplash.com/800x500/?sustainability,environment'
      },
      {
        id: 9,
        nome: 'Festival Gastronômico Regional',
        descricao: 'Sabores do Nordeste reunidos em um evento cheio de cultura.',
        data: '12/03/2026',
        horario: '11:00',
        local: 'Aracaju - SE',
        ingressos_disponiveis: 600,
        imagem: 'https://source.unsplash.com/800x500/?food,festival'
      },
      {
        id: 10,
        nome: 'ExpoArte e Cultura 2026',
        descricao: 'Exposição de arte, fotografia e cultura popular nordestina.',
        data: '25/03/2026',
        horario: '09:00',
        local: 'Campina Grande - PB',
        ingressos_disponiveis: 280,
        imagem: 'https://source.unsplash.com/800x500/?art,exhibition'
      }
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
