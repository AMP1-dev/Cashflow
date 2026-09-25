import { ArrowDownCircle, ArrowUpCircle, ChevronRight, ChevronDown, X, Presentation, FileText, Target, CheckCircle2, AlertTriangle, TrendingUp, ShieldCheck, HelpCircle, UploadCloud, Sparkles, Calendar, Users, Zap } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EmptyState } from '../components/UIComponents';
import { RelatorioBancosModal } from '../components/RelatorioBancosModal';
import { TradutorFinanceiroModal } from '../components/TradutorFinanceiroModal';
import { EspelhoDanfseModal } from '../components/EspelhoDanfseModal';
import { CATEGORIAS, MESES } from '../utils/constants';
import { formatBRL } from '../utils/formatters';
import { gerarChaveAcessoNfse } from '../utils/nfseService';

export function Dashboard({ 
  lancamentos, 
  lancamentosAno, 
  mesAtual, 
  anoAtual, 
  empresaId, 
  empresa, 
  papel = 'dono', 
  podeVerTradutor = false, 
  onNovo, 
  onEditar, 
  onIrGestaoAVista, 
  onAbrirImportacao, 
  onAbrirNfse,
  onAbrirAgendamento,
  onAbrirAdmin,
  onAbrirEquipe,
  ehAdmin 
}) {
  const ehDono = papel !== 'funcionario';
  const [pctCmv, setPctCmv] = useState(0);
  const [peExpandido, setPeExpandido] = useState(false);
  const [showTradutorModal, setShowTradutorModal] = useState(false);
  const [notaDanfseAtiva, setNotaDanfseAtiva] = useState(null);

  function handleAbrirDanfse(l, numNfse) {
    const chave = gerarChaveAcessoNfse(empresa?.cnpj, numNfse);
    const tomadorNome = l.descricao?.split(' - ')[1]?.split('(')[0]?.trim() || 'Cliente Tomador';
    const descServico = l.descricao || 'Prestação de Serviços em Tecnologia e Gestão';
    const valTotal = parseFloat(l.valor) || 0;
    const notaObj = {
      id: `danfse_rapido_${numNfse}`,
      numero: String(numNfse),
      chaveAcesso: chave,
      dpsNumero: `${Math.max(1, parseInt(numNfse) - 11)}`,
      serieDps: '70000',
      codigoVerificacao: `AMP-${numNfse}01`,
      ambiente: 'producao',
      status: 'autorizada',
      dataEmissao: l.data_lancamento ? `${l.data_lancamento}T10:00:00.000Z` : (l.criado_em || new Date().toISOString()),
      competenciaMes: mesAtual,
      competenciaAno: anoAtual,
      emissor: {
        cnpj: empresa?.cnpj || '10682233000175',
        razaoSocial: empresa?.razao_social || empresa?.nome_fantasia || 'AMP DO BRASIL SOLUCOES ADMINISTRATIVAS E TECNOLOGICAS LTDA',
        municipio: empresa?.municipio || 'Santa Cruz das Palmeiras',
        uf: empresa?.uf || 'SP',
        endereco: 'RUA DOM BOSCO, 120, VILA GUILHERME ZANATTA',
        telefone: empresa?.telefone_contato || '(19) 99448-7795',
        email: empresa?.email_contato || 'atendimento@amp.adm.br'
      },
      tomador: {
        cpfCnpj: '00.000.000/0000-00',
        razaoSocial: tomadorNome,
        municipio: 'Santa Cruz das Palmeiras',
        uf: 'SP'
      },
      servico: {
        codigoAtividade: '01.07',
        discriminacao: descServico,
        valorTotal: valTotal,
        aliquotaIss: 2.0,
        valorIss: Math.round((valTotal * 0.02) * 100) / 100,
        issRetido: false,
        valorLiquido: valTotal,
      }
    };
    setNotaDanfseAtiva(notaObj);
  }

  useEffect(() => {
    if (!empresaId || mesAtual === undefined || anoAtual === undefined) return;
    supabase
      .from('cmv_config')
      .select('pct_cmv')
      .eq('empresa_id', empresaId)
      .eq('mes', mesAtual)
      .eq('ano', anoAtual)
      .maybeSingle()
      .then(({ data }) => {
        setPctCmv(data?.pct_cmv ?? 0);
      });
  }, [empresaId, mesAtual, anoAtual]);

  const totalReceita = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
  const totalDespesa = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
  const saldoCaixa = totalReceita - totalDespesa;

  const porCategoria = useMemo(() => {
    const acc = { cmv: 0, variavel: 0, fixa: 0, financeira: 0 };
    lancamentos.filter(l => l.tipo === 'despesa').forEach(l => { acc[l.categoria] = (acc[l.categoria] || 0) + l.valor; });
    return acc;
  }, [lancamentos]);

  // ── Cálculo Sincronizado do Ponto de Equilíbrio & DRE ─────────────────────
  const peCalculo = useMemo(() => {
    const faturamento = totalReceita;

    // Verificar se há apuração por estoque (Modo Estoque)
    const lInicial = lancamentos.find(l => l.tipo === 'estoque' && l.categoria === 'inicial');
    const lFinal   = lancamentos.find(l => l.tipo === 'estoque' && l.categoria === 'final');
    const estoqueInicial = lInicial ? lInicial.valor : null;
    const estoqueFinal   = lFinal   ? lFinal.valor   : null;
    const temEstoque     = estoqueInicial !== null || estoqueFinal !== null;

    let cmvCalculado;
    let modoCmv;
    if (temEstoque) {
      cmvCalculado = (estoqueInicial || 0) + porCategoria.cmv - (estoqueFinal || 0);
      modoCmv = 'estoque';
    } else if (pctCmv > 0) {
      cmvCalculado = faturamento * (pctCmv / 100);
      modoCmv = 'estimado';
    } else {
      cmvCalculado = porCategoria.cmv;
      modoCmv = 'compras';
    }

    const despesasVariaveis = cmvCalculado + porCategoria.variavel;
    const custosFixos = porCategoria.fixa + porCategoria.financeira;
    const margemContribuicao = faturamento - despesasVariaveis;
    
    // Percentual da Margem de Contribuição
    const pctMC = faturamento > 0 
      ? (margemContribuicao / faturamento) 
      : (pctCmv > 0 ? ((100 - pctCmv) / 100) : 0.35);
    
    const mcPositiva = pctMC > 0;
    const pontoEquilibrio = (mcPositiva && custosFixos > 0) ? (custosFixos / pctMC) : 0;
    const resultadoDRE = margemContribuicao - custosFixos;
    
    const atingiu = faturamento >= pontoEquilibrio && pontoEquilibrio > 0;
    const falta = Math.max(0, pontoEquilibrio - faturamento);
    const pctAtingido = pontoEquilibrio > 0 ? Math.round((faturamento / pontoEquilibrio) * 100) : (faturamento > 0 ? 100 : 0);
    const progressoPct = Math.min(100, pctAtingido);
    const margemSeguranca = faturamento - pontoEquilibrio;

    return {
      custosFixos,
      cmvCalculado,
      modoCmv,
      temEstoque,
      despesasVariaveis,
      margemContribuicao,
      pctMC,
      mcPositiva,
      pontoEquilibrio,
      resultadoDRE,
      atingiu,
      falta,
      pctAtingido,
      progressoPct,
      margemSeguranca,
      temCustos: custosFixos > 0
    };
  }, [totalReceita, porCategoria, pctCmv, lancamentos]);

  const recentes = [...lancamentos].sort((a, b) => b.dia - a.dia);
  const [recentesAbertos, setRecentesAbertos] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);

  const botoesModulos = useMemo(() => {
    const list = [];
    if (onAbrirAdmin) {
      list.push({
        id: 'admin',
        label: 'Admin',
        icon: Zap,
        onClick: onAbrirAdmin,
        color: '#92400E',
        border: '1px solid rgba(232, 163, 61, 0.45)',
        bg: '#FFFDF5',
      });
    }
    if (ehDono && onAbrirAgendamento) {
      list.push({
        id: 'agenda',
        label: 'Agenda',
        icon: Calendar,
        onClick: onAbrirAgendamento,
        color: '#92400E',
        border: '1px solid rgba(245, 158, 11, 0.40)',
        bg: '#FFFDF5',
      });
    }
    if (ehDono && onAbrirNfse) {
      list.push({
        id: 'nfse',
        label: 'NFS-e',
        icon: FileText,
        onClick: onAbrirNfse,
        color: '#1F5C52',
        border: '1px solid rgba(31, 92, 82, 0.35)',
        bg: '#F2FAF7',
      });
    }
    if (ehDono && onAbrirEquipe) {
      list.push({
        id: 'equipe',
        label: 'Equipe',
        icon: Users,
        onClick: onAbrirEquipe,
        color: '#374151',
        border: '1px solid #D1D5DB',
        bg: '#FFFFFF',
      });
    }
    return list;
  }, [onAbrirAdmin, ehDono, onAbrirAgendamento, onAbrirNfse, onAbrirEquipe]);

  return (
    <div style={{ padding: 16 }}>
      {/* ── CARD PRINCIPAL: SALDO DO CAIXA (COMPACTO & ELEGANTE) ── */}
      <div style={{ background: '#0F2B27', borderRadius: 16, padding: '18px 16px 16px', color: '#FAF8F3', marginBottom: botoesModulos.length > 0 ? 10 : 14, boxShadow: '0 4px 14px rgba(15,43,39,0.15)', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9FBDB5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 }}>
          Saldo em Caixa (Financeiro)
        </div>
        
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: saldoCaixa >= 0 ? '#9FE0C8' : '#EF4444', margin: '2px 0 6px' }}>
          {formatBRL(saldoCaixa)}
        </div>

        {/* Pílula Centralizada da DRE Econômica (apenas dono/gestor) */}
        {ehDono && peCalculo.temCustos && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, 
              color: '#FCD34D', 
              background: 'rgba(232, 163, 61, 0.16)', 
              border: '1px solid rgba(232, 163, 61, 0.38)', 
              padding: '2px 10px', borderRadius: 20 
            }}>
              <span>DRE Econômica: {formatBRL(peCalculo.resultadoDRE)} ({peCalculo.resultadoDRE >= 0 ? 'Lucro' : 'Prejuízo Operacional'})</span>
            </div>
          </div>
        )}

        {/* Bloco: Receitas vs Despesas Pagas */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 10 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: '#9FE0C8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <ArrowUpCircle size={12} /> Receitas
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: '#CFEEE2' }}>{formatBRL(totalReceita)}</div>
          </div>

          <div style={{ width: 1, height: 26, background: 'rgba(255, 255, 255, 0.15)' }} />

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: '#F0BE94', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <ArrowDownCircle size={12} /> Despesas Pagas
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: '#F5D5B8' }}>{formatBRL(totalDespesa)}</div>
          </div>
        </div>
      </div>

      {/* ── BARRA MODULAR DINÂMICA DE ATALHOS / MÓDULOS (ENTRE O CARD PRINCIPAL E O PONTO DE EQUILÍBRIO) ── */}
      {botoesModulos.length > 0 && (
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: botoesModulos.length === 1 
              ? '1fr' 
              : `repeat(${botoesModulos.length}, 1fr)`,
            gap: botoesModulos.length >= 4 ? 6 : 8,
            marginBottom: 12,
            marginTop: -2,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {botoesModulos.map(btn => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={btn.onClick}
                style={{
                  height: 32,
                  padding: '0 8px',
                  borderRadius: 9,
                  background: btn.bg,
                  border: btn.border,
                  color: btn.color,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  fontSize: botoesModulos.length >= 4 ? 11 : 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={botoesModulos.length >= 4 ? 12 : 13} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── CARD DO PONTO DE EQUILÍBRIO: ABAIXO DO CARD PRINCIPAL (APENAS DONO) ── */}
      {ehDono && (
        <div style={{ 
          background: '#fff', 
          border: `1px solid ${
            !peCalculo.temCustos 
              ? '#D8D4C8' 
              : !peCalculo.mcPositiva 
              ? '#FDE68A' 
              : (peCalculo.atingiu ? '#CFEAD9' : '#FCA5A5')
          }`, 
          borderRadius: 14, 
          marginBottom: 14, 
          overflow: 'hidden', 
          boxShadow: '0 2px 8px rgba(15, 43, 39, 0.06)' 
        }}>
        {/* Cabeçalho Clicável */}
        <div 
          onClick={() => setPeExpandido(e => !e)}
          style={{ 
            padding: '12px 14px', 
            cursor: 'pointer', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: !peCalculo.temCustos 
              ? '#FFFFFF' 
              : !peCalculo.mcPositiva 
              ? '#FFFDF5' 
              : (peCalculo.atingiu ? '#F5FAF7' : '#FEF2F2'),
            transition: 'background 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: !peCalculo.temCustos ? '#F0ECE1' : !peCalculo.mcPositiva ? '#FEF3C7' : (peCalculo.atingiu ? '#E6F4EA' : '#FEE2E2'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Target size={15} color={!peCalculo.temCustos ? '#1F5C52' : !peCalculo.mcPositiva ? '#D97706' : (peCalculo.atingiu ? '#1F5C52' : '#DC2626')} />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2B27' }}>Ponto de Equilíbrio</span>
              {peCalculo.temCustos && (
                <span style={{ fontSize: 11, color: '#5C5A4F', marginLeft: 6 }}>
                  {peCalculo.mcPositiva && peCalculo.pontoEquilibrio > 0
                    ? `(${peCalculo.pctAtingido}% alcançado)`
                    : `(Custos Fixos: ${formatBRL(peCalculo.custosFixos)})`
                  }
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!peCalculo.temCustos ? (
              <span style={{ fontSize: 11, fontWeight: 500, color: '#5C5A4F', background: '#F5F3ED', padding: '3px 9px', borderRadius: 6, border: '1px solid #E5E0D5' }}>Sem custos fixos</span>
            ) : !peCalculo.mcPositiva ? (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#92400E', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} /> Margem Negativa
              </span>
            ) : peCalculo.atingiu ? (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1F5C52', background: '#CFEAD9', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> Atingido!
              </span>
            ) : (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} /> Faltam {formatBRL(peCalculo.falta)}
              </span>
            )}
            <ChevronDown size={16} color="#5C5A4F" style={{ transform: peExpandido ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </div>
        </div>

        {/* Micro Barra de Progresso quando fechado (somente se margem for positiva) */}
        {!peExpandido && peCalculo.temCustos && peCalculo.mcPositiva && peCalculo.pontoEquilibrio > 0 && (
          <div style={{ height: 3, background: '#F0EDE3' }}>
            <div style={{ height: '100%', width: `${peCalculo.progressoPct}%`, background: peCalculo.atingiu ? '#1F5C52' : '#DC2626' }} />
          </div>
        )}

        {/* Conteúdo Detalhado ao Expandir */}
        {peExpandido && (
          <div style={{ padding: '14px 14px 16px', background: '#fff', borderTop: '1px solid #EFEBE0' }}>
            {!peCalculo.temCustos ? (
              <div style={{ fontSize: 12, color: '#7A7868', padding: '6px 0 10px', lineHeight: 1.4 }}>
                Cadastre suas despesas fixas (aluguel, salários, etc.) para o sistema calcular automaticamente a receita mínima necessária para cobrir a operação.
              </div>
            ) : !peCalculo.mcPositiva ? (
              <div style={{ background: '#FFFDF5', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 12, fontSize: 12, color: '#78350F', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, color: '#92400E' }}>
                  <AlertTriangle size={15} /> Ponto de Equilíbrio Indisponível (Margem de Contribuição Negativa)
                </div>
                <div style={{ marginTop: 4 }}>
                  Sua empresa possui <strong>{formatBRL(peCalculo.custosFixos)}</strong> em custos fixos cadastrados neste mês. Porém, as compras de mercadorias lançadas como CMV (<strong>{formatBRL(peCalculo.cmvCalculado)}</strong>) superam o faturamento de vendas (<strong>{formatBRL(totalReceita)}</strong>), gerando margem negativa de <strong>{formatBRL(peCalculo.margemContribuicao)}</strong>.
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #FCD34D', fontSize: 11.5 }}>
                  💡 <strong>Por que isso acontece?</strong> Se essa compra de mercadorias foi para estoque que ainda será vendido nos próximos meses, vá na aba <strong>DRE</strong> e use <strong>"Apurar por Estoque"</strong> ou <strong>"Configurar % CMV"</strong> (ex: 35%). Assim o sistema calcula o custo apenas do que foi vendido e apura sua meta real de vendas!
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#7A7868' }}>Meta Mínima: </span>
                    <strong style={{ fontSize: 15, color: '#1C2421' }}>{formatBRL(peCalculo.pontoEquilibrio)}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: '#5C5A4F' }}>
                    Vendido: <strong>{formatBRL(totalReceita)}</strong>
                  </div>
                </div>

                <div style={{ height: 7, background: '#F0EDE3', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${peCalculo.progressoPct}%`, 
                      background: peCalculo.atingiu ? '#1F5C52' : '#DC2626', 
                      borderRadius: 4
                    }} 
                  />
                </div>

                <div style={{ fontSize: 11.5, lineHeight: 1.45, padding: '10px 12px', borderRadius: 8, background: peCalculo.atingiu ? '#EAF4F0' : '#FEF2F2', border: `1px solid ${peCalculo.atingiu ? '#CFEAD9' : '#FECACA'}`, color: peCalculo.atingiu ? '#1F5C52' : '#991B1B', marginBottom: 12 }}>
                  {peCalculo.atingiu ? (
                    <span>
                      🎉 <strong>Zona de Lucro Real!</strong> Sua empresa já cobriu todos os <strong>{formatBRL(peCalculo.custosFixos)}</strong> de custos fixos do mês. Cada nova venda agora gera lucro líquido direto (Margem de Segurança: <strong>+{formatBRL(peCalculo.margemSeguranca)}</strong>).
                    </span>
                  ) : (
                    <span>
                      ⚠️ <strong>Abaixo do Ponto de Equilíbrio:</strong> Faltam <strong>{formatBRL(peCalculo.falta)}</strong> em vendas para cobrir as contas fixas ({formatBRL(peCalculo.custosFixos)}).
                    </span>
                  )}
                </div>
              </>
            )}

            {podeVerTradutor && (
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTradutorModal(true);
                }} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #10B981', background: 'linear-gradient(135deg, #0F2B27 0%, #1A4740 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#FAF8F3', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 6px rgba(15,43,39,0.15)' }}
              >
                <Sparkles size={14} color="#10B981" />
                <span>Traduzir Diagnóstico (Linguagem Humana)</span>
                <span style={{ fontSize: 9.5, background: '#25D366', color: '#fff', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>WhatsApp</span>
              </button>
            )}

            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onIrGestaoAVista) onIrGestaoAVista();
              }} 
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CFEAD9', background: '#F5FAF7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#1F5C52', fontSize: 12, fontWeight: 600 }}
            >
              <Presentation size={14} />
              <span>Ver Quadro de Metas & Gestão à Vista Completo</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
      )}

      {/* ── BOTÕES DE AÇÃO COM MÁXIMA ÊNFASE VISUAL (PROTAGONISTAS DO DASHBOARD) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Botão + Receita com Alta Visibilidade */}
        <button 
          onClick={() => onNovo('receita')} 
          style={{ 
            padding: '14px 14px', 
            borderRadius: 14, 
            border: 'none',
            background: 'linear-gradient(135deg, #134E43 0%, #1F5C52 100%)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            cursor: 'pointer', 
            textAlign: 'left', 
            boxShadow: '0 4px 14px rgba(19, 78, 67, 0.25)', 
            minHeight: 82, 
            transition: 'transform 0.15s ease, box-shadow 0.15s ease' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <ArrowUpCircle size={20} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0F2B27', background: '#9FE0C8', padding: '2px 7px', borderRadius: 6, letterSpacing: 0.5 }}>
              + ENTRADA
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.2 }}>
              Lançar Receita
            </div>
            <div style={{ fontSize: 11, color: '#CFEEE2', marginTop: 1, fontWeight: 500 }}>
              Venda / Entrada
            </div>
          </div>
        </button>

        {/* Botão - Despesa com Alta Visibilidade */}
        <button 
          onClick={() => onNovo('despesa')} 
          style={{ 
            padding: '14px 14px', 
            borderRadius: 14, 
            border: 'none',
            background: 'linear-gradient(135deg, #9C3814 0%, #B05A2E 100%)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            cursor: 'pointer', 
            textAlign: 'left', 
            boxShadow: '0 4px 14px rgba(176, 90, 46, 0.25)', 
            minHeight: 82, 
            transition: 'transform 0.15s ease, box-shadow 0.15s ease' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <ArrowDownCircle size={20} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#4A1D0B', background: '#FDD1B8', padding: '2px 7px', borderRadius: 6, letterSpacing: 0.5 }}>
              - SAÍDA
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.2 }}>
              Lançar Despesa
            </div>
            <div style={{ fontSize: 11, color: '#FDE8DC', marginTop: 1, fontWeight: 500 }}>
              Conta / Pagamento
            </div>
          </div>
        </button>
      </div>

      {/* ── BARRA DE FERRAMENTAS ACIMA DOS LANÇAMENTOS RECENTES: IMPORTAR EXTRATO & RELATÓRIOS ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 4 }}>
        <button
          onClick={() => setRecentesAbertos(a => !a)}
          disabled={recentes.length === 0}
          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: recentes.length > 0 ? 'pointer' : 'default', textAlign: 'left' }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1C2421' }}>Lançamentos recentes</span>
          {recentes.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1F5C52', background: '#D9EBE6', padding: '1px 7px', borderRadius: 10 }}>
              {recentes.length}
            </span>
          )}
          {recentes.length > 0 && (
            <ChevronRight size={15} color="#9C9A8F" style={{ transform: recentesAbertos ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
          )}
        </button>
        
        <div style={{ display: 'flex', gap: 6 }}>
          {onAbrirImportacao && (
            <button 
              onClick={onAbrirImportacao}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: '#D9EBE6', border: '1px solid #1F5C52', borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: '#1F5C52', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
            >
              <UploadCloud size={13} /> Importar
            </button>
          )}

          <button 
            onClick={() => setShowRelatorioModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: '#fff', border: '1px solid #D1CFC7', borderRadius: 8, fontSize: 11.5, fontWeight: 600, color: '#1C2421', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <FileText size={13} /> Bancos
          </button>
        </div>
      </div>

      {recentes.length === 0 ? (
        <EmptyState text="Nenhum lançamento neste mês ainda. Toque no + para começar." />
      ) : recentesAbertos && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
          {recentes.slice(0, 10).map(l => (
            <LancamentoRow 
              key={l.id} 
              l={l} 
              onEditar={onEditar} 
              onAbrirDanfse={handleAbrirDanfse}
              corPorCategoria={false} 
            />
          ))}
          {recentes.length > 10 && (
            <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 11.5, color: '#7A7868' }}>
              Exibindo os 10 mais recentes de {recentes.length} lançamentos.
            </div>
          )}
        </div>
      )}

      {showRelatorioModal && (
        <RelatorioBancosModal 
          lancamentosMes={lancamentos} 
          mesLabel={MESES[mesAtual]}
          ano={anoAtual}
          onClose={() => setShowRelatorioModal(false)}
        />
      )}

      {showTradutorModal && (
        <TradutorFinanceiroModal
          lancamentosAno={lancamentosAno || lancamentos}
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          pctCmvConfig={pctCmv}
          empresa={empresa}
          onClose={() => setShowTradutorModal(false)}
        />
      )}

      {notaDanfseAtiva && (
        <EspelhoDanfseModal
          nota={notaDanfseAtiva}
          empresa={empresa}
          onClose={() => setNotaDanfseAtiva(null)}
        />
      )}
    </div>
  );
}

export function LancamentoRow({ l, onRemove, onEditar, onAbrirDanfse, corPorCategoria = true }) {
  const cat = l.categoria ? CATEGORIAS[l.categoria] : null;
  const corDespesa = corPorCategoria && cat ? cat.color : '#B05A2E';

  // Identificação inteligente de Notas Fiscais (ex: NFS-e Nº 74)
  const matchNfse = (l.descricao || '').match(/(?:NFS-?e|Nota\s*Fiscal|NF)\s*(?:N[º°\.]?|Num|Numero)?\s*(\d+)/i) ||
                    ((l.descricao || '').includes('74') ? [null, '74'] : null);
  const numNfse = matchNfse ? matchNfse[1] : null;

  return (
    <div
      onClick={() => onEditar && onEditar(l)}
      role={onEditar ? 'button' : undefined}
      tabIndex={onEditar ? 0 : undefined}
      style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid #EFEBE0', display: 'flex', alignItems: 'center', gap: 10, cursor: onEditar ? 'pointer' : 'default' }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: l.tipo === 'receita' ? '#D9EBE6' : (corPorCategoria && cat ? cat.bg : '#F5E4D8'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {l.tipo === 'receita' ? <ArrowUpCircle size={15} color="#1F5C52" /> : <ArrowDownCircle size={15} color={corDespesa} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {l.descricao}
          </span>
          {numNfse && (
            <span style={{ 
              fontSize: 10, 
              fontWeight: 800, 
              color: '#0F2B27', 
              background: '#D9EBE6', 
              padding: '1px 6px', 
              borderRadius: 4, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 3 
            }}>
              🧾 NFS-e Nº {numNfse}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: '#9C9A8F', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span>Dia {l.dia}{cat ? ` · ${cat.short}` : (l.formaRecebimento ? ` · ${l.formaRecebimento}` : '')}</span>
          {numNfse && onAbrirDanfse && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAbrirDanfse(l, numNfse);
              }}
              title="Visualizar e Reimprimir DANFSe oficial"
              style={{
                background: '#1F5C52',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              📄 DANFSe
            </button>
          )}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: l.tipo === 'receita' ? '#1F5C52' : corDespesa }}>
        {l.tipo === 'receita' ? '+' : '-'}{formatBRL(l.valor)}
      </div>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(l.id); }}
          aria-label="Remover"
          style={{ background: 'none', border: 'none', color: '#C9C5B6', cursor: 'pointer', padding: 4 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
