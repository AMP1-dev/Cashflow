import {
  initialAmpSiteConfig,
  initialEcosystemAssets,
  initialCorporateServices,
  initialSuccessCases,
  initialClientPortalLinks,
  initialBlogArticles,
  initialTestimonials
} from '../data/universoAmpData';

const AMP_STORAGE_KEYS = {
  SITE_CONFIG: 'amp_corporate_config_v1',
  ASSETS: 'amp_corporate_assets_v1',
  SERVICES: 'amp_corporate_services_v1',
  CASES: 'amp_corporate_cases_v1',
  PORTAL_LINKS: 'amp_corporate_portal_links_v1',
  ARTICLES: 'amp_corporate_articles_v1',
  TESTIMONIALS: 'amp_corporate_testimonials_v1',
  LEADS: 'amp_corporate_leads_v1',
  DIAGNOSTICS: 'amp_corporate_diagnostics_v1',
  ADMIN_PASS: 'amp_corporate_admin_pass_v1',
  AUTH_SESSION: 'amp_corporate_auth_session_v1',
};

const DEFAULT_ADMIN_PASS = 'amp2026';

function load(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Erro ao carregar storage chave ${key}:`, err);
    return defaultValue;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Erro ao salvar storage chave ${key}:`, err);
  }
}

export const ampStorageService = {
  getConfig: () => load(AMP_STORAGE_KEYS.SITE_CONFIG, initialAmpSiteConfig),
  saveConfig: (config) => save(AMP_STORAGE_KEYS.SITE_CONFIG, config),

  getAssets: () => load(AMP_STORAGE_KEYS.ASSETS, initialEcosystemAssets),
  saveAssets: (assets) => save(AMP_STORAGE_KEYS.ASSETS, assets),

  getServices: () => load(AMP_STORAGE_KEYS.SERVICES, initialCorporateServices),
  saveServices: (services) => save(AMP_STORAGE_KEYS.SERVICES, services),

  getCases: () => load(AMP_STORAGE_KEYS.CASES, initialSuccessCases),
  saveCases: (cases) => save(AMP_STORAGE_KEYS.CASES, cases),

  getPortalLinks: () => load(AMP_STORAGE_KEYS.PORTAL_LINKS, initialClientPortalLinks),
  savePortalLinks: (links) => save(AMP_STORAGE_KEYS.PORTAL_LINKS, links),

  getArticles: () => load(AMP_STORAGE_KEYS.ARTICLES, initialBlogArticles),
  saveArticles: (articles) => save(AMP_STORAGE_KEYS.ARTICLES, articles),

  getTestimonials: () => load(AMP_STORAGE_KEYS.TESTIMONIALS, initialTestimonials),
  saveTestimonials: (testimonials) => save(AMP_STORAGE_KEYS.TESTIMONIALS, testimonials),

  getLeads: () => load(AMP_STORAGE_KEYS.LEADS, []),
  saveLeads: (leads) => save(AMP_STORAGE_KEYS.LEADS, leads),

  getDiagnostics: () => load(AMP_STORAGE_KEYS.DIAGNOSTICS, []),
  saveDiagnostics: (diagnostics) => save(AMP_STORAGE_KEYS.DIAGNOSTICS, diagnostics),

  getAdminPass: () => {
    try {
      return localStorage.getItem(AMP_STORAGE_KEYS.ADMIN_PASS) || DEFAULT_ADMIN_PASS;
    } catch {
      return DEFAULT_ADMIN_PASS;
    }
  },
  saveAdminPass: (pass) => {
    try {
      localStorage.setItem(AMP_STORAGE_KEYS.ADMIN_PASS, pass);
    } catch (err) {
      console.error('Erro ao salvar senha admin AMP:', err);
    }
  },

  getAuthSession: () => {
    try {
      return sessionStorage.getItem(AMP_STORAGE_KEYS.AUTH_SESSION) === 'true';
    } catch {
      return false;
    }
  },
  setAuthSession: (isAuth) => {
    try {
      sessionStorage.setItem(AMP_STORAGE_KEYS.AUTH_SESSION, isAuth ? 'true' : 'false');
    } catch (err) {
      console.error('Erro ao salvar sessão auth AMP:', err);
    }
  },

  exportFullBackup: () => {
    const backup = {
      version: '1.0-universo-amp',
      timestamp: new Date().toISOString(),
      siteConfig: ampStorageService.getConfig(),
      assets: ampStorageService.getAssets(),
      services: ampStorageService.getServices(),
      cases: ampStorageService.getCases(),
      portalLinks: ampStorageService.getPortalLinks(),
      articles: ampStorageService.getArticles(),
      testimonials: ampStorageService.getTestimonials(),
      leads: ampStorageService.getLeads(),
      diagnostics: ampStorageService.getDiagnostics(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullBackup: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.siteConfig || !data.services) {
        throw new Error('Arquivo de backup inválido.');
      }
      if (data.siteConfig) ampStorageService.saveConfig(data.siteConfig);
      if (data.assets) ampStorageService.saveAssets(data.assets);
      if (data.services) ampStorageService.saveServices(data.services);
      if (data.cases) ampStorageService.saveCases(data.cases);
      if (data.portalLinks) ampStorageService.savePortalLinks(data.portalLinks);
      if (data.articles) ampStorageService.saveArticles(data.articles);
      if (data.testimonials) ampStorageService.saveTestimonials(data.testimonials);
      if (data.leads) ampStorageService.saveLeads(data.leads);
      if (data.diagnostics) ampStorageService.saveDiagnostics(data.diagnostics);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  resetToDefaults: () => {
    try {
      localStorage.removeItem(AMP_STORAGE_KEYS.SITE_CONFIG);
      localStorage.removeItem(AMP_STORAGE_KEYS.ASSETS);
      localStorage.removeItem(AMP_STORAGE_KEYS.SERVICES);
      localStorage.removeItem(AMP_STORAGE_KEYS.CASES);
      localStorage.removeItem(AMP_STORAGE_KEYS.PORTAL_LINKS);
      localStorage.removeItem(AMP_STORAGE_KEYS.ARTICLES);
      localStorage.removeItem(AMP_STORAGE_KEYS.TESTIMONIALS);
      localStorage.removeItem(AMP_STORAGE_KEYS.LEADS);
      localStorage.removeItem(AMP_STORAGE_KEYS.DIAGNOSTICS);
    } catch (err) {
      console.error('Erro ao resetar storage AMP:', err);
    }
  }
};
