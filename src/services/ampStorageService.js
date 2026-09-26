import {
  initialAmpSiteConfig,
  initialEcosystemAssets,
  initialCorporateServices,
  initialSuccessCases,
  initialClientPortalLinks,
  initialBlogArticles,
  initialTestimonials,
  initialCategoryProducts,
  initialEcosystemItems
} from '../data/universoAmpData';

const AMP_STORAGE_KEYS = {
  SITE_CONFIG: 'amp_corporate_config_v3',
  ASSETS: 'amp_corporate_assets_v3',
  SERVICES: 'amp_corporate_services_v3',
  CASES: 'amp_corporate_cases_v3',
  PORTAL_LINKS: 'amp_corporate_portal_links_v3',
  CATEGORY_PRODUCTS: 'amp_corporate_category_products_v3',
  ECOSYSTEM_ITEMS: 'amp_corporate_ecosystem_items_v3',
  ARTICLES: 'amp_corporate_articles_v3',
  TESTIMONIALS: 'amp_corporate_testimonials_v3',
  LEADS: 'amp_corporate_leads_v3',
  DIAGNOSTICS: 'amp_corporate_diagnostics_v3',
  ADMIN_PASS: 'amp_corporate_admin_pass_v3',
  AUTH_SESSION: 'amp_corporate_auth_session_v3',
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

  getCategoryProducts: () => load(AMP_STORAGE_KEYS.CATEGORY_PRODUCTS, initialCategoryProducts),
  saveCategoryProducts: (products) => save(AMP_STORAGE_KEYS.CATEGORY_PRODUCTS, products),

  getEcosystemItems: () => load(AMP_STORAGE_KEYS.ECOSYSTEM_ITEMS, initialEcosystemItems),
  saveEcosystemItems: (items) => save(AMP_STORAGE_KEYS.ECOSYSTEM_ITEMS, items),

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

  resetDefaults: () => {
    try {
      localStorage.removeItem(AMP_STORAGE_KEYS.SITE_CONFIG);
      localStorage.removeItem(AMP_STORAGE_KEYS.ASSETS);
      localStorage.removeItem(AMP_STORAGE_KEYS.SERVICES);
      localStorage.removeItem(AMP_STORAGE_KEYS.CASES);
      localStorage.removeItem(AMP_STORAGE_KEYS.PORTAL_LINKS);
      localStorage.removeItem(AMP_STORAGE_KEYS.CATEGORY_PRODUCTS);
      localStorage.removeItem(AMP_STORAGE_KEYS.ECOSYSTEM_ITEMS);
      localStorage.removeItem(AMP_STORAGE_KEYS.ARTICLES);
      localStorage.removeItem(AMP_STORAGE_KEYS.TESTIMONIALS);
    } catch (err) {
      console.error('Erro ao resetar storage AMP:', err);
    }
  }
};
