import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, 
  MapPin, Sparkles, MessageCircle, ChevronLeft, ChevronRight, 
  ArrowLeft, Check, AlertCircle, Share2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatBRL, daysInMonth, somenteDigitos } from '../utils/formatters';
import { MESES } from '../utils/constants';
import { 
  agendamentoService, 
  getServicosSugeridosPorRamo 
} from '../utils/agendamentoService';

export function PaginaAgendamentoPublico({ empresaId, onVoltar }) {
  const [empresa, setEmpresa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados do Agendamento
  const [passo, setPasso] = useState(1); // 1: Serviço, 2: Data/Hora, 3: Dados, 4: Sucesso
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const hoje = new Date();
  const [mesAgenda, setMesAgenda] = useState(hoje.getMonth());
  const [anoAgenda, setAnoAgenda] = useState(hoje.getFullYear());
  const [dataSelecionada, setDataSelecionada] = useState(() => hoje.toISOString().split('T')[0]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  // Dados do Cliente
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Agendamento Concluído
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Carrega os dados da empresa via Supabase
  useEffect(() => {
    async function carregarEmpresa() {
      if (!empresaId) {
        setErro('Link de agendamento inválido. Nenhuma empresa identificada.');
        setCarregando(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('id, razao_social, nome_fantasia, telefone_contato, email_contato, plano, categoria_agendamento, status')
          .eq('id', empresaId)
          .maybeSingle();

        if (error || !data) {
          // Fallback caso seja teste local ou ID não cadastrado na nuvem
          const cacheStr = localStorage.getItem(`amp_empresa_${empresaId}`);
          if (cacheStr) {
            setEmpresa(JSON.parse(cacheStr));
          } else {
            setEmpresa({
              id: empresaId,
              nome_fantasia: 'Atendimento & Serviços Especializados',
              razao_social: 'Atendimento & Serviços Especializados',
              telefone_contato: '(19) 99448-7795',
              categoria_agendamento: 'beleza'
            });
          }
        } else {
          let cat = data.categoria_agendamento;
          if (!cat && data.plano && data.plano.startsWith('{')) {
            try {
              const p = JSON.parse(data.plano);
              cat = p.categoria_agendamento;
            } catch (e) {}
          }
          setEmpresa({
            ...data,
            categoria_agendamento: cat || 'beleza'
          });
        }
      } catch (err) {
        setErro('Não foi possível carregar os dados deste estabelecimento.');
      } finally {
        setCarregando(false);
      }
    }

    carregarEmpresa();
  }, [empresaId]);

  // Lista de Serviços Disponíveis para a Categoria da Empresa
  const listaServicos = useMemo(() => {
    const cat = empresa?.categoria_agendamento || 'beleza';
    return getServicosSugeridosPorRamo(cat);
  }, [empresa?.categoria_agendamento]);

  // Calendário
  const totalDiasMes = useMemo(() => daysInMonth(mesAgenda, anoAgenda), [mesAgenda, anoAgenda]);
  const offsetSemana = useMemo(() => new Date(anoAgenda, mesAgenda, 1).getDay(), [mesAgenda, anoAgenda]);
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Grade de horários para a data selecionada
  const horariosDisponiveis = useMemo(() => {
    return agendamentoService.getHorariosDisponiveis(empresaId, dataSelecionada);
  }, [empresaId, dataSelecionada]);

  // Formatação de telefone
  function handleTelefoneChange(v) {
    const digitos = somenteDigitos(v).slice(0, 11);
    if (digitos.length <= 10) {
      setClienteTelefone(digitos.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3').trim());
    } else {
      setClienteTelefone(digitos.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3').trim());
    }
  }

  // Finalizar Agendamento
  async function handleConfirmarAgendamento(e) {
    e.preventDefault();
    if (!clienteNome.trim()) {
      alert('Por favor, informe seu nome completo.');
      return;
    }
    if (somenteDigitos(clienteTelefone).length < 10) {
      alert('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    setEnviando(true);
    try {
      const novo = agendamentoService.criarAgendamentoOnline(empresaId, {
        data: dataSelecionada,
        horario: horarioSelecionado,
        clienteNome: clienteNome.trim(),
        clienteTelefone: clienteTelefone,
        servicoNome: servicoSelecionado?.nome || 'Atendimento',
        valor: servicoSelecionado?.valorSugerido || 0,
        insumoEstimado: servicoSelecionado?.insumoEstimado || 0,
        profissionalNome: empresa?.nome_fantasia || 'Especialista',
        observacoes: observacoes.trim(),
      });

      setAgendamentoConfirmado(novo);
      setPasso(4); // Tela de Sucesso
    } catch (err) {
      alert('Ocorreu um erro ao processar seu agendamento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF8F3', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #1F5C52', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F5C52' }}>Carregando agenda online...</div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF8F3', padding: 20, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E0D5', maxWidth: 400 }}>
          <AlertCircle size={40} color="#DC2626" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Página Indisponível</h2>
          <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 16px' }}>{erro}</p>
          {onVoltar && (
            <button onClick={onVoltar} style={{ padding: '9px 16px', background: '#1F5C52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Voltar
            </button>
          )}
        </div>
      </div>
    );
  }

  const nomeEmpresa = empresa?.nome_fantasia || empresa?.razao_social || 'Estabelecimento';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F1EA',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      color: '#1C2421',
      paddingBottom: 40
    }}>
      {/* ── TOPO COM IDENTIFICAÇÃO DO ESTABELECIMENTO ── */}
      <header style={{
        background: 'linear-gradient(135deg, #0F2B27 0%, #173E38 100%)',
        color: '#FAF8F3',
        padding: '24px 20px 28px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 4px 14px rgba(15,43,39,0.15)'
      }}>
        {onVoltar && (
          <button
            onClick={onVoltar}
            style={{
              position: 'absolute',
              left: 16,
              top: 20,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <div style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
          <CalendarIcon size={26} color="#9FE0C8" />
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.3, fontFamily: 'Georgia, serif' }}>
          {nomeEmpresa}
        </h1>

        <div style={{ fontSize: 12, color: '#9FBDB5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span>Agendamento Online 24h</span>
          <span>•</span>
          <span>Horário em Tempo Real</span>
        </div>

        {/* Badge de Fidelidade */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(245, 158, 11, 0.18)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 20,
          padding: '4px 12px',
          marginTop: 12,
          fontSize: 11,
          fontWeight: 700,
          color: '#FDE68A'
        }}>
          <Sparkles size={12} color="#FDE68A" />
          <span>Ganhe pontos no Clube de Fidelidade ao comparecer!</span>
        </div>
      </header>

      {/* ── CORPO PRINCIPAL ── */}
      <main style={{ maxWidth: 540, margin: '-14px auto 0', padding: '0 16px' }}>

        {/* ── PASSO 1: ESCOLHA DO SERVIÇO ── */}
        {passo === 1 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #E5E0D5', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F2B27', marginBottom: 4 }}>
              1. Escolha o serviço desejado
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
              Selecione o procedimento para consultar os horários vagos.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {listaServicos.map((s, idx) => {
                const selecionado = servicoSelecionado?.nome === s.nome;
                return (
                  <div
                    key={idx}
                    onClick={() => setServicoSelecionado(s)}
                    style={{
                      border: selecionado ? '2px solid #1F5C52' : '1.5px solid #E5E0D5',
                      background: selecionado ? '#F2FAF7' : '#FFFFFF',
                      borderRadius: 12,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: selecionado ? '#0F2B27' : '#1F2937' }}>
                        {s.nome}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        <span>Duração estimada: ~{s.duracaoMin} min</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#1F5C52', fontFamily: 'Georgia, serif' }}>
                        {formatBRL(s.valorSugerido)}
                      </div>
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: selecionado ? 'none' : '2px solid #CBD5E1',
                        background: selecionado ? '#1F5C52' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>
                        {selecionado && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              disabled={!servicoSelecionado}
              onClick={() => setPasso(2)}
              style={{
                width: '100%',
                marginTop: 20,
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: servicoSelecionado ? 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)' : '#E2E8F0',
                color: servicoSelecionado ? '#fff' : '#94A3B8',
                fontSize: 14,
                fontWeight: 700,
                cursor: servicoSelecionado ? 'pointer' : 'not-allowed',
                boxShadow: servicoSelecionado ? '0 4px 12px rgba(31,92,82,0.25)' : 'none'
              }}
            >
              Continuar para Data & Horário →
            </button>
          </div>
        )}

        {/* ── PASSO 2: ESCOLHA DA DATA & HORÁRIO NO CALENDÁRIO ── */}
        {passo === 2 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #E5E0D5', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <button
                onClick={() => setPasso(1)}
                style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
              >
                <ArrowLeft size={14} /> Alterar serviço ({servicoSelecionado?.nome})
              </button>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F2B27', marginBottom: 4 }}>
              2. Escolha o dia e o horário
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
              Toque no dia desejado para ver os horários livres.
            </div>

            {/* Navegador de Mês */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px 14px', borderRadius: 12, marginBottom: 14, border: '1px solid #E2E8F0' }}>
              <button
                onClick={() => {
                  if (mesAgenda === 0) {
                    setMesAgenda(11);
                    setAnoAgenda(a => a - 1);
                  } else {
                    setMesAgenda(m => m - 1);
                  }
                }}
                style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>

              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F2B27' }}>
                {MESES[mesAgenda]} de {anoAgenda}
              </div>

              <button
                onClick={() => {
                  if (mesAgenda === 11) {
                    setMesAgenda(0);
                    setAnoAgenda(a => a + 1);
                  } else {
                    setMesAgenda(m => m + 1);
                  }
                }}
                style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Grade do Calendário */}
            <div style={{ marginBottom: 18 }}>
              {/* Dias da Semana */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 6 }}>
                {diasSemana.map((d, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? '#DC2626' : '#6B7280' }}>
                    {d}
                  </span>
                ))}
              </div>

              {/* Dias do Mês */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
                {Array.from({ length: offsetSemana }).map((_, i) => (
                  <div key={`offset-${i}`} />
                ))}

                {Array.from({ length: totalDiasMes }).map((_, i) => {
                  const dia = i + 1;
                  const dataStr = `${anoAgenda}-${String(mesAgenda + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                  const isHoje = dataStr === hoje.toISOString().split('T')[0];
                  const isSelecionado = dataStr === dataSelecionada;
                  const isPassado = new Date(dataStr + 'T23:59:59') < hoje;

                  return (
                    <button
                      key={dia}
                      disabled={isPassado}
                      onClick={() => {
                        setDataSelecionada(dataStr);
                        setHorarioSelecionado('');
                      }}
                      style={{
                        padding: '10px 4px',
                        borderRadius: 10,
                        border: isSelecionado ? '2px solid #1F5C52' : (isHoje ? '1px solid #1F5C52' : '1px solid #E5E7EB'),
                        background: isSelecionado ? '#1F5C52' : (isHoje ? '#E6F4EA' : (isPassado ? '#F3F4F6' : '#FFFFFF')),
                        color: isSelecionado ? '#FFFFFF' : (isPassado ? '#9CA3AF' : '#111827'),
                        fontWeight: isSelecionado || isHoje ? 800 : 500,
                        fontSize: 12.5,
                        cursor: isPassado ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.1s ease'
                      }}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade de Horários Livres */}
            <div style={{ borderTop: '1px solid #E5E0D5', paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F2B27', marginBottom: 2 }}>
                Horários Livres para {dataSelecionada.split('-').reverse().join('/')}:
              </div>
              <div style={{ fontSize: 11.5, color: '#6B7280', marginBottom: 12 }}>
                Toque no horário de sua preferência.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                {horariosDisponiveis.map(h => {
                  const sel = horarioSelecionado === h.horario;
                  return (
                    <button
                      key={h.horario}
                      disabled={!h.disponivel}
                      onClick={() => setHorarioSelecionado(h.horario)}
                      style={{
                        padding: '9px 4px',
                        borderRadius: 8,
                        border: sel ? '2px solid #1F5C52' : (h.disponivel ? '1px solid #CBD5E1' : '1px solid #E5E7EB'),
                        background: sel ? '#1F5C52' : (h.disponivel ? '#F8FAFC' : '#F1F5F9'),
                        color: sel ? '#FFFFFF' : (h.disponivel ? '#1E293B' : '#94A3B8'),
                        fontSize: 12.5,
                        fontWeight: sel ? 800 : 600,
                        cursor: h.disponivel ? 'pointer' : 'not-allowed',
                        textDecoration: h.disponivel ? 'none' : 'line-through'
                      }}
                    >
                      {h.horario}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={!horarioSelecionado}
              onClick={() => setPasso(3)}
              style={{
                width: '100%',
                marginTop: 20,
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: horarioSelecionado ? 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)' : '#E2E8F0',
                color: horarioSelecionado ? '#fff' : '#94A3B8',
                fontSize: 14,
                fontWeight: 700,
                cursor: horarioSelecionado ? 'pointer' : 'not-allowed',
                boxShadow: horarioSelecionado ? '0 4px 12px rgba(31,92,82,0.25)' : 'none'
              }}
            >
              Continuar para Seus Dados →
            </button>
          </div>
        )}

        {/* ── PASSO 3: SEUS DADOS & CONFIRMAÇÃO ── */}
        {passo === 3 && (
          <form onSubmit={handleConfirmarAgendamento} style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #E5E0D5', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setPasso(2)}
                style={{ background: 'none', border: 'none', color: '#1F5C52', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
              >
                <ArrowLeft size={14} /> Voltar à data e horário
              </button>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F2B27', marginBottom: 4 }}>
              3. Seus Dados de Contato
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
              Utilizaremos seu WhatsApp para enviar a confirmação e lembrete do horário.
            </div>

            {/* Resumo do Atendimento */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 14px', marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F2B27' }}>{servicoSelecionado?.nome}</div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 3 }}>
                🗓️ {dataSelecionada.split('-').reverse().join('/')} às ⏰ {horarioSelecionado}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1F5C52', marginTop: 4, fontFamily: 'Georgia, serif' }}>
                Valor: {formatBRL(servicoSelecionado?.valorSugerido || 0)}
              </div>
            </div>

            {/* Formulário */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={clienteNome}
                  onChange={e => setClienteNome(e.target.value)}
                  placeholder="Ex: João da Silva"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13.5, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                  Seu WhatsApp (com DDD) *
                </label>
                <input
                  type="tel"
                  required
                  value={clienteTelefone}
                  onChange={e => handleTelefoneChange(e.target.value)}
                  placeholder="(19) 99999-9999"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13.5, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                  Observações para o profissional (opcional)
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  placeholder="Alguma preferência ou detalhe adicional?"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              style={{
                width: '100%',
                marginTop: 20,
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)',
                color: '#fff',
                fontSize: 14.5,
                fontWeight: 800,
                cursor: enviando ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(31,92,82,0.3)'
              }}
            >
              {enviando ? 'Confirmando Agendamento...' : '✓ Confirmar Meu Agendamento'}
            </button>
          </form>
        )}

        {/* ── PASSO 4: SUCESSO & AÇÕES PÓS-AGENDAMENTO ── */}
        {passo === 4 && agendamentoConfirmado && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 20px', border: '1px solid #E5E0D5', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={38} />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2B27', margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
              Agendamento Confirmado!
            </h2>
            <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 20px' }}>
              Olá, <strong>{agendamentoConfirmado.clienteNome}</strong>! Seu horário foi reservado com sucesso no sistema da empresa <strong>{nomeEmpresa}</strong>.
            </p>

            {/* Card com Detalhes */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F2B27', marginBottom: 8 }}>
                📋 Resumo da Reserva
              </div>
              <div style={{ fontSize: 13, color: '#334155', marginBottom: 4 }}>
                <strong>Serviço:</strong> {agendamentoConfirmado.servicoNome}
              </div>
              <div style={{ fontSize: 13, color: '#334155', marginBottom: 4 }}>
                <strong>Data & Hora:</strong> {agendamentoConfirmado.data.split('-').reverse().join('/')} às {agendamentoConfirmado.horario}
              </div>
              <div style={{ fontSize: 13, color: '#334155', marginBottom: 4 }}>
                <strong>Local:</strong> {nomeEmpresa}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1F5C52', marginTop: 8 }}>
                Valor: {formatBRL(agendamentoConfirmado.valor)}
              </div>
            </div>

            {/* Ações: WhatsApp & Google Agenda */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={agendamentoService.gerarLinkWhatsAppLembrete(agendamentoConfirmado, empresa)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '13px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(37,211,102,0.25)'
                }}
              >
                <MessageCircle size={18} />
                <span>Salvar & Enviar no WhatsApp da Empresa</span>
              </a>

              <a
                href={agendamentoService.gerarLinkGoogleCalendar(agendamentoConfirmado, empresa)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#FFFFFF',
                  color: '#1F2937',
                  border: '1px solid #CBD5E1',
                  borderRadius: 10,
                  padding: '12px',
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <CalendarIcon size={16} color="#4285F4" />
                <span>Adicionar ao Google Agenda</span>
              </a>

              <button
                onClick={() => {
                  setPasso(1);
                  setServicoSelecionado(null);
                  setHorarioSelecionado('');
                  setAgendamentoConfirmado(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px',
                  marginTop: 6
                }}
              >
                Fazer outro agendamento
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
