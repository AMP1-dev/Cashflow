const { createClient } = require('@supabase/supabase-js');

const url = 'https://eornunjxcmtyrdrihiqk.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0';
const supabase = createClient(url, key);

async function run() {
  const { data: notas, error } = await supabase.from('nfse_notas').select('*');
  console.log('Notas error:', error);
  console.log('Notas count:', notas ? notas.length : 0);
  if (notas && notas.length > 0) {
    notas.forEach(n => {
      console.log(`Nota ${n.numero}: R$ ${n.valor_total} | Empresa: ${n.empresa_id} | Tomador: ${n.tomador_razao_social || n.tomador_nome} | Desc: ${(n.discriminacao_servico||'').substring(0,60)}`);
    });
  }
}

run();
