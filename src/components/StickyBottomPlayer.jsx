import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, Volume2, VolumeX, Disc, Music, Sparkles, Users, Car, ShieldCheck, WifiOff } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export function StickyBottomPlayer() {
  const {
    config,
    isPlaying,
    isBuffering,
    isReconnecting,
    networkOnline,
    travelMode,
    toggleTravelMode,
    bufferSeconds,
    azuraStats,
    togglePlay,
    activeChannel,
    volume,
    handleVolumeChange,
    isMuted,
    toggleMute,
    setIsRequestOpen
  } = useRadio();
  const currentShow = config.currentShow || {};

  const currentTitle = activeChannel ? activeChannel.title : (currentShow.title || 'Amplificadora Live');
  const currentGenre = activeChannel ? activeChannel.genre : (currentShow.currentTrack || 'Pop Internacional & Clássicos');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C0B14]/95 backdrop-blur-2xl border-t border-pink-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-purple-950/50 shrink-0 border border-pink-500/30 relative">
            <img src={currentShow.cover} alt="Cover" className="w-full h-full object-cover" />
            {isPlaying && (
              <Disc className="w-5 h-5 text-pink-400 absolute inset-0 m-auto animate-spin" style={{ animationDuration: '4s' }} />
            )}
          </div>

          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest truncate">
                {activeChannel ? 'CANAL ATIVO' : 'AMPLIFICADORA ON AIR'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                • {azuraStats.listenersTotal ?? 0} ouvintes
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white truncate">{currentTitle}</h4>
            <p className="text-xs text-slate-400 truncate">{currentGenre}</p>
          </div>
        </div>

        {/* Center Master Controls & Visualizer */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:block">
            <AudioVisualizer isPlaying={isPlaying} barCount={10} color="bg-pink-500" />
          </div>

          <button
            onClick={() => togglePlay()}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 hover:scale-110 transition-all border border-white/20 shrink-0 cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Ouvir Ao Vivo'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Right Volume & Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Volume Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <button onClick={toggleMute} className="text-pink-400 hover:text-white transition-colors cursor-pointer">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Centered Actions Group: Pedir Música + Compact Car ON */}
          <div className="flex items-center gap-2">
            {/* Pedir Música Button */}
            <button
              onClick={() => setIsRequestOpen(true)}
              className="h-8.5 px-4 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Music className="w-3.5 h-3.5 text-pink-400" />
              <span>Pedir Música</span>
            </button>

            {/* Reduced Floating Car ON Button */}
            <button
              onClick={toggleTravelMode}
              className={`h-8.5 px-3 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                travelMode
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/90 shadow-emerald-950/50 ring-1 ring-emerald-500/40'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
              title={travelMode ? `Modo Estrada ON (Cache de ${bufferSeconds}s ativo)` : 'Ativar Modo Estrada'}
            >
              <Car className={`w-3.5 h-3.5 ${travelMode ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
              <span className={`text-[11px] font-black ${travelMode ? 'text-emerald-300' : 'text-slate-400'}`}>
                {travelMode ? 'ON' : 'OFF'}
              </span>
              {travelMode && bufferSeconds > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 text-[9px] font-mono leading-none">
                  {bufferSeconds}s
                </span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
