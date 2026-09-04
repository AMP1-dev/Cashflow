import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Sparkles,
  Server,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  Zap,
  TrendingUp,
  Sliders,
  DollarSign,
  Users,
  ArrowUpRight
} from 'lucide-react';

export function AmpDiagnosticSection() {
  const { submitDiagnostic, showToast, siteConfig, themeMode } = useAmp();
  const isDark = themeMode === 'dark';

  // Wizard state
  const [step, setStep] = useState(1);
  const [pillar, setPillar] = useState('both_360'); // 'ti_infra' | 'fin_fiscal' | 'both_360'
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  
  // Interactive Simulator Sliders
  const [collaboratorCount, setCollaboratorCount] = useState(45);
  const [monthlyRevenueK, setMonthlyRevenueK] = useState(850); // in thousands (R$ 850k)

  const [formData, setFormData] = useState({
    companyName: '',
    decisionMaker: '',
    role: 'Diretor / Sócio',
    email: '',
    whatsapp: '',
    city: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Dynamic calculated estimates for the simulator
  const estimatedTaxSavingMin = Math.round((monthlyRevenueK * 12 * 0.08)); // 8% annual savings
  const estimatedTaxSavingMax = Math.round((monthlyRevenueK * 12 * 0.22)); // 22% annual savings
  const estimatedHelpdeskHoursSaved = Math.round(collaboratorCount * 4.5); // hours/month

  const toggleChallenge = (id) => {
    if (selectedChallenges.includes(id)) {
      setSelectedChallenges(selectedChallenges.filter(c => c !== id));
    } else {
      setSelectedChallenges([...selectedChallenges, id]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !pillar) {
      showToast('Por favor, selecione um pilar de interesse.', 'warning');
      return;
    }
    if (step === 2 && selectedChallenges.length === 0) {
      showToast('Selecione pelo menos um desafio para personalizar seu diagnóstico.', 'warning');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.decisionMaker || !formData.whatsapp) {
      showToast('Preencha os campos obrigatórios (Empresa, Nome e WhatsApp).', 'warning');
      return;
    }

    setIsSubmitting(true);

    const diagnosticPayload = {
      pillar,
      pillarLabel: pillar === 'ti_infra' ? 'TI & Infraestrutura' : pillar === 'fin_fiscal' ? 'Finanças & Tributário' : 'Diagnóstico Integrado 360°',
      challenges: selectedChallenges,
      collaboratorCount,
      monthlyRevenueK,
      estimatedAnnualSavings: `R$ ${estimatedTaxSavingMin.toLocaleString('pt-BR')} a R$ ${estimatedTaxSavingMax.toLocaleString('pt-BR')}`,
      ...formData,
      generatedScore: Math.floor(Math.random() * 20) + 75,
    };

    submitDiagnostic(diagnosticPayload);
    setResult(diagnosticPayload);
    setIsSubmitting(false);
    setStep(4);
  };

  const handleDirectWhatsApp = () => {
    if (!result) return;
    const msg = encodeURIComponent(
      `Olá Diretoria do Grupo AMP!\n\n` +
      `Gerei um *Diagnóstico 360° Corporativo* no portal para a empresa *${result.companyName}*.\n\n` +
      `*Solicitante:* ${result.decisionMaker} (${result.role})\n` +
      `*Pilar:* ${result.pillarLabel}\n` +
      `*Porte:* ${result.collaboratorCount} colaboradores | Faturamento ~R$ ${result.monthlyRevenueK}k/mês\n` +
      `*Economia Estimada:* ${result.estimatedAnnualSavings}\n\n` +
      `Gostaria de agendar uma reunião para apresentação do Parecer Executivo Oficial.`
    );
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${msg}`, '_blank');
  };

  const resetWizard = () => {
    setStep(1);
    setPillar('both_360');
    setSelectedChallenges([]);
    setCollaboratorCount(45);
    setMonthlyRevenueK(850);
    setFormData({
      companyName: '',
      decisionMaker: '',
      role: 'Diretor / Sócio',
      email: '',
      whatsapp: '',
      city: '',
      additionalNotes: ''
    });
    setResult(null);
  };

  const availableChallenges = [
    { id: "ti_lentidao", label: "Lentidão ou instabilidade em sistemas e ERP", pillar: "ti" },
    { id: "ti_backup", label: "Preocupação com ataque Ransomware e perda de dados", pillar: "ti" },
    { id: "ti_suporte", label: "Atendimento de Helpdesk lento e sem SLA claro", pillar: "ti" },
    { id: "ti_cloud", label: "Custos elevados com servidores em nuvem (AWS/Azure)", pillar: "ti" },
    { id: "fin_impostos", label: "Carga tributária elevada / Dúvidas sobre regime ideal", pillar: "fin" },
    { id: "fin_bpo", label: "Necessidade de terceirizar contas a pagar/receber (BPO)", pillar: "fin" },
    { id: "fin_dre", label: "Falta de DRE gerencial, margem e previsibilidade de caixa", pillar: "fin" },
    { id: "fin_holding", label: "Necessidade de proteção patrimonial e Holding Familiar", pillar: "fin" },
  ];

  const filteredChallenges = availableChallenges.filter(c => {
    if (pillar === 'both_360') return true;
    if (pillar === 'ti_infra') return c.pillar === 'ti';
    if (pillar === 'fin_fiscal') return c.pillar === 'fin';
    return true;
  });

  return (
    <section id="diagnostico" className={`py-20 border-t transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-medium uppercase tracking-widest text-[#0052D9] block">
            Simulador de Eficiência &amp; Governança
          </span>

          <h2 className={`text-2xl sm:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Descubra o Potencial de Otimização da sua Empresa
          </h2>

          <p className={`text-xs sm:text-base font-light leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Simule estimativas de economia fiscal e ganho de produtividade com suporte gerenciado 24/7 e emita um parecer preliminar sem custos.
          </p>
        </div>

        {/* Live Simulator Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Projeção de Economia Tributária</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg sm:text-xl font-normal text-emerald-600 dark:text-emerald-400">
              R$ {estimatedTaxSavingMin.toLocaleString('pt-BR')} ~ R$ {estimatedTaxSavingMax.toLocaleString('pt-BR')}/ano
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-1">Revisão e enquadramento ideal Aliança</p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Horas Produtivas Recuperadas</span>
              <Zap className="w-4 h-4 text-[#0052D9]" />
            </div>
            <div className="text-lg sm:text-xl font-normal text-[#0052D9] dark:text-sky-400">
              +{estimatedHelpdeskHoursSaved} Horas/Mês
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-1">NOC MeshCentral 24/7 e BPO Financeiro</p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Garantia de Uptime &amp; Resgate</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg sm:text-xl font-normal text-amber-600 dark:text-amber-400">
              99.98% / Zero Resgate
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-1">Backup Imutável WORM à prova de hackers</p>
          </div>
        </div>

        {/* Wizard Container Card */}
        <div className={`rounded-3xl border p-6 sm:p-10 ${
          isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-[#0052D9]">
                {step === 1 && "ETAPA 1/3: PILAR ESTRATÉGICO"}
                {step === 2 && "ETAPA 2/3: SIMULADOR DE PORTE & DESAFIOS"}
                {step === 3 && "ETAPA 3/3: DADOS PARA O PARECER EXECUTIVO"}
                {step === 4 && "DIAGNÓSTICO CONCLUÍDO COM SUCESSO!"}
              </span>
              <span className="text-slate-400">{step < 4 ? `${step}/3` : '100%'}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0052D9] h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100 > 100 ? 100 : (step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className={`text-lg font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Qual é o principal foco de otimização que sua empresa busca hoje?
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Nossos diretores personalizarão o parecer técnico com base nesta escolha.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setPillar('both_360')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    pillar === 'both_360'
                      ? 'border-[#0052D9] bg-[#0052D9]/5 ring-1 ring-[#0052D9]'
                      : isDark
                        ? 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Sparkles className="w-5 h-5 text-[#0052D9]" />
                    {pillar === 'both_360' && <CheckCircle2 className="w-5 h-5 text-[#0052D9]" />}
                  </div>
                  <h4 className={`text-sm font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>Diagnóstico 360° Completo</h4>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Avaliação integrada de TI, estabilidade de servidores, cibersegurança e elisão fiscal. (Recomendado)
                  </p>
                </div>

                <div
                  onClick={() => setPillar('ti_infra')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    pillar === 'ti_infra'
                      ? 'border-[#0052D9] bg-[#0052D9]/5 ring-1 ring-[#0052D9]'
                      : isDark
                        ? 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Server className="w-5 h-5 text-cyan-500" />
                    {pillar === 'ti_infra' && <CheckCircle2 className="w-5 h-5 text-[#0052D9]" />}
                  </div>
                  <h4 className={`text-sm font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>TI, Nuvem &amp; Cibersegurança</h4>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Estabilidade de servidores, backup imutável WORM e suporte gerenciado NOC 24/7.
                  </p>
                </div>

                <div
                  onClick={() => setPillar('fin_fiscal')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    pillar === 'fin_fiscal'
                      ? 'border-[#0052D9] bg-[#0052D9]/5 ring-1 ring-[#0052D9]'
                      : isDark
                        ? 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Calculator className="w-5 h-5 text-emerald-500" />
                    {pillar === 'fin_fiscal' && <CheckCircle2 className="w-5 h-5 text-[#0052D9]" />}
                  </div>
                  <h4 className={`text-sm font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>Consultoria Fiscal &amp; BPO</h4>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Planejamento tributário, BPO financeiro da tesouraria e holding patrimonial.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal transition-all flex items-center gap-2"
                >
                  <span>Avançar para o Simulador</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border space-y-5 ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Total de Usuários de TI / Colaboradores:</span>
                      <span className="text-[#0052D9] font-medium">{collaboratorCount} Usuários</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={collaboratorCount}
                      onChange={(e) => setCollaboratorCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0052D9]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Faturamento Médio Mensal:</span>
                      <span className="text-[#0052D9] font-medium">R$ {monthlyRevenueK.toLocaleString('pt-BR')} mil/mês</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="10000"
                      step="50"
                      value={monthlyRevenueK}
                      onChange={(e) => setMonthlyRevenueK(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0052D9]"
                    />
                  </div>
                </div>
              </div>

              {/* Challenges Checklist */}
              <div className="space-y-2">
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Selecione as metas ou pontos de atenção:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredChallenges.map((item) => {
                    const isSelected = selectedChallenges.includes(item.label);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChallenge(item.label)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#0052D9]/10 border-[#0052D9]'
                            : isDark
                              ? 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#0052D9] border-[#0052D9] text-white' : 'border-slate-400'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-light">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-normal"
                >
                  Voltar
                </button>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal transition-all flex items-center gap-2"
                >
                  <span>Avançar para Envio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className={`text-lg font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Para qual executivo devemos encaminhar o Parecer Preliminar?
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Os dados são estritamente sigilosos e tratados diretamente pelo comitê executivo do Grupo AMP.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Razão Social ou Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Indústria Alpha S/A"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0052D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Nome do Diretor / Solicitante *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Menezes"
                    value={formData.decisionMaker}
                    onChange={(e) => setFormData({ ...formData, decisionMaker: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0052D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    WhatsApp Corporativo com DDD *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: (11) 98888-7766"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0052D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    placeholder="Ex: carlos@empresa.com.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0052D9]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-normal"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Gerando Parecer...' : 'Concluir & Emitir Parecer'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4 */}
          {step === 4 && result && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-lg mx-auto">
                <h3 className={`text-xl font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Diagnóstico 360° Concluído com Sucesso!
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Prezado(a) <span className="font-medium text-[#0052D9]">{result.decisionMaker}</span>, nosso comitê executivo recebeu os dados da empresa <span className="font-medium text-slate-900 dark:text-white">{result.companyName}</span> e preparou o parecer estratégico preliminar.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border text-left max-w-xl mx-auto space-y-3 ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Índice Preliminar de Otimização:</span>
                  <span className="text-xs font-medium text-[#0052D9]">Score: {result.generatedScore}/100</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-light">
                  <div>
                    <span className="text-slate-400 block">Pilar Selecionado:</span>
                    <span className={`font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>{result.pillarLabel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Economia Anual Estimada:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{result.estimatedAnnualSavings}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-normal flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Falar Agora com Diretor no WhatsApp</span>
                </button>

                <button
                  onClick={resetWizard}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-normal"
                >
                  Fazer Outra Simulação
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
