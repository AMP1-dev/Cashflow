import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Award, ShieldCheck, Briefcase } from 'lucide-react';

export function BoardSection() {
  const { board } = useApp();

  return (
    <section id="diretoria" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparência & Governança</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Nossa Diretoria e Coordenação
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Uma equipe multidisciplinar de profissionais experientes e dedicados voluntariamente à gestão ética, idônea e transparente do Projeto João de Barro.
          </p>
        </div>

        {/* Board Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {board.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col"
            >
              {/* Photo */}
              <div className="relative aspect-[4/4] overflow-hidden bg-gray-100">
                <img
                  src={member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-terracotta-700 shadow-sm">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-terracotta-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <Award className="w-3.5 h-3.5" />
                  <span>Mandato Regular & Auditado</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Governance Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Estatuto Social e Conselho Fiscal Ativo</h4>
              <p className="text-xs text-gray-600">Reuniões ordinárias mensais e atas devidamente registradas em cartório.</p>
            </div>
          </div>
          <a
            href="#transparencia"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-gray-700 shadow-sm transition-all shrink-0"
          >
            Acessar Documentos de Transparência
          </a>
        </div>

      </div>
    </section>
  );
}
