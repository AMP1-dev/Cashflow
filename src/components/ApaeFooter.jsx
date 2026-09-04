import React from 'react';
import { INSTITUTION_DATA } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  ArrowUp,
  ExternalLink
} from 'lucide-react';

export function ApaeFooter() {
  const { scrollToSection, openDonationModal, setIsAdminOpen, isAdminOpen } = useApae();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer aria-label="Rodapé Oficial APAE" className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grade Superior de Certificações e Selos Oficiais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-12 border-b border-slate-800">
          {INSTITUTION_DATA.certifications.map((cert, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-apae-blue-600/30 text-apae-yellow-400 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">{cert.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">{cert.subtitle}</p>
                <span className="inline-block text-[9px] font-bold text-emerald-400 mt-0.5">{cert.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Links Principais do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Coluna 1: Marca e Missão */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-apae-blue-600 flex items-center justify-center font-black text-white">
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <ellipse cx="50" cy="35" rx="6" ry="12" fill="#F5A623" />
                  <ellipse cx="50" cy="65" rx="6" ry="12" fill="#F5A623" />
                  <ellipse cx="35" cy="50" rx="12" ry="6" fill="#F5A623" />
                  <ellipse cx="65" cy="50" rx="12" ry="6" fill="#F5A623" />
                  <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">APAE Oficial</span>
                <p className="text-[11px] text-slate-400">Associação de Pais e Amigos dos Excepcionais</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Entidade filantrópica sem fins lucrativos, declarada de Utilidade Pública Federal, Estadual e Municipal. Dedicada à inclusão social e reabilitação de pessoas com deficiência intelectual e múltipla.
            </p>

            <div className="pt-2 text-xs text-slate-400 font-mono space-y-1">
              <div><strong>CNPJ:</strong> {INSTITUTION_DATA.cnpj}</div>
              <div><strong>Endereço:</strong> {INSTITUTION_DATA.address}, {INSTITUTION_DATA.city}</div>
            </div>
          </div>

          {/* Coluna 2: Navegação Institucional */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollToSection('institucional')} className="hover:text-white transition-colors">
                  História e Marcos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('institucional')} className="hover:text-white transition-colors">
                  Corpo Técnico Multidisciplinar
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('institucional')} className="hover:text-white transition-colors">
                  Instalações e Unidades
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('transparencia')} className="hover:text-white transition-colors">
                  Portal da Transparência (Lei 13.019)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('noticias-eventos')} className="hover:text-white transition-colors">
                  Notícias e Eventos 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Projetos e Doações */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Como Ajudar</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => openDonationModal(60, 'recorrente')} className="text-apae-yellow-400 hover:text-white font-bold transition-colors">
                  Doação Online (PIX / Cartão)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('projetos')} className="hover:text-white transition-colors">
                  Apadrinhar um Projeto
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('participe')} className="hover:text-white transition-colors">
                  Seja um Voluntário
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('participe')} className="hover:text-white transition-colors">
                  Parcerias Corporativas (ESG)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('doacoes')} className="hover:text-white transition-colors">
                  Doação de Cupom Fiscal
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Gestor */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Atendimento</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>{INSTITUTION_DATA.phone}</p>
              <p>{INSTITUTION_DATA.email}</p>
              <p className="text-[11px] text-slate-500">{INSTITUTION_DATA.openingHours}</p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-apae-yellow-400 transition-colors border border-slate-800 rounded-xl px-3 py-2 bg-slate-900"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminOpen ? 'Fechar Painel Gestor' : 'Área Administrativa'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Rodapé Inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {INSTITUTION_DATA.name}. Todos os direitos reservados. 100% de dedicação à inclusão social.</p>

          <button
            onClick={handleScrollTop}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Voltar ao topo da página"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Voltar ao Topo</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
