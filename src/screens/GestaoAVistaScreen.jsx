import { ArrowLeft, Printer, Target, TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MESES, CATEGORIAS } from '../utils/constants';
import { formatBRL } from '../utils/formatters';
import { IndicadorCard } from './AnualScreen';

export function GestaoAVistaScreen({ lancamentosAno, mesAtual, anoAtual, empresaId, onVoltar }) {
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
    return localStorage.getItem(`amp_meta_${anoAtual}_${mesAtual}`) || '10000';
  });

  function handleLucroChange(val) {
    setLucroDesejadoStr(val);
    localStorage.setItem(`amp_meta_${anoAtual}_${mesAtual}`, val);
  }

  // Cálculos do mês atual
  const lancamentosMes = useMemo(() => lancamentosAno.filter(l => l.mes === mesAtual), [lancamentosAno, mesAtual]);

  const calcAtual = useMemo(() => {
    const faturamento = lancamentosMes.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
    const cmvCompras = lancamentosMes.filter(l => l.tipo === 'despesa' && l.categoria === 'cmv').reduce((s, l) => s + l.valor, 0);
    const cmvEstimado = pctCmv > 0 ? faturamento * (pctCmv / 100) : 0;
    
    // Lógica de Estoque
    const lInicial = lancamentosMes.find(l => l.tipo === 'estoque' && l.categoria === 'inicial');
    const lFinal = lancamentosMes.find(l => l.tipo === 'estoque' && l.categoria === 'final');
    const cmv = (lInicial || lFinal) 
      ? ((lInicial?.valor || 0) + cmvCompras - (lFinal?.valor || 0)) 
      : (cmvCompras + cmvEstimado);

    const variaveis = lancamentosMes.filter(l => l.tipo === 'despesa' && l.categoria === 'variavel').reduce((s, l) => s + l.valor, 0);
    const fixas = lancamentosMes.filter(l => l.tipo === 'despesa' && l.categoria === 'fixa').reduce((s, l) => s + l.valor, 0);
    const financeiras = lancamentosMes.filter(l => l.tipo === 'despesa' && l.categoria === 'financeira').reduce((s, l) => s + l.valor, 0);

    const custosFixosTotais = fixas + financeiras;
    const despesasVariaveisTotais = cmv + variaveis;
    const margemContribuicao = faturamento - despesasVariaveisTotais;
    
    const pctMC = faturamento > 0 ? margemContribuicao / faturamento : 0.30;
    const lucroLiquido = margemContribuicao - custosFixosTotais;

    const totalDespesa = lancamentosMes.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
    
    // Despesas por Categoria para o Gráfico
    const porCategoria = { cmv: 0, variavel: 0, fixa: 0, financeira: 0 };
    lancamentosMes.filter(l => l.tipo === 'despesa').forEach(l => { porCategoria[l.categoria] = (porCategoria[l.categoria] || 0) + l.valor; });

    // Qtd Vendas e Dias Negativos (para Indicadores)
    const qtdVendas = lancamentosMes.filter(l => l.tipo === 'receita').reduce((s, l) => s + (l.qtdVendas || 0), 0);
    const porDia = {};
    lancamentosMes.forEach(l => { porDia[l.dia] = (porDia[l.dia] || 0) + (l.tipo === 'receita' ? l.valor : -l.valor); });
    const diasNegativos = Object.values(porDia).filter(v => v < 0).length;

    return {
      faturamento,
      totalDespesa,
      custosFixosTotais,
      despesasVariaveisTotais,
      pctMC,
      lucroLiquido,
      porCategoria,
      qtdVendas,
      diasNegativos
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
    const lancsAnt = lancamentosAno.filter(l => l.mes === m && l.ano === a);
    const fat = lancsAnt.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
    const fixas = lancsAnt.filter(l => l.tipo === 'despesa' && l.categoria === 'fixa').reduce((s, l) => s + l.valor, 0);
    const financeiras = lancsAnt.filter(l => l.tipo === 'despesa' && l.categoria === 'financeira').reduce((s, l) => s + l.valor, 0);
    const custosFixos = fixas + financeiras;

    const cmvCompras = lancsAnt.filter(l => l.tipo === 'despesa' && l.categoria === 'cmv').reduce((s, l) => s + l.valor, 0);
    const cmvEstimado = pctCmv > 0 ? fat * (pctCmv / 100) : 0;
    const lInicial = lancsAnt.find(l => l.tipo === 'estoque' && l.categoria === 'inicial');
    const lFinal = lancsAnt.find(l => l.tipo === 'estoque' && l.categoria === 'final');
    const cmv = (lInicial || lFinal) ? ((lInicial?.valor || 0) + cmvCompras - (lFinal?.valor || 0)) : (cmvCompras + cmvEstimado);
    
    const variaveis = lancsAnt.filter(l => l.tipo === 'despesa' && l.categoria === 'variavel').reduce((s, l) => s + l.valor, 0);
    const margemContribuicao = fat - (cmv + variaveis);
    const pctMC = fat > 0 ? margemContribuicao / fat : 0.30;

    return { custosFixos, pctMC, faturamento: fat };
  }, [lancamentosAno, mesAtual, anoAtual, pctCmv]);

  // Lógica de Metas
  const lucroDesejado = parseFloat(lucroDesejadoStr) || 0;
  
  const usandoProjecao = calcAtual.faturamento === 0 && calcAtual.custosFixosTotais === 0;
  const baseCustosFixos = usandoProjecao ? calcAnterior.custosFixos : calcAtual.custosFixosTotais;
  const basePctMC = usandoProjecao ? calcAnterior.pctMC : calcAtual.pctMC;

  const faturamentoMeta = basePctMC > 0 ? (baseCustosFixos + lucroDesejado) / basePctMC : 0;
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const metaDiaria = faturamentoMeta / diasNoMes;
  const pctAtingido = faturamentoMeta > 0 ? (calcAtual.faturamento / faturamentoMeta) * 100 : 0;

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
      
      const lancs = lancamentosAno.filter(l => l.mes === m && l.ano === a);
      const fat = lancs.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
      const desp = lancs.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
      const lucro = fat - desp;
      
      dados.push({ mesLabel: MESES[m].substring(0, 3), faturamento: fat, lucro: lucro });
    }
    return dados;
  }, [lancamentosAno, mesAtual, anoAtual]);

  const maxFatHist = Math.max(...historico.map(h => h.faturamento), faturamentoMeta, 1);

  // Indicadores tipo Dashboard
  const saldo = calcAtual.faturamento - calcAtual.totalDespesa;

  return (
    <div style={{ padding: 16, background: '#FAF8F3', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onVoltar} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#5C5A4F', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Voltar</span>
        </button>
        <button onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1F5C52', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600 }}>
          <Printer size={16} />
          Imprimir Quadro
        </button>
      </div>

      <div className="no-print" style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1C2421', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Target size={18} color="#B05A2E" />
          Configurar Meta do Mês
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#5C5A4F' }}>Qual o lucro livre desejado para {MESES[mesAtual]}? (R$)</label>
          <input 
            type="number" 
            value={lucroDesejadoStr} 
            onChange={(e) => handleLucroChange(e.target.value)}
            style={{ padding: '12px', borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 16, fontWeight: 600, background: '#FBFAF6' }}
          />
          {usandoProjecao && (
            <div style={{ marginTop: 6, padding: '8px 10px', background: '#FFF3E0', border: '1px solid #FFE0B2', borderRadius: 8, fontSize: 11.5, color: '#E65100', fontWeight: 500 }}>
              💡 {MESES[mesAtual]} não tem dados suficientes. Projetando meta usando custos e margem de {mesAtual === 0 ? MESES[11] : MESES[mesAtual-1]}!
            </div>
          )}
        </div>
      </div>

      {/* ÁREA DE IMPRESSÃO - GESTÃO À VISTA */}
      <div id="print-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 32, color: '#0F2B27', fontFamily: 'Georgia, serif' }}>Gestão à Vista</h1>
          <h2 style={{ margin: '4px 0 0 0', fontSize: 18, color: '#8A6D1A', fontWeight: 500 }}>{MESES[mesAtual]} de {anoAtual}</h2>
        </div>

        {/* 1. Visão de Metas */}
        <div className="gestao-row">
          <div style={{ flex: 1, background: '#0F2B27', borderRadius: 16, padding: 24, color: '#FAF8F3', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 16, color: '#9FBDB5', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Meta Diária de Vendas</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 42, color: '#9FE0C8', fontWeight: 600 }}>{formatBRL(metaDiaria)}</div>
            <div style={{ fontSize: 13, color: '#CFEEE2', marginTop: 8 }}>/ {diasNoMes} dias</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 24, border: '2px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 14, color: '#5C5A4F', marginBottom: 4 }}>Meta de Faturamento</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1C2421', marginBottom: 16 }}>{formatBRL(faturamentoMeta)}</div>
            <div style={{ fontSize: 14, color: '#5C5A4F', marginBottom: 4 }}>Faturamento Atual</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1F5C52', marginBottom: 12 }}>{formatBRL(calcAtual.faturamento)}</div>
            <div style={{ height: 16, background: '#F0EDE3', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(pctAtingido, 100)}%`, background: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E', borderRadius: 8, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E', marginTop: 8, textAlign: 'right' }}>
              {pctAtingido.toFixed(1)}% Atingido
            </div>
          </div>
        </div>

        {/* 2. Resumo Financeiro (Dashboard View) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Card Saldo */}
          <div style={{ background: '#0F2B27', borderRadius: 16, padding: 20, color: '#FAF8F3' }}>
            <div style={{ fontSize: 12, color: '#9FBDB5', marginBottom: 4 }}>Saldo Líquido do Mês</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: saldo >= 0 ? '#9FE0C8' : '#F0A0A0' }}>{formatBRL(saldo)}</div>
            <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: '#9FE0C8', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowUpCircle size={13} /> Receitas</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#CFEEE2' }}>{formatBRL(calcAtual.faturamento)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#F0BE94', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowDownCircle size={13} /> Despesas</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#F5D5B8' }}>{formatBRL(calcAtual.totalDespesa)}</div>
              </div>
            </div>
          </div>
          
          {/* Despesas por Categoria */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 12 }}>Distribuição de Despesas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(CATEGORIAS).map(([key, cat]) => {
                const valor = calcAtual.porCategoria[key] || 0;
                const pct = calcAtual.totalDespesa > 0 ? (valor / calcAtual.totalDespesa) * 100 : 0;
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: cat.color, fontWeight: 600 }}>{cat.short}</span>
                      <span style={{ color: '#5C5A4F' }}>{formatBRL(valor)}</span>
                    </div>
                    <div style={{ height: 6, background: '#F0EDE3', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Indicadores (DRE / Margem) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 12, color: '#9C9A8F', textTransform: 'uppercase' }}>Custos Fixos Totais</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#B05A2E' }}>{formatBRL(calcAtual.custosFixosTotais)}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 12, color: '#9C9A8F', textTransform: 'uppercase' }}>Custos Variáveis</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#B05A2E' }}>{formatBRL(calcAtual.despesasVariaveisTotais)}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 12, color: '#9C9A8F', textTransform: 'uppercase' }}>Margem de Contribuição</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#1C2421' }}>{(calcAtual.pctMC * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Indicadores Chave de Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <IndicadorCard
            label="Margem Líquida"
            valor={calcAtual.faturamento > 0 ? `${((calcAtual.lucroLiquido / calcAtual.faturamento) * 100).toFixed(1)}%` : '—'}
            bom={calcAtual.lucroLiquido >= 0}
            explicacao="Lucro livre para cada R$ 1 vendido."
          />
          <IndicadorCard
            label="Ticket Médio"
            valor={calcAtual.qtdVendas > 0 ? formatBRL(calcAtual.faturamento / calcAtual.qtdVendas) : '—'}
            neutro
            explicacao="Valor médio por venda. Cadastre a qtd nas receitas."
          />
          <IndicadorCard
            label="Peso das Fixas"
            valor={calcAtual.faturamento > 0 ? `${((calcAtual.custosFixosTotais / calcAtual.faturamento) * 100).toFixed(1)}%` : '—'}
            bom={(calcAtual.custosFixosTotais / Math.max(1, calcAtual.faturamento)) <= 0.3}
            explicacao="Percentual do faturamento comprometido com despesas fixas."
          />
          <IndicadorCard
            label="Dias no Vermelho"
            valor={`${calcAtual.diasNegativos} dia${calcAtual.diasNegativos === 1 ? '' : 's'}`}
            bom={calcAtual.diasNegativos === 0}
            explicacao="Dias do mês em que os gastos superaram as entradas."
          />
        </div>

        {/* 4. Gráfico Histórico */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #EFEBE0' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1C2421', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={20} color="#1F5C52" />
            Evolução Histórica (Faturamento vs Lucro)
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 160, gap: 20 }}>
            {historico.map((h, i) => {
              const heightFat = (h.faturamento / maxFatHist) * 100;
              const heightLucro = maxFatHist > 0 ? (Math.max(0, h.lucro) / maxFatHist) * 100 : 0;
              const isAtual = i === historico.length - 1;
              return (
                <div key={h.mesLabel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flex: 1, height: '100%' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#5C5A4F' }}>{formatBRL(h.faturamento)}</div>
                  <div style={{ display: 'flex', gap: 4, width: '100%', maxWidth: 60, alignItems: 'flex-end', height: '100%' }}>
                    <div style={{ flex: 1, height: `${Math.max(heightFat, 2)}%`, background: isAtual ? '#1F5C52' : '#9FBDB5', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ flex: 1, height: `${Math.max(heightLucro, 2)}%`, background: isAtual ? '#E8A33D' : '#F5D5B8', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: isAtual ? 700 : 500, color: isAtual ? '#1F5C52' : '#9C9A8F' }}>{h.mesLabel}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, fontSize: 12, color: '#5C5A4F' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: '#1F5C52', borderRadius: 2 }} /> Faturamento</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: '#E8A33D', borderRadius: 2 }} /> Lucro</span>
          </div>
        </div>

      </div>
    </div>
  );
}
