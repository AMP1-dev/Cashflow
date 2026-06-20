import React, { useState } from 'react';
import { Check, Plus, AlertCircle, ChevronLeft } from 'lucide-react';
import { WIZARD, CATEGORIAS, SUBCATEGORIAS_SUGERIDAS } from '../utils/constants';
import { ModalShell, FieldLabel, inputStyle } from './UIComponents';

export function ClassificacaoWizard({ descricao, sugestoesExtras, onCancel, onConcluir }) {
  const [nodeId, setNodeId] = useState('start');
  const [trilha, setTrilha] = useState([]);
  const [subEscolhida, setSubEscolhida] = useState(null);
  const [novaSubInput, setNovaSubInput] = useState('');
  const [mostrandoInputNova, setMostrandoInputNova] = useState(false);

  const node = WIZARD[nodeId];

  if (node.categoria) {
    const cat = CATEGORIAS[node.categoria];
    const subsHistorico = (sugestoesExtras || []).filter(s => !SUBCATEGORIAS_SUGERIDAS[node.categoria].includes(s));
    const todasSubs = [...SUBCATEGORIAS_SUGERIDAS[node.categoria], ...Array.from(new Set(subsHistorico))];

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
          <button onClick={() => { setNodeId('start'); setTrilha([]); setSubEscolhida(null); setMostrandoInputNova(false); setNovaSubInput(''); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#5C5A4F', fontSize: 13.5, cursor: 'pointer' }}>
            Refazer perguntas
          </button>
          <button onClick={() => onConcluir(node.categoria, subEscolhida)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#0F2B27', color: '#FAF8F3', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            Usar esta categoria
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onCancel} titulo="Vamos classificar juntos">
      {trilha.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {trilha.map((_, i) => <div key={i} style={{ height: 3, flex: 1, background: '#1F5C52', borderRadius: 2 }} />)}
          <div style={{ height: 3, flex: 1, background: '#E5E0D5', borderRadius: 2 }} />
        </div>
      )}

      {descricao && (
        <div style={{ fontSize: 12, color: '#9C9A8F', marginBottom: 14 }}>Classificando: <span style={{ color: '#5C5A4F', fontWeight: 500 }}>{descricao}</span></div>
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
