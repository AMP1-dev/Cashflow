// Supabase Edge Function: enviar-email-smtp
// Executa na nuvem global do Supabase (Deno Deploy)
// Não consome nenhum recurso da VPS e isola 100% o envio de e-mails via SMTP com anexos.

import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Trata preflight CORS do navegador
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { smtp, mensagem } = await req.json();

    if (!smtp || !smtp.host || !smtp.usuario || !smtp.senha) {
      return new Response(
        JSON.stringify({ error: "Configurações de SMTP incompletas (host, usuário ou senha ausentes)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!mensagem || !mensagem.destinatario || !mensagem.assunto) {
      return new Response(
        JSON.stringify({ error: "Destinatário ou assunto da mensagem ausentes." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Configura o transporte SMTP
    const porta = parseInt(smtp.porta) || 587;
    const ehSsl = smtp.seguranca === "ssl" || porta === 465;

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: porta,
      secure: ehSsl,
      auth: smtp.autenticado !== false ? {
        user: smtp.usuario,
        pass: smtp.senha,
      } : undefined,
      tls: {
        rejectUnauthorized: false, // Permite certificados auto-assinados de provedores locais
      },
    });

    // Mapeia anexos (se enviados em base64)
    const attachments = (mensagem.anexos || []).map((anexo: any) => ({
      filename: anexo.filename,
      content: anexo.content,
      encoding: anexo.encoding || "base64",
      contentType: anexo.contentType,
    }));

    const remetenteFormatado = smtp.nomeRemetente 
      ? `"${smtp.nomeRemetente}" <${smtp.usuario}>`
      : smtp.usuario;

    const mailOptions = {
      from: remetenteFormatado,
      to: mensagem.destinatario,
      cc: mensagem.copia || undefined,
      replyTo: smtp.emailResposta || smtp.usuario,
      subject: mensagem.assunto,
      text: mensagem.corpo,
      html: mensagem.corpoHtml || mensagem.corpo?.replace(/\n/g, "<br>"),
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ 
        sucesso: true, 
        messageId: info.messageId,
        destinatario: mensagem.destinatario,
        copia: mensagem.copia 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Erro no envio de e-mail via Edge Function:", err);
    return new Response(
      JSON.stringify({ 
        sucesso: false, 
        error: err.message || "Erro desconhecido ao conectar ao servidor SMTP." 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
