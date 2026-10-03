-- ============================================================================
-- AMP Flow — Migração: Configurações de SMTP e Assinatura Corporativa (Supabase)
-- ============================================================================
-- Permite armazenar configurações de envio de e-mail direto via SMTP e assinatura
-- de e-mail corporativa com confidencialidade e logotipo de forma persistente
-- na nuvem Supabase, sincronizando entre qualquer navegador e dispositivo.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.smtp_configuracoes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id          uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cliente_id          uuid REFERENCES public.clientes(id) ON DELETE CASCADE,
  cpf_cnpj            text,
  host                text NOT NULL,
  porta               integer NOT NULL DEFAULT 587,
  autenticado         boolean NOT NULL DEFAULT true,
  seguranca           text NOT NULL DEFAULT 'tls', -- 'tls' | 'ssl'
  usuario             text NOT NULL,
  senha               text NOT NULL,
  remetente_nome      text,
  email_resposta      text,
  assunto_padrao      text,
  conteudo_padrao     text,
  assinatura_texto    text,
  assinatura_html     text,
  ativo               boolean NOT NULL DEFAULT true,
  criado_em           timestamptz DEFAULT now(),
  atualizado_em       timestamptz DEFAULT now(),
  CONSTRAINT smtp_empresa_unique UNIQUE (empresa_id)
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS smtp_empresa_idx ON public.smtp_configuracoes (empresa_id);
CREATE INDEX IF NOT EXISTS smtp_cliente_idx ON public.smtp_configuracoes (cliente_id);

-- ============================================================================
-- Permissões Explícitas Data API (Diretrizes Globais Supabase)
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.smtp_configuracoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.smtp_configuracoes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.smtp_configuracoes TO service_role;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.smtp_configuracoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso smtp por membros da empresa" ON public.smtp_configuracoes;
CREATE POLICY "Acesso smtp por membros da empresa" ON public.smtp_configuracoes
  FOR ALL TO authenticated
  USING (
    empresa_id IN (
      SELECT empresa_id FROM public.empresa_usuarios WHERE usuario_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND eh_admin = true
    )
  );

DROP POLICY IF EXISTS "Acesso anonimo / sessao local smtp" ON public.smtp_configuracoes;
CREATE POLICY "Acesso anonimo / sessao local smtp" ON public.smtp_configuracoes
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);
