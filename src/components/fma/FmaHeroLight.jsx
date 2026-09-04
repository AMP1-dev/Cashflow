import React from 'react';
import { ArrowRight } from 'lucide-react';

export function FmaHeroLight() {
  return (
    <section id="inicio" className="relative w-full bg-white dark:bg-[#06172B] pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden transition-colors duration-300">
      
      {/* Decorative Light Beige L-Shaped Frame (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 w-32 sm:w-44 h-32 sm:h-44 border-b-[18px] sm:border-b-[24px] border-l-[18px] sm:border-l-[24px] border-[#EFECE8] dark:border-[#0E2238] pointer-events-none -z-0 transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Main Title: Bold Uppercase Dark Navy / White in Dark Mode */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-sans font-bold text-[#14233C] dark:text-white tracking-tight leading-[1.18] uppercase transition-colors">
              Estratégias e soluções processuais, consultivas e contenciosas.
            </h1>

            {/* Sub-description with horizontal rule */}
            <div className="flex items-start gap-4 max-w-lg">
              <span className="w-12 h-[1px] bg-[#14233C] dark:bg-[#D9C8A6] mt-2.5 flex-shrink-0 transition-colors" />
              <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#CFD4DB] leading-relaxed font-normal transition-colors">
                Atuação de alto impacto técnico para casos complexos nas esferas Cível, Bancária, Contratual e Direito à Saúde.
              </p>
            </div>

            {/* Circular Arrow Button: ( → ) CONHEÇA O ESCRITÓRIO */}
            <div className="pt-2">
              <a
                href="#escritorio"
                className="inline-flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full border border-[#8E7A66] dark:border-[#D9C8A6] group-hover:border-[#14233C] dark:group-hover:border-white group-hover:bg-[#14233C] dark:group-hover:bg-[#D9C8A6] flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-white dark:group-hover:text-[#06172B] transform group-hover:translate-x-0.5 transition-all" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-[#14233C] dark:group-hover:text-white uppercase transition-colors">
                  Conheça o escritório
                </span>
              </a>
            </div>

          </div>

          {/* Right Column: Slender Vertical Image with Top-Right Beige Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* Top-Right Decorative Beige L-Shaped Frame */}
            <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-44 sm:w-56 h-44 sm:h-56 border-t-[20px] sm:border-t-[26px] border-r-[20px] sm:border-r-[26px] border-[#EFECE8] dark:border-[#0E2238] pointer-events-none transition-colors duration-300" />

            {/* Vertical Image */}
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] overflow-hidden shadow-2xl z-10 bg-white dark:bg-[#06172B] border border-transparent dark:border-white/10">
              <img
                src="/eid_bloco1.jpg"
                alt="FMA Advogados — Arquitetura de Alto Impacto"
                className="w-full h-[480px] sm:h-[580px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
