import React, { createContext, useContext, useState, useEffect } from 'react';
import { NEWS_DATA, EVENTS_DATA, PROJECTS_DATA, TRANSPARENCY_DATA } from '../data/apaeData';
import { triggerConfetti } from '../utils/confetti';

const ApaeContext = createContext();

const INITIAL_DONATIONS = [
  { id: "DON-9821", name: "Dra. Carolina Mendes", value: 120, method: "PIX", type: "Mensal", date: "31/08/2026 20:45", status: "Confirmado", destination: "Hidroterapia" },
  { id: "DON-9820", name: "Supermercado Estrela Ltda", value: 2500, method: "Boleto", type: "Única", date: "31/08/2026 18:20", status: "Confirmado", destination: "Oficinas de Trabalho" },
  { id: "DON-9819", name: "Anônimo", value: 60, method: "PIX", type: "Única", date: "31/08/2026 17:05", status: "Confirmado", destination: "Fonoaudiologia" },
  { id: "DON-9818", name: "Fernando Peixoto", value: 250, method: "Cartão", type: "Mensal", date: "31/08/2026 14:12", status: "Confirmado", destination: "Apadrinhamento Geral" },
  { id: "DON-9817", name: "Mariana Siqueira", value: 30, method: "PIX", type: "Única", date: "31/08/2026 11:30", status: "Confirmado", destination: "Estimulação Precoce" },
  { id: "DON-9816", name: "TechInclusão Ltda", value: 5000, method: "PIX", type: "Única", date: "30/08/2026 16:00", status: "Confirmado", destination: "Tecnologia Assistiva" },
];

const INITIAL_VOLUNTEERS = [
  { id: "VOL-101", name: "Larissa Fernandes", email: "larissa.fernandes@email.com", phone: "(11) 97123-4567", area: "recreacao", availability: "Sábados manhã", motivation: "Quero levar alegria e brincadeiras para as crianças.", status: "Aprovado", date: "29/08/2026" },
  { id: "VOL-102", name: "Marcos Vinicius Silva", email: "marcos.v@email.com", phone: "(11) 98234-5678", area: "artes", availability: "Terças e Quintas tarde", motivation: "Sou artesão e gostaria de ensinar pintura em tecido.", status: "Em Análise", date: "30/08/2026" },
  { id: "VOL-103", name: "Fernanda Toledo", email: "ftoledo.fono@email.com", phone: "(11) 99345-6789", area: "saude", availability: "Sextas o dia todo", motivation: "Fonoaudióloga com pós em CAA, quero doar horas clínicas.", status: "Aprovado", date: "31/08/2026" }
];

const INITIAL_PARTNERS = [
  { id: "PAR-201", company: "Distribuidora Atlas Logística", cnpj: "23.456.789/0001-11", contactName: "Julio Cesar Brandão", email: "julio@atlaslog.com.br", phone: "(11) 4002-8922", modality: "lei_cotas", message: "Temos 6 vagas imediatas para jovens aprendizes assistidos pela APAE no nosso CD.", status: "Em Negociação", date: "28/08/2026" },
  { id: "PAR-202", company: "Supermercados Estrela", cnpj: "10.987.654/0001-22", contactName: "Eliana Duarte", email: "esg@superestrela.com.br", phone: "(11) 3322-1100", modality: "troco_solidario", message: "Arrecadação do troco solidário nos caixas e destinação mensal para a APAE.", status: "Ativo", date: "15/08/2026" }
];

export function ApaeProvider({ children }) {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Modals
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationModalConfig, setDonationModalConfig] = useState({ amount: 60, type: 'recorrente', projectName: '' });
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [scheduleVisitModalOpen, setScheduleVisitModalOpen] = useState(false);

  // Lists
  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('apae_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('apae_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('apae_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [newsList, setNewsList] = useState(NEWS_DATA);
  const [eventsList, setEventsList] = useState(EVENTS_DATA);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('apae_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('apae_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('apae_partners', JSON.stringify(partners));
  }, [partners]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const openDonationModal = (amount = 60, type = 'recorrente', projectName = '') => {
    setDonationModalConfig({ amount, type, projectName });
    setDonationModalOpen(true);
  };

  const closeDonationModal = () => {
    setDonationModalOpen(false);
  };

  const recordDonation = (donationData) => {
    const newDonation = {
      id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
      name: donationData.name || "Doador Solidário",
      value: Number(donationData.value),
      method: donationData.method || "PIX",
      type: donationData.type || "Única",
      date: new Date().toLocaleString('pt-BR'),
      status: "Confirmado",
      destination: donationData.destination || "Fundo Geral Institucional"
    };

    setDonations(prev => [newDonation, ...prev]);
    triggerConfetti();
    showToast(`Obrigado de coração! Doação de R$ ${newDonation.value},00 confirmada com sucesso.`);
  };

  const registerVolunteer = (formData) => {
    const newVol = {
      id: `VOL-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      area: formData.area,
      availability: formData.availability,
      motivation: formData.motivation,
      status: "Em Análise",
      date: new Date().toLocaleDateString('pt-BR')
    };

    setVolunteers(prev => [newVol, ...prev]);
    triggerConfetti();
    showToast(`Candidatura recebida com sucesso! Protocolo: ${newVol.id}. Entraremos em contato.`);
  };

  const registerPartner = (formData) => {
    const newPartner = {
      id: `PAR-${Math.floor(200 + Math.random() * 800)}`,
      company: formData.company,
      cnpj: formData.cnpj,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      modality: formData.modality,
      message: formData.message,
      status: "Recebido",
      date: new Date().toLocaleDateString('pt-BR')
    };

    setPartners(prev => [newPartner, ...prev]);
    triggerConfetti();
    showToast(`Proposta empresarial cadastrada com sucesso! Protocolo: ${newPartner.id}.`);
  };

  const scrollToSection = (sectionId) => {
    setIsAdminOpen(false);
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ApaeContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        scrollToSection,
        isAdminOpen,
        setIsAdminOpen,
        adminAuthenticated,
        setAdminAuthenticated,
        // Modals
        donationModalOpen,
        donationModalConfig,
        openDonationModal,
        closeDonationModal,
        selectedProject,
        setSelectedProject,
        selectedNews,
        setSelectedNews,
        selectedEvent,
        setSelectedEvent,
        selectedDoc,
        setSelectedDoc,
        volunteerModalOpen,
        setVolunteerModalOpen,
        partnerModalOpen,
        setPartnerModalOpen,
        scheduleVisitModalOpen,
        setScheduleVisitModalOpen,
        // Data & Actions
        donations,
        recordDonation,
        volunteers,
        registerVolunteer,
        partners,
        registerPartner,
        newsList,
        setNewsList,
        eventsList,
        setEventsList,
        toast,
        showToast
      }}
    >
      {children}
    </ApaeContext.Provider>
  );
}

export function useApae() {
  const context = useContext(ApaeContext);
  if (!context) {
    throw new Error('useApae must be used within an ApaeProvider');
  }
  return context;
}
