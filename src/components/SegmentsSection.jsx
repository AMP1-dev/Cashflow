import React from 'react';
import { Stethoscope, Cpu, ShoppingBag, Briefcase, Building, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SegmentsSection() {
  const { setIsProposalOpen, setProposalPrefill } = useApp();

  const segments = [
    {
      icon: Stethoscope,
      title: "Saúde & Clínicas Médicas",
      desc: "Redução de até 60% no IRPJ/CSLL através da equiparação hospitalar, assessoria para consultórios médicos e odontológicos.",
      tag: "Equiparação Hospitalar"
    },
    {
      icon: Cpu,
      title: "Tecnologia, SaaS & Startups",
      desc: "Planejamento para desenvolvedores, software houses e agências digitais com otimização do Fator R e isenções de PIS/COFINS na exportação.",
      tag: "Fator R & Exportação"
    },
    {
      icon: ShoppingBag,
      title: "Comércio & E-commerce",
      desc: "Auditoria de ICMS-ST, parametrização de estoques, conciliação de marketplaces (Mercado Livre, Amazon) e emissão massiva de NF-e.",
      tag: "Marketplaces & ICMS"
    },
    {
      icon: Briefcase,
      title: "Prestadores de Serviços",
      desc: "Consultorias, escritórios de advocacia, arquitetura e engenharia com redução da alíquota efetiva de ISS e Simples Nacional.",
      tag: "Simples & Presumido"
    },
    {
      icon: Building,
      title: "Construção Civil & Imobiliário",
      desc: "Adesão ao Regime Especial de Tributação (RET - 4%), SPEs, loteamentos e Holdings Imobiliárias para blindagem patrimonial.",
      tag: "RET & Patrimônio"
    }
  ];

  const handleSelectSegment = (title) => {
    setProposalPrefill({ segment: title });
    setIsProposalOpen(true);
  };

  return (
    <section id="segmentos" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-terracotta-400 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            <span>Segmentos Especializados</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Expertise no Nicho Específico da Sua Empresa
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Cada segmento possui particularidades fiscais e trabalhistas próprias. Nossos contadores são especializados nas regras tributárias de cada setor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg, idx) => {
            const Icon = seg.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSelectSegment(seg.title)}
                className="bg-slate-800/80 border border-slate-700/80 hover:border-terracotta-500/60 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-terracotta-950/60 border border-terracotta-500/30 text-terracotta-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                      {seg.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-terracotta-400 transition-colors">
                    {seg.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {seg.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-terracotta-400">
                  <span>Solicitar proposta para este setor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
