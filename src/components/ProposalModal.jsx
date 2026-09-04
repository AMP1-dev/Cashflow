import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Calculator, CheckCircle2, Building2, Phone, Mail, User } from 'lucide-react';

export function ProposalModal() {
  const { isProposalOpen, setIsProposalOpen, proposalPrefill, setProposalPrefill, addLead, showToast, siteConfig } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    revenue: 'R$ 50.000 a R$ 100.000/mês',
    service: 'Planejamento Tributário & Troca de Contador',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (proposalPrefill) {
      setFormData(prev => ({
        ...prev,
        service: proposalPrefill.service || prev.service,
        revenue: proposalPrefill.revenue || prev.revenue,
        message: proposalPrefill.estimatedSavings ? `Simulação realizada no site: Economia estimada de ${proposalPrefill.estimatedSavings} (${proposalPrefill.segment}, ${proposalPrefill.employees}).` : prev.message
      }));
    }
  }, [proposalPrefill]);

  if (!isProposalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addLead(formData);
    setSubmitted(true);
    showToast('Solicitação de proposta enviada com sucesso!');

    const text = encodeURIComponent(
      `*Solicitação de Proposta - Aliança Empresarial*\n\n` +
      `• Nome: ${formData.name}\n` +
      `• Empresa: ${formData.company || 'Não informada'}\n` +
      `• E-mail: ${formData.email}\n` +
      `• Telefone/WhatsApp: ${formData.phone}\n` +
      `• Faturamento: ${formData.revenue}\n` +
      `• Serviço: ${formData.service}\n` +
      (formData.message ? `• Observações: ${formData.message}` : '')
    );

    setTimeout(() => {
      window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, '_blank');
      setIsProposalOpen(false);
      setSubmitted(false);
      setProposalPrefill(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-10">
        
        {/* Close Button */}
        <button
          onClick={() => { setIsProposalOpen(false); setProposalPrefill(null); }}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-400 text-xs font-bold uppercase tracking-wider mb-2 border border-terracotta-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Diagnóstico Tributário & Proposta</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Receba um Estudo de Redução de Impostos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Preencha seus dados para receber uma proposta personalizada e sem compromisso dos nossos contadores.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Proposta Enviada com Sucesso!</h3>
            <p className="text-xs text-slate-300">
              Estamos redirecionando para o WhatsApp do nosso especialista...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Gomes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Empresa</label>
                <input
                  type="text"
                  placeholder="Nome fantasia ou Razão Social"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">E-mail Profissional *</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Celular *</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 98888-7777"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Faturamento Estimado</label>
                <select
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Serviço Desejado</label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Informações Adicionais</label>
              <textarea
                rows="3"
                placeholder="Detalhes ou dúvidas sobre seu enquadramento atual..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-extrabold text-sm shadow-xl shadow-terracotta-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>Enviar e Iniciar Consultoria Gratuita</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
