import React from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import { Shield, Trees, Waves, Trophy, Users } from 'lucide-react';

export function ClubStats() {
  const { clubConfig } = usePalmeirense();

  const stats = [
    {
      icon: Shield,
      number: "118",
      unit: "Anos",
      label: "Tradição Centenária",
      desc: "Fundado em 7 de Setembro de 1908"
    },
    {
      icon: Trees,
      number: "36.400",
      unit: "m²",
      label: "Área Verde & Lazer",
      desc: "No coração da cidade"
    },
    {
      icon: Waves,
      number: "4",
      unit: "Piscinas",
      label: "Parque Aquático",
      desc: "Semiolímpica, aquecida e recreativas"
    },
    {
      icon: Trophy,
      number: "8+",
      unit: "Quadras & Campos",
      label: "Complexo Esportivo",
      desc: "Futebol, society, tênis de saibro"
    },
    {
      icon: Users,
      number: "100%",
      unit: "Familiar",
      label: "Ambiente Seguro",
      desc: "Lazer e encontros de gerações"
    }
  ];

  return (
    <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-4">
      <div className="bg-[#121217]/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center pt-4 lg:pt-0 lg:px-4 first:pt-0 group">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-600/30 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-red-500 transition-all shadow-[0_0_15px_rgba(229,25,34,0.2)]">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
                  {item.number}
                </span>
                <span className="text-xs font-bold text-red-500 uppercase">{item.unit}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 mt-1">{item.label}</span>
              <span className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
