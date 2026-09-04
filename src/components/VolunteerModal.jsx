import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users2, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export function VolunteerModal() {
  const { isVolunteerOpen, setIsVolunteerOpen, addMessage, siteConfig } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Voluntário em Oficinas Lúdicas',
    availability: 'Manhãs de Sábado',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsVolunteerOpen(false);
    };
    if (isVolunteerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVolunteerOpen, setIsVolunteerOpen]);

  if (!isVolunteerOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addMessage({
      ...formData,
      interest: `${formData.type} (${formData.availability})`
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'Voluntário em Oficinas Lúdicas',
      availability: 'Manhãs de Sábado',
      message: ''
    });
    setIsVolunteerOpen(false);
  };

  const whatsappMsg = encodeURIComponent(`Olá! Acabei de me cadastrar como voluntário no site do Projeto João de Barro. Meu nome é ${formData.name}.`);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-terracotta-600 p-6 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold">Faça Parte da Nossa História</h2>
              <p className="text-xs text-amber-100">Seja um voluntário ou empresa parceira do Projeto João de Barro.</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cadastro Recebido com Sucesso!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Agradecemos imensamente o seu carinho e disposição para somar com as nossas crianças. Nossa coordenação entrará em contato via WhatsApp/E-mail.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Falar Agora no WhatsApp
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Juliana Carvalho"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp com DDD *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Área de Interesse</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                  >
                    <option>Voluntário em Oficinas Lúdicas</option>
                    <option>Contação de Histórias e Leitura</option>
                    <option>Apoio em Eventos Comunitários</option>
                    <option>Parceria Empresarial / Empresa Cidadã</option>
                    <option>Apoio Administrativo / Jurídico / Contábil</option>
                    <option>Outra Colaboração</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Disponibilidade</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                  >
                    <option>Manhãs durante a semana</option>
                    <option>Tardes durante a semana</option>
                    <option>Manhãs de Sábado</option>
                    <option>Eventos pontuais</option>
                    <option>Horário Flexível</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Conte-nos um pouco sobre você</label>
                <textarea
                  rows="3"
                  placeholder="Sua formação, experiência ou como gostaria de apoiar..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-terracotta-600/25 transition-all"
              >
                <Send className="w-4 h-4" />
                Enviar Inscrição de Voluntariado
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
