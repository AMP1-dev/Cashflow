import React from 'react';
import { X } from 'lucide-react';

export function ModalShell({ children, onClose, titulo }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,43,39,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#FAF8F3', borderRadius: '20px 20px 0 0', padding: 20, maxHeight: '88vh', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 19 }}>{titulo}</div>
          <button onClick={onClose} aria-label="Fechar" style={{ background: '#EFEBE0', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5C5A4F' }}>
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FieldLabel({ children }) {
  return <div style={{ fontSize: 12, color: '#9C9A8F', marginTop: 14, marginBottom: 6, fontWeight: 500 }}>{children}</div>;
}

export function ToggleTipo({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
        border: `1px solid ${active ? color : '#E5E0D5'}`,
        background: active ? color : '#fff',
        color: active ? '#fff' : '#5C5A4F',
      }}
    >
      {label}
    </button>
  );
}

export function EmptyState({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9C9A8F', fontSize: 13.5, background: '#fff', borderRadius: 12, border: '1px dashed #E5E0D5' }}>
      {text}
    </div>
  );
}

export const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E5E0D5', fontSize: 15, boxSizing: 'border-box', background: '#fff', color: '#1C2421' };
