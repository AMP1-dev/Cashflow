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
  Eye,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Layers,
  FileCheck,
  Gift,
  Scale,
  CreditCard,
  Headset,
  TrendingUp
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
    moveCorporateService,
    categoryProducts = {},
    addCategoryProduct,
    updateCategoryProduct,
    deleteCategoryProduct,
    moveCategoryProduct,
    ecosystemItems = [],
    addEcosystemItem,
    updateEcosystemItem,
    deleteEcosystemItem,
    moveEcosystemItem,
    portalLinks = [],
    addPortalLink,
    updatePortalLink,
    deletePortalLink,
    movePortalLink,
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
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'diagnostics' | 'leads' | 'services' | 'articles' | 'config' | 'backup'

  // Cards management sub-tab
  const [cardSection, setCardSection] = useState('products'); // 'products' | 'ecosystem' | 'portals'
  const [productCategoryFilter, setProductCategoryFilter] = useState('selected');

  // Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Ecosystem Item Modal State
  const [editingEcosystem, setEditingEcosystem] = useState(null);
  const [isNewEcosystem, setIsNewEcosystem] = useState(false);

  // Portal Link Modal State
  const [editingPortal, setEditingPortal] = useState(null);
  const [isNewPortal, setIsNewPortal] = useState(false);

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
      categoryProducts,
      ecosystemItems,
      portalLinks,
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
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-[#0052D9] mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-normal text-white">
              Painel de Gestão AMP
            </h2>
            <p className="text-xs text-slate-400">
              Acesso exclusivo para gerenciar cards, soluções, serviços e leads.
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
              <label className="block text-xs font-normal text-slate-300 mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="Digite a senha administrativa..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#0052D9]"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Senha padrão: amp2026</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white font-normal text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Voltar ao Portal Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCategoryList = categoryProducts[productCategoryFilter] || [];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0052D9]/20 border border-[#0052D9]/40 flex items-center justify-center text-[#0052D9]">
            <Settings className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-base font-medium text-white flex items-center gap-2">
              Painel Executivo Universo AMP
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-900/60 border border-blue-700 text-blue-300">
                ADM Live
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Controle dinâmico de cards, produtos, ecossistema, leads e diagnósticos
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Portal</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'cards', label: '🗂️ Cards & Soluções', badge: 'Novos' },
            { id: 'diagnostics', label: '⚡ Diagnósticos 360°', count: diagnostics.length },
            { id: 'leads', label: '📩 Mensagens & Leads', count: leads.length },
            { id: 'services', label: '🛠️ Serviços Corporativos', count: services.length },
            { id: 'articles', label: '📰 Artigos & Blog', count: articles.length },
            { id: 'config', label: '⚙️ Configurações Gerais' },
            { id: 'backup', label: '💾 Backup & Restauração' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-normal transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#0052D9] text-white shadow-lg shadow-blue-500/20 font-medium'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB: CARDS, SOLUÇÕES E PORTAIS */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            
            {/* Sub-Tabs for Cards */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCardSection('products')}
                  className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                    cardSection === 'products'
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1. Catálogo de Soluções (Por Categoria)</span>
                </button>

                <button
                  onClick={() => setCardSection('ecosystem')}
                  className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                    cardSection === 'ecosystem'
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>2. Grade do Ecossistema ({ecosystemItems.length})</span>
                </button>

                <button
                  onClick={() => setCardSection('portals')}
                  className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                    cardSection === 'portals'
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>3. Central de Clientes ({portalLinks.length})</span>
                </button>
              </div>

              {cardSection === 'products' && (
                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      tag: 'Consultoria',
                      desc: '',
                      highlights: ['', '', '', ''],
                      url: '#contato'
                    });
                    setIsNewProduct(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-normal flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Nova Solução / Card</span>
                </button>
              )}

              {cardSection === 'ecosystem' && (
                <button
                  onClick={() => {
                    setEditingEcosystem({
                      name: '',
                      badge: 'Solução Líder',
                      tagline: 'AMP-Tech-3.0',
                      desc: '',
                      url: '#contato',
                      icon: 'ShieldCheck'
                    });
                    setIsNewEcosystem(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-normal flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Ativo ao Ecossistema</span>
                </button>
              )}

              {cardSection === 'portals' && (
                <button
                  onClick={() => {
                    setEditingPortal({
                      title: '',
                      subtitle: '',
                      badge: 'Portal de Acesso',
                      url: '#',
                      buttonText: 'Acessar Sistema',
                      iconName: 'ShieldCheck'
                    });
                    setIsNewPortal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-normal flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Portal de Cliente</span>
                </button>
              )}
            </div>

            {/* 1. SEÇÃO PRODUTOS / CATÁLOGO */}
            {cardSection === 'products' && (
              <div className="space-y-4">
                {/* Category Filter selector */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 mr-2">Filtrar Categoria:</span>
                  {[
                    { id: 'selected', label: '⭐ Produtos Selecionados' },
                    { id: 'demandas', label: '📋 Demandas & Consultorias' },
                    { id: 'ti_cloud', label: '☁️ TI & Servidores' },
                    { id: 'finance', label: '📊 Finanças & BPO' },
                    { id: 'logistics', label: '⚖️ Logística & Balança' },
                    { id: 'loyalty', label: '🎁 Marketing & Fidelidade' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setProductCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        productCategoryFilter === cat.id
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.label} ({categoryProducts[cat.id]?.length || 0})
                    </button>
                  ))}
                </div>

                {/* Cards List with Move Up/Down, Edit, Delete */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentCategoryList.map((prod, idx) => (
                    <div
                      key={prod.id || idx}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-800">
                            {prod.tag}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            #{idx + 1}
                          </span>
                        </div>

                        <h3 className="text-sm font-medium text-white">
                          {prod.name}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {prod.desc}
                        </p>

                        {prod.highlights && prod.highlights.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase font-medium">Recursos:</span>
                            {prod.highlights.slice(0, 2).map((h, i) => (
                              <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1">
                                <span className="text-blue-400">•</span>
                                <span className="line-clamp-1">{h}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Action Controls: Reorder, Edit, Delete */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveCategoryProduct(productCategoryFilter, idx, 'up')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentCategoryList.length - 1}
                            onClick={() => moveCategoryProduct(productCategoryFilter, idx, 'down')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct({ ...prod });
                              setIsNewProduct(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 text-xs flex items-center gap-1 border border-blue-800/40"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Deseja remover o card "${prod.name}" desta categoria?`)) {
                                deleteCategoryProduct(productCategoryFilter, prod.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                            title="Excluir card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SEÇÃO GRADE DO ECOSSISTEMA */}
            {cardSection === 'ecosystem' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ecosystemItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-800">
                            {item.badge}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Posição #{idx + 1}
                          </span>
                        </div>

                        <h3 className="text-sm font-medium text-white">
                          {item.name}
                        </h3>

                        <span className="text-[10px] font-mono text-slate-400 block">
                          Tagline: {item.tagline}
                        </span>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveEcosystemItem(idx, 'up')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === ecosystemItems.length - 1}
                            onClick={() => moveEcosystemItem(idx, 'down')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEcosystem({ ...item });
                              setIsNewEcosystem(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 text-xs flex items-center gap-1 border border-blue-800/40"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Deseja remover o ativo "${item.name}" do ecossistema?`)) {
                                deleteEcosystemItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                            title="Excluir ativo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SEÇÃO PORTAIS DA CENTRAL DE CLIENTES */}
            {cardSection === 'portals' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {portalLinks.map((portal, idx) => (
                    <div
                      key={portal.id || idx}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {portal.badge}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            #{idx + 1}
                          </span>
                        </div>

                        <h3 className="text-sm font-medium text-white">
                          {portal.title}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {portal.subtitle}
                        </p>

                        <span className="text-[10px] font-mono text-blue-400 truncate block">
                          {portal.url}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => movePortalLink(idx, 'up')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === portalLinks.length - 1}
                            onClick={() => movePortalLink(idx, 'down')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPortal({ ...portal });
                              setIsNewPortal(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 text-xs flex items-center gap-1 border border-blue-800/40"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Deseja remover o portal "${portal.title}"?`)) {
                                deletePortalLink(portal.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                            title="Excluir portal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: DIAGNÓSTICOS RECEBIDOS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">
                Diagnósticos Empresariais 360° Recebidos ({diagnostics.length})
              </h2>
            </div>

            {diagnostics.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
                Nenhum diagnóstico recebido até o momento.
              </div>
            ) : (
              <div className="space-y-4">
                {diagnostics.map((diag) => (
                  <div
                    key={diag.id}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-medium text-white">
                          {diag.company || 'Empresa não informada'} • {diag.name || 'Contato'}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                          <span>📧 {diag.email}</span>
                          <span>📱 {diag.phone || 'Sem telefone'}</span>
                          <span>🕒 {new Date(diag.createdAt).toLocaleString('pt-BR')}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                          {diag.status || 'Novo'}
                        </span>
                        <button
                          onClick={() => deleteDiagnostic(diag.id)}
                          className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block">Foco Estratégico:</span>
                        <p className="font-medium text-white mt-1">{diag.answers?.foco || 'Geral'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block">Porte / Faturamento:</span>
                        <p className="font-medium text-white mt-1">{diag.answers?.porte || 'Não especificado'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block">Score de Urgência:</span>
                        <p className="font-medium text-amber-400 mt-1">{diag.score || 85}% Prioridade</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: LEADS E CONTATOS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">
              Mensagens de Contato &amp; Leads ({leads.length})
            </h2>

            {leads.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
                Nenhuma mensagem de contato recebida.
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white">{lead.name}</h3>
                        <span className="text-xs text-slate-500 font-mono">({lead.company || 'PJ'})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        📧 {lead.email} | 📱 {lead.phone} | Assunto: <span className="text-blue-300">{lead.subject || 'Geral'}</span>
                      </p>
                      {lead.message && (
                        <p className="text-xs text-slate-300 pt-1 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 mt-2">
                          "{lead.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markLeadStatus(lead.id, lead.status === 'Atendido' ? 'Pendente' : 'Atendido')}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 ${
                          lead.status === 'Atendido'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lead.status || 'Marcar Atendido'}</span>
                      </button>

                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SERVIÇOS CORPORATIVOS */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">
                Portfólio de Serviços Corporativos ({services.length})
              </h2>
              <button
                onClick={() => {
                  setEditingService({
                    title: '',
                    division: 'ti',
                    divisionLabel: 'TI Corporativa & Cloud',
                    category: 'Infraestrutura',
                    shortDesc: '',
                    fullDesc: '',
                    highlights: ['', '', '', ''],
                    targetAudience: ''
                  });
                  setIsNewService(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Serviço</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv, idx) => (
                <div
                  key={srv.id || idx}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-800">
                        {srv.divisionLabel}
                      </span>
                      <span className="text-[11px] text-slate-500">#{idx + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium text-white">{srv.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{srv.shortDesc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveCorporateService(idx, 'up')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === services.length - 1}
                        onClick={() => moveCorporateService(idx, 'down')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService({ ...srv });
                          setIsNewService(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-900/40 text-blue-300 text-xs flex items-center gap-1 border border-blue-800/40"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remover serviço "${srv.title}"?`)) {
                            deleteCorporateService(srv.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ARTIGOS & BLOG */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">
                Artigos Técnicos Publicados ({articles.length})
              </h2>
              <button
                onClick={() => {
                  setEditingArticle({
                    title: '',
                    category: 'TI & Cibersegurança',
                    summary: '',
                    content: '',
                    author: 'Diretoria Técnica AMP'
                  });
                  setIsNewArticle(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Artigo</span>
              </button>
            </div>

            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-400 uppercase font-mono">{art.category}</span>
                    <h3 className="text-sm font-medium text-white">{art.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{art.summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingArticle({ ...art });
                        setIsNewArticle(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => deleteArticle(art.id)}
                      className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CONFIGURAÇÕES GERAIS */}
        {activeTab === 'config' && (
          <div className="space-y-6 max-w-2xl bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-medium text-white">
              Configurações Gerais do Universo AMP
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nome Principal:</label>
                <input
                  type="text"
                  value={siteConfig.name}
                  onChange={(e) => updateSiteConfig({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Slogan Principal:</label>
                <input
                  type="text"
                  value={siteConfig.slogan}
                  onChange={(e) => updateSiteConfig({ slogan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">E-mail Oficial:</label>
                <input
                  type="email"
                  value={siteConfig.contact?.email || ''}
                  onChange={(e) => updateSiteConfig({
                    contact: { ...siteConfig.contact, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">WhatsApp Oficial (DDD + Número):</label>
                <input
                  type="text"
                  value={siteConfig.contact?.whatsapp || ''}
                  onChange={(e) => updateSiteConfig({
                    contact: { ...siteConfig.contact, whatsapp: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block text-slate-300">Alterar Senha Administrativa:</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Nova senha..."
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (changeAdminPassword(newPass)) setNewPass('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                  >
                    Salvar Senha
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BACKUP & RESTAURAÇÃO */}
        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-2xl bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-medium text-white">
              Backup e Restauração de Dados
            </h2>
            <p className="text-xs text-slate-400">
              Faça download de todas as personalizações, novos cards cadastrados, leads e diagnósticos em formato JSON para restaurar a qualquer momento.
            </p>

            <div className="space-y-4 pt-2">
              <button
                onClick={handleExportBackup}
                className="w-full py-3.5 rounded-xl bg-[#0052D9] hover:bg-[#003B99] text-white text-xs font-normal flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Backup Completo (.JSON)</span>
              </button>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs text-slate-300">Importar / Restaurar Arquivo de Backup:</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleBackupUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Atenção: isso restaurará todos os cards e dados para o padrão inicial. Deseja continuar?')) {
                      resetAllCorporateData();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs flex items-center gap-2 border border-rose-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurar Padrões de Fábrica</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: EDITAR / CRIAR PRODUTO (CATÁLOGO) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-medium text-white">
                {isNewProduct ? '➕ Adicionar Novo Card de Solução' : '✏️ Editar Card de Solução'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewProduct) {
                  addCategoryProduct(productCategoryFilter, editingProduct);
                } else {
                  updateCategoryProduct(productCategoryFilter, editingProduct.id, editingProduct);
                }
                setEditingProduct(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Nome do Produto / Solução *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Ex: AMP Demandas & Contratos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Tag / Categoria do Card</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.tag}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    placeholder="Ex: Gestão de OS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Link de Ação / Destino</label>
                  <input
                    type="text"
                    value={editingProduct.url || '#contato'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, url: e.target.value })}
                    placeholder="Ex: https://remoto.amp.ia.br ou #contato"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descrição Curta *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.desc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                  placeholder="Descreva a solução de forma clara e direta..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Recursos / Tópicos em Destaque (4 tópicos):</label>
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={(editingProduct.highlights && editingProduct.highlights[i]) || ''}
                    onChange={(e) => {
                      const newH = [...(editingProduct.highlights || ['', '', '', ''])];
                      newH[i] = e.target.value;
                      setEditingProduct({ ...editingProduct, highlights: newH });
                    }}
                    placeholder={`Recurso ${i + 1} (Ex: Captura Inteligente de OS em PDF)`}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white mb-1.5"
                  />
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Salvar Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / CRIAR ATIVO DO ECOSSISTEMA */}
      {editingEcosystem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-medium text-white">
                {isNewEcosystem ? '➕ Adicionar Ativo ao Ecossistema' : '✏️ Editar Ativo do Ecossistema'}
              </h3>
              <button
                onClick={() => setEditingEcosystem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewEcosystem) {
                  addEcosystemItem(editingEcosystem);
                } else {
                  updateEcosystemItem(editingEcosystem.id, editingEcosystem);
                }
                setEditingEcosystem(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Nome do Ativo *</label>
                <input
                  type="text"
                  required
                  value={editingEcosystem.name}
                  onChange={(e) => setEditingEcosystem({ ...editingEcosystem, name: e.target.value })}
                  placeholder="Ex: AMP Demandas & Contratos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Badge Superior</label>
                  <input
                    type="text"
                    required
                    value={editingEcosystem.badge}
                    onChange={(e) => setEditingEcosystem({ ...editingEcosystem, badge: e.target.value })}
                    placeholder="Ex: Consultorias & OS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Tagline Técnica</label>
                  <input
                    type="text"
                    required
                    value={editingEcosystem.tagline}
                    onChange={(e) => setEditingEcosystem({ ...editingEcosystem, tagline: e.target.value })}
                    placeholder="Ex: Demandas-Kanban-OS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descrição Curta *</label>
                <textarea
                  rows={3}
                  required
                  value={editingEcosystem.desc}
                  onChange={(e) => setEditingEcosystem({ ...editingEcosystem, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Ícone</label>
                  <select
                    value={editingEcosystem.icon || 'ShieldCheck'}
                    onChange={(e) => setEditingEcosystem({ ...editingEcosystem, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="FileCheck">FileCheck (Demandas/Contratos)</option>
                    <option value="ShieldCheck">ShieldCheck (Segurança/TI)</option>
                    <option value="Lock">Lock (Backup WORM)</option>
                    <option value="Calculator">Calculator (Fiscal/ERP)</option>
                    <option value="TrendingUp">TrendingUp (Tesouraria/Financeiro)</option>
                    <option value="Gift">Gift (Fidelidade/Loyalty)</option>
                    <option value="Scale">Scale (Pesagem/Balança)</option>
                    <option value="Server">Server (Servidores/Cloud)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">URL de Acesso</label>
                  <input
                    type="text"
                    value={editingEcosystem.url || '#contato'}
                    onChange={(e) => setEditingEcosystem({ ...editingEcosystem, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEcosystem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Salvar Ativo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / CRIAR PORTAL DE CLIENTE */}
      {editingPortal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-medium text-white">
                {isNewPortal ? '➕ Adicionar Portal de Cliente' : '✏️ Editar Portal de Cliente'}
              </h3>
              <button
                onClick={() => setEditingPortal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewPortal) {
                  addPortalLink(editingPortal);
                } else {
                  updatePortalLink(editingPortal.id, editingPortal);
                }
                setEditingPortal(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Título do Portal *</label>
                <input
                  type="text"
                  required
                  value={editingPortal.title}
                  onChange={(e) => setEditingPortal({ ...editingPortal, title: e.target.value })}
                  placeholder="Ex: AMP Demandas & Contratos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Subtítulo / Descrição *</label>
                <textarea
                  rows={2}
                  required
                  value={editingPortal.subtitle}
                  onChange={(e) => setEditingPortal({ ...editingPortal, subtitle: e.target.value })}
                  placeholder="Ex: Gestão Inteligente de Demandas e Ordens de Serviço..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Badge</label>
                  <input
                    type="text"
                    required
                    value={editingPortal.badge}
                    onChange={(e) => setEditingPortal({ ...editingPortal, badge: e.target.value })}
                    placeholder="Ex: Demandas & Contratos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Ícone</label>
                  <select
                    value={editingPortal.iconName || 'FileCheck'}
                    onChange={(e) => setEditingPortal({ ...editingPortal, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="FileCheck">FileCheck (Demandas/Contratos)</option>
                    <option value="ShieldCheck">ShieldCheck (Segurança/TI)</option>
                    <option value="Calculator">Calculator (Fiscal/Contábil)</option>
                    <option value="TrendingUp">TrendingUp (Tesouraria/Financeiro)</option>
                    <option value="HeartHandshake">HeartHandshake (ESG/Parcerias)</option>
                    <option value="Radio">Radio (Mídia/Rádio)</option>
                    <option value="Gift">Gift (Fidelidade/Loyalty)</option>
                    <option value="Scale">Scale (Pesagem/Balança)</option>
                    <option value="CreditCard">CreditCard (Cheques/Banco)</option>
                    <option value="Briefcase">Briefcase (Consultoria)</option>
                    <option value="Mail">Mail (Ouvidoria/Contato)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Texto do Botão</label>
                  <input
                    type="text"
                    required
                    value={editingPortal.buttonText || 'Acessar Sistema'}
                    onChange={(e) => setEditingPortal({ ...editingPortal, buttonText: e.target.value })}
                    placeholder="Ex: Acessar Demandas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">URL de Acesso</label>
                  <input
                    type="text"
                    required
                    value={editingPortal.url}
                    onChange={(e) => setEditingPortal({ ...editingPortal, url: e.target.value })}
                    placeholder="Ex: https://remoto.amp.ia.br#demandas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPortal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Salvar Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / CRIAR SERVIÇO */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-medium text-white">
                {isNewService ? '➕ Adicionar Serviço Corporativo' : '✏️ Editar Serviço Corporativo'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewService) {
                  addCorporateService(editingService);
                } else {
                  updateCorporateService(editingService.id, editingService);
                }
                setEditingService(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Título do Serviço *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Divisão</label>
                  <select
                    value={editingService.division}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      division: e.target.value,
                      divisionLabel: e.target.value === 'ti' ? 'TI Corporativa & Cloud' : 'Consultoria Financeira & Estratégica'
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="ti">TI Corporativa &amp; Cloud</option>
                    <option value="finance">Consultoria Financeira &amp; Estratégica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Categoria</label>
                  <input
                    type="text"
                    required
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descrição Curta *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descrição Completa</label>
                <textarea
                  rows={4}
                  value={editingService.fullDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
