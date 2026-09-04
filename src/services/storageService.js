import { initialSiteConfig, initialServices, initialPosts, initialTestimonials } from '../data/initialData';

const STORAGE_KEYS = {
  SITE_CONFIG: 'alianca_config_v1',
  SERVICES: 'alianca_services_v1',
  POSTS: 'alianca_posts_v1',
  TESTIMONIALS: 'alianca_testimonials_v1',
  LEADS: 'alianca_leads_v1',
  ADMIN_PASS: 'alianca_admin_pass_v1',
  AUTH_SESSION: 'alianca_auth_session_v1',
};

const DEFAULT_ADMIN_PASS = 'alianca2026';

function load(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Erro ao carregar chave ${key}:`, err);
    return defaultValue;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Erro ao salvar chave ${key}:`, err);
  }
}

export const storageService = {
  getConfig: () => load(STORAGE_KEYS.SITE_CONFIG, initialSiteConfig),
  saveConfig: (config) => save(STORAGE_KEYS.SITE_CONFIG, config),

  getServices: () => load(STORAGE_KEYS.SERVICES, initialServices),
  saveServices: (services) => save(STORAGE_KEYS.SERVICES, services),

  getPosts: () => load(STORAGE_KEYS.POSTS, initialPosts),
  savePosts: (posts) => save(STORAGE_KEYS.POSTS, posts),

  getTestimonials: () => load(STORAGE_KEYS.TESTIMONIALS, initialTestimonials),
  saveTestimonials: (testimonials) => save(STORAGE_KEYS.TESTIMONIALS, testimonials),

  getLeads: () => load(STORAGE_KEYS.LEADS, []),
  saveLeads: (leads) => save(STORAGE_KEYS.LEADS, leads),

  getAdminPass: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_ADMIN_PASS;
    } catch {
      return DEFAULT_ADMIN_PASS;
    }
  },
  saveAdminPass: (pass) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, pass);
    } catch (err) {
      console.error('Erro ao salvar senha admin:', err);
    }
  },

  getAuthSession: () => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
    } catch {
      return false;
    }
  },
  setAuthSession: (isAuth) => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, isAuth ? 'true' : 'false');
    } catch (err) {
      console.error('Erro ao salvar sessão auth:', err);
    }
  },

  exportFullBackup: () => {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      siteConfig: storageService.getConfig(),
      services: storageService.getServices(),
      posts: storageService.getPosts(),
      testimonials: storageService.getTestimonials(),
      leads: storageService.getLeads(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullBackup: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.siteConfig || !data.services) {
        throw new Error('Formato de backup inválido.');
      }
      if (data.siteConfig) storageService.saveConfig(data.siteConfig);
      if (data.services) storageService.saveServices(data.services);
      if (data.posts) storageService.savePosts(data.posts);
      if (data.testimonials) storageService.saveTestimonials(data.testimonials);
      if (data.leads) storageService.saveLeads(data.leads);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  resetToDefaults: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SITE_CONFIG);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.POSTS);
      localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
      localStorage.removeItem(STORAGE_KEYS.LEADS);
    } catch (err) {
      console.error('Erro ao resetar storage:', err);
    }
  }
};

export function compressImageFile(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Erro ao carregar a imagem.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}
