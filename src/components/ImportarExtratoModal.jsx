import React, { useState, useMemo } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowRight, Trash2, Check, RefreshCw, Split, Plus, CreditCard, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ModalShell } from './UIComponents';
import { BANCOS } from '../utils/constants';
import { formatBRL } from '../utils/formatters';

// Parser para OFX bancário (suporta formatos Itaú, Bradesco, Santander, BB, Nubank, Inter, Stone, etc.)
export function parseOFX(text) {
  const transacoes = [];
  
  // Limpeza de tags
  const trnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  let match;

  while ((match = trnRegex.exec(text)) !== null) {
    const bloco = match[1];

    // Extrair DTPOSTED (ex: 20260315120000[-03:EST])
    const dateMatch = /<DTPOSTED>(\d{8})/i.exec(bloco);
    let ano, mes, dia, dataFormatada;
    if (dateMatch) {
      const dStr = dateMatch[1];
      ano = parseInt(dStr.substring(0, 4));
      mes = parseInt(dStr.substring(4, 6)) - 1; // 0-11
      dia = parseInt(dStr.substring(6, 8));
      dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    }

    // Extrair TRNAMT (ex: -150.00 ou 1500.50)
    const amtMatch = /<TRNAMT>([-\d.,]+)/i.exec(bloco);
    let valor = 0;
    if (amtMatch) {
      valor = parseFloat(amtMatch[1].replace(',', '.'));
    }

    // Extrair MEMO ou NAME
    const memoMatch = /<MEMO>(.*?)[\r\n<]/i.exec(bloco);
    const nameMatch = /<NAME>(.*?)[\r\n<]/i.exec(bloco);
    const descricao = (memoMatch ? memoMatch[1].trim() : (nameMatch ? nameMatch[1].trim() : 'Lançamento Bancário'));

    if (valor !== 0 && dia && mes !== undefined) {
      const tipo = valor < 0 ? 'despesa' : 'receita';
      transacoes.push({
        idTemp: Math.random().toString(36).substring(2, 9),
        descricao,
        valor: Math.abs(valor),
        tipo,
        dia,
        mes,
        ano: ano || new Date().getFullYear(),
        dataLancamento: dataFormatada,
        selecionado: true,
      });
    }
  }

  return transacoes;
}

