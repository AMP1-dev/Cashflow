import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Building2, 
  Plus, 
  MessageSquare, 
  FileCheck,
  Package
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallProductModal() {
  const { 
    selectedProductModal, 
    setSelectedProductModal, 
    addToCart, 
    company 
  } = useDrywall();

  if (!selectedProductModal) return null;

  const product = selectedProductModal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setSelectedProductModal(null)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-[#0E131F] rounded-3xl max-w-2xl w-full text-left overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all z-10">
          
          {/* Modal Header with Image */}
          <div className="relative h-60 w-full overflow-hidden bg-slate-900">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            {/* Close button */}
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on image */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#0052D9] text-white">
                  {product.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {product.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Subtitle & Description */}
            <div>
              <h4 className="text-sm font-semibold text-[#0052D9] dark:text-blue-400">
                {product.subtitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tech Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Dimensões</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {product.dimensions}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Espessura</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {product.thickness}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fabricante</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {product.brand}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Norma ABNT</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {product.norm}
                </span>
              </div>
            </div>

            {/* Highlights List */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#0052D9] dark:text-blue-400" />
                <span>Principais Características & Vantagens:</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  addToCart(product, 1);
                  setSelectedProductModal(null);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0052D9] hover:bg-[#003B99] flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar à Lista de Cotação</span>
              </button>

              <a
                href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de uma cotação com valor de atacado para o item *${product.title}* (${product.unit}) para minha obra no interior de SP.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Cotar via WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
