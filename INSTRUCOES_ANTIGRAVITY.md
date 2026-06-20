# AMP Flow — Briefing técnico para continuação do desenvolvimento

Este documento é o ponto de partida para quem (ou qual IA) for assumir o código a partir daqui. Ele resume tudo que já foi decidido e construído, e organiza o que falta fazer, em ordem de prioridade.

## O que é o produto

App web mobile-first para donos de pequenos negócios controlarem o fluxo de caixa diário e gerarem automaticamente a DRE (Demonstrativo de Resultados) do mês, sem precisar entender contabilidade. Vai ser vendido por assinatura para várias empresas (multiempresa, multiusuário).

Diferencial principal: ao lançar uma despesa, um assistente de perguntas (`ClassificacaoWizard` em `App.jsx`) guia o usuário leigo até a categoria contábil certa (CMV / Despesa Variável / Despesa Fixa / Despesa Financeira) usando linguagem simples, em vez de pedir que ele já saiba a diferença.

## Estado atual (importante ler antes de mexer em qualquer coisa)

**O frontend está pronto e funcional como protótipo visual**, mas roda 100% em memória (`useState` em `App.jsx`) — não há nenhuma chamada ao Supabase ainda. Fechar a aba apaga todos os dados. Este é o maior e mais urgente gap.

O arquivo `src/App.jsx` é um componente único e grande (~2100 linhas) contendo todas as telas. Ele não está dividido em arquivos separados por componente — isso foi intencional durante a fase de prototipagem rápida, mas **recomendo fortemente quebrar em módulos** (`src/screens/`, `src/components/`) como um dos primeiros passos, antes de conectar ao banco, para facilitar a manutenção.

## Banco de dados

O schema SQL completo já existe e deve ser aplicado **antes** de qualquer integração: ver `schema.sql` e `LEIA-ME.md` (entregues junto). Resumo das tabelas:

- `empresas` — cadastro + status da assinatura (teste/ativo/suspenso/cancelado)
- `profiles` — extensão de `auth.users` (nome, CPF, telefone, flag `eh_admin`)
- `empresa_usuarios` — vínculo N:N entre usuários e empresas, com papel (dono/funcionario)
- `lancamentos` — despesas e receitas
- `indices_precificacao` — percentuais usados na tela de Formação de Preço
- View `resumo_dre_mensal` — totais já agregados por categoria/mês

Segurança via Row Level Security já está configurada em todas as tabelas — cada empresa só acessa os próprios dados, e a coluna `status` da assinatura só pode ser alterada por quem tem `eh_admin = true`.

## Telas existentes em App.jsx (todas funcionais visualmente)

| Tela/Componente | O que faz |
|---|---|
| `LoginScreen` | Login do cliente por CPF + senha |
| `AssinaturaScreen` | Cadastro público (CPF e empresa obrigatórios; nome, fantasia, email, telefone, opcionais) |
| `RecuperarSenhaScreen` / `RedefinirSenhaScreen` | Fluxo de "esqueci senha" — **hoje 100% simulado**, sem envio real de e-mail |
| `AdminLoginScreen` / `AdminPanel` / `AdminDetalheAssinante` | Painel interno para gerenciar assinantes (mudar status, ver dados) |
| `Dashboard` | Resumo do mês: saldo, receitas/despesas por categoria, lançamentos recentes (colapsável) |
| `FluxoCaixa` | Calendário do mês em grade + gráfico de barras Receita x Despesa por dia + indicadores de tendência |
| `NovoLancamentoModal` | Criar/editar lançamento, com autocomplete de descrições já usadas |
| `ClassificacaoWizard` | Assistente de perguntas para classificar despesas (CMV/Variável/Fixa/Financeira) |
| `DREScreen` | DRE do mês com % sobre faturamento, linhas expansíveis mostrando os lançamentos de cada categoria |
| `AnualScreen` | Visão dos 12 meses com indicadores (margem líquida, crescimento, ticket médio, etc.) |
| `FormacaoPrecoScreen` | Calculadora reversa de precificação (markup divisor), com sugestão de preço mínimo para não dar prejuízo |

## O que falta fazer — em ordem sugerida

### 1. Configurar o Supabase
- Criar o projeto no Supabase (ainda não existe).
- Rodar `schema.sql` no SQL Editor.
- Habilitar o provedor de Auth por email/senha (padrão já vem ligado).
- Copiar URL + anon key para `.env` (ver `.env.example`).

