import { MESES } from './constants';
import { formatBRL } from './formatters';

/**
 * Apura os indicadores analíticos de um determinado mês a partir do histórico de lançamentos
 */
export function apurarMetricasMes(lancamentos, mes, ano, pctCmvPadrao = 0) {
  const lista = (lancamentos || []).filter(l => {
    const mesRef = l.mesCompetencia !== undefined ? l.mesCompetencia : l.mes;
    const anoRef = l.anoCompetencia !== undefined ? l.anoCompetencia : l.ano;
    return mesRef === mes && (anoRef === undefined || anoRef === ano);
  });

  const receitas = lista.filter(l => l.tipo === 'receita');
  const despesasCmv = lista.filter(l => l.tipo === 'despesa' && l.categoria === 'cmv');
  const despesasVar = lista.filter(l => l.tipo === 'despesa' && l.categoria === 'variavel');
  const despesasFix = lista.filter(l => l.tipo === 'despesa' && l.categoria === 'fixa');
  const despesasFin = lista.filter(l => l.tipo === 'despesa' && l.categoria === 'financeira');

  const faturamento = receitas.reduce((s, l) => s + (l.valor || 0), 0);
  const cmvCompras = despesasCmv.reduce((s, l) => s + (l.valor || 0), 0);
  const variaveis = despesasVar.reduce((s, l) => s + (l.valor || 0), 0);
  const fixas = despesasFix.reduce((s, l) => s + (l.valor || 0), 0);
  const financeiras = despesasFin.reduce((s, l) => s + (l.valor || 0), 0);

  // CMV DRE (Estimado por % ou Compras)
  let cmv = 0;
  if (pctCmvPadrao > 0) {
    cmv = faturamento * (pctCmvPadrao / 100);
  } else if (cmvCompras > 0) {
    cmv = cmvCompras;
  }

  const margemContribuicao = faturamento - cmv - variaveis;
  const pctMC = faturamento > 0 ? (margemContribuicao / faturamento) * 100 : 0;
  const pontoEquilibrio = pctMC > 0 ? fixas / (pctMC / 100) : 0;
  const lucroDRE = margemContribuicao - fixas - financeiras;
  const totalDespesasPagas = fixas + variaveis + cmvCompras + financeiras;
  const saldoCaixa = faturamento - totalDespesasPagas;
  const diferencaEstoque = cmvCompras - cmv; // positivo se comprou mais do que consumiu

  const pctAtingidoPE = pontoEquilibrio > 0 ? (faturamento / pontoEquilibrio) * 100 : 0;
  const folgaPE = faturamento - pontoEquilibrio;

  return {
    mes,
    ano,
    nomeMes: MESES[mes] || `Mês ${mes + 1}`,
    temDados: lista.length > 0,
    faturamento,
    cmv,
    cmvCompras,
    diferencaEstoque,
    variaveis,
    fixas,
    financeiras,
    margemContribuicao,
    pctMC,
    pontoEquilibrio,
    pctAtingidoPE,
    folgaPE,
    lucroDRE,
    margemLiquidaPct: faturamento > 0 ? (lucroDRE / faturamento) * 100 : 0,
    totalDespesasPagas,
    saldoCaixa,
  };
}

/**
 * Gera a tradução executiva do mês em linguagem humana
 */
