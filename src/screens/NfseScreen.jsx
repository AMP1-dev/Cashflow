import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Plus, RefreshCw, CheckCircle, ShieldCheck, Download, 
  ExternalLink, Trash2, Calendar, Search, ArrowRight, ArrowLeft, Printer, AlertCircle, MessageCircle 
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { formatarCpfCnpj, nfseService, resolverDescricaoRecorrente, gerarLinkWhatsAppNfse } from '../utils/nfseService';
import { MESES } from '../utils/constants';
import { EmitirNfseModal } from '../components/EmitirNfseModal';
import { EspelhoDanfseModal } from '../components/EspelhoDanfseModal';

export function NfseScreen({ 
  empresa, 
  mesAtual, 
  anoAtual, 
  onAdicionarReceitaAoCaixa,
  onVoltar
}) {
  const [abaAtiva, setAbaAtiva] = useState('emitidas'); // 'emitidas' | 'recorrentes' | 'lote'
  const [notas, setNotas] = useState([]);
  const [recorrencias, setRecorrencias] = useState([]);

  // Modais
  const [showEmitirModal, setShowEmitirModal] = useState(false);
  const [dadosIniciaisEmissao, setDadosIniciaisEmissao] = useState(null);
  const [notaSelecionadaDanfse, setNotaSelecionadaDanfse] = useState(null);

  // Busca e Filtros
  const [termoBusca, setTermoBusca] = useState('');

  // Carrega dados da empresa
  function recarregarDados() {
    if (!empresa?.id) return;
    const n = nfseService.getNotasEmitidas(empresa.id);
    const r = nfseService.getRecorrencias(empresa.id);
    setNotas(n);
    setRecorrencias(r);
  }

  useEffect(() => {
    recarregarDados();
  }, [empresa?.id]);

  // Filtragem de notas emitidas
  const notasFiltradas = useMemo(() => {
    return notas.filter(n => {
      const matchBusca = !termoBusca || 
        n.numero.includes(termoBusca) || 
        n.tomador.razaoSocial.toLowerCase().includes(termoBusca.toLowerCase()) || 
        n.tomador.cpfCnpj.includes(termoBusca);
      return matchBusca;
    });
  }, [notas, termoBusca]);

  // Total emitido no mês atual
  const totalMes = useMemo(() => {
    return notas
      .filter(n => n.competenciaMes === mesAtual && n.competenciaAno === anoAtual)
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

    // Se o usuário quiser, já adiciona no contas a receber / caixa
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

  return (
    <div style={{ padding: '16px 16px 30px', maxWidth: 640, margin: '0 auto' }}>
      
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

      {/* ── CARD PRINCIPAL: TOTAL DE NOTAS DO MÊS ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2B27 0%, #173E38 100%)',
        borderRadius: 16,
        padding: '18px 16px',
        color: '#FAF8F3',
        marginBottom: 16,
        boxShadow: '0 4px 14px rgba(15,43,39,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9FBDB5', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Total Faturado em NFS-e ({MESES[mesAtual]})
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: '#9FE0C8', marginTop: 2 }}>
            {formatBRL(totalMes)}
          </div>
          <div style={{ fontSize: 11.5, color: '#D9EBE6', marginTop: 4 }}>
            {notas.filter(n => n.competenciaMes === mesAtual).length} nota(s) emitida(s) neste mês
          </div>
        </div>

        <button
          onClick={() => { setDadosIniciaisEmissao(null); setShowEmitirModal(true); }}
          style={{
            background: 'linear-gradient(135deg, #1F5C52 0%, #2A7A6D 100%)',
            border: 'none',
            borderRadius: 12,
            padding: '12px 14px',
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
          Notas Emitidas ({notas.length})
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
          Fila Recorrente ({recorrencias.length})
        </button>
      </div>

      {/* ── ABA 1: NOTAS EMITIDAS ── */}
      {abaAtiva === 'emitidas' && (
        <div>
          {/* Campo de Busca Rápida */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={15} color="#9C9A8F" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={termoBusca}
              onChange={e => setTermoBusca(e.target.value)}
              placeholder="Buscar por cliente, CNPJ ou número da nota..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: 9,
                border: '1px solid #E5E0D5',
                background: '#fff',
                fontSize: 13,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {notasFiltradas.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E5E0D5', borderRadius: 14, padding: '28px 16px', textAlign: 'center' }}>
              <FileText size={32} color="#9C9A8F" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1C2421' }}>Nenhuma nota fiscal emitida ainda</div>
              <div style={{ fontSize: 11.5, color: '#7A7868', marginTop: 4 }}>
                Toque no botão <strong>+ Emitir NFS-e</strong> para gerar sua primeira nota com certificado digital temporário.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notasFiltradas.map(n => (
                <div
                  key={n.id}
                  onClick={() => setNotaSelecionadaDanfse(n)}
                  style={{
                    background: '#fff',
                    border: '1px solid #E5E0D5',
                    borderRadius: 12,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1F5C52', background: '#D9EBE6', padding: '1px 6px', borderRadius: 4 }}>
                        NFS-e Nº {n.numero}
                      </span>
                      <span style={{ fontSize: 11, color: '#7A7868' }}>
                        {new Date(n.dataEmissao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1C2421', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.tomador.razaoSocial}
                    </div>

                    <div style={{ fontSize: 11, color: '#5C5A4F', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.servico.discriminacao}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F2B27', fontFamily: 'Georgia, serif' }}>
                      {formatBRL(n.servico.valorTotal)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                      <span style={{ fontSize: 10.5, color: '#1F5C52', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <CheckCircle size={11} /> Autorizada
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = gerarLinkWhatsAppNfse(n, empresa);
                          if (link) window.open(link, '_blank');
                        }}
                        title="Enviar no WhatsApp do Cliente"
                        style={{
                          background: '#25D366',
                          border: 'none',
                          color: '#fff',
                          borderRadius: 4,
                          padding: '2px 7px',
                          fontSize: 10,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          cursor: 'pointer'
                        }}
                      >
                        <MessageCircle size={10} /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* Modal de DANFSE (Espelho Oficial) */}
      {notaSelecionadaDanfse && (
        <EspelhoDanfseModal
          nota={notaSelecionadaDanfse}
          empresa={empresa}
          onClose={() => setNotaSelecionadaDanfse(null)}
        />
      )}
    </div>
  );
}
