-- ============================================================================
-- AMP Flow — Migração: Correção de Políticas RLS e Permissões Data API
-- Tabela: public.lancamentos e tabelas associadas
-- ============================================================================
-- Como aplicar:
--   1. Acesse o Supabase (https://supabase.com/dashboard/project/eornunjxcmtyrdrihiqk/sql)
--   2. Cole este script e clique em RUN
-- ============================================================================

-- 0. Garantir valor 'investimento' no enum categoria_despesa
ALTER TYPE public.categoria_despesa ADD VALUE IF NOT EXISTS 'investimento';

-- 1. Permissões Explícitas Data API (PostgREST)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.indices_precificacao TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.indices_precificacao TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.indices_precificacao TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fichas_tecnicas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fichas_tecnicas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fichas_tecnicas TO service_role;

-- 2. Atualizar Políticas de Row Level Security (RLS) para public.lancamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lancamentos_select ON public.lancamentos;
DROP POLICY IF EXISTS lancamentos_insert ON public.lancamentos;
DROP POLICY IF EXISTS lancamentos_update ON public.lancamentos;
DROP POLICY IF EXISTS lancamentos_delete ON public.lancamentos;

-- SELECT: Usuários vinculados, administradores ou sessão anônima/admin master informando empresa
CREATE POLICY lancamentos_select ON public.lancamentos
  FOR SELECT
  USING (
    deletado_em IS NULL
    AND (
      public.pertence_a_empresa(empresa_id)
      OR public.eh_admin()
      OR auth.uid() IS NULL
    )
  );

-- INSERT: Permite inserção por membros da empresa, admins ou modo admin master / anon com empresa_id válido
CREATE POLICY lancamentos_insert ON public.lancamentos
  FOR INSERT
  WITH CHECK (
    empresa_id IS NOT NULL
    AND (
      public.pertence_a_empresa(empresa_id)
      OR public.eh_admin()
      OR auth.uid() IS NULL
    )
  );

-- UPDATE: Edição e soft-delete
CREATE POLICY lancamentos_update ON public.lancamentos
  FOR UPDATE
  USING (
    public.pertence_a_empresa(empresa_id)
    OR public.eh_admin()
    OR auth.uid() IS NULL
  )
  WITH CHECK (
    public.pertence_a_empresa(empresa_id)
    OR public.eh_admin()
    OR auth.uid() IS NULL
  );

-- DELETE: Exclusão
CREATE POLICY lancamentos_delete ON public.lancamentos
  FOR DELETE
  USING (
    public.pertence_a_empresa(empresa_id)
    OR public.eh_admin()
    OR auth.uid() IS NULL
  );

-- 3. Atualizar Políticas de Row Level Security (RLS) para indices_precificacao
ALTER TABLE public.indices_precificacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS indices_precificacao_select ON public.indices_precificacao;
DROP POLICY IF EXISTS indices_precificacao_upsert ON public.indices_precificacao;
DROP POLICY IF EXISTS indices_precificacao_insert ON public.indices_precificacao;
DROP POLICY IF EXISTS indices_precificacao_update ON public.indices_precificacao;

CREATE POLICY indices_precificacao_select ON public.indices_precificacao
  FOR SELECT
  USING (
    public.pertence_a_empresa(empresa_id)
    OR public.eh_admin()
    OR auth.uid() IS NULL
  );

CREATE POLICY indices_precificacao_insert ON public.indices_precificacao
  FOR INSERT
  WITH CHECK (
    empresa_id IS NOT NULL
    AND (
      public.pertence_a_empresa(empresa_id)
      OR public.eh_admin()
      OR auth.uid() IS NULL
    )
  );

CREATE POLICY indices_precificacao_update ON public.indices_precificacao
  FOR UPDATE
  USING (
    public.pertence_a_empresa(empresa_id)
    OR public.eh_admin()
    OR auth.uid() IS NULL
  );

-- 4. Notificar PostgREST para recarregar o schema imediatamente
NOTIFY pgrst, 'reload schema';
