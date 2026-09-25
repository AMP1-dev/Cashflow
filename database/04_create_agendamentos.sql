-- ============================================================================
-- AMP Flow — Migração: Tabela de Agendamentos (Interno & Auto-atendimento Online)
-- ============================================================================
-- Como aplicar:
--   1. Acesse o Supabase (supabase.com) -> Seu Projeto -> SQL Editor -> New Query
--   2. Cole este script e clique em RUN
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.agendamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  data date NOT NULL,
  horario text NOT NULL,
  cliente_nome text NOT NULL,
  cliente_telefone text,
  cliente_cpf text,
  profissional_nome text DEFAULT 'Profissional',
  servico_nome text NOT NULL,
  valor numeric(12,2) DEFAULT 0.0,
  insumo_estimado numeric(12,2) DEFAULT 0.0,
  forma_pagamento text DEFAULT 'pix',
  status text DEFAULT 'agendado', -- agendado, confirmado, em_atendimento, concluido, cancelado
  origem text DEFAULT 'interno', -- interno ou online
  observacoes text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agendamentos_empresa_data_idx ON public.agendamentos (empresa_id, data);
CREATE INDEX IF NOT EXISTS agendamentos_status_idx ON public.agendamentos (empresa_id, status);

-- Permissões Explícitas Data API conforme regras de governança Supabase
GRANT SELECT, INSERT ON public.agendamentos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agendamentos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agendamentos TO service_role;

-- Row Level Security (RLS)
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
DROP POLICY IF EXISTS "Anonimo pode consultar e criar agendamento online" ON public.agendamentos;
CREATE POLICY "Anonimo pode consultar e criar agendamento online" ON public.agendamentos
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios autenticados gerenciam agendamentos da empresa" ON public.agendamentos;
CREATE POLICY "Usuarios autenticados gerenciam agendamentos da empresa" ON public.agendamentos
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

NOTIFY pgrst, 'reload schema';
