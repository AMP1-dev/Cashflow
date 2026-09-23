import React, { useState } from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Share2,
  Calendar,
  Settings,
  RotateCcw,
  Save,
  Sparkles,
  FileText,
  Sliders
} from 'lucide-react';

export function AdminPanel() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    clubConfig,
    setClubConfig,
    heroSlides,
    updateHeroSlide,
    publications,
    addPublication,
    updatePublication,
    deletePublication,
    events,
    addEvent,
    deleteEvent,
    setSharePublication,
    resetToFactoryData,
    showToast
  } = usePalmeirense();

  const [activeTab, setActiveTab] = useState('publicacoes');

  // Estados Form Publicação
  const [editingPubId, setEditingPubId] = useState(null);
  const [pubTitle, setPubTitle] = useState('');
  const [pubCategory, setPubCategory] = useState('Bailes & Shows');
  const [pubSummary, setPubSummary] = useState('');
  const [pubContent, setPubContent] = useState('');
  const [pubImageUrl, setPubImageUrl] = useState('');
  const [pubAuthor, setPubAuthor] = useState('Diretoria Social');

  // Estados Form Evento
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDate, setNewEvtDate] = useState('');
  const [newEvtTime, setNewEvtTime] = useState('22:00');
  const [newEvtLocation, setNewEvtLocation] = useState('Salão Social Monumental');
  const [newEvtBadge, setNewEvtBadge] = useState('Baile & Show');
  const [newEvtDesc, setNewEvtDesc] = useState('');

  const imagePresets = [
    { label: "Bailes & Shows", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80" },
    { label: "Noite & Boate", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" },
    { label: "Parque Aquático", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80" },
    { label: "Futebol & Society", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80" },
    { label: "Tênis de Saibro", url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80" },
    { label: "Academia & Saúde", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80" },
    { label: "Tradição 1908", url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80" }
  ];

  if (!isAdminOpen) return null;

  const startEditPublication = (p) => {
    setEditingPubId(p.id);
    setPubTitle(p.title);
    setPubCategory(p.category);
    setPubSummary(p.summary);
    setPubContent(p.content);
    setPubImageUrl(p.imageUrl);
    setPubAuthor(p.author);
  };

  const cancelEditPublication = () => {
    setEditingPubId(null);
    setPubTitle('');
    setPubSummary('');
    setPubContent('');
    setPubImageUrl('');
  };

  const handleSavePublication = (e) => {
    e.preventDefault();
    if (!pubTitle || !pubSummary) {
      showToast('Por favor, informe título e resumo.', 'error');
      return;
    }

    const payload = {
      title: pubTitle,
      category: pubCategory,
      summary: pubSummary,
      content: pubContent || pubSummary,
      imageUrl: pubImageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      author: pubAuthor || 'Diretoria Social'
    };

    if (editingPubId) {
      updatePublication(editingPubId, payload);
    } else {
      addPublication(payload);
    }
    cancelEditPublication();
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvtTitle || !newEvtDate) {
      showToast('Informe o nome e data do evento.', 'error');
      return;
    }

    addEvent({
      title: newEvtTitle,
      date: newEvtDate,
      time: newEvtTime,
      location: newEvtLocation,
      badge: newEvtBadge,
      description: newEvtDesc || newEvtTitle,
      status: "Confirmado"
    });

    setNewEvtTitle('');
    setNewEvtDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101016] text-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden border border-white/15">
        {/* Topo do Painel */}
        <div className="bg-[#08080C] px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo-ecp.png" alt="ECP" className="w-9 h-9 object-contain" />
            <div>
              <h2 className="text-base font-black font-syne uppercase">Painel Administrativo ECP</h2>
              <p className="text-[11px] text-zinc-400">Publicações, Banners, Eventos e Contatos Oficiais</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToFactoryData}
              className="text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-800/50 flex items-center gap-1.5 transition-colors"
              title="Restaurar dados originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Originais</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-[#0C0C12] border-b border-white/10 px-6 flex items-center gap-2 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveTab('publicacoes')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'publicacoes'
                ? 'border-red-600 text-white bg-[#14141E] rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-red-500" />
            <span>Publicações & Compartilhar ({publications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hero'
                ? 'border-red-600 text-white bg-[#14141E] rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-red-500" />
            <span>Banners do Hero ({heroSlides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('eventos')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'eventos'
                ? 'border-red-600 text-white bg-[#14141E] rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-red-500" />
            <span>Agenda de Eventos ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-red-600 text-white bg-[#14141E] rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-red-500" />
            <span>Configurações & Contatos</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#101016]">
          {/* ABA 1: PUBLICAÇÕES */}
          {activeTab === 'publicacoes' && (
            <div className="space-y-8">
              {/* Form */}
              <div className="bg-[#14141E] rounded-2xl p-6 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black font-syne uppercase text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>{editingPubId ? 'Editar Publicação' : 'Criar Nova Publicação para o Site e Redes'}</span>
                  </h3>
                  {editingPubId && (
                    <button
                      onClick={cancelEditPublication}
                      className="text-xs text-red-400 hover:underline font-bold"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePublication} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                        Título da Publicação *
                      </label>
                      <input
                        type="text"
                        required
                        value={pubTitle}
                        onChange={(e) => setPubTitle(e.target.value)}
                        placeholder="Ex: Grande Baile do Hawai com Mega Estrutura de Som e Luz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                        Categoria
                      </label>
                      <select
                        value={pubCategory}
                        onChange={(e) => setPubCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#1B1B26] text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                      >
                        <option value="Bailes & Shows">Bailes & Shows</option>
                        <option value="Esportes">Esportes</option>
                        <option value="Institucional">Institucional</option>
                        <option value="Escolinhas & Família">Escolinhas & Família</option>
                        <option value="Melhorias">Melhorias & Obras</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                      Resumo da Publicação (usado no card e nas mensagens do WhatsApp/Facebook) *
                    </label>
                    <textarea
                      rows="2"
                      required
                      value={pubSummary}
                      onChange={(e) => setPubSummary(e.target.value)}
                      placeholder="Breve resumo que chama atenção para ler e compartilhar..."
                      className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                      Conteúdo Completo (Texto da matéria)
                    </label>
                    <textarea
                      rows="4"
                      value={pubContent}
                      onChange={(e) => setPubContent(e.target.value)}
                      placeholder="Escreva os detalhes, trajes, reserva de mesas..."
                      className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 font-mono">
                        URL da Imagem de Capa
                      </label>
                      <span className="text-[10px] text-zinc-500">Sugestões rápidas abaixo</span>
                    </div>
                    <input
                      type="url"
                      value={pubImageUrl}
                      onChange={(e) => setPubImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPubImageUrl(preset.url)}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-300 transition-colors border border-white/10"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    {editingPubId && (
                      <button
                        type="button"
                        onClick={cancelEditPublication}
                        className="px-4 py-2.5 rounded-xl border border-white/20 text-zinc-300 font-bold text-xs"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(229,25,34,0.4)] transition-all border border-red-500/50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPubId ? 'Salvar Alterações' : 'Publicar Agora'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Lista */}
              <div>
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 font-mono">
                  Publicações Ativas ({publications.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publications.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#14141E] rounded-2xl p-4 border border-white/10 shadow-sm flex gap-4 items-center justify-between"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-2 py-0.5 rounded inline-block mb-1 font-mono">
                          {p.category} • {p.date}
                        </span>
                        <h5 className="font-bold text-white text-xs line-clamp-1">
                          {p.title}
                        </h5>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          {p.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setIsAdminOpen(false);
                            setSharePublication(p);
                          }}
                          className="p-2 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 transition-colors border border-red-800/40"
                          title="Compartilhar"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => startEditPublication(p)}
                          className="p-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors border border-white/10"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir "${p.title}"?`)) {
                              deletePublication(p.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 transition-colors border border-rose-800/40"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <p className="text-xs text-zinc-400">
                Altere aqui os títulos de impacto e imagens de alta resolução que aparecem no topo do site.
              </p>

              {heroSlides.map((slide, idx) => (
                <div key={slide.id} className="bg-[#14141E] rounded-2xl p-6 border border-white/10 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-syne font-black text-sm text-white uppercase">
                      Slide {idx + 1}: {slide.badge}
                    </span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/40">
                      {slide.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                        Título Principal
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateHeroSlide(slide.id, { title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                        Badge / Categoria
                      </label>
                      <input
                        type="text"
                        value={slide.badge}
                        onChange={(e) => updateHeroSlide(slide.id, { badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Subtítulo
                    </label>
                    <textarea
                      rows="2"
                      value={slide.subtitle}
                      onChange={(e) => updateHeroSlide(slide.id, { subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      URL da Imagem de Fundo (1920x1080)
                    </label>
                    <input
                      type="url"
                      value={slide.imageUrl}
                      onChange={(e) => updateHeroSlide(slide.id, { imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ABA 3: EVENTOS */}
          {activeTab === 'eventos' && (
            <div className="space-y-6">
              <div className="bg-[#14141E] rounded-2xl p-6 border border-white/10 shadow-sm">
                <h3 className="text-sm font-black font-syne uppercase text-white mb-4">
                  Adicionar Evento à Agenda
                </h3>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Nome do Baile / Evento *
                    </label>
                    <input
                      type="text"
                      required
                      value={newEvtTitle}
                      onChange={(e) => setNewEvtTitle(e.target.value)}
                      placeholder="Ex: Baile do Hawai 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Data *
                    </label>
                    <input
                      type="text"
                      required
                      value={newEvtDate}
                      onChange={(e) => setNewEvtDate(e.target.value)}
                      placeholder="Ex: Outubro / Sábado 22h"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Horário
                    </label>
                    <input
                      type="text"
                      value={newEvtTime}
                      onChange={(e) => setNewEvtTime(e.target.value)}
                      placeholder="Ex: 23:00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Local
                    </label>
                    <input
                      type="text"
                      value={newEvtLocation}
                      onChange={(e) => setNewEvtLocation(e.target.value)}
                      placeholder="Salão Social Monumental"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Selo / Categoria
                    </label>
                    <input
                      type="text"
                      value={newEvtBadge}
                      onChange={(e) => setNewEvtBadge(e.target.value)}
                      placeholder="Tradição ECP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                      Descrição Resumida
                    </label>
                    <input
                      type="text"
                      value={newEvtDesc}
                      onChange={(e) => setNewEvtDesc(e.target.value)}
                      placeholder="Detalhes de atrações, bandas e mesas..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow transition-all border border-red-500/50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Evento</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Lista */}
              <div className="space-y-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#14141E] rounded-2xl p-4 border border-white/10 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/40">
                          {evt.badge}
                        </span>
                        <span className="text-xs font-bold text-zinc-400">
                          {evt.date} às {evt.time}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{evt.title}</h4>
                      <p className="text-xs text-zinc-400">{evt.description}</p>
                    </div>

                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="p-2 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 transition-colors border border-rose-800/40"
                      title="Remover Evento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 4: CONFIGURAÇÕES */}
          {activeTab === 'config' && (
            <div className="bg-[#14141E] rounded-2xl p-6 border border-white/10 shadow-sm space-y-4 max-w-2xl">
              <h3 className="text-sm font-black font-syne uppercase text-white border-b border-white/10 pb-3">
                Informações Institucionais do Clube
              </h3>

              <div>
                <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                  Nome do Clube
                </label>
                <input
                  type="text"
                  value={clubConfig.name}
                  onChange={(e) => setClubConfig({ ...clubConfig, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                  Slogan
                </label>
                <input
                  type="text"
                  value={clubConfig.slogan}
                  onChange={(e) => setClubConfig({ ...clubConfig, slogan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                    Telefone Fixo
                  </label>
                  <input
                    type="text"
                    value={clubConfig.phone}
                    onChange={(e) => setClubConfig({ ...clubConfig, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                    WhatsApp da Secretaria (DDI + DDD + Número)
                  </label>
                  <input
                    type="text"
                    value={clubConfig.whatsapp}
                    onChange={(e) => setClubConfig({ ...clubConfig, whatsapp: e.target.value, whatsappFormatted: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                    Instagram Oficial
                  </label>
                  <input
                    type="text"
                    value={clubConfig.instagram}
                    onChange={(e) => setClubConfig({ ...clubConfig, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-zinc-400 mb-1 font-mono">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={clubConfig.email}
                    onChange={(e) => setClubConfig({ ...clubConfig, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Configurações salvas com sucesso!')}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow transition-all border border-red-500/50"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
