import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calculator, Settings2, X, HelpCircle, HardDrive } from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { FieldLabel, inputStyle, EmptyState } from '../components/UIComponents';
import { CalculadoraRH } from '../components/CalculadoraRH';
import { ConceitoAjudaModal } from '../components/ConceitoAjudaModal';

const TODOS_CAMPOS_KEYS = ['das', 'icms', 'pisCofins', 'csllIrpj', 'comissao', 'cartao', 'outros', 'custoFixo', 'retirada', 'distribLucros'];

export function sugerirPercentuais(lancamentos) {
  const receitas = lancamentos.filter(l => l.tipo === 'receita');
  const faturamento = receitas.reduce((s, l) => s + l.valor, 0);
  if (faturamento <= 0) {
    return { das: 4, comissao: 0, cartao: 5, outros: 1, custoFixo: 30, retirada: 0, distribLucros: 0 };
  }

  const despesas = lancamentos.filter(l => l.tipo === 'despesa');
  const norm = (s) => (s || '').toLowerCase();

  const somaPor = (filtro) => despesas.filter(filtro).reduce((s, l) => s + l.valor, 0);

  const das = somaPor(d => norm(d.descricao).includes('simples') || norm(d.descricao).includes('das') || norm(d.subcategoria).includes('simples'));
  const icms = somaPor(d => norm(d.descricao).includes('icms') || norm(d.subcategoria).includes('icms'));
  const pisCofins = somaPor(d => norm(d.descricao).includes('pis') || norm(d.descricao).includes('cofins') || norm(d.subcategoria).includes('pis'));
  const csllIrpj = somaPor(d => norm(d.descricao).includes('csll') || norm(d.descricao).includes('irpj'));
  
  const comissao = somaPor(d => norm(d.descricao).includes('comiss') || norm(d.subcategoria).includes('comiss'));
  const cartao = somaPor(d => norm(d.descricao).includes('cart') || norm(d.subcategoria).includes('cart') || norm(d.descricao).includes('tax'));
  const variaveisTotal = somaPor(d => d.categoria === 'variavel');
  const outros = Math.max(variaveisTotal - das - comissao - cartao, 0);

  const fixasTotal = somaPor(d => d.categoria === 'fixa');
  const retirada = somaPor(d => norm(d.descricao).includes('pró-labore') || norm(d.descricao).includes('pro-labore') || norm(d.descricao).includes('pró labore') || norm(d.subcategoria).includes('pró-labore'));
  const custoFixo = Math.max(fixasTotal - retirada, 0);

  const pct = (v) => Math.round((v / faturamento) * 1000) / 10;

  return {
    das: pct(das), icms: pct(icms), pisCofins: pct(pisCofins), csllIrpj: pct(csllIrpj),
    comissao: pct(comissao), cartao: pct(cartao), outros: pct(outros),
    custoFixo: pct(custoFixo), retirada: pct(retirada), distribLucros: 0,
  };
}

