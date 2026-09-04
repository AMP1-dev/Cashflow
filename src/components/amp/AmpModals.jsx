import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Building2,
  Calculator,
  Headset,
  TrendingUp,
  Sparkles,
  Award,
  Layers,
  Radio,
  Share2,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export function AmpModals() {
  const {
    isAssetDetailOpen,
    setIsAssetDetailOpen,
    selectedService,
    setSelectedService,
    readingArticle,
    setReadingArticle,
    isDiagnosticModalOpen,
    setIsDiagnosticModalOpen,
    submitDiagnostic,
    siteConfig,
    toggleRadioPlay,
    isRadioPlaying,
    showToast
  } = useAmp();

  // Wizard state for modal version
  const [mStep, setMStep] = useState(1);
  const [mPillar, setMPillar] = useState('both_360');
  const [mChallenges, setMChallenges] = useState([]);
  const [mFormData, setMFormData] = useState({
    companyName: '',
    decisionMaker: '',
    role: 'Diretor / Sócio',
    email: '',
    whatsapp: '',
    city: ''
  });
  const [mResult, setMResult] = useState(null);

  const toggleMChallenge = (label) => {
    if (mChallenges.includes(label)) {
      setMChallenges(mChallenges.filter(c => c !== label));
    } else {
      setMChallenges([...mChallenges, label]);
    }
  };

  const handleMSubmit = (e) => {
    e.preventDefault();
    if (!mFormData.companyName || !mFormData.decisionMaker || !mFormData.whatsapp) {
      showToast('Preencha os campos obrigatórios (Empresa, Nome e WhatsApp).', 'warning');
      return;
    }

    const payload = {
      pillar: mPillar,
      pillarLabel: mPillar === 'ti_infra' ? 'TI & Infraestrutura' : mPillar === 'fin_fiscal' ? 'Finanças & Tributário' : 'Diagnóstico Integrado 360°',
      challenges: mChallenges,
      ...mFormData,
      generatedScore: Math.floor(Math.random() * 25) + 65,
    };

    submitDiagnostic(payload);
    setMResult(payload);
    setMStep(4);
  };

  const handleShare = (title) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copiado para a área de transferência!');
    }
  };

  const closeDiagnosticModal = () => {
    setIsDiagnosticModalOpen(false);
    setMStep(1);
    setMResult(null);
  };

  return (
    <>
      {/* 1. ASSET DEEP-DIVE MODAL */}
      {isAssetDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B1224] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setIsAssetDetailOpen(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 ${isAssetDetailOpen.accentColor} border ${isAssetDetailOpen.borderColor}`}>
                  {isAssetDetailOpen.badge}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{isAssetDetailOpen.pillar}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {isAssetDetailOpen.name}
              </h3>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                {isAssetDetailOpen.tagline}
              </p>
            </div>

            {/* Detailed Description */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAssetDetailOpen.description}
            </div>

            {/* Key Capabilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Capacidades Estratégicas & Diferenciais:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {isAssetDetailOpen.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className={`w-4 h-4 ${isAssetDetailOpen.accentColor} shrink-0 mt-0.5`} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {isAssetDetailOpen.kpis.map((kpi, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-base font-black text-white">{kpi.value}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-semibold">
                Ativo Integrado ao Grupo AMP
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {isAssetDetailOpen.id === 'asset-radio' && (
                  <button
                    onClick={toggleRadioPlay}
                    className="px-4 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shadow transition-all"
                  >
                    {isRadioPlaying ? 'Pausar Rádio' : 'Ouvir Ao Vivo'}
                  </button>
                )}

                {/* Primary Action: Falar com Especialista AMP */}
                <a
                  href={`https://api.whatsapp.com/send?phone=${siteConfig?.contact?.whatsapp || '5511998887766'}&text=${encodeURIComponent(`Olá! Gostaria de falar com um especialista sobre a solução ${isAssetDetailOpen.name} do Grupo AMP.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <span>Falar com Especialista</span>
                  <span>⚡</span>
                </a>

                {/* Secondary Action: Visitar Link Oficial se aplicável */}
                {isAssetDetailOpen.url && isAssetDetailOpen.url !== '#' && (
                  <a
                    href={isAssetDetailOpen.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs tracking-wider border border-slate-700 transition-all"
                  >
                    <span>{isAssetDetailOpen.ctaText || 'Visitar Site'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. SERVICE DETAIL MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B1224] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                selectedService.division === 'ti'
                  ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30'
                  : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
              }`}>
                {selectedService.divisionLabel} • {selectedService.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {selectedService.title}
              </h3>
            </div>

            {/* Full description */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                {selectedService.fullDesc}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Escopo e Entregas Técnicas:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedService.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              {selectedService.targetAudience && (
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 block mb-0.5">Perfil de Empresa Indicado:</span>
                  {selectedService.targetAudience}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => { setSelectedService(null); setIsDiagnosticModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Solicitar Diagnóstico para Este Serviço</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. ARTICLE READER MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#090F1E] border border-slate-700 shadow-2xl p-6 sm:p-10 space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setReadingArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Header */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {readingArticle.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {readingArticle.date}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {readingArticle.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                {readingArticle.title}
              </h2>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-b border-slate-800 pb-3">
                <span className="font-semibold text-slate-300">Por {readingArticle.author}</span>
                <button
                  onClick={() => handleShare(readingArticle.title)}
                  className="flex items-center gap-1 text-cyan-400 hover:underline font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Article Image */}
            {readingArticle.coverImage && (
              <div className="rounded-2xl overflow-hidden h-64 w-full border border-slate-800">
                <img
                  src={readingArticle.coverImage}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {readingArticle.content}
            </div>

            {/* Footer CTA */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Quer aplicar essa estratégia na sua empresa?
                </h4>
                <p className="text-[11px] text-slate-400">
                  Agende uma conversa técnica confidencial com nossos consultores.
                </p>
              </div>

              <button
                onClick={() => { setReadingArticle(null); setIsDiagnosticModalOpen(true); }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow"
              >
                Solicitar Diagnóstico
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. DIAGNOSTIC POPUP MODAL */}
      {isDiagnosticModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#090F1E] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={closeDiagnosticModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Diagnóstico 360° Gratuito
                </span>
                <span className="text-xs text-slate-400">Etapa {mStep} de 3</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Avaliação Estratégica & Parecer Preliminar
              </h3>
            </div>

            {/* Modal Step 1 */}
            {mStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Selecione o pilar prioritário para a análise:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setMPillar('both_360')}
                    className={`p-4 rounded-2xl border cursor-pointer text-xs ${
                      mPillar === 'both_360' ? 'bg-amber-500/20 border-amber-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="font-bold block text-white">TI + Finanças 360°</span>
                    <span className="text-[10px] text-slate-400">Visão completa e integrada</span>
                  </div>

                  <div
                    onClick={() => setMPillar('ti_infra')}
                    className={`p-4 rounded-2xl border cursor-pointer text-xs ${
                      mPillar === 'ti_infra' ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Server className="w-4 h-4 text-cyan-400 mb-1" />
                    <span className="font-bold block text-white">TI & Cloud</span>
                    <span className="text-[10px] text-slate-400">Servidores, backup e NOC</span>
                  </div>

                  <div
                    onClick={() => setMPillar('fin_fiscal')}
                    className={`p-4 rounded-2xl border cursor-pointer text-xs ${
                      mPillar === 'fin_fiscal' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="font-bold block text-white">Fiscal & BPO</span>
                    <span className="text-[10px] text-slate-400">Tributos e controladoria</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setMStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow"
                  >
                    Avançar →
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 2 */}
            {mStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Marque os tópicos de maior relevância:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    "Lentidão ou quedas de ERP/Servidores",
                    "Segurança contra Ransomware & Backup Imutável",
                    "Redução lícita de carga tributária",
                    "Terceirização de contas a pagar/receber (BPO)",
                    "Suporte técnico gerenciado MeshCentral",
                    "Proteção patrimonial dos sócios e Holding"
                  ].map((label, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleMChallenge(label)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 ${
                        mChallenges.includes(label)
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${mChallenges.includes(label) ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setMStep(1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={() => setMStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow"
                  >
                    Avançar para Contato →
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 3 */}
            {mStep === 3 && (
              <form onSubmit={handleMSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Nome da Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Grupo Industrial Alpha"
                      value={mFormData.companyName}
                      onChange={(e) => setMFormData({ ...mFormData, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Seu Nome / Cargo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos (Diretor)"
                      value={mFormData.decisionMaker}
                      onChange={(e) => setMFormData({ ...mFormData, decisionMaker: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">WhatsApp com DDD *</label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 98888-7766"
                      value={mFormData.whatsapp}
                      onChange={(e) => setMFormData({ ...mFormData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">E-mail Corporativo</label>
                    <input
                      type="email"
                      placeholder="carlos@empresa.com.br"
                      value={mFormData.email}
                      onChange={(e) => setMFormData({ ...mFormData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMStep(2)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    ← Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase shadow"
                  >
                    Gerar Diagnóstico
                  </button>
                </div>
              </form>
            )}

            {/* Modal Step 4: Finish */}
            {mStep === 4 && mResult && (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Diagnóstico 360° Registrado!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Recebemos as informações da <span className="font-bold text-white">{mResult.companyName}</span>. Um executivo sênior do Grupo AMP entrará em contato via WhatsApp para apresentar o relatório preliminar.
                </p>

                <div className="pt-2 flex justify-center gap-2">
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(`Olá! Acabei de gerar o diagnóstico 360° da ${mResult.companyName}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase shadow flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Falar no WhatsApp Agora</span>
                  </a>
                  <button
                    onClick={closeDiagnosticModal}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
