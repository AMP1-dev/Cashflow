import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Eye, 
  EyeOff,
  Database,
  Lock
} from 'lucide-react';
import { useDrywall } from '../context/DrywallContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

export function DrywallBackupTab() {
  const { 
    exportBackup, 
    importBackup, 
    resetToDefaults, 
    changeAdminPassword, 
    showToast,
    syncWithCloud 
  } = useDrywall();

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [importing, setImporting] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPass) {
      showToast('Digite a nova senha.', 'warning');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('As senhas digitadas não coincidem.', 'error');
      return;
    }
    const success = changeAdminPassword(newPass);
    if (success) {
      setNewPass('');
      setConfirmPass('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        importBackup(content);
      } catch (err) {
        showToast('Erro ao ler arquivo de backup.', 'error');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Informative Header */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Database className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Segurança, Nuvem PostgreSQL & Backup Completo
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminamos as limitações de armazenamento local através da integração nativa com <strong>Supabase Cloud PostgreSQL</strong>. Seus dados de cotações, produtos e clientes são sincronizados em nuvem entre múltiplos computadores e celulares em tempo real.
          </p>
        </div>
      </div>

      {/* Cloud Database Integration Status Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Banco de Dados em Nuvem (PostgreSQL / Supabase)
            </h4>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
            {isSupabaseConfigured() ? 'Conector Ativo' : 'Não Configurado'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Para que o painel sincronize todas as cotações e produtos diretamente no banco PostgreSQL na nuvem (sem depender de armazenamento local de nenhum navegador), o script SQL já está pronto em:
        </p>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>database/drywall_complete_schema.sql</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Execute no SQL Editor do seu painel Supabase
          </span>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={syncWithCloud}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Testar & Sincronizar Agora com Supabase</span>
          </button>
        </div>
      </div>

      {/* Grid: Backup / Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Exportar Backup JSON</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gera e baixa um arquivo estruturado <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">.json</code> contendo todo o estado atual da plataforma.
            </p>
          </div>

          <button
            onClick={exportBackup}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo de Backup</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Importar / Restaurar Backup</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Carregue um arquivo <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">.json</code> previamente exportado para sobrescrever e restaurar os dados.
            </p>
          </div>

          <div>
            <label className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{importing ? 'Processando Arquivo...' : 'Selecionar Arquivo JSON'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>
        </div>

      </div>

      {/* Security & Password Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#0052D9]/20 text-blue-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Alterar Senha de Acesso Administrativo
            </h4>
            <p className="text-xs text-slate-400">Protege a área de gestão contra acessos não autorizados</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nova Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Mínimo 4 caracteres..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirmar Nova Senha</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repita a nova senha..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#0052D9] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0052D9] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Atualizar Senha Administrativa</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Restaurar Dados de Fábrica</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Esta ação apaga quaisquer alterações personalizadas e recarrega os dados padrão oficiais da Drywall Distribuidora / Di Brunelli (produtos essenciais, notícias ABNT e contatos padrão).
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restaurar Padrões</span>
        </button>
      </div>

    </div>
  );
}
