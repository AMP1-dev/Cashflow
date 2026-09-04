import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../services/storageService';
import { Plus, Trash2, Upload, Image as ImageIcon, Eye, X, Check } from 'lucide-react';

export function GalleryManager() {
  const { gallery, addGalleryPhoto, deleteGalleryPhoto, setLightboxPhoto, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Artes',
    imageUrl: '',
    date: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  });

  const categories = ['Artes', 'Música', 'Histórias', 'Natureza', 'Teatro', 'Convivência', 'Nutrição'];

  const resetForm = () => {
    setForm({
      title: '',
      category: 'Artes',
      imageUrl: '',
      date: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    });
    setIsAdding(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const base64 = await compressImageFile(file, 1200, 0.85);
      setForm(prev => ({ ...prev, imageUrl: base64 }));
      showToast('Imagem carregada com sucesso!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      showToast('Selecione ou informe a URL de uma foto.', 'error');
      return;
    }

    addGalleryPhoto(form);
    resetForm();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Excluir esta foto da galeria?`)) {
      deleteGalleryPhoto(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Gestão da Galeria de Fotos</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Adicione e organize as fotos que são exibidas na galeria interativa do portal.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-lg shadow-terracotta-600/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Foto à Galeria</span>
          </button>
        )}
      </div>

      {/* Upload / Form Modal */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Nova Foto na Galeria</h3>
            <button
              onClick={resetForm}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Image Preview & Upload */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
              {form.imageUrl ? (
                <div className="relative w-44 h-32 rounded-2xl overflow-hidden border-2 border-terracotta-500 shadow shrink-0 group">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                  >
                    Trocar Foto
                  </button>
                </div>
              ) : (
                <div className="w-44 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs shrink-0 bg-white">
                  Selecione a Imagem
                </div>
              )}

              <div className="flex-1 space-y-3 w-full">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-all">
                  <Upload className="w-4 h-4 text-terracotta-600" />
                  <span>{uploading ? 'Processando arquivo...' : 'Escolher Imagem do Computador'}</span>
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
                  placeholder="https://exemplo.com/foto.jpg"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500 bg-white"
                />
              </div>
            </div>

            {/* Title, Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título / Legenda</label>
                <input
                  type="text"
                  placeholder="Ex: Pintura livre com tintas naturais"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mês / Ano</label>
                <input
                  type="text"
                  placeholder="Ex: Agosto/2026"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
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
                Salvar Foto na Galeria
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setLightboxPhoto(item)}
                  className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 shadow"
                  title="Ampliar"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-gray-800 shadow-sm">
                  {item.category || 'Atividade'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title || 'Sem título'}</h4>
              <span className="text-[11px] text-gray-400">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
