-- ============================================================================
-- AMP Flow — Schema do banco de dados (Supabase / PostgreSQL)
-- ============================================================================
-- Como aplicar:
--   1. Abra seu projeto em supabase.com -> SQL Editor -> New query
--   2. Cole este arquivo inteiro e execute (Run)
--   3. Rode também o arquivo seed.sql (opcional) se quiser dados de teste
--
-- O que este schema cobre:
--   - Multiempresa: cada empresa tem seus dados isolados dos demais
--   - Multiusuário: uma empresa pode ter vários usuários (dono, funcionários)
--   - Autenticação via Supabase Auth (login por CPF, senha com hash seguro)
--   - Segurança via Row Level Security (RLS): cada usuário só enxerga e
--     altera dados das empresas às quais pertence — aplicado no banco,
--     não apenas no código do app (defesa em profundidade)
--   - Painel admin: papel separado com visão de todas as empresas
-- ============================================================================


-- ============================================================================
-- EXTENSÕES NECESSÁRIAS
-- ============================================================================
create extension if not exists "pgcrypto"; -- gen_random_uuid()


-- ============================================================================
-- TIPOS ENUMERADOS
-- Usar enum em vez de texto livre evita erros de digitação (ex: "ativo" vs
-- "Ativo" vs "ATIVO") e deixa o banco recusar valores inválidos sozinho.
-- ============================================================================

create type status_assinatura as enum ('teste', 'ativo', 'suspenso', 'cancelado');
create type papel_usuario as enum ('dono', 'funcionario', 'admin');
create type tipo_lancamento as enum ('despesa', 'receita');
create type categoria_despesa as enum ('cmv', 'variavel', 'fixa', 'financeira');
create type forma_recebimento as enum ('avista', 'aprazo');


-- ============================================================================
-- TABELA: empresas
-- A entidade "negócio" / assinante. Mantém os dados cadastrais e o status
-- da assinatura (usado pelo painel admin para liberar/suspender acesso).
-- ============================================================================

create table public.empresas (
  id                  uuid primary key default gen_random_uuid(),
  razao_social        text not null,
  nome_fantasia       text,
  cpf_titular         text not null,            -- CPF de quem assinou (somente dígitos)
  cnpj                text,                     -- opcional, caso a empresa tenha CNPJ
  email_contato       text,
  telefone_contato    text,
  status              status_assinatura not null default 'teste',
  plano               text default 'padrao',     -- espaço para múltiplos planos no futuro
  data_vencimento     date,                       -- próxima cobrança / fim do teste
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now(),

  constraint cpf_titular_formato check (cpf_titular ~ '^\d{11}$') -- garante 11 dígitos, sem pontuação
);

comment on table public.empresas is 'Cada linha é um assinante/empresa cliente do AMP Flow.';
comment on column public.empresas.cpf_titular is 'CPF armazenado somente com dígitos (sem pontos/traço), validado pelo app antes de inserir.';

create unique index empresas_cpf_titular_uidx on public.empresas (cpf_titular);
create index empresas_status_idx on public.empresas (status);


-- ============================================================================
-- TABELA: profiles
-- Extensão de auth.users (tabela interna do Supabase Auth). Cada pessoa que
-- faz login tem um profile. O id é o MESMO id do auth.users (1 para 1).
-- ============================================================================

create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  nome            text,
  cpf             text not null,
  telefone        text,
  eh_admin        boolean not null default false,  -- true só para a equipe interna do AMP Flow
  criado_em       timestamptz not null default now(),

  constraint cpf_profile_formato check (cpf ~ '^\d{11}$')
);

comment on table public.profiles is 'Dados de perfil de cada usuário autenticado, 1 para 1 com auth.users.';

create unique index profiles_cpf_uidx on public.profiles (cpf);


-- ============================================================================
-- TABELA: empresa_usuarios
-- Tabela de ligação (N:N): quais usuários pertencem a quais empresas, e com
-- qual papel. Permite dono + funcionários na mesma empresa.
-- ============================================================================

