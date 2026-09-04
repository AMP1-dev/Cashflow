import React, { createContext, useContext, useState, useEffect } from 'react';
import { FMA_CONFIG, FMA_ARTICLES } from '../data/fmaData';

const FmaContext = createContext();

const DEFAULT_TEAM = [
  {
    id: 'team-1',
    name: 'Dr. Fernando Maeda',
    role: 'Sócio-Fundador & Advogado Titular',
    oab: 'OAB/SP 210.374',
    specialties: 'Direito Processual Civil, Contratos (FGV), Direito Bancário & Saúde',
    bio: 'Advogado desde 2003 com mais de 20 anos de prática forense ininterrupta. Pós-graduado em Processo Civil e Especialista em Contratos pela Fundação Getulio Vargas (FGV). Membro da AASP e referência na condução estratégica de liminares e renegociação de passivos.',
    email: 'contato@fmadv.net',
    phone: '(11) 94890-0900',
    isFounder: true
  }
];

export function FmaProvider({ children }) {
  // 1. Articles State
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('fma_articles');
      return saved ? JSON.parse(saved) : FMA_ARTICLES;
    } catch {
      return FMA_ARTICLES;
    }
  });

  // 2. Team / Partners State
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('fma_team');
      return saved ? JSON.parse(saved) : DEFAULT_TEAM;
    } catch {
      return DEFAULT_TEAM;
    }
  });

  // 3. Firm Settings State
  const [firmConfig, setFirmConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('fma_config');
      return saved ? JSON.parse(saved) : FMA_CONFIG;
    } catch {
      return FMA_CONFIG;
    }
  });

  // 4. Admin Panel & Modals
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // 5. Theme State (Light by default, toggleable to Dark)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('fma_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('fma_theme', next);
      } catch (e) {}
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fma_articles', JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('fma_team', JSON.stringify(team));
    } catch (e) {
      console.error(e);
    }
  }, [team]);

  useEffect(() => {
    try {
      localStorage.setItem('fma_config', JSON.stringify(firmConfig));
    } catch (e) {
      console.error(e);
    }
  }, [firmConfig]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Article Actions
  const addArticle = (article) => {
    const newArt = {
      ...article,
      id: `art-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      readTime: `${Math.max(3, Math.ceil((article.content || '').split(' ').length / 180))} min de leitura`
    };
    setArticles(prev => [newArt, ...prev]);
    showToast('Artigo publicado com sucesso!');
  };

  const updateArticle = (updated) => {
    setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
    showToast('Artigo atualizado!');
  };

  const deleteArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    showToast('Artigo removido!', 'warning');
  };

  const resetArticles = () => {
    setArticles(FMA_ARTICLES);
    showToast('Artigos restaurados ao padrão original!');
  };

  // Team Actions
  const addTeamMember = (member) => {
    const newMember = {
      ...member,
      id: `team-${Date.now()}`
    };
    setTeam(prev => [...prev, newMember]);
    showToast('Membro da equipe adicionado!');
  };

  const updateTeamMember = (updated) => {
    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
    showToast('Dados do advogado atualizados!');
  };

  const deleteTeamMember = (id) => {
    if (team.length <= 1) {
      showToast('Não é possível excluir o fundador titular.', 'error');
      return;
    }
    setTeam(prev => prev.filter(m => m.id !== id));
    showToast('Membro removido da equipe.', 'warning');
  };

  const resetTeam = () => {
    setTeam(DEFAULT_TEAM);
    showToast('Equipe restaurada!');
  };

  // Firm Config Actions
  const updateFirmConfig = (newConfig) => {
    setFirmConfig(prev => ({ ...prev, ...newConfig }));
    showToast('Configurações institucionais salvas!');
  };

  const resetFirmConfig = () => {
    setFirmConfig(FMA_CONFIG);
    showToast('Configurações institucionais restauradas!');
  };

  return (
    <FmaContext.Provider value={{
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      resetArticles,
      team,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      resetTeam,
      firmConfig,
      updateFirmConfig,
      resetFirmConfig,
      isAdminOpen,
      setIsAdminOpen,
      toast,
      showToast,
      theme,
      toggleTheme
    }}>
      {children}
    </FmaContext.Provider>
  );
}

export function useFma() {
  const ctx = useContext(FmaContext);
  if (!ctx) {
    throw new Error('useFma deve ser usado dentro de um FmaProvider');
  }
  return ctx;
}
