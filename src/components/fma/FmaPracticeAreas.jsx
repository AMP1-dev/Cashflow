import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HeartPulse, 
  FileCheck2, 
  PlaneTakeoff, 
  Building, 
  ArrowRight, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { FMA_PRACTICE_AREAS, FMA_CONFIG } from '../../data/fmaData';

const iconMap = {
  ShieldAlert: ShieldAlert,
  HeartPulse: HeartPulse,
  FileCheck2: FileCheck2,
  PlaneTakeoff: PlaneTakeoff,
  Building: Building
};

export function FmaPracticeAreas({ onSelectArea, onOpenTriage }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section id="atuacao" className="py-20 sm:py-28 bg-[#0A0B0E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fma-surface border border-fma-border text-xs text-fma-gold font-medium font-mono uppercase tracking-wider">
            Especialização Técnica & Resultados
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Áreas de Atuação Estratégica
          </h2>
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Foco exclusivo na defesa dos direitos civis, patrimoniais, saúde e contratuais.
            Compreendemos as particularidades de cada ramo para entregar soluções jurídicas seguras e eficazes.
          </p>

          {/* Strict Criminal Disclaimer Note */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
            <AlertCircle className="w-4 h-4 text-fma-gold flex-shrink-0" />
            <span><strong>Nota Institucional:</strong> O escritório <u>não atua na área criminal</u>. Foco 100% Cível, Bancário, Saúde e Contratos.</span>
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FMA_PRACTICE_AREAS.map((area, index) => {
            const IconComponent = iconMap[area.icon] || FileCheck2;
            const isHealthOrBank = area.id === 'direito-saude' || area.id === 'direito-bancario';

            return (
              <div
                key={area.id}
                onMouseEnter={() => setHoveredCard(area.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative rounded-2xl bg-fma-card border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  area.id === 'direito-saude' 
                    ? 'border-red-500/30 hover:border-red-500/60 lg:col-span-2' 
                    : area.id === 'direito-bancario'
                    ? 'border-fma-gold/30 hover:border-fma-gold/70'
                    : 'border-fma-border hover:border-zinc-700'
                } hover:shadow-2xl hover:shadow-black/60 p-6 sm:p-8`}
              >
                {/* Subtle top indicator line */}
                <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                  area.id === 'direito-saude' 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                    : area.id === 'direito-bancario'
                    ? 'bg-gradient-to-r from-fma-gold to-amber-400'
                    : 'bg-zinc-700 group-hover:bg-fma-gold'
                }`} />

                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                      area.id === 'direito-saude'
                        ? 'bg-red-950/40 border-red-500/30 text-red-400 group-hover:bg-red-900/50'
                        : area.id === 'direito-bancario'
                        ? 'bg-amber-950/40 border-amber-500/30 text-fma-gold group-hover:bg-amber-900/50'
                        : 'bg-fma-surface border-fma-border text-zinc-300 group-hover:text-fma-gold'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      area.id === 'direito-saude'
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : area.id === 'direito-bancario'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}>
                      {area.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-fma-goldLight transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                      {area.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {area.shortDesc}
                  </p>

                  {/* Highlighted Key Topics */}
                  <div className="space-y-2.5 mb-6 pt-4 border-t border-zinc-800/80">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                      Principais Frentes:
                    </span>
                    {area.topics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-fma-gold mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{topic.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Footers */}
                <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectArea(area)}
                    className="text-xs font-semibold text-fma-gold hover:text-white flex items-center gap-1.5 transition-colors group/btn"
                  >
                    <span>Ver Teses e Procedimentos</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {area.id === 'direito-saude' && (
                    <button
                      onClick={onOpenTriage}
                      className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-[11px] font-bold tracking-wide flex items-center gap-1.5 shadow-md"
                    >
                      <Clock className="w-3 h-3 animate-pulse" />
                      Plantão de Liminares
                    </button>
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
