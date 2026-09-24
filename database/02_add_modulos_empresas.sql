-- ============================================================================
-- MIGRAÇÃO: Colunas de Módulos Opcionais / Add-ons na tabela empresas
-- ============================================================================
-- Execute no Supabase SQL Editor (supabase.com -> Projeto -> SQL Editor):

ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS modulo_nfse boolean DEFAULT false;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS modulo_tradutor boolean DEFAULT false;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS nfse_ultimo_numero integer DEFAULT 0;

-- Recarrega o cache do PostgREST imediatamente
NOTIFY pgrst, 'reload schema';
