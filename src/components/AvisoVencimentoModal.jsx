import React from 'react';
import { AlertTriangle, Calendar, MessageCircle, Clock, ShieldCheck, X } from 'lucide-react';

export function AvisoVencimentoModal({ 
  empresa, 
  diasRestantes, 
  dataVencimentoFormatada, 
  onFecharLembrar3Dias 
}) {
  const nomeEmpresa = empresa?.nome_fantasia || empresa?.razao_social || 'Sua Empresa';
  const telWhatsApp = '5519994487795';
  const textoMsg = `Olá, sou da empresa *${nomeEmpresa}* e gostaria de antecipar a renovação do meu contrato do AMP Flow que vence em ${dataVencimentoFormatada} (${diasRestantes} dias restantes).`;
  const linkWhatsApp = `https://wa.me/${telWhatsApp}?text=${encodeURIComponent(textoMsg)}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 43, 39, 0.78)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 16
    }}>
      <div style={{
        background: '#FAF8F3',
        borderRadius: 16,
        maxWidth: 480,
        width: '100%',
        boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
        border: '1.5px solid #F59E0B',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Barra de Alerta */}
        <div style={{
          background: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
          color: '#FFFFFF',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={22} color="#FFFDF5" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
              Aviso de Renovação de Contrato
            </h3>
            <div style={{ fontSize: 11.5, color: '#FEF3C7', marginTop: 2 }}>
              Faltam {diasRestantes} dia(s) para o vencimento do seu plano
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '20px 22px' }}>
          <div style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: 12,
            padding: '14px',
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#92400E' }}>
              <Calendar size={16} />
              <span>Data de Vencimento: {dataVencimentoFormatada}</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#78350F', lineHeight: 1.5 }}>
              O contrato da empresa <strong>{nomeEmpresa}</strong> está próximo do término. Para garantir a continuidade ininterrupta de suas emissões de notas, lançamentos e relatórios gerenciais, providencie a renovação com antecedência.
            </p>
          </div>

          <div style={{
            fontSize: 12,
            color: '#4B5563',
            background: '#F3F4F6',
            padding: '10px 12px',
            borderRadius: 8,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Clock size={16} color="#6B7280" />
            <span>Ao não renovar até o vencimento, o painel será automaticamente bloqueado.</span>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onFecharLembrar3Dias}
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                borderRadius: 10,
                padding: '13px',
                fontSize: 14,
                fontWeight: 800,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 3px 10px rgba(37,211,102,0.25)'
              }}
            >
              <MessageCircle size={18} />
              <span>Renovar Assinatura no WhatsApp</span>
            </a>

            <button
              onClick={onFecharLembrar3Dias}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 10,
                padding: '11px',
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Entendi (lembrar-me daqui a 3 dias)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
