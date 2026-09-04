import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Headphones
} from 'lucide-react';

export function AmpRadioBar() {
  const {
    isRadioPlaying,
    toggleRadioPlay,
    radioVolume,
    setRadioAudioVolume,
    isRadioMuted,
    toggleRadioMute,
    isRadioExpanded,
    setIsRadioExpanded
  } = useAmp();

  return (
    <div className="fixed bottom-4 left-4 z-40 animate-fadeIn">
      
      {/* Collapsed Pill */}
      {!isRadioExpanded ? (
        <button
          onClick={() => setIsRadioExpanded(true)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
            isRadioPlaying
              ? 'bg-fuchsia-950/90 border-fuchsia-500/60 text-fuchsia-200 shadow-fuchsia-950/60 ring-2 ring-fuchsia-500/30 animate-pulse'
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Abrir Player Rádio Amplificadora"
        >
          <div className="w-6 h-6 rounded-full bg-fuchsia-600 flex items-center justify-center text-white shrink-0">
            {isRadioPlaying ? <Radio className="w-3.5 h-3.5 animate-spin" /> : <Headphones className="w-3.5 h-3.5" />}
          </div>

          <div className="text-left">
            <div className="text-xs font-black leading-none flex items-center gap-1.5">
              <span>Rádio Amplificadora</span>
              {isRadioPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">
              {isRadioPlaying ? 'Tocando Ao Vivo HD' : 'Clique para ouvir'}
            </span>
          </div>

          <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
        </button>
      ) : (
        /* Expanded Floating Audio Dock */
        <div className="w-80 rounded-3xl bg-[#0F0B18]/95 border border-fuchsia-500/40 p-4 shadow-2xl backdrop-blur-2xl text-slate-200 space-y-3">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-fuchsia-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-fuchsia-600 flex items-center justify-center text-white">
                <Radio className={`w-4 h-4 ${isRadioPlaying ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  Rádio Amplificadora
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-fuchsia-500/30 text-fuchsia-300 uppercase">
                    320kbps
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Ativo de Mídia Grupo AMP</p>
              </div>
            </div>

            <button
              onClick={() => setIsRadioExpanded(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Equalizer Visualizer simulation */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-fuchsia-900/30 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[40, 70, 90, 60, 100, 45, 80, 60].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-gradient-to-t from-fuchsia-600 to-cyan-400 transition-all ${
                    isRadioPlaying ? 'animate-pulse' : 'h-1.5 opacity-40'
                  }`}
                  style={{ height: isRadioPlaying ? `${h}%` : '6px', minHeight: '6px', maxHeight: '22px' }}
                ></div>
              ))}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-fuchsia-300 block">Pop & Flashbacks</span>
              <span className="text-[9px] text-slate-500">Transmissão Contínua</span>
            </div>
          </div>

          {/* Controls: Play/Pause & Volume */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={toggleRadioPlay}
              className={`flex-1 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                isRadioPlaying
                  ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/30'
                  : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white'
              }`}
            >
              {isRadioPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Tocar Ao Vivo</span>
                </>
              )}
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleRadioMute}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
              >
                {isRadioMuted || radioVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isRadioMuted ? 0 : radioVolume}
                onChange={(e) => setRadioAudioVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>
          </div>

          {/* Link to web radio */}
          <div className="pt-2 border-t border-fuchsia-900/30 flex justify-between items-center text-[10px]">
            <a
              href="https://amplificadora.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Abrir Web Player Completo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-500">24h Sem Pausas</span>
          </div>

        </div>
      )}

    </div>
  );
}