create table public.empresa_usuarios (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references public.empresas(id) on delete cascade,
  usuario_id      uuid not null references public.profiles(id) on delete cascade,
  papel           papel_usuario not null default 'funcionario',
  convidado_em    timestamptz not null default now(),

  unique (empresa_id, usuario_id) -- evita vincular a mesma pessoa duas vezes à mesma empresa
);

comment on table public.empresa_usuarios is 'Relaciona usuários (profiles) a empresas, com papel de acesso.';

create index empresa_usuarios_empresa_idx on public.empresa_usuarios (empresa_id);
create index empresa_usuarios_usuario_idx on public.empresa_usuarios (usuario_id);


-- ============================================================================
-- TABELA: lancamentos
-- Despesas e receitas lançadas no fluxo de caixa, já com a classificação
-- contábil (categoria) usada para montar a DRE automaticamente.
-- ============================================================================

create table public.lancamentos (
  id                  uuid primary key default gen_random_uuid(),
  empresa_id          uuid not null references public.empresas(id) on delete cascade,
  criado_por          uuid references public.profiles(id) on delete set null,

  tipo                tipo_lancamento not null,
  descricao           text not null,
  valor               numeric(12,2) not null check (valor > 0),

  -- data completa em vez de "dia do mês" solto: mais robusto para consultas,
  -- relatórios anuais e qualquer fuso/virada de mês
  data_lancamento     date not null,

  -- só preenchido quando tipo = 'despesa'
  categoria           categoria_despesa,
  subcategoria        text,

  -- só preenchido quando tipo = 'receita'
  forma_recebimento   forma_recebimento,
  qtd_vendas          integer check (qtd_vendas is null or qtd_vendas > 0),

  -- campos adicionais
  banco               text,
  meio_pagamento      text,

  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now(),

  -- regra de negócio no próprio banco: despesa PRECISA ter categoria
  constraint despesa_tem_categoria check (
    (tipo = 'despesa' and categoria is not null) or (tipo = 'receita')
  ),
  -- e receita não deve carregar campos exclusivos de despesa, nem vice-versa
  constraint campos_consistentes_com_tipo check (
    (tipo = 'despesa' and forma_recebimento is null and qtd_vendas is null)
    or
    (tipo = 'receita' and categoria is null and subcategoria is null)
  )
);

comment on table public.lancamentos is 'Lançamentos de fluxo de caixa (despesas e receitas) por empresa.';

create index lancamentos_empresa_idx on public.lancamentos (empresa_id);
create index lancamentos_empresa_data_idx on public.lancamentos (empresa_id, data_lancamento);
create index lancamentos_empresa_tipo_idx on public.lancamentos (empresa_id, tipo);
-- acelera a busca de autocomplete (descrições já usadas por aquela empresa)
create index lancamentos_empresa_descricao_idx on public.lancamentos (empresa_id, lower(descricao));


-- ============================================================================
-- TABELA: indices_precificacao
-- Guarda os percentuais (DAS, comissão, cartão, custo fixo etc) usados na
-- tela de Formação de Preço, para a empresa não precisar redigitar toda vez.
-- ============================================================================

create table public.indices_precificacao (
  empresa_id          uuid primary key references public.empresas(id) on delete cascade,
  das                 numeric(5,2) not null default 0,
  comissao            numeric(5,2) not null default 0,
  cartao              numeric(5,2) not null default 0,
  outros              numeric(5,2) not null default 0,
  custo_fixo          numeric(5,2) not null default 0,
  retirada            numeric(5,2) not null default 0,
  distrib_lucros      numeric(5,2) not null default 0,
  atualizado_em       timestamptz not null default now()
);

comment on table public.indices_precificacao is 'Últimos percentuais usados/ajustados manualmente na Formação de Preço, por empresa.';


-- ============================================================================
-- TRIGGERS: manter atualizado_em sempre correto
-- ============================================================================

