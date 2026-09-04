import React from 'react';
import { Scale, Feather, Sparkles } from 'lucide-react';
import { FMA_CONFIG } from '../../data/fmaData';

export function FmaPhilosophicalQuote() {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[#0A0B0E] via-[#0F1116] to-[#0A0B0E] border-y border-fma-border/60 overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fma-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-fma-surface border border-fma-border text-fma-gold shadow-xl mb-2">
          <Scale className="w-6 h-6" />
        </div>

        <div className="space-y-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-fma-gold font-semibold font-mono">
            Filosofia Jurídica & Fundamento Ético
          </span>

          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-zinc-100 tracking-tight leading-relaxed italic">
            "{FMA_CONFIG.philosophicalQuote.text}"
          </blockquote>

          <div className="pt-2">
            <p className="text-sm font-semibold text-fma-goldLight tracking-wider uppercase">
              {FMA_CONFIG.philosophicalQuote.author}
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              {FMA_CONFIG.philosophicalQuote.reference}
            </p>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-zinc-800/80 mt-8">
          <div className="p-4 rounded-xl bg-fma-card/40 border border-fma-border/40">
            <span className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1 font-serif">A Vontade Constante</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Não basta uma justiça pontual. A defesa dos direitos exige constância, perseverança e acompanhamento minucioso de cada fase do processo.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-fma-card/40 border border-fma-border/40">
            <span className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1 font-serif">O Equilíbrio e o Devido</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dar a cada um o que é seu significa reverter cobranças abusivas de bancos e restabelecer a cobertura integral devida pelos planos de saúde.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-fma-card/40 border border-fma-border/40">
            <span className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1 font-serif">A Dignidade do Cliente</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Atuação pautada pela honestidade na análise prévia: não prometemos resultados mágicos, garantimos o mais elevado rigor técnico do país.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
