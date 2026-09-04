import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Phone, MessageCircle, Lock, Menu, X, ArrowUpRight, Calculator, ShieldCheck, ChevronDown, Palette } from 'lucide-react';

const themes = [
  { id: 'ruby-dark', label: 'Vermelho & Grafite (Oficial)', color: 'bg-red-600' },
  { id: 'graphite-red', label: 'Grafite Nobre', color: 'bg-slate-800' },
  { id: 'navy-corporate', label: 'Azul Corporativo', color: 'bg-blue-700' },
  { id: 'emerald-gold', label: 'Verde Esmeralda', color: 'bg-emerald-600' },
];

export function Navbar() {
  const { siteConfig, setTheme, setIsProposalOpen, setCurrentView, currentView, isAdmin } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Segmentos', href: '#segmentos' },
    { label: 'Simulador', href: '#simulador' },
    { label: 'Artigos & Notícias', href: '#artigos' },
    { label: 'Área do Cliente', href: '#portal' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Olá! Gostaria de uma consultoria contábil e proposta para minha empresa.`);
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-xl py-3 border-b border-slate-800' : 'bg-slate-900/80 backdrop-blur-sm py-4 border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a
            href="#inicio"
            onClick={(e) => { e.preventDefault(); handleNavClick('#inicio'); }}
            className="flex items-center gap-3 group"
          >
            {siteConfig.logoUrl ? (
              <div className="h-11 max-w-[180px] flex items-center justify-center">
                <img src={siteConfig.logoUrl} alt={siteConfig.name} className="max-h-11 w-auto object-contain" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-terracotta-600 to-terracotta-800 flex items-center justify-center text-white shadow-lg shadow-terracotta-600/30 group-hover:scale-105 transition-transform border border-white/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                    ALIANÇA
                    <span className="text-terracotta-500 font-light">EMPRESARIAL</span>
                  </span>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Contabilidade & Assessoria Estratégica
                  </span>
                </div>
              </div>
            )}
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Quick Theme Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemePickerOpen(!themePickerOpen)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors flex items-center gap-1"
                title="Trocar paleta visual"
              >
                <Palette className="w-4 h-4 text-terracotta-400" />
              </button>

              {themePickerOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-2.5 z-50 animate-fadeIn space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
                    Paleta Visual:
                  </div>
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        setThemePickerOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        (siteConfig.theme || 'ruby-dark') === th.id
                          ? 'bg-white/15 text-white ring-1 ring-terracotta-500'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${th.color} shadow-sm shrink-0`}></span>
                      <span>{th.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Button */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-white text-slate-900 border-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
              title={isAdmin ? 'Painel Admin (Conectado)' : 'Acesso Restrito da Diretoria'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isAdmin ? 'Painel' : 'Admin'}</span>
            </button>

            {/* Proposal CTA */}
            <button
              onClick={() => setIsProposalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-extrabold text-xs shadow-lg shadow-terracotta-600/30 hover:shadow-terracotta-600/50 hover:-translate-y-0.5 transition-all border border-terracotta-500/50"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Solicitar Proposta</span>
            </button>

          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsProposalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-terracotta-600 text-white font-bold text-xs shadow"
            >
              Proposta
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 rounded-xl text-left text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setIsProposalOpen(true); }}
              className="w-full py-3 rounded-xl bg-terracotta-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Calculator className="w-4 h-4" />
              Solicitar Diagnóstico Tributário Gratuito
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); handleWhatsApp(); }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView('admin'); }}
              className="w-full py-2 rounded-xl bg-white/10 text-gray-300 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Painel Administrativo da Diretoria
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
