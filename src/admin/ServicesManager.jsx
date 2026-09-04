import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Plus, Edit, Trash2, Check, X, Building2, Calculator, TrendingUp, Users, PieChart, ShieldAlert } from 'lucide-react';

export function ServicesManager() {
  const { services, addService, updateService, deleteService } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Tributário',
    shortDesc: '',
    fullDesc: '',
    icon: 'Building2',
    highlights: ''
  });

  const handleStartCreate = () => {
    setForm({
      title: '',
      category: 'Tributário',
      shortDesc: '',
      fullDesc: '',
      icon: 'Building2',
      highlights: 'Enquadramento tributário ideal\nApuração rigorosa de tributos\nRevisão e compliance fiscal'
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (srv) => {
    setForm({
      title: srv.title,
      category: srv.category,
      shortDesc: srv.shortDesc || '',
      fullDesc: srv.fullDesc || '',
      icon: srv.icon || 'Building2',
      highlights: (srv.highlights || []).join('\n')
    });
    setEditingId(srv.id);
    setIsCreating(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const highlightsArr = form.highlights.split('\n').map(h => h.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      category: form.category,
      shortDesc: form.shortDesc,
      fullDesc: form.fullDesc,
      icon: form.icon,
      highlights: highlightsArr
    };

    if (isCreating) {
      addService(payload);
      setIsCreating(false);
    } else if (editingId) {
      updateService(editingId, payload);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Serviços & Soluções Corporativas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastre, edite e personalize as especialidades exibidas no portal da Aliança.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Serviço</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              {isCreating ? 'Novo Serviço' : 'Editar Serviço'}
            </h3>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Título do Serviço *</label>
              <input
                type="text"
                required
                placeholder="Ex: Gestão Fiscal & Planejamento Tributário"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Categoria</label>
              <input
                type="text"
                placeholder="Ex: Tributário, Legalização, BPO"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Resumo Curto (Exibido no Card) *</label>
            <textarea
              rows="2"
              required
              placeholder="Frase de impacto explicando o benefício para o cliente..."
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Descrição Detalhada (Exibida no Modal)</label>
            <textarea
              rows="3"
              placeholder="Explicação completa do escopo de trabalho e atuação da Aliança..."
              value={form.fullDesc}
              onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Pontos de Destaque (1 por linha)</label>
            <textarea
              rows="3"
              placeholder="Abertura ágil em dias&#10;Análise societária preventiva&#10;Licenciamento incluso"
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Serviço</span>
            </button>
          </div>
        </form>
      )}

      {/* Services List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-terracotta-950 text-terracotta-400 border border-terracotta-500/30">
                  {srv.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja excluir o serviço "${srv.title}"?`)) {
                        deleteService(srv.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{srv.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{srv.shortDesc}</p>
            </div>

            {srv.highlights && srv.highlights.length > 0 && (
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                {srv.highlights.length} itens de destaque inclusos
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
