import { ArrowDownCircle, ArrowUpCircle, ChevronRight, ChevronDown, X, Presentation, FileText, Target, CheckCircle2, AlertTriangle, TrendingUp, ShieldCheck, HelpCircle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EmptyState } from '../components/UIComponents';
import { RelatorioBancosModal } from '../components/RelatorioBancosModal';
import { CATEGORIAS, MESES } from '../utils/constants';
import { formatBRL } from '../utils/formatters';

export function Dashboard({ lancamentos, mesAtual, anoAtual, empresaId, onNovo, onEditar, onIrGestaoAVista }) {
  const [pctCmv, setPctCmv] = useState(0);
  const [peExpandido, setPeExpandido] = useState(false);

  useEffect(() => {
    if (!empresaId || mesAtual === undefined || anoAtual === undefined) return;
    supabase
      .from('cmv_config')
      .select('pct_cmv')
      .eq('empresa_id', empresaId)
      .eq('mes', mesAtual)
      .eq('ano', anoAtual)
      .maybeSingle()
      .then(({ data }) => {
        setPctCmv(data?.pct_cmv ?? 0);
      });
  }, [empresaId, mesAtual, anoAtual]);

  const totalReceita = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
  const totalDespesa = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
  const saldoCaixa = totalReceita - totalDespesa;

  const porCategoria = useMemo(() => {
    const acc = { cmv: 0, variavel: 0, fixa: 0, financeira: 0 };
    lancamentos.filter(l => l.tipo === 'despesa').forEach(l => { acc[l.categoria] = (acc[l.categoria] || 0) + l.valor; });
    return acc;
  }, [lancamentos]);

  // ── Cálculo Sincronizado do Ponto de Equilíbrio & DRE ─────────────────────
  const peCalculo = useMemo(() => {
    const faturamento = totalReceita;
    const cmvCalculado = pctCmv > 0 ? (faturamento * (pctCmv / 100)) : porCategoria.cmv;
    const despesasVariaveis = cmvCalculado + porCategoria.variavel;
    const custosFixos = porCategoria.fixa + porCategoria.financeira;
    const margemContribuicao = faturamento - despesasVariaveis;
    
    const pctMC = faturamento > 0 
      ? (margemContribuicao / faturamento) 
      : (pctCmv > 0 ? ((100 - pctCmv) / 100) : 0.35);
    
    const pontoEquilibrio = (pctMC > 0 && custosFixos > 0) ? (custosFixos / pctMC) : 0;
    const resultadoDRE = margemContribuicao - custosFixos;
    
    const atingiu = faturamento >= pontoEquilibrio && pontoEquilibrio > 0;
    const falta = Math.max(0, pontoEquilibrio - faturamento);
    const progressoPct = pontoEquilibrio > 0 ? Math.min(100, Math.round((faturamento / pontoEquilibrio) * 100)) : (faturamento > 0 ? 100 : 0);
    const margemSeguranca = faturamento - pontoEquilibrio;

    return {
      custosFixos,
      cmvCalculado,
      despesasVariaveis,
      margemContribuicao,
      pctMC,
      pontoEquilibrio,
      resultadoDRE,
      atingiu,
      falta,
      progressoPct,
      margemSeguranca,
      temCustos: custosFixos > 0
    };
  }, [totalReceita, porCategoria, pctCmv]);

  const recentes = [...lancamentos].sort((a, b) => b.dia - a.dia);
  const [recentesAbertos, setRecentesAbertos] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      {/* ── CARD PRINCIPAL: SALDO DO CAIXA (100% CENTRALIZADO & HARMONIOSO) ── */}
      <div style={{ background: '#0F2B27', borderRadius: 16, padding: '20px 16px', color: '#FAF8F3', marginBottom: 14, boxShadow: '0 4px 14px rgba(15,43,39,0.15)', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9FBDB5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
          Saldo em Caixa (Financeiro)
        </div>
        
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, color: saldoCaixa >= 0 ? '#9FE0C8' : '#EF4444', margin: '2px 0 6px' }}>
          {formatBRL(saldoCaixa)}
        </div>

        {/* Pílula Centralizada da DRE Econômica (Amarelo Translúcido) */}
        {peCalculo.temCustos && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, 
              color: '#FCD34D', 
              background: 'rgba(232, 163, 61, 0.16)', 
              border: '1px solid rgba(232, 163, 61, 0.38)', 
              padding: '3px 12px', borderRadius: 20 
            }}>
              <span>DRE Econômica: {formatBRL(peCalculo.resultadoDRE)} ({peCalculo.resultadoDRE >= 0 ? 'Lucro' : 'Prejuízo Operacional'})</span>
            </div>
          </div>
        )}

        {/* Bloco: Receitas vs Despesas Pagas (Simétrico & Centralizado) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12, marginTop: peCalculo.temCustos ? 0 : 8 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: '#9FE0C8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <ArrowUpCircle size={12} /> Receitas
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#CFEEE2' }}>{formatBRL(totalReceita)}</div>
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255, 255, 255, 0.15)' }} />

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: '#F0BE94', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <ArrowDownCircle size={12} /> Despesas Pagas
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F5D5B8' }}>{formatBRL(totalDespesa)}</div>
          </div>
        </div>

        {/* Guia com Informações do Ponto de Equilíbrio no Card Principal */}
        {peCalculo.temCustos && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600,
              color: peCalculo.atingiu ? '#9FE0C8' : '#FCA5A5',
              background: peCalculo.atingiu ? 'rgba(159, 224, 200, 0.15)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${peCalculo.atingiu ? 'rgba(159, 224, 200, 0.3)' : 'rgba(239, 68, 68, 0.35)'}`,
              padding: '4px 12px', borderRadius: 12, width: '100%', justifyContent: 'center'
            }}>
              <Target size={13} color={peCalculo.atingiu ? '#9FE0C8' : '#FCA5A5'} />
              <span>Ponto de Equilíbrio: {formatBRL(peCalculo.pontoEquilibrio)} ({peCalculo.progressoPct}% • {peCalculo.atingiu ? 'Atingido!' : `Falta ${formatBRL(peCalculo.falta)}`})</span>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTÕES DE AÇÃO PRINCIPAL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <button 
          onClick={() => onNovo('receita')} 
          style={{ padding: '12px', borderRadius: 12, border: '1px solid #CFEAD9', background: '#EAF6EE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 6px rgba(31,92,82,0.06)', minHeight: 80 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ background: '#1F5C52', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <ArrowUpCircle size={18} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1F5C52', background: '#CFEAD9', padding: '2px 6px', borderRadius: 6, letterSpacing: 0.5 }}>+ RECEITA</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1F5C52', whiteSpace: 'nowrap' }}>Lançar Receita</div>
            <div style={{ fontSize: 10.5, color: '#5C8A71', marginTop: 1 }}>Venda / Entrada</div>
          </div>
        </button>

        <button 
          onClick={() => onNovo('despesa')} 
          style={{ padding: '12px', borderRadius: 12, border: '1px solid #F7D6C8', background: '#FDF2EE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 6px rgba(176,90,46,0.06)', minHeight: 80 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ background: '#B05A2E', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <ArrowDownCircle size={18} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#B05A2E', background: '#F7D6C8', padding: '2px 6px', borderRadius: 6, letterSpacing: 0.5 }}>- DESPESA</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#B05A2E', whiteSpace: 'nowrap' }}>Lançar Despesa</div>
            <div style={{ fontSize: 10.5, color: '#C07D5A', marginTop: 1 }}>Conta / Saída</div>
          </div>
        </button>
      </div>

      {/* ── CARD DO PONTO DE EQUILÍBRIO: COMPACTO & COLAPSÁVEL (ACCORDION) ── */}
      <div style={{ background: '#fff', border: `1px solid ${peCalculo.atingiu ? '#CFEAD9' : '#FCA5A5'}`, borderRadius: 14, marginBottom: 14, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        {/* Cabeçalho Clicável (1 Linha Limpa) */}
        <div 
          onClick={() => setPeExpandido(e => !e)}
          style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: peCalculo.atingiu ? '#F5FAF7' : '#FEF2F2' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={16} color={peCalculo.atingiu ? '#1F5C52' : '#DC2626'} />
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1C2421' }}>Ponto de Equilíbrio</span>
              {peCalculo.temCustos && (
                <span style={{ fontSize: 11, color: '#7A7868', marginLeft: 6 }}>({peCalculo.progressoPct}% alcançado)</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {peCalculo.temCustos ? (
              peCalculo.atingiu ? (
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1F5C52', background: '#CFEAD9', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} /> Atingido!
                </span>
              ) : (
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={12} /> Faltam {formatBRL(peCalculo.falta)}
                </span>
              )
            ) : (
              <span style={{ fontSize: 11, color: '#9C9A8F' }}>Sem custos</span>
            )}
            <ChevronDown size={16} color="#7A7868" style={{ transform: peExpandido ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </div>
        </div>

        {/* Micro Barra de Progresso quando fechado */}
        {!peExpandido && peCalculo.temCustos && (
          <div style={{ height: 3, background: '#F0EDE3' }}>
            <div style={{ height: '100%', width: `${peCalculo.progressoPct}%`, background: peCalculo.atingiu ? '#1F5C52' : '#DC2626' }} />
          </div>
        )}

        {/* Conteúdo Detalhado ao Expandir */}
        {peExpandido && (
          <div style={{ padding: '14px 14px 16px', background: '#fff', borderTop: '1px solid #EFEBE0' }}>
            {peCalculo.temCustos ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#7A7868' }}>Meta Mínima: </span>
                    <strong style={{ fontSize: 15, color: '#1C2421' }}>{formatBRL(peCalculo.pontoEquilibrio)}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: '#5C5A4F' }}>
                    Vendido: <strong>{formatBRL(totalReceita)}</strong>
                  </div>
                </div>

                <div style={{ height: 7, background: '#F0EDE3', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${peCalculo.progressoPct}%`, 
                      background: peCalculo.atingiu ? '#1F5C52' : '#DC2626', 
                      borderRadius: 4
                    }} 
                  />
                </div>

                <div style={{ fontSize: 11.5, lineHeight: 1.45, padding: '10px 12px', borderRadius: 8, background: peCalculo.atingiu ? '#EAF4F0' : '#FEF2F2', border: `1px solid ${peCalculo.atingiu ? '#CFEAD9' : '#FECACA'}`, color: peCalculo.atingiu ? '#1F5C52' : '#991B1B', marginBottom: 12 }}>
                  {peCalculo.atingiu ? (
                    <span>
                      🎉 <strong>Zona de Lucro Real!</strong> Sua empresa já cobriu todos os <strong>{formatBRL(peCalculo.custosFixos)}</strong> de custos fixos do mês. Cada nova venda agora gera lucro líquido direto (Margem de Segurança: <strong>+{formatBRL(peCalculo.margemSeguranca)}</strong>).
                    </span>
                  ) : (
                    <span>
                      ⚠️ <strong>Abaixo do Ponto de Equilíbrio:</strong> Faltam <strong>{formatBRL(peCalculo.falta)}</strong> em vendas para atingir o ponto de equilíbrio ({formatBRL(peCalculo.pontoEquilibrio)}) e cobrir as contas fixas ({formatBRL(peCalculo.custosFixos)}).
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: '#7A7868', padding: '6px 0 10px', lineHeight: 1.4 }}>
                Cadastre suas despesas fixas (aluguel, salários, etc.) para o sistema calcular automaticamente a receita mínima necessária.
              </div>
            )}

            <button 
              onClick={onIrGestaoAVista} 
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CFEAD9', background: '#F5FAF7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#1F5C52', fontSize: 12, fontWeight: 600 }}
            >
              <Presentation size={14} />
              <span>Ver Quadro de Metas & Gestão à Vista Completo</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── SEÇÃO DESPESAS POR CATEGORIA (GRID COMPACTO 2x2) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#5C5A4F' }}>Despesas por categoria</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {Object.entries(CATEGORIAS).map(([key, cat]) => {
          const valor = porCategoria[key] || 0;
          const pct = totalDespesa > 0 ? (valor / totalDespesa) * 100 : 0;
          return (
            <div key={key} style={{ background: '#fff', borderRadius: 10, padding: '8px 10px', border: '1px solid #EFEBE0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: cat.color, fontWeight: 600, fontSize: 11 }}>{cat.short}</span>
                <span style={{ fontSize: 9.5, color: '#747266', background: '#F5F2E8', padding: '1px 4px', borderRadius: 4, fontWeight: 600 }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 4 }}>{formatBRL(valor)}</div>
              <div style={{ height: 3, background: '#F0EDE3', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LANÇAMENTOS RECENTES & RELATÓRIO ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: recentesAbertos ? 10 : 0 }}>
        <button
          onClick={() => setRecentesAbertos(a => !a)}
          disabled={recentes.length === 0}
          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: recentes.length > 0 ? 'pointer' : 'default', textAlign: 'left' }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Lançamentos recentes {recentes.length > 0 && `(${recentes.length})`}</span>
          {recentes.length > 0 && (
            <ChevronRight size={16} color="#9C9A8F" style={{ transform: recentesAbertos ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
          )}
        </button>
        
        <button 
          onClick={() => setShowRelatorioModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#fff', border: '1px solid #D1CFC7', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#1C2421', cursor: 'pointer' }}
        >
          <FileText size={14} /> Relatório
        </button>
      </div>

      {recentes.length === 0 ? (
        <EmptyState text="Nenhum lançamento neste mês ainda. Toque no + para começar." />
      ) : recentesAbertos && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
          {recentes.map(l => <LancamentoRow key={l.id} l={l} onEditar={onEditar} corPorCategoria={false} />)}
        </div>
      )}

      {showRelatorioModal && (
        <RelatorioBancosModal 
          lancamentosMes={lancamentos} 
          mesLabel={MESES[mesAtual]}
          ano={anoAtual}
          onClose={() => setShowRelatorioModal(false)}
        />
      )}
    </div>
  );
}

export function LancamentoRow({ l, onRemove, onEditar, corPorCategoria = true }) {
  const cat = l.categoria ? CATEGORIAS[l.categoria] : null;
  const corDespesa = corPorCategoria && cat ? cat.color : '#B05A2E';
  return (
    <div
      onClick={() => onEditar && onEditar(l)}
      role={onEditar ? 'button' : undefined}
      tabIndex={onEditar ? 0 : undefined}
      style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid #EFEBE0', display: 'flex', alignItems: 'center', gap: 10, cursor: onEditar ? 'pointer' : 'default' }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: l.tipo === 'receita' ? '#D9EBE6' : (corPorCategoria && cat ? cat.bg : '#F5E4D8'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {l.tipo === 'receita' ? <ArrowUpCircle size={15} color="#1F5C52" /> : <ArrowDownCircle size={15} color={corDespesa} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.descricao}</div>
        <div style={{ fontSize: 11.5, color: '#9C9A8F' }}>Dia {l.dia}{cat ? ` · ${cat.short}` : (l.formaRecebimento ? ` · ${l.formaRecebimento}` : '')}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: l.tipo === 'receita' ? '#1F5C52' : corDespesa }}>
        {l.tipo === 'receita' ? '+' : '-'}{formatBRL(l.valor)}
      </div>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(l.id); }}
          aria-label="Remover"
          style={{ background: 'none', border: 'none', color: '#C9C5B6', cursor: 'pointer', padding: 4 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
