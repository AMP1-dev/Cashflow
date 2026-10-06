import React, { useState, useEffect, useRef } from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Radio, Sparkles, Building2, Store, Clock, ShieldCheck, Waves, Download, Sun, Moon, Volume1, BellRing, ExternalLink, Smartphone } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

const THEME_STYLES = {
  emerald: {
    accent: '#10B981',
    border: 'border-emerald-500/40',
    bgBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    bgButton: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-600/30',
    glow: 'shadow-[0_0_80px_rgba(16,185,129,0.25)]',
    text: 'text-emerald-400',
    barColor: '#10B981'
  },
  amber: {
    accent: '#F59E0B',
    border: 'border-amber-500/40',
    bgBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    bgButton: 'bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-500 hover:to-yellow-600 shadow-amber-600/30',
    glow: 'shadow-[0_0_80px_rgba(245,158,11,0.25)]',
    text: 'text-amber-400',
    barColor: '#F59E0B'
  },
  cyan: {
    accent: '#06B6D4',
    border: 'border-cyan-500/40',
    bgBadge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    bgButton: 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-cyan-600/30',
    glow: 'shadow-[0_0_80px_rgba(6,182,212,0.25)]',
    text: 'text-cyan-400',
    barColor: '#06B6D4'
  },
  rose: {
    accent: '#F43F5E',
    border: 'border-rose-500/40',
    bgBadge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    bgButton: 'bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 shadow-rose-600/30',
    glow: 'shadow-[0_0_80px_rgba(244,63,94,0.25)]',
    text: 'text-rose-400',
    barColor: '#F43F5E'
  },
  violet: {
    accent: '#A855F7',
    border: 'border-purple-500/40',
    bgBadge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    bgButton: 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 shadow-purple-600/30',
    glow: 'shadow-[0_0_80px_rgba(168,85,247,0.25)]',
    text: 'text-purple-400',
    barColor: '#A855F7'
  },
  red: {
    accent: '#EF4444',
    border: 'border-red-500/40',
    bgBadge: 'bg-red-500/20 text-red-400 border-red-500/30',
    bgButton: 'bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-500 hover:to-orange-600 shadow-red-600/30',
    glow: 'shadow-[0_0_80px_rgba(239,68,68,0.25)]',
    text: 'text-red-400',
    barColor: '#EF4444'
  }
};

