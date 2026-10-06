const { createClient } = require('@supabase/supabase-js');

const url = 'https://eornunjxcmtyrdrihiqk.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0';
const supabase = createClient(url, key);

async function run() {
  const { data: row } = await supabase
    .from('lancamentos')
    .select('*')
    .eq('id', 'a13afbb2-009e-4cd6-9314-9274e85a66bb')
    .single();
  
  console.log('Launch details:', JSON.stringify(row, null, 2));
}

run();
