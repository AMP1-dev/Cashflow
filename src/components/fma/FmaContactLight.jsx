import React from 'react';
import { ArrowRight, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaContactLight({ onOpenTriage }) {
  const { firmConfig } = useFma();

  return (
    <section id="contato" className="relative w-full bg-[#FAF9F7] dark:bg-[#06172B] py-24 sm:py-32 border-t border-zinc-200/80 dark:border-white/10 overflow-hidden text-center transition-colors duration-300">
      
      {/* Background Graphic Asset */}
      <div className="absolute inset-0 w-full h-full opacity-40 dark:opacity-10 pointer-events-none transition-opacity">
        <img
          src="/eid_bloco4.jpg"
          alt="Textura Arquitetônica FMA"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 space-y-10">
        
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-sans font-bold text-[#14233C] dark:text-white tracking-tight uppercase transition-colors">
          Entre em contato conosco
        </h2>

        <p className="text-sm sm:text-base text-[#556377] dark:text-[#CFD4DB] max-w-2xl mx-auto font-normal leading-relaxed transition-colors">
          Atendimento personalizado com sigilo e rigor técnico para causas Cíveis, Bancárias, Contratuais e Liminares em Direito à Saúde.
        </p>

        {/* Circular Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
          <a
            href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de conversar sobre meu caso.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full border border-[#8E7A66] dark:border-[#D9C8A6] group-hover:border-[#14233C] dark:group-hover:border-white group-hover:bg-[#14233C] dark:group-hover:bg-[#D9C8A6] flex items-center justify-center transition-all bg-white dark:bg-[#0E2238] shadow-sm">
              <ArrowRight className="w-4 h-4 text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-white dark:group-hover:text-[#06172B] transform group-hover:translate-x-0.5 transition-all" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-[#14233C] dark:group-hover:text-white uppercase transition-colors">
              Fale conosco no WhatsApp
            </span>
          </a>

          <button
            onClick={onOpenTriage}
            className="px-5 py-2.5 rounded-full bg-[#14233C] dark:bg-[#0E2238] hover:bg-[#8E7A66] dark:hover:bg-[#152E4B] border border-transparent dark:border-white/10 text-white text-xs font-bold tracking-wider flex items-center gap-2 shadow transition-all uppercase"
          >
            <Clock className="w-3.5 h-3.5 text-[#D9C8A6]" />
            <span>Plantão de Liminares</span>
          </button>
        </div>

        {/* Contact Info Row */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#556377] dark:text-[#CFD4DB] border-t border-zinc-200/80 dark:border-white/10 mt-10 transition-colors">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-[#8E7A66] dark:text-[#D9C8A6] flex-shrink-0" />
            <span>{firmConfig.contacts?.address || 'São Paulo — SP'}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-[#8E7A66] dark:text-[#D9C8A6] flex-shrink-0" />
            <a href={`mailto:${firmConfig.contacts?.email || 'contato@fmadv.net'}`} className="hover:text-[#14233C] dark:hover:text-white transition-colors">
              {firmConfig.contacts?.email || 'contato@fmadv.net'}
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-[#8E7A66] dark:text-[#D9C8A6] flex-shrink-0" />
            <span>{firmConfig.contacts?.whatsappFormatted || '(11) 94890-0900'}</span>
          </div>
        </div>

      </div>

    </section>
  );
}
