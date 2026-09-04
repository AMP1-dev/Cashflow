import React from 'react';
import { ShieldCheck, Cpu, Users, Award, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function DifferentialsSection() {
  const { setIsProposalOpen } = useApp();

  const differentials = [
    {
      icon: ShieldCheck,
      title: "Segurança Jurídica & Blindagem Fiscal",
      desc: "Análise contínua das obrigações fiscais para que sua empresa nunca sofra autuações, multas ou bitributações."
    },
    {
      icon: Users,
      title: "Atendimento Consultivo Humanizado",
      desc: "Sem robôs impessoais: fale direto com contadores e especialistas tributários seniores via WhatsApp, telefone ou reuniões executivas."
    },
    {
      icon: Cpu,
      title: "Tecnologia em Nuvem & Automação",
      desc: "Integração total com os principais ERPs do mercado (ContaAzul, Omie, Bling) e painel digital com todos os documentos organizados."
    },
    {
      icon: Clock,
      title: "Agilidade na Emissão de Guias e Certidões",
      desc: "Entregas sempre antecipadas das guias de tributos (DAS, GPS, FGTS) e emissão imediata de CNDs e certidões negativas."
    },
    {
      icon: Award,
      title: "Mais de 20 Anos de Solidez Corporativa",
      desc: "Duas décadas de experiência e credibilidade assessorando empresas dos mais variados portes em todo o território nacional."
    }
  ];

  return (
    <section id="diferenciais" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-50 text-terracotta-700 text-xs font-bold uppercase tracking-wider">
              <span>Por que a Aliança Empresarial?</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A contabilidade que senta à mesa para planejar o seu crescimento.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Não somos apenas emissores de guias. Nossa missão é ser o braço direito estratégico da diretoria da sua empresa, identificando oportunidades reais de economia tributária e organizando seus números para tomadas de decisões seguras.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsProposalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5"
              >
                <span>Fazer Diagnóstico com Nossos Contadores</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column Differentials Cards */}
          <div className="lg:col-span-7 space-y-4">
            {differentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-terracotta-500/40 hover:bg-white transition-all shadow-sm flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-terracotta-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
