import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, ArrowRight, MessageCircle, TrendingDown, CheckCircle2, Sparkles, Building2, Stethoscope, Cpu, ShoppingBag } from 'lucide-react';

export function TaxSimulator() {
  const { siteConfig, setIsProposalOpen, setProposalPrefill } = useApp();

  const [segment, setSegment] = useState('servicos'); // 'servicos' | 'saude' | 'ti' | 'comercio'
  const [revenue, setRevenue] = useState(60000); // R$ 60.000 / mês
  const [employees, setEmployees] = useState(3);

  // Approximate tax logic estimation
  const getEstimation = () => {
    let bestRegime = 'Simples Nacional';
    let baseRate = 0.15; // 15% standard
    let optimizedRate = 0.085; // with planning

    if (segment === 'saude') {
      bestRegime = revenue > 100000 ? 'Lucro Presumido (Equiparação Hospitalar)' : 'Simples Nacional (Fator R)';
      baseRate = 0.155;
      optimizedRate = 0.08;
    } else if (segment === 'ti') {
      bestRegime = 'Simples Nacional c/ Fator R Planejado';
      baseRate = 0.155;
      optimizedRate = 0.06;
    } else if (segment === 'comercio') {
      bestRegime = revenue > 250000 ? 'Lucro Real / Presumido c/ ICMS-ST' : 'Simples Nacional';
      baseRate = 0.10;
      optimizedRate = 0.065;
    } else {
      bestRegime = revenue > 150000 ? 'Lucro Presumido Estratégico' : 'Simples Nacional Otimizado';
      baseRate = 0.16;
      optimizedRate = 0.09;
    }

    const monthlyStandardTax = revenue * baseRate;
    const monthlyOptimizedTax = revenue * optimizedRate;
    const monthlySavings = Math.max(0, monthlyStandardTax - monthlyOptimizedTax);
    const yearlySavings = monthlySavings * 12;

    return {
      bestRegime,
      monthlyStandardTax,
      monthlyOptimizedTax,
      monthlySavings,
      yearlySavings
    };
  };

  const est = getEstimation();

  const handleRequestStudy = () => {
    const segmentLabels = {
      servicos: 'Prestação de Serviços',
      saude: 'Saúde & Clínicas Médicas',
      ti: 'Tecnologia & Softwares',
      comercio: 'Comércio & E-commerce'
    };
    
    const prefillData = {
      segment: segmentLabels[segment],
      revenue: `R$ ${revenue.toLocaleString('pt-BR')}/mês`,
      employees: `${employees} colaboradores`,
      estimatedSavings: `R$ ${Math.round(est.yearlySavings).toLocaleString('pt-BR')}/ano`
    };

    setProposalPrefill(prefillData);
    setIsProposalOpen(true);
  };

  const handleDirectWhatsApp = () => {
    const segmentLabels = {
      servicos: 'Prestação de Serviços',
      saude: 'Saúde & Clínicas Médicas',
      ti: 'Tecnologia & Softwares',
      comercio: 'Comércio & E-commerce'
    };

    const text = encodeURIComponent(
      `Olá! Fiz uma simulação tributária no site da Aliança Empresarial:\n` +
      `• Segmento: ${segmentLabels[segment]}\n` +
      `• Faturamento: R$ ${revenue.toLocaleString('pt-BR')}/mês\n` +
      `• Equipe: ${employees} funcionários\n` +
      `Gostaria de receber o estudo tributário detalhado para minha empresa.`
    );
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section id="simulador" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Ferramenta Exclusiva Aliança</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Simulador de Otimização Tributária
          </h2>
          <p className="text-base text-slate-300">
            Descubra em segundos o regime tributário mais vantajoso e a estimativa de economia de impostos para a sua empresa.
          </p>
        </div>

        {/* Simulator Box */}
        <div className="max-w-5xl mx-auto bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls (Left) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* 1. Segment Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  1. Qual é o segmento da sua empresa?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSegment('servicos')}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      segment === 'servicos'
                        ? 'bg-terracotta-600 border-terracotta-500 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>Serviços / Consultoria</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSegment('saude')}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      segment === 'saude'
                        ? 'bg-terracotta-600 border-terracotta-500 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 shrink-0" />
                    <span>Saúde & Clínicas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSegment('ti')}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      segment === 'ti'
                        ? 'bg-terracotta-600 border-terracotta-500 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>Tecnologia & Startups</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSegment('comercio')}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      segment === 'comercio'
                        ? 'bg-terracotta-600 border-terracotta-500 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Comércio & E-commerce</span>
                  </button>
                </div>
              </div>

              {/* 2. Monthly Revenue Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. Faturamento Mensal Estimado:
                  </label>
                  <span className="text-base font-black text-terracotta-400">
                    R$ {revenue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                  <span>R$ 10.000</span>
                  <span>R$ 500.000</span>
                  <span>R$ 1.000.000+</span>
                </div>
              </div>

              {/* 3. Employees Counter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. Quantidade de Colaboradores / Sócios:
                  </label>
                  <span className="text-sm font-bold text-white">
                    {employees} {employees === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                />
              </div>

            </div>

            {/* Results Display (Right) */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-inner space-y-6">
                
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Enquadramento Recomendado:
                  </span>
                  <div className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-terracotta-400 shrink-0" />
                    <span>{est.bestRegime}</span>
                  </div>
                </div>

                {/* Savings Metric Box */}
                <div className="p-5 rounded-2xl bg-terracotta-950/40 border border-terracotta-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-terracotta-300 uppercase tracking-wider mb-1">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span>Potencial de Economia Tributária:</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white leading-none my-1">
                    R$ {Math.round(est.yearlySavings).toLocaleString('pt-BR')}
                    <span className="text-sm font-bold text-slate-400"> / ano</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Economia média estimada de R$ {Math.round(est.monthlySavings).toLocaleString('pt-BR')} por mês com planejamento tributário consultivo.
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleRequestStudy}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-extrabold text-sm shadow-xl shadow-terracotta-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Receber Estudo Tributário Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Validar essa Simulação no WhatsApp</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
