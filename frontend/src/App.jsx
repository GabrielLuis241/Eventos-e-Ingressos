import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroAdm from './pages/CadastroAdm';

import Header from './components/Header';
import Footer from './components/Footer';

import GerenciarEventos from './pages/GerenciarEventos';
import Home from './pages/Home';
import EventoDetail from './pages/EventoDetail';

import CompraIngresso from './pages/CompraIngresso';
import PagamentoCartao from './pages/PagamentoCartao';
import PagamentoPix from './pages/PagamentoPix';
import ConfirmacaoCompra from './pages/ConfirmacaoCompra';

import EditarEvento from './pages/EditarEvento';   

import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/evento/:id" element={<EventoDetail />} />
          <Route path="/admin/eventos" element={<GerenciarEventos />} />
          <Route path="/admin/eventos/editar/:id" element={<EditarEvento />} />

          <Route path="/evento/:id/compra" element={<CompraIngresso />} />

          <Route path="/pagamento/cartao" element={<PagamentoCartao />} />
          <Route path="/pagamento/pix" element={<PagamentoPix />} />

          <Route path="/confirmacao" element={<ConfirmacaoCompra />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
          <Route path="/cadastro/adm" element={<CadastroAdm />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
