import { formatBRL, somenteDigitos } from './formatters';

const STORAGE_PREFIX = 'amp_agendamentos_';

export const SERVICOS_SUGERIDOS = [
  // Saúde / Consultório
  { nome: 'Consulta Clínica / Médica', duracaoMin: 30, valorSugerido: 250, insumoEstimado: 25, categoria: 'saude' },
  { nome: 'Procedimento Clínico / Odonto', duracaoMin: 60, valorSugerido: 450, insumoEstimado: 60, categoria: 'saude' },
  { nome: 'Retorno Clínico', duracaoMin: 20, valorSugerido: 0, insumoEstimado: 10, categoria: 'saude' },
  { nome: 'Exame / Avaliação Especializada', duracaoMin: 40, valorSugerido: 180, insumoEstimado: 20, categoria: 'saude' },
  
  // Beleza / Estética
  { nome: 'Corte de Cabelo / Barba', duracaoMin: 45, valorSugerido: 80, insumoEstimado: 10, categoria: 'beleza' },
  { nome: 'Coloração / Mechas / Luzes', duracaoMin: 120, valorSugerido: 280, insumoEstimado: 55, categoria: 'beleza' },
  { nome: 'Manicure & Pedicure', duracaoMin: 60, valorSugerido: 75, insumoEstimado: 12, categoria: 'beleza' },
  { nome: 'Procedimento Estético / Massagem', duracaoMin: 60, valorSugerido: 180, insumoEstimado: 35, categoria: 'beleza' },
  { nome: 'Barboterapia / Barba Tradicional', duracaoMin: 30, valorSugerido: 60, insumoEstimado: 8, categoria: 'beleza' },
  { nome: 'Escova & Penteado', duracaoMin: 45, valorSugerido: 90, insumoEstimado: 15, categoria: 'beleza' },

  // Consultoria / Serviços Especializados
  { nome: 'Sessão de Consultoria / Parecer', duracaoMin: 60, valorSugerido: 200, insumoEstimado: 0, categoria: 'consultoria' },
  { nome: 'Atendimento Técnico Especializado', duracaoMin: 60, valorSugerido: 150, insumoEstimado: 15, categoria: 'consultoria' },
  { nome: 'Reunião Estratégica / Audiência', duracaoMin: 60, valorSugerido: 350, insumoEstimado: 0, categoria: 'consultoria' },
];

export function getServicosSugeridosPorRamo(ramo = 'geral') {
  if (!ramo || ramo === 'geral') return SERVICOS_SUGERIDOS;
  return SERVICOS_SUGERIDOS.filter(s => s.categoria === ramo);
}

