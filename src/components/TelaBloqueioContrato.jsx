import React from 'react';
import { Lock, AlertCircle, MessageCircle, LogOut, ShieldAlert } from 'lucide-react';

export function TelaBloqueioContrato({ 
  empresa, 
  dataVencimentoFormatada, 
  onLogout,
  onBypassAdmin 
}) {
  const nomeEmpresa = empresa?.nome_fantasia || empresa?.razao_social || 'Sua Empresa';
  const telWhatsApp = '5519994487795';
  const textoMsg = `Olá! Sou da empresa *${nomeEmpresa}* e o acesso ao nosso painel AMP Flow foi bloqueado por vencimento do contrato (${dataVencimentoFormatada || 'Expirado'}). Gostaria de regularizar o pagamento para liberação imediata.`;
  const linkWhatsApp = `https://wa.me/${telWhatsApp}?text=${encodeURIComponent(textoMsg)}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F2B27 0%, #071715 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      color: '#FAF8F3',
      fontFamily: 'var(--font-sans, system-ui)'
    }}>
      <div style={{
        background: '#FAF8F3',
        color: '#1C2421',
        borderRadius: 20,
        maxWidth: 520,
        width: '100%',
        padding: '36px 28px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        border: '1.5px solid #EF4444',
        textAlign: 'center'
      }}>
        {/* Ícone de Bloqueio */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#DC2626'
        }}>
          <Lock size={36} />
        </div>

        {/* Título & Subtítulo */}
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#111827',
          margin: '0 0 8px',
          fontFamily: 'Georgia, serif'
        }}>
          Acesso Temporariamente Suspenso
        </h1>

        <div style={{
          fontSize: 13.5,
          color: '#4B5563',
          marginBottom: 20
        }}>
          O contrato da empresa <strong>{nomeEmpresa}</strong> venceu em{' '}
          <strong style={{ color: '#DC2626' }}>{dataVencimentoFormatada || 'data anterior'}</strong> e não foi identificado o pagamento da renovação.
        </div>

        {/* Card Informativo */}
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 24,
          textAlign: 'left',
          fontSize: 12.5,
          color: '#991B1B',
          lineHeight: 1.5
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={15} />
            <span>Por que isso aconteceu?</span>
          </div>
          Conforme as regras contratuais da plataforma, os recursos de visualização de fluxo de caixa, emissão de NFS-e e relatórios contábeis são bloqueados automaticamente após a data limite. Seus dados continuam totalmente seguros e preservados.
        </div>

        {/* Botão de Renovação via WhatsApp */}
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#25D366',
            color: '#FFFFFF',
            borderRadius: 12,
            padding: '15px 20px',
            fontSize: 15,
            fontWeight: 800,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
            marginBottom: 12
          }}
        >
          <MessageCircle size={20} />
          <span>Falar com o Suporte e Regularizar Acesso</span>
        </a>

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              marginTop: 6
            }}
          >
            <LogOut size={15} /> Sair da Conta
          </button>
        )}

        {/* Se for Administrador em Modo de Teste */}
        {onBypassAdmin && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed #D1D5DB' }}>
            <button
              onClick={onBypassAdmin}
              style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                color: '#92400E',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🛡️ Entrar mesmo assim (Privilégio Administrador)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
