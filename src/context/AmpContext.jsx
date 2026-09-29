import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ampStorageService } from '../services/ampStorageService';

export const AMP_THEME_PALETTES = {
  'navy-gold': {
    name: 'Azul Nobre & Ouro Corporativo (Oficial AMP)',
    primaryColor: '#0A1128',
    accentColor: '#D97706',
    vars: {
      '--primary-50': '254 243 199',
      '--primary-100': '253 230 138',
      '--primary-500': '217 119 6',
      '--primary-600': '180 83 9',
      '--primary-700': '146 64 14',
    }
  },
  'tech-cyan': {
    name: 'Cyber Cyan & Deep Slate (Alta Tecnologia)',
    primaryColor: '#0B132B',
    accentColor: '#06B6D4',
    vars: {
      '--primary-50': '236 254 255',
      '--primary-100': '207 250 254',
      '--primary-500': '6 182 212',
      '--primary-600': '8 145 178',
      '--primary-700': '14 116 144',
    }
  },
  'emerald-corp': {
    name: 'Verde Esmeralda & Finanças Sólidas',
    primaryColor: '#06281E',
    accentColor: '#10B981',
    vars: {
      '--primary-50': '236 253 245',
      '--primary-100': '209 250 229',
      '--primary-500': '16 185 129',
      '--primary-600': '5 150 105',
      '--primary-700': '4 120 87',
    }
  },
  'graphite-dark': {
    name: 'Grafite Titanium & Platina Executiva',
    primaryColor: '#111827',
    accentColor: '#94A3B8',
    vars: {
      '--primary-50': '248 250 252',
      '--primary-100': '241 245 249',
      '--primary-500': '148 163 184',
      '--primary-600': '100 116 139',
      '--primary-700': '71 85 105',
    }
  }
};

const AmpContext = createContext();

