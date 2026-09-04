import React, { useState } from 'react';
import { Calculator, AlertCircle, Phone, ArrowRight, Percent, RefreshCw } from 'lucide-react';
import { FMA_CONFIG } from '../../data/fmaData';

export function FmaInterestCalculator() {
  const [loanAmount, setLoanAmount] = useState('50000');
  const [monthlyInstallment, setMonthlyInstallment] = useState('1950');
  const [totalInstallments, setTotalInstallments] = useState('48');
  const [paidInstallments, setPaidInstallments] = useState('18');
  const [loanType, setLoanType] = useState('veiculo'); // veiculo, pessoal, imobiliario, empresa

  // Calculate rough estimates
  const amount = parseFloat(loanAmount) || 0;
  const installment = parseFloat(monthlyInstallment) || 0;
  const totalTerms = parseInt(totalInstallments) || 1;
  const paidTerms = parseInt(paidInstallments) || 0;

  const totalContractCost = installment * totalTerms;
  const totalInterestPaid = Math.max(0, totalContractCost - amount);

  // Estimativa empírica média de readequação em casos com juros abusivos (20% a 35% de redução sobre encargos excedentes)
  const estimatedSavings = Math.round(totalInterestPaid * 0.28);
  const estimatedNewInstallment = Math.max(0, Math.round(installment - (estimatedSavings / totalTerms)));

  return (
    <section id="calculadora" className="py-20 bg-[#0A0B0E] relative border-t border-fma-border/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-fma-gold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            Simulador de Viabilidade Bancária
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Estimativa de Revisão de Juros Abusivos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Descubra uma estimativa de economia potencial caso o seu financiamento ou empréstimo esteja com taxas acima da média do Banco Central.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-fma-card border border-fma-border rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono mb-2">
                Tipo de Operação de Crédito:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'veiculo', label: 'Financ. Veículo' },
                  { id: 'pessoal', label: 'Empréstimo Pessoal' },
                  { id: 'empresa', label: 'Capital de Giro' },
                  { id: 'imobiliario', label: 'Crédito Imobiliário' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setLoanType(t.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      loanType === t.id
                        ? 'bg-fma-surface border-fma-gold text-white shadow'
                        : 'bg-[#111318] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Valor Financiado / Liberado (R$)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                  placeholder="Ex: 50000"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Valor da Parcela Mensal (R$)</label>
                <input
                  type="number"
                  value={monthlyInstallment}
                  onChange={(e) => setMonthlyInstallment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                  placeholder="Ex: 1950"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Total de Parcelas Contratadas</label>
                <input
                  type="number"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                  placeholder="Ex: 48"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Parcelas Já Pagas</label>
                <input
                  type="number"
                  value={paidInstallments}
                  onChange={(e) => setPaidInstallments(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                  placeholder="Ex: 18"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
              <span>
                Esta simulação tem caráter meramente informativo e pedagógico. O recálculo exato depende da análise da Cédula de Crédito Bancário (CCB) e das taxas do BACEN da época.
              </span>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-[#111318] border border-fma-border rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-fma-gold block">
                Resultado Preliminar
              </span>

              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <span className="block text-xs text-zinc-400">Total a ser pago ao banco:</span>
                <span className="text-xl font-mono font-bold text-white">
                  R$ {totalContractCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[11px] text-zinc-500">
                  Total de juros estimados: R$ {totalInterestPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  Economia Potencial Estimada:
                </span>
                <span className="text-3xl font-serif font-bold text-emerald-300">
                  R$ {estimatedSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                  Parcela recalculada estimada: <strong className="text-white">R$ {estimatedNewInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent(`Olá Dr. Fernando Maeda, fiz uma simulação no site: Financiamento de R$ ${loanAmount}, parcela de R$ ${monthlyInstallment} em ${totalInstallments}x. Gostaria de enviar meu contrato para análise pericial real.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Enviar Contrato para Avaliação Gratuita</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
