import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Volume2, VolumeX, Square } from 'lucide-react';

export function SpeechReaderFloating() {
  const { isSpeaking, stopSpeaking, currentSpokenText } = useAccessibility();

  if (!isSpeaking) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="bg-slate-900/95 border border-apae-yellow-500/80 rounded-2xl shadow-2xl p-4 flex items-center gap-3 backdrop-blur-md max-w-md text-white">
        <div className="w-10 h-10 rounded-xl bg-apae-yellow-500 text-slate-900 flex items-center justify-center flex-shrink-0 animate-pulse">
          <Volume2 className="w-5 h-5 font-bold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-apae-yellow-400">
              Leitor de Áudio Ativo
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-xs text-slate-300 truncate mt-0.5">
            {currentSpokenText || 'Reproduzindo conteúdo em voz alta...'}
          </p>
        </div>
        <button
          onClick={stopSpeaking}
          className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1 text-xs font-bold"
          title="Interromper Leitura em Voz Alta"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Parar</span>
        </button>
      </div>
    </div>
  );
}
