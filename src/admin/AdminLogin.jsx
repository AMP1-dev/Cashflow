import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Building2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export function AdminLogin() {
  const { login, setCurrentView } = useApp();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(password);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-terracotta-600 to-terracotta-800 flex items-center justify-center text-white mx-auto shadow-2xl shadow-terracotta-600/40 mb-4 border border-white/20">
          <Building2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Aliança Empresarial
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Acesso Restrito à Gestão de Conteúdo & Leads
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Senha Administrativa
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Digite a senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-extrabold text-sm shadow-xl shadow-terracotta-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Validando...' : 'Acessar Painel da Diretoria'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← Voltar ao site público
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
