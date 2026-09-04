import React, { useState } from 'react';
import { useApae } from '../context/ApaeContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Check, 
  User, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

export function EventDetailModal() {
  const { selectedEvent, setSelectedEvent, showToast } = useApae();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!selectedEvent) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    setConfirmed(true);
    triggerConfetti();
    showToast(`Inscrição confirmada para "${selectedEvent.title}"! Enviamos o voucher para seu e-mail.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-apae-yellow-400 text-slate-950 mb-2 inline-block">
            {selectedEvent.category}
          </span>

          <h3 className="text-xl font-black text-white leading-tight">
            {selectedEvent.title}
          </h3>
        </div>

        {/* Corpo com Scroll */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Informações de Local e Data */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-apae-blue-600 flex-shrink-0" />
              <span><strong>Data:</strong> {selectedEvent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-apae-blue-600 flex-shrink-0" />
              <span><strong>Horário:</strong> {selectedEvent.schedule}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-apae-blue-600 flex-shrink-0" />
              <span><strong>Local:</strong> {selectedEvent.location}</span>
            </div>
            {selectedEvent.price && (
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Ingresso/Kit:</strong> {selectedEvent.price}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedEvent.summary}
          </p>

          {/* Confirmação ou Formulário de Inscrição */}
          {confirmed ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-black shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-emerald-950">Inscrição Confirmada com Sucesso!</h4>
              <p className="text-xs text-emerald-800">
                Seu comprovante foi emitido. Apresente este nome na recepção do evento.
              </p>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
              >
                Concluir
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Garantir Minha Vaga / Inscrição
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seu Nome *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-apae-yellow-400 hover:bg-apae-yellow-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
              >
                <Ticket className="w-4 h-4" />
                <span>CONFIRMAR INSCRIÇÃO NO EVENTO</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
