import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, User, Plus, CheckCircle2, AlertCircle, 
  MessageCircle, DollarSign, FileText, ArrowLeft, ChevronLeft, ChevronRight, 
  Trash2, Edit3, X, Sparkles, Filter 
} from 'lucide-react';
import { formatBRL, somenteDigitos } from '../utils/formatters';
import { 
  agendamentoService, 
  STATUS_AGENDAMENTO, 
  SERVICOS_SUGERIDOS 
} from '../utils/agendamentoService';
import { FieldLabel, inputStyle, ModalShell } from '../components/UIComponents';

export function AgendamentoScreen({ 
  empresa, 
  mesAtual, 
  anoAtual, 
  onVoltar, 
  onAdicionarLancamentoAoCaixa,
  onAbrirEmissaoNfse,
  moduloNfseAtivo = false
}) {
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  });

  const [lista, setLista] = useState(() => agendamentoService.getAgendamentos(empresa.id));
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalFinalizar, setModalFinalizar] = useState(null); // agendamento selecionado para checkout
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);

  // Formulário de Novo/Edição
  const [formCliente, setFormCliente] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formProfissional, setFormProfissional] = useState(empresa.nome || 'Especialista');
  const [formServico, setFormServico] = useState('Consulta Clínica / Médica');
  const [formHorario, setFormHorario] = useState('09:00');
  const [formValor, setFormValor] = useState('150');
  const [formInsumo, setFormInsumo] = useState('20');
  const [formObs, setFormObs] = useState('');

  // Checkout / Finalização
  const [formaPgto, setFormaPgto] = useState('pix');
  const [gerarNoCaixa, setGerarNoCaixa] = useState(true);

  // Filtragem dos agendamentos do dia selecionado
  const agendamentosDoDia = useMemo(() => {
    return lista
      .filter(a => a.data === dataSelecionada)
      .sort((a, b) => a.horario.localeCompare(b.horario));
  }, [lista, dataSelecionada]);

  // Métricas do dia
  const metricasDia = useMemo(() => {
    const total = agendamentosDoDia.length;
    const concluidos = agendamentosDoDia.filter(a => a.status === 'concluido').length;
    const faturamentoPrevisto = agendamentosDoDia.filter(a => a.status !== 'cancelado').reduce((s, a) => s + (a.valor || 0), 0);
    const faturamentoRealizado = agendamentosDoDia.filter(a => a.status === 'concluido').reduce((s, a) => s + (a.valor || 0), 0);
    return { total, concluidos, faturamentoPrevisto, faturamentoRealizado };
  }, [agendamentosDoDia]);

  function mudarDia(delta) {
    const d = new Date(dataSelecionada + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    setDataSelecionada(d.toISOString().split('T')[0]);
  }

  function abrirNovoAgendamento() {
    setAgendamentoEditando(null);
    setFormCliente('');
    setFormTelefone('');
    setFormCpf('');
    setFormProfissional(empresa.nome || 'Especialista');
    setFormServico(SERVICOS_SUGERIDOS[0].nome);
    setFormValor(String(SERVICOS_SUGERIDOS[0].valorSugerido));
    setFormInsumo(String(SERVICOS_SUGERIDOS[0].insumoEstimado));
    setFormHorario('09:00');
    setFormObs('');
    setModalNovoAberto(true);
  }

  function handleSelecionarServicoPreset(nome) {
    setFormServico(nome);
    const preset = SERVICOS_SUGERIDOS.find(s => s.nome === nome);
    if (preset) {
      setFormValor(String(preset.valorSugerido));
      setFormInsumo(String(preset.insumoEstimado));
    }
  }

  function handleSalvarAgendamento() {
    if (!formCliente.trim()) {
      alert('Informe o nome do cliente/paciente.');
      return;
    }

    if (agendamentoEditando) {
      const atualizado = agendamentoService.atualizarAgendamento(empresa.id, agendamentoEditando.id, {
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

  function handleConfirmarCheckout() {
    if (!modalFinalizar) return;
    const ag = modalFinalizar;

    // 1. Marca agendamento como concluído
    agendamentoService.atualizarAgendamento(empresa.id, ag.id, {
      status: 'concluido',
      formaPagamento: formaPgto
    });
    setLista(agendamentoService.getAgendamentos(empresa.id));

    // 2. Se optou por lançar no Caixa & DRE
    if (gerarNoCaixa && onAdicionarLancamentoAoCaixa) {
      const lancs = agendamentoService.gerarLancamentosFinanceiros(ag);
      lancs.forEach(l => onAdicionarLancamentoAoCaixa(l));
    }

    setModalFinalizar(null);
  }

  function handleCheckoutComNfse() {
    if (!modalFinalizar) return;
    const ag = modalFinalizar;
    handleConfirmarCheckout();

    if (onAbrirEmissaoNfse) {
      onAbrirEmissaoNfse({
        cliente: ag.clienteNome,
        cpfCnpj: ag.clienteCpf || ag.clienteTelefone,
        valor: ag.valor,
        discriminacao: `${ag.servicoNome} realizado com ${ag.profissionalNome} em ${ag.data.split('-').reverse().join('/')}`,
        telefone: ag.clienteTelefone,
      });
    }
  }

  return (
    <div style={{ padding: '16px 16px 36px', maxWidth: 680, margin: '0 auto' }}>
      
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

      {/* ── CARD PRINCIPAL TOPO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2B27 0%, #1A4740 100%)',
        borderRadius: 16,
        padding: '18px 16px',
        color: '#FAF8F3',
        marginBottom: 16,
        boxShadow: '0 4px 14px rgba(15,43,39,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9FE0C8', textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} />
            Agendamentos & Atendimentos
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#FAF8F3', marginTop: 2 }}>
            {formatBRL(metricasDia.faturamentoPrevisto)}
          </div>
          <div style={{ fontSize: 11.5, color: '#D9EBE6', marginTop: 2 }}>
            {metricasDia.total} agendado(s) · {metricasDia.concluidos} concluído(s) ({formatBRL(metricasDia.faturamentoRealizado)})
          </div>
        </div>

        <button
          onClick={abrirNovoAgendamento}
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            border: 'none',
            borderRadius: 12,
            padding: '11px 14px',
            color: '#fff',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
          }}
        >
          <Plus size={16} /> Novo Horário
        </button>
      </div>

      {/* ── SELETOR DE DATA NAVEGÁVEL ── */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '8px 12px',
        border: '1px solid #E5E0D5',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        <button
          onClick={() => mudarDia(-1)}
          style={{ background: 'none', border: 'none', color: '#1F5C52', cursor: 'pointer', padding: 6, display: 'flex' }}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={16} color="#1F5C52" />
          <input
            type="date"
            value={dataSelecionada}
            onChange={e => setDataSelecionada(e.target.value)}
            style={{
              border: 'none',
              fontSize: 14,
              fontWeight: 700,
              color: '#1C2421',
              background: 'transparent',
              cursor: 'pointer',
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={() => mudarDia(1)}
          style={{ background: 'none', border: 'none', color: '#1F5C52', cursor: 'pointer', padding: 6, display: 'flex' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── LISTA DE ATENDIMENTOS DO DIA ── */}
      {agendamentosDoDia.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: '36px 20px',
          textAlign: 'center',
          border: '1px dashed #D1CFC7',
          color: '#7A7868'
        }}>
          <Calendar size={36} color="#A8A29E" style={{ margin: '0 auto 10px', opacity: 0.7 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1C2421' }}>Nenhum agendamento para este dia</div>
          <div style={{ fontSize: 12, marginTop: 4, color: '#7A7868' }}>
            Toque em <strong>+ Novo Horário</strong> para marcar um atendimento ou consulta.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {agendamentosDoDia.map(ag => {
            const st = STATUS_AGENDAMENTO[ag.status] || STATUS_AGENDAMENTO.agendado;
            const linkZap = agendamentoService.gerarLinkWhatsAppLembrete(ag, empresa);

            return (
              <div
                key={ag.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: `1px solid ${st.border}`,
                  borderLeft: `5px solid ${st.color}`,
                  padding: '12px 14px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#0F2B27',
                      background: '#F0EDE3',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontFamily: 'monospace'
                    }}>
                      {ag.horario}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2421' }}>
                        {ag.clienteNome}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#7A7868' }}>
                        {ag.servicoNome} · com <strong>{ag.profissionalNome}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1F5C52' }}>
                      {formatBRL(ag.valor)}
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 6,
                      background: st.bg,
                      color: st.color,
                      display: 'inline-block',
                      marginTop: 2
                    }}>
                      {st.label}
                    </span>
                  </div>
                </div>

                {/* Linha de Ações Rápidas */}
                <div style={{ display: 'flex', gap: 6, paddingTop: 6, borderTop: '1px solid #F5F2EA', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {linkZap && (
                      <button
                        onClick={() => window.open(linkZap, '_blank')}
                        title="Enviar lembrete no WhatsApp"
                        style={{
                          background: '#E8F5E9',
                          border: '1px solid #C8E6C9',
                          borderRadius: 6,
                          padding: '5px 8px',
                          color: '#2E7D32',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <MessageCircle size={12} />
                        <span>Lembrete Zap</span>
                      </button>
                    )}

                    <select
                      value={ag.status}
                      onChange={e => handleMudarStatus(ag.id, e.target.value)}
                      style={{
                        padding: '4px 6px',
                        borderRadius: 6,
                        border: '1px solid #D1CFC7',
                        fontSize: 11,
                        background: '#FAF8F3',
                        color: '#4A483E',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="agendado">Agendado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="em_atendimento">Em Atendimento</option>
                      <option value="concluido">Concluído & Pago</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {ag.status !== 'concluido' && (
                      <button
                        onClick={() => setModalFinalizar(ag)}
                        style={{
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: 6,
                          padding: '5px 10px',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Finalizar & Receber</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleExcluir(ag.id)}
                      title="Excluir agendamento"
                      style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL NOVO AGENDAMENTO ── */}
      {modalNovoAberto && (
        <ModalShell onClose={() => setModalNovoAberto(false)} titulo="Novo Agendamento">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* Presets Rápidos de Serviços */}
            <div>
              <FieldLabel>Sugestões Rápidas de Serviços / Consultas</FieldLabel>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {SERVICOS_SUGERIDOS.slice(0, 5).map(s => (
                  <button
                    key={s.nome}
                    type="button"
                    onClick={() => handleSelecionarServicoPreset(s.nome)}
                    style={{
                      background: formServico === s.nome ? '#0F2B27' : '#F0EDE3',
                      color: formServico === s.nome ? '#FAF8F3' : '#5C5A4F',
                      border: 'none',
                      borderRadius: 8,
                      padding: '5px 9px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {s.nome}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Nome do Cliente / Paciente</FieldLabel>
                <input
                  type="text"
                  value={formCliente}
                  onChange={e => setFormCliente(e.target.value)}
                  placeholder="Ex: João da Silva"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>WhatsApp / Telefone</FieldLabel>
                <input
                  type="text"
                  value={formTelefone}
                  onChange={e => setFormTelefone(e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Profissional / Atendente</FieldLabel>
                <input
                  type="text"
                  value={formProfissional}
                  onChange={e => setFormProfissional(e.target.value)}
                  placeholder="Nome do profissional"
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>Horário</FieldLabel>
                <input
                  type="time"
                  value={formHorario}
                  onChange={e => setFormHorario(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Serviço / Procedimento</FieldLabel>
              <input
                type="text"
                value={formServico}
                onChange={e => setFormServico(e.target.value)}
                placeholder="Ex: Consulta Médica, Corte & Barba"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <FieldLabel>Valor a Cobrar (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={formValor}
                  onChange={e => setFormValor(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <FieldLabel>Custo Estimado de Insumos / CMV (R$)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={formInsumo}
                  onChange={e => setFormInsumo(e.target.value)}
                  placeholder="Ex: 20 (materiais gastos)"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <FieldLabel>CPF do Cliente (Opcional, para NFS-e / Recibo)</FieldLabel>
              <input
                type="text"
                value={formCpf}
                onChange={e => setFormCpf(e.target.value)}
                placeholder="Apenas números"
                style={inputStyle}
              />
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

      {/* ── MODAL FINALIZAR & CHECKOUT INTEGRADO ── */}
      {modalFinalizar && (
        <ModalShell onClose={() => setModalFinalizar(null)} titulo="Finalizar Atendimento">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#F0EDE3', borderRadius: 10, padding: '12px', border: '1px solid #E5E0D5' }}>
              <div style={{ fontSize: 11, color: '#7A7868' }}>Cliente / Procedimento:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2421' }}>{modalFinalizar.clienteNome}</div>
              <div style={{ fontSize: 12.5, color: '#1F5C52', marginTop: 2 }}>{modalFinalizar.servicoNome} · com {modalFinalizar.profissionalNome}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#15803D', marginTop: 6 }}>{formatBRL(modalFinalizar.valor)}</div>
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

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#EAF4F1', padding: '10px', borderRadius: 8, border: '1px solid #B8DDD2' }}>
              <input
                type="checkbox"
                checked={gerarNoCaixa}
                onChange={e => setGerarNoCaixa(e.target.checked)}
                style={{ accentColor: '#1F5C52', width: 17, height: 17 }}
              />
              <span style={{ fontSize: 12, color: '#0F2B27', fontWeight: 600 }}>
                Lançar automaticamente a Receita no Caixa ({formatBRL(modalFinalizar.valor)}) {modalFinalizar.insumoEstimado > 0 ? `e o CMV de insumos (${formatBRL(modalFinalizar.insumoEstimado)})` : ''}
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
                  <FileText size={15} />
                  <span>Concluir + Emitir NFS-e</span>
                </button>
              )}
            </div>
          </div>
        </ModalShell>
      )}

    </div>
  );
}
