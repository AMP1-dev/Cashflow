const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = 'https://eornunjxcmtyrdrihiqk.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0';
const supabase = createClient(url, key);

async function run() {
  const empresaId = 'd89c25f4-3450-4889-b003-8d009fae4890';
  const xmlOficial = fs.readFileSync('NFSe_76_OFICIAL.xml', 'utf8');

  const chaveAcesso = '35463062210682233000175000000000007626098902961575';
  const protocolo = 'NFS35463062210682233000175000000000007626098902961575';
  const dataEmissao = '2026-09-30T19:47:00-03:00';

  const dadosCompletos = {
    id: 'nfse_oficial_76',
    numero: '76',
    chaveAcesso: chaveAcesso,
    protocolo: protocolo,
    dpsNumero: '65',
    serieDps: '70000',
    codigoNbs: '1.1501.30.00',
    codigoTributacaoCompleto: '01.07.01',
    codigoVerificacao: '3546-7601',
    ambiente: 'producao',
    status: 'autorizada',
    dataEmissao: dataEmissao,
    competenciaMes: 8, // Setembro
    competenciaAno: 2026,
    emissor: {
      cnpj: '10682233000175',
      razaoSocial: 'AMP DO BRASIL SOLUCOES ADMINISTRATIVAS E TECNOLOGICAS LTDA',
      municipio: 'Santa Cruz das Palmeiras',
      uf: 'SP',
      endereco: 'RUA DOM BOSCO, 120, VILA GUILHERME ZANATTA',
      cep: '13.652-046',
      codigoIbge: '35.46306',
      telefone: '(19) 99448-7795',
      email: 'atendimento@amp.adm.br'
    },
    tomador: {
      cpfCnpj: '37.967.313/0001-23',
      razaoSocial: 'J P VIEIRA DA DALT LTDA',
      email: 'nfefuturasup@gmail.com',
      telefone: '(32) 99730-215',
      endereco: 'DO CAFE, 438, CENTRO',
      municipio: 'Santa Cruz das Palmeiras',
      uf: 'SP',
      cep: '13.650-013'
    },
    servico: {
      codigoAtividade: '01.07.01',
      discriminacao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados.',
      valorTotal: 177.48,
      aliquotaIss: 2.0,
      valorIss: 3.55,
      issRetido: false,
      valorLiquido: 177.48,
      aliquotaIbs: 0.10,
      valorIbs: 0.18,
      aliquotaCbs: 0.90,
      valorCbs: 1.60,
      aliquotaImpostoTotal: 3.00
    },
    certificadoInfo: {
      arquivo: 'AMP DO BRASIL SOLUCOES ADMINISTRATIVAS E TECNOLOGICAS LTDA.pfx',
      tamanho: '4 KB',
      assinadoEm: dataEmissao,
      transmissaoNativaGov: true
    },
    xmlGerado: xmlOficial
  };

  const payload = {
    empresa_id: empresaId,
    numero: '76',
    chave_acesso: chaveAcesso,
    dps_numero: '65',
    serie_dps: '70000',
    codigo_verificacao: '3546-7601',
    status: 'autorizada',
    ambiente: 'producao',
    data_emissao: dataEmissao,
    competencia_mes: 8,
    competencia_ano: 2026,
    tomador_nome: 'J P VIEIRA DA DALT LTDA',
    tomador_documento: '37.967.313/0001-23',
    tomador_email: 'nfefuturasup@gmail.com',
    tomador_telefone: '(32) 99730-215',
    tomador_municipio: 'Santa Cruz das Palmeiras',
    tomador_uf: 'SP',
    servico_discriminacao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados.',
    servico_codigo_atividade: '01.07',
    servico_codigo_tributacao: '01.07.01',
    servico_codigo_nbs: '1.1501.30.00',
    valor_total: 177.48,
    aliquota_iss: 2.0,
    valor_iss: 3.55,
    iss_retido: false,
    valor_liquido: 177.48,
    aliquota_ibs: 0.10,
    valor_ibs: 0.18,
    aliquota_cbs: 0.90,
    valor_cbs: 1.60,
    aliquota_imposto_total: 3.00,
    dados_completos: dadosCompletos
  };

  await supabase.from('nfse_notas').delete().match({ empresa_id: empresaId, numero: '76' });
  const { data, error } = await supabase.from('nfse_notas').insert(payload);
  console.log('Insert result:', { error });
  if (!error) {
    console.log('✅ Nota 76 persistida com sucesso no Supabase com protocolo oficial da Receita Federal!');
  }
}

run();
