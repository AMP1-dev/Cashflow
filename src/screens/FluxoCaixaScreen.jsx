import React, { useState, useMemo } from 'react';
import { formatBRL, formatCompacto, daysInMonth } from '../utils/formatters';
import { LancamentoRow } from './DashboardScreen';
import { IndicadorCard } from './AnualScreen';

export function FluxoCaixa({ lancamentos, mesAtual, anoAtual, onRemove, onEditar }) {
  const dias = daysInMonth(mesAtual, anoAtual);
  const porDia = useMemo(() => {
    const acc = {};
    for (let d = 1; d <= dias; d++) acc[d] = { receita: 0, despesa: 0, itens: [] };
    lancamentos.forEach(l => {
      if (!acc[l.dia]) acc[l.dia] = { receita: 0, despesa: 0, itens: [] };
      acc[l.dia][l.tipo] += l.valor;
      acc[l.dia].itens.push(l);
    });
    return acc;
  }, [lancamentos, dias]);

  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const offsetSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const infoSelecionado = diaSelecionado ? porDia[diaSelecionado] : null;

  const indicadores = useMemo(() => {
    const diasComMovimento = Array.from({ length: dias }, (_, i) => i + 1).filter(d => porDia[d].receita > 0 || porDia[d].despesa > 0);
    const totalReceita = diasComMovimento.reduce((s, d) => s + porDia[d].receita, 0);
    const totalDespesa = diasComMovimento.reduce((s, d) => s + porDia[d].despesa, 0);

    const meio = Math.ceil(dias / 2);
    const saldo1Q = Array.from({ length: meio }, (_, i) => i + 1).reduce((s, d) => s + (porDia[d].receita - porDia[d].despesa), 0);
    const saldo2Q = Array.from({ length: dias - meio }, (_, i) => i + meio + 1).reduce((s, d) => s + (porDia[d].receita - porDia[d].despesa), 0);
    let tendenciaPct = null;
    if (saldo1Q !== 0) tendenciaPct = ((saldo2Q - saldo1Q) / Math.abs(saldo1Q)) * 100;

    const pctDiasAtivos = (diasComMovimento.length / dias) * 100;
    const mediaReceitaDia = diasComMovimento.length > 0 ? totalReceita / diasComMovimento.length : 0;
    const mediaDespesaDia = diasComMovimento.length > 0 ? totalDespesa / diasComMovimento.length : 0;

    return { tendenciaPct, pctDiasAtivos, mediaReceitaDia, mediaDespesaDia, diasAtivos: diasComMovimento.length };
  }, [porDia, dias]);

  const temDadosFluxo = indicadores.diasAtivos > 0;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>Fluxo de caixa do mês</div>
      <div style={{ fontSize: 11.5, color: '#9C9A8F', marginBottom: 12 }}>Toque em um dia para ver os detalhes</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 8 }}>
        {diasSemana.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10.5, color: '#9C9A8F', fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 16 }}>
        {Array.from({ length: offsetSemana }, (_, i) => <div key={`pad-${i}`} />)}
        {Array.from({ length: dias }, (_, i) => i + 1).map(dia => {
          const info = porDia[dia];
          const saldoDia = info.receita - info.despesa;
          const temMovimento = info.receita > 0 || info.despesa > 0;
          const selecionado = diaSelecionado === dia;
          const positivo = saldoDia >= 0;

          return (
            <button
              key={dia}
              onClick={() => setDiaSelecionado(selecionado ? null : dia)}
              style={{
                aspectRatio: '1', borderRadius: 9, padding: '5px 4px 4px', textAlign: 'left',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                cursor: 'pointer', position: 'relative',
                border: selecionado ? '1.5px solid #0F2B27' : '1px solid #EFEBE0',
                background: temMovimento ? (positivo ? '#EAF4F1' : '#FBEFE8') : '#fff',
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 600, color: temMovimento ? '#1C2421' : '#C9C5B6' }}>{dia}</span>
              {temMovimento && (
                <span style={{ fontSize: 11, fontWeight: 700, color: positivo ? '#1F5C52' : '#B05A2E', lineHeight: 1.1, wordBreak: 'break-word' }}>
                  {positivo ? '+' : '-'}{formatCompacto(Math.abs(saldoDia))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#9C9A8F', marginBottom: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: '#EAF4F1', border: '1px solid #1F5C52', display: 'inline-block' }} /> saldo positivo</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: '#FBEFE8', border: '1px solid #B05A2E', display: 'inline-block' }} /> saldo negativo</span>
      </div>

      {!diaSelecionado && (
        <>
          <GraficoReceitaDespesaPorDia porDia={porDia} dias={dias} onSelecionarDia={setDiaSelecionado} />

          {temDadosFluxo && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <IndicadorCard
                label="Tendência (1ª x 2ª quinzena)"
                valor={indicadores.tendenciaPct === null ? '—' : `${indicadores.tendenciaPct >= 0 ? '+' : ''}${indicadores.tendenciaPct.toFixed(1)}%`}
                bom={indicadores.tendenciaPct !== null && indicadores.tendenciaPct >= 0}
                neutro={indicadores.tendenciaPct === null}
                explicacao="Evolução do saldo líquido da 1ª quinzena para a 2ª."
              />
              <IndicadorCard
                label="Dias com movimento"
                valor={`${indicadores.pctDiasAtivos.toFixed(0)}%`}
                neutro
                explicacao={`${indicadores.diasAtivos} de ${dias} dias do mês tiveram lançamento.`}
              />
              <IndicadorCard
                label="Média de receita/dia"
                valor={formatBRL(indicadores.mediaReceitaDia)}
                neutro
                explicacao="Considerando apenas os dias com movimento."
              />
              <IndicadorCard
                label="Média de despesa/dia"
                valor={formatBRL(indicadores.mediaDespesaDia)}
                neutro
                explicacao="Considerando apenas os dias com movimento."
              />
            </div>
          )}
        </>
      )}

      {diaSelecionado && infoSelecionado && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Dia {diaSelecionado}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
              {infoSelecionado.receita > 0 && <span style={{ color: '#1F5C52' }}>+{formatBRL(infoSelecionado.receita)}</span>}
              {infoSelecionado.despesa > 0 && <span style={{ color: '#B05A2E' }}>-{formatBRL(infoSelecionado.despesa)}</span>}
            </div>
          </div>
          {infoSelecionado.itens.length === 0 ? (
            <div style={{ fontSize: 12.5, color: '#9C9A8F', textAlign: 'center', padding: '10px 0' }}>Sem movimento neste dia.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {infoSelecionado.itens.map(it => <LancamentoRow key={it.id} l={it} onRemove={onRemove} onEditar={onEditar} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function GraficoReceitaDespesaPorDia({ porDia, dias, onSelecionarDia }) {
  const maiorValor = Math.max(...Array.from({ length: dias }, (_, i) => {
    const info = porDia[i + 1];
    return Math.max(info.receita, info.despesa);
  }), 1);

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', padding: '14px 10px 8px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Receita x Despesa por dia</span>
        <div style={{ display: 'flex', gap: 10, fontSize: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9C9A8F' }}><span style={{ width: 7, height: 7, borderRadius: 2, background: '#1F5C52', display: 'inline-block' }} /> receita</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9C9A8F' }}><span style={{ width: 7, height: 7, borderRadius: 2, background: '#D8A06A', display: 'inline-block' }} /> despesa</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 110 }}>
        {Array.from({ length: dias }, (_, i) => i + 1).map(dia => {
          const info = porDia[dia];
          const hReceita = info.receita > 0 ? Math.max((info.receita / maiorValor) * 100, 3) : 0;
          const hDespesa = info.despesa > 0 ? Math.max((info.despesa / maiorValor) * 100, 3) : 0;
          return (
            <button
              key={dia}
              onClick={() => onSelecionarDia(dia)}
              title={`Dia ${dia}`}
              style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
            >
              <div style={{ position: 'absolute', bottom: 0, left: '15%', right: '15%', height: `${hDespesa}%`, background: '#D8A06A', borderRadius: '2px 2px 0 0', opacity: 0.85 }} />
              <div style={{ position: 'absolute', bottom: 0, left: '30%', right: '30%', height: `${hReceita}%`, background: '#1F5C52', borderRadius: '2px 2px 0 0' }} />
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
        {Array.from({ length: dias }, (_, i) => i + 1).map(dia => (
          <div key={dia} style={{ flex: 1, textAlign: 'center', fontSize: 7, color: '#C9C5B6' }}>
            {(dia === 1 || dia % 5 === 0) ? dia : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
