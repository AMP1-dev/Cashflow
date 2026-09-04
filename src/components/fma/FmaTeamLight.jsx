import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaTeamLight() {
  const { team, firmConfig } = useFma();

  return (
    <section id="equipe" className="w-full bg-[#FAFAF9] dark:bg-[#0A1A2F] py-20 sm:py-28 border-t border-zinc-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        
        {/* Bloco 3: Split Editorial com Texto e Imagem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center gap-2.5">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#8E7A66] dark:border-l-[#D9C8A6] transition-colors" />
              <h2 className="text-sm font-sans font-bold tracking-[0.2em] text-[#14233C] dark:text-white uppercase transition-colors">
                Nossa Equipe
              </h2>
            </div>

            <p className="text-xl sm:text-2xl font-sans font-normal text-[#14233C] dark:text-white leading-[1.38] transition-colors">
              <strong>{firmConfig.name || 'FMA Advogados'}</strong> é liderada pelo sócio-fundador <strong>{firmConfig.founder || 'Dr. Fernando Maeda'} ({firmConfig.oab || 'OAB/SP 210.374'})</strong>, e tem por premissa oferecer soluções com <strong>profundidade técnica</strong>, <strong>resultados concretos</strong> e <strong>excelência</strong> em cada caso.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de conversar sobre meu caso.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full border border-[#8E7A66] dark:border-[#D9C8A6] group-hover:border-[#14233C] dark:group-hover:border-white group-hover:bg-[#14233C] dark:group-hover:bg-[#D9C8A6] flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-white dark:group-hover:text-[#06172B] transform group-hover:translate-x-0.5 transition-all" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#8E7A66] dark:text-[#D9C8A6] group-hover:text-[#14233C] dark:group-hover:text-white uppercase transition-colors">
                  Falar com o sócio-fundador
                </span>
              </a>
            </div>
          </div>

          {/* Right Column (Imagem com moldura) */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -bottom-6 -left-6 w-36 h-36 border-b-[20px] border-l-[20px] border-[#EFECE8] dark:border-[#0E2238] pointer-events-none transition-colors duration-300" />
            <div className="relative overflow-hidden shadow-xl z-10 bg-white dark:bg-[#06172B] border border-transparent dark:border-white/10">
              <img
                src="/eid_bloco3.jpg"
                alt="FMA Advogados — Sede Corporativa"
                className="w-full h-[320px] sm:h-[400px] object-cover object-center"
              />
            </div>
          </div>

        </div>

        {/* Dynamic Team Cards */}
        <div className="pt-10 border-t border-zinc-200/80 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="p-8 bg-white dark:bg-[#06172B] border border-zinc-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-6 transition-colors"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono font-semibold text-[#8E7A66] dark:text-[#D9C8A6]">
                    {member.oab} {member.isFounder && '• Sócio-Fundador'}
                  </span>
                  
                  <h3 className="text-2xl font-sans font-bold text-[#14233C] dark:text-white">
                    {member.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#8E7A66] dark:text-[#D9C8A6] uppercase tracking-wider">
                    {member.role}
                  </p>

                  <p className="text-xs sm:text-sm text-[#556377] dark:text-[#CFD4DB] leading-relaxed pt-2 font-normal">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <a
                    href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent(`Olá, gostaria de falar com ${member.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#14233C] dark:text-zinc-200 hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8E7A66] dark:text-[#D9C8A6]" />
                    <span>Iniciar Contato</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
