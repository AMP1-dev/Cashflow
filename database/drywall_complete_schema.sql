-- ==============================================================================
-- Schema Completo da Drywall Distribuidora / Di Brunelli (Supabase / PostgreSQL)
-- ==============================================================================

-- 1. Tabela de Cotações e Leads CRM
CREATE TABLE IF NOT EXISTS public.drywall_cotacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    empresa TEXT,
    cidade TEXT NOT NULL DEFAULT 'Interior de SP',
    segmento TEXT DEFAULT 'Gesseiro / Instalador',
    mensagem TEXT,
    itens JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'novo', -- 'novo', 'em_atendimento', 'orcamento_enviado', 'fechado', 'cancelado'
    notes TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Catálogo de Produtos Essenciais
CREATE TABLE IF NOT EXISTS public.drywall_produtos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL, -- 'Placas', 'Estruturas', 'Forros', 'Isolamento', 'Insumos'
    specs TEXT,
    unit TEXT NOT NULL DEFAULT 'Chapa',
    badge TEXT,
    image TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Itens da Loja Virtual Di Brunelli (Simulador / Futura Loja)
CREATE TABLE IF NOT EXISTS public.drywall_loja_itens (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ref_price TEXT NOT NULL,
    unit TEXT NOT NULL,
    stock TEXT NOT NULL DEFAULT 'Pronta-entrega',
    category TEXT NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Polos de Entrega / Logística
CREATE TABLE IF NOT EXISTS public.drywall_regioes (
    id SERIAL PRIMARY KEY,
    region TEXT NOT NULL,
    main TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT '24h',
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Notícias e Guias Técnicos ABNT
CREATE TABLE IF NOT EXISTS public.drywall_noticias (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT NOT NULL,
    date TEXT NOT NULL,
    summary TEXT NOT NULL,
    tag TEXT NOT NULL DEFAULT 'Normas Técnicas',
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Configurações da Empresa
CREATE TABLE IF NOT EXISTS public.drywall_config (
    id TEXT PRIMARY KEY DEFAULT 'matriz',
    data JSONB NOT NULL,
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Políticas de Segurança (Row Level Security - RLS)
-- ==============================================================================

ALTER TABLE public.drywall_cotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drywall_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drywall_loja_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drywall_regioes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drywall_noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drywall_config ENABLE ROW LEVEL SECURITY;

-- Cotações: Visitantes anônimos podem inserir novas cotações
CREATE POLICY "Permitir insercao anonima de cotacoes" ON public.drywall_cotacoes
FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Cotações: Permitir leitura e atualização (admin / anon para prototipagem ou autenticado)
CREATE POLICY "Permitir leitura de cotacoes" ON public.drywall_cotacoes
FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Permitir update de cotacoes" ON public.drywall_cotacoes
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir delete de cotacoes" ON public.drywall_cotacoes
FOR DELETE TO anon, authenticated USING (true);

-- Produtos, Loja, Regiões, Notícias, Config: Leitura pública e Escrita permitida
CREATE POLICY "Permitir leitura publica produtos" ON public.drywall_produtos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir gravacao produtos" ON public.drywall_produtos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura publica loja" ON public.drywall_loja_itens FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir gravacao loja" ON public.drywall_loja_itens FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura publica regioes" ON public.drywall_regioes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir gravacao regioes" ON public.drywall_regioes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura publica noticias" ON public.drywall_noticias FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir gravacao noticias" ON public.drywall_noticias FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura publica config" ON public.drywall_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir gravacao config" ON public.drywall_config FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- Dados Iniciais (Seed)
-- ==============================================================================

INSERT INTO public.drywall_produtos (id, title, subtitle, category, specs, unit, badge, image) VALUES
('placa-st', 'Placa Drywall Standard ST 12.5mm', 'Uso geral para paredes divisórias e forros em áreas secas', 'Placas', '1,20m x 1,80m / 2,40m &bull; 12.5mm', 'Chapa', 'Mais Vendido', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'),
('placa-ru', 'Placa Drywall Resistente à Umidade RU (Verde)', 'Núcleo siliconado hidrófugo para banheiros, lavabos e cozinhas', 'Placas', '1,20m x 1,80m / 2,40m &bull; 12.5mm', 'Chapa', 'Áreas Úmidas', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'),
('perfis-montantes-guias', 'Perfis Estruturais Montantes & Guias 48 / 70 (3m)', 'Aço galvanizado Z275 certificado com furos para instalações', 'Estruturas', 'Barras 3,00m &bull; NBR 15217', 'Barra / Fardo', 'Aço Z275 Certificado', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'),
('canaleta-f530-tabica', 'Canaleta F530 & Tabica Branca para Forro', 'Sustentação de forros suspensos e acabamento com junta de dilatação', 'Forros', 'Barras de 3,00m &bull; Pintura Epóxi', 'Barra', 'Teto Flutuante', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'),
('la-de-vidro-acustica', 'Lã de Vidro Wallfelt 50mm / 70mm', 'Absorção acústica e térmica para miolo de paredes e forros', 'Isolamento', 'Rolos de 15m² &bull; Incombustível', 'Rolo', 'Alto Isolamento', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'),
('massa-fitas-fixacao', 'Massa para Drywall (Balde) & Fitas Microperfuradas', 'Tratamento de juntas sem trincas e parafusos GN 25 / GN 35', 'Insumos', 'Balde 15kg/28kg &bull; Rolo 150m', 'Kit / Unidade', 'Acabamento Perfeito', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- Permissões de Acesso (GRANTs) para a API REST do Supabase
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Recarregar cache de schemas do PostgREST imediatamente
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
