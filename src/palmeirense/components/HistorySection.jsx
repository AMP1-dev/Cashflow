import React from 'react';
import { usePalmeirense } from '../context/PalmeirenseContext';
import { Shield, Landmark, CheckCircle, Award } from 'lucide-react';

export function HistorySection() {
  const { clubConfig } = usePalmeirense();

  const timeline = [
    {
      year: "1908",
      title: "O Nascimento da Paixão Centenária",
      desc: "A 7 de Setembro de 1908 nascia o Esporte Clube Palmeirense, graças aos esforços de entusiastas do futebol introduzido no Brasil por Charles Miller. Armando Bortone trouxe a primeira bola de couro com tento para a cidade."
    },
    {
      year: "Anos 20",
      title: "O Histórico Duelo contra o Torino A.C. da Itália",
      desc: "A agremiação e a colônia italiana viveram dias inesquecíveis com a visita do Torino A.C. no campo da Fazenda Santa Veridiana, um feito memorável que marcou para sempre o esporte paulista."
    },
    {
      year: "1971 - 1973",
      title: "A Era Aquática & Expansão Monumental",
      desc: "Sob a liderança de João Elias Margutti, o clube construiu seu primeiro complexo de piscinas, expandindo exponencialmente o quadro de famílias associadas e o convívio social."
    },
    {
      year: "1989 - 1999",
      title: "O Monumental Salão Social Nobre",
      desc: "Construção de um dos maiores salões de eventos e shows do interior paulista, transformando o Baile do Hawai, o Baile de Réveillon e o Baile de Gala em patrimônios festivos de toda a região."
    },
    {
      year: "Hoje",
      title: "36.438 m² de Amor ao Esporte e à Família",
      desc: "Um clube centenário completo, unindo piscinas, quadras de saibro, campos society, academia, grandes shows e a segurança que a sua família merece."
    }
  ];

  return (
    <section id="sobre" className="relative py-24 bg-[#12131C] text-white overflow-hidden">
      {/* Background Temático Translúcido (História Centenária & Campo com visibilidade nítida) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80"
          alt="História do Futebol ECP"
          className="w-full h-full object-cover filter contrast-110 brightness-105 opacity-40"
        />
        {/* Overlay translúcido suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0f16]/80 via-[#12131c]/70 to-[#0e0f17]/85" />
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-red-600/15 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Coluna Institucional */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-600/40 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>Memória Centenária (1908 - Presente)</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold font-outfit uppercase tracking-tight leading-tight text-white">
              Mais de um século de glórias, tradição e amor à camisa.
            </h2>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              O <strong className="text-white font-bold">Esporte Clube Palmeirense</strong> é a maior instituição social e esportiva de Santa Cruz das Palmeiras. Um legado forjado na união de famílias, na disciplina esportiva e na celebração das amizades que atravessam gerações.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-start gap-3.5 backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-white">36.438 m² no Coração da Cidade:</strong> Infraestrutura arborizada e segura, com 4 piscinas, quadras iluminadas, quiosques e academia.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-start gap-3.5 backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-white">Inclusão e Comunidade:</strong> Escolinha de futebol infantil para sócios e projetos sociais, além de apoio tradicional a causas beneficentes como a campanha "Passos que Salvam" em prol do Hospital de Câncer de Barretos.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="#seja-socio"
                className="px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,25,34,0.35)] transition-all flex items-center gap-2 border border-red-500/40"
              >
                <Shield className="w-4 h-4" />
                <span>Faça Parte da Nossa Família</span>
              </a>
            </div>
          </div>

          {/* Coluna da Linha do Tempo */}
          <div className="lg:col-span-6">
            <div className="relative border-l-2 border-red-700/50 pl-6 md:pl-8 space-y-7 ml-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Marcador Rubro */}
                  <div className="absolute -left-[33px] md:-left-[41px] top-1 w-5 h-5 rounded-full bg-[#0A0A0D] border-4 border-red-600 shadow-[0_0_12px_rgba(229,25,34,0.6)] group-hover:scale-125 transition-transform" />
                  
                  <div className="bg-[#141520]/90 rounded-2xl p-5 border border-white/10 hover:border-red-500/40 transition-all shadow-md backdrop-blur-md">
                    <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-1">
                      {item.year}
                    </span>
                    <h3 className="text-base font-bold font-outfit text-white uppercase mb-1">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
