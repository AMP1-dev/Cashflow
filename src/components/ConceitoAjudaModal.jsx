import React from 'react';
import { HelpCircle, X, Lightbulb, Target, Calculator } from 'lucide-react';

export function ConceitoAjudaModal({ isOpen, onClose, titulo, conceito, porQueImporta, exemplo }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #EFEBE0',
          position: 'relative',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Decorative Top Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to right, #10B981, #14B8A6, #0284C7)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'all 0.2s',
          }}
        >
          <X size={18} />
        </button>

        {/* Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
          <div
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#CCFBF1',
              color: '#0D9488',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <HelpCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#0D9488', textTransform: 'uppercase' }}>
              Guia Conceitual & Ajuda
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>
              {titulo}
            </h3>
          </div>
        </div>

        {/* Content Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
          
          {/* Card 1: O que é */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              <Lightbulb size={17} color="#F59E0B" />
              <span>O que é este conceito?</span>
            </div>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.5, paddingLeft: 25, fontSize: 12.5 }}>{conceito}</p>
          </div>

          {/* Card 2: Por que importa */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>
              <Target size={17} color="#059669" />
              <span>Por que isso é vital para sua empresa?</span>
            </div>
            <p style={{ margin: 0, color: '#047857', lineHeight: 1.5, paddingLeft: 25, fontSize: 12.5 }}>{porQueImporta}</p>
          </div>

          {/* Card 3: Exemplo Prático */}
          {exemplo && (
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#075985', marginBottom: 4 }}>
                <Calculator size={17} color="#0284C7" />
                <span>Exemplo Prático</span>
              </div>
              <p style={{ margin: 0, color: '#0369A1', lineHeight: 1.5, paddingLeft: 25, fontSize: 12, fontFamily: 'monospace', whitespace: 'pre-line' }}>
                {exemplo}
              </p>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div style={{ paddingTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: '#0F172A',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.2s',
            }}
          >
            Entendi! Voltar ao sistema
          </button>
        </div>
      </div>
    </div>
  );
}
