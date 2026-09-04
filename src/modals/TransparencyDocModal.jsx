import React from 'react';
import { useApae } from '../context/ApaeContext';
import { TRANSPARENCY_DATA } from '../data/apaeData';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  FileSpreadsheet 
} from 'lucide-react';

export function TransparencyDocModal() {
  const { selectedDoc, setSelectedDoc, showToast } = useApae();

  if (!selectedDoc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                  {selectedDoc.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{selectedDoc.code}</span>
              </div>
              <h3 className="text-base font-black text-white mt-1">{selectedDoc.title}</h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedDoc(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações e Visualização Simulada do PDF */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Metadados Auditados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Ano Base</span>
              <strong className="text-slate-900">{selectedDoc.year}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Publicação</span>
              <strong className="text-slate-900">{selectedDoc.date}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Tamanho</span>
              <strong className="text-slate-900">{selectedDoc.size}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Auditoria</span>
              <strong className="text-emerald-600 font-black">{selectedDoc.status}</strong>
            </div>
          </div>

          {/* Visualizador de Folha / Documento Oficial Simulado */}
          <div className="bg-slate-100 rounded-2xl p-6 border-2 border-dashed border-slate-300 text-slate-700 font-mono text-xs space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-300 pb-3">
              <div className="font-sans font-black text-sm text-slate-900">
                ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">
                DOCUMENTO OFICIAL REGISTRADO
              </span>
            </div>

            <p className="leading-relaxed font-sans text-xs text-slate-600">
              Certificamos que as demonstrações contábeis e relatórios de atividades da APAE referentes ao exercício de {selectedDoc.year} foram elaborados em conformidade com as normas brasileiras de contabilidade (NBC TG 1000) e a legislação do Terceiro Setor (Lei 13.019/2014).
            </p>

            <div className="bg-white p-4 rounded-xl border border-slate-200 font-sans text-xs space-y-1">
              <div className="font-bold text-slate-900">Auditoria Independente: {TRANSPARENCY_DATA.auditorCompany}</div>
              <div className="text-emerald-700 font-bold">Parecer Técnico: {TRANSPARENCY_DATA.auditOpinion}</div>
              <div className="text-[11px] text-slate-500">Hash de Verificação Digital: 8f4e91a0b38c291845f0194828da</div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                showToast(`Download concluído: ${selectedDoc.title}`);
                setSelectedDoc(null);
              }}
              className="px-6 py-3 rounded-2xl bg-apae-blue-600 hover:bg-apae-blue-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR ARQUIVO PDF COMPLETO</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
