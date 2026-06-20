import { ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/UIComponents';
import { MESES } from '../utils/constants';
import { formatBRL, formatCompactoBRL } from '../utils/formatters';

export function DREScreen({ lancamentos, mesAtual }) {
  const calc = useMemo(() => {
    const receitas = lancamentos.filter(l => l.tipo === 'receita');
    const despesasCmv = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'cmv');
    const despesasVariaveis = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'variavel');
    const despesasFixas = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'fixa');
    const despesasFinanceiras = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'financeira');

    const faturamento = receitas.reduce((s, l) => s + l.valor, 0);
    const cmv = despesasCmv.reduce((s, l) => s + l.valor, 0);
    const variaveis = despesasVariaveis.reduce((s, l) => s + l.valor, 0);
    const fixas = despesasFixas.reduce((s, l) => s + l.valor, 0);
    const financeiras = despesasFinanceiras.reduce((s, l) => s + l.valor, 0);

    const resultadoComVendas = faturamento - cmv;
    const margemContribuicao = resultadoComVendas - variaveis;
    const resultadoOperacional = margemContribuicao - fixas;
    const resultadoLiquido = resultadoOperacional - financeiras;
    const pctMC = faturamento > 0 ? margemContribuicao / faturamento : 0;
    const pontoEquilibrio = pctMC > 0 ? fixas / pctMC : 0;

    return {
      faturamento, cmv, variaveis, fixas, financeiras,
      resultadoComVendas, margemContribuicao, resultadoOperacional, resultadoLiquido, pontoEquilibrio, pctMC,
      itensReceitas: receitas, itensCmv: despesasCmv, itensVariaveis: despesasVariaveis, itensFixas: despesasFixas, itensFinanceiras: despesasFinanceiras,
    };
  }, [lancamentos]);

  const semDados = calc.faturamento === 0 && calc.cmv === 0 && calc.variaveis === 0 && calc.fixas === 0;
  const fat = calc.faturamento;
  const pct = (v) => fat > 0 ? (v / fat) * 100 : 0;

  const [linhaAberta, setLinhaAberta] = useState(null);
  function toggleLinha(id) { setLinhaAberta(prev => prev === id ? null : id); }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 2 }}>DRE — {MESES[mesAtual]}</div>
      <div style={{ fontSize: 11.5, color: '#9C9A8F', marginBottom: 16 }}>Gerada automaticamente · % sobre o faturamento · toque numa linha para ver os lançamentos</div>

      {semDados && <EmptyState text="Lance receitas e despesas neste mês para ver a DRE calculada." />}

      {!semDados && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DRELine label="Faturamento" valor={calc.faturamento} pct={pct(calc.faturamento)} destaque
            itens={calc.itensReceitas} aberto={linhaAberta === 'faturamento'} onToggle={() => toggleLinha('faturamento')} fat={fat} />
          <DRELine label="(–) CMV" valor={-calc.cmv} pct={pct(-calc.cmv)}
            itens={calc.itensCmv} aberto={linhaAberta === 'cmv'} onToggle={() => toggleLinha('cmv')} fat={fat} negativo />
          <DRELine label="Resultado com vendas" valor={calc.resultadoComVendas} pct={pct(calc.resultadoComVendas)} sub />
          <DRELine label="(–) Despesas variáveis" valor={-calc.variaveis} pct={pct(-calc.variaveis)}
            itens={calc.itensVariaveis} aberto={linhaAberta === 'variaveis'} onToggle={() => toggleLinha('variaveis')} fat={fat} negativo />
          <DRELine label="Margem de contribuição" valor={calc.margemContribuicao} pct={pct(calc.margemContribuicao)} sub destaque />
          <DRELine label="(–) Despesas fixas" valor={-calc.fixas} pct={pct(-calc.fixas)}
            itens={calc.itensFixas} aberto={linhaAberta === 'fixas'} onToggle={() => toggleLinha('fixas')} fat={fat} negativo />
          <DRELine label="Resultado operacional" valor={calc.resultadoOperacional} pct={pct(calc.resultadoOperacional)} sub />
          <DRELine label="(–) Despesas financeiras" valor={-calc.financeiras} pct={pct(-calc.financeiras)}
            itens={calc.itensFinanceiras} aberto={linhaAberta === 'financeiras'} onToggle={() => toggleLinha('financeiras')} fat={fat} negativo />

          <div style={{ background: '#0F2B27', borderRadius: 14, padding: 18, marginTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 12, color: '#9FBDB5' }}>Resultado líquido do mês</div>
              <div style={{ fontSize: 12, color: '#9FBDB5' }}>{pct(calc.resultadoLiquido).toFixed(1)}%</div>
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: calc.resultadoLiquido >= 0 ? '#9FE0C8' : '#F0A0A0', marginTop: 4 }}>
              {formatBRL(calc.resultadoLiquido)}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #EFEBE0', marginTop: 4 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 6 }}>Ponto de equilíbrio</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1C2421' }}>{formatBRL(calc.pontoEquilibrio)}</div>
            <div style={{ fontSize: 11.5, color: '#9C9A8F', marginTop: 4 }}>Quanto a empresa precisa faturar no mês para não ter prejuízo nem lucro.</div>
          </div>

          <GraficoComposicaoDRE calc={calc} />
        </div>
      )}
    </div>
  );
}

