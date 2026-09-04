import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, TrendingUp, Calculator, ArrowRight, MessageCircle, CheckCircle2, Award, Building, Sparkles } from 'lucide-react';

export function Hero() {
  const { siteConfig, setIsProposalOpen } = useApp();

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Olá! Gostaria de conversar com um contador da Aliança Empresarial.`);
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Credibility Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-terracotta-400 shadow-sm animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Contabilidade Consultiva & Inteligência Tributária</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
              Sua empresa com <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 via-rose-500 to-terracotta-600">máxima economia tributária</span> e segurança jurídica total.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {siteConfig.heroSubtitle || 'Assessoria contábil 360°, planejamento tributário preventivo e BPO financeiro com atendimento ágil, humanizado e tecnologia em nuvem.'}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setIsProposalOpen(true)}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-terracotta-600/30 hover:shadow-terracotta-600/50 hover:-translate-y-0.5 transition-all border border-terracotta-500/40"
              >
                <Calculator className="w-5 h-5" />
                <span>Solicitar Diagnóstico Fiscal Gratuito</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/15 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Falar no WhatsApp</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span>Enquadramento Fiscal Ideal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span>Atendimento Consultivo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span>100% Digital & Seguro</span>
              </div>
            </div>

          </div>

          {/* Right Column: Executive Stats & Interactive Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              
              {/* Main Card */}
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                  <div>
                    <h3 className="text-lg font-black text-white">Aliança Empresarial</h3>
                    <p className="text-xs text-slate-400">Tradição & Inteligência Fiscal</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CRC Ativo
                  </span>
                </div>

                {/* 4 Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-2xl sm:text-3xl font-black text-terracotta-400 mb-1">{siteConfig.stats.yearsActive}</div>
                    <div className="text-xs text-slate-400 font-medium">Tradição de Mercado</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-2xl sm:text-3xl font-black text-white mb-1">{siteConfig.stats.clientsServed}</div>
                    <div className="text-xs text-slate-400 font-medium">Empresas Assessoradas</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">{siteConfig.stats.taxSavings}</div>
                    <div className="text-xs text-slate-400 font-medium">Economia Gerada</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-2xl sm:text-3xl font-black text-sky-400 mb-1">{siteConfig.stats.complianceRate}</div>
                    <div className="text-xs text-slate-400 font-medium">Conformidade Fiscal</div>
                  </div>
                </div>

                {/* Direct Action Link inside Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-terracotta-900/40 to-slate-900 border border-terracotta-500/30 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">Precisa trocar de contador?</h4>
                    <p className="text-[11px] text-slate-400">Migração rápida sem burocracia e sem custo extra.</p>
                  </div>
                  <button
                    onClick={() => setIsProposalOpen(true)}
                    className="p-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors shrink-0"
                    title="Fazer Migração"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
