import React from 'react';
import { useAmp } from '../../context/AmpContext';
import { AmpLogo } from './AmpLogo';
import {
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Lock,
  ArrowUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function AmpFooter() {
  const { siteConfig, assets, setCurrentView, themeMode } = useAmp();
  const isDark = themeMode === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t transition-colors duration-200 pt-16 pb-12 ${
      isDark ? 'bg-[#090D16] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Column 1: Brand & Official Legal Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <AmpLogo light={isDark} />

            <p className="text-xs font-light leading-relaxed max-w-sm pt-2">
              Mais de 40 anos de liderança e inovação contínua unindo infraestrutura crítica de TI, suporte gerenciado 24/7, segurança cibernética e inteligência contábil-tributária para empresas em todo o Brasil.
            </p>

            <div className="pt-2 text-xs space-y-1 text-slate-500 font-light">
              <p>CNPJ: {siteConfig.contact.cnpj}</p>
              <p>{siteConfig.contact.registry}</p>
              <p className="flex items-center gap-1.5 text-[#0052D9] pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ambiente Corporativo Criptografado &amp; Certificado</span>
              </p>
            </div>
          </div>

          {/* Column 2: Soluções & Produtos (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Soluções &amp; Sistemas
            </h4>

            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="https://remoto.amp.ia.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#0052D9] transition-colors flex items-center gap-1">
                  <span>MeshCentral Suporte Remoto NOC</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://aliancaempresarial.net.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#0052D9] transition-colors flex items-center gap-1">
                  <span>Aliança Contábil &amp; BPO</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">Painel de Backup Imutável WORM</a></li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">AMP Enterprise ERP &amp; Emissão Fiscal</a></li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">AMP Flow Gestão Financeira</a></li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">Aplicativo de Fidelidade (Loyalty)</a></li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">App Pesagem &amp; Balança Rodoviária</a></li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">Módulo Banco &amp; Controle de Cheques</a></li>
            </ul>
          </div>

          {/* Column 3: Arquitetura & Governança (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Navegação
            </h4>

            <ul className="space-y-2 text-xs font-light">
              <li><a href="#inicio" className="hover:text-[#0052D9] transition-colors">Visão Geral</a></li>
              <li><a href="#fullstack" className="hover:text-[#0052D9] transition-colors">Arquitetura Full-Stack</a></li>
              <li><a href="#produtos" className="hover:text-[#0052D9] transition-colors">Catálogo de Produtos</a></li>
              <li><a href="#cases-industria" className="hover:text-[#0052D9] transition-colors">Cases por Indústria</a></li>
              <li><a href="#lideranca" className="hover:text-[#0052D9] transition-colors">Liderança &amp; Uptime</a></li>
              <li><a href="#central-clientes" className="hover:text-[#0052D9] transition-colors">Central de Clientes</a></li>
              <li><a href="https://projetojoaodebarro.org.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#0052D9] transition-colors">Projeto João de Barro ESG</a></li>
              <li><a href="https://amplificadora.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#0052D9] transition-colors">Rádio Amplificadora HD</a></li>
            </ul>
          </div>

          {/* Column 4: Contato & Diretoria (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sede &amp; Atendimento
            </h4>

            <div className="space-y-2 text-xs font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0052D9] shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0052D9] shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0052D9] shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </p>
              <p className="text-slate-400 text-[11px] pt-1">
                {siteConfig.contact.operatingHours}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-light transition-all ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Acesso Diretoria</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Grupo AMP — Ampliando sua Tecnologia. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">40+ Anos de Excelência Corporativa</span>
            <button
              onClick={scrollToTop}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Voltar ao topo"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px]">Topo</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
