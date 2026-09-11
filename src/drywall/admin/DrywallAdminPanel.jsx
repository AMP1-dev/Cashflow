import React, { useState } from 'react';
import { 
  Layers, 
  MessageSquare, 
  Package, 
  Store, 
  Truck, 
  Building2, 
  FileText, 
  Database, 
  LogOut, 
  ExternalLink, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Sparkles,
  Activity,
  CheckCircle2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';
import { DrywallAdminLogin } from './DrywallAdminLogin';
import { DrywallQuotesTab } from './DrywallQuotesTab';
import { DrywallProductsTab } from './DrywallProductsTab';
import { DrywallStoreTab } from './DrywallStoreTab';
import { DrywallRegionsTab } from './DrywallRegionsTab';
import { DrywallCompanyTab } from './DrywallCompanyTab';
import { DrywallNewsTab } from './DrywallNewsTab';
import { DrywallBackupTab } from './DrywallBackupTab';

export function DrywallAdminPanel() {
  const { 
    isAdmin, 
    logoutAdmin, 
    setCurrentView, 
    theme, 
    toggleTheme, 
    company, 
    quotes, 
    products, 
    storeItems, 
    regions,
    toast,
    cloudStatus,
    syncWithCloud
  } = useDrywall();

  // Active Tab: 'quotes' | 'products' | 'store' | 'regions' | 'company' | 'news' | 'backup'
  const [activeTab, setActiveTab] = useState('quotes');

  if (!isAdmin) {
    return <DrywallAdminLogin />;
  }

  const pendingQuotesCount = quotes.filter(q => q.status === 'novo').length;

  const tabs = [
    { id: 'quotes', label: 'Cotações & Leads', icon: MessageSquare, badge: pendingQuotesCount > 0 ? pendingQuotesCount : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'products', label: 'Catálogo de Produtos', icon: Package, badge: products.length, badgeColor: 'bg-slate-700 text-slate-300' },
    { id: 'store', label: 'Loja Di Brunelli', icon: Store, badge: storeItems.length, badgeColor: 'bg-slate-700 text-slate-300' },
    { id: 'regions', label: 'Regiões & Frota', icon: Truck, badge: regions.length, badgeColor: 'bg-slate-700 text-slate-300' },
    { id: 'company', label: 'Dados da Distribuidora', icon: Building2 },
    { id: 'news', label: 'Notícias & Guias ABNT', icon: FileText },
    { id: 'backup', label: 'Backup & Segurança', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col font-sans selection:bg-[#0052D9] selection:text-white">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052D9] to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  DRYWALL <span className="text-blue-400 font-bold uppercase text-xs">Distribuidora</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50">
                  Painel Administrativo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {company.brandTransition} &bull; Gestão Centralizada
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Cloud Database Status Pill */}
            {cloudStatus === 'connected' ? (
              <button
                onClick={syncWithCloud}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-semibold hover:bg-blue-900/60 transition-colors"
                title="Conectado ao Supabase PostgreSQL. Clique para sincronizar agora."
              >
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Nuvem Ativa (PostgreSQL)</span>
              </button>
            ) : cloudStatus === 'syncing' ? (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Sincronizando Nuvem...</span>
              </div>
            ) : (
              <button
                onClick={syncWithCloud}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                title="Operando em cache local. Clique para reconectar com a Nuvem."
              >
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>Modo Local / Cache</span>
              </button>
            )}

            {/* Live Uptime Pill */}
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online</span>
            </div>

            {/* Back to Public Site Button */}
            <button
              onClick={() => setCurrentView('portal')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              title="Acessar o portal público do cliente"
            >
              <span>Ver Portal do Cliente</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={logoutAdmin}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-900/50 transition-colors"
              title="Encerrar Sessão Administrativa"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top KPI Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Cotações / Leads</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white">{quotes.length}</span>
                {pendingQuotesCount > 0 && (
                  <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                    {pendingQuotesCount} nova{pendingQuotesCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Catálogo Essencial</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white">{products.length}</span>
                <span className="text-[11px] text-slate-400">itens ativos</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Loja Di Brunelli</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white">{storeItems.length}</span>
                <span className="text-[11px] text-slate-400">preços online</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Polos de Entrega</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white">{regions.length}</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Frota 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0052D9] text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge !== null && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="animate-fadeIn">
          {activeTab === 'quotes' && <DrywallQuotesTab />}
          {activeTab === 'products' && <DrywallProductsTab />}
          {activeTab === 'store' && <DrywallStoreTab />}
          {activeTab === 'regions' && <DrywallRegionsTab />}
          {activeTab === 'company' && <DrywallCompanyTab />}
          {activeTab === 'news' && <DrywallNewsTab />}
          {activeTab === 'backup' && <DrywallBackupTab />}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} {company.name} &bull; {company.brandTransition}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            <span>Rodovia Anhanguera, km 112 &bull; Interior de SP</span>
            <span className="text-slate-700">&bull;</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Painel V2.0 Conectado</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 ${
            toast.type === 'error' ? 'bg-rose-900/95 text-white border-rose-700' :
            toast.type === 'warning' ? 'bg-amber-900/95 text-white border-amber-700' :
            toast.type === 'info' ? 'bg-slate-800 text-white border-slate-700' :
            'bg-[#0052D9] text-white border-blue-500 shadow-blue-500/30'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
