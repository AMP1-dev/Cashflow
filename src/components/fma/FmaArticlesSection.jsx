import React, { useState } from 'react';
import { Search, Clock, ArrowRight, Tag, Plus } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaArticlesSection({ onSelectArticle }) {
  const { articles, setIsAdminOpen } = useFma();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'Direito à Saúde', 'Direito Bancário', 'Advocacia Cível', 'Direito do Consumidor', 'Direito Imobiliário'];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'Todos' || art.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="artigos" className="py-20 sm:py-28 bg-[#0A0B0E] relative border-t border-fma-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-fma-gold uppercase tracking-wider">
              Acervo Jurídico & Publicações
            </div>
            <h2 className="text-3xl sm:text-4xl font-times font-bold text-white tracking-tight">
              Análises Jurídicas e Decisões Judiciais
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              Guias técnicos, artigos práticos e informativos sobre teses bancárias, liminares médicas e direitos patrimoniais.
            </p>
          </div>

          {/* Actions & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tema ou tese..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white placeholder-zinc-500 text-xs focus:border-fma-gold outline-none transition-colors"
              />
            </div>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2.5 rounded-xl bg-fma-surface hover:bg-zinc-800 border border-fma-border text-fma-gold hover:text-white transition-colors"
              title="Escrever novo artigo (Painel Admin)"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-fma-gold text-black border-fma-gold font-bold shadow-md'
                  : 'bg-fma-card border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-fma-card border border-fma-border text-zinc-500 text-xs">
            Nenhum artigo encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer rounded-2xl bg-fma-card border border-fma-border hover:border-fma-gold/50 p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 text-[11px]">
                    <span className="font-mono text-fma-gold uppercase tracking-wider font-semibold">
                      {art.category}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime || '4 min'}
                    </span>
                  </div>

                  <h3 className="font-times font-bold text-lg sm:text-xl text-white group-hover:text-fma-goldLight transition-colors leading-snug mb-3">
                    {art.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6 font-normal">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Tag className="w-3 h-3 text-zinc-600" />
                    <span>{(art.tags && art.tags[0]) || 'Jurídico'}</span>
                  </div>

                  <span className="text-fma-gold font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
