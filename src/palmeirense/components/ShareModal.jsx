import React, { useState } from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  X,
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Check
} from 'lucide-react';

export function ShareModal() {
  const { sharePublication, setSharePublication, showToast } = usePalmeirense();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!sharePublication) return null;

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?app=palmeirense#publicacao-${sharePublication.id}`
    : `https://esporteclubepalmeirense.com/#publicacao-${sharePublication.id}`;

  const shareText = `*${sharePublication.title}*\n\n${sharePublication.summary}\n\nConfira no portal oficial do Esporte Clube Palmeirense:\n${currentUrl}`;
  
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(shareText);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePublication.title)}&url=${encodedUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    showToast('Link copiado para a área de transferência!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyInstagramCaption = () => {
    const igCaption = `${sharePublication.title}\n\n${sharePublication.summary}\n\n📍 Esporte Clube Palmeirense - Fundado em 1908\nSaiba mais no link da bio ou acesse: ${currentUrl}\n\n#ECP #EsporteClubePalmeirense #Palmeirense #StaCruzDasPalmeiras #TradicaoDesde1908`;
    navigator.clipboard.writeText(igCaption);
    setCopiedCaption(true);
    showToast('Legenda para Instagram copiada!');
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sharePublication.title,
          text: sharePublication.summary,
          url: currentUrl
        });
        showToast('Compartilhado com sucesso!');
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12121A] text-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-w-lg w-full overflow-hidden border border-white/15 flex flex-col max-h-[90vh]">
        {/* Topo do Modal */}
        <div className="bg-[#0A0A0E] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800/40">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base font-syne uppercase">Compartilhar Publicação</h3>
              <p className="text-[11px] text-zinc-400">Divulgue no WhatsApp, Face, Insta e mais</p>
            </div>
          </div>
          <button
            onClick={() => setSharePublication(null)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Card Preview */}
          <div className="flex gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/10">
            {sharePublication.imageUrl && (
              <img
                src={sharePublication.imageUrl}
                alt={sharePublication.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-sm"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="inline-block text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-2 py-0.5 rounded mb-1 font-mono">
                {sharePublication.category}
              </span>
              <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">
                {sharePublication.title}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                {sharePublication.summary}
              </p>
            </div>
          </div>

          {/* Botões de Redes */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-3 font-mono">
              Selecione a Rede Social:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 transition-all hover:scale-105 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 shadow">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase">WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700/40 transition-all hover:scale-105 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase">Facebook</span>
              </a>

              {/* Instagram */}
              <button
                onClick={handleCopyInstagramCaption}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-pink-950/40 hover:bg-pink-900/60 text-pink-300 border border-pink-700/40 transition-all hover:scale-105 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center mb-1.5 shadow">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase">Instagram</span>
              </button>

              {/* X / Twitter */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 transition-all hover:scale-105 group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center mb-1.5 shadow">
                  <Twitter className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase">Twitter</span>
              </a>
            </div>
          </div>

          {/* Feedback Instagram */}
          {copiedCaption && (
            <div className="p-3 bg-pink-950/60 border border-pink-700/50 rounded-xl text-xs text-pink-200 animate-fadeIn flex items-center gap-2">
              <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span>Legenda e hashtags copiadas! Abra o Instagram e cole na sua postagem.</span>
            </div>
          )}

          {/* Compartilhamento Nativo */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <Share2 className="w-4 h-4 text-red-500" />
              <span>Outros Aplicativos do seu Celular</span>
            </button>
          )}

          {/* Link para Copiar */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2 font-mono">
              Link Direto da Publicação:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/50 text-zinc-300 text-xs font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
