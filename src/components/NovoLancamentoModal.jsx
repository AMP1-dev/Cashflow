import { HelpCircle, Mic } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BANCOS, CATEGORIAS } from '../utils/constants';
import { construirSugestoesDescricao } from '../utils/formatters';
import { ClassificacaoWizard } from './ClassificacaoWizard';
import { FieldLabel, inputStyle, ModalShell, ToggleTipo } from './UIComponents';

export function NovoLancamentoModal({ tipoInicial, diasNoMes, lancamentoEditando, historicoCompleto, onClose, onSave, onUpdate, onDelete }) {
  const editando = !!lancamentoEditando;
  const [tipo, setTipo] = useState(editando ? lancamentoEditando.tipo : tipoInicial);
  const [descricao, setDescricao] = useState(editando ? lancamentoEditando.descricao : '');
  const [valor, setValor] = useState(editando ? String(lancamentoEditando.valor).replace('.', ',') : '');
  const [dia, setDia] = useState(editando ? lancamentoEditando.dia : (new Date().getDate() > diasNoMes ? diasNoMes : new Date().getDate()));
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

  const showMic = localStorage.getItem('amp_beta_voz') === 'true';

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

  const valorNum = parseFloat((valor || '0').replace(',', '.')) || 0;
  const podeSalvar = descricao.trim().length > 0 && valorNum > 0 && (tipo === 'receita' || categoria);

  function montarDados() {
    return {
      tipo, descricao: descricao.trim(), valor: valorNum, dia,
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <ToggleTipo label="Despesa" active={tipo === 'despesa'} color="#B05A2E" onClick={() => { setTipo('despesa'); }} />
        <ToggleTipo label="Receita" active={tipo === 'receita'} color="#1F5C52" onClick={() => setTipo('receita')} />
      </div>

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

      <FieldLabel>Dia do lançamento</FieldLabel>
      <select value={dia} onChange={e => setDia(parseInt(e.target.value))} style={inputStyle}>
        {Array.from({ length: diasNoMes }, (_, i) => i + 1).map(d => <option key={d} value={d}>Dia {d}</option>)}
      </select>

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
                style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 10, border: `1px solid ${CATEGORIAS[categoria].color}`, background: CATEGORIAS[categoria].bg, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: CATEGORIAS[categoria].color }}>{CATEGORIAS[categoria].label}</div>
                  {subcategoria && <div style={{ fontSize: 12, color: '#5C5A4F', marginTop: 2 }}>{subcategoria}</div>}
                </div>
                <span style={{ fontSize: 11.5, color: CATEGORIAS[categoria].color, textDecoration: 'underline' }}>refazer perguntas</span>
              </button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {Object.entries(CATEGORIAS).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => { setCategoria(key); setSubcategoria(''); }}
                    style={{
                      padding: '6px 10px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer',
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
            </>
          ) : (
            <button
              onClick={() => setShowWizard(true)}
              style={{ width: '100%', padding: '13px 14px', borderRadius: 10, border: '1px dashed #C9A063', background: '#FBF3E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#8A6D1A', fontSize: 13.5, fontWeight: 500 }}
            >
              <HelpCircle size={16} />
              Não sei classificar — me ajude
            </button>
          )}

          {categoria && (
            <>
              <FieldLabel>Banco / Conta (opcional)</FieldLabel>
              <select value={banco} onChange={e => setBanco(e.target.value)} style={inputStyle}>
                <option value="">Selecionar banco...</option>
                {BANCOS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </>
          )}
        </>
      )}

      {categoria && (
        <>
          <FieldLabel>Meio de pagamento / Como pagou (opcional)</FieldLabel>
          <select value={meioPagamento} onChange={e => setMeioPagamento(e.target.value)} style={inputStyle}>
            <option value="">Selecionar meio de pagamento...</option>
            <option value="PIX">PIX</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cheque">Cheque</option>
            <option value="Cartão">Cartão</option>
            <option value="Transferência">Transferência</option>
          </select>
        </>
      )}

      <button
        onClick={handleSalvar}
        disabled={!podeSalvar}
        style={{ width: '100%', marginTop: 22, padding: '14px', borderRadius: 10, border: 'none', background: podeSalvar ? '#0F2B27' : '#E5E0D5', color: podeSalvar ? '#FAF8F3' : '#9C9A8F', fontSize: 15, fontWeight: 600, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}
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
