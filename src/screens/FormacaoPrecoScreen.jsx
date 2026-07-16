import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calculator } from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { FieldLabel, inputStyle, EmptyState } from '../components/UIComponents';
import { CalculadoraRH } from '../components/CalculadoraRH';

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

  function paraTexto(v) {
    return v === 0 ? '' : String(v).replace('.', ',');
  }

  const storageKey = `amp_preco_${empresaId}_${anoAtual}_${mesAtual}`;

  // Estados com persistência local baseada no mês
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

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(`${storageKey}_textos`, JSON.stringify(textos));
    localStorage.setItem(`${storageKey}_usandoSugestao`, JSON.stringify(usandoSugestao));
    localStorage.setItem(`${storageKey}_custoProduto`, custoProduto);
    localStorage.setItem(`${storageKey}_precoVenda`, precoVenda);
    localStorage.setItem(`${storageKey}_quantidadeProspectada`, quantidadeProspectada);
    localStorage.setItem(`${storageKey}_regimeTributario`, regimeTributario);
  }, [textos, usandoSugestao, custoProduto, precoVenda, quantidadeProspectada, regimeTributario, storageKey]);

  // Se usar sugestão, atualiza sempre que vierem novos dados
  useEffect(() => {
    if (usandoSugestao) {
      const t = {};
      TODOS_CAMPOS_KEYS.forEach(k => { t[k] = paraTexto(sugestao[k]); });
      setTextos(t);
    }
  }, [sugestao, usandoSugestao]);

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

  const camposPercentual = useMemo(() => {
    const baseVariavel = [
      { key: 'comissao', label: 'Comissão', grupo: 'variavel' },
      { key: 'cartao', label: 'Cartão Crédito/Débito', grupo: 'variavel' },
      { key: 'outros', label: 'Outros', grupo: 'variavel' },
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
        { key: 'icms', label: 'ICMS', grupo: 'variavel' },
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
          <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 2 }}>Formação de preço</div>
          <div style={{ fontSize: 11.5, color: '#9C9A8F' }}>Descubra se o preço que o mercado aceita ainda deixa lucro</div>
        </div>
        <button 
          onClick={() => setShowCalculadoraRH(true)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1F5C52', background: '#D9EBE6', color: '#1F5C52', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
        >
          <Calculator size={14} />
          Calc. Hora Técnica
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button 
          onClick={() => setRegimeTributario('simples')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${regimeTributario === 'simples' ? '#1F5C52' : '#E5E0D5'}`, background: regimeTributario === 'simples' ? '#1F5C52' : '#fff', color: regimeTributario === 'simples' ? '#fff' : '#5C5A4F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Simples Nacional
        </button>
        <button 
          onClick={() => setRegimeTributario('real')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${regimeTributario === 'real' ? '#1F5C52' : '#E5E0D5'}`, background: regimeTributario === 'real' ? '#1F5C52' : '#fff', color: regimeTributario === 'real' ? '#fff' : '#5C5A4F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Lucro Presumido / Real
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Índices incidentes</span>
        {!usandoSugestao && (
          <button onClick={restaurarSugestao} style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
            usar sugestão automática
          </button>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 10 }}>
        {usandoSugestao ? 'Calculado a partir dos seus lançamentos deste mês. Você pode editar qualquer campo.' : 'Valores editados manualmente e salvos para este mês.'}
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
                  style={{ width: 46, textAlign: 'right', padding: '5px 6px', borderRadius: 6, border: '1px solid #E5E0D5', fontSize: 12.5, background: '#fff', color: '#1C2421' }}
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