// Parser inteligente para CSV bancário e de Maquininhas de Cartão (Stone, PagBank, Mercado Pago, Cielo, Rede, etc.)
export function parseCSV(text) {
  const linhas = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (linhas.length < 2) return [];

  // Tentar identificar delimitador (, ou ;)
  const primeiraLinha = linhas[0];
  const separador = primeiraLinha.split(';').length > primeiraLinha.split(',').length ? ';' : ',';

  const cabecalho = linhas[0].toLowerCase().split(separador).map(c => c.replace(/["']/g, '').trim());

  let idxData = cabecalho.findIndex(c => c.includes('data') || c.includes('dt') || c.includes('date'));
  let idxDesc = cabecalho.findIndex(c => c.includes('descri') || c.includes('historico') || c.includes('histórico') || c.includes('memo') || c.includes('detalhe') || c.includes('transa') || c.includes('resumo'));
  
  // Colunas específicas de Maquininha / Adquirente
  const idxBandeira = cabecalho.findIndex(c => c.includes('bandeira') || c.includes('brand') || c.includes('cartao') || c.includes('cartão'));
  const idxModalidade = cabecalho.findIndex(c => c.includes('modalidade') || c.includes('forma') || c.includes('tipo de oper') || c.includes('tipo oper') || c.includes('produto') || (c.includes('tipo') && !c.includes('tipo de conta')));
  const idxParcelas = cabecalho.findIndex(c => c.includes('parcela') || c.includes('plano'));
  const idxStatus = cabecalho.findIndex(c => c.includes('status') || c.includes('situacao') || c.includes('situação') || c.includes('estado'));
  const idxValorLiquido = cabecalho.findIndex(c => (c.includes('liquido') || c.includes('líquido') || c.includes('liq')) && !c.includes('saldo'));
  const idxValorBruto = cabecalho.findIndex(c => (c.includes('bruto') || c.includes('valor da venda') || c.includes('valor trans') || c.includes('total')) && !c.includes('saldo'));
  const idxValorComum = cabecalho.findIndex(c => (c.includes('valor') || c.includes('amount') || c.includes('val')) && !c.includes('saldo'));

  // Priorização de valor: se tiver líquido (maquininha), usa líquido; senão valor bruto; senão valor comum
  let idxValor = idxValorLiquido !== -1 ? idxValorLiquido : (idxValorBruto !== -1 ? idxValorBruto : idxValorComum);

  const ehMaquininha = idxBandeira !== -1 || idxModalidade !== -1 || idxValorLiquido !== -1;

  if (idxData === -1) idxData = 0;
  if (idxDesc === -1 && !ehMaquininha) idxDesc = 1;
  if (idxValor === -1) idxValor = 2;

  const transacoes = [];

  for (let i = 1; i < linhas.length; i++) {
    const colunas = linhas[i].split(separador).map(c => c.replace(/["']/g, '').trim());
    if (colunas.length <= Math.max(idxData, idxValor)) continue;

    // Se tiver status e for cancelada/estornada, ignora
    if (idxStatus !== -1 && colunas[idxStatus]) {
      const st = colunas[idxStatus].toLowerCase();
      if (st.includes('cancel') || st.includes('estorn') || st.includes('rejeit') || st.includes('recus') || st.includes('negad') || st.includes('falh')) {
        continue;
      }
    }

    const dataStr = colunas[idxData];
    let valStr = colunas[idxValor];

    // Se o valor líquido for zero ou vazio e tiver valor bruto, usa o bruto
    if ((!valStr || parseFloat(valStr) === 0) && idxValorBruto !== -1 && colunas[idxValorBruto]) {
      valStr = colunas[idxValorBruto];
    }

    if (!dataStr || !valStr) continue;

    valStr = valStr.replace('R$', '').trim();
    if (valStr.includes(',') && valStr.includes('.')) {
      valStr = valStr.replace(/\./g, '').replace(',', '.');
    } else if (valStr.includes(',')) {
      valStr = valStr.replace(',', '.');
    }

    const valorRaw = parseFloat(valStr);
    if (isNaN(valorRaw) || valorRaw === 0) continue;

    let dia, mes, ano;
    if (dataStr.includes('/')) {
      const partes = dataStr.split(' ')[0].split('/');
      dia = parseInt(partes[0]);
      mes = parseInt(partes[1]) - 1;
      ano = parseInt(partes[2]);
    } else if (dataStr.includes('-')) {
      const partes = dataStr.split(' ')[0].split('-');
      if (partes[0].length === 4) {
        ano = parseInt(partes[0]);
        mes = parseInt(partes[1]) - 1;
        dia = parseInt(partes[2]);
      } else {
        dia = parseInt(partes[0]);
        mes = parseInt(partes[1]) - 1;
        ano = parseInt(partes[2]);
      }
    }

    if (dia && mes !== undefined && !isNaN(dia) && !isNaN(mes)) {
      let desc = (idxDesc !== -1 && colunas[idxDesc]) ? colunas[idxDesc] : '';
      let formaRecebimento = null;

      if (ehMaquininha) {
        const mod = idxModalidade !== -1 ? colunas[idxModalidade] : '';
        const band = idxBandeira !== -1 ? colunas[idxBandeira] : '';
        const parc = idxParcelas !== -1 ? colunas[idxParcelas] : '';

        const partesDesc = [];
        if (mod) partesDesc.push(mod);
        if (band) partesDesc.push(band);
        if (parc && parc !== '1' && parc !== '1x' && !mod.includes(parc)) partesDesc.push(parc);

        desc = partesDesc.length > 0 ? `Venda Cartão ${partesDesc.join(' - ')}` : (desc || 'Venda Cartão / Maquininha');

        const modLower = (mod || '').toLowerCase();
        if (modLower.includes('créd') || modLower.includes('cred') || modLower.includes('parc') || modLower.includes('prazo')) {
          formaRecebimento = 'À prazo';
        } else {
          formaRecebimento = 'À vista/PIX';
        }
      }

      if (!desc) desc = 'Lançamento Extrato';

      const tipo = ehMaquininha ? 'receita' : (valorRaw < 0 ? 'despesa' : 'receita');

      transacoes.push({
        idTemp: Math.random().toString(36).substring(2, 9),
        descricao: desc,
        valor: Math.abs(valorRaw),
        tipo,
        dia,
        mes,
        ano: ano || new Date().getFullYear(),
        formaRecebimento: formaRecebimento || (tipo === 'receita' ? 'À vista/PIX' : null),
        banco: ehMaquininha ? 'Maquininha' : null,
        meio_pagamento: ehMaquininha ? 'Maquininha de Cartão' : 'Extrato Bancário',
        selecionado: true,
      });
    }
  }

  return transacoes;
}

export function ImportarExtratoModal({ mesAtual, anoAtual, historicoExistente = [], empresa = null, onImportarLote, onClose }) {
  const [etapa, setEtapa] = useState(1);
  const [bancoSelecionado, setBancoSelecionado] = useState('');
  const [transacoes, setTransacoes] = useState([]);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [importando, setImportando] = useState(false);
  const [filtroAba, setFiltroAba] = useState('todas'); // 'todas' | 'receitas' | 'despesas' | 'transferencias' | 'duplicatas'

  function autoSugerirCategoria(descricao, tipo) {
    if (tipo === 'receita') return { categoria: null, subcategoria: null, ehFaturaCartao: false };

    const termo = (descricao || '').toLowerCase();
    
    // 0. Faturas de Cartão de Crédito e Seguradoras (Prioridade alta para evitar falsos positivos de investimento)
    const ehFaturaCartao = termo.includes('porto seguro') || termo.includes('portoseguro') ||
      termo.includes('fatura') || termo.includes('itaucard') || termo.includes('bradescard') ||
      termo.includes('cartao de credito') || termo.includes('cartão de crédito') ||
      termo.includes('ourocard') || termo.includes('cetelem') || termo.includes('nubank pagamentos') ||
      termo.includes('pagamento de fatura') || termo.includes('santander cart') || termo.includes('cartao porto') ||
      termo.includes('credicard') || termo.includes('hipercard') || termo.includes('pagamento fatura');

    if (ehFaturaCartao) {
      return { 
        categoria: 'fixa', 
        subcategoria: 'Fatura de Cartão de Crédito',
        ehFaturaCartao: true 
      };
    }

    const similar = historicoExistente.find(h => 
      h.tipo === 'despesa' && h.categoria && (
        termo.includes(h.descricao.toLowerCase()) || 
        h.descricao.toLowerCase().includes(termo)
      )
    );

    if (similar) {
      return { categoria: similar.categoria, subcategoria: similar.subcategoria || '', ehFaturaCartao: false };
    }

    // 1. Investimentos e CAPEX (apenas bens de capital inequívocos, reformas e ativos duráveis)
    if (termo.includes('investimento') || termo.includes('capex') || termo.includes('maquinario') || 
        termo.includes('compra de maquina') || termo.includes('reforma predial') || 
        termo.includes('benfeitoria') || termo.includes('servidor dedicado') || 
        termo.includes('desenvolvimento de software') || termo.includes('licenca de software') ||
        termo.includes('aquisicao de equipamento') || termo.includes('aquisição de equipamento')) {
      return { categoria: 'investimento', subcategoria: 'Implantação de Software / Ativos', ehFaturaCartao: false };
    }

    // 2. CMV (Custos de Mercadorias e Insumos para revenda/produção)
    if (termo.includes('fornec') || termo.includes('compra mat') || termo.includes('embalag') || 
        termo.includes('mercador') || termo.includes('atacado') || termo.includes('materia prima') ||
        termo.includes('matéria prima') || termo.includes('distribuidora')) {
      return { categoria: 'cmv', subcategoria: 'Mercadorias para revenda', ehFaturaCartao: false };
    }

    // 3. Despesas Fixas e Administrativas
    if (termo.includes('aluguel') || termo.includes('luz') || termo.includes('energia') || 
        termo.includes('agua') || termo.includes('água') || termo.includes('copel') || 
        termo.includes('sabesp') || termo.includes('enel') || termo.includes('internet') || 
        termo.includes('contabil') || termo.includes('contábil') || termo.includes('salario') || 
        termo.includes('salário') || termo.includes('folha') || termo.includes('pro-labore') ||
        termo.includes('pró-labore') || termo.includes('seguro') || termo.includes('software') || 
        termo.includes('sistema') || termo.includes('mensalidade')) {
      return { categoria: 'fixa', subcategoria: 'Custos Administrativos / Operacionais', ehFaturaCartao: false };
    }

    // 4. Despesas Financeiras e Bancárias
    if (termo.includes('tarifa') || termo.includes('iof') || termo.includes('juros') || 
        termo.includes('encargo') || termo.includes('banco') || termo.includes('anuidade') || 
        termo.includes('ted') || termo.includes('doc') || termo.includes('manutencao de conta') || 
        termo.includes('manutenção conta')) {
      return { categoria: 'financeira', subcategoria: 'Tarifas e encargos bancários', ehFaturaCartao: false };
    }

    // 5. Despesas Variáveis de Operação
    if (termo.includes('combust') || termo.includes('posto') || termo.includes('gasolina') || 
        termo.includes('etanol') || termo.includes('diesel') || termo.includes('frete') || 
        termo.includes('uber') || termo.includes('99app') || termo.includes('pedagio') || 
        termo.includes('pedágio') || termo.includes('sem parar') || termo.includes('conectcar') || 
        termo.includes('veloe') || termo.includes('manutenc') || termo.includes('diaria') || 
        termo.includes('diária')) {
      return { categoria: 'variavel', subcategoria: 'Operação Variável', ehFaturaCartao: false };
    }

    return { categoria: 'fixa', subcategoria: '', ehFaturaCartao: false };
  }

  function checarDuplicata(t) {
    return historicoExistente.some(existente => 
      existente.tipo === t.tipo &&
      Math.abs(existente.valor - t.valor) < 0.01 &&
      existente.dia === t.dia &&
      existente.mes === t.mes
    );
  }

  // ─── Detecção Inteligente de Transferência entre Contas / Mesma Titularidade ───
  function detectarTransferencia(t, listaExistente = [], listaLida = [], empresaObj = null) {
    const desc = (t.descricao || '').toLowerCase();

    // 1. Termos inequívocos de transferências entre contas e aplicações
    const termosTransferencia = [
      'mesma titularidade',
      'mesmo titular',
      'transf entre contas',
      'transferencia entre contas',
      'transf. entre contas',
      'transf c/c',
      'transf. c/c',
      'transf cc',
      'transf. cc',
      'transf conta corrente',
      'transf. conta corrente',
      'transf p/ c/c',
      'transf. p/ c/c',
      'transf de c/c',
      'transf. de c/c',
      'transf.p/aplic',
      'transf.p/resg',
      'tef mesma titularidade',
      'ted mesma titularidade',
      'doc mesma titularidade',
      'pix mesma titularidade',
      'pix - mesma titularidade',
      'pix transf mesma tit',
      'resgate autom',
      'aplicacao autom',
      'aplic autom',
      'aplicacao financeira',
      'aplic. financeira',
      'aplic.financ',
      'resgate poupanca',
      'aplic poupanca',
      'transf.p/aplicacao',
      'transf.p/resgate',
      'cobertura de saldo',
      'cobertura saldo',
      'transf saldo',
      'saldo crediario',
      'resgate rdb',
      'resgate rdc',
      'resgate cdb',
      'resgate lci',
      'resgate lca',
      'resgate fundo',
      'resgate de aplic',
      'resgate aplicacao',
      'resgate aplicação',
      'resgate',
      'aplicacao rdb',
      'aplicação rdb',
      'deb.emprestimo',
      'deb emprestimo',
      'debito emprestimo',
      'débito empréstimo',
      'amortizacao emprestimo',
      'amortização emprestimo',
      'liquidacao emprestimo',
      'liquidação empréstimo',
      'transf enviada pix',
      'transf recebida pix',
      'transf. enviada pix',
      'transf. recebida pix',
      'transf enviada',
      'transf recebida',
    ];

    for (const termo of termosTransferencia) {
      if (desc.includes(termo)) {
        return {
          ehTransferencia: true,
          motivo: `Movimentação financeira/transferência: "${termo}"`
        };
      }
    }

    // 2. Se temos dados da empresa ou titular (razão social, nome fantasia, sócios)
    const nomesProprios = [
      empresaObj?.razao_social,
      empresaObj?.nome_fantasia,
      empresaObj?.fantasia,
      empresaObj?.nome,
      empresaObj?.nome_responsavel,
      'amp do brasil',
      'marco pavani',
      'marco antonio pavani',
      'amp assessoria'
    ].filter(Boolean).map(n => n.toLowerCase().trim());

    const ehOperacaoTransf = desc.includes('pix') || desc.includes('ted') || desc.includes('tef') || desc.includes('transf') || desc.includes('transferencia');
    for (const nome of nomesProprios) {
      if (nome.length >= 4 && desc.includes(nome)) {
        return {
          ehTransferencia: true,
          motivo: `Transferência identificada para conta própria / sócio (${nome})`
        };
      }
    }

    // 3. Cruzamento de Espelho dentro do próprio arquivo (uma saída e uma entrada de mesmo valor e mesma data)
    const parNoArquivo = listaLida.find(outro => 
      outro.idTemp !== t.idTemp &&
      outro.tipo !== t.tipo &&
      Math.abs(outro.valor - t.valor) < 0.01 &&
      Math.abs(outro.dia - t.dia) <= 1 &&
      outro.mes === t.mes &&
      (
        desc.includes('pix') || desc.includes('transf') || desc.includes('ted') || desc.includes('tef') ||
        (outro.descricao || '').toLowerCase().includes('pix') || (outro.descricao || '').toLowerCase().includes('transf')
      )
    );

    if (parNoArquivo) {
      return {
        ehTransferencia: true,
        motivo: `Cruzamento de espelho no extrato: par de ${formatBRL(t.valor)} entre contas`
      };
    }

    // 4. Cruzamento de Espelho com o Histórico Existente (outra conta já importada ou lançada)
    const parNoHistorico = listaExistente.find(existente => 
      existente.tipo !== t.tipo &&
      Math.abs(existente.valor - t.valor) < 0.01 &&
      Math.abs(existente.dia - t.dia) <= 1 &&
      existente.mes === t.mes &&
      (
        desc.includes('pix') || desc.includes('transf') || desc.includes('ted') || desc.includes('tef') ||
        (existente.descricao || '').toLowerCase().includes('pix') || (existente.descricao || '').toLowerCase().includes('transf')
      )
    );

    if (parNoHistorico) {
      return {
        ehTransferencia: true,
        motivo: `Cruzou com outra conta já no sistema (dia ${parNoHistorico.dia}, ${formatBRL(parNoHistorico.valor)})`
      };
    }

    return { ehTransferencia: false, motivo: null };
  }

  function processarConteudo(textoOuBuffer, formato) {
    let parsed = [];
    if (formato === 'ofx') {
      parsed = parseOFX(textoOuBuffer);
    } else {
      parsed = parseCSV(textoOuBuffer);
    }

    if (parsed.length === 0) {
      alert('Não foi possível identificar transações válidas neste arquivo. Verifique se o arquivo contém extratos ou relatórios com data e valor.');
      return;
    }

    const processados = parsed.map((t, idx, arr) => {
      const duplicado = checarDuplicata(t);
      const { ehTransferencia, motivo: motivoTransferencia } = detectarTransferencia(t, historicoExistente, arr, empresa);
      const { categoria, subcategoria, ehFaturaCartao } = autoSugerirCategoria(t.descricao, t.tipo);
      return {
        ...t,
        banco: t.banco || bancoSelecionado || '',
        categoria,
        subcategoria,
        ehFaturaCartao: !!ehFaturaCartao,
        desdobrado: false,
        divisoes: [],
        duplicado,
        ehTransferencia,
        motivoTransferencia,
        selecionado: !duplicado && !ehTransferencia,
      };
    });

    setTransacoes(processados);
    setEtapa(2);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setNomeArquivo(file.name);
    const nome = file.name.toLowerCase();

    if (nome.endsWith('.xlsx') || nome.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csvContent = XLSX.utils.sheet_to_csv(worksheet);
          processarConteudo(csvContent, 'csv');
        } catch (err) {
          alert('Erro ao ler planilha Excel da maquininha: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (nome.endsWith('.ofx')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        processarConteudo(evt.target.result, 'ofx');
      };
      reader.readAsText(file, 'ISO-8859-1');
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        processarConteudo(evt.target.result, 'csv');
      };
      reader.readAsText(file, 'ISO-8859-1');
    }
  }

  function toggleItem(idTemp) {
    setTransacoes(prev => prev.map(t => t.idTemp === idTemp ? { ...t, selecionado: !t.selecionado } : t));
  }

  function atualizarCampo(idTemp, campo, valor) {
    setTransacoes(prev => prev.map(t => t.idTemp === idTemp ? { ...t, [campo]: valor } : t));
  }

  function iniciarDesdobramento(idTemp) {
    setTransacoes(prev => prev.map(t => {
      if (t.idTemp !== idTemp) return t;
      const d1 = {
        id: Math.random().toString(36).substring(2, 9),
        descricao: t.ehFaturaCartao ? `${t.descricao} - Consumo Geral` : `${t.descricao} (Parte 1)`,
        valor: t.valor,
        categoria: t.categoria || 'fixa',
        subcategoria: t.subcategoria || ''
      };
      return {
        ...t,
        desdobrado: true,
        divisoes: [d1]
      };
    }));
  }

  function toggleDesdobramento(idTemp) {
    setTransacoes(prev => prev.map(t => {
      if (t.idTemp !== idTemp) return t;
      if (t.desdobrado) {
        return { ...t, desdobrado: false };
      }
      const d1 = {
        id: Math.random().toString(36).substring(2, 9),
        descricao: t.ehFaturaCartao ? `${t.descricao} - Consumo Geral` : `${t.descricao} (Parte 1)`,
        valor: t.valor,
        categoria: t.categoria || 'fixa',
        subcategoria: t.subcategoria || ''
      };
      return {
        ...t,
        desdobrado: true,
        divisoes: t.divisoes && t.divisoes.length > 0 ? t.divisoes : [d1]
      };
    }));
  }

  function adicionarDivisao(idTemp, preset = null) {
    setTransacoes(prev => prev.map(t => {
      if (t.idTemp !== idTemp) return t;
      const somaAtual = (t.divisoes || []).reduce((acc, d) => acc + (parseFloat(d.valor) || 0), 0);
      const restante = Math.max(0, +(t.valor - somaAtual).toFixed(2));
      
      const novaDivisao = {
        id: Math.random().toString(36).substring(2, 9),
        descricao: preset?.descricao || `${t.descricao} (Parte ${(t.divisoes?.length || 0) + 1})`,
        valor: restante > 0 ? restante : 0,
        categoria: preset?.categoria || (t.ehFaturaCartao ? 'variavel' : 'fixa'),
        subcategoria: preset?.subcategoria || (preset?.categoria === 'variavel' ? 'Pedágios / Combustíveis' : '')
      };

      return {
        ...t,
        desdobrado: true,
        divisoes: [...(t.divisoes || []), novaDivisao]
      };
    }));
  }

  function removerDivisao(idTemp, divisaoId) {
    setTransacoes(prev => prev.map(t => {
      if (t.idTemp !== idTemp) return t;
      const novas = (t.divisoes || []).filter(d => d.id !== divisaoId);
      if (novas.length === 0) {
        return { ...t, desdobrado: false, divisoes: [] };
      }
      return { ...t, divisoes: novas };
    }));
  }

  function atualizarDivisao(idTemp, divisaoId, campo, valor) {
    setTransacoes(prev => prev.map(t => {
      if (t.idTemp !== idTemp) return t;
      const novas = (t.divisoes || []).map(d => {
        if (d.id !== divisaoId) return d;
        if (campo === 'valor') {
          return { ...d, valor: valor === '' ? '' : parseFloat(valor) };
        }
        return { ...d, [campo]: valor };
      });
      return { ...t, divisoes: novas };
    }));
  }

  function ajustarRestanteDivisao(idTemp, divisaoId) {
    setTransacoes(prev => prev.map(t => {
      if (t.idTemp !== idTemp) return t;
      const outrasSoma = (t.divisoes || [])
        .filter(d => d.id !== divisaoId)
        .reduce((acc, d) => acc + (parseFloat(d.valor) || 0), 0);
      const restante = Math.max(0, +(t.valor - outrasSoma).toFixed(2));
      const novas = (t.divisoes || []).map(d => d.id === divisaoId ? { ...d, valor: restante } : d);
      return { ...t, divisoes: novas };
    }));
  }

  const selecionados = transacoes.filter(t => t.selecionado);
  const totalReceitas = selecionados.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
  const totalDespesas = selecionados.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);

  const qtdTransferencias = transacoes.filter(t => t.ehTransferencia).length;
  const qtdDuplicatas = transacoes.filter(t => t.duplicado).length;

  const transacoesFiltradas = useMemo(() => {
    if (filtroAba === 'receitas') return transacoes.filter(t => t.tipo === 'receita' && !t.ehTransferencia);
    if (filtroAba === 'despesas') return transacoes.filter(t => t.tipo === 'despesa' && !t.ehTransferencia);
    if (filtroAba === 'transferencias') return transacoes.filter(t => t.ehTransferencia);
    if (filtroAba === 'duplicatas') return transacoes.filter(t => t.duplicado);
    return transacoes;
  }, [transacoes, filtroAba]);

  function selecionarApenasOperacoesReais() {
    setTransacoes(prev => prev.map(t => ({
      ...t,
      selecionado: !t.duplicado && !t.ehTransferencia
    })));
  }

  function desmarcarTransferencias() {
    setTransacoes(prev => prev.map(t => t.ehTransferencia ? { ...t, selecionado: false } : t));
  }

  async function handleConfirmarImportacao() {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos uma transação para importar.');
      return;
    }

    // Validação de soma dos lançamentos desdobrados
    for (const t of selecionados) {
      if (t.desdobrado && t.divisoes && t.divisoes.length > 0) {
        const soma = t.divisoes.reduce((acc, d) => acc + (parseFloat(d.valor) || 0), 0);
        const dif = Math.abs(t.valor - soma);
        if (dif > 0.05) {
          alert(`O lançamento "${t.descricao}" está desdobrado, mas a soma de suas divisões (R$ ${formatBRL(soma)}) é diferente do valor original do extrato (R$ ${formatBRL(t.valor)}). Ajuste as partes para bater 100% antes de importar.`);
          return;
        }
      }
    }

    setImportando(true);
    try {
      await onImportarLote(selecionados.flatMap(t => {
        if (t.desdobrado && t.divisoes && t.divisoes.length > 0) {
          return t.divisoes.map(d => ({
            tipo: t.tipo,
            descricao: d.descricao ? d.descricao : `${t.descricao} (Parte)`,
            valor: Math.abs(parseFloat(d.valor) || 0),
            mes: t.mes,
            dia: t.dia,
            ano: t.ano,
            categoria: t.tipo === 'despesa' ? (d.categoria || 'fixa') : null,
            subcategoria: t.tipo === 'despesa' ? (d.subcategoria || null) : null,
            formaRecebimento: t.formaRecebimento || (t.tipo === 'receita' ? 'À vista/PIX' : null),
            banco: t.banco || bancoSelecionado || null,
            meio_pagamento: t.meio_pagamento || (t.ehFaturaCartao ? 'Cartão de Crédito' : 'Extrato Bancário'),
          }));
        }
        return [{
          tipo: t.tipo,
          descricao: t.descricao,
          valor: t.valor,
          mes: t.mes,
          dia: t.dia,
          ano: t.ano,
          categoria: t.tipo === 'despesa' ? (t.categoria || 'fixa') : null,
          subcategoria: t.tipo === 'despesa' ? (t.subcategoria || null) : null,
          formaRecebimento: t.formaRecebimento || (t.tipo === 'receita' ? 'À vista/PIX' : null),
          banco: t.banco || bancoSelecionado || null,
          meio_pagamento: t.meio_pagamento || (t.ehFaturaCartao ? 'Cartão de Crédito' : 'Extrato Bancário'),
        }];
      }));
      onClose();
    } catch (err) {
      alert('Erro na importação: ' + err.message);
    } finally {
      setImportando(false);
    }
  }

  return (
    <ModalShell onClose={onClose} titulo="Importar Extrato Bancário & Maquininhas">
      {etapa === 1 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 13, color: '#5C5A4F', lineHeight: 1.4 }}>
            Faça upload do extrato bancário (<strong>.OFX</strong> ou <strong>.CSV</strong>) ou da planilha de vendas da sua maquininha de cartão (<strong>.CSV</strong> ou <strong>.XLSX</strong> da Stone, PagBank, Mercado Pago, Cielo, Rede, InfinitePay, etc.).
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>
              Banco / Canal Padrão (Opcional)
            </label>
            <select
              value={bancoSelecionado}
              onChange={e => setBancoSelecionado(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E0D5', fontSize: 13.5, background: '#fff' }}
            >
              <option value="">Selecionar banco ou maquininha padrão...</option>
              {BANCOS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <label style={{
            border: '2px dashed #1F5C52',
            borderRadius: 14,
            background: '#F4F8F7',
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}>
            <UploadCloud size={36} color="#1F5C52" />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F2B27' }}>
              Toque aqui para escolher o arquivo
            </div>
            <div style={{ fontSize: 11.5, color: '#6A8A82' }}>
              Extratos bancários (.OFX, .CSV) e Maquininhas (.CSV, .XLSX)
            </div>
            <input
              type="file"
              accept=".ofx,.csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421' }}>{nomeArquivo}</div>
              <div style={{ fontSize: 11, color: '#9C9A8F' }}>
                {transacoes.length} transações lidas · {selecionados.length} selecionadas
              </div>
            </div>
            <button
              onClick={() => { setTransacoes([]); setEtapa(1); }}
              style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Trocar arquivo
            </button>
          </div>

          {/* Banner de Aviso de Transferências Detectadas */}
          {qtdTransferencias > 0 && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11.5, color: '#1E40AF', lineHeight: 1.4 }}>
                <RefreshCw size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{qtdTransferencias} Transferência(s) entre contas identificada(s):</strong> Foram desmarcadas automaticamente para <strong>não duplicar receitas nem despesas</strong> na sua DRE.
                </div>
              </div>
              <button
                type="button"
                onClick={desmarcarTransferencias}
                style={{ background: '#DBEAFE', border: '1px solid #93C5FD', color: '#1E40AF', fontSize: 10.5, fontWeight: 700, padding: '4px 8px', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Manter desmarcadas
              </button>
            </div>
          )}

          {/* Resumo do Lote */}
          <div style={{ background: '#0F2B27', borderRadius: 12, padding: '10px 14px', color: '#FAF8F3', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, color: '#9FE0C8' }}>RECEITAS SELECIONADAS</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#CFEEE2' }}>{formatBRL(totalReceitas)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#F0BE94' }}>DESPESAS SELECIONADAS</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F5D5B8' }}>{formatBRL(totalDespesas)}</div>
            </div>
          </div>

          {/* Barra de Filtros Rápidos */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setFiltroAba('todas')}
                style={{
                  padding: '4px 9px', borderRadius: 7, fontSize: 11, fontWeight: filtroAba === 'todas' ? 700 : 500,
                  background: filtroAba === 'todas' ? '#0F2B27' : '#fff', color: filtroAba === 'todas' ? '#FAF8F3' : '#5C5A4F',
                  border: '1px solid #D1CFC7', cursor: 'pointer'
                }}
              >
                Todas ({transacoes.length})
              </button>
              <button
                type="button"
                onClick={() => setFiltroAba('receitas')}
                style={{
                  padding: '4px 9px', borderRadius: 7, fontSize: 11, fontWeight: filtroAba === 'receitas' ? 700 : 500,
                  background: filtroAba === 'receitas' ? '#1F5C52' : '#fff', color: filtroAba === 'receitas' ? '#FAF8F3' : '#1F5C52',
                  border: '1px solid #D1CFC7', cursor: 'pointer'
                }}
              >
                Receitas ({transacoes.filter(t => t.tipo === 'receita' && !t.ehTransferencia).length})
              </button>
              <button
                type="button"
                onClick={() => setFiltroAba('despesas')}
                style={{
                  padding: '4px 9px', borderRadius: 7, fontSize: 11, fontWeight: filtroAba === 'despesas' ? 700 : 500,
                  background: filtroAba === 'despesas' ? '#B05A2E' : '#fff', color: filtroAba === 'despesas' ? '#FAF8F3' : '#B05A2E',
                  border: '1px solid #D1CFC7', cursor: 'pointer'
                }}
              >
                Despesas ({transacoes.filter(t => t.tipo === 'despesa' && !t.ehTransferencia).length})
              </button>
              {qtdTransferencias > 0 && (
                <button
                  type="button"
                  onClick={() => setFiltroAba('transferencias')}
                  style={{
                    padding: '4px 9px', borderRadius: 7, fontSize: 11, fontWeight: filtroAba === 'transferencias' ? 700 : 600,
                    background: filtroAba === 'transferencias' ? '#1D4ED8' : '#EFF6FF', color: filtroAba === 'transferencias' ? '#fff' : '#1D4ED8',
                    border: '1px solid #BFDBFE', cursor: 'pointer'
                  }}
                >
                  🔄 Transf. ({qtdTransferencias})
                </button>
              )}
              {qtdDuplicatas > 0 && (
                <button
                  type="button"
                  onClick={() => setFiltroAba('duplicatas')}
                  style={{
                    padding: '4px 9px', borderRadius: 7, fontSize: 11, fontWeight: filtroAba === 'duplicatas' ? 700 : 600,
                    background: filtroAba === 'duplicatas' ? '#7A2E3D' : '#FDF2F4', color: filtroAba === 'duplicatas' ? '#fff' : '#7A2E3D',
                    border: '1px solid #FECACA', cursor: 'pointer'
                  }}
                >
                  ⚠️ Duplicatas ({qtdDuplicatas})
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={selecionarApenasOperacoesReais}
              style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 11, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Só operações reais
            </button>
          </div>

          {/* Lista de Transações */}
          <div style={{ maxHeight: '42vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
            {transacoesFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: '#9C9A8F', fontSize: 12 }}>
                Nenhuma transação nesta categoria.
              </div>
            ) : transacoesFiltradas.map(t => (
              <div
                key={t.idTemp}
                style={{
                  background: t.selecionado ? '#fff' : '#F7F6F2',
                  borderRadius: 10,
                  border: `1px solid ${t.duplicado ? '#F5C6CB' : (t.ehTransferencia ? '#BFDBFE' : (t.selecionado ? '#D9EBE6' : '#E5E0D5'))}`,
                  padding: '10px 12px',
                  opacity: t.selecionado ? 1 : 0.65,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={t.selecionado}
                    onChange={() => toggleItem(t.idTemp)}
                    style={{ accentColor: '#1F5C52', width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input
                      value={t.descricao}
                      onChange={e => atualizarCampo(t.idTemp, 'descricao', e.target.value)}
                      style={{ width: '100%', fontSize: 13, fontWeight: 600, border: 'none', background: 'transparent', outline: 'none', color: '#1C2421' }}
                    />
                    <div style={{ fontSize: 10.5, color: '#9C9A8F' }}>
                      Dia {t.dia} · {t.tipo === 'receita' ? 'Entrada' : 'Saída'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: t.tipo === 'receita' ? '#1F5C52' : '#B05A2E' }}>
                      {t.tipo === 'receita' ? '+' : '-'}{formatBRL(t.valor)}
                    </div>
                  </div>
                </div>

                {/* Tag de Transferência Interna */}
                {t.ehTransferencia && (
                  <div style={{ fontSize: 10.5, color: '#1E40AF', background: '#EFF6FF', border: '1px solid #DBEAFE', padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RefreshCw size={12} color="#2563EB" style={{ flexShrink: 0 }} />
                    <span><strong>Transferência Interna (Mesma Titularidade):</strong> {t.motivoTransferencia || 'Movimentação entre contas próprias desmarcada para não inflar DRE.'}</span>
                  </div>
                )}

                {/* Tag de Possível Duplicata */}
                {t.duplicado && (
                  <div style={{ fontSize: 10.5, color: '#7A2E3D', background: '#FDF2F4', padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>Possível duplicata: já existe lançamento com mesmo dia e valor.</span>
                  </div>
                )}

                {/* Destaque para Fatura de Cartão Detectada */}
                {t.ehFaturaCartao && !t.desdobrado && t.tipo === 'despesa' && (
                  <div style={{
                    fontSize: 11,
                    color: '#854D0E',
                    background: '#FEF9C3',
                    border: '1px solid #FEF08A',
                    padding: '6px 10px',
                    borderRadius: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CreditCard size={14} color="#CA8A04" style={{ flexShrink: 0 }} />
                      <span><strong>Fatura de Cartão detectada:</strong> Contém despesas mistas (pedágio, combustível, consumo).</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => iniciarDesdobramento(t.idTemp)}
                      style={{
                        background: '#CA8A04',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '3px 10px',
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Desdobrar Fatura
                    </button>
                  </div>
                )}

                {/* Seleção de Categoria para Despesas (Modo Único ou Desdobrado) */}
                {t.tipo === 'despesa' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
                    {!t.desdobrado ? (
                      <div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <select
                            value={t.categoria || 'fixa'}
                            onChange={e => atualizarCampo(t.idTemp, 'categoria', e.target.value)}
                            style={{ flex: 1, fontSize: 11, padding: '5px 8px', borderRadius: 6, border: '1px solid #D1CFC7', background: '#fff' }}
                          >
                            <option value="cmv">CMV (Custo Mercadorias)</option>
                            <option value="variavel">Despesa Variável (Pedágio, Combustível, Uber)</option>
                            <option value="fixa">Despesa Fixa (Administrativo, Salários, Consumo)</option>
                            <option value="financeira">Despesa Financeira / Tarifa</option>
                            <option value="investimento">Investimentos & CAPEX</option>
                          </select>

                          <input
                            value={t.subcategoria || ''}
                            onChange={e => atualizarCampo(t.idTemp, 'subcategoria', e.target.value)}
                            placeholder="Subcategoria..."
                            style={{ flex: 1, fontSize: 11, padding: '5px 8px', borderRadius: 6, border: '1px solid #D1CFC7', background: '#fff' }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                          <button
                            type="button"
                            onClick={() => iniciarDesdobramento(t.idTemp)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#1F5C52',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '2px 0'
                            }}
                          >
                            <Split size={12} color="#1F5C52" />
                            Desdobrar em várias categorias (Split)
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Painel Completo de Desdobramento Inline */
                      <div style={{
                        background: '#FAF8F5',
                        border: '1px solid #E6E1D6',
                        borderRadius: 8,
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}>
                        {/* Barra de Status da Distribuição */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Split size={14} color="#1F5C52" />
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1F5C52' }}>
                              Desdobramento de Fatura / Multi-categorias
                            </span>
                          </div>

                          {(() => {
                            const soma = (t.divisoes || []).reduce((acc, d) => acc + (parseFloat(d.valor) || 0), 0);
                            const dif = +(t.valor - soma).toFixed(2);
                            const bateu = Math.abs(dif) <= 0.02;

                            if (bateu) {
                              return (
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#0F766E', background: '#CCFBF1', padding: '2px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Check size={12} /> 100% Distribuído ({formatBRL(soma)})
                                </span>
                              );
                            } else if (dif > 0) {
                              return (
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: 6 }}>
                                  Restam R$ {formatBRL(dif)}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#B91C1C', background: '#FEE2E2', padding: '2px 8px', borderRadius: 6 }}>
                                  Excedeu R$ {formatBRL(Math.abs(dif))}
                                </span>
                              );
                            }
                          })()}
                        </div>

                        {/* Atalhos Rápidos para Faturas de Cartão */}
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: '#78716C', fontWeight: 600 }}>Atalhos:</span>
                          <button
                            type="button"
                            onClick={() => adicionarDivisao(t.idTemp, { descricao: 'Pedágio / Sem Parar', categoria: 'variavel', subcategoria: 'Pedágios e Estacionamentos' })}
                            style={{ background: '#F5F5F4', border: '1px solid #D6D3D1', fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer', color: '#44403C' }}
                          >
                            + Pedágio (Variável)
                          </button>
                          <button
                            type="button"
                            onClick={() => adicionarDivisao(t.idTemp, { descricao: 'Combustível / Abastecimento', categoria: 'variavel', subcategoria: 'Combustíveis' })}
                            style={{ background: '#F5F5F4', border: '1px solid #D6D3D1', fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer', color: '#44403C' }}
                          >
                            + Combustível (Variável)
                          </button>
                          <button
                            type="button"
                            onClick={() => adicionarDivisao(t.idTemp, { descricao: 'Consumo Geral / Administrativo', categoria: 'fixa', subcategoria: 'Custos Administrativos' })}
                            style={{ background: '#F5F5F4', border: '1px solid #D6D3D1', fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer', color: '#44403C' }}
                          >
                            + Consumo Geral (Fixa)
                          </button>
                          <button
                            type="button"
                            onClick={() => adicionarDivisao(t.idTemp, { descricao: 'Assinaturas / Ferramentas', categoria: 'fixa', subcategoria: 'Sistemas e Internet' })}
                            style={{ background: '#F5F5F4', border: '1px solid #D6D3D1', fontSize: 10, padding: '2px 7px', borderRadius: 5, cursor: 'pointer', color: '#44403C' }}
                          >
                            + Assinaturas (Fixa)
                          </button>
                        </div>

                        {/* Lista das Partes Desdobradas */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {(t.divisoes || []).map((d, dIdx) => (
                            <div key={d.id || dIdx} style={{
                              background: '#fff',
                              border: '1px solid #E2DED5',
                              borderRadius: 6,
                              padding: '8px 10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 6
                            }}>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <input
                                  value={d.descricao}
                                  onChange={e => atualizarDivisao(t.idTemp, d.id, 'descricao', e.target.value)}
                                  placeholder="Descrição da parte (ex: Pedágio, Combustível, Almoço)..."
                                  style={{ flex: 2, fontSize: 12, padding: '5px 8px', borderRadius: 6, border: '1px solid #D1CFC7' }}
                                />
                                <div style={{ position: 'relative', width: 110 }}>
                                  <span style={{ position: 'absolute', left: 7, top: 6, fontSize: 11, color: '#78716C' }}>R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={d.valor}
                                    onChange={e => atualizarDivisao(t.idTemp, d.id, 'valor', e.target.value)}
                                    placeholder="0.00"
                                    style={{ width: '100%', fontSize: 12, fontWeight: 700, padding: '5px 6px 5px 24px', borderRadius: 6, border: '1px solid #D1CFC7', textAlign: 'right' }}
                                  />
                                </div>
                                <button
                                  type="button"
                                  title="Ajustar automaticamente com o saldo restante"
                                  onClick={() => ajustarRestanteDivisao(t.idTemp, d.id)}
                                  style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 5, padding: '4px 6px', fontSize: 10, fontWeight: 600, cursor: 'pointer', color: '#374151', whiteSpace: 'nowrap' }}
                                >
                                  Saldo
                                </button>
                                {(t.divisoes || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removerDivisao(t.idTemp, d.id)}
                                    title="Remover esta parte"
                                    style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 5, padding: '5px', cursor: 'pointer', color: '#DC2626' }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: 6 }}>
                                <select
                                  value={d.categoria || 'fixa'}
                                  onChange={e => atualizarDivisao(t.idTemp, d.id, 'categoria', e.target.value)}
                                  style={{ flex: 1, fontSize: 11, padding: '5px 6px', borderRadius: 5, border: '1px solid #D1CFC7', background: '#fff' }}
                                >
                                  <option value="variavel">Despesa Variável (Pedágio, Combustível, Uber)</option>
                                  <option value="fixa">Despesa Fixa (Administrativo, Consumo)</option>
                                  <option value="cmv">CMV (Custo Mercadorias / Insumos)</option>
                                  <option value="financeira">Despesa Financeira / Tarifas</option>
                                  <option value="investimento">Investimentos & CAPEX</option>
                                </select>
                                <input
                                  value={d.subcategoria || ''}
                                  onChange={e => atualizarDivisao(t.idTemp, d.id, 'subcategoria', e.target.value)}
                                  placeholder="Subcategoria (opcional)..."
                                  style={{ flex: 1, fontSize: 11, padding: '5px 6px', borderRadius: 5, border: '1px solid #D1CFC7', background: '#fff' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Botões de Ação do Desdobramento */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                          <button
                            type="button"
                            onClick={() => adicionarDivisao(t.idTemp)}
                            style={{
                              background: '#E6F4F1',
                              border: '1px dashed #1F5C52',
                              color: '#1F5C52',
                              padding: '5px 10px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Plus size={13} />
                            Adicionar outra divisão
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleDesdobramento(t.idTemp)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#6B7280',
                              fontSize: 11,
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}
                          >
                            Voltar para lançamento único
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmarImportacao}
            disabled={importando || selecionados.length === 0}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 10,
              border: 'none',
              background: '#0F2B27',
              color: '#FAF8F3',
              fontSize: 14,
              fontWeight: 700,
              cursor: (importando || selecionados.length === 0) ? 'not-allowed' : 'pointer',
              opacity: (importando || selecionados.length === 0) ? 0.6 : 1,
              marginTop: 4,
            }}
          >
            {importando ? 'Importando...' : `Confirmar e Importar ${selecionados.length} Lançamentos`}
          </button>
        </div>
      )}
    </ModalShell>
  );
}
