import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

// ─── Áreas e perguntas ────────────────────────────────────────────────────────

const AREAS = [
  {
    id: 'operacional',
    label: 'Gestão Operacional',
    labelRadar: 'Operacional',
    cor: '#1F5C52',
    bg: '#D9EBE6',
    fundo: '#EAF4F0',
    perguntas: [
      { id: 'recebiveis',       texto: 'Gestão de Recebíveis',      dica: 'Você controla quem te deve, quando vai receber e cobra ativamente os clientes em atraso?' },
      { id: 'pagamentos',       texto: 'Gestão de Pagamentos',       dica: 'Você sabe exatamente quais contas vencem e quando, evitando atrasos e juros?' },
      { id: 'analise',          texto: 'Análise de Resultados',      dica: 'Você analisa regularmente se o negócio está lucrando, quanto e por quê?' },
      { id: 'custos',           texto: 'Custos Fixos e Variáveis',   dica: 'Você conhece e separa seus custos fixos (aluguel, salários) dos variáveis (matéria-prima, comissões)?' },
    ],
    interpretacoes: [
      { ate: 0.40, texto: 'Sua gestão operacional ainda é muito informal. Controlar recebíveis e pagamentos é o passo mais urgente para evitar crises de caixa.' },
      { ate: 0.70, texto: 'Você tem práticas operacionais básicas, mas ainda com inconsistências que geram perdas silenciosas. Padronize suas rotinas.' },
      { ate: 1.00, texto: 'Gestão operacional bem estruturada! Continue refinando e, se possível, automatize seus processos.' },
    ],
  },
  {
    id: 'controle',
    label: 'Organização e Controle',
    labelRadar: 'Org. Controle',
    cor: '#2E6B8A',
    bg: '#D4E8F0',
    fundo: '#EBF4F8',
    perguntas: [
      { id: 'org_financeira',   texto: 'Organização Financeira',                        dica: 'Suas finanças são organizadas, com registros claros de todas as entradas e saídas?' },
      { id: 'separacao_contas', texto: 'Separação de Contas Pessoais e Empresariais',   dica: 'Você separa completamente as finanças da empresa das suas finanças pessoais?' },
      { id: 'fluxo_caixa',      texto: 'Controle de Fluxo de Caixa',                   dica: 'Você registra e acompanha todas as movimentações de dinheiro do negócio?' },
      { id: 'estoque',          texto: 'Controle de Estoque',                           dica: 'Você sabe o que tem em estoque, quanto vale e quando precisa repor?' },
    ],
    interpretacoes: [
      { ate: 0.40, texto: 'Falta de organização é um dos principais motivos de falência. Priorize separar as contas e registrar tudo.' },
      { ate: 0.70, texto: 'Você já tem algum controle, mas ainda perde dados importantes no caminho. Consistência é a chave.' },
      { ate: 1.00, texto: 'Excelente organização! Com tudo registrado e separado, você tem clareza para tomar boas decisões.' },
    ],
  },
  {
    id: 'planejamento',
    label: 'Planejamento e Estratégia',
    labelRadar: 'Planejamento',
    cor: '#6B4E8A',
    bg: '#E8D9F0',
    fundo: '#F2EBF8',
    perguntas: [
      { id: 'plan_financeiro',  texto: 'Planejamento Financeiro',    dica: 'Você planeja suas finanças com antecedência, definindo metas e orçamentos para o ano?' },
      { id: 'indicadores',      texto: 'Indicadores Utilizados',     dica: 'Você acompanha indicadores como margem de lucro, ticket médio, custo por venda?' },
      { id: 'tributario',       texto: 'Planejamento Tributário',    dica: 'Você analisa o melhor regime tributário e planeja o pagamento de impostos com antecedência?' },
      { id: 'visao_futuro',     texto: 'Visão de Futuro',            dica: 'Você tem um plano de crescimento com metas claras para os próximos 1 a 3 anos?' },
    ],
    interpretacoes: [
      { ate: 0.40, texto: 'Sem planejamento, o negócio reage a problemas em vez de crescer. Definir metas e indicadores é o próximo passo.' },
      { ate: 0.70, texto: 'Você já pensa estrategicamente, mas de forma irregular. Formalizar o planejamento fará grande diferença.' },
      { ate: 1.00, texto: 'Ótimo planejamento! Negócios que planejam têm muito mais chances de crescer de forma sustentável.' },
    ],
  },
  {
    id: 'saude',
    label: 'Saúde Financeira',
    labelRadar: 'Saúde Fin.',
    cor: '#2E7A8A',
    bg: '#D4EDF0',
    fundo: '#EAF5F7',
    perguntas: [
      { id: 'reservas',         texto: 'Reservas e Capital de Giro', dica: 'Você mantém uma reserva financeira suficiente para cobrir despesas em meses mais fracos?' },
      { id: 'endividamento',    texto: 'Endividamento',               dica: 'Você gerencia suas dívidas de forma consciente, evitando juros excessivos e comprometimento do caixa?' },
    ],
    interpretacoes: [
      { ate: 0.40, texto: 'Sua saúde financeira está frágil. Construir reservas e reduzir dívidas deve ser prioridade imediata.' },
      { ate: 0.70, texto: 'Você tem alguma estrutura, mas ainda é vulnerável a imprevistos. Reforce suas reservas gradualmente.' },
      { ate: 1.00, texto: 'Boa saúde financeira! Você tem base segura para crescer com tranquilidade.' },
    ],
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia e Suporte',
    labelRadar: 'Tecnologia',
    cor: '#4A4A4A',
    bg: '#E5E0D5',
    fundo: '#F0EDE3',
    perguntas: [
      { id: 'tecnologias',      texto: 'Tecnologias Utilizadas',     dica: 'Você usa ferramentas digitais (apps, sistemas) para organizar e otimizar a gestão do negócio?' },
    ],
    interpretacoes: [
      { ate: 0.40, texto: 'Adotar ferramentas digitais pode transformar a eficiência do seu negócio. Comece com o básico.' },
      { ate: 0.70, texto: 'Você já usa tecnologia, mas ainda há ganhos disponíveis com melhores ferramentas.' },
      { ate: 1.00, texto: 'Você aproveita bem a tecnologia para potencializar seu negócio!' },
    ],
  },
];

