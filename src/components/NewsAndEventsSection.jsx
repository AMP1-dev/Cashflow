import React, { useState, useEffect } from 'react';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Ticket, 
  Share2,
  CalendarCheck,
  ChevronRight,
  Volume2
} from 'lucide-react';

export function NewsAndEventsSection() {
  const { newsList, eventsList, setSelectedNews, setSelectedEvent } = useApae();
  const { speakText } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [newsCategory, setNewsCategory] = useState('todas');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Contagem regressiva para o próximo grande evento
  useEffect(() => {
    const targetDate = new Date('2026-09-21T08:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = newsList.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = newsCategory === 'todas' || n.category.toLowerCase().includes(newsCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <section id="noticias-eventos" aria-label="Mural de Notícias e Eventos da APAE" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-apae-yellow-800 border border-amber-200 mb-3">
            <Newspaper className="w-4 h-4 text-apae-yellow-600" />
            <span>Comunicação & Vida Institucional</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Mural de <span className="text-apae-blue-600">Notícias e Próximos Eventos</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Acompanhe as conquistas dos nossos assistidos, projetos recém-inaugurados, festividades beneficentes e calendários oficiais da comunidade APAE.
          </p>
        </div>

        {/* Destaque do Grande Evento do Mês com Contagem Regressiva */}
        <div className="mb-16 bg-gradient-to-r from-apae-blue-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-apae-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-apae-yellow-400 text-slate-950">
                  Destaque do Calendário 2026
                </span>
                <span className="text-xs text-blue-200 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-apae-yellow-400" />
                  21 a 28 de Setembro de 2026
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white">
                Semana Nacional da Pessoa com Deficiência Intelectual e Múltipla 2026
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ciclo de palestras magnas, mostra artística 'Dança Sem Barreiras', workshops para educadores e a grande caminhada pela acessibilidade. Entrada 100% gratuita.
              </p>

              <div className="flex items-center gap-4 text-xs text-blue-200 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-apae-yellow-400" />
                  Sede APAE & Teatro Municipal
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-apae-yellow-400" />
                  08:00 às 17:30
                </span>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedEvent(eventsList[0])}
                  className="px-6 py-3 rounded-xl bg-apae-yellow-400 hover:bg-apae-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105"
                >
                  <Ticket className="w-4 h-4" />
                  <span>INSCREVER-SE GRATUITAMENTE</span>
                </button>
              </div>
            </div>

            {/* Caixa de Contagem Regressiva */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-apae-yellow-400 mb-4">
                Faltam apenas para a abertura:
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: timeLeft.days, label: "Dias" },
                  { val: timeLeft.hours, label: "Horas" },
                  { val: timeLeft.minutes, label: "Min" },
                  { val: timeLeft.seconds, label: "Seg" }
                ].map((t, idx) => (
                  <div key={idx} className="bg-slate-950/60 rounded-xl p-2.5 border border-white/10">
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {String(t.val).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{t.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-300 mt-4">
                Garanta sua vaga nas oficinas e receba o certificado de participação com 20 horas complementares.
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Notícias & Eventos em Duas Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Coluna 1: Mural de Notícias (8 colunas) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-apae-blue-600" />
                <span>Últimas Notícias</span>
              </h3>

              {/* Barra de Busca */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar notícias..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-apae-blue-600"
                />
              </div>
            </div>

            {/* Grid de Cards de Notícias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredNews.map((news) => (
                <article
                  key={news.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-apae-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-md">
                          {news.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{news.date}</span>
                        <span>•</span>
                        <span>{news.readTime}</span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 group-hover:text-apae-blue-600 transition-colors line-clamp-2">
                        {news.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {news.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setSelectedNews(news)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-apae-blue-50 text-slate-700 hover:text-apae-blue-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Ler Matéria Completa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Coluna 2: Calendário de Eventos (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-apae-yellow-500" />
                <span>Calendário 2026</span>
              </h3>
            </div>

            <div className="space-y-4">
              {eventsList.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-blue-50/50 hover:border-apae-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-apae-blue-600 text-white">
                      {evt.date}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {evt.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 group-hover:text-apae-blue-600 transition-colors">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {evt.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-apae-yellow-500" />
                      {evt.location.split(' - ')[0]}
                    </span>

                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="text-apae-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Detalhes</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Box de Notificação / Alerta de Inscrição */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Quer Realizar um Evento Beneficente?
              </h5>
              <p className="text-xs text-amber-800 leading-relaxed">
                Empresas, escolas ou grupos comunitários que desejam organizar bazares, almoços ou torneios esportivos em prol da APAE podem contar com nosso apoio institucional.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
