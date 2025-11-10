import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroAdm from './pages/CadastroAdm';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import EventoDetail from './pages/EventoDetail';
import CompraIngresso from './pages/CompraIngresso';
import PagamentoCartao from './pages/PagamentoCartao';
import PagamentoPix from './pages/PagamentoPix';
import ConfirmacaoCompra from './pages/ConfirmacaoCompra';



import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Cabeçalho fixo */}
      <Header />

      {/* Área principal do conteúdo */}
      <main className="app-main">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<Home />} />

          {/* Detalhes do evento */}
          <Route path="/evento/:id" element={<EventoDetail />} />

          {/* Compra (nome + quantidade + tipo de pagamento) */}
          <Route path="/evento/:id/compra" element={<CompraIngresso />} />

          {/* Pagamentos */}
          <Route path="/pagamento/cartao" element={<PagamentoCartao />} />
          <Route path="/pagamento/pix" element={<PagamentoPix />} />

          {/* Confirmação da compra */}
          <Route path="/confirmacao" element={<ConfirmacaoCompra />} />

          {/* 🟣 Novas rotas de autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
          <Route path="/cadastro/adm" element={<CadastroAdm />} />
        </Routes>
      </main>

      {/* Rodapé fixo */}
      <Footer />
    </div>
  );
}

export default App;
