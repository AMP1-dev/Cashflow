import React, { useState } from 'react';
import { INSTITUTION_DATA } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  Navigation, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function ContactAndLocationSection() {
  const { showToast } = useApae();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('acolhimento');
  const [contactMsg, setContactMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.");
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent("Olá! Gostaria de obter informações sobre o atendimento e projetos da APAE.");
    window.open(`https://wa.me/5511987654321?text=${text}`, '_blank');
  };

  return (
    <section id="contato" aria-label="Informações de Contato e Localização da APAE" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Informações Institucionais & Localização */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-apae-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Fale Conosco & Venha nos Conhecer
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-3">
                Canais de Atendimento e <span className="text-apae-blue-600">Localização</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Estamos de portas abertas para receber famílias, acolher novos assistidos, orientar doadores e apresentar nossa infraestrutura completa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-apae-blue-600 font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>Endereço Principal</span>
                </div>
                <p className="text-xs text-slate-900 font-semibold">{INSTITUTION_DATA.address}</p>
                <p className="text-[11px] text-slate-500">{INSTITUTION_DATA.city} • CEP: {INSTITUTION_DATA.zipCode}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-apae-blue-600 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Horário de Funcionamento</span>
                </div>
                <p className="text-xs text-slate-900 font-semibold">{INSTITUTION_DATA.openingHours}</p>
                <p className="text-[11px] text-slate-500">Atendimento clínico & secretaria</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-apae-blue-600 font-bold text-xs">
                  <Phone className="w-4 h-4" />
                  <span>Telefone Central</span>
                </div>
                <p className="text-xs text-slate-900 font-semibold">{INSTITUTION_DATA.phone}</p>
                <p className="text-[11px] text-slate-500">Recepção e triagem</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-apae-blue-600 font-bold text-xs">
                  <Mail className="w-4 h-4" />
                  <span>E-mail Institucional</span>
                </div>
                <p className="text-xs text-slate-900 font-semibold">{INSTITUTION_DATA.email}</p>
                <p className="text-[11px] text-slate-500">Doações: {INSTITUTION_DATA.donationEmail}</p>
              </div>
            </div>

            {/* Botão de WhatsApp Rápido */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="text-sm font-black text-emerald-950">Precisa de atendimento rápido?</h4>
                <p className="text-xs text-emerald-800">Fale diretamente com nosso setor de acolhimento via WhatsApp.</p>
              </div>

              <button
                onClick={handleOpenWhatsApp}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 flex-shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAMAR NO WHATSAPP</span>
              </button>
            </div>

            {/* Mapa Ilustrado Acessível */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative h-56 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=900"
                alt="Mapa da Região da APAE"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-apae-yellow-500 text-slate-950 flex items-center justify-center font-black">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">{INSTITUTION_DATA.name}</h5>
                    <p className="text-xs text-slate-300">{INSTITUTION_DATA.address} - {INSTITUTION_DATA.city}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Formulário de Contato & Ouvidoria */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-2">Envie uma Mensagem para a APAE</h3>
            <p className="text-xs text-slate-500 mb-6">
              Tire dúvidas sobre matrículas, acolhimento clínico, recibos de doação ou fale com nossa Ouvidoria.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nome e Sobrenome"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seu E-mail *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assunto / Finalidade:</label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                >
                  <option value="acolhimento">Acolhimento Familiar & Vagas de Atendimento</option>
                  <option value="doacao">Dúvidas sobre Doações e Recibos Fiscais</option>
                  <option value="voluntariado">Informações sobre Voluntariado</option>
                  <option value="imprensa">Assessoria de Imprensa e Comunicação</option>
                  <option value="ouvidoria">Ouvidoria e Elogios/Sugestões</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mensagem *</label>
                <textarea
                  rows="4"
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Escreva sua mensagem com detalhes..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ENVIAR MENSAGEM</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
