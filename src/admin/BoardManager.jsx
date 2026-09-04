import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../services/storageService';
import { Plus, Edit2, Trash2, Upload, User, Check, X, ShieldCheck } from 'lucide-react';

export function BoardManager() {
  const { board, addBoardMember, updateBoardMember, deleteBoardMember, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    photo: ''
  });

  const resetForm = () => {
    setForm({
      name: '',
      role: '',
      bio: '',
      photo: ''
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (member) => {
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      photo: member.photo || ''
    });
    setEditingId(member.id);
    setIsEditing(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const base64 = await compressImageFile(file, 600, 0.85);
      setForm(prev => ({ ...prev, photo: base64 }));
      showToast('Foto do membro carregada com sucesso!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      showToast('Preencha pelo menos o nome e cargo do membro.', 'error');
      return;
    }

    if (editingId) {
      updateBoardMember(editingId, form);
    } else {
      addBoardMember(form);
    }

    resetForm();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja remover ${name} da diretoria?`)) {
      deleteBoardMember(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestão da Diretoria e Equipe</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cadastre e atualize os membros da diretoria executiva, conselho fiscal e coordenações.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => { resetForm(); setIsEditing(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-lg shadow-terracotta-600/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Membro</span>
          </button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              {editingId ? 'Editar Membro da Diretoria' : 'Novo Membro da Diretoria'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Photo */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
              {form.photo ? (
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-terracotta-500 shadow shrink-0 group">
                  <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photo: '' })}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs shrink-0 bg-white">
                  Sem Foto
                </div>
              )}

              <div className="flex-1 space-y-3 w-full">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-all">
                  <Upload className="w-4 h-4 text-terracotta-600" />
                  <span>{uploading ? 'Carregando foto...' : 'Escolher Foto do Membro'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="text-[11px] text-gray-400">Ou informe a URL da foto:</div>
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto-membro.jpg"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500 bg-white"
                />
              </div>
            </div>

            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Maria Helena Silveira"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cargo / Função *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Presidente Executiva"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Biografia / Resumo Profissional</label>
              <textarea
                rows="3"
                placeholder="Breve descrição da formação, experiência e atuação voluntária no projeto..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
                Salvar Membro
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Board Members Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {board.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[4/4] bg-gray-100">
              <img
                src={member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(member)}
                  className="p-2 rounded-full bg-white/90 text-terracotta-600 hover:bg-white shadow"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-terracotta-50 text-terracotta-700 inline-block mb-1">
                  {member.role}
                </span>
                <h4 className="text-sm font-bold text-gray-900 leading-snug">{member.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-3 mt-1.5">{member.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
