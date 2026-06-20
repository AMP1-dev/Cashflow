import React from 'react';
import { ChevronLeft, ChevronRight, LogOut, Plus, LayoutDashboard, ListChecks, FileBarChart, TrendingUp, Tag } from 'lucide-react';
import { MESES } from '../utils/constants';

export function TopBar({ empresa, usuario, onLogout, mesAtual, setMesAtual }) {
  return (
    <div style={{ background: '#0F2B27', color: '#FAF8F3', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#9FBDB5' }}>{usuario}</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{empresa.nome}</div>
        </div>
        <button onClick={onLogout} aria-label="Sair" style={{ background: 'none', border: 'none', color: '#9FBDB5', cursor: 'pointer', padding: 8 }}>
          <LogOut size={18} />
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 12 }}>
        <button onClick={() => setMesAtual(m => (m + 11) % 12)} aria-label="Mês anterior" style={{ background: 'none', border: 'none', color: '#E8A33D', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, minWidth: 130, textAlign: 'center' }}>{MESES[mesAtual]}</div>
        <button onClick={() => setMesAtual(m => (m + 1) % 12)} aria-label="Próximo mês" style={{ background: 'none', border: 'none', color: '#E8A33D', cursor: 'pointer', padding: 4 }}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export function BottomNav({ tela, setTela, onAdd }) {
  const items = [
    { id: 'dashboard', label: 'Resumo', icon: LayoutDashboard },
    { id: 'fluxo', label: 'Fluxo', icon: ListChecks },
    { id: 'dre', label: 'DRE', icon: FileBarChart },
    { id: 'anual', label: 'Anual', icon: TrendingUp },
    { id: 'preco', label: 'Preço', icon: Tag },
  ];
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#FAF8F3', borderTop: '1px solid #E5E0D5', display: 'flex', alignItems: 'center', padding: '8px 4px calc(8px + env(safe-area-inset-bottom))', boxSizing: 'border-box' }}>
      {items.slice(0, 2).map(it => <NavButton key={it.id} item={it} active={tela === it.id} onClick={() => setTela(it.id)} />)}
      <button onClick={onAdd} aria-label="Novo lançamento" style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8A33D', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 4px', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(232,163,61,0.4)' }}>
        <Plus size={20} color="#0F2B27" />
      </button>
      {items.slice(2).map(it => <NavButton key={it.id} item={it} active={tela === it.id} onClick={() => setTela(it.id)} />)}
    </div>
  );
}

function NavButton({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 1px', color: active ? '#1F5C52' : '#9C9A8F', minWidth: 0 }}>
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
      <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 400 }}>{item.label}</span>
    </button>
  );
}
