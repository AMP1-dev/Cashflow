import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Clock, X, Shield, Scale } from 'lucide-react';
import { FMA_CONFIG } from '../../data/fmaData';

export function FmaFloatingWhatsapp({ onOpenTriage }) {
  const [minimized, setMinimized] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Floating Prompt Card */}
      {!minimized && (
        <div className="pointer-events-auto max-w-xs bg-[#0F1116]/95 backdrop-blur-xl border border-fma-border rounded-2xl p-4 shadow-2xl space-y-2 animate-fadeIn relative">
          <button
            onClick={() => setMinimized(true)}
            className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white"
            title="Minimizar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-fma-goldLight uppercase tracking-wider">
              Plantão de Liminares
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-snug font-normal">
            Negativa de cirurgia, remédio de alto custo ou fraude bancária? Fale agora com nossa equipe.
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={onOpenTriage}
              className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold tracking-wide transition-colors text-center"
            >
              Triagem de Urgência
            </button>
            <a
              href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, preciso de uma orientação jurídica urgente.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3" />
              WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating Button Icon */}
      <a
        href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de uma consulta jurídica.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group p-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative border border-emerald-400/40"
        title="Falar no WhatsApp"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#0A0B0E] animate-pulse" />
      </a>

    </div>
  );
}
