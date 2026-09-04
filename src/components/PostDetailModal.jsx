import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, User, Share2, Image as ImageIcon, Heart, Check, Copy, MessageCircle, Instagram } from 'lucide-react';

export function PostDetailModal() {
  const { readingPost, setReadingPost, setLightboxPhoto, setIsDonationOpen, showToast, siteConfig } = useApp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setReadingPost(null);
    };
    if (readingPost) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [readingPost, setReadingPost]);

  if (!readingPost) return null;

  const formatDate = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const currentUrl = window.location.origin ? `${window.location.origin}/#noticias` : 'https://projetojoaodebarro.org.br';
  const postUrl = currentUrl;
  const postTitle = readingPost.title;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${postTitle}*\n\n${readingPost.summary || ''}\n\nConfira no Projeto João de Barro:\n${postUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(`${postTitle}\n\nConfira no Projeto João de Barro: ${postUrl}`);
    showToast('Link copiado! Abrindo o Instagram para compartilhar...');
    const instaUrl = siteConfig.social?.instagram || 'https://instagram.com';
    setTimeout(() => {
      window.open(instaUrl, '_blank');
    }, 600);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(postUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    showToast('Link da postagem copiado com sucesso!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col border border-gray-100">
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-100 text-terracotta-800">
              {readingPost.category || 'Notícia'}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-terracotta-600" />
              {formatDate(readingPost.date)}
            </span>
          </div>
          <button
            onClick={() => setReadingPost(null)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 flex-1">
          
          {/* Title & Author */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {readingPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <User className="w-4 h-4 text-terracotta-600" />
                {readingPost.author || 'Diretoria João de Barro'}
              </span>

              {/* Social Share Buttons Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> Compartilhar:
                </span>

                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>

                {/* Instagram (O Queridinho) */}
                <button
                  onClick={handleShareInstagram}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
                  title="Compartilhar no Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleShareFacebook}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
                  title="Compartilhar no Facebook"
                >
                  <span>Facebook</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all"
                  title="Copiar Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          {readingPost.coverImage && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 aspect-[16/9] bg-gray-100">
              <img
                src={readingPost.coverImage}
                alt={readingPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Text Paragraphs */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-base sm:text-lg space-y-4">
            {readingPost.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Attached Gallery Photos */}
          {readingPost.gallery && readingPost.gallery.length > 0 && (
            <div className="pt-8 border-t border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-terracotta-600" />
                Fotos Relacionadas a esta Publicação
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {readingPost.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxPhoto({ imageUrl: imgUrl, title: `${readingPost.title} - Foto ${idx+1}` })}
                    className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group relative cursor-pointer"
                  >
                    <img src={imgUrl} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <span className="text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full">Ver foto ampliada</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Share Footer Bar inside Post */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Gostou dessa novidade? Compartilhe!</h4>
              <p className="text-xs text-gray-500">Ajude a divulgar os projetos e ações da nossa ONG para seus amigos e familiares.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-md transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareInstagram}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white text-xs font-extrabold shadow-md transition-all hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </button>

              <button
                onClick={handleShareFacebook}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-md transition-all hover:scale-105"
              >
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Bottom Donate Callout inside Post */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-amber-900">Apoie as ações do Projeto João de Barro</h4>
              <p className="text-xs text-amber-700">Cada doação mantém oficinas lúdicas e alimentação para 280 crianças.</p>
            </div>
            <button
              onClick={() => {
                setReadingPost(null);
                setIsDonationOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shrink-0 transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-white" />
              Fazer Doação PIX
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