export function GraficoComposicaoDRE({ calc }) {
  const barras = [
    { label: 'Faturamento', valor: calc.faturamento, cor: '#0F2B27' },
    { label: 'CMV', valor: calc.cmv, cor: '#B05A2E' },
    { label: 'Variáveis', valor: calc.variaveis, cor: '#8A6D1A' },
    { label: 'Fixas', valor: calc.fixas, cor: '#C9A063' },
    { label: 'Financeiras', valor: calc.financeiras, cor: '#7A2E3D' },
    { label: 'Resultado', valor: calc.resultadoLiquido, cor: calc.resultadoLiquido >= 0 ? '#1F5C52' : '#B05A2E' },
  ];
  const maiorValor = Math.max(...barras.map(b => Math.abs(b.valor)), 1);

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 12px 10px', border: '1px solid #EFEBE0', marginTop: 4 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 12 }}>Composição do resultado</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
        {barras.map(b => {
          const h = b.valor !== 0 ? Math.max((Math.abs(b.valor) / maiorValor) * 100, 3) : 0;
          return (
            <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: 9, color: '#9C9A8F', marginBottom: 3, textAlign: 'center' }}>{formatCompactoBRL(b.valor)}</div>
              <div style={{ width: '100%', maxWidth: 26, height: `${h}%`, background: b.cor, borderRadius: '3px 3px 0 0' }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        {barras.map(b => (
          <div key={b.label} style={{ flex: 1, textAlign: 'center', fontSize: 8.5, color: '#9C9A8F', lineHeight: 1.2 }}>{b.label}</div>
        ))}
      </div>
    </div>
  );
}

export function DRELine({ label, valor, pct, destaque, sub, itens, aberto, onToggle, fat, negativo }) {
  const valorNegativo = valor < 0;
  const expansivel = !!onToggle;

  return (
    <div>
      <div
        onClick={expansivel ? onToggle : undefined}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: sub ? '8px 0' : '4px 0', borderTop: sub ? '1px solid #E5E0D5' : 'none', borderBottom: sub ? '1px solid #E5E0D5' : 'none',
          cursor: expansivel ? 'pointer' : 'default',
        }}
      >
        <span style={{ fontSize: destaque ? 14 : 13, fontWeight: destaque ? 600 : 400, color: destaque ? '#1C2421' : '#5C5A4F', display: 'flex', alignItems: 'center', gap: 5 }}>
          {label}
          {expansivel && <ChevronRight size={13} color="#C9C5B6" style={{ transform: aberto ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          {typeof pct === 'number' && (
            <span style={{ fontSize: destaque ? 12 : 11, color: '#9C9A8F', minWidth: 42, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
          )}
          <span style={{ fontSize: destaque ? 15 : 13.5, fontWeight: destaque ? 700 : 500, color: valorNegativo ? '#B05A2E' : '#1C2421', minWidth: 78, textAlign: 'right' }}>{formatBRL(valor)}</span>
        </div>
      </div>

      {expansivel && aberto && (
        <div style={{ padding: '4px 0 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {itens.length === 0 ? (
            <div style={{ fontSize: 11.5, color: '#C9C5B6', padding: '6px 0' }}>Nenhum lançamento nesta categoria.</div>
          ) : (
            itens.map(it => {
              const pctItem = fat > 0 ? (it.valor / fat) * 100 : 0;
              return (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#FBFAF6', borderRadius: 8, fontSize: 12 }}>
                  <span style={{ color: '#5C5A4F' }}>{it.descricao} <span style={{ color: '#C9C5B6', fontSize: 10.5 }}>· dia {it.dia}</span></span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 10.5, color: '#9C9A8F' }}>{pctItem.toFixed(1)}%</span>
                    <span style={{ fontWeight: 600, color: negativo ? '#B05A2E' : '#1F5C52' }}>{formatBRL(it.valor)}</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
