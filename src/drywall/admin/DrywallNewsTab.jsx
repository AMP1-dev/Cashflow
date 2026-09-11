import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallNewsTab() {
  const { news, addNews, updateNews, deleteNews, showToast } = useDrywall();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    title: '',
    source: 'Associação Brasileira do Drywall',
    url: 'https://drywall.org.br',
    date: 'Manual Técnico',
    summary: '',
    tag: 'Normas Técnicas'
  });

  const openNewModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      source: 'Associação Brasileira do Drywall',
      url: 'https://drywall.org.br',
      date: 'Referência Oficial',
      summary: '',
      tag: 'Normas Técnicas'
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      source: item.source || '',
      url: item.url || '',
      date: item.date || '',
      summary: item.summary || '',
      tag: item.tag || 'Geral'
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.summary) {
      showToast('Título e resumo são obrigatórios.', 'warning');
      return;
    }

    if (editingItem) {
      updateNews(editingItem.id, form);
    } else {
      addNews(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Notícias Técnicas, Normas ABNT & Vantagens do Drywall
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gerencie os artigos, guias de engenharia e referências oficiais que enriquecem o portal público, fornecendo credibilidade para arquitetos, engenheiros e gesseiros.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Total de guias e notícias publicadas: <strong className="text-white">{news.length}</strong>
        </p>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Guia / Notícia</span>
        </button>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-400 text-[11px] font-bold">
                  {item.tag}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.date}
                </span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">
                {item.title}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <span>Fonte:</span>
                <strong className="text-slate-300 font-medium">{item.source}</strong>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Acessar Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="Editar Notícia"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Excluir "${item.title}"?`)) {
                      deleteNews(item.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="Excluir Notícia"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Add/Edit News */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingItem ? 'Editar Guia / Notícia' : 'Publicar Novo Guia Técnico'}
                  </h3>
                  <p className="text-xs text-slate-400">Conteúdo educativo e normas técnicas</p>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Título do Guia / Artigo *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Manual Técnico Oficial: Normas ABNT NBR 14715"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Fonte / Autor</label>
                  <input
                    type="text"
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    placeholder="Ex: Associação Brasileira do Drywall"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tag / Categoria</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="Normas Técnicas, Acústica..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Data / Indicador</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Ex: Referência Oficial, Julho 2026..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Link Externo / URL</label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resumo / Conteúdo *</label>
                <textarea
                  rows="3"
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Explicação resumida das vantagens ou detalhes normativos..."
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
                  {editingItem ? 'Salvar Alterações' : 'Publicar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
