import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  HeartHandshake, 
  Stethoscope, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Sparkles,
  Heart,
  Volume2
} from 'lucide-react';

export function ProjectsSection() {
  const { setSelectedProject, openDonationModal } = useApae();
  const { speakText } = useAccessibility();
  const [filterArea, setFilterArea] = useState('todos');

  const filterTabs = [
    { id: 'todos', label: 'Todos os Projetos', icon: Sparkles },
    { id: 'saude', label: 'Saúde & Reabilitação', icon: Stethoscope },
    { id: 'educacao', label: 'Educação Especial (AEE)', icon: GraduationCap },
    { id: 'assistencia', label: 'Assistência & Inclusão', icon: Briefcase },
  ];

  const filteredProjects = filterArea === 'todos'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.area === filterArea);

  return (
    <section id="projetos" aria-label="Projetos da APAE" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-apae-green-700 border border-emerald-200 mb-3">
            <HeartHandshake className="w-4 h-4" />
            <span>Nossos Programas & Atuação</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Projetos Pedagógicos, de <span className="text-apae-blue-600">Saúde e Cidadania</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Iniciativas estruturadas para transformar cada fase do desenvolvimento humano, desde os primeiros meses de vida até a terceira idade com autonomia e inclusão produtiva.
          </p>

          <button
            onClick={() => speakText("Seção de projetos da APAE. Conheça nossos projetos de Estimulação Precoce, Educação Especial com tecnologia assistiva, Comunicação Aumentativa, Hidroterapia, Jovem Protagonista no mercado de trabalho e Apoio Psicossocial às famílias.")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-apae-blue-600 transition-colors"
            title="Ouvir descrição dos projetos"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir projetos em voz alta</span>
          </button>
        </div>

        {/* Filtros de Categorias */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterArea(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                  filterArea === tab.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-apae-blue-400 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Imagem do Projeto com Badge */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-apae-yellow-400 text-slate-950 shadow-sm">
                      {project.badge}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-apae-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>

                  {/* Métrica de Impacto Destacada */}
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-apae-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] font-semibold text-apae-blue-900">
                      {project.impactMetric}
                    </p>
                  </div>

                  {/* Beneficiários & Financiamento */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {project.beneficiaries}
                      </span>
                      <span className="font-bold text-slate-900">{project.fundedPercent}% financiado</span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-apae-blue-600 to-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${project.fundedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="p-6 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Ver Detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openDonationModal(project.targetMonthlyPerChild || 60, 'recorrente', project.title)}
                    className="w-full py-2.5 px-3 rounded-xl bg-apae-blue-600 hover:bg-apae-blue-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Apadrinhar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
