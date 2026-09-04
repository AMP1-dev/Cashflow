import React, { useState } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Lock,
  LogOut,
  Users,
  Sparkles,
  Server,
  FileText,
  Settings,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  Edit,
  Save,
  X,
  ShieldCheck,
  Building2,
  Calculator,
  MessageCircle,
  Eye
} from 'lucide-react';

export function AmpAdminPanel() {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    siteConfig,
    updateSiteConfig,
    leads,
    markLeadStatus,
    deleteLead,
    diagnostics,
    deleteDiagnostic,
    services,
    addCorporateService,
    updateCorporateService,
    deleteCorporateService,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    changeAdminPassword,
    restoreBackup,
    resetAllCorporateData,
    setCurrentView,
    showToast
  } = useAmp();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('diagnostics'); // 'diagnostics' | 'leads' | 'services' | 'articles' | 'config' | 'backup'

  // Service Edit / Create Modal state
  const [editingService, setEditingService] = useState(null);
  const [isNewService, setIsNewService] = useState(false);

  // Article Edit / Create Modal state
  const [editingArticle, setEditingArticle] = useState(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  // Admin password change state
  const [newPass, setNewPass] = useState('');

  // Backup file input
  const handleBackupUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      restoreBackup(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      siteConfig,
      services,
      articles,
      leads,
      diagnostics
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `universo_amp_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup corporativo exportado com sucesso!');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              Painel Executivo AMP
            </h2>
            <p className="text-xs text-slate-400">
              Acesso exclusivo para a diretoria e administradores autorizados.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(passwordInput);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Senha Administrativa
              </label>
              <input
                type="password"
                required
                placeholder="Digite a senha..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Senha padrão: amp2026</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
            >
              Acessar Painel Executivo
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              ← Voltar ao Portal Público
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col">
      
      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-xs">
            AMP
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-2 leading-none">
              Painel Executivo • Universo AMP
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Diretoria
              </span>
            </h1>
            <span className="text-[10px] text-slate-400">Ambiente de Gestão de Leads, Serviços e Governança</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ver Portal Público</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold flex items-center gap-1 transition-all"
            title="Sair do Painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'bg-amber-500 text-slate-950 shadow font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnósticos 360° ({diagnostics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'bg-amber-500 text-slate-950 shadow font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leads de Contato ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-cyan-600 text-white shadow font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Serviços Corporativos ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'articles'
                ? 'bg-blue-600 text-white shadow font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Artigos & Insights ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-slate-700 text-white shadow font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações & Segurança</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-slate-700 text-white shadow font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup & Restauração</span>
          </button>
        </div>

        {/* TAB 1: DIAGNÓSTICOS 360° */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                Solicitações de Diagnósticos 360° Recebidas
              </h2>
            </div>

            {diagnostics.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">Nenhum diagnóstico registrado até o momento.</p>
                <p className="text-xs text-slate-500">As solicitações feitas no assistente público aparecerão aqui em tempo real.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnostics.map((d) => (
                  <div key={d.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {d.pillarLabel}
                        </span>
                        <h3 className="text-base font-black text-white mt-1.5">{d.companyName}</h3>
                        <p className="text-xs text-slate-400">{d.decisionMaker} ({d.role})</p>
                      </div>

                      <button
                        onClick={() => deleteDiagnostic(d.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-all"
                        title="Excluir Diagnóstico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <p><span className="text-slate-500">WhatsApp:</span> <span className="font-bold text-emerald-400">{d.whatsapp}</span></p>
                      {d.email && <p><span className="text-slate-500">E-mail:</span> {d.email}</p>}
                      {d.city && <p><span className="text-slate-500">Cidade:</span> {d.city}</p>}
                      <p><span className="text-slate-500">Data:</span> {new Date(d.createdAt).toLocaleString('pt-BR')}</p>
                    </div>

                    {d.challenges && d.challenges.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-amber-400 uppercase">Desafios Mapeados:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {d.challenges.map((c, i) => (
                            <li key={i} className="line-clamp-1">{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <a
                        href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${d.decisionMaker}! Aqui é a diretoria do Grupo AMP sobre o Diagnóstico 360° da empresa ${d.companyName}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Abrir no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                Contatos Institucionais Recebidos
              </h2>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">Nenhum contato institucional registrado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((l) => (
                  <div key={l.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                          {l.subject || 'Contato'}
                        </span>
                        <h3 className="text-base font-black text-white mt-1.5">{l.name}</h3>
                        <p className="text-xs text-slate-400">{l.company}</p>
                      </div>

                      <button
                        onClick={() => deleteLead(l.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      "{l.message}"
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-emerald-400 font-bold">{l.whatsapp}</span>
                      <a
                        href={`https://wa.me/${l.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Chamar</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                Portfólio de Soluções Corporativas ({services.length})
              </h2>

              <button
                onClick={() => {
                  setEditingService({
                    division: 'ti',
                    divisionLabel: 'TI Corporativa & Cloud',
                    title: '',
                    category: 'Infraestrutura',
                    iconName: 'Server',
                    shortDesc: '',
                    fullDesc: '',
                    highlights: ['Alta Disponibilidade', 'Segurança LGPD'],
                    targetAudience: ''
                  });
                  setIsNewService(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Serviço</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-400">{s.divisionLabel}</span>
                    <h3 className="text-base font-black text-white mt-1">{s.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.shortDesc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => { setEditingService(s); setIsNewService(false); }}
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => deleteCorporateService(s.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                Artigos & Insights Publicados ({articles.length})
              </h2>

              <button
                onClick={() => {
                  setEditingArticle({
                    title: '',
                    category: 'TI & Cibersegurança',
                    readTime: '5 min',
                    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
                    summary: '',
                    content: ''
                  });
                  setIsNewArticle(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Artigo Técnico</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div key={art.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400">{art.category} • {art.date}</span>
                    <h3 className="text-base font-black text-white mt-1">{art.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{art.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => { setEditingArticle(art); setIsNewArticle(false); }}
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => deleteArticle(art.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONFIGURAÇÕES */}
        {activeTab === 'config' && (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 max-w-3xl">
            <h2 className="text-lg font-black text-white">
              Configurações Institucionais & Segurança
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Telefone Principal</label>
                <input
                  type="text"
                  value={siteConfig.contact.phone}
                  onChange={(e) => updateSiteConfig({ contact: { ...siteConfig.contact, phone: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">WhatsApp Oficial (com DDD)</label>
                <input
                  type="text"
                  value={siteConfig.contact.whatsapp}
                  onChange={(e) => updateSiteConfig({ contact: { ...siteConfig.contact, whatsapp: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">E-mail Comercial</label>
                <input
                  type="email"
                  value={siteConfig.contact.commercialEmail}
                  onChange={(e) => updateSiteConfig({ contact: { ...siteConfig.contact, commercialEmail: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">E-mail Suporte</label>
                <input
                  type="email"
                  value={siteConfig.contact.supportEmail}
                  onChange={(e) => updateSiteConfig({ contact: { ...siteConfig.contact, supportEmail: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-sm font-black text-white">Alterar Senha do Painel</h3>
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="Nova senha (mínimo 4 dígitos)..."
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
                <button
                  onClick={() => {
                    if (changeAdminPassword(newPass)) setNewPass('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow"
                >
                  Salvar Senha
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BACKUP */}
        {activeTab === 'backup' && (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 max-w-2xl">
            <h2 className="text-lg font-black text-white">
              Backup, Restauração e Segurança de Dados
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white">Exportar Backup Completo (JSON)</h4>
                  <p className="text-[11px] text-slate-400">Salva todas as configurações, serviços, artigos e diagnósticos em arquivo único.</p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white">Restaurar Backup Anterior</h4>
                  <p className="text-[11px] text-slate-400">Importe um arquivo JSON salvo anteriormente.</p>
                </div>
                <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700">
                  <Upload className="w-4 h-4" />
                  <span>Carregar JSON</span>
                  <input type="file" accept=".json" onChange={handleBackupUpload} className="hidden" />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-rose-300">Restaurar Dados Padrão AMP</h4>
                  <p className="text-[11px] text-rose-400/80">Restaura todas as configurações oficiais do Grupo AMP.</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Deseja realmente restaurar todos os dados para os padrões de fábrica do Grupo AMP?')) {
                      resetAllCorporateData();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Resetar</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* SERVICE EDIT MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#090F1E] border border-slate-700 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingService(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white">
              {isNewService ? 'Adicionar Novo Serviço Corporativo' : 'Editar Serviço'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Divisão</label>
                <select
                  value={editingService.division}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    division: e.target.value,
                    divisionLabel: e.target.value === 'ti' ? 'TI Corporativa & Cloud' : 'Consultoria Financeira & Estratégica'
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="ti">TI Corporativa & Cloud</option>
                  <option value="finance">Consultoria Financeira & Estratégica</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Título do Serviço</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Resumo Curto (Card)</label>
                <textarea
                  rows={2}
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Descrição Completa</label>
                <textarea
                  rows={4}
                  value={editingService.fullDesc}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (isNewService) {
                    addCorporateService(editingService);
                  } else {
                    updateCorporateService(editingService.id, editingService);
                  }
                  setEditingService(null);
                }}
                className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase"
              >
                Salvar Serviço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE EDIT MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#090F1E] border border-slate-700 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingArticle(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white">
              {isNewArticle ? 'Criar Novo Artigo' : 'Editar Artigo'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Título do Artigo</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Tempo de Leitura</label>
                  <input
                    type="text"
                    value={editingArticle.readTime}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">URL Imagem de Capa</label>
                <input
                  type="text"
                  value={editingArticle.coverImage}
                  onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Resumo</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Conteúdo Completo (Markdown)</label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (isNewArticle) {
                    addArticle(editingArticle);
                  } else {
                    updateArticle(editingArticle.id, editingArticle);
                  }
                  setEditingArticle(null);
                }}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase"
              >
                Publicar Artigo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
