import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Building,
  Quote,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function AmpCasesSection() {
  const { cases, setSelectedCase, setIsDiagnosticModalOpen } = useAmp();

  return (
    <section id="cases" className="py-24 bg-[#0A1020] relative overflow-hidden border-t border-slate-800">
      
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Award className="w-3.5 h-3.5" />
            <span>Resultados Comprovados em Campo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Cases de Sucesso & <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transformação Real</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Conheça como empresas líderes de mercado superaram gargalos de tecnologia e conquistaram eficiência tributária e financeira com o ecossistema Grupo AMP.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((cs) => (
            <div
              key={cs.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 p-7 flex flex-col justify-between shadow-2xl space-y-6 group"
            >
              
              {/* Header: Client & Industry */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950/60 text-cyan-400 border border-cyan-500/30">
                    {cs.industry}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">{cs.period}</span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {cs.client}
                </h3>
              </div>

              {/* Challenge & Solution */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="font-extrabold text-amber-400 uppercase tracking-wider text-[10px] block">
                    O Desafio:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {cs.challenge}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="font-extrabold text-cyan-400 uppercase tracking-wider text-[10px] block">
                    Solução Implementada pela AMP:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {cs.solution}
                  </p>
                </div>
              </div>

              {/* Results metrics */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Impactos e Ganhos Mensuráveis:
                </span>
                <div className="space-y-1.5">
                  {cs.results.map((res, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote & Author */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-start gap-2 text-xs italic text-slate-300">
                  <Quote className="w-4 h-4 text-amber-400 shrink-0 opacity-70" />
                  <p>"{cs.quote}"</p>
                </div>
                <div className="text-[11px] font-bold text-slate-400 pl-6">
                  {cs.author}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setIsDiagnosticModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Quero Esses Resultados na Minha Empresa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
