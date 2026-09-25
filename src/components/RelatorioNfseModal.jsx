import React, { useState, useMemo } from 'react';
import { 
  X, Download, FileSpreadsheet, Printer, Search, Calendar, FileText, CheckCircle, Copy, Check 
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { exportarRelatorioNfseExcel, exportarRelatorioNfseCSV } from '../utils/nfseService';

export function RelatorioNfseModal({ notas = [], empresa, onClose }) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [busca, setBusca] = useState('');
  const [copiadoId, setCopiadoId] = useState(null);

  // Filtros aplicados
  const notasFiltradas = useMemo(() => {
    return notas.filter(n => {
      // Filtro de texto
      if (busca) {
        const termo = busca.toLowerCase();
        const num = String(n.numero || '').toLowerCase();
        const tomador = (n.tomador?.razaoSocial || '').toLowerCase();
        const doc = (n.tomador?.cpfCnpj || '').replace(/\D/g, '');
        const chave = (n.chaveAcesso || '').toLowerCase();
        const servico = (n.servico?.discriminacao || '').toLowerCase();

        const bateu = num.includes(termo) || 
                      tomador.includes(termo) || 
                      doc.includes(termo.replace(/\D/g, '')) || 
                      chave.includes(termo) ||
                      servico.includes(termo);
        if (!bateu) return false;
      }

      // Filtro de data
      if (n.dataEmissao) {
        const dataStr = n.dataEmissao.split('T')[0];
        if (dataInicio && dataStr < dataInicio) return false;
        if (dataFim && dataStr > dataFim) return false;
      }

      return true;
    });
  }, [notas, busca, dataInicio, dataFim]);

  // Sumarização Final
  const totais = useMemo(() => {
    let valorTotal = 0;
    let issTotal = 0;
    let ibsTotal = 0;
    let cbsTotal = 0;
    let liquidoTotal = 0;

    notasFiltradas.forEach(n => {
      const v = Number(n.servico?.valorTotal || 0);
      const vIss = Number(n.servico?.valorIss || 0);
      const alIbs = Number(n.servico?.aliquotaIbs || 0.10);
      const vIbs = Number(n.servico?.valorIbs || Math.round((v * (alIbs / 100)) * 100) / 100);
      const alCbs = Number(n.servico?.aliquotaCbs || 0.90);
      const vCbs = Number(n.servico?.valorCbs || Math.round((v * (alCbs / 100)) * 100) / 100);
      const vLiq = Number(n.servico?.valorLiquido || v);

      valorTotal += v;
      issTotal += vIss;
      ibsTotal += vIbs;
      cbsTotal += vCbs;
      liquidoTotal += vLiq;
    });

    return {
      quantidade: notasFiltradas.length,
      valorTotal,
      issTotal,
      ibsTotal,
      cbsTotal,
      totalImpostos: issTotal + ibsTotal + cbsTotal,
      liquidoTotal
    };
  }, [notasFiltradas]);

  function handleCopiarChave(chave, id) {
    if (!chave) return;
    navigator.clipboard.writeText(chave);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  }

  function handleImprimir() {
    window.print();
  }

  function setAtalhoPeriodo(tipo) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    if (tipo === 'mes') {
      const primeiro = new Date(ano, mes, 1).toISOString().split('T')[0];
      const ultimo = new Date(ano, mes + 1, 0).toISOString().split('T')[0];
      setDataInicio(primeiro);
      setDataFim(ultimo);
    } else if (tipo === '30dias') {
      const data30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dataHoje = hoje.toISOString().split('T')[0];
      setDataInicio(data30);
      setDataFim(dataHoje);
    } else if (tipo === 'ano') {
      setDataInicio(`${ano}-01-01`);
      setDataFim(`${ano}-12-31`);
    } else if (tipo === 'todos') {
      setDataInicio('');
      setDataFim('');
      setBusca('');
    }
  }

  const nomeEmpresa = empresa?.razao_social || empresa?.nome_fantasia || 'AMP Flow';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 43, 39, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '12px'
    }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #relatorio-nfse-print-area, #relatorio-nfse-print-area * {
            visibility: visible !important;
          }
          #relatorio-nfse-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
          .relatorio-no-print {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 8mm;
          }
        }
      `}</style>

      <div style={{
        background: '#FAF8F3',
        borderRadius: 16,
        width: '100%',
        maxWidth: 1100,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid #D8D4C8',
        overflow: 'hidden'
      }}>
        {/* Cabeçalho do Modal */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2B27 0%, #173E38 100%)',
          color: '#FAF8F3',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileSpreadsheet size={20} color="#9FE0C8" />
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, fontFamily: 'Georgia, serif' }}>
                Relatório Fiscal de NFS-e • {nomeEmpresa}
              </h2>
            </div>
            <div style={{ fontSize: 11.5, color: '#9FBDB5', marginTop: 3 }}>
              Demonstrativo completo de notas emitidas, tributação (ISS, IBS, CBS) e chaves oficiais de acesso
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => exportarRelatorioNfseExcel(notasFiltradas, nomeEmpresa)}
              style={{
                background: '#10B981',
                border: 'none',
                color: '#fff',
                borderRadius: 8,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Download size={14} /> Excel (.xlsx)
            </button>

            <button
              onClick={() => exportarRelatorioNfseCSV(notasFiltradas, nomeEmpresa)}
              style={{
                background: '#1F5C52',
                border: 'none',
                color: '#fff',
                borderRadius: 8,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <FileText size={14} /> CSV
            </button>

            <button
              onClick={handleImprimir}
              style={{
                background: '#374151',
                border: 'none',
                color: '#fff',
                borderRadius: 8,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Printer size={14} /> Imprimir
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Período */}
        <div className="relatorio-no-print" style={{
          background: '#FFFFFF',
          padding: '12px 20px',
          borderBottom: '1px solid #E5E0D5',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Campo de Busca */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
            <Search size={15} color="#9C9A8F" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar cliente, número, serviço ou chave..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 12.5,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Faixa de Datas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4B5563' }}>Período:</span>
            <input
              type="date"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
            />
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>até</span>
            <input
              type="date"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
            />
          </div>

          {/* Atalhos Rápidos */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setAtalhoPeriodo('mes')}
              style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '5px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#1E293B' }}
            >
              Este Mês
            </button>
            <button
              onClick={() => setAtalhoPeriodo('30dias')}
              style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '5px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#1E293B' }}
            >
              30 Dias
            </button>
            <button
              onClick={() => setAtalhoPeriodo('ano')}
              style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '5px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#1E293B' }}
            >
              Este Ano
            </button>
            <button
              onClick={() => setAtalhoPeriodo('todos')}
              style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '5px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#92400E' }}
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Área da Tabela do Relatório */}
        <div id="relatorio-nfse-print-area" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {notasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#6B7280' }}>
              <FileText size={36} color="#9CA3AF" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>Nenhuma nota fiscal encontrada</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Tente ajustar a faixa de datas ou os termos de busca acima.</div>
            </div>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
              textAlign: 'left',
              background: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              borderRadius: 8,
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: '#0F2B27', color: '#FAF8F3' }}>
                  <th style={{ padding: '10px 8px', fontWeight: 700, width: 85 }}>Emissão</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, width: 75 }}>Nº Nota</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700 }}>Tomador (Cliente)</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, textAlign: 'right', width: 95 }}>Valor (R$)</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700 }}>Serviço / Atividade</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, textAlign: 'center', width: 70 }}>Cód.</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, textAlign: 'right', width: 75 }}>IBS (R$)</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, textAlign: 'right', width: 75 }}>CBS (R$)</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, textAlign: 'center', width: 75 }}>Al. Total</th>
                  <th style={{ padding: '10px 8px', fontWeight: 700, width: 140 }}>Chave de Acesso</th>
                </tr>
              </thead>
              <tbody>
                {notasFiltradas.map((n, idx) => {
                  const v = Number(n.servico?.valorTotal || 0);
                  const alIss = Number(n.servico?.aliquotaIss || 0);
                  const alIbs = Number(n.servico?.aliquotaIbs || 0.10);
                  const vIbs = Number(n.servico?.valorIbs || Math.round((v * (alIbs / 100)) * 100) / 100);
                  const alCbs = Number(n.servico?.aliquotaCbs || 0.90);
                  const vCbs = Number(n.servico?.valorCbs || Math.round((v * (alCbs / 100)) * 100) / 100);
                  const alTotal = alIss + alIbs + alCbs;

                  const dataStr = n.dataEmissao 
                    ? new Date(n.dataEmissao).toLocaleDateString('pt-BR') 
                    : '—';

                  const chave = n.chaveAcesso || '';
                  const chaveResumida = chave ? `${chave.slice(0, 10)}...${chave.slice(-6)}` : '—';

                  return (
                    <tr 
                      key={n.id || idx} 
                      style={{ 
                        borderBottom: '1px solid #E5E7EB',
                        background: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                      }}
                    >
                      <td style={{ padding: '9px 8px', color: '#4B5563', whiteSpace: 'nowrap' }}>
                        {dataStr}
                      </td>
                      <td style={{ padding: '9px 8px', fontWeight: 700, color: '#1F5C52', whiteSpace: 'nowrap' }}>
                        Nº {n.numero}
                      </td>
                      <td style={{ padding: '9px 8px', fontWeight: 600, color: '#111827' }}>
                        {n.tomador?.razaoSocial || 'Cliente'}
                        {n.tomador?.cpfCnpj && (
                          <span style={{ display: 'block', fontSize: 10.5, color: '#6B7280', fontWeight: 400 }}>
                            {n.tomador.cpfCnpj}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', fontWeight: 700, color: '#0F2B27', whiteSpace: 'nowrap' }}>
                        {formatBRL(v)}
                      </td>
                      <td style={{ padding: '9px 8px', color: '#374151', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={n.servico?.discriminacao}>
                        {n.servico?.discriminacao || 'Prestação de serviços'}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'center', color: '#6B7280', fontSize: 11 }}>
                        {n.servico?.codigoAtividade || '01.07'}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', color: '#4B5563' }}>
                        {formatBRL(vIbs)}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', color: '#4B5563' }}>
                        {formatBRL(vCbs)}
                      </td>
                      <td style={{ padding: '9px 8px', textAlign: 'center', fontWeight: 600, color: '#1F5C52' }}>
                        {alTotal.toFixed(2)}%
                      </td>
                      <td style={{ padding: '9px 8px', fontSize: 10.5, fontFamily: 'monospace', color: '#4B5563' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span title={chave}>{chaveResumida}</span>
                          {chave && (
                            <button
                              onClick={() => handleCopiarChave(chave, n.id || idx)}
                              title="Copiar chave de acesso completa"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: copiadoId === (n.id || idx) ? '#10B981' : '#9CA3AF',
                                cursor: 'pointer',
                                padding: 2
                              }}
                            >
                              {copiadoId === (n.id || idx) ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* ─── LINHA DE SUMARIZAÇÃO / TOTAIS NO FINAL ─── */}
              <tfoot>
                <tr style={{ background: '#F0FDF4', borderTop: '2px solid #1F5C52', fontWeight: 800, color: '#0F2B27' }}>
                  <td colSpan={2} style={{ padding: '12px 8px' }}>
                    TOTAL: {totais.quantidade} nota(s)
                  </td>
                  <td style={{ padding: '12px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    SUMÁRIO DO PERÍODO
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: 13.5, color: '#0F2B27' }}>
                    {formatBRL(totais.valorTotal)}
                  </td>
                  <td colSpan={2} style={{ padding: '12px 8px', fontSize: 11, color: '#4B5563' }}>
                    Total ISS: {formatBRL(totais.issTotal)}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: '#1F5C52' }}>
                    {formatBRL(totais.ibsTotal)}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: '#1F5C52' }}>
                    {formatBRL(totais.cbsTotal)}
                  </td>
                  <td colSpan={2} style={{ padding: '12px 8px', fontSize: 11, color: '#1F5C52' }}>
                    Total Tributos: {formatBRL(totais.totalImpostos)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="relatorio-no-print" style={{
          background: '#FFFFFF',
          padding: '12px 20px',
          borderTop: '1px solid #E5E0D5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: 12, color: '#6B7280' }}>
            Exibindo <strong>{notasFiltradas.length}</strong> de <strong>{notas.length}</strong> notas registradas na base.
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
