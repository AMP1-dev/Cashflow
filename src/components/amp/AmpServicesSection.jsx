import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Server,
  ShieldAlert,
  Headset,
  Cpu,
  TrendingUp,
  Calculator,
  PieChart,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export function AmpServicesSection() {
  const { services, setSelectedService, setIsDiagnosticModalOpen } = useAmp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'ti' | 'finance'

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Server': return Server;
      case 'ShieldAlert': return ShieldAlert;
      case 'Headset': return Headset;
      case 'Cpu': return Cpu;
      case 'TrendingUp': return TrendingUp;
      case 'Calculator': return Calculator;
      case 'PieChart': return PieChart;
      case 'Building2': return Building2;
      default: return Sparkles;
    }
  };

  const filteredServices = services.filter((srv) => {
    if (activeTab === 'all') return true;
    return srv.division === activeTab;
  });

  return (
    <section id="servicos" className="py-24 bg-[#070912] relative overflow-hidden border-t border-white/5">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-sky-400 block">
            Portfólio de Soluções Corporativas
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-100 tracking-tight">
            Tecnologia de Alta Performance &amp; Finanças Estratégicas
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
            Mais de 40 anos de know-how traduzidos em metodologias ágeis, segurança inegociável e inteligência tributária para alavancar sua empresa.
          </p>

          {/* Clean Division Filter Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-white/5 border border-white/10 shadow-lg mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-xl text-xs font-normal transition-all ${
                activeTab === 'all'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas as Soluções ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('ti')}
              className={`px-5 py-2 rounded-xl text-xs font-normal transition-all flex items-center gap-1.5 ${
                activeTab === 'ti'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              TI Corporativa &amp; Cloud
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-5 py-2 rounded-xl text-xs font-normal transition-all flex items-center gap-1.5 ${
                activeTab === 'finance'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Consultoria Financeira &amp; BPO
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((srv) => {
            const IconComp = getServiceIcon(srv.iconName);

            return (
              <div
                key={srv.id}
                className="group relative rounded-3xl bg-[#0B0F1C]/80 border border-white/10 hover:border-white/25 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-normal uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {srv.category}
                    </span>
                    
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-light text-slate-100 group-hover:text-sky-300 transition-colors leading-snug">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed line-clamp-3">
                    {srv.shortDesc}
                  </p>

                  <div className="pt-3 mt-3 border-t border-white/5 space-y-1.5">
                    {srv.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1"></span>
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="text-xs font-normal text-slate-400 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Ver Detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                  </button>

                  <button
                    onClick={() => setIsDiagnosticModalOpen(true)}
                    className="text-[11px] font-normal text-sky-400 hover:text-sky-300 underline underline-offset-4"
                  >
                    Diagnóstico
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
