import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallRegionsTab() {
  const { regions, addRegion, updateRegion, deleteRegion, showToast } = useDrywall();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    region: '',
    main: '',
    time: '24h'
  });

  const openNewModal = () => {
    setEditingIndex(null);
    setForm({
      region: '',
      main: '',
      time: '24h'
    });
    setModalOpen(true);
  };

  const openEditModal = (region, index) => {
    setEditingIndex(index);
    setForm({
      region: region.region || '',
      main: region.main || '',
      time: region.time || '24h'
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.region || !form.main) {
      showToast('Nome da região e cidades atendidas são obrigatórios.', 'warning');
      return;
    }

    if (editingIndex !== null) {
      updateRegion(editingIndex, form);
    } else {
      addRegion(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Informative Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-800/40 to-slate-900 border border-emerald-900/40 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <Truck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Logística & Frota Própria &bull; Polos de Entrega Interior SP</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure as cidades e os prazos de entrega que aparecem no mapa interativo e na seção "Onde Atendemos" do portal. As rotas são atendidas diretamente por caminhões toco e três-quartos com capacidade para chapas de 2,40m e perfis de 3m.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Polos e regiões cadastradas: <strong className="text-white">{regions.length}</strong>
        </p>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Polo / Região</span>
        </button>
      </div>

      {/* Grid of Regions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regions.map((reg, idx) => (
          <div
            key={idx}
            className="bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{reg.region}</span>
                </h4>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{reg.time}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-slate-400 block mb-0.5 text-[11px] uppercase tracking-wider">Cidades Principais Atendidas:</strong>
                {reg.main}
              </p>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-700/50">
              <button
                onClick={() => openEditModal(reg, idx)}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/60 rounded-lg transition-colors text-xs font-semibold inline-flex items-center gap-1"
                title="Editar Região"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Remover polo "${reg.region}"?`)) {
                    deleteRegion(idx);
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors text-xs font-semibold inline-flex items-center gap-1"
                title="Excluir Região"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Region */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingIndex !== null ? 'Editar Polo de Entrega' : 'Novo Polo de Entrega'}
                  </h3>
                  <p className="text-xs text-slate-400">Prazos e cidades atendidas pela logística</p>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome do Polo / Região *</label>
                <input
                  type="text"
                  required
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  placeholder="Ex: Polo Piracicaba & Limeira"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Prazo de Entrega Estimado *</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="Ex: 24h, 24h a 48h..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cidades Principais Atendidas *</label>
                <textarea
                  rows="3"
                  required
                  value={form.main}
                  onChange={(e) => setForm({ ...form, main: e.target.value })}
                  placeholder="Ex: Piracicaba, Limeira, Rio Claro, Santa Bárbara d'Oeste, Capivari..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none resize-none"
                ></textarea>
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
                  {editingIndex !== null ? 'Salvar Alterações' : 'Cadastrar Polo'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
