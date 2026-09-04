import React from 'react';
import { UserCheck, Award, GraduationCap, Phone, Mail, Scale } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaTeamSection() {
  const { team, firmConfig } = useFma();

  return (
    <section id="equipe" className="py-20 sm:py-28 bg-[#0C0E12] relative border-t border-fma-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-fma-gold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            Corpo Jurídico & Sócios
          </div>

          <h2 className="text-3xl sm:text-4xl font-times font-bold text-white tracking-tight">
            Advogados Especialistas & Sócios
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Conheça os profissionais dedicados à condução técnica, estratégica e ética de cada processo.
          </p>
        </div>

        {/* Team Grid */}
        <div className={`grid gap-8 ${
          team.length === 1 
            ? 'max-w-3xl mx-auto grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {team.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl bg-fma-card border border-fma-border p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-fma-gold/50 transition-all hover:shadow-2xl hover:shadow-black/60 relative overflow-hidden"
            >
              {member.isFounder && (
                <div className="absolute top-0 right-0 bg-fma-gold text-black text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow">
                  Fundador Titular
                </div>
              )}

              <div className="space-y-4">
                {/* Monogram / Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-fma-surface border border-fma-gold/40 flex items-center justify-center text-fma-gold font-times font-bold text-2xl shadow-lg">
                  {member.name.replace('Dr. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                {/* Name & OAB */}
                <div className="space-y-1 border-b border-zinc-800 pb-4">
                  <h3 className="text-xl sm:text-2xl font-times font-bold text-white tracking-tight">
                    {member.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-fma-gold font-semibold">
                      {member.oab}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-start gap-2 text-fma-goldLight font-medium">
                    <GraduationCap className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
                    <span>{member.specialties}</span>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed pt-2 font-normal">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Direct Action */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
                <a
                  href={`https://wa.me/${firmConfig.contacts?.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de falar com ${member.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-fma-surface hover:bg-zinc-800 border border-fma-border text-white font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-fma-gold" />
                  <span>Falar com {member.name.split(' ')[0]}</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
