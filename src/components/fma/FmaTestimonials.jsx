import React from 'react';
import { Star, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';
import { FMA_TESTIMONIALS, FMA_CONFIG } from '../../data/fmaData';

export function FmaTestimonials() {
  return (
    <section id="depoimentos" className="py-20 sm:py-28 bg-[#0F1116] relative border-t border-fma-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-amber-400 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Depoimentos Reais & Verificados
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            A Confiança Conquistada em Mais de 20 Anos
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Avaliações públicas registradas diretamente no Google por clientes atendidos pelo Dr. Fernando Maeda.
          </p>

          {/* Aggregate Rating Badge */}
          <div className="inline-flex items-center gap-3 pt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-white">5.0 de 5.0</span>
            <span className="text-xs text-zinc-500">• {FMA_CONFIG.contacts.googleReviewsCount}</span>
          </div>
        </div>

        {/* Testimonials Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FMA_TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl bg-fma-card border border-fma-border p-6 sm:p-7 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all hover:shadow-xl shadow-black/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {review.source}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic font-normal">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="block font-serif font-bold text-sm text-white">
                    {review.author}
                  </span>
                  <span className="block text-[11px] text-zinc-500">
                    Avaliado em {review.date}
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" title="Cliente Verificado" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
