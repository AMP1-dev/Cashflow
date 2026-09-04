import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export function AmpHero() {
  const { setIsDiagnosticModalOpen, themeMode } = useAmp();
  const isDark = themeMode === 'dark';

  // 4 Seamless Hairline Features
  const quickFeatures = [
    {
      title: "Migração Segura & Cloud",
      subtitle: "Performance superior em nuvem dedicada com até 40% de redução em custos de infraestrutura.",
      linkText: "Conhecer migração",
      url: "https://remoto.amp.ia.br"
    },
    {
      title: "MeshCentral NOC 24/7",
      subtitle: "Monitoramento contínuo de servidores e endpoints com atendimento crítico em < 12 minutos.",
      linkText: "Acessar NOC",
      url: "https://remoto.amp.ia.br"
    },
    {
      title: "Aliança Empresarial (Case)",
      subtitle: "Gestão completa de TI corporativa, cibersegurança ativa e hospedagem de alta performance.",
      linkText: "Conhecer case de TI",
      url: "https://aliancaempresarial.net.br"
    },
    {
      title: "Backup Imutável WORM",
      subtitle: "Armazenamento blindado à prova de ataques de Ransomware e recuperação instantânea.",
      linkText: "Ver proteção",
      url: "https://remoto.amp.ia.br"
    }
  ];

  // Trust Endorsements under the wave
  const trustEndorsements = [
    {
      name: "CREA-SP / Governança de TI",
      desc: "Responsabilidade técnica em engenharia de sistemas, infraestrutura em nuvem e cibersegurança."
    },
    {
      name: "ITIL v4 Certified",
      desc: "Processos de governança e suporte de TI de padrão internacional homologado."
    },
    {
      name: "ISO/IEC 27001",
      desc: "Gestão rigorosa de segurança da informação, conformidade e confidencialidade."
    },
    {
      name: "LGPD Compliance",
      desc: "Tratamento seguro e sigiloso de dados corporativos e de colaboradores."
    },
    {
      name: "Uptime 99.98%",
      desc: "SLA corporativo com monitoramento contínuo 24 horas por dia, 7 dias por semana."
    },
    {
      name: "Grupo AMP 40+ Anos",
      desc: "Quatro décadas de vanguarda e solidez atendendo empresas líderes em todo o Brasil."
    }
  ];

  return (
    <section id="inicio" className={`relative pt-32 pb-0 w-full overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F19]' : 'bg-white'
    }`}>
      
      {/* 1. CROPPED AMP WIREFRAME GLOBE WATERMARK (Subtle, Soft Light Gray, bleeding off the top-right edge) */}
      <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-20 lg:-top-32 lg:-right-28 w-[420px] sm:w-[580px] lg:w-[720px] h-[420px] sm:h-[580px] lg:h-[720px] pointer-events-none z-0 select-none opacity-40 dark:opacity-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform rotate-12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle perimeter */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={isDark ? "rgba(148, 163, 184, 0.4)" : "rgba(148, 163, 184, 0.55)"}
            strokeWidth="1.2"
          />

          {/* Equator line */}
          <line
            x1="4"
            y1="50"
            x2="96"
            y2="50"
            stroke={isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.5)"}
            strokeWidth="1.2"
          />

          {/* Upper latitude line */}
          <ellipse
            cx="50"
            cy="30"
            rx="41"
            ry="18"
            stroke={isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.45)"}
            strokeWidth="1"
          />

          {/* Lower latitude line */}
          <ellipse
            cx="50"
            cy="70"
            rx="41"
            ry="18"
            stroke={isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.45)"}
            strokeWidth="1"
          />

          {/* Center prime meridian */}
          <line
            x1="50"
            y1="4"
            x2="50"
            y2="96"
            stroke={isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.5)"}
            strokeWidth="1.2"
          />

          {/* Inner left curved meridian */}
          <ellipse
            cx="50"
            cy="50"
            rx="24"
            ry="46"
            stroke={isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.45)"}
            strokeWidth="1"
          />

          {/* Inner right curved meridian */}
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="46"
            stroke={isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(148, 163, 184, 0.4)"}
            strokeWidth="0.9"
          />
        </svg>
      </div>

      {/* 2. Main Hero Text Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex items-center mb-6">
          <a
            href="#fullstack"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-normal transition-all ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052D9] animate-pulse"></span>
            <span>40+ Anos de Excelência em TI Corporativa &amp; Inteligência Fiscal</span>
            <span className="text-[#0052D9] font-medium flex items-center gap-0.5">
              Conhecer Ecossistema <ArrowUpRight className="w-3 h-3" />
            </span>
          </a>
        </div>

        {/* Headline & Subtitle */}
        <div className="max-w-4xl space-y-5 text-left">
          <h1 className={`text-3xl sm:text-5xl lg:text-[4.25rem] font-light tracking-tight leading-[1.10] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Tudo o que sua Empresa Precisa em uma{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#0052D9] via-[#0284C7] to-[#0A3871] dark:from-[#38A0F2] dark:to-[#0052D9]">
              Plataforma Integrada
            </span>{' '}
            de TI &amp; Governança
          </h1>

          <p className={`text-base sm:text-lg font-light leading-relaxed max-w-2xl ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Para Líderes e Empresas escalando suas operações com alta disponibilidade, suporte gerenciado 24/7 via MeshCentral, defesa imutável contra ransomware e solidez tributária Aliança.
          </p>
        </div>

        {/* Action Buttons & Checkmarks */}
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white font-normal text-sm tracking-wide shadow-md shadow-blue-900/15 transition-all flex items-center gap-2 group"
            >
              <span>Iniciar Diagnóstico Gratuito</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <a
              href="#fullstack"
              className={`px-6 py-3.5 rounded-xl border text-sm font-normal transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <span>Conhecer Soluções Corporativas</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Inline Checkpoints */}
          <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-light ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0052D9]" />
              80+ Soluções Integradas
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0052D9]" />
              15.000+ Dispositivos Gerenciados
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0052D9]" />
              Suporte Crítico 24/7 com SLA &lt; 15 min
            </span>
          </div>
        </div>

      </div>

      {/* 3. FULL-WIDTH SWEEPING 3D FLUID WAVE RIBBON */}
      <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden pointer-events-none mt-8 sm:mt-12 z-10">
        
        {/* Atmospheric diffuse blur behind wave */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-sky-200/40 dark:via-purple-950/25 dark:to-sky-950/30 blur-3xl"></div>

        {/* The Expansive Wave SVG stretching 100vw edge-to-edge */}
        <svg
          viewBox="0 0 1920 420"
          preserveAspectRatio="none"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fullWidthWaveGrad" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#DDD6FE" stopOpacity="0.65" />
              <stop offset="55%" stopColor="#C4B5FD" stopOpacity="0.85" />
              <stop offset="78%" stopColor="#BAE6FD" stopOpacity="0.75" />
              <stop offset="92%" stopColor="#E0F2FE" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="fullWidthWaveDarkGrad" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#312E81" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#1E3A8A" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="secondaryWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="10%" stopColor="#F5D0FE" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.6" />
              <stop offset="90%" stopColor="#7DD3FC" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Secondary 3D depth wave underneath */}
          <path
            d="M -100 320 C 350 380, 750 160, 1200 240 C 1550 300, 1800 120, 2050 160 L 2050 420 L -100 420 Z"
            fill="url(#secondaryWaveGrad)"
            opacity="0.5"
          />

          {/* Primary sweeping 3D fluid ribbon */}
          <path
            d="M -100 280 C 400 350, 800 130, 1250 200 C 1600 250, 1850 80, 2050 110 L 2050 420 L -100 420 Z"
            fill={isDark ? "url(#fullWidthWaveDarkGrad)" : "url(#fullWidthWaveGrad)"}
          />

          {/* Glowing crest line */}
          <path
            d="M -100 280 C 400 350, 800 130, 1250 200 C 1600 250, 1850 80, 2050 110"
            stroke={isDark ? "rgba(168, 85, 247, 0.4)" : "rgba(192, 132, 252, 0.75)"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Soft bottom fade to pure white */}
        <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${
          isDark ? 'from-[#0B0F19] to-transparent' : 'from-white to-transparent'
        }`}></div>
      </div>

      {/* 4. Trust Endorsements Strip */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-start text-left">
          {trustEndorsements.map((t, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`text-xs font-medium tracking-tight ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                {t.name}
              </div>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SEAMLESS HAIRLINE 4-COLUMN FEATURE STRIP */}
      <div className={`border-t border-b ${
        isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-150 dark:divide-slate-800/80">
            {quickFeatures.map((feat, i) => (
              <a
                key={i}
                href={feat.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-6 px-5 lg:px-6 flex flex-col justify-between group transition-colors relative text-left ${
                  i === 0 ? 'before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-[#0052D9] before:to-indigo-500 before:rounded-r' : ''
                } ${
                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-white'
                }`}
              >
                <div className="space-y-1.5">
                  <h4 className={`text-sm font-normal transition-colors group-hover:text-[#0052D9] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {feat.title}
                  </h4>
                  <p className={`text-xs font-light leading-relaxed line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {feat.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-amber-500 font-normal">
                  <span>{feat.linkText}</span>
                  <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
