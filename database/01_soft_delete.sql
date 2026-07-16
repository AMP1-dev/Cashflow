-- ============================================================================
-- MIGRAÇÃO: Implementação de Soft Delete (Lixeira Lógica)
-- ============================================================================
-- 1. Adicionar a coluna deletado_em nas tabelas
-- ============================================================================

ALTER TABLE public.empresas ADD COLUMN deletado_em timestamptz DEFAULT NULL;
ALTER TABLE public.lancamentos ADD COLUMN deletado_em timestamptz DEFAULT NULL;
ALTER TABLE public.fichas_tecnicas ADD COLUMN deletado_em timestamptz DEFAULT NULL;

-- (Opcional) Criar índices para acelerar consultas que filtram deletados
CREATE INDEX IF NOT EXISTS empresas_deletado_em_idx ON public.empresas(deletado_em);
CREATE INDEX IF NOT EXISTS lancamentos_deletado_em_idx ON public.lancamentos(deletado_em);
CREATE INDEX IF NOT EXISTS fichas_tecnicas_deletado_em_idx ON public.fichas_tecnicas(deletado_em);

-- ============================================================================
-- 2. Atualizar as Políticas RLS (Row Level Security)
-- A regra "AND deletado_em IS NULL" fará com que o banco esconda essas linhas
-- de todas as consultas SELECT do aplicativo.
-- ============================================================================

-- Remover as políticas antigas de SELECT
DROP POLICY IF EXISTS empresas_select ON public.empresas;
DROP POLICY IF EXISTS lancamentos_select ON public.lancamentos;
DROP POLICY IF EXISTS fichas_tecnicas_select ON public.fichas_tecnicas;

-- Criar as novas políticas com a trava do deletado_em
-- As empresas deletadas somem para todos (inclusive admin, conforme solicitado)
CREATE POLICY empresas_select ON public.empresas
  FOR SELECT
  USING (
    (public.pertence_a_empresa(id) OR public.eh_admin()) 
    AND deletado_em IS NULL
  );

-- Os lançamentos deletados somem para todos
CREATE POLICY lancamentos_select ON public.lancamentos
  FOR SELECT
  USING (
    (public.pertence_a_empresa(empresa_id) OR public.eh_admin())
    AND deletado_em IS NULL
  );

-- As fichas técnicas deletadas somem para todos
CREATE POLICY fichas_tecnicas_select ON public.fichas_tecnicas
  FOR SELECT
  USING (
    (public.pertence_a_empresa(empresa_id) OR public.eh_admin())
    AND deletado_em IS NULL
  );

-- Importante: Não precisamos mexer nas políticas de INSERT ou UPDATE, 
-- pois o RLS de SELECT já garante que eles não serão listados. E para 
-- marcá-los como deletados, o usuário precisa conseguir fazer um UPDATE.

-- ============================================================================
-- 3. Atualizar a View da DRE para ignorar lançamentos deletados
-- ============================================================================

CREATE OR REPLACE VIEW public.resumo_dre_mensal AS
SELECT
  empresa_id,
  date_trunc('month', data_lancamento)::date AS mes_referencia,
  SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS faturamento,
  SUM(CASE WHEN tipo = 'despesa' AND categoria = 'cmv' THEN valor ELSE 0 END) AS cmv,
  SUM(CASE WHEN tipo = 'despesa' AND categoria = 'variavel' THEN valor ELSE 0 END) AS despesas_variaveis,
  SUM(CASE WHEN tipo = 'despesa' AND categoria = 'fixa' THEN valor ELSE 0 END) AS despesas_fixas,
  SUM(CASE WHEN tipo = 'despesa' AND categoria = 'financeira' THEN valor ELSE 0 END) AS despesas_financeiras
FROM public.lancamentos
WHERE deletado_em IS NULL
GROUP BY empresa_id, date_trunc('month', data_lancamento);

COMMENT ON VIEW public.resumo_dre_mensal IS 'Totais por categoria e mês, ignorando lançamentos na lixeira lógica.';
