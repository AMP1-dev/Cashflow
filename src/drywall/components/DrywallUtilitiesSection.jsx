import React from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Newspaper, 
  ShieldCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { DRYWALL_UTILITIES, DRYWALL_NEWS } from '../data/drywallData';

export function DrywallUtilitiesSection() {
  return (
    <section id="utilidades" className="py-20 bg-slate-50 dark:bg-[#0E131F] transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0052D9] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versatilidade & Onde Usar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exemplos de Utilidades do <span className="text-[#0052D9] dark:text-blue-400">Drywall</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            O gesso acartonado e a construção a seco revolucionaram a arquitetura moderna. Veja as principais aplicações em residências, escritórios e grandes construções comerciais.
          </p>
        </div>

        {/* 4 Practical Utility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {DRYWALL_UTILITIES.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0052D9] text-white shadow">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {item.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href="#cotacao"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-[#0052D9] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
                >
                  <span>Cotar materiais desta aplicação</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Notícias & Artigos Técnicos Válidos */}
        <div id="noticias" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0052D9] dark:text-blue-400 mb-1">
                <Newspaper className="w-4 h-4" />
                <span>Notícias, Guias Técnicos & Normas Oficiais</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Fique por dentro das vantagens do Drywall
              </h3>
            </div>
            <a
              href="https://drywall.org.br"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0052D9] dark:hover:text-blue-400"
            >
              <span>Portal Associação Brasileira de Drywall</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DRYWALL_NEWS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052D9] dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0052D9] dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#0052D9] dark:group-hover:text-blue-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>Fonte: {item.source}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
