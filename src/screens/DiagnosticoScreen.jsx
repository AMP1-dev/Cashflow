import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCcw, Sparkles, Bot, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Building2, Store, Utensils, Briefcase, Factory, Scissors, X } from 'lucide-react';

// ─── Segmentos de Atuação ───────────────────────────────────────────────────

export const SEGMENTOS = [
  { id: 'alimentacao', label: 'Alimentação & Gastronomia', icone: Utensils, desc: 'Restaurantes, Bares, Cafés, Delivery, Lanchonetes, Confeitarias' },
  { id: 'varejo', label: 'Comércio & Varejo', icone: Store, desc: 'Lojas físicas, E-commerce, Vestuário, Mercados, Autopeças, Materiais' },
  { id: 'servicos', label: 'Prestação de Serviços', icone: Briefcase, desc: 'Consultorias, TI, Agências, Manutenção, Advocacia, Oficinas' },
  { id: 'industria', label: 'Indústria & Produção', icone: Factory, desc: 'Fábricas, Marcenarias, Confecções, Metalúrgicas, Gráficas' },
  { id: 'saude_beleza', label: 'Saúde, Beleza & Estética', icone: Scissors, desc: 'Salões de beleza, Barbearias, Studios, Clínicas, Odonto' },
  { id: 'outros', label: 'Outros Segmentos', icone: Building2, desc: 'Negócios e atividades comerciais diversas' },
];

// ─── Base de Conhecimento da IA Consultora por Segmento & Área ──────────────

