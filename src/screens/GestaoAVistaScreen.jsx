import { ArrowLeft, Printer, Target, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MESES } from '../utils/constants';
import { formatBRL } from '../utils/formatters';

export function GestaoAVistaScreen({ lancamentosAno, mesAtual, anoAtual, pctCmv = 0, onVoltar }) {
  const [lucroDesejadoStr, setLucroDesejadoStr] = useState('10000');

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
    
    // Se não tiver faturamento, estimar uma margem de contribuição de 30% para a matemática funcionar inicial
    const pctMC = faturamento > 0 ? margemContribuicao / faturamento : 0.30;
    
    const lucroLiquido = margemContribuicao - custosFixosTotais;

    return {
      faturamento,
      custosFixosTotais,
      pctMC,
      lucroLiquido
    };
  }, [lancamentosMes]);

  // Lógica de Metas
  const lucroDesejado = parseFloat(lucroDesejadoStr) || 0;
  
  // Fórmula: Faturamento Necessário = (Custos Fixos + Lucro Desejado) / % Margem de Contribuição
  const faturamentoMeta = calcAtual.pctMC > 0 
    ? (calcAtual.custosFixosTotais + lucroDesejado) / calcAtual.pctMC 
    : 0;

  // Dias no mês para a meta diária
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
      
      dados.push({
        mesLabel: MESES[m].substring(0, 3),
        faturamento: fat,
        lucro: lucro
      });
    }
    return dados;
  }, [lancamentosAno, mesAtual, anoAtual]);

  const maxFatHist = Math.max(...historico.map(h => h.faturamento), faturamentoMeta, 1);

  return (
    <div style={{ padding: 16, background: '#FAF8F3', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Botões de Ação - Não serão impressos */}
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

      {/* Configuração de Meta - Não será impresso */}
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
            onChange={(e) => setLucroDesejadoStr(e.target.value)}
            style={{ padding: '12px', borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 16, fontWeight: 600, background: '#FBFAF6' }}
          />
          <div style={{ fontSize: 11, color: '#9C9A8F', marginTop: 4 }}>
            A meta diária será calculada com base no seu custo fixo atual e margem de contribuição.
          </div>
        </div>
      </div>

      {/* ÁREA DE IMPRESSÃO - GESTÃO À VISTA */}
      <div id="print-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 32, color: '#0F2B27', fontFamily: 'Georgia, serif' }}>Gestão à Vista</h1>
          <h2 style={{ margin: '4px 0 0 0', fontSize: 18, color: '#8A6D1A', fontWeight: 500 }}>{MESES[mesAtual]} de {anoAtual}</h2>
        </div>

        {/* Blocos Principais */}
        <div className="gestao-row">
          
          <div style={{ flex: 1, background: '#0F2B27', borderRadius: 16, padding: 24, color: '#FAF8F3', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 16, color: '#9FBDB5', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Meta Diária de Vendas</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 42, color: '#9FE0C8', fontWeight: 600 }}>
              {formatBRL(metaDiaria)}
            </div>
            <div style={{ fontSize: 13, color: '#CFEEE2', marginTop: 8 }}>
              / {diasNoMes} dias
            </div>
          </div>

          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 24, border: '2px solid #EFEBE0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 14, color: '#5C5A4F', marginBottom: 4 }}>Meta de Faturamento (Mês)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1C2421', marginBottom: 16 }}>{formatBRL(faturamentoMeta)}</div>
            
            <div style={{ fontSize: 14, color: '#5C5A4F', marginBottom: 4 }}>Faturamento Atual</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1F5C52', marginBottom: 12 }}>{formatBRL(calcAtual.faturamento)}</div>

            {/* Barra de Progresso */}
            <div style={{ height: 16, background: '#F0EDE3', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(pctAtingido, 100)}%`, background: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E', borderRadius: 8, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: pctAtingido >= 100 ? '#1F5C52' : '#B05A2E', marginTop: 8, textAlign: 'right' }}>
              {pctAtingido.toFixed(1)}% Atingido
            </div>
          </div>

        </div>

        {/* Linha de Indicadores Secundários */}
        <div className="gestao-row">
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 12, color: '#9C9A8F', textTransform: 'uppercase' }}>Lucro Atual</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: calcAtual.lucroLiquido >= 0 ? '#1F5C52' : '#B05A2E' }}>
              {formatBRL(calcAtual.lucroLiquido)}
            </div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 12, color: '#9C9A8F', textTransform: 'uppercase' }}>Lucro Desejado</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#8A6D1A' }}>
              {formatBRL(lucroDesejado)}
            </div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 12, color: '#9C9A8F', textTransform: 'uppercase' }}>Margem de Contribuição</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#1C2421' }}>
              {(calcAtual.pctMC * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Gráfico Histórico */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #EFEBE0', flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1C2421', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={20} color="#1F5C52" />
            Evolução Recente (Faturamento)
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 160, gap: 20 }}>
            {historico.map((h, i) => {
              const heightPct = (h.faturamento / maxFatHist) * 100;
              const isAtual = i === historico.length - 1;
              return (
                <div key={h.mesLabel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#5C5A4F' }}>{formatBRL(h.faturamento)}</div>
                  <div style={{ width: '100%', maxWidth: 60, height: `${Math.max(heightPct, 5)}%`, background: isAtual ? '#1F5C52' : '#C9C5B6', borderRadius: '6px 6px 0 0' }} />
                  <div style={{ fontSize: 14, fontWeight: isAtual ? 700 : 500, color: isAtual ? '#1F5C52' : '#9C9A8F' }}>{h.mesLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
