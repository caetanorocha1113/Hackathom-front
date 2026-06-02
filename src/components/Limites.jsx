// src/components/Limites.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Limites.css';
import { limitesAPI } from '../api';

// Dicionário para traduzir o ID numérico do banco para o nome bonito na tela
const MAPA_SITES = {
  1: 'Instagram',
  2: 'Facebook',
  3: 'YouTube',
  4: 'TikTok',
  5: 'Twitter / X',
  6: 'Netflix'
};

export default function Limites() {
  const [limits, setLimits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados alinhados com o seu Back-End (id_site agora começa com o ID do primeiro item do select)
  const [idSite, setIdSite] = useState('1'); 
  const [tipoBloqueio, setTipoBloqueio] = useState('diario');
  const [tempoLimite, setTempoLimite] = useState('');

  useEffect(() => {
    carregarLimites();
  }, []);

  const carregarLimites = async () => {
    try {
      const dados = await limitesAPI.listar();
      setLimits(dados || []);
    } catch (err) {
      console.error("Erro ao carregar os limites:", err);
    }
  };

  const abrirModalNovo = () => {
    setIdSite('1'); // Reseta para o ID 1 (Instagram)
    setTipoBloqueio('diario');
    setTempoLimite('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const tempoFinal = tipoBloqueio === 'permanente' ? 'Permanente' : tempoLimite;
      
      // Envia o id_site convertido para Número, eliminando o erro de bigint!
      await limitesAPI.criar(Number(idSite), tempoFinal); 
      
      setIsModalOpen(false);
      carregarLimites(); 
    } catch (err) {
      alert("Erro ao gravar o limite. Verifique se o ID do site existe na tabela SITE.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flowup-limites-page">
      {/* Cabeçalho */}
      <div className="flowup-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: 'var(--fu-text-main)', margin: 0, fontFamily: 'Syne, sans-serif' }}>Limites de Uso</h2>
          <p style={{ color: 'var(--fu-text-muted)', margin: '4px 0 0 0' }}>Gerencie suas restrições de tempo para manter o foco.</p>
        </div>
        <button className="fu-btn-primary" style={{ padding: '12px 24px' }} onClick={abrirModalNovo}>
          + Adicionar Limite
        </button>
      </div>

      {/* Listagem de Cards */}
      {limits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--fu-surface)', borderRadius: '16px', border: '1px dashed var(--fu-border)' }}>
          <p style={{ color: 'var(--fu-text-muted)', margin: 0 }}>Nenhum bloqueio configurado para este usuário.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {limits.map((l, index) => (
            <div key={index} className="fu-feature-card" style={{ background: 'var(--fu-surface-solid)', padding: '24px', borderRadius: '16px', border: '1px solid var(--fu-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--fu-text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Rede Social / App</span>
              {/* Usa o mapa para exibir o nome em vez do número bruto do ID */}
              <h3 style={{ margin: '6px 0 16px 0', color: 'var(--fu-text-main)', fontFamily: 'Syne' }}>
                {MAPA_SITES[l.id_site] || `Site Corporativo (ID: ${l.id_site})`}
              </h3>
              <p style={{ color: 'var(--fu-text-muted)', margin: 0, fontSize: '0.95rem' }}>
                Regra: <strong style={{ color: 'var(--fu-primary)' }}>{l.tempo_limite === 'Permanente' ? 'Bloqueio Total' : `Máximo de ${l.tempo_limite}`}</strong>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AJUSTADO PARA DROPDOWN (SELECT) */}
      {isModalOpen && (
        <div className="flowup-modal-overlay">
          <div className="flowup-modal-window">
            <h3 style={{ color: 'var(--fu-text-main)', marginBottom: '20px', fontFamily: 'Syne' }}>Configurar Restrição</h3>
            
            <form onSubmit={handleSave}>
              <div className="flowup-form-group">
                <label>Selecione a Plataforma</label>
                <select 
                  className="flowup-input-text"
                  value={idSite} 
                  onChange={e => setIdSite(e.target.value)}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <option value="1">Instagram</option>
                  <option value="2">Facebook</option>
                  <option value="3">YouTube</option>
                  <option value="4">TikTok</option>
                  <option value="5">Twitter / X</option>
                  <option value="6">Netflix</option>
                </select>
              </div>

              <div className="flowup-form-group">
                <label>Modo de Bloqueio</label>
                <div className="flowup-radio-container">
                  <label className="flowup-radio-option">
                    <input type="radio" name="modo_bloqueio" checked={tipoBloqueio === 'diario'} onChange={() => setTipoBloqueio('diario')} />
                    Tempo Limite Diário
                  </label>
                </div>
              </div>

              {tipoBloqueio === 'diario' && (
                <div className="flowup-form-group">
                  <label>Tempo Permitido (em minutos)</label>
                  <input 
                    type="number" 
                    className="flowup-input-text" 
                    placeholder="Ex: 60" 
                    value={tempoLimite} 
                    onChange={e => setTempoLimite(e.target.value)} 
                    min="1"
                    required 
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="fu-btn-login" style={{ padding: '10px 20px' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="fu-btn-primary" style={{ padding: '10px 24px' }} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Limite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}