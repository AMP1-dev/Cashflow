import React, { useState } from 'react';
import { 
  Layers, 
  MessageSquare, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Phone,
  Sparkles
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallNavbar() {
  const { theme, toggleTheme, company } = useDrywall();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Utilidades do Drywall', href: '#utilidades' },
    { name: 'Produtos Essenciais', href: '#produtos' },
    { name: 'Notícias & Vantagens', href: '#noticias' },
    { name: 'Onde Atendemos', href: '#regioes' },
    { name: 'Exemplo Loja Virtual', href: '#loja-demo' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0B0F19]/95 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0052D9] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              DRYWALL <span className="text-[#0052D9] font-extrabold text-sm uppercase">Distribuidora</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Interior de São Paulo &bull; Di Brunelli
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-[#0052D9] dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Alternar modo escuro"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de falar com a equipe da Drywall Distribuidora para cotar materiais no interior de SP.')}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Cotar no WhatsApp</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] px-4 py-4 space-y-2.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de cotar drywall para o interior de SP.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase text-white bg-emerald-600"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
