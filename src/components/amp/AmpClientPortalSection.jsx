import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  ShieldCheck,
  Calculator,
  HeartHandshake,
  Radio,
  TrendingUp,
  Mail,
  Lock,
  Headset,
  Gift,
  Scale,
  CreditCard,
  Briefcase
} from 'lucide-react';

export function AmpClientPortalSection() {
  const { portalLinks, toggleRadioPlay, isRadioPlaying, themeMode } = useAmp();
  const isDark = themeMode === 'dark';

  const getPortalIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Calculator': return Calculator;
      case 'HeartHandshake': return HeartHandshake;
      case 'Radio': return Radio;
      case 'TrendingUp': return TrendingUp;
      case 'Gift': return Gift;
      case 'Scale': return Scale;
      case 'CreditCard': return CreditCard;
      case 'Briefcase': return Briefcase;
      case 'Mail': return Mail;
      default: return Headset;
    }
  };

  return (
    <section id="central-clientes" className={`py-20 border-t transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-150'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-left">
          <span className="text-xs font-medium uppercase tracking-widest text-[#0052D9] block mb-1">
            Área Restrita &amp; Operações
          </span>
          <h2 className={`text-2xl sm:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Central de Clientes &amp; Portais de Acesso
          </h2>
          <p className={`text-xs sm:text-sm font-light mt-1.5 max-w-2xl ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Ponto único de entrada para seus sistemas corporativos, abertura de chamados técnicos, guias fiscais e módulos de gestão.
          </p>
        </div>

        {/* Continuous Hairline Grid (NO isolated rounded cards, matching Image 2 & 3 hairline style!) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l ${
          isDark ? 'border-slate-800' : 'border-slate-150'
        }`}>
          {portalLinks.map((item) => {
            const IconComp = getPortalIcon(item.iconName);

            return (
              <div
                key={item.id}
                className={`p-6 border-r border-b flex flex-col justify-between transition-colors duration-150 group text-left ${
                  isDark
                    ? 'border-slate-800 hover:bg-slate-800/30'
                    : 'border-slate-150 hover:bg-slate-50/70'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                      isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>

                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0052D9]">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className={`text-sm font-normal transition-colors group-hover:text-[#0052D9] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs font-light leading-relaxed line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-light flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    Ambiente Seguro
                  </span>

                  {item.id === 'portal-radio' ? (
                    <button
                      onClick={toggleRadioPlay}
                      className="text-xs font-medium text-fuchsia-500 hover:text-fuchsia-600 flex items-center gap-1"
                    >
                      <Radio className="w-3 h-3" />
                      <span>{isRadioPlaying ? 'Pausar' : 'Ouvir Rádio'}</span>
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      target={item.url.startsWith('mailto') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-600 font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Acessar</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
