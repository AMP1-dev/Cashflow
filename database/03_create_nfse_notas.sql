-- ============================================================================
-- AMP Flow — Migração: Tabela de Notas Fiscais Emitidas (NFS-e / SPED / ADN)
-- ============================================================================
-- Como aplicar:
--   1. Acesse o Supabase (supabase.com) -> Seu Projeto -> SQL Editor -> New Query
--   2. Cole este script e clique em RUN
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.nfse_notas (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id                  uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  numero                      text NOT NULL,
  chave_acesso                text NOT NULL,
  dps_numero                  text,
  serie_dps                   text DEFAULT '70000',
  codigo_verificacao          text,
  status                      text DEFAULT 'autorizada',
  ambiente                    text DEFAULT 'producao',
  data_emissao                timestamptz NOT NULL DEFAULT now(),
  competencia_mes             integer,
  competencia_ano             integer,
  
  -- Tomador (Cliente)
  tomador_nome                text NOT NULL,
  tomador_documento           text,
  tomador_email               text,
  tomador_telefone            text,
  tomador_municipio           text,
  tomador_uf                  text,
  
  -- Serviço Prestado
  servico_discriminacao       text NOT NULL,
  servico_codigo_atividade    text,
  servico_codigo_tributacao   text,
  servico_codigo_nbs          text,
  
  -- Valores & Tributação
  valor_total                 numeric(12,2) NOT NULL,
  aliquota_iss                numeric(5,2) DEFAULT 0.0,
  valor_iss                   numeric(12,2) DEFAULT 0.0,
  iss_retido                  boolean DEFAULT false,
  valor_liquido               numeric(12,2) NOT NULL,
  
  -- Reforma Tributária & Tributos Adicionais
  aliquota_ibs                numeric(5,2) DEFAULT 0.0,
  valor_ibs                   numeric(12,2) DEFAULT 0.0,
  aliquota_cbs                numeric(5,2) DEFAULT 0.0,
  valor_cbs                   numeric(12,2) DEFAULT 0.0,
  aliquota_imposto_total      numeric(5,2) DEFAULT 0.0,
  
  -- Armazenamento Completo em JSON para Reimpressão Fiel
  dados_completos             jsonb,
  criado_em                   timestamptz NOT NULL DEFAULT now()
);

-- Índices de Alta Performance
CREATE INDEX IF NOT EXISTS nfse_notas_empresa_idx ON public.nfse_notas (empresa_id);
CREATE INDEX IF NOT EXISTS nfse_notas_numero_idx ON public.nfse_notas (empresa_id, numero);
CREATE INDEX IF NOT EXISTS nfse_notas_chave_idx ON public.nfse_notas (chave_acesso);
CREATE INDEX IF NOT EXISTS nfse_notas_data_idx ON public.nfse_notas (empresa_id, data_emissao);

-- Permissões Explícitas Data API conforme governança Supabase
GRANT SELECT ON public.nfse_notas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nfse_notas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nfse_notas TO service_role;

-- Row Level Security (RLS)
ALTER TABLE public.nfse_notas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total a notas da empresa por usuarios autorizados" ON public.nfse_notas;
CREATE POLICY "Acesso total a notas da empresa por usuarios autorizados" ON public.nfse_notas
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

-- Atualiza colunas na tabela empresas caso ainda não existam
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS data_vencimento date;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS modulo_nfse boolean DEFAULT false;
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS nfse_ultimo_numero integer DEFAULT 0;

-- Recarrega o cache do PostgREST imediatamente
NOTIFY pgrst, 'reload schema';
