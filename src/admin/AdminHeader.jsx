import React from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Newspaper, Star, MessageSquare, Settings, Database, ExternalLink, LogOut, Shield, Lock } from 'lucide-react';

export function AdminHeader({ activeTab, setActiveTab }) {
  const { logout, setCurrentView, leads } = useApp();

  const unreadLeads = leads.filter(l => !l.read).length;

  const tabs = [
    { id: 'services', label: 'Serviços & Soluções', icon: Briefcase },
    { id: 'posts', label: 'Artigos & Notícias', icon: Newspaper },
    { id: 'testimonials', label: 'Depoimentos & Cases', icon: Star },
    { id: 'leads', label: 'Propostas & Leads', icon: MessageSquare, badge: unreadLeads },
    { id: 'config', label: 'Identidade & Contatos', icon: Settings },
    { id: 'backup', label: 'Backup & Servidor', icon: Database },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terracotta-600 to-terracotta-800 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                Painel Administrativo
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Aliança Conectada
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Aliança Empresarial • Gestão de Conteúdo</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 relative ${
                  isActive
                    ? 'bg-terracotta-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-terracotta-700' : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
