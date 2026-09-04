import React from 'react';
import { Clock, ArrowRight, Phone, ShieldCheck, ChevronDown, Scale } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaHero({ onOpenTriage, onOpenAreas, onOpenCalculator }) {
  const { firmConfig } = useFma();

  return (
    <section 
      id="inicio" 
      className="relative w-full min-h-[96vh] flex items-center justify-center overflow-hidden bg-[#0A0B0E]"
    >
      {/* 1. Full-Width Background: Cinematic Lady Justice (Thêmis) Artwork */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/themis_hero.jpg"
          alt="Thêmis — Símbolo do Equilíbrio e da Justiça — FMA Advogados"
          className="w-full h-full object-cover object-center filter grayscale contrast-[1.08] brightness-[0.42] scale-100 transform transition-transform duration-1000"
          loading="eager"
        />

        {/* Studio Lighting & Luxury Vignette Overlays across 100vw */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/60 to-[#0A0B0E]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,160,89,0.08),transparent_70%)]" />
      </div>

      {/* 2. Expansive, Minimalist Content Layer (Clean Luxury Apple Style) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 py-20 text-center flex flex-col items-center space-y-8">
        
        {/* Aristocratic Micro-Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 border border-fma-gold/30 backdrop-blur-md shadow-2xl text-[11px] text-zinc-300 font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{firmConfig.name || 'FMA ADVOGADOS'}</span>
          <span className="text-zinc-600">•</span>
          <span>{firmConfig.oab || 'OAB/SP 210.374'}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-fma-goldLight">{firmConfig.experienceSince || 'DESDE 2003'}</span>
        </div>

        {/* Grand Headline in Times New Roman / Classic Legal Serif */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-times font-bold text-white tracking-tight leading-[1.08]">
            Defesa Técnica, <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal bg-gradient-to-r from-zinc-100 via-fma-goldLight to-amber-200 bg-clip-text text-transparent">
              Equilíbrio e Dignidade.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Mais de duas décadas de advocacia resolutiva e de alta precisão nas esferas 
            <strong className="text-white font-semibold"> Cível, Bancária, Contratual e Direito à Saúde</strong>.
          </p>
        </div>

        {/* Highlighted Ulpiano Quote with Clean Distinction */}
        <div className="max-w-2xl mx-auto py-2">
          <blockquote className="font-times italic text-lg sm:text-2xl text-zinc-200 leading-snug tracking-wide border-y border-white/10 py-4 px-6 bg-black/30 backdrop-blur-sm rounded-2xl">
            "{firmConfig.philosophicalQuote?.text || 'A justiça é a vontade constante e perpétua de dar a cada um o que é seu.'}"
            <span className="block text-xs font-mono uppercase text-fma-goldLight mt-2 not-italic font-semibold tracking-widest">
              — {firmConfig.philosophicalQuote?.author || 'Ulpiano'} • {firmConfig.philosophicalQuote?.reference || 'Digesto 1.1.10'}
            </span>
          </blockquote>
        </div>

        {/* Clean, Decisive Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          
          {/* Primary Urgent Triage Button */}
          <button
            onClick={onOpenTriage}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-2xl shadow-red-950/60 border border-red-500/40 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Clock className="w-4 h-4 text-white animate-pulse" />
            <span>Plantão de Liminares 24h</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Practice Areas Jump Button */}
          <a
            href="#atuacao"
            className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-md transition-all transform hover:-translate-y-0.5"
          >
            Áreas de Atuação
          </a>

          {/* WhatsApp Direct Action */}
          <a
            href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de uma orientação jurídica.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-fma-surface/90 hover:bg-zinc-800/90 border border-fma-gold/40 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-black/50"
          >
            <Phone className="w-4 h-4 text-fma-gold" />
            <span>WhatsApp Direto</span>
          </a>

          {/* Calculator Jump */}
          <button
            onClick={onOpenCalculator}
            className="px-5 py-3.5 rounded-full bg-black/40 hover:bg-black/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all"
          >
            Simulador de Juros
          </button>
        </div>

        {/* Minimalist Trust Statement */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-fma-gold" />
            Atuação Exclusiva Cível, Bancária & Saúde
          </span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400 font-medium">
            Não atuamos no direito criminal
          </span>
          <span className="text-zinc-700">•</span>
          <span className="text-amber-400 font-medium">
            ★ 5.0 Avaliações Google
          </span>
        </div>

      </div>

      {/* Down Scroll Anchor */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-fma-gold transition-colors animate-bounce">
        <a href="#atuacao" aria-label="Rolar para o conteúdo">
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}