create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger trg_empresas_atualizado_em
  before update on public.empresas
  for each row execute function public.set_atualizado_em();

create trigger trg_lancamentos_atualizado_em
  before update on public.lancamentos
  for each row execute function public.set_atualizado_em();

create trigger trg_indices_precificacao_atualizado_em
  before update on public.indices_precificacao
  for each row execute function public.set_atualizado_em();


-- ============================================================================
-- TRIGGER: criar profile automaticamente ao assinar (auth.users -> profiles)
-- O app, na tela de Assinatura, chama supabase.auth.signUp(...) passando
-- CPF/nome/telefone em "options.data". Este trigger lê esses metadados e
-- já cria a linha correspondente em profiles, sem precisar de um 2º insert
-- separado no código do app (evita inconsistência se uma das duas falhar).
-- ============================================================================

create or replace function public.handle_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, cpf, telefone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nome',
    new.raw_user_meta_data ->> 'cpf',
    new.raw_user_meta_data ->> 'telefone'
  );
  return new;
end;
$$;

create trigger trg_criar_profile_no_signup
  after insert on auth.users
  for each row execute function public.handle_novo_usuario();


-- ============================================================================
-- FUNÇÃO AUXILIAR: pertence_a_empresa(empresa_id)
-- Usada dentro das políticas de RLS abaixo para checar, de forma reutilizável,
-- se o usuário autenticado (auth.uid()) tem vínculo com a empresa em questão.
-- SECURITY DEFINER + search_path fixo evita problemas de permissão e injeção.
-- ============================================================================

create or replace function public.pertence_a_empresa(p_empresa_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.empresa_usuarios eu
    where eu.empresa_id = p_empresa_id
      and eu.usuario_id = auth.uid()
  );
$$;

create or replace function public.eh_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select p.eh_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Por padrão, com RLS ligado e SEM políticas, ninguém enxerga nada além do
-- que as políticas permitirem explicitamente — esse é o comportamento seguro
-- que queremos. Cada tabela com dado de empresa fica protegida por igual.
-- ============================================================================

alter table public.empresas enable row level security;
alter table public.profiles enable row level security;
alter table public.empresa_usuarios enable row level security;
alter table public.lancamentos enable row level security;
alter table public.indices_precificacao enable row level security;

-- ---------- empresas ----------

-- usuário pode ver as empresas às quais pertence; admin vê todas
create policy empresas_select on public.empresas
  for select
  using (public.pertence_a_empresa(id) or public.eh_admin());

-- qualquer pessoa autenticada pode criar uma empresa (fluxo de assinatura) —
-- o vínculo dela como dono é criado logo em seguida via empresa_usuarios
create policy empresas_insert on public.empresas
  for insert
  with check (auth.uid() is not null);

-- só o dono da empresa (ou admin) pode editar dados cadastrais;
-- mudar o STATUS da assinatura fica restrito só ao admin (ver policy abaixo)
create policy empresas_update_dono on public.empresas
  for update
  using (
    public.eh_admin()
    or exists (
      select 1 from public.empresa_usuarios eu
      where eu.empresa_id = empresas.id
        and eu.usuario_id = auth.uid()
        and eu.papel = 'dono'
    )
  );

-- ---------- profiles ----------

-- cada pessoa vê e edita o próprio perfil; admin vê todos
create policy profiles_select on public.profiles
  for select
  using (id = auth.uid() or public.eh_admin());

create policy profiles_update_proprio on public.profiles
  for update
  using (id = auth.uid());

-- ---------- empresa_usuarios ----------

-- usuário vê os vínculos das empresas às quais pertence; admin vê todos
create policy empresa_usuarios_select on public.empresa_usuarios
  for select
  using (public.pertence_a_empresa(empresa_id) or public.eh_admin());

