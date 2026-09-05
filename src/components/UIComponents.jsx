import React from 'react';
import { X } from 'lucide-react';

export function ModalShell({ children, onClose, titulo }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,43,39,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 12 }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#FAF8F3', borderRadius: 16, padding: '16px 18px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box', boxShadow: '0 10px 35px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 17.5, fontWeight: 600, color: '#1C2421' }}>{titulo}</div>
          <button onClick={onClose} aria-label="Fechar" style={{ background: '#EFEBE0', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5C5A4F' }}>
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FieldLabel({ children }) {
  return <div style={{ fontSize: 11.5, color: '#8C897E', marginTop: 10, marginBottom: 4, fontWeight: 600 }}>{children}</div>;
}

export function ToggleTipo({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        border: `1px solid ${active ? color : '#E5E0D5'}`,
        background: active ? color : '#fff',
        color: active ? '#fff' : '#5C5A4F',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export function EmptyState({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '28px 16px', color: '#9C9A8F', fontSize: 13, background: '#fff', borderRadius: 12, border: '1px dashed #E5E0D5' }}>
      {text}
    </div>
  );
}

export const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E0D5', fontSize: 14, boxSizing: 'border-box', background: '#fff', color: '#1C2421' };

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, textAlign: 'center', background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: 14, margin: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#C53030', marginBottom: 8 }}>
            ⚠️ Ocorreu um problema ao exibir esta tela
          </div>
          <p style={{ fontSize: 13, color: '#742A2A', marginBottom: 16, lineHeight: 1.5 }}>
            {this.state.error?.message || 'Dados temporariamente indisponíveis.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1F5C52', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Voltar ao Início
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
