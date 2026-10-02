-- ============================================================================
-- AMP Flow — Migração: Catálogo Centralizado de Clientes na Nuvem (Supabase)
-- ============================================================================
-- Permite armazenar contatos (e-mail, WhatsApp/telefone, endereço e dados fiscais)
-- de clientes tomadores de serviços de forma persistente e centralizada, sincronizando
-- automaticamente entre computadores, celulares e navegadores diferentes.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.clientes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id          uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cpf_cnpj            text NOT NULL,
  razao_social        text NOT NULL,
  nome_fantasia       text,
  email               text,
  telefone            text,
  logradouro          text,
  numero              text,
  bairro              text,
  municipio           text,
  uf                  text,
  cep                 text,
  origem              text DEFAULT 'nfse_catalogo',
  criado_em           timestamptz DEFAULT now(),
  atualizado_em       timestamptz DEFAULT now(),
  CONSTRAINT clientes_empresa_cpf_cnpj_unique UNIQUE (empresa_id, cpf_cnpj)
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS clientes_empresa_idx ON public.clientes (empresa_id);
CREATE INDEX IF NOT EXISTS clientes_cpf_cnpj_idx ON public.clientes (cpf_cnpj);

-- ============================================================================
-- Permissões Explícitas Data API (Governança e Diretrizes Supabase)
-- ============================================================================
GRANT SELECT ON public.clientes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO service_role;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso aos clientes por membros da empresa" ON public.clientes;
CREATE POLICY "Acesso aos clientes por membros da empresa" ON public.clientes
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

DROP POLICY IF EXISTS "Acesso anonimo / sessao local aos clientes" ON public.clientes;
CREATE POLICY "Acesso anonimo / sessao local aos clientes" ON public.clientes
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Notifica o PostgREST para recarregar o schema cache imediatamente
NOTIFY pgrst, 'reload schema';
