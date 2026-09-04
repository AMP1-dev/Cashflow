import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export function AmpContactSection() {
  const { siteConfig, submitLead, showToast } = useAmp();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    subject: 'Consultoria TI & Financeira',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.whatsapp) {
      showToast('Por favor, preencha seu nome, empresa e WhatsApp.', 'warning');
      return;
    }

    setIsSubmitting(true);
    submitLead({
      ...formData,
      type: 'Mensagem de Contato Institucional'
    });

    setIsSubmitting(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      whatsapp: '',
      subject: 'Consultoria TI & Financeira',
      message: ''
    });
  };

  const handleWhatsAppDirect = () => {
    const msg = encodeURIComponent(`Olá Grupo AMP! Gostaria de falar com a diretoria comercial para obter mais informações sobre as soluções corporativas.`);
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <section id="contato" className="py-24 bg-[#0A1020] relative overflow-hidden border-t border-slate-800">
      
      {/* Background glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Phone className="w-3.5 h-3.5" />
            <span>Canais Corporativos Oficiais</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Inicie o Próximo Ciclo de <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Crescimento Seguro</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Fale diretamente com nossa diretoria comercial ou solicite uma visita técnica da nossa equipe de engenharia e finanças.
          </p>
        </div>

        {/* 2 Columns: Contact Information & Direct Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct info cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Address */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sede Corporativa</h3>
                  <p className="text-sm font-bold text-white mt-0.5">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>

            {/* Phones & WhatsApp */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Telefonia & WhatsApp</h3>
                  <div className="text-sm font-bold text-white flex flex-col gap-0.5">
                    <span>Central: {siteConfig.contact.phone}</span>
                    <span>WhatsApp Executivo: {siteConfig.contact.whatsappFormatted}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp Agora</span>
              </button>
            </div>

            {/* Emails */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <h3 className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">E-mails Departamentais</h3>
                  <div className="space-y-0.5">
                    <p><span className="text-slate-400">Comercial:</span> <a href={`mailto:${siteConfig.contact.commercialEmail}`} className="text-cyan-400 font-bold hover:underline">{siteConfig.contact.commercialEmail}</a></p>
                    <p><span className="text-slate-400">Suporte Técnico:</span> <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-cyan-400 font-bold hover:underline">{siteConfig.contact.supportEmail}</a></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{siteConfig.contact.operatingHours}</span>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <h3 className="text-xl font-black text-white">
                  Envie uma Mensagem à Diretoria
                </h3>
                <p className="text-xs text-slate-400">
                  Responderemos em até 2 horas úteis com a designação de um consultor especialista.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Silveira"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Grupo Silveira S.A."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: (11) 98888-7766"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      E-mail Corporativo
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: roberto@gruposilveira.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Assunto Principal
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Consultoria TI & Nuvem">Consultoria TI & Infraestrutura / Nuvem</option>
                    <option value="Suporte Remoto MeshCentral">Suporte Remoto MeshCentral / NOC 24/7</option>
                    <option value="BPO Financeiro & Tesouraria">BPO Financeiro & Tesouraria Terceirizada</option>
                    <option value="Planejamento Tributário & Holding">Planejamento Tributário, Elisão & Holding</option>
                    <option value="Projeto João de Barro ESG">Parceria / Apoio ao Projeto João de Barro</option>
                    <option value="Rádio Amplificadora">Publicidade / Mídia na Rádio Amplificadora</option>
                    <option value="Outro Assunto">Outro Assunto Corporativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Como podemos colaborar com a sua empresa?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreva brevemente o cenário atual e objetivos da sua organização..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando Mensagem...' : 'Enviar Solicitação à Diretoria'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
