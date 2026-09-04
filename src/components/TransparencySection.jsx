import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, CheckCircle2, Landmark } from 'lucide-react';

export function TransparencySection() {
  const { partners, transparency } = useApp();

  return (
    <section id="transparencia" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Prestação de Contas & Conformidade</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Transparência Pública e Parcerias Oficiais
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            O Projeto João de Barro atua com rigor ético e total transparência. Todos os recursos recebidos de fontes públicas e privadas são auditados e revertidos integralmente para as crianças.
          </p>
        </div>

        {/* Public Partners Badges */}
        <div className="mb-16">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            Órgãos Reguladores e Parceiros Institucionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="p-6 rounded-3xl bg-[#FAF7F2] border border-gray-200/70 shadow-sm flex items-start gap-4 hover:border-emerald-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-block mb-1.5">
                    {partner.badge}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1">
                    {partner.name}
                  </h4>
                  <p className="text-xs text-gray-500">{partner.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accountability Documents Grid */}
        <div className="rounded-3xl bg-gray-50 border border-gray-200/80 p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Documentos e Relatórios Contábeis</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Balanços auditados, termos de colaboração em vigência e atas de aprovação fiscal.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Regularidade Fiscal 100% Homologada
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transparency.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{doc.title}</h4>
                    <span className="text-xs text-gray-500">{doc.period} • {doc.type}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 shrink-0">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Para solicitação de certidões específicas ou esclarecimentos de prestação de contas, nosso setor contábil está à disposição através do e-mail <strong>transparencia@projetojoaodebarro.org.br</strong>.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
