import React from 'react';
import { 
  Layers, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  Globe, 
  ArrowUp
} from 'lucide-react';
import { COMPANY_INFO } from '../data/drywallData';

export function DrywallFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#06162B] text-slate-300 border-t border-[#002B72] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Presentation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0052D9] text-white flex items-center justify-center shadow-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block">
                  DRYWALL DISTRIBUIDORA
                </span>
                <span className="text-[11px] font-semibold text-cyan-300 block">
                  Interior de São Paulo &bull; Marca Di Brunelli
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Distribuição especializada de placas de gesso, perfis metálicos, lã mineral e insumos de acabamento com entrega expressa para obras do interior paulista.
            </p>

            <div className="text-xs text-slate-400 flex flex-wrap gap-3 pt-1">
              <a href="#utilidades" className="hover:text-white transition-colors">Utilidades</a>
              <span>&bull;</span>
              <a href="#produtos" className="hover:text-white transition-colors">Produtos</a>
              <span>&bull;</span>
              <a href="#noticias" className="hover:text-white transition-colors">Notícias</a>
              <span>&bull;</span>
              <a href="#regioes" className="hover:text-white transition-colors">Regiões Atendidas</a>
              <span>&bull;</span>
              <a href="#loja-demo" className="hover:text-white transition-colors">Exemplo Loja Virtual</a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Linhas Principais
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#produtos" className="hover:text-cyan-300">Placas ST 12.5mm (Áreas Secas)</a></li>
              <li><a href="#produtos" className="hover:text-cyan-300">Placas RU Verde (Áreas Úmidas)</a></li>
              <li><a href="#produtos" className="hover:text-cyan-300">Montantes & Guias 48 / 70 (3m)</a></li>
              <li><a href="#produtos" className="hover:text-cyan-300">Canaletas F530 & Tabica de Forro</a></li>
              <li><a href="#produtos" className="hover:text-cyan-300">Lã de Vidro Acústica Wallfelt</a></li>
              <li><a href="#produtos" className="hover:text-cyan-300">Massa em Balde & Fitas de Junta</a></li>
            </ul>
          </div>

          {/* Contacts (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atendimento & Matriz
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Televendas: <strong>{COMPANY_INFO.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: <strong className="text-emerald-300">{COMPANY_INFO.whatsappDisplay}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Cotações: <strong>{COMPANY_INFO.cotacaoEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de cotar materiais com a Drywall Distribuidora.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80 bg-[#040E1B] py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} <strong>Drywall Distribuidora</strong> &bull; Marca Registrada <strong>Di Brunelli</strong>. Todos os direitos reservados.</span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">dibrunelli.com.br</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Voltar ao topo"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
