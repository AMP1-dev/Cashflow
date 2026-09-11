import {
  COMPANY_INFO,
  DRYWALL_UTILITIES,
  DRYWALL_NEWS,
  ESSENTIAL_PRODUCTS,
  SAMPLE_STORE_ITEMS,
  CITIES_SERVED
} from '../data/drywallData';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

const STORAGE_KEYS = {
  COMPANY: 'drywall_company_config_v1',
  PRODUCTS: 'drywall_products_v1',
  STORE_ITEMS: 'drywall_store_items_v1',
  UTILITIES: 'drywall_utilities_v1',
  NEWS: 'drywall_news_v1',
  REGIONS: 'drywall_regions_v1',
  QUOTES: 'drywall_quotes_leads_v1',
  ADMIN_PASS: 'drywall_admin_pass_v1',
  AUTH_SESSION: 'drywall_admin_session_v1',
};

const DEFAULT_ADMIN_PASS = 'drywall2026';

// Realistic initial sample quotes
export const INITIAL_QUOTES = [
  {
    id: 'lead-101',
    name: 'Eng. Roberto Faria',
    company: 'Construtora Metropolitana Campinas',
    phone: '(19) 99781-4420',
    city: 'Campinas - SP',
    segment: 'Construtora / Obra Residencial',
    message: 'Necessitamos de 250 chapas ST 12.5mm, 180 montantes 48mm e 35 rolos de lã de vidro Wallfelt para entrega urgente no Swiss Park.',
    items: [
      { name: 'Placa Drywall Standard ST 12.5mm', quantity: 250, unit: 'Chapa' },
      { name: 'Montante Metálico 48mm (3m)', quantity: 180, unit: 'Barra' },
      { name: 'Lã de Vidro Wallfelt 50mm', quantity: 35, unit: 'Rolo' }
    ],
    status: 'novo',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    notes: 'Prioridade alta. Verificar caminhão toco para condomínio fechado.'
  },
  {
    id: 'lead-102',
    name: 'Alessandro Santos (Gesso & Arte)',
    company: 'Spazio Gesso & Drywall',
    phone: '(15) 98112-9030',
    city: 'Sorocaba - SP',
    segment: 'Gesseiro / Instalador Especializado',
    message: 'Cotação para 80 chapas verdes RU para 6 banheiros de um centro comercial, 60 canaletas F530 e 8 baldes de massa 28kg.',
    items: [
      { name: 'Placa Drywall Resistente à Umidade RU (Verde)', quantity: 80, unit: 'Chapa' },
      { name: 'Canaleta F530 para Forro', quantity: 60, unit: 'Barra' },
      { name: 'Massa Pronta para Drywall Balde 28kg', quantity: 8, unit: 'Balde' }
    ],
    status: 'em_atendimento',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Enviado prévia de frete gratuito pela frota própria.'
  },
  {
    id: 'lead-103',
    name: 'Marcos Fonseca',
    company: 'M.F. Reformas Comerciais',
    phone: '(19) 98450-1122',
    city: 'Piracicaba - SP',
    segment: 'Empreiteiro',
    message: 'Favor enviar orçamento de perfis 70mm, parafusos GN25 (3 caixas) e tabicas brancas para forro rebaixado.',
    items: [
      { name: 'Perfis Estruturais Montantes & Guias 70', quantity: 90, unit: 'Barra' },
      { name: 'Tabica Branca para Forro', quantity: 40, unit: 'Barra' }
    ],
    status: 'orcamento_enviado',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Proposta comercial nº 482 enviada no WhatsApp. Aguardando aprovação.'
  },
  {
    id: 'lead-104',
    name: 'Dra. Lúcia Andrade',
    company: 'Clínica Integrada Odonto',
    phone: '(11) 97320-8819',
    city: 'Jundiaí - SP',
    segment: 'Cliente Final / Corporativo',
    message: 'Divisórias acústicas para 4 consultórios. Indicação de instalador e materiais com laudo de ruído.',
    items: [
      { name: 'Placa Drywall ST 12.5mm', quantity: 110, unit: 'Chapa' },
      { name: 'Lã de Vidro Wallfelt 70mm Acústica', quantity: 20, unit: 'Rolo' }
    ],
    status: 'fechado',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    notes: 'Fechado com faturamento 28 dias. Entrega programada para terça-feira.'
  }
];

