import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Building2 } from 'lucide-react';

export function ContactSection() {
  const { siteConfig, addLead, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    revenue: 'Até R$ 50.000/mês',
    service: 'Planejamento Tributário & Contabilidade',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addLead(formData);
    setSubmitted(true);
    showToast('Proposta enviada com sucesso! Em breve entraremos em contato.');

    // Direct WhatsApp message trigger
    const text = encodeURIComponent(
      `*Nova Solicitação de Proposta - Aliança Empresarial*\n\n` +
      `• Nome: ${formData.name}\n` +
      `• Empresa: ${formData.company || 'Não informada'}\n` +
      `• E-mail: ${formData.email}\n` +
      `• Telefone/WhatsApp: ${formData.phone}\n` +
      `• Porte: ${formData.revenue}\n` +
      `• Serviço: ${formData.service}\n` +
      (formData.message ? `• Mensagem: ${formData.message}` : '')
    );
    
    setTimeout(() => {
      window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, '_blank');
    }, 800);
  };

  return (
    <section id="contato" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-terracotta-400 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
                <span>Atendimento Executivo</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Fale com Nossos Especialistas
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Solicite uma avaliação contábil e tributária sem compromisso. Descubra como podemos otimizar seus custos e dar segurança total à sua operação.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-terracotta-950/60 border border-terracotta-500/30 text-terracotta-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Telefones Diretos</h4>
                  <p className="text-white font-bold">{siteConfig.contact.phone}</p>
                  <p className="text-slate-300 text-xs">{siteConfig.contact.phoneSecondary}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">WhatsApp Comercial</h4>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    {siteConfig.contact.whatsappFormatted || '(11) 99888-7766'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">E-mail Corporativo</h4>
                  <p className="text-white font-medium">{siteConfig.contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Sede Corporativa</h4>
                  <p className="text-white font-medium">{siteConfig.contact.address}</p>
                </div>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400 flex items-center justify-between">
              <span>{siteConfig.contact.crc}</span>
              <span>CNPJ: {siteConfig.contact.cnpj}</span>
            </div>
          </div>

          {/* Right Column Proposal Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Solicite uma Proposta Personalizada</h3>
                <p className="text-xs text-slate-400">Preencha os dados e receba uma análise comparativa dos seus impostos.</p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Solicitação Recebida com Sucesso!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Nossa equipe tributária já está analisando seus dados. Você também pode dar andamento imediato no WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-700 text-xs font-bold text-white hover:bg-slate-600 transition-colors"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Seu Nome Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        placeholder="Ex: Silva & Santos Ltda"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">E-mail Profissional *</label>
                      <input
                        type="email"
                        required
                        placeholder="carlos@empresa.com.br"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Telefone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 98888-7777"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Faturamento Médio Mensal</label>
                      <select
                        value={formData.revenue}
                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      >
                        <option value="Até R$ 30.000/mês">Até R$ 30.000/mês</option>
                        <option value="R$ 30.000 a R$ 100.000/mês">R$ 30.000 a R$ 100.000/mês</option>
                        <option value="R$ 100.000 a R$ 300.000/mês">R$ 100.000 a R$ 300.000/mês</option>
                        <option value="R$ 300.000 a R$ 1.000.000/mês">R$ 300.000 a R$ 1.000.000/mês</option>
                        <option value="Acima de R$ 1.000.000/mês">Acima de R$ 1.000.000/mês</option>
                        <option value="Quero abrir uma empresa">Quero abrir uma empresa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Principal Interesse</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      >
                        <option value="Trocar de Contador & Reduzir Impostos">Trocar de Contador & Reduzir Impostos</option>
                        <option value="Abertura de Empresa & Societário">Abertura de Empresa & Societário</option>
                        <option value="BPO Financeiro (Gestão de Caixa)">BPO Financeiro (Gestão de Caixa)</option>
                        <option value="Folha de Pagamento & eSocial">Folha de Pagamento & eSocial</option>
                        <option value="Recuperação de Créditos Tributários">Recuperação de Créditos Tributários</option>
                        <option value="Holding Familiar / Patrimonial">Holding Familiar / Patrimonial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Observações ou Dúvidas</label>
                    <textarea
                      rows="3"
                      placeholder="Conte um pouco sobre as necessidades da sua empresa..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-extrabold text-sm shadow-xl shadow-terracotta-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar e Iniciar Conversa no WhatsApp</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