export function gerarDiagnosticoMensal(m, empresaNome = 'Empresa') {
  if (!m || !m.temDados) {
    return {
      titulo: `Sem lançamentos em ${m.nomeMes}`,
      resumo: `Não foram encontrados lançamentos de receitas ou despesas em ${m.nomeMes}.`,
      textoWhatsApp: `Olá! Não constam lançamentos registrados para ${m.nomeMes}.`,
    };
  }

  const atingiuPE = m.pctAtingidoPE >= 100;
  const deuLucroDRE = m.lucroDRE > 0;
  const caixaPositivo = m.saldoCaixa >= 0;

  // Análise da discrepância Caixa vs DRE
  let explicacaoEstoque = '';
  if (m.diferencaEstoque > 100) {
    explicacaoEstoque = `Você pagou ${formatBRL(m.cmvCompras)} em mercadorias/fornecedores, mas consumiu ${formatBRL(m.cmv)} nas vendas. Essa diferença de ${formatBRL(m.diferencaEstoque)} saiu do caixa e ficou estocada (em produtos) ou quitou compras a prazo passadas.`;
  } else if (m.diferencaEstoque < -100) {
    explicacaoEstoque = `Você consumiu ${formatBRL(m.cmv)} em mercadorias, mas desembolsou apenas ${formatBRL(m.cmvCompras)} em compras no mês. Isso significa que girou o estoque que já tinha em casa, aliviando o caixa!`;
  } else {
    explicacaoEstoque = `As compras de mercadorias no mês (${formatBRL(m.cmvCompras)}) foram equilibradas com o consumo real das vendas.`;
  }

  // Montagem do texto estruturado para WhatsApp
  const textoWhatsApp = 
`📊 *DIAGNÓSTICO FINANCEIRO EXECUTIVO — ${m.nomeMes.toUpperCase()}/${m.ano}*
🏢 *${empresaNome}*

Olá! Segue a tradução analítica dos resultados de *${m.nomeMes}*:

🎯 *1. PONTO DE EQUILÍBRIO (${m.pctAtingidoPE.toFixed(1)}% ALCANÇADO)*
• Meta mínima de faturamento (PE): *${formatBRL(m.pontoEquilibrio)}*
• Faturamento Realizado: *${formatBRL(m.faturamento)}*
• Status: *${atingiuPE ? `✅ Meta superada com folga de +${formatBRL(m.folgaPE)}` : `⚠️ Faltaram ${formatBRL(Math.abs(m.folgaPE))} para cobrir custos fixos`}*
• Margem de Contribuição: *${m.pctMC.toFixed(1)}%* (${formatBRL(m.margemContribuicao)})

📈 *2. RESULTADO OPERACIONAL (DRE - LUCRO ECONÔMICO)*
• Faturamento Bruto: *${formatBRL(m.faturamento)}*
• (-) Custo das Vendas (CMV): *-${formatBRL(m.cmv)}*
• (-) Despesas Variáveis: *-${formatBRL(m.variaveis)}*
• (-) Despesas Fixas: *-${formatBRL(m.fixas)}*
• *LUCRO LÍQUIDO (DRE):* *${deuLucroDRE ? '+' : ''}${formatBRL(m.lucroDRE)}* (${m.margemLiquidaPct.toFixed(1)}% de margem)

🔍 *3. VISÃO DO CAIXA: ONDE FOI PARAR O DINHEIRO?*
• Entradas no Banco: *${formatBRL(m.faturamento)}*
• Total Desembolsado: *-${formatBRL(m.totalDespesasPagas)}*
• *SALDO FINAL DO CAIXA:* *${caixaPositivo ? '+' : ''}${formatBRL(m.saldoCaixa)}*

💡 *Reconciliação Exata:*
${deuLucroDRE && !caixaPositivo 
  ? `(+) Lucro Líquido DRE: *+${formatBRL(m.lucroDRE)}*\n(-) Compras extras de mercadorias pagas: *-${formatBRL(m.diferencaEstoque)}*\n(=) Saldo Bancário do mês: *${formatBRL(m.saldoCaixa)}*\n\n📌 *Conclusão:* O dinheiro *não sumiu*! ${explicacaoEstoque}`
  : `Resultado operacional saudável. ${explicacaoEstoque}`}

🚀 *RECOMENDAÇÃO ESTRATÉGICA:*
${atingiuPE 
  ? '• A operação é rentável e gera margem consistente. Foco agora em manter o giro do estoque e prazos com fornecedores.' 
  : '• Prioridade para o próximo mês: alavancar o volume de vendas ou renegociar despesas fixas para alcançar o Ponto de Equilíbrio com folga.'}

Conte com nosso apoio estratégico! Estamos à inteira disposição.`;

  return {
    m,
    atingiuPE,
    deuLucroDRE,
    caixaPositivo,
    explicacaoEstoque,
    textoWhatsApp,
  };
}

/**
 * Gera a tradução comparativa entre dois meses (Mês Atual vs Mês Anterior)
 */
