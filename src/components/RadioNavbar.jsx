import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { Radio, Play, Pause, Music, Lock, Menu, X, Instagram, Youtube, Facebook } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export function RadioNavbar() {
  const { config, isPlaying, togglePlay, setIsRequestOpen, setCurrentView, currentView, isAdmin } = useRadio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Ao Vivo', href: '#player' },
    { label: 'Canais & Estilos', href: '#canais' },
    { label: 'Programação', href: '#shows' },
    { label: 'Rádio Indoor (B2B)', href: '#indoor', isB2B: true },
    { label: 'Grade Semanal', href: '#grade' },
    { label: 'Mundo Musical', href: '#noticias' },
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (currentView !== 'radio') {
      setCurrentView('radio');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-[#0B0A12]/95 backdrop-blur-xl border-b border-pink-500/20 shadow-2xl py-2.5'
        : 'bg-[#0B0A12]/85 backdrop-blur-md border-b border-white/5 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Prominent Brand Logo */}
          <a
            href="#player"
            onClick={(e) => { e.preventDefault(); handleNavClick('#player'); }}
            className="flex items-center gap-3.5 group"
          >
            <div className="h-14 sm:h-16 flex items-center bg-white/5 px-3 py-1 rounded-2xl border border-white/10 group-hover:border-pink-500/40 transition-all shadow-lg shadow-pink-500/10">
              <img
                src={config.logoUrl || '/logo-amplificadora.png'}
                alt={config.name}
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-transform"
              />
            </div>
            
            <div className="hidden sm:block">
              <span className="block text-xs font-black text-white uppercase tracking-wider leading-none">
                AMPLIFICADORA
              </span>
              <span className="block text-[11px] font-extrabold text-pink-400 mt-0.5">
                {config.slogan || 'Ampliando sua onda musical'}
              </span>
              <span className="block text-[9px] font-semibold text-slate-400 tracking-wide">
                {config.subSlogan || 'A música nos acompanha'}
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                  link.isB2B
                    ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Live Playing Badge / Visualizer */}
            <button
              onClick={() => togglePlay()}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-xs font-black text-pink-400 transition-all shadow-lg shadow-pink-500/10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
              <span>{isPlaying ? 'ON AIR' : 'OUVIR AO VIVO'}</span>
              <AudioVisualizer isPlaying={isPlaying} barCount={5} color="bg-pink-400" />
            </button>

            {/* Request Song CTA */}
            <button
              onClick={() => setIsRequestOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-pink-600/30 hover:scale-105 transition-all border border-pink-400/40"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Pedir Música</span>
            </button>

            {/* Admin Switch */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                currentView === 'admin'
                  ? 'bg-white text-slate-900 border-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title={isAdmin ? 'Painel Admin (Conectado)' : 'Acesso de Produção da Rádio'}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => togglePlay()}
              className="p-2 rounded-xl bg-pink-600 text-white shadow-lg shadow-pink-600/30"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-white/10 text-white border border-white/10"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0F0E18] border-b border-white/10 px-4 pt-3 pb-6 shadow-2xl animate-fadeIn space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => { setMobileOpen(false); setIsRequestOpen(true); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Music className="w-4 h-4" />
              Pedir Música no AutoDJ
            </button>

            <button
              onClick={() => { setMobileOpen(false); setCurrentView('admin'); }}
              className="w-full py-2 rounded-xl bg-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Painel de Produção da Rádio
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
