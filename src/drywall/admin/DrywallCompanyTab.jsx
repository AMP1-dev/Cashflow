import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Save, 
  Globe, 
  Share2, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallCompanyTab() {
  const { company, updateCompany, showToast } = useDrywall();

  const [form, setForm] = useState({
    name: company.name || '',
    brandTransition: company.brandTransition || '',
    brandSub: company.brandSub || '',
    tagline: company.tagline || '',
    shortDesc: company.shortDesc || '',
    phone: company.phone || '',
    whatsapp: company.whatsapp || '',
    whatsappDisplay: company.whatsappDisplay || '',
    email: company.email || '',
    cotacaoEmail: company.cotacaoEmail || '',
    address: company.address || '',
    city: company.city || '',
    cep: company.cep || '',
    hours: company.hours || '',
    instagram: company.socials?.instagram || '',
    facebook: company.socials?.facebook || '',
    linkedin: company.socials?.linkedin || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany({
      name: form.name,
      brandTransition: form.brandTransition,
      brandSub: form.brandSub,
      tagline: form.tagline,
      shortDesc: form.shortDesc,
      phone: form.phone,
      whatsapp: form.whatsapp,
      whatsappDisplay: form.whatsappDisplay,
      email: form.email,
      cotacaoEmail: form.cotacaoEmail,
      address: form.address,
      city: form.city,
      cep: form.cep,
      hours: form.hours,
      socials: {
        instagram: form.instagram,
        facebook: form.facebook,
        linkedin: form.linkedin
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Informative Alert */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Configurações Oficiais & Informações de Contato da Distribuidora
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Alterações salvas aqui se refletem imediatamente em todo o portal público, incluindo o número de WhatsApp usado nos botões de cotação rápida, rodapé, dados de endereço e canais de atendimento.
          </p>
        </div>
      </div>

      {/* Brand & Identity Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Identidade e Marca</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome da Empresa</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Transição de Marca (Loja)</label>
            <input
              type="text"
              name="brandTransition"
              value={form.brandTransition}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subtítulo Institucional</label>
            <input
              type="text"
              name="brandSub"
              value={form.brandSub}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Slogan / Tagline Principal</label>
          <input
            type="text"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Descrição Curta (Sobre Nós)</label>
          <textarea
            rows="2"
            name="shortDesc"
            value={form.shortDesc}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none resize-none"
          ></textarea>
        </div>
      </div>

      {/* Contact & WhatsApp Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Atendimento & Telefones de Vendas</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp API (Apenas Números com DDI)</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="5519998452030"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Ex: 5519998452030 (utilizado nos links diretos)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp Visualização</label>
            <input
              type="text"
              name="whatsappDisplay"
              value={form.whatsappDisplay}
              onChange={handleChange}
              placeholder="(19) 99845-2030"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefone Fixo / Central</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(19) 3876-9200"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-mail Comercial Geral</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contato@dibrunelli.com.br"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-mail Setor de Cotações</label>
            <input
              type="email"
              name="cotacaoEmail"
              value={form.cotacaoEmail}
              onChange={handleChange}
              placeholder="cotacao@dibrunelli.com.br"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Location & Hours Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Localização & Expedição</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Endereço do Centro de Distribuição</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">CEP</label>
            <input
              type="text"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cidade Polo & Região</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Horário de Funcionamento</label>
            <input
              type="text"
              name="hours"
              value={form.hours}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Media Links Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>Redes Sociais Oficiais</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="@dibrunelli.drywall"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              placeholder="/dibrunellidrywall"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="/company/di-brunelli-distribuidora"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052D9] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Todas as Configurações</span>
        </button>
      </div>

    </form>
  );
}
