import React, { useState } from 'react';
import { INSTITUTION_DATA } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Building2, 
  History, 
  Heart, 
  Target, 
  Eye, 
  Users, 
  Award, 
  Sparkles, 
  Stethoscope, 
  CheckCircle2, 
  Calendar,
  PhoneCall,
  Volume2
} from 'lucide-react';

export function InstitutionalSection() {
  const { setScheduleVisitModalOpen } = useApae();
  const { speakText } = useAccessibility();
  const [activeTab, setActiveTab] = useState('historia');
  const [staffFilter, setStaffFilter] = useState('todos');

  const staffCategories = [
    { id: 'todos', label: 'Todos os Especialistas' },
    { id: 'Medicina', label: 'Medicina' },
    { id: 'Fisioterapia', label: 'Fisioterapia' },
    { id: 'Terapia Ocupacional', label: 'Terapia Ocupacional' },
    { id: 'Fonoaudiologia', label: 'Fonoaudiologia' },
    { id: 'Psicologia', label: 'Psicologia' },
    { id: 'Educação Especial', label: 'Educação Especial' },
    { id: 'Serviço Social', label: 'Serviço Social' },
  ];

  const filteredStaff = staffFilter === 'todos'
    ? INSTITUTION_DATA.staff
    : INSTITUTION_DATA.staff.filter(s => s.category === staffFilter);

  return (
    <section id="institucional" aria-label="Seção Institucional da APAE" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-apae-blue-600 border border-blue-200 mb-3">
            <Building2 className="w-4 h-4" />
            <span>Quem Somos & Nossa Trajetória</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Mais de Cinco Décadas Dedicadas à <span className="text-apae-blue-600">Inclusão e Dignidade</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Conheça nossa história pioneira, os princípios que nos guiam, nossa infraestrutura de ponta e os profissionais que dedicam suas vidas ao acolhimento e desenvolvimento humano.
          </p>

          <button
            onClick={() => speakText("Seção institucional da APAE. Há mais de 50 anos promovendo a defesa de direitos e autonomia da pessoa com deficiência intelectual e múltipla através de atendimento integral e gratuito.")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-apae-blue-600 transition-colors"
            title="Ouvir resumo institucional"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir este resumo</span>
          </button>
        </div>

        {/* Abas de Navegação Interna da Seção */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {[
            { id: 'historia', label: 'História & Missão', icon: History },
            { id: 'corpo-tecnico', label: 'Corpo Técnico Especializado', icon: Stethoscope },
            { id: 'estrutura', label: 'Estrutura & Unidades', icon: Building2 },
            { id: 'diretoria', label: 'Diretoria & Governança', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-apae-blue-600 text-white shadow-lg shadow-apae-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo Aba: História & Missão */}
        {activeTab === 'historia' && (
          <div className="space-y-16 animate-fade-in">
            
            {/* Missão, Visão e Valores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Missão */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-3xl p-7 relative overflow-hidden shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-apae-blue-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Nossa Missão</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {INSTITUTION_DATA.mission}
                </p>
              </div>

              {/* Visão */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-100 rounded-3xl p-7 relative overflow-hidden shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-apae-yellow-500 text-slate-950 flex items-center justify-center mb-5 shadow-md">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Nossa Visão</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {INSTITUTION_DATA.vision}
                </p>
              </div>

              {/* Valores Principais */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-3xl p-7 relative overflow-hidden shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-apae-green-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Nossos Valores</h3>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {INSTITUTION_DATA.values.map((val, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-apae-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>{val.title}:</strong> {val.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Linha do Tempo Cronológica dos 50 Anos */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h3 className="text-2xl font-black text-slate-900">Linha do Tempo de Conquistas</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Cada ano representou um tijolo a mais na construção de uma sociedade mais justa e inclusiva.
                </p>
              </div>

              <div className="relative border-l-2 border-apae-blue-200 ml-4 sm:ml-32 space-y-10">
                {INSTITUTION_DATA.historyMilestones.map((item, idx) => (
                  <div key={idx} className="relative pl-6 sm:pl-8 group">
                    
                    {/* Badge do Ano no Desktop à esquerda */}
                    <div className="sm:absolute sm:-left-32 sm:top-0 text-left sm:text-right w-24 mb-1 sm:mb-0">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-apae-blue-600 text-white text-xs font-black shadow-sm">
                        {item.year}
                      </span>
                    </div>

                    {/* Ponto Central na Linha */}
                    <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-white border-4 border-apae-yellow-500 group-hover:scale-125 transition-transform" />

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group-hover:border-apae-blue-400 transition-colors">
                      <h4 className="text-base font-black text-slate-900">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Conteúdo Aba: Corpo Técnico Multidisciplinar */}
        {activeTab === 'corpo-tecnico' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Filtros por Especialidade */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {staffCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setStaffFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    staffFilter === cat.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid do Corpo Técnico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStaff.map((member) => (
                <div 
                  key={member.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-apae-blue-300 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={member.image}
                        alt={`Foto profissional de ${member.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-md">
                          {member.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="text-base font-black text-slate-900 group-hover:text-apae-blue-600 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-xs font-bold text-apae-blue-600">{member.role}</p>
                      <p className="text-[11px] font-mono text-slate-500">{member.registry}</p>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        <strong>Especialidade:</strong> {member.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] italic text-slate-600">
                      "{member.quote}"
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center max-w-2xl mx-auto">
              <h4 className="text-sm font-black text-apae-blue-900">
                Nosso compromisso é o atendimento 100% humanizado e baseado em evidências
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Todas as condutas terapêuticas seguem protocolos clínicos internacionais, com reuniões de alinhamento multidisciplinar semanais.
              </p>
            </div>

          </div>
        )}

        {/* Conteúdo Aba: Estrutura Física & Instalações */}
        {activeTab === 'estrutura' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INSTITUTION_DATA.facilities.map((fac, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-apae-blue-600 text-white shadow-sm">
                        {fac.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-black text-slate-900">{fac.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Agendar Visita */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-black">
                Gostaria de Conhecer Nossas Instalações Pessoalmente?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                Recebemos visitas monitoradas de escolas, universidades, empresas parceiras e famílias que necessitam de acolhimento.
              </p>
              <button
                onClick={() => setScheduleVisitModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-apae-yellow-500 hover:bg-apae-yellow-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>SOLICITAR AGENDAMENTO DE VISITA</span>
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Aba: Diretoria & Governança */}
        {activeTab === 'diretoria' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {INSTITUTION_DATA.board.map((member, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-apae-blue-600 flex items-center justify-center font-black text-base">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{member.name}</h4>
                    <p className="text-xs font-bold text-apae-blue-600 mt-0.5">{member.role}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-600 max-w-2xl mx-auto">
              <p>
                Toda a Diretoria Executiva e Conselho Fiscal exercem seus mandatos de forma <strong>100% voluntária</strong>, sem qualquer remuneração, em conformidade com o Estatuto Social e a Lei Federal 9.608/98.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
