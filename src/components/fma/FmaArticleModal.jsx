import React from 'react';
import { X, Clock, Calendar, Tag, Share2, Phone, BookOpen, ArrowLeft } from 'lucide-react';
import { FMA_CONFIG } from '../../data/fmaData';

export function FmaArticleModal({ article, onClose }) {
  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do artigo copiado para a área de transferência!');
    }
  };

  // Simple clean markdown parser for headings and bullet points
  const renderContent = (rawText) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-serif font-bold text-white mt-6 mb-3 border-l-2 border-fma-gold pl-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-serif font-bold text-fma-goldLight mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-300 text-sm my-1.5 leading-relaxed">
            {trimmed.replace(/^[-•]\s*/, '')}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-zinc-300 text-sm my-1.5 leading-relaxed">
            {trimmed.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }

      return (
        <p key={idx} className="text-zinc-300 text-sm sm:text-base leading-relaxed my-3 font-normal">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0F1116] border border-fma-border rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#161920] to-[#0F1116] border-b border-fma-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-mono text-fma-gold font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Compartilhar artigo"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              aria-label="Fechar artigo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Reading View */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="p-4 rounded-xl bg-fma-surface border-l-4 border-fma-gold text-zinc-300 italic text-sm leading-relaxed">
            "{article.excerpt}"
          </div>

          {/* Body */}
          <div className="prose prose-invert max-w-none">
            {renderContent(article.content)}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap gap-2">
            {article.tags.map((t, idx) => (
              <span key={idx} className="text-[11px] font-mono px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                #{t}
              </span>
            ))}
          </div>

          {/* Consultation CTA Banner */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-fma-surface to-fma-card border border-fma-border space-y-3">
            <h4 className="font-serif font-bold text-white text-base">
              Possui dúvidas sobre este tema ou necessita de análise de viabilidade?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O Dr. Fernando Maeda atende diretamente pelo WhatsApp para avaliar documentos e indicar a medida jurídica mais segura e adequada.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent(`Olá Dr. Fernando Maeda, li o artigo "${article.title}" no site e gostaria de orientação para um caso similar.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs shadow-lg transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Conversar com o Dr. Fernando Maeda</span>
              </a>
            </div>
          </div>

        </div>

        {/* Modal Bottom Action */}
        <div className="p-4 bg-[#12141A] border-t border-fma-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para todos os artigos</span>
          </button>
        </div>

      </div>
    </div>
  );
}
