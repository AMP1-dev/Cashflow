import React, { useState, useEffect } from 'react';
import { Scale, Phone, Menu, X, Lock, ShieldCheck, Clock } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaNavbarEid({ onOpenTriage }) {
  const { firmConfig, setIsAdminOpen } = useFma();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Escritório', href: '#escritorio' },
    { label: 'Atuação', href: '#atuacao' },
    { label: 'Equipe', href: '#equipe' },
    { label: 'Artigos', href: '#artigos' },
    { label: 'Contato', href: '#contato' }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#06172B]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5' 
        : 'bg-[#06172B] border-b border-white/5 py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Brand Logo (Estilo Eid Advogados) */}
        <a href="#inicio" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-lg bg-[#0E2238] border border-eid-gold/30 flex items-center justify-center text-eid-gold group-hover:border-eid-gold transition-all shadow">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-work text-xl font-bold tracking-tight text-white group-hover:text-eid-gold transition-colors">
              {firmConfig.name || 'FMA ADVOGADOS'}
            </span>
            <span className="block text-[10px] tracking-widest text-[#8E7A66] uppercase font-mono">
              {firmConfig.founder || 'Fernando Maeda'} • {firmConfig.oab || 'OAB/SP 210.374'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation (Estilo Eid) */}
        <nav className="hidden md:flex items-center gap-9">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium tracking-wide text-[#CFD4DB] hover:text-eid-gold transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-eid-gold hover:after:w-full after:transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenTriage}
            className="px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold tracking-wide flex items-center gap-2 transition-all shadow-md"
          >
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Plantão Liminares</span>
          </button>

          <a
            href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de agendar uma consulta preliminar.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#0E2238] hover:bg-[#152E4B] border border-eid-gold/30 text-xs font-medium text-white flex items-center gap-2 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-eid-gold" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-lg bg-transparent hover:bg-white/5 text-zinc-500 hover:text-eid-gold transition-colors"
            title="Acesso Administrativo"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-[#0E2238] text-zinc-300 hover:text-white"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A1A2E] border-b border-white/10 px-6 pt-4 pb-6 space-y-3 animate-fadeIn">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[#CFD4DB] hover:text-eid-gold py-2 border-b border-white/5"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenTriage();
              }}
              className="w-full py-2.5 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Plantão de Liminares Urgentes
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full py-2 rounded-lg bg-[#06172B] border border-white/10 text-zinc-400 text-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Painel do Escritório
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
