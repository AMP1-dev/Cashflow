import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  DollarSign, 
  PackageCheck, 
  Sparkles, 
  Info,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallStoreTab() {
  const { storeItems, addStoreItem, updateStoreItem, deleteStoreItem, showToast } = useDrywall();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: '',
    refPrice: 'R$ 0,00',
    unit: 'unidade',
    stock: 'Pronta-entrega',
    category: 'Placas de Gesso'
  });

  const openNewModal = () => {
    setEditingItem(null);
    setForm({
      name: '',
      refPrice: 'R$ 39,90',
      unit: 'chapa',
      stock: 'Pronta-entrega',
      category: 'Placas de Gesso'
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      refPrice: item.refPrice || 'R$ 0,00',
      unit: item.unit || 'unidade',
      stock: item.stock || 'Pronta-entrega',
      category: item.category || 'Geral'
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.refPrice) {
      showToast('Nome e preço são obrigatórios.', 'warning');
      return;
    }

    if (editingItem) {
      updateStoreItem(editingItem.id, form);
    } else {
      addStoreItem(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Informative Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-800/40 to-slate-900 border border-blue-900/40 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#0052D9]/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Store className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Modelo de Loja Virtual Di Brunelli &bull; Tabela de Preços & Estoque</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono">
              dibrunelli.com.br
            </span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Aqui você gerencia os preços unitários de atacado e os status de pronta-entrega que aparecem no simulador de pedidos online da página principal. Clientes podem montar uma cesta de produtos e solicitar fechamento imediato via WhatsApp.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Total de itens cadastrados na loja: <strong className="text-white">{storeItems.length}</strong>
        </p>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Item de Loja</span>
        </button>
      </div>

      {/* Table of Items */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="px-5 py-3.5">Produto & Categoria</th>
                <th className="px-5 py-3.5">Preço Referência</th>
                <th className="px-5 py-3.5">Unidade</th>
                <th className="px-5 py-3.5">Disponibilidade / Estoque</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {storeItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{item.name}</p>
                    <span className="inline-block mt-0.5 text-[11px] text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-extrabold text-emerald-400 text-sm font-mono">
                      {item.refPrice}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 capitalize">
                    {item.unit}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      <PackageCheck className="w-3.5 h-3.5" />
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                        title="Editar Preço e Estoque"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remover "${item.name}" da loja virtual?`)) {
                            deleteStoreItem(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                        title="Excluir Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingItem ? 'Editar Item da Loja' : 'Novo Item da Loja Di Brunelli'}
                  </h3>
                  <p className="text-xs text-slate-400">Preço unitário e status de pronta-entrega</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome do Item *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Placa Drywall Standard ST 12.5mm (1,20 x 1,80m)"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preço Referência (Atacado) *</label>
                  <input
                    type="text"
                    required
                    value={form.refPrice}
                    onChange={(e) => setForm({ ...form, refPrice: e.target.value })}
                    placeholder="Ex: R$ 39,90"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unidade de Medida</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="chapa, barra, balde, rolo..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Categoria</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ex: Placas de Gesso, Perfis..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status de Estoque</label>
                  <select
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  >
                    <option value="Pronta-entrega">Pronta-entrega</option>
                    <option value="Estoque alto">Estoque alto</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Sob consulta">Sob consulta</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {editingItem ? 'Salvar Alterações' : 'Adicionar à Loja'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
