// src/components/Limites.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Limites.css';
import { limitesAPI } from '../api';

export default function Limites() {
  const [limits, setLimits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados obrigatórios do FlowUp
  const [nomeLimite, setNomeLimite] = useState('');
  const [dominio, setDominio] = useState('');
  const [tipoBloqueio, setTipoBloqueio] = useState('diario'); // 'permanente' ou 'diario'
  const [tempoLimite, setTempoLimite] = useState('');

  useEffect(() => {
    carregarLimites();
  }, []);

  const carregarLimites = async () => {
    try {
      const dados = await limitesAPI.listar();
      setLimits(dados || []);
    } catch (err) {
      console.error("Erro ao carregar limites:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nomeLimite || !dominio) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const tempoFinal = tipoBloqueio === 'permanente' ? 'Permanente' : tempoLimite;
      
      // Enviando os dados capturados do formulário digitado
      await limitesAPI.criar(dominio, tempoFinal); 
      
      // Reseta o estado e fecha o modal
      setIsModalOpen(false);
      setNomeLimite('');
      setDominio('');
      setTempoLimite('');
      carregarLimites(); 
    } catch (err) {
      alert("Falha ao salvar a restrição. Verifique a conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flowup-limites-page">
      <div className="flowup-container-inner">
        
        {/* Topbar Exclusiva FlowUp */}
        <div className="flowup-header-section">
          <h2 className="flowup-title-main">Limites de Uso</h2>
          <button className="btn-add-limite" onClick={() => setIsModalOpen(true)}>
            <span>+</span> Adicionar Restrição
          </button>
        </div>

        {/* Novo Grid Exclusivo de Cards */}
        <div className="flowup-grid-layout">
          {limits.length === 0 ? (
            <p style={{ color: 'var(--flow-text-muted)', gridColumn: '1/-1' }}>
              Nenhum limitador ativo encontrado. Clique acima para configurar o seu primeiro bloqueio.
            </p>
          ) : (
            limits.map((l) => (
              <div key={l.id_limite || l.id} className="flowup-card-exclusivo">
                <span className="card-badge-status">Ativo</span>
                
                <div>
                  <span className="card-meta-title">Website Bloqueado</span>
                  <h3 className="card-domain-name">{l.id_site}</h3>
                </div>

                <div className="card-info-box">
                  <div className="card-info-row">
                    <span style={{ color: 'var(--flow-text-muted)' }}>Regra:</span>
                    <span style={{ fontWeight: '600' }}>
                      {l.tempo_limite === 'Permanente' ? 'Bloqueio Total' : `Máx. ${l.tempo_limite}`}
                    </span>
                  </div>
                  <div className="card-info-row" style={{ marginTop: '10px' }}>
                    <span style={{ color: 'var(--flow-text-muted)' }}>Progresso Diário</span>
                    <span style={{ color: 'var(--flow-accent)', fontWeight: 'bold' }}>5%</span>
                  </div>
                  <div className="mini-progress-bar-bg">
                    <div className="mini-progress-bar-fill"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* MODAL CORRIGIDO CONTRA ERROS DE CLIQUE */}
      {isModalOpen && (
        <div className="flowup-modal-overlay">
          <div className="flowup-modal-window">
            <h3>Configurar Nova Restrição</h3>
            
            <form onSubmit={handleSave}>
              
              <div className="flowup-form-group">
                <label>Nome identificador do limite *</label>
                <input 
                  type="text" 
                  className="flowup-input-text"
                  placeholder="Ex: Distração de Estudos"
                  value={nomeLimite}
                  onChange={e => setNomeLimite(e.target.value)}
                  required
                />
              </div>

              <div className="flowup-form-group">
                <label>Domínio do Website *</label>
                <input 
                  type="text" 
                  className="flowup-input-text"
                  placeholder="Ex: instagram.com"
                  value={dominio}
                  onChange={e => setDominio(e.target.value)}
                  required
                />
              </div>

              <div className="flowup-form-group">
                <label>Tipo de restrição</label>
                <div className="flowup-radio-container">
                  <label className="flowup-radio-option">
                    <input 
                      type="radio" 
                      name="flowup-tipo" 
                      value="permanente" 
                      checked={tipoBloqueio === 'permanente'} 
                      onChange={() => setTipoBloqueio('permanente')} 
                    />
                    Bloquear permanentemente
                  </label>
                  <label className="flowup-radio-option">
                    <input 
                      type="radio" 
                      name="flowup-tipo" 
                      value="diario" 
                      checked={tipoBloqueio === 'diario'} 
                      onChange={() => setTipoBloqueio('diario')} 
                    />
                    Definir limite diário de tempo
                  </label>
                </div>
              </div>

              {/* Só exibe o campo de tempo se for diário */}
              {tipoBloqueio === 'diario' && (
                <div className="flowup-form-group">
                  <label>Tempo Máximo Permitido *</label>
                  <input 
                    type="text" 
                    className="flowup-input-text"
                    placeholder="Ex: 1h, 45m"
                    value={tempoLimite}
                    onChange={e => setTempoLimite(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flowup-modal-actions">
                <button type="button" className="btn-flow-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-add-limite" disabled={loading}>
                  {loading ? 'Salvando...' : 'Confirmar Limite'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}