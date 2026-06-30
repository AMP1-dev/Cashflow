import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { FieldLabel, inputStyle, EmptyState } from '../components/UIComponents';

const CAMPOS_PERCENTUAL = [
  { key: 'das', label: 'DAS — Simples Nacional', grupo: 'variavel' },
  { key: 'comissao', label: 'Comissão', grupo: 'variavel' },
  { key: 'cartao', label: 'Cartão Crédito/Débito', grupo: 'variavel' },
  { key: 'outros', label: 'Outros', grupo: 'variavel' },
  { key: 'custoFixo', label: 'Custo Fixo', grupo: 'fixo' },
  { key: 'retirada', label: 'Retirada / Pró-labore', grupo: 'fixo' },
  { key: 'distribLucros', label: 'Distrib. de Lucros', grupo: 'fixo' },
];

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
  const comissao = somaPor(d => norm(d.descricao).includes('comiss') || norm(d.subcategoria).includes('comiss'));
  const cartao = somaPor(d => norm(d.descricao).includes('cart') || norm(d.subcategoria).includes('cart') || norm(d.descricao).includes('tax'));
  const variaveisTotal = somaPor(d => d.categoria === 'variavel');
  const outros = Math.max(variaveisTotal - das - comissao - cartao, 0);

  const fixasTotal = somaPor(d => d.categoria === 'fixa');
  const retirada = somaPor(d => norm(d.descricao).includes('pró-labore') || norm(d.descricao).includes('pro-labore') || norm(d.descricao).includes('pró labore') || norm(d.subcategoria).includes('pró-labore'));
  const custoFixo = Math.max(fixasTotal - retirada, 0);

  const pct = (v) => Math.round((v / faturamento) * 1000) / 10;

  return {
    das: pct(das), comissao: pct(comissao), cartao: pct(cartao), outros: pct(outros),
    custoFixo: pct(custoFixo), retirada: pct(retirada), distribLucros: 0,
  };
}

export function FormacaoPrecoScreen({ lancamentos, onPctCustoChange }) {
  const sugestao = useMemo(() => sugerirPercentuais(lancamentos), [lancamentos]);

  function paraTexto(v) {
    return v === 0 ? '' : String(v).replace('.', ',');
  }

  const [textos, setTextos] = useState(() => {
    const t = {};
    CAMPOS_PERCENTUAL.forEach(c => { t[c.key] = paraTexto(sugestao[c.key]); });
    return t;
  });
  const [usandoSugestao, setUsandoSugestao] = useState(true);
  const [custoProduto, setCustoProduto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');

  useEffect(() => {
    if (usandoSugestao) {
      const t = {};
      CAMPOS_PERCENTUAL.forEach(c => { t[c.key] = paraTexto(sugestao[c.key]); });
      setTextos(t);
    }
  }, [sugestao, usandoSugestao]);

  function atualizarPct(key, valorDigitado) {
    setUsandoSugestao(false);
    setTextos(prev => ({ ...prev, [key]: valorDigitado }));
  }

  function restaurarSugestao() {
    const t = {};
    CAMPOS_PERCENTUAL.forEach(c => { t[c.key] = paraTexto(sugestao[c.key]); });
    setTextos(t);
    setUsandoSugestao(true);
  }

  const percentuais = useMemo(() => {
    const p = {};
    CAMPOS_PERCENTUAL.forEach(c => { p[c.key] = parseFloat((textos[c.key] || '0').replace(',', '.')) || 0; });
    return p;
  }, [textos]);

  const pctVariaveis = percentuais.das + percentuais.comissao + percentuais.cartao + percentuais.outros;
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

  useEffect(() => {
    if (onPctCustoChange) onPctCustoChange(Math.max(0, pctPrecoCusto));
  }, [pctPrecoCusto]);

  function valorCampoEmReais(key) {
    return precoVendaNum * (percentuais[key] / 100);
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 2 }}>Formação de preço</div>
      <div style={{ fontSize: 11.5, color: '#9C9A8F', marginBottom: 16 }}>Descubra se o preço que o mercado aceita ainda deixa lucro</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Índices incidentes</span>
        {!usandoSugestao && (
          <button onClick={restaurarSugestao} style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
            usar sugestão automática
          </button>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 10 }}>
        {usandoSugestao ? 'Calculado a partir dos seus lançamentos deste mês. Você pode editar qualquer campo.' : 'Valores editados manualmente.'}
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
        {CAMPOS_PERCENTUAL.map((campo) => (
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
          <FieldLabel>Custo do produto</FieldLabel>
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
          <EmptyState text="Informe o custo do produto e o preço de venda para simular o lucro." />
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>(–) Custo real do produto</span><span>{formatBRL(custoProdutoNum)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 4, marginTop: 2 }}><span>= Lucro</span><span>{formatBRL(lucro)}</span></div>
            </div>
          </div>

          {!positivo && <SugestaoPrecoMinimo precoMinimo={precoMinimo} percentuaisInviaveis={percentuaisInviaveis} />}
        </div>
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
