import React from 'react';
import { useFma } from '../../context/FmaContext';

export function FmaPurposeLight() {
  const { firmConfig } = useFma();

  return (
    <section id="escritorio" className="relative w-full bg-[#FAFAF9] dark:bg-[#0A1A2F] py-20 sm:py-28 overflow-hidden border-t border-zinc-100 dark:border-white/10 transition-colors duration-300">
      
      {/* Top-Left Beige L-Frame Accent */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12 w-36 sm:w-48 h-36 sm:h-48 border-t-[20px] sm:border-t-[26px] border-l-[20px] sm:border-l-[26px] border-[#EFECE8] dark:border-[#0E2238] pointer-events-none transition-colors duration-300" />

      {/* Bottom-Right Beige L-Frame Accent */}
      <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 w-36 sm:w-48 h-36 sm:h-48 border-b-[20px] sm:border-b-[26px] border-r-[20px] sm:border-r-[26px] border-[#EFECE8] dark:border-[#0E2238] pointer-events-none transition-colors duration-300" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 relative z-10 space-y-8">
        
        {/* Main Purpose Headline */}
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-sans font-normal text-[#14233C] dark:text-white leading-[1.35] tracking-tight transition-colors">
          <strong className="font-bold text-[#14233C] dark:text-white">{firmConfig.name || 'FMA Advogados'} tem um propósito claro:</strong> oferecer soluções jurídicas com excelência técnica na construção de estratégias sólidas, no contencioso e no consultivo.
        </h2>

        {/* Sub-description with horizontal rule */}
        <div className="flex items-start gap-4 max-w-xl">
          <span className="w-12 h-[1px] bg-[#14233C] dark:bg-[#D9C8A6] mt-2.5 flex-shrink-0 transition-colors" />
          <p className="text-xs sm:text-sm text-[#556377] dark:text-[#CFD4DB] leading-relaxed font-normal transition-colors">
            Nossa atuação também é definida: contencioso estratégico, pareceres e opiniões legais, direito bancário, direito à saúde com plantão de liminares urgentes e assessoria técnica de parceiros.
          </p>
        </div>

        {/* Discrete Philosophical Quote */}
        <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 max-w-2xl transition-colors">
          <p className="font-serif italic text-sm text-[#8E7A66] dark:text-[#D9C8A6] leading-relaxed">
            "{firmConfig.philosophicalQuote?.text || 'A justiça é a vontade constante e perpétua de dar a cada um o que é seu.'}"
            <span className="block text-[11px] font-sans not-italic font-semibold tracking-wider text-[#14233C] dark:text-white uppercase mt-1">
              — {firmConfig.philosophicalQuote?.author || 'Ulpiano'} • OAB/SP 210.374
            </span>
          </p>
        </div>

      </div>

    </section>
  );
}
