import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Scale, Phone } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaHeroEid({ onOpenTriage }) {
  const { firmConfig } = useFma();

  return (
    <div id="inicio" className="w-full bg-[#06172B] text-white">
      
      {/* ========================================================================= */}
      {/* BLOCO 1 (ESTILO EIDADV.COM.BR - HERO GRID)                                */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Bold Editorial Statement */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#8E7A66] uppercase font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{firmConfig.name || 'FMA ADVOGADOS'}</span>
                <span>•</span>
                <span>DESDE 2003</span>
              </div>

              {/* H1 Idêntico ao Eid Advogados */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-work font-bold text-white tracking-tight leading-[1.12]">
                Estratégias e soluções processuais, consultivas e contenciosas.
              </h1>

              {/* Sub-parágrafo Idêntico ao Eid Advogados */}
              <p className="text-lg sm:text-xl text-[#CFD4DB] font-normal leading-relaxed max-w-2xl">
                Atuação de alto impacto técnico para casos complexos nas esferas Cível, Bancária, Contratual e Direito à Saúde.
              </p>

              {/* Actions & Links */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <a
                  href="#escritorio"
                  className="inline-flex items-center gap-2 text-base font-semibold text-white hover:text-eid-gold transition-colors group"
                >
                  <span className="border-b border-eid-gold/60 pb-0.5 group-hover:border-eid-gold">Conheça o escritório</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-eid-gold" />
                </a>

                <button
                  onClick={onOpenTriage}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-lg transition-all"
                >
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Plantão de Liminares 24h</span>
                </button>

                <a
                  href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de uma orientação jurídica.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-[#0E2238] hover:bg-[#152E4B] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-eid-gold" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#8E7A66]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-eid-gold" />
                  {firmConfig.oab || 'OAB/SP 210.374'}
                </span>
                <span>•</span>
                <span>Mais de 20 anos de atuação</span>
                <span>•</span>
                <span className="text-zinc-400 font-medium">Não atuamos em direito criminal</span>
              </div>

            </div>

            {/* Right Column: Sleek Vertical Image Frame (Idêntico ao Eid) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
                <img
                  src="/eid_bloco1.jpg"
                  alt="FMA Advogados — Arquitetura e Rigor Técnico"
                  className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06172B]/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Subtle Caption */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#06172B]/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs">
                  <span className="block font-semibold text-white">Dr. Fernando Maeda</span>
                  <span className="block text-[11px] text-[#8E7A66]">Excelência e Estratégia Jurídica</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCO 1 --PART-2 (MANIFESTO & PROPÓSITO DO ESCRITÓRIO)                     */}
      {/* ========================================================================= */}
      <section id="escritorio" className="py-20 sm:py-28 bg-[#0A1A2F] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-work font-normal text-white leading-relaxed">
              <strong className="font-bold text-white">FMA Advogados tem um propósito claro:</strong> oferecer soluções jurídicas com excelência técnica na construção de estratégias sólidas, no contencioso e no consultivo.
            </h2>

            <p className="text-base sm:text-lg text-[#CFD4DB] font-normal leading-relaxed">
              Nossa atuação também é definida: <strong>Direito Bancário & Renegociação de Dívidas</strong>, <strong>Direito à Saúde com Plantão de Liminares de Urgência</strong>, <strong>Contratos & Cível Empresarial</strong>, e <strong>Consultoria Jurídica Preventiva</strong>.
            </p>
          </div>

          {/* Ulpiano Quote Card */}
          <div className="p-6 rounded-2xl bg-[#06172B]/70 border border-eid-gold/30 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-eid-gold" />
            <blockquote className="font-serif italic text-lg sm:text-xl text-zinc-100 leading-snug">
              "{firmConfig.philosophicalQuote?.text || 'A justiça é a vontade constante e perpétua de dar a cada um o que é seu.'}"
            </blockquote>
            <p className="text-xs font-mono uppercase tracking-wider text-eid-gold mt-2 font-semibold">
              — {firmConfig.philosophicalQuote?.author || 'Ulpiano'} • {firmConfig.philosophicalQuote?.reference || 'Digesto 1.1.10'}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
