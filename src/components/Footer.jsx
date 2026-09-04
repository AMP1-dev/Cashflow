import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Phone, Mail, MapPin, Instagram, Linkedin, Facebook, Youtube, ShieldCheck, ArrowUp } from 'lucide-react';

export function Footer() {
  const { siteConfig, setCurrentView } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-terracotta-600 flex items-center justify-center text-white shadow-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                ALIANÇA <span className="text-terracotta-500 font-light">EMPRESARIAL</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.slogan || 'A parceria contábil sólida que protege seu patrimônio e impulsiona o crescimento do seu negócio.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {siteConfig.social?.instagram && (
                <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-terracotta-500 hover:text-white flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteConfig.social?.linkedin && (
                <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-terracotta-500 hover:text-white flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteConfig.social?.facebook && (
                <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-terracotta-500 hover:text-white flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2">
              <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Serviços Contábeis</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a></li>
              <li><a href="#segmentos" className="hover:text-white transition-colors">Segmentos</a></li>
              <li><a href="#simulador" className="hover:text-white transition-colors">Simulador Tributário</a></li>
              <li><a href="#artigos" className="hover:text-white transition-colors">Artigos & Notícias</a></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Especialidades</h4>
            <ul className="space-y-2 text-[11px]">
              <li>Abertura & Legalização de Empresas</li>
              <li>Planejamento Tributário & Elisão Fiscal</li>
              <li>BPO Financeiro & Gestão de Caixa</li>
              <li>Folha de Pagamento & eSocial</li>
              <li>Contabilidade Consultiva & DRE</li>
              <li>Holding Familiar & Patrimonial</li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Sede São Paulo</h4>
            <p className="text-[11px] text-slate-400">{siteConfig.contact.address}</p>
            <p className="text-[11px] text-white font-bold">{siteConfig.contact.phone}</p>
            <p className="text-[11px] text-emerald-400 font-bold">{siteConfig.contact.whatsappFormatted}</p>
            <p className="text-[11px] text-slate-400">{siteConfig.contact.email}</p>
            
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-800">
                {siteConfig.contact.crc}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} {siteConfig.name} Contabilidade e Assessoria. Todos os direitos reservados. CNPJ: {siteConfig.contact.cnpj}.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('admin')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Área Restrita (Admin)
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-terracotta-400 hover:text-terracotta-300 font-bold"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
