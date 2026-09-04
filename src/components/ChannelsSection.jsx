import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, Sparkles, Moon, Sun, Disc } from 'lucide-react';

export function ChannelsSection() {
  const { channels, activeChannel, isPlaying, togglePlay } = useRadio();

  return (
    <section id="canais" className="py-16 bg-[#0A0910] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-black uppercase tracking-wider mb-2 border border-pink-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canais & Estilos Sonoros</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            A Sua Trilha Sonora do Dia à Noite
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Pop Internacional e Adult Contemporary durante o dia (Alpha & Melody FM) e energia de Tomorrowland a partir das 22h.
          </p>
        </div>

        {/* 2 Big Featured Channels (Daytime Hits vs Nightlife Tomorrowland) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {channels.slice(0, 2).map((ch, idx) => {
            const isThisChannelActive = activeChannel?.id === ch.id && isPlaying;
            const isNight = idx === 1;

            return (
              <div
                key={ch.id}
                onClick={() => togglePlay(ch.streamUrl, ch)}
                className="relative h-52 sm:h-60 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300"
              >
                <img
                  src={ch.cover}
                  alt={ch.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-r ${ch.color} opacity-80 mix-blend-multiply group-hover:opacity-70 transition-opacity`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                      {isNight ? <Moon className="w-3 h-3 text-purple-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                      <span>{ch.badge}</span>
                    </span>
                    <span className="text-xs font-bold text-pink-300">{ch.genre}</span>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-pink-300 transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1">{ch.desc}</p>
                    </div>

                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black font-black text-xs tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-1.5 shrink-0 border border-white/30"
                    >
                      {isThisChannelActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isThisChannelActive ? 'PAUSAR' : 'OUVIR'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {channels.slice(2).map((ch) => {
            const isThisChannelActive = activeChannel?.id === ch.id && isPlaying;

            return (
              <div
                key={ch.id}
                onClick={() => togglePlay(ch.streamUrl, ch)}
                className="relative h-44 rounded-3xl overflow-hidden cursor-pointer group shadow-xl border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <img
                  src={ch.cover}
                  alt={ch.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-70"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${ch.color} opacity-75 mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md text-white border border-white/20">
                      ● {ch.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-300">{ch.genre}</span>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black text-white">{ch.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{ch.desc}</p>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black font-black text-xs tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-1.5 shrink-0"
                    >
                      {isThisChannelActive ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{isThisChannelActive ? 'PAUSAR' : 'OUVIR'}</span>
                    </button>
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
