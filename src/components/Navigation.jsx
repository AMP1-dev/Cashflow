import { Activity, ChevronLeft, ChevronRight, ClipboardList, FileBarChart, LayoutDashboard, ListChecks, LogOut, Plus, Tag, TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import { MESES } from '../utils/constants';

export function TopBar({ empresa, usuario, onLogout, mesAtual, setMesAtual }) {
  const nomeEmpresa = empresa?.nome || 'Minha Empresa';
  const nomeUsuario = usuario || 'Minha Conta';

  return (
    <div className="no-print" style={{ background: '#0F2B27', color: '#FAF8F3', padding: '14px 16px 12px', position: 'sticky', top: 0, zIndex: 10, borderRadius: '0 0 20px 20px', boxShadow: '0 4px 14px rgba(15, 43, 39, 0.18)' }}>
      {/* LINHA 1: Usuário + Nome da Empresa + Botão Sair */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, color: '#9FBDB5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
            {nomeUsuario}
          </div>
          <div style={{ 
            fontSize: nomeEmpresa.length > 32 ? 14 : 16, 
            fontWeight: 700, 
            color: '#FAF8F3', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap', 
            letterSpacing: 0.2,
            lineHeight: 1.25
          }}>
            {nomeEmpresa}
          </div>
        </div>
        <button 
          onClick={onLogout} 
          aria-label="Sair" 
          title="Sair do sistema"
          style={{
            height: 30,
            padding: '0 10px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#9FBDB5',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            fontSize: 11.5,
            fontWeight: 500,
            flexShrink: 0
          }}
        >
          <LogOut size={13} />
          <span>Sair</span>
        </button>
      </div>

      {/* LINHA 2: Navegador de Mês Amplo e Claro */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 10 }}>
        <button onClick={() => setMesAtual(m => (m + 11) % 12)} aria-label="Mês anterior" style={{ background: 'none', border: 'none', color: '#E8A33D', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, minWidth: 130, textAlign: 'center', color: '#FAF8F3', letterSpacing: 0.3 }}>
          {MESES[mesAtual]}
        </div>
        <button onClick={() => setMesAtual(m => (m + 1) % 12)} aria-label="Próximo mês" style={{ background: 'none', border: 'none', color: '#E8A33D', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
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
    <div className="no-print" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#FAF8F3', borderTop: '1px solid #E5E0D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 6px calc(9px + env(safe-area-inset-bottom))', boxSizing: 'border-box', boxShadow: '0 -4px 12px rgba(0,0,0,0.04)' }}>
      {items.map(it => <NavButton key={it.id} item={it} active={tela === it.id} onClick={() => setTela(it.id)} />)}
    </div>
  );
}

function NavButton({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', color: active ? '#1F5C52' : '#9C9A8F', minWidth: 0 }}>
      <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
      <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>
    </button>
  );
}
