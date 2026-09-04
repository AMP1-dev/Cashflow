import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Radio, Instagram, Youtube, Facebook, ArrowUp, Lock, Sparkles, Heart } from 'lucide-react';

export function RadioFooter() {
  const { config, setCurrentView } = useRadio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07060B] text-slate-400 text-xs border-t border-white/5 pb-24 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-16 flex items-center bg-white/5 px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg shadow-pink-500/10">
                <img
                  src={config.logoUrl || '/logo-amplificadora.png'}
                  alt={config.name}
                  className="h-14 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-black text-white">
                {config.name} — <span className="text-pink-400">{config.slogan}</span>
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                "{config.subSlogan || 'A música nos acompanha'}"
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {config.tagline || 'O melhor da música internacional, pop contemporâneo, grandes clássicos e festival vibes a partir das 22h.'}
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {config.social?.instagram && (
                <a href={config.social.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors shadow">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.social?.facebook && (
                <a href={config.social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {config.social?.youtube && (
                <a href={config.social.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors shadow">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Channels Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Canais & Estilos</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#canais" className="hover:text-pink-400 transition-colors">Pop Internacional & Hits (Alpha & Melody)</a></li>
              <li><a href="#canais" className="hover:text-pink-400 transition-colors">Acoustic, Jazz & Love Songs</a></li>
              <li><a href="#canais" className="hover:text-pink-400 transition-colors">Flashback & Clássicos de Ouro</a></li>
              <li><a href="#canais" className="hover:text-pink-400 transition-colors">Tomorrowland Sessions (A partir das 22h)</a></li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Navegação</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#player" className="hover:text-pink-400 transition-colors">Player Ao Vivo</a></li>
              <li><a href="#shows" className="hover:text-pink-400 transition-colors">Programação</a></li>
              <li><a href="#indoor" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">Rádio Indoor (B2B)</a></li>
              <li><a href="https://reserva.ink/amp" target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors font-bold flex items-center gap-1">Loja Reserva INK 👕 ↗</a></li>
              <li><a href="#grade" className="hover:text-pink-400 transition-colors">Grade Semanal</a></li>
              <li><a href="#noticias" className="hover:text-pink-400 transition-colors">Mundo Musical</a></li>
            </ul>
          </div>

          {/* Broadcast Specs */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Transmissão</h4>
            <p className="text-[11px] text-slate-400">Áudio HD 320 kbps Estéreo</p>
            <p className="text-[11px] text-pink-400 font-bold">24 Horas Conectada</p>
            
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('admin')}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Painel de Produção</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Amplificadora — "{config.slogan}" • "{config.subSlogan}".
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-black"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
