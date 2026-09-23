import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLUB_CONFIG,
  INITIAL_HERO_SLIDES,
  INITIAL_PUBLICATIONS,
  INITIAL_EVENTS,
  INITIAL_SPORTS_MODALITIES
} from '../data/initialData';

const PalmeirenseContext = createContext();

export function PalmeirenseProvider({ children }) {
  // Configurações do Clube com LocalStorage
  const [clubConfig, setClubConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ecp_club_config');
      return saved ? JSON.parse(saved) : INITIAL_CLUB_CONFIG;
    } catch (e) {
      return INITIAL_CLUB_CONFIG;
    }
  });

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('ecp_hero_slides');
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch (e) {
      return INITIAL_HERO_SLIDES;
    }
  });

  // Publicações / Notícias
  const [publications, setPublications] = useState(() => {
    try {
      const saved = localStorage.getItem('ecp_publications');
      return saved ? JSON.parse(saved) : INITIAL_PUBLICATIONS;
    } catch (e) {
      return INITIAL_PUBLICATIONS;
    }
  });

  // Eventos e Bailes da Agenda
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('ecp_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  });

  // Modalidades Esportivas
  const [modalities] = useState(INITIAL_SPORTS_MODALITIES);

  // Estados de Interface e Modais
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [sharePublication, setSharePublication] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem('ecp_club_config', JSON.stringify(clubConfig));
    } catch (e) {}
  }, [clubConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('ecp_hero_slides', JSON.stringify(heroSlides));
    } catch (e) {}
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem('ecp_publications', JSON.stringify(publications));
    } catch (e) {}
  }, [publications]);

  useEffect(() => {
    try {
      localStorage.setItem('ecp_events', JSON.stringify(events));
    } catch (e) {}
  }, [events]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Funções de Gerenciamento de Publicações
  const addPublication = (pub) => {
    const newPub = {
      ...pub,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      slug: pub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };
    setPublications([newPub, ...publications]);
    showToast('Publicação criada com sucesso e pronta para compartilhar!');
  };

  const updatePublication = (id, updatedFields) => {
    setPublications(publications.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast('Publicação atualizada com sucesso!');
  };

  const deletePublication = (id) => {
    setPublications(publications.filter(p => p.id !== id));
    showToast('Publicação removida com sucesso!', 'info');
  };

  // Funções de Gerenciamento do Hero
  const updateHeroSlide = (id, updatedFields) => {
    setHeroSlides(heroSlides.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    showToast('Banner do Hero atualizado com sucesso!');
  };

  // Funções de Eventos
  const addEvent = (evt) => {
    const newEvt = { ...evt, id: Date.now() };
    setEvents([...events, newEvt]);
    showToast('Evento adicionado à agenda!');
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
    showToast('Evento removido!', 'info');
  };

  // Restaurar dados padrão de fábrica
  const resetToFactoryData = () => {
    if (window.confirm('Deseja realmente restaurar os dados originais do banco de dados? Todas as alterações manuais serão resetadas.')) {
      setClubConfig(INITIAL_CLUB_CONFIG);
      setHeroSlides(INITIAL_HERO_SLIDES);
      setPublications(INITIAL_PUBLICATIONS);
      setEvents(INITIAL_EVENTS);
      localStorage.removeItem('ecp_club_config');
      localStorage.removeItem('ecp_hero_slides');
      localStorage.removeItem('ecp_publications');
      localStorage.removeItem('ecp_events');
      showToast('Dados restaurados para o padrão original do clube!');
    }
  };

  return (
    <PalmeirenseContext.Provider
      value={{
        clubConfig,
        setClubConfig,
        heroSlides,
        setHeroSlides,
        updateHeroSlide,
        publications,
        addPublication,
        updatePublication,
        deletePublication,
        events,
        addEvent,
        deleteEvent,
        modalities,
        activeCategory,
        setActiveCategory,
        selectedPublication,
        setSelectedPublication,
        sharePublication,
        setSharePublication,
        isAdminOpen,
        setIsAdminOpen,
        toastMessage,
        showToast,
        resetToFactoryData
      }}
    >
      {children}
    </PalmeirenseContext.Provider>
  );
}

export function usePalmeirense() {
  const ctx = useContext(PalmeirenseContext);
  if (!ctx) {
    throw new Error('usePalmeirense deve ser usado dentro de um PalmeirenseProvider');
  }
  return ctx;
}
