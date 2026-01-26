import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buscarEventoPorId, iniciarCompra } from '../api';
import './EventoDetail.css';

export default function EventoDetail() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState(null);
  const [mostrarOpcaoCartao, setMostrarOpcaoCartao] = useState(false);

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const estaLogado = !!usuarioLogado;
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    buscarEventoPorId(id)
      .then(data => {
        if (mounted) {
          setEvento(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar evento:", err);
        if (mounted) {
          setErro('Erro ao carregar evento');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="loading">Carregando evento...</div>;
  if (erro) return <div className="error">Erro: {erro}</div>;
  if (!evento) return <div className="not-found">Evento não encontrado.</div>;

  const handlePix = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (quantidade < 1) {
      setMensagem('Quantidade mínima é 1');
      return;
    }
    if (quantidade > evento.ingressos_disponiveis) {
      setMensagem('Quantidade maior que ingressos disponíveis');
      return;
    }

    try {
      const compra = await iniciarCompra(evento.id, quantidade, "pix");
      // Redirecionar para página PIX com ID da compra
      navigate(`/pagamento/pix/${compra.id}`, { state: { compra, evento } });
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao iniciar compra: ' + err.message);
    }
  };

  const handleCartao = async (tipoCartao) => {
    try {
      const compra = await iniciarCompra(evento.id, quantidade, tipoCartao);
      // Redirecionar para página Cartão com ID da compra e tipo
      navigate(`/pagamento/cartao/${compra.id}`, { state: { compra, evento, tipoCartao } });
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao iniciar compra: ' + err.message);
    }
    setMostrarOpcaoCartao(false);
  };

  return (
    <div className="evento-detail">
      <Link to="/" className="back-btn">← Voltar aos eventos</Link>

      <header className="evento-header">
        <h1 className="evento-titulo">{evento.nome}</h1>
        <div className="evento-meta">
          <span className="meta-item">{evento.data}</span>
          <span className="meta-item">{evento.horario}</span>
          <span className="meta-item">{evento.local}</span>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-image-container">
          <img
            src={evento.imagem || 'https://via.placeholder.com/600x400?text=Sem+Imagem+do+Evento'}
            alt={evento.nome}
            className="detail-img"
          />
        </div>

        <div className="detail-content">
          <div className="evento-descricao">
            <h3>Sobre o evento</h3>
            <p>{evento.descricao}</p>
          </div>

          <div className="ingressos-info">
            <h3>Ingressos disponíveis</h3>
            <div className="contador-ingressos">
              <span className="numero-ingressos">{evento.ingressos_disponiveis}</span>
              <span className="label-ingressos">tickets</span>
            </div>
          </div>

          {estaLogado ? (
            <form onSubmit={handlePix} className="purchase-form">
              <h3>Comprar ingressos</h3>

              <div className="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  min="1"
                  max={evento.ingressos_disponiveis}
                  value={quantidade}
                  onChange={e => setQuantidade(Number(e.target.value))}
                  className="input-quantidade"
                />
              </div>

              <div className="payment-buttons">
                <button
                  type="submit"
                  className="btn btn-pix"
                  disabled={evento.ingressos_disponiveis === 0}
                >
                  Pagar com PIX
                </button>

                <button
                  type="button"
                  className="btn btn-cartao"
                  onClick={() => setMostrarOpcaoCartao(!mostrarOpcaoCartao)}
                  disabled={evento.ingressos_disponiveis === 0}
                >
                  Cartão de Crédito/Débito
                </button>
              </div>

              {mostrarOpcaoCartao && (
                <div className="opcoes-cartao">
                  <p>Selecione o tipo de cartão:</p>
                  <div className="botoes-tipo-cartao">
                    <button
                      type="button"
                      className="btn btn-credito"
                      onClick={() => handleCartao("credito")}
                    >
                      💳 Crédito
                    </button>
                    <button
                      type="button"
                      className="btn btn-debito"
                      onClick={() => handleCartao("debito")}
                    >
                      💳 Débito
                    </button>
                  </div>
                </div>
              )}

              {mensagem && (
                <div className={`message ${mensagem.includes('Erro') ? 'erro' : 'sucesso'}`}>
                  {mensagem}
                </div>
              )}
            </form>
          ) : (
            <div className="login-prompt">
              <p>🔐 Você precisa estar <Link to="/login">logado</Link> para comprar ingressos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
