import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventoDetail.css'; 
import { apiPost } from '../api';

export default function EventoDetail() {
  const { id } = useParams();

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [mostrarCompra, setMostrarCompra] = useState(false);

  async function handleCompra() {
    try {
      await apiPost('/comprar/', {
        evento_id: id,
        nome,
        quantidade: Number(quantidade),
      });

      setMensagem('✅ Compra realizada com sucesso!');
      setNome('');
      setQuantidade(1);
    } catch (error) {
      console.error('Erro ao comprar ingresso:', error);
      setMensagem('❌ Erro ao realizar compra. Tente novamente.');
    }
  }

  return (
    <div className="evento-detail">
     <Link to="/" className="btn-voltar">
        ← Voltar
     </Link>
  
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
            onClick={() => setMostrarCompra(!mostrarCompra)}
            className="btn">
            {mostrarCompra ? 'Fechar Compra' : 'Comprar Ingresso'}
          </button>

        </div>
      </div>

      {mostrarCompra && (
        <div id="comprar" className="form-compra">
          <h3>Comprar ingresso</h3>

          <label>Nome do comprador:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />

          <label>Quantidade:</label>
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <button onClick={handleCompra} className="btn">Confirmar Compra</button>

          {mensagem && (
            <p className={`mensagem ${mensagem.includes('Erro') ? 'erro' : 'sucesso'}`}>
              {mensagem}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
