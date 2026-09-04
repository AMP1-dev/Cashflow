import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FMA_PRACTICE_AREAS } from '../../data/fmaData';

export function FmaPracticeAreasLight({ onSelectArea, onOpenTriage }) {
  return (
    <section id="atuacao" className="w-full bg-white dark:bg-[#06172B] py-20 sm:py-28 border-t border-zinc-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-12">
        
        {/* Section Marker (▶ ÁREAS DE ATUAÇÃO) */}
        <div className="flex items-center gap-2.5">
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#8E7A66] dark:border-l-[#D9C8A6] transition-colors" />
          <h2 className="text-sm font-sans font-bold tracking-[0.2em] text-[#14233C] dark:text-white uppercase transition-colors">
            Áreas de Atuação
          </h2>
        </div>

        {/* Clean Minimalist List */}
        <div className="divide-y divide-zinc-200/80 dark:divide-white/10 transition-colors">
          {FMA_PRACTICE_AREAS.map((area) => (
            <div
              key={area.id}
              onClick={() => onSelectArea(area)}
              className="py-10 sm:py-12 group cursor-pointer flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 transition-all hover:pl-2"
            >
              <div className="space-y-3 max-w-2xl">
                {/* Area Title in Warm Ochre / Camel in light, and Gold in dark */}
                <h3 className="text-2xl sm:text-3xl font-sans font-normal text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-[#14233C] dark:group-hover:text-white transition-colors tracking-tight">
                  {area.title}
                </h3>

                {/* Sub-description */}
                <p className="text-xs sm:text-sm text-[#556377] dark:text-[#CFD4DB] leading-relaxed font-normal transition-colors">
                  {area.shortDesc}
                </p>
              </div>

              {/* Long Minimalist Arrow on the Far Right */}
              <div className="flex items-center gap-2 text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-[#14233C] dark:group-hover:text-white transition-all flex-shrink-0 pt-2 sm:pt-0">
                <span className="w-8 sm:w-12 h-[1px] bg-current transition-all group-hover:w-16" />
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Discrete Notice */}
        <div className="pt-4 text-xs text-[#8E7A66] dark:text-[#D9C8A6] font-normal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>* Foco 100% Cível, Bancário, Contratual e Saúde. Não atuamos em direito criminal.</span>
          <button
            onClick={onOpenTriage}
            className="underline hover:text-[#14233C] dark:hover:text-white font-semibold transition-colors"
          >
            Plantão de Liminares 24h &rarr;
          </button>
        </div>

      </div>
    </section>
  );
}
