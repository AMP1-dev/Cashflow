-- ============================================================================
-- MIGRAÇÃO 10: Módulo Cofre Digital & Arquivo de Comprovantes Sem Papel
-- ============================================================================
-- Execute no Supabase SQL Editor (supabase.com -> Projeto -> SQL Editor):

-- 1. Coluna de ativação do módulo na tabela empresas
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS modulo_comprovantes boolean DEFAULT false;

-- 2. Coluna para o link/caminho do comprovante na tabela de lançamentos
ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS comprovante_url text;

-- 3. Permissões explícitas de Data API
GRANT SELECT ON public.lancamentos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO service_role;

GRANT SELECT ON public.empresas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empresas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empresas TO service_role;

-- 4. Criação do Bucket de Armazenamento para Comprovantes (Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprovantes', 'comprovantes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de acesso ao Storage para upload e leitura de comprovantes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir upload publico de comprovantes' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Permitir upload publico de comprovantes"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'comprovantes');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Permitir leitura publica de comprovantes' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Permitir leitura publica de comprovantes"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'comprovantes');
  END IF;
END $$;

-- Recarrega o cache do PostgREST imediatamente
NOTIFY pgrst, 'reload schema';
