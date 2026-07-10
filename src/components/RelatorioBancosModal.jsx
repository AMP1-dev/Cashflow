import React, { useMemo } from 'react';
import { X, Printer } from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function RelatorioBancosModal({ lancamentosMes, mesLabel, ano, onClose }) {
  const relatorio = useMemo(() => {
    // Agrupa por banco
    const porBanco = {};
    
    lancamentosMes.forEach(l => {
      const bancoStr = l.banco || 'Sem banco informado';
      const contaStr = l.meioPagamento || l.formaRecebimento || 'Sem meio inf.';
      
      if (!porBanco[bancoStr]) porBanco[bancoStr] = {};
      if (!porBanco[bancoStr][contaStr]) porBanco[bancoStr][contaStr] = [];
      
      porBanco[bancoStr][contaStr].push(l);
    });

    return Object.entries(porBanco).sort((a, b) => a[0].localeCompare(b[0])).map(([banco, contas]) => ({
      banco,
      contas: Object.entries(contas).sort((a, b) => a[0].localeCompare(b[0])).map(([conta, lancs]) => ({
        conta,
        lancamentos: lancs.sort((a, b) => a.dia - b.dia)
      }))
    }));
  }, [lancamentosMes]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#FAF8F3', borderRadius: 16, width: '100%', maxWidth: 800, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        <div className="no-print" style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #EFEBE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#1C2421' }}>Relatório de Conferência de Caixas/Bancos</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1F5C52', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
              <Printer size={16} /> Imprimir / PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C9A8F' }}><X size={24} /></button>
          </div>
        </div>

        <div id="print-area" style={{ padding: 32, overflowY: 'auto', flex: 1, backgroundColor: '#fff' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #1C2421', paddingBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontFamily: 'Georgia, serif', color: '#1C2421' }}>Relatório Analítico de Bancos e Contas</h1>
            <h2 style={{ margin: '8px 0 0 0', fontSize: 16, color: '#5C5A4F', fontWeight: 500 }}>Período: {mesLabel} de {ano}</h2>
          </div>

          {relatorio.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9C9A8F', padding: 40 }}>Nenhum lançamento no período selecionado.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {relatorio.map(({ banco, contas }) => (
                <div key={banco} style={{ border: '1px solid #E5E0D5', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ background: '#0F2B27', color: '#fff', padding: '10px 16px', fontWeight: 600, fontSize: 15 }}>
                    Banco: {banco}
                  </div>
                  
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {contas.map(({ conta, lancamentos }) => {
                      const totalReceitas = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
                      const totalDespesas = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
                      const saldo = totalReceitas - totalDespesas;
                      
                      return (
                        <div key={conta}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1F5C52', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, background: '#1F5C52', borderRadius: '50%' }} />
                            Conta / Meio: {conta}
                          </div>
                          
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                              <tr style={{ background: '#F5F2E8', color: '#5C5A4F', borderBottom: '1px solid #EFEBE0' }}>
                                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Dia</th>
                                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Descrição</th>
                                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Tipo</th>
                                <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600 }}>Valor (R$)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lancamentos.map(l => (
                                <tr key={l.id} style={{ borderBottom: '1px solid #F0EDE3' }}>
                                  <td style={{ padding: '8px 12px', color: '#5C5A4F' }}>{String(l.dia).padStart(2, '0')}</td>
                                  <td style={{ padding: '8px 12px', color: '#1C2421', fontWeight: 500 }}>{l.descricao}</td>
                                  <td style={{ padding: '8px 12px', color: l.tipo === 'receita' ? '#1F5C52' : '#B05A2E' }}>
                                    {l.tipo === 'receita' ? 'Entrada' : 'Saída'}
                                  </td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: l.tipo === 'receita' ? '#1F5C52' : '#B05A2E' }}>
                                    {l.tipo === 'receita' ? '+' : '-'}{formatBRL(l.valor)}
                                  </td>
                                </tr>
                              ))}
                              <tr style={{ background: '#FBFAF6', fontWeight: 700 }}>
                                <td colSpan={3} style={{ padding: '10px 12px', textAlign: 'right', color: '#5C5A4F' }}>Saldo Líquido ({conta}):</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', color: saldo >= 0 ? '#1F5C52' : '#B05A2E' }}>{formatBRL(saldo)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
