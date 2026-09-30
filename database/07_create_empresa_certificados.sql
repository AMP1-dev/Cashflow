-- ============================================================================
-- AMP Flow — Migração: Armazenamento e Gestão de Certificado Digital A1
-- ============================================================================
-- Permite armazenar o Certificado Digital A1 (.pfx) da empresa e sua senha de
-- forma protegida por RLS para viabilizar emissão instantânea sem intermediários.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.empresa_certificados (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id          uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  pfx_base64          text NOT NULL,
  senha               text NOT NULL,
  nome_arquivo        text,
  cnpj                text,
  razao_social        text,
  valido_de           timestamptz,
  valido_ate          timestamptz,
  emissor             text,
  ativo               boolean DEFAULT true,
  atualizado_em       timestamptz DEFAULT now(),
  criado_em           timestamptz DEFAULT now(),
  CONSTRAINT empresa_certificados_empresa_unique UNIQUE (empresa_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS empresa_certificados_empresa_idx ON public.empresa_certificados (empresa_id);

-- Permissões Explícitas Data API conforme regras de governança do Supabase
GRANT SELECT ON public.empresa_certificados TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empresa_certificados TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empresa_certificados TO service_role;

-- Row Level Security (RLS)
ALTER TABLE public.empresa_certificados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso restrito ao certificado por membros da empresa" ON public.empresa_certificados;
CREATE POLICY "Acesso restrito ao certificado por membros da empresa" ON public.empresa_certificados
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

-- Atualiza campo na tabela empresas para indicar status de certificado
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS certificado_a1_ativo boolean DEFAULT false;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS certificado_a1_validade timestamptz;

-- Recarrega o cache do PostgREST
NOTIFY pgrst, 'reload schema';
