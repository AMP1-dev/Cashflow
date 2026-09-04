import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMPANY_INFO, PRODUCTS } from '../data/drywallData';

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
    const { name, company, city, segment, note } = customerData;
    let message = `*SOLICITAÇÃO DE COTAÇÃO - DRYWALL DISTRIBUIDORA / DI BRUNELLI*\n`;
    message += `Olá! Gostaria de receber os preços de distribuidora e prazos de entrega para o interior de SP.\n\n`;

    if (name) message += `👤 *Cliente:* ${name}\n`;
    if (company) message += `🏢 *Empresa / Atuação:* ${company} (${segment || 'Gesseiro / Instalador'})\n`;
    if (city) message += `📍 *Cidade / Obra:* ${city} - SP\n`;
    if (note) message += `💬 *Observação:* ${note}\n`;

    message += `\n📦 *ITENS DA COTAÇÃO:* \n`;
    if (cart.length > 0) {
      cart.forEach((item, idx) => {
        message += `${idx + 1}. *${item.product.title}*\n   - Qtd: ${item.quantity} ${item.product.unit}\n   - Ref: ${item.product.categoryLabel} (${item.product.brand})\n`;
      });
    } else {
      message += `(Solicitação geral de catálogo completo e tabela de preços para volume)\n`;
    }

    message += `\nAguardo retorno do consultor de vendas. Obrigado!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encoded}`;
  };

  return (
    <DrywallContext.Provider
      value={{
        theme,
        toggleTheme,
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
        company: COMPANY_INFO
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