export function IndoorStandaloneApp({ clientSlug }) {
  const { b2bClients, showToast } = useRadio();

  // Find client by slug, id or fallback to first
  const targetSlug = (clientSlug || '').toLowerCase().trim();
  const client = (b2bClients || []).find(c =>
    (targetSlug && c.slug && c.slug.toLowerCase() === targetSlug) ||
    (targetSlug && c.id && c.id.toLowerCase() === targetSlug) ||
    (targetSlug && c.name && c.name.toLowerCase().includes(targetSlug))
  ) || b2bClients?.[0] || {
    name: "Sua Empresa",
    segment: "Restaurante & Cafeteria",
    genre: "Bossa & Acoustic Lounge",
    streamUrl: "https://ice1.somafm.com/groovesalad-128-mp3",
    slogan: "A trilha sonora sob medida para o seu negócio",
    logo: "/favicon-amplificadora.jpg",
    spotsCount: 4,
    themeColor: "emerald"
  };

  const theme = THEME_STYLES[client.themeColor || 'emerald'] || THEME_STYLES.emerald;

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [activeSpotPlaying, setActiveSpotPlaying] = useState(null);

  const audioRef = useRef(null);
  const spotAudioRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set document title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${client.name} • Rádio Indoor Oficial`;
    }
  }, [client]);

  // Audio setup
  useEffect(() => {
    const audio = new Audio(client.streamUrl || 'https://ice1.somafm.com/groovesalad-128-mp3');
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Check url auto-play param
    const params = new URLSearchParams(window.location.search);
    if (params.get('play') === '1' || params.get('autoplay') === '1') {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [client.streamUrl]);

  // Screen Wake Lock API (keeps tablet screen from dimming/sleeping)
  const toggleWakeLock = async () => {
    if ('wakeLock' in navigator) {
      if (!wakeLockActive) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setWakeLockActive(true);
          showToast('Tela Mantida Ativa: O tablet não apagará durante a operação!');
          wakeLockRef.current.addEventListener('release', () => {
            setWakeLockActive(false);
          });
        } catch (e) {
          console.log('WakeLock error:', e);
        }
      } else {
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
        setWakeLockActive(false);
      }
    } else {
      showToast('Seu navegador não suporta a API de tela ativa.', 'info');
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    }
  };

  const handleVolume = (newVol) => {
    const val = parseFloat(newVol);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      if (audioRef.current) audioRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Trigger custom spot / advertisement immediately
  const playSpot = (spot) => {
    if (!spot || !spot.url) return;
    setActiveSpotPlaying(spot.title);
    showToast(`📢 Transmitindo anúncio: ${spot.title}`);

    // Lower background music
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
    }

    const spotAudio = new Audio(spot.url);
    spotAudio.volume = volume;
    spotAudioRef.current = spotAudio;

    spotAudio.play().then(() => {
      spotAudio.onended = () => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
        }
        setActiveSpotPlaying(null);
        showToast('Anúncio finalizado. Retomando música ambiente...');
      };
    }).catch(() => {
      if (audioRef.current) audioRef.current.volume = volume;
      setActiveSpotPlaying(null);
    });
  };

  return (
    <div className="min-h-screen bg-[#09080F] text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Top Header Bar */}
      <header className="flex items-center justify-between gap-4 pb-6 border-b border-white/10 flex-wrap">
        <div className="flex items-center gap-4">
          <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-black/60 border ${theme.border} p-1 shadow-lg shrink-0`}>
            <img src={client.logo} alt={client.name} className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {client.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${theme.bgBadge}`}>
                ● RÁDIO INDOOR OFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{client.segment}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{client.genre}</span>
            </p>
          </div>
        </div>

        {/* Status Badges & Quick Tools */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300 flex items-center gap-2 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">{currentTime}</span>
          </div>

          <button
            type="button"
            onClick={toggleWakeLock}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              wakeLockActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Mantém a tela acesa sem apagar o tablet"
          >
            <Sun className={`w-3.5 h-3.5 ${wakeLockActive ? 'text-amber-400 animate-spin' : ''}`} />
            <span className="hidden sm:inline">{wakeLockActive ? 'Tela Sempre Acesa ON' : 'Manter Tela Acesa'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Center Console */}
      <main className="my-auto py-8 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center space-y-8">
        
        {/* Soundwave Visualizer in Chosen Theme Color */}
        <div className="w-full max-w-lg px-4 flex flex-col items-center">
          <div className={`p-6 rounded-3xl bg-black/40 border border-white/10 ${theme.glow} w-full`}>
            <AudioVisualizer isPlaying={isPlaying} barColor={theme.barColor} height={50} barCount={40} />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {isPlaying ? 'Transmissão Ao Vivo em 320k HD' : 'Transmissão Pausada'}
            </span>
          </div>
        </div>

        {/* Main Station Info */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {client.slogan || 'O Som Que Valoriza a Sua Marca'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Zero propaganda de concorrentes. Ambiente sonoro projetado para aumentar o tempo de permanência e a fidelidade dos seus clientes.
          </p>
        </div>

        {/* Master Play Button with Glowing Ring */}
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full text-white ${theme.bgButton} flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20`}
            title={isPlaying ? 'Pausar Rádio' : 'Tocar Rádio'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Volume & Audio Controls */}
        <div className="w-full max-w-sm flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolume(e.target.value)}
            className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400 w-9 text-right font-bold">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>

        {/* Live Spots / Anúncios Corporativos Bar */}
        {client.spotsList && client.spotsList.length > 0 && (
          <div className="w-full max-w-2xl bg-[#120F1F] border border-white/10 rounded-3xl p-5 text-left shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className={`w-4 h-4 ${theme.text}`} />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Spots & Comerciais da Sua Loja ({client.spotsList.length} gravados)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Disparo Manual em 1 Clique</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {client.spotsList.map((spot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => playSpot(spot)}
                  className={`p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                    activeSpotPlaying === spot.title ? 'border-pink-500 bg-pink-950/20' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-pink-300">
                      {spot.title}
                    </p>
                    <span className="text-[10px] text-slate-400">Voz IA Masterizada</span>
                  </div>
                  <div className="w-7 h-7 rounded-xl bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center shrink-0">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer Instructions for Balcão & PWA */}
      <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tecnologia Anti-Queda • Amplificadora Enterprise Indoor Engine</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Ir para Portal Público</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>

    </div>
  );
}
