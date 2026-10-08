// src/components/VisualizarComprovanteModal.jsx
// Visualizador de Comprovante Fiscal / Recibo Digital (Cofre Sem Papel)
// Permite visualizar em tela cheia, baixar, imprimir e conferir detalhes da despesa

import React, { useState } from 'react';
import { X, Download, Printer, ExternalLink, ZoomIn, ZoomOut, FileText, CheckCircle2 } from 'lucide-react';
import { ModalShell } from './UIComponents';
import { formatBRL } from '../utils/formatters';

export function VisualizarComprovanteModal({ lancamento, onClose, onRemoverComprovante }) {
  if (!lancamento || !lancamento.comprovante_url) return null;

  const url = lancamento.comprovante_url;
  const isPdf = url.toLowerCase().includes('.pdf') || url.startsWith('data:application/pdf');
  const [zoom, setZoom] = useState(1);

  function handleDownload() {
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprovante_${lancamento.dia}_${lancamento.mes + 1}_${lancamento.descricao || 'Despesa'}.${isPdf ? 'pdf' : 'webp'}`;
    a.target = '_blank';
    a.click();
  }

  function handleImprimir() {
    if (isPdf) {
      window.open(url, '_blank');
      return;
    }
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Comprovante - ${lancamento.descricao || 'Lançamento'}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
            img { max-width: 95vw; max-height: 95vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${url}" onload="window.print();" />
        </body>
      </html>
    `);
    win.document.close();
  }

  return (
    <ModalShell onClose={onClose} maxWidth={680}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="#1E293B" />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Comprovante Digital • {lancamento.descricao || 'Despesa'}
            </h3>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
              Valor: <strong style={{ color: '#0F172A' }}>{formatBRL(lancamento.valor)}</strong> • Data: {lancamento.dia}/{lancamento.mes + 1}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4 }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Barra de Ações Rápidas da Foto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isPdf && (
            <>
              <button
                type="button"
                onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
                style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#334155' }}
                title="Reduzir zoom"
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
                style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#334155' }}
                title="Aumentar zoom"
              >
                <ZoomIn size={13} />
              </button>
            </>
          )}
          <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 6 }}>
            <CheckCircle2 size={13} /> Arquivado na nuvem
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleImprimir}
            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, padding: '5px 10px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#334155' }}
          >
            <Printer size={13} />
            <span>Imprimir</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            style={{ background: '#1E293B', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#FFFFFF' }}
          >
            <Download size={13} />
            <span>Baixar Arquivo</span>
          </button>
        </div>
      </div>

      {/* Área de Visualização do Documento */}
      <div style={{ background: '#0F172A', borderRadius: 10, padding: 12, minHeight: 320, maxHeight: '60vh', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {isPdf ? (
          <iframe
            src={url}
            title="Comprovante PDF"
            style={{ width: '100%', height: '55vh', border: 'none', borderRadius: 6, background: '#fff' }}
          />
        ) : (
          <div style={{ overflow: 'auto', maxWidth: '100%', maxHeight: '55vh', display: 'flex', justifyContent: 'center' }}>
            <img
              src={url}
              alt="Comprovante"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s',
                maxWidth: '100%',
                maxHeight: '52vh',
                objectFit: 'contain',
                borderRadius: 6,
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        )}
      </div>

      {onRemoverComprovante && (
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <button
            type="button"
            onClick={() => {
              if (confirm('Deseja remover este anexo do lançamento?')) {
                onRemoverComprovante(lancamento.id);
                onClose();
              }
            }}
            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Remover este comprovante
          </button>
        </div>
      )}
    </ModalShell>
  );
}
