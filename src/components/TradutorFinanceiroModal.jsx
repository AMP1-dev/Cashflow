import React, { useState } from 'react';
import { 
  Sparkles, MessageCircle, Copy, Check, TrendingUp, TrendingDown, 
  Target, AlertTriangle, CheckCircle2, Package, ArrowRight, X, Calendar 
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { MESES } from '../utils/constants';
import { 
  apurarMetricasMes, 
  gerarDiagnosticoMensal, 
  gerarComparativoBimestral 
} from '../utils/tradutorFinanceiroService';

export function TradutorFinanceiroModal({
  lancamentosAno,
  mesAtual,
  anoAtual,
  pctCmvConfig = 0,
  empresa,
  onClose
}) {
  const [modoAba, setModoAba] = useState('mes'); // 'mes' | 'comparativo' | 'preview_zap'
  const [copiado, setCopiado] = useState(false);

  const empresaNome = empresa?.razao_social || empresa?.nome_fantasia || empresa?.fantasia || 'Nossa Empresa';

  // 1. Apuração Mês Atual
  const metricasAtual = apurarMetricasMes(lancamentosAno, mesAtual, anoAtual, pctCmvConfig);
  const diagAtual = gerarDiagnosticoMensal(metricasAtual, empresaNome);

  // 2. Apuração Mês Anterior
  const mesAnteriorIdx = mesAtual > 0 ? mesAtual - 1 : 11;
  const anoAnterior = mesAtual > 0 ? anoAtual : anoAtual - 1;
  const metricasAnterior = apurarMetricasMes(lancamentosAno, mesAnteriorIdx, anoAnterior, pctCmvConfig);
  const diagComparativo = gerarComparativoBimestral(metricasAtual, metricasAnterior, empresaNome);

  // Texto atual a ser copiado conforme a aba
  const textoParaCopiar = modoAba === 'comparativo' 
    ? (diagComparativo.textoWhatsApp || diagAtual.textoWhatsApp) 
    : diagAtual.textoWhatsApp;

  function handleCopiar() {
    navigator.clipboard.writeText(textoParaCopiar);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  function handleAbrirWhatsApp() {
    const link = `https://wa.me/?text=${encodeURIComponent(textoParaCopiar)}`;
    window.open(link, '_blank');
  }

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
      padding: 12
    }}>
      <div style={{
        background: '#FAF8F3',
        borderRadius: 16,
        width: '100%',
        maxWidth: 680,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid #D1CFC7'
      }}>
        
        {/* Topo / Cabeçalho Nobre */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2B27 0%, #1A4740 100%)',
          padding: '14px 18px',
          color: '#FAF8F3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              padding: 8,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>
                Tradutor Financeiro & WhatsApp
              </div>
              <div style={{ fontSize: 11, color: '#9FE0C8' }}>
                Diagnóstico executivo de {MESES[mesAtual]} em linguagem humana
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              color: '#D9EBE6',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Abas Superiores de Alternância */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '10px 16px 4px',
          background: '#F0EDE3',
          borderBottom: '1px solid #E5E0D5'
        }}>
          <button
            onClick={() => setModoAba('mes')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              border: 'none',
              background: modoAba === 'mes' ? '#0F2B27' : 'transparent',
              color: modoAba === 'mes' ? '#FAF8F3' : '#5C5A4F',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            📌 Diagnóstico {MESES[mesAtual]}
          </button>

          <button
            onClick={() => setModoAba('comparativo')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              border: 'none',
              background: modoAba === 'comparativo' ? '#0F2B27' : 'transparent',
              color: modoAba === 'comparativo' ? '#FAF8F3' : '#5C5A4F',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            ⚖️ Comparar com {MESES[mesAnteriorIdx]}
          </button>

          <button
            onClick={() => setModoAba('preview_zap')}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: modoAba === 'preview_zap' ? '#0F2B27' : 'transparent',
              color: modoAba === 'preview_zap' ? '#FAF8F3' : '#5C5A4F',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <MessageCircle size={13} />
            Texto WhatsApp
          </button>
        </div>

        {/* Corpo do Diagnóstico com Rolagem Suave */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>

          {/* ─── ABA 1: DIAGNÓSTICO DO MÊS ─── */}
          {modoAba === 'mes' && (
            <>
              {/* Card 1: Ponto de Equilíbrio */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #E5E0D5',
                padding: '14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#1C2421' }}>
                    <Target size={16} color="#1F5C52" />
                    Ponto de Equilíbrio Operacional
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: diagAtual.atingiuPE ? '#DDF0EA' : '#FEE2E2',
                    color: diagAtual.atingiuPE ? '#15803D' : '#DC2626'
                  }}>
                    {diagAtual.atingiuPE ? `✓ ${metricasAtual.pctAtingidoPE.toFixed(0)}% Atingido` : `⚠️ ${metricasAtual.pctAtingidoPE.toFixed(0)}%`}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: '#F8F7F2', padding: '8px 10px', borderRadius: 8 }}>
                    <div style={{ fontSize: 10.5, color: '#7A7868' }}>Meta Mínima (Cobrir Custos):</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2421' }}>{formatBRL(metricasAtual.pontoEquilibrio)}</div>
                  </div>
                  <div style={{ background: '#F8F7F2', padding: '8px 10px', borderRadius: 8 }}>
                    <div style={{ fontSize: 10.5, color: '#7A7868' }}>Faturamento Realizado:</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1F5C52' }}>{formatBRL(metricasAtual.faturamento)}</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: '#4A483E', lineHeight: 1.5 }}>
                  {diagAtual.atingiuPE ? (
                    <>
                      🎉 <strong>Zona de Lucro Real!</strong> A empresa pagou todas as contas fixas ({formatBRL(metricasAtual.fixas)}) e gerou <strong>{formatBRL(metricasAtual.folgaPE)}</strong> de vendas acima da meta mínima.
                    </>
                  ) : (
                    <>
                      ⚠️ Faltaram <strong>{formatBRL(Math.abs(metricasAtual.folgaPE))}</strong> em vendas no mês para cobrir todos os custos fixos ({formatBRL(metricasAtual.fixas)}).
                    </>
                  )}
                </div>
              </div>

              {/* Card 2: O Paradoxo (Lucro DRE vs Saldo em Caixa) */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #E5E0D5',
                padding: '14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1C2421', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={16} color="#0284C7" />
                  Reconciliação: Lucro da DRE vs Saldo do Caixa
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 10px', borderRadius: 8 }}>
                    <div style={{ fontSize: 10.5, color: '#166534' }}>Lucro Econômico (DRE):</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#15803D' }}>
                      {metricasAtual.lucroDRE >= 0 ? '+' : ''}{formatBRL(metricasAtual.lucroDRE)}
                    </div>
                    <div style={{ fontSize: 10, color: '#166534', marginTop: 2 }}>Margem líquida: {metricasAtual.margemLiquidaPct.toFixed(1)}%</div>
                  </div>

                  <div style={{ 
                    background: metricasAtual.saldoCaixa >= 0 ? '#F0FDF4' : '#FEF2F2', 
                    border: `1px solid ${metricasAtual.saldoCaixa >= 0 ? '#BBF7D0' : '#FECACA'}`, 
                    padding: '8px 10px', 
                    borderRadius: 8 
                  }}>
                    <div style={{ fontSize: 10.5, color: metricasAtual.saldoCaixa >= 0 ? '#166534' : '#991B1B' }}>Saldo em Conta Bancária:</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: metricasAtual.saldoCaixa >= 0 ? '#15803D' : '#DC2626' }}>
                      {metricasAtual.saldoCaixa >= 0 ? '+' : ''}{formatBRL(metricasAtual.saldoCaixa)}
                    </div>
                    <div style={{ fontSize: 10, color: metricasAtual.saldoCaixa >= 0 ? '#166534' : '#991B1B', marginTop: 2 }}>
                      {metricasAtual.saldoCaixa >= 0 ? 'Sobrou no caixa' : 'Saíram mais recursos'}
                    </div>
                  </div>
                </div>

                {/* Explicação Didática do Estoque */}
                <div style={{
                  background: '#FBF3E5',
                  border: '1px solid #E8C896',
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 11.5,
                  color: '#7A3A1A',
                  lineHeight: 1.55
                }}>
                  <strong>🔍 Onde foi parar a diferença?</strong>
                  <div style={{ marginTop: 4 }}>
                    {diagAtual.explicacaoEstoque}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── ABA 2: COMPARATIVO COM MÊS ANTERIOR ─── */}
          {modoAba === 'comparativo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!diagComparativo.temDadosSuficientes ? (
                <div style={{ background: '#fff', padding: 18, borderRadius: 12, textAlign: 'center', color: '#7A7868', fontSize: 12.5 }}>
                  {diagComparativo.mensagem}
                </div>
              ) : (
                <>
                  <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #E5E0D5',
                    padding: '14px'
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 10 }}>
                      Variação: {metricasAnterior.nomeMes} ➔ {metricasAtual.nomeMes}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                      <div style={{ background: '#F8F7F2', padding: '10px', borderRadius: 8 }}>
                        <div style={{ fontSize: 10.5, color: '#7A7868' }}>Faturamento</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2421', marginTop: 2 }}>
                          {formatBRL(metricasAtual.faturamento)}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: diagComparativo.varFatPct >= 0 ? '#15803D' : '#DC2626', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                          {diagComparativo.varFatPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {diagComparativo.varFatPct >= 0 ? '+' : ''}{diagComparativo.varFatPct.toFixed(1)}% vs {metricasAnterior.nomeMes}
                        </div>
                      </div>

                      <div style={{ background: '#F8F7F2', padding: '10px', borderRadius: 8 }}>
                        <div style={{ fontSize: 10.5, color: '#7A7868' }}>Lucro DRE</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2421', marginTop: 2 }}>
                          {formatBRL(metricasAtual.lucroDRE)}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: diagComparativo.varLucroDRE >= 0 ? '#15803D' : '#DC2626', marginTop: 2 }}>
                          {diagComparativo.varLucroDRE >= 0 ? '+' : ''}{formatBRL(diagComparativo.varLucroDRE)} vs {metricasAnterior.nomeMes}
                        </div>
                      </div>

                      <div style={{ background: '#F8F7F2', padding: '10px', borderRadius: 8 }}>
                        <div style={{ fontSize: 10.5, color: '#7A7868' }}>Compras de Estoque / Fornec.</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2421', marginTop: 2 }}>
                          {formatBRL(metricasAtual.cmvCompras)}
                        </div>
                        <div style={{ fontSize: 11, color: '#7A7868', marginTop: 2 }}>
                          {diagComparativo.varComprasCmv >= 0 ? '+' : ''}{formatBRL(diagComparativo.varComprasCmv)} vs {metricasAnterior.nomeMes}
                        </div>
                      </div>

                      <div style={{ background: '#F8F7F2', padding: '10px', borderRadius: 8 }}>
                        <div style={{ fontSize: 10.5, color: '#7A7868' }}>Saldo em Caixa</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: metricasAtual.saldoCaixa >= 0 ? '#15803D' : '#DC2626', marginTop: 2 }}>
                          {formatBRL(metricasAtual.saldoCaixa)}
                        </div>
                        <div style={{ fontSize: 11, color: '#7A7868', marginTop: 2 }}>
                          {diagComparativo.varSaldoCaixa >= 0 ? '+' : ''}{formatBRL(diagComparativo.varSaldoCaixa)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── ABA 3: PREVIEW DA MENSAGEM DO WHATSAPP ─── */}
          {modoAba === 'preview_zap' && (
            <div style={{
              background: '#EAE6DD',
              borderRadius: 12,
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '11px',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.45,
              color: '#1C2421',
              border: '1px solid #D1CFC7',
              maxHeight: 380,
              overflowY: 'auto'
            }}>
              {textoParaCopiar}
            </div>
          )}

        </div>

        {/* Rodapé Fixo de Ação em 1 Clique */}
        <div style={{
          background: '#fff',
          padding: '12px 16px',
          borderTop: '1px solid #E5E0D5',
          display: 'flex',
          gap: 10,
          alignItems: 'center'
        }}>
          <button
            onClick={handleCopiar}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: copiado ? '#15803D' : '#0F2B27',
              color: '#FAF8F3',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'background 0.2s',
              boxShadow: '0 3px 8px rgba(15,43,39,0.2)'
            }}
          >
            {copiado ? (
              <>
                <Check size={16} />
                <span>✓ Mensagem Copiada!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copiar para WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={handleAbrirWhatsApp}
            title="Abrir WhatsApp e colar a mensagem"
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              border: 'none',
              background: '#25D366',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 3px 8px rgba(37,211,102,0.3)'
            }}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
