import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../services/storageService';
import { Newspaper, Plus, Edit, Trash2, Check, X, Upload, Calendar, User, Image as ImageIcon } from 'lucide-react';

export function PostsManager() {
  const { posts, addPost, updatePost, deletePost, showToast } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Tributário',
    date: new Date().toISOString().split('T')[0],
    author: 'Aliança Empresarial',
    summary: '',
    content: '',
    coverImage: '',
    featured: false
  });

  const handleStartCreate = () => {
    setForm({
      title: '',
      category: 'Tributário',
      date: new Date().toISOString().split('T')[0],
      author: 'Aliança Empresarial',
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      featured: false
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (post) => {
    setForm({
      title: post.title,
      category: post.category || 'Tributário',
      date: post.date || new Date().toISOString().split('T')[0],
      author: post.author || 'Aliança Empresarial',
      summary: post.summary || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      featured: post.featured || false
    });
    setEditingId(post.id);
    setIsCreating(false);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingCover(true);
      const base64 = await compressImageFile(file, 1200, 0.85);
      setForm(prev => ({ ...prev, coverImage: base64 }));
      showToast('Imagem de capa carregada!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isCreating) {
      addPost(form);
      setIsCreating(false);
    } else if (editingId) {
      updatePost(editingId, form);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Artigos, Guias & Notícias Fiscais</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Publique matérias sobre legislação, estratégias tributárias e comunicados para os clientes.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Novo Artigo</span>
          </button>
        )}
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              {isCreating ? 'Novo Artigo' : 'Editar Artigo'}
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
              <label className="block text-xs font-bold text-slate-300 mb-1">Título da Matéria *</label>
              <input
                type="text"
                required
                placeholder="Ex: Reforma Tributária: Principais Impactos para Prestadores de Serviços"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Categoria</label>
              <input
                type="text"
                placeholder="Ex: Tributário, Trabalhista, Gestão"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Autor</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Data da Publicação</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Foto de Capa do Artigo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {form.coverImage ? (
                <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                  <img src={form.coverImage} alt="Capa" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-20 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0">
                  Sem Foto
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                  <Upload className="w-3.5 h-3.5 text-terracotta-400" />
                  <span>{uploadingCover ? 'Enviando...' : 'Carregar Imagem do Computador'}</span>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
                <input
                  type="url"
                  placeholder="Ou cole a URL da foto"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Resumo Curto *</label>
            <textarea
              rows="2"
              required
              placeholder="Breve resumo exibido nos cards e no compartilhamento do WhatsApp..."
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Conteúdo Completo do Artigo *</label>
            <textarea
              rows="6"
              required
              placeholder="Escreva os parágrafos da matéria completa (separe parágrafos com linha em branco)..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-mono leading-relaxed"
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
              <span>Salvar Artigo</span>
            </button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              {post.coverImage && (
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-terracotta-400">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(post)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir "${post.title}"?`)) {
                          deletePost(post.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-2">{post.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{post.summary}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>{post.date} • {post.author}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
