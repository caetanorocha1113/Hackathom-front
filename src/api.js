// src/api.js
const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const authAPI = {
  login: async (email, senha) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erro ao fazer login');
    }
    return res.json(); // Retorna { token }
  },
  register: async (nome, email, senha) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erro ao registrar');
    }
    return res.json();
  }
};

export const limitesAPI = {
  listar: async () => {
    const res = await fetch(`${API_URL}/limites`, { method: 'GET', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Erro ao buscar limites');
    return res.json();
  },
  criar: async (id_site, tempo_limite) => {
    const res = await fetch(`${API_URL}/limites`, {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ id_site, tempo_limite })
    });
    if (!res.ok) throw new Error('Erro ao criar limite');
    return res.json();
  },
  // NOVAS FUNÇÕES PARA EDITAR E APAGAR
  editar: async (id_limite, id_site, tempo_limite) => {
    const res = await fetch(`${API_URL}/limites/${id_limite}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ id_site, tempo_limite })
    });
    if (!res.ok) throw new Error('Erro ao editar limite');
    return res.json();
  },
  apagar: async (id_limite) => {
    const res = await fetch(`${API_URL}/limites/${id_limite}`, {
      method: 'DELETE', headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Erro ao apagar limite');
    return res.json();
  }
};
// Dentro do teu src/api.js
export const rankingAPI = {
  listar: async () => {
    const res = await fetch(`${API_URL}/ranking`, {
      method: 'GET',
      headers: getAuthHeaders() // Usa o token do utilizador logado
    });
    if (!res.ok) throw new Error('Erro ao buscar ranking');
    return res.json();
  }
};