export const IA_CONSULTORIA = {
  operacional: {
    alimentacao: {
      diagnostico: 'No setor de Alimentação, a falta de controle diário de recebíveis e despesas operacionais costuma gerar descompasso no pagamento de fornecedores perecíveis e taxas abusivas de antecipação de cartão/delivery.',
      acoes: [
        'Negocie prazos com fornecedores de perecíveis para datas logo após os picos de caixa (ex: terças-feiras após o fim de semana).',
        'Monitore diariamente as taxas de maquininhas e comissões de delivery na DRE para evitar queimar a margem operacional.',
        'Estabeleça rotina de fechamento cego de caixa ao final de cada turno.'
      ]
    },
    varejo: {
      diagnostico: 'No Varejo, falhas na gestão de recebíveis e prazos de pagamento geram falta de capital de giro na reposição de itens de alto giro.',
      acoes: [
        'Concilie diariamente os recebíveis de cartão e boleto com as datas de vencimento das duplicatas de fornecedores.',
        'Ative régua de cobrança automática por WhatsApp nos primeiros 3 dias de atraso para reduzir a inadimplência.',
        'Negocie prazos escalonados para compras de grande volume.'
      ]
    },
    servicos: {
      diagnostico: 'Em Serviços, o maior risco operacional é a inadimplência e a falta de previsão de faturamento recorrente versus custos fixos.',
      acoes: [
        'Automatize a emissão de cobranças e lembretes via PIX/Boleto antes do vencimento.',
        'Separe com precisão os custos diretos de cada projeto ou atendimento.',
        'Crie contratos com cláusula clara de juros e suspensão de serviço por atraso.'
      ]
    },
    default: {
      diagnostico: 'A gestão operacional informal causa atrasos, juros desnecessários e falta de clareza sobre o verdadeiro resultado do negócio.',
      acoes: [
        'Adote um calendário financeiro com todas as contas a pagar e a receber da semana.',
        'Monitore as entradas e saídas diariamente sem acumular lançamentos.',
        'Elimine despesas bancárias e juros renegociando datas de vencimento com fornecedores.'
      ]
    }
  },
  controle: {
    alimentacao: {
      diagnostico: 'O controle de CMV e desperdício de estoque é o divisor de águas na alimentação. Sem fichas técnicas e inventário semanal, perdas de 5% a 10% do faturamento ocorrem de forma invisível.',
      acoes: [
        'Implemente inventário semanal para os 20 principais insumos (Curva A).',
        'Cadastre a Ficha Técnica de todos os pratos no AMP Flow para manter o CMV entre 28% e 35%.',
        'Separe categoricamente retiradas dos sócios das compras de insumos.'
      ]
    },
    varejo: {
      diagnostico: 'Estoque parado no Varejo é dinheiro perdendo valor. Sem controle de giro e cobertura, o caixa fica estrangulado em produtos sem saída.',
      acoes: [
        'Classifique seu estoque por Curva ABC e liquide produtos sem giro há mais de 60 dias.',
        'Tenha registro rígido de todas as entradas com Nota Fiscal e saídas com baixa automática.',
        'Defina um ponto de pedido mínimo para evitar rupturas de estoque dos produtos campeões de venda.'
      ]
    },
    servicos: {
      diagnostico: 'Em Serviços, misturar contas pessoais com as da empresa distorce o valor da hora técnica e a rentabilidade real dos contratos.',
      acoes: [
        'Tenha contas bancárias 100% separadas e defina um pró-labore fixo mensal para os sócios.',
        'Monitore as horas gastas por cliente para saber se o valor cobrado cobre os custos reais.',
        'Registre todas as pequenas despesas do dia a dia no fluxo de caixa.'
      ]
    },
    default: {
      diagnostico: 'A falta de separação entre finanças pessoais e empresariais é o principal motivo de quebra precoce de pequenos negócios.',
      acoes: [
        'Defina um pró-labore fixo e proíba pagamentos de contas pessoais na conta da empresa.',
        'Registre 100% das movimentações no mesmo dia em que acontecem.',
        'Faça conciliação bancária semanal conferindo o saldo do app com o extrato bancário.'
      ]
    }
  },
  planejamento: {
    alimentacao: {
      diagnostico: 'A sazonalidade do setor de alimentação exige metas diárias e previsão de compra de insumos para não faltar nem estragar.',
      acoes: [
        'Defina meta de faturamento diária dividida por turnos (almoço / jantar / delivery).',
        'Monitore a Margem de Contribuição de cada item do cardápio para incentivar a venda dos mais lucrativos.',
        'Planeje promoções em dias de menor movimento (terças/quartas) com foco em cobrir o custo fixo diário.'
      ]
    },
    varejo: {
      diagnostico: 'Sem planejamento de metas e margem, o comércio costuma dar descontos excessivos e queimar a margem necessária para pagar a equipe e o aluguel.',
      acoes: [
        'Utilize a calculadora de Formação de Preço (Markup) do app para calcular o preço mínimo de venda sem dar prejuízo.',
        'Acompanhe o Ticket Médio e treine a equipe para vendas adicionais (cross-selling).',
        'Estabeleça metas semanais de faturamento e monitore o ponto de equilíbrio no Dashboard.'
      ]
    },
    servicos: {
      diagnostico: 'Vender horas sem planejamento de capacidade produtiva leva a gargalos de atendimento ou meses de ociosidade com custo fixo correndo.',
      acoes: [
        'Mapeie sua capacidade máxima de entrega mensal e planeje a captação de clientes com antecedência.',
        'Crie planos de assinatura ou contratos recorrentes para garantir previsibilidade de receita.',
        'Monitore a margem líquida por cliente e renegocie contratos deficitários.'
      ]
    },
    default: {
      diagnostico: 'Sem metas e planejamento, o negócio vive em modo reativo, apagando incêndios sem gerar crescimento sustentável.',
      acoes: [
        'Defina a meta de faturamento mensal necessária para cobrir custos e gerar o lucro desejado no Quadro de Metas.',
        'Acompanhe os indicadores chave (Margem de Contribuição, Ponto de Equilíbrio e Ticket Médio).',
        'Planeje os investimentos em equipamentos e melhorias com antecedência.'
      ]
    }
  },
  saude: {
    default: {
      diagnostico: 'Negócios sem reserva de capital de giro ficam vulneráveis a meses de baixa ou imprevistos, recorrendo a empréstimos caros e cheque especial.',
      acoes: [
        'Construa uma reserva de emergência equivalente a pelo menos 2 a 3 meses de custos fixos.',
        'Evite antecipar recebíveis sistematicamente; use apenas em emergências calculadas.',
        'Renegocie dívidas caras (cheque especial / rotativo) por linhas de crédito com taxas menores e prazos maiores.'
      ]
    }
  },
  tecnologia: {
    default: {
      diagnostico: 'Processos manuais em cadernos ou planilhas desatualizadas consomem tempo do gestor e aumentam a chance de erros graves de cálculo.',
      acoes: [
        'Utilize o AMP Flow diariamente para registrar entradas e saídas em menos de 1 minuto.',
        'Consulte a DRE e o Ponto de Equilíbrio semanalmente para tomar decisões embasadas.',
        'Automatize cobranças e emissão de notas fiscais para ganhar agilidade.'
      ]
    }
  }
};

