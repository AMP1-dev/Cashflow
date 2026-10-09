import { AlertTriangle, HelpCircle, Mic, AlertCircle, BookOpen, ChevronDown, ChevronUp, Check, Scissors, FileText, Camera, Paperclip, FileCheck, ExternalLink, Loader2, Trash2, CheckCircle2, Sparkles, RotateCw, ScanLine } from 'lucide-react';
import { useMemo, useState, useRef } from 'react';
import { BANCOS, CATEGORIAS, MESES, SUBCATEGORIAS_SUGERIDAS, PLANO_DE_CONTAS_SUGERIDO } from '../utils/constants';
import { construirSugestoesDescricao, daysInMonth, formatBRL } from '../utils/formatters';
import { ClassificacaoWizard } from './ClassificacaoWizard';
import { FieldLabel, inputStyle, ModalShell, ToggleTipo } from './UIComponents';
import { uploadComprovanteStorage } from '../utils/comprovanteStorageService';
import { extrairTextoComprovante } from '../services/ocrReceiptService';

export function NovoLancamentoModal({ 
  tipoInicial, 
  diasNoMes, 
  mesAtual = new Date().getMonth(), 
  anoAtual = new Date().getFullYear(), 
  lancamentoEditando, 
  historicoCompleto, 
  onClose, 
  onSave, 
  onUpdate, 
  onDelete, 
  onAbrirEmissaoNfse,
  moduloComprovantesAtivo = false,
  empresaId = null
}) {
  const editando = !!lancamentoEditando;
  const [tipo, setTipo] = useState(editando ? lancamentoEditando.tipo : tipoInicial);
  const [descricao, setDescricao] = useState(editando ? lancamentoEditando.descricao : '');
  const [valor, setValor] = useState(editando ? String(lancamentoEditando.valor).replace('.', ',') : '');
  const [mes, setMes] = useState(editando ? (lancamentoEditando.mes !== undefined ? lancamentoEditando.mes : mesAtual) : mesAtual);
  const [mesCompetencia, setMesCompetencia] = useState(
    editando 
      ? (lancamentoEditando.mesCompetencia !== undefined ? lancamentoEditando.mesCompetencia : (lancamentoEditando.mes !== undefined ? lancamentoEditando.mes : mesAtual)) 
      : mesAtual
  );
  const [personalizarCompetencia, setPersonalizarCompetencia] = useState(
    editando && lancamentoEditando.mesCompetencia !== undefined && lancamentoEditando.mesCompetencia !== lancamentoEditando.mes
  );
  const totalDiasMes = daysInMonth(mes, anoAtual);
  const [dia, setDia] = useState(editando ? lancamentoEditando.dia : (new Date().getDate() > totalDiasMes ? totalDiasMes : new Date().getDate()));
  const [formaRecebimento, setFormaRecebimento] = useState(
    editando && lancamentoEditando.formaRecebimento === 'À prazo' ? 'aprazo' : 'avista'
  );
  const [qtdVendas, setQtdVendas] = useState(editando && lancamentoEditando.qtdVendas ? String(lancamentoEditando.qtdVendas) : '');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardConfig, setWizardConfig] = useState({ nodeId: 'start', faseCmv: 'subcategoria' });
  const [categoria, setCategoria] = useState(editando ? lancamentoEditando.categoria : null);
  const [subcategoria, setSubcategoria] = useState(editando ? (lancamentoEditando.subcategoria || '') : '');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [banco, setBanco] = useState(editando ? (lancamentoEditando.banco || '') : '');
  const [meioPagamento, setMeioPagamento] = useState(editando ? (lancamentoEditando.meioPagamento || '') : '');
  const [sugestaoEscolhidaManualmente, setSugestaoEscolhidaManualmente] = useState(editando);
  const [campoDescricaoFocado, setCampoDescricaoFocado] = useState(false);
  const [escutando, setEscutando] = useState(false);
  const [mostrarPlanoContas, setMostrarPlanoContas] = useState(false);
  const [grupoPlanoAberto, setGrupoPlanoAberto] = useState('custos_diretos');

  const [seRepete, setSeRepete] = useState(false);
  const [qtdRepeticoes, setQtdRepeticoes] = useState(2);
  const [modalAlertaAberto, setModalAlertaAberto] = useState(false);
  const [alertaJaExibidoNoDia, setAlertaJaExibidoNoDia] = useState(false);

  // Módulo Cofre Digital, Leitor OCR & Comprovantes Sem Papel
  const [comprovanteUrl, setComprovanteUrl] = useState(editando ? (lancamentoEditando.comprovante_url || '') : '');
  const [uploadingComprovante, setUploadingComprovante] = useState(false);
  const [comprovanteInfo, setComprovanteInfo] = useState(null);
  const [ocrLendo, setOcrLendo] = useState(false);
  const [ocrProgresso, setOcrProgresso] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrResultado, setOcrResultado] = useState(null);
  const [mostrarTextoOcr, setMostrarTextoOcr] = useState(false);
  const fileCameraRef = useRef(null);
  const fileUploadRef = useRef(null);

  async function processarArquivoEExecutarOcr(file) {
    if (!file) return;
    const isImage = file.type?.startsWith('image/') || /\.(jpe?g|png|webp|bmp)$/i.test(file.name || '');

    setUploadingComprovante(true);
    if (isImage) {
      setOcrLendo(true);
      setOcrProgresso(15);
      setOcrStatus('Otimizando imagem para leitura fiscal...');
    }

    try {
      // 1. Upload e compactação automática para o Supabase Storage (~80KB WebP)
      const uploadPromise = uploadComprovanteStorage({
        file,
        empresaId,
        lancamentoId: editando ? lancamentoEditando.id : null,
      }).catch(err => {
        console.warn('Erro ao salvar no storage:', err);
        return null;
      });

      // 2. Extração OCR se for imagem
      const ocrPromise = isImage 
        ? extrairTextoComprovante(file, ({ status, pct }) => {
            setOcrStatus(status);
            setOcrProgresso(pct);
          })
        : Promise.resolve(null);

      const [resUpload, resOcr] = await Promise.all([uploadPromise, ocrPromise]);

      if (resUpload && resUpload.url) {
        setComprovanteUrl(resUpload.url);
        const kbOriginal = Math.round((resUpload.tamanhoOriginal || 0) / 1024);
        const kbFinal = Math.round((resUpload.tamanhoFinal || 0) / 1024);
        setComprovanteInfo({
          original: kbOriginal,
          final: kbFinal,
          economia: kbOriginal > 0 ? Math.round((1 - kbFinal / kbOriginal) * 100) : 0,
        });
      }

      if (resOcr && resOcr.sucesso) {
        setOcrResultado(resOcr);

        // Preenchimento inteligente dos campos do lançamento
        if (resOcr.valorFormatado) {
          setValor(resOcr.valorFormatado);
        }

        if (resOcr.descricaoSugerida) {
          setDescricao(resOcr.descricaoSugerida);
          setSugestaoEscolhidaManualmente(true);
        } else if (resOcr.fornecedor) {
          setDescricao(resOcr.fornecedor);
          setSugestaoEscolhidaManualmente(true);
        }

        if (resOcr.dia) {
          const diaNum = parseInt(resOcr.dia, 10);
          if (diaNum >= 1 && diaNum <= 31) {
            setDia(diaNum);
          }
        }

        if (resOcr.mes !== null && resOcr.mes !== undefined) {
          const mesIdx = resOcr.mes - 1;
          if (mesIdx >= 0 && mesIdx <= 11) {
            setMes(mesIdx);
          }
        }

        if (resOcr.tipo) {
          setTipo(resOcr.tipo);
        }

        if (resOcr.categoriaSugerida) {
          setCategoria(resOcr.categoriaSugerida);
        }

        if (resOcr.subcategoriaSugerida) {
          setSubcategoria(resOcr.subcategoriaSugerida);
          setSugestaoEscolhidaManualmente(true);
        }

        if (resOcr.formaPagamento) {
          const fp = resOcr.formaPagamento.toLowerCase();
          if (fp.includes('pix')) setMeioPagamento('PIX');
          else if (fp.includes('crédito') || fp.includes('credito') || fp.includes('débito') || fp.includes('debito') || fp.includes('cartão') || fp.includes('cartao')) setMeioPagamento('Cartão');
          else if (fp.includes('boleto')) setMeioPagamento('Boleto');
          else if (fp.includes('dinheiro')) setMeioPagamento('Dinheiro');
          else if (fp.includes('transferência') || fp.includes('transferencia') || fp.includes('ted') || fp.includes('doc')) setMeioPagamento('Transferência');
        }
      } else if (resOcr && !resOcr.sucesso) {
        console.warn('OCR não obteve sucesso:', resOcr.erro);
      }
    } catch (err) {
      alert('Erro ao processar comprovante: ' + (err.message || String(err)));
    } finally {
      setUploadingComprovante(false);
      setOcrLendo(false);
    }
  }

  async function handleReexecutarOcr(url) {
    if (!url) return;
    setOcrLendo(true);
    setOcrProgresso(15);
    setOcrStatus('Re-analisando documento com motor OCR...');
    try {
      const resOcr = await extrairTextoComprovante(url, ({ status, pct }) => {
        setOcrStatus(status);
        setOcrProgresso(pct);
      });
      if (resOcr && resOcr.sucesso) {
        setOcrResultado(resOcr);
        if (resOcr.valorFormatado) setValor(resOcr.valorFormatado);
        if (resOcr.descricaoSugerida) {
          setDescricao(resOcr.descricaoSugerida);
          setSugestaoEscolhidaManualmente(true);
        }
        if (resOcr.dia) setDia(parseInt(resOcr.dia, 10));
        if (resOcr.mes !== null && resOcr.mes !== undefined) setMes(resOcr.mes - 1);
        if (resOcr.categoriaSugerida) setCategoria(resOcr.categoriaSugerida);
        if (resOcr.subcategoriaSugerida) {
          setSubcategoria(resOcr.subcategoriaSugerida);
          setSugestaoEscolhidaManualmente(true);
        }
      } else {
        alert('Não foi possível identificar dados fiscais claros nesta imagem.');
      }
    } catch (err) {
      alert('Erro na releitura OCR: ' + (err.message || String(err)));
    } finally {
      setOcrLendo(false);
    }
  }

  function handleArquivoSelecionado(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    processarArquivoEExecutarOcr(file);
    e.target.value = '';
  }

  const realMesAtual = new Date().getMonth();
  const realAnoAtual = new Date().getFullYear();
  const ehMesDiferente = mes !== realMesAtual || anoAtual !== realAnoAtual;

  const showMic = localStorage.getItem('amp_beta_voz') === 'true';

  const valorNum = parseFloat((valor || '0').replace(',', '.')) || 0;

  // Detector Inteligente de Concentração de Despesas (Item 2)
  const alertaConcentracao = useMemo(() => {
    if (tipo !== 'despesa' || valorNum <= 0) return null;
    const despesasMes = (historicoCompleto || []).filter(l => l.tipo === 'despesa' && l.mes === mes);
    const mediaDiaria = despesasMes.length > 0 ? (despesasMes.reduce((s, l) => s + l.valor, 0) / (totalDiasMes || 30)) : 0;
    
    const despesasJanela = despesasMes.filter(l => l.dia === dia || l.dia === dia - 1 || l.dia === dia + 1)
      .filter(l => !editando || l.id !== lancamentoEditando?.id)
      .reduce((s, l) => s + l.valor, 0);

    const totalPeriodo = despesasJanela + valorNum;
    const dMin = Math.max(1, dia - 1);
    const dMax = Math.min(totalDiasMes, dia + 1);

    if (totalPeriodo >= 400 && (mediaDiaria === 0 || totalPeriodo >= mediaDiaria * 1.8)) {
      return {
        diasStr: dMin === dMax ? `Dia ${dia}` : `Dias ${dMin} a ${dMax}`,
        total: totalPeriodo,
      };
    }
    return null;
  }, [tipo, valorNum, mes, dia, historicoCompleto, totalDiasMes, editando, lancamentoEditando]);

  function startDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz nativo.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setEscutando(true);
    
    recognition.onresult = (event) => {
      const transcricao = event.results[0][0].transcript;
      // Capitaliza a primeira letra para ficar bonito
      const textoFinal = transcricao.charAt(0).toUpperCase() + transcricao.slice(1);
      setDescricao(textoFinal);
      setSugestaoEscolhidaManualmente(false);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setEscutando(false);
    };

    recognition.onend = () => setEscutando(false);
    recognition.start();
  }

  const sugestoesDescricao = useMemo(() => construirSugestoesDescricao(historicoCompleto || [], tipo), [historicoCompleto, tipo]);

  const sugestoesFiltradas = useMemo(() => {
    const termo = descricao.trim().toLowerCase();
    if (!termo) return [];
    return sugestoesDescricao
      .filter(s => s.descricao.toLowerCase().startsWith(termo) && s.descricao.toLowerCase() !== termo)
      .slice(0, 5);
  }, [descricao, sugestoesDescricao]);

  const mostrarSugestoes = campoDescricaoFocado && !sugestaoEscolhidaManualmente && sugestoesFiltradas.length > 0;

  function escolherSugestao(s) {
    setDescricao(s.descricao);
    if (tipo === 'despesa' && s.categoria) {
      setCategoria(s.categoria);
      setSubcategoria(s.subcategoria || '');
    }
    setSugestaoEscolhidaManualmente(true);
    setCampoDescricaoFocado(false);
  }

  const podeSalvar = descricao.trim().length > 0 && valorNum > 0 && (tipo === 'receita' || categoria);

  function montarDados() {
    return {
      tipo, descricao: descricao.trim(), valor: valorNum, mes, dia,
      mesCompetencia: personalizarCompetencia ? mesCompetencia : mes,
      anoCompetencia: anoAtual,
      personalizarCompetencia,
      repeticoes: seRepete ? Math.max(1, parseInt(qtdRepeticoes) || 1) : 1,
      categoria: tipo === 'despesa' ? categoria : null,
      subcategoria: tipo === 'despesa' ? subcategoria : null,
      formaRecebimento: tipo === 'receita' ? (formaRecebimento === 'avista' ? 'À vista/PIX' : 'À prazo') : null,
      qtdVendas: tipo === 'receita' && qtdVendas ? parseInt(qtdVendas) || null : null,
      banco: banco || null,
      meio_pagamento: meioPagamento || null,
      comprovante_url: comprovanteUrl || null,
    };
  }

  function handleSalvar() {
    if (!podeSalvar) return;
    if (editando) onUpdate(montarDados());
    else onSave(montarDados());
  }

  if (showWizard) {
    return (
      <ClassificacaoWizard
        descricao={descricao}
        valorTotal={valorNum}
        sugestoesExtras={(historicoCompleto || []).filter(l => l.tipo === 'despesa' && l.subcategoria).map(l => l.subcategoria)}
        initialNodeId={wizardConfig.nodeId || 'start'}
        initialFaseCmv={wizardConfig.faseCmv || 'subcategoria'}
        subcategoriaInicial={subcategoria || null}
        onCancel={() => setShowWizard(false)}
        onConcluir={(cat, sub) => { setCategoria(cat); setSubcategoria(sub || ''); setShowWizard(false); }}
        onConcluirFracionado={(partes) => {
          // Salva cada parte como um lançamento separado
          partes.forEach(p => {
            onSave({
              tipo: 'despesa',
              descricao: p.descricao || descricao.trim(),
              valor: p.valor,
              mes,
              dia,
              categoria: p.categoria,
              subcategoria: p.subcategoria || null,
              formaRecebimento: null,
              qtdVendas: null,
            });
          });
          onClose();
        }}
      />
    );
  }

  return (
    <ModalShell onClose={onClose} titulo={editando ? 'Editar lançamento' : (tipo === 'despesa' ? 'Nova despesa' : 'Nova receita')}>
      {/* Inputs ocultos de Câmera e Arquivo (sempre disponíveis) */}
      <input
        ref={fileCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleArquivoSelecionado}
        style={{ display: 'none' }}
      />
      <input
        ref={fileUploadRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleArquivoSelecionado}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <ToggleTipo label="Despesa" active={tipo === 'despesa'} color="#B05A2E" onClick={() => { setTipo('despesa'); }} />
        <ToggleTipo label="Receita" active={tipo === 'receita'} color="#1F5C52" onClick={() => setTipo('receita')} />
      </div>

      {/* ── BOTÃO DE DESTAQUE: ESCANEAR CUPOM / FOTO COM OCR IA ── */}
      <div style={{ marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => fileCameraRef.current?.click()}
          disabled={ocrLendo || uploadingComprovante}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 12,
            border: '1.5px solid #10B981',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
            color: '#065F46',
            cursor: ocrLendo || uploadingComprovante ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
            transition: 'all 0.18s ease',
            opacity: ocrLendo || uploadingComprovante ? 0.75 : 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}>
              <Camera size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#064E3B', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📸 Escanear Cupom / Foto da Nota</span>
                <span style={{ fontSize: 9.5, fontWeight: 800, background: '#059669', color: '#fff', padding: '1px 6px', borderRadius: 4, letterSpacing: '0.4px' }}>
                  OCR IA
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#047857' }}>
                Tire foto da despesa e preencha valor, fornecedor e categoria
              </div>
            </div>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#059669', padding: '4px 8px', borderRadius: 6, background: '#D1FAE5', flexShrink: 0 }}>
            Tirar Foto
          </span>
        </button>
      </div>

      {/* ── STATUS E PROGRESSO DO OCR AO VIVO ── */}
      {ocrLendo && (
        <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 10, background: '#F0FDF4', border: '1.5px solid #10B981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#059669' }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#065F46' }}>
                Lendo Comprovante com IA...
              </span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#059669' }}>
              {ocrProgresso}%
            </span>
          </div>
          <div style={{ width: '100%', height: 6, background: '#D1FAE5', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${ocrProgresso}%`, height: '100%', background: '#10B981', borderRadius: 99, transition: 'width 0.25s ease' }} />
          </div>
          <p style={{ fontSize: 11, color: '#047857', margin: '6px 0 0 0' }}>
            {ocrStatus || 'Processando caracteres fiscais...'}
          </p>
        </div>
      )}

      {/* ── FEEDBACK DE CAMPOS EXTRAÍDOS PELO OCR ── */}
      {ocrResultado && !ocrLendo && (
        <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 10, background: '#F0FDF4', border: '1.5px solid #34D399', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="#059669" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#065F46' }}>
                Leitura Concluída • Campos Preenchidos
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMostrarTextoOcr(!mostrarTextoOcr)}
              style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {mostrarTextoOcr ? 'Ocultar texto' : 'Ver texto da nota'}
            </button>
          </div>

          <div style={{ fontSize: 11.5, color: '#047857', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ocrResultado.valorFormatado && (
              <span style={{ background: '#D1FAE5', padding: '2px 7px', borderRadius: 6, fontWeight: 700 }}>
                💰 R$ {ocrResultado.valorFormatado}
              </span>
            )}
            {ocrResultado.fornecedor && (
              <span style={{ background: '#D1FAE5', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                🏢 {ocrResultado.fornecedor}
              </span>
            )}
            {ocrResultado.dia && (
              <span style={{ background: '#D1FAE5', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                📅 Dia {ocrResultado.dia}
              </span>
            )}
            {ocrResultado.formaPagamento && ocrResultado.formaPagamento !== 'Outros' && (
              <span style={{ background: '#D1FAE5', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                💳 {ocrResultado.formaPagamento}
              </span>
            )}
            {ocrResultado.subcategoriaSugerida && (
              <span style={{ background: '#D1FAE5', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                🏷️ {ocrResultado.subcategoriaSugerida}
              </span>
            )}
          </div>

          {mostrarTextoOcr && ocrResultado.textoBruto && (
            <div style={{ marginTop: 4, maxHeight: 110, overflowY: 'auto', background: '#FFFFFF', border: '1px solid #A7F3D0', borderRadius: 6, padding: '8px', fontSize: 10.5, fontFamily: 'monospace', color: '#334155', whiteSpace: 'pre-wrap' }}>
              {ocrResultado.textoBruto}
            </div>
          )}
        </div>
      )}

      {ehMesDiferente && (
        <div style={{ marginBottom: 12, padding: '8px 10px', borderRadius: 8, background: '#FFF8E7', border: '1px solid #E8A33D', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} style={{ color: '#E8A33D', flexShrink: 0 }} />
          <div style={{ fontSize: 11.5, color: '#8A5D00', lineHeight: 1.3 }}>
            <strong>Aviso de histórico:</strong> Lançando em <strong>{MESES[mes]}</strong> (atual: <strong>{MESES[realMesAtual]}</strong>).
          </div>
        </div>
      )}

      <FieldLabel>Descrição</FieldLabel>
      <div style={{ position: 'relative' }}>
        <input
          value={descricao}
          onChange={e => { setDescricao(e.target.value); setSugestaoEscolhidaManualmente(false); }}
          onFocus={() => setCampoDescricaoFocado(true)}
          onBlur={() => setTimeout(() => setCampoDescricaoFocado(false), 150)}
          placeholder={tipo === 'despesa' ? 'Ex: Combustível, Aluguel...' : 'Ex: Venda balcão, Recebimento cliente X...'}
          style={{ ...inputStyle, paddingRight: showMic ? 40 : 12 }}
          autoComplete="off"
        />
        {showMic && (
          <button 
            onClick={startDictation}
            title={escutando ? "Ouvindo..." : "Ditar descrição"}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: escutando ? '#F2DDE1' : '#F0EDE3', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          >
            <Mic size={16} color={escutando ? '#B05A2E' : '#5C5A4F'} />
          </button>
        )}
        {mostrarSugestoes && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #E5E0D5', borderRadius: 10, boxShadow: '0 4px 14px rgba(0,0,0,0.08)', zIndex: 5, overflow: 'hidden' }}>
            {sugestoesFiltradas.map(s => (
              <button
                key={s.descricao}
                onMouseDown={() => escolherSugestao(s)}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', borderBottom: '1px solid #F0EDE3', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: 13.5, color: '#1C2421' }}>{s.descricao}</span>
                {s.categoria && (
                  <span style={{ fontSize: 10.5, color: CATEGORIAS[s.categoria].color, background: CATEGORIAS[s.categoria].bg, padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                    {CATEGORIAS[s.categoria].short}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {tipo === 'despesa' && categoria && descricao.trim() && sugestaoEscolhidaManualmente && (
        <div style={{ fontSize: 10.5, color: '#9C9A8F', marginTop: 4 }}>Classificação preenchida com base no último lançamento dessa despesa.</div>
      )}

      <FieldLabel>Valor</FieldLabel>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9C9A8F' }}>R$</span>
        <input
          value={valor}
          onChange={e => setValor(e.target.value)}
          placeholder="0,00"
          inputMode="decimal"
          style={{ ...inputStyle, paddingLeft: 34 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <FieldLabel>Mês de Lançamento</FieldLabel>
          <select value={mes} onChange={e => {
            const novoMes = parseInt(e.target.value);
            setMes(novoMes);
            if (!personalizarCompetencia) setMesCompetencia(novoMes);
          }} style={inputStyle}>
            {MESES.map((nomeMes, idx) => (
              <option key={idx} value={idx}>{nomeMes}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <FieldLabel>Dia do lançamento</FieldLabel>
          <select 
            value={dia} 
            onChange={e => {
              const novoDia = parseInt(e.target.value);
              setDia(novoDia);
              
              // Se for despesa e houver valor lançado, verifica concentração após a escolha do dia
              if (tipo === 'despesa' && valorNum > 0) {
                const despesasMes = (historicoCompleto || []).filter(l => l.tipo === 'despesa' && l.mes === mes);
                const mediaDiaria = despesasMes.length > 0 ? (despesasMes.reduce((s, l) => s + l.valor, 0) / (totalDiasMes || 30)) : 0;
                const despesasJanela = despesasMes.filter(l => l.dia === novoDia || l.dia === novoDia - 1 || l.dia === novoDia + 1)
                  .filter(l => !editando || l.id !== lancamentoEditando?.id)
                  .reduce((s, l) => s + l.valor, 0);
                const totalPeriodo = despesasJanela + valorNum;
                if (totalPeriodo >= 400 && (mediaDiaria === 0 || totalPeriodo >= mediaDiaria * 1.8)) {
                  setModalAlertaAberto(true);
                }
              }
            }} 
            style={inputStyle}
          >
            {Array.from({ length: daysInMonth(mes, anoAtual) }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>Dia {d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recorrência / Repetição de Lançamentos Futuros */}
      {!editando && (
        <div style={{ marginTop: 10, padding: '10px 12px', background: '#fff', borderRadius: 10, border: '1px solid #E5E0D5' }}>
          <div 
            onClick={() => setSeRepete(!seRepete)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1C2421' }}>
              Este lançamento se repete nos próximos meses?
            </span>
            <input 
              type="checkbox" 
              checked={seRepete} 
              onChange={e => setSeRepete(e.target.checked)} 
              style={{ accentColor: '#1F5C52', width: 17, height: 17, cursor: 'pointer' }}
            />
          </div>

          {seRepete && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F0EDE3', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#5C5A4F' }}>Repetir por:</span>
              <select
                value={qtdRepeticoes}
                onChange={e => setQtdRepeticoes(parseInt(e.target.value))}
                style={{ ...inputStyle, width: 'auto', flex: 1, padding: '6px 10px', fontSize: 13, background: '#FAF8F3' }}
              >
                <option value={2}>2 meses (mês atual + 1 futuro)</option>
                <option value={3}>3 meses (trimestral)</option>
                <option value={6}>6 meses (semestral)</option>
                <option value={12}>12 meses (recorrente anual)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Alternar Mês de Competência Contábil (DRE) */}
      <div style={{ marginTop: 6, marginBottom: 10 }}>
        <div 
          onClick={() => setPersonalizarCompetencia(!personalizarCompetencia)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#1F5C52', cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}
        >
          <input 
            type="checkbox" 
            checked={personalizarCompetencia} 
            onChange={e => setPersonalizarCompetencia(e.target.checked)} 
            style={{ cursor: 'pointer', accentColor: '#1F5C52' }} 
          />
          <span>Competência contábil em mês diferente do pagamento</span>
        </div>

        {personalizarCompetencia && (
          <div style={{ marginTop: 6, padding: '10px 12px', background: '#F4F8F7', borderRadius: 8, border: '1px solid #C5DFD8' }}>
            <FieldLabel>Mês de Competência Contábil (DRE)</FieldLabel>
            <select value={mesCompetencia} onChange={e => setMesCompetencia(parseInt(e.target.value))} style={{ ...inputStyle, background: '#fff' }}>
              {MESES.map((nomeMes, idx) => (
                <option key={idx} value={idx}>{nomeMes} (Pertence ao custo/receita de {nomeMes})</option>
              ))}
            </select>
            <div style={{ fontSize: 10.5, color: '#5C5A4F', marginTop: 4, lineHeight: 1.3 }}>
              O valor afetará o fluxo de caixa em <strong>{MESES[mes]}</strong>, mas impactará a apuração do DRE contábil de <strong>{MESES[mesCompetencia]}</strong>.
            </div>
          </div>
        )}
      </div>

      {tipo === 'receita' && (
        <>
          <FieldLabel>Forma de recebimento</FieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <ToggleTipo label="À vista / PIX" active={formaRecebimento === 'avista'} color="#1F5C52" onClick={() => setFormaRecebimento('avista')} />
            <ToggleTipo label="À prazo" active={formaRecebimento === 'aprazo'} color="#1F5C52" onClick={() => setFormaRecebimento('aprazo')} />
          </div>

          <FieldLabel>Quantidade de vendas (opcional)</FieldLabel>
          <input
            value={qtdVendas}
            onChange={e => setQtdVendas(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Ex: 12 — usado para calcular o ticket médio"
            inputMode="numeric"
            style={inputStyle}
          />

          {/* Botão de Atalho Inteligente para Gerar NFS-e */}
          {onAbrirEmissaoNfse && valorNum > 0 && (
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={() => {
                  onAbrirEmissaoNfse({
                    descricao,
                    valor: valorNum,
                    mesCompetencia: personalizarCompetencia ? mesCompetencia : mes,
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: '1.5px dashed #1F5C52',
                  background: '#EAF4F1',
                  color: '#0F2B27',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <FileText size={15} color="#1F5C52" />
                <span>🧾 Gerar Nota Fiscal de Serviços (NFS-e) deste valor</span>
              </button>
            </div>
          )}
        </>
      )}

      {tipo === 'despesa' && (
        <>
          <FieldLabel>Categoria contábil</FieldLabel>
          {categoria ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setWizardConfig({ nodeId: 'start', faseCmv: 'subcategoria' });
                  setShowWizard(true);
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 9, border: `1px solid ${CATEGORIAS[categoria].color}`, background: CATEGORIAS[categoria].bg, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: CATEGORIAS[categoria].color }}>{CATEGORIAS[categoria].label}</div>
                  {subcategoria && <div style={{ fontSize: 11.5, color: '#5C5A4F', marginTop: 1 }}>{subcategoria}</div>}
                </div>
                <span style={{ fontSize: 11, color: CATEGORIAS[categoria].color, textDecoration: 'underline' }}>refazer perguntas</span>
              </button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {Object.entries(CATEGORIAS).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => { setCategoria(key); setSubcategoria(''); }}
                    style={{
                      padding: '5px 9px', borderRadius: 7, fontSize: 11, cursor: 'pointer',
                      border: `1px solid ${key === categoria ? cat.color : '#E5E0D5'}`,
                      background: key === categoria ? cat.bg : '#fff',
                      color: key === categoria ? cat.color : '#9C9A8F',
                      fontWeight: key === categoria ? 600 : 400,
                    }}
                  >
                    {cat.short}
                  </button>
                ))}
              </div>

              {/* Sugestões de Subcategorias da Categoria Selecionada */}
              {SUBCATEGORIAS_SUGERIDAS[categoria] && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 4 }}>Subcategoria sugerida:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {SUBCATEGORIAS_SUGERIDAS[categoria].map((subName) => {
                      const sel = subcategoria === subName;
                      return (
                        <button
                          key={subName}
                          type="button"
                          onClick={() => setSubcategoria(sel ? '' : subName)}
                          style={{
                            padding: '3px 7px', borderRadius: 6, fontSize: 10.5, cursor: 'pointer',
                            border: `1px solid ${sel ? CATEGORIAS[categoria].color : '#E5E0D5'}`,
                            background: sel ? CATEGORIAS[categoria].bg : '#fff',
                            color: sel ? CATEGORIAS[categoria].color : '#5C5A4F',
                            fontWeight: sel ? 600 : 400
                          }}
                        >
                          {subName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Botão de Atalho para Fracionar CMV (% ou R$ / separar uso pessoal) */}
              {categoria === 'cmv' && (
                <button
                  type="button"
                  onClick={() => {
                    setWizardConfig({ nodeId: 'cmv', faseCmv: 'fracionamento' });
                    setShowWizard(true);
                  }}
                  style={{
                    marginTop: 8, width: '100%', padding: '9px 12px', borderRadius: 8,
                    border: '1px dashed #B05A2E', background: '#FDF7F4', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    color: '#B05A2E', fontSize: 12, fontWeight: 600,
                  }}
                >
                  <Scissors size={14} />
                  Fracionar CMV (% ou R$ — separar uso pessoal ou despesas mistas)
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setWizardConfig({ nodeId: 'start', faseCmv: 'subcategoria' });
                setShowWizard(true);
              }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px dashed #C9A063', background: '#FBF3E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, color: '#8A6D1A', fontSize: 12.5, fontWeight: 600 }}
            >
              <HelpCircle size={15} />
              Não sei classificar — me ajude com perguntas
            </button>
          )}

          {/* Gaveta Colapsável: Classificação pronta (Custos ou Despesas) em tom azul pastel */}
          <div style={{ marginTop: 8, border: '1px solid #BEE3ED', borderRadius: 9, overflow: 'hidden', background: '#F2FAFC' }}>
            <button
              type="button"
              onClick={() => setMostrarPlanoContas(prev => !prev)}
              style={{
                width: '100%',
                padding: '8px 11px',
                background: mostrarPlanoContas ? '#E2F3F8' : '#F2FAFC',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#165266',
                fontSize: 11.5,
                fontWeight: 600,
                transition: 'background 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={14} style={{ color: '#1B6A82' }} />
                <span>Classificação pronta (Custos ou Despesas)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 10, color: '#1B6A82', fontWeight: 600, background: '#D9EFF5', padding: '1px 6px', borderRadius: 4 }}>
                  {mostrarPlanoContas ? 'Ocultar' : 'Ver opções'}
                </span>
                {mostrarPlanoContas ? <ChevronUp size={13} color="#1B6A82" /> : <ChevronDown size={13} color="#1B6A82" />}
              </div>
            </button>

            {mostrarPlanoContas && (
              <div style={{ padding: 12, borderTop: '1px solid #E5E0D5', background: '#fff' }}>
                <div style={{ fontSize: 11, color: '#8C897E', marginBottom: 10, lineHeight: 1.4 }}>
                  Toque em qualquer item abaixo para aplicar a classificação correta e preencher a descrição automaticamente:
                </div>

                {/* Grade dos Grupos do Plano de Contas - Todos 100% visíveis sem rolagem lateral oculta */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 6, marginBottom: 12 }}>
                  {PLANO_DE_CONTAS_SUGERIDO.map(grupo => {
                    const ativo = grupoPlanoAberto === grupo.id;
                    const rotulosCurto = {
                      custos_diretos: '📦 Custos Diretos (CMV)',
                      despesas_variaveis: '⚡ Despesas Variáveis',
                      estrutura_ocupacao: '🏢 Fixas - Estrutura',
                      pessoal_gestao: '👥 Fixas - Equipe & Adm',
                      marketing_comercial: '📣 Fixas - Marketing',
                      financeiras_bancos: '🏦 Juros & Bancos',
                    };
                    const rotulo = rotulosCurto[grupo.id] || grupo.grupo.split(' (')[0];

                    return (
                      <button
                        key={grupo.id}
                        type="button"
                        onClick={() => setGrupoPlanoAberto(grupo.id)}
                        style={{
                          padding: '7px 8px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: ativo ? 700 : 600,
                          textAlign: 'center',
                          border: `1.5px solid ${ativo ? grupo.badgeColor : '#E5E0D5'}`,
                          background: ativo ? grupo.badgeBg : '#F9F8F5',
                          color: ativo ? grupo.badgeColor : '#555248',
                          cursor: 'pointer',
                          boxShadow: ativo ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {rotulo}
                      </button>
                    );
                  })}
                </div>

                {/* Itens do Grupo Selecionado */}
                {(() => {
                  const grupoSel = PLANO_DE_CONTAS_SUGERIDO.find(g => g.id === grupoPlanoAberto) || PLANO_DE_CONTAS_SUGERIDO[0];
                  return (
                    <div style={{ background: '#FAF8F3', border: `1px solid ${grupoSel.badgeColor}33`, borderRadius: 8, padding: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ fontSize: 11.5, color: '#2B2A24' }}>{grupoSel.grupo}</strong>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: grupoSel.badgeBg, color: grupoSel.badgeColor }}>
                          {grupoSel.tipoLabel}
                        </span>
                      </div>
                      <p style={{ fontSize: 10.5, color: '#7C796E', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                        {grupoSel.descricao}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {grupoSel.itens.map(item => {
                          const selecionado = categoria === grupoSel.categoria && (subcategoria === item.sub || subcategoria === item.nome);
                          return (
                            <button
                              key={item.nome}
                              type="button"
                              onClick={() => {
                                if (!descricao.trim()) {
                                  setDescricao(item.nome);
                                }
                                setCategoria(grupoSel.categoria);
                                setSubcategoria(item.sub || item.nome);
                                setSugestaoEscolhidaManualmente(true);
                              }}
                              style={{
                                padding: '6px 10px',
                                borderRadius: 7,
                                fontSize: 11.5,
                                cursor: 'pointer',
                                border: `1.5px solid ${selecionado ? grupoSel.badgeColor : '#DCD7CC'}`,
                                background: selecionado ? grupoSel.badgeBg : '#fff',
                                color: selecionado ? grupoSel.badgeColor : '#2C2B25',
                                fontWeight: selecionado ? 700 : 500,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                transition: 'all 0.15s',
                              }}
                            >
                              {selecionado && <Check size={12} color={grupoSel.badgeColor} />}
                              <span>{item.nome}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {categoria && (
            <>
              <FieldLabel>Meio de pagamento / Como pagou (opcional)</FieldLabel>
              <select value={meioPagamento} onChange={e => setMeioPagamento(e.target.value)} style={inputStyle}>
                <option value="">Selecionar meio de pagamento...</option>
                <option value="PIX">PIX</option>
                <option value="Débito em conta">Débito em conta</option>
                <option value="Boleto">Boleto / Fatura</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão">Cartão</option>
                <option value="Cheque">Cheque</option>
                <option value="Transferência">Transferência</option>
              </select>

              <FieldLabel>Banco / Conta (opcional)</FieldLabel>
              <select value={banco} onChange={e => setBanco(e.target.value)} style={inputStyle}>
                <option value="">Selecionar banco...</option>
                {BANCOS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </>
          )}
        </>
      )}

      {/* Modal / Alerta de Concentração (Exibido após escolha do dia) */}
      {modalAlertaAberto && alertaConcentracao && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(24, 20, 36, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', maxWidth: 380, width: '100%', boxShadow: '0 12px 36px rgba(0,0,0,0.24)', border: '1px solid #E8A33D' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#FFF8E7', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8A33D', flexShrink: 0 }}>
                <AlertTriangle size={22} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1C2421', fontFamily: 'var(--font-display, "Outfit", sans-serif)' }}>
                Alerta de Concentração
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#5C5A4F', lineHeight: 1.5, marginBottom: 18 }}>
              Os <strong>{alertaConcentracao.diasStr}</strong> já acumulam <strong>{formatBRL(alertaConcentracao.total)}</strong> em saídas previstas. Avalie negociar este vencimento para aliviar a pressão no caixa desse período.
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setModalAlertaAberto(false)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: 'none', background: '#0F2B27', color: '#FAF8F3', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Entendido, manter data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEÇÃO COFRE DIGITAL & COMPROVANTES SEM PAPEL (PREMIUM / HABILITADO) ── */}
      {moduloComprovantesAtivo && (
        <div style={{ marginTop: 18, background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Paperclip size={15} color="#475569" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B' }}>
                Cofre Digital • Anexar Comprovante
              </span>
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, background: '#E2E8F0', color: '#334155', padding: '1px 6px', borderRadius: 4 }}>
              SEM PAPEL
            </span>
          </div>

          <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 10px 0', lineHeight: 1.35 }}>
            Tire foto do cupom pelo celular ou anexe PDF/imagem. As fotos são compactadas automaticamente (~80KB) para não consumir seu armazenamento.
          </p>

          {uploadingComprovante || ocrLendo ? (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#059669', fontSize: 12, fontWeight: 600 }}>
              <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>{ocrLendo ? `Lendo cupom com IA (${ocrProgresso}%)...` : 'Compactando e arquivando na nuvem...'}</span>
            </div>
          ) : comprovanteUrl ? (
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                {comprovanteUrl.toLowerCase().includes('.pdf') ? (
                  <div style={{ width: 34, height: 34, borderRadius: 6, background: '#FEE2E2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} color="#DC2626" />
                  </div>
                ) : (
                  <img
                    src={comprovanteUrl}
                    alt="Miniatura"
                    style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover', border: '1px solid #CBD5E1', flexShrink: 0 }}
                  />
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Documento Anexado com Sucesso
                  </div>
                  <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={11} /> 
                    {comprovanteInfo ? `Reduzido de ${comprovanteInfo.original}KB para ${comprovanteInfo.final}KB (-${comprovanteInfo.economia}%)` : 'Otimizado em WebP'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                {!comprovanteUrl.toLowerCase().includes('.pdf') && (
                  <button
                    type="button"
                    onClick={() => handleReexecutarOcr(comprovanteUrl)}
                    disabled={ocrLendo}
                    style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: 6, padding: '5px 8px', fontSize: 11, fontWeight: 600, color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    title="Re-escanear comprovante com OCR"
                  >
                    <RotateCw size={12} className={ocrLendo ? 'spin' : ''} />
                    <span>Re-ler</span>
                  </button>
                )}
                <a
                  href={comprovanteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '5px 8px', fontSize: 11, fontWeight: 600, color: '#1E293B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <ExternalLink size={12} />
                  <span>Ver</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setComprovanteUrl('');
                    setComprovanteInfo(null);
                    setOcrResultado(null);
                  }}
                  style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 6, padding: '5px 8px', fontSize: 11, fontWeight: 600, color: '#E11D48', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  title="Remover este comprovante"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => fileCameraRef.current?.click()}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1E293B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <Camera size={15} color="#0F172A" />
                <span>📷 Tirar Foto</span>
              </button>

              <button
                type="button"
                onClick={() => fileUploadRef.current?.click()}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1E293B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <Paperclip size={15} color="#0F172A" />
                <span>📎 Anexar Arquivo</span>
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSalvar}
        disabled={!podeSalvar}
        style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 10, border: 'none', background: podeSalvar ? '#0F2B27' : '#E5E0D5', color: podeSalvar ? '#FAF8F3' : '#9C9A8F', fontSize: 15, fontWeight: 600, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}
      >
        {editando ? 'Salvar alterações' : 'Salvar lançamento'}
      </button>

      {editando && (
        confirmandoExclusao ? (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: '#F2DDE1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: '#7A2E3D' }}>Excluir este lançamento?</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setConfirmandoExclusao(false)} style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid #7A2E3D', background: '#fff', color: '#7A2E3D', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={onDelete} style={{ padding: '6px 10px', borderRadius: 7, border: 'none', background: '#7A2E3D', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmandoExclusao(true)}
            style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#B05A2E', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}
          >
            Excluir lançamento
          </button>
        )
      )}
    </ModalShell>
  );
}
