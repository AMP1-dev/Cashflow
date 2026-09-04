import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaAdminPanel({ onClose }) {
  const { 
    articles, addArticle, deleteArticle, resetArticles,
    team, addTeamMember, deleteTeamMember, resetTeam,
    firmConfig, updateFirmConfig, resetFirmConfig,
    showToast
  } = useFma();

  const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'team', 'settings'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // New Article Form State
  const [newArt, setNewArt] = useState({
    title: '',
    category: 'Direito à Saúde',
    excerpt: '',
    content: '',
    tags: 'Direito Cível, Decisão Judicial',
    featured: false
  });

  // New Team Member Form State
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Advogado Associado',
    oab: 'OAB/SP ',
    specialties: '',
    bio: '',
    email: '',
    phone: '',
    isFounder: false
  });

  // Editable Firm Config
  const [configForm, setConfigForm] = useState({
    name: firmConfig.name || 'FMA Advogados',
    founder: firmConfig.founder || 'Dr. Fernando Maeda',
    oab: firmConfig.oab || 'OAB/SP 210.374',
    whatsapp: firmConfig.contacts?.whatsapp || '5511948900900',
    whatsappFormatted: firmConfig.contacts?.whatsappFormatted || '(11) 94890-0900',
    email: firmConfig.contacts?.email || 'contato@fmadv.net',
    address: firmConfig.contacts?.address || 'São Paulo — SP',
    quoteText: firmConfig.philosophicalQuote?.text || '',
    quoteAuthor: firmConfig.philosophicalQuote?.author || 'Ulpiano'
  });

  // Handle Login Check
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'fma2026' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newArt.title || !newArt.content) {
      showToast('Preencha ao menos o título e o conteúdo.', 'error');
      return;
    }
    addArticle({
      title: newArt.title,
      category: newArt.category,
      excerpt: newArt.excerpt || newArt.content.slice(0, 160) + '...',
      content: newArt.content,
      tags: newArt.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: newArt.featured
    });
    setNewArt({
      title: '',
      category: 'Direito à Saúde',
      excerpt: '',
      content: '',
      tags: 'Direito Cível, Decisão Judicial',
      featured: false
    });
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.oab) {
      showToast('Preencha o nome e o registro da OAB.', 'error');
      return;
    }
    addTeamMember(newMember);
    setNewMember({
      name: '',
      role: 'Advogado Associado',
      oab: 'OAB/SP ',
      specialties: '',
      bio: '',
      email: '',
      phone: '',
      isFounder: false
    });
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateFirmConfig({
      name: configForm.name,
      founder: configForm.founder,
      oab: configForm.oab,
      contacts: {
        ...firmConfig.contacts,
        whatsapp: configForm.whatsapp,
        whatsappFormatted: configForm.whatsappFormatted,
        email: configForm.email,
        address: configForm.address
      },
      philosophicalQuote: {
        ...firmConfig.philosophicalQuote,
        text: configForm.quoteText,
        author: configForm.quoteAuthor
      }
    });
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      articles,
      team,
      firmConfig,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fma_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Backup exportado com sucesso!');
  };

  // Authentication Gate Modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
        <div className="w-full max-w-md bg-[#0F1116] border border-fma-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fma-surface border border-fma-gold/40 flex items-center justify-center text-fma-gold shadow">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Painel de Gestão FMA</h3>
                <span className="text-[11px] text-zinc-400 font-mono">Acesso Restrito ao Escritório</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Senha de Acesso:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (padrão: admin)"
                className="w-full px-4 py-2.5 rounded-xl bg-fma-surface border border-fma-border text-white text-sm focus:border-fma-gold outline-none"
              />
              {authError && (
                <span className="text-[11px] text-red-400 mt-1 block">
                  Senha incorreta. Utilize <strong>admin</strong> ou <strong>fma2026</strong>.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Acessar Painel Administrativo</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0F1116] border border-fma-border rounded-2xl shadow-2xl my-6 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#161920] to-[#0F1116] border-b border-fma-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fma-surface border border-fma-gold flex items-center justify-center text-fma-gold shadow font-serif font-bold text-lg">
              FMA
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                Painel Administrativo & Gestão de Conteúdo
              </h2>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sessão Ativa • Alterações salvas em tempo real
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
              title="Baixar backup dos dados em JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-fma-border bg-[#12141A]">
          {[
            { id: 'articles', label: 'Matérias & Artigos', icon: FileText, count: articles.length },
            { id: 'team', label: 'Sócios & Advogados', icon: Users, count: team.length },
            { id: 'settings', label: 'Dados Institucionais', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-fma-gold text-fma-gold font-bold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content with Scroll */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* TAB 1: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-8">
              
              {/* Form to Add Article */}
              <div className="p-6 rounded-xl bg-fma-card border border-fma-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-fma-gold" />
                    Publicar Nova Matéria / Artigo Jurídico
                  </h3>
                  <button
                    onClick={resetArticles}
                    className="text-[11px] text-zinc-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar Padrão
                  </button>
                </div>

                <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-400 mb-1 font-medium">Título do Artigo *</label>
                      <input
                        type="text"
                        required
                        value={newArt.title}
                        onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                        placeholder="Ex: Liminares contra reajustes abusivos aos 60 anos"
                        className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Categoria</label>
                      <select
                        value={newArt.category}
                        onChange={(e) => setNewArt({ ...newArt, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                      >
                        <option value="Direito à Saúde">Direito à Saúde</option>
                        <option value="Direito Bancário">Direito Bancário</option>
                        <option value="Advocacia Cível">Advocacia Cível</option>
                        <option value="Direito do Consumidor">Direito do Consumidor</option>
                        <option value="Direito Imobiliário">Direito Imobiliário</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Resumo Curto (Lead)</label>
                    <input
                      type="text"
                      value={newArt.excerpt}
                      onChange={(e) => setNewArt({ ...newArt, excerpt: e.target.value })}
                      placeholder="Breve introdução que aparecerá no card do artigo..."
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Conteúdo Completo (Suporta Markdown com ## subtítulos e tópicos) *</label>
                    <textarea
                      rows={6}
                      required
                      value={newArt.content}
                      onChange={(e) => setNewArt({ ...newArt, content: e.target.value })}
                      placeholder="Escreva o texto completo do parecer, tese ou artigo jurídico..."
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Tags (separadas por vírgula)</label>
                      <input
                        type="text"
                        value={newArt.tags}
                        onChange={(e) => setNewArt({ ...newArt, tags: e.target.value })}
                        placeholder="Liminar, STJ, Plano de Saúde"
                        className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                        <input
                          type="checkbox"
                          checked={newArt.featured}
                          onChange={(e) => setNewArt({ ...newArt, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-fma-gold"
                        />
                        <span>Destacar na página inicial</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs flex items-center gap-2 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar Artigo</span>
                  </button>
                </form>
              </div>

              {/* Published Articles List */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Artigos Publicados no Portal ({articles.length})
                </h4>

                <div className="space-y-2">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 rounded-xl bg-fma-surface border border-fma-border flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-fma-gold uppercase font-semibold">
                          {art.category} • {art.date}
                        </span>
                        <h5 className="font-serif font-bold text-white text-sm">
                          {art.title}
                        </h5>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {art.excerpt}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteArticle(art.id)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors flex-shrink-0"
                        title="Excluir artigo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TEAM / LAWYERS */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              
              {/* Form to Add Lawyer */}
              <div className="p-6 rounded-xl bg-fma-card border border-fma-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-fma-gold" />
                    Cadastrar Advogado / Sócio
                  </h3>
                  <button
                    onClick={resetTeam}
                    className="text-[11px] text-zinc-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar Padrão
                  </button>
                </div>

                <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="Ex: Dra. Mariana Costa"
                        className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Cargo / Função</label>
                      <input
                        type="text"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        placeholder="Ex: Sócia Coordenadora de Direito à Saúde"
                        className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Registro OAB *</label>
                      <input
                        type="text"
                        required
                        value={newMember.oab}
                        onChange={(e) => setNewMember({ ...newMember, oab: e.target.value })}
                        placeholder="Ex: OAB/SP 412.589"
                        className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Especialidades & Formação</label>
                    <input
                      type="text"
                      value={newMember.specialties}
                      onChange={(e) => setNewMember({ ...newMember, specialties: e.target.value })}
                      placeholder="Ex: Especialista em Direito Médico e Tutelas de Urgência pela USP"
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Mini Biografia / Apresentação</label>
                    <textarea
                      rows={3}
                      value={newMember.bio}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      placeholder="Histórico profissional, áreas de pesquisa e atuação..."
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs flex items-center gap-2 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar na Equipe</span>
                  </button>
                </form>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Equipe Atual ({team.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-fma-surface border border-fma-border flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif font-bold text-white text-sm">
                            {m.name}
                          </h5>
                          {m.isFounder && (
                            <span className="text-[10px] bg-fma-gold text-black font-bold px-2 py-0.5 rounded">
                              Fundador
                            </span>
                          )}
                        </div>
                        <span className="block text-xs text-fma-gold font-mono">{m.oab} • {m.role}</span>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {m.bio}
                        </p>
                      </div>

                      {!m.isFounder && (
                        <button
                          onClick={() => deleteTeamMember(m.id)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors flex-shrink-0"
                          title="Remover advogado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <form onSubmit={handleSaveConfig} className="p-6 rounded-xl bg-fma-card border border-fma-border space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-fma-gold" />
                    Informações Institucionais & Contato
                  </h3>
                  <button
                    type="button"
                    onClick={resetFirmConfig}
                    className="text-[11px] text-zinc-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar Padrão
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Nome da Marca</label>
                    <input
                      type="text"
                      value={configForm.name}
                      onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Advogado Titular / Proprietário</label>
                    <input
                      type="text"
                      value={configForm.founder}
                      onChange={(e) => setConfigForm({ ...configForm, founder: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Registro OAB Principal</label>
                    <input
                      type="text"
                      value={configForm.oab}
                      onChange={(e) => setConfigForm({ ...configForm, oab: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">WhatsApp Plantão (Número Puro)</label>
                    <input
                      type="text"
                      value={configForm.whatsapp}
                      onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">WhatsApp Formatado (Exibição)</label>
                    <input
                      type="text"
                      value={configForm.whatsappFormatted}
                      onChange={(e) => setConfigForm({ ...configForm, whatsappFormatted: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">E-mail Institucional</label>
                    <input
                      type="email"
                      value={configForm.email}
                      onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Citação Filosófica de Destaque na Home</label>
                  <input
                    type="text"
                    value={configForm.quoteText}
                    onChange={(e) => setConfigForm({ ...configForm, quoteText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Autor da Citação</label>
                  <input
                    type="text"
                    value={configForm.quoteAuthor}
                    onChange={(e) => setConfigForm({ ...configForm, quoteAuthor: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-fma-surface border border-fma-border text-white focus:border-fma-gold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-fma-gold hover:bg-fma-goldLight text-black font-bold text-xs flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados Institucionais</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#12141A] border-t border-fma-border flex items-center justify-between text-xs text-zinc-500">
          <span>FMA Advogados • Sistema de Gestão de Conteúdo v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
}
