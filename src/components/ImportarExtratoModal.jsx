import React, { useState, useMemo } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowRight, Trash2, Check, RefreshCw } from 'lucide-react';
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

// Parser inteligente para CSV bancário
export function parseCSV(text) {
  const linhas = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (linhas.length < 2) return [];

  // Tentar identificar delimitador (, ou ;)
  const primeiraLinha = linhas[0];
  const separador = primeiraLinha.split(';').length > primeiraLinha.split(',').length ? ';' : ',';

  const cabecalho = linhas[0].toLowerCase().split(separador).map(c => c.replace(/["']/g, '').trim());

  let idxData = cabecalho.findIndex(c => c.includes('data') || c.includes('dt') || c.includes('date'));
  let idxDesc = cabecalho.findIndex(c => c.includes('descri') || c.includes('historico') || c.includes('memo') || c.includes('detalhe') || c.includes('transa'));
  let idxValor = cabecalho.findIndex(c => (c.includes('valor') || c.includes('amount') || c.includes('val')) && !c.includes('saldo'));

  if (idxData === -1) idxData = 0;
  if (idxDesc === -1) idxDesc = 1;
  if (idxValor === -1) idxValor = 2;

  const transacoes = [];

  for (let i = 1; i < linhas.length; i++) {
    const colunas = linhas[i].split(separador).map(c => c.replace(/["']/g, '').trim());
    if (colunas.length <= Math.max(idxData, idxDesc, idxValor)) continue;

    const dataStr = colunas[idxData];
    const desc = colunas[idxDesc] || 'Transação CSV';
    let valStr = colunas[idxValor];

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
      const partes = dataStr.split('/');
      dia = parseInt(partes[0]);
      mes = parseInt(partes[1]) - 1;
      ano = parseInt(partes[2]);
    } else if (dataStr.includes('-')) {
      const partes = dataStr.split('-');
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
      const tipo = valorRaw < 0 ? 'despesa' : 'receita';
      transacoes.push({
        idTemp: Math.random().toString(36).substring(2, 9),
        descricao: desc,
        valor: Math.abs(valorRaw),
        tipo,
        dia,
        mes,
        ano: ano || new Date().getFullYear(),
        selecionado: true,
      });
    }
  }

  return transacoes;
}

export function ImportarExtratoModal({ mesAtual, anoAtual, historicoExistente = [], onImportarLote, onClose }) {
  const [etapa, setEtapa] = useState(1);
  const [bancoSelecionado, setBancoSelecionado] = useState('');
  const [transacoes, setTransacoes] = useState([]);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [importando, setImportando] = useState(false);

  function autoSugerirCategoria(descricao, tipo) {
    if (tipo === 'receita') return { categoria: null, subcategoria: null };

    const termo = (descricao || '').toLowerCase();
    
    const similar = historicoExistente.find(h => 
      h.tipo === 'despesa' && h.categoria && (
        termo.includes(h.descricao.toLowerCase()) || 
        h.descricao.toLowerCase().includes(termo)
      )
    );

    if (similar) {
      return { categoria: similar.categoria, subcategoria: similar.subcategoria || '' };
    }

    if (termo.includes('fornec') || termo.includes('compra') || termo.includes('embalag') || termo.includes('mercador') || termo.includes('atacado')) {
      return { categoria: 'cmv', subcategoria: 'Mercadorias para revenda' };
    }
    if (termo.includes('aluguel') || termo.includes('luz') || termo.includes('energia') || termo.includes('agua') || termo.includes('copel') || termo.includes('sabesp') || termo.includes('enel') || termo.includes('internet') || termo.includes('contabil') || termo.includes('salario') || termo.includes('folha') || termo.includes('pro-labore')) {
      return { categoria: 'fixa', subcategoria: 'Custos Administrativos / Operacionais' };
    }
    if (termo.includes('tarifa') || termo.includes('iof') || termo.includes('juros') || termo.includes('banco') || termo.includes('anuidade') || termo.includes('ted') || termo.includes('doc')) {
      return { categoria: 'financeira', subcategoria: 'Tarifas e encargos bancários' };
    }
    if (termo.includes('combust') || termo.includes('posto') || termo.includes('frete') || termo.includes('uber') || termo.includes('manutenc') || termo.includes('diaria')) {
      return { categoria: 'variavel', subcategoria: 'Operação Variável' };
    }

    return { categoria: 'fixa', subcategoria: '' };
  }

  function checarDuplicata(t) {
    return historicoExistente.some(existente => 
      existente.tipo === t.tipo &&
      Math.abs(existente.valor - t.valor) < 0.01 &&
      existente.dia === t.dia &&
      existente.mes === t.mes
    );
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setNomeArquivo(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const content = evt.target.result;
      let parsed = [];
      if (file.name.toLowerCase().endsWith('.ofx')) {
        parsed = parseOFX(content);
      } else {
        parsed = parseCSV(content);
      }

      if (parsed.length === 0) {
        alert('Não foi possível identificar transações válidas neste arquivo. Verifique o formato OFX ou CSV.');
        return;
      }

      const processados = parsed.map(t => {
        const duplicado = checarDuplicata(t);
        const { categoria, subcategoria } = autoSugerirCategoria(t.descricao, t.tipo);
        return {
          ...t,
          banco: bancoSelecionado || '',
          categoria,
          subcategoria,
          duplicado,
          selecionado: !duplicado,
        };
      });

      setTransacoes(processados);
      setEtapa(2);
    };

    reader.readAsText(file, 'ISO-8859-1');
  }

  function toggleItem(idTemp) {
    setTransacoes(prev => prev.map(t => t.idTemp === idTemp ? { ...t, selecionado: !t.selecionado } : t));
  }

  function atualizarCampo(idTemp, campo, valor) {
    setTransacoes(prev => prev.map(t => t.idTemp === idTemp ? { ...t, [campo]: valor } : t));
  }

  const selecionados = transacoes.filter(t => t.selecionado);
  const totalReceitas = selecionados.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
  const totalDespesas = selecionados.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);

  async function handleConfirmarImportacao() {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos uma transação para importar.');
      return;
    }

    setImportando(true);
    try {
      await onImportarLote(selecionados.map(t => ({
        tipo: t.tipo,
        descricao: t.descricao,
        valor: t.valor,
        mes: t.mes,
        dia: t.dia,
        ano: t.ano,
        categoria: t.tipo === 'despesa' ? (t.categoria || 'fixa') : null,
        subcategoria: t.tipo === 'despesa' ? (t.subcategoria || null) : null,
        formaRecebimento: t.tipo === 'receita' ? 'À vista/PIX' : null,
        banco: t.banco || bancoSelecionado || null,
        meio_pagamento: 'Extrato Bancário',
      })));
      onClose();
    } catch (err) {
      alert('Erro na importação: ' + err.message);
    } finally {
      setImportando(false);
    }
  }

  return (
    <ModalShell onClose={onClose} titulo="Importar e Conciliar Extrato (OFX / CSV)">
      {etapa === 1 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 13, color: '#5C5A4F', lineHeight: 1.4 }}>
            Faça upload do extrato emitido pelo banco em formato <strong>.OFX</strong> (recomendado) ou <strong>.CSV</strong> para importar lançamentos com detecção de duplicatas e sugestão de categorias.
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>
              Banco / Conta Padrão (Opcional)
            </label>
            <select
              value={bancoSelecionado}
              onChange={e => setBancoSelecionado(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E0D5', fontSize: 13.5, background: '#fff' }}
            >
              <option value="">Selecionar banco padrão do arquivo...</option>
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
              Extrato bancário em .OFX ou .CSV
            </div>
            <input
              type="file"
              accept=".ofx,.csv,text/csv,application/vnd.ms-excel"
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

          {/* Lista de Transações */}
          <div style={{ maxHeight: '42vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
            {transacoes.map(t => (
              <div
                key={t.idTemp}
                style={{
                  background: t.selecionado ? '#fff' : '#F7F6F2',
                  borderRadius: 10,
                  border: `1px solid ${t.duplicado ? '#F5C6CB' : (t.selecionado ? '#D9EBE6' : '#E5E0D5')}`,
                  padding: '10px 12px',
                  opacity: t.selecionado ? 1 : 0.6,
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

                {t.duplicado && (
                  <div style={{ fontSize: 10.5, color: '#7A2E3D', background: '#FDF2F4', padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} />
                    <span>Possível duplicata: já existe lançamento com mesmo dia e valor.</span>
                  </div>
                )}

                {/* Seleção de Categoria para Despesas */}
                {t.tipo === 'despesa' && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    <select
                      value={t.categoria || 'fixa'}
                      onChange={e => atualizarCampo(t.idTemp, 'categoria', e.target.value)}
                      style={{ flex: 1, fontSize: 11, padding: '4px 6px', borderRadius: 6, border: '1px solid #D1CFC7', background: '#fff' }}
                    >
                      <option value="cmv">CMV (Custo Mercadorias)</option>
                      <option value="variavel">Despesa Variável</option>
                      <option value="fixa">Despesa Fixa</option>
                      <option value="financeira">Despesa Financeira / Tarifa</option>
                    </select>

                    <input
                      value={t.subcategoria || ''}
                      onChange={e => atualizarCampo(t.idTemp, 'subcategoria', e.target.value)}
                      placeholder="Subcategoria..."
                      style={{ flex: 1, fontSize: 11, padding: '4px 6px', borderRadius: 6, border: '1px solid #D1CFC7', background: '#fff' }}
                    />
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
