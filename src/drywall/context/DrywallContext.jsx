import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { drywallStorageService } from '../services/drywallStorageService';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

const DrywallContext = createContext();

export function DrywallProvider({ children }) {
  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('drywall_theme');
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // Navigation View: 'portal' | 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'admin') return 'admin';
    }
    return 'portal';
  });

  // Cloud Database Sync Status
  const [cloudStatus, setCloudStatus] = useState(() => isSupabaseConfigured() ? 'syncing' : 'local');

  // Admin Auth
  const [isAdmin, setIsAdmin] = useState(() => drywallStorageService.getAuthSession());
  const [adminPass, setAdminPass] = useState(() => drywallStorageService.getAdminPass());

  // Managed Entities
  const [company, setCompanyState] = useState(() => drywallStorageService.getCompany());
  const [products, setProductsState] = useState(() => drywallStorageService.getProducts());
  const [storeItems, setStoreItemsState] = useState(() => drywallStorageService.getStoreItems());
  const [utilities, setUtilitiesState] = useState(() => drywallStorageService.getUtilities());
  const [news, setNewsState] = useState(() => drywallStorageService.getNews());
  const [regions, setRegionsState] = useState(() => drywallStorageService.getRegions());
  const [quotes, setQuotesState] = useState(() => drywallStorageService.getQuotes());

  // Cart of quote items: [{ product, quantity }]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('drywall_quote_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync with Supabase Cloud
  const syncWithCloud = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setCloudStatus('local');
      return;
    }
    try {
      setCloudStatus('syncing');
      const cloudQuotes = await drywallStorageService.fetchQuotesFromCloud();
      if (cloudQuotes && cloudQuotes.length > 0) {
        setQuotesState(cloudQuotes);
        setCloudStatus('connected');
      } else {
        // Connected to Supabase but table might be empty or fallback
        setCloudStatus('connected');
      }

      const cloudProducts = await drywallStorageService.fetchProductsFromCloud();
      if (cloudProducts && cloudProducts.length > 0) {
        setProductsState(cloudProducts);
      }
    } catch (err) {
      console.warn('[DrywallSync] Falha na sincronização em nuvem:', err);
      setCloudStatus('local');
    }
  }, []);

  useEffect(() => {
    syncWithCloud();
  }, [syncWithCloud]);

  // Realtime Supabase Subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    try {
      const channel = supabase
        .channel('drywall_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'drywall_cotacoes' }, () => {
          syncWithCloud();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription skipped:', e);
    }
  }, [syncWithCloud]);

  useEffect(() => {
    try {
      localStorage.setItem('drywall_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('drywall_quote_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // ---------------- AUTH METHODS ----------------
  const loginAdmin = (password) => {
    if (password === adminPass) {
      setIsAdmin(true);
      drywallStorageService.setAuthSession(true);
      showToast('Bem-vindo ao Painel Administrativo Drywall Distribuidora!', 'success');
      return true;
    } else {
      showToast('Senha administrativa incorreta.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    drywallStorageService.setAuthSession(false);
    setCurrentView('portal');
    showToast('Sessão administrativa encerrada.');
  };

  const changeAdminPassword = (newPassword) => {
    if (!newPassword || newPassword.length < 4) {
      showToast('A senha deve conter no mínimo 4 caracteres.', 'warning');
      return false;
    }
    setAdminPass(newPassword);
    drywallStorageService.saveAdminPass(newPassword);
    showToast('Senha administrativa atualizada com sucesso!');
    return true;
  };

  // ---------------- COMPANY CRUD ----------------
  const updateCompany = (newCompanyData) => {
    setCompanyState(prev => {
      const updated = { ...prev, ...newCompanyData };
      drywallStorageService.saveCompany(updated);
      return updated;
    });
    showToast('Configurações da distribuidora atualizadas!');
  };

  // ---------------- PRODUCTS CRUD ----------------
  const addProduct = (productData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...productData
    };
    setProductsState(prev => {
      const updated = [newProduct, ...prev];
      drywallStorageService.saveProducts(updated);
      return updated;
    });
    // Sync to Cloud Postgres
    drywallStorageService.saveProductToCloud(newProduct);
    showToast(`Produto "${newProduct.title}" cadastrado com sucesso!`);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProductsState(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedData } : p);
      drywallStorageService.saveProducts(updated);
      const target = updated.find(p => p.id === id);
      if (target) drywallStorageService.saveProductToCloud(target);
      return updated;
    });
    showToast('Produto atualizado com sucesso!');
  };

  const deleteProduct = (id) => {
    setProductsState(prev => {
      const updated = prev.filter(p => p.id !== id);
      drywallStorageService.saveProducts(updated);
      return updated;
    });
    // Delete in Cloud Postgres
    drywallStorageService.deleteProductFromCloud(id);
    showToast('Produto removido do catálogo.', 'info');
  };

  // ---------------- STORE ITEMS CRUD (Di Brunelli Demo) ----------------
  const addStoreItem = (itemData) => {
    const newItem = {
      id: `di-${Date.now()}`,
      ...itemData
    };
    setStoreItemsState(prev => {
      const updated = [...prev, newItem];
      drywallStorageService.saveStoreItems(updated);
      return updated;
    });
    showToast(`Item "${newItem.name}" adicionado à loja!`);
    return newItem;
  };

  const updateStoreItem = (id, updatedData) => {
    setStoreItemsState(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, ...updatedData } : i);
      drywallStorageService.saveStoreItems(updated);
      return updated;
    });
    showToast('Item da loja virtual atualizado!');
  };

  const deleteStoreItem = (id) => {
    setStoreItemsState(prev => {
      const updated = prev.filter(i => i.id !== id);
      drywallStorageService.saveStoreItems(updated);
      return updated;
    });
    showToast('Item removido da loja virtual.', 'info');
  };

  // ---------------- NEWS & GUIDES CRUD ----------------
  const addNews = (newsData) => {
    const newItem = {
      id: `news-${Date.now()}`,
      ...newsData
    };
    setNewsState(prev => {
      const updated = [newItem, ...prev];
      drywallStorageService.saveNews(updated);
      return updated;
    });
    showToast('Notícia / Guia técnico publicado com sucesso!');
  };

  const updateNews = (id, updatedData) => {
    setNewsState(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, ...updatedData } : n);
      drywallStorageService.saveNews(updated);
      return updated;
    });
    showToast('Notícia / Guia técnico atualizado!');
  };

  const deleteNews = (id) => {
    setNewsState(prev => {
      const updated = prev.filter(n => n.id !== id);
      drywallStorageService.saveNews(updated);
      return updated;
    });
    showToast('Notícia removida.', 'info');
  };

  // ---------------- REGIONS CRUD ----------------
  const addRegion = (regionData) => {
    setRegionsState(prev => {
      const updated = [...prev, regionData];
      drywallStorageService.saveRegions(updated);
      return updated;
    });
    showToast(`Região "${regionData.region}" adicionada!`);
  };

  const updateRegion = (index, updatedData) => {
    setRegionsState(prev => {
      const updated = prev.map((r, i) => i === index ? { ...r, ...updatedData } : r);
      drywallStorageService.saveRegions(updated);
      return updated;
    });
    showToast('Região de atendimento atualizada!');
  };

  const deleteRegion = (index) => {
    setRegionsState(prev => {
      const updated = prev.filter((_, i) => i !== index);
      drywallStorageService.saveRegions(updated);
      return updated;
    });
    showToast('Região removida com sucesso.', 'info');
  };

  // ---------------- QUOTES / LEADS CRM ----------------
  const addQuote = (quoteData) => {
    const newQuote = {
      id: `lead-${Date.now()}`,
      name: quoteData.name || 'Cliente Sem Nome',
      company: quoteData.company || '',
      phone: quoteData.phone || '',
      city: quoteData.city || 'Interior de SP',
      segment: quoteData.segment || 'Gesseiro / Instalador',
      message: quoteData.message || '',
      items: quoteData.items || [],
      status: 'novo',
      createdAt: new Date().toISOString(),
      notes: quoteData.notes || ''
    };

    setQuotesState(prev => {
      const updated = [newQuote, ...prev];
      drywallStorageService.saveQuotes(updated);
      return updated;
    });

    // Push to Supabase Cloud
    drywallStorageService.saveQuoteToCloud(newQuote);

    return newQuote;
  };

  const updateQuoteStatus = (id, status) => {
    setQuotesState(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, status } : q);
      drywallStorageService.saveQuotes(updated);
      return updated;
    });

    // Update in Supabase Cloud
    drywallStorageService.updateQuoteStatusInCloud(id, status);

    showToast(`Status da cotação alterado para: ${status}`);
  };

  const updateQuoteNotes = (id, notes) => {
    setQuotesState(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, notes } : q);
      drywallStorageService.saveQuotes(updated);
      return updated;
    });

    // Update in Supabase Cloud
    drywallStorageService.updateQuoteNotesInCloud(id, notes);

    showToast('Observações salvas com sucesso!');
  };

  const deleteQuote = (id) => {
    setQuotesState(prev => {
      const updated = prev.filter(q => q.id !== id);
      drywallStorageService.saveQuotes(updated);
      return updated;
    });

    // Delete in Supabase Cloud
    drywallStorageService.deleteQuoteInCloud(id);

    showToast('Cotação removida.', 'info');
  };

  // ---------------- CART METHODS ----------------
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.title}" adicionado à cotação!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removido da cotação.', 'info');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast('Lista de cotação esvaziada.', 'info');
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Generate WhatsApp formatted URL
  const generateWhatsAppLink = (customerData = {}) => {
    const { name, company: customerCompany, city, segment, note } = customerData;
    let message = `*SOLICITAÇÃO DE COTAÇÃO - ${company.name.toUpperCase()} / ${company.brandTransition.toUpperCase()}*\n`;
    message += `Olá! Gostaria de receber os preços de distribuidora e prazos de entrega para o interior de SP.\n\n`;

    if (name) message += `👤 *Cliente:* ${name}\n`;
    if (customerCompany) message += `🏢 *Empresa / Atuação:* ${customerCompany} (${segment || 'Gesseiro / Instalador'})\n`;
    if (city) message += `📍 *Cidade / Obra:* ${city} - SP\n`;
    if (note) message += `💬 *Observação:* ${note}\n`;

    message += `\n📦 *ITENS DA COTAÇÃO:* \n`;
    if (cart.length > 0) {
      cart.forEach((item, idx) => {
        message += `${idx + 1}. *${item.product.title}*\n   - Qtd: ${item.quantity} ${item.product.unit}\n   - Ref: ${item.product.category || 'Drywall'}\n`;
      });
    } else {
      message += `(Solicitação geral de catálogo completo e tabela de preços para volume)\n`;
    }

    message += `\nAguardo retorno do consultor de vendas. Obrigado!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${company.whatsapp}?text=${encoded}`;
  };

  // ---------------- BACKUP & RESTORE ----------------
  const exportBackup = () => {
    const backupJson = drywallStorageService.exportFullBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drywall_distribuidora_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup completo exportado com sucesso!');
  };

  const importBackup = (jsonString) => {
    const result = drywallStorageService.importFullBackup(jsonString);
    if (result.success) {
      setCompanyState(drywallStorageService.getCompany());
      setProductsState(drywallStorageService.getProducts());
      setStoreItemsState(drywallStorageService.getStoreItems());
      setUtilitiesState(drywallStorageService.getUtilities());
      setNewsState(drywallStorageService.getNews());
      setRegionsState(drywallStorageService.getRegions());
      setQuotesState(drywallStorageService.getQuotes());
      showToast('Dados restaurados com sucesso a partir do backup!');
      return true;
    } else {
      showToast(result.error || 'Erro ao importar backup.', 'error');
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados de fábrica da distribuidora? Todas as alterações manuais serão resetadas.')) {
      drywallStorageService.resetToDefaults();
      setCompanyState(drywallStorageService.getCompany());
      setProductsState(drywallStorageService.getProducts());
      setStoreItemsState(drywallStorageService.getStoreItems());
      setUtilitiesState(drywallStorageService.getUtilities());
      setNewsState(drywallStorageService.getNews());
      setRegionsState(drywallStorageService.getRegions());
      setQuotesState(drywallStorageService.getQuotes());
      setAdminPass(drywallStorageService.getAdminPass());
      showToast('Dados restaurados com sucesso aos padrões de fábrica!');
    }
  };

  return (
    <DrywallContext.Provider
      value={{
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        cloudStatus,
        syncWithCloud,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        company,
        updateCompany,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        storeItems,
        addStoreItem,
        updateStoreItem,
        deleteStoreItem,
        utilities,
        news,
        addNews,
        updateNews,
        deleteNews,
        regions,
        addRegion,
        updateRegion,
        deleteRegion,
        quotes,
        addQuote,
        updateQuoteStatus,
        updateQuoteNotes,
        deleteQuote,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProductModal,
        setSelectedProductModal,
        toast,
        showToast,
        generateWhatsAppLink,
        exportBackup,
        importBackup,
        resetToDefaults
      }}
    >
      {children}
    </DrywallContext.Provider>
  );
}

export const useDrywall = () => {
  const context = useContext(DrywallContext);
  if (!context) {
    throw new Error('useDrywall must be used within a DrywallProvider');
  }
  return context;
};