function load(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`[DrywallStorage] Erro ao carregar ${key}:`, err);
    return defaultValue;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[DrywallStorage] Erro ao salvar ${key}:`, err);
  }
}

export const drywallStorageService = {
  // Check if Supabase Cloud Database is accessible
  isCloudEnabled: () => isSupabaseConfigured(),

  // Company Config
  getCompany: () => load(STORAGE_KEYS.COMPANY, COMPANY_INFO),
  saveCompany: (company) => save(STORAGE_KEYS.COMPANY, company),

  // Products Catalog
  getProducts: () => load(STORAGE_KEYS.PRODUCTS, ESSENTIAL_PRODUCTS),
  saveProducts: (products) => save(STORAGE_KEYS.PRODUCTS, products),

  // Store Items (Virtual Store Preview)
  getStoreItems: () => load(STORAGE_KEYS.STORE_ITEMS, SAMPLE_STORE_ITEMS),
  saveStoreItems: (items) => save(STORAGE_KEYS.STORE_ITEMS, items),

  // Utilities
  getUtilities: () => load(STORAGE_KEYS.UTILITIES, DRYWALL_UTILITIES),
  saveUtilities: (utilities) => save(STORAGE_KEYS.UTILITIES, utilities),

  // News / Technical Guides
  getNews: () => load(STORAGE_KEYS.NEWS, DRYWALL_NEWS),
  saveNews: (news) => save(STORAGE_KEYS.NEWS, news),

  // Delivery Regions
  getRegions: () => load(STORAGE_KEYS.REGIONS, CITIES_SERVED),
  saveRegions: (regions) => save(STORAGE_KEYS.REGIONS, regions),

  // Quotes / Leads CRM
  getQuotes: () => load(STORAGE_KEYS.QUOTES, INITIAL_QUOTES),
  saveQuotes: (quotes) => save(STORAGE_KEYS.QUOTES, quotes),

  // ---------------- CLOUD SUPABASE INTEGRATION METHODS ----------------

  // Fetch Quotes from Supabase Cloud
  fetchQuotesFromCloud: async () => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('drywall_cotacoes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        // Tentar tabela alternativa caso tenha sido criada com nome diferente
        const alt = await supabase.from('cotacoes_drywall').select('*').order('criado_em', { ascending: false });
        if (!alt.error && alt.data) {
          return alt.data.map(item => ({
            id: item.id,
            name: item.nome,
            phone: item.telefone,
            email: item.email,
            city: item.cidade,
            message: item.mensagem || item.necessidade,
            status: item.status || 'novo',
            createdAt: item.criado_em,
            notes: item.notes || ''
          }));
        }
        return null;
      }

      if (data) {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.nome,
          company: item.empresa || '',
          phone: item.telefone,
          city: item.cidade,
          segment: item.segmento || 'Gesseiro / Instalador',
          message: item.mensagem,
          items: item.itens || [],
          status: item.status || 'novo',
          createdAt: item.criado_em,
          notes: item.notes || ''
        }));
        save(STORAGE_KEYS.QUOTES, formatted);
        return formatted;
      }
      return [];
    } catch (err) {
      console.warn('[DrywallCloud] Supabase sync fallback:', err);
      return null;
    }
  },

  // Save new Quote to Supabase Cloud
  saveQuoteToCloud: async (quote) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase
        .from('drywall_cotacoes')
        .insert([{
          nome: quote.name,
          telefone: quote.phone,
          empresa: quote.company || '',
          cidade: quote.city || 'Interior de SP',
          segmento: quote.segment || 'Gesseiro / Instalador',
          mensagem: quote.message || '',
          itens: quote.items || [],
          status: quote.status || 'novo',
          notes: quote.notes || '',
          criado_em: quote.createdAt || new Date().toISOString()
        }]);
    } catch (err) {
      console.warn('[DrywallCloud] Erro ao salvar cotação no Supabase:', err);
    }
  },

  // Update Quote status in Supabase Cloud
  updateQuoteStatusInCloud: async (id, status) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase
        .from('drywall_cotacoes')
        .update({ status, atualizado_em: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('[DrywallCloud] Erro ao atualizar status no Supabase:', err);
    }
  },

  // Update Quote notes in Supabase Cloud
  updateQuoteNotesInCloud: async (id, notes) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase
        .from('drywall_cotacoes')
        .update({ notes, atualizado_em: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('[DrywallCloud] Erro ao atualizar notas no Supabase:', err);
    }
  },

  // Delete Quote in Supabase Cloud
  deleteQuoteInCloud: async (id) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase
        .from('drywall_cotacoes')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.warn('[DrywallCloud] Erro ao excluir no Supabase:', err);
    }
  },

  // Sync Products from Supabase Cloud
  fetchProductsFromCloud: async () => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('drywall_produtos')
        .select('*');

      if (!error && data && data.length > 0) {
        save(STORAGE_KEYS.PRODUCTS, data);
        return data;
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  // Upsert Product to Supabase Cloud
  saveProductToCloud: async (product) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase
        .from('drywall_produtos')
        .upsert([{
          id: product.id,
          title: product.title,
          subtitle: product.subtitle,
          category: product.category,
          specs: product.specs,
          unit: product.unit,
          badge: product.badge,
          image: product.image
        }]);
    } catch (err) {
      console.warn('[DrywallCloud] Erro ao sincronizar produto:', err);
    }
  },

  // Delete Product from Supabase Cloud
  deleteProductFromCloud: async (id) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase
        .from('drywall_produtos')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.warn('[DrywallCloud] Erro ao deletar produto no Supabase:', err);
    }
  },

  // Admin Password
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
      console.error('Erro ao salvar senha admin drywall:', err);
    }
  },

  // Admin Session
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
      console.error('Erro ao salvar sessão drywall:', err);
    }
  },

  // Export Full Backup
  exportFullBackup: () => {
    const backup = {
      system: 'Drywall Distribuidora / Di Brunelli',
      version: '2.0',
      timestamp: new Date().toISOString(),
      company: drywallStorageService.getCompany(),
      products: drywallStorageService.getProducts(),
      storeItems: drywallStorageService.getStoreItems(),
      utilities: drywallStorageService.getUtilities(),
      news: drywallStorageService.getNews(),
      regions: drywallStorageService.getRegions(),
      quotes: drywallStorageService.getQuotes(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import Backup
  importFullBackup: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.company && !data.products) {
        throw new Error('Arquivo de backup inválido para Drywall Distribuidora.');
      }
      if (data.company) drywallStorageService.saveCompany(data.company);
      if (data.products) drywallStorageService.saveProducts(data.products);
      if (data.storeItems) drywallStorageService.saveStoreItems(data.storeItems);
      if (data.utilities) drywallStorageService.saveUtilities(data.utilities);
      if (data.news) drywallStorageService.saveNews(data.news);
      if (data.regions) drywallStorageService.saveRegions(data.regions);
      if (data.quotes) drywallStorageService.saveQuotes(data.quotes);
      return { success: true };
    } catch (err) {
      console.error('Erro ao importar backup:', err);
      return { success: false, error: err.message };
    }
  },

  // Reset to Factory Defaults
  resetToDefaults: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPANY);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.STORE_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.UTILITIES);
      localStorage.removeItem(STORAGE_KEYS.NEWS);
      localStorage.removeItem(STORAGE_KEYS.REGIONS);
      localStorage.removeItem(STORAGE_KEYS.QUOTES);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
      return true;
    } catch (err) {
      console.error('Erro ao restaurar padrões:', err);
      return false;
    }
  }
};
