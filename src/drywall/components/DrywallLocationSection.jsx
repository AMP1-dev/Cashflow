import React from 'react';
import { MapPin, Truck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CITIES_SERVED, COMPANY_INFO } from '../data/drywallData';

export function DrywallLocationSection() {
  return (
    <section id="regioes" className="py-20 bg-white dark:bg-[#0B0F19] transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0052D9] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Onde Atendemos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Logística Ágil no <span className="text-[#0052D9] dark:text-blue-400">Interior de São Paulo</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Entregas programadas direto no canteiro de obras ou retirada expressa no nosso Centro de Distribuição.
          </p>
        </div>

        {/* Clean Region Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CITIES_SERVED.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0052D9] dark:text-blue-400" />
                  <span>{item.region}</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.main} e cidades vizinhas.
              </p>
            </div>
          ))}

          {/* Direct contact card */}
          <div className="p-6 rounded-2xl border border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-base font-bold text-[#0052D9] dark:text-blue-300">
                Sua cidade não está na lista?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Atendemos rotas especiais e carretas dedicadas para qualquer município do interior paulista.
              </p>
            </div>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de consultar se vocês entregam na minha cidade no interior de SP.')}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#0052D9] dark:text-blue-400 hover:underline"
            >
              Consultar frete para sua cidade &rarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
