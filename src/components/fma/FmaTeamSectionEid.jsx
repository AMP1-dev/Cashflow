import React from 'react';
import { ArrowRight, GraduationCap, Award, Phone } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaTeamSectionEid() {
  const { team, firmConfig } = useFma();

  return (
    <section id="equipe" className="py-20 sm:py-28 bg-[#0A1A2F] border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* ===================================================================== */}
        {/* BLOCO 3 DO EID: TEXTO À ESQUERDA + IMAGEM PANORÂMICA À DIREITA        */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Idêntico ao texto do Eid) */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-work font-bold text-white tracking-tight">
              Nossa equipe
            </h2>

            <p className="text-base sm:text-lg text-[#CFD4DB] font-normal leading-relaxed">
              <strong className="text-white">{firmConfig.name || 'FMA Advogados'}</strong> é liderada pelo sócio-fundador <strong>{firmConfig.founder || 'Dr. Fernando Maeda'} ({firmConfig.oab || 'OAB/SP 210.374'})</strong>, e tem por premissa oferecer soluções com <strong className="text-white">profundidade técnica</strong>, <strong className="text-white">resultados concretos</strong> e <strong className="text-white">excelência</strong> em cada caso.
            </p>

            <div>
              <a
                href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de conversar sobre meu caso.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-semibold text-white hover:text-eid-gold transition-colors group"
              >
                <span className="border-b border-eid-gold/60 pb-0.5 group-hover:border-eid-gold">Falar com o sócio-fundador</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-eid-gold" />
              </a>
            </div>
          </div>

          {/* Right Column (Imagem com parallax suave, idêntico ao Eid) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="/eid_bloco3.jpg"
                alt="FMA Advogados — Sede e Ambiente Corporativo"
                className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-700"
              />
            </div>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* CARDS DETALHADOS DA EQUIPE / SÓCIOS                                   */}
        {/* ===================================================================== */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="p-8 rounded-2xl bg-[#06172B] border border-white/10 flex flex-col justify-between space-y-6 hover:border-eid-gold/50 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#8E7A66] uppercase">
                      {member.oab}
                    </span>
                    {member.isFounder && (
                      <span className="text-[10px] bg-eid-gold text-[#06172B] font-bold px-2 py-0.5 rounded font-mono uppercase">
                        Sócio-Fundador
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-work font-bold text-white">
                    {member.name}
                  </h3>
                  
                  <p className="text-xs font-medium text-eid-gold">
                    {member.role}
                  </p>

                  <p className="text-xs text-[#CFD4DB] leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent(`Olá, gostaria de falar com ${member.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-lg bg-[#0E2238] hover:bg-[#152E4B] border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-eid-gold" />
                    <span>Falar no WhatsApp</span>
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
