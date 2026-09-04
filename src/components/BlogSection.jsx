import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Newspaper, Search, Calendar, User, ArrowRight, MessageCircle, Instagram, Share2, BookOpen } from 'lucide-react';

export function BlogSection() {
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

  const handleQuickWhatsApp = (e, post) => {
    e.stopPropagation();
    const url = window.location.origin ? `${window.location.origin}/#artigos` : 'https://aliancaempresarial.net.br';
    const text = encodeURIComponent(`*${post.title}*\n\n${post.summary || ''}\n\nConfira o artigo completo na Aliança Empresarial:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleQuickInstagram = (e, post) => {
    e.stopPropagation();
    const url = window.location.origin ? `${window.location.origin}/#artigos` : 'https://aliancaempresarial.net.br';
    navigator.clipboard.writeText(`${post.title}\n\nLeia mais: ${url}`);
    showToast('Link copiado! Abrindo o Instagram...');
    const instaUrl = siteConfig.social?.instagram || 'https://instagram.com';
    setTimeout(() => window.open(instaUrl, '_blank'), 500);
  };

  return (
    <section id="artigos" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Inteligência Empresarial & Legislação</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Artigos, Guias Fiscais & Novidades
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Mantenha sua empresa informada sobre alterações tributárias, estratégias de BPO financeiro e gestão societária.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar artigo ou tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 shadow-sm transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setReadingPost(post)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 backdrop-blur-sm text-white shadow-sm">
                      {post.category || 'Tributário'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-terracotta-600" />
                      {formatDate(post.date)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.author || 'Aliança'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-terracotta-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {post.summary || post.content}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-terracotta-600 group-hover:text-terracotta-700">
                    <span>Ler artigo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleQuickWhatsApp(e, post)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all hover:scale-110"
                      title="Compartilhar no WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickInstagram(e, post)}
                      className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all hover:scale-110"
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

      </div>
    </section>
  );
}
