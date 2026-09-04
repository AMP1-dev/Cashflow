import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { 
  Building2, Store, Sparkles, ShieldCheck, Radio, Volume2, 
  CheckCircle2, ArrowRight, MessageCircle, Play, Sliders, 
  Utensils, Dumbbell, ShoppingBag, Stethoscope, Briefcase, Zap
} from 'lucide-react';

export function B2BIndoorSection() {
  const { config, b2bClients, setIsIndoorModalOpen, setSelectedB2BClient, showToast } = useRadio();

  // Simulator State
  const [selectedSegment, setSelectedSegment] = useState('gastronomia');
  const [pointsCount, setPointsCount] = useState(1);
  const [includeAiVoice, setIncludeAiVoice] = useState(true);
  const [customBrandName, setCustomBrandName] = useState('');

  const segments = [
    {
      id: 'gastronomia',
      title: 'Restaurantes & Bares',
      icon: Utensils,
      style: 'Jazz, Bossa Nova, Acoustic & Lounge',
      description: 'Cria uma atmosfera intimista e agradável para aumentar o tempo de mesa e o consumo.',
      defaultStream: 'https://ice1.somafm.com/groovesalad-128-mp3'
    },
    {
      id: 'fitness',
      title: 'Academias & Estúdios',
      icon: Dumbbell,
      style: 'Tomorrowland, EDM & High Energy',
      description: 'Batidas aceleradas e alta energia para motivar os alunos em cada treino.',
      defaultStream: 'https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3'
    },
    {
      id: 'varejo',
      title: 'Lojas & Boutiques',
      icon: ShoppingBag,
      style: 'Pop Internacional, Soft Rock & Hits',
      description: 'Ritmo moderno e envolvente que incentiva compras e melhora a experiência na loja.',
      defaultStream: 'https://s10.streamingcloud.online:13192/stream'
    },
    {
      id: 'saude',
      title: 'Clínicas & Consultórios',
      icon: Stethoscope,
      style: 'Neo-Classical, Calm & Ambient',
      description: 'Reduz a ansiedade na sala de espera e traz sensação de conforto e acolhimento.',
      defaultStream: 'https://ice1.somafm.com/groovesalad-128-mp3'
    },
    {
      id: 'corporativo',
      title: 'Escritórios & Coworking',
      icon: Briefcase,
      style: 'Deep Focus, Lo-fi & Downtempo',
      description: 'Melhora o foco, o bem-estar e a produtividade da equipe sem distrações sonoras.',
      defaultStream: 'https://ice1.somafm.com/groovesalad-128-mp3'
    }
  ];

  const currentSegmentData = segments.find(s => s.id === selectedSegment) || segments[0];

  // Base pricing calculation
  const basePricePerPoint = 119;
  const aiVoiceAddon = includeAiVoice ? 60 : 0;
  const estimatedPrice = (pointsCount * basePricePerPoint) + aiVoiceAddon;

  // Handle previewing the customer's custom white-label radio
  const handleTestCustomRadio = (e) => {
    e.preventDefault();
    const brand = customBrandName.trim() || 'Sua Marca';
    const previewClient = {
      id: 'preview-custom',
      name: brand,
      segment: currentSegmentData.title,
      location: 'Sua Loja / Matriz',
      streamUrl: currentSegmentData.defaultStream,
      genre: currentSegmentData.style,
      slogan: `A rádio oficial de ${brand} com curadoria exclusiva`,
      logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      status: 'Simulação'
    };
    setSelectedB2BClient(previewClient);
    setIsIndoorModalOpen(true);
    showToast(`Iniciando player da rádio indoor para ${brand}!`);
  };

  // Open existing client station
  const handleOpenExistingClient = (client) => {
    setSelectedB2BClient(client);
    setIsIndoorModalOpen(true);
  };

  // Build WhatsApp Request URL
  const buildWhatsAppProposalUrl = () => {
    const brand = customBrandName.trim() || 'Minha Empresa';
    const text = encodeURIComponent(
      `Olá! Tenho interesse em montar a Rádio Indoor da minha empresa (${brand}) pela plataforma Amplificadora.\n\n` +
      `• Segmento: ${currentSegmentData.title}\n` +
      `• Quantidade de Pontos/Caixas: ${pointsCount}\n` +
      `• Locução Neural & Vinhetas IA: ${includeAiVoice ? 'Sim' : 'Não'}\n` +
      `• Estilo Musical Sugerido: ${currentSegmentData.style}\n\n` +
      `Gostaria de saber como funciona o período de teste e a ativação técnica!`
    );
    const phone = config.social?.whatsapp || '5511998887766';
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  };

  return (
    <section id="indoor" className="py-24 bg-[#090812] text-white relative border-t border-white/5 overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>SOLUÇÃO B2B • RÁDIO CORPORATIVA & INDOOR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Monte a Rádio Exclusiva do Seu Negócio
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Elimine propagandas de concorrentes no seu estabelecimento. Ofereça uma experiência sonora impecável que encanta clientes e alavanca o seu faturamento.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-[#110E1E] border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero Concorrência</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diferente de rádios convencionais ou apps gratuitos, nunca haverá anúncios de concorrentes dentro da sua loja.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#110E1E] border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Curadoria por Segmento</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Playlists elaboradas estrategicamente para sincronizar com o ritmo do seu público e prolongar o tempo de permanência.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#110E1E] border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Vinhetas & Locução IA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crie spots comerciais e ofertas do dia com vozes neurais de alta fidelidade e assinatura personalizada da sua marca.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#110E1E] border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Player Multi-Dispositivo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Acesse pelo computador, celular ou tablet da recepção sem precisar instalar equipamentos caros ou cabos complexos.
            </p>
          </div>
        </div>

        {/* Interactive B2B Simulator Card */}
        <div className="bg-gradient-to-br from-[#120F1F] via-[#100D1B] to-[#181329] rounded-[36px] border-2 border-emerald-500/30 p-6 sm:p-10 shadow-2xl shadow-emerald-950/40 mb-16">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Column: Configuration Controls */}
            <div className="w-full lg:w-7/12 space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  1. SELECIONE SEU RAMO DE ATIVIDADE
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {segments.map((seg) => {
                    const Icon = seg.icon;
                    const isSelected = selectedSegment === seg.id;
                    return (
                      <button
                        key={seg.id}
                        type="button"
                        onClick={() => setSelectedSegment(seg.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                            : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold leading-tight">{seg.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Points slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">2. QUANTIDADE DE PONTOS / FILIAIS:</span>
                  <span className="font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    {pointsCount} {pointsCount === 1 ? 'Ambiente / Loja' : 'Ambientes / Lojas'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={pointsCount}
                  onChange={(e) => setPointsCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 Ponto (Individual)</span>
                  <span>5 Pontos</span>
                  <span>10 Pontos (Rede)</span>
                </div>
              </div>

              {/* Add-on toggle */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 cursor-pointer hover:border-emerald-500/30 transition-all">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Incluir Produção de Spots com Locução IA</span>
                  <span className="text-[11px] text-slate-400 block">Até 4 chamadas comerciais de ofertas criadas por mês</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeAiVoice}
                  onChange={(e) => setIncludeAiVoice(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer accent-emerald-500"
                />
              </label>

              {/* Brand Name Input for Live Preview */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-300">
                  DIGITE O NOME DO SEU ESTABELECIMENTO PARA TESTAR:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Boutique Bella, Café Gourmet, Academia Pulse..."
                    value={customBrandName}
                    onChange={(e) => setCustomBrandName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestCustomRadio}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Ver Player</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Estimated Summary & Direct WhatsApp CTA */}
            <div className="w-full lg:w-5/12 bg-black/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between self-stretch">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  RESUMO DA PROPOSTA
                </span>

                <div>
                  <h4 className="text-xl font-black text-white">{currentSegmentData.title}</h4>
                  <p className="text-xs text-emerald-300 font-semibold mt-0.5">{currentSegmentData.style}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{currentSegmentData.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Pontos de Transmissão:</span>
                    <strong className="text-white font-bold">{pointsCount} ambiente(s)</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Módulo de Locução Neural:</span>
                    <strong className="text-white font-bold">{includeAiVoice ? 'Incluso (4 spots/mês)' : 'Sem locução'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Painel de Gestão da Loja:</span>
                    <strong className="text-emerald-400 font-bold">Incluso 100%</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mensalidade Estimada</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs text-slate-400 font-medium">R$</span>
                    <span className="text-4xl font-black text-emerald-400">{estimatedPrice}</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Sem fidelidade • Teste grátis por 7 dias</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <a
                  href={buildWhatsAppProposalUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ativar Rádio no WhatsApp 📲</span>
                </a>

                <button
                  type="button"
                  onClick={handleTestCustomRadio}
                  className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Testar Player Demo da Minha Loja</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Existing Active B2B Stations Showcase */}
        {b2bClients && b2bClients.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Empresas com Rádio Indoor Ativa</h3>
                <p className="text-xs text-slate-400">Ouça ao vivo a programação musical de empresas parceiras que já usam nossa plataforma.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {b2bClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleOpenExistingClient(client)}
                  className="p-5 rounded-3xl bg-[#110E1E] border border-white/10 hover:border-emerald-500/50 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/60 shrink-0 border border-emerald-500/30">
                      <img src={client.logo} alt={client.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">{client.segment}</span>
                      <h4 className="text-base font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors">
                        {client.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">{client.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium truncate max-w-[180px]">{client.genre}</span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/80 group-hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Ouvir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
