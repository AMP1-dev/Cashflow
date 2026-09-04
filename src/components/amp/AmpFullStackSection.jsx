import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Layers,
  Server,
  ShieldCheck,
  Calculator,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

export function AmpFullStackSection() {
  const { themeMode, setIsDiagnosticModalOpen } = useAmp();
  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState('fullstack');

  const tabs = [
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'iaas', label: 'Infraestrutura NOC' },
    { id: 'paas', label: 'Governança & BPO' },
    { id: 'saas', label: 'Apps & SaaS' },
    { id: 'esg', label: 'Inovação & ESG' },
  ];

  return (
    <section id="fullstack" className={`py-20 transition-colors duration-200 border-b ${
      isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-white border-slate-100'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Light, Open Typography */}
        <div className="mb-10">
          <h2 className={`text-2xl sm:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Explore Our Global Full-Stack{' '}
            <span className="text-[#0052D9] font-normal">TI + Governança</span> Services
          </h2>
          <p className={`text-xs sm:text-sm font-light mt-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Oferecemos uma infraestrutura abrangente unindo suporte de alta velocidade, segurança e inteligência fiscal.
          </p>
        </div>

        {/* 4 Clean Key Feature Highlights Row (Matching Screenshot 2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-100 dark:border-slate-800 text-left">
          <div>
            <h3 className={`text-lg sm:text-xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>Full Stack</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Do suporte remoto à governança</p>
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>NOC 24/7/365</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Monitoramento de 15.000+ endpoints</p>
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>Segurança WORM</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Backup imutável anti-ransomware</p>
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>Elisão Fiscal</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Redução lícita de impostos comprovada</p>
          </div>
        </div>

        {/* Horizontal Navigation Sub-tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-normal whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-[#0052D9] text-white shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Split Architecture Content (Airy, Hairline borders) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column (4 cols): Description & Quick actions */}
          <div className="lg:col-span-4 flex flex-col justify-between py-2 space-y-6">
            <div className="space-y-3">
              <h3 className={`text-xl sm:text-2xl font-light tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                All in One. TI + Finanças.
              </h3>

              <p className={`text-xs sm:text-sm font-light leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                IaaS, PaaS, SaaS e Consultoria Estratégica unificados. Da infraestrutura de servidores até a holding patrimonial e a gestão de caixa, inicie suas operações com total conformidade e suporte em tempo real.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsDiagnosticModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-normal text-[#0052D9] hover:underline"
                >
                  <span>Iniciar Avaliação Técnica</span>
                  <span className="text-amber-500">↗</span>
                </button>
              </div>
            </div>

            {/* Quick links list on bottom of left column */}
            <div className="space-y-1.5 text-xs font-light text-slate-500">
              <a href="#produtos" className="block hover:text-[#0052D9] transition-colors">MeshCentral NOC Studio</a>
              <a href="#produtos" className="block hover:text-[#0052D9] transition-colors">Plataforma de Governança Aliança</a>
              <a href="#produtos" className="block hover:text-[#0052D9] transition-colors">Backup Imutável &amp; Disaster Recovery</a>
            </div>
          </div>

          {/* Right Column (8 cols): Clean Layered Architecture Canvas */}
          <div className={`lg:col-span-8 p-6 sm:p-8 rounded-2xl border ${
            isDark ? 'bg-slate-800/30 border-slate-700/60' : 'bg-slate-50/70 border-slate-200/60 shadow-sm'
          }`}>
            
            <div className="space-y-3.5">
              
              {/* LAYER 3: SaaS / Applications Layer */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-800/80 border-indigo-500/20' : 'bg-white border-indigo-100 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-xs font-normal text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                      Aplicações &amp; Negócios (SaaS)
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-500 font-mono">Camada de Negócio</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-light">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    AMP Flow (Caixa)
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    AMP Loyalty
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    AMP ERP Fiscal
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    App Pesagem
                  </div>
                </div>
              </div>

              {/* LAYER 2: Platform & Governance Layer */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-800/80 border-blue-500/20' : 'bg-white border-blue-100 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0052D9]"></span>
                    <span className="text-xs font-normal text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                      Plataforma &amp; Gestão (PaaS)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#0052D9] font-mono">Camada de Gestão</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-light">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Aliança Contábil
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    BPO Tesouraria
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    MeshCentral 24/7
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Demandas Consultores
                  </div>
                </div>
              </div>

              {/* LAYER 1: Infrastructure & Security Layer */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-800/80 border-teal-500/20' : 'bg-white border-teal-100 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    <span className="text-xs font-normal text-teal-900 dark:text-teal-200 uppercase tracking-wide">
                      Infraestrutura Crítica &amp; Cibersegurança (IaaS)
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-600 font-mono">Camada Base</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-light">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    NOC MeshCentral
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Backup WORM
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Nuvem Híbrida
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    AES-256 / TLS 1.3
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
