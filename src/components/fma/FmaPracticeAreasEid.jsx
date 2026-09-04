import React from 'react';
import { ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { FMA_PRACTICE_AREAS } from '../../data/fmaData';

export function FmaPracticeAreasEid({ onSelectArea, onOpenTriage }) {
  return (
    <section id="atuacao" className="py-20 sm:py-28 bg-[#06172B] relative border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Heading (Idêntico ao Eid Advogados) */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-work font-bold text-white tracking-tight">
            Áreas de atuação
          </h2>
          <p className="text-sm sm:text-base text-[#CFD4DB]">
            Atuação especializada e estratégica para resultados consistentes em demandas de alta complexidade.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0E2238] border border-white/10 text-xs text-zinc-400">
            <AlertCircle className="w-3.5 h-3.5 text-eid-gold" />
            <span>Atuação exclusiva Cível e Saúde. <strong>Não atuamos na área criminal.</strong></span>
          </div>
        </div>

        {/* Clean Minimalist List (Idêntico à lista clean do Eid Advogados) */}
        <div className="space-y-6">
          {FMA_PRACTICE_AREAS.map((area, index) => {
            const isUrgent = area.id === 'direito-saude';

            return (
              <div
                key={area.id}
                onClick={() => onSelectArea(area)}
                className="group cursor-pointer p-8 sm:p-10 rounded-2xl bg-[#0A1A2F] border border-white/10 hover:border-eid-gold/60 transition-all duration-300 hover:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Left accent bar on hover */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-transparent group-hover:bg-eid-gold transition-colors" />

                <div className="space-y-2.5 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase text-[#8E7A66] font-semibold">
                      0{index + 1} • {area.badge}
                    </span>
                    {isUrgent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-pulse" />
                        Plantão Ativo
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-work font-bold text-white group-hover:text-eid-gold transition-colors leading-snug">
                    {area.title}
                  </h3>

                  <p className="text-sm text-[#CFD4DB] font-normal leading-relaxed">
                    {area.shortDesc}
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 pt-2 md:pt-0">
                  <span className="text-xs font-semibold text-eid-gold group-hover:text-white flex items-center gap-1.5 transition-colors">
                    <span>Ver detalhes</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
