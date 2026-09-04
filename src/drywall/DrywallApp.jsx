import React from 'react';
import { DrywallProvider, useDrywall } from './context/DrywallContext';
import { DrywallNavbar } from './components/DrywallNavbar';
import { DrywallHero } from './components/DrywallHero';
import { DrywallUtilitiesSection } from './components/DrywallUtilitiesSection';
import { DrywallProductsSection } from './components/DrywallProductsSection';
import { DrywallLocationSection } from './components/DrywallLocationSection';
import { DrywallDiBrunelliStorePreview } from './components/DrywallDiBrunelliStorePreview';
import { DrywallQuoteSection } from './components/DrywallQuoteSection';
import { DrywallFooter } from './components/DrywallFooter';
import { MessageSquare, Check } from 'lucide-react';

function DrywallMainLayout() {
  const { theme, toast, company } = useDrywall();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0B0F19] text-slate-100 selection:bg-[#0052D9] selection:text-white' 
        : 'bg-white text-slate-900 selection:bg-blue-100 selection:text-[#0052D9]'
    }`}>
      
      {/* 1. Header & Navigation */}
      <DrywallNavbar />

      {/* Main Flow */}
      <main>
        {/* 2. Hero Largura Total - Direto e Limpo */}
        <DrywallHero />

        {/* 3. Utilidades do Drywall & Exemplos Práticos + Notícias com Links Válidos */}
        <DrywallUtilitiesSection />

        {/* 4. Produtos Essenciais da Distribuidora (Catálogo Enxuto) */}
        <DrywallProductsSection />

        {/* 5. Onde Atendemos (Polos de Entrega no Interior de SP) */}
        <DrywallLocationSection />

        {/* 6. Modelo de Exemplo: Futura Loja Virtual Di Brunelli (Captação de Pedidos) */}
        <DrywallDiBrunelliStorePreview />

        {/* 7. Central de Cotação de Preço (Formulário Rápido + WhatsApp) */}
        <DrywallQuoteSection />
      </main>

      {/* 8. Rodapé Completo e Clean */}
      <DrywallFooter />

      {/* Floating WhatsApp Quick Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de cotar produtos de drywall com a Drywall Distribuidora.')}`}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110 active:scale-95 group relative"
          title="Fale Conosco no WhatsApp"
          aria-label="Fale Conosco no WhatsApp"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Atendimento Comercial
          </span>
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-300 absolute top-0 right-0 border-2 border-white animate-ping"></span>
        </a>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="px-5 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-2 bg-slate-900 text-white border-slate-700">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DrywallApp() {
  return (
    <DrywallProvider>
      <DrywallMainLayout />
    </DrywallProvider>
  );
}
