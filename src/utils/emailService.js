// ─── Serviço de E-mail & Configuração de Provedor SMTP ─────────────────────────
// Suporte a envio direto de NFS-e (PDF/XML), modelos de mensagem com assinatura
// personalizada e persistência local e em nuvem Supabase.

import { formatBRL, somenteDigitos } from './formatters';
import { supabase } from '../lib/supabase';

const STORAGE_SMTP_KEY = 'amp_flow_smtp_config_v1';

export const PROVEDORES_SMTP_SUGERIDOS = [
  { id: 'custom', label: 'Provedor Próprio / Hospedagem', host: '', porta: 587, seguranca: 'tls' },
  { id: 'gmail', label: 'Gmail (Google Workspace)', host: 'smtp.gmail.com', porta: 587, seguranca: 'tls' },
  { id: 'outlook', label: 'Outlook / Office 365', host: 'smtp.office365.com', porta: 587, seguranca: 'tls' },
  { id: 'locaweb', label: 'Locaweb', host: 'email-ssl.com.br', porta: 465, seguranca: 'ssl' },
  { id: 'kinghost', label: 'KingHost', host: 'smtp.kinghost.net', porta: 587, seguranca: 'tls' },
];

export function obterConfigSmtp(empresaId) {
  const padrao = {
    provedor: 'custom',
    host: 'smtp.gmail.com',
    porta: 587,
    seguranca: 'tls', // 'tls' | 'ssl'
    usuario: '',
    senha: '',
    nomeRemetente: 'AMP DO BRASIL SOLUÇÕES ADMINISTRATIVAS E TECNOLÓGICAS LTDA',
    emailResposta: 'atendimento@amp.adm.br',
    assuntoPadrao: 'Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) - {prestador}',
    conteudoPadrao: 'Olá {cliente},\n\nSegue em anexo a Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) referente aos serviços prestados no valor de {valor}.\n\nQualquer dúvida, estamos à inteira disposição.\n\n{assinatura}',
    assinatura: 'Atenciosamente,\nMarco Pavani | AMP do Brasil\n(19) 99448-7795 | atendimento@amp.adm.br',
    ativo: false,
  };

  if (!empresaId) return padrao;

  try {
    const raw = localStorage.getItem(`${STORAGE_SMTP_KEY}_${empresaId}`);
    if (raw) {
      return { ...padrao, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Erro ao carregar config SMTP:', e);
  }

  return padrao;
}

export async function salvarConfigSmtp(empresaId, config) {
  if (!empresaId) return false;
  try {
    localStorage.setItem(`${STORAGE_SMTP_KEY}_${empresaId}`, JSON.stringify(config));
    
    // Tenta atualizar no Supabase se houver coluna ou metadados
    try {
      await supabase
        .from('empresas')
        .update({
          configuracao_smtp: config,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', empresaId);
    } catch (eDb) {
      // silencioso se a coluna não existir no schema
    }
    return true;
  } catch (e) {
    console.error('Falha ao salvar config SMTP:', e);
    return false;
  }
}

export function montarMensagemNfse(nota, empresa, configCustom = null) {
  const cfg = configCustom || obterConfigSmtp(empresa?.id);
  const prestador = empresa?.razao_social || empresa?.nome_fantasia || 'AMP DO BRASIL SOLUÇÕES ADMINISTRATIVAS E TECNOLÓGICAS LTDA';
  const cliente = nota?.tomador?.razaoSocial || 'Cliente';
  const numero = nota?.numero || '';
  const valor = formatBRL(nota?.servico?.valorTotal || 0);
  const emailDestino = nota?.tomador?.email || '';

  const substituirTags = (texto) => {
    if (!texto) return '';
    return texto
      .replace(/{cliente}/g, cliente)
      .replace(/{numero}/g, numero)
      .replace(/{valor}/g, valor)
      .replace(/{prestador}/g, prestador)
      .replace(/{chave}/g, nota?.chaveAcesso || '')
      .replace(/{assinatura}/g, cfg.assinatura || '');
  };

  const assunto = substituirTags(cfg.assuntoPadrao || 'NFS-e Nº {numero} - {prestador}');
  const corpo = substituirTags(cfg.conteudoPadrao || 'Segue anexo nota fiscal do serviço prestado.\n\n{assinatura}');

  return {
    destinatario: emailDestino,
    assunto,
    corpo,
    prestador,
    numero,
    valor,
  };
}

export function gerarLinkMailto(destinatario, assunto, corpo) {
  const d = encodeURIComponent(destinatario || '');
  const a = encodeURIComponent(assunto || '');
  const c = encodeURIComponent(corpo || '');
  return `mailto:${d}?subject=${a}&body=${c}`;
}

export async function dispararEmailNfse({ empresaId, destinatario, assunto, corpo, nota, empresa }) {
  const config = obterConfigSmtp(empresaId);

  // Se tiver um servidor backend de envio SMTP ativo
  if (config.ativo && config.host && config.usuario) {
    try {
      const res = await fetch('https://amp.ia.br/api/email/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId,
          smtp: {
            host: config.host,
            porta: config.porta,
            seguranca: config.seguranca,
            usuario: config.usuario,
            senha: config.senha,
            nomeRemetente: config.nomeRemetente,
            emailResposta: config.emailResposta,
          },
          mensagem: {
            destinatario,
            assunto,
            corpo,
            notaId: nota?.id || nota?.numero,
            numero: nota?.numero,
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, via: 'smtp_backend', data };
      }
    } catch (e) {
      console.warn('Backend SMTP direto inacessível, caindo para cliente de e-mail:', e);
    }
  }

  // Fallback: abrir cliente de e-mail local (Outlook / Thunderbird / Webmail)
  return { 
    ok: true, 
    via: 'mailto', 
    linkMailto: gerarLinkMailto(destinatario, assunto, corpo) 
  };
}
