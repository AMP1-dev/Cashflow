import React, { useState, useEffect } from 'react';
import { Mail, Send, Paperclip, ExternalLink, Settings, CheckCircle, AlertTriangle, X, Copy, Check } from 'lucide-react';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';
import { obterConfigSmtp, montarMensagemNfse, gerarLinkMailto, dispararEmailNfse } from '../utils/emailService';

export function EnviarEmailNfseModal({ nota, empresa, onClose, onAbrirConfigSmtp }) {
  const [destinatario, setDestinatario] = useState('');
  const [assunto, setAssunto] = useState('');
  const [corpo, setCorpo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const config = obterConfigSmtp(empresa?.id);

  useEffect(() => {
    if (nota) {
      const msg = montarMensagemNfse(nota, empresa, config);
      setDestinatario(msg.destinatario || '');
      setAssunto(msg.assunto || `NFS-e Nº ${nota.numero} - ${msg.prestador}`);
      setCorpo(msg.corpo || 'Segue anexo nota fiscal do serviço prestado.');
    }
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
        assunto: assunto.trim(),
        corpo: corpo.trim(),
        nota,
        empresa,
      });

      if (res.via === 'smtp_backend' && res.ok) {
        setStatusEnvio({ tipo: 'sucesso', msg: 'E-mail enviado com sucesso diretamente pelo provedor SMTP!' });
        setTimeout(() => onClose(), 2000);
      } else {
        // Abre o link mailto
        window.open(res.linkMailto, '_blank');
        setStatusEnvio({
          tipo: 'info',
          msg: 'Cliente de e-mail aberto com mensagem e assunto prontos! Se desejar envio 100% silencioso pelo servidor, ative as credenciais na Configuração SMTP.'
        });
      }
    } catch (e) {
      setStatusEnvio({ tipo: 'erro', msg: 'Erro ao disparar e-mail: ' + e.message });
    } finally {
      setEnviando(false);
    }
  }

  function handleAbrirMailto() {
    const link = gerarLinkMailto(destinatario, assunto, corpo);
    window.location.href = link;
  }

  return (
    <ModalShell onClose={onClose} maxWidth={580}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#D9EBE6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={20} color="#0F2B27" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F2B27', margin: 0 }}>
              Enviar NFS-e Nº {nota?.numero} por E-mail
            </h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
              {nota?.tomador?.razaoSocial || 'Cliente Tomador'}
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

      {statusEnvio && (
        <div style={{
          background: statusEnvio.tipo === 'sucesso' ? '#ECFDF5' : (statusEnvio.tipo === 'info' ? '#EFF6FF' : '#FEF2F2'),
          border: `1px solid ${statusEnvio.tipo === 'sucesso' ? '#A7F3D0' : (statusEnvio.tipo === 'info' ? '#BFDBFE' : '#FECACA')}`,
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: statusEnvio.tipo === 'sucesso' ? '#065F46' : (statusEnvio.tipo === 'info' ? '#1E40AF' : '#991B1B'),
          fontSize: 12,
          fontWeight: 600
        }}>
          {statusEnvio.tipo === 'sucesso' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{statusEnvio.msg}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Destinatário */}
        <div>
          <FieldLabel>E-mail do Destinatário</FieldLabel>
          <input
            type="email"
            placeholder="cliente@exemplo.com.br"
            value={destinatario}
            onChange={e => setDestinatario(e.target.value)}
            style={inputStyle}
          />
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

        {/* Mensagem e Assinatura */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <FieldLabel>Mensagem / Conteúdo</FieldLabel>
            <button
              type="button"
              onClick={handleCopiarTexto}
              style={{
                background: 'none',
                border: 'none',
                color: '#1F5C52',
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
            rows={6}
            value={corpo}
            onChange={e => setCorpo(e.target.value)}
            style={{ ...inputStyle, fontSize: 12, lineHeight: 1.4, resize: 'vertical' }}
          />
        </div>

        {/* Anexos inclusos */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Paperclip size={14} color="#64748B" />
            <span>Documentos anexados à mensagem:</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, background: '#E2E8F0', color: '#1E293B', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
              📄 DANFSe_NFe_{nota?.numero}.pdf
            </span>
            <span style={{ fontSize: 11, background: '#E2E8F0', color: '#1E293B', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
              ⚙️ NFSe_{nota?.numero}.xml
            </span>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
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
                color: '#1F5C52',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Settings size={13} />
              <span>Configurar SMTP / Assinatura</span>
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
              <span>Abrir no Webmail / Outlook</span>
            </button>

            <button
              type="button"
              onClick={handleEnviarDireto}
              disabled={enviando}
              style={{
                background: '#1F5C52',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Send size={13} />
              <span>{enviando ? 'Disparando...' : 'Enviar E-mail'}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
