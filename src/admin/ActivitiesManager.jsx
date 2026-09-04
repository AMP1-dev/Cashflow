import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Palette, Check, X, Smile, Music, Drama, Gamepad2, BookOpen, Sprout, Users } from 'lucide-react';

const availableIcons = [
  { id: 'Smile', label: 'Sorriso / Expressão' },
  { id: 'Palette', label: 'Artes / Pintura' },
  { id: 'Music', label: 'Música / Ritmo' },
  { id: 'Drama', label: 'Teatro / Fantoches' },
  { id: 'Gamepad2', label: 'Jogos / Tabuleiro' },
  { id: 'BookOpen', label: 'Leitura / Histórias' },
  { id: 'Sprout', label: 'Horta / Natureza' },
  { id: 'Users', label: 'Convivência / Grupo' },
];

export function ActivitiesManager() {
  const { activities, addActivity, updateActivity, deleteActivity, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Artes Visuais',
    ageGroup: '4 a 10 anos',
    description: '',
    icon: 'Palette'
  });

  const resetForm = () => {
    setForm({
      title: '',
      category: 'Artes Visuais',
      ageGroup: '4 a 10 anos',
      description: '',
      icon: 'Palette'
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (act) => {
    setForm({
      title: act.title || '',
      category: act.category || 'Artes Visuais',
      ageGroup: act.ageGroup || '4 a 10 anos',
      description: act.description || '',
      icon: act.icon || 'Smile'
    });
    setEditingId(act.id);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      showToast('Preencha o título e a descrição da oficina.', 'error');
      return;
    }

    if (editingId) {
      updateActivity(editingId, form);
    } else {
      addActivity(form);
    }

    resetForm();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Tem certeza que deseja excluir a oficina "${title}"?`)) {
      deleteActivity(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestão de Oficinas Lúdicas</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cadastre, edite ou remova as oficinas e faixas etárias oferecidas pelo projeto.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => { resetForm(); setIsEditing(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-lg shadow-terracotta-600/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Oficina</span>
          </button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              {editingId ? 'Editar Oficina Lúdica' : 'Nova Oficina Lúdica'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título da Oficina *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Teatro de Fantoches & Expressão"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Arte & Emoções, Musicalização"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Faixa Etária Recomendada</label>
                <input
                  type="text"
                  placeholder="Ex: 6 a 12 anos"
                  value={form.ageGroup}
                  onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ícone Temático</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableIcons.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setForm({ ...form, icon: ic.id })}
                    className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition-all ${
                      form.icon === ic.id
                        ? 'bg-terracotta-50 border-terracotta-600 text-terracotta-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
                    {ic.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Descrição dos Objetivos Lúdicos *</label>
              <textarea
                rows="3"
                required
                placeholder="Explique como essa oficina ajuda as crianças a desenvolverem criatividade, autonomia e afeto..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Salvar Oficina
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  {act.ageGroup}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(act)}
                    className="p-2 rounded-xl text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(act.id, act.title)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-500 block mb-1">
                {act.category}
              </span>
              <h3 className="text-base font-bold text-gray-900 mb-2">{act.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{act.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
