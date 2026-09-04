import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, Clock, Sparkles, Tv, Video, Headphones, ArrowRight } from 'lucide-react';

export function ShowsSection() {
  const { shows, openShowVideo } = useRadio();

  const handleOpenVideo = (e, show) => {
    e.stopPropagation();
    openShowVideo(show);
  };

  return (
    <section id="shows" className="py-20 bg-[#0E0D17] text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Tomorrowland / Live Concerts Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-black uppercase tracking-wider mb-3 border border-pink-500/20">
              <Tv className="w-3.5 h-3.5" />
              <span>Transmissões & Shows em Vídeo 4K</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Shows & Concertos Históricos em Vídeo
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Assista aos maiores concertos e sets em ultra definição direto na plataforma sob demanda.
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.querySelector('#grade');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-extrabold text-xs tracking-wider uppercase backdrop-blur-md transition-all border border-white/20 self-start md:self-auto"
          >
            <span>Ver Grade Semanal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shows.map((show) => {
            return (
              <div
                key={show.id}
                onClick={() => openShowVideo(show)}
                className="bg-[#151322] rounded-3xl overflow-hidden border border-white/5 hover:border-pink-500/50 shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Artwork Container */}
                  <div className="relative aspect-[4/4] overflow-hidden bg-purple-950/40">
                    <img
                      src={show.cover}
                      alt={show.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                    />

                    {/* Top Duration Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/70 backdrop-blur-md text-white border border-white/15 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-pink-400" />
                        <span>{show.duration || '01:00:00'}</span>
                      </span>
                      <span className="px-2 py-1 rounded-full text-[9px] font-black bg-pink-600/90 text-white uppercase tracking-wider">
                        VÍDEO 4K
                      </span>
                    </div>

                    {/* Bottom Play Circle Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenVideo(e, show)}
                      className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-pink-600/50 group-hover:scale-110 transition-all border border-white/25"
                      title="Assistir Show em Vídeo"
                    >
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </button>
                  </div>

                  {/* Show Details */}
                  <div className="p-5">
                    <span className="text-[11px] font-bold text-pink-400 block mb-1">
                      {show.host}
                    </span>
                    <h3 className="text-base font-black text-white leading-snug group-hover:text-pink-300 transition-colors line-clamp-2">
                      {show.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {show.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{show.date}</span>
                    <span className="text-pink-400 font-bold group-hover:underline flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5" />
                      <span>Assistir Show</span>
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
