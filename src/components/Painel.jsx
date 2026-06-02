// src/components/Painel.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Painel.css';

export default function Painel() {
  const [estatisticas, setEstatisticas] = useState({
    tempoTotalHoje: "0h 0m",
    sessoesConcluidas: 0,
    tentativasBloqueio: 0, 
    sitesTop: [],
    limitesProgresso: [] // NOVO: Vai guardar os limites reais do banco
  });
  const [loading, setLoading] = useState(true);

  // Vai buscar as sessões E os limites reais à tua API
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Faz os dois pedidos ao banco de dados ao mesmo tempo para ser mais rápido!
        const [resSessoes, resLimites] = await Promise.all([
          fetch('http://localhost:3000/api/sessoes', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/limites', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!resSessoes.ok || !resLimites.ok) {
          throw new Error('Falha ao buscar dados do banco');
        }

        const sessoes = await resSessoes.json();
        const limites = await resLimites.json(); // Limites que vêm do teu supabase

        // 1. Processar os dados das sessões de hoje
        let tempoTotalMinutos = 0;
        let sessoesHoje = 0;
        const sitesMap = {};
        const hojeIso = new Date().toISOString().split('T')[0];

        sessoes.forEach(sessao => {
          if (sessao.inicio && sessao.inicio.startsWith(hojeIso)) {
            tempoTotalMinutos += sessao.tempo_total;
            sessoesHoje++;
          }
          const site = sessao.id_site || 'Desconhecido';
          if (!sitesMap[site]) sitesMap[site] = 0;
          sitesMap[site] += sessao.tempo_total;
        });

        // 2. Formatar tempo total para o topo
        const horas = Math.floor(tempoTotalMinutos / 60);
        const minutos = tempoTotalMinutos % 60;
        const tempoFormatado = `${horas}h ${minutos}m`;

        // 3. Organizar o Top 3 Sites
        const sitesArray = Object.keys(sitesMap).map((site) => {
          const tempoSite = sitesMap[site];
          return {
            nome: site,
            tempoMinutos: tempoSite,
            tempo: `${Math.floor(tempoSite / 60)}h ${tempoSite % 60}m`,
            categoria: "Monitorizado",
            cor: "#3B82F6",
            percentagem: tempoTotalMinutos > 0 ? Math.round((tempoSite / tempoTotalMinutos) * 100) : 0
          };
        }).sort((a, b) => b.tempoMinutos - a.tempoMinutos).slice(0, 3);

        if (sitesArray[0]) sitesArray[0].cor = "#EF4444";
        if (sitesArray[1]) sitesArray[1].cor = "#F59E0B";
        if (sitesArray[2]) sitesArray[2].cor = "#10B981";

        // 4. NOVO: Processar os Limites cruzando com o tempo gasto hoje
        const limitesCalculados = limites.map(limite => {
          // Procura quanto tempo gastou no site do limite. Se não achou, gastou 0.
          const tempoGastoMinutos = sitesMap[limite.id_site] || 0; 
          const limiteMinutos = limite.tempo_limite;
          
          let percentagem = Math.round((tempoGastoMinutos / limiteMinutos) * 100);
          if (percentagem > 100) percentagem = 100; // Para a barra não passar do ecrã

          // Definir cores e mensagens baseadas na percentagem gasta
          let corBarra = '#10B981'; // Verde (Seguro)
          let statusClasse = 'seguro';
          let mensagem = '🟢 Seguro: Estás no caminho para os +10 pontos!';

          if (percentagem >= 100) {
            corBarra = '#EF4444'; // Vermelho (Estourou)
            statusClasse = 'atencao'; // usando o teu css existente para dar destaque
            mensagem = '🔴 Limite excedido! Foco perdido.';
          } else if (percentagem >= 75) {
            corBarra = '#F59E0B'; // Laranja (Quase lá)
            statusClasse = 'atencao';
            mensagem = '🟠 Atenção: Quase a atingir o limite configurado.';
          }

          return {
            nome: limite.id_site,
            tempoGastoString: tempoGastoMinutos < 60 ? `${tempoGastoMinutos}m` : `${Math.floor(tempoGastoMinutos/60)}h ${tempoGastoMinutos%60}m`,
            limiteString: limiteMinutos < 60 ? `${limiteMinutos}m` : `${Math.floor(limiteMinutos/60)}h ${limiteMinutos%60}m`,
            percentagem,
            corBarra,
            statusClasse,
            mensagem
          };
        });

        // Atualizar o estado da tela
        setEstatisticas({
          tempoTotalHoje: tempoFormatado,
          sessoesConcluidas: sessoesHoje,
          tentativasBloqueio: 0,
          sitesTop: sitesArray,
          limitesProgresso: limitesCalculados // Guarda os limites reais
        });

      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  if (loading) {
    return (
      <div className="flowup-painel-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <h2 style={{ color: 'var(--fu-text-muted)' }}>A sincronizar com o banco de dados... ⏳</h2>
      </div>
    );
  }

  return (
    <div className="flowup-painel-page">
      
      {/* Cabeçalho do Painel */}
      <div className="painel-header">
        <div>
          <h2 className="painel-titulo">Olá, Estudante! 👋</h2>
          <p className="painel-subtitulo">O teu resumo de uso para {hoje}.</p>
        </div>
        <div className="status-foco ativo">
          <span className="pulsar"></span> Sincronizado ao Vivo
        </div>
      </div>

      {/* Cartões de Indicadores (KPIs) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icone" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>⏱️</div>
          <div className="kpi-info">
            <span className="kpi-label">Tempo Total (Hoje)</span>
            <span className="kpi-valor">{estatisticas.tempoTotalHoje}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icone" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>📈</div>
          <div className="kpi-info">
            <span className="kpi-label">Sessões Registadas</span>
            <span className="kpi-valor">{estatisticas.sessoesConcluidas} hoje</span>
          </div>
        </div>

        <div className="kpi-card destaque-positivo">
          <div className="kpi-icone" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>🛡️</div>
          <div className="kpi-info">
            <span className="kpi-label">Tentativas de Fuga</span>
            <span className="kpi-valor">{estatisticas.tentativasBloqueio} hoje</span>
          </div>
        </div>
      </div>

      {/* Seção Principal - Gráficos / Listas */}
      <div className="painel-conteudo-grid">
        
        {/* Top Sites Acessados */}
        <div className="painel-box">
          <h3>Top Sites Acessados</h3>
          <p className="box-desc">Onde o teu tempo foi investido hoje.</p>
          
          <div className="sites-lista">
            {estatisticas.sitesTop.length > 0 ? (
              estatisticas.sitesTop.map((site, index) => (
                <div key={index} className="site-item">
                  <div className="site-info-topo">
                    <span className="site-nome" style={{ textTransform: 'capitalize' }}>{site.nome}</span>
                    <span className="site-tempo">{site.tempo}</span>
                  </div>
                  <div className="site-barra-bg">
                    <div 
                      className="site-barra-fill" 
                      style={{ width: `${site.percentagem}%`, background: site.cor }}
                    ></div>
                  </div>
                  <span className="site-categoria">{site.categoria} ({site.percentagem}%)</span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--fu-text-muted)', fontStyle: 'italic', padding: '20px 0', textAlign: 'center' }}>
                Nenhuma sessão registada hoje.
              </p>
            )}
          </div>
        </div>

        {/* Resumo de Limites Diários (AGORA DINÂMICO!) */}
        <div className="painel-box">
          <h3>Progresso dos Limites</h3>
          <p className="box-desc">Lembra-te da meta para ganhares pontos!</p>
          
          <div className="limites-lista">
            {estatisticas.limitesProgresso.length > 0 ? (
              estatisticas.limitesProgresso.map((limite, index) => (
                <div key={index} className={`limite-card ${index > 0 ? 'mt-3' : ''}`}>
                  <div className="limite-header">
                    <span className="limite-nome" style={{ textTransform: 'capitalize' }}>{limite.nome}</span>
                    <span className="limite-status">{limite.tempoGastoString} / {limite.limiteString}</span>
                  </div>
                  <div className="site-barra-bg">
                    <div 
                      className="site-barra-fill" 
                      style={{ width: `${limite.percentagem}%`, background: limite.corBarra }}
                    ></div>
                  </div>
                  <p className={`limite-alerta ${limite.statusClasse}`}>{limite.mensagem}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--fu-text-muted)', fontStyle: 'italic', padding: '20px 0', textAlign: 'center' }}>
                Nenhum limite configurado no banco de dados. Vai à aba "Limites de Uso" para criar um!
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}