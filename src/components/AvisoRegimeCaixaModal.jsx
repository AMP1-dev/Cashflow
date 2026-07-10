import React from 'react';

export function AvisoRegimeCaixaModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 24, maxWidth: 500, width: '100%',
        position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
            fontSize: 20, cursor: 'pointer', color: '#666'
          }}
        >
          ✕
        </button>
        <h2 style={{ marginTop: 0, color: '#1C2421', fontSize: 20, marginBottom: 16 }}>
          Painel de Diagnóstico Financeiro
        </h2>
        <p style={{ color: '#4A5568', lineHeight: 1.5, marginBottom: 16 }}>
          Ferramenta de apoio à gestão financeira baseada no regime de caixa, destinada à análise gerencial de pequenos negócios. Não substitui a contabilidade nem as demonstrações financeiras elaboradas pelo regime de competência.
        </p>
        <div style={{ background: '#FFF4E5', borderLeft: '4px solid #FF9800', padding: 12, borderRadius: 4 }}>
          <strong style={{ color: '#E65100', display: 'block', marginBottom: 4 }}>Importante:</strong>
          <span style={{ color: '#E65100', fontSize: 14, lineHeight: 1.4 }}>
            Esta ferramenta utiliza o regime de caixa para análise gerencial. Os resultados apresentados podem diferir das demonstrações contábeis elaboradas pelo regime de competência.
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 24, width: '100%', padding: '12px', background: '#333', color: '#fff',
            border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
