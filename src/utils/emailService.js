// ─── Serviço de E-mail & Configuração de Provedor SMTP ─────────────────────────
// Suporte a envio direto de NFS-e (PDF/XML), modelos de mensagem com assinatura
// oficial de Marco Antonio Pavani, aviso de confidencialidade bilíngue e persistência
// em nuvem Supabase + cache local sincronizado multi-dispositivo.

import { formatBRL, somenteDigitos } from './formatters';
import { supabase } from '../lib/supabase';
import { gerarDanfsePdfBase64, gerarNotaFiscalPdfBase64 } from './danfsePdfService';

const STORAGE_SMTP_KEY = 'amp_flow_smtp_config_v1';

export const ASSINATURA_OFICIAL_PADRAO = 
`MARCO ANTONIO PAVANI
WhatsApp - (19) 99448-7795
"No que diz respeito ao desempenho, ao compromisso, ao esforço, à dedicação, não existe meio termo. Ou você faz uma coisa bem-feita ou não faz!"

O conteúdo deste e-mail é confidencial e dirigido apenas ao destinatário especificado na mensagem. É estritamente proibido compartilhar qualquer parte desta mensagem com terceiros, sem o consentimento por escrito do remetente. Se você recebeu esta mensagem por engano, responda a esta mensagem e prossiga com sua exclusão, para que possamos garantir que tal erro não ocorra no futuro.

The content of this email is confidential and intended for the recipient specified in the message only. It is strictly forbidden to share any part of this message with any third party, without the written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not ocur in the future.`;

export const PROVEDORES_SMTP_SUGERIDOS = [
  { id: 'custom', label: 'Provedor Próprio / Hospedagem', host: '', porta: 587, seguranca: 'tls', autenticado: true },
  { id: 'gmail', label: 'Gmail (Google Workspace)', host: 'smtp.gmail.com', porta: 587, seguranca: 'tls', autenticado: true },
  { id: 'outlook', label: 'Outlook / Office 365', host: 'smtp.office365.com', porta: 587, seguranca: 'tls', autenticado: true },
  { id: 'locaweb', label: 'Locaweb', host: 'email-ssl.com.br', porta: 465, seguranca: 'ssl', autenticado: true },
  { id: 'kinghost', label: 'KingHost', host: 'smtp.kinghost.net', porta: 587, seguranca: 'tls', autenticado: true },
];

