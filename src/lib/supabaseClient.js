import { createClient } from '@supabase/supabase-js';

// Projeto "Fixos" (Projetos Institucionais, Drywall, etc.)
const supabaseUrl = import.meta.env.VITE_DRYWALL_SUPABASE_URL || 'https://ogqahhmxsmjoyjdikafm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_DRYWALL_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncWFoaG14c21qb3lqZGlrYWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNzUwMDIsImV4cCI6MjEwNDY1MTAwMn0.mzImAieq-IkJL5eVumhW5QxK5u70yN_cnW2H48B-0bs';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('seu-projeto') &&
    !supabaseAnonKey.includes('sua-chave') &&
    !supabaseAnonKey.includes('sua-anon-key') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