export function AmpProvider({ children }) {
  // Core Entities State
  const [siteConfig, setSiteConfigState] = useState(() => ampStorageService.getConfig());
  const [assets, setAssetsState] = useState(() => ampStorageService.getAssets());
  const [services, setServicesState] = useState(() => ampStorageService.getServices());
  const [cases, setCasesState] = useState(() => ampStorageService.getCases());
  const [portalLinks, setPortalLinksState] = useState(() => ampStorageService.getPortalLinks());
  const [categoryProducts, setCategoryProductsState] = useState(() => ampStorageService.getCategoryProducts());
  const [ecosystemItems, setEcosystemItemsState] = useState(() => ampStorageService.getEcosystemItems());
  const [articles, setArticlesState] = useState(() => ampStorageService.getArticles());
  const [testimonials, setTestimonialsState] = useState(() => ampStorageService.getTestimonials());
  const [leads, setLeadsState] = useState(() => ampStorageService.getLeads());
  const [diagnostics, setDiagnosticsState] = useState(() => ampStorageService.getDiagnostics());

  // Views & Navigation
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin' | 'services' | 'cases' | 'diagnostic' | 'client-hub' | 'blog'

  // Modals & Drawers
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [diagnosticPrefill, setDiagnosticPrefill] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [readingArticle, setReadingArticle] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(null);

  // Embedded Radio Streaming Audio Player
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [radioVolume, setRadioVolume] = useState(0.8);
  const [isRadioMuted, setIsRadioMuted] = useState(false);
  const [isRadioExpanded, setIsRadioExpanded] = useState(false);
  const audioRef = useRef(null);

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState(() => ampStorageService.getAuthSession());
  const [adminPass, setAdminPassState] = useState(() => ampStorageService.getAdminPass());

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Light / Soft-Dark Theme Mode (default Light)
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('amp_theme_mode') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  const toggleThemeMode = () => {
    setThemeMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('amp_theme_mode', next);
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Apply CSS root variables for active palette
  useEffect(() => {
    const activePalette = AMP_THEME_PALETTES[siteConfig.theme] || AMP_THEME_PALETTES['navy-gold'];
    const root = document.documentElement;
    Object.entries(activePalette.vars).forEach(([cssVar, rgbValue]) => {
      root.style.setProperty(cssVar, rgbValue);
    });
    root.style.setProperty('--primary-color', activePalette.primaryColor);
    root.style.setProperty('--accent-color', activePalette.accentColor);
  }, [siteConfig.theme]);

  // Audio stream initialization
  useEffect(() => {
    const audio = new Audio('https://stream.zeno.fm/k2k047vuv0hvv');
    audio.volume = radioVolume;
    audio.preload = 'none';
    audioRef.current = audio;

    const handleEnded = () => setIsRadioPlaying(false);
    const handleError = () => {
      setIsRadioPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const toggleRadioPlay = () => {
    if (!audioRef.current) return;
    if (isRadioPlaying) {
      audioRef.current.pause();
      setIsRadioPlaying(false);
      showToast('Transmissão da Rádio Amplificadora pausada.', 'info');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsRadioPlaying(true);
          showToast('Sintonizado na Rádio Amplificadora ao vivo!', 'success');
        })
        .catch(err => {
          console.error('Audio play error:', err);
          showToast('Clique novamente para autorizar o áudio ao vivo.', 'warning');
        });
    }
  };

  const setRadioAudioVolume = (vol) => {
    setRadioVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    if (vol > 0 && isRadioMuted) setIsRadioMuted(false);
  };

  const toggleRadioMute = () => {
    if (audioRef.current) {
      if (isRadioMuted) {
        audioRef.current.volume = radioVolume;
        setIsRadioMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsRadioMuted(true);
      }
    }
  };

  // Theme configuration
  const setTheme = (themeId) => {
    const updated = { ...siteConfig, theme: themeId };
    setSiteConfigState(updated);
    ampStorageService.saveConfig(updated);
    showToast(`Paleta visual alterada para: ${AMP_THEME_PALETTES[themeId]?.name || themeId}`);
  };

  const updateSiteConfig = (newConfig) => {
    const updated = { ...siteConfig, ...newConfig };
    setSiteConfigState(updated);
    ampStorageService.saveConfig(updated);
    showToast('Configurações do Universo AMP salvas com sucesso!');
  };

  // Lead & Diagnostic Registration
  const submitLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Novo',
      read: false
    };
    const updated = [newLead, ...leads];
    setLeadsState(updated);
    ampStorageService.saveLeads(updated);
    showToast('Solicitação recebida com sucesso! Nossos diretores entrarão em contato.');
    return newLead;
  };

  const submitDiagnostic = (diagnosticData) => {
    const newDiag = {
      ...diagnosticData,
      id: `diag-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Aguardando Avaliação',
      read: false
    };
    const updated = [newDiag, ...diagnostics];
    setDiagnosticsState(updated);
    ampStorageService.saveDiagnostics(updated);
    showToast('Diagnóstico empresarial gerado com sucesso! Entraremos em contato para apresentar o plano.');
    return newDiag;
  };

  const markLeadStatus = (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status, read: true } : l);
    setLeadsState(updated);
    ampStorageService.saveLeads(updated);
    showToast(`Status do lead atualizado para "${status}"`);
  };

  const deleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeadsState(updated);
    ampStorageService.saveLeads(updated);
    showToast('Registro de lead excluído.', 'info');
  };

  const deleteDiagnostic = (id) => {
    const updated = diagnostics.filter(d => d.id !== id);
    setDiagnosticsState(updated);
    ampStorageService.saveDiagnostics(updated);
    showToast('Registro de diagnóstico excluído.', 'info');
  };

  // --- Dynamic Category Products CRUD & Reordering ---
  const addCategoryProduct = (categoryKey, product) => {
    const newProd = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      highlights: product.highlights || []
    };
    const targetCat = categoryProducts[categoryKey] || [];
    const updatedCat = [newProd, ...targetCat];
    const updatedAll = {
      ...categoryProducts,
      [categoryKey]: updatedCat
    };
    setCategoryProductsState(updatedAll);
    ampStorageService.saveCategoryProducts(updatedAll);
    showToast(`Card "${product.name}" adicionado com sucesso!`);
  };

  const updateCategoryProduct = (categoryKey, productId, fields) => {
    const targetCat = categoryProducts[categoryKey] || [];
    const updatedCat = targetCat.map(p => p.id === productId ? { ...p, ...fields } : p);
    const updatedAll = {
      ...categoryProducts,
      [categoryKey]: updatedCat
    };
    setCategoryProductsState(updatedAll);
    ampStorageService.saveCategoryProducts(updatedAll);
    showToast(`Card "${fields.name || 'do produto'}" atualizado!`);
  };

  const deleteCategoryProduct = (categoryKey, productId) => {
    const targetCat = categoryProducts[categoryKey] || [];
    const updatedCat = targetCat.filter(p => p.id !== productId);
    const updatedAll = {
      ...categoryProducts,
      [categoryKey]: updatedCat
    };
    setCategoryProductsState(updatedAll);
    ampStorageService.saveCategoryProducts(updatedAll);
    showToast('Card removido com sucesso.', 'info');
  };

  const moveCategoryProduct = (categoryKey, fromIndex, direction) => {
    const targetCat = [...(categoryProducts[categoryKey] || [])];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= targetCat.length) return;
    
    const [movedItem] = targetCat.splice(fromIndex, 1);
    targetCat.splice(toIndex, 0, movedItem);

    const updatedAll = {
      ...categoryProducts,
      [categoryKey]: targetCat
    };
    setCategoryProductsState(updatedAll);
    ampStorageService.saveCategoryProducts(updatedAll);
    showToast('Posição do card reorganizada!');
  };

  // --- Dynamic Ecosystem Items CRUD & Reordering ---
  const addEcosystemItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || `asset-${Date.now()}`,
      highlights: item.highlights || []
    };
    const updated = [newItem, ...ecosystemItems];
    setEcosystemItemsState(updated);
    ampStorageService.saveEcosystemItems(updated);
    showToast(`Ativo "${item.name}" adicionado ao Ecossistema!`);
  };

  const updateEcosystemItem = (id, fields) => {
    const updated = ecosystemItems.map(item => item.id === id ? { ...item, ...fields } : item);
    setEcosystemItemsState(updated);
    ampStorageService.saveEcosystemItems(updated);
    showToast(`Ativo "${fields.name || 'do ecossistema'}" atualizado!`);
  };

  const deleteEcosystemItem = (id) => {
    const updated = ecosystemItems.filter(item => item.id !== id);
    setEcosystemItemsState(updated);
    ampStorageService.saveEcosystemItems(updated);
    showToast('Ativo do ecossistema removido.', 'info');
  };

  const moveEcosystemItem = (fromIndex, direction) => {
    const list = [...ecosystemItems];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= list.length) return;
    
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);

    setEcosystemItemsState(list);
    ampStorageService.saveEcosystemItems(list);
    showToast('Ordem dos cards do ecossistema atualizada!');
  };

  // --- Dynamic Client Portal Links CRUD & Reordering ---
  const addPortalLink = (link) => {
    const newLink = {
      ...link,
      id: link.id || `portal-${Date.now()}`
    };
    const updated = [newLink, ...portalLinks];
    setPortalLinksState(updated);
    ampStorageService.savePortalLinks(updated);
    showToast(`Portal "${link.title}" adicionado à Central de Clientes!`);
  };

  const updatePortalLink = (id, fields) => {
    const updated = portalLinks.map(l => l.id === id ? { ...l, ...fields } : l);
    setPortalLinksState(updated);
    ampStorageService.savePortalLinks(updated);
    showToast(`Portal "${fields.title || ''}" atualizado!`);
  };

  const deletePortalLink = (id) => {
    const updated = portalLinks.filter(l => l.id !== id);
    setPortalLinksState(updated);
    ampStorageService.savePortalLinks(updated);
    showToast('Portal removido da Central.', 'info');
  };

  const movePortalLink = (fromIndex, direction) => {
    const list = [...portalLinks];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= list.length) return;
    
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);

    setPortalLinksState(list);
    ampStorageService.savePortalLinks(list);
    showToast('Ordem dos portais atualizada!');
  };

  // --- Corporate Services CRUD ---
  const addCorporateService = (srv) => {
    const newSrv = { ...srv, id: `srv-${Date.now()}` };
    const updated = [...services, newSrv];
    setServicesState(updated);
    ampStorageService.saveServices(updated);
    showToast('Serviço adicionado ao portfólio corporativo!');
  };

  const updateCorporateService = (id, fields) => {
    const updated = services.map(s => s.id === id ? { ...s, ...fields } : s);
    setServicesState(updated);
    ampStorageService.saveServices(updated);
    showToast('Serviço corporativo atualizado!');
  };

  const deleteCorporateService = (id) => {
    const updated = services.filter(s => s.id !== id);
    setServicesState(updated);
    ampStorageService.saveServices(updated);
    showToast('Serviço removido.', 'info');
  };

  const moveCorporateService = (fromIndex, direction) => {
    const list = [...services];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= list.length) return;
    
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);

    setServicesState(list);
    ampStorageService.saveServices(list);
    showToast('Ordem dos serviços atualizada!');
  };

  // --- Blog Articles CRUD ---
  const addArticle = (article) => {
    const newArt = {
      ...article,
      id: `art-${Date.now()}`,
      slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      date: article.date || new Date().toISOString().split('T')[0],
      author: article.author || 'Grupo AMP — Conselho Editorial'
    };
    const updated = [newArt, ...articles];
    setArticlesState(updated);
    ampStorageService.saveArticles(updated);
    showToast('Artigo técnico publicado com sucesso!');
  };

  const updateArticle = (id, fields) => {
    const updated = articles.map(a => a.id === id ? { ...a, ...fields } : a);
    setArticlesState(updated);
    ampStorageService.saveArticles(updated);
    showToast('Artigo técnico atualizado!');
  };

  const deleteArticle = (id) => {
    const updated = articles.filter(a => a.id !== id);
    setArticlesState(updated);
    ampStorageService.saveArticles(updated);
    showToast('Artigo removido.', 'info');
  };

  // --- Authentication ---
  const loginAdmin = (pass) => {
    if (pass === adminPass) {
      setIsAdmin(true);
      ampStorageService.setAuthSession(true);
      showToast('Acesso autorizado ao Painel Executivo do Grupo AMP!');
      return true;
    }
    showToast('Senha de acesso administrativo incorreta.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    ampStorageService.setAuthSession(false);
    showToast('Sessão administrativa encerrada.');
  };

  const changeAdminPassword = (newPass) => {
    if (!newPass || newPass.length < 4) {
      showToast('A senha deve ter no mínimo 4 caracteres.', 'error');
      return false;
    }
    setAdminPassState(newPass);
    ampStorageService.saveAdminPass(newPass);
    showToast('Senha administrativa alterada com sucesso!');
    return true;
  };

  const restoreBackup = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.siteConfig) {
        setSiteConfigState(data.siteConfig);
        ampStorageService.saveConfig(data.siteConfig);
      }
      if (data.services) {
        setServicesState(data.services);
        ampStorageService.saveServices(data.services);
      }
      if (data.categoryProducts) {
        setCategoryProductsState(data.categoryProducts);
        ampStorageService.saveCategoryProducts(data.categoryProducts);
      }
      if (data.ecosystemItems) {
        setEcosystemItemsState(data.ecosystemItems);
        ampStorageService.saveEcosystemItems(data.ecosystemItems);
      }
      if (data.portalLinks) {
        setPortalLinksState(data.portalLinks);
        ampStorageService.savePortalLinks(data.portalLinks);
      }
      if (data.articles) {
        setArticlesState(data.articles);
        ampStorageService.saveArticles(data.articles);
      }
      if (data.leads) {
        setLeadsState(data.leads);
        ampStorageService.saveLeads(data.leads);
      }
      if (data.diagnostics) {
        setDiagnosticsState(data.diagnostics);
        ampStorageService.saveDiagnostics(data.diagnostics);
      }
      showToast('Backup corporativo restaurado com sucesso!');
    } catch (err) {
      console.error('Erro ao restaurar backup:', err);
      showToast('Arquivo de backup inválido ou corrompido.', 'error');
    }
  };

  const resetAllCorporateData = () => {
    ampStorageService.resetDefaults();
    setSiteConfigState(ampStorageService.getConfig());
    setAssetsState(ampStorageService.getAssets());
    setServicesState(ampStorageService.getServices());
    setCasesState(ampStorageService.getCases());
    setPortalLinksState(ampStorageService.getPortalLinks());
    setCategoryProductsState(ampStorageService.getCategoryProducts());
    setEcosystemItemsState(ampStorageService.getEcosystemItems());
    setArticlesState(ampStorageService.getArticles());
    setTestimonialsState(ampStorageService.getTestimonials());
    showToast('Dados restaurados para os padrões de fábrica.');
  };

  return (
    <AmpContext.Provider value={{
      // Core Entities
      siteConfig,
      updateSiteConfig,
      setTheme,
      assets,
      services,
      addCorporateService,
      updateCorporateService,
      deleteCorporateService,
      moveCorporateService,
      cases,
      portalLinks,
      addPortalLink,
      updatePortalLink,
      deletePortalLink,
      movePortalLink,
      categoryProducts,
      addCategoryProduct,
      updateCategoryProduct,
      deleteCategoryProduct,
      moveCategoryProduct,
      ecosystemItems,
      addEcosystemItem,
      updateEcosystemItem,
      deleteEcosystemItem,
      moveEcosystemItem,
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      testimonials,
      leads,
      diagnostics,

      // Views & Navigation
      currentView,
      setCurrentView,

      // Modals
      isDiagnosticModalOpen,
      setIsDiagnosticModalOpen,
      diagnosticPrefill,
      setDiagnosticPrefill,
      selectedService,
      setSelectedService,
      selectedCase,
      setSelectedCase,
      readingArticle,
      setReadingArticle,
      isContactModalOpen,
      setIsContactModalOpen,
      isAssetDetailOpen,
      setIsAssetDetailOpen,

      // Radio Streaming
      isRadioPlaying,
      toggleRadioPlay,
      radioVolume,
      setRadioAudioVolume,
      isRadioMuted,
      toggleRadioMute,
      isRadioExpanded,
      setIsRadioExpanded,

      // Admin & Security
      isAdmin,
      loginAdmin,
      logoutAdmin,
      changeAdminPassword,
      markLeadStatus,
      deleteLead,
      deleteDiagnostic,
      submitLead,
      submitDiagnostic,
      restoreBackup,
      resetAllCorporateData,

      // UI
      toast,
      showToast,
      themeMode,
      toggleThemeMode
    }}>
      {children}
    </AmpContext.Provider>
  );
}

export function useAmp() {
  const context = useContext(AmpContext);
  if (!context) {
    throw new Error('useAmp must be used within an AmpProvider');
  }
  return context;
}
