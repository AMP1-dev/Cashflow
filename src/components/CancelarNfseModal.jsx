import React, { useState } from 'react';
import { AlertTriangle, XCircle, ShieldAlert, CheckCircle, X } from 'lucide-react';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';
import { formatBRL } from '../utils/formatters';

export const MOTIVOS_CANCELAMENTO_RFB = [
  { codigo: '1', label: '1 - Erro na Emissão / Dados Incorretos' },
  { codigo: '2', label: '2 - Serviço Não Prestado / Cancelado pelo Cliente' },
  { codigo: '3', label: '3 - Erro de Assinatura ou Enquadramento Tributário' },
  { codigo: '9', label: '9 - Outros Motivos Justificados' },
];

export function CancelarNfseModal({ nota, empresa, onClose, onConfirmarCancelamento }) {
  const [motivo, setMotivo] = useState('1');
  const [justificativa, setJustificativa] = useState('');
  const [estornarCaixa, setEstornarCaixa] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  const valorFormatado = formatBRL(nota?.servico?.valorTotal || 0);

  async function handleConfirmar() {
    setErro('');
    if (!justificativa.trim() || justificativa.trim().length < 10) {
      setErro('Informe uma justificativa clara para o cancelamento (mínimo 10 caracteres).');
      return;
    }

    setProcessando(true);
    try {
      await onConfirmarCancelamento({
        numero: nota.numero,
        motivo,
        justificativa: justificativa.trim(),
        estornarCaixa,
      });
      onClose();
    } catch (e) {
      setErro('Falha ao cancelar nota: ' + (e.message || 'Erro desconhecido.'));
      setProcessando(false);
    }
  }

  return (
    <ModalShell onClose={onClose} maxWidth={520}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={22} color="#DC2626" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#991B1B', margin: 0 }}>
              Cancelar NFS-e Nº {nota?.numero}
            </h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
              {nota?.tomador?.razaoSocial || 'Cliente'} • {valorFormatado}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 12px', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.4 }}>
          <strong>Atenção:</strong> O cancelamento de uma nota fiscal é uma operação fiscal definitiva perante o Fisco. Se você precisa corrigir valores ou o tomador para emitir novamente, considere também a opção <strong>Substituir Nota</strong>.
        </div>
      </div>

      {erro && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 12, color: '#991B1B', fontSize: 12, fontWeight: 600 }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <FieldLabel>Motivo do Cancelamento (Padrão Nacional RFB)</FieldLabel>
          <select
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            style={inputStyle}
          >
            {MOTIVOS_CANCELAMENTO_RFB.map(m => (
              <option key={m.codigo} value={m.codigo}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>Justificativa do Cancelamento</FieldLabel>
          <textarea
            rows={3}
            placeholder="Descreva o motivo do cancelamento (ex: Erro no valor total ou cancelamento do contrato pelo cliente)..."
            value={justificativa}
            onChange={e => setJustificativa(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <input
            type="checkbox"
            id="estornar-caixa"
            checked={estornarCaixa}
            onChange={e => setEstornarCaixa(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#DC2626' }}
          />
          <label htmlFor="estornar-caixa" style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
            Atualizar Fluxo de Caixa (estornar/cancelar receita correspondente a esta nota)
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: 8,
              padding: '9px 16px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#4B5563',
              cursor: 'pointer'
            }}
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={processando}
            style={{
              background: '#DC2626',
              border: 'none',
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <ShieldAlert size={15} />
            <span>{processando ? 'Cancelando...' : 'Confirmar Cancelamento'}</span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
