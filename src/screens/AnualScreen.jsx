import React, { useMemo } from 'react';
import { formatBRL } from '../utils/formatters';
import { MESES } from '../utils/constants';
import { EmptyState } from '../components/UIComponents';

export function AnualScreen({ lancamentosAno, anoAtual, mesAtual, setTela, setMesAtual }) {
  const porMes = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) => {
      const doMes = lancamentosAno.filter(l => l.mes === m);
      const receitas = doMes.filter(l => l.tipo === 'receita');
      const despesas = doMes.filter(l => l.tipo === 'despesa');
      const faturamento = receitas.reduce((s, l) => s + l.valor, 0);
      const cmv = despesas.filter(d => d.categoria === 'cmv').reduce((s, l) => s + l.valor, 0);
      const variaveis = despesas.filter(d => d.categoria === 'variavel').reduce((s, l) => s + l.valor, 0);
      const fixas = despesas.filter(d => d.categoria === 'fixa').reduce((s, l) => s + l.valor, 0);
      const financeiras = despesas.filter(d => d.categoria === 'financeira').reduce((s, l) => s + l.valor, 0);
      const totalDespesa = cmv + variaveis + fixas + financeiras;
      const resultadoLiquido = faturamento - totalDespesa;
      const qtdVendas = receitas.reduce((s, l) => s + (l.qtdVendas || 0), 0);

      const porDia = {};
      doMes.forEach(l => {
        porDia[l.dia] = (porDia[l.dia] || 0) + (l.tipo === 'receita' ? l.valor : -l.valor);
      });
      const diasNegativos = Object.values(porDia).filter(v => v < 0).length;

      return { mes: m, faturamento, cmv, variaveis, fixas, financeiras, totalDespesa, resultadoLiquido, qtdVendas, diasNegativos, temDados: doMes.length > 0 };
    });
  }, [lancamentosAno]);

  const mesesComDados = porMes.filter(m => m.temDados);
  const atual = porMes[mesAtual];
  const anterior = mesAtual > 0 ? porMes[mesAtual - 1] : null;

  const margemLiquida = atual && atual.faturamento > 0 ? (atual.resultadoLiquido / atual.faturamento) * 100 : 0;
  const crescimentoMoM = anterior && anterior.faturamento > 0 ? ((atual.faturamento - anterior.faturamento) / anterior.faturamento) * 100 : null;
  const pctFixasFaturamento = atual && atual.faturamento > 0 ? (atual.fixas / atual.faturamento) * 100 : 0;
  const ticketMedio = atual && atual.qtdVendas > 0 ? atual.faturamento / atual.qtdVendas : null;

  const mediaFixasRecente = mesesComDados.length > 0
    ? mesesComDados.reduce((s, m) => s + m.fixas, 0) / mesesComDados.length
    : 0;
  const saldoAcumulado = mesesComDados.reduce((s, m) => s + m.resultadoLiquido, 0);
  const reservaMeses = mediaFixasRecente > 0 ? saldoAcumulado / mediaFixasRecente : null;

  const maiorValor = Math.max(...porMes.map(m => m.faturamento), 1);
  const semDadosAno = mesesComDados.length === 0;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 2 }}>Visão anual — {anoAtual}</div>
      <div style={{ fontSize: 11.5, color: '#9C9A8F', marginBottom: 16 }}>Indicadores calculados com base no mês de {MESES[mesAtual].toLowerCase()}</div>

      {semDadosAno ? (
        <EmptyState text="Lance receitas e despesas para ver os indicadores anuais." />
      ) : (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 8 }}>Faturamento por mês</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90, marginBottom: 18, background: '#fff', borderRadius: 10, border: '1px solid #EFEBE0', padding: '10px 8px 6px' }}>
            {porMes.map(m => {
              const h = m.faturamento > 0 ? Math.max((m.faturamento / maiorValor) * 100, 4) : 0;
              const ativo = m.mes === mesAtual;
              return (
                <button
                  key={m.mes}
                  onClick={() => { setMesAtual(m.mes); setTela('dre'); }}
                  title={`${MESES[m.mes]}: ${formatBRL(m.faturamento)}`}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div style={{ width: '100%', height: `${h}%`, minHeight: m.temDados ? 3 : 0, borderRadius: '3px 3px 0 0', background: ativo ? '#E8A33D' : (m.temDados ? '#1F5C52' : '#F0EDE3') }} />
                  <div style={{ fontSize: 8.5, color: ativo ? '#1C2421' : '#9C9A8F', fontWeight: ativo ? 700 : 400, textAlign: 'center', marginTop: 3 }}>{MESES[m.mes].slice(0, 3)}</div>
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 8 }}>Indicadores de {MESES[mesAtual]}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <IndicadorCard
              label="Margem líquida"
              valor={atual.faturamento > 0 ? `${margemLiquida.toFixed(1)}%` : '—'}
              bom={margemLiquida >= 10}
              explicacao="Quanto sobra de lucro líquido para cada R$ 1 vendido."
            />
            <IndicadorCard
              label="Vs. mês anterior"
              valor={crescimentoMoM === null ? '—' : `${crescimentoMoM >= 0 ? '+' : ''}${crescimentoMoM.toFixed(1)}%`}
              bom={crescimentoMoM !== null && crescimentoMoM >= 0}
              neutro={crescimentoMoM === null}
              explicacao="Crescimento do faturamento comparado ao mês anterior."
            />
            <IndicadorCard
              label="Peso das fixas"
              valor={atual.faturamento > 0 ? `${pctFixasFaturamento.toFixed(1)}%` : '—'}
              bom={pctFixasFaturamento <= 30}
              explicacao="Quanto do faturamento já está comprometido com despesas fixas."
            />
            <IndicadorCard
              label="Ticket médio"
              valor={ticketMedio ? formatBRL(ticketMedio) : '—'}
              neutro
              explicacao="Valor médio por venda. Informe a quantidade de vendas ao lançar receitas."
            />
            <IndicadorCard
              label="Dias no vermelho"
              valor={`${atual.diasNegativos} dia${atual.diasNegativos === 1 ? '' : 's'}`}
              bom={atual.diasNegativos === 0}
              explicacao="Quantos dias do mês fecharam com saldo negativo."
            />
            <IndicadorCard
              label="Reserva de caixa"
              valor={reservaMeses === null ? '—' : `${reservaMeses.toFixed(1)} meses`}
              bom={reservaMeses !== null && reservaMeses >= 3}
              neutro={reservaMeses === null}
              explicacao="Quantos meses a empresa resistiria pagando só as despesas fixas, sem vender nada."
            />
          </div>
        </>
      )}
    </div>
  );
}

export function IndicadorCard({ label, valor, bom, neutro, explicacao }) {
  const cor = neutro ? '#5C5A4F' : (bom ? '#1F5C52' : '#B05A2E');
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '12px 12px 10px', border: '1px solid #EFEBE0' }}>
      <div style={{ fontSize: 11, color: '#9C9A8F', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: cor, marginBottom: 4 }}>{valor}</div>
      <div style={{ fontSize: 10, color: '#B5B2A4', lineHeight: 1.35 }}>{explicacao}</div>
    </div>
  );
}