const OPCOES = [
  { label: 'Não faço / Inexistente',             pontos: 0 },
  { label: 'Faço de forma muito básica',          pontos: 1 },
  { label: 'Faço parcialmente / irregular',       pontos: 2 },
  { label: 'Faço de forma razoável',              pontos: 3 },
  { label: 'Faço bem estruturado',                pontos: 4 },
  { label: 'Faço de forma excelente / completa',  pontos: 5 },
];

// ─── Radar Chart ─────────────────────────────────────────────────────────────

function RadarChart({ ratios }) {
  const cx = 178, cy = 148, r = 96;
  const n = AREAS.length;
  const angles = Array.from({ length: n }, (_, i) => (Math.PI * 2 * i / n) - Math.PI / 2);

  function pt(angle, ratio) {
    return [cx + ratio * r * Math.cos(angle), cy + ratio * r * Math.sin(angle)];
  }

  function polyStr(ratio) {
    return angles.map(a => pt(a, ratio).join(',')).join(' ');
  }

  const userPts = angles.map((a, i) => pt(a, Math.max(0.03, ratios[i])).join(',')).join(' ');

  return (
    <svg viewBox="0 0 356 296" width="100%" style={{ display: 'block' }}>
      {/* Grade */}
      {[0.25, 0.5, 0.75, 1.0].map(ratio => (
        <polygon
          key={ratio}
          points={polyStr(ratio)}
          fill="none"
          stroke={ratio === 1.0 ? '#C9C5B6' : '#E5E0D5'}
          strokeWidth={ratio === 1.0 ? 1.5 : 0.8}
        />
      ))}

      {/* Eixos */}
      {angles.map((a, i) => {
        const [x2, y2] = pt(a, 1);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#E5E0D5" strokeWidth="1" />;
      })}

      {/* Marcadores de % */}
      {[0.25, 0.5, 0.75].map(ratio => (
        <text key={ratio} x={cx + 4} y={cy - ratio * r + 4} fontSize="7" fill="#B0AA9A" fontFamily="sans-serif">
          {(ratio * 100).toFixed(0)}%
        </text>
      ))}

      {/* Polígono do usuário */}
      <polygon
        points={userPts}
        fill="rgba(15, 43, 39, 0.14)"
        stroke="#0F2B27"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Pontos nos vértices */}
      {angles.map((a, i) => {
        const [x, y] = pt(a, Math.max(0.03, ratios[i]));
        return <circle key={i} cx={x} cy={y} r="4.5" fill={AREAS[i].cor} stroke="#FAF8F3" strokeWidth="1.5" />;
      })}

      {/* Labels das áreas */}
      {angles.map((a, i) => {
        const [lx, ly] = pt(a, 1.30);
        const cos = Math.cos(a);
        const anchor = cos < -0.1 ? 'end' : cos > 0.1 ? 'start' : 'middle';
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="9.5"
            fill={AREAS[i].cor}
            fontFamily="sans-serif"
            fontWeight="600"
          >
            {AREAS[i].labelRadar}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcScore(area, respostas) {
  const max = area.perguntas.length * 5;
  const score = area.perguntas.reduce((s, p) => s + (respostas[p.id] ?? 0), 0);
  return { score, max, pct: max > 0 ? score / max : 0 };
}

function interpArea(area, pct) {
  for (const t of area.interpretacoes) {
    if (pct <= t.ate) return t.texto;
  }
  return area.interpretacoes[area.interpretacoes.length - 1].texto;
}

function nivelGeral(pct) {
  if (pct < 0.33) return { label: 'Estágio Inicial',        cor: '#B05A2E' };
  if (pct < 0.53) return { label: 'Em Desenvolvimento',     cor: '#C4782A' };
  if (pct < 0.73) return { label: 'Intermediário',          cor: '#8A6D1A' };
  if (pct < 0.87) return { label: 'Avançado',               cor: '#1F5C52' };
  return             { label: 'Referência em Gestão',        cor: '#0F2B27' };
}

function textoGeral(pct) {
  if (pct < 0.33) return 'Seu negócio ainda opera de forma muito informal. O primeiro passo é criar rotinas básicas de controle financeiro e separar as contas pessoais das empresariais.';
  if (pct < 0.53) return 'Você já tem algumas práticas, mas ainda há muito espaço para estruturar a gestão. Foque nas áreas com menor pontuação — pequenas mudanças geram grande impacto.';
  if (pct < 0.73) return 'Boa base! Sua gestão tem consistência em várias áreas. Agora é hora de elevar o nível nas lacunas identificadas para atingir uma gestão realmente estruturada.';
  if (pct < 0.87) return 'Você tem uma gestão bem estruturada. Refine os processos restantes e considere automatizar rotinas para chegar à excelência.';
  return 'Parabéns! Sua empresa tem maturidade financeira e operacional acima da média. Continue evoluindo e seja referência para outros empreendedores.';
}

// ─── Tela ─────────────────────────────────────────────────────────────────────
// Props:
//   onVoltar — callback para fechar a tela (botão "Voltar ao app")
//              Omita se for exibir após o cadastro sem botão de volta

export function DiagnosticoScreen({ onVoltar }) {
  const [fase, setFase] = useState('intro');   // 'intro' | 'perguntas' | 'resultado'
  const [etapa, setEtapa] = useState(0);       // 0-4 (índice da área)
  const [perguntaIdx, setPerguntaIdx] = useState(0); // índice da pergunta na área
  const [respostas, setRespostas] = useState({});

  const totalPerguntas = AREAS.reduce((s, a) => s + a.perguntas.length, 0);
  const areaAtual = AREAS[etapa];
  const perguntaAtual = areaAtual?.perguntas[perguntaIdx];
  const respondidaAtual = respostas[perguntaAtual?.id] !== undefined;

  const scores = useMemo(() => AREAS.map(a => calcScore(a, respostas)), [respostas]);
  const scoreTotal = scores.reduce((s, sc) => s + sc.score, 0);
  const maxTotal   = scores.reduce((s, sc) => s + sc.max, 0);
  const pctTotal   = maxTotal > 0 ? scoreTotal / maxTotal : 0;
  const nivel      = nivelGeral(pctTotal);

  function responder(id, pontos) {
    setRespostas(prev => ({ ...prev, [id]: pontos }));
    // Auto-avanço com pequeno delay para feedback visual
    setTimeout(() => {
      avancarLocal();
    }, 450);
  }

  function avancarLocal() {
    setPerguntaIdx(currentIdx => {
      if (currentIdx < areaAtual.perguntas.length - 1) {
        window.scrollTo(0, 0);
        return currentIdx + 1;
      } else {
        setEtapa(e => {
          if (e < AREAS.length - 1) {
            window.scrollTo(0, 0);
            return e + 1;
          } else {
            setFase('resultado');
            window.scrollTo(0, 0);
            return e;
          }
        });
        return 0;
      }
    });
  }

  function avancar() {
    avancarLocal();
  }

  function voltar() {
    if (fase === 'resultado') { 
      setFase('perguntas'); 
      setEtapa(AREAS.length - 1); 
      setPerguntaIdx(AREAS[AREAS.length - 1].perguntas.length - 1);
    } else if (perguntaIdx > 0) { 
      setPerguntaIdx(p => p - 1); 
    } else if (etapa > 0) { 
      setEtapa(e => e - 1); 
      setPerguntaIdx(AREAS[etapa - 1].perguntas.length - 1);
    } else { 
      setFase('intro'); 
    }
    window.scrollTo(0, 0);
  }

  function reiniciar() {
    setFase('intro'); setEtapa(0); setPerguntaIdx(0); setRespostas({});
    window.scrollTo(0, 0);
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────

  if (fase === 'intro') {
    return (
      <div style={{ padding: 16 }}>
        {onVoltar && (
          <button onClick={onVoltar} style={{ background: 'none', border: 'none', color: '#9C9A8F', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, padding: 0 }}>
            <ChevronLeft size={15} /> Voltar
          </button>
        )}

        <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1C2421', marginBottom: 2 }}>Diagnóstico do Negócio</div>
        <div style={{ fontSize: 12.5, color: '#9C9A8F', marginBottom: 20 }}>Avalie a maturidade financeira e operacional da sua empresa</div>

        <div style={{ background: '#EAF4F0', border: '1px solid #CFEAD9', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1F5C52', marginBottom: 6 }}>Como funciona</div>
          <div style={{ fontSize: 13, color: '#3D5C49', lineHeight: 1.65 }}>
            São <strong>{totalPerguntas} perguntas</strong> em <strong>{AREAS.length} áreas</strong> da gestão. Para cada uma, escolha o nível que melhor descreve sua situação hoje. No final você recebe um gráfico mostrando onde está forte e onde pode evoluir.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {AREAS.map((area, i) => (
            <div key={area.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: area.fundo, border: `1px solid ${area.bg}`, borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: area.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: area.cor }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: area.cor }}>{area.label}</div>
                <div style={{ fontSize: 11, color: '#9C9A8F' }}>{area.perguntas.length} {area.perguntas.length === 1 ? 'pergunta' : 'perguntas'}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setFase('perguntas'); setEtapa(0); setPerguntaIdx(0); }}
          style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#0F2B27', color: '#FAF8F3', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          Iniciar diagnóstico →
        </button>
      </div>
    );
  }

  // ── PERGUNTAS ──────────────────────────────────────────────────────────────

  if (fase === 'perguntas') {
    return (
      <div style={{ paddingBottom: 90 }}>
        {/* Cabeçalho fixo */}
        <div style={{ position: 'sticky', top: 0, zIndex: 4, background: '#FAF8F3', padding: '12px 16px 10px', borderBottom: '1px solid #EFEBE0' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {AREAS.map((a, i) => (
              <div key={a.id} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= etapa ? a.cor : '#E5E0D5', opacity: i < etapa ? 0.45 : 1 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 1 }}>Área {etapa + 1} de {AREAS.length}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: areaAtual.cor }}>{areaAtual.label}</div>
            </div>
            <div style={{ fontSize: 11, color: '#9C9A8F' }}>{Object.keys(respostas).length}/{totalPerguntas} respondidas</div>
          </div>
        </div>

        {/* Pergunta única em destaque */}
        <div style={{ padding: '20px 16px 0', minHeight: 400 }}>
          {perguntaAtual && (() => {
            const sel = respostas[perguntaAtual.id];
            return (
              <div key={perguntaAtual.id} style={{ marginBottom: 26, animation: 'fadeIn 0.3s ease' }}>
                <div style={{ fontSize: 12, color: areaAtual.cor, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Pergunta {perguntaIdx + 1} de {areaAtual.perguntas.length}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1C2421', lineHeight: 1.4, marginBottom: 8 }}>{perguntaAtual.texto}</div>
                <div style={{ fontSize: 13, color: '#7A7868', lineHeight: 1.5, marginBottom: 20 }}>{perguntaAtual.dica}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {OPCOES.map(op => {
                    const ativo = sel === op.pontos;
                    return (
                      <button
                        key={op.pontos}
                        onClick={() => responder(perguntaAtual.id, op.pontos)}
                        style={{
                          textAlign: 'left', padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                          border: `1px solid ${ativo ? areaAtual.cor : '#E5E0D5'}`,
                          background: ativo ? areaAtual.fundo : '#fff',
                          color: ativo ? areaAtual.cor : '#1C2421',
                          fontSize: 14, fontWeight: ativo ? 600 : 400,
                          display: 'flex', alignItems: 'center', gap: 12,
                          transition: 'all 0.2s ease',
                          transform: ativo ? 'scale(1.01)' : 'scale(1)'
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${ativo ? areaAtual.cor : '#C9C5B6'}`,
                          background: ativo ? areaAtual.cor : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}>
                          {ativo && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        {op.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Navegação fixa */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, background: '#FAF8F3', borderTop: '1px solid #EFEBE0', padding: '12px 16px', display: 'flex', gap: 8 }}>
          <button
            onClick={voltar}
            style={{ padding: '13px 16px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#5C5A4F', fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={avancar}
            disabled={!respondidaAtual}
            style={{
              flex: 1, padding: 13, borderRadius: 10, border: 'none',
              background: respondidaAtual ? '#0F2B27' : '#E5E0D5',
              color: respondidaAtual ? '#FAF8F3' : '#9C9A8F',
              fontSize: 13.5, fontWeight: 600, cursor: respondidaAtual ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            {etapa === AREAS.length - 1 && perguntaIdx === areaAtual.perguntas.length - 1 ? 'Ver resultado' : 'Avançar'}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTADO ──────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1C2421', marginBottom: 2 }}>Resultado do Diagnóstico</div>
      <div style={{ fontSize: 12.5, color: '#9C9A8F', marginBottom: 16 }}>Baseado nas suas {totalPerguntas} respostas</div>

      {/* Pontuação geral */}
      <div style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 2 }}>Pontuação geral</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1C2421' }}>
              {scoreTotal}<span style={{ fontSize: 14, color: '#9C9A8F' }}>/{maxTotal} pts</span>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: nivel.cor, background: '#F5F3EE', padding: '5px 10px', borderRadius: 8, marginTop: 2 }}>
            {nivel.label}
          </span>
        </div>
        <div style={{ height: 8, background: '#F0EDE3', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: '100%', width: `${pctTotal * 100}%`, background: nivel.cor, borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 12.5, color: '#5C5A4F', lineHeight: 1.65 }}>{textoGeral(pctTotal)}</div>
      </div>

      {/* Radar */}
      <div style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 14, padding: '14px 10px 6px', marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 6, paddingLeft: 4 }}>Visão por área</div>
        <RadarChart ratios={scores.map(sc => sc.pct)} />
      </div>

      {/* Detalhamento por área */}
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1C2421', marginBottom: 10 }}>Detalhamento por área</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {AREAS.map((area, i) => {
          const sc = scores[i];
          return (
            <div key={area.id} style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: area.cor }}>{area.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: area.cor }}>{(sc.pct * 100).toFixed(0)}%</div>
              </div>
              <div style={{ height: 5, background: '#F0EDE3', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${sc.pct * 100}%`, background: area.cor, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 12, color: '#7A7868', lineHeight: 1.55 }}>{interpArea(area, sc.pct)}</div>
            </div>
          );
        })}
      </div>

      {/* Ações */}
      <button
        onClick={reiniciar}
        style={{ width: '100%', padding: 13, borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#5C5A4F', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}
      >
        <RotateCcw size={14} /> Refazer diagnóstico
      </button>

      {onVoltar && (
        <button
          onClick={onVoltar}
          style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', background: '#0F2B27', color: '#FAF8F3', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
        >
          Voltar ao app
        </button>
      )}
    </div>
  );
}
