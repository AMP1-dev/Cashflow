import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, KeyRound, Server, Send, CheckCircle, AlertCircle, X, HelpCircle, Lock, Cloud } from 'lucide-react';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';
import { 
  obterConfigSmtp, 
  carregarConfigSmtpNuvem, 
  salvarConfigSmtp, 
  PROVEDORES_SMTP_SUGERIDOS,
  ASSINATURA_OFICIAL_PADRAO 
} from '../utils/emailService';

export function ConfigSmtpModal({ empresa, onClose, onSalvo }) {
  const [provedorId, setProvedorId] = useState('custom');
  const [host, setHost] = useState('');
  const [porta, setPorta] = useState(587);
  const [autenticado, setAutenticado] = useState(true);
  const [seguranca, setSeguranca] = useState('tls');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeRemetente, setNomeRemetente] = useState('');
  const [emailResposta, setEmailResposta] = useState('');
  const [conteudoPadrao, setConteudoPadrao] = useState('');
  const [assinatura, setAssinatura] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [carregandoNuvem, setCarregandoNuvem] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    async function carregar() {
      if (empresa?.id) {
        setCarregandoNuvem(true);
        try {
          const cfg = await carregarConfigSmtpNuvem(empresa.id);
          setProvedorId(cfg.provedor || 'custom');
          setHost(cfg.host || '');
          setPorta(cfg.porta || 587);
          setAutenticado(cfg.autenticado !== false);
          setSeguranca(cfg.seguranca || 'tls');
          setUsuario(cfg.usuario || 'atendimento@amp.adm.br');
          setSenha(cfg.senha || '');
          setNomeRemetente(cfg.nomeRemetente || 'MARCO ANTONIO PAVANI | AMP DO BRASIL');
          setEmailResposta(cfg.emailResposta || 'atendimento@amp.adm.br');
          setConteudoPadrao(cfg.conteudoPadrao || 'Olá {cliente},\n\nSegue em anexo a Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) referente ao serviço prestado no valor de {valor}.\n\nQualquer dúvida, estamos à inteira disposição.\n\n{assinatura}');
          setAssinatura(cfg.assinatura || ASSINATURA_OFICIAL_PADRAO);
          setAtivo(Boolean(cfg.ativo));
        } catch (e) {
          console.warn('Erro ao carregar dados SMTP:', e);
        } finally {
          setCarregandoNuvem(false);
        }
      }
    }
    carregar();
  }, [empresa?.id]);

  function handleSelecionarProvedor(id) {
    setProvedorId(id);
    const sel = PROVEDORES_SMTP_SUGERIDOS.find(p => p.id === id);
    if (sel && sel.host) {
      setHost(sel.host);
      setPorta(sel.porta);
      setSeguranca(sel.seguranca);
      setAutenticado(sel.autenticado);
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
        autenticado: Boolean(autenticado),
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
      setMensagemSucesso('Configurações de SMTP e Assinatura sincronizadas com sucesso no Banco Supabase!');
      if (onSalvo) onSalvo(payload);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (e) {
      alert('Erro ao salvar configurações de e-mail: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ModalShell onClose={onClose} maxWidth={650}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#D9EBE6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={22} color="#0F2B27" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F2B27', margin: 0 }}>
              Configuração do Provedor de E-mail (SMTP) & Assinatura
            </h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
              Disparo automático de NFS-e (PDF/XML) sincronizado em Nuvem no Supabase
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        
        {/* Escolha do Provedor Rápido */}
        <div>
          <FieldLabel>Provedor SMTP Sugerido</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginTop: 4 }}>
            {PROVEDORES_SMTP_SUGERIDOS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelecionarProvedor(p.id)}
                style={{
                  padding: '7px 8px',
                  borderRadius: 8,
                  fontSize: 11,
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

        {/* Servidor Host, Porta e Segurança */}
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
              <option value="ssl">SSL / SMTPS</option>
            </select>
          </div>
        </div>

        {/* Requer Autenticação (Login e Senha) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <input
            type="checkbox"
            id="smtp-autenticado"
            checked={autenticado}
            onChange={e => setAutenticado(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#1F5C52' }}
          />
          <label htmlFor="smtp-autenticado" style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
            Servidor Requer Autenticação (Usuário e Senha)
          </label>
        </div>

        {/* Usuário e Senha (visíveis se autenticado) */}
        {autenticado && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <FieldLabel>Usuário de Envio (E-mail)</FieldLabel>
              <input
                type="email"
                placeholder="atendimento@amp.adm.br"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <FieldLabel>Senha ou Senha de App (Token)</FieldLabel>
              <input
                type="password"
                placeholder="••••••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Nome do Remetente e E-mail de Resposta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>Nome do Remetente (Assinatura)</FieldLabel>
            <input
              type="text"
              placeholder="MARCO ANTONIO PAVANI"
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

        {/* Identidade Visual da Assinatura: Logotipo Oficial MP */}
        <div>
          <FieldLabel>Logotipo e Assinatura Corporativa</FieldLabel>
          <div style={{ 
            background: '#FAF9F6', 
            border: '1px solid #E5E0D5', 
            borderRadius: 8, 
            padding: '8px 12px', 
            marginBottom: 6, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 12 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src="/logo_assinatura_mp.jpg" 
                alt="MP _ AMPLIANDO SEUS CONHECIMENTOS" 
                style={{ maxHeight: 32, maxWidth: 170, objectFit: 'contain' }} 
              />
              <span style={{ fontSize: 11, color: '#4B5563' }}>
                Logotipo Oficial: <strong>MP _ AMPLIANDO SEUS CONHECIMENTOS</strong>
              </span>
            </div>
            <span style={{ fontSize: 10, background: '#D9EBE6', color: '#0F2B27', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
              Ativo
            </span>
          </div>

          <textarea
            rows={5}
            placeholder="Assinatura com dados de contato e aviso de confidencialidade..."
            value={assinatura}
            onChange={e => setAssinatura(e.target.value)}
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 11, resize: 'vertical', lineHeight: 1.35 }}
          />
        </div>

        {/* Checkbox Ativo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '9px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <input
            type="checkbox"
            id="smtp-ativo"
            checked={ativo}
            onChange={e => setAtivo(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#1F5C52' }}
          />
          <label htmlFor="smtp-ativo" style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
            Ativar disparo automático direto pelo servidor SMTP (sem abrir Outlook/Webmail)
          </label>
        </div>

        {/* Botão de Salvar com indicação do Supabase */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#059669' }}>
            <Cloud size={14} />
            <span>Sincronização Nuvem Supabase Ativa</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#F3F4F6',
                border: 'none',
                borderRadius: 8,
                padding: '9px 15px',
                fontSize: 12,
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
              <span>{salvando ? 'Salvando na Nuvem...' : 'Salvar no Supabase'}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
