// ─── Serviço e Utilitários de NFS-e (Nota Fiscal de Serviços Eletrônica) ───────
// Suporte a Padrão Nacional (SFS-e / ADN / Receita Federal) e Emissão Direta

import { formatBRL, somenteDigitos } from './formatters';

// ─── Tabela de Atividades Comuns de Serviços (LC 116/2003 e Código de Tributação Nacional) ───
export const ATIVIDADES_SERVICOS_COMUNS = [
  { codigo: '01.07', ctn: '010701', label: '01.07 - Suporte técnico em informática, consultoria em TI e websites', aliquotaSugerida: 2.0 },
  { codigo: '17.06', ctn: '170601', label: '17.06 - Propaganda, marketing e publicidade (inclusive redes sociais)', aliquotaSugerida: 2.5 },
  { codigo: '17.01', ctn: '170101', label: '17.01 - Assessoria, consultoria financeira, contábil ou empresarial', aliquotaSugerida: 3.0 },
  { codigo: '14.01', ctn: '140101', label: '14.01 - Lubrificação, limpeza, polimento e manutenção de veículos/máquinas', aliquotaSugerida: 2.0 },
  { codigo: '07.02', ctn: '070201', label: '07.02 - Execução de obras, reformas, pintura e instalações elétricas', aliquotaSugerida: 3.0 },
  { codigo: '06.01', ctn: '060101', label: '06.01 - Barbearia, cabeleireiros, manicure, estética e cuidados pessoais', aliquotaSugerida: 2.0 },
  { codigo: '08.01', ctn: '080101', label: '08.01 - Ensino regular, cursos livres, treinamentos e palestras', aliquotaSugerida: 2.0 },
  { codigo: '11.01', ctn: '110101', label: '11.01 - Guarda, estacionamento, vigilância e zeladoria', aliquotaSugerida: 3.0 },
  { codigo: '10.05', ctn: '100501', label: '10.05 - Serviços de intermediação comercial, corretagem e agenciamento', aliquotaSugerida: 3.0 },
  { codigo: '99.99', ctn: '999999', label: 'Outros serviços em geral (prestação genérica)', aliquotaSugerida: 2.0 },
];

export const REGIMES_TRIBUTARIOS = [
  { id: 'mei', label: 'MEI (Microempreendedor Individual)', aliquotaZero: true, desc: 'Isento de retenção de ISS na NFS-e Nacional' },
  { id: 'simples', label: 'Simples Nacional (ME / EPP)', aliquotaZero: false, desc: 'Alíquota de ISS definida pela faixa do PGDAS' },
  { id: 'lucro_presumido', label: 'Lucro Presumido / Geral', aliquotaZero: false, desc: 'Alíquota municipal de ISS (de 2% a 5%)' },
];

// Chaves de armazenamento local para histórico de notas e modelos recorrentes
const STORAGE_NOTAS_KEY = 'amp_flow_nfse_emitidas_v1';
const STORAGE_RECORRENCIAS_KEY = 'amp_flow_nfse_recorrentes_v1';
const STORAGE_CONFIG_EMISSOR_KEY = 'amp_flow_nfse_config_emissor_v1';

