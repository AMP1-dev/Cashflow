import { createClient } from '@supabase/supabase-js'

// As credenciais vêm de variáveis de ambiente (.env), nunca hardcoded.
// Veja .env.example para os nomes esperados.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Em produção isso não deve acontecer — se acontecer, o deploy está sem as
  // env vars configuradas na Vercel (Project Settings -> Environment Variables).
  console.error(
    'Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não encontradas. ' +
    'Configure o arquivo .env localmente (veja .env.example) ou as ' +
    'Environment Variables do projeto na Vercel.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
