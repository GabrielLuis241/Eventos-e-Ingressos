import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroAdm from './pages/CadastroAdm';

//import Header from './components/Header';
import Footer from './components/Footer';

import GerenciarEventos from './pages/GerenciarEventos';
import Home from './pages/Home';
import EventoDetail from './pages/EventoDetail';

import CompraIngresso from './pages/CompraIngresso';
import PagamentoCartao from './pages/PagamentoCartao';
import PagamentoPix from './pages/PagamentoPix';
import ConfirmacaoCompra from './pages/ConfirmacaoCompra';

import EditarEvento from './pages/EditarEvento';
import Relatorios from './pages/Relatorios';
import Perfil from './pages/Perfil';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/evento/:id" element={<EventoDetail />} />
          <Route path="/admin/eventos" element={<GerenciarEventos />} />
          <Route path="/admin/eventos/:id/editar" element={<EditarEvento />} />
          <Route path="/evento/:id/compra" element={<CompraIngresso />} />

          <Route path="/pagamento/cartao" element={<PagamentoCartao />} />
          <Route path="/pagamento/cartao/:purchaseId" element={<PagamentoCartao />} />
          <Route path="/pagamento/pix" element={<PagamentoPix />} />
          <Route path="/pagamento/pix/:purchaseId" element={<PagamentoPix />} />

          <Route path="/confirmacao" element={<ConfirmacaoCompra />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
          <Route path="/cadastro/admin" element={<CadastroAdm />} />

          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
