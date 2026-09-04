import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  ShieldCheck,
  Calculator,
  Users,
  Radio,
  ExternalLink,
  CheckCircle2,
  Lock,
  TrendingUp,
  Gift,
  Scale
} from 'lucide-react';

export function AmpEcosystemSection() {
  const { themeMode, setIsAssetDetailOpen, toggleRadioPlay, isRadioPlaying, setIsDiagnosticModalOpen, assets } = useAmp();
  const isDark = themeMode === 'dark';

  const handleOpenAsset = (item) => {
    const fullAsset = assets?.find(a => a.id === item.id) || {
      id: item.id,
      name: item.name,
      shortName: item.name,
      url: item.url,
      category: item.badge,
      pillar: "Ecossistema AMP",
      badge: item.badge,
      tagline: item.tagline,
      description: item.desc,
      highlights: [
        "Infraestrutura de Alta Disponibilidade e Desempenho",
        "Monitoramento Ativo e Cibersegurança Avançada",
        "Integração Nativa com o Ecossistema Corporativo AMP",
        "Suporte Especializado e SLA Garantido em Contrato"
      ],
      kpis: [
        { label: "Disponibilidade", value: "99.9%" },
        { label: "Atendimento", value: "< 15 min" },
        { label: "Operação", value: "24/7/365" }
      ],
      ctaText: "Acessar Plataforma",
      color: "from-blue-600 to-indigo-900",
      accentColor: "text-blue-400",
      borderColor: "border-blue-500/30"
    };
    setIsAssetDetailOpen(fullAsset);
  };

  // 6 Primary Ecosystem Products in continuous seamless grid (Matching Image 3 from reference)
  const ecosystemItems = [
    {
      id: "asset-mesh",
      name: "MeshCentral Remote NOC",
      badge: "Suporte 24/7 & NOC",
      tagline: "Wan3.0-video",
      desc: "Central de monitoramento e controle de infraestrutura em tempo real. Acesso remoto seguro criptografado AES-256 e SLA < 15 min.",
      icon: ShieldCheck,
      url: "https://remoto.amp.ia.br"
    },
    {
      id: "asset-alianca",
      name: "Aliança Empresarial (Case)",
      badge: "Site & Gestão de TI",
      tagline: "Case-Sucesso-TI",
      desc: "Gestão completa de TI corporativa, segurança da informação, suporte de infraestrutura e hospedagem de alta performance para o setor contábil.",
      icon: ShieldCheck,
      url: "https://aliancaempresarial.net.br"
    },
    {
      id: "asset-backup",
      name: "Painel de Backup Imutável",
      badge: "Cibersegurança WORM",
      tagline: "Anti-Ransomware-3.0",
      desc: "Armazenamento imutável WORM à prova de hackers e sequestro de dados, com restauração bare-metal imediata.",
      icon: Lock,
      url: "https://remoto.amp.ia.br"
    },
    {
      id: "asset-erp",
      name: "AMP Enterprise ERP",
      badge: "ERP & Gestão Fiscal",
      tagline: "Qwen3.8-Fiscal",
      desc: "Gestão integrada de vendas, estoque, compras, financeiro e emissão de notas fiscais com integração contábil nativa.",
      icon: TrendingUp,
      url: "#contato"
    },
    {
      id: "asset-loyalty",
      name: "Aplicativo de Fidelidade",
      badge: "Marketing & Retenção",
      tagline: "AMP-Loyalty-Omni",
      desc: "Motor de fidelidade com pontos, cashback, roleta premiada interativa e campanhas automáticas de retenção via WhatsApp.",
      icon: Gift,
      url: "#contato"
    },
    {
      id: "asset-peso",
      name: "App Pesagem & Balança",
      badge: "Operações & Logística",
      tagline: "Logistics-Scale-Pro",
      desc: "Controle de tíquetes de balança rodoviária e industrial, conferência de peso de frotas e conciliação de fretes de carga.",
      icon: Scale,
      url: "https://remoto.amp.ia.br"
    }
  ];

  return (
    <section id="produtos" className={`py-20 border-t transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-100'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matching Image 3: "Get to Know QWEN #1 Most Downloaded... / Conheça as Soluções Líderes") */}
        <div className="mb-12 text-left">
          <h2 className={`text-2xl sm:text-4xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Conheça as Soluções Líderes do <span className="text-[#0052D9] font-normal">Universo AMP</span>
          </h2>
          <p className={`text-xs sm:text-sm font-light mt-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Mais de 40 anos de liderança desenvolvendo e homologando infraestrutura, inteligência fiscal e sistemas corporativos.
          </p>
        </div>

        {/* Seamless Split Layout (Matching Image 3: Left Open Summary + Right Hairline Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Completely Open / Flat (NOT a rounded box card!) */}
          <div className="lg:col-span-4 space-y-6 text-left py-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Portfólio 360° Integrado
              </span>
              <p className={`text-sm font-light leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Soluções corporativas desenvolvidas pelo Grupo AMP com arquitetura em alta disponibilidade e conformidade total com a legislação brasileira.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3 text-xs font-light">
              <div className="flex items-start gap-2.5">
                <span className="text-[#0052D9] font-bold">✓</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  1º em suporte remoto e monitoramento pró-ativo de endpoints
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#0052D9] font-bold">✓</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Redução tributária média de 20% a 35% com elisão legal
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#0052D9] font-bold">✓</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Armazenamento imutável WORM à prova de hackers e ransomware
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#0052D9] font-bold">✓</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Integração nativa entre contabilidade, estoque, ERP e balanças
                </span>
              </div>
            </div>

            {/* Blue Action Button (Image 3: "All Models ↗" style) */}
            <div className="pt-2">
              <a
                href="#central-clientes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal transition-all shadow-sm"
              >
                <span>Ver Todos os Sistemas</span>
                <span className="text-white">↗</span>
              </a>
            </div>
          </div>

          {/* Right Side: CONTINUOUS HAIRLINE GRID (Image 3: NOT isolated rounded cards, but a seamless grid with hairline dividers) */}
          <div className="lg:col-span-8">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l ${
              isDark ? 'border-slate-800' : 'border-slate-150'
            }`}>
              {ecosystemItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenAsset(item)}
                  className={`p-6 border-r border-b flex flex-col justify-between transition-colors duration-150 group text-left cursor-pointer ${
                    isDark
                      ? 'border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                      : 'border-slate-150 hover:bg-slate-50/90'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Small Icon in Subtle Pill Container */}
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#0052D9] mb-3">
                      <item.icon className="w-4 h-4" />
                    </div>

                    <h4 className={`text-sm font-normal transition-colors group-hover:text-[#0052D9] ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {item.name}
                    </h4>

                    {/* Tagline Pill below title (Image 3 style) */}
                    <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded ${
                      isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.tagline}
                    </span>

                    <p className={`text-xs font-light leading-relaxed line-clamp-3 pt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Corner Action at bottom */}
                  <div className="mt-5 pt-2 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAsset(item);
                      }}
                      className="text-amber-500 hover:text-amber-600 font-medium transition-colors flex items-center gap-1 group-hover:translate-x-0.5"
                    >
                      <span>Ver dossiê</span>
                      <span>→</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-light font-mono">24/7 SLA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
