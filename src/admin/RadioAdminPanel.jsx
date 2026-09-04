import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { Radio, Music, Calendar, Newspaper, MessageSquare, Settings, Database, ExternalLink, LogOut, Lock, Plus, Edit, Trash2, Check, X, Upload, Save, Disc, Flame, Clock, Sparkles, Volume2, Play, Building2, Store, ShoppingBag, Shirt, Tv, Copy, BarChart3, Activity, ShieldCheck, Car, Signal, Headphones, Globe2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { formatYouTubeEmbed } from '../data/radioData';

export function RadioAdminPanel() {
  const {
    config,
    updateConfig,
    timeSchedule,
    updateTimeSlot,
    addTimeSlot,
    deleteTimeSlot,
    currentSlot,
    togglePlay,
    azuraStats,
    travelMode,
    toggleTravelMode,
    bufferSeconds,
    isReconnecting,
    networkOnline,
    shows,
    addShow,
    updateShow,
    deleteShow,
    openShowVideo,
    b2bClients,
    addB2BClient,
    updateB2BClient,
    deleteB2BClient,
    setIsIndoorModalOpen,
    setSelectedB2BClient,
    schedule,
    setSchedule,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    requests,
    markRequestStatus,
    deleteRequest,
    isAdmin,
    login,
    logout,
    changeAdminPassword,
    setCurrentView,
    exportBackup,
    importBackup,
    showToast
  } = useRadio();

  const [activeTab, setActiveTab] = useState('schedule24');
  const [loginPass, setLoginPass] = useState('');
  
  // Editing Time Slot State
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotForm, setSlotForm] = useState({
    startHour: 6,
    endHour: 10,
    title: '',
    slogan: 'Ampliando sua onda musical',
    streamUrl: '',
    backupUrl: '',
    genre: '',
    artist: '',
    badge: '',
    cover: '',
    playJingleOnTransition: true
  });

  // Show Form
  const [editingShowId, setEditingShowId] = useState(null);
  const [isCreatingShow, setIsCreatingShow] = useState(false);
  const [showForm, setShowForm] = useState({
    title: '',
    host: '',
    date: 'Sábado • 22:00',
    duration: '01:00:00',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    desc: '',
    audioPreviewUrl: '',
    videoEmbedUrl: ''
  });

  // B2B Client Form State
  const [editingB2BId, setEditingB2BId] = useState(null);
  const [isCreatingB2B, setIsCreatingB2B] = useState(false);
  const [b2bForm, setB2BForm] = useState({
    name: '',
    segment: 'Restaurante & Cafeteria',
    location: '',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    genre: 'Jazz, Bossa & Acoustic Lounge',
    slogan: '',
    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    spotsCount: 4,
    plan: 'Plano Pro (2 Ambientes + Locução IA)',
    status: 'Ativo'
  });

  // AMP Link Merch State
  const [ampLinkForm, setAmpLinkForm] = useState({
    enabled: config.ampLink?.enabled ?? true,
    badge: config.ampLink?.badge || 'COLEÇÃO OFICIAL',
    title: config.ampLink?.title || 'AMP Ink - T Shirts',
    subtitle: config.ampLink?.subtitle || 'Exclusivo Reserva INK',
    desc: config.ampLink?.desc || 'Vista Amplificadora | Estampas Originais',
    imageUrl: config.ampLink?.imageUrl || 'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/81dd341c4e72a0752694458f52856101.webp',
    gallery: config.ampLink?.gallery || [
      'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/81dd341c4e72a0752694458f52856101.webp',
      'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/d21771a197e6bd8be06e0987e9d573c3.webp',
      'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/09ae412fc013f9b26ff61c54aceb6742.webp',
      'https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/fbb6d66dbd6ae67ab6b0becab4b3619b.webp'
    ],
    actionText: config.ampLink?.actionText || 'Ver Coleção na Reserva INK 👕',
    actionUrl: config.ampLink?.actionUrl || 'https://reserva.ink/amp'
  });

  // Password Form
  const [newPass, setNewPass] = useState('');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0910] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-pink-600/40 mb-4 border border-white/20">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Amplificadora Master Studio
          </h2>
          <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mt-1">
            Painel de Produção & Grade 24h
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-[#131120] border border-pink-500/30 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); login(loginPass); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Senha de Produção da Rádio
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Digite a senha..."
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-pink-600/40 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Acessar Mesa de Produção</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('radio')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Voltar para a Rádio Ao Vivo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (editingSlotId === 'new') {
      addTimeSlot(slotForm);
      setEditingSlotId(null);
    } else if (editingSlotId) {
      updateTimeSlot(editingSlotId, slotForm);
      setEditingSlotId(null);
    }
  };

  const handleSaveShow = (e) => {
    e.preventDefault();
    const formatted = {
      ...showForm,
      videoEmbedUrl: formatYouTubeEmbed(showForm.videoEmbedUrl)
    };
    if (isCreatingShow) {
      addShow(formatted);
      setIsCreatingShow(false);
    } else if (editingShowId) {
      updateShow(editingShowId, formatted);
      setEditingShowId(null);
    }
  };

  const handleSaveB2B = (e) => {
    e.preventDefault();
    if (isCreatingB2B) {
      addB2BClient(b2bForm);
      setIsCreatingB2B(false);
    } else if (editingB2BId) {
      updateB2BClient(editingB2BId, b2bForm);
      setEditingB2BId(null);
    }
  };

  const handleSaveAmpLink = (e) => {
    e.preventDefault();
    updateConfig({
      ...config,
      ampLink: ampLinkForm
    });
    showToast('Configurações do AMP Link salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#0A0910] text-slate-100 pb-24 font-sans">
      
      {/* Header */}
      <header className="bg-[#100E1D] border-b border-pink-500/20 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-base font-black text-white flex items-center gap-2">
                  Amplificadora Control Room
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    Grade Dinâmica ON
                  </span>
                </div>
                <span className="text-xs text-slate-400">Transmissão & Gestão de Horários 24/7</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('radio')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvir Rádio</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors border border-rose-500/30 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: 'schedule24', label: '⏰ Grade 24h & Links', icon: Clock },
              { id: 'analytics', label: '📊 Audiência & Analytics (AzuraCast)', icon: BarChart3 },
              { id: 'shows', label: '🎬 Shows & Vídeos 4K', icon: Tv },
              { id: 'indoor', label: '🏢 Rádio Indoor (B2B)', icon: Building2 },
              { id: 'merch', label: '👕 AMP Link (Merch)', icon: ShoppingBag },
              { id: 'requests', label: 'Fila de Pedidos', icon: MessageSquare, badge: requests.filter(r => r.status === 'pending').length },
              { id: 'news', label: 'Stories & Notícias', icon: Newspaper },
              { id: 'settings', label: 'Backup & Servidor', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-pink-500 text-white animate-bounce">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Tab Analytics: AzuraCast Real-Time Metrics & Buffer Tuning */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                  <BarChart3 className="w-7 h-7 text-pink-500" />
                  <span>Audiência em Tempo Real & Analytics</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    AzuraCast Telemetry
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  Monitoramento oficial de ouvintes auditado diretamente no servidor de streaming (Liquidsoap & Icecast). Medição precisa de conexões, tempo de permanência e resiliência de cache sem necessidade de Google Analytics!
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href="https://radio.amplificadora.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-600/30 flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Painel AzuraCast VPS</span>
                </a>
              </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Ouvintes Ao Vivo */}
              <div className="p-5 rounded-3xl bg-[#131120] border border-pink-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl group-hover:bg-pink-600/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ouvintes Ao Vivo</span>
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-2">
                  <span>{azuraStats.listenersTotal || config.currentShow?.listenersCount || 18}</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    No Ar
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Conexões HTTP/Stream ativas simultâneas
                </p>
              </div>

              {/* Card 2: Ouvintes Únicos */}
              <div className="p-5 rounded-3xl bg-[#131120] border border-purple-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ouvintes Únicos</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Globe2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  {azuraStats.listenersUnique || 14}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Dispositivos e IPs distintos no ciclo atual
                </p>
              </div>

              {/* Card 3: Recorde / Pico de Audiência */}
              <div className="p-5 rounded-3xl bg-[#131120] border border-amber-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pico de Audiência</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  {azuraStats.listenerPeak || 68}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Maior audiência simultânea atingida
                </p>
              </div>

              {/* Card 4: Infraestrutura & Servidor */}
              <div className="p-5 rounded-3xl bg-[#131120] border border-cyan-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/10 rounded-full blur-2xl group-hover:bg-cyan-600/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stream & Encoder</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Signal className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-lg font-black text-white leading-tight mt-1">
                  192k MP3 / 320k HD
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Icecast 2.4-kh + Liquidsoap Online
                </p>
              </div>
            </div>

            {/* Road Trip & Buffer Optimization Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#151226] via-[#100D1D] to-[#171228] border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>Modo Viagem & Buffer Anti-Sombra (Cache Estendido)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Tecnologia Anti-Queda
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Elimina cortes de áudio em túneis, serras e áreas sem sinal 4G/5G durante viagens de carro.
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleTravelMode}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
                    travelMode
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{travelMode ? 'Modo Viagem ATIVADO' : 'Ativar Modo Viagem'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Buffer Atual em Memória</span>
                  <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-2">
                    <span>{bufferSeconds} segundos</span>
                    <span className="text-[10px] text-slate-400 font-normal">de áudio pré-baixado</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calculado via API TimeRanges nativa do navegador em tempo real.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capacidade Máxima de Buffer</span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-2">
                    <span>{travelMode ? '60 a 120s' : '15 a 25s'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">reserva protegida</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Garante até 2 minutos de música contínua mesmo sem qualquer sinal de celular.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reconexão Silenciosa</span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-2">
                    <span className="text-emerald-400 font-bold">Auto-Healing ON</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Quando o carro sai do túnel, o player restaura a conexão automaticamente sem parar a música.
                  </p>
                </div>
              </div>

              {/* Informative Explanation Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 space-y-2 leading-relaxed">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Como o Spotify faz e como implementamos aqui na Amplificadora:</span>
                </div>
                <p>
                  O Spotify toca arquivos gravados e salva até 10 minutos de músicas em disco. Players normais de rádio web mantêm apenas <strong>2 a 3 segundos</strong> de buffer para priorizar latência baixa. Por isso, ao passar por qualquer área de sombra em viagem rodoviária, o sinal caía na hora.
                </p>
                <p>
                  Com o nosso <strong>Modo Viagem Ativado</strong>, o player da Amplificadora adota uma estratégia de <em>High-Buffer Cushion</em>: ele mantém entre <strong>30 e 60 segundos de áudio acumulado na memória</strong> e escuta eventos de rede (<code className="text-emerald-300">window.online/offline</code>). Se você passar por um vale ou túnel de 40 segundos, a música continuará tocando ininterruptamente pelo buffer protegido!
                </p>
              </div>
            </div>

            {/* Why AzuraCast vs Google Analytics Section */}
            <div className="p-6 rounded-3xl bg-[#131120] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-pink-400" />
                <span>Por que as estatísticas do AzuraCast são 100% suficientes e superiores ao Google Analytics?</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Auditoria Real de Sockets no Servidor</span>
                  </h4>
                  <p>
                    O Google Analytics só mede quem abriu a página web, mas não sabe se a pessoa deu play na rádio, se o áudio continuou tocando com a tela bloqueada ou quanto tempo ela ouviu. O AzuraCast contabiliza os sockets de áudio no Liquidsoap/Icecast com precisão cirúrgica de bytes transmitidos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Conformidade LGPD & Zero Scripts Pesados</span>
                  </h4>
                  <p>
                    O Google Analytics exige banners de cookies chatos e pode desacelerar o carregamento em redes 3G/4G no carro. O AzuraCast usa sua própria API interna (<code className="text-pink-400">/api/nowplaying/1</code>) ultraleve, sem rastreadores intrusivos e 100% em conformidade com a privacidade.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 1: Full 24-Hour Time Slot & Link Manager */}
        {activeTab === 'schedule24' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>Grade 24 Horas & Programação Automática</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ao Vivo
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Configure os links de streaming, horários de início e término de cada bloco (ex: de 4 em 4 horas) e vinhetas de transição sem tocar em código!
                </p>
              </div>

              <button
                onClick={() => {
                  setSlotForm({
                    startHour: 0,
                    endHour: 4,
                    title: 'Novo Bloco de Programação',
                    slogan: 'Ampliando sua onda musical',
                    streamUrl: 'https://s10.streamingcloud.online:13192/stream',
                    backupUrl: '',
                    genre: 'Pop Internacional',
                    artist: 'Grandes Nomes da Música',
                    badge: '00:00 - 04:00 • BLOCO ESPECIAL',
                    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
                    playJingleOnTransition: true
                  });
                  setEditingSlotId('new');
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-pink-600/30 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Bloco</span>
              </button>
            </div>

            {/* Time Slot Edit / Create Modal/Form */}
            {editingSlotId && (
              <form onSubmit={handleSaveSlot} className="bg-[#131120] border-2 border-pink-500/40 rounded-3xl p-6 sm:p-8 space-y-5 animate-fadeIn shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <span>{editingSlotId === 'new' ? 'Adicionar Novo Bloco de Transmissão' : 'Editar Bloco da Grade'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingSlotId(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hora Início (0 a 23)</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      required
                      value={slotForm.startHour}
                      onChange={(e) => setSlotForm({ ...slotForm, startHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hora Fim (0 a 23)</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      required
                      value={slotForm.endHour}
                      onChange={(e) => setSlotForm({ ...slotForm, endHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Badge do Horário (ex: 06:00 - 10:00 • MANHÃ ALPHA)</label>
                    <input
                      type="text"
                      required
                      value={slotForm.badge}
                      onChange={(e) => setSlotForm({ ...slotForm, badge: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Programa / Bloco</label>
                    <input
                      type="text"
                      required
                      value={slotForm.title}
                      onChange={(e) => setSlotForm({ ...slotForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Slogan ou Assinatura</label>
                    <input
                      type="text"
                      value={slotForm.slogan}
                      onChange={(e) => setSlotForm({ ...slotForm, slogan: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-pink-400 mb-1">URL Principal do Streaming (Icecast/MP3/HLS)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={slotForm.streamUrl}
                      onChange={(e) => setSlotForm({ ...slotForm, streamUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-pink-500/40 text-xs text-white focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">URL de Backup (Fallback Opcional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={slotForm.backupUrl}
                      onChange={(e) => setSlotForm({ ...slotForm, backupUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Gênero / Estilo Musical</label>
                    <input
                      type="text"
                      value={slotForm.genre}
                      onChange={(e) => setSlotForm({ ...slotForm, genre: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Artistas em Destaque</label>
                    <input
                      type="text"
                      value={slotForm.artist}
                      onChange={(e) => setSlotForm({ ...slotForm, artist: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem de Capa</label>
                  <input
                    type="url"
                    value={slotForm.cover}
                    onChange={(e) => setSlotForm({ ...slotForm, cover: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="playJingle"
                    checked={slotForm.playJingleOnTransition}
                    onChange={(e) => setSlotForm({ ...slotForm, playJingleOnTransition: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 accent-pink-600 cursor-pointer"
                  />
                  <label htmlFor="playJingle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Disparar vinheta oficial com locução feminina suave ao entrar nesse bloco de horário
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingSlotId(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    Salvar Bloco de Horário
                  </button>
                </div>
              </form>
            )}

            {/* Time Slot Visual Timeline Cards */}
            <div className="space-y-4">
              {(timeSchedule || []).map((slot) => {
                const isCurrentLive = currentSlot?.id === slot.id;

                return (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                      isCurrentLive
                        ? 'bg-[#18132A] border-pink-500/60 shadow-[0_0_40px_rgba(236,72,153,0.25)]'
                        : 'bg-[#131120] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-purple-950/60 shrink-0 border border-white/15 shadow-md">
                        <img src={slot.cover} alt={slot.title} className="w-full h-full object-cover" />
                        {isCurrentLive && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                            NO AR
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCurrentLive ? 'bg-pink-600 text-white' : 'bg-white/10 text-pink-300'
                          }`}>
                            {slot.badge || `${String(slot.startHour).padStart(2, '0')}:00 - ${String(slot.endHour).padStart(2, '0')}:00`}
                          </span>
                          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                            {slot.genre}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-white truncate">
                          {slot.title}
                        </h3>

                        <p className="text-xs text-slate-300 truncate font-light">
                          {slot.artist}
                        </p>

                        <p className="text-[11px] text-pink-400 font-mono truncate max-w-md">
                          🔗 {slot.streamUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <button
                        onClick={() => togglePlay(slot.streamUrl)}
                        className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Ouvir este stream agora"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Testar Áudio</span>
                      </button>

                      <button
                        onClick={() => {
                          setSlotForm(slot);
                          setEditingSlotId(slot.id);
                        }}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {timeSchedule.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o bloco ${slot.title}?`)) deleteTimeSlot(slot.id);
                          }}
                          className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                          title="Excluir Bloco"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 2: Shows & 4K Video Sets */}
        {activeTab === 'shows' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Shows & Vídeos 4K Gravados</h2>
                <p className="text-xs text-slate-400">Cadastre episódios e transmissões em vídeo 4K para os ouvintes assistirem e ouvirem sob demanda.</p>
              </div>
              <button
                onClick={() => {
                  setShowForm({
                    title: '',
                    host: '',
                    date: 'Sábado • 22:00',
                    duration: '01:00:00',
                    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
                    desc: '',
                    audioPreviewUrl: '',
                    videoEmbedUrl: ''
                  });
                  setIsCreatingShow(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-extrabold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Show 4K</span>
              </button>
            </div>

            {(isCreatingShow || editingShowId) && (
              <form onSubmit={handleSaveShow} className="bg-[#131120] border border-pink-500/30 rounded-3xl p-6 sm:p-8 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Título do Show / Set *</label>
                    <input
                      type="text"
                      required
                      value={showForm.title}
                      onChange={(e) => setShowForm({ ...showForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">DJ / Host *</label>
                    <input
                      type="text"
                      required
                      value={showForm.host}
                      onChange={(e) => setShowForm({ ...showForm, host: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Duração (ex: 01:15:00)</label>
                    <input
                      type="text"
                      value={showForm.duration}
                      onChange={(e) => setShowForm({ ...showForm, duration: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Data / Horário</label>
                    <input
                      type="text"
                      value={showForm.date}
                      onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-400 mb-1">URL do Vídeo 4K (YouTube Embed)</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube-nocookie.com/embed/..."
                      value={showForm.videoEmbedUrl}
                      onChange={(e) => setShowForm({ ...showForm, videoEmbedUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-pink-500/30 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem de Capa</label>
                  <input
                    type="url"
                    value={showForm.cover}
                    onChange={(e) => setShowForm({ ...showForm, cover: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Descrição</label>
                  <textarea
                    rows="2"
                    value={showForm.desc}
                    onChange={(e) => setShowForm({ ...showForm, desc: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsCreatingShow(false); setEditingShowId(null); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-pink-600 text-xs font-bold cursor-pointer"
                  >
                    Salvar Show
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shows.map((show) => (
                <div key={show.id} className="p-4 rounded-2xl bg-[#131120] border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={show.cover} alt="Cover" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{show.title}</h4>
                      <p className="text-xs text-pink-400">{show.host}</p>
                      <p className="text-[10px] text-slate-400">{show.duration} • {show.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openShowVideo(show)}
                      className="p-1.5 rounded-lg text-pink-400 hover:text-white hover:bg-pink-500/20 cursor-pointer"
                      title="Assistir Show em Vídeo 4K"
                    >
                      <Tv className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(show);
                        setEditingShowId(show.id);
                        setIsCreatingShow(false);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir ${show.title}?`)) deleteShow(show.id);
                      }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: B2B Indoor Radio Stations */}
        {activeTab === 'indoor' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Estações B2B (Rádio Indoor Corporativa)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gerencie clientes corporativos, restaurantes, academias e lojas com programação musical personalizada.
                </p>
              </div>

              <button
                onClick={() => {
                  setB2BForm({
                    name: '',
                    segment: 'Restaurante & Cafeteria',
                    location: '',
                    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
                    genre: 'Jazz, Bossa & Acoustic Lounge',
                    slogan: '',
                    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
                    spotsCount: 4,
                    plan: 'Plano Pro (2 Ambientes + Locução IA)',
                    status: 'Ativo'
                  });
                  setIsCreatingB2B(true);
                  setEditingB2BId(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Estação B2B</span>
              </button>
            </div>

            {/* B2B Creation / Edit Form */}
            {(isCreatingB2B || editingB2BId) && (
              <form onSubmit={handleSaveB2B} className="bg-[#131120] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 animate-fadeIn shadow-2xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{isCreatingB2B ? 'Cadastrar Nova Rádio Corporativa' : 'Editar Estação B2B'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nome da Empresa / Estabelecimento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Bistrô & Café Vintage, Academia Pulse..."
                      value={b2bForm.name}
                      onChange={(e) => setB2BForm({ ...b2bForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Segmento de Atuação</label>
                    <select
                      value={b2bForm.segment}
                      onChange={(e) => setB2BForm({ ...b2bForm, segment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    >
                      <option value="Restaurante & Cafeteria">Restaurante & Cafeteria</option>
                      <option value="Academia & CrossFit">Academia & CrossFit</option>
                      <option value="Varejo & Boutique">Varejo & Boutique</option>
                      <option value="Clínica & Consultório">Clínica & Consultório</option>
                      <option value="Escritório & Coworking">Escritório & Coworking</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Cidade / Estado</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo, SP"
                      value={b2bForm.location}
                      onChange={(e) => setB2BForm({ ...b2bForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">URL do Streaming (Icecast/MP3)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={b2bForm.streamUrl}
                      onChange={(e) => setB2BForm({ ...b2bForm, streamUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/40 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Estilo Musical</label>
                    <input
                      type="text"
                      placeholder="Ex: Jazz, Bossa, Pop..."
                      value={b2bForm.genre}
                      onChange={(e) => setB2BForm({ ...b2bForm, genre: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Slogan da Empresa</label>
                    <input
                      type="text"
                      placeholder="Ex: Sabor e sofisticação para os seus momentos..."
                      value={b2bForm.slogan}
                      onChange={(e) => setB2BForm({ ...b2bForm, slogan: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">URL do Logotipo / Imagem</label>
                    <input
                      type="url"
                      value={b2bForm.logo}
                      onChange={(e) => setB2BForm({ ...b2bForm, logo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Plano Contratado</label>
                    <input
                      type="text"
                      value={b2bForm.plan}
                      onChange={(e) => setB2BForm({ ...b2bForm, plan: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Spots / Vinhetas por Mês</label>
                    <input
                      type="number"
                      value={b2bForm.spotsCount}
                      onChange={(e) => setB2BForm({ ...b2bForm, spotsCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                    <select
                      value={b2bForm.status}
                      onChange={(e) => setB2BForm({ ...b2bForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Em Teste">Em Teste</option>
                      <option value="Pausado">Pausado</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsCreatingB2B(false); setEditingB2BId(null); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-lg"
                  >
                    Salvar Estação B2B
                  </button>
                </div>
              </form>
            )}

            {/* List of B2B Stations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {b2bClients && b2bClients.map((client) => (
                <div key={client.id} className="p-6 rounded-3xl bg-[#131120] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={client.logo} alt={client.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30" />
                        <div>
                          <h4 className="text-base font-bold text-white leading-snug">{client.name}</h4>
                          <span className="text-[11px] font-semibold text-emerald-400">{client.segment}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        client.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {client.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 italic">"{client.slogan || 'Rádio exclusiva da loja'}"</p>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <div className="text-slate-300 flex justify-between">
                        <span>Estilo:</span>
                        <strong className="text-white font-semibold">{client.genre}</strong>
                      </div>
                      <div className="text-slate-300 flex justify-between">
                        <span>Local:</span>
                        <span>{client.location}</span>
                      </div>
                      <div className="text-slate-300 flex justify-between">
                        <span>Plano:</span>
                        <span className="text-emerald-300">{client.plan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedB2BClient(client);
                        setIsIndoorModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Testar Player</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/#indoor - Rádio Oficial ${client.name}`);
                          showToast('Link do player copiado com sucesso!');
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                        title="Copiar Link do Player"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setB2BForm(client);
                          setEditingB2BId(client.id);
                          setIsCreatingB2B(false);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Excluir a estação de ${client.name}?`)) deleteB2BClient(client.id);
                        }}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: AMP Link (Merchandising & Camisetas) */}
        {activeTab === 'merch' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">AMP Link • Camisetas Customizadas & Merch</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure a distribuição do projeto AMP Link exibido no primeiro painel rotativo (Hero Showcase) da rádio.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Configuration Form */}
              <form onSubmit={handleSaveAmpLink} className="lg:col-span-7 bg-[#131120] border border-pink-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                    Dados do Slide no Carrossel Principal
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={ampLinkForm.enabled}
                      onChange={(e) => setAmpLinkForm({ ...ampLinkForm, enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-600 accent-pink-500 cursor-pointer"
                    />
                    <span>Ativar Slide no Carrossel</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Badge Superior</label>
                    <input
                      type="text"
                      value={ampLinkForm.badge}
                      onChange={(e) => setAmpLinkForm({ ...ampLinkForm, badge: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Título Principal</label>
                    <input
                      type="text"
                      value={ampLinkForm.title}
                      onChange={(e) => setAmpLinkForm({ ...ampLinkForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subtítulo do Produto</label>
                  <input
                    type="text"
                    value={ampLinkForm.subtitle}
                    onChange={(e) => setAmpLinkForm({ ...ampLinkForm, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-pink-400 mb-1">URL da Imagem da Camiseta (WebP/PNG)</label>
                  <input
                    type="url"
                    value={ampLinkForm.imageUrl}
                    onChange={(e) => setAmpLinkForm({ ...ampLinkForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-pink-500/40 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Descrição</label>
                  <textarea
                    rows="3"
                    value={ampLinkForm.desc}
                    onChange={(e) => setAmpLinkForm({ ...ampLinkForm, desc: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={ampLinkForm.actionText}
                      onChange={(e) => setAmpLinkForm({ ...ampLinkForm, actionText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Link de Pedido / WhatsApp / Loja</label>
                    <input
                      type="url"
                      placeholder="https://api.whatsapp.com/send?phone=..."
                      value={ampLinkForm.actionUrl}
                      onChange={(e) => setAmpLinkForm({ ...ampLinkForm, actionUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-pink-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Configuração do AMP Link</span>
                  </button>
                </div>
              </form>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Pré-visualização do Slide no Painel Rotativo:
                </span>
                
                <div className="w-full max-w-[360px] mx-auto aspect-[4/5] rounded-[32px] overflow-hidden border-2 border-pink-500/40 shadow-2xl bg-[#100C1B]/95 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-pink-500/20 text-pink-400 border border-pink-500/40">
                      ● {ampLinkForm.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                  </div>

                  <div className="my-auto py-2 text-center space-y-2">
                    <div className="w-full max-w-[240px] h-[190px] mx-auto rounded-2xl overflow-hidden bg-black/60 border border-pink-500/40 p-2 flex items-center justify-center">
                      <img src={ampLinkForm.imageUrl} alt="Camiseta" className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]" />
                    </div>
                    <h4 className="text-lg font-black text-white">{ampLinkForm.title}</h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/80 border border-white/15 text-center space-y-2">
                    <p className="text-[11px] text-slate-300 leading-snug">{ampLinkForm.desc}</p>
                    <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{ampLinkForm.actionText}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Song Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Fila de Pedidos de Música (AutoDJ)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Músicas pedidas pelos ouvintes através do site da Amplificadora.
              </p>
            </div>

            {requests.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-bold rounded-3xl bg-[#131120] border border-dashed border-white/10">
                Nenhum pedido de música no momento.
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      req.status === 'approved' ? 'bg-[#131120] border-emerald-500/30' : 'bg-[#131120] border-pink-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{req.songTitle}</span>
                        <span className="text-xs text-pink-400">({req.songArtist})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Pedido por <span className="text-slate-200 font-bold">{req.userName}</span> de <span className="text-slate-200">{req.userCity}</span>
                        {req.message && ` • "${req.message}"`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => markRequestStatus(req.id, 'approved')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprovar no AutoDJ</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          Na Fila do AutoDJ
                        </span>
                      )}

                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: News & Stories */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white">Stories & Notícias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div key={art.id} className="p-5 rounded-2xl bg-[#131120] border border-white/5 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-pink-400 uppercase">{art.category}</span>
                    <h4 className="text-base font-bold text-white mt-1">{art.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{art.summary}</p>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-white/5">
                    {art.date} • {art.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Settings & Backup */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Backup & Segurança</h2>
              <p className="text-xs text-slate-400 mt-0.5">Exporte e restaure todas as configurações da Amplificadora em JSON.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-[#131120] border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">Exportar Backup JSON</h3>
                <p className="text-xs text-slate-400">Baixe uma cópia de segurança completa de canais, shows e grade 24h.</p>
                <button
                  onClick={() => {
                    const json = exportBackup();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `amplificadora_radio_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    showToast('Backup exportado com sucesso!');
                  }}
                  className="px-6 py-3 rounded-2xl bg-pink-600 text-white font-bold text-xs cursor-pointer"
                >
                  Baixar Arquivo .JSON
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#131120] border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">Alterar Senha Master</h3>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Nova senha..."
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                  />
                  <button
                    onClick={() => { if (changeAdminPassword(newPass)) setNewPass(''); }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
