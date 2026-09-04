import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  MapPin, 
  User, 
  FileText, 
  CheckCircle2, 
  Truck
} from 'lucide-react';
import { COMPANY_INFO } from '../data/drywallData';
import { useDrywall } from '../context/DrywallContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export function DrywallQuoteSection() {
  const { showToast } = useDrywall();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Por favor, informe seu nome e telefone/WhatsApp.', 'warning');
      return;
    }

    let msg = `*COTAÇÃO - DRYWALL DISTRIBUIDORA*\n`;
    msg += `👤 *Nome:* ${formData.name}\n`;
    msg += `📱 *WhatsApp:* ${formData.phone}\n`;
    msg += `📍 *Cidade da Obra:* ${formData.city || 'Interior de SP'}\n`;
    if (formData.message) msg += `📦 *Materiais / Projeto:* ${formData.message}\n`;
    msg += `\nSolicito preços e prazos de entrega de distribuidora.`;

    const url = `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;

    if (isSupabaseConfigured()) {
      supabase
        .from('cotacoes_drywall')
        .insert([{
          nome: formData.name,
          telefone: formData.phone,
          cidade: formData.city,
          mensagem: formData.message,
          criado_em: new Date().toISOString()
        }])
        .then(() => {})
        .catch(() => {});
    }

    setSubmitted(true);
    showToast('Solicitação enviada com sucesso!');

    setTimeout(() => {
      window.open(url, '_blank');
    }, 300);
  };

  return (
    <section id="cotacao" className="py-20 bg-slate-50 dark:bg-[#0E131F] transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cotação Direta &bull; Resposta Imediata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Solicitar <span className="text-[#0052D9] dark:text-blue-400">Cotação de Preço</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Envie sua relação de materiais ou medidas da obra. Retornamos em poucos minutos com valores de atacado para sua região.
          </p>
        </div>

        {/* Clean Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cotação Encaminhada!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Seu contato foi enviado para nosso consultor comercial no WhatsApp.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', city: '', message: '' });
                }}
                className="text-xs font-semibold text-[#0052D9] dark:text-blue-400 underline pt-2"
              >
                Fazer outra cotação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nome completo ou responsável"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0052D9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="(19) 99876-5432"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0052D9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cidade da Obra no Interior de SP *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Ex: Campinas, Sorocaba, Ribeirão Preto, Piracicaba..."
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0052D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Relação de Materiais ou Medidas da Obra
                </label>
                <textarea
                  rows={3}
                  name="message"
                  placeholder="Ex: 60 placas ST 12.5mm, 30 montantes 48, 10 guias, 2 baldes de massa... ou descreva a área em m²."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0052D9]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Cotação para o WhatsApp</span>
              </button>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left gap-2">
                <span>Atendimento comercial direto &bull; {COMPANY_INFO.hours}</span>
                <span>Telefone Matriz: {COMPANY_INFO.phone}</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
