import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, Maximize2, Sparkles } from 'lucide-react';

export function GallerySection() {
  const { gallery, setLightboxPhoto } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(gallery.map(g => g.category).filter(Boolean))];

  const filteredGallery = selectedCategory === 'Todas'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  return (
    <section id="galeria" className="py-20 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Registros de Afeto & Vivências</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Galeria de Momentos Especiais
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Cada foto reflete o sorriso, a liberdade criativa e a construção coletiva dos nossos pequenos no Projeto João de Barro.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxPhoto(item)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gray-200 cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title || 'Foto da galeria'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay with zoom indicator & caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-terracotta-600 text-white mb-1.5 inline-block">
                    {item.category || 'Atividade'}
                  </span>
                  <h4 className="text-white text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  {item.date && (
                    <span className="text-[11px] text-gray-300 block mt-1">
                      {item.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
