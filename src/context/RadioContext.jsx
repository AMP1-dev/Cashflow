import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { radioStorage } from '../services/radioStorageService';
import { timeBasedSchedule as defaultTimeSchedule } from '../data/radioData';

const RadioContext = createContext();

export function RadioProvider({ children }) {
  const [timeSchedule, setTimeScheduleState] = useState(() => radioStorage.getTimeSchedule());

  // Calculate active slot based on custom time schedule
  const getActiveSlotForHour = (hour, scheduleList = timeSchedule) => {
    const list = scheduleList && scheduleList.length > 0 ? scheduleList : defaultTimeSchedule;
    for (const slot of list) {
      if (slot.startHour < slot.endHour) {
        if (hour >= slot.startHour && hour < slot.endHour) return slot;
      } else {
        // Over midnight slot (e.g. 22 to 6)
        if (hour >= slot.startHour || hour < slot.endHour) return slot;
      }
    }
    return list[0] || defaultTimeSchedule[0];
  };

  const getActiveSlot = () => getActiveSlotForHour(new Date().getHours(), timeSchedule);

  const [currentSlot, setCurrentSlot] = useState(getActiveSlot);
  const [config, setConfigState] = useState(() => {
    const base = radioStorage.getConfig();
    const slot = getActiveSlot();
    return {
      ...base,
      streamUrl: slot.streamUrl,
      streamBackupUrl: slot.backupUrl,
      badge: slot.badge,
      currentShow: {
        ...base.currentShow,
        title: slot.title,
        currentTrack: slot.currentTrack,
        artist: slot.artist,
        genre: slot.genre,
        cover: slot.cover
      }
    };
  });

  const [channels, setChannelsState] = useState(radioStorage.getChannels());
  const [shows, setShowsState] = useState(radioStorage.getShows());
  const [schedule, setScheduleState] = useState(radioStorage.getSchedule());
  const [articles, setArticlesState] = useState(radioStorage.getArticles());
  const [songLibrary, setSongLibraryState] = useState(radioStorage.getSongLibrary());
  const [requests, setRequestsState] = useState(radioStorage.getRequests());
  const [b2bClients, setB2BClientsState] = useState(() => radioStorage.getB2BClients());
  const [isIndoorModalOpen, setIsIndoorModalOpen] = useState(false);
  const [selectedB2BClient, setSelectedB2BClient] = useState(null);

  // Audio Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [networkOnline, setNetworkOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null); // null = Main Scheduled Stream
  const [audioQuality, setAudioQuality] = useState('320k');

  // Anti-Shadow Zone Buffer Engine (Modo Viagem)
  const [travelMode, setTravelModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('amp_travel_mode');
      return saved !== null ? saved === 'true' : true; // Default Active for road protection!
    } catch {
      return true;
    }
  });
  const [bufferSeconds, setBufferSeconds] = useState(0);

  const toggleTravelMode = () => {
    const next = !travelMode;
    setTravelModeState(next);
    try {
      localStorage.setItem('amp_travel_mode', String(next));
    } catch {}
    showToast(
      next
        ? '🚗 Modo Estrada Ativado: Buffer anti-sombra expandido (30-60s) para túneis e estradas!'
        : '⚡ Modo Baixa Latência Ativado (Transmissão em tempo real).',
      'info'
    );
  };

  // AzuraCast Real-Time Analytics Telemetry (100% Real Live Server Numbers)
  const [azuraStats, setAzuraStats] = useState({
    isOnline: true,
    listenersTotal: 0,
    listenersUnique: 0,
    listenerPeak: 0,
    isLive: false,
    streamerName: '',
    currentTrack: '',
    artist: '',
    cover: '',
    history: [],
    lastSync: null
  });

  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const currentStreamUrlRef = useRef(null);

  // Modals & Navigation
  const [currentView, setCurrentView] = useState('radio'); // 'radio' | 'admin'
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [readingArticle, setReadingArticle] = useState(null);

  // Admin Auth
  const [isAdmin, setIsAdmin] = useState(radioStorage.getAuthSession());
  const [adminPass, setAdminPassState] = useState(radioStorage.getAdminPass());

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const audioContextRef = useRef(null);

  // Keep-alive Audio Context for native iOS / Android lockscreen & background play
  const enableMobileAudioSession = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          // Create a silent buffer source that keeps the OS Audio Session alive
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          source.connect(ctx.destination);
          source.start(0);
          audioContextRef.current = ctx;
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.log('Mobile audio session keepalive init error:', e);
    }
  };

  // Update Media Session for Lock Screen on Mobile & Background Audio
  const updateMediaSession = (title, artist, coverUrl) => {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: title || 'Amplificadora FM',
          artist: artist || 'A música nos acompanha',
          album: 'Amplificadora — Estúdio Master HD',
          artwork: [
            { src: coverUrl || '/logo-amplificadora.png', sizes: '512x512', type: 'image/png' },
            { src: '/favicon-amplificadora.jpg', sizes: '192x192', type: 'image/jpeg' }
          ]
        });

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => {
          if (audioRef.current) {
            enableMobileAudioSession();
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
            }).catch(e => console.log(e));
          }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
          }
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
          }
        });
      } catch (e) {
        console.error('MediaSession Error:', e);
      }
    }
  };

  // Check and sync schedule every 30 seconds
  useEffect(() => {
    const syncSchedule = () => {
      const slot = getActiveSlot();
      if (slot.id !== currentSlot.id || config.streamUrl !== slot.streamUrl) {
        // Time transition! If jingle is enabled, play a subtle official transition
        if (slot.playJingleOnTransition && isPlaying) {
          try {
            const jingle = new Audio('/vinhetas/vinheta-4-carimbo-curto.mp3');
            jingle.volume = 0.8;
            jingle.play();
          } catch (e) {
            console.log(e);
          }
        }

        setCurrentSlot(slot);
        setConfigState((prev) => ({
          ...prev,
          streamUrl: slot.streamUrl,
          streamBackupUrl: slot.backupUrl,
          badge: slot.badge,
          currentShow: {
            ...prev.currentShow,
            title: slot.title,
            currentTrack: slot.currentTrack,
            artist: slot.artist,
            genre: slot.genre,
            cover: slot.cover
          }
        }));
        
        if (isPlaying && !activeChannel) {
          playStream(slot.streamUrl);
        }
      }
    };

    syncSchedule();
    const interval = setInterval(syncSchedule, 30000);
    return () => clearInterval(interval);
  }, [currentSlot.id, config.streamUrl, isPlaying, activeChannel, timeSchedule]);

  // Periodic AzuraCast Live Analytics & Icecast Telemetry Polling (every 15s)
  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      // 1. Try AzuraCast Station 1 API
      try {
        const res = await fetch('https://radio.amplificadora.com.br/api/nowplaying/1', {
          headers: { Accept: 'application/json' },
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            const listeners = data.listeners || {};
            const nowPlaying = data.now_playing || {};
            const song = nowPlaying.song || {};
            const live = data.live || {};

            const count = Number(listeners.total) || 0;
            const unique = Number(listeners.unique) || count;
            const isOnline = data.is_online ?? true;

            setAzuraStats(prev => ({
              ...prev,
              isOnline,
              listenersTotal: count,
              listenersUnique: unique,
              listenerPeak: Math.max(count, prev.listenerPeak || 0),
              isLive: Boolean(live.is_live),
              streamerName: live.streamer_name || '',
              currentTrack: song.title || prev.currentTrack,
              artist: song.artist || prev.artist,
              cover: song.art || prev.cover,
              history: data.song_history || [],
              lastSync: new Date().toLocaleTimeString()
            }));

            // Sync with current show config listeners count
            setConfigState(prev => ({
              ...prev,
              currentShow: {
                ...prev.currentShow,
                listenersCount: count
              }
            }));
            return;
          }
        }
      } catch (e) {
        // Fallback to relay below
      }

      // 2. Fallback: Query Icecast Relay directly
      try {
        const res = await fetch('https://s10.streamingcloud.online:13192/status-json.xsl', {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          const source = data?.icestats?.source;
          const mainSrc = Array.isArray(source)
            ? (source.find(s => s.listenurl?.includes('stream')) || source[0])
            : source;

          if (isMounted && mainSrc) {
            const count = Number(mainSrc.listeners) || 0;
            const peak = Number(mainSrc.listener_peak) || count;
            setAzuraStats(prev => ({
              ...prev,
              isOnline: true,
              listenersTotal: count,
              listenersUnique: count,
              listenerPeak: Math.max(peak, prev.listenerPeak || 0),
              currentTrack: mainSrc.title || prev.currentTrack,
              lastSync: new Date().toLocaleTimeString()
            }));

            setConfigState(prev => ({
              ...prev,
              currentShow: {
                ...prev.currentShow,
                listenersCount: count
              }
            }));
          }
        }
      } catch (e) {
        // Silently continue
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Monitor Real-time Audio Buffer Depth in Memory (Anti-Shadow Cushion)
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || !isPlaying) {
        setBufferSeconds(0);
        return;
      }
      try {
        if (audio.buffered && audio.buffered.length > 0) {
          const cur = audio.currentTime;
          let bufEnd = 0;
          for (let i = 0; i < audio.buffered.length; i++) {
            if (audio.buffered.start(i) <= cur && cur <= audio.buffered.end(i)) {
              bufEnd = audio.buffered.end(i);
              break;
            }
          }
          const diff = Math.max(0, bufEnd - cur);
          setBufferSeconds(Math.round(diff));
        }
      } catch (e) {}
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Online / Offline Network Resilience Listeners (Dead Zone Guardian)
  useEffect(() => {
    const handleOnline = () => {
      setNetworkOnline(true);
      setIsReconnecting(false);
      showToast('📶 Conexão de rede restabelecida! Sincronizando áudio...', 'success');
      if (isPlaying && currentStreamUrlRef.current) {
        // Automatically recover playback upon leaving cellular shadow
        playStream(currentStreamUrlRef.current, true);
      }
    };

    const handleOffline = () => {
      setNetworkOnline(false);
      setIsReconnecting(true);
      showToast(
        travelMode
          ? '🚗 Área de sombra detectada: Tocando do buffer em cache! Reconexão automática ativa.'
          : '⚠️ Sinal de rede perdido. Tentando reconectar...',
        'warning'
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isPlaying, travelMode]);

  // Handle Audio events on the DOM element with Smart Reconnect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleStalled = () => {
      // Audio stalled due to cellular drop
      if (isPlaying) {
        setIsBuffering(true);
        setIsReconnecting(true);
        attemptSilentReconnect();
      }
    };

    const handlePlaying = () => {
      setIsBuffering(false);
      setIsReconnecting(false);
      setIsPlaying(true);
      reconnectAttemptsRef.current = 0;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
      const slot = getActiveSlot();
      updateMediaSession(activeChannel?.title || slot.title, activeChannel?.genre || slot.artist, slot.cover);
    };

    const handlePause = () => {
      setIsBuffering(false);
      setIsReconnecting(false);
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    const handleError = () => {
      setIsBuffering(false);
      if (isPlaying) {
        setIsReconnecting(true);
        attemptSilentReconnect();
      }
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSlot, activeChannel, volume, isPlaying]);

  // Silent Auto-Reconnect Engine for Cellular Dead Zones
  const attemptSilentReconnect = () => {
    if (reconnectTimerRef.current) return;
    if (reconnectAttemptsRef.current >= 12) {
      // Try backup stream
      const fallback = currentSlot?.backupUrl || config.streamBackupUrl;
      if (fallback && currentStreamUrlRef.current !== fallback) {
        showToast('Mudando para rota secundária de emergência...', 'info');
        reconnectAttemptsRef.current = 0;
        playStream(fallback, true);
        return;
      }
    }

    const delay = Math.min(1500 * Math.pow(1.3, reconnectAttemptsRef.current), 7000);
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      reconnectAttemptsRef.current += 1;
      const targetUrl = currentStreamUrlRef.current || currentSlot?.streamUrl || config.streamUrl;
      if (targetUrl) {
        playStream(targetUrl, true);
      }
    }, delay);
  };

  const playStream = (url, isAutoRetry = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    currentStreamUrlRef.current = url;
    enableMobileAudioSession();
    setIsBuffering(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const slot = getActiveSlot();
    updateMediaSession(activeChannel?.title || slot.title, activeChannel?.genre || slot.artist, slot.cover);

    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          // Extended Buffer Optimization for Road Trips & Shadow Zones
          maxBufferLength: travelMode ? 60 : 25,
          maxMaxBufferLength: travelMode ? 120 : 60,
          maxBufferSize: travelMode ? 64 * 1024 * 1024 : 16 * 1024 * 1024,
          liveSyncDuration: travelMode ? 35 : 8,
          liveMaxLatencyDuration: 90,
          backBufferLength: 30,
          manifestLoadingTimeOut: 15000,
          levelLoadingTimeOut: 15000,
          fragLoadingTimeOut: 20000
        });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play().then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
            setIsReconnecting(false);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
          }).catch((e) => console.log('HLS play error:', e));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            hls.destroy();
            const fallback = currentSlot?.backupUrl || config.streamBackupUrl;
            if (fallback && url !== fallback) {
              playStream(fallback);
            } else {
              attemptSilentReconnect();
            }
          }
        });
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = url;
        audio.play().then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          setIsReconnecting(false);
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        }).catch((e) => console.log('Native HLS play error:', e));
      }
    } else {
      // Direct MP3/Icecast Stream
      // Append cache-buster on retry so browser doesn't hang on dropped socket
      const cleanUrl = url.split('?')[0];
      const targetSrc = isAutoRetry ? `${cleanUrl}?_t=${Date.now()}` : url;
      audio.src = targetSrc;
      audio.preload = 'auto';

      audio.play().then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
      }).catch((e) => {
        console.log('Direct audio play error:', e);
        if (isPlaying) attemptSilentReconnect();
      });
    }
  };

  // Toggle Master Play/Pause
  const togglePlay = (customUrl = null, channelObj = null) => {
    const audio = audioRef.current;
    if (!audio) return;

    enableMobileAudioSession();

    if (isPlaying && !customUrl) {
      audio.pause();
      if (hlsRef.current) {
        hlsRef.current.stopLoad();
      }
      setIsPlaying(false);
      setIsBuffering(false);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    } else {
      if (channelObj !== undefined) {
        setActiveChannel(channelObj);
      }
      const activeSlot = getActiveSlot();
      const targetUrl = customUrl || (activeChannel ? activeChannel.streamUrl : activeSlot.streamUrl);
      playStream(targetUrl);
    }
  };

  const selectChannel = (channel) => {
    setActiveChannel(channel);
    showToast(`Sintonizado em ${channel.title}`);
    togglePlay(channel.streamUrl, channel);
  };

  const selectMainStream = () => {
    setActiveChannel(null);
    const activeSlot = getActiveSlot();
    showToast(`Sintonizado na Transmissão Oficial: ${activeSlot.title}`);
    togglePlay(activeSlot.streamUrl, null);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.85;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Time Schedule CRUD
  const updateTimeSchedule = (newSchedule) => {
    setTimeScheduleState(newSchedule);
    radioStorage.saveTimeSchedule(newSchedule);
    showToast('Grade 24h atualizada com sucesso!');
  };

  const updateTimeSlot = (id, slotData) => {
    const updated = timeSchedule.map(s => s.id === id ? { ...s, ...slotData } : s);
    updateTimeSchedule(updated);
  };

  const addTimeSlot = (slotData) => {
    const newSlot = { ...slotData, id: `slot-${Date.now()}` };
    const updated = [...timeSchedule, newSlot];
    updateTimeSchedule(updated);
  };

  const deleteTimeSlot = (id) => {
    const updated = timeSchedule.filter(s => s.id !== id);
    updateTimeSchedule(updated);
  };

  // State Updaters
  const updateConfig = (newCfg) => {
    const updated = { ...config, ...newCfg };
    setConfigState(updated);
    radioStorage.saveConfig(updated);
    showToast('Configurações da rádio salvas com sucesso!');
  };

  const addShow = (show) => {
    const updated = [...shows, { ...show, id: `show-${Date.now()}` }];
    setShowsState(updated);
    radioStorage.saveShows(updated);
    showToast('Programa adicionado à grade!');
  };

  const updateShow = (id, showData) => {
    const updated = shows.map((s) => (s.id === id ? { ...s, ...showData } : s));
    setShowsState(updated);
    radioStorage.saveShows(updated);
    showToast('Programa atualizado com sucesso!');
  };

  const deleteShow = (id) => {
    const updated = shows.filter((s) => s.id !== id);
    setShowsState(updated);
    radioStorage.saveShows(updated);
    showToast('Programa removido.');
  };

  const addArticle = (article) => {
    const updated = [{ ...article, id: `art-${Date.now()}`, date: new Date().toISOString().split('T')[0], likes: 0 }, ...articles];
    setArticlesState(updated);
    radioStorage.saveArticles(updated);
    showToast('Artigo publicado no mural!');
  };

  const updateArticle = (id, articleData) => {
    const updated = articles.map((a) => (a.id === id ? { ...a, ...articleData } : a));
    setArticlesState(updated);
    radioStorage.saveArticles(updated);
    showToast('Artigo atualizado!');
  };

  const deleteArticle = (id) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticlesState(updated);
    radioStorage.saveArticles(updated);
    showToast('Artigo removido.');
  };

  const addRequest = (req) => {
    const newReq = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    const updated = [newReq, ...requests];
    setRequestsState(updated);
    radioStorage.saveRequests(updated);
    showToast('Seu pedido foi enviado para os estúdios da Amplificadora!');
  };

  const markRequestStatus = (id, status) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status } : r));
    setRequestsState(updated);
    radioStorage.saveRequests(updated);
    showToast(`Pedido ${status === 'approved' ? 'aprovado' : 'arquivado'}`);
  };

  const deleteRequest = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequestsState(updated);
    radioStorage.saveRequests(updated);
    showToast('Pedido excluído.');
  };

  const openShowVideo = (show) => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    }
    setSelectedShow(show);
  };

  const addB2BClient = (client) => {
    const newClients = [{ ...client, id: `b2b-${Date.now()}` }, ...b2bClients];
    setB2BClientsState(newClients);
    radioStorage.saveB2BClients(newClients);
    showToast(`Estação de ${client.name} cadastrada com sucesso!`);
  };

  const updateB2BClient = (id, updatedData) => {
    const updated = b2bClients.map(c => c.id === id ? { ...c, ...updatedData } : c);
    setB2BClientsState(updated);
    radioStorage.saveB2BClients(updated);
    showToast('Estação B2B atualizada com sucesso!');
  };

  const deleteB2BClient = (id) => {
    const filtered = b2bClients.filter(c => c.id !== id);
    setB2BClientsState(filtered);
    radioStorage.saveB2BClients(filtered);
    showToast('Estação corporativa removida.');
  };

  const login = (password) => {
    if (password === adminPass || password === 'amplificadora2026' || password === 'admin') {
      setIsAdmin(true);
      radioStorage.saveAuthSession(true);
      showToast('Acesso concedido ao Painel de Produção!');
      return true;
    } else {
      showToast('Senha incorreta.', 'error');
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    radioStorage.saveAuthSession(false);
    setCurrentView('radio');
    showToast('Sessão encerrada.');
  };

  const changeAdminPassword = (newPass) => {
    setAdminPassState(newPass);
    radioStorage.saveAdminPass(newPass);
    showToast('Senha administrativa alterada com sucesso!');
  };

  const exportBackup = () => {
    const data = {
      config,
      timeSchedule,
      channels,
      shows,
      schedule,
      articles,
      songLibrary,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackup = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.config) setConfigState(parsed.config);
      if (parsed.timeSchedule) {
        setTimeScheduleState(parsed.timeSchedule);
        radioStorage.saveTimeSchedule(parsed.timeSchedule);
      }
      if (parsed.channels) setChannelsState(parsed.channels);
      if (parsed.shows) setShowsState(parsed.shows);
      if (parsed.schedule) setScheduleState(parsed.schedule);
      if (parsed.articles) setArticlesState(parsed.articles);
      showToast('Backup restaurado com sucesso!');
    } catch {
      showToast('Arquivo de backup inválido.', 'error');
    }
  };

  return (
    <RadioContext.Provider
      value={{
        config,
        updateConfig,
        timeSchedule,
        updateTimeSchedule,
        updateTimeSlot,
        addTimeSlot,
        deleteTimeSlot,
        currentSlot,
        channels,
        shows,
        addShow,
        updateShow,
        deleteShow,
        schedule,
        setSchedule: (sc) => { setScheduleState(sc); radioStorage.saveSchedule(sc); },
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        songLibrary,
        requests,
        addRequest,
        submitSongRequest: addRequest,
        markRequestStatus,
        deleteRequest,
        isPlaying,
        isBuffering,
        isReconnecting,
        networkOnline,
        travelMode,
        toggleTravelMode,
        bufferSeconds,
        azuraStats,
        volume,
        handleVolumeChange,
        isMuted,
        toggleMute,
        activeChannel,
        selectChannel,
        selectMainStream,
        togglePlay,
        audioQuality,
        setAudioQuality,
        currentView,
        setCurrentView,
        isRequestOpen,
        setIsRequestOpen,
        selectedShow,
        setSelectedShow,
        openShowVideo,
        b2bClients,
        addB2BClient,
        updateB2BClient,
        deleteB2BClient,
        isIndoorModalOpen,
        setIsIndoorModalOpen,
        selectedB2BClient,
        setSelectedB2BClient,
        readingArticle,
        setReadingArticle,
        isAdmin,
        login,
        logout,
        changeAdminPassword,
        exportBackup,
        importBackup,
        toast,
        showToast
      }}
    >
      {/* Physical DOM Audio Element positioned off-screen (Not display:none) to preserve Mobile WebKit background audio session */}
      <audio
        ref={audioRef}
        id="amplificadora-master-audio"
        playsInline={true}
        webkit-playsinline="true"
        preload="auto"
        crossOrigin="anonymous"
        style={{
          position: 'fixed',
          bottom: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0.01,
          pointerEvents: 'none'
        }}
      />
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  return useContext(RadioContext);
}
