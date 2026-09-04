import React from 'react';
import { 
  ArrowRight, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  Building2, 
  CheckCircle2
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallHero() {
  const { company } = useDrywall();

  return (
    <section className="relative w-full bg-gradient-to-b from-[#07152B] via-[#0A2540] to-[#003B99] text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
      {/* Subtle architectural background texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-blue-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Distribuição Especializada para o Interior de São Paulo</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          Drywall com preço direto de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">Distribuidora</span>.
        </h1>

        {/* Clean Subtitle */}
        <p className="text-base sm:text-xl text-slate-200 font-normal leading-relaxed max-w-3xl mx-auto">
          Abastecimento contínuo de placas, perfis galvanizados, lã acústica e massas para construtoras, gesseiros e instaladores. Pronta-entrega ágil e faturamento faturado direto de fábrica no interior paulista.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#cotacao"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm text-slate-900 bg-cyan-300 hover:bg-cyan-200 shadow-xl shadow-cyan-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Pedir Cotação de Preço</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de cotar materiais de drywall com a Drywall Distribuidora para minha obra no interior de SP.')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Falar no WhatsApp Comercial</span>
          </a>
        </div>

        {/* 3 Essential Minimalist Highlights */}
        <div className="pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>Entrega em 24h a 48h no Interior de SP</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>Preço de Atacado sem Intermediários</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Certificado ABNT NBR 14715</span>
          </div>
        </div>

      </div>
    </section>
  );
}
