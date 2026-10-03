import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, KeyRound, Search, CheckCircle, AlertTriangle, 
  HelpCircle, RefreshCw, Calendar, ArrowRight, UserCheck, X, Upload 
} from 'lucide-react';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';
import { formatBRL, somenteDigitos } from '../utils/formatters';
import { 
  ATIVIDADES_SERVICOS_COMUNS, REGIMES_TRIBUTARIOS, formatarCpfCnpj, 
  validarCpfCnpj, consultarCnpjPublico, resolverDescricaoRecorrente, nfseService,
  consultarStatusCertificado, salvarClienteCatalogo, obterClienteCatalogo,
  salvarClienteNuvem, obterClienteNuvem 
} from '../utils/nfseService';
import { supabase } from '../lib/supabase';
import { MESES } from '../utils/constants';

export function EmitirNfseModal({ 
  empresa, 
  mesAtual, 
  anoAtual, 
  dadosIniciais = null, // se vier de uma receita ou de uma recorrência
  onClose, 
  onSucesso 
}) {
  const isEdicao = Boolean(dadosIniciais?.isEdicao);
  const isSubstituicao = Boolean(dadosIniciais?.isSubstituicao);
  const numeroSubstituida = dadosIniciais?.numeroSubstituida;
  const numeroAlvo = dadosIniciais?.numeroPersonalizado || dadosIniciais?.numero;
  const isOficializandoExistente = Boolean(numeroAlvo) && !isEdicao && !isSubstituicao;

  // Memória e Catálogo do Cliente
  const clienteInicial = dadosIniciais?.cpfCnpj ? obterClienteCatalogo(dadosIniciais.cpfCnpj) : null;

  // Dados do Tomador (Cliente)
  const [cpfCnpj, setCpfCnpj] = useState(dadosIniciais?.cpfCnpj || '');
  const [razaoSocial, setRazaoSocial] = useState(dadosIniciais?.razaoSocial || dadosIniciais?.cliente || clienteInicial?.razaoSocial || '');
  const [emailTomador, setEmailTomador] = useState(dadosIniciais?.email || clienteInicial?.email || '');
  const [telefoneTomador, setTelefoneTomador] = useState(dadosIniciais?.telefone || clienteInicial?.telefone || '');
  const [municipioTomador, setMunicipioTomador] = useState(dadosIniciais?.municipio || clienteInicial?.municipio || '');
  const [ufTomador, setUfTomador] = useState(dadosIniciais?.uf || clienteInicial?.uf || '');
  const [logradouroTomador, setLogradouroTomador] = useState(dadosIniciais?.logradouro || dadosIniciais?.endereco || clienteInicial?.logradouro || clienteInicial?.endereco || '');
  const [numeroTomador, setNumeroTomador] = useState(dadosIniciais?.numeroEnd || dadosIniciais?.numero || clienteInicial?.numero || '');
  const [bairroTomador, setBairroTomador] = useState(dadosIniciais?.bairro || clienteInicial?.bairro || '');
  const [cepTomador, setCepTomador] = useState(dadosIniciais?.cep || clienteInicial?.cep || '');
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);
  const [clienteGravado, setClienteGravado] = useState(Boolean(clienteInicial));

  // Dados do Serviço
  const [valorTotal, setValorTotal] = useState(dadosIniciais?.valor ? String(dadosIniciais.valor).replace('.', ',') : '');
  const [discriminacao, setDiscriminacao] = useState(dadosIniciais?.discriminacao || dadosIniciais?.descricao || '');
  const [codigoAtividade, setCodigoAtividade] = useState('01.07');
  const [aliquotaIss, setAliquotaIss] = useState('2,0');
  const [issRetido, setIssRetido] = useState(false);
  const [mesCompetencia, setMesCompetencia] = useState(dadosIniciais?.mesCompetencia !== undefined ? dadosIniciais.mesCompetencia : mesAtual);

  // Recorrência
  const [salvarComoRecorrente, setSalvarComoRecorrente] = useState(false);
  const [diaVencimentoRecorrente, setDiaVencimentoRecorrente] = useState(10);

  // Certificado Digital A1 Temporário ou Conectado
  const [certArquivo, setCertArquivo] = useState(null);
  const [certSenha, setCertSenha] = useState('');
  const [lembrarCertSessao, setLembrarCertSessao] = useState(true);
  const [certStatus, setCertStatus] = useState(null);
  const [mostrarCamposCert, setMostrarCamposCert] = useState(false);

  useEffect(() => {
    async function carregarCert() {
      try {
        const s = await consultarStatusCertificado(empresa?.id);
        if (s && s.hasCert) {
          setCertStatus(s);
        }
      } catch (e) {
        console.warn('Erro ao verificar certificado:', e);
      }
    }
    carregarCert();
  }, [empresa?.id]);

  // Emissão & Feedback
  const [modoAmbiente, setModoAmbiente] = useState('producao');
  const [emitindo, setEmitindo] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');

  // Ao alterar a atividade sugerida, atualiza alíquota
  function handleMudarAtividade(cod) {
    setCodigoAtividade(cod);
    const ativ = ATIVIDADES_SERVICOS_COMUNS.find(a => a.codigo === cod);
    if (ativ) {
      setAliquotaIss(String(ativ.aliquotaSugerida).replace('.', ','));
    }
  }

  // Busca cadastral inteligente via CNPJ
  async function handleBuscarCnpj() {
    const limpo = somenteDigitos(cpfCnpj);
    if (limpo.length !== 14) {
      alert('Digite um CNPJ válido com 14 dígitos para consultar.');
      return;
    }
    setBuscandoCnpj(true);
    setErroValidacao('');
    try {
      const dados = await consultarCnpjPublico(limpo, empresa?.id);
      if (dados && dados.razaoSocial) {
        setRazaoSocial(dados.razaoSocial);
        if (dados.email && !emailTomador) setEmailTomador(dados.email);
        if (dados.telefone && !telefoneTomador) setTelefoneTomador(dados.telefone);
        if (dados.municipio) setMunicipioTomador(dados.municipio);
        if (dados.uf) setUfTomador(dados.uf);
        if (dados.logradouro) setLogradouroTomador(dados.logradouro);
        if (dados.numero) setNumeroTomador(dados.numero);
        if (dados.bairro) setBairroTomador(dados.bairro);
        if (dados.cep) setCepTomador(dados.cep);
        setClienteGravado(true);
      } else {
        alert('CNPJ não localizado automaticamente. Por favor, preencha a Razão Social manualmente.');
      }
    } catch (err) {
      alert('Não foi possível consultar os dados do CNPJ no momento: ' + err.message);
    } finally {
      setBuscandoCnpj(false);
    }
  }

  // Preenchimento automático ao digitar CPF ou CNPJ (Híbrido: Memória Local + Nuvem Supabase)
  useEffect(() => {
    let ativo = true;
    const limpo = somenteDigitos(cpfCnpj);
    if (limpo.length === 11 || limpo.length === 14) {
      // 1. Verificação instantânea local
      const cliLocal = obterClienteCatalogo(limpo);
      if (cliLocal) {
        setClienteGravado(true);
        if (!razaoSocial && cliLocal.razaoSocial) setRazaoSocial(cliLocal.razaoSocial);
        if (!emailTomador && cliLocal.email) setEmailTomador(cliLocal.email);
        if (!telefoneTomador && cliLocal.telefone) setTelefoneTomador(cliLocal.telefone);
        if (!municipioTomador && cliLocal.municipio) setMunicipioTomador(cliLocal.municipio);
        if (!ufTomador && cliLocal.uf) setUfTomador(cliLocal.uf);
        if (!logradouroTomador && (cliLocal.logradouro || cliLocal.endereco)) setLogradouroTomador(cliLocal.logradouro || cliLocal.endereco);
        if (!numeroTomador && cliLocal.numero) setNumeroTomador(cliLocal.numero);
        if (!bairroTomador && cliLocal.bairro) setBairroTomador(cliLocal.bairro);
        if (!cepTomador && cliLocal.cep) setCepTomador(cliLocal.cep);
      }

      // 2. Sincronização da nuvem Supabase (recupera dados mesmo em outro navegador / computador)
      if (empresa?.id) {
        obterClienteNuvem(limpo, empresa.id).then(cliNuvem => {
          if (!ativo || !cliNuvem) return;
          setClienteGravado(true);
          if (cliNuvem.razaoSocial) setRazaoSocial(prev => prev || cliNuvem.razaoSocial);
          if (cliNuvem.email) setEmailTomador(prev => prev || cliNuvem.email);
          if (cliNuvem.telefone) setTelefoneTomador(prev => prev || cliNuvem.telefone);
          if (cliNuvem.municipio) setMunicipioTomador(prev => prev || cliNuvem.municipio);
          if (cliNuvem.uf) setUfTomador(prev => prev || cliNuvem.uf);
          if (cliNuvem.logradouro) setLogradouroTomador(prev => prev || cliNuvem.logradouro);
          if (cliNuvem.numero) setNumeroTomador(prev => prev || cliNuvem.numero);
          if (cliNuvem.bairro) setBairroTomador(prev => prev || cliNuvem.bairro);
          if (cliNuvem.cep) setCepTomador(prev => prev || cliNuvem.cep);
        }).catch(() => {});
      }
    }
    return () => { ativo = false; };
  }, [cpfCnpj, empresa?.id]);

  // Função para salvar imediatamente o cliente no catálogo de contatos (Local + Nuvem Supabase)
  function salvarDadosClienteCatalogo(novos = {}) {
    const doc = somenteDigitos(cpfCnpj);
    if (!doc) return;
    salvarClienteNuvem({
      cpfCnpj: doc,
      razaoSocial: novos.razaoSocial !== undefined ? novos.razaoSocial : razaoSocial,
      email: novos.email !== undefined ? novos.email : emailTomador,
      telefone: novos.telefone !== undefined ? novos.telefone : telefoneTomador,
      municipio: novos.municipio !== undefined ? novos.municipio : municipioTomador,
      uf: novos.uf !== undefined ? novos.uf : ufTomador,
      logradouro: novos.logradouro !== undefined ? novos.logradouro : logradouroTomador,
      numero: novos.numero !== undefined ? novos.numero : numeroTomador,
      bairro: novos.bairro !== undefined ? novos.bairro : bairroTomador,
      cep: novos.cep !== undefined ? novos.cep : cepTomador,
    }, empresa?.id);
    setClienteGravado(true);
  }

  // Salvar Alterações da Nota em Modo Edição (Atualiza NFS-e e Lançamento Financeiro)
  async function handleSalvarEdicao() {
    setErroValidacao('');

    if (!razaoSocial.trim()) {
      setErroValidacao('Informe o Nome ou Razão Social do cliente.');
      return;
    }
    const vTotalNum = parseFloat((valorTotal || '0').replace(',', '.'));
    if (vTotalNum <= 0) {
      setErroValidacao('Informe o valor total do serviço.');
      return;
    }
    if (!discriminacao.trim()) {
      setErroValidacao('Descreva os serviços prestados.');
      return;
    }

    setEmitindo(true);

    try {
      const descResolvida = resolverDescricaoRecorrente(discriminacao, mesCompetencia, anoAtual);

      // 1. Atualiza na camada NFS-e (mapaNotas, localStorage e Supabase nfse_notas)
      const notaAtualizada = await nfseService.atualizarNota(empresa.id, numeroAlvo, {
        tomador: {
          cpfCnpj: somenteDigitos(cpfCnpj),
          razaoSocial: razaoSocial.trim(),
          email: emailTomador.trim(),
          telefone: telefoneTomador.trim(),
          municipio: municipioTomador.trim(),
          uf: ufTomador.trim(),
          logradouro: logradouroTomador.trim(),
          numero: numeroTomador.trim(),
          bairro: bairroTomador.trim(),
          cep: cepTomador.trim(),
        },
        servico: {
          codigoAtividade,
          discriminacao: descResolvida,
          valorTotal: vTotalNum,
          aliquotaIss: parseFloat((aliquotaIss || '0').replace(',', '.')),
          issRetido,
          mesCompetencia,
          anoCompetencia: anoAtual,
        },
        recorrente: Boolean(salvarComoRecorrente),
        diaVencimento: salvarComoRecorrente ? diaVencimentoRecorrente : null,
      });

      // 2. Salva no catálogo de clientes
      salvarDadosClienteCatalogo();

      // 3. Se optou por salvar como modelo recorrente
      if (salvarComoRecorrente) {
        nfseService.salvarRecorrencia(empresa.id, {
          cliente: razaoSocial.trim(),
          cpfCnpj: somenteDigitos(cpfCnpj),
          email: emailTomador.trim(),
          telefone: telefoneTomador.trim(),
          valor: vTotalNum,
          diaVencimento: diaVencimentoRecorrente,
          codigoAtividade,
          aliquotaIss: parseFloat((aliquotaIss || '0').replace(',', '.')),
          discriminacaoTemplate: discriminacao,
          ativo: true,
        });
      }

      // 3. Atualiza o lançamento correspondente no Supabase na tabela public.lancamentos
      const novaDescricaoLancamento = `NFS-e Nº ${numeroAlvo} - ${razaoSocial.trim()}${descResolvida ? ` (${descResolvida})` : ''}`;
      try {
        if (dadosIniciais?.lancamentoId) {
          await supabase
            .from('lancamentos')
            .update({
              valor: vTotalNum,
              descricao: novaDescricaoLancamento,
              atualizado_em: new Date().toISOString()
            })
            .eq('id', dadosIniciais.lancamentoId);
        } else {
          // Busca o lançamento por número da nota
          const { data: lancs } = await supabase
            .from('lancamentos')
            .select('id')
            .eq('empresa_id', empresa.id)
            .ilike('descricao', `NFS-e Nº ${numeroAlvo}%`);
          
          if (lancs && lancs.length > 0) {
            await supabase
              .from('lancamentos')
              .update({
                valor: vTotalNum,
                descricao: novaDescricaoLancamento,
                atualizado_em: new Date().toISOString()
              })
              .eq('id', lancs[0].id);
          }
        }
      } catch (errLanc) {
        console.warn('Falha ao atualizar lançamento no Supabase:', errLanc);
      }

      onSucesso(notaAtualizada, {
        isEdicao: true,
        descricao: descResolvida,
        valor: vTotalNum,
        mes: mesCompetencia,
        dia: new Date().getDate(),
        tomador: razaoSocial.trim(),
        numeroNota: numeroAlvo
      });
    } catch (err) {
      setErroValidacao('Erro ao salvar alterações da nota: ' + (err.message || 'Falha ao processar.'));
    } finally {
      setEmitindo(false);
    }
  }

  // Submissão da Nota (Nova Emissão ou Oficialização)
  async function handleEmitir() {
    setErroValidacao('');

    if (!validarCpfCnpj(cpfCnpj)) {
      setErroValidacao('Informe um CPF ou CNPJ válido para o cliente.');
      return;
    }
    if (!razaoSocial.trim()) {
      setErroValidacao('Informe o Nome ou Razão Social do cliente.');
      return;
    }
    const vTotalNum = parseFloat((valorTotal || '0').replace(',', '.'));
    if (vTotalNum <= 0) {
      setErroValidacao('Informe o valor total do serviço.');
      return;
    }
    if (!discriminacao.trim()) {
      setErroValidacao('Descreva os serviços prestados.');
      return;
    }
    if (!certStatus?.hasCert && !certSenha.trim()) {
      setErroValidacao('Digite a senha do certificado digital A1.');
      return;
    }

    setEmitindo(true);

    try {
      // 1. Resolve variáveis de mês de competência na descrição se houver
      const descResolvida = resolverDescricaoRecorrente(discriminacao, mesCompetencia, anoAtual);

      // Salva cliente no catálogo local
      salvarDadosClienteCatalogo();

      // 2. Dispara a emissão oficial via serviço NFS-e
      const notaEmitida = await nfseService.emitirNfse({
        empresaId: empresa.id,
        dadosEmissor: {
          cnpj: empresa.cnpj || empresa.cpf_titular || '00000000000000',
          razaoSocial: empresa.razao_social || empresa.nome_fantasia || empresa.fantasia || 'Empresa Prestadora',
          regime: 'simples',
          municipio: empresa.municipio || 'Santa Cruz das Palmeiras',
          uf: empresa.uf || 'SP',
          ultimoNumero: maiorNumeroExistente,
          numeroPersonalizado: dadosIniciais?.numeroPersonalizado || dadosIniciais?.numero || undefined,
        },
        dadosTomador: {
          cpfCnpj: somenteDigitos(cpfCnpj),
          razaoSocial: razaoSocial.trim(),
          email: emailTomador.trim(),
          telefone: telefoneTomador.trim(),
          municipio: municipioTomador.trim(),
          uf: ufTomador.trim(),
          logradouro: logradouroTomador.trim(),
          numero: numeroTomador.trim(),
          bairro: bairroTomador.trim(),
          cep: cepTomador.trim(),
        },
        servico: {
          codigoAtividade,
          discriminacao: descResolvida,
          valorTotal: vTotalNum,
          aliquotaIss: parseFloat((aliquotaIss || '0').replace(',', '.')),
          issRetido,
          mesCompetencia,
          anoCompetencia: anoAtual,
        },
        certificadoA1File: certArquivo,
        certificadoSenha: certSenha,
        modoAmbiente, // 'producao' oficial ou 'homologacao'
      });

      // 3. Se optou por salvar como modelo recorrente
      if (salvarComoRecorrente) {
        notaEmitida.recorrente = true;
        notaEmitida.diaVencimento = diaVencimentoRecorrente;
        nfseService.salvarNotaEmitida(empresa.id, notaEmitida);
        nfseService.salvarRecorrencia(empresa.id, {
          cliente: razaoSocial.trim(),
          cpfCnpj: somenteDigitos(cpfCnpj),
          email: emailTomador.trim(),
          telefone: telefoneTomador.trim(),
          valor: vTotalNum,
          diaVencimento: diaVencimentoRecorrente,
          codigoAtividade,
          aliquotaIss: parseFloat((aliquotaIss || '0').replace(',', '.')),
          discriminacaoTemplate: discriminacao, // mantém {mes_atual} para os próximos meses
          ativo: true,
        });
      }

      // 4. Se for substituição de nota fiscal anterior
      if (isSubstituicao && numeroSubstituida) {
        notaEmitida.substituiNota = String(numeroSubstituida);
        await nfseService.substituirNota(empresa.id, numeroSubstituida, notaEmitida.numero);
        nfseService.salvarNotaEmitida(empresa.id, notaEmitida);
      }

      onSucesso(notaEmitida, {
        descricao: descResolvida,
        valor: vTotalNum,
        mes: mesCompetencia,
        dia: new Date().getDate(),
        tomador: razaoSocial.trim(),
        numeroNota: notaEmitida.numero
      });
    } catch (err) {
      setErroValidacao('Erro na autorização da nota: ' + (err.message || 'Falha na comunicação com o portal emissor.'));
    } finally {
      setEmitindo(false);
    }
  }

  const vNum = parseFloat((valorTotal || '0').replace(',', '.')) || 0;
  const aliqNum = parseFloat((aliquotaIss || '0').replace(',', '.')) || 0;
  const issPrevisto = Math.round((vNum * (aliqNum / 100)) * 100) / 100;

  // Numeração sequencial contábil contínua
  const baseConfigurada = parseInt(
    empresa?.nfse_ultimo_numero ?? 
    localStorage.getItem(`amp_nfse_ultimo_numero_${empresa?.id}`) ?? 
    75
  );
  const notasExistentes = empresa?.id ? nfseService.getNotasEmitidas(empresa.id) : [];
  let maiorNumeroExistente = isNaN(baseConfigurada) ? 0 : baseConfigurada;
  notasExistentes.forEach(n => {
    const num = parseInt(n.numero);
    if (!isNaN(num) && num >= maiorNumeroExistente) {
      maiorNumeroExistente = num;
    }
  });
  const proximoNumeroSugerido = maiorNumeroExistente + 1;

  return (
    <ModalShell 
      onClose={onClose} 
      titulo={isEdicao 
        ? `Editar NFS-e Nº ${numeroAlvo}` 
        : (isOficializandoExistente ? `Oficializar NFS-e Nº ${numeroAlvo} na Receita Federal` : "Emitir Nota Fiscal de Serviços (NFS-e)")}
    >
      <div style={{ maxHeight: '78vh', overflowY: 'auto', paddingRight: 4 }}>
        
        {/* Banner Informativo */}
        <div style={{
          background: isEdicao 
            ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
            : (isOficializandoExistente 
                ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
                : 'linear-gradient(135deg, #EAF4F1 0%, #DDF0EA 100%)'),
          borderRadius: 12,
          padding: '12px 14px',
          border: isEdicao ? '1px solid #93C5FD' : (isOficializandoExistente ? '1px solid #F59E0B' : '1px solid #B8DDD2'),
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <ShieldCheck size={26} color={isEdicao ? "#2563EB" : (isOficializandoExistente ? "#B45309" : "#1F5C52")} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isEdicao ? '#1E40AF' : (isSubstituicao ? '#991B1B' : (isOficializandoExistente ? '#92400E' : '#0F2B27')) }}>
                {isEdicao 
                  ? `Edição dos Dados da NFS-e Nº ${numeroAlvo}`
                  : (isSubstituicao 
                      ? `Substituição da NFS-e Nº ${numeroSubstituida}`
                      : (isOficializandoExistente ? `Validação Oficial da Nota Nº ${numeroAlvo}` : 'Emissão Direta Padrão Nacional NFS-e'))}
              </div>
              <div style={{ fontSize: 11, color: isEdicao ? '#1E3A8A' : (isSubstituicao ? '#991B1B' : (isOficializandoExistente ? '#78350F' : '#2C5A51')), marginTop: 1 }}>
                {isEdicao 
                  ? 'Altere o valor, dados do cliente ou discriminação. Ao salvar, a nota e o lançamento financeiro no caixa serão atualizados.'
                  : (isSubstituicao 
                      ? `Esta emissão irá gerar uma nova NFS-e oficial vinculada e cancelará/substituirá a nota Nº ${numeroSubstituida}.`
                      : (isOficializandoExistente 
                          ? 'Esta nota será assinada e transmitida à SEFIN Nacional, substituindo o rascunho sem duplicar o caixa.'
                          : <>Última nota contábil: <strong>Nº {maiorNumeroExistente}</strong></>))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', background: '#fff', border: isEdicao ? '1px solid #93C5FD' : (isSubstituicao ? '1px solid #FCA5A5' : (isOficializandoExistente ? '1px solid #F59E0B' : '1px solid #B8DDD2')), borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#5C5A4F', textTransform: 'uppercase' }}>
              {isEdicao ? 'Modo Edição' : (isSubstituicao ? 'Substituta' : (isOficializandoExistente ? 'Número da Nota' : 'Próxima Nota'))}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: isEdicao ? '#2563EB' : (isSubstituicao ? '#DC2626' : (isOficializandoExistente ? '#B45309' : '#1F5C52')), fontFamily: 'monospace' }}>
              Nº {isEdicao || isOficializandoExistente ? numeroAlvo : proximoNumeroSugerido}
            </div>
          </div>
        </div>

        {/* Seletor de Ambiente: Produção Oficial vs Homologação (Oculto em modo edição) */}
        {!isEdicao && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8F6F0', borderRadius: 10, border: '1px solid #E5E0D5', marginBottom: 14 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1C2421' }}>Ambiente Fiscal:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => setModoAmbiente('producao')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: modoAmbiente === 'producao' ? '#1F5C52' : '#E5E0D5',
                  color: modoAmbiente === 'producao' ? '#fff' : '#5C5A4F',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🟢 Produção (Oficial)
              </button>
              <button
                type="button"
                onClick={() => setModoAmbiente('homologacao')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: modoAmbiente === 'homologacao' ? '#8A6D1A' : '#E5E0D5',
                  color: modoAmbiente === 'homologacao' ? '#fff' : '#5C5A4F',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🟡 Homologação (Testes)
              </button>
            </div>
          </div>
        )}

        {erroValidacao && (
          <div style={{
            background: '#FDF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 14,
            fontSize: 12,
            color: '#B91C1C',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{erroValidacao}</span>
          </div>
        )}

        {/* ── 1. DADOS DO CLIENTE / TOMADOR ── */}
        <div style={{ background: '#fff', border: '1px solid #E5E0D5', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1F5C52', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={15} /> 1. Dados do Cliente (Tomador)
            </div>
            {clienteGravado && (
              <span style={{ fontSize: 10.5, color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={11} /> Cliente Salvo no Banco (Nuvem)
              </span>
            )}
          </div>

          <FieldLabel>CPF ou CNPJ do Cliente</FieldLabel>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                value={formatarCpfCnpj(cpfCnpj)}
                onChange={e => setCpfCnpj(e.target.value)}
                placeholder="00.000.000/0000-00 ou 000.000.000-00"
                style={inputStyle}
              />
            </div>
            {somenteDigitos(cpfCnpj).length === 14 && (
              <button
                type="button"
                onClick={handleBuscarCnpj}
                disabled={buscandoCnpj}
                style={{
                  background: '#1F5C52',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 9,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap'
                }}
              >
                {buscandoCnpj ? <RefreshCw size={13} className="animate-spin" /> : <Search size={13} />}
                {buscandoCnpj ? 'Buscando...' : 'Buscar Dados'}
              </button>
            )}
          </div>

          <div style={{ marginTop: 10 }}>
            <FieldLabel>Razão Social / Nome do Cliente</FieldLabel>
            <input
              value={razaoSocial}
              onChange={e => {
                setRazaoSocial(e.target.value);
                salvarDadosClienteCatalogo({ razaoSocial: e.target.value });
              }}
              placeholder="Ex: Consultoria ABC Ltda ou João da Silva"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div>
              <FieldLabel>E-mail</FieldLabel>
              <input
                value={emailTomador}
                onChange={e => {
                  setEmailTomador(e.target.value);
                  salvarDadosClienteCatalogo({ email: e.target.value });
                }}
                placeholder="financeiro@cliente.com.br"
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Telefone / WhatsApp</FieldLabel>
              <input
                value={telefoneTomador}
                onChange={e => {
                  setTelefoneTomador(e.target.value);
                  salvarDadosClienteCatalogo({ telefone: e.target.value });
                }}
                placeholder="(11) 99999-9999"
                style={inputStyle}
              />
            </div>
          </div>

          {(logradouroTomador || municipioTomador) && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#F8F6F0', borderRadius: 8, border: '1px solid #E5E0D5', fontSize: 11, color: '#5C5A4F' }}>
              📍 <strong>Endereço Fiscal:</strong> {logradouroTomador}{numeroTomador ? `, ${numeroTomador}` : ''} {bairroTomador ? `- ${bairroTomador}` : ''} {municipioTomador ? `| ${municipioTomador}/${ufTomador}` : ''} {cepTomador ? `(CEP: ${cepTomador})` : ''}
            </div>
          )}
        </div>

        {/* ── 2. DADOS DO SERVIÇO & VALOR TOTAL ── */}
        <div style={{ background: '#fff', border: '1px solid #E5E0D5', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1F5C52', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={15} /> 2. Serviço & Valor Total
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
            <div>
              <FieldLabel>Valor Total</FieldLabel>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: '#1F5C52' }}>R$</span>
                <input
                  value={valorTotal}
                  onChange={e => setValorTotal(e.target.value)}
                  placeholder="0,00"
                  inputMode="decimal"
                  style={{ ...inputStyle, paddingLeft: 38, fontSize: 16, fontWeight: 700, color: '#0F2B27' }}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Mês de Competência</FieldLabel>
              <select
                value={mesCompetencia}
                onChange={e => setMesCompetencia(parseInt(e.target.value))}
                style={inputStyle}
              >
                {MESES.map((nome, idx) => (
                  <option key={idx} value={idx}>{nome} / {anoAtual}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <FieldLabel>Atividade / Código de Tributação</FieldLabel>
            <select
              value={codigoAtividade}
              onChange={e => handleMudarAtividade(e.target.value)}
              style={{ ...inputStyle, fontSize: 12.5 }}
            >
              {ATIVIDADES_SERVICOS_COMUNS.map(ativ => (
                <option key={ativ.codigo} value={ativ.codigo}>{ativ.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FieldLabel>Discriminação do Serviço Prestado</FieldLabel>
              <span style={{ fontSize: 10.5, color: '#7A7868' }}>Dica: use <strong>{'{mes_atual}'}</strong> para recorrência</span>
            </div>
            <textarea
              rows={3}
              value={discriminacao}
              onChange={e => setDiscriminacao(e.target.value)}
              placeholder="Ex: Prestação de serviços de assessoria e suporte referente ao mês de {mes_atual}/{ano_atual}."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.4 }}
            />
          </div>

          {/* Mini resumo tributário */}
          <div style={{ marginTop: 10, background: '#F8F6F1', borderRadius: 8, padding: '10px 12px', fontSize: 11.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
              <span style={{ color: '#5C5A4F' }}>
                Alíquota ISS: <strong>{aliquotaIss}%</strong> • ISS Calculado: <strong>{formatBRL(issPrevisto)}</strong>
              </span>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#1C2421', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={issRetido}
                  onChange={e => setIssRetido(e.target.checked)}
                  style={{ accentColor: '#1F5C52', width: 16, height: 16 }}
                />
                ISS Retido pelo Tomador (Cliente)?
              </label>
            </div>
            <div style={{ fontSize: 10.5, color: issRetido ? '#B91C1C' : '#15803D', fontWeight: 600 }}>
              {issRetido 
                ? '⚠️ Atenção: ISS Retido marcado. O cliente descontará ' + formatBRL(issPrevisto) + ' do pagamento e recolherá a guia para a Prefeitura (Valor Líquido a receber: ' + formatBRL(vNum - issPrevisto) + ').'
                : '✓ Não Retido: Você mesmo quem recolhe no Simples Nacional (DAS). O cliente pagará o valor integral de ' + formatBRL(vNum) + '.'}
            </div>
          </div>
        </div>

        {/* ── 3. OPÇÃO DE RECORRÊNCIA INTELIGENTE ── */}
        <div style={{ background: '#FFFDF9', border: '1px solid #EFECE6', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={16} color="#8A6D1A" />
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1C2421' }}>Salvar como Nota Recorrente Mensal?</span>
                <div style={{ fontSize: 10.5, color: '#7A7868' }}>Aparecerá todo mês na sua lista para emissão em 1 clique</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={salvarComoRecorrente}
              onChange={e => setSalvarComoRecorrente(e.target.checked)}
              style={{ accentColor: '#8A6D1A', width: 17, height: 17 }}
            />
          </label>

          {salvarComoRecorrente && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed #E5E0D5', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11.5, color: '#5C5A4F' }}>Dia preferencial do vencimento:</span>
              <select
                value={diaVencimentoRecorrente}
                onChange={e => setDiaVencimentoRecorrente(parseInt(e.target.value))}
                style={{ ...inputStyle, width: 'auto', padding: '4px 8px', fontSize: 12 }}
              >
                {[1, 5, 10, 15, 20, 25, 28].map(d => (
                  <option key={d} value={d}>Dia {d}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ── 4. CERTIFICADO DIGITAL A1 (TRANSMISSÃO GOV OFICIAL) ── */}
        {isEdicao ? (
          <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={22} color="#16A34A" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#166534' }}>
                Modo Edição de Cadastro e Lançamento
              </div>
              <div style={{ fontSize: 11, color: '#15803D', marginTop: 2 }}>
                Não é exigida senha do certificado digital para salvar correções de valor, cliente ou discriminação nesta nota fiscal.
              </div>
            </div>
          </div>
        ) : certStatus?.hasCert && !mostrarCamposCert ? (
          <div style={{ background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={22} color="#059669" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>
                    Certificado A1 Conectado & Ativo
                  </div>
                  <div style={{ fontSize: 11, color: '#047857' }}>
                    {certStatus.razaoSocial} • Válido até {new Date(certStatus.validoAte).toLocaleDateString('pt-BR')}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#059669', fontWeight: 600, marginTop: 2 }}>
                    ✓ Emissão oficial direta com a SEFIN Nacional / Receita Federal em 1 clique (Desktop & Mobile)
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMostrarCamposCert(true)}
                style={{
                  fontSize: 11,
                  color: '#047857',
                  background: '#fff',
                  border: '1px solid #A7F3D0',
                  padding: '5px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Alterar Certificado
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FAF8F3', border: '1.5px solid #1F5C52', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1F5C52', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                <KeyRound size={15} /> 4. Assinatura com Certificado A1 (.pfx)
              </div>
              {certStatus?.hasCert && (
                <button
                  type="button"
                  onClick={() => setMostrarCamposCert(false)}
                  style={{ fontSize: 11, color: '#1F5C52', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Voltar ao certificado ativo
                </button>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#5C5A4F', marginBottom: 12, lineHeight: 1.4 }}>
              O arquivo do certificado é lido para assinatura criptográfica e transmissão mTLS direta para a Receita Federal.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Arquivo do Certificado A1 (.pfx / .p12)</FieldLabel>
                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept=".pfx,.p12"
                    onChange={e => setCertArquivo(e.target.files?.[0] || null)}
                    style={{
                      ...inputStyle,
                      padding: '8px',
                      fontSize: 11.5,
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                {certArquivo && (
                  <div style={{ fontSize: 10.5, color: '#1F5C52', marginTop: 3, fontWeight: 600 }}>
                    ✓ {certArquivo.name} ({Math.round(certArquivo.size / 1024)} KB)
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Senha do Certificado</FieldLabel>
                <input
                  type="password"
                  value={certSenha}
                  onChange={e => setCertSenha(e.target.value)}
                  placeholder="Senha de uso do A1"
                  style={{ ...inputStyle, background: '#fff' }}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Botões de Ação do Modal */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid #E5E0D5' }}>
        <button
          type="button"
          onClick={onClose}
          disabled={emitindo}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 10,
            border: '1px solid #D1CFC7',
            background: '#fff',
            color: '#5C5A4F',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Cancelar
        </button>

        {isEdicao ? (
          <button
            type="button"
            onClick={handleSalvarEdicao}
            disabled={emitindo}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: emitindo ? '#9C9A8F' : '#2563EB',
              color: '#FFFFFF',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: emitindo ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            {emitindo ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Salvando Alterações...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Salvar Alterações da Nota ({formatBRL(vNum)})</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEmitir}
            disabled={emitindo}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: emitindo ? '#9C9A8F' : '#0F2B27',
              color: '#FAF8F3',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: emitindo ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(15, 43, 39, 0.25)'
            }}
          >
            {emitindo ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Assinando e Transmitindo...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Assinar e Emitir NFS-e Nº {proximoNumeroSugerido} ({formatBRL(vNum)})</span>
              </>
            )}
          </button>
        )}
      </div>
    </ModalShell>
  );
}
