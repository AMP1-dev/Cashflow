import React, { useState, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import { X, Play, Pause, Clock, Headphones, Share2, Sparkles, Tv, ExternalLink, Radio } from 'lucide-react';
import { formatYouTubeEmbed } from '../data/radioData';

export function ShowDetailModal() {
  const { selectedShow, setSelectedShow, togglePlay, isPlaying, showToast } = useRadio();
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'info'

  // Pause live radio stream when opening video modal to prevent audio overlap
  useEffect(() => {
    if (selectedShow && isPlaying) {
      togglePlay();
    }
  }, [selectedShow]);

  if (!selectedShow) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#shows - Assista ao show ${selectedShow.title} na Amplificadora!`);
    showToast('Link do show copiado com sucesso!');
  };

  const videoUrl = formatYouTubeEmbed(selectedShow.videoEmbedUrl || 'https://www.youtube-nocookie.com/embed/Hhws7b94jE8?autoplay=1');
  const rawYouTubeUrl = selectedShow.videoEmbedUrl?.replace('embed/', 'watch?v=').replace('youtube-nocookie.com', 'youtube.com').split('?')[0] || 'https://youtube.com';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#120F1D] border-2 border-pink-500/40 text-white rounded-3xl shadow-[0_0_60px_rgba(236,72,153,0.3)] p-5 sm:p-8 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedShow(null)}
          className="absolute top-5 right-5 p-2.5 rounded-full text-slate-300 hover:text-white bg-black/60 hover:bg-pink-600 transition-all z-20 border border-white/15"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          {/* Header & Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3 pr-12">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-pink-500/20 text-pink-400 border border-pink-500/40">
                ● {selectedShow.host || 'ESTÚDIO MASTER'}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {selectedShow.date}
              </span>
            </div>

            {/* Video / Info Mode Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'video' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Vídeo 4K</span>
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'info' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Detalhes</span>
              </button>
            </div>
          </div>

          {/* Embedded HD Video Player */}
          {activeTab === 'video' && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-pink-500/30 shadow-2xl">
              <iframe
                src={videoUrl}
                title={selectedShow.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Audio / Cover Art Mode */}
          {activeTab === 'info' && (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-black/40 p-5 rounded-2xl border border-white/10">
              <div className="w-36 h-36 rounded-2xl overflow-hidden bg-purple-950/50 shrink-0 border border-pink-500/40 shadow-xl">
                <img src={selectedShow.cover} alt={selectedShow.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl font-black text-white leading-tight">
                  {selectedShow.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedShow.desc}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-pink-300 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    {selectedShow.duration || '01:00:00'}
                  </span>
                  <span>•</span>
                  <span>Transmissão Oficial Amplificadora HD</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div>
              <h3 className="text-base font-bold text-white leading-snug">{selectedShow.title}</h3>
              <p className="text-xs text-slate-400 font-medium">Assista em tela cheia no player ou abra no YouTube.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={rawYouTubeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver no YouTube</span>
              </a>

              <button
                onClick={() => {
                  setSelectedShow(null);
                  togglePlay();
                }}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                title="Voltar para a Rádio"
              >
                <Radio className="w-4 h-4 text-pink-400" />
                <span>Voltar à Rádio</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
