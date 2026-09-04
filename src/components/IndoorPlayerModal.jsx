import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Radio, Sparkles, Building2, Store, Clock, ShieldCheck, Waves } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export function IndoorPlayerModal() {
  const { isIndoorModalOpen, setIsIndoorModalOpen, selectedB2BClient, setSelectedB2BClient, showToast } = useRadio();
  const [isPlayingIndoor, setIsPlayingIndoor] = useState(false);
  const [indoorVolume, setIndoorVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [indoorAudio, setIndoorAudio] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isIndoorModalOpen || !selectedB2BClient) {
      if (indoorAudio) {
        indoorAudio.pause();
        indoorAudio.src = '';
      }
      setIsPlayingIndoor(false);
      return;
    }

    const audio = new Audio(selectedB2BClient.streamUrl || 'https://ice1.somafm.com/groovesalad-128-mp3');
    audio.volume = indoorVolume;
    setIndoorAudio(audio);

    audio.play().then(() => {
      setIsPlayingIndoor(true);
    }).catch((e) => {
      console.log('Indoor audio play error:', e);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isIndoorModalOpen, selectedB2BClient]);

  if (!isIndoorModalOpen || !selectedB2BClient) return null;

  const toggleIndoorPlay = () => {
    if (!indoorAudio) return;
    if (isPlayingIndoor) {
      indoorAudio.pause();
      setIsPlayingIndoor(false);
    } else {
      indoorAudio.play().then(() => setIsPlayingIndoor(true)).catch(console.error);
    }
  };

  const handleVolumeChange = (vol) => {
    setIndoorVolume(vol);
    if (indoorAudio) indoorAudio.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const handleClose = () => {
    if (indoorAudio) {
      indoorAudio.pause();
      indoorAudio.src = '';
    }
    setIsIndoorModalOpen(false);
    setSelectedB2BClient(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#13111C] via-[#0E0C17] to-[#181329] border-2 border-emerald-500/40 text-white rounded-3xl shadow-[0_0_80px_rgba(16,185,129,0.25)] p-6 sm:p-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2.5 rounded-full text-slate-300 hover:text-white bg-black/60 hover:bg-rose-600 transition-all z-20 border border-white/15"
          title="Fechar Modo Indoor"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Indoor Badge */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rádio Indoor Corporativa Ativa</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Ambiente 100% Livre de Concorrentes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white transition-all text-xs"
              title="Modo Tela Cheia para a Loja"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Store Hero Display */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Store Logo / Artwork */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden bg-emerald-950/40 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/20 group">
              <img
                src={selectedB2BClient.logo || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'}
                alt={selectedB2BClient.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  {selectedB2BClient.segment}
                </span>
              </div>
            </div>
          </div>

          {/* Store Stream Information & Visualizer */}
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Store className="w-3.5 h-3.5" />
              <span>{selectedB2BClient.location || 'Brasil'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {selectedB2BClient.name}
            </h2>

            <p className="text-sm text-emerald-300 font-medium italic">
              "{selectedB2BClient.slogan || 'Programação musical sob medida e comunicação interna da sua marca.'}"
            </p>

            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Estilo Sonoro Programado</span>
                <span className="text-sm font-bold text-white">{selectedB2BClient.genre}</span>
              </div>
              <AudioVisualizer isPlaying={isPlayingIndoor} barCount={10} color="bg-emerald-400" />
            </div>

            {/* In-store Commercial Notice */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-300 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Spots institucionais e ofertas da loja programados para veiculação a cada 15 minutos.</span>
            </div>
          </div>

        </div>

        {/* Master Bottom Audio Controls */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleIndoorPlay}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/40 transition-all"
            >
              {isPlayingIndoor ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
              <span>{isPlayingIndoor ? 'PAUSAR AMBIENTE' : 'TRANSMITIR NA LOJA'}</span>
            </button>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/60 border border-white/15">
              <button onClick={() => handleVolumeChange(isMuted ? 0.85 : 0)} className="text-emerald-400">
                {isMuted || indoorVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : indoorVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center sm:text-right">
            Tecnologia <strong>Amplificadora Indoor</strong> • Stream Contínuo 24 Horas
          </p>
        </div>

      </div>
    </div>
  );
}
