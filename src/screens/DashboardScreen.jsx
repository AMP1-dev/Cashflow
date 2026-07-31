import { ArrowDownCircle, ArrowUpCircle, ChevronRight, X, Presentation, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/UIComponents';
import { RelatorioBancosModal } from '../components/RelatorioBancosModal';
import { CATEGORIAS, MESES } from '../utils/constants';
import { formatBRL } from '../utils/formatters';

export function Dashboard({ lancamentos, mesAtual, anoAtual, onNovo, onEditar, onIrGestaoAVista }) {
  const totalReceita = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
  const totalDespesa = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
  const saldo = totalReceita - totalDespesa;

  const porCategoria = useMemo(() => {
    const acc = { cmv: 0, variavel: 0, fixa: 0, financeira: 0 };
    lancamentos.filter(l => l.tipo === 'despesa').forEach(l => { acc[l.categoria] = (acc[l.categoria] || 0) + l.valor; });
    return acc;
  }, [lancamentos]);

  // Task 4: Remover limite de 6 itens
  const recentes = [...lancamentos].sort((a, b) => b.dia - a.dia);
  const [recentesAbertos, setRecentesAbertos] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);

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

      {/* Botões de Ação Principal (Hero Buttons - Mais altos e com área de toque ampla) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <button 
          onClick={() => onNovo('receita')} 
          style={{ padding: '16px 14px', borderRadius: 14, border: '1px solid #CFEAD9', background: '#EAF6EE', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(31,92,82,0.08)', minHeight: 74 }}
        >
          <div style={{ background: '#1F5C52', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <ArrowUpCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1F5C52', lineHeight: 1.2 }}>Lançar receita</div>
            <div style={{ fontSize: 11.5, color: '#5C8A71', marginTop: 2 }}>Venda / Entrada</div>
          </div>
        </button>

        <button 
          onClick={() => onNovo('despesa')} 
          style={{ padding: '16px 14px', borderRadius: 14, border: '1px solid #F7D6C8', background: '#FDF2EE', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(176,90,46,0.08)', minHeight: 74 }}
        >
          <div style={{ background: '#B05A2E', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <ArrowDownCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#B05A2E', lineHeight: 1.2 }}>Lançar despesa</div>
            <div style={{ fontSize: 11.5, color: '#C07D5A', marginTop: 2 }}>Conta / Saída</div>
          </div>
        </button>
      </div>

      {/* Banner Secundário: Gestão à Vista */}
      <button 
        onClick={onIrGestaoAVista} 
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #B8E0D7', background: '#E6F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: '#1F5C52', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
      >
        <Presentation size={16} />
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Quadro de Metas & Gestão à Vista</span>
      </button>

      {/* Seção Despesas por Categoria (Grid Estreito / Compacto 2x2) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Despesas por categoria</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        {Object.entries(CATEGORIAS).map(([key, cat]) => {
          const valor = porCategoria[key] || 0;
          const pct = totalDespesa > 0 ? (valor / totalDespesa) * 100 : 0;
          return (
            <div key={key} style={{ background: '#fff', borderRadius: 10, padding: '8px 10px', border: '1px solid #EFEBE0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: cat.color, fontWeight: 600, fontSize: 11.5 }}>{cat.short}</span>
                <span style={{ fontSize: 10, color: '#747266', background: '#F5F2E8', padding: '1px 4px', borderRadius: 4, fontWeight: 600 }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 4 }}>{formatBRL(valor)}</div>
              <div style={{ height: 3, background: '#F0EDE3', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: recentesAbertos ? 10 : 0 }}>
        <button
          onClick={() => setRecentesAbertos(a => !a)}
          disabled={recentes.length === 0}
          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: recentes.length > 0 ? 'pointer' : 'default', textAlign: 'left' }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F' }}>Lançamentos recentes {recentes.length > 0 && `(${recentes.length})`}</span>
          {recentes.length > 0 && (
            <ChevronRight size={16} color="#9C9A8F" style={{ transform: recentesAbertos ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
          )}
        </button>
        
        {/* Botão de Relatório */}
        <button 
          onClick={() => setShowRelatorioModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#fff', border: '1px solid #D1CFC7', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#1C2421', cursor: 'pointer' }}
        >
          <FileText size={14} /> Relatório
        </button>
      </div>
      {recentes.length === 0 ? (
        <EmptyState text="Nenhum lançamento neste mês ainda. Toque no + para começar." />
      ) : recentesAbertos && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
          {recentes.map(l => <LancamentoRow key={l.id} l={l} onEditar={onEditar} corPorCategoria={false} />)}
        </div>
      )}

      {showRelatorioModal && (
        <RelatorioBancosModal 
          lancamentosMes={lancamentos} 
          mesLabel={MESES[mesAtual]}
          ano={anoAtual}
          onClose={() => setShowRelatorioModal(false)}
        />
      )}
    </div>
  );
}

export function LancamentoRow({ l, onRemove, onEditar, corPorCategoria = true }) {
  const cat = l.categoria ? CATEGORIAS[l.categoria] : null;
  const corDespesa = corPorCategoria && cat ? cat.color : '#B05A2E';
  return (
    <div
      onClick={() => onEditar && onEditar(l)}
      role={onEditar ? 'button' : undefined}
      tabIndex={onEditar ? 0 : undefined}
      style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid #EFEBE0', display: 'flex', alignItems: 'center', gap: 10, cursor: onEditar ? 'pointer' : 'default' }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: l.tipo === 'receita' ? '#D9EBE6' : (corPorCategoria && cat ? cat.bg : '#F5E4D8'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {l.tipo === 'receita' ? <ArrowUpCircle size={15} color="#1F5C52" /> : <ArrowDownCircle size={15} color={corDespesa} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.descricao}</div>
        <div style={{ fontSize: 11.5, color: '#9C9A8F' }}>Dia {l.dia}{cat ? ` · ${cat.short}` : (l.formaRecebimento ? ` · ${l.formaRecebimento}` : '')}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: l.tipo === 'receita' ? '#1F5C52' : corDespesa }}>
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
