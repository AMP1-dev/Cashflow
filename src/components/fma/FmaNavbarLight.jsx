import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Lock, Moon, Sun } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaNavbarLight() {
  const { firmConfig, setIsAdminOpen, theme, toggleTheme } = useFma();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'ESCRITÓRIO', href: '#escritorio' },
    { label: 'ATUAÇÃO', href: '#atuacao' },
    { label: 'EQUIPE', href: '#equipe' },
    { label: 'ARTIGOS', href: '#artigos' },
    { label: 'CONTATO', href: '#contato' }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-[#06172B]/95 backdrop-blur-md shadow-sm py-4 border-b border-zinc-100 dark:border-white/10' 
        : 'bg-white dark:bg-[#06172B] py-6 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        
        {/* Brand Monogram Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif text-3xl font-light tracking-tight text-[#14233C] dark:text-white leading-none group-hover:text-[#8E7A66] transition-colors">
              FM
            </span>
            <span className="text-[9px] font-sans font-semibold tracking-[0.25em] text-[#14233C] dark:text-zinc-300 uppercase mt-1">
              ADVOGADOS
            </span>
          </div>
        </a>

        {/* Desktop Menu com os marcadores quadrados */}
        <nav className="hidden md:flex items-center gap-8 text-[12px] font-semibold tracking-[0.15em] text-[#14233C] dark:text-zinc-200">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] transition-colors py-1 group"
            >
              <span className="w-1.5 h-1.5 bg-[#8E7A66] dark:bg-[#D9C8A6] group-hover:bg-[#14233C] dark:group-hover:bg-white transition-colors inline-block" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Actions: Dark Mode Toggle + WhatsApp + Admin Lock */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* BOTÃO ALTERNAR MODO ESCURO / CLARO */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-[#0E2238] dark:hover:bg-[#152E4B] border border-zinc-200 dark:border-white/15 text-[#14233C] dark:text-[#D9C8A6] flex items-center justify-center transition-all shadow-sm group"
            title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label="Alternar Tema"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#D9C8A6] group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#14233C] group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          <a
            href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#14233C] hover:bg-[#8E7A66] dark:bg-[#0E2238] dark:hover:bg-[#152E4B] dark:border dark:border-white/10 text-white flex items-center justify-center transition-all shadow-sm"
            title="WhatsApp Direto"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-9 h-9 rounded-full bg-[#14233C] hover:bg-[#8E7A66] dark:bg-[#0E2238] dark:hover:bg-[#152E4B] dark:border dark:border-white/10 text-white flex items-center justify-center transition-all shadow-sm"
            title="Painel do Escritório"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#14233C] dark:text-white"
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDark ? <Sun className="w-5 h-5 text-[#D9C8A6]" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#14233C] dark:text-white"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#06172B] border-b border-zinc-200 dark:border-white/10 px-6 py-5 space-y-4 animate-fadeIn">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 text-sm font-semibold tracking-wider text-[#14233C] dark:text-zinc-200 hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span className="w-1.5 h-1.5 bg-[#8E7A66] dark:bg-[#D9C8A6] inline-block" />
              <span>{item.label}</span>
            </a>
          ))}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="flex-1 py-2.5 rounded bg-zinc-100 dark:bg-[#0E2238] text-xs font-semibold text-[#14233C] dark:text-zinc-200 flex items-center justify-center gap-2"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#D9C8A6]" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                setIsAdminOpen(true);
              }}
              className="flex-1 py-2.5 rounded bg-zinc-100 dark:bg-[#0E2238] text-xs font-semibold text-[#14233C] dark:text-zinc-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#8E7A66] dark:text-[#D9C8A6]" />
              <span>Painel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
