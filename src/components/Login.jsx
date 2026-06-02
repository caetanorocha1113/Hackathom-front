// src/components/Login.jsx
import React, { useState } from 'react';
import { authAPI } from '../api';
import '../styles/App.css';

export default function Login({ onLoginSuccess }) {
  const [showForm, setShowForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await authAPI.register(nome, email, senha);
        alert('Cadastro realizado com sucesso! Agora você pode fazer o login.');
        setIsRegister(false);
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
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* SEÇÃO 1: HERO / PROPOSTA */}
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '3rem', color: 'var(--text1)', marginBottom: '16px' }}>
          Recupere o controle do seu <span style={{ color: 'var(--accent)' }}>tempo digital</span>
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 32px auto', lineHeigh: '1.6' }}>
          O Manéuchos ajuda você a equilibrar produtividade e bem-estar, monitorando o tempo em redes sociais com gamificação e bloqueios inteligentes.
        </p>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            style={{ background: 'var(--accent)', color: 'var(--bg0)', border: 'none', padding: '16px 32px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            Começar Agora / Entrar na Plataforma 🚀
          </button>
        )}
      </div>

      {/* SEÇÃO 2: FORMULÁRIO DE LOGIN/CADASTRO CONECTADO AO BACKEND */}
      {showForm && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
          <div style={{ background: 'var(--bg1)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Syne', color: 'var(--accent)', margin: 0 }}>
                {isRegister ? 'Criar Conta' : 'Entrar no Sistema'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>Fechar ✕</button>
            </div>
            
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '12px' }}>⚠️ {error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isRegister && (
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Nome Completo</label>
                  <input type="text" className="form-input" style={{ width: '100%', padding: '10px', background: 'var(--bg2)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', marginTop: '4px' }} value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>E-mail</label>
                <input type="email" className="form-input" style={{ width: '100%', padding: '10px', background: 'var(--bg2)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', marginTop: '4px' }} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Senha</label>
                <input type="password" className="form-input" style={{ width: '100%', padding: '10px', background: 'var(--bg2)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', marginTop: '4px' }} value={senha} onChange={e => setSenha(e.target.value)} required />
              </div>
              
              <button type="submit" disabled={loading} style={{ background: 'var(--accent)', color: 'var(--bg0)', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                {loading ? 'Processando...' : isRegister ? 'Cadastrar no Supabase' : 'Autenticar'}
              </button>
            </form>

            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', textAlign: 'center', marginTop: '16px', cursor: 'pointer' }} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Já possui uma conta? Faça Login' : 'Novo por aqui? Crie uma conta grátis'}
            </p>
          </div>
        </div>
      )}

      {/* SEÇÃO 3: DETALHES DAS FUNCIONALIDADES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', margin: '40px 0' }}>
        <div style={{ background: 'var(--bg1)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
          <h3 style={{ fontFamily: 'Syne', color: 'var(--text1)', marginBottom: '8px' }}>Painel Analytics</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: '1.5' }}>Visualização interativa baseada em gráficos sobre o seu tempo investido em foco contra o desperdício em redes sociais.</p>
        </div>

        <div style={{ background: 'var(--bg1)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏱️</div>
          <h3 style={{ fontFamily: 'Syne', color: 'var(--text1)', marginBottom: '8px' }}>Limites Customizados</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: '1.5' }}>Escolha plataformas pré-mapeadas direto do banco de dados e estipule tempos máximos saudáveis de navegação diária.</p>
        </div>

        <div style={{ background: 'var(--bg1)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏆</div>
          <h3 style={{ fontFamily: 'Syne', color: 'var(--text1)', marginBottom: '8px' }}>Gamificação e XP</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: '1.5' }}>Cumpra os seus próprios acordos de tempo e ganhe pontos diários automaticamente na virada do dia para subir no ranking global.</p>
        </div>
      </div>

    </div>
  );
}