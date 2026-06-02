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
  const [sucesso, setSucesso] = useState('');

  // Sincroniza o alternador de temas
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
        setSucesso('Cadastro realizado com sucesso! Faça login para acessar o FlowUp.');
        setIsRegister(false);
        setNome('');
      } else {
        const data = await authAPI.login(email, senha);
        if (data.token) {
          localStorage.setItem('token', data.token);
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
    <div className="fu-landing">
      {/* O fu-container garante que nada fica colado nas bordas e centraliza o conteúdo */}
      <div className="fu-container">
        
        {/* HEADER PRINCIPAL */}
        <nav className="fu-navbar">
          <div className="fu-brand">
            <div className="fu-logo-mark">⚡</div>
            FlowUp
          </div>
          <div className="fu-nav-controls">
            <button onClick={toggleTheme} className="fu-btn-toggle" title="Alternar Tema">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => { setShowAuthModal(true); setIsRegister(false); setError(''); setSucesso(''); }} className="fu-btn-login">
              Acessar Painel
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <header className="fu-hero">
          <div className="fu-hero-content">
            <div className="fu-badge">Solução Definitiva para Foco</div>
            <h1 className="fu-hero-title">
              Retome o controle do seu <span>tempo digital</span>
            </h1>
            <p className="fu-hero-p">
              Monitore o uso de redes sociais, estipule limites rígidos baseados em dados reais do Supabase e seja recompensado com pontos e gamificação pela sua produtividade.
            </p>
            <div>
              <button onClick={() => { setShowAuthModal(true); setIsRegister(true); setError(''); setSucesso(''); }} className="fu-btn-primary">
                Começar Agora — Grátis
              </button>
            </div>
          </div>

          {/* MOCKUP / PREVIEW EXCLUSIVO (Substitui imagens estáticas) */}
          <div className="fu-hero-preview">
            <div className="fu-mock-header">
              <div className="fu-mock-dot"></div>
              <div className="fu-mock-dot"></div>
              <div className="fu-mock-dot"></div>
            </div>
            <div className="fu-mock-timer">
              <span style={{ fontSize: '0.85rem', color: 'var(--fu-text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Tempo Restante no Instagram</span>
              <div style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: 'var(--fu-primary)' }}>14:59</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--fu-text-muted)', marginTop: '12px' }}>Sua produtividade hoje está 25% maior!</p>
            </div>
          </div>
        </header>

        {/* SEÇÃO DE RECURSOS */}
        <section id="features" className="fu-features-grid">
          <div className="fu-feature-card">
            <div className="fu-feat-icon">📊</div>
            <h3>Painel Analytics</h3>
            <p>Visualização interativa baseada em gráficos sobre o seu tempo investido em foco contra o desperdício em redes sociais.</p>
          </div>

          <div className="fu-feature-card">
            <div className="fu-feat-icon">⏱️</div>
            <h3>Limites Customizados</h3>
            <p>Escolha plataformas pré-mapeadas direto do banco de dados e estipule tempos máximos saudáveis de navegação diária.</p>
          </div>

          <div className="fu-feature-card">
            <div className="fu-feat-icon">🏆</div>
            <h3>Gamificação e XP</h3>
            <p>Suba no ranking da comunidade global acumulando pontos sempre que respeitar seus horários de estudo e trabalho.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '40px 0', color: 'var(--fu-text-muted)', fontSize: '0.85rem', borderTop: '1px solid var(--fu-border)' }}>
          © {new Date().getFullYear()} FlowUp Labs. Desenvolvido para o Hackathon. Todos os direitos reservados.
        </footer>
      </div>

      {/* MODAL DE AUTENTICAÇÃO */}
      {showAuthModal && (
        <div className="flowup-modal-overlay" onClick={() => setShowAuthModal(false)} style={{ zIndex: 9999 }}>
          <div className="flowup-modal-window" onClick={(e) => e.stopPropagation()}>
            
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

              {/* Notificação de Sucesso Real */}
              {sucesso && (
                <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                  ✅ {sucesso}
                </div>
              )}

              {isRegister && (
                <div className="flowup-form-group" style={{ marginBottom: 0 }}>
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    className="flowup-input-text" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                    placeholder="Seu nome ou apelido"
                    required 
                  />
                </div>
              )}
              
              <div className="flowup-form-group" style={{ marginBottom: 0 }}>
                <label>E-mail</label>
                <input 
                  type="email" 
                  className="flowup-input-text" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="exemplo@email.com"
                  required 
                />
              </div>

              <div className="flowup-form-group" style={{ marginBottom: 0 }}>
                <label>Senha</label>
                <input 
                  type="password" 
                  className="flowup-input-text" 
                  value={senha} 
                  onChange={e => setSenha(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>

              <button type="submit" className="fu-btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
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