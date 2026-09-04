import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Newspaper, Search, Calendar, User, ArrowRight, MessageCircle, Instagram } from 'lucide-react';

export function PostsSection() {
  const { posts, setReadingPost, showToast, siteConfig } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(posts.map(p => p.category).filter(Boolean))];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'Todas' || post.category === selectedCategory;
    const matchesSearch = searchTerm.trim() === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleQuickWhatsAppShare = (e, post) => {
    e.stopPropagation();
    const url = window.location.origin ? `${window.location.origin}/#noticias` : 'https://projetojoaodebarro.org.br';
    const text = encodeURIComponent(`*${post.title}*\n\n${post.summary || ''}\n\nConfira no Projeto João de Barro:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleQuickInstagramShare = (e, post) => {
    e.stopPropagation();
    const url = window.location.origin ? `${window.location.origin}/#noticias` : 'https://projetojoaodebarro.org.br';
    navigator.clipboard.writeText(`${post.title}\n\nConfira no Projeto João de Barro: ${url}`);
    showToast('Link copiado! Abrindo o Instagram...');
    const instaUrl = siteConfig.social?.instagram || 'https://instagram.com';
    setTimeout(() => {
      window.open(instaUrl, '_blank');
    }, 500);
  };

  return (
    <section id="noticias" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Mural de Notícias & Acontecimentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Acompanhe o Nosso Dia a Dia
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Publicações sobre nossos festivais, oficinas lúdicas, prestação de contas, parcerias públicas e campanhas solidárias.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar notícia ou evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-gray-50 border border-dashed border-gray-200">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">Nenhuma postagem encontrada</h3>
            <p className="text-xs text-gray-500 mt-1">Tente buscar por outros termos ou selecionar outra categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setReadingPost(post)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Post Image with Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm text-terracotta-700 shadow-sm">
                        {post.category || 'Geral'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                        {formatDate(post.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author || 'Diretoria'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-terracotta-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {post.summary || post.content}
                    </p>
                  </div>
                </div>

                {/* Card Footer CTA & Quick Share */}
                <div className="px-6 pb-6 pt-0">
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-terracotta-600 group-hover:text-terracotta-700">
                      <span>Ler matéria</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleQuickWhatsAppShare(e, post)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all hover:scale-110 flex items-center gap-1 text-xs font-bold"
                        title="Compartilhar no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickInstagramShare(e, post)}
                        className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all hover:scale-110 flex items-center gap-1 text-xs font-bold"
                        title="Compartilhar no Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
