import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, Scale } from 'lucide-react';
import { FMA_CONFIG, FMA_PRACTICE_AREAS } from '../../data/fmaData';

export function FmaContactSection() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    area: 'direito-saude',
    mensagem: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const areaName = FMA_PRACTICE_AREAS.find(a => a.id === formData.area)?.title || 'Geral';
    const message = `*Nova Consulta pelo Portal FMA Advogados*\n\n• *Nome:* ${formData.nome}\n• *Email:* ${formData.email}\n• *Telefone:* ${formData.telefone}\n• *Área:* ${areaName}\n• *Mensagem:* ${formData.mensagem}`;
    const url = `https://wa.me/${FMA_CONFIG.contacts.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-20 sm:py-28 bg-[#0F1116] relative border-t border-fma-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fma-surface border border-fma-border text-xs font-mono font-medium text-fma-gold uppercase tracking-wider">
                Contato & Atendimento
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Inicie Sua Análise com Total Sigilo e Celeridade
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Atendimento presencial em São Paulo e consultas virtuais por videoconferência com validade para todo o território nacional.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-fma-card border border-fma-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-fma-surface border border-fma-border flex items-center justify-center text-fma-gold flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-zinc-400 text-xs font-mono uppercase">WhatsApp / Telefone</span>
                  <a 
                    href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}`}
                    className="font-bold text-white hover:text-fma-gold transition-colors text-sm"
                  >
                    {FMA_CONFIG.contacts.whatsappFormatted}
                  </a>
                  <span className="block text-[11px] text-emerald-400 mt-0.5">Plantão de Liminares 24h</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-fma-card border border-fma-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-fma-surface border border-fma-border flex items-center justify-center text-fma-gold flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-zinc-400 text-xs font-mono uppercase">E-mail Institucional</span>
                  <a 
                    href={`mailto:${FMA_CONFIG.contacts.email}`}
                    className="font-bold text-white hover:text-fma-gold transition-colors text-sm"
                  >
                    {FMA_CONFIG.contacts.email}
                  </a>
                  <span className="block text-[11px] text-zinc-500 mt-0.5">Retorno ágil e seguro</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-fma-card border border-fma-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-fma-surface border border-fma-border flex items-center justify-center text-fma-gold flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-zinc-400 text-xs font-mono uppercase">Localização</span>
                  <span className="font-bold text-white text-sm">
                    {FMA_CONFIG.contacts.address}
                  </span>
                  <span className="block text-[11px] text-zinc-500 mt-0.5">Processos 100% Eletrônicos (PJe e e-SAJ)</span>
                </div>
              </div>
            </div>

            {/* Strict Notice */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-fma-gold flex-shrink-0" />
              <span>
                {FMA_CONFIG.disclaimerCriminal}
              </span>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-fma-card border border-fma-border p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <h3 className="font-serif font-bold text-xl text-white">
                  Formulário de Triagem Rápida
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Preencha os campos abaixo para iniciar o atendimento diretamente com o Dr. Fernando Maeda.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center rounded-xl bg-fma-surface border border-emerald-500/40 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-serif font-bold text-lg text-white">Mensagem Encaminhada!</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Sua mensagem foi direcionada ao WhatsApp do escritório. Caso o aplicativo não tenha aberto automaticamente, clique no botão abaixo:
                  </p>
                  <a
                    href={`https://wa.me/${FMA_CONFIG.contacts.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-fma-gold text-black font-bold text-xs"
                  >
                    <Phone className="w-4 h-4" />
                    Abrir WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">E-mail</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Área de Interesse *</label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
                      >
                        {FMA_PRACTICE_AREAS.map(a => (
                          <option key={a.id} value={a.id} className="bg-[#111318] text-white">
                            {a.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Descreva Brevemente a Situação *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none resize-none"
                      placeholder="Ex: O plano de saúde negou a cirurgia de prótese prescrita pelo médico com urgência..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fma-gold to-fma-goldLight hover:from-fma-goldLight hover:to-fma-gold text-black font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-fma-gold/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar para Análise Prévia</span>
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
