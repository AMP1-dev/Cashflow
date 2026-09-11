import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  X,
  Send,
  Sparkles,
  Package
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallQuotesTab() {
  const { 
    quotes, 
    addQuote, 
    updateQuoteStatus, 
    updateQuoteNotes, 
    deleteQuote, 
    company, 
    showToast 
  } = useDrywall();

  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false);
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState(null);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  // New Quote Form State
  const [newQuoteForm, setNewQuoteForm] = useState({
    name: '',
    company: '',
    phone: '',
    city: '',
    segment: 'Gesseiro / Instalador',
    message: '',
    notes: ''
  });

  const statusConfig = {
    novo: { label: 'Novo / Pendente', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    em_atendimento: { label: 'Em Atendimento', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    orcamento_enviado: { label: 'Orçamento Enviado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    fechado: { label: 'Negócio Fechado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    cancelado: { label: 'Cancelado / Perdido', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = statusFilter === 'todos' || q.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      q.name?.toLowerCase().includes(term) ||
      q.company?.toLowerCase().includes(term) ||
      q.city?.toLowerCase().includes(term) ||
      q.phone?.includes(term) ||
      q.message?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  // KPI calculations
  const countNovos = quotes.filter(q => q.status === 'novo').length;
  const countAtendimento = quotes.filter(q => q.status === 'em_atendimento').length;
  const countEnviados = quotes.filter(q => q.status === 'orcamento_enviado').length;
  const countFechados = quotes.filter(q => q.status === 'fechado').length;

  const handleOpenWhatsApp = (quote) => {
    const cleanPhone = quote.phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      finalPhone = `55${cleanPhone}`;
    }
    
    let msg = `Olá, ${quote.name}! Tudo bem?\n\n`;
    msg += `Aqui é da equipe de vendas da *Drywall Distribuidora / Di Brunelli*.\n`;
    msg += `Recebemos sua solicitação de cotação para *${quote.city || 'sua obra'}*.\n\n`;
    if (quote.message) {
      msg += `Sobre o seu pedido de: "${quote.message}"\n\n`;
    }
    msg += `Gostaria de passar os valores de atacado e prazos de entrega da nossa frota própria. Podemos falar agora?`;

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCreateQuote = (e) => {
    e.preventDefault();
    if (!newQuoteForm.name || !newQuoteForm.phone) {
      showToast('Nome e telefone são obrigatórios.', 'warning');
      return;
    }
    addQuote(newQuoteForm);
    setIsNewQuoteOpen(false);
    setNewQuoteForm({
      name: '',
      company: '',
      phone: '',
      city: '',
      segment: 'Gesseiro / Instalador',
      message: '',
      notes: ''
    });
    showToast('Cotação cadastrada manualmente com sucesso!');
  };

  const handleSaveNotes = (id) => {
    updateQuoteNotes(id, notesText);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('novo')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === 'novo' ? 'bg-rose-500/10 border-rose-500/50 shadow-md shadow-rose-500/10' : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Novos / Pendentes</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">{countNovos}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('em_atendimento')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === 'em_atendimento' ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10' : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Em Atendimento</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{countAtendimento}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('orcamento_enviado')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === 'orcamento_enviado' ? 'bg-blue-500/10 border-blue-500/50 shadow-md shadow-blue-500/10' : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Orçamentos Enviados</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          </div>
          <p className="text-2xl font-black text-blue-400 mt-2">{countEnviados}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('fechado')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === 'fechado' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Negócios Fechados</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{countFechados}</p>
        </div>
      </div>

      {/* Action & Filter Toolbar */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, empresa, cidade, telefone ou materiais..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052D9]"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Badges & New Button */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'todos' ? 'bg-[#0052D9] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas ({quotes.length})
            </button>
            <button
              onClick={() => setStatusFilter('novo')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'novo' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pendentes ({countNovos})
            </button>
            <button
              onClick={() => setStatusFilter('fechado')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'fechado' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fechados ({countFechados})
            </button>
          </div>

          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Cotação Manual</span>
          </button>
        </div>

      </div>

      {/* Quotes CRM List */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-slate-800/20 border border-slate-700/40 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-300">Nenhuma cotação encontrada</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não foram encontradas solicitações com os filtros atuais. Tente buscar por outro termo ou cadastre uma nova cotação.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((quote) => {
            const currentStatus = statusConfig[quote.status] || statusConfig.novo;
            return (
              <div
                key={quote.id}
                className="bg-slate-800/40 border border-slate-700/60 hover:border-slate-600/80 rounded-2xl p-5 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0052D9] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">
                          {quote.name}
                        </h3>
                        {quote.company && (
                          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md">
                            {quote.company}
                          </span>
                        )}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-blue-400 font-medium">
                          <Phone className="w-3.5 h-3.5" />
                          {quote.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {quote.city || 'Interior de SP'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(quote.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Direct WhatsApp Call */}
                    <button
                      onClick={() => handleOpenWhatsApp(quote)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      title="Chamar no WhatsApp com mensagem de boas-vindas"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Atender no WhatsApp</span>
                    </button>

                    {/* Status Changer */}
                    <select
                      value={quote.status}
                      onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0052D9]"
                    >
                      <option value="novo">Novo / Pendente</option>
                      <option value="em_atendimento">Em Atendimento</option>
                      <option value="orcamento_enviado">Orçamento Enviado</option>
                      <option value="fechado">Negócio Fechado</option>
                      <option value="cancelado">Cancelado / Perdido</option>
                    </select>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir cotação de ${quote.name}?`)) {
                          deleteQuote(quote.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition-colors"
                      title="Excluir Cotação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message / Materials Requested */}
                {quote.message && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                    <p className="font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-400" />
                      <span>Mensagem / Materiais Solicitados:</span>
                    </p>
                    <p className="leading-relaxed whitespace-pre-line">{quote.message}</p>
                  </div>
                )}

                {/* Items List (if attached from cart) */}
                {quote.items && quote.items.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {quote.items.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-slate-900/80 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
                        <span className="font-bold text-blue-400">{item.quantity} {item.unit || 'un'}</span>
                        <span>{item.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Internal CRM Notes Section */}
                <div className="border-t border-slate-700/40 pt-3 flex items-center justify-between text-xs">
                  {editingNotesId === quote.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Observações internas sobre o cliente ou negociação..."
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNotes(quote.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2 py-1.5 text-slate-400 hover:text-white text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {quote.notes ? (
                            <span className="text-slate-300 font-normal italic">"{quote.notes}"</span>
                          ) : (
                            <span className="text-slate-500 italic">Sem notas internas.</span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNotesId(quote.id);
                          setNotesText(quote.notes || '');
                        }}
                        className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 text-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{quote.notes ? 'Editar Nota' : 'Adicionar Nota'}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Nova Cotação Manual */}
      {isNewQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Cadastrar Cotação Manual</h3>
                  <p className="text-xs text-slate-400">Para clientes que ligaram ou chamaram no balcão</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewQuoteOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={newQuoteForm.name}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, name: e.target.value })}
                    placeholder="Ex: Carlos Eduardo"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newQuoteForm.phone}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, phone: e.target.value })}
                    placeholder="(19) 99888-7766"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Empresa / Construtora</label>
                  <input
                    type="text"
                    value={newQuoteForm.company}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, company: e.target.value })}
                    placeholder="Ex: Forte Reformas"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cidade da Obra</label>
                  <input
                    type="text"
                    value={newQuoteForm.city}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, city: e.target.value })}
                    placeholder="Ex: Campinas, Sorocaba..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Segmento</label>
                <select
                  value={newQuoteForm.segment}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, segment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                >
                  <option value="Gesseiro / Instalador">Gesseiro / Instalador</option>
                  <option value="Construtora / Engenharia">Construtora / Engenharia</option>
                  <option value="Empreiteiro / Reformas">Empreiteiro / Reformas</option>
                  <option value="Arquiteto / Designer">Arquiteto / Designer</option>
                  <option value="Cliente Final / Obra Própria">Cliente Final / Obra Própria</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Materiais Solicitados / Detalhes</label>
                <textarea
                  rows="3"
                  value={newQuoteForm.message}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, message: e.target.value })}
                  placeholder="Ex: 50 chapas ST 12.5mm + 40 montantes 48mm + entrega em Barão Geraldo"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notas Internas (Opcional)</label>
                <input
                  type="text"
                  value={newQuoteForm.notes}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, notes: e.target.value })}
                  placeholder="Ex: Cliente com cadastro aprovado para 30 dias"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewQuoteOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Cadastrar Cotação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
