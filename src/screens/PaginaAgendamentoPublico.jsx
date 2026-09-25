import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, 
  MapPin, Sparkles, MessageCircle, ChevronLeft, ChevronRight, 
  ArrowLeft, Check, AlertCircle, Share2, CalendarDays 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatBRL, daysInMonth, somenteDigitos } from '../utils/formatters';
import { MESES } from '../utils/constants';
import { 
  agendamentoService, 
  getServicosSugeridosPorRamo 
} from '../utils/agendamentoService';

/**
 * Função utilitária para chamar o WhatsApp nativo no celular sem passar por telas intermediárias de navegador
 */
function abrirWhatsAppDireto(telefone, texto) {
  const telLimpo = somenteDigitos(telefone || '');
  const telFinal = telLimpo ? (telLimpo.startsWith('55') ? telLimpo : '55' + telLimpo) : '';
  const textoCodificado = encodeURIComponent(texto);

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');

  if (isMobile) {
    const appUrl = telFinal 
      ? `whatsapp://send?phone=${telFinal}&text=${textoCodificado}`
      : `whatsapp://send?text=${textoCodificado}`;

    window.location.href = appUrl;

    // Fallback de segurança se o app nativo não responder em 1.5s
    setTimeout(() => {
      const webUrl = telFinal
        ? `https://api.whatsapp.com/send?phone=${telFinal}&text=${textoCodificado}`
        : `https://api.whatsapp.com/send?text=${textoCodificado}`;
      window.open(webUrl, '_blank');
    }, 1500);
  } else {
    const webUrl = telFinal
      ? `https://api.whatsapp.com/send?phone=${telFinal}&text=${textoCodificado}`
      : `https://api.whatsapp.com/send?text=${textoCodificado}`;
    window.open(webUrl, '_blank');
  }
}

