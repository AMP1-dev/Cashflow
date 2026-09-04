import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const THEME_PALETTES = {
  'ruby-dark': {
    name: 'Vermelho Executivo & Grafite (Oficial Aliança)',
    vars: {
      '--primary-50': '254 242 242',
      '--primary-100': '254 226 226',
      '--primary-200': '254 202 202',
      '--primary-300': '252 165 165',
      '--primary-400': '248 113 113',
      '--primary-500': '239 68 68',
      '--primary-600': '220 38 38',
      '--primary-700': '185 28 28',
      '--primary-800': '153 27 27',
      '--primary-900': '127 29 29',
    }
  },
  'graphite-red': {
    name: 'Grafite Nobre & Vermelho Ruby',
    vars: {
      '--primary-50': '248 250 252',
      '--primary-100': '241 245 249',
      '--primary-200': '226 232 240',
      '--primary-300': '203 213 225',
      '--primary-400': '148 163 184',
      '--primary-500': '220 38 38',
      '--primary-600': '185 28 28',
      '--primary-700': '51 65 85',
      '--primary-800': '30 41 59',
      '--primary-900': '15 23 42',
    }
  },
  'navy-corporate': {
    name: 'Azul Marinho Corporativo',
    vars: {
      '--primary-50': '239 246 255',
      '--primary-100': '219 234 254',
      '--primary-200': '191 219 254',
      '--primary-300': '147 197 253',
      '--primary-400': '96 165 250',
      '--primary-500': '37 99 235',
      '--primary-600': '29 78 216',
      '--primary-700': '30 64 175',
      '--primary-800': '30 58 138',
      '--primary-900': '23 37 84',
    }
  },
  'emerald-gold': {
    name: 'Verde Esmeralda & Dourado Nobre',
    vars: {
      '--primary-50': '236 253 245',
      '--primary-100': '209 250 229',
      '--primary-200': '167 243 208',
      '--primary-300': '110 231 183',
      '--primary-400': '52 211 153',
      '--primary-500': '16 185 129',
      '--primary-600': '5 150 105',
      '--primary-700': '4 120 87',
      '--primary-800': '6 95 70',
      '--primary-900': '6 78 59',
    }
  }
};

