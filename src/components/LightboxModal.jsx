import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar } from 'lucide-react';

export function LightboxModal() {
  const { lightboxPhoto, setLightboxPhoto } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxPhoto(null);
    };
    if (lightboxPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxPhoto, setLightboxPhoto]);

  if (!lightboxPhoto) return null;

  return (
    <div
      onClick={() => setLightboxPhoto(null)}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
    >
      {/* Close button */}
      <button
        onClick={() => setLightboxPhoto(null)}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
      >
        <img
          src={lightboxPhoto.imageUrl}
          alt={lightboxPhoto.title || 'Foto ampliada'}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />

        {/* Caption */}
        {(lightboxPhoto.title || lightboxPhoto.category || lightboxPhoto.date) && (
          <div className="mt-4 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-center flex items-center gap-4 text-xs">
            {lightboxPhoto.title && <span className="font-bold">{lightboxPhoto.title}</span>}
            {lightboxPhoto.category && (
              <span className="px-2 py-0.5 rounded bg-terracotta-600 text-[10px] font-bold">
                {lightboxPhoto.category}
              </span>
            )}
            {lightboxPhoto.date && (
              <span className="text-gray-300 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {lightboxPhoto.date}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