export function obterConfigSmtp(empresaId) {
  const padrao = {
    provedor: 'custom',
    host: 'smtp.gmail.com',
    porta: 587,
    autenticado: true,
    seguranca: 'tls', // 'tls' | 'ssl'
    usuario: 'atendimento@amp.adm.br',
    senha: '',
    nomeRemetente: 'MARCO ANTONIO PAVANI | AMP DO BRASIL',
    emailResposta: 'atendimento@amp.adm.br',
    emailCopia: 'atendimento@amp.adm.br',
    assuntoPadrao: 'Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) - {prestador}',
    conteudoPadrao: 'Olá {cliente},\n\nSegue em anexo a Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) referente aos serviços prestados no valor de {valor}.\n\nQualquer dúvida, estamos à inteira disposição.\n\n{assinatura}',
    assinatura: ASSINATURA_OFICIAL_PADRAO,
    ativo: true,
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

// Busca a configuração no Supabase (Nuvem) para sincronizar entre navegadores
export async function carregarConfigSmtpNuvem(empresaId) {
  if (!empresaId) return obterConfigSmtp(null);

  // 1. Lê cache local primeiro
  let configAtual = obterConfigSmtp(empresaId);

  try {
    // 2. Tenta ler da tabela dedicada public.smtp_configuracoes
    const { data: dbSmtp, error: errSmtp } = await supabase
      .from('smtp_configuracoes')
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();

    if (!errSmtp && dbSmtp && dbSmtp.host) {
      const configNuvem = {
        provedor: 'custom',
        host: dbSmtp.host,
        porta: dbSmtp.porta || 587,
        autenticado: dbSmtp.autenticado ?? true,
        seguranca: dbSmtp.seguranca || 'tls',
        usuario: dbSmtp.usuario || '',
        senha: dbSmtp.senha || '',
        nomeRemetente: dbSmtp.remetente_nome || '',
        emailResposta: dbSmtp.email_resposta || '',
        emailCopia: dbSmtp.email_copia || configAtual.emailCopia || '',
        assuntoPadrao: dbSmtp.assunto_padrao || configAtual.assuntoPadrao,
        conteudoPadrao: dbSmtp.conteudo_padrao || configAtual.conteudoPadrao,
        assinatura: dbSmtp.assinatura_texto || ASSINATURA_OFICIAL_PADRAO,
        ativo: dbSmtp.ativo ?? true,
      };
      localStorage.setItem(`${STORAGE_SMTP_KEY}_${empresaId}`, JSON.stringify(configNuvem));
      return configNuvem;
    }

    // 3. Fallback: Lê da tabela public.clientes (onde guardamos backup persistente na nuvem)
    const { data: cliSmtp } = await supabase
      .from('clientes')
      .select('nome_fantasia, email, telefone')
      .eq('empresa_id', empresaId)
      .eq('origem', 'smtp_config')
      .maybeSingle();

    if (cliSmtp && cliSmtp.nome_fantasia) {
      try {
        const parsed = JSON.parse(cliSmtp.nome_fantasia);
        if (parsed.host) {
          const configSync = { ...configAtual, ...parsed };
          localStorage.setItem(`${STORAGE_SMTP_KEY}_${empresaId}`, JSON.stringify(configSync));
          return configSync;
        }
      } catch (eParse) {}
    }
  } catch (e) {
    console.warn('Erro ao carregar SMTP da nuvem:', e);
  }

  return configAtual;
}

// Salva tanto no LocalStorage quanto na Nuvem Supabase
export async function salvarConfigSmtp(empresaId, config) {
  if (!empresaId) return false;
  try {
    // 1. Salva no LocalStorage
    localStorage.setItem(`${STORAGE_SMTP_KEY}_${empresaId}`, JSON.stringify(config));

    // 2. Persiste na tabela public.smtp_configuracoes (se existir)
    try {
      await supabase.from('smtp_configuracoes').upsert({
        empresa_id: empresaId,
        host: config.host,
        porta: parseInt(config.porta) || 587,
        autenticado: Boolean(config.autenticado),
        seguranca: config.seguranca || 'tls',
        usuario: config.usuario,
        senha: config.senha,
        remetente_nome: config.nomeRemetente,
        email_resposta: config.emailResposta,
        email_copia: config.emailCopia,
        assunto_padrao: config.assuntoPadrao,
        conteudo_padrao: config.conteudoPadrao,
        assinatura_texto: config.assinatura,
        ativo: Boolean(config.ativo),
        atualizado_em: new Date().toISOString()
      }, { onConflict: 'empresa_id' });
    } catch (eTable) {}

    // 3. Persiste com 100% de garantia na tabela public.clientes (com RLS já liberado na nuvem)
    try {
      await supabase.from('clientes').upsert({
        empresa_id: empresaId,
        cpf_cnpj: '10682233000175',
        razao_social: 'CONFIGURACAO SMTP SERVIDOR',
        nome_fantasia: JSON.stringify(config),
        email: config.usuario || 'atendimento@amp.adm.br',
        telefone: '19994487795',
        origem: 'smtp_config',
        atualizado_em: new Date().toISOString()
      }, { onConflict: 'empresa_id, cpf_cnpj' });
    } catch (eCli) {
      console.warn('Aviso de backup SMTP no Supabase:', eCli.message);
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

  const assinaturaUsada = cfg.assinatura || ASSINATURA_OFICIAL_PADRAO;

  const substituirTags = (texto) => {
    if (!texto) return '';
    return texto
      .replace(/{cliente}/g, cliente)
      .replace(/{numero}/g, numero)
      .replace(/{valor}/g, valor)
      .replace(/{prestador}/g, prestador)
      .replace(/{chave}/g, nota?.chaveAcesso || '')
      .replace(/{assinatura}/g, assinaturaUsada);
  };

  const assunto = substituirTags(cfg.assuntoPadrao || 'Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) - {prestador}');
  const corpo = substituirTags(cfg.conteudoPadrao || 'Olá {cliente},\n\nSegue em anexo a Nota Fiscal de Serviços Eletrônica (NFS-e Nº {numero}) referente ao serviço prestado no valor de {valor}.\n\n{assinatura}');

  return {
    destinatario: emailDestino,
    copia: cfg.emailCopia || cfg.usuario || '',
    assunto,
    corpo,
    prestador,
    numero,
    valor,
    assinatura: assinaturaUsada
  };
}

export function montarHtmlEmailNfse(nota, empresa, corpoTexto = '', config = {}) {
  const cliente = nota?.tomador?.razaoSocial || nota?.tomador?.nomeFantasia || 'Prezado(a) Cliente';
  const numero = nota?.numero || '';
  const valor = formatBRL(nota?.servico?.valorTotal || nota?.valor || 0);
  const chave = nota?.chaveAcesso || '';
  const prestador = empresa?.razao_social || 'AMP DO BRASIL SOLUÇÕES ADMINISTRATIVAS E TECNOLÓGICAS LTDA';
  const prestadorCnpj = empresa?.cnpj || '10.682.233/0001-75';
  const ano = nota?.competenciaAno || new Date().getFullYear();
  const mes = String(nota?.competenciaMes !== undefined ? Number(nota?.competenciaMes) + 1 : new Date().getMonth() + 1).padStart(2, '0');

  // Logotipo oficial AMP (formato horizontal executivo da assinatura) em alta definição
  const logoUrl = config?.logoUrl || empresa?.logo_url || empresa?.logoUrl || 'https://dre.amp.ia.br/logo_assinatura_mp.jpg';

  // Parágrafos do texto do e-mail
  const paragrafos = corpoTexto
    ? corpoTexto.split('\n\n').map(p => `<p style="margin: 0 0 14px 0; line-height: 1.6; color: #334155; font-size: 14.5px;">${p.replace(/\n/g, '<br>')}</p>`).join('')
    : `<p style="margin: 0 0 14px 0; line-height: 1.6; color: #334155; font-size: 14.5px;">Segue em anexo a Nota Fiscal de Serviços Eletrônica (NFS-e Nº <strong>${numero}</strong>) no valor de <strong>${valor}</strong> referente aos serviços prestados.</p>`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>NFS-e Nº ${numero} - AMP DO BRASIL</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 28px 12px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Linha de Destaque Executiva Superior -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #1E293B 0%, #3B82F6 50%, #E8A33D 100%);"></td>
          </tr>

          <!-- Cabeçalho Topo AMP com Logo Proporcional Seguro para Outlook -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 18px 28px; text-align: left; border-bottom: 1px solid #E2E8F0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="200" style="vertical-align: middle; width: 200px;">
                    <!-- Logotipo Oficial AMP em PNG com dimensões fixas contra distorção no Outlook -->
                    <a href="https://www.amp.adm.br" target="_blank" style="text-decoration: none; display: block;">
                      <img 
                        src="${logoUrl}" 
                        alt="AMP do Brasil" 
                        width="190" 
                        height="39" 
                        border="0"
                        style="display: block; width: 190px; max-width: 190px; height: 39px; max-height: 39px; border: 0; outline: none; text-decoration: none;" 
                      />
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="background-color: #F1F5F9; border: 1px solid #CBD5E1; color: #334155; font-size: 11.5px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                      NFS-e Nº ${numero}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner Informativo -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 12px 30px; border-bottom: 1px solid #E2E8F0;">
              <span style="font-size: 12px; color: #64748B; font-weight: 500;">
                Documento Fiscal Oficial emitido via <strong>Padrão Nacional da Receita Federal</strong>
              </span>
            </td>
          </tr>

          <!-- Corpo da Mensagem -->
          <tr>
            <td style="padding: 28px 30px 18px 30px;">
              ${paragrafos}

              <!-- Card com Resumo da Nota -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin: 22px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #E2E8F0; background-color: #F1F5F9;">
                    <strong style="color: #1E293B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Resumo da Operação Fiscal
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #334155;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748B; width: 35%;">Prestador:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #0F172A;">${prestador}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748B;">CNPJ Prestador:</td>
                        <td style="padding: 4px 0; font-family: monospace;">${prestadorCnpj}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748B;">Tomador / Cliente:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #0F172A;">${cliente}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748B;">Competência:</td>
                        <td style="padding: 4px 0;">${mes}/${ano}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748B;">Valor Total do Serviço:</td>
                        <td style="padding: 4px 0; font-size: 16px; font-weight: 800; color: #0F172A;">${valor}</td>
                      </tr>
                      ${chave ? `
                      <tr>
                        <td style="padding: 6px 0 0 0; color: #64748B; vertical-align: top;">Chave de Acesso:</td>
                        <td style="padding: 6px 0 0 0; font-family: monospace; font-size: 11px; word-break: break-all; color: #475569;">
                          ${chave}
                        </td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Box de Anexos (3 Documentos Fiscais) -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 12.5px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
                      📎 Arquivos anexados nesta mensagem (3 documentos fiscais):
                    </div>
                    <div style="font-size: 13px; color: #334155; margin-bottom: 4px;">
                      • <strong>NotaFiscal_NFSe_${numero}.pdf</strong> — Nota Fiscal de Serviços Eletrônica completa em formato PDF.
                    </div>
                    <div style="font-size: 13px; color: #334155; margin-bottom: 4px;">
                      • <strong>DANFSe_NFe_${numero}.pdf</strong> — Documento Auxiliar Oficial da NFS-e para conferência e arquivo digital.
                    </div>
                    <div style="font-size: 13px; color: #334155;">
                      • <strong>NFSe_${numero}.xml</strong> — Arquivo XML com assinatura digital da Receita Federal para contabilidade.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Rodapé com Assinatura Executiva -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 22px 30px; border-top: 1px solid #E2E8F0; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 800; color: #0F172A; letter-spacing: -0.2px;">
                      MARCO ANTONIO PAVANI
                    </div>
                    <div style="font-size: 12px; color: #475569; font-weight: 600; margin-top: 2px;">
                      Diretor Executivo • AMP do Brasil
                    </div>
                    <div style="font-size: 11.5px; color: #64748B; margin-top: 6px; line-height: 1.5;">
                      📧 <a href="mailto:atendimento@amp.adm.br" style="color: #2563EB; text-decoration: none; font-weight: 500;">atendimento@amp.adm.br</a> | 
                      🌐 <a href="https://www.amp.adm.br" target="_blank" style="color: #2563EB; text-decoration: none; font-weight: 500;">www.amp.adm.br</a><br>
                      📱 (19) 99448-7795 • Santa Cruz das Palmeiras - SP
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
        <!-- Rodapé Legal Externo -->
        <div style="max-width: 620px; text-align: center; margin-top: 16px; font-size: 11px; color: #94A3B8; line-height: 1.4;">
          Esta mensagem e seus anexos contêm informações fiscais confidenciais geradas pelo <strong>AMP Flow</strong>.<br>
          © ${ano} AMP DO BRASIL SOLUÇÕES ADMINISTRATIVAS E TECNOLÓGICAS LTDA. Todos os direitos reservados.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function gerarLinkMailto(destinatario, assunto, corpo, copia = '') {
  const d = encodeURIComponent(destinatario || '');
  const a = encodeURIComponent(assunto || '');
  const c = encodeURIComponent(corpo || '');
  const cc = copia ? `&cc=${encodeURIComponent(copia)}` : '';
  return `mailto:${d}?subject=${a}${cc}&body=${c}`;
}

export async function dispararEmailNfse({ empresaId, destinatario, copia, assunto, corpo, nota, empresa }) {
  const config = await carregarConfigSmtpNuvem(empresaId);

  // Payload com os 3 anexos oficiais: Nota Fiscal (PDF), DANFSe (PDF) e XML Receita Federal
  const anexos = [];

  // 1. Gera e anexa a Nota Fiscal de Serviços em formato PDF (layout oficial para compras e financeiro)
  try {
    const nfPdfBase64 = gerarNotaFiscalPdfBase64(nota, empresa);
    if (nfPdfBase64) {
      anexos.push({
        filename: `NotaFiscal_NFSe_${nota?.numero || '1'}.pdf`,
        content: nfPdfBase64,
        encoding: 'base64',
        contentType: 'application/pdf'
      });
    }
  } catch (eNfPdf) {
    console.error('Falha ao gerar PDF da Nota Fiscal para anexo:', eNfPdf);
  }

  // 2. Gera e anexa o DANFSe Oficial em PDF (layout padrão nacional Receita Federal)
  try {
    const danfsePdfBase64 = gerarDanfsePdfBase64(nota, empresa);
    if (danfsePdfBase64) {
      anexos.push({
        filename: `DANFSe_NFe_${nota?.numero || '1'}.pdf`,
        content: danfsePdfBase64,
        encoding: 'base64',
        contentType: 'application/pdf'
      });
    }
  } catch (ePdf) {
    console.error('Falha ao gerar PDF DANFSe para anexo de e-mail:', ePdf);
  }

  // 3. Anexa o Arquivo Fiscal XML da Receita Federal
  if (nota?.xmlGerado) {
    try {
      anexos.push({
        filename: `NFSe_${nota.numero}_${empresa?.cnpj?.replace(/\D/g, '') || 'AMP'}.xml`,
        content: btoa(unescape(encodeURIComponent(nota.xmlGerado))),
        encoding: 'base64',
        contentType: 'application/xml'
      });
    } catch (eXml) {
      console.error('Falha ao codificar XML para anexo:', eXml);
    }
  }

  if (!config.host || !config.usuario || !config.senha) {
    throw new Error('Configuração de SMTP incompleta. Acesse "E-mail / SMTP" e informe o servidor, e-mail e senha.');
  }

  const resendApiKey = config.resendApiKey || '';
  const corpoHtml = montarHtmlEmailNfse(nota, empresa, corpo, config);

  // Dispara diretamente pela nuvem Supabase (Edge Function independente da VPS)
  try {
    const { data, error } = await supabase.functions.invoke('enviar-email-smtp', {
      body: {
        empresaId,
        smtp: {
          resendApiKey,
          host: config.host,
          porta: parseInt(config.porta) || 587,
          autenticado: config.autenticado !== false,
          seguranca: config.seguranca || 'tls',
          usuario: config.usuario,
          senha: config.senha,
          nomeRemetente: config.nomeRemetente || 'MARCO ANTONIO PAVANI | AMP DO BRASIL',
          remetenteEmail: config.usuario || 'atendimento@amp.adm.br',
          emailResposta: config.emailResposta || config.usuario || 'atendimento@amp.adm.br',
          emailCopia: copia || config.emailCopia,
        },
        mensagem: {
          destinatario,
          copia: copia || config.emailCopia || '',
          assunto,
          corpo,
          corpoHtml,
          anexos,
          numero: nota?.numero,
        }
      }
    });

    if (!error && data?.sucesso) {
      return { ok: true, via: 'supabase_edge', data };
    }

    if (error || (data && !data.sucesso)) {
      let detalheErro = data?.error;
      if (!detalheErro && error) {
        detalheErro = error.message;
        try {
          if (error.context && typeof error.context.json === 'function') {
            const errBody = await error.context.json();
            if (errBody?.error) detalheErro = errBody.error;
          }
        } catch (_) {}
      }
      throw new Error(detalheErro || 'Falha no disparo do e-mail.');
    }
  } catch (err) {
    console.error('Falha no envio direto via Edge Function:', err);
    throw err;
  }

  return { ok: true };
}
