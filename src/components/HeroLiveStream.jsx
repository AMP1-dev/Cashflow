import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, Volume2, VolumeX, Sparkles, Users, Disc, Music, Megaphone, Radio, ChevronLeft, ChevronRight, MessageCircle, Mic, Disc3, RadioTower, Flame, Waves, Clock, Shirt, ShoppingBag, ShieldCheck, Car, Wifi, WifiOff } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export function HeroLiveStream() {
  const {
    config,
    currentSlot,
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
    setIsRequestOpen,
    showToast,
    selectChannel,
    selectMainStream
  } = useRadio();
  
  const activeShow = currentSlot || config.currentShow || {};
  const featuredAlbums = config.featuredAlbums || [];

  // Album Artwork dynamic cycle state
  const [albumIdx, setAlbumIdx] = useState(0);

  useEffect(() => {
    if (featuredAlbums.length === 0) return;
    const interval = setInterval(() => {
      setAlbumIdx((prev) => (prev + 1) % featuredAlbums.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [featuredAlbums.length]);

  const currentAlbum = featuredAlbums[albumIdx] || {
    title: activeShow.title || "Manhã Premium",
    artist: activeShow.artist || "Pop & Clássicos",
    year: "2026",
    cover: activeShow.cover
  };

  // Dynamic Rotating Showcase Card State (Auto rotates every 6 seconds)
  const [currentSlide, setCurrentSlide] = useState(0);

  // AMP Link T-Shirts Gallery and Dynamic Rotator
  const tshirtGallery = config.ampLink?.gallery && config.ampLink.gallery.length > 0
    ? config.ampLink.gallery
    : [
        'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/81dd341c4e72a0752694458f52856101.webp',
        'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/d21771a197e6bd8be06e0987e9d573c3.webp',
        'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/09ae412fc013f9b26ff61c54aceb6742.webp',
        'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/fbb6d66dbd6ae67ab6b0becab4b3619b.webp',
        'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/07d5d5c5169d96f668a104e94cc797f4.webp',
        'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/19ec0a47940659b18d1addf4d467fea1.webp'
      ];

  const [tshirtIndex, setTshirtIndex] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Dynamic cycling for t-shirts (cycles every 2.4s)
  useEffect(() => {
    if (tshirtGallery.length <= 1) return;
    const interval = setInterval(() => {
      setTshirtIndex((prev) => (prev + 1) % tshirtGallery.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [tshirtGallery.length]);

  const slides = [
    {
      type: 'brand',
      badge: 'EMISSÃO HD DIGITAL',
      title: config.name,
      subtitle: `"${config.slogan}"`,
      desc: config.subSlogan,
      image: config.logoUrl || '/logo-amplificadora.png'
    },
    {
      type: 'schedule',
      badge: activeShow.badge || 'PROGRAMAÇÃO AO VIVO',
      title: activeShow.title || 'Manhã Alpha • Pop & Soft Hits',
      subtitle: activeShow.genre || 'Pop Internacional & Clássicos',
      desc: 'Transmissão sincronizada com o horário oficial de Brasília.',
      image: activeShow.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    },
    {
      type: 'amplink',
      badge: config.ampLink?.badge || 'COLEÇÃO OFICIAL',
      title: config.ampLink?.title || 'AMP Ink - T Shirts',
      subtitle: config.ampLink?.subtitle || 'Exclusivo Reserva INK',
      desc: config.ampLink?.desc || 'Vista Amplificadora | Estampas Originais',
      image: tshirtGallery[tshirtIndex] || config.ampLink?.imageUrl || tshirtGallery[0],
      actionText: config.ampLink?.actionText || 'Ver Coleção na Reserva INK 👕',
      actionUrl: config.ampLink?.actionUrl || 'https://reserva.ink/amp'
    },
    {
      type: 'ads',
      badge: 'ESPAÇO PUBLICITÁRIO',
      title: 'Anuncie na Amplificadora',
      subtitle: 'Conecte sua marca a um público qualificado',
      desc: 'Spots de áudio e banners digitais com alta visibilidade 24 horas.',
      actionText: 'Quero Anunciar',
      actionUrl: config.social?.whatsapp ? `https://api.whatsapp.com/send?phone=${config.social.whatsapp}&text=${encodeURIComponent('Olá! Gostaria de anunciar na Rádio Amplificadora.')}` : '#contato'
    },
    {
      type: 'interactive',
      badge: 'INTERATIVIDADE AO VIVO',
      title: 'Peça Sua Música no AutoDJ',
      subtitle: 'Envie seu alô e escolha o som da sua rádio',
      desc: 'Mande sua mensagem e faça parte da nossa programação.',
      actionText: 'Pedir Agora ⚡',
      isRequestTrigger: true
    }
  ];

  // Main carousel timer: amplink slide stays for 18 seconds so all t-shirts cycle smoothly!
  // Other slides stay for 10 seconds. Pauses when user hovers or interacts.
  useEffect(() => {
    if (isSlidePaused) return;
    const currentType = slides[currentSlide]?.type;
    const duration = currentType === 'amplink' ? 18000 : 10000;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide, isSlidePaused, slides]);

  const slide = slides[currentSlide];

  // Quick Jingle Preview Play
  const playJingle = (jingle) => {
    try {
      const audio = new Audio(jingle.file);
      audio.volume = 0.9;
      audio.play();
      showToast(`Tocando ${jingle.title}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="player" className="relative w-full min-h-[90vh] lg:min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#07060B] text-white flex items-center justify-center overflow-hidden">
      
      {/* Full-bleed Cinematic Background Image with Dark Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter brightness-40 contrast-125 transform transition-transform duration-10000"
        style={{
          backgroundImage: `url('${activeShow.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=85"}')`
        }}
      ></div>

      {/* Atmospheric Multi-Layer Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07060B] via-[#07060B]/70 to-[#07060B]/85"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.15),transparent_70%)]"></div>

      {/* Dynamic Laser & Neon Beams */}
      <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Full Width Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Shadow Zone Reconnecting Alert Banner */}
        {(!networkOnline || isReconnecting) && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-950/90 to-rose-950/90 border border-amber-500/60 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Área de Sombra Detectada:</strong> Reproduzindo áudio protegido em cache ({bufferSeconds}s restantes). Reconexão automática ativa para túneis e estradas!
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/30 text-amber-200 uppercase tracking-wider border border-amber-500/40">
              Anti-Sombra Ativo
            </span>
          </div>
        )}

        {/* Top Floating Broadcast Ribbon */}
        <div className="flex items-center justify-start flex-wrap gap-4 mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 border border-pink-500/40 text-xs font-bold uppercase tracking-widest text-pink-400 backdrop-blur-xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <RadioTower className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>{activeShow.badge || 'Transmissão HD Digital 24 Horas'}</span>
          </div>
        </div>

        {/* Master Full-Width Glass Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-red-600/50">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>ON AIR</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-pink-300 uppercase">
                AMPLIFICADORA • {activeShow.badge || 'ESTÚDIO MASTER'}
              </span>
            </div>

            {/* Title & Slogans with Geometric Typography (matching AMP Logo) */}
            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[0.18em] uppercase text-white leading-tight filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {config.name}
              </h1>
              
              <p className="text-lg sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-300 font-normal tracking-[0.08em]">
                "{activeShow.slogan || config.slogan}"
              </p>
              
              <p className="text-xs sm:text-sm text-slate-300 font-normal tracking-wide max-w-2xl leading-relaxed">
                {activeShow.genre} • <span className="text-pink-300 font-semibold">{activeShow.artist}</span>
              </p>
            </div>

            {/* Master Track Artwork Glass Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-black/70 border border-pink-500/30 backdrop-blur-2xl flex items-center justify-between gap-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                
                {/* Vinyl Album Artwork with Spin */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-purple-950/80 shrink-0 border-2 border-pink-500/40 shadow-xl shadow-pink-500/20 group">
                  <img
                    src={activeShow.cover || currentAlbum.cover}
                    alt={activeShow.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <Disc className="w-8 h-8 text-pink-400 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-pink-600 text-white shadow">
                      {activeChannel ? 'CANAL ATIVO' : 'NO AR AGORA'}
                    </span>
                    <span className="text-[10px] text-pink-300 font-mono hidden sm:inline">
                      ÁUDIO ESTÉREO 320 KBPS
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-white truncate">
                    {activeChannel ? activeChannel.title : activeShow.title}
                  </h3>
                  
                  <p className="text-xs text-slate-300 truncate font-light">
                    {activeChannel ? activeChannel.genre : activeShow.currentTrack}
                  </p>
                </div>
              </div>

              <div className="hidden md:block shrink-0">
                <AudioVisualizer isPlaying={isPlaying} barCount={12} color="bg-gradient-to-t from-pink-500 to-purple-400" />
              </div>
            </div>

            {/* Master Play Controls & Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              
              {/* Main Play Button */}
              <button
                onClick={() => togglePlay()}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm sm:text-base tracking-[0.1em] uppercase shadow-[0_0_35px_rgba(236,72,153,0.5)] hover:scale-105 transition-all duration-300 border border-white/25"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6 fill-white" />
                    <span>PAUSAR STREAM</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                    <span>{isBuffering ? 'CONECTANDO...' : 'OUVIR AO VIVO'}</span>
                  </>
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl">
                <button onClick={toggleMute} className="text-pink-400 hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Pedir Música Button */}
              <button
                onClick={() => setIsRequestOpen(true)}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold tracking-wider text-white transition-all backdrop-blur-xl shadow-lg"
              >
                Pedir Música ⚡
              </button>

            </div>

            {/* Neural Vinhetas Soundboard Bar */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                <Mic className="w-3.5 h-3.5 text-pink-400" />
                <span>Disparar Vinhetas Oficiais da Rádio (Voz Neural Feminina):</span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {(config.jingles || []).map((jingle) => (
                  <button
                    key={jingle.id}
                    onClick={() => playJingle(jingle)}
                    className="px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-pink-600/50 border border-pink-500/30 text-[11px] font-semibold text-pink-200 transition-all flex items-center gap-1.5 shadow hover:scale-105"
                  >
                    <Play className="w-3 h-3 fill-pink-400" />
                    <span>{jingle.voice}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Dynamic Rotating Showcase Card & Stacked Telemetry */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-3">
            
            {/* Centered Master Audio Pill Aligned with Card */}
            <div className="w-full max-w-[380px] flex justify-center mb-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-pink-500/30 text-xs font-semibold text-slate-200 backdrop-blur-xl shadow-lg shadow-pink-500/10">
                <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>Áudio Estéreo 320kbps • Estúdio Master</span>
              </div>
            </div>

            {/* Showcase Card */}
            <div 
              onMouseEnter={() => setIsSlidePaused(true)}
              onMouseLeave={() => setIsSlidePaused(false)}
              className="relative w-full max-w-[380px] min-h-[490px] rounded-[32px] overflow-hidden border-2 border-pink-500/40 shadow-[0_0_50px_rgba(236,72,153,0.25)] bg-[#100C1B]/90 backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between group transition-all duration-700"
            >
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ec489920,transparent_75%)] pointer-events-none"></div>

              {/* Slide Header Indicator */}
              <div className="flex items-center justify-between relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-pink-500/20 text-pink-400 border border-pink-500/40 shadow">
                  ● {slide.badge}
                </span>

                {/* Carousel Dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentSlide === idx ? 'w-5 bg-pink-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      title={`Slide ${idx + 1}`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Slide Center Visual Content */}
              <div className="relative z-10 my-auto py-2 text-center animate-fadeIn">
                {slide.type === 'brand' && (
                  <div className="flex flex-col items-center justify-center py-4 space-y-3">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-pink-600/40 p-3 border border-white/20 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src="/logo-amplificadora.png"
                        alt="Amplificadora"
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-white tracking-[0.15em] uppercase">{config.name}</h4>
                      <p className="text-xs text-pink-300 font-medium">"{config.slogan}"</p>
                    </div>
                  </div>
                )}

                {slide.type === 'schedule' && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto shadow-2xl shadow-purple-600/40">
                      <Radio className="w-8 h-8 animate-pulse" />
                    </div>
                    <h4 className="text-lg font-medium text-white tracking-wide">{slide.title}</h4>
                    <p className="text-xs text-pink-300 font-normal">{slide.subtitle}</p>
                  </div>
                )}

                {slide.type === 'amplink' && (
                  <div className="space-y-2.5">
                    {/* Enlarged T-Shirt Showcase Card */}
                    <div className="relative w-full max-w-[290px] h-[230px] sm:h-[255px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-black/85 via-[#120f1c] to-[#181126] border border-pink-500/30 p-2 shadow-2xl shadow-pink-500/15 group/tshirt flex items-center justify-center transition-all duration-500 hover:border-pink-400">
                      
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 z-20 px-2.5 py-0.5 rounded-full bg-pink-600/90 backdrop-blur-md text-white text-[9px] font-medium uppercase tracking-wider shadow">
                        Reserva INK
                      </div>
                      <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full bg-black/75 border border-white/15 text-pink-300 text-[9px] font-normal tracking-wide">
                        {tshirtIndex + 1} / {tshirtGallery.length}
                      </div>

                      {/* Main enlarged T-Shirt Image with click to Reserva INK */}
                      <a
                        href={slide.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-full flex items-center justify-center cursor-pointer p-1"
                        title="Ver este modelo na Reserva INK"
                      >
                        <img
                          key={tshirtIndex}
                          src={tshirtGallery[tshirtIndex]}
                          alt="Camiseta AMP Ink"
                          className="max-w-full max-h-full object-contain rounded-xl filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-500"
                        />
                      </a>

                      {/* Mini Prev/Next arrows within the shirt card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTshirtIndex((prev) => (prev - 1 + tshirtGallery.length) % tshirtGallery.length);
                        }}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/70 hover:bg-pink-600 text-white border border-white/20 transition-all opacity-75 hover:opacity-100"
                        title="Camiseta anterior"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTshirtIndex((prev) => (prev + 1) % tshirtGallery.length);
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/70 hover:bg-pink-600 text-white border border-white/20 transition-all opacity-75 hover:opacity-100"
                        title="Próxima camiseta"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Title: Finer typography "AMP Ink - T Shirts" */}
                    <div className="text-center pt-0.5">
                      <h4 className="text-lg sm:text-xl font-medium tracking-wider text-white drop-shadow-[0_2px_8px_rgba(236,72,153,0.35)]">
                        {slide.title}
                      </h4>
                    </div>

                    {/* Interactive Miniature Thumbnail Selector */}
                    <div className="flex items-center justify-center gap-1.5 pt-0.5">
                      {tshirtGallery.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTshirtIndex(idx);
                          }}
                          className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all p-0.5 bg-black/80 ${
                            tshirtIndex === idx
                              ? 'border-pink-500 ring-2 ring-pink-500/60 scale-110 shadow-lg shadow-pink-500/40 opacity-100'
                              : 'border-white/20 hover:border-pink-400 opacity-50 hover:opacity-100'
                          }`}
                          title={`Modelo ${idx + 1}`}
                        >
                          <img src={img} alt={`Modelo ${idx + 1}`} className="w-full h-full object-contain rounded" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {slide.type === 'ads' && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-pink-600/30 border border-pink-500/40 text-pink-300 flex items-center justify-center mx-auto shadow-2xl shadow-pink-600/40">
                      <Megaphone className="w-8 h-8 animate-bounce" />
                    </div>
                    <h4 className="text-xl font-medium text-white tracking-wide">{slide.title}</h4>
                    <p className="text-xs text-slate-300 font-light">{slide.subtitle}</p>
                  </div>
                )}

                {slide.type === 'interactive' && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-600/40">
                      <Music className="w-8 h-8 animate-pulse" />
                    </div>
                    <h4 className="text-xl font-medium text-white tracking-wide">{slide.title}</h4>
                    <p className="text-xs text-slate-300 font-light">{slide.subtitle}</p>
                  </div>
                )}
              </div>

              {/* Slide Bottom Info & Actions */}
              <div className="relative z-10 p-3 sm:py-3 sm:px-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-center space-y-1.5">
                <p className="text-[11px] sm:text-xs font-light text-slate-300 tracking-wider">
                  {slide.desc}
                </p>
                
                {slide.actionText && (
                  <div>
                    {slide.isRequestTrigger ? (
                      <button
                        onClick={() => setIsRequestOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>{slide.actionText}</span>
                      </button>
                    ) : slide.type === 'amplink' ? (
                      <a
                        href={slide.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{slide.actionText}</span>
                      </a>
                    ) : (
                      <a
                        href={slide.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{slide.actionText}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Navigation Arrows on Hover */}
              <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="p-1.5 rounded-full bg-black/70 hover:bg-pink-600 text-white pointer-events-auto border border-white/20"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-1.5 rounded-full bg-black/70 hover:bg-pink-600 text-white pointer-events-auto border border-white/20"
                  title="Próximo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
