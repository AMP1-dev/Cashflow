import React from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Quote,
  Star,
  ShieldCheck,
  Award,
  CheckCircle,
  Building2,
  Lock
} from 'lucide-react';

export function AmpTestimonialsSection() {
  const { testimonials, siteConfig } = useAmp();

  const certifications = [
    { title: "CREA-SP", desc: "Registro e Responsabilidade Técnica de Engenharia de TI", icon: ShieldCheck },
    { title: "CRC-SP", desc: "Conselho Regional de Contabilidade e Governança Fiscal", icon: Building2 },
    { title: "ITIL & COBIT", desc: "Melhores Práticas Globais de Gerenciamento de Serviços de TI", icon: Award },
    { title: "LGPD Ready", desc: "Segurança de Dados e Conformidade com a Lei 13.709/2018", icon: Lock }
  ];

  return (
    <section className="py-24 bg-[#080E1A] relative overflow-hidden border-t border-slate-800">
      
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Quote className="w-3.5 h-3.5" />
            <span>Chancelas & Depoimentos de Lideranças</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            A Confiança de Quem Vive a <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">Nossa Parceria</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Relações de longo prazo construídas com ética, entrega rigorosa de SLAs e governança de dados.
          </p>
        </div>

        {/* Testimonials 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-7 flex flex-col justify-between shadow-2xl space-y-6"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-sm font-black text-white">{t.name}</h4>
                <p className="text-xs text-amber-400 font-bold">{t.role}</p>
                <p className="text-[11px] text-slate-400">{t.company} • {t.city}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Certifications & Compliance Badges */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="text-center mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Certificações & Conformidades Técnicas Oficiais
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{c.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
