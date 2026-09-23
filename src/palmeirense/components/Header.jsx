import React, { useState } from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Menu,
  X,
  Settings,
  Shield,
  Sparkles
} from 'lucide-react';

export function Header() {
  const { clubConfig, setIsAdminOpen } = usePalmeirense();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0D]/95 backdrop-blur-md border-b border-white/10 transition-all">
      {/* Topbar Nobre ECP */}
      <div className="bg-[#060608] text-zinc-400 text-xs py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>Secretaria: Seg a Sex 08h às 18h | Sáb 08h às 12h</span>
            </span>
            <span className="hidden md:inline text-zinc-700">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{clubConfig.city}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://api.whatsapp.com/send?phone=${clubConfig.whatsapp}&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Esporte%20Clube%20Palmeirense.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold transition-colors text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{clubConfig.whatsappFormatted}</span>
            </a>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-white/10 text-[11px] font-semibold transition-colors"
              title="Painel Administrativo"
            >
              <Settings className="w-3 h-3 text-red-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navegação Principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Oficial ECP */}
        <a href="#hero" className="flex items-center gap-3.5 group">
          <div className="relative">
            <img
              src="/logo-ecp.png"
              alt="Brasão Oficial Esporte Clube Palmeirense"
              className="w-13 h-13 md:w-14 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(229,25,34,0.4)] group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-wider text-white uppercase font-outfit leading-none">
                Palmeirense
              </span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600/90 text-white tracking-widest">
                ECP
              </span>
            </div>
            <span className="block text-[10px] md:text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mt-0.5">
              Esporte Clube • Fundado em 1908
            </span>
          </div>
        </a>

        {/* Links Desktop Sofisticados */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-300">
          <a href="#hero" className="hover:text-red-500 transition-colors">Início</a>
          <a href="#sobre" className="hover:text-red-500 transition-colors">História</a>
          <a href="#parque-aquatico" className="hover:text-red-500 transition-colors">Parque Aquático</a>
          <a href="#esportes" className="hover:text-red-500 transition-colors">Esportes</a>
          <a href="#bailes-e-shows" className="hover:text-red-500 transition-colors">Bailes & Shows</a>
          <a href="#publicacoes" className="hover:text-red-400 text-white font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Publicações</span>
          </a>
          <a href="#eventos" className="hover:text-red-500 transition-colors">Agenda</a>
          <a href="#contato" className="hover:text-red-500 transition-colors">Contato</a>
        </nav>

        {/* Ação Seja Sócio */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#seja-socio"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,25,34,0.35)] hover:shadow-[0_0_25px_rgba(229,25,34,0.5)] transition-all flex items-center gap-2 border border-red-500/40"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Seja Sócio</span>
          </a>
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-zinc-300 hover:text-white"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111116] border-t border-white/10 px-5 py-5 space-y-3.5 shadow-2xl">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-200 font-bold uppercase tracking-wider text-xs hover:text-red-500"
          >
            Início
          </a>
          <a
            href="#sobre"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-200 font-bold uppercase tracking-wider text-xs hover:text-red-500"
          >
            História & Tradição (1908)
          </a>
          <a
            href="#parque-aquatico"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-200 font-bold uppercase tracking-wider text-xs hover:text-red-500"
          >
            Parque Aquático & Quiosques
          </a>
          <a
            href="#esportes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-200 font-bold uppercase tracking-wider text-xs hover:text-red-500"
          >
            Complexo Esportivo & Academia
          </a>
          <a
            href="#bailes-e-shows"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-200 font-bold uppercase tracking-wider text-xs hover:text-red-500"
          >
            Bailes, Boates & Shows
          </a>
          <a
            href="#publicacoes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-red-400 font-black uppercase tracking-wider text-xs"
          >
            Publicações & Compartilhamento
          </a>
          <a
            href="#eventos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-zinc-200 font-bold uppercase tracking-wider text-xs hover:text-red-500"
          >
            Agenda de Eventos
          </a>
          <a
            href="#seja-socio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 text-center bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg"
          >
            Quero ser Sócio
          </a>
        </div>
      )}
    </header>
  );
}
