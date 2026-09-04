import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Trash2, CheckCircle, Mail, Phone, Building2, Calendar, MessageCircle } from 'lucide-react';

export function LeadsManager() {
  const { leads, markLeadRead, deleteLead } = useApp();

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  const handleOpenWhatsApp = (phone, name, service) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(`Olá ${name}! Sou da Aliança Empresarial. Recebemos sua solicitação sobre ${service}. Como podemos ajudar?`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Solicitações de Propostas & Leads</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Contatos e solicitações enviadas através do formulário do site e do simulador tributário.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900 border border-dashed border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">Nenhuma solicitação de proposta ainda</h3>
          <p className="text-xs text-slate-500 mt-1">Quando os visitantes preencherem o formulário no site, os contatos aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                lead.read
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-900 border-terracotta-500/40 ring-1 ring-terracotta-500/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-white">{lead.name}</h4>
                  {lead.company && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                      {lead.company}
                    </span>
                  )}
                  {!lead.read && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta-600 text-white">
                      Novo Lead
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(lead.date)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{lead.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{lead.email}</span>
                </div>

                <div className="text-slate-300">
                  <span className="font-bold text-slate-400">Porte:</span> {lead.revenue}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 border border-slate-800">
                <span className="font-bold text-terracotta-400 block mb-0.5">Serviço de Interesse: {lead.service}</span>
                {lead.message && <p className="text-slate-400 mt-1 whitespace-pre-line">{lead.message}</p>}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(lead.phone, lead.name, lead.service)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Responder no WhatsApp</span>
                </button>

                <div className="flex items-center gap-2">
                  {!lead.read && (
                    <button
                      type="button"
                      onClick={() => markLeadRead(lead.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Marcar como Lido</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Excluir este registro de lead?')) {
                        deleteLead(lead.id);
                      }
                    }}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
