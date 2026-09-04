import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Plus, Edit, Trash2, Check, X, User } from 'lucide-react';

export function TestimonialsManager() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5
  });

  const handleStartCreate = () => {
    setForm({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (t) => {
    setForm({
      name: t.name,
      role: t.role || '',
      company: t.company || '',
      content: t.content || '',
      rating: t.rating || 5
    });
    setEditingId(t.id);
    setIsCreating(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isCreating) {
      addTestimonial(form);
      setIsCreating(false);
    } else if (editingId) {
      updateTestimonial(editingId, form);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Depoimentos & Cases de Clientes</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie as avaliações de empresários e diretores exibidas na página principal.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Depoimento</span>
          </button>
        )}
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              {isCreating ? 'Novo Depoimento' : 'Editar Depoimento'}
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
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Cliente *</label>
              <input
                type="text"
                required
                placeholder="Ex: Dra. Mariana Costa"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Cargo / Função</label>
              <input
                type="text"
                placeholder="Ex: Diretora Médica"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome da Empresa</label>
              <input
                type="text"
                placeholder="Ex: Hospital & Clínicas São Paulo"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Depoimento / Texto da Avaliação *</label>
            <textarea
              rows="3"
              required
              placeholder="O que o cliente destacou sobre a qualidade da assessoria da Aliança..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Depoimento</span>
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Excluir depoimento de "${t.name}"?`)) {
                        deleteTestimonial(t.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic mb-3">"{t.content}"</p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs">
              <span className="font-bold text-white">{t.name}</span>
              <span className="text-slate-400"> • {t.role} ({t.company})</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
