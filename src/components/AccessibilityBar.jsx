import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useApae } from '../context/ApaeContext';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Type, 
  Eye, 
  RotateCcw, 
  HandMetal, 
  FileText, 
  HeartHandshake,
  Compass
} from 'lucide-react';

export function AccessibilityBar() {
  const {
    fontSize,
    cycleFontSize,
    contrast,
    cycleContrast,
    dyslexiaFont,
    setDyslexiaFont,
    highlightLinks,
    setHighlightLinks,
    readingGuide,
    setReadingGuide,
    isSpeaking,
    speakText,
    stopSpeaking,
    resetAccessibility
  } = useAccessibility();

  const { scrollToSection, openDonationModal } = useApae();

  const handleReadIntro = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText("Bem-vindo ao Portal Oficial da APAE — Associação de Pais e Amigos dos Excepcionais. Há mais de 50 anos promovendo educação especial, reabilitação clínica multidisciplinar e assistência social gratuita para mais de 1.400 famílias. Use a tecla tab para navegar pelos links ou clique nos botões de acessibilidade.");
    }
  };

  return (
    <aside aria-label="Barra de Acessibilidade e Atalhos" className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Atalhos Rápidos de Pular Navegação (WCAG 2.4.1) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] hidden sm:inline">
            Acessibilidade:
          </span>
          
          <button
            onClick={() => scrollToSection('projetos')}
            className="hover:text-apae-yellow-400 focus:text-apae-yellow-400 focus:underline transition-colors px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800"
            title="Pular direto para os Projetos"
          >
            [1] Projetos
          </button>
          
          <button
            onClick={() => scrollToSection('transparencia')}
            className="hover:text-apae-yellow-400 focus:text-apae-yellow-400 focus:underline transition-colors px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800"
            title="Ir para o Portal da Transparência"
          >
            [2] Transparência
          </button>

          <button
            onClick={() => scrollToSection('doacoes')}
            className="text-apae-yellow-400 hover:text-white font-bold px-1.5 py-0.5 rounded bg-apae-yellow-600/20 hover:bg-apae-yellow-600/40 transition-colors"
            title="Ir direto para a área de Doações"
          >
            [3] Doar Agora
          </button>
        </div>

        {/* Ferramentas Ativas de Inclusão */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Leitor de Tela Sintetizado */}
          <button
            onClick={handleReadIntro}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
              isSpeaking
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Ouvir descrição da página em áudio"
            aria-pressed={isSpeaking}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-apae-yellow-400" />}
            <span>{isSpeaking ? 'Parar Áudio' : 'Ouvir Página'}</span>
          </button>

          {/* Ajustar Tamanho da Fonte */}
          <button
            onClick={cycleFontSize}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
            title="Alternar tamanho do texto (Normal, Grande, Extra Grande)"
          >
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span>Fonte: {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
          </button>

          {/* Alto Contraste */}
          <button
            onClick={cycleContrast}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              contrast !== 'normal' 
                ? 'bg-apae-yellow-500 text-black font-bold' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Alternar Modos de Contraste (Alto Contraste Preto, Branco, Monocromático)"
          >
            {contrast === 'high-dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
            <span className="hidden md:inline">Contraste</span>
          </button>

          {/* Fonte para Dislexia */}
          <button
            onClick={() => setDyslexiaFont(!dyslexiaFont)}
            className={`px-2 py-1 rounded transition-colors hidden lg:inline-flex items-center gap-1 ${
              dyslexiaFont ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Ativar fonte adaptada para pessoas com Dislexia"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dislexia</span>
          </button>

          {/* Guia / Régua de Leitura */}
          <button
            onClick={() => setReadingGuide(!readingGuide)}
            className={`px-2 py-1 rounded transition-colors hidden lg:inline-flex items-center gap-1 ${
              readingGuide ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Ativar régua visual de foco para leitura guiada"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Guia Leitura</span>
          </button>

          {/* Simulação VLibras / Tradutor de Libras */}
          <button
            onClick={() => {
              alert("O Portal da APAE é totalmente adaptado com intérpretes de Libras presenciais em todos os eventos e conteúdos em vídeo com janela de Libras.");
            }}
            className="px-2 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 font-medium flex items-center gap-1 transition-colors"
            title="Suporte a Libras (Língua Brasileira de Sinais)"
          >
            <HandMetal className="w-3.5 h-3.5 text-blue-300" />
            <span>Libras</span>
          </button>

          {/* Resetar Acessibilidade */}
          {(fontSize !== 'normal' || contrast !== 'normal' || dyslexiaFont || readingGuide) && (
            <button
              onClick={resetAccessibility}
              className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 flex items-center gap-1 transition-colors"
              title="Restaurar padrões de exibição originais"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
