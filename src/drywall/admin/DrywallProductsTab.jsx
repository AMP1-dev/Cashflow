import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Tag, 
  Image as ImageIcon, 
  Layers, 
  Check, 
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

const PRESET_IMAGES = [
  { label: 'Placa Standard (ST)', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Placa Úmida (RU Verde)', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Perfis Galvanizados Z275', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
  { label: 'Canaletas F530 & Tabicas', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Lã de Vidro Acústica', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Massas e Insumos', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80' }
];

export function DrywallProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useDrywall();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: 'Placas',
    specs: '',
    unit: 'Chapa',
    badge: 'Destaque',
    image: PRESET_IMAGES[0].url
  });

  const categories = ['all', 'Placas', 'Estruturas', 'Forros', 'Isolamento', 'Insumos'];

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      p.title?.toLowerCase().includes(term) ||
      p.subtitle?.toLowerCase().includes(term) ||
      p.specs?.toLowerCase().includes(term) ||
      p.badge?.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  const openNewModal = () => {
    setEditingProduct(null);
    setForm({
      title: '',
      subtitle: '',
      category: 'Placas',
      specs: '',
      unit: 'Chapa',
      badge: 'Destaque Distribuidora',
      image: PRESET_IMAGES[0].url
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title || '',
      subtitle: product.subtitle || '',
      category: product.category || 'Placas',
      specs: product.specs || '',
      unit: product.unit || 'Chapa',
      badge: product.badge || '',
      image: product.image || PRESET_IMAGES[0].url
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) {
      showToast('O título do produto é obrigatório.', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Toolbar */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produto por nome, especificações ou categoria..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052D9]"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/80 text-xs overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat ? 'bg-[#0052D9] text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          {/* New Product CTA */}
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Produto</span>
          </button>
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800/40 border border-slate-700/60 hover:border-slate-600/80 rounded-2xl overflow-hidden flex flex-col transition-all group"
          >
            {/* Image Preview Container */}
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[11px] font-bold shadow-md">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-2 py-1 rounded-lg bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Unit Tag */}
              <div className="absolute bottom-3 right-3">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-semibold">
                  Unidade: <strong className="text-white">{product.unit}</strong>
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {product.subtitle}
                  </p>
                )}
                {product.specs && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-blue-300 bg-blue-950/40 border border-blue-800/40 px-2.5 py-1 rounded-lg">
                    <span dangerouslySetInnerHTML={{ __html: product.specs }} />
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <span className="text-[11px] text-slate-500 font-mono">
                  ID: {product.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Editar Produto"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${product.title}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Excluir Produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingProduct ? 'Editar Produto do Catálogo' : 'Novo Produto Essencial'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aparece na vitrine pública e no seletor de cotações
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Título do Produto *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Placa Drywall Standard ST 12.5mm"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subtítulo / Descrição Rápida</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Ex: Uso geral para paredes divisórias e forros em áreas secas"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  >
                    <option value="Placas">Placas</option>
                    <option value="Estruturas">Estruturas</option>
                    <option value="Forros">Forros</option>
                    <option value="Isolamento">Isolamento</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unidade de Venda</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="Chapa, Barra, Rolo..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Selo / Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Mais Vendido, Acústico..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Especificações Técnicas</label>
                <input
                  type="text"
                  value={form.specs}
                  onChange={(e) => setForm({ ...form, specs: e.target.value })}
                  placeholder="Ex: 1,20m x 1,80m / 2,40m &bull; 12.5mm"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none font-mono"
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">URL da Imagem do Produto</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none mb-2"
                />
                
                {/* Presets */}
                <p className="text-[11px] text-slate-400 mb-2">Ou selecione uma foto padrão do banco:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, image: preset.url })}
                      className={`relative rounded-lg overflow-hidden border transition-all h-14 ${
                        form.image === preset.url ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
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
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
