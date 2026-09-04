import React, { useState } from 'react';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2, Phone, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { FMA_CONFIG, FMA_TRIAGE_OPTIONS } from '../../data/fmaData';

export function FmaInteractiveTriage({ onClose }) {
  const [selectedOption, setSelectedOption] = useState(FMA_TRIAGE_OPTIONS[0]);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(1);

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
    setAnswers({});
    setStep(1);
  };

  const handleAnswer = (qIndex, val) => {
    setAnswers(prev => ({ ...prev, [qIndex]: val }));
  };

  const buildWhatsAppUrl = () => {
    const textAnswers = selectedOption.questions.map((q, i) => {
      const ans = answers[i] === true ? 'Sim' : answers[i] === false ? 'Não' : 'Não informado';
      return `• ${q}: ${ans}`;
    }).join('\n');

    const message = `${selectedOption.whatsappTemplate}\n\n*Informações preliminares da triagem:*\n${textAnswers}\n\n_Origem: Portal FMA Advogados_`;
    return `https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="triagem" className="py-20 bg-gradient-to-b from-[#0A0B0E] via-[#0F1116] to-[#0A0B0E] border-t border-fma-border relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-xs font-mono font-bold uppercase tracking-wider text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Plantão de Liminares & Atendimento de Urgência
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Triagem Rápida de Viabilidade Jurídica
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Selecione a sua demanda abaixo para obter orientações imediatas sobre prazos, documentos e envio prioritário ao Dr. Fernando Maeda.
          </p>
        </div>

        {/* Triage Interactive Box */}
        <div className="rounded-2xl bg-fma-card border border-fma-border shadow-2xl p-6 sm:p-8 space-y-8">
          
          {/* Step 1: Scenario Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4">
              1. Selecione a situação que melhor descreve seu caso:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FMA_TRIAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedOption.id === opt.id
                      ? 'bg-fma-surface border-fma-gold text-white shadow-lg ring-1 ring-fma-gold/30'
                      : 'bg-[#111318] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {opt.category}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      opt.urgency.includes('Crítica') ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {opt.urgency}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 leading-snug">
                    {opt.label}
                  </h4>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Verification Checklist */}
          <div className="p-6 rounded-xl bg-fma-surface/80 border border-fma-border space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                2. Checklist Preliminar de Viabilidade:
              </label>
              <span className="text-[11px] text-fma-gold font-medium">
                {selectedOption.label}
              </span>
            </div>

            <div className="space-y-3">
              {selectedOption.questions.map((question, qIdx) => (
                <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#161820] border border-zinc-800/80">
                  <span className="text-xs text-zinc-200 font-medium">
                    {question}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAnswer(qIdx, true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        answers[qIdx] === true
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => handleAnswer(qIdx, false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        answers[qIdx] === false
                          ? 'bg-red-600/80 text-white shadow'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Não
                    </button>
                    <button
                      onClick={() => handleAnswer(qIdx, null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        answers[qIdx] === null
                          ? 'bg-zinc-700 text-white'
                          : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Em dúvida
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Assessment feedback banner */}
            <div className="pt-2 flex items-start gap-3 text-xs text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
              <p>
                Ao clicar no botão abaixo, nossa triagem gerará um resumo estruturado para que o Dr. Fernando Maeda possa avaliar a urgência e a viabilidade da medida judicial sem perda de tempo.
              </p>
            </div>
          </div>

          {/* Action Final Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-zinc-500">
              <span>Plantão ativo • Atendimento humanizado e estritamente sigiloso</span>
            </div>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-red-950/60 border border-red-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              <span>Enviar Triagem ao Plantão do WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
