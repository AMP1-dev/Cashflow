import React from 'react';
import { HelpCircle, X, Lightbulb, Target, Calculator } from 'lucide-react';

export function ConceitoAjudaModal({ isOpen, onClose, titulo, conceito, porQueImporta, exemplo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 relative overflow-hidden">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100 shadow-xs">
            <HelpCircle size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider text-teal-600 uppercase">Guia Conceitual & Ajuda</span>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{titulo}</h3>
          </div>
        </div>

        {/* Content Cards */}
        <div className="space-y-3.5 text-xs text-slate-600">
          
          {/* Card 1: O que é */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
              <Lightbulb size={16} className="text-amber-500 shrink-0" />
              <span>O que é este conceito?</span>
            </div>
            <p className="leading-relaxed text-slate-600 pl-5">{conceito}</p>
          </div>

          {/* Card 2: Por que importa */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
              <Target size={16} className="text-emerald-600 shrink-0" />
              <span>Por que isso é vital para sua empresa?</span>
            </div>
            <p className="leading-relaxed text-emerald-800/90 pl-5">{porQueImporta}</p>
          </div>

          {/* Card 3: Exemplo Prático */}
          {exemplo && (
            <div className="p-3.5 bg-sky-50/60 border border-sky-200/60 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                <Calculator size={16} className="text-sky-600 shrink-0" />
                <span>Exemplo Prático</span>
              </div>
              <p className="leading-relaxed text-sky-800/90 pl-5 font-mono text-[11px] whitespace-pre-line">{exemplo}</p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-slate-900/10"
          >
            Entendi! Voltar ao trabalho
          </button>
        </div>
      </div>
    </div>
  );
}
