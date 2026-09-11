-- Tabela para armazenar as cotações e leads da Landing Page Drywall Distribuidora / Di Brunelli

CREATE TABLE IF NOT EXISTS public.cotacoes_drywall (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    cidade TEXT NOT NULL,
    perfil TEXT,
    necessidade TEXT,
    mensagem TEXT,
    status TEXT DEFAULT 'novo', -- 'novo', 'em_atendimento', 'orcamento_enviado', 'fechado'
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.cotacoes_drywall ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir que visitantes anônimos da Landing Page insiram cotações
CREATE POLICY "Permitir insercao publica de cotacoes"
ON public.cotacoes_drywall
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política 2: Permitir leitura apenas para usuários autenticados (equipe comercial / admin)
CREATE POLICY "Permitir leitura para administradores"
ON public.cotacoes_drywall
FOR SELECT
TO authenticated
USING (true);

COMMENT ON TABLE public.cotacoes_drywall IS 'Armazena solicitações de cotação de produtos drywall do interior de SP';