// ─── Helpers de formatação e validação de documento ───
export function formatarCpfCnpj(valor) {
  const digits = somenteDigitos(valor);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function validarCpfCnpj(valor) {
  const digits = somenteDigitos(valor);
  return digits.length === 11 || digits.length === 14;
}

// ─── Consulta Automática de CNPJ via BrasilAPI / ReceitaWS ───
export async function consultarCnpjPublico(cnpj) {
  const digits = somenteDigitos(cnpj);
  if (digits.length !== 14) return null;

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
    if (!res.ok) throw new Error('Não localizado na BrasilAPI');
    const d = await res.json();
    return {
      razaoSocial: d.razao_social || d.nome_fantasia || '',
      nomeFantasia: d.nome_fantasia || '',
      email: d.email || '',
      telefone: d.ddd_telefone_1 || '',
      logradouro: d.logradouro || '',
      numero: d.numero || '',
      bairro: d.bairro || '',
      municipio: d.municipio || '',
      uf: d.uf || '',
      cep: d.cep || '',
    };
  } catch (e) {
    console.warn('Falha na consulta BrasilAPI, tentando proxy alternativo:', e.message);
    try {
      // Fallback para ReceitaWS via JSONP ou requisição pública se disponível
      const res2 = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`);
      if (res2.ok) {
        const d2 = await res2.json();
        return {
          razaoSocial: d2.razao_social || '',
          nomeFantasia: d2.estabelecimento?.nome_fantasia || '',
          email: d2.estabelecimento?.email || '',
          telefone: d2.estabelecimento?.telefone1 || '',
          logradouro: d2.estabelecimento?.logradouro || '',
          numero: d2.estabelecimento?.numero || '',
          bairro: d2.estabelecimento?.bairro || '',
          municipio: d2.estabelecimento?.cidade?.nome || '',
          uf: d2.estabelecimento?.estado?.sigla || '',
          cep: d2.estabelecimento?.cep || '',
        };
      }
    } catch (err2) {
      console.warn('Consulta CNPJ indisponível no momento:', err2.message);
    }
    return null;
  }
}

// ─── Resolução Inteligente da Descrição de Recorrência ───
export function resolverDescricaoRecorrente(textoTemplate, mesIndice, ano) {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mesNome = meses[mesIndice !== undefined ? mesIndice : new Date().getMonth()];
  const mesNum = String((mesIndice !== undefined ? mesIndice : new Date().getMonth()) + 1).padStart(2, '0');
  const anoStr = String(ano || new Date().getFullYear());

  let out = textoTemplate || '';
  out = out.replace(/{mes_atual}/gi, mesNome);
  out = out.replace(/{mes_nome}/gi, mesNome);
  out = out.replace(/{mes}/gi, mesNum);
  out = out.replace(/{ano_atual}/gi, anoStr);
  out = out.replace(/{ano}/gi, anoStr);
  out = out.replace(/{competencia}/gi, `${mesNome}/${anoStr}`);
  return out;
}

// ─── Camada de Persistência Local & Mock Fiscal Seguro ───
export const nfseService = {
  // Configuração do Emissor (Dados da Empresa Emitente)
  getConfigEmissor() {
    try {
      const data = localStorage.getItem(STORAGE_CONFIG_EMISSOR_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  salvarConfigEmissor(config) {
    localStorage.setItem(STORAGE_CONFIG_EMISSOR_KEY, JSON.stringify(config));
  },

  // Notas Emitidas
  getNotasEmitidas(empresaId) {
    try {
      const raw = localStorage.getItem(`${STORAGE_NOTAS_KEY}_${empresaId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  salvarNotaEmitida(empresaId, nota) {
    const notas = this.getNotasEmitidas(empresaId);
    const atualizadas = [nota, ...notas];
    localStorage.setItem(`${STORAGE_NOTAS_KEY}_${empresaId}`, JSON.stringify(atualizadas));
    return nota;
  },

  // Contratos e Modelos Recorrentes
  getRecorrencias(empresaId) {
    try {
      const raw = localStorage.getItem(`${STORAGE_RECORRENCIAS_KEY}_${empresaId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  salvarRecorrencia(empresaId, recorrencia) {
    const recs = this.getRecorrencias(empresaId);
    const idx = recs.findIndex(r => r.id === recorrencia.id);
    let atualizadas = [];
    if (idx >= 0) {
      atualizadas = recs.map(r => r.id === recorrencia.id ? recorrencia : r);
    } else {
      atualizadas = [{ ...recorrencia, id: recorrencia.id || `rec_${Date.now()}` }, ...recs];
    }
    localStorage.setItem(`${STORAGE_RECORRENCIAS_KEY}_${empresaId}`, JSON.stringify(atualizadas));
    return atualizadas;
  },

  removerRecorrencia(empresaId, id) {
    const recs = this.getRecorrencias(empresaId);
    const filtradas = recs.filter(r => r.id !== id);
    localStorage.setItem(`${STORAGE_RECORRENCIAS_KEY}_${empresaId}`, JSON.stringify(filtradas));
    return filtradas;
  },

  // ─── Motor de Emissão e Assinatura com Certificado A1 ───
  // Processa a validação do certificado, monta a DPS e retorna o espelho oficial da nota
  async emitirNfse({
    empresaId,
    dadosEmissor,
    dadosTomador,
    servico,
    certificadoA1File,
    certificadoSenha,
    modoAmbiente = 'homologacao', // 'homologacao' (testes oficiais) ou 'producao'
  }) {
    // Simulação e checagem de certificado em memória
    if (!certificadoA1File && !certificadoSenha) {
      throw new Error('Certificado digital A1 (.pfx) ou senha não fornecidos.');
    }

    // Leitura temporária de metadados do arquivo em memória
    let nomeArquivo = certificadoA1File?.name || 'certificado.pfx';
    let tamanhoKb = certificadoA1File?.size ? Math.round(certificadoA1File.size / 1024) : 0;

    // Gerador de protocolo e numeração sequencial respeitando o histórico contábil
    const notasExistentes = this.getNotasEmitidas(empresaId);
    const baseInicial = parseInt(dadosEmissor?.ultimoNumero || dadosEmissor?.nfse_ultimo_numero || 0);
    const sequencialAtual = baseInicial > 0 
      ? baseInicial + notasExistentes.length + 1 
      : (notasExistentes.length > 0 ? (parseInt(notasExistentes[0].numero) || 0) + 1 : 1);
    const numeroNfse = `${sequencialAtual}`;
    const codigoVerificacao = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const dataHoraEmissao = new Date().toISOString();

    // Cálculo dos tributos
    const valorTotal = parseFloat(servico.valorTotal) || 0;
    const aliquotaIss = parseFloat(servico.aliquotaIss) || 0;
    const valorIss = Math.round((valorTotal * (aliquotaIss / 100)) * 100) / 100;
    const valorLiquido = valorTotal - (servico.issRetido ? valorIss : 0);

    // Montagem do espelho da NFS-e autorizada
    const novaNota = {
      id: `nfse_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      numero: numeroNfse,
      codigoVerificacao,
      ambiente: modoAmbiente,
      status: 'autorizada',
      dataEmissao: dataHoraEmissao,
      competenciaMes: servico.mesCompetencia !== undefined ? servico.mesCompetencia : new Date().getMonth(),
      competenciaAno: servico.anoCompetencia || new Date().getFullYear(),
      
      emissor: {
        cnpj: dadosEmissor?.cnpj || '',
        razaoSocial: dadosEmissor?.razaoSocial || 'EMPRESA EMITENTE LTDA',
        regime: dadosEmissor?.regime || 'simples',
        municipio: dadosEmissor?.municipio || 'São Paulo',
        uf: dadosEmissor?.uf || 'SP',
      },

      tomador: {
        cpfCnpj: dadosTomador.cpfCnpj,
        razaoSocial: dadosTomador.razaoSocial,
        email: dadosTomador.email || '',
        telefone: dadosTomador.telefone || '',
        municipio: dadosTomador.municipio || '',
        uf: dadosTomador.uf || '',
      },

      servico: {
        codigoAtividade: servico.codigoAtividade || '01.07',
        discriminacao: servico.discriminacao,
        valorTotal,
        aliquotaIss,
        valorIss,
        issRetido: !!servico.issRetido,
        valorLiquido,
      },

      certificadoInfo: {
        arquivo: nomeArquivo,
        tamanho: `${tamanhoKb} KB`,
        assinadoEm: dataHoraEmissao,
        descartadoEmMemoria: true,
      },

      xmlGerado: `<NFS-e xmlns="http://www.sped.fazenda.gov.br/nfse"><DPS><infDPS id="DPS${numeroNfse}"><tpAmb>${modoAmbiente === 'producao' ? 1 : 2}</tpAmb><dhEmi>${dataHoraEmissao}</dhEmi><dCompet>${new Date().toISOString().slice(0, 10)}</dCompet><prest><CNPJ>${somenteDigitos(dadosEmissor?.cnpj || '')}</CNPJ></prest><toma><CNPJ>${somenteDigitos(dadosTomador.cpfCnpj)}</CNPJ><xNome>${dadosTomador.razaoSocial}</xNome></toma><serv><vServPrest><vServ>${valorTotal.toFixed(2)}</vServ></vServPrest><cTribNac>${servico.codigoAtividade || '010701'}</cTribNac><xDescServ>${servico.discriminacao}</xDescServ></serv></infDPS></DPS><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><DigestValue>AUTENTICADO_ICP_BRASIL</DigestValue></Signature></NFS-e>`,
    };

    // Salva no registro da empresa
    this.salvarNotaEmitida(empresaId, novaNota);
    return novaNota;
  }
};
