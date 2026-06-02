// src/App.jsx
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Painel from './components/Painel';
import Limites from './components/Limites';
import Pontos from './components/Pontos';
import Login from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('painel');

  useEffect(() => {
    // Verifica se o usuário já fez login anteriormente
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Se NÃO estiver autenticado, renderiza a Landing Page / Login
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg0)', color: 'var(--text1)' }}>
        <nav className="topbar">
          <div className="logo">Manéuchos <span>— Bem-estar Digital</span></div>
        </nav>
        <div style={{ marginTop: '80px' }}>
          <Login onLoginSuccess={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  // Se ESTIVER autenticado, renderiza o Dashboard Protegido
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg0)', color: 'var(--text1)' }}>
      {/* Topbar */}
      <nav className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <div className="logo">Manéuchos <span>— Bem-estar Digital</span></div>
        <button 
          onClick={handleLogout} 
          style={{ background: 'transparent', border: '1px solid var(--danger, #ff4d4d)', color: 'var(--danger, #ff4d4d)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sair 🚪
        </button>
      </nav>

      {/* Corpo do Sistema */}
      <div className="app-layout" style={{ display: 'flex', marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
        
        {/* Sidebar Lateral de Navegação */}
        <aside className="sidebar" style={{ width: '250px', background: 'var(--bg1)', borderRight: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className={`sidebar-item ${activeTab === 'painel' ? 'active' : ''}`} onClick={() => setActiveTab('painel')}>📊 Painel</button>
          <button className={`sidebar-item ${activeTab === 'limites' ? 'active' : ''}`} onClick={() => setActiveTab('limites')}>⏱️ Limites de Uso</button>
          <button className={`sidebar-item ${activeTab === 'pontos' ? 'active' : ''}`} onClick={() => setActiveTab('pontos')}>🏆 Pontos e Metas</button>
        </aside>

        {/* Área de Conteúdo da Aba Ativa */}
        <main className="main-content" style={{ flex: 1, padding: '30px', background: 'var(--bg0)', overflowY: 'auto' }}>
          {activeTab === 'painel' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <Painel />
            </div>
          )}
          {activeTab === 'limites' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <Limites />
            </div>
          )}
          {activeTab === 'pontos' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <Pontos />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}