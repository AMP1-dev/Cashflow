import React, { useState } from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import { Shield, Check, MessageCircle, Heart, Users, Sparkles, Send } from 'lucide-react';

export function MembershipSection() {
  const { clubConfig, showToast } = usePalmeirense();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('Plano Familiar');
  const [message, setMessage] = useState('');

  const plans = [
    {
      title: "Plano Familiar",
      badge: "Mais Procurado",
      desc: "Acesso ilimitado para titular, cônjuge e dependentes em todas as áreas do clube.",
      features: [
        "Acesso livre ao Parque Aquático e piscinas",
        "Uso liberado dos quiosques com churrasqueira",
        "Escolinhas de futebol e tênis para crianças",
        "Campos de society e quadras poliesportivas",
        "Prioridade e desconto exclusivo nos Bailes de Gala",
        "Descontos na academia e aulas esportivas"
      ],
      highlight: true
    },
    {
      title: "Plano Individual",
      badge: "Esporte & Saúde",
      desc: "Ideal para jovens e adultos que buscam praticar esportes e manter a saúde ativa.",
      features: [
        "Acesso livre ao Parque Aquático e solarium",
        "Academia completa de musculação e cárdio",
        "Rachões de futebol society e tênis de saibro",
        "Inscrição nos torneios esportivos internos",
        "Acesso a bailes, shows e noites dançantes",
        "Uso das saunas seca e vapor"
      ],
      highlight: false
    },
    {
      title: "Cota Patrimonial",
      badge: "Tradição & Legado",
      desc: "Torne-se sócio proprietário de um dos clubes mais tradicionais do estado de SP.",
      features: [
        "Título patrimonial definitivo e transferível",
        "Direito a voto nas assembleias do clube",
        "Inclusão de toda a família no quadro de sócios",
        "Máxima prioridade na reserva de mesas de eventos",
        "Coproprietário de 36.438 m² no centro da cidade",
        "Condições especiais de adesão na secretaria"
      ],
      highlight: false
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast('Por favor, informe seu nome e WhatsApp.', 'error');
      return;
    }

    const text = `Olá, Secretaria do Esporte Clube Palmeirense!\n\nMeu nome é *${name}* e tenho interesse em me associar ao clube.\n- *Plano de Interesse:* ${plan}\n- *Telefone/WhatsApp:* ${phone}\n${message ? `- *Observações:* ${message}` : ''}\n\nGostaria de saber os valores das mensalidades e como proceder com a proposta de adesão.`;
    const url = `https://api.whatsapp.com/send?phone=${clubConfig.whatsapp}&text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
    showToast('Redirecionando para o WhatsApp oficial da secretaria...');
  };

  return (
    <section id="seja-socio" className="relative py-28 bg-[#0A0A0E] text-white overflow-hidden">
      {/* Background Temático Ofuscado (Lazer & Convivência Familiar) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1920&q=80"
          alt="Família ECP"
          className="w-full h-full object-cover filter contrast-125 opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090D] via-[#0A0A0E]/95 to-[#060608]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[300px] bg-red-600/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 border border-red-600/30">
            <Users className="w-3.5 h-3.5" />
            <span>Faça Parte do Nosso Clube</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white">
            Planos de Associação & Proposta Online
          </h2>
          <p className="text-zinc-300 text-sm md:text-base mt-3 leading-relaxed">
            Escolha o plano ideal para você ou toda a sua família desfrutar de toda a estrutura do clube mais completo da nossa região.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative backdrop-blur-xl ${
                p.highlight
                  ? 'bg-[#151522] text-white shadow-[0_0_50px_rgba(229,25,34,0.35)] scale-105 border-2 border-red-600 z-10'
                  : 'bg-[#101017]/90 text-zinc-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-white/20 border border-white/10'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-[0_0_15px_rgba(229,25,34,0.6)] font-mono">
                  Recomendado para Famílias
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-mono ${
                    p.highlight ? 'bg-red-950 text-red-400 border border-red-800/40' : 'bg-white/5 text-zinc-400 border border-white/10'
                  }`}>
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-outfit text-white uppercase mb-2">
                  {p.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {p.desc}
                </p>

                <ul className="space-y-3 mb-8">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs font-medium">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                      <span className="text-zinc-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setPlan(p.title);
                  document.getElementById('form-socio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all text-center ${
                  p.highlight
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(229,25,34,0.5)] border border-red-500/50'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                }`}
              >
                Escolher {p.title}
              </button>
            </div>
          ))}
        </div>

        {/* Formulário com Envio para WhatsApp */}
        <div id="form-socio" className="bg-[#12121A]/95 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/10 max-w-3xl mx-auto backdrop-blur-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black font-syne uppercase text-white">
              Solicite sua Proposta de Adesão
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Preencha os dados abaixo e converse diretamente com a secretaria do clube via WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                  WhatsApp com DDD *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (19) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                Plano Desejado
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#171722] text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="Plano Familiar">Plano Familiar (Titular + Dependentes)</option>
                <option value="Plano Individual">Plano Individual</option>
                <option value="Cota Patrimonial">Cota Patrimonial (Sócio Proprietário)</option>
                <option value="Dúvidas e Outros Planos">Outras informações / Dúvidas</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                Observações ou Dúvidas (Opcional)
              </label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Gostaria de saber mais sobre aulas de natação para meus filhos..."
                className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none placeholder-zinc-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(229,25,34,0.45)] hover:shadow-[0_0_40px_rgba(229,25,34,0.6)] transition-all flex items-center justify-center gap-2 border border-red-500/50"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar Proposta para a Secretaria pelo WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
