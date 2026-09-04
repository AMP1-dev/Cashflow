import React, { useState } from 'react';
import { useApae } from '../context/ApaeContext';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Send, 
  Check 
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

export function ScheduleVisitModal() {
  const { scheduleVisitModalOpen, setScheduleVisitModalOpen, showToast } = useApae();
  const [visitorName, setVisitorName] = useState('');
  const [institution, setInstitution] = useState('');
  const [visitorType, setVisitorType] = useState('empresa');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredShift, setPreferredShift] = useState('manha');
  const [groupSize, setGroupSize] = useState('1 a 5');
  const [confirmed, setConfirmed] = useState(false);

  if (!scheduleVisitModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmed(true);
    triggerConfetti();
    showToast("Solicitação de visita agendada com sucesso! Entraremos em contato para confirmar o dia.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apae-blue-600 flex items-center justify-center font-black">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black">Agendar Visita Institucional</h3>
              <p className="text-xs text-slate-400">Conheça nossa estrutura, salas de terapia e escola</p>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmed(false);
              setScheduleVisitModalOpen(false);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form ou Confirmação */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {confirmed ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-black shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-emerald-950">Solicitação Enviada com Sucesso!</h4>
              <p className="text-xs text-emerald-800">
                Nossa equipe da Secretaria de Acolhimento entrará em contato pelo telefone/WhatsApp informado em até 24h para oficializar o agendamento.
              </p>
              <button
                onClick={() => {
                  setConfirmed(false);
                  setScheduleVisitModalOpen(false);
                }}
                className="mt-3 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nome do Responsável *</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tipo de Visitante</label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  >
                    <option value="empresa">Empresa / Doador Corporativo</option>
                    <option value="familia">Família com Criança Especial</option>
                    <option value="escola">Escola ou Universidade</option>
                    <option value="voluntario">Interessado em Voluntariado</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Instituição / Empresa</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Nome da empresa ou escola"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Data Preferencial *</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Turno Preferencial</label>
                  <select
                    value={preferredShift}
                    onChange={(e) => setPreferredShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  >
                    <option value="manha">Manhã (08:30 às 11:30)</option>
                    <option value="tarde">Tarde (13:30 às 16:30)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-apae-blue-600 hover:bg-apae-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>SOLICITAR AGENDAMENTO</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
