# AMP Flow

Fluxo de caixa e DRE para pequenos negócios — controle financeiro sem precisar entender contabilidade.

## Stack

- **Frontend:** React 18 + Vite
- **Ícones:** lucide-react
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Deploy:** Vercel

## Rodando localmente

```bash
npm install
cp .env.example .env   # depois preencha com suas credenciais do Supabase
npm run dev
```

## Banco de dados

O schema completo (tabelas, segurança, etc.) está no repositório separado de banco — veja `schema.sql` e `LEIA-ME.md` fornecidos junto com este projeto. Aplique-os no SQL Editor do Supabase antes de rodar o app contra dados reais.

## Estado atual do projeto

Veja `INSTRUCOES_ANTIGRAVITY.md` na raiz do projeto para o panorama completo do que já existe, o que falta conectar, e em que ordem.

## Build e deploy

```bash
npm run build      # gera a pasta dist/
```

Para publicar na Vercel, basta importar este repositório no painel da Vercel e configurar as Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) nas configurações do projeto.

 

 
