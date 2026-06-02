// src/App.jsx
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Painel from './components/Painel';
import Limites from './components/Limites';
import Pontos from './components/Pontos';
import Landing from './components/Landing';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('painel');
  const [theme, setTheme] = useState('dark');
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  // Aplica o tema na raiz do site em tempo real
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLanding(false); // Garante que o estado limpe ao sair
  };

  // ── SE NÃO ESTIVER AUTENTICADO OU SE CLICOU EM "VER TELA INICIAL" ──
  if (!isAuthenticated || showLanding) {
    return (
      <div style={{ position: 'relative' }}>
        <Landing onLoginSuccess={() => setIsAuthenticated(true)} />
        
        {/* Atalho flutuante discreto para voltar/avançar no MVP caso necessário */}
        {isAuthenticated && (
          <button 
            onClick={() => setShowLanding(false)}
            style={{
              position: 'fixed', bottom: '20px', right: '20px',
              padding: '10px 16px', background: 'var(--fu-primary)',
              color: '#060E11', border: 'none', borderRadius: '8px',
              fontWeight: 'bold', cursor: 'pointer', zIndex: 10000
            }}
          >
            Voltar ao Dashboard →
          </button>
        )}
      </div>
    );
  }

  // ── SE ESTIVER AUTENTICADO (LAYOUT ATUALIZADO COM MENU SUPERIOR) ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--fu-bg)' }}>
      
      {/* Barra de Navegação Superior (Substitui a Barra Lateral) */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 40px', 
        background: 'var(--fu-surface-solid)', 
        borderBottom: '1px solid var(--fu-border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        
        {/* Lado Esquerdo: Logo e Identidade */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setShowLanding(true)}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(135deg, var(--fu-primary) 0%, #1a9e78 100%)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#060E11'
          }}>⚡</div>
          <h1 style={{ color: 'var(--fu-text-main)', fontSize: '1.4rem', margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
            FlowUp
          </h1>
        </div>

        {/* Centro: Menu de Pílulas (Pills) */}
        <nav style={{ 
          display: 'flex', 
          gap: '6px', 
          background: 'rgba(0, 0, 0, 0.4)', 
          padding: '4px', 
          borderRadius: '12px', 
          border: '1px solid var(--fu-border)' 
        }}>
          <button 
            className={`nav-pill ${activeTab === 'painel' ? 'active' : ''}`} 
            onClick={() => setActiveTab('painel')}
          >
            📊 Painel
          </button>
          <button 
            className={`nav-pill ${activeTab === 'limites' ? 'active' : ''}`} 
            onClick={() => setActiveTab('limites')}
          >
            ⏱️ Limites de Uso
          </button>
          <button 
            className={`nav-pill ${activeTab === 'pontos' ? 'active' : ''}`} 
            onClick={() => setActiveTab('pontos')}
          >
            🏆 Pontos e Metas
          </button>
        </nav>

        {/* Lado Direito: Controles e Logout */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--fu-text-main)', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              padding: '4px'
            }}
            title="Alternar Tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={handleLogout} 
            className="fu-btn-logout"
            style={{ 
              padding: '8px 16px', 
              background: 'transparent', 
              border: '1px solid var(--fu-border)', 
              color: 'var(--fu-text-muted)', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s ease' 
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal Centralizado e Responsivo */}
      <main style={{ 
        flex: 1, 
        padding: '40px 24px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'painel' && <Painel />}
        {activeTab === 'limites' && <Limites />}
        {activeTab === 'pontos' && <Pontos />}
      </main>

    </div>
  );
}