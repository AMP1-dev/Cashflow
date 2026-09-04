import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageSquare, 
  Copy, 
  Check, 
  ShoppingCart, 
  MapPin, 
  User, 
  Building2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallQuoteDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    generateWhatsAppLink,
    showToast,
    company
  } = useDrywall();

  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [segment, setSegment] = useState('Gesseiro / Instalador Profissional');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Adicione pelo menos um item à sua cotação.', 'warning');
      return;
    }
    const link = generateWhatsAppLink({
      name: customerName,
      company: companyName,
      city: city || 'Interior de SP',
      segment,
      note: notes
    });
    window.open(link, '_blank');
  };

  const handleCopyList = () => {
    if (cart.length === 0) {
      showToast('Adicione itens antes de copiar.', 'warning');
      return;
    }
    let text = `LISTA DE COTAÇÃO - DRYWALL DISTRIBUIDORA / DI BRUNELLI\n`;
    text += `Cliente: ${customerName || 'Não informado'}\n`;
    text += `Cidade: ${city || 'Interior de SP'}\n`;
    text += `Segmento: ${segment}\n\nITENS:\n`;
    cart.forEach((item, i) => {
      text += `${i + 1}. ${item.product.title} - Qtd: ${item.quantity} ${item.product.unit}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Lista copiada para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0E131F] shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0052D9] dark:text-blue-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Lista de Cotação Rápida
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cart.length} {cart.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Limpar todos os itens"
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body: Products list and customer inputs */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
            
            {/* Products List */}
            <div className="space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sua lista está vazia</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Navegue pela vitrine de produtos e clique em "Adicionar à Lista de Cotação" para montar seu pedido.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.product.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center gap-3 justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052D9] dark:text-blue-400 block truncate">
                        {item.product.categoryLabel}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.product.title}
                      </h5>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Unidade: {item.product.unit}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remover produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Information for Quick Quote */}
            {cart.length > 0 && (
              <div className="pt-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Identificação para a Cotação (Opcional):
                </h4>

                <div className="space-y-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Seu Nome ou Responsável"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0052D9] focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Nome da Empresa / Empreiteira"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0052D9] focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cidade da Obra (Ex: Campinas, Sorocaba...)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0052D9] focus:outline-none"
                    />
                  </div>

                  <div>
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0052D9] focus:outline-none"
                    >
                      <option value="Gesseiro / Instalador Profissional">Perfil: Gesseiro / Instalador Profissional</option>
                      <option value="Construtora / Empreiteira">Perfil: Construtora / Empreiteira</option>
                      <option value="Engenheiro / Arquiteto">Perfil: Engenheiro / Arquiteto</option>
                      <option value="Revenda / Loja de Bairro">Perfil: Revenda / Loja de Materiais</option>
                      <option value="Cliente Final / Reforma">Perfil: Cliente Final / Reforma Residencial</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Observações adicionais (ex: metragem aproximada, data de início da obra...)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0052D9] focus:outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Quick Logistics reminder */}
            <div className="pt-4 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
              <AlertCircle className="w-4 h-4 text-[#0052D9] dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                Cotação direta sem intermediários. Entregas em até 24h a 48h no interior de SP ou retirada no Centro de Distribuição.
              </span>
            </div>

          </div>

          {/* Drawer Footer Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
              <button
                onClick={handleWhatsAppSend}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Cotação para WhatsApp Comercial</span>
              </button>

              <button
                onClick={handleCopyList}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Lista Copiada!' : 'Copiar Texto da Lista'}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
