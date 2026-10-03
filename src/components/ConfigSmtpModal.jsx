import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, KeyRound, Server, Send, CheckCircle, AlertCircle, X, HelpCircle } from 'lucide-react';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';
import { obterConfigSmtp, salvarConfigSmtp, PROVEDORES_SMTP_SUGERIDOS } from '../utils/emailService';

export function ConfigSmtpModal({ empresa, onClose, onSalvo }) {
  const [provedorId, setProvedorId] = useState('custom');
  const [host, setHost] = useState('');
  const [porta, setPorta] = useState(587);
  const [seguranca, setSeguranca] = useState('tls');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeRemetente, setNomeRemetente] = useState('');
  const [emailResposta, setEmailResposta] = useState('');
  const [conteudoPadrao, setConteudoPadrao] = useState('');
  const [assinatura, setAssinatura] = useState('');
  const [ativo, setAtivo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    if (empresa?.id) {
      const cfg = obterConfigSmtp(empresa.id);
      setProvedorId(cfg.provedor || 'custom');
      setHost(cfg.host || '');
      setPorta(cfg.porta || 587);
      setSeguranca(cfg.seguranca || 'tls');
      setUsuario(cfg.usuario || '');
      setSenha(cfg.senha || '');
      setNomeRemetente(cfg.nomeRemetente || empresa.razao_social || 'AMP DO BRASIL');
      setEmailResposta(cfg.emailResposta || empresa.email_contato || 'atendimento@amp.adm.br');
      setConteudoPadrao(cfg.conteudoPadrao || 'Olá {cliente},\n\nSegue em anexo a Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) referente ao serviço prestado.\n\nQualquer dúvida, estamos à disposição.\n\n{assinatura}');
      setAssinatura(cfg.assinatura || 'Atenciosamente,\nAMP DO BRASIL SOLUÇÕES ADMINISTRATIVAS E TECNOLÓGICAS LTDA\n(19) 99448-7795 | atendimento@amp.adm.br');
      setAtivo(Boolean(cfg.ativo));
    }
  }, [empresa?.id]);

  function handleSelecionarProvedor(id) {
    setProvedorId(id);
    const sel = PROVEDORES_SMTP_SUGERIDOS.find(p => p.id === id);
    if (sel && sel.host) {
      setHost(sel.host);
      setPorta(sel.porta);
      setSeguranca(sel.seguranca);
    }
  }

  async function handleSalvar() {
    setSalvando(true);
    setMensagemSucesso('');
    try {
      const payload = {
        provedor: provedorId,
        host: host.trim(),
        porta: parseInt(porta) || 587,
        seguranca,
        usuario: usuario.trim(),
        senha: senha.trim(),
        nomeRemetente: nomeRemetente.trim(),
        emailResposta: emailResposta.trim(),
        conteudoPadrao,
        assinatura,
        ativo,
        atualizadoEm: new Date().toISOString()
      };

      await salvarConfigSmtp(empresa.id, payload);
      setMensagemSucesso('Configurações de SMTP e Assinatura salvas com sucesso!');
      if (onSalvo) onSalvo(payload);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      alert('Erro ao salvar configurações de e-mail: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ModalShell onClose={onClose} maxWidth={640}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#D9EBE6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={20} color="#0F2B27" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F2B27', margin: 0 }}>
              Configuração do Provedor de E-mail (SMTP)
            </h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
              Configure o envio direto de NFS-e (PDF/XML) e a sua assinatura corporativa
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

      {mensagemSucesso && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#065F46', fontSize: 12.5, fontWeight: 600 }}>
          <CheckCircle size={16} />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* Escolha do Provedor Rápido */}
        <div>
          <FieldLabel>Provedor de E-mail</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginTop: 4 }}>
            {PROVEDORES_SMTP_SUGERIDOS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelecionarProvedor(p.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: provedorId === p.id ? '2px solid #1F5C52' : '1px solid #E5E0D5',
                  background: provedorId === p.id ? '#D9EBE6' : '#fff',
                  color: provedorId === p.id ? '#0F2B27' : '#4B5563',
                  textAlign: 'center'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Servidor Host e Porta */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>Servidor SMTP (Host)</FieldLabel>
            <input
              type="text"
              placeholder="ex: smtp.gmail.com ou mail.amp.adm.br"
              value={host}
              onChange={e => setHost(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <FieldLabel>Porta</FieldLabel>
            <input
              type="number"
              placeholder="587 ou 465"
              value={porta}
              onChange={e => setPorta(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <FieldLabel>Segurança</FieldLabel>
            <select
              value={seguranca}
              onChange={e => setSeguranca(e.target.value)}
              style={inputStyle}
            >
              <option value="tls">TLS (STARTTLS)</option>
              <option value="ssl">SSL</option>
            </select>
          </div>
        </div>

        {/* Usuário e Senha */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>E-mail / Usuário de Autenticação</FieldLabel>
            <input
              type="email"
              placeholder="ex: atendimento@amp.adm.br"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <FieldLabel>Senha ou Senha de Aplicativo (Token)</FieldLabel>
            <input
              type="password"
              placeholder="••••••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Nome do Remetente e E-mail de Resposta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>Nome do Remetente (Exibido ao Cliente)</FieldLabel>
            <input
              type="text"
              placeholder="AMP do Brasil"
              value={nomeRemetente}
              onChange={e => setNomeRemetente(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <FieldLabel>E-mail de Resposta (Reply-To)</FieldLabel>
            <input
              type="email"
              placeholder="atendimento@amp.adm.br"
              value={emailResposta}
              onChange={e => setEmailResposta(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Assinatura Corporativa Personalizada */}
        <div>
          <FieldLabel>
            Sua Assinatura de E-mail (Texto ou HTML simples)
          </FieldLabel>
          <textarea
            rows={4}
            placeholder="Cole aqui a sua assinatura personalizada..."
            value={assinatura}
            onChange={e => setAssinatura(e.target.value)}
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 11.5, resize: 'vertical' }}
          />
          <span style={{ fontSize: 11, color: '#6B7280', marginTop: 3, display: 'block' }}>
            Esta assinatura será anexada no rodapé de todas as mensagens automáticas de NFS-e.
          </span>
        </div>

        {/* Checkbox Ativo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <input
            type="checkbox"
            id="smtp-ativo"
            checked={ativo}
            onChange={e => setAtivo(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#1F5C52' }}
          />
          <label htmlFor="smtp-ativo" style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
            Ativar disparo automático direto pelo servidor SMTP
          </label>
        </div>

        {/* Botão de Salvar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
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
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSalvar}
            disabled={salvando}
            style={{
              background: '#1F5C52',
              border: 'none',
              borderRadius: 8,
              padding: '9px 20px',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <ShieldCheck size={16} />
            <span>{salvando ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
