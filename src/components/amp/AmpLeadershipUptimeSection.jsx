import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Server,
  Users,
  Lock,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export function AmpLeadershipUptimeSection() {
  const { siteConfig, themeMode, setIsDiagnosticModalOpen } = useAmp();
  const isDark = themeMode === 'dark';

  const metrics = [
    { label: "Anos de História & Vanguarda", value: "40+ Anos", sub: "Quatro décadas contínuas de mercado" },
    { label: "Empresas Atendidas", value: "500+", sub: "Corporações e holdings nacionais" },
    { label: "Dispositivos & Endpoints", value: "15.000+", sub: "Monitorados via NOC MeshCentral 24/7" },
    { label: "Uptime Garantido em Contrato", value: "99.98%", sub: "SLA de resposta crítica < 15 minutos" },
  ];

  const complianceBadges = [
    { title: "CREA-SP / CRC-SP", desc: "Responsabilidade técnica de engenharia e contabilidade oficial registrada." },
    { title: "ITIL Certified v4", desc: "Processos de governança e suporte de TI de padrão internacional homologado." },
    { title: "ISO/IEC 27001", desc: "Diretrizes estritas de gestão de segurança da informação e sigilo." },
    { title: "LGPD Compliance", desc: "Tratamento seguro e sigiloso de dados corporativos e de colaboradores." },
  ];

  return (
    <section id="lideranca" className={`transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19]' : 'bg-white'
    }`}>
      
      {/* 1. Main Leadership & Social Proof Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Testimonial & Endorsement (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className={`text-2xl sm:text-4xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Reconhecido por Líderes e Conselheiros em Todo o Brasil
            </h2>

            <div className={`p-6 sm:p-8 rounded-2xl border relative ${
              isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50/70 border-slate-150'
            }`}>
              <p className={`text-sm sm:text-base font-light italic leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                "A convergência de TI com suporte imediato e a inteligência contábil-tributária do Grupo AMP conferem uma blindagem que nenhuma consultoria isolada consegue entregar. Em oito anos de parceria, nossa operação médica nunca parou por falha de servidor e alcançamos uma redução tributária de mais de R$ 1.4 milhão ao ano."
              </p>

              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dr. Marcelo Fagundes
                  </div>
                  <div className="text-[11px] text-slate-400 font-light">
                    Diretor Geral — Rede Hospitalar Santa Helena
                  </div>
                </div>

                <div className="text-xs text-[#0052D9] font-medium flex items-center gap-1">
                  <span>8 Anos de Parceria</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Authority Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-5 ${
              isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/60 border-slate-150'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0052D9] text-white">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Autoridade Técnica &amp; Fiscal
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light">Homologações e Certificados Oficiais</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs font-light">
                {complianceBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-150'
                    }`}
                  >
                    <div className="font-normal text-[#0052D9]">{badge.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 leading-snug">{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 2. Global Operation 24/7/365 Banner with Metrics */}
        <div className={`p-8 sm:p-10 rounded-2xl border ${
          isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50/50 border-slate-150'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-150 dark:border-slate-800 text-left">
            <div>
              <h3 className={`text-xl sm:text-2xl font-light tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Operação Contínua Global 24/7/365
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Conectando infraestrutura, inteligência de dados e segurança operacional ininterrupta.
              </p>
            </div>

            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal transition-all shadow-sm flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Simular Uptime da sua Empresa</span>
              <span>↗</span>
            </button>
          </div>

          {/* 4 KPIs Row with Hairline Separation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 text-center md:text-left">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-light text-[#0052D9] tracking-tight">
                  {m.value}
                </div>
                <div className={`text-xs font-normal ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {m.label}
                </div>
                <div className="text-[11px] text-slate-400 font-light">
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. FULL-WIDTH PRE-FOOTER STRIP (Edge-to-Edge immersion) */}
      <div className="w-full bg-[#0052D9] text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-light">
            <span className="font-normal">Precisa de atendimento executivo imediato?</span>
            <span className="hidden md:inline text-blue-200">|</span>
            <span className="hidden md:inline text-blue-100">
              Nossa diretoria técnica e fiscal atende diretamente demandas de novos contratos corporativos.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá,%20gostaria%20de%20falar%20com%20um%20diretor%20do%20Grupo%20AMP.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-white text-[#0052D9] hover:bg-blue-50 text-xs font-normal transition-all shadow-sm"
            >
              Falar com Diretor no WhatsApp
            </a>

            <a
              href="#central-clientes"
              className="px-4 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-normal border border-white/20 transition-all"
            >
              Central de Clientes
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
