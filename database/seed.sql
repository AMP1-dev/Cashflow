-- ============================================================================
-- AMP Flow — Dados de teste (OPCIONAL)
-- ============================================================================
-- Rode este arquivo DEPOIS do schema.sql, e SOMENTE em ambiente de
-- desenvolvimento/teste — nunca em produção.
--
-- IMPORTANTE: este seed não cria usuários de autenticação (isso só pode ser
-- feito via supabase.auth.signUp no app, ou pelo painel Authentication do
-- Supabase), porque auth.users tem regras internas que o SQL puro não deve
-- contornar. Ele cria apenas uma empresa de exemplo sem dono vinculado,
-- só para você ver a estrutura populada.
--
-- Para testar o fluxo completo (login, lançamentos, etc.), o caminho certo é:
--   1. Use a tela de Assinatura do próprio app (ou supabase.auth.signUp)
--      para criar um usuário real de teste.
--   2. Rode o bloco "EXEMPLO DE LANÇAMENTOS" abaixo trocando o uuid da
--      empresa pelo id gerado de verdade.
-- ============================================================================

-- Empresa de exemplo (sem usuário vinculado ainda)
insert into public.empresas (id, razao_social, nome_fantasia, cpf_titular, email_contato, telefone_contato, status)
values (
  '00000000-0000-0000-0000-000000000001',
  'Padaria Pão Dourado Ltda',
  'Pão Dourado',
  '12345678900',
  'maria@paodourado.com.br',
  '19999991111',
  'teste'
)
on conflict (cpf_titular) do nothing;

-- Índices de precificação de exemplo para essa empresa
insert into public.indices_precificacao (empresa_id, das, cartao, custo_fixo)
values ('00000000-0000-0000-0000-000000000001', 4.0, 5.0, 30.0)
on conflict (empresa_id) do nothing;

-- ============================================================================
-- EXEMPLO DE LANÇAMENTOS
-- Troque '00000000-0000-0000-0000-000000000001' pelo id real da empresa
-- (visível na tabela empresas após o cadastro de verdade).
-- ============================================================================

insert into public.lancamentos (empresa_id, tipo, descricao, valor, data_lancamento, categoria, subcategoria)
values
  ('00000000-0000-0000-0000-000000000001', 'despesa', 'Aluguel', 1800.00, current_date - interval '5 days', 'fixa', 'Aluguel'),
  ('00000000-0000-0000-0000-000000000001', 'despesa', 'Farinha de trigo', 620.00, current_date - interval '3 days', 'cmv', 'Matéria-prima'),
  ('00000000-0000-0000-0000-000000000001', 'despesa', 'Taxa de cartão', 95.00, current_date - interval '2 days', 'variavel', 'Taxa de cartão');

insert into public.lancamentos (empresa_id, tipo, descricao, valor, data_lancamento, forma_recebimento, qtd_vendas)
values
  ('00000000-0000-0000-0000-000000000001', 'receita', 'Venda balcão', 3200.00, current_date - interval '1 day', 'avista', 140);
