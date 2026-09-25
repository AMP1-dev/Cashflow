import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Plus, RefreshCw, CheckCircle, ShieldCheck, Download, 
  ExternalLink, Trash2, Calendar, Search, ArrowRight, ArrowLeft, Printer, 
  AlertCircle, MessageCircle, FileSpreadsheet, Copy, Check 
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { 
  formatarCpfCnpj, 
  nfseService, 
  resolverDescricaoRecorrente, 
  gerarLinkWhatsAppNfse 
} from '../utils/nfseService';
import { MESES } from '../utils/constants';
import { EmitirNfseModal } from '../components/EmitirNfseModal';
import { EspelhoDanfseModal } from '../components/EspelhoDanfseModal';
import { RelatorioNfseModal } from '../components/RelatorioNfseModal';

export function NfseScreen({ 
  empresa, 
  mesAtual, 
  anoAtual, 
  lancamentos = [],
  onAdicionarReceitaAoCaixa,
  onVoltar
}) {
  const [abaAtiva, setAbaAtiva] = useState('emitidas'); // 'emitidas' | 'recorrentes'
  const [notas, setNotas] = useState([]);
  const [recorrencias, setRecorrencias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Modais
  const [showEmitirModal, setShowEmitirModal] = useState(false);
  const [dadosIniciaisEmissao, setDadosIniciaisEmissao] = useState(null);
  const [notaSelecionadaDanfse, setNotaSelecionadaDanfse] = useState(null);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);

  // Filtros de Busca e Faixa de Datas
  const [termoBusca, setTermoBusca] = useState('');
  const [dataInicioFiltro, setDataInicioFiltro] = useState('');
  const [dataFimFiltro, setDataFimFiltro] = useState('');
  const [copiadoId, setCopiadoId] = useState(null);

  // Carrega dados da empresa (Banco Supabase + LocalStorage + Reconciliação dos lançamentos)
  async function recarregarDados() {
    if (!empresa?.id) return;
    setCarregando(true);
    try {
      const n = await nfseService.getNotasAsync(empresa.id, lancamentos, empresa);
      const r = nfseService.getRecorrencias(empresa.id);
      setNotas(n);
      setRecorrencias(r);
    } catch (e) {
      console.warn('Erro ao carregar notas:', e);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    recarregarDados();
  }, [empresa?.id, lancamentos?.length]);

  // Filtragem combinada: Texto + Faixa de Data
  const notasFiltradas = useMemo(() => {
    return notas.filter(n => {
      // Filtro de texto
      if (termoBusca) {
        const termo = termoBusca.toLowerCase().trim();
        const num = String(n.numero || '').toLowerCase();
        const tomador = (n.tomador?.razaoSocial || '').toLowerCase();
        const doc = (n.tomador?.cpfCnpj || '').replace(/\D/g, '');
        const chave = (n.chaveAcesso || '').toLowerCase();
        const desc = (n.servico?.discriminacao || '').toLowerCase();

        const match = num.includes(termo) || 
                      tomador.includes(termo) || 
                      doc.includes(termo.replace(/\D/g, '')) || 
                      chave.includes(termo) ||
                      desc.includes(termo);
        if (!match) return false;
      }

      // Filtro de faixa de data
      if (n.dataEmissao) {
        const dataStr = n.dataEmissao.split('T')[0];
        if (dataInicioFiltro && dataStr < dataInicioFiltro) return false;
        if (dataFimFiltro && dataStr > dataFimFiltro) return false;
      }

      return true;
    });
  }, [notas, termoBusca, dataInicioFiltro, dataFimFiltro]);

  // Total emitido no mês atual
  const totalMes = useMemo(() => {
    return notas
      .filter(n => {
        if (n.competenciaMes !== undefined) return n.competenciaMes === mesAtual && (!n.competenciaAno || n.competenciaAno === anoAtual);
        if (n.dataEmissao) {
          const d = new Date(n.dataEmissao);
          return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        }
        return false;
      })
      .reduce((s, n) => s + (n.servico?.valorTotal || 0), 0);
  }, [notas, mesAtual, anoAtual]);

  // Dispara emissão a partir de um contrato recorrente
  function handleEmitirRecorrencia(rec) {
    const desc = resolverDescricaoRecorrente(rec.discriminacaoTemplate, mesAtual, anoAtual);
    setDadosIniciaisEmissao({
      cpfCnpj: rec.cpfCnpj,
      razaoSocial: rec.cliente,
      email: rec.email,
      telefone: rec.telefone,
      valor: rec.valor,
      discriminacao: desc,
      codigoAtividade: rec.codigoAtividade,
      aliquotaIss: rec.aliquotaIss,
      mesCompetencia: mesAtual,
    });
    setShowEmitirModal(true);
  }

  // Ao emitir com sucesso
  function handleSucessoEmissao(novaNota, dadosLancamento) {
    setShowEmitirModal(false);
    recarregarDados();
    setNotaSelecionadaDanfse(novaNota);

    // Se o usuário quiser, adiciona no caixa
    if (onAdicionarReceitaAoCaixa) {
      onAdicionarReceitaAoCaixa({
        tipo: 'receita',
        descricao: `NFS-e Nº ${novaNota.numero} - ${dadosLancamento.tomador} (${dadosLancamento.descricao})`,
        valor: dadosLancamento.valor,
        mes: dadosLancamento.mes,
        dia: dadosLancamento.dia,
        formaRecebimento: 'À vista/PIX',
      });
    }
  }

  function handleRemoverRecorrencia(id) {
    if (confirm('Deseja realmente remover este contrato recorrente?')) {
      nfseService.removerRecorrencia(empresa.id, id);
      recarregarDados();
    }
  }

  function handleCopiarChave(chave, id, e) {
    e.stopPropagation();
    if (!chave) return;
    navigator.clipboard.writeText(chave);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  }

  return (
    <div style={{ padding: '16px 16px 36px', maxWidth: 760, margin: '0 auto' }}>
      
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
          <ArrowLeft size={16} /> Voltar ao Painel Principal
        </button>
      )}

      {/* ── CARD PRINCIPAL: TOTAL DE NOTAS DO MÊS & AÇÕES RÁPIDAS ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2B27 0%, #173E38 100%)',
        borderRadius: 16,
        padding: '18px 20px',
        color: '#FAF8F3',
        marginBottom: 16,
        boxShadow: '0 4px 14px rgba(15,43,39,0.15)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9FBDB5', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Total Faturado em NFS-e ({MESES[mesAtual]} / {anoAtual})
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#9FE0C8', marginTop: 2 }}>
            {formatBRL(totalMes)}
          </div>
          <div style={{ fontSize: 11.5, color: '#D9EBE6', marginTop: 4 }}>
            {notas.length} nota(s) registrada(s) na base • Chaves salvas com segurança
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowRelatorioModal(true)}
            title="Exportar Relatório em Excel e PDF"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 12,
              padding: '11px 14px',
              color: '#FAF8F3',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileSpreadsheet size={15} color="#9FE0C8" />
            <span>Relatório & Excel</span>
          </button>

          <button
            onClick={() => { setDadosIniciaisEmissao(null); setShowEmitirModal(true); }}
            style={{
              background: 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)',
              border: 'none',
              borderRadius: 12,
              padding: '11px 16px',
              color: '#FAF8F3',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Plus size={16} /> Emitir NFS-e
          </button>
        </div>
      </div>

      {/* ── NAVEGAÇÃO DE ABAS INTERNAS ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: '#EFECE6', padding: 4, borderRadius: 10 }}>
        <button
          onClick={() => setAbaAtiva('emitidas')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 8,
            border: 'none',
            background: abaAtiva === 'emitidas' ? '#fff' : 'transparent',
            color: abaAtiva === 'emitidas' ? '#0F2B27' : '#7A7868',
            fontWeight: abaAtiva === 'emitidas' ? 700 : 500,
            fontSize: 12.5,
            cursor: 'pointer',
            boxShadow: abaAtiva === 'emitidas' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          Notas Fiscais Emitidas ({notas.length})
        </button>

        <button
          onClick={() => setAbaAtiva('recorrentes')}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 8,
            border: 'none',
            background: abaAtiva === 'recorrentes' ? '#fff' : 'transparent',
            color: abaAtiva === 'recorrentes' ? '#0F2B27' : '#7A7868',
            fontWeight: abaAtiva === 'recorrentes' ? 700 : 500,
            fontSize: 12.5,
            cursor: 'pointer',
            boxShadow: abaAtiva === 'recorrentes' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          Fila Recorrente Mensal ({recorrencias.length})
        </button>
      </div>

      {/* ── ABA 1: NOTAS EMITIDAS ── */}
      {abaAtiva === 'emitidas' && (
        <div>
          {/* Barra de Filtros: Busca Textual + Faixa de Datas */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E5E0D5',
            borderRadius: 12,
            padding: 12,
            marginBottom: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            {/* Campo de Busca Rápida */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#9C9A8F" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                placeholder="Buscar por cliente, CNPJ/CPF, número da nota ou chave..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FAF8F3',
                  fontSize: 12.5,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Faixa de Datas */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#4B5563' }}>Filtrar Data:</span>
                <input
                  type="date"
                  value={dataInicioFiltro}
                  onChange={e => setDataInicioFiltro(e.target.value)}
                  style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 11.5 }}
                />
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>até</span>
                <input
                  type="date"
                  value={dataFimFiltro}
                  onChange={e => setDataFimFiltro(e.target.value)}
                  style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 11.5 }}
                />
              </div>

              {/* Botões Rápidos */}
              <div style={{ display: 'flex', gap: 5 }}>
                <button
                  onClick={() => {
                    const h = new Date();
                    setDataInicioFiltro(new Date(h.getFullYear(), h.getMonth(), 1).toISOString().split('T')[0]);
                    setDataFimFiltro(new Date(h.getFullYear(), h.getMonth() + 1, 0).toISOString().split('T')[0]);
                  }}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#1E293B' }}
                >
                  Mês Atual
                </button>
                <button
                  onClick={() => {
                    setDataInicioFiltro(new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0]);
                    setDataFimFiltro(new Date().toISOString().split('T')[0]);
                  }}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#1E293B' }}
                >
                  30 Dias
                </button>
                {(dataInicioFiltro || dataFimFiltro || termoBusca) && (
                  <button
                    onClick={() => { setDataInicioFiltro(''); setDataFimFiltro(''); setTermoBusca(''); }}
                    style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#92400E' }}
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          {notasFiltradas.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E5E0D5', borderRadius: 14, padding: '36px 16px', textAlign: 'center' }}>
              <FileText size={36} color="#9C9A8F" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2421' }}>
                {carregando ? 'Carregando notas fiscais...' : 'Nenhuma nota fiscal encontrada'}
              </div>
              <div style={{ fontSize: 12, color: '#7A7868', marginTop: 4 }}>
                {termoBusca || dataInicioFiltro || dataFimFiltro 
                  ? 'Nenhum resultado corresponde aos filtros selecionados acima.'
                  : 'Toque em + Emitir NFS-e para gerar sua primeira nota autorizada.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notasFiltradas.map(n => {
                const dataFormatada = n.dataEmissao 
                  ? new Date(n.dataEmissao).toLocaleDateString('pt-BR') 
                  : '—';
                const horaFormatada = n.dataEmissao 
                  ? new Date(n.dataEmissao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                  : '';
                const chave = n.chaveAcesso || '';
                const chaveResumo = chave ? `${chave.slice(0, 14)}...${chave.slice(-10)}` : '';

                return (
                  <div
                    key={n.id || n.numero}
                    style={{
                      background: '#fff',
                      border: '1.5px solid #E5E0D5',
                      borderRadius: 14,
                      padding: '14px 16px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    {/* Linha Superior: Cabeçalho com Número, Data e Valor */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                          <span style={{ 
                            fontSize: 12, 
                            fontWeight: 800, 
                            color: '#0F2B27', 
                            background: '#D9EBE6', 
                            padding: '3px 8px', 
                            borderRadius: 6 
                          }}>
                            NFS-e Nº {n.numero}
                          </span>
                          <span style={{ fontSize: 11, color: '#6B7280' }}>
                            {dataFormatada} {horaFormatada ? `às ${horaFormatada}` : ''}
                          </span>
                          <span style={{ 
                            fontSize: 10.5, 
                            fontWeight: 700, 
                            color: '#059669', 
                            background: '#ECFDF5', 
                            padding: '2px 6px', 
                            borderRadius: 4, 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: 3 
                          }}>
                            <CheckCircle size={10} /> Autorizada
                          </span>
                        </div>

                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginTop: 5 }}>
                          {n.tomador?.razaoSocial || 'Cliente'}
                        </div>

                        {n.tomador?.cpfCnpj && (
                          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                            CNPJ/CPF: {formatarCpfCnpj(n.tomador.cpfCnpj)}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: '#0F2B27', fontFamily: 'Georgia, serif' }}>
                          {formatBRL(n.servico?.valorTotal || 0)}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 2 }}>
                          Líquido: {formatBRL(n.servico?.valorLiquido || n.servico?.valorTotal || 0)}
                        </div>
                      </div>
                    </div>

                    {/* Discriminação do Serviço */}
                    <div style={{ 
                      fontSize: 11.5, 
                      color: '#4B5563', 
                      background: '#F9FAFB', 
                      padding: '8px 10px', 
                      borderRadius: 8,
                      border: '1px solid #F3F4F6'
                    }}>
                      <strong style={{ color: '#1F2937' }}>Serviço:</strong> {n.servico?.discriminacao || 'Prestação de Serviços em Tecnologia e Gestão'}
                    </div>

                    {/* Chave de Acesso Oficial (50 dígitos) */}
                    {chave && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#FAF8F3',
                        border: '1px dashed #D8D4C8',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 11
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4B5563' }}>
                          <span style={{ fontWeight: 700, color: '#1F5C52' }}>Chave SPED:</span>
                          <span style={{ fontFamily: 'monospace' }} title={chave}>{chaveResumo}</span>
                        </div>

                        <button
                          onClick={(e) => handleCopiarChave(chave, n.id || n.numero, e)}
                          title="Copiar chave de acesso completa (50 dígitos)"
                          style={{
                            background: copiadoId === (n.id || n.numero) ? '#10B981' : '#E2E8F0',
                            border: 'none',
                            borderRadius: 5,
                            padding: '3px 8px',
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: copiadoId === (n.id || n.numero) ? '#fff' : '#1E293B',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          {copiadoId === (n.id || n.numero) ? (
                            <>
                              <Check size={11} /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy size={11} /> Copiar Chave
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Botões de Ação: Reimpressão / DANFSe e WhatsApp */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      gap: 8, 
                      paddingTop: 4, 
                      borderTop: '1px solid #F3F4F6' 
                    }}>
                      <button
                        onClick={() => setNotaSelecionadaDanfse(n)}
                        style={{
                          background: '#1F5C52',
                          border: 'none',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '7px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(31,92,82,0.2)'
                        }}
                      >
                        <Printer size={13} />
                        <span>Reimpressão / DANFSe</span>
                      </button>

                      <button
                        onClick={() => {
                          const link = gerarLinkWhatsAppNfse(n, empresa);
                          if (link) window.open(link, '_blank');
                        }}
                        style={{
                          background: '#25D366',
                          border: 'none',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '7px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          cursor: 'pointer'
                        }}
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ABA 2: RECORRÊNCIAS / MENSALISTAS ── */}
      {abaAtiva === 'recorrentes' && (
        <div>
          <div style={{ background: '#FFFDF5', border: '1px solid #FDE68A', borderRadius: 10, padding: '10px 12px', marginBottom: 12, fontSize: 11.5, color: '#78350F', lineHeight: 1.45 }}>
            💡 <strong>Emissão em 1 Clique:</strong> Seus clientes recorrentes ficam salvos aqui. Ao virar o mês, o sistema atualiza o texto de competência (ex: <em>{MESES[mesAtual]}</em>) e você só precisa confirmar a emissão!
          </div>

          {recorrencias.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E5E0D5', borderRadius: 14, padding: '28px 16px', textAlign: 'center' }}>
              <RefreshCw size={32} color="#9C9A8F" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1C2421' }}>Nenhum contrato recorrente cadastrado</div>
              <div style={{ fontSize: 11.5, color: '#7A7868', marginTop: 4 }}>
                Ao emitir uma nota fiscal, marque a opção <strong>"Salvar como Nota Recorrente Mensal"</strong>.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recorrencias.map(r => (
                <div
                  key={r.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #E5E0D5',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#8A6D1A', background: '#FEF3C7', padding: '1px 6px', borderRadius: 4 }}>
                        VENCE DIA {r.diaVencimento}
                      </span>
                      <span style={{ fontSize: 11, color: '#7A7868' }}>
                        CNPJ: {formatarCpfCnpj(r.cpfCnpj)}
                      </span>
                    </div>

                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1C2421' }}>
                      {r.cliente}
                    </div>

                    <div style={{ fontSize: 11, color: '#5C5A4F', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {resolverDescricaoRecorrente(r.discriminacaoTemplate, mesAtual, anoAtual)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F2B27', fontFamily: 'Georgia, serif' }}>
                        {formatBRL(r.valor)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleEmitirRecorrencia(r)}
                      title="Emitir NFS-e deste mês"
                      style={{
                        background: '#1F5C52',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        padding: '8px 10px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span>Emitir</span>
                      <ArrowRight size={13} />
                    </button>

                    <button
                      onClick={() => handleRemoverRecorrencia(r.id)}
                      title="Excluir recorrência"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C9C5B6',
                        cursor: 'pointer',
                        padding: 4
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Emissão */}
      {showEmitirModal && (
        <EmitirNfseModal
          empresa={empresa}
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          dadosIniciais={dadosIniciaisEmissao}
          onClose={() => setShowEmitirModal(false)}
          onSucesso={handleSucessoEmissao}
        />
      )}

      {/* Modal de DANFSE (Espelho Oficial com Impressão) */}
      {notaSelecionadaDanfse && (
        <EspelhoDanfseModal
          nota={notaSelecionadaDanfse}
          empresa={empresa}
          onClose={() => setNotaSelecionadaDanfse(null)}
        />
      )}

      {/* Modal de Relatório Fiscal com Exportação em Excel e CSV */}
      {showRelatorioModal && (
        <RelatorioNfseModal
          notas={notas}
          empresa={empresa}
          onClose={() => setShowRelatorioModal(false)}
        />
      )}
    </div>
  );
}
