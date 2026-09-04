import React, { useState } from 'react';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Heart, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown, 
  Users, 
  Building2, 
  FileText, 
  HandHeart, 
  Calendar, 
  BookOpen, 
  Stethoscope, 
  Phone,
  Lock
} from 'lucide-react';

export function ApaeNavbar() {
  const { 
    currentSection, 
    scrollToSection, 
    openDonationModal, 
    setIsAdminOpen, 
    isAdminOpen,
    setScheduleVisitModalOpen
  } = useApae();

  const { speakText } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { 
      id: 'institucional', 
      label: 'Institucional',
      children: [
        { id: 'historia', label: 'Nossa História & Missão', section: 'institucional' },
        { id: 'corpo-tecnico', label: 'Corpo Técnico Multidisciplinar', section: 'institucional' },
        { id: 'estrutura', label: 'Unidades & Estrutura Física', section: 'institucional' }
      ]
    },
    { 
      id: 'projetos', 
      label: 'Projetos',
      children: [
        { id: 'proj-saude', label: 'Saúde & Reabilitação', section: 'projetos' },
        { id: 'proj-educacao', label: 'Educação Especial (AEE)', section: 'projetos' },
        { id: 'proj-social', label: 'Assistência Social & Emprego', section: 'projetos' }
      ]
    },
    { id: 'noticias-eventos', label: 'Notícias & Eventos' },
    { id: 'transparencia', label: 'Transparência' },
    { 
      id: 'participe', 
      label: 'Participe',
      children: [
        { id: 'voluntariado', label: 'Seja Voluntário', section: 'participe' },
        { id: 'empresas', label: 'Parcerias Empresariais (ESG)', section: 'participe' },
        { id: 'visita', label: 'Agendar Visita Institucional', action: () => setScheduleVisitModalOpen(true) }
      ]
    }
  ];

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Oficial APAE */}
          <button
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-apae-blue-600 rounded-lg p-1"
            aria-label="APAE - Página Inicial"
          >
            {/* SVG Fiel do Emblema Oficial APAE: Flor de Margarida Amarela com Folhas Verdes amparada por mãos azuis */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-apae-blue-600 to-apae-blue-800 flex items-center justify-center shadow-md p-1.5 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Ramos de Folha / Mãos de Amparo */}
                <path d="M 20 80 C 15 50 40 40 46 25 C 48 38 35 60 40 80 Z" fill="#00875A" />
                <path d="M 80 80 C 85 50 60 40 54 25 C 52 38 65 60 60 80 Z" fill="#00875A" />
                {/* Pétalas da Margarida Amarela */}
                <ellipse cx="50" cy="22" rx="6" ry="12" fill="#F5A623" />
                <ellipse cx="50" cy="48" rx="6" ry="12" fill="#F5A623" />
                <ellipse cx="37" cy="35" rx="12" ry="6" fill="#F5A623" />
                <ellipse cx="63" cy="35" rx="12" ry="6" fill="#F5A623" />
                <ellipse cx="41" cy="26" rx="10" ry="6" transform="rotate(-45 41 26)" fill="#F5A623" />
                <ellipse cx="59" cy="26" rx="10" ry="6" transform="rotate(45 59 26)" fill="#F5A623" />
                <ellipse cx="41" cy="44" rx="10" ry="6" transform="rotate(45 41 44)" fill="#F5A623" />
                <ellipse cx="59" cy="44" rx="10" ry="6" transform="rotate(-45 59 44)" fill="#F5A623" />
                {/* Miolo da Flor */}
                <circle cx="50" cy="35" r="7" fill="#FFFFFF" />
                <circle cx="50" cy="35" r="4" fill="#004B87" />
                {/* Base de União */}
                <path d="M 32 82 C 50 90 50 90 68 82 C 60 86 40 86 32 82 Z" fill="#F5A623" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tighter text-apae-blue-600">APAE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-apae-yellow-100 text-apae-yellow-800 border border-apae-yellow-300">
                  Oficial
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-tight line-clamp-1">
                Associação de Pais e Amigos dos Excepcionais
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => (
              <div 
                key={item.id}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => !item.children && handleNavClick(item.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    currentSection === item.id 
                      ? 'text-apae-blue-600 bg-blue-50 font-black' 
                      : 'text-slate-700 hover:text-apae-blue-600 hover:bg-slate-50'
                  }`}
                  aria-haspopup={item.children ? 'true' : 'false'}
                  aria-expanded={activeDropdown === item.id}
                >
                  <span>{item.label}</span>
                  {item.children && <ChevronDown className="w-4 h-4 opacity-70" />}
                </button>

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.id && (
                  <div className="absolute left-0 top-full pt-1 w-64 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                      {item.children.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            if (sub.action) sub.action();
                            else handleNavClick(sub.section);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-apae-blue-50 hover:text-apae-blue-600 transition-colors flex items-center justify-between"
                        >
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Botão Admin / Gestão */}
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isAdminOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-slate-200 text-slate-600 hover:text-apae-blue-600 hover:border-apae-blue-200 hover:bg-slate-50'
              }`}
              title="Acessar Painel Administrativo da APAE"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline">{isAdminOpen ? 'Sair do Painel' : 'Área do Gestor'}</span>
            </button>

            {/* Botão Doar Agora Principal */}
            <button
              onClick={() => openDonationModal(60, 'recorrente', 'Fundo de Inclusão APAE')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-slate-900 bg-gradient-to-r from-apae-yellow-400 via-apae-yellow-500 to-amber-500 shadow-md hover:shadow-lg hover:shadow-apae-yellow-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-3 focus:ring-apae-yellow-400"
            >
              <Heart className="w-4 h-4 fill-slate-900 text-slate-900 animate-pulse" />
              <span>DOAR AGORA</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openDonationModal(60, 'recorrente')}
              className="px-3 py-1.5 rounded-lg text-xs font-black bg-apae-yellow-400 text-slate-900 flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Doar</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-apae-blue-600"
              aria-label="Abrir Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-slide-up">
          {navLinks.map((item) => (
            <div key={item.id} className="border-b border-slate-50 pb-2">
              <button
                onClick={() => handleNavClick(item.children ? item.children[0].section : item.id)}
                className="w-full text-left py-2 px-3 text-base font-bold text-slate-800 hover:text-apae-blue-600 hover:bg-blue-50 rounded-xl"
              >
                {item.label}
              </button>
              {item.children && (
                <div className="pl-4 space-y-1 mt-1">
                  {item.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        if (sub.action) sub.action();
                        else handleNavClick(sub.section);
                      }}
                      className="w-full text-left py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-apae-blue-600 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-apae-blue-600" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-3 space-y-2">
            <button
              onClick={() => {
                setIsAdminOpen(!isAdminOpen);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>{isAdminOpen ? 'Fechar Painel Administrativo' : 'Acessar Área do Gestor (CMS)'}</span>
            </button>

            <button
              onClick={() => {
                openDonationModal(60, 'recorrente');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-apae-yellow-400 to-amber-500 text-slate-900 font-black text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Heart className="w-5 h-5 fill-current" />
              <span>DOAR AGORA (PIX / CARTÃO / BOLETO)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
