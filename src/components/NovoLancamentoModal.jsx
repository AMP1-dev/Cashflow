import { AlertTriangle, HelpCircle, Mic, AlertCircle, BookOpen, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BANCOS, CATEGORIAS, MESES, SUBCATEGORIAS_SUGERIDAS, PLANO_DE_CONTAS_SUGERIDO } from '../utils/constants';
import { construirSugestoesDescricao, daysInMonth, formatBRL } from '../utils/formatters';
import { ClassificacaoWizard } from './ClassificacaoWizard';
import { FieldLabel, inputStyle, ModalShell, ToggleTipo } from './UIComponents';

export function NovoLancamentoModal({ tipoInicial, diasNoMes, mesAtual = new Date().getMonth(), anoAtual = new Date().getFullYear(), lancamentoEditando, historicoCompleto, onClose, onSave, onUpdate, onDelete }) {
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
      categoria: tipo === 'despesa' ? categoria : null,
      subcategoria: tipo === 'despesa' ? subcategoria : null,
      formaRecebimento: tipo === 'receita' ? (formaRecebimento === 'avista' ? 'À vista/PIX' : 'À prazo') : null,
      qtdVendas: tipo === 'receita' && qtdVendas ? parseInt(qtdVendas) || null : null,
      banco: banco || null,
      meio_pagamento: meioPagamento || null,
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <ToggleTipo label="Despesa" active={tipo === 'despesa'} color="#B05A2E" onClick={() => { setTipo('despesa'); }} />
        <ToggleTipo label="Receita" active={tipo === 'receita'} color="#1F5C52" onClick={() => setTipo('receita')} />
      </div>

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
          <FieldLabel>Mês do lançamento (Pagamento/Caixa)</FieldLabel>
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
          <select value={dia} onChange={e => setDia(parseInt(e.target.value))} style={inputStyle}>
            {Array.from({ length: daysInMonth(mes, anoAtual) }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>Dia {d}</option>
            ))}
          </select>
        </div>
      </div>

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
        </>
      )}

      {tipo === 'despesa' && (
        <>
          <FieldLabel>Categoria contábil</FieldLabel>
          {categoria ? (
            <>
              <button
                onClick={() => setShowWizard(true)}
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

              {/* Nota Informativa sobre Mão de Obra Extra (Item 1) */}
              {subcategoria && (subcategoria.toLowerCase().includes('mão de obra') || subcategoria.toLowerCase().includes('diária') || subcategoria.toLowerCase().includes('diaria') || subcategoria.toLowerCase().includes('freelancer')) && (
                <div style={{ marginTop: 8, padding: '7px 9px', borderRadius: 8, background: '#EAF4F1', border: '1px solid #1F5C52', fontSize: 11, color: '#1F5C52', lineHeight: 1.3 }}>
                  💡 <strong>Nota:</strong> Lançamento de diária/freelancer extra de produção. Contabilizado como <strong>despesa variável</strong>, sem distorcer o CMV de alimentos/insumos da DRE.
                </div>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowWizard(true)}
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

                {/* Pílulas/Abas dos Grupos do Plano de Contas */}
                <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 6, marginBottom: 10 }}>
                  {PLANO_DE_CONTAS_SUGERIDO.map(grupo => {
                    const ativo = grupoPlanoAberto === grupo.id;
                    return (
                      <button
                        key={grupo.id}
                        type="button"
                        onClick={() => setGrupoPlanoAberto(grupo.id)}
                        style={{
                          padding: '5px 9px',
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: ativo ? 700 : 500,
                          whiteSpace: 'nowrap',
                          border: `1px solid ${ativo ? grupo.badgeColor : '#E5E0D5'}`,
                          background: ativo ? grupo.badgeBg : '#F5F3ED',
                          color: ativo ? grupo.badgeColor : '#6B685D',
                          cursor: 'pointer',
                        }}
                      >
                        {grupo.grupo.split(' (')[0]}
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
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
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
                                padding: '5px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: 'pointer',
                                border: `1px solid ${selecionado ? grupoSel.badgeColor : '#DDD8CE'}`,
                                background: selecionado ? grupoSel.badgeBg : '#fff',
                                color: selecionado ? grupoSel.badgeColor : '#3A3831',
                                fontWeight: selecionado ? 700 : 400,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                transition: 'all 0.15s',
                              }}
                            >
                              {selecionado && <Check size={11} color={grupoSel.badgeColor} />}
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

      {/* Alerta Preventivo de Concentração de Despesas (Item 2) */}
      {alertaConcentracao && (
        <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 8, background: '#FFF8E7', border: '1px solid #E8A33D', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <AlertTriangle size={18} style={{ color: '#E8A33D', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 11.5, color: '#8A5D00', lineHeight: 1.4 }}>
            <strong>Alerta de Concentração:</strong> Os <strong>{alertaConcentracao.diasStr}</strong> já acumulam <strong>{formatBRL(alertaConcentracao.total)}</strong> em saídas previstas. Avalie negociar este vencimento para aliviar a pressão no caixa desse período.
          </div>
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
