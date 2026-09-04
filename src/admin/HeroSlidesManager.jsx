import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../services/storageService';
import { Sliders, Plus, Trash2, Upload, Info, Check, Image as ImageIcon } from 'lucide-react';

export function HeroSlidesManager() {
  const { siteConfig, updateSiteConfig, showToast } = useApp();
  const [slides, setSlides] = useState(siteConfig.heroSlides || []);
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const handleSaveAll = (updatedSlides) => {
    setSlides(updatedSlides);
    updateSiteConfig({ ...siteConfig, heroSlides: updatedSlides });
  };

  const handleImageUpload = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingIdx(idx);
      const base64 = await compressImageFile(file, 1600, 0.85);
      const updated = [...slides];
      updated[idx] = { ...updated[idx], imageUrl: base64 };
      handleSaveAll(updated);
      showToast('Foto do slide atualizada com sucesso!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      badge: 'Projeto João de Barro',
      tagline: 'Nova Conquista & Vivência',
      title: 'Acolhimento e Desenvolvimento Criativo',
      subtitle: 'Espaço seguro com oficinas de artes, brincadeiras e refeições saudáveis no contraturno escolar.',
      imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1600&q=80'
    };
    const updated = [...slides, newSlide];
    handleSaveAll(updated);
    showToast('Novo slide adicionado.');
  };

  const handleRemoveSlide = (idx) => {
    if (slides.length <= 1) {
      showToast('Você deve manter pelo menos 1 slide na entrada principal.', 'error');
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    handleSaveAll(updated);
    showToast('Slide removido.');
  };

  const handleFieldChange = (idx, field, value) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], [field]: value };
    setSlides(updated);
  };

  const handleSaveClick = () => {
    handleSaveAll(slides);
    showToast('Todos os slides foram salvos!');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Slides da Entrada Principal (Carrossel Largura Total)</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gerencie as fotos panorâmicas, títulos e frases de acolhimento que passam no início do portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddSlide}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Slide</span>
          </button>
        </div>
      </div>

      {/* Guidance Alert */}
      <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900 shadow-sm">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sm font-bold block mb-1">Recomendações para as Fotos da Entrada:</strong>
          <p className="text-amber-800 leading-relaxed">
            • <strong>Fotos da Fachada / Portão / Atividades:</strong> Como o slide ocupa a largura total da tela, utilize imagens <strong>horizontais (paisagem)</strong> com boa iluminação.<br />
            • <strong>Fotos do Dia a Dia / Verticais:</strong> Fotos tiradas de celular em pé ou informais ficam ideais para a aba <strong>"Galeria de Fotos"</strong> ou para o mural de <strong>"Notícias & Posts"</strong>!
          </p>
        </div>
      </div>

      {/* Slides List */}
      <div className="space-y-6">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
                Slide #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSlide(idx)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                title="Excluir Slide"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remover Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Photo Column */}
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Foto Panorâmica do Slide
                </label>
                
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner group">
                  <img src={slide.imageUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 text-xs font-bold text-terracotta-800 shadow-sm transition-all">
                    <Upload className="w-4 h-4 text-terracotta-600" />
                    <span>{uploadingIdx === idx ? 'Otimizando foto...' : 'Escolher Foto do Computador'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(idx, e)}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Ou cole o link da imagem"
                    value={slide.imageUrl}
                    onChange={(e) => handleFieldChange(idx, 'imageUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Text Fields Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Selo Superior (Badge)</label>
                    <input
                      type="text"
                      value={slide.badge || ''}
                      placeholder="Ex: Mais de 15 Anos de História"
                      onChange={(e) => handleFieldChange(idx, 'badge', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tagline Curta</label>
                    <input
                      type="text"
                      value={slide.tagline || ''}
                      placeholder="Ex: Desenvolvimento Lúdico & Afeto"
                      onChange={(e) => handleFieldChange(idx, 'tagline', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Título de Destaque Principal *</label>
                  <input
                    type="text"
                    required
                    value={slide.title}
                    onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Texto Explicativo da Missão / Ação</label>
                  <textarea
                    rows="3"
                    value={slide.subtitle}
                    onChange={(e) => handleFieldChange(idx, 'subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  ></textarea>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveClick}
          className="px-8 py-4 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-xl shadow-terracotta-600/30 flex items-center gap-2 transition-all"
        >
          <Check className="w-5 h-5" />
          <span>Salvar Alterações dos Slides</span>
        </button>
      </div>

    </div>
  );
}
