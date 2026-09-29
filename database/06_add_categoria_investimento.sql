-- ============================================================================
-- AMP Flow — Migração: Adicionar 'investimento' ao Enum de Categoria de Despesas
-- ============================================================================
-- Como aplicar:
--   1. Acesse o Supabase (https://supabase.com/dashboard/project/eornunjxcmtyrdrihiqk/sql)
--   2. Cole este comando e clique em RUN
-- ============================================================================

-- Adiciona o valor 'investimento' ao enum categoria_despesa (para suportar CAPEX / Implantações)
ALTER TYPE public.categoria_despesa ADD VALUE IF NOT EXISTS 'investimento';

-- Notifica o PostgREST para atualizar o schema
NOTIFY pgrst, 'reload schema';
