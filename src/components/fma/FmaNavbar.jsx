import React, { useState, useEffect } from 'react';
import { Scale, Phone, Shield, Menu, X, ArrowRight, Clock, Award, Lock } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaNavbar({ onOpenTriage }) {
  const { firmConfig, setIsAdminOpen } = useFma();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Áreas de Atuação', href: '#atuacao' },
    { label: 'Plantão de Liminares', href: '#triagem' },
    { label: 'Corpo Jurídico', href: '#equipe' },
    { label: 'Artigos & Notícias', href: '#artigos' },
    { label: 'Avaliações', href: '#depoimentos' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' }
  ];

  return (
    <>
      {/* Top micro-bar institucional minimalista */}
      <div className="bg-[#07080B] border-b border-fma-border/40 text-[11px] text-fma-textMuted py-2 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-zinc-300 font-times">
              <Shield className="w-3.5 h-3.5 text-fma-gold" />
              {firmConfig.oab || 'OAB/SP 210.374'} • {firmConfig.aasp || 'AASP'}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Award className="w-3.5 h-3.5 text-fma-gold" />
              {firmConfig.yearsOfExperience || '20+ Anos'} de Atuação Forense
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Plantão de Liminares Ativo
            </span>
            <span className="text-zinc-700">|</span>
            <a 
              href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fma-gold transition-colors flex items-center gap-1.5 text-zinc-300 font-medium"
            >
              <Phone className="w-3 h-3 text-fma-gold" />
              {firmConfig.contacts?.whatsappFormatted || '(11) 94890-0900'}
            </a>
            <span className="text-zinc-700">|</span>
            {/* Discreet Admin Lock Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-fma-gold transition-colors flex items-center gap-1 text-zinc-500 hover:text-zinc-300"
              title="Acesso Administrativo / Gestão de Conteúdo"
            >
              <Lock className="w-3 h-3" />
              <span>Gestão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Apple-style frosted navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0A0B0E]/95 backdrop-blur-xl border-b border-fma-border shadow-2xl py-3' 
          : 'bg-[#0A0B0E]/75 backdrop-blur-md border-b border-white/5 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#inicio" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12141A] to-[#1A1D26] border border-fma-gold/30 flex items-center justify-center text-fma-gold group-hover:border-fma-gold transition-all shadow-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-times text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-fma-goldLight transition-colors">
                {firmConfig.name || 'FMA ADVOGADOS'}
              </span>
              <span className="block text-[10px] tracking-widest text-zinc-400 uppercase font-mono">
                {firmConfig.founder || 'Fernando Maeda'} • {firmConfig.oab || 'OAB/SP 210.374'}
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs tracking-wider text-zinc-300 hover:text-fma-gold transition-colors font-medium py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-fma-gold hover:after:w-full after:transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Quick CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenTriage}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-xl shadow-red-950/50 border border-red-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <Clock className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Plantão de Liminares</span>
            </button>

            <a
              href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de agendar uma consulta preliminar.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-fma-surface hover:bg-zinc-800 border border-fma-border hover:border-fma-gold/50 text-xs font-medium text-white flex items-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-fma-gold" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-fma-card border border-fma-border text-zinc-300 hover:text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F1116] border-b border-fma-border px-6 pt-4 pb-6 space-y-3 animate-fadeIn">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 hover:text-fma-gold py-2 border-b border-zinc-800/40"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTriage();
                }}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Clock className="w-4 h-4" />
                Plantão de Liminares Urgentes
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Painel Administrativo
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
