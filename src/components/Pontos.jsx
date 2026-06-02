// src/components/Pontos.jsx
import React from 'react';
import '../styles/Pontos.css';

export default function Pontos({ points, setPoints, pointsHistory, setPointsHistory, limits }) {
  
  // Função que simula a passagem do dia (23:59) exigida pelas regras do Hackathon [cite: 18]
  const simulateDayEnd = () => {
    if (limits.length === 0) {
      alert("Adicione limites primeiro na aba de Limites para poder pontuar!");
      return;
    }

    // Regra 1: Não tentou abrir o site bloqueado = 20 pontos [cite: 18]
    const ptsGanho = 20; 
    const newHistory = {
      id: Date.now(),
      date: 'Hoje (Simulado)',
      desc: 'Meta Diária Concluída com sucesso!',
      pts: ptsGanho
    };

    setPoints(prev => prev + ptsGanho);
    setPointsHistory([newHistory, ...pointsHistory]);
  };

  return (
    <div className="points-container">
      <div className="points-header">
        <h2>Sistema de Recompensas</h2>
        <button className="btn-simulate" onClick={simulateDayEnd}>⚡ Simular Fim do Dia (23:59)</button> [cite: 18]
      </div>

      <div className="score-board">
        <span className="score-label">Sua Pontuação Total</span>
        <div className="score-val">{points} <span>pts</span></div>
      </div>

      <div className="rules-card">
        <h3>Como funciona o ganho de pontos?</h3> [cite: 18]
        <ul>
          <li>🛡️ Não tentar abrir nenhum site bloqueado no dia = <strong>+20 pts</strong></li> [cite: 18]
          <li>⏱️ Manter limite diário flexível maior que 2h = <strong>+5 pts</strong></li> [cite: 18]
          <li>🎯 Manter limite diário focado rígido menor que 1h = <strong>+10 pts</strong></li> [cite: 18]
        </ul>
      </div>

      <div className="history-section">
        <h3>Histórico de Conquistas</h3>
        <div className="history-list">
          {pointsHistory.map(h => (
            <div key={h.id} className="history-row">
              <div>
                <span className="hist-date">{h.date}</span>
                <p className="hist-desc">{h.desc}</p>
              </div>
              <span className="hist-pts">+{h.pts} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}