export function gerarComparativoBimestral(mAtual, mAnterior, empresaNome = 'Empresa') {
  if (!mAtual || !mAnterior || !mAtual.temDados || !mAnterior.temDados) {
    return {
      temDadosSuficientes: false,
      mensagem: 'Necessário ter lançamentos em ambos os meses para gerar a comparação analítica.',
    };
  }

  const varFatPct = mAnterior.faturamento > 0 
    ? ((mAtual.faturamento - mAnterior.faturamento) / mAnterior.faturamento) * 100 
    : 0;
  const varLucroDRE = mAtual.lucroDRE - mAnterior.lucroDRE;
  const varSaldoCaixa = mAtual.saldoCaixa - mAnterior.saldoCaixa;
  const varFixas = mAtual.fixas - mAnterior.fixas;
  const varComprasCmv = mAtual.cmvCompras - mAnterior.cmvCompras;

  const textoWhatsApp = 
`📊 *COMPARATIVO FINANCEIRO EXECUTIVO — ${mAnterior.nomeMes.toUpperCase()} vs ${mAtual.nomeMes.toUpperCase()}/${mAtual.ano}*
🏢 *${empresaNome}*

Olá! Segue a análise comparativa de desempenho entre os dois últimos meses:

💰 *1. FATURAMENTO E VENDAS*
• ${mAnterior.nomeMes}: *${formatBRL(mAnterior.faturamento)}*
• ${mAtual.nomeMes}: *${formatBRL(mAtual.faturamento)}*
• Variação: *${varFatPct >= 0 ? '+' : ''}${varFatPct.toFixed(1)}%* (${varFatPct >= 0 ? 'Crescimento' : 'Recuo'} de ${formatBRL(Math.abs(mAtual.faturamento - mAnterior.faturamento))})

🎯 *2. PONTO DE EQUILÍBRIO*
• Meta ${mAnterior.nomeMes}: *${formatBRL(mAnterior.pontoEquilibrio)}* (${mAnterior.pctAtingidoPE.toFixed(0)}% atingido)
• Meta ${mAtual.nomeMes}: *${formatBRL(mAtual.pontoEquilibrio)}* (${mAtual.pctAtingidoPE.toFixed(0)}% atingido)

📉 *3. ESTRUTURA DE CUSTOS E COMPRAS*
• Despesas Fixas: ${varFixas >= 0 ? '+' : ''}${formatBRL(varFixas)} (de ${formatBRL(mAnterior.fixas)} para ${formatBRL(mAtual.fixas)})
• Compras de Estoque/Fornecedores: ${varComprasCmv >= 0 ? '+' : ''}${formatBRL(varComprasCmv)} (de ${formatBRL(mAnterior.cmvCompras)} para ${formatBRL(mAtual.cmvCompras)})

📈 *4. RESULTADO LÍQUIDO (DRE) vs CAIXA*
• Lucro Líquido DRE: de *${formatBRL(mAnterior.lucroDRE)}* para *${formatBRL(mAtual.lucroDRE)}* (${varLucroDRE >= 0 ? '+' : ''}${formatBRL(varLucroDRE)})
• Saldo em Conta Bancária: de *${formatBRL(mAnterior.saldoCaixa)}* para *${formatBRL(mAtual.saldoCaixa)}* (${varSaldoCaixa >= 0 ? '+' : ''}${formatBRL(varSaldoCaixa)})

💡 *INSIGHT EXECUTIVO:*
${varFatPct >= 0 && varSaldoCaixa < 0
  ? `Mesmo faturando ${varFatPct.toFixed(1)}% a mais em ${mAtual.nomeMes}, o saldo bancário reduziu porque as compras de mercadorias/fornecedores subiram ${formatBRL(varComprasCmv)}. O capital foi aplicado em estoque para viabilizar as próximas vendas.`
  : varFatPct >= 0 && varSaldoCaixa >= 0
  ? `Excelente evolução! As vendas cresceram e a geração de caixa acompanhou o ritmo com aumento do saldo financeiro.`
  : `Atenção à queda de vendas em ${mAtual.nomeMes}. Recomendamos ajustar as compras e focar na redução de custos fixos.`}

Qualquer dúvida, estamos à disposição para apoiar nas decisões!`;

  return {
    temDadosSuficientes: true,
    mAtual,
    mAnterior,
    varFatPct,
    varLucroDRE,
    varSaldoCaixa,
    varFixas,
    varComprasCmv,
    textoWhatsApp,
  };
}
