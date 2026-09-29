import React from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  Share2,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

export function PublicationsSection() {
  const {
    publications,
    activeCategory,
    setActiveCategory,
    setSharePublication,
    selectedPublication,
    setSelectedPublication
  } = usePalmeirense();

  const categories = ['Todas', 'Bailes & Shows', 'Esportes', 'Institucional', 'Escolinhas & Família', 'Melhorias'];

  const filtered = activeCategory === 'Todas'
    ? publications
    : publications.filter(p => p.category === activeCategory);

  return (
    <section id="publicacoes" className="relative py-28 bg-[#09090D] text-white overflow-hidden">
      {/* Background Temático Ofuscado (Mural de Notícias & Celebrações) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80"
          alt="Publicações ECP"
          className="w-full h-full object-cover filter contrast-125 opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080C] via-[#09090D]/95 to-[#0B0B0F]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-red-600/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 border border-red-600/40">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Mural de Notícias & Redes Sociais</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-syne uppercase tracking-tight text-white">
              Publicações Oficiais do ECP
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              Avisos da diretoria, resultados dos torneios e preparativos para os grandes bailes. Compartilhe com seus amigos no WhatsApp, Facebook e Instagram!
            </p>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,25,34,0.5)] border border-red-500/50'
                    : 'bg-[#161622] text-zinc-400 hover:text-white hover:bg-[#1E1E2C] border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Cards de Publicações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pub) => (
            <article
              key={pub.id}
              id={`publicacao-${pub.id}`}
              className="bg-[#12121A]/95 rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(229,25,34,0.15)] border border-white/10 hover:border-red-600/50 transition-all duration-300 flex flex-col group backdrop-blur-md"
            >
              {/* Imagem de Capa com Zoom */}
              <div className="relative h-60 overflow-hidden bg-zinc-900">
                <img
                  src={pub.imageUrl}
                  alt={pub.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-600 text-white shadow-md font-mono">
                    {pub.category}
                  </span>
                </div>
              </div>

              {/* Conteúdo Textual */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      <span>{pub.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{pub.author}</span>
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black text-white font-syne uppercase group-hover:text-red-300 transition-colors line-clamp-2 leading-snug mb-3">
                    {pub.title}
                  </h3>

                  <p className="text-zinc-400 text-xs md:text-sm line-clamp-3 leading-relaxed mb-4">
                    {pub.summary}
                  </p>
                </div>

                {/* Botões do Rodapé do Card */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedPublication(pub)}
                    className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 font-extrabold text-xs uppercase tracking-wider group-hover:underline"
                  >
                    <span>Ler Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSharePublication(pub)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-black text-xs uppercase tracking-wider transition-colors border border-red-700/50 shadow-sm"
                    title="Compartilhar no WhatsApp, Face, Insta..."
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal de Leitura Completa */}
      {selectedPublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#12121A] text-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/15 max-h-[92vh] flex flex-col">
            {/* Header com Imagem */}
            <div className="relative h-64 sm:h-72 bg-zinc-950 flex-shrink-0">
              <img
                src={selectedPublication.imageUrl}
                alt={selectedPublication.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-black/40 to-transparent" />
              
              <button
                onClick={() => setSelectedPublication(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-600 text-white mb-2 inline-block font-mono">
                  {selectedPublication.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-syne uppercase leading-tight">
                  {selectedPublication.title}
                </h2>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-red-500" />
                  Publicado em: {selectedPublication.date}
                </span>
                <span>Por: {selectedPublication.author}</span>
              </div>

              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedPublication.content}
              </div>
            </div>

            {/* Footer com Compartilhamento */}
            <div className="p-4 bg-[#0A0A0E] border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">
                Gostou desta notícia? Compartilhe nas suas redes!
              </span>

              <button
                onClick={() => {
                  const p = selectedPublication;
                  setSelectedPublication(null);
                  setSharePublication(p);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(229,25,34,0.4)] transition-colors border border-red-500/50"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
