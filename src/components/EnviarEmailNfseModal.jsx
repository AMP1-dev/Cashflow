import React, { useState, useEffect } from 'react';
import { Mail, Send, Paperclip, ExternalLink, Settings, CheckCircle, AlertTriangle, X, Copy, Check, ShieldCheck } from 'lucide-react';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';
import { 
  carregarConfigSmtpNuvem, 
  obterConfigSmtp, 
  montarMensagemNfse, 
  gerarLinkMailto, 
  dispararEmailNfse,
  ASSINATURA_OFICIAL_PADRAO 
} from '../utils/emailService';

export function EnviarEmailNfseModal({ nota, empresa, onClose, onAbrirConfigSmtp, onSucessoEnvio }) {
  const [destinatario, setDestinatario] = useState('');
  const [copia, setCopia] = useState('');
  const [assunto, setAssunto] = useState('');
  const [corpo, setCorpo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [configSmtp, setConfigSmtp] = useState(() => obterConfigSmtp(empresa?.id));

  useEffect(() => {
    async function inicializar() {
      if (empresa?.id) {
        const cfg = await carregarConfigSmtpNuvem(empresa.id);
        setConfigSmtp(cfg);
        setCopia(cfg.emailCopia || cfg.usuario || 'atendimento@amp.adm.br');
        if (nota) {
          const msg = montarMensagemNfse(nota, empresa, cfg);
          setDestinatario(msg.destinatario || '');
          if (msg.copia) setCopia(msg.copia);
          setAssunto(msg.assunto || `Nota Fiscal de Serviços Eletrônica (NFS-e Nº ${nota.numero}) - ${msg.prestador}`);
          setCorpo(msg.corpo || 'Olá,\n\nSegue em anexo a Nota Fiscal de Serviços Eletrônica referente aos serviços prestados.');
        }
      }
    }
    inicializar();
  }, [nota, empresa?.id]);

  function handleCopiarTexto() {
    navigator.clipboard.writeText(`${assunto}\n\n${corpo}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function handleEnviarDireto() {
    if (!destinatario.trim()) {
      alert('Informe o e-mail do destinatário.');
      return;
    }

    setEnviando(true);
    setStatusEnvio(null);

    try {
      const res = await dispararEmailNfse({
        empresaId: empresa?.id,
        destinatario: destinatario.trim(),
        copia: copia.trim(),
        assunto: assunto.trim(),
        corpo: corpo.trim(),
        nota,
        empresa,
      });

      // Registra a nota como ENVIADA no estado e no banco de dados
      if (onSucessoEnvio) {
        await onSucessoEnvio(nota, { 
          destinatario: destinatario.trim(), 
          copia: copia.trim() 
        });
      }

      setStatusEnvio({ 
        tipo: 'sucesso', 
        msg: `E-mail enviado com sucesso com DANFSe (PDF) e XML para ${destinatario}${copia.trim() ? ` (com cópia para ${copia.trim()})` : ''}!` 
      });

      // Fecha automaticamente a janela para não prender a tela do usuário
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (e) {
      setStatusEnvio({ tipo: 'erro', msg: 'Erro ao disparar e-mail: ' + e.message });
    } finally {
      setEnviando(false);
    }
  }

  function handleAbrirMailto() {
    const link = gerarLinkMailto(destinatario, assunto, corpo, copia);
    window.location.href = link;
    if (onSucessoEnvio) {
      onSucessoEnvio(nota, { 
        destinatario: destinatario.trim(), 
        copia: copia.trim() 
      });
    }
    setStatusEnvio({
      tipo: 'sucesso',
      msg: `Webmail aberto com sucesso! Destinatário: ${destinatario}${copia ? ` (com cópia para ${copia})` : ''}`
    });
    setTimeout(() => {
      onClose();
    }, 1800);
  }

  return (
    <ModalShell onClose={onClose} maxWidth={640}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={22} color="#1E293B" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', margin: 0 }}>
              Enviar NFS-e Nº {nota?.numero} por E-mail
            </h2>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
              {nota?.tomador?.razaoSocial || 'Cliente Tomador'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4 }}
        >
          <X size={20} />
        </button>
      </div>

      {statusEnvio && (
        <div style={{
          background: statusEnvio.tipo === 'sucesso' ? '#ECFDF5' : (statusEnvio.tipo === 'info' ? '#EFF6FF' : '#FEF2F2'),
          border: `1px solid ${statusEnvio.tipo === 'sucesso' ? '#A7F3D0' : (statusEnvio.tipo === 'info' ? '#BFDBFE' : '#FECACA')}`,
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 12,
          display: 'flex',
          flexDirection: statusEnvio.tipo === 'erro' ? 'column' : 'row',
          alignItems: statusEnvio.tipo === 'erro' ? 'flex-start' : 'center',
          gap: 8,
          color: statusEnvio.tipo === 'sucesso' ? '#065F46' : (statusEnvio.tipo === 'info' ? '#1E40AF' : '#991B1B'),
          fontSize: 12,
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {statusEnvio.tipo === 'sucesso' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span>{statusEnvio.msg}</span>
          </div>
          {statusEnvio.tipo === 'erro' && (
            <button
              onClick={handleAbrirMailto}
              style={{
                marginTop: 4,
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #DC2626',
                background: '#fff',
                color: '#B91C1C',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <ExternalLink size={13} />
              <span>Abrir no Webmail / Outlook com anexos</span>
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Destinatário e Cópia (CC) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          <div>
            <FieldLabel>E-mail do Destinatário (Cliente)</FieldLabel>
            <input
              type="email"
              placeholder="cliente@exemplo.com.br"
              value={destinatario}
              onChange={e => setDestinatario(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <FieldLabel>Com Cópia para (CC) — Receba em seu e-mail</FieldLabel>
            <input
              type="email"
              placeholder="atendimento@amp.adm.br"
              value={copia}
              onChange={e => setCopia(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Assunto */}
        <div>
          <FieldLabel>Assunto do E-mail</FieldLabel>
          <input
            type="text"
            value={assunto}
            onChange={e => setAssunto(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Pré-visualização da Assinatura e Logo MP */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
              src="/logo_assinatura_mp.png" 
              alt="MP _ AMPLIANDO SUA TECNOLOGIA" 
              style={{ maxHeight: 28, maxWidth: 160, objectFit: 'contain' }} 
            />
            <span style={{ fontSize: 11, color: '#475569' }}>
              Remetente Oficial: <strong>MARCO ANTONIO PAVANI</strong>
            </span>
          </div>
          <span style={{ fontSize: 10, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
            Logo Anexado
          </span>
        </div>

        {/* Mensagem e Assinatura */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <FieldLabel>Mensagem com Termo de Confidencialidade</FieldLabel>
            <button
              type="button"
              onClick={handleCopiarTexto}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {copiado ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar Mensagem</>}
            </button>
          </div>
          <textarea
            rows={7}
            value={corpo}
            onChange={e => setCorpo(e.target.value)}
            style={{ ...inputStyle, fontSize: 11.5, lineHeight: 1.35, resize: 'vertical', fontFamily: 'monospace' }}
          />
        </div>

        {/* Anexos inclusos: Nota Fiscal PDF, DANFSe PDF e XML */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 12px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Paperclip size={14} color="#64748B" />
            <span>3 Documentos oficiais anexados automaticamente nesta mensagem:</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, background: '#E2E8F0', color: '#1E293B', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
              📑 NotaFiscal_NFSe_{nota?.numero}.pdf (Nota Fiscal em PDF)
            </span>
            <span style={{ fontSize: 11, background: '#E2E8F0', color: '#1E293B', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
              📄 DANFSe_NFe_{nota?.numero}.pdf (Documento Auxiliar)
            </span>
            <span style={{ fontSize: 11, background: '#E2E8F0', color: '#1E293B', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
              ⚙️ NFSe_{nota?.numero}_Assinada.xml (Arquivo XML Receita)
            </span>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, flexWrap: 'wrap', gap: 8 }}>
          {onAbrirConfigSmtp ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAbrirConfigSmtp();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Settings size={13} />
              <span>Configurar SMTP / Provedor</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={handleAbrirMailto}
              title="Abrir no aplicativo padrão de e-mail (Outlook / Webmail)"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <ExternalLink size={13} />
              <span>Abrir no Webmail</span>
            </button>

            <button
              type="button"
              onClick={handleEnviarDireto}
              disabled={enviando}
              style={{
                background: enviando ? '#9CA3AF' : '#1E293B',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                cursor: enviando ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 2px 4px rgba(30,41,59,0.2)'
              }}
            >
              <Send size={13} />
              <span>{enviando ? 'Enviando...' : 'Enviar E-mail Direto (SMTP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
