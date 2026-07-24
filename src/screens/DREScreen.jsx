import { ChevronRight, PackageCheck, Settings2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { EmptyState } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { MESES } from '../utils/constants';
import { formatBRL, formatCompactoBRL } from '../utils/formatters';
import * as XLSX from 'xlsx';

export function DREScreen({ lancamentos, lancamentosAno, mesAtual, anoAtual, empresaId, onSalvarEstoque }) {

  // ─── CMV Config (salvo no Supabase por mês) ───────────────────────────────
  const [pctCmvConfig, setPctCmvConfig] = useState(0);
  const [pctCmvStr, setPctCmvStr] = useState('');
  const [modalCmvAberto, setModalCmvAberto] = useState(false);
  const [salvandoCmv, setSalvandoCmv] = useState(false);

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
        const v = data?.pct_cmv ?? 0;
        setPctCmvConfig(v);
        setPctCmvStr(v > 0 ? String(v) : '');
      });
  }, [empresaId, mesAtual, anoAtual]);

  async function salvarPctCmv() {
    const pct = parseFloat((pctCmvStr || '0').replace(',', '.')) || 0;
    setSalvandoCmv(true);
    const { error } = await supabase.from('cmv_config').upsert({
      empresa_id: empresaId,
      mes: mesAtual,
      ano: anoAtual,
      pct_cmv: pct,
    }, { onConflict: 'empresa_id,mes,ano' });
    
    if (error) {
      alert('Erro ao salvar % CMV: ' + error.message);
    } else {
      setPctCmvConfig(pct);
      setModalCmvAberto(false);
    }
    setSalvandoCmv(false);
  }

  // ─── Cálculo DRE ─────────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const receitas    = lancamentos.filter(l => l.tipo === 'receita');
    const despesasCmv = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'cmv');
    const despesasVar = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'variavel');
    const despesasFix = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'fixa');
    const despesasFin = lancamentos.filter(l => l.tipo === 'despesa' && l.categoria === 'financeira');
    // fornecedor não entra no DRE — aparece só no Fluxo de Caixa

    const faturamento = receitas.reduce((s, l) => s + l.valor, 0);
    const cmvCompras  = despesasCmv.reduce((s, l) => s + l.valor, 0);

    // Estoque (Modo 1)
    const lInicial = lancamentos.find(l => l.tipo === 'estoque' && l.categoria === 'inicial');
    const lFinal   = lancamentos.find(l => l.tipo === 'estoque' && l.categoria === 'final');
    const estoqueInicial = lInicial ? lInicial.valor : null;
    const estoqueFinal   = lFinal   ? lFinal.valor   : null;
    const temEstoque     = estoqueInicial !== null || estoqueFinal !== null;

    // Hierarquia CMV
    let cmv, modoCmv;
    if (temEstoque) {
      cmv = (estoqueInicial || 0) + cmvCompras - (estoqueFinal || 0);
      modoCmv = 'estoque';
    } else if (pctCmvConfig > 0) {
      cmv = faturamento * (pctCmvConfig / 100);
      modoCmv = 'estimado';
    } else if (cmvCompras > 0) {
      cmv = cmvCompras;
      modoCmv = 'lancamentos';
    } else {
      cmv = 0;
      modoCmv = 'zero';
    }

    const variaveis = despesasVar.reduce((s, l) => s + l.valor, 0);
    const fixas     = despesasFix.reduce((s, l) => s + l.valor, 0);
    const financeiras = despesasFin.reduce((s, l) => s + l.valor, 0);

    const resultadoComVendas  = faturamento - cmv;
    const margemContribuicao  = resultadoComVendas - variaveis;
    const resultadoOperacional = margemContribuicao - fixas;
    const resultadoLiquido    = resultadoOperacional - financeiras;
    const pctMC = faturamento > 0 ? margemContribuicao / faturamento : 0;
    const pontoEquilibrio = pctMC > 0 ? fixas / pctMC : 0;
    const pontoEquilibrioFinanceiro = pctMC > 0 ? (fixas + financeiras) / pctMC : 0;

    return {
      faturamento, cmv, cmvCompras, modoCmv, variaveis, fixas, financeiras,
      resultadoComVendas, margemContribuicao, resultadoOperacional, resultadoLiquido,
      pontoEquilibrio, pontoEquilibrioFinanceiro, pctMC,
      itensReceitas: receitas, itensCmv: despesasCmv,
      itensVariaveis: despesasVar, itensFixas: despesasFix, itensFinanceiras: despesasFin,
      estoqueInicial, estoqueFinal, temEstoque,
    };
  }, [lancamentos, pctCmvConfig]);

  const semDados = calc.faturamento === 0 && calc.cmv === 0 && calc.variaveis === 0 && calc.fixas === 0;
  const fat = calc.faturamento;
  const pct = (v) => fat > 0 ? (v / fat) * 100 : 0;

  const [linhaAberta, setLinhaAberta] = useState(null);
  function toggleLinha(id) { setLinhaAberta(prev => prev === id ? null : id); }

  const [modalEstoqueAberto, setModalEstoqueAberto] = useState(false);
  const [valEstInicial, setValEstInicial] = useState('');
  const [valEstFinal, setValEstFinal] = useState('');

  const estoqueFinalMesAnterior = useMemo(() => {
    if (!lancamentosAno) return null;
    const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
    const anoDoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
    const lancamentoAnt = lancamentosAno.find(l => l.mes === mesAnterior && l.ano === anoDoMesAnterior && l.tipo === 'estoque' && l.categoria === 'final');
    return lancamentoAnt ? lancamentoAnt.valor : null;
  }, [lancamentosAno, mesAtual, anoAtual]);

  useEffect(() => {
    if (modalEstoqueAberto) {
      const defaultInicial = calc.estoqueInicial !== null ? calc.estoqueInicial : estoqueFinalMesAnterior;
      setValEstInicial(defaultInicial !== null ? String(defaultInicial) : '');
      setValEstFinal(calc.estoqueFinal !== null ? String(calc.estoqueFinal) : '');
    }
  }, [modalEstoqueAberto, calc.estoqueInicial, calc.estoqueFinal, estoqueFinalMesAnterior]);

  function handleSalvarEstoque() {
    onSalvarEstoque(valEstInicial, valEstFinal);
    setModalEstoqueAberto(false);
  }

  function exportarDREParaExcel() {
    const dadosExcel = [];
    
    // Resumo DRE
    dadosExcel.push({ Data: 'RESUMO DRE', Descrição: '', Categoria: '', Tipo: '', Valor: '' });
    dadosExcel.push({ Data: 'Faturamento', Descrição: '', Categoria: '', Tipo: 'Receita', Valor: calc.faturamento });
    dadosExcel.push({ Data: 'CMV', Descrição: '', Categoria: '', Tipo: 'Despesa', Valor: calc.cmv });
    dadosExcel.push({ Data: 'Despesas Variáveis', Descrição: '', Categoria: '', Tipo: 'Despesa', Valor: calc.variaveis });
    dadosExcel.push({ Data: 'Despesas Fixas', Descrição: '', Categoria: '', Tipo: 'Despesa', Valor: calc.fixas });
    dadosExcel.push({ Data: 'Despesas Financeiras', Descrição: '', Categoria: '', Tipo: 'Despesa', Valor: calc.financeiras });
    dadosExcel.push({ Data: 'Resultado Líquido', Descrição: '', Categoria: '', Tipo: '', Valor: calc.resultadoLiquido });
    dadosExcel.push({ Data: '', Descrição: '', Categoria: '', Tipo: '', Valor: '' });
    
    // Lançamentos Detalhados
    dadosExcel.push({ Data: 'LANÇAMENTOS DETALHADOS', Descrição: '', Categoria: '', Tipo: '', Valor: '' });
    
    // Helper to add items
    const addItems = (items) => {
        items.forEach(it => {
            dadosExcel.push({
                Data: `Dia ${it.dia}`,
                Descrição: it.descricao,
                Categoria: it.categoria,
                Subcategoria: it.subcategoria || '',
                Tipo: it.tipo,
                Valor: it.valor
            });
        });
    };
    
    addItems(calc.itensReceitas);
    addItems(calc.itensCmv);
    addItems(calc.itensVariaveis);
    addItems(calc.itensFixas);
    addItems(calc.itensFinanceiras);
    
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `DRE_${MESES[mesAtual]}`);
    XLSX.writeFile(workbook, `DRE_${MESES[mesAtual]}_${anoAtual}.xlsx`);
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 2 }}>DRE — {MESES[mesAtual]}</div>
      <div style={{ fontSize: 11.5, color: '#9C9A8F', marginBottom: 16 }}>Gerada automaticamente · % sobre o faturamento · toque numa linha para ver os lançamentos</div>

      {semDados && <EmptyState text="Lance receitas e despesas neste mês para ver a DRE calculada." />}

      {!semDados && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button onClick={() => setModalEstoqueAberto(true)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid #1F5C52', background: '#D9EBE6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#1F5C52' }}>
              <PackageCheck size={16} />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Apurar por Estoque</span>
            </button>
            <button onClick={() => { setPctCmvStr(pctCmvConfig > 0 ? String(pctCmvConfig) : ''); setModalCmvAberto(true); }} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid #4A3B8A', background: '#E5E0F5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#4A3B8A' }}>
              <Settings2 size={16} />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Configurar % CMV</span>
            </button>
            <button onClick={exportarDREParaExcel} style={{ padding: '0 16px', borderRadius: 12, border: '1px solid #C9C5B6', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5C5A4F', fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>
              Exportar Excel
            </button>
          </div>

          {/* Aviso: CMV zero e sem configuração */}
          {calc.modoCmv === 'zero' && (
            <div style={{ background: '#FBF3E5', border: '1px solid #E8C896', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
              <div style={{ fontSize: 12, color: '#8A6D1A', lineHeight: 1.5 }}>
                <strong>CMV não calculado.</strong> Lance compras como <strong>CMV</strong>, use o botão <strong>"Apurar por Estoque"</strong>, ou configure um <strong>% estimado</strong> do seu custo de mercadoria.
              </div>
            </div>
          )}

          {/* Composição do CMV */}
          {calc.modoCmv !== 'zero' && (
            <div style={{ background: '#F5E4D8', border: '1px solid #E8C896', borderRadius: 12, padding: '10px 12px', fontSize: 11.5, color: '#7A3A1A', lineHeight: 1.6 }}>
              <strong>Composição do CMV</strong>
              {calc.modoCmv === 'estoque' && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estoque Inicial:</span><strong>{formatBRL(calc.estoqueInicial || 0)}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>(+) Compras (CMV):</span><strong>{formatBRL(calc.cmvCompras)}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>(–) Estoque Final:</span><strong>{formatBRL(calc.estoqueFinal || 0)}</strong></div>
                </div>
              )}
              {calc.modoCmv === 'lancamentos' && (
                <div style={{ marginTop: 4 }}>
                  <div>Soma dos lançamentos CMV do mês: <strong>{formatBRL(calc.cmvCompras)}</strong></div>
                </div>
              )}
              {calc.modoCmv === 'estimado' && (
                <div style={{ marginTop: 4 }}>
                  <div>Estimado: {pctCmvConfig}% do faturamento de <strong>{formatBRL(fat)}</strong></div>
                </div>
              )}
              <div style={{ borderTop: '1px solid #D9B8A8', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Total CMV:</span><strong>{formatBRL(calc.cmv)}</strong>
              </div>
            </div>
          )}

          <DRELine label="Faturamento" valor={calc.faturamento} pct={pct(calc.faturamento)} destaque itens={calc.itensReceitas} aberto={linhaAberta === 'faturamento'} onToggle={() => toggleLinha('faturamento')} fat={fat} />
          <DRELine label="(–) CMV" valor={-calc.cmv} pct={pct(-calc.cmv)} itens={calc.itensCmv} aberto={linhaAberta === 'cmv'} onToggle={() => toggleLinha('cmv')} fat={fat} negativo />
          <DRELine label="Resultado com vendas" valor={calc.resultadoComVendas} pct={pct(calc.resultadoComVendas)} sub />
          <DRELine label="(–) Despesas variáveis" valor={-calc.variaveis} pct={pct(-calc.variaveis)} itens={calc.itensVariaveis} aberto={linhaAberta === 'variavel'} onToggle={() => toggleLinha('variavel')} fat={fat} negativo />
          <DRELine label="Margem de contribuição" valor={calc.margemContribuicao} pct={pct(calc.margemContribuicao)} sub />
          <DRELine label="(–) Despesas fixas" valor={-calc.fixas} pct={pct(-calc.fixas)} itens={calc.itensFixas} aberto={linhaAberta === 'fixa'} onToggle={() => toggleLinha('fixa')} fat={fat} negativo />
          <DRELine label="Resultado operacional" valor={calc.resultadoOperacional} pct={pct(calc.resultadoOperacional)} sub />
          <DRELine label="(–) Despesas financeiras" valor={-calc.financeiras} pct={pct(-calc.financeiras)} itens={calc.itensFinanceiras} aberto={linhaAberta === 'financeira'} onToggle={() => toggleLinha('financeira')} fat={fat} negativo />
          <DRELine label="Resultado líquido do mês" valor={calc.resultadoLiquido} pct={pct(calc.resultadoLiquido)} sub destaque />

          {/* Ponto de equilíbrio */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #EFEBE0', marginTop: 4 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 10 }}>Ponto de equilíbrio</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 2 }}>Operacional</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1C2421' }}>{formatBRL(calc.pontoEquilibrio)}</div>
                <div style={{ fontSize: 11, color: '#9C9A8F', marginTop: 3 }}>Faturamento mínimo para cobrir custos fixos e variáveis (sem contar despesas financeiras).</div>
              </div>
              {calc.financeiras > 0 && (
                <>
                  <div style={{ height: 1, background: '#F0EDE3' }} />
                  <div>
                    <div style={{ fontSize: 10.5, color: '#7A2E3D', marginBottom: 2 }}>Financeiro</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#1C2421' }}>{formatBRL(calc.pontoEquilibrioFinanceiro)}</div>
                    <div style={{ fontSize: 11, color: '#9C9A8F', marginTop: 3 }}>Faturamento mínimo incluindo juros, financiamentos e encargos bancários.</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <GraficoComposicaoDRE calc={calc} />
        </div>
      )}

      {/* Modal Estoque */}
      {modalEstoqueAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#1C2421' }}>Inventário de Estoque</h3>
            <p style={{ fontSize: 13, color: '#5C5A4F', marginBottom: 20, lineHeight: 1.4 }}>
              O CMV oficial é calculado pela fórmula: <br /><strong>Estoque Inicial + Compras - Estoque Final.</strong><br />Deixe em branco para usar a estimativa automática.
            </p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>Estoque Inicial (R$)</label>
              <input type="number" value={valEstInicial} onChange={e => setValEstInicial(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 16, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>Estoque Final (R$)</label>
              <input type="number" value={valEstFinal} onChange={e => setValEstFinal(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 16, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModalEstoqueAberto(false)} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #D1CFC7', background: '#fff', color: '#5C5A4F', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSalvarEstoque} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', background: '#1F5C52', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Salvar e Apurar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal % CMV */}
      {modalCmvAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#1C2421' }}>% CMV Estimado — {MESES[mesAtual]}</h3>
            <p style={{ fontSize: 13, color: '#5C5A4F', marginBottom: 6, lineHeight: 1.5 }}>
              Informe o percentual médio que o custo de mercadoria representa no seu faturamento. Esse valor é salvo para este mês.
            </p>
            <div style={{ background: '#F0EDE3', borderRadius: 10, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#7A7868', lineHeight: 1.5 }}>
              Referências: Alimentação 28–40% · Varejo 45–65% · Fabricação 35–50% · Serviços 10–25%
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>% do Custo de Mercadoria</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={pctCmvStr}
                  onChange={e => setPctCmvStr(e.target.value)}
                  placeholder="Ex: 35"
                  min="0" max="100"
                  style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 18, fontWeight: 600, boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#9C9A8F' }}>%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModalCmvAberto(false)} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #D1CFC7', background: '#fff', color: '#5C5A4F', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={salvarPctCmv} disabled={salvandoCmv} style={{ flex: 2, padding: 12, borderRadius: 8, border: 'none', background: '#4A3B8A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                {salvandoCmv ? 'Salvando...' : 'Salvar % CMV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GraficoComposicaoDRE({ calc }) {
  const fat = calc.faturamento;
  const pct = (v) => fat > 0 ? (v / fat) * 100 : 0;

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
              <div style={{ fontSize: 9.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 3, textAlign: 'center' }}>{pct(b.valor).toFixed(1)}%</div>
              <div style={{ width: '100%', maxWidth: 30, height: `${h}%`, background: b.cor, borderRadius: '3px 3px 0 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4, boxSizing: 'border-box' }}>
                <span style={{ fontSize: 7.5, color: '#fff', fontWeight: 600, writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
                  {formatCompactoBRL(b.valor)}
                </span>
              </div>
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
