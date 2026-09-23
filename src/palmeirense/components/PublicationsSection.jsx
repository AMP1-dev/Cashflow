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
    <section id="publicacoes" className="relative py-24 bg-[#131522] text-white overflow-hidden">
      {/* Background Temático Translúcido (Mural & Vida no Clube com visibilidade nítida) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80"
          alt="Publicações ECP"
          className="w-full h-full object-cover filter contrast-110 brightness-110 opacity-45"
        />
        {/* Overlay translúcido suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f111b]/80 via-[#131522]/65 to-[#10121d]/85" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 rounded-full bg-red-600/15 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 border border-red-600/30">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Mural de Notícias & Redes Sociais</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white">
              Publicações Oficiais do ECP
            </h2>
            <p className="text-zinc-300 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              Avisos da diretoria, resultados dos torneios e preparativos para os grandes bailes. Compartilhe diretamente com seus amigos e redes!
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((pub) => (
            <article
              key={pub.id}
              id={`publicacao-${pub.id}`}
              className="bg-[#13141B]/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/10 hover:border-red-500/40 transition-all duration-300 flex flex-col group backdrop-blur-md"
            >
              {/* Imagem de Capa com Zoom e Altura Equilibrada */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src={pub.imageUrl}
                  alt={pub.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13141B] via-black/20 to-transparent" />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-md">
                    {pub.category}
                  </span>
                </div>
              </div>

              {/* Conteúdo Textual com Tipografia Equilibrada */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-400 mb-2.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      <span>{pub.date}</span>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{pub.author}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-outfit uppercase tracking-tight group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {pub.title}
                  </h3>

                  <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed mb-4">
                    {pub.summary}
                  </p>
                </div>

                {/* Botões do Rodapé do Card */}
                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPublication(pub)}
                    className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Ler notícia</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSharePublication(pub)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs uppercase tracking-wider transition-colors border border-red-800/40"
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
