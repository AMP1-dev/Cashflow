import React from 'react';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  X, 
  Heart, 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Volume2, 
  DollarSign,
  Share2
} from 'lucide-react';

export function ProjectDetailModal() {
  const { selectedProject, setSelectedProject, openDonationModal, showToast } = useApae();
  const { speakText } = useAccessibility();

  if (!selectedProject) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link do projeto copiado para compartilhar!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header Imagem */}
        <div className="h-60 overflow-hidden relative flex-shrink-0">
          <img
            src={selectedProject.image}
            alt={selectedProject.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-apae-yellow-400 text-slate-950 mb-2 inline-block">
              {selectedProject.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {selectedProject.title}
            </h3>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-apae-blue-700 block">Beneficiários</span>
              <p className="text-xs font-black text-slate-900 mt-0.5">{selectedProject.beneficiaries}</p>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Orçamento Anual</span>
              <p className="text-xs font-black text-slate-900 mt-0.5">{selectedProject.budgetYear}</p>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Financiamento</span>
              <p className="text-xs font-black text-slate-900 mt-0.5">{selectedProject.fundedPercent}% Apoiado</p>
            </div>
          </div>

          {/* Descrição Completa */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Sobre o Projeto
              </h4>
              <button
                onClick={() => speakText(`${selectedProject.title}. ${selectedProject.fullDescription}`)}
                className="text-xs text-apae-blue-600 font-bold flex items-center gap-1 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir Texto</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedProject.fullDescription}
            </p>
          </div>

          {/* Destaques e Atividades */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Ações Desenvolvidas
            </h4>
            <div className="space-y-2">
              {selectedProject.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Métrica de Impacto Comprovada */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-apae-yellow-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-apae-yellow-400 uppercase font-bold tracking-wider block">Impacto Auditado</span>
              <p className="text-xs text-slate-200 font-semibold">{selectedProject.impactMetric}</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const proj = selectedProject;
                setSelectedProject(null);
                openDonationModal(proj.targetMonthlyPerChild || 60, 'recorrente', proj.title);
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-apae-yellow-400 to-amber-500 hover:from-apae-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>APADRINHAR ESTE PROJETO (R$ {selectedProject.targetMonthlyPerChild || 60}/MÊS)</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
