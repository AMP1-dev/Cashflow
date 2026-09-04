import React from 'react';
import { X, ShieldAlert, HeartPulse, FileCheck2, PlaneTakeoff, Building, ArrowRight, CheckCircle2, AlertTriangle, Phone, Scale } from 'lucide-react';
import { FMA_CONFIG } from '../../data/fmaData';

const iconMap = {
  ShieldAlert: ShieldAlert,
  HeartPulse: HeartPulse,
  FileCheck2: FileCheck2,
  PlaneTakeoff: PlaneTakeoff,
  Building: Building
};

export function FmaPracticeDetailModal({ area, onClose, onOpenTriage }) {
  if (!area) return null;

  const IconComponent = iconMap[area.icon] || FileCheck2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0F1116] border border-fma-border rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#161920] to-[#0F1116] border-b border-fma-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-fma-surface border border-fma-border flex items-center justify-center text-fma-gold shadow-lg flex-shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fma-gold block mb-1">
                {area.badge} • FMA Advogados
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                {area.title}
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with scrolling */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-zinc-300">
          
          <p className="text-base text-zinc-200 leading-relaxed font-normal">
            {area.fullDescription}
          </p>

          {/* Urgent Note Alert if present */}
          {area.urgentNote && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-red-200 block mb-0.5">Situação Urgente?</strong>
                <span className="text-zinc-300">{area.urgentNote}</span>
              </div>
            </div>
          )}

          {/* All Topics */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Frentes de Atuação e Teses Jurídicas:
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {area.topics.map((topic, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-fma-card/50 border border-fma-border/50 hover:border-fma-gold/30 transition-all">
                  <h4 className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fma-gold flex-shrink-0" />
                    {topic.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                    {topic.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Advice */}
          <div className="p-4 rounded-xl bg-fma-surface border border-fma-border text-xs text-zinc-400 space-y-1">
            <strong className="text-zinc-200 block">Orientação Prévia do Dr. Fernando Maeda:</strong>
            <p>
              Para a análise de viabilidade da ação, é fundamental providenciar a documentação pertinente (contratos, protocolos de atendimento, relatórios médicos ou certidões). O acesso ao judiciário exige prova material consistente para o deferimento de liminares.
            </p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 sm:p-6 bg-[#12141A] border-t border-fma-border flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
          >
            Voltar
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenTriage();
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg"
            >
              Fazer Triagem Rápida
            </button>
            <a
              href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent(`Olá Dr. Fernando Maeda, gostaria de tirar dúvidas sobre ${area.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Consultar Advogado no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
