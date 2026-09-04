import React from 'react';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Volume2, 
  VolumeX, 
  Share2, 
  ArrowLeft 
} from 'lucide-react';

export function NewsDetailModal() {
  const { selectedNews, setSelectedNews, showToast } = useApae();
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  if (!selectedNews) return null;

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${selectedNews.title}. Por ${selectedNews.author}. ${selectedNews.content}`);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link da notícia copiado para a área de transferência!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header Imagem */}
        <div className="h-64 overflow-hidden relative flex-shrink-0">
          <img
            src={selectedNews.image}
            alt={selectedNews.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={() => {
              stopSpeaking();
              setSelectedNews(null);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-apae-blue-600 text-white mb-2 inline-block">
              {selectedNews.category}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              {selectedNews.title}
            </h3>
          </div>
        </div>

        {/* Metadados e Ferramentas de Leitura */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {selectedNews.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {selectedNews.author}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Ouvir notícia lida em voz alta"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-apae-blue-600" />}
              <span>{isSpeaking ? 'Parar Leitura' : 'Ouvir Notícia'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
              title="Compartilhar matéria"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Textual com Scroll */}
        <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
          {selectedNews.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              stopSpeaking();
              setSelectedNews(null);
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Fechar Notícia
          </button>
        </div>

      </div>
    </div>
  );
}
