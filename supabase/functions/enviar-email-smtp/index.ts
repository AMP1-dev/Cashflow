// Supabase Edge Function: enviar-email-smtp
// Disparo ultra-rápido e seguro via API Resend (HTTPS)
// 100% isolado, sem consumo de VPS, com suporte nativo a PDF e XML anexados.

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

    if (!mensagem || !mensagem.destinatario || !mensagem.assunto) {
      return new Response(
        JSON.stringify({ error: "Destinatário ou assunto ausentes." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const destinatario = mensagem.destinatario.trim();
    const copia = mensagem.copia ? mensagem.copia.trim() : undefined;
    const apiKey = (smtp && smtp.resendApiKey) ? smtp.resendApiKey.trim() : (Deno.env.get("RESEND_API_KEY") || "");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Chave do Resend (API Key) não informada." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const nomeRemetente = smtp?.nomeRemetente || "MARCO ANTONIO PAVANI | AMP DO BRASIL";
    const remetenteOficial = (smtp?.remetenteEmail && smtp.remetenteEmail.includes("@amp.adm.br")) 
      ? smtp.remetenteEmail 
      : "atendimento@amp.adm.br";

    // Mapeia anexos (DANFSe e XML) para o formato do Resend
    const attachments = (mensagem.anexos || []).map((anexo: any) => ({
      filename: anexo.filename,
      content: anexo.content, // base64
    }));

    // Tenta primeiro com o remetente oficial do domínio amp.adm.br
    let res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${nomeRemetente} <${remetenteOficial}>`,
        to: [destinatario],
        cc: copia ? [copia] : undefined,
        reply_to: "atendimento@amp.adm.br",
        subject: mensagem.assunto,
        text: mensagem.corpo,
        html: mensagem.corpoHtml || mensagem.corpo?.replace(/\n/g, "<br>"),
        attachments,
      }),
    });

    let data = await res.json();

    // Fallback inteligente: se o domínio amp.adm.br ainda estiver propagando o DNS no Resend,
    // envia via canal homologado com Reply-To para atendimento@amp.adm.br para não travar a nota
    if (!res.ok && data?.message && data.message.includes("domain")) {
      res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${nomeRemetente} <onboarding@resend.dev>`,
          to: [destinatario],
          cc: copia ? [copia] : undefined,
          reply_to: "atendimento@amp.adm.br",
          subject: mensagem.assunto,
          text: mensagem.corpo,
          html: mensagem.corpoHtml || mensagem.corpo?.replace(/\n/g, "<br>"),
          attachments,
        }),
      });
      data = await res.json();
    }

    if (!res.ok) {
      const errMsg = data?.message || "Erro no envio via Resend.";
      let userFriendlyMsg = errMsg;
      if (errMsg.includes("only send testing emails") || errMsg.includes("not verified")) {
        userFriendlyMsg = "O domínio amp.adm.br precisa ser validado no Resend. Enquanto estiver 'Not Started', o Resend só permite disparos para o e-mail da sua conta (amps4.mobile@gmail.com). Para enviar para clientes, conclua a validação do domínio amp.adm.br no DNS.";
      }
      return new Response(
        JSON.stringify({ 
          sucesso: false, 
          error: userFriendlyMsg,
          detalheTecnico: data 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        sucesso: true, 
        messageId: data.id,
        destinatario,
        copia 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Erro no envio via Edge Function Resend:", err);
    return new Response(
      JSON.stringify({ 
        sucesso: false, 
        error: err.message || "Erro desconhecido ao processar e-mail." 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
