const { createClient } = require('@supabase/supabase-js');

const url = 'https://eornunjxcmtyrdrihiqk.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0';
const supabase = createClient(url, key);

async function run() {
  const { data: lancs, error } = await supabase
    .from('lancamentos')
    .select('*')
    .or('descricao.ilike.%76%,descricao.ilike.%VIEIRA%,descricao.ilike.%DALT%');
  
  console.log('Error:', error);
  console.log('Lancs found:', lancs ? lancs.length : 0);
  if (lancs) {
    lancs.forEach(l => {
      console.log(`ID: ${l.id} | Desc: ${l.descricao} | Valor: ${l.valor} | Mes: ${l.mes}/${l.ano}`);
    });
  }
}

run();