### 2. Trocar a autenticação simulada pela real
Hoje `fazerLogin`, `fazerLoginAdmin`, `criarAssinatura` e `redefinirSenha` (dentro do componente `CashFlowApp` em `App.jsx`) operam sobre o array `assinantes` em memória. Substituir por:
- `supabase.auth.signUp({ email: `${cpf}@ampflow.internal`, password, options: { data: { cpf, nome, telefone } } })` na assinatura. O trigger `handle_novo_usuario` do banco já cria o `profile` automaticamente a partir desses metadados — falta inserir a empresa e o vínculo `empresa_usuarios` (papel `dono`) logo em seguida, no código do app.
- `supabase.auth.signInWithPassword({ email: `${cpf}@ampflow.internal`, password })` no login.
- `supabase.auth.resetPasswordForEmail(...)` para recuperação de senha real (troca o fluxo hoje simulado por e-mail de verdade — atenção: isso muda a UX, já que precisa de um e-mail cadastrado, não só o CPF; avaliar com o produto se mantém CPF na tela e resolve o e-mail por trás, ou se passa a pedir e-mail nessa tela específica).
- Login do admin: mesma mecânica de `signInWithPassword`, mas validando depois se `profiles.eh_admin = true` antes de liberar o painel.

### 3. Trocar os dados de lançamentos de `useState` para Supabase
As funções `addLancamento`, `removeLancamento`, `updateLancamento` em `App.jsx` hoje manipulam o estado local. Trocar por `supabase.from('lancamentos').insert/update/delete(...)`. Atenção aos pontos:
- O protótipo guarda "dia do mês" (`l.dia`) + `mes`/`ano` separados; o banco usa uma única coluna `data_lancamento date`. Ajustar a conversão nos dois sentidos ao integrar.
- Os `CHECK constraints` do banco já impedem inconsistências (ex: despesa sem categoria) — então erros de insert vindos do Supabase devem ser tratados e mostrados ao usuário, não apenas logados.

### 4. Autocomplete de descrições e Formação de Preço
- `construirSugestoesDescricao` hoje escaneia o array de lançamentos em memória. Com o volume crescendo, migrar para uma query: `select distinct on (lower(descricao)) descricao, categoria, subcategoria from lancamentos where empresa_id = ... and tipo = ... order by lower(descricao), criado_em desc`. O índice `lancamentos_empresa_descricao_idx` já existe no schema para isso.
- `sugerirPercentuais` (Formação de Preço) deve passar a ler/escrever na tabela `indices_precificacao` em vez de recalcular tudo a cada render a partir dos lançamentos brutos.

### 5. Painel Admin com dados reais
`AdminPanel` deve consultar `empresas` diretamente (o usuário logado precisa ter `eh_admin = true` — a política de RLS já libera a visão de todas as empresas nesse caso). A troca de status (`atualizarStatusAssinante`) vira um `update` simples na tabela `empresas`.

### 6. Multiusuário por empresa (já modelado no banco, não implementado no frontend)
O schema já suporta um dono convidar funcionários (`empresa_usuarios`), mas **nenhuma tela do frontend hoje permite isso** — é tudo "1 usuário = 1 empresa" na prática. Se for prioridade, será preciso desenhar a tela de convite/gestão de usuários da empresa do zero.

### 7. Deploy
- Importar o repositório na Vercel.
- Configurar as Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) no projeto da Vercel.
- `vercel.json` já está incluído com o rewrite necessário para SPA (evita 404 ao recarregar rotas internas).

## Decisões de design que valem preservar

- Paleta do app cliente: verde-petróleo escuro (`#0F2B27`) + âmbar (`#E8A33D`), fundo cream (`#FAF8F3`).
- Paleta do painel admin: cinza-grafite (`#1A1D21` / `#24282D`) + acento azul-acinzentado (`#5B8AA6`) — deliberadamente diferente da paleta do cliente para reforçar que é uma área distinta.
- Tipografia: Georgia (serifada) para números grandes e títulos, sans-serif do sistema para o resto.
- O wizard de classificação de despesas é o coração da proposta de valor — qualquer refatoração deve preservar a lógica de perguntas em `WIZARD` (objeto em `App.jsx`) e a possibilidade de o usuário adicionar subcategorias livres.

## Testando localmente sem o Supabase configurado

Caso precise iterar no visual antes de configurar o banco, pode rodar `npm run dev` com um `.env` de valores fake — a tela inicial (login) carrega normalmente já que hoje ainda usa o array `ASSINANTES_INICIAIS` em memória como fallback. Isso deixará de funcionar assim que a etapa 2 (autenticação real) for implementada, o que é esperado.
