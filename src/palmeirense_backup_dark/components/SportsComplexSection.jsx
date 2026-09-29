import React from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import {
  Trophy,
  Activity,
  Target,
  Dumbbell,
  Waves,
  HeartPulse,
  Sun,
  Flame,
  Award,
  ChevronRight,
  Shield
} from 'lucide-react';

export function SportsComplexSection() {
  const { modalities } = usePalmeirense();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-5 h-5 text-red-500" />;
      case 'Target': return <Target className="w-5 h-5 text-red-500" />;
      case 'Waves': return <Waves className="w-5 h-5 text-red-500" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-red-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-red-500" />;
      case 'Sun': return <Sun className="w-5 h-5 text-red-500" />;
      case 'Award': return <Award className="w-5 h-5 text-red-500" />;
      default: return <HeartPulse className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <section id="esportes" className="relative py-28 bg-[#09090D] text-white overflow-hidden">
      {/* Background Temático Ofuscado (Quadras & Esportes) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
          alt="Esportes ECP"
          className="w-full h-full object-cover filter contrast-125 opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E] via-[#09090D]/95 to-[#0A0A0D]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-red-900/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 border border-red-600/40">
            <Activity className="w-3.5 h-3.5" />
            <span>Infraestrutura Esportiva de Alto Rendimento</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-syne uppercase tracking-tight text-white">
            Complexo Esportivo & Saúde
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-3 leading-relaxed">
            Estrutura oficial para treinos, campeonatos internos ou para manter a saúde e o condicionamento em dia todos os dias da semana.
          </p>
        </div>

        {/* Grid de Modalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modalities.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#13131A]/90 hover:bg-[#181822] rounded-3xl p-6 border border-white/10 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg backdrop-blur-md"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-950/70 border border-red-700/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-red-500 transition-all shadow-[0_0_15px_rgba(229,25,34,0.2)]">
                  {getIcon(item.icon)}
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">
                  {item.stats}
                </span>

                <h3 className="text-lg font-black font-syne uppercase tracking-wide text-white mt-1 mb-2 group-hover:text-red-300 transition-colors">
                  {item.name}
                </h3>

                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-red-400 font-bold uppercase tracking-wider">
                <span>Horários & Turmas</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Destaque Escolinha de Futebol Leonildo Braga */}
        <div className="mt-14 bg-gradient-to-r from-[#171722] via-[#1C1C2A] to-[#12121A] rounded-3xl p-8 md:p-10 border border-red-700/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-red-600/10 blur-[100px] pointer-events-none" />

          <div className="max-w-xl relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-red-500 font-mono">
              Inclusão & Cidadania
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white font-syne uppercase tracking-tight mt-1 mb-2">
              Escolinha de Futebol Infantil "Leonildo Braga"
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Treinos semanais no campo oficial e society com professores capacitados para ensinar disciplina, saúde e espírito esportivo para meninos e meninas sócias e de projetos sociais.
            </p>
          </div>

          <a
            href="#contato"
            className="px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,25,34,0.4)] transition-all flex-shrink-0 relative z-10 border border-red-500/50"
          >
            Matricular meu Filho(a)
          </a>
        </div>
      </div>
    </section>
  );
}
