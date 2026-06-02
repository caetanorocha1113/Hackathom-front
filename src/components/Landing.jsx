// src/components/Landing.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Landing.css';
import { authAPI } from '../api';

export default function Landing({ onLoginSuccess }) {
  const [theme, setTheme] = useState('dark');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  
  // Dados de entrada
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(''); // Estado para mensagem de sucesso sem alert()

  // Sincroniza o alternador de temas com a árvore do documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSucesso('');
    setLoading(true);
    try {
      if (isRegister) {
        await authAPI.register(nome, email, senha);
        // Em vez do alert() antigo, definimos a mensagem de sucesso e mudamos para a tela de login
        setSucesso('Cadastro realizado com sucesso! Faça login para acessar o FlowUp.');
        setIsRegister(false);
        // Limpa o campo do nome por segurança
        setNome('');
      } else {
        const data = await authAPI.login(email, senha);
        if (data.token) {
          localStorage.setItem('token', data.token); // Grava o JWT real retornado do Supabase
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fu-landing-page">
      {/* HEADER PRINCIPAL */}
      <header className="fu-landing-header">
        <div className="fu-logo-container">
          <div className="fu-logo-icon">⚡</div>
          <span className="fu-logo-text">FlowUp</span>
        </div>
        <div className="fu-header-actions">
          <button onClick={toggleTheme} className="fu-btn-theme">
            {theme === 'dark' ? '☀️ Mode' : '🌙 Mode'}
          </button>
          <button onClick={() => { setShowAuthModal(true); setIsRegister(false); setError(''); setSucesso(''); }} className="fu-btn-nav-login">
            Acessar Painel
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="fu-hero-section">
        <div className="fu-hero-content">
          <span className="fu-badge-gradient">Solução Definitiva para Foco</span>
          <h1 className="fu-hero-title">
            Retome o controle do seu tempo digital
          </h1>
          <p className="fu-hero-subtitle">
            Monitore o uso de redes sociais, estipule limites rígidos baseados em dados reais do Supabase e seja recompensado com pontos e gamificação pela sua produtividade.
          </p>
          <div className="fu-hero-cta-group">
            <button onClick={() => { setShowAuthModal(true); setIsRegister(true); setError(''); setSucesso(''); }} className="fu-btn-primary fu-btn-hero">
              Começar Agora — Grátis
            </button>
            <a href="#features" className="fu-btn-secondary">Conhecer Recursos</a>
          </div>
        </div>

        {/* PREVIEW DO EXTENSÃO / MOCKUP EM CSS */}
        <div className="fu-hero-preview">
          <div className="fu-mock-browser">
            <div className="fu-mock-header">
              <div className="fu-mock-dot"></div>
              <div className="fu-mock-dot"></div>
              <div className="fu-mock-dot"></div>
            </div>
            <div className="fu-mock-timer">
              <span style={{ fontSize: '0.85rem', color: 'var(--fu-text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tempo Restante no Instagram</span>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: 'var(--fu-primary)' }}>14:59</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--fu-text-muted)', marginTop: '8px' }}>Sua produtividade hoje está 25% maior!</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE RECURSOS */}
      <section id="features" className="fu-features-grid">
        <div className="fu-feature-card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
          <h3>Painel Analytics</h3>
          <p>Visualização interativa baseada em gráficos sobre o seu tempo investido em foco contra o desperdício em redes sociais.</p>
        </div>

        <div className="fu-feature-card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏱️</div>
          <h3>Limites Customizados</h3>
          <p>Escolha plataformas pré-mapeadas direto do banco de dados e estipule tempos máximos saudáveis de navegação diária.</p>
        </div>

        <div className="fu-feature-card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏆</div>
          <h3>Gamificação e XP</h3>
          <p>Suba no ranking da comunidade global acumulando pontos sempre que respeitar seus horários de estudo e trabalho.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fu-text-muted)', fontSize: '0.85rem', borderTop: '1px solid var(--fu-border)' }}>
        © {new Date().getFullYear()} FlowUp Labs. Desenvolvido para o Hackathon. Todos os direitos reservados.
      </footer>

      {/* MODAL DE AUTENTICAÇÃO (LOGIN / CADASTRO) */}
      {showAuthModal && (
        <div className="fu-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="fu-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="fu-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '2rem' }}>{isRegister ? '🚀' : '🔒'}</span>
              <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--fu-text-main)', marginTop: '8px' }}>
                {isRegister ? 'Criar Conta no FlowUp' : 'Entrar no Sistema'}
              </h2>
              <p style={{ color: 'var(--fu-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                {isRegister ? 'Preencha os dados abaixo para começar.' : 'Insira suas credenciais de acesso.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Notificação de Erro */}
              {error && (
                <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Notificação de Sucesso Real (Substituiu o alert) */}
              {sucesso && (
                <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                  ✅ {sucesso}
                </div>
              )}

              {isRegister && (
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--fu-text-muted)', display: 'block', marginBottom: '6px' }}>Nome Completo</label>
                  <input 
                    type="text" 
                    className="flowup-input-text" 
                    style={{ background: 'var(--fu-bg)' }} 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                    placeholder="Seu nome ou apelido"
                    required 
                  />
                </div>
              )}
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--fu-text-muted)', display: 'block', marginBottom: '6px' }}>E-mail</label>
                <input 
                  type="email" 
                  className="flowup-input-text" 
                  style={{ background: 'var(--fu-bg)' }} 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="exemplo@email.com"
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--fu-text-muted)', display: 'block', marginBottom: '6px' }}>Senha</label>
                <input 
                  type="password" 
                  className="flowup-input-text" 
                  style={{ background: 'var(--fu-bg)' }} 
                  value={senha} 
                  onChange={e => setSenha(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>

              <button type="submit" className="fu-btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }} disabled={loading}>
                {loading ? 'Processando...' : isRegister ? 'Concluir Cadastro' : 'Entrar no Painel'}
              </button>
            </form>

            <p 
              style={{ fontSize: '0.85rem', color: 'var(--fu-text-muted)', textAlign: 'center', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline' }} 
              onClick={() => { setIsRegister(!isRegister); setError(''); setSucesso(''); }}
            >
              {isRegister ? 'Já possui conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}