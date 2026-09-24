import { Activity, ChevronLeft, ChevronRight, ClipboardList, FileBarChart, LayoutDashboard, ListChecks, LogOut, Plus, Tag, TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import { MESES } from '../utils/constants';

export function TopBar({ empresa, usuario, onLogout, mesAtual, setMesAtual, onAbrirEquipe, ehDono, onAbrirNfse, onAbrirAgendamento, onAbrirAdmin }) {
  const temBotoesModulos = Boolean(onAbrirAdmin || (ehDono && (onAbrirAgendamento || onAbrirNfse || onAbrirEquipe)));

  return (
    <div className="no-print" style={{ background: '#0F2B27', color: '#FAF8F3', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 10, borderRadius: '0 0 20px 20px', boxShadow: '0 4px 12px rgba(15, 43, 39, 0.15)' }}>
      {/* LINHA 1: Nome da empresa e Usuário (Largura total) + Botão Sair */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, color: '#9FBDB5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{usuario}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#FAF8F3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: 0.2 }}>{empresa.nome}</div>
        </div>
        <button 
          onClick={onLogout} 
          aria-label="Sair" 
          title="Sair do sistema"
          style={{
            height: 32,
            padding: '0 10px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#9FBDB5',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 500,
            flexShrink: 0
          }}
        >
          <LogOut size={14} />
          <span>Sair</span>
        </button>
      </div>

      {/* LINHA 2: Barra dedicada de botões de Módulos */}
      {temBotoesModulos && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
          {onAbrirAdmin && (
            <button 
              onClick={onAbrirAdmin} 
              title="Painel Administrativo" 
              style={{
                height: 30,
                padding: '0 10px',
                borderRadius: 8,
                background: 'rgba(232, 163, 61, 0.18)',
                border: '1px solid rgba(232, 163, 61, 0.5)',
                color: '#FCD34D',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                fontSize: 11.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              <span>⚡ Admin</span>
            </button>
          )}
          {ehDono && onAbrirAgendamento && (
            <button 
              onClick={onAbrirAgendamento} 
              title="Agenda & Atendimentos" 
              style={{
                height: 30,
                padding: '0 10px',
                borderRadius: 8,
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                color: '#FDE047',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                fontSize: 11.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              <Calendar size={13} />
              <span>Agenda</span>
            </button>
          )}
          {ehDono && onAbrirNfse && (
            <button 
              onClick={onAbrirNfse} 
              title="Notas Fiscais de Serviços (NFS-e)" 
              style={{
                height: 30,
                padding: '0 10px',
                borderRadius: 8,
                background: 'rgba(159, 224, 200, 0.18)',
                border: '1px solid rgba(159, 224, 200, 0.5)',
                color: '#A7F3D0',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                fontSize: 11.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              <FileText size={13} />
              <span>NFS-e</span>
            </button>
          )}
          {ehDono && onAbrirEquipe && (
            <button 
              onClick={onAbrirEquipe} 
              title="Gerenciar Equipe" 
              aria-label="Gerenciar Equipe" 
              style={{
                height: 30,
                padding: '0 10px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FAF8F3',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                fontSize: 11.5,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              <Users size={13} />
              <span>Equipe</span>
            </button>
          )}
        </div>
      )}
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
