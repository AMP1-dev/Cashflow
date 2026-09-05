import { Activity, ChevronLeft, ChevronRight, ClipboardList, FileBarChart, LayoutDashboard, ListChecks, LogOut, Plus, Tag, TrendingUp, Users } from 'lucide-react';
import { MESES } from '../utils/constants';

export function TopBar({ empresa, usuario, onLogout, mesAtual, setMesAtual, onAbrirEquipe, ehDono }) {
  return (
    <div className="no-print" style={{ background: '#0F2B27', color: '#FAF8F3', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 10, borderRadius: '0 0 20px 20px', boxShadow: '0 4px 12px rgba(15, 43, 39, 0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#9FBDB5' }}>{usuario}</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{empresa.nome}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {ehDono && onAbrirEquipe && (
            <button onClick={onAbrirEquipe} title="Gerenciar Equipe" aria-label="Gerenciar Equipe" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#9FE0C8', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600 }}>
              <Users size={16} />
              <span>Equipe</span>
            </button>
          )}
          <button onClick={onLogout} aria-label="Sair" style={{ background: 'none', border: 'none', color: '#9FBDB5', cursor: 'pointer', padding: 8 }}>
            <LogOut size={18} />
          </button>
        </div>
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

export function BottomNav({ tela, setTela, onAdd, papel = 'dono' }) {
  const todosItems = [
    { id: 'dashboard',   label: 'Resumo',    icon: LayoutDashboard, apenasDono: false },
    { id: 'fluxo',       label: 'Fluxo',     icon: ListChecks, apenasDono: false },
    { id: 'dre',         label: 'DRE',       icon: FileBarChart, apenasDono: true },
    { id: 'anual',       label: 'Anual',     icon: TrendingUp, apenasDono: true },
    { id: 'preco',       label: 'Preço',     icon: Tag, apenasDono: true },
    { id: 'fichas',      label: 'Fichas',    icon: ClipboardList, apenasDono: true },
    { id: 'diagnostico', label: 'Avaliação', icon: Activity, apenasDono: true },
  ];

  const items = papel === 'funcionario' 
    ? todosItems.filter(it => !it.apenasDono) 
    : todosItems;
  return (
    <div className="no-print" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#FAF8F3', borderTop: '1px solid #E5E0D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 8px calc(9px + env(safe-area-inset-bottom))', boxSizing: 'border-box', boxShadow: '0 -4px 12px rgba(0,0,0,0.04)' }}>
      {items.map(it => <NavButton key={it.id} item={it} active={tela === it.id} onClick={() => setTela(it.id)} />)}
    </div>
  );
}

function NavButton({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', color: active ? '#1F5C52' : '#9C9A8F', minWidth: 0 }}>
      <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
      <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>
    </button>
  );
}
