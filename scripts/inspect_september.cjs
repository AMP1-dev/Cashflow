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
    .is('deletado_em', null)
    .order('data_lancamento', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  let totalRec = 0;
  let totalDesp = 0;
  const listTransf = [];
  const listOutros = [];

  lancs.forEach((l, idx) => {
    const val = parseFloat(l.valor);
    if (l.tipo === 'receita') totalRec += val;
    else totalDesp += val;

    const descUpper = (l.descricao || '').toUpperCase();
    const isTransf = descUpper.includes('AMP DO BRASIL') || 
                     descUpper.includes('PAVANI') || 
                     descUpper.includes('RESGATE') || 
                     descUpper.includes('APLICACAO') || 
                     descUpper.includes('RDB') ||
                     descUpper.includes('TRANSFERENCIA') || 
                     descUpper.includes('TRANSF') ||
                     descUpper.includes('SICOOB') ||
                     descUpper.includes('BTG') ||
                     descUpper.includes('EMPRESTIMO') ||
                     descUpper.includes('AMORTIZACAO') ||
                     descUpper.includes('AMORTIZ');

    const item = {
      idx: idx + 1,
      id: l.id,
      data: l.data_lancamento,
      tipo: l.tipo,
      valor: val,
      categoria: l.categoria || '-',
      subcategoria: l.subcategoria || '-',
      descricao: l.descricao,
      banco: l.banco || '-'
    };

    if (isTransf) {
      listTransf.push(item);
    } else {
      listOutros.push(item);
    }

    console.log(
      `[${String(idx + 1).padStart(2)}] ${l.data_lancamento} | ${l.tipo.toUpperCase().padEnd(7)} | ` +
      `R$ ${val.toFixed(2).padStart(9)} | Cat: ${(l.categoria || '-').padEnd(12)} | ` +
      `Sub: ${(l.subcategoria || '-').padEnd(25)} | ${l.descricao}`
    );
  });

  console.log('\n=============================================');
  console.log(`TOTAL REGISTROS: ${lancs.length}`);
  console.log(`Total Receitas: R$ ${totalRec.toFixed(2)}`);
  console.log(`Total Despesas: R$ ${totalDesp.toFixed(2)}`);
  console.log(`Saldo Operacional / Sobra: R$ ${(totalRec - totalDesp).toFixed(2)}`);
  console.log(`\n--- SUSPEITOS DE TRANSFERÊNCIA / NÃO OPERACIONAIS (${listTransf.length} itens) ---`);
  
  let transfRec = 0;
  let transfDesp = 0;
  listTransf.forEach(t => {
    if (t.tipo === 'receita') transfRec += t.valor;
    else transfDesp += t.valor;
    console.log(`[${t.idx}] ${t.data} | ${t.tipo.toUpperCase()} | R$ ${t.valor.toFixed(2)} | ${t.descricao}`);
  });
  console.log(`Total Receitas Transferência/Não-Op: R$ ${transfRec.toFixed(2)}`);
  console.log(`Total Despesas Transferência/Não-Op: R$ ${transfDesp.toFixed(2)}`);

  console.log(`\n--- CENÁRIO SEM ESSAS TRANSFERÊNCIAS ---`);
  const recReal = totalRec - transfRec;
  const despReal = totalDesp - transfDesp;
  console.log(`Receita Operacional Limpa: R$ ${recReal.toFixed(2)}`);
  console.log(`Despesa Operacional Limpa: R$ ${despReal.toFixed(2)}`);
  console.log(`Resultado Operacional Real: R$ ${(recReal - despReal).toFixed(2)}`);
}

run();