export function PaginaAgendamentoPublico({ empresaId, onVoltar }) {
  const [empresa, setEmpresa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Fluxo em Etapas:
  // 1: Data no Calendário (focado na primeira dobra da tela)
  // 2: Horários Disponíveis do dia selecionado
  // 3: Escolha do Serviço e Dados do Cliente
  // 4: Sucesso & Envio direto no WhatsApp
  const [passo, setPasso] = useState(1);

  const hoje = new Date();
  const hojeAno = hoje.getFullYear();
  const hojeMes = hoje.getMonth();
  const hojeDia = hoje.getDate();
  const hojeIso = hoje.toISOString().split('T')[0];

  const [mesAgenda, setMesAgenda] = useState(hojeMes);
  const [anoAgenda, setAnoAgenda] = useState(hojeAno);
  const [dataSelecionada, setDataSelecionada] = useState(hojeIso);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

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
    const servs = getServicosSugeridosPorRamo(cat);
    if (!servicoSelecionado && servs.length > 0) {
      setServicoSelecionado(servs[0]);
    }
    return servs;
  }, [empresa?.categoria_agendamento]);

  // Calendário
  const totalDiasMes = useMemo(() => daysInMonth(mesAgenda, anoAgenda), [mesAgenda, anoAgenda]);
  const offsetSemana = useMemo(() => new Date(anoAgenda, mesAgenda, 1).getDay(), [mesAgenda, anoAgenda]);
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Grade de horários para a data selecionada
  const horariosDisponiveis = useMemo(() => {
    return agendamentoService.getHorariosDisponiveis(empresaId, dataSelecionada);
  }, [empresaId, dataSelecionada]);

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

    // Não permite navegar para meses no passado
    if (novoAno < hojeAno || (novoAno === hojeAno && novoMes < hojeMes)) {
      return;
    }

    setMesAgenda(novoMes);
    setAnoAgenda(novoAno);
  }

  // Toque na data: seleciona e avança imediatamente para os horários
  function handleSelecionarDia(diaNum) {
    const diaStr = String(diaNum).padStart(2, '0');
    const mesStr = String(mesAgenda + 1).padStart(2, '0');
    const dataIso = `${anoAgenda}-${mesStr}-${diaStr}`;
    setDataSelecionada(dataIso);
    setHorarioSelecionado('');
    setPasso(2); // Vai direto para horários
  }

  // Toque no horário: seleciona e avança imediatamente para os detalhes
  function handleSelecionarHorario(h) {
    setHorarioSelecionado(h);
    setPasso(3); // Vai direto para serviço e contato
  }

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
    if (e) e.preventDefault();
    if (!clienteNome.trim()) {
      alert('Por favor, informe seu nome completo.');
      return;
    }
    if (somenteDigitos(clienteTelefone).length < 10) {
      alert('Por favor, informe seu WhatsApp com DDD.');
      return;
    }
    if (!servicoSelecionado) {
      alert('Por favor, selecione o serviço desejado.');
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

  function handleSalvarEEnviarWhatsApp() {
    if (!agendamentoConfirmado) return;
    const telDestino = empresa?.telefone_contato || empresa?.telefone;
    const dataBr = agendamentoConfirmado.data.split('-').reverse().join('/');
    const msg = `✨ *Novo Agendamento Realizado!*\n\nOlá, *${nomeEmpresa}*! Acabei de fazer um agendamento online:\n\n👤 *Cliente:* ${agendamentoConfirmado.clienteNome}\n📱 *WhatsApp:* ${agendamentoConfirmado.clienteTelefone}\n📅 *Data:* ${dataBr}\n⏰ *Horário:* ${agendamentoConfirmado.horario}\n💼 *Serviço:* ${agendamentoConfirmado.servicoNome}\n💰 *Valor:* ${formatBRL(agendamentoConfirmado.valor)}${agendamentoConfirmado.observacoes ? `\n📝 *Obs:* ${agendamentoConfirmado.observacoes}` : ''}\n\nFavor confirmar minha reserva. Muito obrigado(a)! 😊`;

    abrirWhatsAppDireto(telDestino, msg);
  }

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF8F3', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #1F5C52', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1F5C52' }}>Carregando agenda online...</div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF8F3', padding: 20, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E5E0D5', maxWidth: 400 }}>
          <AlertCircle size={38} color="#DC2626" style={{ margin: '0 auto 10px' }} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Página Indisponível</h2>
          <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 16px' }}>{erro}</p>
          {onVoltar && (
            <button onClick={onVoltar} style={{ padding: '8px 16px', background: '#1F5C52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Voltar
            </button>
          )}
        </div>
      </div>
    );
  }

  const nomeEmpresa = empresa?.nome_fantasia || empresa?.razao_social || 'Nosso Espaço';
  const dataSelecionadaFormatada = dataSelecionada ? dataSelecionada.split('-').reverse().join('/') : '';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F6F0',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      color: '#1C2421',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ── CABEÇALHO COMPACTO (ALTURA REDUZIDA PARA CABER NA PRIMEIRA PÁGINA) ── */}
      <header style={{
        background: '#0F2B27',
        color: '#FAF8F3',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          {onVoltar && (
            <button
              onClick={onVoltar}
              title="Voltar"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: 8,
                width: 30,
                height: 30,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9FE0C8',
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0
          }}>
            <CalendarIcon size={17} />
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '210px'
            }}>
              {nomeEmpresa}
            </div>
            <div style={{ fontSize: 10.5, color: '#A7D4C8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>Agendamento Online</span>
              <span>•</span>
              <span style={{ color: '#FDE68A', fontWeight: 600 }}>Horários Livres</span>
            </div>
          </div>
        </div>

        {/* Indicador de Etapas Compacto */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          padding: '4px 9px',
          borderRadius: 14,
          fontSize: 11,
          fontWeight: 700,
          color: '#E8A33D',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {passo === 1 && '1. Escolha a Data'}
          {passo === 2 && '2. Escolha a Hora'}
          {passo === 3 && '3. Seus Dados'}
          {passo === 4 && '✓ Concluído'}
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL (DEDICADO & OTIMIZADO MOBILE) ── */}
      <main style={{ flex: 1, padding: '12px 14px 28px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        {/* ═══════════════════════════════════════════════════════════════════
            PASSO 1: CALENDÁRIO EM FORMATO COMPACTO (CABE NA PRIMEIRA PÁGINA)
        ═══════════════════════════════════════════════════════════════════ */}
        {passo === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F2B27', margin: 0 }}>
                Selecione o Dia Desejado
              </h2>
              <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                Toque na data para ver a disponibilidade de horários
              </div>
            </div>

            {/* Painel do Calendário */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1.5px solid #E5E0D5',
              padding: '12px 12px 14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              {/* Barra de Mês e Navegação */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                padding: '2px 4px'
              }}>
                <button
                  onClick={() => navegarMes(-1)}
                  disabled={anoAgenda === hojeAno && mesAgenda === hojeMes}
                  style={{
                    background: anoAgenda === hojeAno && mesAgenda === hojeMes ? '#F3F4F6' : '#F0FDF4',
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: anoAgenda === hojeAno && mesAgenda === hojeMes ? '#9CA3AF' : '#1F5C52',
                    cursor: anoAgenda === hojeAno && mesAgenda === hojeMes ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F2B27' }}>
                    {MESES[mesAgenda]} de {anoAgenda}
                  </div>
                </div>

                <button
                  onClick={() => navegarMes(1)}
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1F5C52',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Cabeçalho dos Dias da Semana */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                {diasSemana.map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: i === 0 || i === 6 ? '#9CA3AF' : '#64748B' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Grade dos Dias do Mês */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
                {Array.from({ length: offsetSemana }, (_, i) => (
                  <div key={`offset-${i}`} />
                ))}

                {Array.from({ length: totalDiasMes }, (_, i) => i + 1).map(dia => {
                  const diaStr = String(dia).padStart(2, '0');
                  const mesStr = String(mesAgenda + 1).padStart(2, '0');
                  const dataIso = `${anoAgenda}-${mesStr}-${diaStr}`;
                  
                  const isPassado = (
                    anoAgenda < hojeAno ||
                    (anoAgenda === hojeAno && mesAgenda < hojeMes) ||
                    (anoAgenda === hojeAno && mesAgenda === hojeMes && dia < hojeDia)
                  );
                  const isHoje = dataIso === hojeIso;
                  const isSelecionado = dataIso === dataSelecionada;

                  return (
                    <button
                      key={dia}
                      onClick={() => !isPassado && handleSelecionarDia(dia)}
                      disabled={isPassado}
                      style={{
                        height: 44,
                        borderRadius: 10,
                        border: isSelecionado 
                          ? '2px solid #0F2B27' 
                          : isHoje 
                            ? '1.5px solid #16A34A' 
                            : '1px solid #E2E8F0',
                        background: isPassado
                          ? '#F8FAFC'
                          : isSelecionado
                            ? '#0F2B27'
                            : isHoje
                              ? '#F0FDF4'
                              : '#FFFFFF',
                        color: isPassado
                          ? '#CBD5E1'
                          : isSelecionado
                            ? '#FAF8F3'
                            : isHoje
                              ? '#15803D'
                              : '#1F2937',
                        fontWeight: isSelecionado || isHoje ? 800 : 600,
                        fontSize: 13.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isPassado ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelecionado ? '0 3px 8px rgba(15,43,39,0.2)' : 'none'
                      }}
                    >
                      <span>{dia}</span>
                      {isHoje && (
                        <span style={{ fontSize: 8.5, color: isSelecionado ? '#FDE68A' : '#16A34A', fontWeight: 800, marginTop: -2 }}>
                          Hoje
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dica amigável */}
            <div style={{
              background: '#FEF9C3',
              border: '1px solid #FDE047',
              borderRadius: 10,
              padding: '8px 12px',
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11.5,
              color: '#854D0E'
            }}>
              <Sparkles size={15} color="#CA8A04" style={{ flexShrink: 0 }} />
              <span>Clique no dia desejado para ver os horários em tempo real.</span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PASSO 2: HORÁRIOS DISPONÍVEIS DO DIA (ÚNICA TELA / SEM DISTRAÇÕES)
        ═══════════════════════════════════════════════════════════════════ */}
        {passo === 2 && (
          <div>
            {/* Botão Voltar para Data */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <button
                onClick={() => setPasso(1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '6px 11px',
                  color: '#1F5C52',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> Trocar Data
              </button>

              <span style={{ fontSize: 12, fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '4px 10px', borderRadius: 8 }}>
                📅 {dataSelecionadaFormatada}
              </span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F2B27', margin: 0 }}>
                Qual o Melhor Horário para Você?
              </h2>
              <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                Toque no horário para avançar para a confirmação
              </div>
            </div>

            {/* Grade de Horários */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1.5px solid #E5E0D5',
              padding: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: 8 }}>
                {horariosDisponiveis.map(item => {
                  const isSel = horarioSelecionado === item.horario;

                  if (!item.disponivel) {
                    return (
                      <div
                        key={item.horario}
                        style={{
                          padding: '11px 8px',
                          borderRadius: 9,
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          color: '#94A3B8',
                          textAlign: 'center',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'not-allowed'
                        }}
                      >
                        <div style={{ textDecoration: 'line-through' }}>{item.horario}</div>
                        <div style={{ fontSize: 9.5, color: '#94A3B8', marginTop: 1 }}>{item.motivo}</div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.horario}
                      onClick={() => handleSelecionarHorario(item.horario)}
                      style={{
                        padding: '11px 8px',
                        borderRadius: 9,
                        border: isSel ? '2px solid #16A34A' : '1.5px solid #BBF7D0',
                        background: isSel ? '#16A34A' : '#F0FDF4',
                        color: isSel ? '#FFFFFF' : '#14532D',
                        textAlign: 'center',
                        fontSize: 13.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 4px rgba(22,163,74,0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} color={isSel ? '#fff' : '#16A34A'} />
                        <span>{item.horario}</span>
                      </div>
                      <div style={{ fontSize: 9.5, color: isSel ? '#E2E8F0' : '#15803D', fontWeight: 600 }}>
                        Disponível
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PASSO 3: SERVIÇO & SEUS DADOS (FINALIZAÇÃO)
        ═══════════════════════════════════════════════════════════════════ */}
        {passo === 3 && (
          <div>
            {/* Botão Voltar para Horários */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <button
                onClick={() => setPasso(2)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '6px 11px',
                  color: '#1F5C52',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> Trocar Horário
              </button>

              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0F2B27', background: '#E2E8F0', padding: '4px 10px', borderRadius: 8 }}>
                📅 {dataSelecionadaFormatada} às {horarioSelecionado}
              </span>
            </div>

            <form onSubmit={handleConfirmarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Seleção do Serviço */}
              <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E5E0D5', padding: '14px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F2B27', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={15} color="#E8A33D" />
                  <span>Selecione o Serviço</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 190, overflowY: 'auto' }}>
                  {listaServicos.map(s => {
                    const isSel = servicoSelecionado?.nome === s.nome;
                    return (
                      <div
                        key={s.nome}
                        onClick={() => setServicoSelecionado(s)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 9,
                          border: isSel ? '2px solid #16A34A' : '1px solid #E2E8F0',
                          background: isSel ? '#F0FDF4' : '#FAFAFA',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isSel ? '#14532D' : '#1F2937' }}>
                            {s.nome}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <Clock size={11} /> {s.duracaoMin} min
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#15803D' }}>
                            {s.valorSugerido > 0 ? formatBRL(s.valorSugerido) : 'A combinar'}
                          </div>
                          {isSel && (
                            <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', marginTop: 1 }}>
                              <Check size={12} /> Escolhido
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formulário de Identificação */}
              <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E5E0D5', padding: '14px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F2B27', marginBottom: 12 }}>
                  Seus Dados para Contato
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Nome Completo *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={clienteNome}
                      onChange={e => setClienteNome(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 36px',
                        borderRadius: 9,
                        border: '1.5px solid #CBD5E1',
                        fontSize: 13.5,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <User size={16} color="#94A3B8" style={{ position: 'absolute', left: 11, top: 13 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Seu WhatsApp com DDD *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      placeholder="(19) 99999-9999"
                      value={clienteTelefone}
                      onChange={e => handleTelefoneChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 36px',
                        borderRadius: 9,
                        border: '1.5px solid #CBD5E1',
                        fontSize: 13.5,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: 11, top: 13 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Observações / Preferências (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Primeira vez no espaço, prefiro atendimento rápido..."
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 9,
                      border: '1.5px solid #CBD5E1',
                      fontSize: 12.5,
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Botão de Confirmação */}
              <button
                type="submit"
                disabled={enviando}
                style={{
                  background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 14.5,
                  fontWeight: 800,
                  cursor: enviando ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(22,101,52,0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {enviando ? (
                  <span>Salvando agendamento...</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirmar Agendamento</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PASSO 4: SUCESSO & ENVIO NO WHATSAPP NATIVO DO CELULAR
        ═══════════════════════════════════════════════════════════════════ */}
        {passo === 4 && agendamentoConfirmado && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '6px auto 12px',
              border: '2px solid #86EFAC'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F2B27', margin: '0 0 4px' }}>
              Agendamento Confirmado!
            </h2>
            <p style={{ fontSize: 12, color: '#4B5563', margin: '0 0 16px' }}>
              Seu horário foi registrado na agenda de <strong>{nomeEmpresa}</strong>.
            </p>

            {/* Resumo da Reserva */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '14px', marginBottom: 16, textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F2B27', marginBottom: 8 }}>
                📋 Detalhes da sua Reserva:
              </div>
              <div style={{ fontSize: 12.5, color: '#334155', marginBottom: 4 }}>
                <strong>Serviço:</strong> {agendamentoConfirmado.servicoNome}
              </div>
              <div style={{ fontSize: 12.5, color: '#334155', marginBottom: 4 }}>
                <strong>Data & Hora:</strong> {agendamentoConfirmado.data.split('-').reverse().join('/')} às {agendamentoConfirmado.horario}
              </div>
              <div style={{ fontSize: 12.5, color: '#334155', marginBottom: 4 }}>
                <strong>Cliente:</strong> {agendamentoConfirmado.clienteNome}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#15803D', marginTop: 8 }}>
                Valor: {formatBRL(agendamentoConfirmado.valor)}
              </div>
            </div>

            {/* Ações: WhatsApp no Celular & Google Agenda */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={handleSalvarEEnviarWhatsApp}
                style={{
                  background: '#25D366',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '13px',
                  fontSize: 14,
                  fontWeight: 800,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <MessageCircle size={19} />
                <span>Abrir no WhatsApp da Empresa</span>
              </button>

              <a
                href={agendamentoService.gerarLinkGoogleCalendar(agendamentoConfirmado, empresa)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#FFFFFF',
                  color: '#1F2937',
                  border: '1px solid #CBD5E1',
                  borderRadius: 12,
                  padding: '11px',
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
                  setHorarioSelecionado('');
                  setAgendamentoConfirmado(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px',
                  marginTop: 4
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
