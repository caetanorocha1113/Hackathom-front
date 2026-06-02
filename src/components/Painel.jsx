// src/components/Painel.jsx
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/Painel.css';

// Registra os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Painel() {
  // Simulando estados de sessões e dados, garantindo arrays vazios por padrão para evitar o erro do .map()
  const [sessoes, setSessoes] = useState([]); 
  const [tempoFoco, setTempoFoco] = useState(0);
  const [tempoDistracao, setTempoDistracao] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando ou buscando dados do backend futuramente
    // Para testar agora, vamos deixar zerado para simular o banco vazio de um novo usuário
    setSessoes([]); 
    setTempoFoco(0);
    setTempoDistracao(0);
    setLoading(false);
  }, []);

  // Configuração dos dados do Gráfico de Pizza (Pie Chart)
  // Se estiver tudo zerado, mostramos um gráfico padrão cinza ou indicativo de foco inicial
  const dataGrafico = {
    labels: ['Tempo de Foco', 'Tempo em Distrações'],
    datasets: [
      {
        data: tempoFoco === 0 && tempoDistracao === 0 ? [100, 0] : [tempoFoco, tempoDistracao],
        backgroundColor: tempoFoco === 0 && tempoDistracao === 0 
          ? ['rgba(45, 212, 160, 0.2)', 'rgba(255, 255, 255, 0.1)'] 
          : ['#2dd4a0', '#ff4d4d'],
        borderColor: ['#1e3d4d', '#1e3d4d'],
        borderWidth: 1,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#d6edf5', font: { family: 'DM Sans' } }
      }
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text2)' }}>Carregando estatísticas...</div>;
  }

  return (
    <div className="painel-container">
      <div className="painel-header">
        <h2>Dashboard de Produtividade</h2>
        <p>Acompanhe em tempo real o seu balanço diário de foco contra distrações.</p>
      </div>

      {/* Cards de Resumo */}
      <div className="painel-cards">
        <div className="card-status foco">
          <h3>Tempo de Foco</h3>
          <p className="card-numero">{tempoFoco} min</p>
        </div>
        <div className="card-status distracao">
          <h3>Tempo em Distrações</h3>
          <p className="card-numero">{tempoDistracao} min</p>
        </div>
      </div>

      {/* Seção Principal: Gráfico + Histórico */}
      <div className="painel-conteudo">
        <div className="grafico-box">
          <h3>Visão Geral Diária</h3>
          <div style={{ maxWidth: '280px', margin: '0 auto' }}>
            <Pie data={dataGrafico} options={opcoesGrafico} />
          </div>
        </div>

        <div className="historico-box">
          <h3>Sessões Recentes</h3>
          <div className="historico-lista">
            {/* 🛡️ AQUI OCORRIA O ERRO: Adicionado o check de segurança se sessoes existe e tem tamanho */}
            {!sessoes || sessoes.length === 0 ? (
              <p style={{ color: 'var(--text3)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>
                Nenhuma sessão de foco registrada hoje. Comece uma nova atividade!
              </p>
            ) : (
              sessoes.map((sessao, index) => (
                <div key={sessao.id || index} className="historico-item">
                  <span>{sessao.descricao || 'Sessão de Foco'}</span>
                  <span className="badge-tempo">{sessao.duracao} min</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}