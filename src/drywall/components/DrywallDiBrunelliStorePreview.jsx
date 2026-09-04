import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Store, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  Check, 
  MessageSquare, 
  ArrowRight,
  Globe,
  Info
} from 'lucide-react';
import { SAMPLE_STORE_ITEMS, COMPANY_INFO } from '../data/drywallData';
import { useDrywall } from '../context/DrywallContext';

export function DrywallDiBrunelliStorePreview() {
  const { showToast } = useDrywall();
  const [orderItems, setOrderItems] = useState([
    { item: SAMPLE_STORE_ITEMS[0], qty: 20 },
    { item: SAMPLE_STORE_ITEMS[2], qty: 30 }
  ]);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const addItem = (product) => {
    setOrderItems((prev) => {
      const exists = prev.find((p) => p.item.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.item.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { item: product, qty: 1 }];
    });
    showToast(`"${product.name}" adicionado à simulação do pedido.`);
  };

  const updateQty = (id, delta) => {
    setOrderItems((prev) =>
      prev
        .map((p) => (p.item.id === id ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeItem = (id) => {
    setOrderItems((prev) => prev.filter((p) => p.item.id !== id));
    showToast('Item removido da simulação.');
  };

  const handleSimulateOrder = () => {
    setDemoSubmitted(true);
    showToast('Simulação de pedido concluída com sucesso!');
  };

  return (
    <section id="loja-demo" className="py-20 bg-slate-50 dark:bg-[#0E131F] transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0052D9] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Modelo de Demonstração &bull; Futura Expansão</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Di Brunelli &bull; <span className="text-[#0052D9] dark:text-blue-400">Exemplo de Loja Virtual</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Caso o proprietário deseje ativar no futuro a captação digital de pedidos, veja abaixo como funcionará a experiência de compra online integrada no domínio <strong className="text-slate-900 dark:text-white">dibrunelli.com.br</strong>:
          </p>
        </div>

        {/* Store Mockup Container */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          
          {/* Simulated Browser / Store Top Bar */}
          <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>dibrunelli.com.br/loja-pedidos</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ambiente Conceitual Interativo</span>
            </div>
          </div>

          {/* Store Grid: Catalog Left & Live Order Right */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Product List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Produtos para Captação de Pedidos:
                </h3>
                <span className="text-xs text-slate-400">Clique para adicionar à simulação</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SAMPLE_STORE_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#0052D9] dark:text-blue-400">
                        <span>{item.category}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          {item.stock}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {item.name}
                      </h4>
                      <div className="mt-2 text-sm font-black text-slate-800 dark:text-slate-200">
                        {item.refPrice} <span className="text-xs font-normal text-slate-500">/{item.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addItem(item)}
                      className="w-full py-2 px-3 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar ao Pedido</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Simulated Cart / Order Summary (4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between space-y-5">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#0052D9] dark:text-blue-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Simulação do Pedido
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {orderItems.length} itens
                  </span>
                </div>

                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Nenhum item selecionado. Adicione produtos ao lado para testar.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {orderItems.map((p) => (
                      <div
                        key={p.item.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {p.item.name}
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            {p.item.refPrice} x {p.qty}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(p.item.id, -1)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-rose-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 font-bold text-slate-800 dark:text-slate-200">
                            {p.qty}
                          </span>
                          <button
                            onClick={() => updateQty(p.item.id, 1)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-[#0052D9]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(p.item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                {demoSubmitted ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-1.5">
                    <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                      Pedido Simulado com Sucesso!
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Quando a loja for lançada, o pedido entrará diretamente no sistema de expedição com notificação no WhatsApp.
                    </p>
                    <button
                      onClick={() => setDemoSubmitted(false)}
                      className="text-[11px] text-[#0052D9] underline pt-1"
                    >
                      Testar novamente
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulateOrder}
                    disabled={orderItems.length === 0}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Simular Envio do Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Protótipo pronto para ativação quando o proprietário desejar abrir o canal de compras online.
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
