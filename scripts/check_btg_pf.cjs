const { createClient } = require('@supabase/supabase-js');

const url = 'https://eornunjxcmtyrdrihiqk.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0';
const supabase = createClient(url, key);

async function run() {
  const empresaId = 'd89c25f4-3450-4889-b003-8d009fae4890';
  const { data: lancs, error } = await supabase
    .from('lancamentos')
    .select('*')
    .eq('empresa_id', empresaId)
    .gte('data_lancamento', '2026-09-01')
    .lte('data_lancamento', '2026-09-30')
    .order('data_lancamento', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total de lançamentos em setembro: ${lancs.length}`);

  console.log('\n--- Lançamentos relacionados a BTG, MARCO, PAVANI, SÓCIO, RETIRADA, PRO-LABORE ---');
  const encontrados = [];
  lancs.forEach(l => {
    const d = (l.descricao || '').toUpperCase();
    const c = (l.categoria || '').toUpperCase();
    const s = (l.subcategoria || '').toUpperCase();
    if (
      d.includes('BTG') || 
      d.includes('MARCO') || 
      d.includes('PAVANI') || 
      d.includes('PRO-LABORE') || 
      d.includes('PRO LABORE') ||
      d.includes('RETIRADA') ||
      s.includes('LABORE') || 
      s.includes('SÓCIO') ||
      s.includes('SOCIO')
    ) {
      encontrados.push(l);
      console.log(
        `[${l.id.substring(0,8)}] ${l.data_lancamento} | ${l.tipo.toUpperCase().padEnd(7)} | ` +
        `R$ ${parseFloat(l.valor).toFixed(2).padStart(8)} | Cat: ${(l.categoria || '-').padEnd(10)} | ` +
        `Sub: ${(l.subcategoria || '-').padEnd(15)} | Deletado: ${l.deletado_em ? 'SIM' : 'NÃO'} | Desc: ${l.descricao}`
      );
    }
  });

  if (encontrados.length === 0) {
    console.log('Nenhum lançamento encontrado com esses termos exatos.');
  }

  console.log('\n--- Todas as 54 despesas registradas em setembro ---');
  const despesas = lancs.filter(l => l.tipo === 'despesa');
  despesas.forEach((d, i) => {
    console.log(`${i+1}. ${d.data_lancamento} | R$ ${parseFloat(d.valor).toFixed(2)} | ${d.descricao}`);
  });
}

run();
