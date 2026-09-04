import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('apae_font_size') || 'normal');
  const [contrast, setContrast] = useState(() => localStorage.getItem('apae_contrast') || 'normal');
  const [dyslexiaFont, setDyslexiaFont] = useState(() => localStorage.getItem('apae_dyslexia') === 'true');
  const [highlightLinks, setHighlightLinks] = useState(() => localStorage.getItem('apae_links') === 'true');
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('apae_motion') === 'true');
  const [readingGuide, setReadingGuide] = useState(() => localStorage.getItem('apae_reading_guide') === 'true');
  const [mouseY, setMouseY] = useState(200);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');

  // Handle CSS classes on body
  useEffect(() => {
    const body = document.body;

    // Font size classes
    body.classList.remove('text-size-large', 'text-size-xlarge');
    if (fontSize === 'large') body.classList.add('text-size-large');
    if (fontSize === 'xlarge') body.classList.add('text-size-xlarge');
    localStorage.setItem('apae_font_size', fontSize);

    // Contrast classes
    body.classList.remove('contrast-high-dark', 'contrast-high-light', 'contrast-monochrome');
    if (contrast === 'high-dark') body.classList.add('contrast-high-dark');
    if (contrast === 'high-light') body.classList.add('contrast-high-light');
    if (contrast === 'monochrome') body.classList.add('contrast-monochrome');
    localStorage.setItem('apae_contrast', contrast);

    // Dyslexia class
    if (dyslexiaFont) {
      body.classList.add('font-dyslexic');
    } else {
      body.classList.remove('font-dyslexic');
    }
    localStorage.setItem('apae_dyslexia', String(dyslexiaFont));

    // Highlight links
    if (highlightLinks) {
      body.classList.add('highlight-links');
    } else {
      body.classList.remove('highlight-links');
    }
    localStorage.setItem('apae_links', String(highlightLinks));

    // Reduce motion
    if (reduceMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }
    localStorage.setItem('apae_motion', String(reduceMotion));

    localStorage.setItem('apae_reading_guide', String(readingGuide));
  }, [fontSize, contrast, dyslexiaFont, highlightLinks, reduceMotion, readingGuide]);

  // Track mouse Y for reading guide
  useEffect(() => {
    if (!readingGuide) return;
    const handleMouseMove = (e) => {
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  // Text to Speech
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta síntese de voz.');
      return;
    }

    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpokenText(text.slice(0, 100) + '...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpokenText('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpokenText('');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpokenText('');
    }
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const cycleContrast = () => {
    if (contrast === 'normal') setContrast('high-dark');
    else if (contrast === 'high-dark') setContrast('high-light');
    else if (contrast === 'high-light') setContrast('monochrome');
    else setContrast('normal');
  };

  const resetAccessibility = () => {
    setFontSize('normal');
    setContrast('normal');
    setDyslexiaFont(false);
    setHighlightLinks(false);
    setReduceMotion(false);
    setReadingGuide(false);
    stopSpeaking();
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        cycleFontSize,
        contrast,
        setContrast,
        cycleContrast,
        dyslexiaFont,
        setDyslexiaFont,
        highlightLinks,
        setHighlightLinks,
        reduceMotion,
        setReduceMotion,
        readingGuide,
        setReadingGuide,
        mouseY,
        speakText,
        stopSpeaking,
        isSpeaking,
        currentSpokenText,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