export function FormacaoPrecoScreen({ lancamentos, empresaId, mesAtual, anoAtual }) {
  const sugestao = useMemo(() => sugerirPercentuais(lancamentos), [lancamentos]);
  const [showCalculadoraRH, setShowCalculadoraRH] = useState(false);
  const [showMatrizTributaria, setShowMatrizTributaria] = useState(false);

  function paraTexto(v) {
    return v === 0 ? '' : String(v).replace('.', ',');
  }

  const storageKey = `amp_preco_${empresaId}_${anoAtual}_${mesAtual}`;

  const [textos, setTextos] = useState(() => {
    const salvo = localStorage.getItem(`${storageKey}_textos`);
    if (salvo) return JSON.parse(salvo);
    const t = {};
    TODOS_CAMPOS_KEYS.forEach(k => { t[k] = paraTexto(sugestao[k]); });
    return t;
  });

  const [usandoSugestao, setUsandoSugestao] = useState(() => {
    const salvo = localStorage.getItem(`${storageKey}_usandoSugestao`);
    return salvo ? JSON.parse(salvo) : true;
  });

  const [custoProduto, setCustoProduto] = useState(() => {
    return localStorage.getItem(`${storageKey}_custoProduto`) || '';
  });

  const [precoVenda, setPrecoVenda] = useState(() => {
    return localStorage.getItem(`${storageKey}_precoVenda`) || '';
  });

  const [quantidadeProspectada, setQuantidadeProspectada] = useState(() => {
    return localStorage.getItem(`${storageKey}_quantidadeProspectada`) || '1';
  });

  const [regimeTributario, setRegimeTributario] = useState(() => {
    return localStorage.getItem(`${storageKey}_regimeTributario`) || 'simples';
  });

  // Configurações da Matriz Tributária
  const [matrizConfig, setMatrizConfig] = useState(() => {
    const salvo = localStorage.getItem(`${storageKey}_matrizConfig`);
    return salvo ? JSON.parse(salvo) : {
      setor: 8, // Vendas Geral
      faturamento: 0,
      iss: 0,
      ipi: 0,
    };
  });

  const [isAjudaPrecoOpen, setIsAjudaPrecoOpen] = useState(false);
  const [showCalculadoraDepreciacao, setShowCalculadoraDepreciacao] = useState(false);

  const [maquinaNome, setMaquinaNome] = useState(() => localStorage.getItem(`${storageKey}_maquinaNome`) || 'Máquina / Equipamento Principal');
  const [maquinaValor, setMaquinaValor] = useState(() => localStorage.getItem(`${storageKey}_maquinaValor`) || '12000');
  const [maquinaVidaHoras, setMaquinaVidaHoras] = useState(() => localStorage.getItem(`${storageKey}_maquinaVidaHoras`) || '2400');

  const maquinaValorNum = parseFloat(maquinaValor) || 0;
  const maquinaVidaHorasNum = parseFloat(maquinaVidaHoras) || 1;
  const custoHoraMaquina = maquinaVidaHorasNum > 0 ? maquinaValorNum / maquinaVidaHorasNum : 0;

  useEffect(() => {
    localStorage.setItem(`${storageKey}_textos`, JSON.stringify(textos));
    localStorage.setItem(`${storageKey}_usandoSugestao`, JSON.stringify(usandoSugestao));
    localStorage.setItem(`${storageKey}_custoProduto`, custoProduto);
    localStorage.setItem(`${storageKey}_precoVenda`, precoVenda);
    localStorage.setItem(`${storageKey}_quantidadeProspectada`, quantidadeProspectada);
    localStorage.setItem(`${storageKey}_regimeTributario`, regimeTributario);
    localStorage.setItem(`${storageKey}_matrizConfig`, JSON.stringify(matrizConfig));
    localStorage.setItem(`${storageKey}_maquinaNome`, maquinaNome);
    localStorage.setItem(`${storageKey}_maquinaValor`, maquinaValor);
    localStorage.setItem(`${storageKey}_maquinaVidaHoras`, maquinaVidaHoras);
  }, [textos, usandoSugestao, custoProduto, precoVenda, quantidadeProspectada, regimeTributario, matrizConfig, maquinaNome, maquinaValor, maquinaVidaHoras, storageKey]);

  useEffect(() => {
    if (usandoSugestao && regimeTributario === 'simples') {
      const t = {};
      TODOS_CAMPOS_KEYS.forEach(k => { t[k] = paraTexto(sugestao[k]); });
      setTextos(t);
    }
  }, [sugestao, usandoSugestao, regimeTributario]);

  function atualizarPct(key, valorDigitado) {
    setUsandoSugestao(false);
    setTextos(prev => ({ ...prev, [key]: valorDigitado }));
  }

  function restaurarSugestao() {
    const t = {};
    TODOS_CAMPOS_KEYS.forEach(k => { t[k] = paraTexto(sugestao[k]); });
    setTextos(t);
    setUsandoSugestao(true);
  }

  function aplicarMatrizTributaria(novaConfig) {
    setMatrizConfig(novaConfig);
    setUsandoSugestao(false);
    
    // Cálculos da matriz
    const setorBase = novaConfig.setor / 100;
    const fat = novaConfig.faturamento;
    
    let pisCofins = 0;
    let csllIrpj = 0;
    
    if (regimeTributario === 'presumido') {
      pisCofins = 3.65; // 0.65 PIS + 3.00 COFINS
      
      const csll = setorBase * 0.09;
      const irpjBase = setorBase * 0.15;
      
      let irpjAdicional = 0;
      if (fat > 20000) {
        const excedente = fat - 20000;
        const impostoAdicional = excedente * setorBase * 0.10;
        irpjAdicional = impostoAdicional / fat; // Alíquota efetiva
      }
      
      csllIrpj = (csll + irpjBase + irpjAdicional) * 100;
    } else if (regimeTributario === 'real') {
      pisCofins = 9.25; // 1.65 PIS + 7.60 COFINS (Não cumulativo)
      
      // Estimativa para Lucro Real baseada na mesma presunção para fins de precificação unitária
      const csll = setorBase * 0.09;
      const irpjBase = setorBase * 0.15;
      let irpjAdicional = 0;
      if (fat > 20000) {
        const excedente = fat - 20000;
        const impostoAdicional = excedente * setorBase * 0.10;
        irpjAdicional = impostoAdicional / fat;
      }
      csllIrpj = (csll + irpjBase + irpjAdicional) * 100;
    }

    setTextos(prev => ({
      ...prev,
      pisCofins: paraTexto(Math.round(pisCofins * 100) / 100),
      csllIrpj: paraTexto(Math.round(csllIrpj * 100) / 100),
      icms: paraTexto(Math.round((parseFloat(prev.icms?.replace(',','.')||0) + novaConfig.iss + novaConfig.ipi) * 100) / 100) // Simplificação: soma ISS e IPI no campo ICMS/Outros
    }));
  }

  const camposPercentual = useMemo(() => {
    const baseVariavel = [
      { key: 'comissao', label: 'Comissão', grupo: 'variavel' },
      { key: 'cartao', label: 'Cartão Crédito/Débito', grupo: 'variavel' },
      { key: 'outros', label: 'Outros (Frete, etc)', grupo: 'variavel' },
    ];
    const baseFixo = [
      { key: 'custoFixo', label: 'Custo Fixo', grupo: 'fixo' },
      { key: 'retirada', label: 'Retirada / Pró-labore', grupo: 'fixo' },
      { key: 'distribLucros', label: 'Distrib. de Lucros', grupo: 'fixo' },
    ];
    
    if (regimeTributario === 'simples') {
      return [{ key: 'das', label: 'DAS — Simples Nacional', grupo: 'variavel' }, ...baseVariavel, ...baseFixo];
    } else {
      return [
        { key: 'icms', label: 'ICMS / ISS / IPI', grupo: 'variavel' },
        { key: 'pisCofins', label: 'PIS/COFINS', grupo: 'variavel' },
        { key: 'csllIrpj', label: 'CSLL/IRPJ', grupo: 'variavel' },
        ...baseVariavel, ...baseFixo
      ];
    }
  }, [regimeTributario]);

  const percentuais = useMemo(() => {
    const p = {};
    TODOS_CAMPOS_KEYS.forEach(k => { p[k] = parseFloat((textos[k] || '0').replace(',', '.')) || 0; });
    return p;
  }, [textos]);

  const impostos = regimeTributario === 'simples' 
    ? percentuais.das 
    : (percentuais.icms + percentuais.pisCofins + percentuais.csllIrpj);

  const pctVariaveis = impostos + percentuais.comissao + percentuais.cartao + percentuais.outros;
  const pctFixos = percentuais.custoFixo + percentuais.retirada + percentuais.distribLucros;
  const pctPrecoLiquido = 100 - pctVariaveis;
  const pctPrecoCusto = pctPrecoLiquido - pctFixos;

  const precoVendaNum = parseFloat((precoVenda || '0').replace(',', '.')) || 0;
  const custoProdutoNum = parseFloat((custoProduto || '0').replace(',', '.')) || 0;

  const valorVariaveis = precoVendaNum * (pctVariaveis / 100);
  const precoLiquido = precoVendaNum - valorVariaveis;
  const valorFixos = precoVendaNum * (pctFixos / 100);
  const precoCustoCalculado = precoLiquido - valorFixos;
  const lucro = precoCustoCalculado - custoProdutoNum;
  const lucroPct = precoVendaNum > 0 ? (lucro / precoVendaNum) * 100 : 0;

  const temSimulacao = precoVendaNum > 0 && custoProdutoNum > 0;
  const positivo = lucro >= 0;

  const pctPrecoCustoFracao = pctPrecoCusto / 100;
  const precoMinimo = (custoProdutoNum > 0 && pctPrecoCustoFracao > 0) ? custoProdutoNum / pctPrecoCustoFracao : null;
  const percentuaisInviaveis = pctPrecoCustoFracao <= 0;

  function valorCampoEmReais(key) {
    return precoVendaNum * (percentuais[key] / 100);
  }

  return (
    <div style={{ padding: 16 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F' }}>Formação de preço</span>
            <button
              onClick={() => setIsAjudaPrecoOpen(true)}
              style={{ background: '#E6F4F1', border: '1px solid #B8E0D7', borderRadius: 8, padding: '3px 8px', color: '#1F5C52', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <HelpCircle size={14} />
              <span>Guia Conceitual</span>
            </button>
          </div>
          <div style={{ fontSize: 11.5, color: '#9C9A8F' }}>Descubra se o preço que o mercado aceita ainda deixa lucro</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setShowCalculadoraDepreciacao(true)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #C05621', background: '#FEEBC8', color: '#7B341E', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
          >
            <HardDrive size={14} />
            <span>ROI & Depreciação de Máquina</span>
          </button>

          <button 
            onClick={() => setShowCalculadoraRH(true)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1F5C52', background: '#D9EBE6', color: '#1F5C52', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
          >
            <Calculator size={14} />
            <span>Calc. Hora Técnica</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button 
          onClick={() => setRegimeTributario('simples')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${regimeTributario === 'simples' ? '#1F5C52' : '#E5E0D5'}`, background: regimeTributario === 'simples' ? '#1F5C52' : '#fff', color: regimeTributario === 'simples' ? '#fff' : '#5C5A4F', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Simples Nacional
        </button>
        <button 
          onClick={() => setRegimeTributario('presumido')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${regimeTributario === 'presumido' ? '#1F5C52' : '#E5E0D5'}`, background: regimeTributario === 'presumido' ? '#1F5C52' : '#fff', color: regimeTributario === 'presumido' ? '#fff' : '#5C5A4F', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Lucro Presumido
        </button>
        <button 
          onClick={() => setRegimeTributario('real')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${regimeTributario === 'real' ? '#1F5C52' : '#E5E0D5'}`, background: regimeTributario === 'real' ? '#1F5C52' : '#fff', color: regimeTributario === 'real' ? '#fff' : '#5C5A4F', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Lucro Real
        </button>
      </div>

      {(regimeTributario === 'presumido' || regimeTributario === 'real') && (
        <div style={{ marginBottom: 16 }}>
          {regimeTributario === 'real' && (
            <div style={{ background: '#FBF3E5', border: '1px solid #E8C896', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
              <AlertCircle size={16} color="#8A6D1A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 11, color: '#8A6D1A', lineHeight: 1.4 }}>
                <strong>Atenção (Lucro Real):</strong> Os valores calculados são estimativas aproximadas para precificação. A apuração oficial exige dados contábeis globais (LALUR) que fogem do escopo unitário.
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowMatrizTributaria(true)}
            style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #4A3B8A', background: '#E5E0F5', color: '#4A3B8A', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Settings2 size={16} />
            Configurar Matriz Tributária ({regimeTributario === 'real' ? 'Real' : 'Presumido'})
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Índices incidentes</span>
        {!usandoSugestao && regimeTributario === 'simples' && (
          <button onClick={restaurarSugestao} style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
            usar sugestão automática
          </button>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 10 }}>
        {usandoSugestao && regimeTributario === 'simples' ? 'Calculado a partir dos seus lançamentos deste mês. Você pode editar qualquer campo.' : 'Valores editados manualmente e salvos para este mês.'}
        {precoVendaNum === 0 && ' Informe o preço de venda abaixo para ver os valores em R$.'}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F5F2E8', fontSize: 12, fontWeight: 600, color: '#5C5A4F' }}>
          <span>Preço de Venda</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ minWidth: 64, textAlign: 'right' }}>{precoVendaNum > 0 ? formatBRL(precoVendaNum) : '—'}</span>
            <span style={{ minWidth: 38, textAlign: 'right' }}>100,0%</span>
          </div>
        </div>
        {camposPercentual.map((campo) => (
          <div key={campo.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderTop: '1px solid #F0EDE3', background: campo.grupo === 'fixo' ? '#FBFAF6' : '#fff' }}>
            <span style={{ fontSize: 12.5, color: '#1C2421' }}>{campo.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 12, color: '#9C9A8F', minWidth: 64, textAlign: 'right' }}>
                {precoVendaNum > 0 ? formatBRL(valorCampoEmReais(campo.key)) : '—'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <input
                  value={textos[campo.key]}
                  onChange={e => atualizarPct(campo.key, e.target.value.replace(/[^0-9,.-]/g, ''))}
                  inputMode="decimal"
                  placeholder="0"
                  disabled={['pisCofins', 'csllIrpj'].includes(campo.key) && (regimeTributario === 'presumido' || regimeTributario === 'real')}
                  style={{ width: 46, textAlign: 'right', padding: '5px 6px', borderRadius: 6, border: '1px solid #E5E0D5', fontSize: 12.5, background: ['pisCofins', 'csllIrpj'].includes(campo.key) && (regimeTributario === 'presumido' || regimeTributario === 'real') ? '#F0EDE3' : '#fff', color: '#1C2421' }}
                />
                <span style={{ fontSize: 11.5, color: '#9C9A8F' }}>%</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderTop: '1px solid #E5E0D5', background: '#D9EBE6', fontSize: 12.5, fontWeight: 700, color: '#1F5C52' }}>
          <span>Preço Líquido</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ minWidth: 64, textAlign: 'right' }}>{precoVendaNum > 0 ? formatBRL(precoLiquido) : '—'}</span>
            <span style={{ minWidth: 49, textAlign: 'right' }}>{pctPrecoLiquido.toFixed(1)}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderTop: '1px solid #E5E0D5', background: '#0F2B27', fontSize: 13, fontWeight: 700, color: '#FAF8F3' }}>
          <span>Preço de Custo (teto)</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ minWidth: 64, textAlign: 'right' }}>{precoVendaNum > 0 ? formatBRL(precoCustoCalculado) : '—'}</span>
            <span style={{ minWidth: 49, textAlign: 'right' }}>{pctPrecoCusto.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 8 }}>Simular preço</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <FieldLabel>Custo do produto/hora</FieldLabel>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9C9A8F' }}>R$</span>
            <input value={custoProduto} onChange={e => setCustoProduto(e.target.value)} placeholder="0,00" inputMode="decimal" style={{ ...inputStyle, paddingLeft: 30, marginTop: 0 }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <FieldLabel>Preço de venda</FieldLabel>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9C9A8F' }}>R$</span>
            <input value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} placeholder="0,00" inputMode="decimal" style={{ ...inputStyle, paddingLeft: 30, marginTop: 0 }} />
          </div>
        </div>
      </div>

      {!temSimulacao ? (
        custoProdutoNum > 0 ? (
          <SugestaoPrecoMinimo precoMinimo={precoMinimo} percentuaisInviaveis={percentuaisInviaveis} />
        ) : (
          <EmptyState text="Informe o custo do produto (ou da hora técnica) e o preço de venda para simular o lucro." />
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: positivo ? '#D9EBE6' : '#F2DDE1', borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              {positivo ? <TrendingUp size={20} color="#1F5C52" /> : <TrendingDown size={20} color="#7A2E3D" />}
              <span style={{ fontSize: 13, fontWeight: 600, color: positivo ? '#1F5C52' : '#7A2E3D' }}>
                {positivo ? 'Esse preço dá lucro' : 'Esse preço dá prejuízo'}
              </span>
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: positivo ? '#1F5C52' : '#7A2E3D', marginBottom: 4 }}>
              {formatBRL(lucro)} <span style={{ fontSize: 16 }}>({lucroPct.toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 14, fontSize: 12, color: '#5C5A4F' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Preço de venda</span><span>{formatBRL(precoVendaNum)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>(–) Impostos, comissão, cartão, outros</span><span>{formatBRL(valorVariaveis)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>= Preço líquido</span><span>{formatBRL(precoLiquido)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>(–) Custo fixo, retirada, distrib. lucros</span><span>{formatBRL(valorFixos)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>= Preço de custo (teto)</span><span>{formatBRL(precoCustoCalculado)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>(–) Custo real do produto/hora</span><span>{formatBRL(custoProdutoNum)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 4, marginTop: 2 }}><span>= Lucro</span><span>{formatBRL(lucro)}</span></div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: '1px solid #EFEBE0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 12 }}>Prospecção de venda</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <FieldLabel>Quantidade</FieldLabel>
                <input 
                  value={quantidadeProspectada} 
                  onChange={e => setQuantidadeProspectada(e.target.value.replace(/[^0-9]/g, ''))} 
                  placeholder="Ex: 100" 
                  inputMode="numeric" 
                  style={{ ...inputStyle, marginTop: 0 }} 
                />
              </div>
              <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 6, background: '#F5F2E8', padding: 12, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#5C5A4F' }}>
                  <span>Venda Total:</span>
                  <span style={{ fontWeight: 600 }}>{formatBRL(precoVendaNum * parseInt(quantidadeProspectada || '0', 10))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#5C5A4F' }}>
                  <span>Lucro Total:</span>
                  <span style={{ fontWeight: 600, color: positivo ? '#1F5C52' : '#7A2E3D' }}>{formatBRL(lucro * parseInt(quantidadeProspectada || '0', 10))}</span>
                </div>
              </div>
            </div>
          </div>

          {!positivo && <SugestaoPrecoMinimo precoMinimo={precoMinimo} percentuaisInviaveis={percentuaisInviaveis} />}
        </div>
      )}

      {showCalculadoraRH && (
        <CalculadoraRH 
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          empresaId={empresaId}
          onClose={() => setShowCalculadoraRH(false)} 
        />
      )}

      {showMatrizTributaria && (
        <ModalMatrizTributaria 
          configAtual={matrizConfig}
          regime={regimeTributario}
          onClose={() => setShowMatrizTributaria(false)}
          onSalvar={(cfg) => {
            aplicarMatrizTributaria(cfg);
            setShowMatrizTributaria(false);
          }}
        />
      )}
      {/* Conceito Ajuda Modal: Formação de Preço */}
      <ConceitoAjudaModal
        isOpen={isAjudaPrecoOpen}
        onClose={() => setIsAjudaPrecoOpen(false)}
        titulo="Formação de Preço, Margem & Depreciação"
        conceito="Formação de Preço é a metodologia para calcular quanto você deve cobrar pelo produto ou serviço cobrindo todos os impostos, comissões, taxas de cartão, custos fixos, depreciação de máquinas e a sua margem de lucro desejada."
        porQueImporta="Cobrar 'de cabeça' ou apenas imitando os concorrentes sem conhecer seus custos reais faz muitas empresas venderem bastante e fecharem o mês no prejuízo."
        exemplo={`• Custo Direto do Produto: R$ 50,00\n• Impostos + Taxas + Custo Fixo: 35%\n• Lucro Desejado: 15%\n➜ Margem de Contribuição Disponível: 100% - 50% = 50%\n➜ Preço de Venda Recomendado = R$ 100,00\n\n⚙️ Depreciação de Máquina: Se a sua máquina custou R$ 12.000 e dura 2.400 horas, o uso dela custa R$ 5,00 por hora técnica, que deve ser somado no custo direto.`}
      />

      {/* Modal Calculadora de ROI & Depreciação de Máquina */}
      {showCalculadoraDepreciacao && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FAF8F3', borderRadius: 20, width: '100%', maxWidth: 500, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #EFEBE0' }}>
            <div style={{ padding: '18px 24px', background: '#fff', borderBottom: '1px solid #EFEBE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7B341E', fontWeight: 700, fontSize: 16 }}>
                <HardDrive size={20} color="#C05621" />
                <span>Calculadora de ROI & Depreciação de Equipamento</span>
              </div>
              <button onClick={() => setShowCalculadoraDepreciacao(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#9C9A8F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#FEEBC8', border: '1px solid #FBD38D', borderRadius: 12, padding: 12, fontSize: 12, color: '#7B341E', lineHeight: 1.4 }}>
                💡 <strong>Retorno sobre o Investimento (ROI) & Depreciação:</strong> Ao incluir esse valor no preço de venda do seu produto ou hora técnica, a cada hora de uso da máquina você recupera uma parcela do investimento inicial, formando o caixa para a compra de uma nova máquina.
              </div>

              <div>
                <FieldLabel>Nome do Equipamento / Máquina</FieldLabel>
                <input
                  type="text"
                  value={maquinaNome}
                  onChange={e => setMaquinaNome(e.target.value)}
                  placeholder="Ex: Impressora 3D / Torno / Computador"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>Valor de Compra do Equipamento (R$)</FieldLabel>
                <input
                  type="number"
                  value={maquinaValor}
                  onChange={e => setMaquinaValor(e.target.value)}
                  placeholder="Ex: 12000"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>Vida Útil Estimada em Horas de Uso</FieldLabel>
                <div style={{ fontSize: 11, color: '#718096', marginBottom: 4 }}>
                  Ex: 2.400 horas (considerando 100h de uso/mês durante 24 meses).
                </div>
                <input
                  type="number"
                  value={maquinaVidaHoras}
                  onChange={e => setMaquinaVidaHoras(e.target.value)}
                  placeholder="Ex: 2400"
                  style={inputStyle}
                />
              </div>

              {/* Result Box */}
              <div style={{ background: '#0F2B27', color: '#FAF8F3', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#9FBDB5' }}>
                  Custo de Depreciação & ROI por Hora de Uso
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#9FE0C8', fontFamily: 'Georgia, serif' }}>
                  {formatBRL(custoHoraMaquina)} / hora
                </div>
                <div style={{ fontSize: 11, color: '#9FBDB5', lineHeight: 1.4 }}>
                  Fórmula de Retorno: R$ {formatBRL(maquinaValorNum)} ÷ {maquinaVidaHorasNum}h = <strong>{formatBRL(custoHoraMaquina)}/h</strong> embutidos para quitar o ROI.
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #EFEBE0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCalculadoraDepreciacao(false)}
                style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#C05621', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Salvar e Aplicar no Custo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalMatrizTributaria({ configAtual, regime, onClose, onSalvar }) {
  const [setor, setSetor] = useState(configAtual.setor);
  const [faturamento, setFaturamento] = useState(String(configAtual.faturamento || ''));
  const [iss, setIss] = useState(String(configAtual.iss || ''));
  const [ipi, setIpi] = useState(String(configAtual.ipi || ''));

  function handleSalvar() {
    onSalvar({
      setor: parseFloat(setor),
      faturamento: parseFloat(faturamento.replace(',', '.')) || 0,
      iss: parseFloat(iss.replace(',', '.')) || 0,
      ipi: parseFloat(ipi.replace(',', '.')) || 0,
    });
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#FAF8F3', borderRadius: 16, width: '100%', maxWidth: 450, maxHeight: '95vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #EFEBE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1C2421', fontWeight: 600, fontSize: 16 }}>
            <Settings2 size={20} color="#4A3B8A" />
            Matriz Tributária ({regime === 'real' ? 'Lucro Real' : 'Lucro Presumido'})
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C9A8F' }}><X size={24} /></button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <FieldLabel>Setor de Atividade (Base de Presunção)</FieldLabel>
            <select value={setor} onChange={e => setSetor(Number(e.target.value))} style={inputStyle}>
              <option value={1.6}>Combustível (1,6%)</option>
              <option value={8}>Vendas Geral / Comércio (8%)</option>
              <option value={16}>Transporte (16%)</option>
              <option value={32}>Serviços (32%)</option>
            </select>
          </div>

          <div>
            <FieldLabel>Faturamento Mensal Projetado (R$)</FieldLabel>
            <div style={{ fontSize: 11, color: '#9C9A8F', marginBottom: 6, lineHeight: 1.4 }}>
              Usado para calcular o Adicional de IRPJ (10% sobre o que exceder R$ 20.000 mensais).
            </div>
            <input 
              value={faturamento} 
              onChange={e => setFaturamento(e.target.value.replace(/[^0-9,.-]/g, ''))} 
              placeholder="Ex: 50000" 
              inputMode="decimal" 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>ISS (%)</FieldLabel>
              <input value={iss} onChange={e => setIss(e.target.value.replace(/[^0-9,.-]/g, ''))} placeholder="Ex: 5" inputMode="decimal" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>IPI (%)</FieldLabel>
              <input value={ipi} onChange={e => setIpi(e.target.value.replace(/[^0-9,.-]/g, ''))} placeholder="Ex: 10" inputMode="decimal" style={inputStyle} />
            </div>
          </div>

          <div style={{ background: '#EAF6EE', borderRadius: 10, padding: 12, marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1F5C52', marginBottom: 4 }}>O sistema calculará automaticamente:</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: '#1F5C52', lineHeight: 1.5 }}>
              <li>PIS/COFINS ({regime === 'real' ? 'Não Cumulativo 9,25%' : 'Cumulativo 3,65%'})</li>
              <li>CSLL (9% sobre a base)</li>
              <li>IRPJ (15% sobre a base) + Adicional (10% se houver)</li>
              <li>Soma de ICMS + ISS + IPI no campo variável</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: 24, background: '#fff', borderTop: '1px solid #EFEBE0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #D1CFC7', background: '#fff', fontWeight: 600, color: '#5C5A4F', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSalvar} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#4A3B8A', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Calcular e Aplicar</button>
        </div>
      </div>
    </div>
  );
}

export function SugestaoPrecoMinimo({ precoMinimo, percentuaisInviaveis }) {
  if (percentuaisInviaveis) {
    return (
      <div style={{ background: '#F2DDE1', borderRadius: 14, padding: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertCircle size={18} color="#7A2E3D" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#7A2E3D', marginBottom: 3 }}>Não existe preço que dê lucro com esses índices</div>
          <div style={{ fontSize: 12, color: '#7A2E3D', lineHeight: 1.5 }}>Os percentuais somados (impostos, taxas, custo fixo etc) já consomem 100% ou mais do preço de venda. Revise os índices acima antes de simular.</div>
        </div>
      </div>
    );
  }

  if (precoMinimo === null) return null;

  return (
    <div style={{ background: '#FBF3E5', border: '1px solid #E8C896', borderRadius: 14, padding: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <AlertCircle size={18} color="#8A6D1A" style={{ flexShrink: 0, marginTop: 1 }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8A6D1A', marginBottom: 3 }}>
          Venda no mínimo por {formatBRL(precoMinimo)}
        </div>
        <div style={{ fontSize: 12, color: '#8A6D1A', lineHeight: 1.5 }}>
          Com os índices atuais, esse é o menor preço para não ter prejuízo. Abaixo disso, o custo do produto não é coberto.
        </div>
      </div>
    </div>
  );
}
