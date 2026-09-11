import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Layers, 
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';

export function DrywallAdminLogin() {
  const { loginAdmin, setCurrentView, company } = useDrywall();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setTimeout(() => {
      loginAdmin(password);
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B0F19] to-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Back button */}
        <button
          onClick={() => setCurrentView('portal')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Portal Público</span>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0052D9] to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Painel Administrativo
            </h1>
            <p className="text-xs text-blue-400 font-semibold tracking-wide uppercase mt-0.5">
              {company.name} &bull; {company.brandTransition}
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Acesso restrito para gestão de cotações, catálogo de produtos, regiões de entrega e configurações.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Senha de Administrador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha administrativa..."
                className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052D9] focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 px-4 bg-[#0052D9] hover:bg-blue-600 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Hint Card */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-start gap-3 text-xs">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Acesso Padrão de Demonstração:</p>
              <p className="text-slate-400 mt-0.5">
                Senha inicial: <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300 font-mono font-bold border border-slate-700">drywall2026</code>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                (A senha pode ser alterada a qualquer momento na aba Backup & Segurança).
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
