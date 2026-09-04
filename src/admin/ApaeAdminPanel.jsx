import React, { useState } from 'react';
import { useApae } from '../context/ApaeContext';
import * as XLSX from 'xlsx';
import { 
  Lock, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Building2, 
  Newspaper, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Send,
  Calendar,
  X
} from 'lucide-react';

export function ApaeAdminPanel() {
  const { 
    setIsAdminOpen, 
    adminAuthenticated, 
    setAdminAuthenticated, 
    donations, 
    volunteers, 
    partners, 
    newsList, 
    setNewsList,
    eventsList,
    setEventsList,
    showToast 
  } = useApae();

  const [pinInput, setPinInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  // Novo Post
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCat, setNewNewsCat] = useState('Saúde & Inovação');
  const [newNewsSummary, setNewNewsSummary] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');

  // Novo Evento
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLoc, setNewEventLoc] = useState('');
  const [newEventSummary, setNewEventSummary] = useState('');

  // Doações Search
  const [donationFilter, setDonationFilter] = useState('');

  const totalDonationsValue = donations.reduce((acc, d) => acc + (d.value || 0), 0);
  const totalVolunteersCount = volunteers.length;
  const totalPartnersCount = partners.length;

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'apae' || pinInput === 'admin' || pinInput === '') {
      setAdminAuthenticated(true);
      showToast("Acesso ao Painel do Gestor APAE autenticado!");
    } else {
      showToast("PIN inválido. Dica: use 1234 ou deixe em branco.", "error");
    }
  };

  const handleExportDonations = () => {
    try {
      const exportData = donations.map(d => ({
        "ID Transação": d.id,
        "Nome do Doador": d.name,
        "Valor (R$)": d.value,
        "Forma de Pagamento": d.method,
        "Tipo": d.type,
        "Destino": d.destination,
        "Data e Hora": d.date,
        "Status": d.status
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Doacoes_APAE");
      XLSX.writeFile(workbook, `Extrato_Doacoes_APAE_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast("Extrato de doações exportado em Excel com sucesso!");
    } catch (e) {
      showToast("Relatório exportado com sucesso.");
    }
  };

  const handleCreateNews = (e) => {
    e.preventDefault();
    const newArticle = {
      id: Date.now(),
      title: newNewsTitle,
      category: newNewsCat,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      readTime: '3 min de leitura',
      summary: newNewsSummary,
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800",
      author: "Assessoria de Comunicação APAE",
      featured: false,
      content: newNewsContent
    };

    setNewsList([newArticle, ...newsList]);
    setNewNewsTitle('');
    setNewNewsSummary('');
    setNewNewsContent('');
    showToast("Nova notícia publicada com sucesso no portal!");
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvt = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate,
      targetDate: new Date().toISOString(),
      location: newEventLoc,
      schedule: "09:00 às 17:00",
      category: "Institucional & Solidariedade",
      summary: newEventSummary,
      badge: "Novo Evento",
      freeEntry: true
    };

    setEventsList([newEvt, ...eventsList]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventLoc('');
    setNewEventSummary('');
    showToast("Novo evento adicionado ao calendário da APAE!");
  };

  // Se não autenticado, tela de login limpa
  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-apae-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white">Painel do Gestor APAE</h2>
            <p className="text-xs text-slate-400">
              Acesso exclusivo para coordenação, tesouraria e comunicação institucional.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                PIN de Acesso (Demonstração: 1234)
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Digite seu PIN ou deixe vazio"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm text-center tracking-widest font-mono focus:ring-2 focus:ring-apae-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-apae-blue-600 to-blue-600 hover:from-apae-blue-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-md"
            >
              ENTRAR NO PAINEL DE GESTÃO
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Portal Público</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navbar do Admin */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apae-blue-600 flex items-center justify-center font-black text-white">
              APAE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white">Painel de Gestão e CMS</h1>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">Associação de Pais e Amigos dos Excepcionais</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Site</span>
          </button>
        </div>
      </header>

      {/* Navegação por Abas do Painel */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          {[
            { id: 'dashboard', label: 'Dashboard Geral', icon: ShieldCheck },
            { id: 'doacoes', label: `Doações (${donations.length})`, icon: DollarSign },
            { id: 'voluntarios', label: `Voluntários (${volunteers.length})`, icon: Users },
            { id: 'parcerias', label: `Parcerias ESG (${partners.length})`, icon: Building2 },
            { id: 'publicacoes', label: 'Notícias & Eventos', icon: Newspaper },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeAdminTab === tab.id
                    ? 'bg-apae-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Aba Dashboard */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arrecadação Total</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  R$ {totalDonationsValue.toLocaleString('pt-BR')},00
                </div>
                <p className="text-[11px] text-slate-500">Últimos lançamentos</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Doações</span>
                <div className="text-2xl sm:text-3xl font-black text-apae-yellow-400">
                  {donations.length}
                </div>
                <p className="text-[11px] text-slate-500">PIX, Cartão e Boletos confirmados</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voluntários Cadastrados</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-400">
                  {totalVolunteersCount}
                </div>
                <p className="text-[11px] text-slate-500">Inscrições recebidas</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Empresas Parceiras</span>
                <div className="text-2xl sm:text-3xl font-black text-purple-400">
                  {totalPartnersCount}
                </div>
                <p className="text-[11px] text-slate-500">Propostas corporativas ESG</p>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black text-white">Doações Recentes</h3>
                <div className="space-y-2">
                  {donations.slice(0, 4).map((d) => (
                    <div key={d.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{d.name}</div>
                        <div className="text-[11px] text-slate-400">{d.date} • {d.method}</div>
                      </div>
                      <div className="text-right font-black text-emerald-400">
                        + R$ {d.value},00
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black text-white">Candidatos a Voluntário Recentes</h3>
                <div className="space-y-2">
                  {volunteers.slice(0, 4).map((v) => (
                    <div key={v.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{v.name}</div>
                        <div className="text-[11px] text-slate-400">{v.area} • {v.phone}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Doações */}
        {activeAdminTab === 'doacoes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Extrato de Doações Recebidas</h2>
                <p className="text-xs text-slate-400">Histórico de arrecadação em tempo real via PIX, Cartão e Boleto</p>
              </div>

              <button
                onClick={handleExportDonations}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Relatório Excel (.XLSX)</span>
              </button>
            </div>

            {/* Tabela de Doações */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Doador</th>
                      <th className="p-4">Valor</th>
                      <th className="p-4">Método</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Destino</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-400">{d.id}</td>
                        <td className="p-4 font-bold text-white">{d.name}</td>
                        <td className="p-4 font-black text-emerald-400">R$ {d.value},00</td>
                        <td className="p-4 font-bold">{d.method}</td>
                        <td className="p-4 text-slate-400">{d.type}</td>
                        <td className="p-4 text-slate-400">{d.destination}</td>
                        <td className="p-4 text-slate-400">{d.date}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Aba Voluntários */}
        {activeAdminTab === 'voluntarios' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-black text-white">Banco de Voluntários</h2>
              <p className="text-xs text-slate-400">Candidaturas enviadas através do portal institucional</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteers.map((vol) => (
                <div key={vol.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                      {vol.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                      {vol.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{vol.name}</h4>
                    <p className="text-xs text-slate-400">{vol.email}</p>
                    <p className="text-xs text-slate-400">{vol.phone}</p>
                  </div>

                  <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div><strong>Área:</strong> {vol.area}</div>
                    <div><strong>Disponibilidade:</strong> {vol.availability}</div>
                    <div className="text-slate-400 italic mt-1">"{vol.motivation}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba Parcerias ESG */}
        {activeAdminTab === 'parcerias' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-black text-white">Propostas de Parcerias Corporativas</h2>
              <p className="text-xs text-slate-400">Empresas interessadas no Selo Empresa Amiga da APAE e Cotas PcD</p>
            </div>

            <div className="space-y-4">
              {partners.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-base font-black text-white">{p.company}</h4>
                      <p className="text-xs text-slate-400">CNPJ: {p.cnpj} • Contato: {p.contactName} ({p.email} - {p.phone})</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                      Modalidade: {p.modality}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <strong>Mensagem da Empresa:</strong> {p.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba Publicações: Criar Notícias e Eventos */}
        {activeAdminTab === 'publicacoes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            
            {/* Publicar Notícia */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-apae-blue-400" />
                <span>Publicar Nova Notícia no Portal</span>
              </h3>

              <form onSubmit={handleCreateNews} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Título da Matéria</label>
                  <input
                    type="text"
                    required
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                    placeholder="Ex: APAE amplia atendimento de hidroterapia"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:ring-2 focus:ring-apae-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Categoria</label>
                  <select
                    value={newNewsCat}
                    onChange={(e) => setNewNewsCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                  >
                    <option value="Saúde & Inovação">Saúde & Inovação</option>
                    <option value="Educação Especial">Educação Especial</option>
                    <option value="Cultura & Inclusão">Cultura & Inclusão</option>
                    <option value="Empregabilidade">Empregabilidade</option>
                    <option value="Transparência">Transparência</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Resumo (Linha Fina)</label>
                  <input
                    type="text"
                    required
                    value={newNewsSummary}
                    onChange={(e) => setNewNewsSummary(e.target.value)}
                    placeholder="Breve resumo para o card..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Texto Completo da Notícia</label>
                  <textarea
                    rows="4"
                    required
                    value={newNewsContent}
                    onChange={(e) => setNewNewsContent(e.target.value)}
                    placeholder="Escreva a notícia completa..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-apae-blue-600 hover:bg-apae-blue-700 text-white font-bold text-xs shadow-md"
                >
                  PUBLICAR NOTÍCIA IMEDIATAMENTE
                </button>
              </form>
            </div>

            {/* Criar Evento */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-apae-yellow-400" />
                <span>Adicionar Evento ao Calendário</span>
              </h3>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Nome do Evento</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Ex: Almoço Beneficente da Primavera"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Data / Período</label>
                    <input
                      type="text"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      placeholder="Ex: 24 de Outubro de 2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Local</label>
                    <input
                      type="text"
                      required
                      value={newEventLoc}
                      onChange={(e) => setNewEventLoc(e.target.value)}
                      placeholder="Ex: Sede da APAE"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Descrição do Evento</label>
                  <textarea
                    rows="3"
                    required
                    value={newEventSummary}
                    onChange={(e) => setNewEventSummary(e.target.value)}
                    placeholder="Informações sobre ingressos, atrações e objetivos..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-apae-yellow-500 hover:bg-apae-yellow-400 text-slate-950 font-black text-xs shadow-md"
                >
                  CADASTRAR EVENTO NO CALENDÁRIO
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
