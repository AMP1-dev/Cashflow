import React from 'react';
import { Waves, Sun, Sparkles, Shield, Coffee, Check, ArrowRight } from 'lucide-react';

export function AquaticComplexSection() {
  const highlights = [
    {
      title: "Piscina Semiolímpica",
      desc: "Dimensões oficiais para natação livre, treinos dos associados e condicionamento físico.",
      tag: "Treino & Natação"
    },
    {
      title: "Piscina Aquecida Coberta",
      desc: "Temperatura perfeita durante o ano todo para hidroginástica e aulas infantis.",
      tag: "4 Estações"
    },
    {
      title: "Piscina Recreativa & Infantil",
      desc: "Área ampla com prainha, toboáguas seguros e solarium cercado de palmeiras.",
      tag: "Diversão em Família"
    },
    {
      title: "Quiosques com Churrasqueira",
      desc: "Espaços com grelhas, pias e mesas sob árvores para reunir a família nos finais de semana.",
      tag: "Churrasco & Lazer"
    },
    {
      title: "Saunas Seca e a Vapor",
      desc: "Vestiários confortáveis e estrutura completa para relaxar após as piscinas ou treinos.",
      tag: "Bem-Estar"
    },
    {
      title: "Lanchonete & Deck Bar",
      desc: "Porções tradicionais, petiscos e bebidas geladas para você aproveitar sem preocupações.",
      tag: "Conveniência"
    }
  ];

  return (
    <section id="parque-aquatico" className="relative py-24 bg-[#111622] text-white overflow-hidden">
      {/* Background Temático Translúcido e Iluminado (Parque Aquático com piscina nítida e luz de verão) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=85"
          alt="Complexo Aquático ECP"
          className="w-full h-full object-cover filter brightness-110 contrast-105 opacity-55"
        />
        {/* Overlay translúcido mais suave (permite enxergar a piscina, água e sol com nitidez) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e121b]/80 via-[#101420]/65 to-[#0e121b]/85" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-red-600/15 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Coluna Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 aspect-[4/3] group">
              <img
                src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85"
                alt="Parque Aquático Esporte Clube Palmeirense"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1017] via-black/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-600 text-white mb-2 inline-block shadow">
                  Tradição Aquática desde 1971
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-outfit text-white uppercase tracking-tight">
                  O Mais Completo Parque Aquático da Região
                </h3>
              </div>
            </div>

            {/* Selo Flutuante */}
            <div className="absolute -bottom-6 -right-4 md:-right-6 bg-[#161B26]/95 text-white rounded-2xl p-4 shadow-2xl border border-white/15 max-w-xs hidden sm:block backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/80 text-red-400 border border-red-700/50 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Exames Médicos</span>
                  <span className="block text-xs font-bold text-white">Plantão Permanente aos Fins de Semana</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna de Conteúdo */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-600/30">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>4 Piscinas • Sol • Convivência</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold font-outfit uppercase tracking-tight leading-tight text-white">
              Parque Aquático, Solarium & Quiosques Familiares
            </h2>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              O complexo aquático do ECP é o coração do verão palmeirense. Desde a natação semiolímpica e hidroginástica até os finais de semana inesquecíveis nos quiosques arborizados com churrasqueira.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="bg-[#141923]/90 border border-white/10 rounded-2xl p-4 hover:border-cyan-500/40 transition-all hover:-translate-y-0.5 shadow-md group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                    {item.tag}
                  </span>
                  <h4 className="font-bold text-white text-sm font-outfit uppercase tracking-wide group-hover:text-cyan-300 transition-colors">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#seja-socio"
                className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-red-600/30 transition-all inline-flex items-center gap-2 border border-red-500/50"
              >
                <span>Aproveitar as Piscinas</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
