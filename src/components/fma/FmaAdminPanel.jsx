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
  AlertCircle,
  LayoutTemplate,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaAdminPanel({ onClose }) {
  const { 
    articles, addArticle, deleteArticle, resetArticles,
    team, addTeamMember, deleteTeamMember, resetTeam,
    firmConfig, updateFirmConfig, resetFirmConfig,
    showToast
  } = useFma();

  const [activeTab, setActiveTab] = useState('home-texts'); // 'home-texts', 'articles', 'team', 'settings'
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

  // Editable Firm Config & Home Texts
  const [configForm, setConfigForm] = useState({
    name: firmConfig.name || 'FMA Advogados',
    firmName: firmConfig.firmName || 'Ferreira & Mello Advogados',
    founder: firmConfig.founder || 'Ferreira & Mello Advogados',
    oab: firmConfig.oab || 'OAB/SP',
    // Home Texts (Novos campos customizáveis!)
    heroTitle: firmConfig.heroTitle || 'Estratégias e soluções processuais, consultivas e contenciosas.',
    heroSubtitle: firmConfig.heroSubtitle || 'Atuação de alto impacto técnico para casos complexos nas esferas Cível, Bancária, Contratual e Direito à Saúde.',
    purposeTitle: firmConfig.purposeTitle || 'tem um propósito claro: oferecer soluções jurídicas com excelência técnica na construção de estratégias sólidas, no contencioso e no consultivo.',
    purposeSubtitle: firmConfig.purposeSubtitle || 'Nossa atuação também é definida: contencioso estratégico, pareceres e opiniões legais, direito bancário, direito à saúde com plantão de liminares urgentes e assessoria técnica de parceiros.',
    // Contacts & Quote
    whatsapp: firmConfig.contacts?.whatsapp || '551936724554',
    whatsappFormatted: firmConfig.contacts?.whatsappFormatted || '(19) 3672-4554',
    email: firmConfig.contacts?.email || 'contato@fmadv.net',
    phone: firmConfig.contacts?.phone || '(19) 3672-4554',
    address: firmConfig.contacts?.address || 'Rua Coronel Penteado, nº 449, Centro, Santa Cruz das Palmeiras – SP',
    quoteText: firmConfig.philosophicalQuote?.text || 'A justiça é a vontade constante e perpétua de dar a cada um o que é seu.',
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
    showToast('Artigo publicado com sucesso!');
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
    showToast('Advogado cadastrado com sucesso!');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateFirmConfig({
      ...firmConfig,
      name: configForm.name,
      firmName: configForm.firmName,
      founder: configForm.founder,
      oab: configForm.oab,
      heroTitle: configForm.heroTitle,
      heroSubtitle: configForm.heroSubtitle,
      purposeTitle: configForm.purposeTitle,
      purposeSubtitle: configForm.purposeSubtitle,
      contacts: {
        ...firmConfig.contacts,
        whatsapp: configForm.whatsapp,
        whatsappFormatted: configForm.whatsappFormatted,
        email: configForm.email,
        phone: configForm.phone,
        address: configForm.address
      },
      philosophicalQuote: {
        ...firmConfig.philosophicalQuote,
        text: configForm.quoteText,
        author: configForm.quoteAuthor
      }
    });
    showToast('Alterações salvas com sucesso!');
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

  // 1. TELA DE LOGIN COM CONTRASTE IMPECÁVEL
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-md bg-[#0D1117] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Painel FMA Advogados</h3>
                <span className="text-xs text-slate-400 font-mono">Área Restrita do Escritório</span>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Senha de Acesso:
              </label>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (padrão: admin)"
                className="w-full px-4 py-3 rounded-xl bg-[#161B26] border border-slate-600 text-white placeholder-slate-400 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
              />
              {authError && (
                <div className="flex items-center gap-2 text-xs text-rose-400 mt-2 bg-rose-950/40 border border-rose-800/60 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Senha incorreta. Utilize <strong>admin</strong> ou <strong>fma2026</strong>.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/30 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Acessar Painel Administrativo</span>
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-800">
            Ferreira & Mello Advogados • Santa Cruz das Palmeiras – SP
          </div>
        </div>
      </div>
    );
  }

  // 2. PAINEL PRINCIPAL COM MÁXIMA NITIDEZ E ALTO CONTRASTE
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0D1117] border border-slate-700 rounded-2xl shadow-2xl my-6 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#111622] via-[#0D1117] to-[#111622] border-b border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow font-serif font-bold text-lg">
              FMA
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                Painel Administrativo & Gestão do Site
              </h2>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sessão Ativa • Alterações salvas instantaneamente
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportBackup}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-200 font-semibold transition-colors"
              title="Baixar backup dos dados em JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation com contraste vibrante */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-2 border-b border-slate-700 bg-[#121620] overflow-x-auto">
          {[
            { id: 'home-texts', label: 'Textos da Home & Propósito', icon: LayoutTemplate },
            { id: 'articles', label: 'Matérias & Artigos', icon: FileText, count: articles.length },
            { id: 'team', label: 'Sócios & Advogados', icon: Users, count: team.length },
            { id: 'settings', label: 'Contatos & Institucional', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10 font-bold'
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content with Scroll */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1 bg-[#090C10]">
          
          {/* ============================================================ */}
          {/* TAB 1: TEXTOS DA HOME (CUSTOMIZAÇÃO DOS TEXTOS INICIAIS) */}
          {/* ============================================================ */}
          {activeTab === 'home-texts' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-[#111622] border border-slate-700 rounded-xl p-5 sm:p-6 space-y-6">
                
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-amber-400" />
                    Customização dos Textos da Página Inicial (Home)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edite livremente as frases de impacto, títulos e o manifesto do escritório. As alterações refletem imediatamente no site.
                  </p>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
                  
                  {/* Bloco 1: Título e Subtítulo Principal do Hero */}
                  <div className="space-y-4 bg-[#161B26] p-4 sm:p-5 rounded-lg border border-slate-700/80">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <span>1. Topo da Página (Hero Principal)</span>
                    </div>

                    <div>
                      <label className="block text-slate-200 font-semibold mb-1.5">
                        Título Principal em Destaque (H1) *
                      </label>
                      <input
                        type="text"
                        required
                        value={configForm.heroTitle}
                        onChange={(e) => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                        placeholder="Ex: Estratégias e soluções processuais, consultivas e contenciosas."
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0D1117] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm font-medium"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Texto grande exibido no topo da página principal.
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-200 font-semibold mb-1.5">
                        Subtítulo / Descrição Resumida *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={configForm.heroSubtitle}
                        onChange={(e) => setConfigForm({ ...configForm, heroSubtitle: e.target.value })}
                        placeholder="Ex: Atuação de alto impacto técnico para casos complexos nas esferas Cível, Bancária, Contratual e Direito à Saúde."
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0D1117] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Bloco 2: Manifesto & Propósito do Escritório */}
                  <div className="space-y-4 bg-[#161B26] p-4 sm:p-5 rounded-lg border border-slate-700/80">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <span>2. Seção Escritório & Propósito</span>
                    </div>

                    <div>
                      <label className="block text-slate-200 font-semibold mb-1.5">
                        Frase de Propósito do Escritório *
                      </label>
                      <input
                        type="text"
                        required
                        value={configForm.purposeTitle}
                        onChange={(e) => setConfigForm({ ...configForm, purposeTitle: e.target.value })}
                        placeholder="tem um propósito claro: oferecer soluções jurídicas com excelência técnica..."
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0D1117] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm font-medium"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Será precedido automaticamente pelo nome do escritório (ex: <em>Ferreira & Mello Advogados tem um propósito claro...</em>).
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-200 font-semibold mb-1.5">
                        Detalhamento da Atuação Institucional *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={configForm.purposeSubtitle}
                        onChange={(e) => setConfigForm({ ...configForm, purposeSubtitle: e.target.value })}
                        placeholder="Nossa atuação também é definida: contencioso estratégico, pareceres..."
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0D1117] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Bloco 3: Citação Filosófica de Ulpiano */}
                  <div className="space-y-4 bg-[#161B26] p-4 sm:p-5 rounded-lg border border-slate-700/80">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <span>3. Citação de Rigor & Filosofia</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-200 font-semibold mb-1.5">Texto da Citação</label>
                        <input
                          type="text"
                          value={configForm.quoteText}
                          onChange={(e) => setConfigForm({ ...configForm, quoteText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#0D1117] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-200 font-semibold mb-1.5">Autor</label>
                        <input
                          type="text"
                          value={configForm.quoteAuthor}
                          onChange={(e) => setConfigForm({ ...configForm, quoteAuthor: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#0D1117] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botão Salvar Textos */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Textos da Página Inicial</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetFirmConfig}
                      className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar Textos Padrão
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: ARTICLES (MATÉRIAS & ARTIGOS) */}
          {/* ============================================================ */}
          {activeTab === 'articles' && (
            <div className="space-y-8">
              
              {/* Formulário Novo Artigo */}
              <div className="p-6 rounded-xl bg-[#111622] border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    Publicar Nova Matéria / Artigo Jurídico
                  </h3>
                  <button
                    onClick={resetArticles}
                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Padrão
                  </button>
                </div>

                <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-200 mb-1.5 font-semibold">Título do Artigo *</label>
                      <input
                        type="text"
                        required
                        value={newArt.title}
                        onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                        placeholder="Ex: Liminares contra reajustes abusivos aos 60 anos"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 font-semibold">Categoria</label>
                      <select
                        value={newArt.category}
                        onChange={(e) => setNewArt({ ...newArt, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm cursor-pointer"
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
                    <label className="block text-slate-200 mb-1.5 font-semibold">Resumo Curto (Lead)</label>
                    <input
                      type="text"
                      value={newArt.excerpt}
                      onChange={(e) => setNewArt({ ...newArt, excerpt: e.target.value })}
                      placeholder="Breve introdução que aparecerá no card do artigo..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">
                      Conteúdo Completo (Suporta Markdown com ## subtítulos e tópicos) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={newArt.content}
                      onChange={(e) => setNewArt({ ...newArt, content: e.target.value })}
                      placeholder="Escreva o texto completo do parecer, tese ou artigo jurídico..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-slate-200 mb-1.5 font-semibold">Tags (separadas por vírgula)</label>
                      <input
                        type="text"
                        value={newArt.tags}
                        onChange={(e) => setNewArt({ ...newArt, tags: e.target.value })}
                        placeholder="Liminar, STJ, Plano de Saúde"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                      />
                    </div>

                    <div className="pt-4">
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-200 font-medium">
                        <input
                          type="checkbox"
                          checked={newArt.featured}
                          onChange={(e) => setNewArt({ ...newArt, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                        />
                        <span>Destacar na página inicial</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar Artigo</span>
                  </button>
                </form>
              </div>

              {/* Lista de Artigos Publicados */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Artigos Publicados no Portal ({articles.length})
                </h4>

                <div className="space-y-2.5">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 rounded-xl bg-[#111622] border border-slate-700/80 hover:border-slate-600 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold">
                          {art.category} • {art.date}
                        </span>
                        <h5 className="font-serif font-bold text-white text-base">
                          {art.title}
                        </h5>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {art.excerpt}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteArticle(art.id)}
                        className="p-2.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 transition-colors flex-shrink-0 cursor-pointer"
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

          {/* ============================================================ */}
          {/* TAB 3: TEAM / LAWYERS (SÓCIOS & ADVOGADOS) */}
          {/* ============================================================ */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              
              {/* Formulário Novo Advogado */}
              <div className="p-6 rounded-xl bg-[#111622] border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    Cadastrar Advogado / Sócio
                  </h3>
                  <button
                    onClick={resetTeam}
                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Padrão
                  </button>
                </div>

                <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-200 mb-1.5 font-semibold">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="Ex: Dra. Mariana Costa"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 font-semibold">Cargo / Função</label>
                      <input
                        type="text"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        placeholder="Ex: Sócia Coordenadora de Direito à Saúde"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 mb-1.5 font-semibold">Registro OAB *</label>
                      <input
                        type="text"
                        required
                        value={newMember.oab}
                        onChange={(e) => setNewMember({ ...newMember, oab: e.target.value })}
                        placeholder="Ex: OAB/SP 412.589"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Especialidades & Formação</label>
                    <input
                      type="text"
                      value={newMember.specialties}
                      onChange={(e) => setNewMember({ ...newMember, specialties: e.target.value })}
                      placeholder="Ex: Especialista em Direito Médico e Tutelas de Urgência pela USP"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Mini Biografia / Apresentação</label>
                    <textarea
                      rows={3}
                      value={newMember.bio}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      placeholder="Histórico profissional, áreas de pesquisa e atuação..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar na Equipe</span>
                  </button>
                </form>
              </div>

              {/* Lista da Equipe */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Equipe Atual ({team.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map((m) => (
                    <div
                      key={m.id}
                      className="p-5 rounded-xl bg-[#111622] border border-slate-700/80 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif font-bold text-white text-base">
                            {m.name}
                          </h5>
                          {m.isFounder && (
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded">
                              Fundador
                            </span>
                          )}
                        </div>
                        <span className="block text-xs text-amber-400 font-mono font-medium">{m.oab} • {m.role}</span>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {m.bio}
                        </p>
                      </div>

                      {!m.isFounder && (
                        <button
                          onClick={() => deleteTeamMember(m.id)}
                          className="p-2.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 transition-colors flex-shrink-0 cursor-pointer"
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

          {/* ============================================================ */}
          {/* TAB 4: SETTINGS & CONTATOS */}
          {/* ============================================================ */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <form onSubmit={handleSaveConfig} className="p-6 rounded-xl bg-[#111622] border border-slate-700 space-y-5 text-xs">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    Informações Institucionais, Contatos & Endereço
                  </h3>
                  <button
                    type="button"
                    onClick={resetFirmConfig}
                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Padrão
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Nome Curto da Marca</label>
                    <input
                      type="text"
                      value={configForm.name}
                      onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Razão Social / Nome Completo</label>
                    <input
                      type="text"
                      value={configForm.firmName}
                      onChange={(e) => setConfigForm({ ...configForm, firmName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Advogado Titular / Fundador</label>
                    <input
                      type="text"
                      value={configForm.founder}
                      onChange={(e) => setConfigForm({ ...configForm, founder: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Registro OAB Principal</label>
                    <input
                      type="text"
                      value={configForm.oab}
                      onChange={(e) => setConfigForm({ ...configForm, oab: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">WhatsApp (Número puro, com DDI + DDD)</label>
                    <input
                      type="text"
                      value={configForm.whatsapp}
                      onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">WhatsApp Formatado (Exibição visual)</label>
                    <input
                      type="text"
                      value={configForm.whatsappFormatted}
                      onChange={(e) => setConfigForm({ ...configForm, whatsappFormatted: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">Telefone Fixo</label>
                    <input
                      type="text"
                      value={configForm.phone}
                      onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-200 mb-1.5 font-semibold">E-mail Institucional</label>
                    <input
                      type="email"
                      value={configForm.email}
                      onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 mb-1.5 font-semibold">Endereço Completo do Escritório</label>
                  <input
                    type="text"
                    value={configForm.address}
                    onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#161B26] border border-slate-600 text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Dados Institucionais</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Footer do Modal */}
        <div className="p-4 bg-[#121620] border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>FMA Advogados • Gestão de Conteúdo & Identidade v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium cursor-pointer transition-colors"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
}

export default FmaAdminPanel;
