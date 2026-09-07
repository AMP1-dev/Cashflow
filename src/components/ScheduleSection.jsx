import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { Calendar, Clock, Radio, Play, Pause, Sparkles, Music, Share2, Check, RadioTower, Volume2 } from 'lucide-react';

export function ScheduleSection() {
  const { schedule, timeSchedule, currentSlot, isPlaying, playSlot, togglePlay, showToast } = useRadio();
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const [activeDay, setActiveDay] = useState('Segunda');
  const [copiedId, setCopiedId] = useState(null);

  const filteredSchedule = (schedule || []).filter(s => {
    if (!s.day) return true;
    if (s.day === 'Segunda a Domingo' || s.day === 'Todos os dias' || s.day === 'Diário') return true;
    return s.day.toLowerCase().includes(activeDay.toLowerCase());
  });

  const getMatchingSlot = (item) => {
    if (!timeSchedule || timeSchedule.length === 0) return null;
    if (item.slotId) {
      const byId = timeSchedule.find(s => s.id === item.slotId);
      if (byId) return byId;
    }
    const timeMatch = item.time?.match(/^(\d{2}):/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      const byHour = timeSchedule.find(s => s.startHour === hour);
      if (byHour) return byHour;
    }
    const byTitle = timeSchedule.find(s => 
      s.title.toLowerCase().includes(item.show.toLowerCase().slice(0, 8)) ||
      item.show.toLowerCase().includes(s.title.toLowerCase().slice(0, 8))
    );
    return byTitle || null;
  };

  const handleShare = async (item, matchedSlot) => {
    const slotId = item.slotId || matchedSlot?.id || 'slot-1';
    const shareUrl = `https://amplificadora.com.br/?slot=${slotId}&play=1`;
    const shareData = {
      title: `${item.show} • Rádio Amplificadora`,
      text: `Ouça ao vivo ${item.show} na Rádio Amplificadora:`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Compartilhado com sucesso!');
        return;
      } catch (err) {
        // Fallback to clipboard if share dialog was cancelled or unsupported
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedId(item.id || item.time);
        showToast(`Link do bloco copiado! Pronto para ouvir no site.`);
        setTimeout(() => setCopiedId(null), 3000);
      } catch {
        showToast(`Link de reprodução: ${shareUrl}`);
      }
    }
  };

  const handleTune = (matchedSlot) => {
    if (matchedSlot) {
      playSlot(matchedSlot);
    } else {
      togglePlay();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="grade" className="py-20 bg-[#0A0910] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-wider mb-3 border border-purple-500/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>Grade Oficial & Programação 24 Horas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Programação Semanal Amplificadora
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
            Acompanhe os horários dos programas, sets ao vivo, sessões underground na madrugada e sintonize ou compartilhe cada bloco com 1 clique.
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                activeDay === day
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="max-w-4xl mx-auto bg-[#131120] border border-white/5 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-bold">
              Programação contínua AutoDJ Amplificadora Mainstage 24/7.
            </div>
          ) : (
            filteredSchedule.map((item, idx) => {
              const matchedSlot = getMatchingSlot(item);
              const isLiveNow = currentSlot?.id === (item.slotId || matchedSlot?.id);
              const isCardPlaying = isLiveNow && isPlaying;
              const isCopied = copiedId === (item.id || item.time);

              return (
                <div
                  key={item.id || idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isLiveNow
                      ? 'bg-[#18132A] border-pink-500/60 shadow-[0_0_30px_rgba(236,72,153,0.2)]'
                      : 'bg-black/30 border-white/5 hover:border-pink-500/30 hover:bg-black/50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Visual Cover Thumbnail if slot exists */}
                    {matchedSlot?.cover && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                        <img src={matchedSlot.cover} alt={item.show} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {isLiveNow && (
                          <div className="absolute inset-0 bg-pink-600/20 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold shrink-0 flex items-center gap-1.5 ${
                          isLiveNow
                            ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </div>

                        {isLiveNow && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            NO AR
                          </span>
                        )}

                        <span className="text-[11px] text-pink-400 font-medium truncate hidden md:inline">
                          {item.genre}
                        </span>
                      </div>

                      <h4 className={`text-sm sm:text-base font-extrabold truncate transition-colors ${
                        isLiveNow ? 'text-pink-200' : 'text-white group-hover:text-pink-300'
                      }`}>
                        {item.show}
                      </h4>

                      <p className="text-xs text-slate-400 truncate">
                        Apresentado por <span className="text-slate-200 font-bold">{item.host}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Sintonizar / Ouvir & Compartilhar */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto justify-end">
                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShare(item, matchedSlot)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border-white/10'
                      }`}
                      title="Compartilhar link com reprodução direta"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span className="text-xs">{isCopied ? 'Copiado!' : 'Compartilhar'}</span>
                    </button>

                    {/* Play / Listen Button */}
                    <button
                      type="button"
                      onClick={() => handleTune(matchedSlot)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isCardPlaying
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                          : 'bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 hover:border-pink-600'
                      }`}
                      title="Ouvir este bloco ao vivo"
                    >
                      {isCardPlaying ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          <span>Tocando</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Ouvir Bloco</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}