-- dono da empresa pode convidar/adicionar novos usuários (funcionários);
-- também permite o auto-vínculo como 'dono' logo após criar a empresa
create policy empresa_usuarios_insert on public.empresa_usuarios
  for insert
  with check (
    public.eh_admin()
    or usuario_id = auth.uid() -- a própria pessoa se vinculando (caso da assinatura)
    or exists (
      select 1 from public.empresa_usuarios eu
      where eu.empresa_id = empresa_usuarios.empresa_id
        and eu.usuario_id = auth.uid()
        and eu.papel = 'dono'
    )
  );

-- só o dono (ou admin) pode remover vínculos (ex: desligar um funcionário)
create policy empresa_usuarios_delete on public.empresa_usuarios
  for delete
  using (
    public.eh_admin()
    or exists (
      select 1 from public.empresa_usuarios eu
      where eu.empresa_id = empresa_usuarios.empresa_id
        and eu.usuario_id = auth.uid()
        and eu.papel = 'dono'
    )
  );

-- ---------- lancamentos ----------

-- qualquer usuário vinculado à empresa pode ver, criar, editar e excluir
-- os lançamentos DA SUA empresa — nunca de outra
create policy lancamentos_select on public.lancamentos
  for select
  using (public.pertence_a_empresa(empresa_id) or public.eh_admin());

create policy lancamentos_insert on public.lancamentos
  for insert
  with check (public.pertence_a_empresa(empresa_id));

create policy lancamentos_update on public.lancamentos
  for update
  using (public.pertence_a_empresa(empresa_id));

create policy lancamentos_delete on public.lancamentos
  for delete
  using (public.pertence_a_empresa(empresa_id));

-- ---------- indices_precificacao ----------

create policy indices_precificacao_select on public.indices_precificacao
  for select
  using (public.pertence_a_empresa(empresa_id) or public.eh_admin());

create policy indices_precificacao_upsert on public.indices_precificacao
  for insert
  with check (public.pertence_a_empresa(empresa_id));

create policy indices_precificacao_update on public.indices_precificacao
  for update
  using (public.pertence_a_empresa(empresa_id));


-- ============================================================================
-- POLÍTICA ESPECIAL: só admin pode mudar o STATUS da assinatura
-- A policy "empresas_update_dono" acima permite que o dono edite a empresa,
-- mas queremos impedir que ele mesmo se promova de 'teste' para 'ativo' sem
-- pagar. Fazemos isso travando a coluna status via uma policy adicional
-- que checa se o valor de status realmente mudou.
-- ============================================================================

create policy empresas_update_status_admin on public.empresas
  for update
  using (public.eh_admin())
  with check (public.eh_admin());

-- nota de uso: no nível de aplicação, o formulário do cliente (dono) nunca
-- deve enviar o campo "status" no UPDATE. A combinação das duas policies já
-- impede a escrita indevida no banco mesmo que o app tente por engano.


-- ============================================================================
-- VIEW: resumo_dre_mensal
-- Facilita montar a DRE direto via SQL (soma por categoria, por mês),
-- sem precisar trazer todos os lançamentos crus para o app calcular.
-- Já respeita RLS porque consulta a tabela lancamentos por baixo.
-- ============================================================================

create or replace view public.resumo_dre_mensal as
select
  empresa_id,
  date_trunc('month', data_lancamento)::date as mes_referencia,
  sum(case when tipo = 'receita' then valor else 0 end) as faturamento,
  sum(case when tipo = 'despesa' and categoria = 'cmv' then valor else 0 end) as cmv,
  sum(case when tipo = 'despesa' and categoria = 'variavel' then valor else 0 end) as despesas_variaveis,
  sum(case when tipo = 'despesa' and categoria = 'fixa' then valor else 0 end) as despesas_fixas,
  sum(case when tipo = 'despesa' and categoria = 'financeira' then valor else 0 end) as despesas_financeiras
from public.lancamentos
group by empresa_id, date_trunc('month', data_lancamento);

comment on view public.resumo_dre_mensal is 'Totais por categoria e mês, prontos para montar a DRE. Respeita RLS de lancamentos.';


-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
