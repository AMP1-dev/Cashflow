import React from 'react';
import { useApae } from '../context/ApaeContext';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function Toast() {
  const { toast } = useApae();

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
      <div className={`px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
        isError 
          ? 'bg-rose-950/95 border-rose-500/80 text-rose-100' 
          : 'bg-slate-900/95 border-apae-yellow-500/80 text-white'
      }`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isError ? 'bg-rose-600 text-white' : 'bg-apae-yellow-500 text-slate-950'
        }`}>
          {isError ? <AlertCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5 fill-current" />}
        </div>
        <p className="text-xs font-bold leading-relaxed">
          {toast.message}
        </p>
      </div>
    </div>
  );
}
