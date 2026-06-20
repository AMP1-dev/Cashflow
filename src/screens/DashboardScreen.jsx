import React, { useState, useMemo } from 'react';
import { ArrowUpCircle, ArrowDownCircle, ChevronRight, X } from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { CATEGORIAS } from '../utils/constants';
import { EmptyState } from '../components/UIComponents';

export function Dashboard({ lancamentos, onNovo, onEditar }) {
  const totalReceita = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
  const totalDespesa = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
  const saldo = totalReceita - totalDespesa;

  const porCategoria = useMemo(() => {
    const acc = { cmv: 0, variavel: 0, fixa: 0, financeira: 0 };
    lancamentos.filter(l => l.tipo === 'despesa').forEach(l => { acc[l.categoria] = (acc[l.categoria] || 0) + l.valor; });
    return acc;
  }, [lancamentos]);

  const recentes = [...lancamentos].sort((a, b) => b.dia - a.dia).slice(0, 6);
  const [recentesAbertos, setRecentesAbertos] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: '#0F2B27', borderRadius: 16, padding: 20, color: '#FAF8F3', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#9FBDB5', marginBottom: 4 }}>Saldo do mês</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: saldo >= 0 ? '#9FE0C8' : '#F0A0A0' }}>{formatBRL(saldo)}</div>
        <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: '#9FE0C8', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowUpCircle size={13} /> Receitas</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#CFEEE2' }}>{formatBRL(totalReceita)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#F0BE94', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowDownCircle size={13} /> Despesas</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#F5D5B8' }}>{formatBRL(totalDespesa)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => onNovo('despesa')} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: '1px solid #E5E0D5', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#1C2421' }}>
          <ArrowDownCircle size={18} color="#B05A2E" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Lançar despesa</span>
        </button>
        <button onClick={() => onNovo('receita')} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: '1px solid #E5E0D5', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#1C2421' }}>
          <ArrowUpCircle size={18} color="#1F5C52" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Lançar receita</span>
        </button>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F', marginBottom: 10 }}>Despesas por categoria</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {Object.entries(CATEGORIAS).map(([key, cat]) => {
          const valor = porCategoria[key] || 0;
          const pct = totalDespesa > 0 ? (valor / totalDespesa) * 100 : 0;
          return (
            <div key={key} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid #EFEBE0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: cat.color, fontWeight: 600 }}>{cat.short}</span>
                <span style={{ color: '#5C5A4F' }}>{formatBRL(valor)}</span>
              </div>
              <div style={{ height: 5, background: '#F0EDE3', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setRecentesAbertos(a => !a)}
        disabled={recentes.length === 0}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', padding: 0, marginBottom: recentesAbertos ? 10 : 0, cursor: recentes.length > 0 ? 'pointer' : 'default' }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F' }}>Lançamentos recentes {recentes.length > 0 && `(${recentes.length})`}</span>
        {recentes.length > 0 && (
          <ChevronRight size={16} color="#9C9A8F" style={{ transform: recentesAbertos ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
        )}
      </button>
      {recentes.length === 0 ? (
        <EmptyState text="Nenhum lançamento neste mês ainda. Toque no + para começar." />
      ) : recentesAbertos && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentes.map(l => <LancamentoRow key={l.id} l={l} onEditar={onEditar} />)}
        </div>
      )}
    </div>
  );
}

export function LancamentoRow({ l, onRemove, onEditar }) {
  const cat = l.categoria ? CATEGORIAS[l.categoria] : null;
  return (
    <div
      onClick={() => onEditar && onEditar(l)}
      role={onEditar ? 'button' : undefined}
      tabIndex={onEditar ? 0 : undefined}
      style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid #EFEBE0', display: 'flex', alignItems: 'center', gap: 10, cursor: onEditar ? 'pointer' : 'default' }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: l.tipo === 'receita' ? '#D9EBE6' : (cat ? cat.bg : '#F0EDE3'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {l.tipo === 'receita' ? <ArrowUpCircle size={15} color="#1F5C52" /> : <ArrowDownCircle size={15} color={cat ? cat.color : '#9C9A8F'} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.descricao}</div>
        <div style={{ fontSize: 11.5, color: '#9C9A8F' }}>Dia {l.dia}{cat ? ` · ${cat.short}` : (l.formaRecebimento ? ` · ${l.formaRecebimento}` : '')}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: l.tipo === 'receita' ? '#1F5C52' : '#1C2421' }}>
        {l.tipo === 'receita' ? '+' : '-'}{formatBRL(l.valor)}
      </div>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(l.id); }}
          aria-label="Remover"
          style={{ background: 'none', border: 'none', color: '#C9C5B6', cursor: 'pointer', padding: 4 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