// ─── Áreas e perguntas ────────────────────────────────────────────────────────

export const AREAS = [
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

export const OPCOES = [
  { label: 'Não faço / Inexistente',             pontos: 0 },
  { label: 'Faço de forma muito básica',          pontos: 1 },
  { label: 'Faço parcialmente / irregular',       pontos: 2 },
  { label: 'Faço de forma razoável',              pontos: 3 },
  { label: 'Faço bem estruturado',                pontos: 4 },
  { label: 'Faço de forma excelente / completa',  pontos: 5 },
];

// ─── Radar Chart Component ───────────────────────────────────────────────────

export function RadarChart({ ratios }) {
  const cx = 178, cy = 148, r = 96;
  const n = AREAS.length;
  const angles = Array.from({ length: n }, (_, i) => (Math.PI * 2 * i / n) - Math.PI / 2);

  function pt(angle, ratio) {
    return [cx + ratio * r * Math.cos(angle), cy + ratio * r * Math.sin(angle)];
  }

  function polyStr(ratio) {
    return angles.map(a => pt(a, ratio).join(',')).join(' ');
  }

  const userPts = angles.map((a, i) => pt(a, Math.max(0.03, ratios?.[i] ?? 0)).join(',')).join(' ');

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
        const [x, y] = pt(a, Math.max(0.03, ratios?.[i] ?? 0));
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

export function calcScore(area, respostas) {
  const max = area.perguntas.length * 5;
  const score = area.perguntas.reduce((s, p) => s + (respostas[p.id] ?? 0), 0);
  return { score, max, pct: max > 0 ? score / max : 0 };
}

export function interpArea(area, pct) {
  for (const t of area.interpretacoes) {
    if (pct <= t.ate) return t.texto;
  }
  return area.interpretacoes[area.interpretacoes.length - 1].texto;
}

export function nivelGeral(pct) {
  if (pct < 0.33) return { label: 'Estágio Inicial',        cor: '#DC2626' };
  if (pct < 0.53) return { label: 'Em Desenvolvimento',     cor: '#D97706' };
  if (pct < 0.73) return { label: 'Intermediário',          cor: '#2563EB' };
  if (pct < 0.87) return { label: 'Avançado',               cor: '#1F5C52' };
  return             { label: 'Referência em Gestão',        cor: '#0F2B27' };
}

export function textoGeral(pct) {
  if (pct < 0.33) return 'Seu negócio ainda opera de forma muito informal. O primeiro passo é criar rotinas básicas de controle financeiro e separar as contas pessoais das empresariais.';
  if (pct < 0.53) return 'Você já tem algumas práticas, mas ainda há muito espaço para estruturar a gestão. Foque nas áreas com menor pontuação — pequenas mudanças geram grande impacto.';
  if (pct < 0.73) return 'Boa base! Sua gestão tem consistência em várias áreas. Agora é hora de elevar o nível nas lacunas identificadas para atingir uma gestão realmente estruturada.';
  if (pct < 0.87) return 'Você tem uma gestão bem estruturada. Refine os processos restantes e considere automatizar rotinas para chegar à excelência.';
  return 'Parabéns! Sua empresa tem maturidade financeira e operacional acima da média. Continue evoluindo e seja referência para outros empreendedores.';
}

// ─── Tela Principal ──────────────────────────────────────────────────────────

export function DiagnosticoScreen({ usuarioNome, empresaNome, onVoltar }) {
  const [fase, setFase] = useState('intro');   // 'intro' | 'perguntas' | 'resultado'
  const [segmentoId, setSegmentoId] = useState('alimentacao');
  const [comoFuncionaAberto, setComoFuncionaAberto] = useState(false);
  const [showIAModal, setShowIAModal] = useState(false);

  const [etapa, setEtapa] = useState(0);       // 0-4 (índice da área)
  const [perguntaIdx, setPerguntaIdx] = useState(0); // índice da pergunta na área
  const [respostas, setRespostas] = useState({});

  const segmentoObj = useMemo(() => SEGMENTOS.find(s => s.id === segmentoId) || SEGMENTOS[0], [segmentoId]);

  const totalPerguntas = AREAS.reduce((s, a) => s + a.perguntas.length, 0);
  const areaAtual = AREAS[etapa];
  const perguntaAtual = areaAtual?.perguntas[perguntaIdx];
  const respondidaAtual = respostas[perguntaAtual?.id] !== undefined;

  const scores = useMemo(() => AREAS.map(a => calcScore(a, respostas)), [respostas]);
  const scoreTotal = scores.reduce((s, sc) => s + sc.score, 0);
  const maxTotal   = scores.reduce((s, sc) => s + sc.max, 0);
  const pctTotal   = maxTotal > 0 ? scoreTotal / maxTotal : 0;
  const nivel      = nivelGeral(pctTotal);

  // Salvar diagnóstico recente no localStorage para exibir na Gestão à Vista
  useEffect(() => {
    if (fase === 'resultado') {
      const payload = {
        scores,
        pctTotal,
        scoreTotal,
        maxTotal,
        nivel,
        segmentoId,
        segmentoLabel: segmentoObj.label,
        data: new Date().toISOString(),
        usuarioNome,
        empresaNome
      };
      localStorage.setItem('amp_diagnostico_recente', JSON.stringify(payload));
    }
  }, [fase, scores, pctTotal, scoreTotal, maxTotal, nivel, segmentoId, segmentoObj, usuarioNome, empresaNome]);

  function responder(id, pontos) {
    setRespostas(prev => ({ ...prev, [id]: pontos }));
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
    setComoFuncionaAberto(false);
    setShowIAModal(false);
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

        <div style={{ fontFamily: 'Georgia, serif', fontSize: 21, color: '#1C2421', marginBottom: 2 }}>Diagnóstico do Negócio</div>
        <div style={{ fontSize: 12.5, color: '#7A7868', marginBottom: 16 }}>
          Avalie a maturidade financeira da {empresaNome ? <strong>{empresaNome}</strong> : 'sua empresa'}
        </div>

        {/* 1. Escolha do Segmento */}
        <div style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#B05A2E" />
            1. Selecione o segmento da sua empresa:
          </div>
          <div style={{ fontSize: 11.5, color: '#7A7868', marginBottom: 12 }}>
            A IA utilizará os benchmarks e particularidades do seu nicho para a consultoria final.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SEGMENTOS.map(seg => {
              const Icone = seg.icone;
              const ativo = segmentoId === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSegmentoId(seg.id)}
                  style={{
                    padding: '12px 10px', borderRadius: 10, textAlign: 'left',
                    border: `1.5px solid ${ativo ? '#1F5C52' : '#E5E0D5'}`,
                    background: ativo ? '#EAF4F0' : '#fff',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
                    transition: 'all 0.2s ease',
                    boxShadow: ativo ? '0 2px 6px rgba(31,92,82,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icone size={16} color={ativo ? '#1F5C52' : '#7A7868'} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: ativo ? '#1F5C52' : '#1C2421' }}>{seg.label}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#7A7868', lineHeight: 1.3 }}>{seg.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Bloco Colapsado: Como Funciona & Botão Iniciar Diagnóstico DENTRO */}
        <div style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 14, overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <button
            type="button"
            onClick={() => setComoFuncionaAberto(a => !a)}
            style={{ width: '100%', padding: '14px 16px', background: '#F9F8F4', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EAF4F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="#1F5C52" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421' }}>Como funciona a avaliação</div>
                <div style={{ fontSize: 11, color: '#7A7868' }}>Toque para entender as 5 áreas e iniciar</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1F5C52' }}>{comoFuncionaAberto ? 'Fechar' : 'Abrir'}</span>
              <ChevronDown size={16} color="#1F5C52" style={{ transform: comoFuncionaAberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </div>
          </button>

          {comoFuncionaAberto && (
            <div style={{ padding: '16px', borderTop: '1px solid #EFEBE0', background: '#fff' }}>
              <div style={{ fontSize: 12.5, color: '#3D5C49', lineHeight: 1.6, marginBottom: 14, background: '#EAF4F0', padding: '12px', borderRadius: 10, border: '1px solid #CFEAD9' }}>
                São <strong>{totalPerguntas} perguntas rápidas</strong> em <strong>{AREAS.length} áreas</strong> da gestão. No final, a <strong>IA Consultora Financeira</strong> gerará um plano de ação tático personalizado para o segmento <strong>{segmentoObj.label}</strong>.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {AREAS.map((area, i) => (
                  <div key={area.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: area.fundo, border: `1px solid ${area.bg}`, borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: area.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: area.cor }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: area.cor }}>{area.label}</div>
                      <div style={{ fontSize: 10.5, color: '#9C9A8F' }}>{area.perguntas.length} perguntas</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Iniciar Diagnóstico DENTRO do Acordeão */}
              <button
                onClick={() => { setFase('perguntas'); setEtapa(0); setPerguntaIdx(0); }}
                style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#0F2B27', color: '#FAF8F3', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(15,43,39,0.2)' }}
              >
                <span>Iniciar Diagnóstico para {segmentoObj.label}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
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
              <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 1 }}>Área {etapa + 1} de {AREAS.length} • {segmentoObj.label}</div>
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
                <div style={{ fontSize: 11.5, color: areaAtual.cor, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Pergunta {perguntaIdx + 1} de {areaAtual.perguntas.length}
                </div>
                <div style={{ fontSize: 17.5, fontWeight: 600, color: '#1C2421', lineHeight: 1.4, marginBottom: 8 }}>{perguntaAtual.texto}</div>
                <div style={{ fontSize: 12.5, color: '#7A7868', lineHeight: 1.5, marginBottom: 20 }}>{perguntaAtual.dica}</div>
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
                          fontSize: 13.5, fontWeight: ativo ? 600 : 400,
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
            {etapa === AREAS.length - 1 && perguntaIdx === areaAtual.perguntas.length - 1 ? 'Ver relatório & resultado' : 'Avançar'}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTADO ──────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      {/* Cabeçalho Personalizado com Nome do Responsável */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1F5C52', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Diagnóstico de Gestão Financeira
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1C2421' }}>
              {usuarioNome ? `${usuarioNome}` : 'Avaliação da Empresa'} {empresaNome && `· ${empresaNome}`}
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1F5C52', background: '#EAF4F0', border: '1px solid #CFEAD9', padding: '4px 8px', borderRadius: 6 }}>
            {segmentoObj.label}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: '#9C9A8F', marginTop: 2 }}>Baseado nas suas {totalPerguntas} respostas e benchmarks do setor</div>
      </div>

      {/* Pontuação geral */}
      <div style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 14, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10.5, color: '#9C9A8F', marginBottom: 2 }}>Pontuação Geral de Maturidade</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1C2421' }}>
              {scoreTotal}<span style={{ fontSize: 14, color: '#9C9A8F' }}>/{maxTotal} pts ({(pctTotal * 100).toFixed(0)}%)</span>
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

      {/* Radar de Competências */}
      <div style={{ background: '#fff', border: '1px solid #EFEBE0', borderRadius: 14, padding: '14px 10px 6px', marginBottom: 14 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 6, paddingLeft: 4 }}>Radar de Competências Financeiras</div>
        <RadarChart ratios={scores.map(sc => sc.pct)} />
      </div>

      {/* ── CARD CHAMADA DE CURIOSIDADE: CONSULTORIA DA IA EM MODAL ── */}
      <div style={{ background: '#0F2B27', borderRadius: 14, padding: '16px', color: '#FAF8F3', marginBottom: 16, boxShadow: '0 4px 14px rgba(15,43,39,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(159, 224, 200, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot size={18} color="#9FE0C8" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#9FE0C8' }}>Quer que a IA avalie esses pontos para você?</div>
            <div style={{ fontSize: 11, color: '#9FBDB5' }}>Consultoria tática e plano de ação para {segmentoObj.label}</div>
          </div>
        </div>

        <button
          onClick={() => setShowIAModal(true)}
          style={{ width: '100%', padding: '11px 14px', marginTop: 10, borderRadius: 10, border: 'none', background: '#9FE0C8', color: '#0F2B27', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s ease' }}
        >
          <Sparkles size={15} />
          <span>Ver Parecer da IA & Plano de Ação Personalizado</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Detalhamento por Área */}
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1C2421', marginBottom: 10 }}>Detalhamento por Área</div>
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

      {/* ── MODAL: PARECER COMPLETO DA IA CONSULTORA ── */}
      {showIAModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#0F2B27', borderRadius: 18, color: '#FAF8F3', width: '100%', maxWidth: 440, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.36)', border: '1px solid #234A42', overflow: 'hidden' }}>
            {/* Header Modal */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(159, 224, 200, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={17} color="#9FE0C8" />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#9FE0C8' }}>Parecer da IA Consultora</div>
                  <div style={{ fontSize: 10.5, color: '#9FBDB5' }}>Plano tático para {usuarioNome ? `${usuarioNome} · ` : ''}{segmentoObj.label}</div>
                </div>
              </div>
              <button onClick={() => setShowIAModal(false)} style={{ background: 'none', border: 'none', color: '#9FBDB5', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Corpo com Scroll */}
            <div style={{ padding: '16px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {AREAS.map((area, i) => {
                const sc = scores[i];
                const recomendacaoArea = IA_CONSULTORIA[area.id]?.[segmentoId] || IA_CONSULTORIA[area.id]?.default || IA_CONSULTORIA.operacional.default;
                const precisaMelhorar = sc.pct < 0.70;

                return (
                  <div key={area.id} style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: 14, border: `1px solid ${precisaMelhorar ? 'rgba(240, 190, 148, 0.35)' : 'rgba(159, 224, 200, 0.3)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: precisaMelhorar ? '#F5D5B8' : '#CFEEE2', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {precisaMelhorar ? <AlertTriangle size={13} color="#F0BE94" /> : <CheckCircle2 size={13} color="#9FE0C8" />}
                        {area.label}
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: precisaMelhorar ? '#F0BE94' : '#9FE0C8' }}>
                        {(sc.pct * 100).toFixed(0)}% • {precisaMelhorar ? 'Ajuste Prioritário' : 'Estruturado'}
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#E2E8F0', lineHeight: 1.5, marginBottom: 8 }}>
                      {recomendacaoArea.diagnostico}
                    </div>

                    {precisaMelhorar && (
                      <div style={{ background: 'rgba(0, 0, 0, 0.28)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9FE0C8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Lightbulb size={12} /> Plano de Ação Recomendado:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#CBD5E1', lineHeight: 1.45 }}>
                          {recomendacaoArea.acoes.map((acao, idx) => (
                            <li key={idx} style={{ marginBottom: 3 }}>{acao}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Modal */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
              <button
                onClick={() => setShowIAModal(false)}
                style={{ width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: '#9FE0C8', color: '#0F2B27', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Concluir Leitura do Parecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
