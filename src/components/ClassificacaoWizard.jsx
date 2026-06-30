import { AlertCircle, Check, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIAS, SUBCATEGORIAS_SUGERIDAS, WIZARD } from '../utils/constants';
import { FieldLabel, inputStyle, ModalShell } from './UIComponents';

// ---------- Wizard de fracionamento CMV ----------

function parseBRL(str) {
  return parseFloat((str || '0').replace(',', '.')) || 0;
}

function formatBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const CATEGORIAS_OPCOES = Object.entries(CATEGORIAS).filter(([k]) => k !== 'cmv').map(([key, cat]) => ({ key, ...cat }));

function FracionamentoWizard({ valorTotal, onCancelar, onConfirmar }) {
  const [partes, setPartes] = useState([]);
  const [inputValor, setInputValor] = useState('');
  const [inputDescricao, setInputDescricao] = useState('');
  const [inputCategoria, setInputCategoria] = useState(null);
  const [inputSubcategoria, setInputSubcategoria] = useState('');
  const [mostrandoAlertaCmv, setMostrandoAlertaCmv] = useState(false);

  const totalDistribuido = partes.reduce((s, p) => s + p.valor, 0);
  const restante = valorTotal - totalDistribuido;
  const pct = (totalDistribuido / valorTotal) * 100;

  function addParte() {
    const v = parseBRL(inputValor);
    if (v <= 0 || !inputCategoria) return;
    setPartes(prev => [...prev, { id: uid(), valor: v, descricao: inputDescricao.trim(), categoria: inputCategoria, subcategoria: inputSubcategoria }]);
    setInputValor('');
    setInputDescricao('');
    setInputCategoria(null);
    setInputSubcategoria('');
  }

  function removerParte(id) {
    setPartes(prev => prev.filter(p => p.id !== id));
  }

  const podeSalvar = partes.length > 0 && restante >= -0.005;

  function handleConfirmar() {
    if (!podeSalvar) return;
    
    if (restante > 0.005) {
      const partesFinais = [...partes, { id: uid(), valor: restante, descricao: 'Restante CMV', categoria: 'cmv', subcategoria: '' }];
      onConfirmar(partesFinais);
    } else {
      const temCmv = partes.some(p => p.categoria === 'cmv');
      if (!temCmv) {
        setMostrandoAlertaCmv(true);
      } else {
        onConfirmar(partes);
      }
    }
  }

  if (mostrandoAlertaCmv) {
    return (
      <ModalShell onClose={onCancelar} titulo="Atenção">
        <div style={{ background: '#F2DDE1', borderRadius: 14, padding: 18, textAlign: 'center', marginBottom: 16 }}>
          <AlertCircle size={28} color="#7A2E3D" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: 13, color: '#7A2E3D', lineHeight: 1.5 }}>
            <strong>Ops!</strong> No início foi informado que esta despesa era para o seu produto (CMV), mas você distribuiu todo o valor em outras categorias.
          </div>
          <div style={{ fontSize: 13, color: '#7A2E3D', marginTop: 12, fontWeight: 500 }}>
            Tem certeza que nenhuma parte dessa nota foi para a fabricação/produto?
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => { setMostrandoAlertaCmv(false); onConfirmar(partes); }}
            style={{ padding: '13px', borderRadius: 10, border: 'none', background: '#7A2E3D', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Sim, confirmar categorias
          </button>
          <button
            onClick={() => setMostrandoAlertaCmv(false)}
            style={{ padding: '13px', borderRadius: 10, border: '1px solid #7A2E3D', background: '#fff', color: '#7A2E3D', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Não, quero revisar
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onCancelar} titulo="Fracionar lançamento">
      {/* Barra de progresso de distribuição */}
      <div style={{ background: '#F0EDE3', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, color: '#5C5A4F', fontWeight: 600 }}>Total do lançamento</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1C2421', fontFamily: 'Georgia, serif' }}>{formatBRL(valorTotal)}</span>
        </div>
        <div style={{ height: 6, background: '#E5E0D5', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct > 100 ? '#B05A2E' : '#1F5C52', borderRadius: 3, transition: 'width 0.2s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#9C9A8F' }}>Distribuído: {formatBRL(totalDistribuido)}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: restante < -0.005 ? '#B05A2E' : restante < 0.005 ? '#1F5C52' : '#8A6D1A' }}>
            {restante < -0.005 ? `Excedeu ${formatBRL(Math.abs(restante))}` : restante < 0.005 ? '✓ Fechado' : `Faltam ${formatBRL(restante)}`}
          </span>
        </div>
      </div>

      {/* Partes já adicionadas */}
      {partes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {partes.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E5E0D5', borderRadius: 10, padding: '9px 12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: CATEGORIAS[p.categoria].color, background: CATEGORIAS[p.categoria].bg, padding: '2px 7px', borderRadius: 6 }}>
                    {CATEGORIAS[p.categoria].short}
                  </span>
                  {p.descricao && <span style={{ fontSize: 12, color: '#5C5A4F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descricao}</span>}
                </div>
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1C2421', flexShrink: 0 }}>{formatBRL(p.valor)}</span>
              <button onClick={() => removerParte(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9C5B6', padding: 2, flexShrink: 0 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulário de nova parte */}
      {restante > 0.005 && (
        <div style={{ background: '#F8F6F1', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 10 }}>
            {partes.length === 0 ? 'Qual parte não é CMV?' : 'Adicionar mais uma parte'}
          </div>

          <FieldLabel>Valor desta parte</FieldLabel>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9C9A8F' }}>R$</span>
            <input
              value={inputValor}
              onChange={e => setInputValor(e.target.value)}
              placeholder={restante > 0 ? (restante).toFixed(2).replace('.', ',') : '0,00'}
              inputMode="decimal"
              style={{ ...inputStyle, paddingLeft: 34 }}
            />
          </div>
          {restante > 0.005 && (
            <button onClick={() => setInputValor(restante.toFixed(2).replace('.', ','))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C8A71', fontSize: 11, marginTop: -4, marginBottom: 6, padding: 0 }}>
              Usar restante ({formatBRL(restante)})
            </button>
          )}

          <FieldLabel>Descrição (opcional)</FieldLabel>
          <input
            value={inputDescricao}
            onChange={e => setInputDescricao(e.target.value)}
            placeholder="Ex: Frascos para revenda no site"
            style={inputStyle}
          />

          <FieldLabel>Para qual categoria vai?</FieldLabel>
          <div style={{ display: 'flex', gap: 8, background: '#F0EDE3', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
            <AlertCircle size={14} color="#9C9A8F" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: '#7A7868', lineHeight: 1.5 }}>
              <strong>Despesa Variável</strong> = gasto que muda conforme sua venda (embalagem, frete, comissão, produto pronto pra revender).<br />
              <strong>Despesa Fixa</strong> = gasto que não muda mesmo se vender mais ou menos (aluguel, mensalidade, salário fixo).<br />
              <strong>Despesa Financeira</strong> = juros, tarifas bancárias, IOF, taxas de cartão.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CATEGORIAS_OPCOES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setInputCategoria(cat.key === inputCategoria ? null : cat.key)}
                style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
                  border: `1px solid ${cat.key === inputCategoria ? cat.color : '#E5E0D5'}`,
                  background: cat.key === inputCategoria ? cat.bg : '#fff',
                  color: cat.key === inputCategoria ? cat.color : '#1C2421',
                  fontSize: 13.5, fontWeight: cat.key === inputCategoria ? 600 : 400,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={addParte}
            disabled={parseBRL(inputValor) <= 0 || !inputCategoria}
            style={{
              width: '100%', marginTop: 12, padding: '11px', borderRadius: 9, border: 'none',
              background: parseBRL(inputValor) > 0 && inputCategoria ? '#1F5C52' : '#E5E0D5',
              color: parseBRL(inputValor) > 0 && inputCategoria ? '#fff' : '#9C9A8F',
              fontSize: 13.5, fontWeight: 600, cursor: parseBRL(inputValor) > 0 && inputCategoria ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Plus size={14} /> Adicionar parte
          </button>
        </div>
      )}

      {/* Ações finais */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button onClick={onCancelar} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#5C5A4F', fontSize: 13.5, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button
          onClick={handleConfirmar}
          disabled={!podeSalvar}
          style={{
            flex: 2, padding: '12px', borderRadius: 10, border: 'none',
            background: podeSalvar ? '#0F2B27' : '#E5E0D5',
            color: podeSalvar ? '#FAF8F3' : '#9C9A8F',
            fontSize: 12.5, fontWeight: 600, cursor: podeSalvar ? 'pointer' : 'not-allowed',
          }}
        >
          {restante > 0.005 ? `Confirmar e lançar ${formatBRL(restante)} no CMV` : 'Confirmar fracionamento'}
        </button>
      </div>
    </ModalShell>
  );
}

// ---------- Wizard principal de classificação ----------

export function ClassificacaoWizard({ descricao, valorTotal, sugestoesExtras, onCancel, onConcluir, onConcluirFracionado }) {
  const [nodeId, setNodeId] = useState('start');
  const [trilha, setTrilha] = useState([]);
  const [subEscolhida, setSubEscolhida] = useState(null);
  const [novaSubInput, setNovaSubInput] = useState('');
  const [mostrandoInputNova, setMostrandoInputNova] = useState(false);
  // fases para CMV: 'subcategoria' | 'perguntaFracao' | 'fracionamento'
  const [faseCmv, setFaseCmv] = useState('subcategoria');

  const node = WIZARD[nodeId];

  // Chegou numa categoria final
  if (node.categoria) {
    const cat = CATEGORIAS[node.categoria];
    const subsHistorico = (sugestoesExtras || []).filter(s => !(node.subcategorias || SUBCATEGORIAS_SUGERIDAS[node.categoria]).includes(s));
    const todasSubs = [...(node.subcategorias || SUBCATEGORIAS_SUGERIDAS[node.categoria]), ...Array.from(new Set(subsHistorico))];

    // Fase de pergunta de fracionamento (só CMV)
    if (node.categoria === 'cmv' && faseCmv === 'perguntaFracao') {
      return (
        <ModalShell onClose={onCancel} titulo="Confirmar CMV">
          <div style={{ background: cat.bg, borderRadius: 14, padding: 18, textAlign: 'center', marginBottom: 16 }}>
            <Check size={28} color={cat.color} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: cat.color }}>Esta despesa é</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: cat.color, marginTop: 2 }}>{cat.label}</div>
            {valorTotal > 0 && (
              <div style={{ fontSize: 14, fontWeight: 700, color: cat.color, marginTop: 6 }}>
                {formatBRL(valorTotal)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, background: '#F0EDE3', borderRadius: 10, padding: '10px 12px', marginBottom: 18 }}>
            <AlertCircle size={14} color="#9C9A8F" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12.5, color: '#7A7868', lineHeight: 1.5 }}>
              CMV (Custo da Mercadoria Vendida) é tudo que você compra <em>exclusivamente</em> para fabricar ou montar o produto que você vende. Se a nota também tem itens para outros fins, vamos separá-los agora.
            </div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 500, color: '#1C2421', marginBottom: 14 }}>
            {valorTotal > 0 ? `Os ${formatBRL(valorTotal)} são 100% para fabricação do seu produto?` : 'Este valor é 100% para fabricação do seu produto?'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => onConcluir(node.categoria, subEscolhida)}
              style={{ textAlign: 'left', padding: '13px 14px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', fontSize: 14, color: '#1C2421', cursor: 'pointer' }}
            >
              ✅ Sim, tudo vai para fabricação
            </button>
            <button
              onClick={() => setFaseCmv('fracionamento')}
              style={{ textAlign: 'left', padding: '13px 14px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', fontSize: 14, color: '#1C2421', cursor: 'pointer' }}
            >
              ✂️ Não — quero fracionar em categorias diferentes
            </button>
          </div>

          <button onClick={() => setFaseCmv('subcategoria')} style={{ marginTop: 14, background: 'none', border: 'none', color: '#9C9A8F', fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={14} /> Voltar
          </button>
        </ModalShell>
      );
    }

    // Fase de fracionamento
    if (node.categoria === 'cmv' && faseCmv === 'fracionamento') {
      return (
        <FracionamentoWizard
          valorTotal={valorTotal || 0}
          onCancelar={() => setFaseCmv('perguntaFracao')}
          onConfirmar={(partes) => onConcluirFracionado && onConcluirFracionado(partes)}
        />
      );
    }

    // Fase padrão: escolha de subcategoria
    return (
      <ModalShell onClose={onCancel} titulo="Classificação sugerida">
        <div style={{ background: cat.bg, borderRadius: 14, padding: 18, textAlign: 'center', marginBottom: 16 }}>
          <Check size={28} color={cat.color} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: cat.color }}>Esta despesa é</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: cat.color, marginTop: 2 }}>{cat.label}</div>
        </div>

        <FieldLabel>Que tal detalhar com uma subcategoria? (opcional)</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {todasSubs.map(s => (
            <button
              key={s}
              onClick={() => { setSubEscolhida(s === subEscolhida ? null : s); setMostrandoInputNova(false); }}
              style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer',
                border: `1px solid ${s === subEscolhida ? cat.color : '#E5E0D5'}`,
                background: s === subEscolhida ? cat.bg : '#fff',
                color: s === subEscolhida ? cat.color : '#5C5A4F',
                fontWeight: s === subEscolhida ? 600 : 400,
              }}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => { setMostrandoInputNova(true); setSubEscolhida(null); }}
            style={{
              padding: '8px 12px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer',
              border: `1px dashed ${mostrandoInputNova ? cat.color : '#C9C5B6'}`,
              background: mostrandoInputNova ? cat.bg : '#fff',
              color: mostrandoInputNova ? cat.color : '#9C9A8F',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Plus size={12} /> outra
          </button>
        </div>

        {mostrandoInputNova && (
          <input
            value={novaSubInput}
            onChange={e => { setNovaSubInput(e.target.value); setSubEscolhida(e.target.value.trim() || null); }}
            placeholder="Digite a subcategoria"
            style={{ ...inputStyle, marginTop: 10 }}
            autoFocus
          />
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
          <button
            onClick={() => { setNodeId('start'); setTrilha([]); setSubEscolhida(null); setMostrandoInputNova(false); setNovaSubInput(''); setFaseCmv('subcategoria'); }}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#5C5A4F', fontSize: 13.5, cursor: 'pointer' }}
          >
            Refazer perguntas
          </button>
          <button
            onClick={() => {
              if (node.categoria === 'cmv') {
                setFaseCmv('perguntaFracao');
              } else {
                onConcluir(node.categoria, subEscolhida);
              }
            }}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#0F2B27', color: '#FAF8F3', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Usar esta categoria
          </button>
        </div>
      </ModalShell>
    );
  }

  // Perguntas do wizard
  return (
    <ModalShell onClose={onCancel} titulo="Vamos classificar juntos">
      {trilha.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {trilha.map((_, i) => <div key={i} style={{ height: 3, flex: 1, background: '#1F5C52', borderRadius: 2 }} />)}
          <div style={{ height: 3, flex: 1, background: '#E5E0D5', borderRadius: 2 }} />
        </div>
      )}

      {descricao && (
        <div style={{ fontSize: 12, color: '#9C9A8F', marginBottom: 14 }}>
          Classificando: <span style={{ color: '#5C5A4F', fontWeight: 500 }}>{descricao}</span>
        </div>
      )}

      <div style={{ fontSize: 16, fontWeight: 500, color: '#1C2421', marginBottom: 10, lineHeight: 1.4 }}>{node.pergunta}</div>

      <div style={{ display: 'flex', gap: 8, background: '#F0EDE3', borderRadius: 10, padding: '10px 12px', marginBottom: 18 }}>
        <AlertCircle size={15} color="#9C9A8F" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, color: '#7A7868', lineHeight: 1.5 }}>{node.ajuda}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {node.opcoes.map(op => (
          <button
            key={op.texto}
            onClick={() => { setTrilha([...trilha, nodeId]); setNodeId(op.proximo); }}
            style={{ textAlign: 'left', padding: '13px 14px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', fontSize: 14, color: '#1C2421', cursor: 'pointer' }}
          >
            {op.texto}
          </button>
        ))}
      </div>

      {trilha.length > 0 && (
        <button
          onClick={() => { const novaTrilha = [...trilha]; const anterior = novaTrilha.pop(); setTrilha(novaTrilha); setNodeId(anterior); }}
          style={{ marginTop: 16, background: 'none', border: 'none', color: '#9C9A8F', fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <ChevronLeft size={14} /> Voltar pergunta anterior
        </button>
      )}
    </ModalShell>
  );
}
