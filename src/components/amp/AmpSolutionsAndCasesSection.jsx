import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Server,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Scale,
  Gift,
  CreditCard,
  Building2,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';

export function AmpSolutionsAndCasesSection() {
  const { themeMode, setIsDiagnosticModalOpen } = useAmp();
  const isDark = themeMode === 'dark';

  // Category sidebar
  const [selectedCategory, setSelectedCategory] = useState('selected');
  // Industry use cases
  const [activeIndustry, setActiveIndustry] = useState('health');

  const categories = [
    { id: 'selected', label: 'Produtos Selecionados' },
    { id: 'ti_cloud', label: 'TI, Cloud & Servidores' },
    { id: 'finance', label: 'Finanças & BPO' },
    { id: 'logistics', label: 'Logística & Pesagem' },
    { id: 'loyalty', label: 'Marketing & Fidelização' },
  ];

  const categoryProducts = {
    selected: [
      { name: "MeshCentral Remote NOC", tag: "Infraestrutura", desc: "Suporte remoto 24/7 com telemetria e resposta em < 12 minutos." },
      { name: "Backup Imutável WORM", tag: "Cibersegurança", desc: "Defesa anti-ransomware com armazenamento blindado e restauração imediata." },
      { name: "Gestão de TI & Segurança Contábil", tag: "Case Aliança", desc: "Gerenciamento completo de TI, servidores, cibersegurança e presença digital de alta disponibilidade." },
      { name: "AMP Enterprise ERP", tag: "Gestão Fiscal", desc: "Emissão de NF-e, NFS-e, MDF-e, estoque e financeiro integrados." },
      { name: "AMP Flow Financeiro", tag: "Tesouraria", desc: "Fluxo de caixa inteligente com DRE gerencial diária e conciliação bancária." },
      { name: "App Pesagem & Balança", tag: "Logística", desc: "Controle de tickets de pesagem rodoviária e conciliação de fretes de frotas." },
    ],
    ti_cloud: [
      { name: "MeshCentral Suporte Gerenciado", tag: "Helpdesk", desc: "Centralização de tickets e atendimento de incidentes críticos em tempo real." },
      { name: "Servidores Híbridos Dedicados", tag: "Cloud", desc: "Hospedagem segura em nuvem privada com alta disponibilidade e failover." },
      { name: "Defesa EDR & Backup WORM", tag: "Segurança", desc: "Blindagem de dados e conformidade total com a LGPD e ISO 27001." },
    ],
    finance: [
      { name: "Planejamento Tributário Elisão", tag: "Fiscal", desc: "Redução lícita da carga tributária sobre faturamento e serviços." },
      { name: "BPO Financeiro Integral", tag: "Tesouraria", desc: "Terceirização de contas a pagar, receber, conciliação e fluxo de caixa." },
      { name: "Holding Patrimonial & Sucessão", tag: "Societário", desc: "Estruturação societária para proteção de patrimônio familiar e empresarial." },
      { name: "Módulo Banco & Controle de Cheques", tag: "Custódia", desc: "Gestão de carteiras de cheques pré-datados, depósitos e liquidação." },
    ],
    logistics: [
      { name: "Aplicativo de Pesagem & Balança", tag: "Operacional", desc: "Emissão de tickets de pesagem e conferência de peso bruto, tara e líquido." },
      { name: "Conciliação de Documentos de Carga", tag: "Fiscal", desc: "Parametrização automática de CT-e, MDF-e e manifestos eletrônicos." },
    ],
    loyalty: [
      { name: "AMP Loyalty & Fidelidade", tag: "Fidelização", desc: "Programa de pontos, cashback e campanhas automatizadas via WhatsApp." },
      { name: "Roleta Premiada Gamificada", tag: "Engajamento", desc: "Mecanismos de premiação instantânea para aumentar o ciclo de recompra." },
    ]
  };

  const industries = {
    health: {
      title: "Saúde & Hospitais",
      subtitle: "Rede Hospitalar & Centro Diagnóstico Santa Helena",
      period: "Parceria contínua há 8 anos",
      challenge: "Ambiente de prontuários eletrônicos instável e alta carga tributária hospitalar.",
      solution: "Modernização completa com nuvem híbrida, suporte 24/7 MeshCentral e equiparação tributária hospitalar pela Aliança.",
      results: [
        "Zero paradas não programadas em 36 meses consecutivos",
        "Redução comprovada de 32% na carga tributária com equiparação legal",
        "Economia anual superior a R$ 1.4 Milhão em tributos e TI",
        "Atendimento a chamados clínicos em menos de 8 minutos"
      ],
      author: "Dr. Marcelo Fagundes — Diretor Geral"
    },
    industry: {
      title: "Indústria & Manufatura",
      subtitle: "Indústria Metalúrgica Alvorada",
      period: "Parceria contínua há 12 anos",
      challenge: "Risco de perda de dados por backup defasado e controles financeiros manuais em planilhas.",
      solution: "Implantação de Backup Imutável WORM anti-ransomware, migração do ERP para cloud e BPO financeiro da tesouraria.",
      results: [
        "Tentativa de Ransomware neutralizada em tempo real sem impacto",
        "Inadimplência de clientes reduzida de 14% para 2.1% no 1º ano",
        "Fechamento contábil e DRE antecipados para o 5º dia útil do mês",
        "Recuperação de R$ 920.000 em créditos tributários de PIS/COFINS"
      ],
      author: "Renata Vasconcellos — CFO"
    },
    transport: {
      title: "Transporte & Logística",
      subtitle: "TransLogística Nacional Express",
      period: "Parceria contínua há 6 anos",
      challenge: "Suporte a 400 computadores em 18 centros de distribuição e complexidade extrema de ICMS-ST e fretes.",
      solution: "Padronização tecnológica com MeshCentral Suporte Remoto centralizado e assessoria fiscal contínua em CT-e/MDF-e.",
      results: [
        "Redução de 65% nos custos com deslocamento de técnicos de informática",
        "Tempo médio de solução de chamados reduzido de 4h para 18 minutos",
        "Eliminação total de autos de infração e multas fiscais de transporte",
        "Constituição de Holding Imobiliária para os 18 galpões da família"
      ],
      author: "Carlos Eduardo Menezes — Diretor de Operações"
    },
    retail: {
      title: "Varejo & Franquias",
      subtitle: "Rede Varejista Multimarcas",
      period: "Parceria contínua há 5 anos",
      challenge: "Necessidade de fidelização de clientes em PDV e conciliação diária de cartões de crédito em 24 lojas.",
      solution: "Implantação do AMP Loyalty com roleta premiada, integração com ERP de vendas e BPO de conciliação de recebíveis.",
      results: [
        "Aumento de 38% na taxa de recompra de clientes cadastrados",
        "Conciliação de 100% dos recebíveis de cartões com recuperação de taxas",
        "Emissão fiscal ultrarrápida no PDV sem filas"
      ],
      author: "Juliana Silveira — Diretora Comercial"
    }
  };

  const currentIndustry = industries[activeIndustry] || industries.health;

  return (
    <section id="cases-industria" className="transition-colors duration-200">
      
      {/* 1. Upper Part: End-to-End Solutions (CONTINUOUS HAIRLINE GRID, NO BOXED CARDS) */}
      <div className={`py-20 ${isDark ? 'bg-[#0B0F19]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 text-left">
            <h2 className={`text-2xl sm:text-4xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              End-to-End <span className="text-[#0052D9] font-normal">TI and Governança</span> Solutions For All Your Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Category Sidebar (3 cols) */}
            <div className="lg:col-span-3 space-y-1 text-left">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'text-[#0052D9] font-medium bg-blue-50/60 dark:bg-slate-800'
                      : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#0052D9]" />
                  )}
                </button>
              ))}
            </div>

            {/* Right Continuous Hairline Grid (9 cols: NO rounded box cards, just clean hairline dividers!) */}
            <div className="lg:col-span-9">
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l ${
                isDark ? 'border-slate-800' : 'border-slate-150'
              }`}>
                {(categoryProducts[selectedCategory] || categoryProducts.selected).map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-6 border-r border-b flex flex-col justify-between transition-colors duration-150 group text-left ${
                      isDark
                        ? 'border-slate-800 hover:bg-slate-800/30'
                        : 'border-slate-150 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {p.tag}
                      </span>
                      <h4 className={`text-sm font-normal group-hover:text-[#0052D9] transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {p.name}
                      </h4>
                      <p className={`text-xs font-light leading-relaxed line-clamp-3 pt-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 flex items-center justify-between text-xs text-[#0052D9]">
                      <span className="font-light text-slate-500">Especificações</span>
                      <span className="text-amber-500 font-normal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        ↗
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. INTERMEDIATE FULL-WIDTH TRANSITION STRIP */}
      <div className="w-full relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-[#E6F4EA]/80 via-[#F0FDF4]/90 to-[#E0F2FE]/80 dark:from-[#06281E]/40 dark:via-[#0B1B2B]/50 dark:to-[#0F172A] border-t border-b border-emerald-100/60 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-left">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-slate-900 dark:text-white">
              Inicie seu <span className="text-[#0052D9] font-normal">Diagnóstico 360°</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light max-w-xl">
              Mais de 80 soluções corporativas homologadas para acelerar a segurança, governança e economia tributária da sua organização.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal transition-all shadow-md shadow-blue-900/15 flex items-center gap-2"
            >
              <span>Agendar Sem Custos</span>
              <span className="text-white">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. FULL-WIDTH (100vw) FLUID ORGANIC INDUSTRY USE CASES BLOCK */}
      <div className="w-full relative overflow-hidden text-white">
        
        {/* Top Organic Wave Transition */}
        <div className="w-full h-16 sm:h-24 overflow-hidden -mb-1 pointer-events-none">
          <svg
            viewBox="0 0 1920 100"
            preserveAspectRatio="none"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 100 C 400 20, 1000 80, 1400 10 C 1650 -20, 1800 40, 1920 10 L 1920 100 L 0 100 Z"
              fill="#0047BA"
            />
          </svg>
        </div>

        {/* Main Body */}
        <div className="w-full bg-[#0047BA] dark:bg-[#003994] py-16 sm:py-20 relative">
          
          {/* Internal Luminous Wave Reflections */}
          <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-20 overflow-hidden">
            <svg viewBox="0 0 1000 600" className="w-full h-full object-cover" fill="none">
              <path
                d="M 0 300 C 300 100, 600 500, 1000 200"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M -100 400 C 250 150, 700 550, 1100 250"
                stroke="rgba(147, 197, 253, 0.3)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Case Study Information (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
                    Industry Use Cases
                  </h3>
                  <a
                    href="#central-clientes"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 mt-2 font-normal transition-colors"
                  >
                    <span>Ver todas as soluções por indústria</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Horizontal Industry Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {Object.entries(industries).map(([key, ind]) => (
                    <button
                      key={key}
                      onClick={() => setActiveIndustry(key)}
                      className={`px-4 py-1.5 rounded-full text-xs font-normal transition-all ${
                        activeIndustry === key
                          ? 'bg-white text-[#0047BA] font-medium shadow-md'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {ind.title}
                    </button>
                  ))}
                </div>

                {/* Active Case Details (Glassmorphic fluid transparency) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-4">
                  <div>
                    <h4 className="text-lg sm:text-xl font-normal text-white">{currentIndustry.subtitle}</h4>
                    <span className="text-xs text-blue-200 font-light">{currentIndustry.period}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                    <div className="space-y-1">
                      <span className="text-blue-200 font-normal uppercase text-[10px] tracking-wider block">O Desafio:</span>
                      <p className="text-white/90 leading-relaxed">{currentIndustry.challenge}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-blue-200 font-normal uppercase text-[10px] tracking-wider block">A Solução AMP:</span>
                      <p className="text-white/90 leading-relaxed">{currentIndustry.solution}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/15">
                    <span className="text-[10px] font-normal uppercase tracking-wider text-blue-200 block mb-2">
                      Resultados Comprovados:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {currentIndustry.results.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/90 font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-200 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-blue-200 italic font-light">
                    "{currentIndustry.author}"
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setIsDiagnosticModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-white text-[#0047BA] hover:bg-blue-50 font-medium text-xs tracking-wide shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Agendar Diagnóstico para seu Segmento</span>
                    <span className="text-[#0047BA]">↗</span>
                  </button>
                </div>
              </div>

              {/* Right Cascading 3D Stacked Cards Fan */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px]">
                
                {/* Back card */}
                <div
                  className="w-64 sm:w-72 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl absolute"
                  style={{
                    transform: 'rotate(-9deg) translate(-30px, -25px)',
                    opacity: 0.55
                  }}
                >
                  <div className="text-[10px] text-blue-200 font-mono">CASE ESTUDO #01</div>
                  <div className="text-sm font-medium text-white mt-1">Rede Santa Helena</div>
                  <div className="text-xs text-blue-100 font-light mt-2">-32% Carga Tributária</div>
                </div>

                {/* Middle card */}
                <div
                  className="w-64 sm:w-72 p-5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl absolute"
                  style={{
                    transform: 'rotate(5deg) translate(25px, -15px)',
                    opacity: 0.8
                  }}
                >
                  <div className="text-[10px] text-blue-200 font-mono">CASE ESTUDO #02</div>
                  <div className="text-sm font-medium text-white mt-1">Indústria Alvorada</div>
                  <div className="text-xs text-blue-100 font-light mt-2">Zero Ransomware • Uptime 100%</div>
                </div>

                {/* Front card */}
                <div
                  className="w-64 sm:w-72 p-6 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/40 shadow-2xl relative z-10 space-y-3"
                  style={{
                    transform: 'rotate(-2deg)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-200 uppercase tracking-wider">
                      {currentIndustry.title}
                    </span>
                    <Award className="w-4 h-4 text-blue-200" />
                  </div>

                  <h5 className="text-base font-medium text-white">
                    {currentIndustry.subtitle}
                  </h5>

                  <div className="p-3 rounded-xl bg-black/20 text-xs font-light text-white/90">
                    <span className="text-blue-200 font-medium block">Resultado Chave:</span>
                    {currentIndustry.results[1] || currentIndustry.results[0]}
                  </div>

                  <div className="text-[10px] text-blue-200 font-light">
                    Metodologia Homologada Grupo AMP
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Bottom Organic Wave Transition */}
        <div className="w-full h-16 sm:h-20 overflow-hidden -mt-1 pointer-events-none">
          <svg
            viewBox="0 0 1920 80"
            preserveAspectRatio="none"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 0 L 1920 0 C 1600 60, 1100 20, 600 70 C 300 85, 100 50, 0 80 Z"
              fill="#0047BA"
            />
          </svg>
        </div>

      </div>

    </section>
  );
}
