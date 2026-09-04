import React, { useState, useEffect } from 'react';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { INSTITUTION_DATA } from '../data/apaeData';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  QrCode, 
  Copy, 
  Check, 
  Calendar, 
  Award,
  Users,
  Activity,
  GraduationCap
} from 'lucide-react';

export function HeroBanner() {
  const { openDonationModal, scrollToSection, setScheduleVisitModalOpen, showToast } = useApae();
  const { speakText } = useAccessibility();
  const [copiedPix, setCopiedPix] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      tag: "Reabilitação & Neurodesenvolvimento",
      title: "Transformando vidas através do cuidado, carinho e ciência",
      description: "Mais de 1.400 crianças, jovens e adultos com deficiência intelectual e múltipla encontram na APAE um porto seguro de saúde, educação e acolhimento familiar 100% gratuito.",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200",
      ctaLabel: "Apadrinhar uma Criança",
      accent: "from-blue-600 to-apae-blue-700"
    },
    {
      tag: "Educação Especial & Inclusão",
      title: "Cada aprendizado é uma vitória extraordinária",
      description: "Salas de recursos multifuncionais, alfabetização adaptada, robótica assistiva e desenvolvimento de autonomia para que cada aluno alcance seu máximo potencial.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
      ctaLabel: "Conhecer Nossas Escolas",
      accent: "from-amber-500 to-apae-yellow-600"
    },
    {
      tag: "Futuro & Mercado de Trabalho",
      title: "Construindo independência e cidadania plena",
      description: "Nossos programas de aprendizagem profissional e emprego apoiado já inseriram centenas de jovens no mercado formal com carteira assinada e dignidade.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
      ctaLabel: "Seja Empresa Parceira",
      accent: "from-emerald-600 to-apae-green-700"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText("12.345.678/0001-90");
    setCopiedPix(true);
    showToast("Chave PIX da APAE (CNPJ: 12.345.678/0001-90) copiada com sucesso!");
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const current = heroSlides[activeSlide];

  return (
    <section aria-label="Apresentação Principal" className="relative overflow-hidden bg-slate-900 text-white min-h-[640px] lg:min-h-[700px] flex items-center">
      {/* Background Image com Overlay Escuro Gradiente Suave */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.image}
          alt="Atendimento humanizado na APAE"
          className="w-full h-full object-cover object-center opacity-30 transition-all duration-1000 ease-out transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Coluna de Conteúdo Principal */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges de Credibilidade */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-apae-yellow-500 text-slate-950 uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {current.tag}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 backdrop-blur-md border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CEBAS Saúde & Educação Certificado
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-white">
              {current.title.split(' ').map((word, idx) => {
                if (idx > 2 && idx < 6) {
                  return (
                    <span key={idx} className="text-transparent bg-clip-text bg-gradient-to-r from-apae-yellow-400 to-amber-300">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </h1>

            {/* Descrição Acessível */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {current.description}
            </p>

            {/* Botões de Ação Imediata */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => openDonationModal(60, 'recorrente', 'Apoio Geral APAE')}
                className="px-6 py-3.5 rounded-xl font-black text-base text-slate-950 bg-gradient-to-r from-apae-yellow-400 via-apae-yellow-500 to-amber-500 hover:from-apae-yellow-300 hover:to-amber-400 shadow-xl hover:shadow-apae-yellow-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 focus:ring-4 focus:ring-apae-yellow-400"
              >
                <Heart className="w-5 h-5 fill-slate-950" />
                <span>FAÇA UMA DOAÇÃO ONLINE</span>
              </button>

              <button
                onClick={() => scrollToSection('projetos')}
                className="px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-colors flex items-center gap-2"
              >
                <span>Conhecer Nossos Projetos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setScheduleVisitModalOpen(true)}
                className="px-4 py-3.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-apae-yellow-400" />
                <span>Agendar Visita</span>
              </button>
            </div>

            {/* Slide Navigation Dots */}
            <div className="flex items-center gap-2 pt-4">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx ? 'w-8 bg-apae-yellow-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Ir para destaque ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Coluna Lateral: Card Flutuante de Impacto & PIX Instantâneo */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    PIX
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Doação Rápida via PIX</h2>
                    <p className="text-xs text-slate-400">100% revertido para o atendimento direto</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600/40 px-2 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Seguro & Oficial
                </span>
              </div>

              {/* Seletor Rápido de Valor */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Selecione um valor de contribuição solidária:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 60, 120].map((val) => (
                    <button
                      key={val}
                      onClick={() => openDonationModal(val, 'unica', 'Doação Instantânea')}
                      className="py-2.5 px-2 rounded-xl bg-slate-700/60 hover:bg-apae-blue-600 hover:text-white border border-slate-600 hover:border-apae-blue-500 font-black text-sm text-slate-200 transition-all text-center group"
                    >
                      <span className="block text-xs font-normal text-slate-400 group-hover:text-blue-100">R$</span>
                      <span>{val},00</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Box da Chave CNPJ com Copiar */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Chave PIX Oficial (CNPJ)
                  </span>
                  <span className="text-[10px] text-apae-yellow-400 font-bold">
                    Banco do Brasil
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 bg-slate-950 px-3 py-2.5 rounded-xl border border-slate-800">
                  <code className="text-sm font-mono font-bold text-emerald-400 tracking-wider">
                    {INSTITUTION_DATA.cnpj}
                  </code>

                  <button
                    onClick={handleCopyPix}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      copiedPix
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                    title="Copiar Chave CNPJ"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Favorecido: Associação de Pais e Amigos dos Excepcionais (APAE)
                </p>
              </div>

              {/* Botão de Abrir Checkout Completo */}
              <button
                onClick={() => openDonationModal(60, 'recorrente')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-apae-blue-600 to-blue-600 hover:from-apae-blue-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Outros Valores / Cartão / Boleto</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>

        {/* Barra de Estatísticas em Tempo Real */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {INSTITUTION_DATA.stats.map((st, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 hover:border-apae-yellow-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-apae-yellow-400">
                {st.value.toLocaleString('pt-BR')}{st.suffix}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">{st.label}</div>
              <div className="text-[11px] text-slate-400">{st.subtitle}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
