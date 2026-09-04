import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { Database, Download, Upload, RefreshCw, AlertTriangle, Check, Shield, Server } from 'lucide-react';

export function BackupManager() {
  const { importBackupData, resetAllData, showToast } = useApp();
  const [importJson, setImportJson] = useState('');
  const [importFile, setImportFile] = useState(null);

  const handleExport = () => {
    const dataStr = storageService.exportFullBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alianca_empresarial_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!');
  };

  const handleImportText = (e) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    if (importBackupData(importJson)) {
      setImportJson('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      importBackupData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-black text-white">Backup, Segurança & Servidor</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Exporte e restaure todos os dados do portal, artigos, serviços, depoimentos e leads em formato JSON.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Exportar Backup Completo</h3>
              <p className="text-xs text-slate-400">Baixe um arquivo JSON com 100% dos dados.</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Gera uma cópia de segurança de todos os serviços, artigos, configurações da empresa, contatos e leads recebidos.
          </p>

          <button
            onClick={handleExport}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo de Backup (.JSON)</span>
          </button>
        </div>

        {/* Import File Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Restaurar via Arquivo JSON</h3>
              <p className="text-xs text-slate-400">Carregue um arquivo previamente exportado.</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Selecione o arquivo .json do seu computador para recuperar todas as informações instantaneamente.
          </p>

          <label className="cursor-pointer w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Selecionar Arquivo de Backup (.JSON)</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

      </div>

      {/* Paste JSON */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white">Restaurar Colando Código JSON</h3>
        <form onSubmit={handleImportText} className="space-y-3">
          <textarea
            rows="4"
            placeholder="Cole o código JSON do backup aqui..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!importJson.trim()}
              className="px-6 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white text-xs font-bold transition-all"
            >
              Restaurar Dados Colados
            </button>
          </div>
        </form>
      </div>

      {/* Reset to Factory Defaults */}
      <div className="bg-slate-900 border border-rose-500/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-500" />
          <div>
            <h3 className="text-sm font-bold text-white">Restaurar Padrões da Aliança Empresarial</h3>
            <p className="text-xs text-slate-400">Limpa alterações locais e recarrega os dados padrão institucionais.</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Atenção: todos os dados cadastrados serão resetados para o padrão original da Aliança. Deseja continuar?')) {
              resetAllData();
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
        >
          Resetar para Valores de Fábrica
        </button>
      </div>

    </div>
  );
}
