import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Clock, User, Plus, CheckCircle2, AlertCircle, 
  MessageCircle, DollarSign, FileText, ArrowLeft, ChevronLeft, ChevronRight, 
  Trash2, Edit3, X, Sparkles, Filter, ShoppingBag,
  Share2, Copy, Check, ExternalLink, Globe, RefreshCw
} from 'lucide-react';
import { formatBRL, formatCompacto, daysInMonth, somenteDigitos } from '../utils/formatters';
import { MESES } from '../utils/constants';
import { 
  agendamentoService, 
  STATUS_AGENDAMENTO, 
  getServicosSugeridosPorRamo 
} from '../utils/agendamentoService';
import { FieldLabel, inputStyle, ModalShell } from '../components/UIComponents';
import { PaginaAgendamentoPublico } from './PaginaAgendamentoPublico';

export function AgendamentoScreen({ 
  empresa, 
  mesAtual, 
  anoAtual, 
  categoriaAgendamento = 'beleza',
  onVoltar, 
  onAdicionarLancamentoAoCaixa,
  onAbrirEmissaoNfse,
  moduloNfseAtivo = false
}) {
  const [mesAgenda, setMesAgenda] = useState(mesAtual);
  const [anoAgenda, setAnoAgenda] = useState(anoAtual);

  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  });

  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos', 'pendentes', 'concluidos'
  const [lista, setLista] = useState(() => agendamentoService.getAgendamentos(empresa.id));
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalFinalizar, setModalFinalizar] = useState(null); // agendamento selecionado para checkout
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);

  // Auto-Agendamento Online Público
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [modalPreviewOnline, setModalPreviewOnline] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  async function handleRecarregarAgenda() {
    if (!empresa?.id) return;
    setAtualizando(true);
    try {
      const res = await agendamentoService.getAgendamentosAsync(empresa.id);
      if (res) setLista(res);
    } catch (e) {} finally {
      setTimeout(() => setAtualizando(false), 500);
    }
  }

  // Sincroniza agendamentos em tempo real do Supabase (ao montar e a cada 15s)
  useEffect(() => {
    if (!empresa?.id) return;
    handleRecarregarAgenda();

    const interval = setInterval(() => {
      agendamentoService.getAgendamentosAsync(empresa.id).then(res => {
        if (res) setLista(res);
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [empresa?.id]);

  const linkAgendamentoPublico = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/?agenda=${empresa?.id || ''}`;
  }, [empresa?.id]);

  function handleCopiarLink() {
    if (!linkAgendamentoPublico) return;
    navigator.clipboard.writeText(linkAgendamentoPublico).then(() => {
      setCopiadoLink(true);
      setTimeout(() => setCopiadoLink(false), 2500);
    }).catch(() => {
      prompt('Copie o link abaixo para compartilhar com seus clientes:', linkAgendamentoPublico);
    });
  }

  function handleCompartilharWhatsApp() {
    const nomeEmp = empresa.nome_fantasia || empresa.razao_social || 'Nosso Espaço';
    const msg = encodeURIComponent(
      `✨ *Agendamento Online - ${nomeEmp}*\n\nOlá! Agora você pode agendar seu horário de forma rápida e 100% online direto pelo seu celular:\n\n👉 ${linkAgendamentoPublico}\n\nEscolha o serviço, a data e o melhor horário disponível para você. Te esperamos! 📅`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  }

  // Formulário de Novo/Edição
  const [formCliente, setFormCliente] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formProfissional, setFormProfissional] = useState(empresa.nome || 'Especialista');
  const [formServico, setFormServico] = useState('');
  const [formHorario, setFormHorario] = useState('09:00');
  const [formValor, setFormValor] = useState('80');
  const [formInsumo, setFormInsumo] = useState('10');
  const [formObs, setFormObs] = useState('');

  // Checkout / Finalização Dinâmica
  const [checkoutValor, setCheckoutValor] = useState('0');
  const [checkoutExtra, setCheckoutExtra] = useState('0.00');
  const [checkoutExtraDesc, setCheckoutExtraDesc] = useState('');
  const [checkoutInsumo, setCheckoutInsumo] = useState('0');
  const [checkoutSubcategoria, setCheckoutSubcategoria] = useState('Atendimentos / Serviços');
  const [formaPgto, setFormaPgto] = useState('pix');
  const [gerarNoCaixa, setGerarNoCaixa] = useState(true);

  // Presets de serviço filtrados exclusivamente pelo ramo de atividade configurado no Admin
  const servicosSugeridosRamo = useMemo(() => {
    return getServicosSugeridosPorRamo(categoriaAgendamento || empresa.categoria_agendamento || 'beleza');
  }, [categoriaAgendamento, empresa.categoria_agendamento]);

  // Cálculos do Mês no Calendário
  const diasNoMes = useMemo(() => daysInMonth(mesAgenda, anoAgenda), [mesAgenda, anoAgenda]);
  const offsetSemana = useMemo(() => new Date(anoAgenda, mesAgenda, 1).getDay(), [mesAgenda, anoAgenda]);
  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Agendamentos deste mês e ano selecionados
  const agendamentosDoMes = useMemo(() => {
    return lista.filter(a => {
      if (!a.data) return false;
      const [ano, mes] = a.data.split('-').map(Number);
      return ano === anoAgenda && (mes - 1) === mesAgenda;
    });
  }, [lista, mesAgenda, anoAgenda]);

  // Agrupamento por dia do mês (para a grade do calendário)
  const agendamentosPorDia = useMemo(() => {
    const mapa = {};
    for (let d = 1; d <= diasNoMes; d++) {
      mapa[d] = { itens: [], totalPrevisto: 0, totalRealizado: 0 };
    }
    agendamentosDoMes.forEach(a => {
      const diaNum = parseInt(a.data.split('-')[2], 10);
      if (mapa[diaNum]) {
        mapa[diaNum].itens.push(a);
        if (a.status !== 'cancelado') {
          mapa[diaNum].totalPrevisto += (a.valor || 0);
        }
        if (a.status === 'concluido') {
          mapa[diaNum].totalRealizado += (a.valor || 0);
        }
      }
    });
    return mapa;
  }, [agendamentosDoMes, diasNoMes]);

  // Métricas do Mês (Somatória Total)
  const metricasMes = useMemo(() => {
    const total = agendamentosDoMes.length;
    const concluidos = agendamentosDoMes.filter(a => a.status === 'concluido').length;
    const pendentes = agendamentosDoMes.filter(a => a.status !== 'concluido' && a.status !== 'cancelado').length;
    const totalPrevisto = agendamentosDoMes.filter(a => a.status !== 'cancelado').reduce((s, a) => s + (a.valor || 0), 0);
    const totalRealizado = agendamentosDoMes.filter(a => a.status === 'concluido').reduce((s, a) => s + (a.valor || 0), 0);
    const aRealizar = Math.max(0, totalPrevisto - totalRealizado);
    return { total, concluidos, pendentes, totalPrevisto, totalRealizado, aRealizar };
  }, [agendamentosDoMes]);

  // Dia selecionado na visualização
  const diaSelecionadoNumero = useMemo(() => {
    if (!dataSelecionada) return null;
    const [ano, mes, dia] = dataSelecionada.split('-').map(Number);
    if (ano === anoAgenda && (mes - 1) === mesAgenda) return dia;
    return null;
  }, [dataSelecionada, mesAgenda, anoAgenda]);

  // Agendamentos do dia selecionado
  const agendamentosDoDia = useMemo(() => {
    return lista
      .filter(a => a.data === dataSelecionada)
      .sort((a, b) => a.horario.localeCompare(b.horario));
  }, [lista, dataSelecionada]);

  // Filtragem por status na timeline
  const agendamentosFiltrados = useMemo(() => {
    if (filtroStatus === 'pendentes') return agendamentosDoDia.filter(a => a.status !== 'concluido' && a.status !== 'cancelado');
    if (filtroStatus === 'concluidos') return agendamentosDoDia.filter(a => a.status === 'concluido');
    return agendamentosDoDia;
  }, [agendamentosDoDia, filtroStatus]);

  // Métricas do dia selecionado
  const metricasDia = useMemo(() => {
    const total = agendamentosDoDia.length;
    const concluidos = agendamentosDoDia.filter(a => a.status === 'concluido').length;
    const faturamentoPrevisto = agendamentosDoDia.filter(a => a.status !== 'cancelado').reduce((s, a) => s + (a.valor || 0), 0);
    const faturamentoRealizado = agendamentosDoDia.filter(a => a.status === 'concluido').reduce((s, a) => s + (a.valor || 0), 0);
    return { total, concluidos, faturamentoPrevisto, faturamentoRealizado };
  }, [agendamentosDoDia]);

  function navegarMes(delta) {
    let novoMes = mesAgenda + delta;
    let novoAno = anoAgenda;
    if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    } else if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    }
    setMesAgenda(novoMes);
    setAnoAgenda(novoAno);
    // Seta o primeiro dia do novo mês como selecionado
    setDataSelecionada(`${novoAno}-${String(novoMes + 1).padStart(2, '0')}-01`);
  }

  function selecionarDiaCalendario(dia) {
    const dataStr = `${anoAgenda}-${String(mesAgenda + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    setDataSelecionada(dataStr);
  }

  function abrirNovoAgendamento() {
    const presetPadrao = servicosSugeridosRamo[0] || { nome: 'Atendimento', valorSugerido: 100, insumoEstimado: 10 };
    setAgendamentoEditando(null);
    setFormCliente('');
    setFormTelefone('');
    setFormCpf('');
    setFormProfissional(empresa.nome || 'Especialista');
    setFormServico(presetPadrao.nome);
    setFormValor(String(presetPadrao.valorSugerido));
    setFormInsumo(String(presetPadrao.insumoEstimado));
    setFormHorario('09:00');
    setFormObs('');
    setModalNovoAberto(true);
  }

  function handleSelecionarServicoPreset(preset) {
    setFormServico(preset.nome);
    setFormValor(String(preset.valorSugerido));
    setFormInsumo(String(preset.insumoEstimado));
  }

  function abrirEdicaoAgendamento(ag) {
    setAgendamentoEditando(ag);
    setFormCliente(ag.clienteNome);
    setFormTelefone(ag.clienteTelefone);
    setFormCpf(ag.clienteCpf);
    setFormProfissional(ag.profissionalNome);
    setFormServico(ag.servicoNome);
    setFormHorario(ag.horario);
    setFormValor(String(ag.valor));
    setFormInsumo(String(ag.insumoEstimado || 0));
    setFormObs(ag.observacoes || '');
    setModalNovoAberto(true);
  }

  function handleSalvarAgendamento() {
    if (!formCliente.trim()) {
      alert('Informe o nome do cliente/paciente.');
      return;
    }

    if (agendamentoEditando) {
      agendamentoService.atualizarAgendamento(empresa.id, agendamentoEditando.id, {
        clienteNome: formCliente,
        clienteTelefone: formTelefone,
        clienteCpf: formCpf,
        profissionalNome: formProfissional,
        servicoNome: formServico,
        horario: formHorario,
        valor: parseFloat(formValor) || 0,
        insumoEstimado: parseFloat(formInsumo) || 0,
        observacoes: formObs,
      });
      setLista(agendamentoService.getAgendamentos(empresa.id));
    } else {
      agendamentoService.criarAgendamento(empresa.id, {
        data: dataSelecionada,
        horario: formHorario,
        clienteNome: formCliente,
        clienteTelefone: formTelefone,
        clienteCpf: formCpf,
        profissionalNome: formProfissional,
        servicoNome: formServico,
        valor: parseFloat(formValor) || 0,
        insumoEstimado: parseFloat(formInsumo) || 0,
        observacoes: formObs,
        status: 'agendado',
      });
      setLista(agendamentoService.getAgendamentos(empresa.id));
    }

    setModalNovoAberto(false);
  }

  function handleMudarStatus(id, novoStatus) {
    agendamentoService.atualizarAgendamento(empresa.id, id, { status: novoStatus });
    setLista(agendamentoService.getAgendamentos(empresa.id));
  }

  function handleExcluir(id) {
    if (confirm('Deseja realmente remover este agendamento?')) {
      agendamentoService.removerAgendamento(empresa.id, id);
      setLista(agendamentoService.getAgendamentos(empresa.id));
    }
  }

  function abrirModalCheckout(ag) {
    setModalFinalizar(ag);
    setCheckoutValor(String(ag.valor || 0));
    setCheckoutExtra('0.00');
    setCheckoutExtraDesc('');
    setCheckoutInsumo(String(ag.insumoEstimado || 0));
    setCheckoutSubcategoria('Atendimentos / Serviços');
    setFormaPgto(ag.formaPagamento || 'pix');
    setGerarNoCaixa(true);
  }

  const checkoutTotalCalculado = useMemo(() => {
    const base = parseFloat(checkoutValor) || 0;
    const extra = parseFloat(checkoutExtra) || 0;
    return base + extra;
  }, [checkoutValor, checkoutExtra]);

  function handleConfirmarCheckout() {
    if (!modalFinalizar) return;
    const ag = modalFinalizar;
    const valorCobrado = checkoutTotalCalculado;
    const insumoCobrado = parseFloat(checkoutInsumo) || 0;

    // 1. Marca agendamento como concluído
    agendamentoService.atualizarAgendamento(empresa.id, ag.id, {
      status: 'concluido',
      formaPagamento: formaPgto,
      valor: valorCobrado,
      insumoEstimado: insumoCobrado,
    });
    setLista(agendamentoService.getAgendamentos(empresa.id));

    // 2. Se optou por lançar no Caixa & DRE
    if (gerarNoCaixa && onAdicionarLancamentoAoCaixa) {
      const lancs = agendamentoService.gerarLancamentosFinanceiros(ag, {
        valorFinal: valorCobrado,
        insumoFinal: insumoCobrado,
        formaPagamento: formaPgto,
        subcategoriaReceita: checkoutSubcategoria,
        descricaoExtra: checkoutExtraDesc
      });
      lancs.forEach(l => onAdicionarLancamentoAoCaixa(l));
    }

    setModalFinalizar(null);
  }

  function handleCheckoutComNfse() {
    if (!modalFinalizar) return;
    const ag = modalFinalizar;
    const valorCobrado = checkoutTotalCalculado;
    handleConfirmarCheckout();

    if (onAbrirEmissaoNfse) {
      onAbrirEmissaoNfse({
        cliente: ag.clienteNome,
        cpfCnpj: ag.clienteCpf || ag.clienteTelefone,
        valor: valorCobrado,
        discriminacao: `${ag.servicoNome}${checkoutExtraDesc ? ' + ' + checkoutExtraDesc : ''} com ${ag.profissionalNome} em ${ag.data.split('-').reverse().join('/')}`,
        telefone: ag.clienteTelefone,
      });
    }
  }

  const hojeFormatado = new Date().toISOString().split('T')[0];

  return (
    <div style={{ padding: '16px 16px 40px', maxWidth: 720, margin: '0 auto' }}>
      
      {/* Botão Voltar */}
      {onVoltar && (
        <button
          onClick={onVoltar}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: '#1F5C52',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            padding: '2px 0 12px 0'
          }}
        >
          <ArrowLeft size={16} /> Voltar ao Início
        </button>
      )}

      {/* ── CARD PÁGINA PÚBLICA DE AUTO-AGENDAMENTO DO CLIENTE ── */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
        border: '1.5px solid #86EFAC',
        borderRadius: 14,
        padding: '14px 16px',
        marginBottom: 16,
        boxShadow: '0 3px 10px rgba(22,101,52,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8, background: '#16A34A', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Globe size={16} />
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#14532D' }}>
                Sua Página de Auto-Agendamento Online
              </div>
              <div style={{ fontSize: 11, color: '#4B5563' }}>
                Seu cliente abre o link no celular, escolhe o serviço e agenda sozinho 24h por dia
              </div>
            </div>
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '3px 8px', borderRadius: 6 }}>
            Ativo & Pronto
          </span>
        </div>

        {/* Link Input & Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff',
          border: '1px solid #D1D5DB',
          borderRadius: 9,
          padding: '6px 8px',
          marginTop: 6,
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: '1 1 180px',
            fontSize: 11.5,
            color: '#374151',
            fontFamily: 'monospace',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {linkAgendamentoPublico}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={handleCopiarLink}
              style={{
                padding: '6px 11px',
                borderRadius: 7,
                border: '1px solid #16A34A',
                background: copiadoLink ? '#16A34A' : '#F0FDF4',
                color: copiadoLink ? '#fff' : '#15803D',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s ease'
              }}
            >
              {copiadoLink ? <Check size={13} /> : <Copy size={13} />}
              {copiadoLink ? 'Copiado!' : 'Copiar Link'}
            </button>

            <button
              onClick={handleCompartilharWhatsApp}
              style={{
                padding: '6px 11px',
                borderRadius: 7,
                border: 'none',
                background: '#25D366',
                color: '#fff',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <MessageCircle size={13} /> Enviar WhatsApp
            </button>

            <button
              onClick={() => setModalPreviewOnline(true)}
              style={{
                padding: '6px 11px',
                borderRadius: 7,
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#334155',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <ExternalLink size={13} /> Ver como Cliente
            </button>
          </div>
        </div>
      </div>

      {/* ── NAVEGADOR DO MÊS / ANO DA AGENDA ── */}
      <div style={{
        background: '#0F2B27',
        color: '#FAF8F3',
        borderRadius: 14,
        padding: '12px 16px',
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(15,43,39,0.12)'
      }}>
        <button
          onClick={() => navegarMes(-1)}
          aria-label="Mês anterior"
          style={{ background: 'none', border: 'none', color: '#E8A33D', cursor: 'pointer', padding: 4 }}
        >
          <ChevronLeft size={22} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#9FE0C8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Planejamento Mensal de Agendamentos
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600 }}>
            {MESES[mesAgenda]} de {anoAgenda}
          </div>
        </div>

        <button
          onClick={() => navegarMes(1)}
          aria-label="Próximo mês"
          style={{ background: 'none', border: 'none', color: '#E8A33D', cursor: 'pointer', padding: 4 }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ── CARDS DE SOMATÓRIA TOTAL DO MÊS (ESTILO FLUXO DE CAIXA) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 18 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', padding: '12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11, color: '#7A7868', fontWeight: 600 }}>Atendimentos no Mês</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F2B27', marginTop: 4 }}>{metricasMes.total}</div>
          <div style={{ fontSize: 10.5, color: '#0369A1', marginTop: 2 }}>{metricasMes.pendentes} a realizar · {metricasMes.concluidos} pagos</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', padding: '12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11, color: '#7A7868', fontWeight: 600 }}>Previsão Total (Mês)</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F2B27', marginTop: 4 }}>{formatBRL(metricasMes.totalPrevisto)}</div>
          <div style={{ fontSize: 10.5, color: '#15803D', marginTop: 2 }}>Soma da agenda no mês</div>
        </div>

        <div style={{ background: '#F4FBF7', borderRadius: 12, border: '1px solid #B8DDD2', padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#1F5C52', fontWeight: 600 }}>Faturamento Realizado</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D', marginTop: 4 }}>{formatBRL(metricasMes.totalRealizado)}</div>
          <div style={{ fontSize: 10.5, color: '#15803D', marginTop: 2 }}>Concluídos & no Caixa</div>
        </div>

        <div style={{ background: '#FFFDF5', borderRadius: 12, border: '1px solid #FDE68A', padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#92400E', fontWeight: 600 }}>Previsão a Receber</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#B45309', marginTop: 4 }}>{formatBRL(metricasMes.aRealizar)}</div>
          <div style={{ fontSize: 10.5, color: '#92400E', marginTop: 2 }}>Horários pendentes</div>
        </div>
      </div>

      {/* ── GRADE DO CALENDÁRIO MENSAL (ESTILO FLUXO DE CAIXA) ── */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #EFEBE0', padding: 14, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2B27' }}>Calendário do Mês</div>
            <div style={{ fontSize: 11, color: '#7A7868' }}>Toque em um dia para ver os atendimentos e lançar novo</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D', background: '#DCFCE7', padding: '3px 8px', borderRadius: 6 }}>
            {metricasMes.total} agendamentos em {MESES[mesAgenda]}
          </span>
        </div>

        {/* Linha dos dias da semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 6 }}>
          {diasSemana.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, color: '#9C9A8F', fontWeight: 700 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Células dos dias do mês */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {Array.from({ length: offsetSemana }, (_, i) => <div key={`pad-${i}`} />)}
          {Array.from({ length: diasNoMes }, (_, i) => i + 1).map(dia => {
            const dataIsoDia = `${anoAgenda}-${String(mesAgenda + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const info = agendamentosPorDia[dia] || { itens: [], totalPrevisto: 0, totalRealizado: 0 };
            const temAgendamento = info.itens.length > 0;
            const selecionado = diaSelecionadoNumero === dia;
            const ehHoje = dataIsoDia === hojeFormatado;

            return (
              <button
                key={dia}
                onClick={() => selecionarDiaCalendario(dia)}
                style={{
                  minHeight: 52,
                  borderRadius: 9,
                  padding: '5px 4px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  border: selecionado 
                    ? '2px solid #0F2B27' 
                    : (ehHoje ? '1.5px solid #E8A33D' : (temAgendamento ? '1px solid #B8DDD2' : '1px solid #EFEBE0')),
                  background: selecionado 
                    ? '#EAF4F1' 
                    : (temAgendamento ? '#F4FBF7' : '#fff'),
                  boxShadow: selecionado ? '0 2px 6px rgba(15,43,39,0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 11, fontWeight: selecionado || ehHoje ? 800 : 600, color: selecionado ? '#0F2B27' : (ehHoje ? '#D97706' : '#1C2421') }}>
                    {dia}
                  </span>
                  {ehHoje && (
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '1px 3px', borderRadius: 3 }}>
                      Hoje
                    </span>
                  )}
                </div>

                {temAgendamento && (
                  <div style={{ marginTop: 2 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 800, color: '#15803D', lineHeight: 1 }}>
                      +{formatCompacto(info.totalPrevisto)}
                    </div>
                    <div style={{ fontSize: 8.5, color: '#0369A1', fontWeight: 600, marginTop: 1 }}>
                      {info.itens.length} {info.itens.length === 1 ? 'agend.' : 'agend.'}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TIMELINE E ATENDIMENTOS DO DIA SELECIONADO ── */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #EFEBE0',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Cabeçalho do dia */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #EFEBE0' }}>
          <div>
            <div style={{ fontSize: 11, color: '#7A7868', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Dia Selecionado
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F2B27' }}>
              {dataSelecionada.split('-').reverse().join('/')} ({metricasDia.total} agendamento{metricasDia.total !== 1 ? 's' : ''})
            </div>
            <div style={{ fontSize: 12, color: '#15803D', fontWeight: 600, marginTop: 2 }}>
              Faturamento Previsto do Dia: {formatBRL(metricasDia.faturamentoPrevisto)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handleRecarregarAgenda}
              disabled={atualizando}
              title="Sincronizar com o banco de dados agora"
              style={{
                padding: '8px 12px',
                borderRadius: 9,
                border: '1px solid #D1D5DB',
                background: '#FAF8F3',
                color: '#1F5C52',
                fontSize: 12,
                fontWeight: 700,
                cursor: atualizando ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <RefreshCw size={13} style={{ animation: atualizando ? 'spin 1s linear infinite' : 'none' }} />
              <span>{atualizando ? 'Atualizando...' : 'Atualizar'}</span>
            </button>

            <button
              onClick={abrirNovoAgendamento}
              style={{
                padding: '9px 14px',
                borderRadius: 9,
                border: 'none',
                background: '#15803D',
                color: '#fff',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 2px 6px rgba(21,128,61,0.25)'
              }}
            >
              <Plus size={16} /> Novo Agendamento
            </button>
          </div>
        </div>

        {/* Filtros rápidos da timeline */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => setFiltroStatus('todos')}
            style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer',
              border: filtroStatus === 'todos' ? '1px solid #0F2B27' : '1px solid #E5E0D5',
              background: filtroStatus === 'todos' ? '#0F2B27' : '#FAF8F3',
              color: filtroStatus === 'todos' ? '#fff' : '#5C5A4F',
              fontWeight: filtroStatus === 'todos' ? 700 : 500
            }}
          >
            Todos ({agendamentosDoDia.length})
          </button>
          <button
            onClick={() => setFiltroStatus('pendentes')}
            style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer',
              border: filtroStatus === 'pendentes' ? '1px solid #D97706' : '1px solid #E5E0D5',
              background: filtroStatus === 'pendentes' ? '#FEF3C7' : '#FAF8F3',
              color: filtroStatus === 'pendentes' ? '#92400E' : '#5C5A4F',
              fontWeight: filtroStatus === 'pendentes' ? 700 : 500
            }}
          >
            Pendentes ({agendamentosDoDia.filter(a => a.status !== 'concluido' && a.status !== 'cancelado').length})
          </button>
          <button
            onClick={() => setFiltroStatus('concluidos')}
            style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer',
              border: filtroStatus === 'concluidos' ? '1px solid #15803D' : '1px solid #E5E0D5',
              background: filtroStatus === 'concluidos' ? '#DCFCE7' : '#FAF8F3',
              color: filtroStatus === 'concluidos' ? '#15803D' : '#5C5A4F',
              fontWeight: filtroStatus === 'concluidos' ? 700 : 500
            }}
          >
            Concluídos ({agendamentosDoDia.filter(a => a.status === 'concluido').length})
          </button>
        </div>

        {/* Lista de Atendimentos */}
        {agendamentosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#7A7868' }}>
            <Calendar size={32} color="#C9C5B6" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>Nenhum atendimento neste dia</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Clique no botão verde acima para agendar o primeiro horário.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {agendamentosFiltrados.map(ag => {
              const st = STATUS_AGENDAMENTO[ag.status] || STATUS_AGENDAMENTO.agendado;
              const linkWhats = agendamentoService.gerarLinkWhatsAppLembrete(ag, empresa);

              return (
                <div
                  key={ag.id}
                  style={{
                    background: ag.status === 'concluido' ? '#F7FDF9' : '#fff',
                    borderRadius: 12,
                    border: `1.5px solid ${ag.status === 'concluido' ? '#BBF7D0' : '#EFEBE0'}`,
                    padding: '13px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          background: '#0F2B27',
                          color: '#FAF8F3',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <Clock size={11} /> {ag.horario}
                        </span>

                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: st.color,
                          background: st.bg,
                          border: `1px solid ${st.border}`,
                          padding: '2px 6px',
                          borderRadius: 5
                        }}>
                          {st.label}
                        </span>

                        {ag.formaPagamento && (
                          <span style={{ fontSize: 10, color: '#7A7868', background: '#F0EDE3', padding: '2px 6px', borderRadius: 5 }}>
                            {ag.formaPagamento.toUpperCase()}
                          </span>
                        )}

                        {ag.origem === 'online' && (
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#0369A1',
                            background: '#E0F2FE',
                            border: '1px solid #BAE6FD',
                            padding: '2px 6px',
                            borderRadius: 5,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3
                          }}>
                            <Globe size={10} /> Online
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#1C2421', marginTop: 6 }}>
                        {ag.clienteNome}
                      </div>

                      <div style={{ fontSize: 12.5, color: '#1F5C52', fontWeight: 600, marginTop: 1 }}>
                        {ag.servicoNome} · com {ag.profissionalNome}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#15803D' }}>
                        {formatBRL(ag.valor)}
                      </div>
                      {ag.insumoEstimado > 0 && (
                        <div style={{ fontSize: 10.5, color: '#7A7868', marginTop: 1 }}>
                          Insumos: {formatBRL(ag.insumoEstimado)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações do Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F0EDE3', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {linkWhats && (
                        <a
                          href={linkWhats}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar lembrete de agendamento no WhatsApp"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '5px 9px',
                            borderRadius: 6,
                            background: '#25D366',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>
                      )}

                      <select
                        value={ag.status}
                        onChange={e => handleMudarStatus(ag.id, e.target.value)}
                        style={{
                          fontSize: 11,
                          padding: '4px 6px',
                          borderRadius: 6,
                          border: '1px solid #E1E3E6',
                          background: '#FAF8F3',
                          color: '#1C2421',
                          fontWeight: 600
                        }}
                      >
                        <option value="agendado">Agendado</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="em_atendimento">Em Atendimento</option>
                        <option value="concluido">Concluído & Pago</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {ag.status !== 'concluido' && (
                        <button
                          onClick={() => abrirModalCheckout(ag)}
                          style={{
                            padding: '6px 11px',
                            borderRadius: 7,
                            border: 'none',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: '#fff',
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                          }}
                        >
                          <CheckCircle2 size={13} /> Finalizar & Receber
                        </button>
                      )}

                      <button
                        onClick={() => abrirEdicaoAgendamento(ag)}
                        title="Editar agendamento"
                        style={{ background: 'none', border: 'none', color: '#7A7868', cursor: 'pointer', padding: 4 }}
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => handleExcluir(ag.id)}
                        title="Remover agendamento"
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL NOVO / EDITAR AGENDAMENTO ── */}
      {modalNovoAberto && (
        <ModalShell 
          onClose={() => setModalNovoAberto(false)} 
          titulo={agendamentoEditando ? "Editar Agendamento" : "Novo Agendamento"}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* Sugestões Rápidas Filtradas pelo Ramo Configurado pelo Admin */}
            {!agendamentoEditando && servicosSugeridosRamo.length > 0 && (
              <div>
                <FieldLabel>
                  Sugestões Rápidas de Serviços ({categoriaAgendamento.toUpperCase()})
                </FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 115, overflowY: 'auto', padding: '2px 0' }}>
                  {servicosSugeridosRamo.map(s => (
                    <button
                      key={s.nome}
                      type="button"
                      onClick={() => handleSelecionarServicoPreset(s)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 7,
                        fontSize: 11,
                        cursor: 'pointer',
                        border: formServico === s.nome ? '1.5px solid #0F2B27' : '1px solid #E5E0D5',
                        background: formServico === s.nome ? '#0F2B27' : '#F0EDE3',
                        color: formServico === s.nome ? '#FAF8F3' : '#1C2421',
                        fontWeight: formServico === s.nome ? 700 : 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {s.nome} · {formatBRL(s.valorSugerido)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Nome do Cliente / Paciente *</FieldLabel>
                <input
                  type="text"
                  value={formCliente}
                  onChange={e => setFormCliente(e.target.value)}
                  placeholder="Ex: João Silva"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <FieldLabel>WhatsApp / Telefone</FieldLabel>
                <input
                  type="text"
                  value={formTelefone}
                  onChange={e => setFormTelefone(e.target.value)}
                  placeholder="(DDD) 99999-9999"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Serviço / Procedimento *</FieldLabel>
                <input
                  type="text"
                  value={formServico}
                  onChange={e => setFormServico(e.target.value)}
                  placeholder="Ex: Corte de Cabelo / Consulta"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <FieldLabel>Profissional / Atendente</FieldLabel>
                <input
                  type="text"
                  value={formProfissional}
                  onChange={e => setFormProfissional(e.target.value)}
                  placeholder="Ex: Dr. Marco / Especialista"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Horário</FieldLabel>
                <input
                  type="time"
                  value={formHorario}
                  onChange={e => setFormHorario(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>Valor do Serviço (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={formValor}
                  onChange={e => setFormValor(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Custo de Insumos / CMV (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={formInsumo}
                  onChange={e => setFormInsumo(e.target.value)}
                  placeholder="Ex: 15 (materiais gastos)"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>CPF / CNPJ (Opcional p/ NFS-e)</FieldLabel>
                <input
                  type="text"
                  value={formCpf}
                  onChange={e => setFormCpf(e.target.value)}
                  placeholder="Apenas números"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              onClick={handleSalvarAgendamento}
              style={{
                marginTop: 6,
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                background: '#0F2B27',
                color: '#FAF8F3',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Calendar size={16} /> Salvar Agendamento
            </button>
          </div>
        </ModalShell>
      )}

      {/* ── MODAL FINALIZAR ATENDIMENTO (CHECKOUT COM EDIÇÃO DE VALOR E EXTRAS) ── */}
      {modalFinalizar && (
        <ModalShell onClose={() => setModalFinalizar(null)} titulo="Finalizar Atendimento & Checkout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#F0EDE3', borderRadius: 10, padding: '12px', border: '1px solid #E5E0D5' }}>
              <div style={{ fontSize: 11, color: '#7A7868' }}>Cliente & Atendimento:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2421' }}>{modalFinalizar.clienteNome}</div>
              <div style={{ fontSize: 12.5, color: '#1F5C52', marginTop: 2 }}>{modalFinalizar.servicoNome} · com {modalFinalizar.profissionalNome}</div>
            </div>

            {/* Ajuste / Edição do Valor do Serviço e Inclusão de Produtos Extras */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Valor do Serviço (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={checkoutValor}
                  onChange={e => setCheckoutValor(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>+ Produto / Extra (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={checkoutExtra}
                  onChange={e => setCheckoutExtra(e.target.value)}
                  placeholder="0.00"
                  style={inputStyle}
                />
              </div>
            </div>

            {parseFloat(checkoutExtra) > 0 && (
              <div>
                <FieldLabel>Descrição do Produto / Extra Adicionado</FieldLabel>
                <input
                  type="text"
                  value={checkoutExtraDesc}
                  onChange={e => setCheckoutExtraDesc(e.target.value)}
                  placeholder="Ex: Pomada capilar / Procedimento extra"
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Custo de Insumos / CMV (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={checkoutInsumo}
                  onChange={e => setCheckoutInsumo(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ fontSize: 10, color: '#7A7868', marginTop: 2 }}>
                  Abate no CMV da DRE
                </div>
              </div>

              <div>
                <FieldLabel>Forma de Pagamento</FieldLabel>
                <select
                  value={formaPgto}
                  onChange={e => setFormaPgto(e.target.value)}
                  style={inputStyle}
                >
                  <option value="pix">PIX</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="convenio">Convênio / Faturado</option>
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Classificação da Receita</FieldLabel>
              <select
                value={checkoutSubcategoria}
                onChange={e => setCheckoutSubcategoria(e.target.value)}
                style={inputStyle}
              >
                <option value="Atendimentos / Serviços">Atendimentos / Serviços Prestados</option>
                <option value="Venda de Produtos & Serviços">Venda de Produtos & Serviços</option>
                <option value="Consultas & Procedimentos">Consultas & Procedimentos Clínicos</option>
              </select>
            </div>

            {/* Total Destacado */}
            <div style={{ background: '#EAF4F1', borderRadius: 10, padding: '12px', border: '1.5px solid #10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: '#1F5C52', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Final a Receber
                </div>
                <div style={{ fontSize: 11, color: '#5C5A4F' }}>
                  Entrada imediata no Caixa
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#0F2B27' }}>
                {formatBRL(checkoutTotalCalculado)}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#FAF8F3', padding: '10px', borderRadius: 8, border: '1px solid #E5E0D5' }}>
              <input
                type="checkbox"
                checked={gerarNoCaixa}
                onChange={e => setGerarNoCaixa(e.target.checked)}
                style={{ accentColor: '#1F5C52', width: 17, height: 17 }}
              />
              <span style={{ fontSize: 12, color: '#0F2B27', fontWeight: 600 }}>
                Lançar automaticamente no Caixa ({formatBRL(checkoutTotalCalculado)}) {parseFloat(checkoutInsumo) > 0 ? `e CMV de insumos (${formatBRL(parseFloat(checkoutInsumo))})` : ''}
              </span>
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                onClick={handleConfirmarCheckout}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0F2B27',
                  color: '#FAF8F3',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ✓ Concluir & Salvar
              </button>

              {moduloNfseAtivo && onAbrirEmissaoNfse && (
                <button
                  onClick={handleCheckoutComNfse}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <FileText size={15} /> Concluir + Emitir NFS-e
                </button>
              )}
            </div>
          </div>
        </ModalShell>
      )}

      {/* Modal de Preview da Página Pública do Cliente */}
      {modalPreviewOnline && (
        <ModalShell
          title="Pré-visualização: Como o Cliente enxerga no Celular"
          onClose={() => setModalPreviewOnline(false)}
          maxWidth={500}
        >
          <div style={{ maxHeight: '82vh', overflowY: 'auto', margin: '-16px' }}>
            <PaginaAgendamentoPublico
              empresaId={empresa.id}
              onVoltar={() => setModalPreviewOnline(false)}
            />
          </div>
        </ModalShell>
      )}

    </div>
  );
}
