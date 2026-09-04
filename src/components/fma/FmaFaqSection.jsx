import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { FMA_FAQ, FMA_CONFIG } from '../../data/fmaData';

export function FmaFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#0A0B0E] relative border-t border-fma-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-fma-gold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Dúvidas Frequentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Esclarecimentos Jurídicos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Respostas transparentes sobre procedimentos processuais, prazos de liminares e atuação do escritório.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FMA_FAQ.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-fma-card border-fma-gold/50 shadow-xl' 
                    : 'bg-[#12141A] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-white leading-snug">
                    {item.q}
                  </span>
                  <div className={`p-1.5 rounded-full border transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 bg-fma-surface border-fma-gold text-fma-gold' : 'border-zinc-700 text-zinc-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 font-normal">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 p-6 rounded-2xl bg-fma-card border border-fma-border text-center space-y-4">
          <p className="text-xs sm:text-sm text-zinc-300">
            Tem uma dúvida específica sobre seu contrato ou sobre uma negativa médica urgente?
          </p>
          <a
            href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, tenho uma dúvida que não encontrei no FAQ.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-fma-surface hover:bg-zinc-800 border border-fma-border text-xs font-bold text-white transition-all shadow"
          >
            <Phone className="w-3.5 h-3.5 text-fma-gold" />
            <span>Falar Diretamente com o Dr. Fernando Maeda</span>
          </a>
        </div>

      </div>
    </section>
  );
}
