# AMP Flow — Banco de dados (Supabase)

Este pacote contém o schema completo do banco de dados para o AMP Flow, pronto para Supabase (PostgreSQL).

## Arquivos

- **`schema.sql`** — schema completo: tabelas, tipos, índices, triggers, segurança (RLS) e uma view de apoio para a DRE. Execute primeiro.
- **`seed.sql`** — dados de teste opcionais, só para desenvolvimento. Não execute em produção.

## Como aplicar

1. Abra o projeto em [supabase.com](https://supabase.com) → **SQL Editor** → **New query**.
2. Cole o conteúdo de `schema.sql` inteiro e clique em **Run**.
3. (Opcional, só em dev) Cole o conteúdo de `seed.sql` e rode também.

## Decisões de modelagem

- **Autenticação:** usa o Supabase Auth (`auth.users`), não uma tabela de senha própria. Isso garante hash seguro de senha, tokens de sessão e recuperação de senha por e-mail prontos — sem precisar implementar nada disso na mão.
- **Login por CPF:** como o Supabase Auth exige um "email" como identificador, a prática recomendada é o app usar `signUp({ email: '<cpf>@ampflow.internal', password, options: { data: { cpf, nome, telefone } } })`. A pessoa só vê e digita o CPF na tela; o "email" técnico fica escondido nos bastidores.
- **Multiempresa + multiusuário:** uma empresa (`empresas`) pode ter vários usuários (`profiles`) vinculados via `empresa_usuarios`, cada um com um papel (`dono` ou `funcionario`). Isso já contempla, desde já, o caso de um dono convidar um funcionário para lançar dados.
- **Segurança via RLS:** cada tabela com dado sensível tem Row Level Security ligado. Isso significa que **mesmo que o código do app tenha um bug**, o banco em si recusa qualquer tentativa de uma empresa ler ou escrever dados de outra. É proteção em duas camadas (app + banco), não apenas confiança no código.
- **Status da assinatura travado para o cliente:** o dono da empresa pode editar nome, telefone etc., mas **não pode mudar o próprio `status`** de "teste" para "ativo" — só o painel admin pode. Isso é forçado no banco, não apenas escondido na interface.

## Papel de administrador

Não existe uma tabela separada de "admins". Em vez disso, a coluna `profiles.eh_admin` marca quem tem acesso total. Para promover seu usuário a admin depois de criar a conta normalmente pelo app:

```sql
update public.profiles set eh_admin = true where cpf = '<seu_cpf_sem_pontuacao>';
```

Faça isso manualmente pelo SQL Editor — por segurança, não existe nenhum caminho no app para um usuário se autopromover a admin.

## Conectando o app (React) ao banco

O app hoje usa `useState` para guardar tudo em memória. Para conectar de verdade, a ideia geral é:

1. Instalar `@supabase/supabase-js` no projeto.
2. Criar um client apontando para a URL e a `anon key` do seu projeto Supabase (ambas públicas, protegidas pelo RLS — não são segredo).
3. Trocar:
   - Tela de Assinatura → `supabase.auth.signUp(...)`, depois inserir a empresa e o vínculo em `empresa_usuarios` com papel `dono`.
   - Tela de Login → `supabase.auth.signInWithPassword(...)`.
   - Lançamentos (criar/editar/excluir/listar) → `supabase.from('lancamentos').select/insert/update/delete(...)`.
   - DRE → pode consultar direto a view `resumo_dre_mensal`, já vem somada por categoria e mês.
   - Painel admin → como o usuário marcado `eh_admin = true` enxerga todas as empresas (a política de RLS já permite isso), o painel só precisa trocar os `useState` por consultas normais nas tabelas `empresas` e `lancamentos`.

Esse é exatamente o tipo de tarefa que uma IA de código (Claude Code, Cursor etc.) consegue implementar rapidamente tendo este schema como referência — é só apontar para os arquivos `schema.sql` e este guia.
