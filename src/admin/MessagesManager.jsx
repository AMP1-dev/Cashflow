import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, MessageCircle, Mail, Phone, Calendar, Trash2, CheckCircle2, Circle } from 'lucide-react';

export function MessagesManager() {
  const { messages, markMessageRead, deleteMessage, showToast } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'volunteers'

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'volunteers') return m.type?.toLowerCase().includes('volunt');
    return true;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Excluir mensagem de ${name}?`)) {
      deleteMessage(id);
    }
  };

  const handleOpenWhatsApp = (msg) => {
    markMessageRead(msg.id);
    const cleanPhone = msg.phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Olá ${msg.name}! Aqui é da equipe do Projeto João de Barro. Recebemos sua mensagem sobre "${msg.interest || msg.type}" e gostaríamos de conversar com você!`);
    window.open(`https://wa.me/55${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Mensagens & Inscrições de Voluntários</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Visualize os contatos recebidos pelo portal e responda diretamente pelo WhatsApp ou E-mail.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-terracotta-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'unread' ? 'bg-terracotta-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Não Lidas ({messages.filter(m => !m.read).length})
          </button>
          <button
            onClick={() => setFilter('volunteers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'volunteers' ? 'bg-terracotta-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Voluntários
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">Nenhuma mensagem neste filtro</h3>
            <p className="text-xs text-gray-400 mt-1">As mensagens enviadas pelos formulários aparecerão aqui.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 ${
                msg.read ? 'border-gray-200 shadow-sm opacity-95' : 'border-terracotta-200 shadow-md ring-1 ring-terracotta-100 bg-amber-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.type?.toLowerCase().includes('volunt')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {msg.type || 'Contato'}
                    </span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-terracotta-600"></span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(msg.date).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-gray-900">{msg.name}</h3>
                  {msg.interest && (
                    <p className="text-xs font-semibold text-terracotta-600 mt-0.5">
                      Interesse: {msg.interest}
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenWhatsApp(msg)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Responder no WhatsApp</span>
                  </button>

                  <button
                    onClick={() => markMessageRead(msg.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-gray-100 transition-colors"
                    title={msg.read ? 'Mensagem já lida' : 'Marcar como lida'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${msg.read ? 'text-emerald-500' : 'text-gray-300'}`} />
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-gray-100 transition-colors"
                    title="Excluir mensagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message text */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                {msg.message || 'Sem mensagem adicional descrita.'}
              </div>

              {/* Contact meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {msg.phone}
                </span>
                {msg.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {msg.email}
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
