import React from 'react';
import { Award, GraduationCap, Calendar, Landmark, Phone } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaAboutSection() {
  const { firmConfig } = useFma();

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-[#0F1116] relative border-t border-fma-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Profile Card */}
          <div className="lg:col-span-5 relative">
            
            <div className="relative rounded-2xl bg-gradient-to-b from-fma-surface to-fma-card border border-fma-border p-8 shadow-2xl space-y-6">
              
              {/* Monogram Badge */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-fma-surface border border-fma-gold/40 flex items-center justify-center text-fma-gold shadow-lg font-times font-bold text-2xl">
                  FMA
                </div>
                <div className="text-right">
                  <span className="block text-xs font-mono text-fma-gold font-bold">
                    {firmConfig.oab || 'OAB/SP 210.374'}
                  </span>
                  <span className="block text-[11px] text-zinc-400">
                    {firmConfig.experienceSince || 'Desde 2003'}
                  </span>
                </div>
              </div>

              {/* Title / Name */}
              <div className="space-y-1 border-b border-zinc-800 pb-6">
                <h3 className="text-2xl sm:text-3xl font-times font-bold text-white tracking-tight">
                  {firmConfig.founder || 'Dr. Fernando Maeda'}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-fma-goldLight">
                  Sócio-Fundador & Advogado Titular
                </p>
              </div>

              {/* Credentials Pills */}
              <div className="space-y-3.5 text-xs text-zinc-300 font-normal">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
                  <span>Especializado em Contratos pela <strong>Fundação Getulio Vargas (FGV)</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
                  <span>Pós-graduado em <strong>Direito Processual Civil</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Landmark className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
                  <span>Inscrito na <strong>Associação dos Advogados de São Paulo (AASP)</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-fma-gold flex-shrink-0 mt-0.5" />
                  <span>Mais de <strong>20 anos de prática ininterrupta</strong> nos tribunais</span>
                </div>
              </div>

              {/* Quick WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de conversar sobre meu caso.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-fma-surface hover:bg-zinc-800 border border-fma-border text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Phone className="w-3.5 h-3.5 text-fma-gold" />
                  <span>Agendar Consulta Direta</span>
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Institutional Biography & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-fma-gold uppercase tracking-wider">
                Sobre o Escritório
              </div>
              <h2 className="text-3xl sm:text-4xl font-times font-bold text-white tracking-tight">
                Mais de Duas Décadas Pautadas pela Verdade Técnica e Proteção do Cliente
              </h2>
            </div>

            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-normal">
              <p>
                Inscrito desde 2003 na Ordem dos Advogados do Brasil (OAB/SP 210.374), o <strong>Dr. Fernando Maeda</strong> consolidou sua trajetória na advocacia combatendo abusos contratuais e resguardando os direitos fundamentais de cidadãos e empresas.
              </p>
              <p>
                À frente da <strong className="text-white font-semibold">{firmConfig.name || 'FMA ADVOGADOS'}</strong>, o escritório destaca-se nas esferas <strong>Cível, Direito Bancário, Contratos e Direito à Saúde</strong>, atuando ativamente na obtenção de tutelas de urgência (liminares) para procedimentos médicos vitais e na revisão minuciosa de passivos bancários.
              </p>
              <p>
                Nosso compromisso fundamental não é incentivar aventuras jurídicas, mas sim preparar o cliente com transparência absoluta: analisar a prova material, avaliar os riscos processuais e adotar a estratégia de maior impacto e celeridade.
              </p>
            </div>

            {/* Three Pillars Bento Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div className="space-y-1">
                <span className="block text-2xl font-times font-bold text-white">20+</span>
                <span className="block text-xs font-medium text-zinc-400">Anos nos Tribunais</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-times font-bold text-emerald-400">24/48h</span>
                <span className="block text-xs font-medium text-zinc-400">Agilidade em Liminares</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-times font-bold text-fma-gold">100%</span>
                <span className="block text-xs font-medium text-zinc-400">Foco Cível (Zero Criminal)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
