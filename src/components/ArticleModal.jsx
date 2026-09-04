import React from 'react';
import { useRadio } from '../context/RadioContext';
import { X, Calendar, MessageCircle, Instagram, Facebook, Link2, Sparkles, Check } from 'lucide-react';

export function ArticleModal() {
  const { readingArticle, setReadingArticle, showToast, config } = useRadio();

  if (!readingArticle) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://amplificadora.com.br';
  const shareText = `${readingArticle.title} — Confira na Rádio Amplificadora (${config.slogan})`;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${readingArticle.title}*\n\n${readingArticle.summary || ''}\n\nLeia mais na Amplificadora (${config.slogan}):\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(`${readingArticle.title}\n\n${readingArticle.summary || ''}\n\nOuça na Amplificadora: ${currentUrl}`);
    showToast('Texto copiado para o seu Instagram!');
    if (config.social?.instagram) window.open(config.social.instagram, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    showToast('Link da notícia copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#131120] border border-pink-500/30 text-white rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
        
        <button
          onClick={() => setReadingArticle(null)}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-purple-950/40 border border-white/10">
            <img src={readingArticle.cover} alt={readingArticle.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-pink-600 text-white shadow-lg">
                {readingArticle.category}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                {readingArticle.date}
              </span>
              <span>•</span>
              <span>Por {readingArticle.author || 'Curadoria Amplificadora'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {readingArticle.title}
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line border-t border-white/10 pt-6">
            {readingArticle.content}
          </div>

          {/* Social Share Multi-Channel */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-extrabold text-slate-300">Compartilhar Notícia:</span>
            
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareInstagram}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all shadow"
                title="Compartilhar no Instagram"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={handleShareFacebook}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
                title="Compartilhar no Facebook"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all"
                title="Copiar Link"
              >
                <Link2 className="w-4 h-4" />
                <span>Copiar Link</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
