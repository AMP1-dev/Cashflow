import React from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, Shield, Sparkles, Home, CheckCircle, Lightbulb, Users } from 'lucide-react';

export function AboutSection() {
  const { siteConfig } = useApp();

  const values = [
    {
      title: 'Acolhimento & Afeto',
      desc: 'Um refúgio seguro onde cada criança é ouvida, respeitada e incentivada em sua singularidade.',
      icon: HeartHandshake,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      title: 'O Lúdico como Linguagem',
      desc: 'Brincar não é passatempo: é o método primordial de autoconhecimento, socialização e cidadania.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Transparência & Seriedade',
      desc: 'Gestão rigorosa, prestação de contas pública e conformidade com órgãos de controle e fomento.',
      icon: Shield,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      title: 'Fortalecimento Familiar',
      desc: 'Integração ativa com as famílias e a comunidade do entorno para proteção integral dos direitos.',
      icon: Users,
      color: 'bg-sky-50 text-sky-600 border-sky-100'
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Home className="w-3.5 h-3.5" />
            <span>Nossa Identidade & Missão</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Construindo um ninho seguro para a imaginação infantil
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Assim como o pássaro João-de-barro modela sua casa com paciência, carinho e elementos da natureza, nós criamos um ambiente seguro para acolher os sonhos de cada criança.
          </p>
        </div>

        {/* 2-Column Story & Ludic Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left: Photos collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80"
                  alt="Atividade artística"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 rounded-2xl bg-terracotta-50 border border-terracotta-100 text-center">
                <span className="text-3xl font-black text-terracotta-600 block">4 a 14</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mt-1">Anos de Idade</span>
                <span className="text-[11px] text-gray-500">Atendimento no contraturno</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <span className="text-3xl font-black text-amber-600 block">100%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mt-1">Gratuito</span>
                <span className="text-[11px] text-gray-500">Para todas as famílias atendidas</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80"
                  alt="Momento da contação de histórias"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right: Story details */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/70">
              <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                Por que o foco é o Lúdico e não o escolar tradicional?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                As crianças já passam horas sentadas em carteiras escolares ouvindo matérias teóricas. No <strong>Projeto João de Barro</strong>, nosso objetivo é nutrir a dimensão que a escola formal muitas vezes não consegue alcançar com profundidade: a <strong>expressão das emoções, o respeito nas brincadeiras em grupo, o tato com as artes e o resgate da infância</strong>.
              </p>
            </div>

            <p className="text-gray-600 text-base leading-relaxed">
              {siteConfig.aboutDescription}
            </p>

            <p className="text-gray-600 text-base leading-relaxed">
              {siteConfig.history}
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Alimentação saudável e balanceada em todas as jornadas</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Acompanhamento socioemocional e suporte às famílias</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Parcerias públicas homologadas e auditorias contínuas</span>
              </div>
            </div>

          </div>

        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${v.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{v.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
