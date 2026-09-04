import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImageFile } from '../services/storageService';
import { Settings, Building2, Phone, Mail, MapPin, Lock, Palette, Check, Save, Upload, Image as ImageIcon, KeyRound } from 'lucide-react';

const themes = [
  {
    id: 'ruby-dark',
    name: 'Vermelho Executivo & Grafite (Oficial Aliança)',
    desc: 'Paleta corporativa sóbria com vermelho carmim, grafite escuro, branco e preto.',
    preview: 'bg-gradient-to-r from-red-600 via-rose-700 to-slate-900'
  },
  {
    id: 'graphite-red',
    name: 'Grafite Nobre com Detalhes Ruby',
    desc: 'Base em tons de ardósia e grafite com toques elegantes em vermelho.',
    preview: 'bg-gradient-to-r from-slate-900 via-slate-800 to-red-600'
  },
  {
    id: 'navy-corporate',
    name: 'Azul Marinho Corporativo & Ouro',
    desc: 'Azul profundo tradicional de grandes consultorias e auditorias financeiras.',
    preview: 'bg-gradient-to-r from-blue-700 via-blue-900 to-amber-500'
  },
  {
    id: 'emerald-gold',
    name: 'Verde Esmeralda & Dourado Nobre',
    desc: 'Verde consultivo associado à prosperidade, crescimento e segurança financeira.',
    preview: 'bg-gradient-to-r from-emerald-600 via-emerald-800 to-amber-500'
  }
];

export function ConfigManager() {
  const { siteConfig, updateSiteConfig, setTheme, changeAdminPassword, showToast } = useApp();

  const [form, setForm] = useState({ ...siteConfig });
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    updateSiteConfig(form);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const base64 = await compressImageFile(file, 400, 0.9);
      setForm(prev => ({ ...prev, logoUrl: base64 }));
      showToast('Logo atualizado com sucesso!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingFavicon(true);
      const base64 = await compressImageFile(file, 128, 0.9);
      setForm(prev => ({ ...prev, faviconUrl: base64 }));
      showToast('Favicon atualizado!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('A confirmação da nova senha não confere.', 'error');
      return;
    }
    if (changeAdminPassword(newPass)) {
      setNewPass('');
      setConfirmPass('');
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Identidade, Contatos & Portais</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Personalize as informações da Aliança Empresarial, paleta visual executiva, logo e canais de atendimento.
        </p>
      </div>

      {/* Palette Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-terracotta-950/60 border border-terracotta-500/30 text-terracotta-400 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Paleta Visual do Portal</h3>
            <p className="text-xs text-slate-400">Escolha a combinação de cores do site.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((th) => {
            const isSelected = (form.theme || 'ruby-dark') === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, theme: th.id }));
                  setTheme(th.id);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-terracotta-500 bg-slate-800/90 shadow-lg ring-2 ring-terracotta-500/20'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full ${th.preview} shadow-sm inline-block`}></span>
                    <h4 className="text-sm font-bold text-white">{th.name}</h4>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-terracotta-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{th.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleConfigSubmit} className="space-y-8">
        
        {/* Logo & Favicon */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Logotipo & Ícone do Navegador</h3>
              <p className="text-xs text-slate-400">Carregue a marca da empresa e o ícone da aba.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Logotipo Principal
              </label>
              <div className="flex items-center gap-4">
                {form.logoUrl ? (
                  <div className="h-16 w-32 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center shrink-0">
                    <img src={form.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-16 w-32 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0">
                    Logo Padrão
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                    <Upload className="w-3.5 h-3.5 text-terracotta-400" />
                    <span>{uploadingLogo ? 'Carregando...' : 'Subir Imagem do Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    placeholder="Ou cole a URL da imagem"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Favicon (Ícone da Aba)
              </label>
              <div className="flex items-center gap-4">
                {form.faviconUrl ? (
                  <div className="h-16 w-16 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center shrink-0">
                    <img src={form.faviconUrl} alt="Favicon" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0 text-center">
                    Favicon
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                    <Upload className="w-3.5 h-3.5 text-terracotta-400" />
                    <span>{uploadingFavicon ? 'Carregando...' : 'Subir Favicon'}</span>
                    <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    placeholder="Ou cole o link do favicon"
                    value={form.faviconUrl}
                    onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Institutional Texts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dados da Empresa & Missão</h3>
              <p className="text-xs text-slate-400">Nome, slogan e apresentação corporativa.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tagline Curta</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Slogan Principal</label>
            <input
              type="text"
              value={form.slogan || ''}
              onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Apresentação Institucional</label>
            <textarea
              rows="3"
              value={form.aboutDescription}
              onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>
        </div>

        {/* Contacts, CRC & Address */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Canais de Contato & Endereço</h3>
              <p className="text-xs text-slate-400">Telefones, WhatsApp, CNPJ e registro CRC.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Registro CRC</label>
              <input
                type="text"
                value={form.contact.crc}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, crc: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">CNPJ</label>
              <input
                type="text"
                value={form.contact.cnpj}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, cnpj: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp (com DDD, ex: 5511998887766)</label>
              <input
                type="text"
                value={form.contact.whatsapp}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telefone Principal</label>
              <input
                type="text"
                value={form.contact.phone}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">E-mail Comercial</label>
              <input
                type="email"
                value={form.contact.email}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Endereço da Sede</label>
            <input
              type="text"
              value={form.contact.address}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>
        </div>

        {/* Client Portal Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Links da Área do Cliente</h3>
              <p className="text-xs text-slate-400">URLs de acesso aos sistemas contábeis.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Link do Questor / Domínio</label>
              <input
                type="url"
                value={form.clientPortal?.questorUrl || ''}
                onChange={(e) => setForm({
                  ...form,
                  clientPortal: { ...form.clientPortal, questorUrl: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Link do ContaAzul / ERP</label>
              <input
                type="url"
                value={form.clientPortal?.contaAzulUrl || ''}
                onChange={(e) => setForm({
                  ...form,
                  clientPortal: { ...form.clientPortal, contaAzulUrl: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-xl shadow-terracotta-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>

      </form>

      {/* Change Password */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Alterar Senha do Painel Administrativo</h3>
            <p className="text-xs text-slate-400">Defina uma nova senha para o login da diretoria.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              minLength="4"
              placeholder="Mínimo 4 caracteres"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Confirmar Senha</label>
            <input
              type="password"
              required
              minLength="4"
              placeholder="Repita a nova senha"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Atualizar Senha</span>
          </button>
        </form>
      </div>

    </div>
  );
}
