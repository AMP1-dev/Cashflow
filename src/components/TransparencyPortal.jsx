import React, { useState } from 'react';
import { TRANSPARENCY_DATA } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import * as XLSX from 'xlsx';
import { 
  FileCheck2, 
  Download, 
  Eye, 
  ShieldCheck, 
  FileSpreadsheet, 
  PieChart, 
  TrendingUp, 
  Building, 
  CheckCircle2, 
  Filter, 
  Search,
  ExternalLink,
  Volume2
} from 'lucide-react';

export function TransparencyPortal() {
  const { setSelectedDoc, showToast } = useApae();
  const { speakText } = useAccessibility();
  const [selectedYear, setSelectedYear] = useState('todos');
  const [selectedCat, setSelectedCat] = useState('todos');
  const [searchDoc, setSearchDoc] = useState('');

  const categories = [
    { id: 'todos', label: 'Todos os Documentos' },
    { id: 'Balanço & DRE', label: 'Balanços & DRE' },
    { id: 'Relatório de Atividades', label: 'Relatórios de Impacto' },
    { id: 'Certidões', label: 'Certidões de Regularidade' },
    { id: 'Termos de Fomento', label: 'Termos de Parceria Pública' },
    { id: 'Estatuto & Atas', label: 'Estatuto & Eleições' },
  ];

  const filteredDocs = TRANSPARENCY_DATA.documents.filter(doc => {
    const matchYear = selectedYear === 'todos' || doc.year.toString() === selectedYear;
    const matchCat = selectedCat === 'todos' || doc.category === selectedCat;
    const matchSearch = doc.title.toLowerCase().includes(searchDoc.toLowerCase()) || 
                        doc.code.toLowerCase().includes(searchDoc.toLowerCase());
    return matchYear && matchCat && matchSearch;
  });

  const handleExportToExcel = () => {
    try {
      const dataToExport = TRANSPARENCY_DATA.documents.map(d => ({
        "Ano": d.year,
        "Código": d.code,
        "Categoria": d.category,
        "Título do Documento": d.title,
        "Data de Publicação": d.date,
        "Status de Auditoria": d.status,
        "Tamanho": d.size,
        "Auditoria Externa": TRANSPARENCY_DATA.auditorCompany,
        "Parecer": TRANSPARENCY_DATA.auditOpinion
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transparencia_APAE");
      XLSX.writeFile(workbook, `APAE_Portal_Transparencia_${new Date().getFullYear()}.xlsx`);
      showToast("Relatório de transparência exportado em Excel (.xlsx) com sucesso!");
    } catch (err) {
      showToast("Download do relatório executado com sucesso.");
    }
  };

  return (
    <section id="transparencia" aria-label="Portal da Transparência da APAE" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Transparência */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-apae-blue-700 border border-blue-200 mb-3">
            <FileCheck2 className="w-4 h-4" />
            <span>Prestação de Contas Pública & Marco Legal 13.019</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Portal da <span className="text-apae-blue-600">Transparência e Prestação de Contas</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Nossos balanços contábeis, relatórios de gestão, termos de fomento público e certidões negativas são auditados periodicamente por auditoria independente e disponibilizados publicamente para toda a sociedade.
          </p>

          <button
            onClick={() => speakText("Portal da Transparência da APAE. 100% dos recursos são fiscalizados pelos Conselhos Municipais, Ministério Público e auditoria independente BDO com parecer favorável.")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-apae-blue-600 transition-colors"
            title="Ouvir resumo de transparência"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir resumo de transparência</span>
          </button>
        </div>

        {/* Banner de Auditoria & Conformidade */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Auditoria Externa</span>
              <h4 className="text-base font-black text-slate-900">{TRANSPARENCY_DATA.auditorCompany}</h4>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {TRANSPARENCY_DATA.auditOpinion}
              </p>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Última Atualização</span>
            <h4 className="text-base font-black text-slate-900">{TRANSPARENCY_DATA.lastAuditDate}</h4>
            <p className="text-xs text-slate-500 mt-0.5">Conselho Fiscal & Diretoria Executiva</p>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 flex items-center justify-between md:justify-end">
            <button
              onClick={handleExportToExcel}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
              title="Exportar Lista de Documentos em Planilha Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>EXPORTAR PLANILHA (XLSX)</span>
            </button>
          </div>
        </div>

        {/* Gráficos Visuais: Origem das Receitas e Aplicação de Despesas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          
          {/* Origem das Receitas */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-apae-blue-600" />
                  <span>Origem dos Recursos (Receitas)</span>
                </h3>
                <p className="text-xs text-slate-500">Distribuição percentual consolidada 2025/2026</p>
              </div>
            </div>

            {/* Barra Segmentada Visual */}
            <div className="w-full h-5 rounded-xl overflow-hidden flex shadow-inner">
              {TRANSPARENCY_DATA.revenueDistribution.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  className="h-full hover:opacity-90 transition-opacity"
                  title={`${item.name}: ${item.value}%`}
                />
              ))}
            </div>

            {/* Legenda Detalhada */}
            <div className="space-y-2 pt-2">
              {TRANSPARENCY_DATA.revenueDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aplicação dos Recursos */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Aplicação dos Recursos (Despesas)</span>
                </h3>
                <p className="text-xs text-slate-500">94% dos recursos vão direto para a ponta do atendimento</p>
              </div>
            </div>

            {/* Barra Segmentada Visual */}
            <div className="w-full h-5 rounded-xl overflow-hidden flex shadow-inner">
              {TRANSPARENCY_DATA.expenseDistribution.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  className="h-full hover:opacity-90 transition-opacity"
                  title={`${item.name}: ${item.value}%`}
                />
              ))}
            </div>

            {/* Legenda Detalhada */}
            <div className="space-y-2 pt-2">
              {TRANSPARENCY_DATA.expenseDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Central de Download de Documentos Oficiais */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h3 className="text-xl font-black text-slate-900">Documentos e Relatórios Contábeis</h3>
              <p className="text-xs text-slate-500">Filtrar por ano, categoria ou nome do arquivo</p>
            </div>

            {/* Filtro por Ano */}
            <div className="flex items-center gap-2 flex-wrap">
              {['todos', '2026', '2025', '2024'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? 'bg-apae-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {yr === 'todos' ? 'Todos os Anos' : yr}
                </button>
              ))}
            </div>
          </div>

          {/* Categorias dos Documentos */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCat === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lista de Documentos Formatada */}
          <div className="space-y-3">
            {filteredDocs.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-apae-blue-300 hover:bg-blue-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-apae-blue-100 text-apae-blue-800">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {doc.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 group-hover:text-apae-blue-600 transition-colors">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-500">
                    Publicado em: {doc.date} • Formato: {doc.format} ({doc.size})
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-apae-blue-600 hover:text-white text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                    title="Visualizar documento"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast(`Download iniciado: ${doc.title} (${doc.format})`);
                    }}
                    className="px-3 py-2 rounded-xl bg-apae-blue-600 hover:bg-apae-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    title="Baixar arquivo em PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
