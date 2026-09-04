import React, { useState, useEffect } from 'react';
import { useAmp } from '../../context/AmpContext';
import { AmpLogo } from './AmpLogo';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Lock,
  Radio,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  PhoneCall,
  Globe,
  Headphones
} from 'lucide-react';

export function AmpNavbar() {
  const {
    currentView,
    setCurrentView,
    setIsDiagnosticModalOpen,
    isAdmin,
    isRadioPlaying,
    toggleRadioPlay,
    themeMode,
    toggleThemeMode
  } = useAmp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Visão Geral', href: '#inicio' },
    { label: 'Arquitetura Full-Stack', href: '#fullstack' },
    { label: 'Ecossistema & Produtos', href: '#produtos' },
    { label: 'Cases por Indústria', href: '#cases-industria' },
    { label: 'Liderança & Uptime', href: '#lideranca' },
    { label: 'Central de Clientes', href: '#central-clientes' },
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

  const isDark = themeMode === 'dark';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled
        ? isDark
          ? 'bg-[#0F172A]/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-2.5'
          : 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-2.5'
        : isDark
          ? 'bg-[#0F172A]/85 backdrop-blur-sm border-b border-slate-800/80 py-3.5'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/80 py-3.5'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Official Brand Logo & Main Navigation */}
          <div className="flex items-center gap-8">
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); handleNavClick('#inicio'); }}
              className="cursor-pointer shrink-0"
            >
              <AmpLogo light={isDark} />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-[13px] font-normal transition-colors ${
                    isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-700 hover:text-[#0052D9]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Controls & Actions (Alibaba Cloud pattern) */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Quick Search Input */}
            <div className="relative w-44 xl:w-56">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Buscar soluções..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#0052D9] ${
                  isDark
                    ? 'bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400'
                    : 'bg-slate-100/90 border border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Live Radio Minimal Pill */}
            <button
              onClick={toggleRadioPlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-normal transition-all ${
                isRadioPlaying
                  ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-sm animate-pulse'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Sintonizar Rádio Amplificadora Ao Vivo"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isRadioPlaying ? 'No Ar' : 'Rádio AMP'}</span>
            </button>

            {/* Theme Mode Switcher (Light / Soft-Dark) */}
            <button
              onClick={toggleThemeMode}
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? 'Mudar para Modo Claro (Branco & Azul Petróleo)' : 'Mudar para Modo Soft Dark'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
              className={`p-2 rounded-lg border text-xs transition-all ${
                currentView === 'admin'
                  ? 'bg-[#0052D9] text-white border-[#0052D9]'
                  : isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isAdmin ? 'Painel Executivo Ativo' : 'Acesso Diretoria'}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Login / Client Portal Button */}
            <button
              onClick={() => handleNavClick('#central-clientes')}
              className={`px-3.5 py-1.5 text-xs font-normal transition-colors rounded-lg ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-[#0052D9] hover:bg-slate-100'
              }`}
            >
              Console / Login
            </button>

            {/* Primary Action Button: Azul Petróleo (Matching Alibaba Cloud Free Trial button) */}
            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-[#0052D9] hover:bg-[#003B99] text-white font-normal text-xs tracking-wide shadow-sm shadow-blue-900/10 transition-all flex items-center gap-1.5"
            >
              <span>Diagnóstico 360°</span>
            </button>

          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleThemeMode}
              className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#0052D9] text-white font-normal text-xs"
            >
              Diagnóstico
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-6 pt-4 pb-6 shadow-2xl transition-all ${
          isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`w-full text-left py-2.5 text-xs font-normal border-b ${
                  isDark
                    ? 'text-slate-300 hover:text-white border-slate-800'
                    : 'text-slate-700 hover:text-[#0052D9] border-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setIsDiagnosticModalOpen(true); }}
              className="w-full py-2.5 rounded-lg bg-[#0052D9] text-white text-xs font-normal flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Solicitar Diagnóstico Corporativo Gratuito
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); toggleRadioPlay(); }}
              className={`w-full py-2 rounded-lg border text-xs font-normal flex items-center justify-center gap-2 ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Radio className="w-4 h-4 text-fuchsia-500" />
              <span>{isRadioPlaying ? 'Pausar Rádio Amplificadora' : 'Ouvir Rádio Ao Vivo'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
