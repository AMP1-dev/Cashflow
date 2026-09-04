import React from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, KeyRound, FileText, Download, ShieldCheck, HelpCircle } from 'lucide-react';

export function ClientPortalSection() {
  const { siteConfig } = useApp();
  const portal = siteConfig.clientPortal || {};

  const portals = [
    {
      title: "Portal Questor / Domínio",
      desc: "Emissão de guias de impostos (DAS, GPS, DARF), holerites, informes de rendimentos e certidões negativas.",
      link: portal.questorUrl || "https://questor.aliancaempresarial.net.br",
      icon: FileText,
      badge: "Guias & Tributos"
    },
    {
      title: "Plataforma ContaAzul / ERP",
      desc: "Acesse seu sistema integrado de gestão financeira, emissão de notas fiscais de venda e conciliação bancária.",
      link: portal.contaAzulUrl || "https://app.contaazul.com",
      icon: ExternalLink,
      badge: "Gestão & BPO"
    },
    {
      title: "Solicitação de Documentos & Suporte",
      desc: "Envie contratos para análise societária, solicite alterações cadastrais ou abra chamados com nossa equipe.",
      link: `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Olá! Sou cliente da Aliança Empresarial e gostaria de solicitar um documento.')}`,
      icon: HelpCircle,
      badge: "Atendimento Rápido"
    }
  ];

  return (
    <section id="portal" className="py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <KeyRound className="w-96 h-96 -mr-20 -mb-20 text-white" />
          </div>

          <div className="relative z-10">
            <div className="max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-terracotta-400 mb-3">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Espaço do Cliente</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Acesse seus Sistemas & Documentos Contábeis
              </h2>
              <p className="text-sm text-slate-300">
                Centralizamos as principais plataformas para você emitir notas, baixar guias e acompanhar suas certidões com máxima agilidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portals.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-terracotta-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-terracotta-950/60 border border-terracotta-500/30 text-terracotta-400 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {item.badge}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-terracotta-400 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-terracotta-400">
                      <span>Acessar plataforma</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
