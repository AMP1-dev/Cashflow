import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  FileText,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react';

export function AmpArticlesSection() {
  const { articles, setReadingArticle } = useAmp();

  return (
    <section id="artigos" className="py-24 bg-[#0A1020] relative overflow-hidden border-t border-slate-800">
      
      {/* Glow */}
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <FileText className="w-3.5 h-3.5" />
            <span>Inteligência & Conteúdo Técnico</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Artigos, Análises & <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Tendências Corporativas</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Publicações estratégicas elaboradas pelo nosso comitê de tecnologia, direito tributário e controladoria sobre o cenário empresarial brasileiro.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setReadingArticle(art)}
              className="group rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Article Cover */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-amber-300 border border-slate-700 backdrop-blur-md">
                    {art.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>Ler Artigo Completo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
