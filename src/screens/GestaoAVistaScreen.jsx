import { ArrowLeft, Printer, Target, TrendingUp, ArrowUpCircle, ArrowDownCircle, Activity, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MESES, CATEGORIAS } from '../utils/constants';
import { formatBRL } from '../utils/formatters';
import { RadarChart, AREAS } from './DiagnosticoScreen';

export function GestaoAVistaScreen({ lancamentosAno = [], mesAtual = new Date().getMonth(), anoAtual = new Date().getFullYear(), empresaId, onVoltar }) {
  const [pctCmv, setPctCmv] = useState(0);

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

  const [lucroDesejadoStr, setLucroDesejadoStr] = useState(() => {
    return localStorage.getItem(`amp_meta_${anoAtual}_${mesAtual}`) || '0';
  });

  function handleLucroChange(val) {
    setLucroDesejadoStr(val);
    localStorage.setItem(`amp_meta_${anoAtual}_${mesAtual}`, val);
  }

  // Cálculos do mês atual
  const lancamentosMes = useMemo(() => (lancamentosAno || []).filter(l => l && l.mes === mesAtual), [lancamentosAno, mesAtual]);

  const calcAtual = useMemo(() => {
    const faturamento = lancamentosMes.filter(l => l && l.tipo === 'receita').reduce((s, l) => s + (l.valor || 0), 0);
    const cmvCompras = lancamentosMes.filter(l => l && l.tipo === 'despesa' && l.categoria === 'cmv').reduce((s, l) => s + (l.valor || 0), 0);
    const cmvEstimado = pctCmv > 0 ? faturamento * (pctCmv / 100) : 0;
    
    // Lógica de Estoque e CMV (Excludente para não duplicar valores)
    const lInicial = lancamentosMes.find(l => l && l.tipo === 'estoque' && l.categoria === 'inicial');
    const lFinal = lancamentosMes.find(l => l && l.tipo === 'estoque' && l.categoria === 'final');
    const temEstoque = !!(lInicial || lFinal);
    const cmv = temEstoque 
      ? ((lInicial?.valor || 0) + cmvCompras - (lFinal?.valor || 0)) 
      : (pctCmv > 0 ? cmvEstimado : cmvCompras);

    const variaveis = lancamentosMes.filter(l => l && l.tipo === 'despesa' && l.categoria === 'variavel').reduce((s, l) => s + (l.valor || 0), 0);
    const fixas = lancamentosMes.filter(l => l && l.tipo === 'despesa' && l.categoria === 'fixa').reduce((s, l) => s + (l.valor || 0), 0);
    const financeiras = lancamentosMes.filter(l => l && l.tipo === 'despesa' && l.categoria === 'financeira').reduce((s, l) => s + (l.valor || 0), 0);

    const custosFixosTotais = fixas + financeiras;
    const despesasVariaveisTotais = cmv + variaveis;
    const margemContribuicao = faturamento - despesasVariaveisTotais;
    
    const pctMC = faturamento > 0 ? margemContribuicao / faturamento : (pctCmv > 0 ? ((100 - pctCmv) / 100) : 0.30);
    const lucroLiquido = margemContribuicao - custosFixosTotais;

    const totalDespesa = lancamentosMes.filter(l => l && l.tipo === 'despesa').reduce((s, l) => s + (l.valor || 0), 0);
    
    // Despesas por Categoria para o Gráfico
    const porCategoria = { cmv: 0, variavel: 0, fixa: 0, financeira: 0 };
    lancamentosMes.filter(l => l && l.tipo === 'despesa').forEach(l => { 
      if (l.categoria && porCategoria[l.categoria] !== undefined) {
        porCategoria[l.categoria] += (l.valor || 0); 
      }
    });
    if (pctCmv > 0 && !temEstoque) {
      porCategoria.cmv = cmvEstimado;
    }
    const totalDespesasCategoria = Object.values(porCategoria).reduce((s, v) => s + v, 0);

    // Qtd Vendas e Dias Negativos (para Indicadores)
    const qtdVendas = lancamentosMes.filter(l => l && l.tipo === 'receita').reduce((s, l) => s + (l.qtdVendas || 0), 0);
    const porDia = {};
    lancamentosMes.forEach(l => { 
      if (l && l.dia) {
        porDia[l.dia] = (porDia[l.dia] || 0) + (l.tipo === 'receita' ? (l.valor || 0) : -(l.valor || 0)); 
      }
    });
    const diasNegativos = Object.values(porDia).filter(v => v < 0).length;

    return {
      faturamento,
      totalDespesa,
      totalDespesasCategoria,
      custosFixosTotais,
      despesasVariaveisTotais,
      pctMC,
      lucroLiquido,
      porCategoria,
      qtdVendas,
      diasNegativos,
      cmvCompras,
      temEstoque,
      modoCmv: temEstoque ? 'estoque' : (pctCmv > 0 ? 'estimado' : 'lancamentos')
    };
  }, [lancamentosMes, pctCmv]);

  // Lógica do Mês Anterior (para projeção)
  const calcAnterior = useMemo(() => {
    let m = mesAtual - 1;
    let a = anoAtual;
    if (m < 0) {
      m = 11;
      a -= 1;
    }
    const lancsAnt = (lancamentosAno || []).filter(l => l && l.mes === m && l.ano === a);
    const fat = lancsAnt.filter(l => l && l.tipo === 'receita').reduce((s, l) => s + (l.valor || 0), 0);
    const fixas = lancsAnt.filter(l => l && l.tipo === 'despesa' && l.categoria === 'fixa').reduce((s, l) => s + (l.valor || 0), 0);
    const financeiras = lancsAnt.filter(l => l && l.tipo === 'despesa' && l.categoria === 'financeira').reduce((s, l) => s + (l.valor || 0), 0);
    const custosFixos = fixas + financeiras;

    const cmvCompras = lancsAnt.filter(l => l && l.tipo === 'despesa' && l.categoria === 'cmv').reduce((s, l) => s + (l.valor || 0), 0);
    const cmvEstimado = pctCmv > 0 ? fat * (pctCmv / 100) : 0;
    const lInicial = lancsAnt.find(l => l && l.tipo === 'estoque' && l.categoria === 'inicial');
    const lFinal = lancsAnt.find(l => l && l.tipo === 'estoque' && l.categoria === 'final');
    const temEstoque = !!(lInicial || lFinal);
    const cmv = temEstoque ? ((lInicial?.valor || 0) + cmvCompras - (lFinal?.valor || 0)) : (pctCmv > 0 ? cmvEstimado : cmvCompras);
    
    const variaveis = lancsAnt.filter(l => l && l.tipo === 'despesa' && l.categoria === 'variavel').reduce((s, l) => s + (l.valor || 0), 0);
    const margemContribuicao = fat - (cmv + variaveis);
    const pctMC = fat > 0 ? margemContribuicao / fat : 0.30;

    return { custosFixos, pctMC, faturamento: fat };
  }, [lancamentosAno, mesAtual, anoAtual, pctCmv]);

  // Lógica de Metas & Ponto de Equilíbrio
  const lucroDesejado = parseFloat(lucroDesejadoStr) || 0;
  
  const usandoProjecao = calcAtual.faturamento === 0 && calcAtual.custosFixosTotais === 0;
  const baseCustosFixos = usandoProjecao ? calcAnterior.custosFixos : calcAtual.custosFixosTotais;
  const basePctMC = usandoProjecao ? calcAnterior.pctMC : calcAtual.pctMC;

  const faturamentoMeta = (basePctMC > 0 && isFinite(baseCustosFixos)) ? Math.max(0, (baseCustosFixos + lucroDesejado) / basePctMC) : 0;
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate() || 30;
  const metaDiaria = diasNoMes > 0 ? faturamentoMeta / diasNoMes : 0;
  const pctAtingidoCalc = faturamentoMeta > 0 ? (calcAtual.faturamento / faturamentoMeta) * 100 : 0;
  const pctAtingido = isFinite(pctAtingidoCalc) && !isNaN(pctAtingidoCalc) ? pctAtingidoCalc : 0;
  const falta = Math.max(0, faturamentoMeta - calcAtual.faturamento);
  const atingiu = calcAtual.faturamento >= faturamentoMeta && faturamentoMeta > 0;

  // Histórico dos últimos 4 meses
  const historico = useMemo(() => {
    const dados = [];
    for (let i = 3; i >= 0; i--) {
      let m = mesAtual - i;
      let a = anoAtual;
      if (m < 0) {
        m += 12;
        a -= 1;
      }
      
      const lancs = (lancamentosAno || []).filter(l => l && l.mes === m && l.ano === a);
      const fat = lancs.filter(l => l && l.tipo === 'receita').reduce((s, l) => s + (l.valor || 0), 0);
      const desp = lancs.filter(l => l && l.tipo === 'despesa').reduce((s, l) => s + (l.valor || 0), 0);
      const lucro = fat - desp;
      
      const mesNome = MESES[m] || 'Mês';
      dados.push({ mesLabel: mesNome.substring(0, 3), faturamento: fat, lucro: lucro });
    }
    return dados;
  }, [lancamentosAno, mesAtual, anoAtual]);

  const maxFatHist = Math.max(...historico.map(h => h.faturamento), faturamentoMeta, 1);
  const saldo = calcAtual.faturamento - calcAtual.totalDespesa;

  // Diagnóstico salvo no LocalStorage com validação rigorosa
  const diagRecente = useMemo(() => {
    try {
      const raw = localStorage.getItem('amp_diagnostico_recente');
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return null;
      if (!Array.isArray(d.scores)) return null;
      const scoresLimpos = d.scores.map(sc => {
        if (typeof sc === 'number') return { pct: isFinite(sc) ? sc : 0 };
        if (sc && typeof sc === 'object') return { ...sc, pct: typeof sc.pct === 'number' && isFinite(sc.pct) ? sc.pct : 0 };
        return { pct: 0 };
      });
      return {
        ...d,
        scores: scoresLimpos,
        scoreTotal: d.scoreTotal || 0,
        maxTotal: d.maxTotal || 0,
        nivel: d.nivel || { label: 'Avaliado', cor: '#1F5C52' }
      };
    } catch (e) {
      return null;
    }
  }, []);

  return (
    <div style={{ padding: '12px 14px', background: '#FAF8F3', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', width: '100%' }}>
      
      {/* ── ESTILOS DE SEPARAÇÃO RIGOROSA: TELA DO APP VS IMPRESSÃO EXECUTIVA ── */}
      <style>{`
        /* ── 1. MODO TELA (APP) ── */
        .gestao-print-view {
          display: none !important;
        }

        .gestao-screen-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .screen-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }
        @media screen and (min-width: 620px) {
          .screen-hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
        }

        .screen-indicators-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        @media screen and (min-width: 640px) {
          .screen-indicators-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }

        /* ── 2. MODO IMPRESSÃO (A4 PAISAGEM RIGOROSAMENTE IDÊNTICO AO BENCHMARK) ── */
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm 8mm !important;
          }
          html, body, .app-container {
            background: #FAF8F3 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          .no-print, .gestao-screen-view {
            display: none !important;
          }
          .gestao-print-view {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 194mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
          }
          .print-top-3cols {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 10px !important;
            height: 98mm !important;
            box-sizing: border-box !important;
          }
          .print-bottom-2cols {
            display: grid !important;
            grid-template-columns: 1fr 1.25fr !important;
            gap: 10px !important;
            height: 84mm !important;
            box-sizing: border-box !important;
          }
          .print-indicators-subgrid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            height: 100% !important;
          }
          .print-card {
            box-shadow: none !important;
            page-break-inside: avoid !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════════════
          1. VISUALIZAÇÃO DE TELA (APP MOBILE & DESKTOP - LIMPO & FLUIDO)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="gestao-screen-view no-print">
        
        {/* Botões de Ação Topo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onVoltar} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#5C5A4F', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft size={18} />
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>Voltar</span>
          </button>
          <button onClick={() => window.print()} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#1F5C52', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13.5, boxShadow: '0 2px 6px rgba(31,92,82,0.2)' }}>
            <Printer size={16} />
            Imprimir Quadro (Paisagem)
          </button>
        </div>

        {/* Configuração de Meta do Mês */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #EFEBE0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1C2421', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={16} color="#B05A2E" />
            Configurar Meta do Mês
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, color: '#5C5A4F' }}>
              Lucro livre desejado para {MESES[mesAtual]} (Deixe 0 para ver a Meta Mínima de Sobrevivência / Ponto de Equilíbrio):
            </label>
            <input 
              type="number" 
              value={lucroDesejadoStr} 
              onChange={e => handleLucroChange(e.target.value)}
              placeholder="0"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 14, width: '100%', maxWidth: 200, boxSizing: 'border-box' }}
            />
          </div>
          {pctCmv > 0 && calcAtual.cmvCompras > 0 && (
            <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: '#FEF3C7', border: '1px solid #FDE68A', fontSize: 11.5, color: '#92400E', lineHeight: 1.4 }}>
              💡 <strong>Nota sobre CMV:</strong> O cálculo está usando a estimativa de {pctCmv}% sobre vendas ({formatBRL(calcAtual.porCategoria.cmv)}). Os {formatBRL(calcAtual.cmvCompras)} em compras de CMV lançadas não foram somados para não duplicar o custo das metas.
            </div>
          )}
        </div>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1C2421' }}>Gestão à Vista</div>
          <div style={{ fontSize: 12.5, color: '#7A7868', marginTop: 1 }}>{MESES[mesAtual]} de {anoAtual}</div>
        </div>

        {/* ── BLOCO 1: CARDS PRINCIPAIS ── */}
        <div className="screen-hero-grid">
          
          {/* Coluna 1: Meta Diária e Saldo com Ponto de Equilíbrio Embutido */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#0F2B27', borderRadius: 14, padding: '16px', color: '#FAF8F3', textAlign: 'center', boxShadow: '0 2px 8px rgba(15,43,39,0.1)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9FBDB5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                Meta Diária de Vendas
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#9FE0C8', margin: '4px 0' }}>
                {formatBRL(metaDiaria)}
              </div>
              <div style={{ fontSize: 12, color: '#CFEEE2' }}>/ {diasNoMes} dias</div>
            </div>

            <div style={{ background: '#0F2B27', borderRadius: 14, padding: '16px', color: '#FAF8F3', textAlign: 'center', boxShadow: '0 2px 8px rgba(15,43,39,0.1)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9FBDB5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>
                Saldo do Caixa (Financeiro)
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: saldo >= 0 ? '#9FE0C8' : '#EF4444', margin: '2px 0 6px' }}>
                {formatBRL(saldo)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11.5, color: '#CFEEE2' }}>▲ Rec: {formatBRL(calcAtual.faturamento)}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                <span style={{ fontSize: 11.5, color: '#F5D5B8' }}>▼ Desp: {formatBRL(calcAtual.totalDespesa)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 10 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 600,
                  color: atingiu ? '#9FE0C8' : '#FCA5A5',
                  background: atingiu ? 'rgba(159, 224, 200, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${atingiu ? 'rgba(159, 224, 200, 0.3)' : 'rgba(239, 68, 68, 0.35)'}`,
                  padding: '4px 10px', borderRadius: 10, width: '100%', justifyContent: 'center', boxSizing: 'border-box'
                }}>
                  <Target size={13} color={atingiu ? '#9FE0C8' : '#FCA5A5'} />
                  <span>Ponto de Equilíbrio: {pctAtingido.toFixed(0)}% {atingiu ? '(Atingido)' : `(Falta ${formatBRL(falta)})`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Meta de Faturamento e Distribuição de Despesas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#7A7868' }}>Meta de Faturamento (PE)</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1C2421', marginTop: 2 }}>{formatBRL(faturamentoMeta)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#7A7868' }}>Faturamento Atual</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1F5C52', marginTop: 2 }}>{formatBRL(calcAtual.faturamento)}</div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 7, background: '#F0EDE3', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', width: `${Math.min(pctAtingido, 100)}%`, background: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E', borderRadius: 4 }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 700, color: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E' }}>
                  {pctAtingido.toFixed(1)}% Atingido
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1C2421', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Distribuição de Despesas</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#7A7868' }}>
                  {pctCmv > 0 && !calcAtual.temEstoque ? '(Base DRE)' : '(Base Lançamentos)'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4.5 }}>
                {Object.entries(CATEGORIAS).map(([key, cat]) => {
                  const valor = calcAtual.porCategoria[key] || 0;
                  const pct = calcAtual.totalDespesasCategoria > 0 ? (valor / calcAtual.totalDespesasCategoria) * 100 : 0;
                  return (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 2 }}>
                        <span style={{ color: cat.color, fontWeight: 600 }}>{cat.short} ({pct.toFixed(0)}%)</span>
                        <span style={{ color: '#5C5A4F', fontWeight: 600 }}>{formatBRL(valor)}</span>
                      </div>
                      <div style={{ height: 4.5, background: '#F0EDE3', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── BLOCO 2: MATURIDADE DA GESTÃO (FULL WIDTH NO APP) ── */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #EFEBE0', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1C2421', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={16} color="#1F5C52" />
              Maturidade da Gestão Financeira (Avaliação do Negócio)
            </div>
            {diagRecente && (
              <span style={{ fontSize: 11, fontWeight: 700, color: diagRecente.nivel?.cor || '#1F5C52', background: '#F5F3EE', padding: '3px 8px', borderRadius: 6 }}>
                {diagRecente.scoreTotal}/{diagRecente.maxTotal} pts ({diagRecente.nivel?.label || 'Avaliado'})
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: diagRecente && diagRecente.scores && diagRecente.scores.length > 0 ? '1fr 1.1fr' : '1fr', gap: 14, alignItems: 'center' }}>
            {diagRecente && diagRecente.scores && diagRecente.scores.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 260, margin: '0 auto', width: '100%' }}>
                  <RadarChart ratios={diagRecente.scores.map(sc => sc?.pct ?? 0)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {AREAS.map((area, idx) => {
                    const sc = diagRecente.scores[idx];
                    const pctVal = sc ? (sc.pct * 100).toFixed(0) : '0';
                    return (
                      <div key={area.id} style={{ background: area.fundo, border: `1px solid ${area.bg}`, borderRadius: 8, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: area.cor }}>{area.label}</div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: area.cor }}>{pctVal}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ padding: '14px', textAlign: 'center', color: '#7A7868', fontSize: 12 }}>
                Faça a avaliação na aba <strong>Avaliação</strong> para exibir seu Radar de Competências e Pilares aqui.
              </div>
            )}
          </div>
        </div>

        {/* ── BLOCO 3: INDICADORES DE DRE & PERFORMANCE COM DESTAQUES COLORIDOS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 2 }}>Indicadores de Performance</div>
          <div className="screen-indicators-grid">
            <MiniCard 
              label="Margem Contrib." 
              valor={`${(calcAtual.pctMC * 100).toFixed(1)}%`} 
              cor="#1F5C52" 
              bg="#EAF6EE"
              border="#CFEAD9"
              sub="Meta: acima 40%"
            />
            <MiniCard 
              label="Peso das Fixas" 
              valor={calcAtual.faturamento > 0 ? `${((calcAtual.custosFixosTotais / calcAtual.faturamento) * 100).toFixed(1)}%` : '—'} 
              cor={(calcAtual.custosFixosTotais / Math.max(1, calcAtual.faturamento)) <= 0.35 ? '#1F5C52' : '#B05A2E'} 
              bg="#FEF3C7"
              border="#FDE68A"
              sub="Meta: até 35%"
            />
            <MiniCard label="Custos Fixos" valor={formatBRL(calcAtual.custosFixosTotais)} cor="#B05A2E" />
            <MiniCard label="Custos Variáveis" valor={formatBRL(calcAtual.despesasVariaveisTotais)} cor="#8A6D1A" />
            <MiniCard 
              label="Margem Líquida" 
              valor={calcAtual.faturamento > 0 ? `${((calcAtual.lucroLiquido / calcAtual.faturamento) * 100).toFixed(1)}%` : '—'} 
              cor={calcAtual.lucroLiquido >= 0 ? '#1F5C52' : '#DC2626'} 
              bg={calcAtual.lucroLiquido >= 0 ? '#F5FAF7' : '#FEF2F2'}
              border={calcAtual.lucroLiquido >= 0 ? '#CFEAD9' : '#FECACA'}
              sub={calcAtual.lucroLiquido >= 0 ? 'Lucro' : 'Prejuízo'}
            />
            <MiniCard 
              label="Ticket Médio" 
              valor={calcAtual.qtdVendas > 0 ? formatBRL(calcAtual.faturamento / calcAtual.qtdVendas) : '—'} 
              cor="#1C2421" 
              sub={`${calcAtual.qtdVendas} vendas`}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <MiniCard 
                label="Dias no Vermelho" 
                valor={`${calcAtual.diasNegativos} dia${calcAtual.diasNegativos === 1 ? '' : 's'}`} 
                cor={calcAtual.diasNegativos === 0 ? '#1F5C52' : '#DC2626'} 
                bg={calcAtual.diasNegativos === 0 ? '#F5FAF7' : '#FFF5F5'}
                border={calcAtual.diasNegativos === 0 ? '#CFEAD9' : '#FED7D7'}
                sub="Gastos > Entradas no mês"
              />
            </div>
          </div>
        </div>

        {/* ── BLOCO 4: EVOLUÇÃO HISTÓRICA (FULL WIDTH NO APP - NUNCA CORTA NA LATERAL) ── */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #EFEBE0', boxShadow: '0 1px 4px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <TrendingUp size={16} color="#1F5C52" />
            Evolução Histórica (Faturamento vs Lucro)
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 140, gap: 12, padding: '0 8px' }}>
            {historico.map((h, i) => {
              const heightFat = (h.faturamento / maxFatHist) * 100;
              const heightLucro = maxFatHist > 0 ? (Math.max(0, h.lucro) / maxFatHist) * 100 : 0;
              const isAtual = i === historico.length - 1;
              return (
                <div key={h.mesLabel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, flex: 1, height: '100%' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#5C5A4F', whiteSpace: 'nowrap' }}>{formatBRL(h.faturamento)}</div>
                  <div style={{ display: 'flex', gap: 4, width: '100%', maxWidth: 50, alignItems: 'flex-end', height: '100%' }}>
                    <div style={{ flex: 1, height: `${Math.max(heightFat, 3)}%`, background: isAtual ? '#1F5C52' : '#9FBDB5', borderRadius: '3px 3px 0 0' }} />
                    <div style={{ flex: 1, height: `${Math.max(heightLucro, 3)}%`, background: isAtual ? '#E8A33D' : '#F5D5B8', borderRadius: '3px 3px 0 0' }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: isAtual ? 700 : 500, color: isAtual ? '#1F5C52' : '#9C9A8F' }}>{h.mesLabel}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10, fontSize: 11, color: '#5C5A4F', borderTop: '1px solid #F0EDE3', paddingTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: '#1F5C52', borderRadius: 2 }} /> Faturamento</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: '#E8A33D', borderRadius: 2 }} /> Lucro</span>
          </div>
        </div>

      </div>


      {/* ════════════════════════════════════════════════════════════════════════
          2. VISUALIZAÇÃO DE IMPRESSÃO (EXATAMENTE O BENCHMARK APROVADO DO PRINT 1)
         ════════════════════════════════════════════════════════════════════════ */}
      <div id="print-area" className="gestao-print-view">
        
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 2 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1C2421' }}>Gestão à Vista</div>
          <div style={{ fontSize: 12, color: '#7A7868', marginTop: 1 }}>{MESES[mesAtual]} de {anoAtual}</div>
        </div>

        {/* ── TOPO: 3 COLUNAS PERFEITAS (PRINT 1 BENCHMARK) ── */}
        <div className="print-top-3cols">
          
          {/* Coluna 1: Hero Escuros */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
            <div className="print-card" style={{ background: '#0F2B27', borderRadius: 14, padding: '16px', color: '#FAF8F3', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 120, boxSizing: 'border-box', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9FBDB5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                Meta Diária de Vendas
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#9FE0C8', margin: '4px 0' }}>
                {formatBRL(metaDiaria)}
              </div>
              <div style={{ fontSize: 12, color: '#CFEEE2', marginTop: 2 }}>/ {diasNoMes} dias</div>
            </div>

            <div className="print-card" style={{ background: '#0F2B27', borderRadius: 14, padding: '16px', color: '#FAF8F3', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120, boxSizing: 'border-box', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, paddingBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9FBDB5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>
                  Saldo do Caixa (Financeiro)
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: saldo >= 0 ? '#9FE0C8' : '#EF4444', margin: '2px 0 6px' }}>
                  {formatBRL(saldo)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 2 }}>
                  <span style={{ fontSize: 11.5, color: '#CFEEE2' }}>▲ Rec: {formatBRL(calcAtual.faturamento)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                  <span style={{ fontSize: 11.5, color: '#F5D5B8' }}>▼ Desp: {formatBRL(calcAtual.totalDespesa)}</span>
                </div>
              </div>
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 10, fontWeight: 600,
                  color: atingiu ? '#9FE0C8' : '#FCA5A5',
                  background: atingiu ? 'rgba(159, 224, 200, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${atingiu ? 'rgba(159, 224, 200, 0.3)' : 'rgba(239, 68, 68, 0.35)'}`,
                  padding: '3px 8px', borderRadius: 10, width: '100%', justifyContent: 'center'
                }}>
                  <Target size={12} color={atingiu ? '#9FE0C8' : '#FCA5A5'} />
                  <span>Ponto de Equilíbrio: {pctAtingido.toFixed(0)}% {atingiu ? '(Atingido)' : `(Falta ${formatBRL(falta)})`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Cards Claros */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
            <div className="print-card" style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120, boxSizing: 'border-box', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 10.5, color: '#7A7868' }}>Meta de Faturamento (PE)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1C2421', marginTop: 2 }}>{formatBRL(faturamentoMeta)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10.5, color: '#7A7868' }}>Faturamento Atual</div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1F5C52', marginTop: 2 }}>{formatBRL(calcAtual.faturamento)}</div>
                </div>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 6, background: '#F0EDE3', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
                  <div style={{ height: '100%', width: `${Math.min(pctAtingido, 100)}%`, background: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E', borderRadius: 3 }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: 10.5, fontWeight: 700, color: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E' }}>
                  {pctAtingido.toFixed(1)}% Atingido
                </div>
              </div>
            </div>

            <div className="print-card" style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 120, boxSizing: 'border-box', flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1C2421', marginBottom: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Distribuição de Despesas</span>
                <span style={{ fontSize: 9.5, fontWeight: 500, color: '#7A7868' }}>
                  {pctCmv > 0 && !calcAtual.temEstoque ? '(Base DRE)' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                {Object.entries(CATEGORIAS).map(([key, cat]) => {
                  const valor = calcAtual.porCategoria[key] || 0;
                  const pct = calcAtual.totalDespesasCategoria > 0 ? (valor / calcAtual.totalDespesasCategoria) * 100 : 0;
                  return (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, marginBottom: 1 }}>
                        <span style={{ color: cat.color, fontWeight: 600 }}>{cat.short} ({pct.toFixed(0)}%)</span>
                        <span style={{ color: '#5C5A4F', fontWeight: 600 }}>{formatBRL(valor)}</span>
                      </div>
                      <div style={{ height: 4, background: '#F0EDE3', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna 3: Maturidade (Radar + Pilares) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
            <div className="print-card" style={{ background: '#fff', borderRadius: 14, padding: '10px 14px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, boxSizing: 'border-box', flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1C2421', width: '100%', textAlign: 'left', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Activity size={13} color="#1F5C52" />
                Maturidade da Gestão (Radar)
              </div>
              {diagRecente && diagRecente.scores && diagRecente.scores.length > 0 ? (
                <div style={{ width: '100%', maxWidth: 220, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RadarChart ratios={diagRecente.scores.map(sc => sc?.pct ?? 0)} />
                </div>
              ) : (
                <div style={{ fontSize: 10.5, color: '#9C9A8F', textAlign: 'center', padding: '14px 0' }}>
                  Faça a avaliação na aba Avaliação
                </div>
              )}
            </div>

            <div className="print-card" style={{ background: '#fff', borderRadius: 14, padding: '10px 14px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 120, boxSizing: 'border-box', flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1C2421', marginBottom: 4 }}>Pilares de Maturidade</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {AREAS.map((area, idx) => {
                  const sc = diagRecente && diagRecente.scores ? diagRecente.scores[idx] : null;
                  const pctVal = sc ? `${(sc.pct * 100).toFixed(0)}%` : '—';
                  return (
                    <div key={area.id} style={{ background: area.fundo, border: `1px solid ${area.bg}`, borderRadius: 5, padding: '2px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 600, color: area.cor }}>{area.labelRadar || area.label}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: area.cor }}>{pctVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── BASE: INDICADORES (ESQUERDA) VS EVOLUÇÃO HISTÓRICA AMPLIADA (DIREITA) ── */}
        <div className="print-bottom-2cols">
          
          {/* Lado Esquerdo: Indicadores DRE (Margem Contribuição verde, Peso das Fixas amarelo) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', width: '100%', boxSizing: 'border-box' }}>
            <div className="print-indicators-subgrid">
              <MiniCard 
                label="Margem Contrib." 
                valor={`${(calcAtual.pctMC * 100).toFixed(1)}%`} 
                cor="#1F5C52" 
                bg="#EAF6EE"
                border="#CFEAD9"
                sub="Meta: acima 40%"
              />
              <MiniCard 
                label="Peso das Fixas" 
                valor={calcAtual.faturamento > 0 ? `${((calcAtual.custosFixosTotais / calcAtual.faturamento) * 100).toFixed(1)}%` : '—'} 
                cor={(calcAtual.custosFixosTotais / Math.max(1, calcAtual.faturamento)) <= 0.35 ? '#1F5C52' : '#B05A2E'} 
                bg="#FEF3C7"
                border="#FDE68A"
                sub="Meta: até 35%"
              />
              <MiniCard label="Custos Fixos" valor={formatBRL(calcAtual.custosFixosTotais)} cor="#B05A2E" />
              <MiniCard label="Custos Variáveis" valor={formatBRL(calcAtual.despesasVariaveisTotais)} cor="#8A6D1A" />
              <MiniCard 
                label="Margem Líquida" 
                valor={calcAtual.faturamento > 0 ? `${((calcAtual.lucroLiquido / calcAtual.faturamento) * 100).toFixed(1)}%` : '—'} 
                cor={calcAtual.lucroLiquido >= 0 ? '#1F5C52' : '#DC2626'} 
                bg={calcAtual.lucroLiquido >= 0 ? '#F5FAF7' : '#FEF2F2'}
                border={calcAtual.lucroLiquido >= 0 ? '#CFEAD9' : '#FECACA'}
                sub={calcAtual.lucroLiquido >= 0 ? 'Lucro' : 'Prejuízo'}
              />
              <MiniCard 
                label="Ticket Médio" 
                valor={calcAtual.qtdVendas > 0 ? formatBRL(calcAtual.faturamento / calcAtual.qtdVendas) : '—'} 
                cor="#1C2421" 
                sub={`${calcAtual.qtdVendas} vendas`}
              />
              <div style={{ gridColumn: 'span 2' }}>
                <MiniCard 
                  label="Dias no Vermelho" 
                  valor={`${calcAtual.diasNegativos} dia${calcAtual.diasNegativos === 1 ? '' : 's'}`} 
                  cor={calcAtual.diasNegativos === 0 ? '#1F5C52' : '#DC2626'} 
                  bg={calcAtual.diasNegativos === 0 ? '#F5FAF7' : '#FFF5F5'}
                  border={calcAtual.diasNegativos === 0 ? '#CFEAD9' : '#FED7D7'}
                  sub="Gastos > Entradas no mês"
                />
              </div>
            </div>
          </div>

          {/* Lado Direito: Evolução Histórica Ampliada */}
          <div className="print-card" style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', height: '100%', width: '100%' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <TrendingUp size={16} color="#1F5C52" />
              Evolução Histórica (Faturamento vs Lucro)
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 130, gap: 12, padding: '0 8px' }}>
              {historico.map((h, i) => {
                const heightFat = (h.faturamento / maxFatHist) * 100;
                const heightLucro = maxFatHist > 0 ? (Math.max(0, h.lucro) / maxFatHist) * 100 : 0;
                const isAtual = i === historico.length - 1;
                return (
                  <div key={h.mesLabel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, flex: 1, height: '100%' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#5C5A4F', whiteSpace: 'nowrap' }}>{formatBRL(h.faturamento)}</div>
                    <div style={{ display: 'flex', gap: 4, width: '100%', maxWidth: 54, alignItems: 'flex-end', height: '100%' }}>
                      <div style={{ flex: 1, height: `${Math.max(heightFat, 3)}%`, background: isAtual ? '#1F5C52' : '#9FBDB5', borderRadius: '3px 3px 0 0' }} />
                      <div style={{ flex: 1, height: `${Math.max(heightLucro, 3)}%`, background: isAtual ? '#E8A33D' : '#F5D5B8', borderRadius: '3px 3px 0 0' }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: isAtual ? 700 : 500, color: isAtual ? '#1F5C52' : '#9C9A8F' }}>{h.mesLabel}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8, fontSize: 11, color: '#5C5A4F', borderTop: '1px solid #F0EDE3', paddingTop: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: '#1F5C52', borderRadius: 2 }} /> Faturamento</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: '#E8A33D', borderRadius: 2 }} /> Lucro</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function MiniCard({ label, valor, cor = '#1C2421', sub, bg = '#fff', border = '#EFEBE0' }) {
  return (
    <div className="print-card" style={{ background: bg, borderRadius: 10, padding: '9px 10px', border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 9.5, color: '#7A7868', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: cor, marginTop: 2 }}>
        {valor}
      </div>
      {sub && (
        <div style={{ fontSize: 9, color: '#7A7868', marginTop: 1, whiteSpace: 'nowrap' }}>{sub}</div>
      )}
    </div>
  );
}
