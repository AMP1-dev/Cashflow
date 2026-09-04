import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Sparkles, Calendar, ArrowRight, Heart, Share2, Flame } from 'lucide-react';

export function ArticlesSection() {
  const { articles, setReadingArticle } = useRadio();

  return (
    <section id="noticias" className="py-20 bg-[#0A0910] text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-black uppercase tracking-wider mb-3 border border-pink-500/20">
              <Flame className="w-3.5 h-3.5" />
              <span>Tomorrowland & Festival Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Notícias & Bastidores da Cena Eletrônica
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Cobertura exclusiva dos maiores palcos, lançamentos de faixas e entrevistas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => setReadingArticle(art)}
              className="bg-[#131120] rounded-3xl overflow-hidden border border-white/5 hover:border-pink-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-purple-950/40">
                  <img
                    src={art.cover}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-600 text-white shadow-md">
                      {art.category || 'Festivais'}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span>{art.author || 'Amplificadora'}</span>
                  </div>

                  <h3 className="text-xl font-black text-white leading-snug group-hover:text-pink-300 transition-colors mb-3">
                    {art.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {art.summary || art.content}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300">
                  <span>Ler história completa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
