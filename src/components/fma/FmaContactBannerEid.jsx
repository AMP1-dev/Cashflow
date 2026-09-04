import React from 'react';
import { ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaContactBannerEid({ onOpenTriage }) {
  const { firmConfig } = useFma();

  return (
    <section id="contato" className="relative py-24 sm:py-32 bg-[#06172B] overflow-hidden border-b border-white/10">
      
      {/* Background Graphic Asset (Idêntico ao Bloco 4 do Eid Advogados) */}
      <div className="absolute inset-0 w-full h-full opacity-15">
        <img
          src="/eid_bloco4.jpg"
          alt="Textura Arquitetônica FMA"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#06172B] via-[#06172B]/90 to-[#06172B]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-work font-bold text-white tracking-tight">
          Entre em contato conosco
        </h2>

        <p className="text-base sm:text-lg text-[#CFD4DB] max-w-2xl mx-auto font-normal">
          Análise preliminar de viabilidade para demandas de Direito Bancário, Saúde, Cível e Contratos com celeridade e sigilo.
        </p>

        {/* Clean Link / Button (Idêntico ao Eid Advogados) */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
          <a
            href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de conversar sobre um caso jurídico.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-lg bg-eid-gold hover:bg-[#c4b391] text-[#06172B] font-bold text-sm tracking-wide flex items-center gap-2 shadow-2xl transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Fale conosco no WhatsApp</span>
          </a>

          <button
            onClick={onOpenTriage}
            className="px-7 py-3.5 rounded-lg bg-[#0E2238] hover:bg-[#152E4B] border border-white/20 text-white font-medium text-sm flex items-center gap-2 transition-all"
          >
            <Clock className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Plantão de Liminares</span>
          </button>
        </div>

        {/* Office Contact Info Row */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#CFD4DB] border-t border-white/10 mt-8">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-eid-gold flex-shrink-0" />
            <span>{firmConfig.contacts?.address || 'São Paulo — SP'}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-eid-gold flex-shrink-0" />
            <a href={`mailto:${firmConfig.contacts?.email || 'contato@fmadv.net'}`} className="hover:text-white transition-colors">
              {firmConfig.contacts?.email || 'contato@fmadv.net'}
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-eid-gold flex-shrink-0" />
            <span>{firmConfig.contacts?.whatsappFormatted || '(11) 94890-0900'}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
