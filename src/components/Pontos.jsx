// src/components/Pontos.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Pontos.css';
import { rankingAPI } from '../api';

export default function Pontos() {
  // Mantemos o teu valor em destaque fixo para a apresentação de UX, como combinámos
  const pontuacaoTotal = 145; 
  
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    try {
      // Chama a rota GET /api/ranking do teu server.js
      const dados = await rankingAPI.listar();
      setRanking(dados);
    } catch (err) {
      console.error("Erro ao carregar o ranking real. A usar dados de fallback para a apresentação.", err);
      // MOCK FALLBACK: Se algo falhar na BD durante o pitch, a tela não quebra!
      setRanking([
        { posicao: 1, nome: 'João Pedro', pontos: 450 },
        { posicao: 2, nome: 'Maria Silva', pontos: 380 },
        { posicao: 3, nome: 'Estudante Ativo', pontos: 145 },
        { posicao: 4, nome: 'Carlos E.', pontos: 90 },
        { posicao: 5, nome: 'Ana Costa', pontos: 55 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Função para dar medalhas aos 3 primeiros usando o campo "posicao" do teu backend
  const getPosicaoIcone = (posicao) => {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return `${posicao}º`;
  };

  return (
    <div className="flowup-pontos-page">
      
      <div className="flowup-header-section" style={{ marginBottom: '40px' }}>
        <h2 style={{ color: 'var(--fu-text-main)', margin: 0, fontFamily: 'Syne, sans-serif' }}>Pontos e Metas</h2>
        <p style={{ color: 'var(--fu-text-muted)', margin: '8px 0 0 0' }}>
          O sistema verifica o teu foco diariamente às 23:59. Sobe no ranking e prova a tua disciplina!
        </p>
      </div>

      <div className="pontos-dashboard-layout">
        
        {/* COLUNA ESQUERDA: Os Teus Pontos e Regras */}
        <div className="pontos-coluna-pessoal">
          
          <div className="pontos-destaque-container">
            <div className="pontos-circulo">
              <span className="pontos-valor">{pontuacaoTotal}</span>
              <span className="pontos-label">Os Teus Pontos</span>
            </div>
          </div>

          <div className="regras-section">
            <h3 style={{ color: 'var(--fu-text-main)', marginBottom: '16px', fontFamily: 'Syne', fontSize: '1.2rem' }}>Como ganhar pontos?</h3>
            <div className="regras-grid">
              <div className="regra-card">
                <div className="regra-pontos">+20</div>
                <div className="regra-textos">
                  <h4>Bloqueio Perfeito</h4>
                  <p>Não tentaste abrir sites bloqueados hoje.</p>
                </div>
              </div>
              <div className="regra-card">
                <div className="regra-pontos" style={{ color: '#F59E0B' }}>+10</div>
                <div className="regra-textos">
                  <h4>Foco Intenso</h4>
                  <p>Não ultrapassaste o limite de 1h.</p>
                </div>
              </div>
              <div className="regra-card">
                <div className="regra-pontos" style={{ color: '#3B82F6' }}>+5</div>
                <div className="regra-textos">
                  <h4>Uso Consciente</h4>
                  <p>Não ultrapassaste o limite de 2h.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Ranking Global */}
        <div className="pontos-coluna-ranking">
          <div className="ranking-container">
            <div className="ranking-header">
              <h3>🏆 Ranking Global</h3>
              <span className="ranking-badge">Top 10 Usuários</span>
            </div>
            
            <div className="ranking-lista">
              {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--fu-text-muted)', padding: '20px' }}>A carregar ranking...</p>
              ) : ranking.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--fu-text-muted)', padding: '20px' }}>Ainda não há pontuações registadas.</p>
              ) : (
                // Lê diretamente o formato que enviaste no controller: { posicao, nome, pontos }
                ranking.map((user, index) => (
                <div key={index} className={`ranking-item ${user.posicao <= 3 ? 'top-3' : ''}`}
                    style={{
                      border: user.nome === 'Teste' ? '2px solid var(--fu-primary)' : 'none',
                      background: user.nome === 'Teste' ? 'var(--accent-dim)' : 'transparent'
                    }}>
                  <div className="ranking-posicao">
                      {getPosicaoIcone(user.posicao)}
                    </div>
                    <div className="ranking-info">
                      <span className="ranking-nome">{user.nome}</span>
                    </div>
                    <div className="ranking-pontos-valor">
                      {user.pontos} <span style={{ fontSize: '0.7rem', color: 'var(--fu-text-muted)' }}>pts</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}