function applyThemeVariables(themeId) {
  const activeTheme = themeId || 'ruby-dark';
  const themeData = THEME_PALETTES[activeTheme] || THEME_PALETTES['ruby-dark'];
  
  document.documentElement.setAttribute('data-theme', activeTheme);
  document.body.setAttribute('data-theme', activeTheme);
  
  Object.entries(themeData.vars).forEach(([cssVar, value]) => {
    document.documentElement.style.setProperty(cssVar, value);
    document.body.style.setProperty(cssVar, value);
  });
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [siteConfig, setSiteConfigState] = useState(() => {
    const cfg = storageService.getConfig();
    if (!cfg.theme) cfg.theme = 'ruby-dark';
    return cfg;
  });

  const [services, setServicesState] = useState(storageService.getServices());
  const [posts, setPostsState] = useState(storageService.getPosts());
  const [testimonials, setTestimonialsState] = useState(storageService.getTestimonials());
  const [leads, setLeadsState] = useState(storageService.getLeads());

  // Views & Modals
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalPrefill, setProposalPrefill] = useState(null);
  const [readingPost, setReadingPost] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Admin Auth
  const [isAdmin, setIsAdmin] = useState(storageService.getAuthSession());
  const [adminPass, setAdminPassState] = useState(storageService.getAdminPass());

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (siteConfig?.name) {
      document.title = `${siteConfig.name} — ${siteConfig.tagline || 'Contabilidade Estratégica'}`;
    }
    applyThemeVariables(siteConfig?.theme);
  }, [siteConfig]);

  const setTheme = (themeId) => {
    applyThemeVariables(themeId);
    const updated = { ...siteConfig, theme: themeId };
    setSiteConfigState(updated);
    storageService.saveConfig(updated);
    showToast(`Paleta visual alterada para: ${THEME_PALETTES[themeId]?.name || themeId}`);
  };

  const updateSiteConfig = (newConfig) => {
    const updated = { ...siteConfig, ...newConfig };
    setSiteConfigState(updated);
    storageService.saveConfig(updated);
    if (newConfig.theme) applyThemeVariables(newConfig.theme);
    showToast('Configurações institucionais salvas com sucesso!');
  };

  // Services CRUD
  const addService = (srv) => {
    const newSrv = { ...srv, id: `srv-${Date.now()}` };
    const updated = [...services, newSrv];
    setServicesState(updated);
    storageService.saveServices(updated);
    showToast('Novo serviço cadastrado com sucesso!');
  };

  const updateService = (id, fields) => {
    const updated = services.map(s => s.id === id ? { ...s, ...fields } : s);
    setServicesState(updated);
    storageService.saveServices(updated);
    showToast('Serviço atualizado com sucesso!');
  };

  const deleteService = (id) => {
    const updated = services.filter(s => s.id !== id);
    setServicesState(updated);
    storageService.saveServices(updated);
    showToast('Serviço removido.', 'info');
  };

  // Posts CRUD
  const addPost = (post) => {
    const newPost = {
      ...post,
      id: `post-${Date.now()}`,
      slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      date: post.date || new Date().toISOString().split('T')[0],
      author: post.author || 'Aliança Empresarial',
      gallery: post.gallery || []
    };
    const updated = [newPost, ...posts];
    setPostsState(updated);
    storageService.savePosts(updated);
    showToast('Artigo publicado com sucesso!');
  };

  const updatePost = (id, fields) => {
    const updated = posts.map(p => p.id === id ? { ...p, ...fields } : p);
    setPostsState(updated);
    storageService.savePosts(updated);
    showToast('Artigo atualizado!');
  };

  const deletePost = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPostsState(updated);
    storageService.savePosts(updated);
    showToast('Artigo removido.', 'info');
  };

  // Testimonials CRUD
  const addTestimonial = (item) => {
    const newItem = { ...item, id: `t-${Date.now()}` };
    const updated = [...testimonials, newItem];
    setTestimonialsState(updated);
    storageService.saveTestimonials(updated);
    showToast('Depoimento adicionado!');
  };

  const updateTestimonial = (id, fields) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...fields } : t);
    setTestimonialsState(updated);
    storageService.saveTestimonials(updated);
    showToast('Depoimento atualizado!');
  };

  const deleteTestimonial = (id) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonialsState(updated);
    storageService.saveTestimonials(updated);
    showToast('Depoimento removido.', 'info');
  };

  // Leads
  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    const updated = [newLead, ...leads];
    setLeadsState(updated);
    storageService.saveLeads(updated);
    showToast('Solicitação de proposta enviada com sucesso! Nossos especialistas entrarão em contato.');
    return newLead;
  };

  const markLeadRead = (id) => {
    const updated = leads.map(l => l.id === id ? { ...l, read: true } : l);
    setLeadsState(updated);
    storageService.saveLeads(updated);
  };

  const deleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeadsState(updated);
    storageService.saveLeads(updated);
    showToast('Registro de lead excluído.');
  };

  // Auth
  const login = (pass) => {
    if (pass === adminPass) {
      setIsAdmin(true);
      storageService.setAuthSession(true);
      showToast('Acesso administrativo autorizado!');
      return true;
    }
    showToast('Senha de acesso incorreta.', 'error');
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    storageService.setAuthSession(false);
    showToast('Sessão administrativa encerrada.');
  };

  const changeAdminPassword = (newPass) => {
    if (!newPass || newPass.length < 4) {
      showToast('A senha deve ter pelo menos 4 caracteres.', 'error');
      return false;
    }
    setAdminPassState(newPass);
    storageService.saveAdminPass(newPass);
    showToast('Senha administrativa alterada com sucesso!');
    return true;
  };

  const reloadFromStorage = () => {
    setSiteConfigState(storageService.getConfig());
    setServicesState(storageService.getServices());
    setPostsState(storageService.getPosts());
    setTestimonialsState(storageService.getTestimonials());
    setLeadsState(storageService.getLeads());
  };

  const importBackupData = (jsonString) => {
    const result = storageService.importFullBackup(jsonString);
    if (result.success) {
      reloadFromStorage();
      showToast('Backup restaurado com sucesso!');
      return true;
    } else {
      showToast(`Erro ao restaurar: ${result.error}`, 'error');
      return false;
    }
  };

  const resetAllData = () => {
    storageService.resetToDefaults();
    reloadFromStorage();
    showToast('Dados restaurados para os padrões da Aliança.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        setTheme,
        services,
        addService,
        updateService,
        deleteService,
        posts,
        addPost,
        updatePost,
        deletePost,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        leads,
        addLead,
        markLeadRead,
        deleteLead,
        currentView,
        setCurrentView,
        isProposalOpen,
        setIsProposalOpen,
        proposalPrefill,
        setProposalPrefill,
        readingPost,
        setReadingPost,
        selectedService,
        setSelectedService,
        isAdmin,
        login,
        logout,
        adminPass,
        changeAdminPassword,
        toast,
        showToast,
        importBackupData,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
}
