import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Calculator, TrendingUp, Users, PieChart, ShieldAlert, ArrowRight, CheckCircle2, Sparkles, Briefcase } from 'lucide-react';

const iconMap = {
  Building2,
  Calculator,
  TrendingUp,
  Users,
  PieChart,
  ShieldAlert,
  Briefcase
};

export function ServicesSection() {
  const { services, setSelectedService, setIsProposalOpen, setProposalPrefill } = useApp();
  const [selectedCat, setSelectedCat] = useState('Todos');

  const categories = ['Todos', ...new Set(services.map(s => s.category).filter(Boolean))];

  const filteredServices = services.filter(s => {
    return selectedCat === 'Todos' || s.category === selectedCat;
  });

  const handleHireService = (e, srv) => {
    e.stopPropagation();
    setProposalPrefill({ service: srv.title });
    setIsProposalOpen(true);
  };

  return (
    <section id="servicos" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Soluções Contábeis & Corporativas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Especialidades Sob Medida para seu Negócio
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Unimos consultoria técnica de alto nível com processos digitais ágeis para garantir máxima eficiência financeira e conformidade para a sua empresa.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => {
            const IconComponent = iconMap[srv.icon] || Building2;

            return (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer relative"
              >
                <div>
                  
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center group-hover:bg-terracotta-600 group-hover:text-white transition-all shadow-sm">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                      {srv.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-terracotta-600 transition-colors mb-3">
                    {srv.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {srv.shortDesc || srv.fullDesc}
                  </p>

                  {/* Highlights Bullet List */}
                  {srv.highlights && srv.highlights.length > 0 && (
                    <ul className="space-y-2 mb-8">
                      {srv.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-terracotta-600 group-hover:text-terracotta-700 flex items-center gap-1">
                    Ver detalhes completos
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleHireService(e, srv)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Cotar
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
