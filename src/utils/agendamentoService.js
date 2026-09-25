import { formatBRL, somenteDigitos } from './formatters';
import { supabase } from '../lib/supabase';

const STORAGE_PREFIX = 'amp_agendamentos_';

export const SERVICOS_SUGERIDOS = [
  // Saúde / Consultório
  { nome: 'Consulta Clínica / Médica', duracaoMin: 30, valorSugerido: 250, insumoEstimado: 25, categoria: 'saude' },
  { nome: 'Procedimento Clínico / Odonto', duracaoMin: 60, valorSugerido: 450, insumoEstimado: 60, categoria: 'saude' },
  { nome: 'Retorno Clínico', duracaoMin: 20, valorSugerido: 0, insumoEstimado: 10, categoria: 'saude' },
  { nome: 'Exame / Avaliação Especializada', duracaoMin: 40, valorSugerido: 180, insumoEstimado: 20, categoria: 'saude' },
  
  // Beleza / Estética / Barbearia
  { nome: 'Corte de Cabelo / Barba', duracaoMin: 45, valorSugerido: 80, insumoEstimado: 10, categoria: 'beleza' },
  { nome: 'Corte Degradê / Moderno', duracaoMin: 40, valorSugerido: 50, insumoEstimado: 8, categoria: 'beleza' },
  { nome: 'Barboterapia / Barba Tradicional', duracaoMin: 30, valorSugerido: 45, insumoEstimado: 8, categoria: 'beleza' },
  { nome: 'Combo Completo (Cabelo + Barba + Sobrancelha)', duracaoMin: 60, valorSugerido: 90, insumoEstimado: 15, categoria: 'beleza' },
  { nome: 'Coloração / Mechas / Luzes', duracaoMin: 120, valorSugerido: 280, insumoEstimado: 55, categoria: 'beleza' },
  { nome: 'Manicure & Pedicure', duracaoMin: 60, valorSugerido: 75, insumoEstimado: 12, categoria: 'beleza' },
  { nome: 'Procedimento Estético / Massagem', duracaoMin: 60, valorSugerido: 180, insumoEstimado: 35, categoria: 'beleza' },
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

function gerarUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function ehUuidValido(str) {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

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

  async getAgendamentosAsync(empresaId) {
    const locais = this.getAgendamentos(empresaId);
    try {
      const { data: dbData, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('data', { ascending: true });

      if (!error && dbData && dbData.length > 0) {
        const mapa = new Map();
        locais.forEach(a => mapa.set(a.id, a));
        dbData.forEach(row => {
          mapa.set(row.id, {
            id: row.id,
            empresaId: row.empresa_id,
            data: row.data,
            horario: row.horario,
            clienteNome: row.cliente_nome,
            clienteTelefone: row.cliente_telefone,
            clienteCpf: row.cliente_cpf,
            profissionalNome: row.profissional_nome,
            servicoNome: row.servico_nome,
            valor: parseFloat(row.valor) || 0,
            insumoEstimado: parseFloat(row.insumo_estimado) || 0,
            formaPagamento: row.forma_pagamento || 'pix',
            status: row.status || 'agendado',
            origem: row.origem || 'interno',
            observacoes: row.observacoes || '',
            criadoEm: row.criado_em,
          });
        });
        const unificada = Array.from(mapa.values());
        this.salvarAgendamentos(empresaId, unificada);
        return unificada;
      }
    } catch (e) {}
    return locais;
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
      id: gerarUuid(),
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
      formaPagamento: novo.formaPagamento || 'pix',
      status: novo.status || 'agendado',
      origem: novo.origem || 'interno',
      observacoes: novo.observacoes || '',
      nfseEmitidaId: null,
      criadoEm: new Date().toISOString(),
    };
    lista.unshift(agendamento);
    this.salvarAgendamentos(empresaId, lista);

    // Salva no Supabase de forma assíncrona
    supabase.from('agendamentos').insert({
      id: agendamento.id,
      empresa_id: empresaId,
      data: agendamento.data,
      horario: agendamento.horario,
      cliente_nome: agendamento.clienteNome,
      cliente_telefone: agendamento.clienteTelefone,
      cliente_cpf: agendamento.clienteCpf,
      profissional_nome: agendamento.profissionalNome,
      servico_nome: agendamento.servicoNome,
      valor: agendamento.valor,
      insumo_estimado: agendamento.insumoEstimado,
      forma_pagamento: agendamento.formaPagamento,
      status: agendamento.status,
      origem: agendamento.origem,
      observacoes: agendamento.observacoes
    }).then().catch(() => {});

    return agendamento;
  },

  criarAgendamentoOnline(empresaId, novo) {
    return this.criarAgendamento(empresaId, {
      ...novo,
      origem: 'online',
      status: 'agendado',
    });
  },

  atualizarAgendamento(empresaId, id, dados) {
    const lista = this.getAgendamentos(empresaId);
    const idx = lista.findIndex(a => a.id === id);
    if (idx !== -1) {
      lista[idx] = { ...lista[idx], ...dados, atualizadoEm: new Date().toISOString() };
      this.salvarAgendamentos(empresaId, lista);

      // Atualiza no Supabase se id for uuid
      if (ehUuidValido(id)) {
        supabase.from('agendamentos').update({
          status: dados.status || lista[idx].status,
          valor: dados.valor !== undefined ? dados.valor : lista[idx].valor,
          insumo_estimado: dados.insumoEstimado !== undefined ? dados.insumoEstimado : lista[idx].insumoEstimado,
          forma_pagamento: dados.formaPagamento || lista[idx].formaPagamento,
          observacoes: dados.observacoes !== undefined ? dados.observacoes : lista[idx].observacoes,
          atualizado_em: new Date().toISOString()
        }).eq('id', id).then().catch(() => {});
      }

      return lista[idx];
    }
    return null;
  },

  removerAgendamento(empresaId, id) {
    const lista = this.getAgendamentos(empresaId).filter(a => a.id !== id);
    this.salvarAgendamentos(empresaId, lista);
    if (ehUuidValido(id)) {
      supabase.from('agendamentos').delete().eq('id', id).then().catch(() => {});
    }
    return lista;
  },

  /**
   * Calcula a grade de horários disponíveis para o dia selecionado,
   * removendo os horários que já foram agendados para a empresa.
   */
  getHorariosDisponiveis(empresaId, dataStr) {
    const todosHorarios = [
      '08:00', '08:45', '09:30', '10:15', '11:00', 
      '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15'
    ];

    if (!dataStr) return todosHorarios;

    const agendamentos = this.getAgendamentos(empresaId);
    const agendamentosDoDia = agendamentos.filter(a => a.data === dataStr && a.status !== 'cancelado');
    const ocupados = new Set(agendamentosDoDia.map(a => a.horario));

    const hojeStr = new Date().toISOString().split('T')[0];
    const agoraHoraMin = new Date().getHours() * 60 + new Date().getMinutes();

    return todosHorarios.map(h => {
      const isOcupado = ocupados.has(h);
      let isPassado = false;

      if (dataStr === hojeStr) {
        const [hh, mm] = h.split(':').map(Number);
        if (hh * 60 + mm <= agoraHoraMin + 15) {
          isPassado = true;
        }
      }

      return {
        horario: h,
        disponivel: !isOcupado && !isPassado,
        motivo: isOcupado ? 'Reservado' : (isPassado ? 'Passado' : 'Livre')
      };
    });
  },

  /**
   * Converte a conclusão do agendamento em lançamentos de Caixa & DRE
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
   * Link para Adicionar ao Google Agenda
   */
  gerarLinkGoogleCalendar(agendamento, empresa) {
    if (!agendamento) return '';
    const titulo = encodeURIComponent(`${agendamento.servicoNome} com ${agendamento.profissionalNome}`);
    const detalhes = encodeURIComponent(`Agendamento confirmado em ${empresa?.nome_fantasia || empresa?.razao_social || 'AMP'}.\nServiço: ${agendamento.servicoNome}\nValor: ${formatBRL(agendamento.valor || 0)}`);
    const local = encodeURIComponent(empresa?.municipio ? `${empresa.municipio}, SP` : 'Presencial');

    // Data/Hora formato YYYYMMDDTHHmmSS
    const dataLimpa = (agendamento.data || '').replace(/-/g, '');
    const [hh, mm] = (agendamento.horario || '09:00').split(':');
    const startStr = `${dataLimpa}T${hh}${mm}00`;
    
    // Término estimado +45 min
    let fimH = parseInt(hh, 10);
    let fimM = parseInt(mm, 10) + 45;
    if (fimM >= 60) {
      fimH += 1;
      fimM -= 60;
    }
    const endStr = `${dataLimpa}T${String(fimH).padStart(2, '0')}${String(fimM).padStart(2, '0')}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${startStr}/${endStr}&details=${detalhes}&location=${local}`;
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
