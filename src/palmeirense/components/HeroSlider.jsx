import React, { useState, useEffect } from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  ArrowRight,
  Sparkles,
  Waves,
  Trophy
} from 'lucide-react';

export function HeroSlider() {
  const { heroSlides, clubConfig } = usePalmeirense();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroSlides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const slide = heroSlides[currentSlide] || heroSlides[0];

  if (!slide) return null;

  return (
    <section id="hero" className="relative min-h-[620px] md:min-h-[720px] lg:min-h-[780px] flex items-center bg-[#0A0A0D] overflow-hidden">
      {/* Background Images com Zoom Lento e Transição Cinematográfica */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } transition-transform duration-10000`}
        >
          <img
            src={s.imageUrl}
            alt={s.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradients Dramáticos em Preto Nobre e Toques Rubros */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/80 to-[#0A0A0D]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0D] via-[#0A0A0D]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90 pointer-events-none" />
        </div>
      ))}

      {/* Marca D'Água Gigante do Brasão Oficial ECP no Fundo à Direita */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[480px] md:w-[680px] h-[480px] md:h-[680px] pointer-events-none opacity-[0.06] select-none">
        <img
          src="/logo-ecp.png"
          alt="Marca D'água ECP"
          className="w-full h-full object-contain filter grayscale invert"
        />
      </div>

      {/* Conteúdo Central */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28 w-full">
        <div className="max-w-3xl">
          {/* Badge de Tradição 1908 */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-950/70 border border-red-600/40 text-red-300 text-xs md:text-sm font-bold mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(229,25,34,0.25)] animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="uppercase tracking-widest font-mono text-[11px] md:text-xs">Desde 1908 • Tradição Centenária</span>
          </div>

          {/* Categoria do Slide */}
          <span className="block text-red-400 font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-2">
            {slide.badge}
          </span>

          {/* Título com Tipografia Balanceada Outfit (Forte, Nobre e Sem Excesso de Tamanho) */}
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit uppercase leading-[1.12] mb-5 drop-shadow-lg">
            {slide.title}
          </h1>

          {/* Subtítulo Descritivo com Contraste Agradável */}
          <p className="text-sm md:text-base text-zinc-300 font-normal leading-relaxed mb-8 max-w-2xl drop-shadow">
            {slide.subtitle}
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={slide.ctaLink || "#seja-socio"}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(229,25,34,0.45)] hover:shadow-[0_0_40px_rgba(229,25,34,0.6)] transition-all flex items-center gap-3 group border border-red-500/50"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {slide.secondaryCtaText && (
              <a
                href={slide.secondaryCtaLink || "#esportes"}
                className="px-7 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs md:text-sm uppercase tracking-wider border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <span>{slide.secondaryCtaText}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Controles de Navegação Lateral */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all hidden md:flex hover:scale-110"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all hidden md:flex hover:scale-110"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores no Rodapé do Hero */}
      <div className="absolute bottom-6 left-0 right-0 z-20 max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-10 bg-red-600 shadow-[0_0_10px_rgba(229,25,34,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-red-500" />
            4 Piscinas & Lazer
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-red-500" />
            Complexo Poliesportivo
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-red-500" />
            Bailes & Salão Nobre
          </span>
        </div>
      </div>
    </section>
  );
}
