import React from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import { Sparkles, Calendar, Clock, MapPin, Music, Ticket, ArrowRight } from 'lucide-react';

export function EventsAndPartiesSection() {
  const { events, clubConfig } = usePalmeirense();

  const traditionalParties = [
    {
      title: "Baile do Hawai",
      desc: "O evento mais esperado de toda a região. Flores, frutas tropicais, grandes bandas e duas pistas simultâneas.",
      tag: "Tradição ECP",
      season: "Primavera"
    },
    {
      title: "Baile de Gala de Aniversário",
      desc: "Celebrado na Semana da Pátria (07 de Setembro), em traje a rigor/gala, homenageando a fundação de 1908.",
      tag: "Gala & Tradição",
      season: "Setembro"
    },
    {
      title: "Grande Baile de Réveillon",
      desc: "A virada de ano mais segura e emocionante da cidade com show pirotécnico, ceia em família e boate até o amanhecer.",
      tag: "Fim de Ano",
      season: "Dezembro"
    },
    {
      title: "Boate Gênesis & Shows",
      desc: "Noites dançantes, bailes sertanejos, matinês de carnaval e shows ao vivo no grandioso Salão Nobre.",
      tag: "Vida Noturna",
      season: "O Ano Todo"
    }
  ];

  return (
    <section id="bailes-e-shows" className="relative py-24 bg-[#141524] text-white overflow-hidden">
      {/* Background Temático Translúcido (Bailes, Luzes e Salão Nobre com visibilidade nítida) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80"
          alt="Bailes e Shows ECP"
          className="w-full h-full object-cover filter contrast-110 brightness-110 opacity-45"
        />
        {/* Overlay translúcido elegante e luminoso */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f101a]/80 via-[#141524]/65 to-[#10111d]/85" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/15 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 border border-red-600/30">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>A Maior Tradição Festiva & Vida Noturna</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white">
            Bailes de Gala, Boate Gênesis & Shows
          </h2>
          <p className="text-zinc-300 text-sm md:text-base mt-3 leading-relaxed">
            Desde a inauguração do Salão Social Nobre em 1999, o Palmeirense se consagrou como o palco das noites mais inesquecíveis da nossa cidade e de todo o interior paulista.
          </p>
        </div>

        {/* 4 Grandes Festas Tradicionais com Estilo Inspirado no Slide 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {traditionalParties.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#141520]/90 rounded-2xl p-5 border border-white/10 hover:border-red-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-md backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/70 px-2 py-0.5 rounded border border-red-800/30">
                    {p.tag}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">{p.season}</span>
                </div>

                <h3 className="text-base font-bold font-outfit uppercase text-white mb-2 group-hover:text-red-300 transition-colors">
                  {p.title}
                </h3>

                <p className="text-zinc-400 text-xs leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Agenda Oficial de Eventos */}
        <div id="eventos" className="bg-[#12131D]/95 rounded-3xl p-7 md:p-9 border border-white/10 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Programação Oficial
              </span>
              <h3 className="text-xl md:text-2xl font-bold font-outfit text-white uppercase mt-0.5">
                Agenda de Eventos & Bailes
              </h3>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${clubConfig.whatsapp}&text=Ol%C3%A1!%20Gostaria%20de%20reservar%20mesas%20ou%20ingressos%20para%20o%20pr%C3%B3ximo%20baile.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all border border-red-500/40"
            >
              <Ticket className="w-4 h-4" />
              <span>Reserva de Mesas pelo WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#181926]/90 rounded-xl p-5 border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/40">
                      {evt.badge}
                    </span>
                    <span className="text-xs font-medium text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {evt.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white font-outfit uppercase group-hover:text-red-300 transition-colors mb-2">
                    {evt.title}
                  </h4>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
                  <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    {evt.date} às {evt.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {evt.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner de Locação do Salão Social Nobre */}
          <div id="salao-social" className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg md:text-xl font-black text-white font-syne uppercase">
                Vai realizar Casamento, Formatura ou Aniversário de 15 Anos?
              </h4>
              <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
                O Salão Social Nobre do Esporte Clube Palmeirense é climatizado, conta com palco profissional, camarins, cozinha industrial e capacidade para grandes celebrações com todo o requinte e comodidade.
              </p>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${clubConfig.whatsapp}&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20loca%C3%A7%C3%A3o%20do%20Sal%C3%A3o%20Social.`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all flex-shrink-0"
            >
              Consultar Disponibilidade do Salão
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
