import React from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  Shield,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Instagram,
  Facebook,
  Clock,
  Settings
} from 'lucide-react';

export function Footer() {
  const { clubConfig, setIsAdminOpen } = usePalmeirense();

  return (
    <footer id="contato" className="bg-[#050508] text-zinc-400 border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      {/* Luz ambiente rubra */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Coluna 1: Brasão & Institucional */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/logo-ecp.png"
                alt="Brasão Oficial Esporte Clube Palmeirense"
                className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(229,25,34,0.4)]"
              />
              <div>
                <span className="block text-xl font-black text-white font-outfit uppercase tracking-wider leading-none">
                  Palmeirense
                </span>
                <span className="block text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1 font-mono">
                  Fundado em 07-09-1908
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Mais de um século de tradição, esporte, grandes bailes e o melhor ponto de encontro das famílias de Santa Cruz das Palmeiras.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/${clubConfig.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-red-500"
                aria-label="Instagram Oficial"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://facebook.com${clubConfig.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-blue-600 text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-blue-500"
                aria-label="Facebook Oficial"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=${clubConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-emerald-500"
                aria-label="WhatsApp Oficial"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#hero" className="hover:text-red-400 transition-colors">Início</a></li>
              <li><a href="#sobre" className="hover:text-red-400 transition-colors">História & Tradição (1908)</a></li>
              <li><a href="#parque-aquatico" className="hover:text-red-400 transition-colors">Parque Aquático & Quiosques</a></li>
              <li><a href="#esportes" className="hover:text-red-400 transition-colors">Complexo Esportivo & Academia</a></li>
              <li><a href="#bailes-e-shows" className="hover:text-red-400 transition-colors">Bailes, Boates & Salão Nobre</a></li>
              <li><a href="#publicacoes" className="hover:text-red-400 transition-colors">Mural de Publicações</a></li>
              <li><a href="#eventos" className="hover:text-red-400 transition-colors">Agenda de Eventos</a></li>
              <li><a href="#seja-socio" className="hover:text-red-400 transition-colors">Planos de Sócio</a></li>
            </ul>
          </div>

          {/* Coluna 3: Horários */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">
              Horários de Atendimento
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Secretaria Social:</strong>
                  Segunda a Sexta: 08h00 às 18h00<br />
                  Sábados: 08h00 às 12h00
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Parque Aquático:</strong>
                  Terça a Domingo: 09h00 às 19h00
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Academia de Musculação:</strong>
                  Segunda a Sexta: 06h00 às 21h00<br />
                  Sábados: 08h00 às 13h00
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 4: Contatos */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-mono">
              Sede Social & Esportiva
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Centro, Santa Cruz das Palmeiras - SP • CEP 13650-000</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{clubConfig.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>WhatsApp: {clubConfig.whatsappFormatted}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{clubConfig.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Final */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            <span>© {new Date().getFullYear()} Esporte Clube Palmeirense. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-900/90 px-3 py-1 rounded-lg border border-white/10 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-red-500" />
              <span>Painel Administrativo ECP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
