import React from 'react';
import { 
  Boxes, 
  MessageSquare, 
  ArrowRight,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { ESSENTIAL_PRODUCTS } from '../data/drywallData';
import { useDrywall } from '../context/DrywallContext';

export function DrywallProductsSection() {
  const { company } = useDrywall();

  return (
    <section id="produtos" className="py-20 bg-white dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0052D9] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Boxes className="w-3.5 h-3.5" />
            <span>Catálogo Essencial &bull; Pronta Entrega</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Principais Produtos da <span className="text-[#0052D9] dark:text-blue-400">Distribuidora</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Placas normatizadas, perfis galvanizados de alta rigidez e insumos para fornecimento contínuo a instaladores e obras no interior de São Paulo.
          </p>
        </div>

        {/* 6 Essential Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ESSENTIAL_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0052D9] text-white shadow">
                      {prod.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0052D9] dark:text-blue-400">
                    {prod.category} &bull; Fornecimento por {prod.unit}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prod.subtitle}
                  </p>

                  <div 
                    className="pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: prod.specs }}
                  />
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <a
                  href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de cotar o produto *${prod.title}* (${prod.unit}) com preço de distribuidora para o interior de SP.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Cotar este item no WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Call to Full Quotation */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Precisa da relação completa para sua obra ou lote fechado?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Montantes, guias, cantoneiras, buchas, fitas, isolamentos e placas com faturamento faturado PJ.
            </p>
          </div>
          <a
            href="#cotacao"
            className="px-6 py-3 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
          >
            Enviar Relação de Materiais
          </a>
        </div>

      </div>
    </section>
  );
}