export const STATUS_AGENDAMENTO = {
  agendado: { label: 'Agendado', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  confirmado: { label: 'Confirmado', bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
  em_atendimento: { label: 'Em Atendimento', bg: '#FFEDD5', color: '#C2410C', border: '#FED7AA' },
  concluido: { label: 'Concluído & Pago', bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0' },
  cancelado: { label: 'Cancelado', bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' },
};

export const agendamentoService = {
  getAgendamentos(empresaId) {
    if (!empresaId) return [];
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${empresaId}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  salvarAgendamentos(empresaId, lista) {
    if (!empresaId) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${empresaId}`, JSON.stringify(lista));
    } catch (e) {}
  },

  criarAgendamento(empresaId, novo) {
    const lista = this.getAgendamentos(empresaId);
    const agendamento = {
      id: `agend_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      empresaId,
      data: novo.data, // YYYY-MM-DD
      horario: novo.horario || '09:00',
      clienteNome: (novo.clienteNome || '').trim(),
      clienteTelefone: somenteDigitos(novo.clienteTelefone || ''),
      clienteCpf: somenteDigitos(novo.clienteCpf || ''),
      profissionalNome: (novo.profissionalNome || 'Profissional').trim(),
      servicoNome: (novo.servicoNome || 'Atendimento').trim(),
      valor: parseFloat(novo.valor) || 0,
      insumoEstimado: parseFloat(novo.insumoEstimado) || 0,
      formaPagamento: novo.formaPagamento || 'pix', // pix, cartao_credito, cartao_debito, dinheiro, convenio
      status: novo.status || 'agendado',
      observacoes: novo.observacoes || '',
      nfseEmitidaId: null,
      criadoEm: new Date().toISOString(),
    };
    lista.unshift(agendamento);
    this.salvarAgendamentos(empresaId, lista);
    return agendamento;
  },

  atualizarAgendamento(empresaId, id, dados) {
    const lista = this.getAgendamentos(empresaId);
    const idx = lista.findIndex(a => a.id === id);
    if (idx !== -1) {
      lista[idx] = { ...lista[idx], ...dados, atualizadoEm: new Date().toISOString() };
      this.salvarAgendamentos(empresaId, lista);
      return lista[idx];
    }
    return null;
  },

  removerAgendamento(empresaId, id) {
    const lista = this.getAgendamentos(empresaId).filter(a => a.id !== id);
    this.salvarAgendamentos(empresaId, lista);
    return lista;
  },

  /**
   * Converte a conclusão do agendamento em lançamentos de Caixa & DRE
   * Suporta ajustes de valor no checkout (ex: inclusão de produtos extras e alteração de insumos)
   */
  gerarLancamentosFinanceiros(agendamento, ajustes = {}) {
    const lancamentos = [];
    const diaAtual = new Date(agendamento.data + 'T12:00:00').getDate();
    const mesAtual = new Date(agendamento.data + 'T12:00:00').getMonth();
    const anoAtual = new Date(agendamento.data + 'T12:00:00').getFullYear();

    const valorCobrado = ajustes.valorFinal !== undefined ? parseFloat(ajustes.valorFinal) : (agendamento.valor || 0);
    const insumoReal = ajustes.insumoFinal !== undefined ? parseFloat(ajustes.insumoFinal) : (agendamento.insumoEstimado || 0);
    const formaRecebimento = ajustes.formaPagamento || agendamento.formaPagamento || 'pix';
    const descExtra = ajustes.descricaoExtra ? ` (+ ${ajustes.descricaoExtra})` : '';

    // 1. Receita da Consulta / Atendimento no Caixa
    if (valorCobrado > 0) {
      lancamentos.push({
        tipo: 'receita',
        descricao: `${agendamento.servicoNome}${descExtra} — ${agendamento.clienteNome}`,
        valor: valorCobrado,
        dia: diaAtual,
        mes: mesAtual,
        ano: anoAtual,
        categoria: 'servicos',
        subcategoria: ajustes.subcategoriaReceita || 'Atendimentos / Serviços',
        formaRecebimento: formaRecebimento === 'dinheiro' || formaRecebimento === 'pix' ? 'À vista/PIX' : 'À prazo',
        origemAgendamentoId: agendamento.id,
      });
    }

    // 2. Custo do Insumo / Material consumido (alimenta CMV da DRE)
    if (insumoReal > 0) {
      lancamentos.push({
        tipo: 'despesa',
        descricao: `Insumos ref. ${agendamento.servicoNome} (${agendamento.clienteNome})`,
        valor: insumoReal,
        dia: diaAtual,
        mes: mesAtual,
        ano: anoAtual,
        categoria: 'cmv',
        subcategoria: 'Insumos de Atendimento',
        origemAgendamentoId: agendamento.id,
      });
    }

    return lancamentos;
  },

  /**
   * Mensagem padrão de lembrete e confirmação via WhatsApp
   */
  gerarLinkWhatsAppLembrete(agendamento, empresa) {
    if (!agendamento) return '';
    const empresaNome = empresa?.razao_social || empresa?.nome_fantasia || 'Nosso Espaço';
    const dataBr = agendamento.data.split('-').reverse().join('/');
    
    const texto = 
`Olá, *${agendamento.clienteNome}*! Tudo bem? 😊

Passando para confirmar seu horário com *${agendamento.profissionalNome}*:
🗓️ *Data:* ${dataBr}
⏰ *Horário:* ${agendamento.horario}
💼 *Serviço/Procedimento:* ${agendamento.servicoNome}
📍 *Local:* ${empresaNome}

Por favor, responda com *SIM* para confirmar ou nos avise caso precise reagendar. Te esperamos! ✨`;

    const telRaw = somenteDigitos(agendamento.clienteTelefone || '');
    if (telRaw.length >= 10) {
      const telClean = telRaw.startsWith('55') ? telRaw : '55' + telRaw;
      return `https://wa.me/${telClean}?text=${encodeURIComponent(texto)}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
  },
};
