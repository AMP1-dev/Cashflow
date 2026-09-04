// ============================================================================
// PORTAL JURÍDICO DE ALTA SOFISTICAÇÃO — FMA ADVOGADOS
// Dados Institucionais, Áreas de Atuação, Artigos WordPress e Depoimentos
// ============================================================================

export const FMA_CONFIG = {
  name: "FMA Advogados",
  firmName: "Fernando Maeda Advogados Associados",
  founder: "Dr. Fernando Maeda",
  oab: "OAB/SP 210.374",
  aasp: "Inscrito na Associação dos Advogados de São Paulo (AASP)",
  yearsOfExperience: "20+ Anos",
  experienceSince: "Desde 2003",
  specialtiesHeadline: "Advocacia Estratégica Cível, Bancária, Contratual e Direito à Saúde",
  philosophicalQuote: {
    text: "A justiça é a vontade constante e perpétua de dar a cada um o que é seu.",
    author: "Ulpiano",
    reference: "Corpus Iuris Civilis — Digesto 1.1.10",
    theme: "Equilíbrio, Rigor e Dignidade"
  },
  contacts: {
    whatsapp: "5511948900900",
    whatsappFormatted: "(11) 94890-0900",
    email: "contato@fmadv.net",
    phone: "(11) 94890-0900",
    address: "São Paulo — SP | Atendimento Nacional Digital & Presencial",
    serviceHours: "Plantão Digital: Segunda a Sábado | Urgências de Saúde 24h",
    googleRating: "5.0",
    googleReviewsCount: "48 avaliações verificadas"
  },
  disclaimerCriminal: "Atuação exclusiva nas esferas Cível, Empresarial, Bancária, Consumidor e Direito à Saúde. Não atuamos na área criminal.",
  badges: [
    { label: "20+ Anos de Atuação", desc: "Desde 2003 no mercado jurídico" },
    { label: "OAB/SP 210.374", desc: "Registro profissional ativo e regular" },
    { label: "Especialista FGV & AASP", desc: "Pós-graduado em Processo Civil e Contratos" },
    { label: "Plantão de Liminares", desc: "Triagem ágil de urgências em saúde e bancário" }
  ]
};

// ============================================================================
// ÁREAS DE ATUAÇÃO ESTRATÉGICAS (SEM CRIMINAL)
// ============================================================================
export const FMA_PRACTICE_AREAS = [
  {
    id: "direito-bancario",
    title: "Direito Bancário & Renegociação de Dívidas",
    subtitle: "Defesa técnica contra abusos financeiros, fraudes e revisão de passivos",
    icon: "ShieldAlert",
    badge: "Alta Complexidade",
    shortDesc: "Revisão judicial de juros abusivos, liminares para exclusão de negativações indevidas (Serasa/SPC/Protestos) e recuperação de perdas em fraudes bancárias.",
    fullDescription: `
      O setor bancário frequentemente impõe contratos com encargos desproporcionais, juros capitalizados acima da média de mercado e práticas lesivas.
      Nossa atuação visa restabelecer o equilíbrio contratual, renegociar passivos e buscar a imediata reparação por danos morais e materiais decorrentes de condutas ilícitas das instituições.
    `,
    topics: [
      {
        title: "Revisão de Juros Abusivos e Contratos",
        desc: "Análise pericial de cédulas de crédito bancário, financiamentos imobiliários/veiculares, capital de giro e cheque especial para eliminação de taxas ilegais e recálculo da dívida."
      },
      {
        title: "Liminares para Exclusão de Negativação Indevida",
        desc: "Ações céleres com pedido de liminar (tutela de urgência) para baixa imediata de apontamentos no Serasa, SPC, CCF e Cartórios de Protesto, cumuladas com indenização por dano moral."
      },
      {
        title: "Fraudes Bancárias e Golpes Eletrônicos",
        desc: "Atuação técnica para anulação de empréstimos consignados não autorizados, transações PIX fraudulentas sob coação e clonagem de cartões de crédito, com repetição de indébito."
      },
      {
        title: "Renegociação Estratégica de Passivo Financeiro",
        desc: "Mediação jurídica de passivos empresariais e individuais para viabilizar acordos com descontos substanciais e parcelamentos compatíveis com o fluxo de caixa."
      },
      {
        title: "Cancelamento de Tarifas e Serviços Não Solicitados",
        desc: "Exclusão de vendas casadas de seguros de prestamista, tarifas avulsas e redução abusiva unilateral de limites de crédito."
      }
    ],
    urgentNote: "Negativação indevida ou fraude em andamento? Liminares podem ser requeridas em caráter de urgência."
  },
  {
    id: "direito-saude",
    title: "Direito à Saúde & Planos de Saúde",
    subtitle: "Plantão de liminares contra negativas de cirurgias, tratamentos e próteses",
    icon: "HeartPulse",
    badge: "Plantão de Urgência",
    shortDesc: "Obtenção de ordens judiciais imediatas (liminares) para compelir operadoras a cobrir cirurgias urgentes, próteses/órteses e medicamentos de alto custo.",
    fullDescription: `
      O bem mais precioso do ser humano é a vida e a dignidade. Quando o beneficiário mais necessita após anos pagando pontualmente as mensalidades, operadoras frequentemente negam procedimentos vitais com base em cláusulas abusivas.
      Atuamos com máxima celeridade processual para compelir convênios e planos de saúde a cumprir suas obrigações por meio de tutelas de urgência concedidas em poucas horas.
    `,
    topics: [
      {
        title: "Plantão de Liminares em 24h/48h",
        desc: "Ingresso célere de ações com pedido de tutela antecipada de urgência para liberação imediata de internações, UTI e procedimentos médicos de risco iminente."
      },
      {
        title: "Reversão de Negativas Cirúrgicas",
        desc: "Atuação judicial para autorização de cirurgias bariátricas, reparadoras pós-bariátrica, cirurgias cardíacas, ortopédicas, oncológicas e procedimentos de alta precisão."
      },
      {
        title: "Próteses, Órteses e Materiais Especiais (Stents)",
        desc: "Obrigatoriedade do plano de saúde em fornecer Stents coronários, próteses articulares, válvulas e materiais de última geração prescritos pelo médico assistente."
      },
      {
        title: "Tratamentos e Medicamentos de Alto Custo",
        desc: "Fornecimento de remédios oncológicos orais ou intravenosos, terapias biológicas e tratamentos contínuos fora do rol básico da ANS."
      },
      {
        title: "Reajustes Abusivos por Idade e Sinistralidade",
        desc: "Ações para anulação de aumentos desproporcionais aplicados aos 59/60 anos de idade e reajustes coletivos sem comprovação atuarial, com restituição de valores pagos a maior."
      },
      {
        title: "Home Care e Cuidados Domiciliares",
        desc: "Garantia judicial de desospitalização assistida com enfermagem, fisioterapia e suporte respiratório quando prescrito pelo médico."
      }
    ],
    urgentNote: "Paciente internado ou cirurgia marcada com recusa? Nosso plantão de triagem atende com prioridade máxima."
  },
  {
    id: "civel-contratual",
    title: "Advocacia Cível, Empresarial & Contratual",
    subtitle: "Estruturação contratual blindada e resolução estratégica de conflitos",
    icon: "FileCheck2",
    badge: "Consultoria & Contencioso",
    shortDesc: "Auditoria preventiva, confecção e rescisão de contratos civis e comerciais, reparações civis e assessoria para mitigar passivos sem litígios desnecessários.",
    fullDescription: `
      Com especialização em Contratos pela Fundação Getulio Vargas (FGV) e pós-graduação em Processo Civil, o Dr. Fernando Maeda lidera a estruturação preventiva e a defesa em disputas obrigacionais complexas.
      Privilegiamos a blindagem documental para conferir segurança patrimonial às partes e, quando o litígio é inevitável, empregamos estratégia processual cirúrgica.
    `,
    topics: [
      {
        title: "Elaboração e Blindagem Contratual",
        desc: "Minutas sob medida de contratos de prestação de serviços, parcerias comerciais, representação, mútuos, compra e venda e acordos de confidencialidade."
      },
      {
        title: "Resolução de Disputas Contratuais",
        desc: "Cobrança judicial e extrajudicial de títulos, execução de garantias, exceção de contrato não cumprido e rescisão por inadimplemento culposo."
      },
      {
        title: "Responsabilidade Civil & Indenizações",
        desc: "Ações de reparação por danos materiais (danos emergentes e lucros cessantes), danos morais e estéticos decorrentes de ilícitos contratuais e extracontratuais."
      },
      {
        title: "Consultoria Jurídica Preventiva",
        desc: "Mapeamento prévio de riscos para pequenas, médias e grandes empresas, reduzindo contingências financeiras e passivos judiciais."
      },
      {
        title: "Declaração de Não Atuação Criminal",
        desc: "O escritório atua estrita e exclusivamente no direito civil e empresarial. Não patrocinamos causas na esfera do direito penal ou criminal."
      }
    ],
    urgentNote: "Análise técnica de viabilidade e riscos antes de assinar ou rescindir qualquer negócio relevante."
  },
  {
    id: "consumidor-aviacao",
    title: "Direito do Consumidor Especializado & Aviação",
    subtitle: "Relações de consumo de alto impacto, vícios ocultos e cancelamentos aéreos",
    icon: "PlaneTakeoff",
    badge: "Indenizações",
    shortDesc: "Ações para reparação integral de danos por cancelamento e atrasos de voos, extravio de bagagens, compras de alto valor com defeito e vícios ocultos.",
    fullDescription: `
      O Código de Defesa do Consumidor é um dos diplomas mais avançados do ordenamento jurídico brasileiro.
      Defendemos consumidores lesados em situações de desrespeito flagrante por companhias aéreas, montadoras de veículos, incorporadoras e fornecedores de tecnologia.
    `,
    topics: [
      {
        title: "Atrasos Graves e Cancelamentos de Voos",
        desc: "Indenização por danos morais e materiais decorrentes da perda de conexões, perda de compromissos profissionais relevantes, férias frustradas ou falta de assistência material."
      },
      {
        title: "Extravio e Danificação de Bagagens",
        desc: "Reparação célere por bagagens perdidas em viagens nacionais e internacionais, com restituição do valor dos bens e compensação pelo abalo psicológico."
      },
      {
        title: "Vícios Ocultos e Defeitos de Fabricação",
        desc: "Problemas recorrentes em veículos zero quilômetro ou seminovos, maquinários e eletrônicos duráveis que se manifestam após a garantia contratual."
      },
      {
        title: "Publicidade Enganosa e Descumprimento de Oferta",
        desc: "Obrigatoriedade de cumprimento forçado da oferta ou restituição imediata da quantia paga, monetariamente atualizada e com perdas e danos."
      }
    ],
    urgentNote: "Guarde comprovantes de embarque, bilhetes e notas de despesas para instruir a ação indenizatória."
  },
  {
    id: "direito-imobiliario",
    title: "Direito Imobiliário & Regularização Patrimonial",
    subtitle: "Usucapião, distratos imobiliários e regularização cartorária de imóveis",
    icon: "Building",
    badge: "Patrimônio Seguro",
    shortDesc: "Processos de Usucapião judicial e extrajudicial, distrato com restituição de parcelas por atraso na entrega da obra e assessoria em locações.",
    fullDescription: `
      O patrimônio imobiliário representa a segurança de uma vida. O Dr. Fernando Maeda atua há mais de duas décadas promovendo a regularização de títulos imobiliários e a defesa de adquirentes lesados por construtoras e incorporadoras.
    `,
    topics: [
      {
        title: "Usucapião Judicial e Extrajudicial em Cartório",
        desc: "Regularização definitiva da titularidade e registro de posse mansa e pacífica de imóveis urbanos e rurais perante os Cartórios de Registro de Imóveis."
      },
      {
        title: "Distrato Imobiliário e Rescisão com Construtoras",
        desc: "Ações para rescisão de contratos de compra na planta por atraso injustificado da obra, com restituição de 100% dos valores pagos com correção e multa."
      },
      {
        title: "Assessoria em Locação e Despejo",
        desc: "Redação técnica de contratos de locação comercial/residencial, ações de despejo por falta de pagamento ou retomada e cobrança de aluguéis."
      },
      {
        title: "Contratos de Compra e Venda com Due Diligence",
        desc: "Auditoria documental preventiva de certidões do imóvel e dos vendedores para evitar fraudes contra credores ou anulação futura do negócio."
      }
    ],
    urgentNote: "Problemas com atraso de obras ou imóvel sem escritura? Agende uma análise de viabilidade documental."
  }
];

// ============================================================================
// ARTIGOS E NOTÍCIAS IMPORTADOS DO WORDPRESS + ARTIGOS ESTRATÉGICOS
// ============================================================================
export const FMA_ARTICLES = [
  {
    id: "art-1",
    wpId: 1885,
    title: "Liminares em Planos de Saúde: Como Obter Cirurgias e Tratamentos de Alto Custo em Caso de Negativa",
    slug: "liminares-planos-de-saude-cirurgias-negativas",
    category: "Direito à Saúde",
    date: "2026-07-28",
    readTime: "5 min de leitura",
    featured: true,
    excerpt: "A negativa de cobertura de cirurgia de urgência, medicamentos oncológicos ou próteses especiais por operadoras é considerada abusiva pelos tribunais. Saiba como o plantão de liminares reverte essa situação em 24 a 48 horas.",
    content: `A contratação de um plano de saúde fundamenta-se na legítima expectativa de proteção à vida e à saúde nos momentos de maior vulnerabilidade. Lamentavelmente, quando o paciente mais necessita, depara-se com recusas padronizadas das operadoras sob a alegação de "não constar no rol da ANS", "período de carência" ou "tratamento experimental".

### O que é a Liminar e Como Ela Salva Vidas?
A liminar, tecnicamente denominada **Tutela Provisória de Urgência** (art. 300 do Código de Processo Civil), é uma ordem judicial emitida logo no início do processo, antes mesmo da manifestação da operadora de saúde.

Quando demonstrada a probabilidade do direito (prescrição médica detalhada) e o perigo de dano irreparável ou risco à vida, o juiz determina que o plano autorize o procedimento em prazo estrito (geralmente entre 24 e 48 horas), sob pena de multa diária substancial (astreintes) ou até bloqueio de contas da seguradora para pagamento direto do hospital.

### Principais Casos com Jurisprudência Pacífica:
1. **Cirurgias Bariátricas e Reparadoras:** Quando decorrentes de obesidade mórbida com comorbidades e cirurgias pós-bariátricas para retirada de excesso de pele, consideradas desdobramento do tratamento.
2. **Próteses e Órteses (Stents e Válvulas):** O STJ pacificou que, cabendo ao plano a cobertura da doença, cabe unicamente ao médico assistente decidir qual a técnica e material cirúrgico mais adequados.
3. **Medicamentos de Alto Custo e Quimioterapia:** A negativa de fornecimento de imunoterápicos ou fármacos orais importados com registro na Anvisa é sistematicamente anulada pelo Judiciário.

### Documentos Indispensáveis para a Ação:
- Relatório médico minucioso indicando o diagnóstico (CID), a urgência clínica e as consequências da não realização;
- Protocolo ou negativa formal por escrito emitida pelo plano de saúde;
- Carteira do plano e comprovantes de pagamento das últimas mensalidades;
- Exames comprobatórios recentes.

**Importante:** A saúde não espera. Se você ou um familiar recebeu uma negativa indevida, procure imediatamente orientação jurídica especializada para ingressar com a medida liminar.`,
    tags: ["Liminar", "Plano de Saúde", "Cirurgia", "Stents", "Medicamentos de Alto Custo"]
  },
  {
    id: "art-2",
    wpId: 1884,
    title: "Juros Abusivos em Contratos Bancários: Quando e Como Reclamar a Revisão Judicial",
    slug: "juros-abusivos-contratos-bancarios-revisao-judicial",
    category: "Direito Bancário",
    date: "2026-07-25",
    readTime: "6 min de leitura",
    featured: true,
    excerpt: "Cobrança de juros acima da taxa média de mercado divulgada pelo Banco Central permite a readequação contratual e a repetição do indébito. Entenda os critérios técnicos adotados pelo Judiciário.",
    content: `Muitos empresários e consumidores contraem financiamentos bancários ou linhas de crédito e percebem que, mesmo pagando as parcelas em dia, o saldo devedor quase não diminui. Essa situação decorre, na maioria das vezes, da capitalização composta de juros em percentuais abusivos e da inclusão de encargos ocultos.

### O Parâmetro da Taxa Média do Banco Central (BACEN)
O Superior Tribunal de Justiça (STJ) firmou jurisprudência no sentido de que a estipulação de juros remuneratórios superiores a 1,5 vez a taxa média de mercado apurada pelo BACEN para a mesma operação e período configura desvantagem exagerada ao contratante, autorizando a intervenção judicial.

### Cláusulas Frequentes Passíveis de Anulação:
- **Comissão de Permanência Cumulada:** É ilegal a cobrança de comissão de permanência com juros de mora, correção monetária e multa no período de inadimplência (Súmula 472 do STJ);
- **Tarifa de Abertura de Crédito (TAC) e Emissão de Carnê (TEC):** Ilegítimas quando inseridas sem contraprestação específica nos contratos posteriores a 2008;
- **Venda Casada de Seguros:** Exigência de contratação de seguro de vida ou prestamista com seguradora indicada exclusivamente pelo banco.

### O Passo a Passo da Ação Revisional:
1. Obtenção da cópia integral do contrato assinado e dos extratos da evolução da dívida;
2. Elaboração de cálculo pericial contábil confrontando as taxas praticadas com as médias oficiais;
3. Ajuizamento da ação com pedido de depósito judicial das parcelas no valor incontroverso e abstenção de negativação no Serasa/SPC.`,
    tags: ["Direito Bancário", "Juros Abusivos", "BACEN", "Revisional", "Financiamento"]
  },
  {
    id: "art-3",
    wpId: 1872,
    title: "Advogado Cível em São Paulo: 20 Anos de Atuação Estratégica e Segurança Jurídica",
    slug: "advogado-civel-em-sao-paulo",
    category: "Advocacia Cível",
    date: "2026-07-22",
    readTime: "4 min de leitura",
    featured: false,
    excerpt: "Desde 2003, o Dr. Fernando Maeda atua na capital paulista prestando assessoria preventiva e contenciosa nas esferas cível, contratual, imobiliária e de responsabilidade civil.",
    content: `O advogado Dr. Fernando Maeda, inscrito na OAB/SP sob o nº 210.374 e membro da Associação dos Advogados de São Paulo (AASP), consolidou sua trajetória como referência no direito cível contemporâneo.

### Princípios de Atuação da FMA Advogados em São Paulo
Com mais de duas décadas de prática forense, o escritório pauta suas condutas em três pilares inegociáveis:
- **Transparência Absoluta:** Avaliação honesta e fundamentada da viabilidade jurídica antes da propositura de qualquer demanda;
- **Rigor Técnico Processual:** Peças jurídicas robustas, embasadas na mais recente jurisprudência dos Tribunais Superiores (TJSP e STJ);
- **Comunicação Clara e Acessível:** Informação periódica e descomplicada de cada andamento processual ao cliente.

O escritório não atua no âmbito do direito penal ou criminal, concentrando 100% de seus esforços intelectuais e operacionais na solução de controvérsias patrimoniais, civis, de saúde e relações de consumo.`,
    tags: ["São Paulo", "Advogado Cível", "OAB/SP 210.374", "Ética Jurídica"]
  },
  {
    id: "art-4",
    wpId: 1882,
    title: "Advogado Cível em Barueri & Alphaville: Soluções para Conflitos Patrimoniais e Contratuais",
    slug: "advogado-civel-em-barueri",
    category: "Advocacia Cível",
    date: "2026-07-22",
    readTime: "4 min de leitura",
    featured: false,
    excerpt: "Atendimento especializado em Barueri e região de Alphaville para empresas e pessoas físicas que exigem alto padrão na gestão de contratos e contencioso cível.",
    content: `A região de Barueri e Alphaville destaca-se pelo dinamismo econômico e forte concentração empresarial. Nesse ecossistema, disputas contratuais e passivos bancários demandam respostas rápidas e estratégicas.

O escritório FMA Advogados atende clientes da comarca de Barueri em ações de revisão de contratos empresariais, distratos imobiliários em empreendimentos corporativos e residenciais, bem como em demandas urgentes de direito do consumidor e saúde suplementar.`,
    tags: ["Barueri", "Alphaville", "Contratos", "Direito Cível"]
  },
  {
    id: "art-5",
    wpId: 1883,
    title: "Advogado Cível em Osasco: Proteção Patrimonial, Contratos e Direito do Consumidor",
    slug: "advogado-civel-em-osasco",
    category: "Advocacia Cível",
    date: "2026-07-22",
    readTime: "4 min de leitura",
    featured: false,
    excerpt: "Assessoria jurídica qualificada na comarca de Osasco para demandas civis complexas, negativas bancárias indevidas e regularização fundiária.",
    content: `Em Osasco, comarca de expressivo volume processual, a qualidade técnica da petição inicial e a precisão probatória são fatores determinantes para o êxito de uma demanda.

A FMA Advogados orienta seus clientes a reunir previamente a documentação necessária para mitigar custos desnecessários e assegurar pedidos liminares consistentes.`,
    tags: ["Osasco", "Direito Cível", "Defesa do Consumidor"]
  },
  {
    id: "art-6",
    wpId: 1884,
    title: "Advogado Cível em Taboão da Serra e Região Metropolitana",
    slug: "advogado-civel-em-taboao-da-serra",
    category: "Advocacia Cível",
    date: "2026-07-22",
    readTime: "3 min de leitura",
    featured: false,
    excerpt: "Atuação dedicada para a defesa de direitos do consumidor, questões imobiliárias e indenizatórias na região sudoeste da Grande São Paulo.",
    content: `A proximidade e a agilidade no atendimento digital permitem que o Dr. Fernando Maeda atue com excelência na comarca de Taboão da Serra, garantindo suporte direto via WhatsApp para acompanhamento do cliente em todas as etapas processuais.`,
    tags: ["Taboão da Serra", "Cível", "Indenizações"]
  },
  {
    id: "art-7",
    wpId: 1885,
    title: "Advogado Cível em Guarulhos: Atendimento Célere e Especializado",
    slug: "advogado-civel-em-guarulhos",
    category: "Advocacia Cível",
    date: "2026-07-22",
    readTime: "3 min de leitura",
    featured: false,
    excerpt: "Defesa técnica de famílias e empresas em Guarulhos nas áreas de planos de saúde, passivos bancários e litígios cíveis em geral.",
    content: `Guarulhos concentra importante polo industrial e aeroportuário, gerando demandas frequentes tanto no direito do consumidor (aviatório) quanto nas áreas cíveis tradicionais.
A FMA Advogados oferece suporte especializado e transparente para a resolução rápida de litígios.`,
    tags: ["Guarulhos", "Consumidor Aviatório", "Cível"]
  },
  {
    id: "art-8",
    wpId: 1522,
    title: "Cancelamento e Atraso de Voos: Como Garantir Indenização e Reembolso Integral",
    slug: "cancelamento-atraso-de-voos-indenizacao-danos-morais",
    category: "Direito do Consumidor",
    date: "2026-07-15",
    readTime: "5 min de leitura",
    featured: true,
    excerpt: "Conheça as regras da Resolução 400 da ANAC e o entendimento dos tribunais que garantem indenizações expressivas por dano moral em atrasos superiores a 4 horas ou cancelamentos sem aviso prévio.",
    content: `Viagens de férias ou a trabalho envolvem planejamento minucioso e expectativas legítimas. Quando companhias aéreas cancelam voos abruptamente, alteram horários sem aviso mínimo de 72 horas ou extraviam malas, cometem falhas graves na prestação do serviço.

### Direitos Fundamentais Garantidos pela ANAC:
- **A partir de 1 hora de atraso:** Comunicação gratuita (telefone ou internet);
- **A partir de 2 horas:** Alimentação adequada (voucher ou refeição no aeroporto);
- **A partir de 4 horas ou cancelamento:** Acomodação em hotel com traslado ou reacomodação imediata em voo de qualquer companhia congênere, à escolha do passageiro.

### Cabimento de Indenização por Danos Morais:
O mero descumprimento do contrato já gera aborrecimentos, mas quando há perda de conexões internacionais, perda de reuniões de negócios, diárias de cruzeiro ou noites em aeroporto sem assistência, o dano moral é presumido (*in re ipsa*) ou comprovado pelas circunstâncias vexatórias.

Conserve sempre todos os cartões de embarque, recibos de despesas com alimentação/transporte e fotografe o painel de voos do aeroporto.`,
    tags: ["Direito do Consumidor", "Atraso de Voo", "Cancelamento", "Dano Moral", "ANAC"]
  },
  {
    id: "art-9",
    wpId: 1523,
    title: "Distrato Imobiliário: Como Rescindir o Contrato por Atraso da Construtora e Reaver 100%",
    slug: "distrato-imobiliario-rescisao-atraso-construtora",
    category: "Direito Imobiliário",
    date: "2026-07-10",
    readTime: "5 min de leitura",
    featured: false,
    excerpt: "A Súmula 543 do STJ estabelece que, em caso de culpa exclusiva da construtora pelo atraso na entrega das chaves, a devolução de todas as quantias pagas deve ser imediata e integral.",
    content: `A aquisição de imóvel na planta representa um dos maiores investimentos das famílias brasileiras. Contudo, quando a construtora ultrapassa o prazo legal de tolerância de 180 dias sem entregar a obra com 'Habite-se', comete inadimplemento contratual absoluto.

### O que Diz a Súmula 543 do STJ:
*Na hipótese de resolução de contrato de promessa de compra e venda de imóvel submetido ao CDC, deve ocorrer a imediata restituição das parcelas pagas pelo promitente comprador — integralmente, em caso de culpa exclusiva do promitente vendedor/construtor.*

Ou seja, o comprador não é obrigado a aceitar retenções de 20%, 30% ou 50% previstas em contratos de adesão quando a rescisão decorre do descumprimento de prazos pela incorporadora.`,
    tags: ["Distrato", "Direito Imobiliário", "STJ 543", "Atraso de Obra"]
  }
];

// ============================================================================
// DEPOIMENTOS REAIS VERIFICADOS (GOOGLE REVIEWS)
// ============================================================================
export const FMA_TESTIMONIALS = [
  {
    id: "rev-1",
    author: "Robson Pianucci",
    date: "20/06/2023",
    stars: 5,
    source: "Google Avaliações",
    comment: "Dr. Fernando me ajudou muito. Ofereceu um serviço de muito alta qualidade, sempre esclarecendo minhas dúvidas e fornecendo o máximo de orientação necessária no meu processo. Agradeço e recomendo por ser um grande profissional."
  },
  {
    id: "rev-2",
    author: "Anna Lucia 'Annalu'",
    date: "14/06/2023",
    stars: 5,
    source: "Google Avaliações",
    comment: "Estou plenamente satisfeita com a FMA Advogados. Eficiência, conhecimento, visão e ética impecável. Atendimento perfeito do início ao fim."
  },
  {
    id: "rev-3",
    author: "Fatima Silva",
    date: "14/06/2023",
    stars: 5,
    source: "Google Avaliações",
    comment: "Excelente advogado, resolveu um problema grave que estava me tirando o sono e me deixando angustiada. Muito obrigada mesmo, que Deus te abençoe sempre. Fiquei muito grata pelo acolhimento!"
  },
  {
    id: "rev-4",
    author: "Luiz Moraes",
    date: "14/06/2023",
    stars: 5,
    source: "Google Avaliações",
    comment: "Profissional extremamente competente, honesto, comprometido com o cliente e com total clareza nas informações jurídicas. Recomendo com segurança."
  },
  {
    id: "rev-5",
    author: "Jonathan Pires",
    date: "25/10/2022",
    stars: 5,
    source: "Google Avaliações",
    comment: "Ótimo atendimento, sempre bem transparente sobre o caso e tudo o que está ocorrendo no tribunal. Tive todas as dúvidas sanadas e conseguimos resultado positivo no processo!"
  },
  {
    id: "rev-6",
    author: "Fabio Abreu",
    date: "20/04/2022",
    stars: 5,
    source: "Google Avaliações",
    comment: "Excelente atendimento e muito atencioso para esclarecimento de cada detalhe do processo. Passa muita tranquilidade."
  },
  {
    id: "rev-7",
    author: "Lucas Montilha",
    date: "30/11/2018",
    stars: 5,
    source: "Google Avaliações",
    comment: "Muito bom profissional, experiente e dedicado. Meu processo tramitou de forma ágil e obtive o resultado antes do esperado."
  }
];

// ============================================================================
// PERGUNTAS FREQUENTES (FAQ)
// ============================================================================
export const FMA_FAQ = [
  {
    q: "Como funciona um pedido de Liminar (Tutela de Urgência) e qual o prazo para decisão?",
    a: "A liminar é uma decisão judicial proferida em caráter provisório e prioritário logo no início do processo. Em casos de negativa de cirurgias, internações hospitalares urgentes ou negativação indevida, o juiz costuma apreciar o pedido entre 24 a 48 horas após a distribuição da ação, determinando que a parte contrária cumpra a obrigação sob pena de multa diária."
  },
  {
    q: "O escritório atua na área criminal?",
    a: "Não. A FMA Advogados possui atuação estrita e focada nas áreas Cível, Empresarial, Contratual, Direito Bancário, Direito à Saúde e Direito do Consumidor Especializado. Essa hiperespecialização garante a máxima profundidade técnica em favor dos nossos clientes."
  },
  {
    q: "Como saber se o meu contrato bancário possui juros abusivos passíveis de revisão?",
    a: "Realizamos uma análise preliminar confrontando a taxa nominal anual contratada com a taxa média de juros divulgada pelo Banco Central do Brasil (BACEN) para a mesma modalidade de crédito na data da assinatura. Havendo discrepância abusiva ou cobrança de encargos ilegais, elaboramos a estratégia de readequação."
  },
  {
    q: "O plano de saúde negou meu exame, cirurgia ou prótese. O que devo fazer imediatamente?",
    a: "1) Exija a negativa por escrito (ou anote o número de protocolo do atendimento); 2) Peça ao seu médico um relatório circunstanciado atestando a urgência clínica e a impossibilidade de substituição do procedimento; 3) Entre em contato com nosso plantão de triagem via WhatsApp para orientarmos o ajuizamento imediato da ação liminar."
  },
  {
    q: "O atendimento pode ser realizado 100% online para clientes fora de São Paulo?",
    a: "Sim. Todo o processo judicial no Brasil hoje tramita por meio digital (PJe e e-SAJ). Atendemos clientes em todo o território nacional com reuniões por videoconferência, assinatura eletrônica de procurações e acompanhamento em tempo real pelo WhatsApp."
  },
  {
    q: "Quais são os custos e honorários para ingresso de uma ação?",
    a: "No Brasil, o acesso ao Judiciário envolve eventuais custas estaduais (salvo para beneficiários de justiça gratuita) e honorários advocatícios. O Dr. Fernando Maeda preza pela clareza prévia: explicamos com total transparência todos os custos, riscos e condições de pagamento antes de qualquer assinatura de contrato."
  }
];

// ============================================================================
// OPÇÕES PARA O TRIADOR DE CASOS / PLANTÃO DE LIMINARES
// ============================================================================
export const FMA_TRIAGE_OPTIONS = [
  {
    id: "saude-cirurgia",
    label: "Negativa de Cirurgia / Procedimento Hospitalar",
    category: "Direito à Saúde",
    urgency: "Crítica — Plantão Ativo",
    questions: [
      "O médico emitiu relatório indicando urgência?",
      "Você possui a negativa por escrito ou protocolo do plano?"
    ],
    whatsappTemplate: "Olá Dr. Fernando Maeda. Preciso de atendimento urgente para PLANTÃO DE LIMINAR: Meu plano de saúde recusou a autorização de uma cirurgia/procedimento médico. Gostaria de verificar a viabilidade da ação imediata."
  },
  {
    id: "saude-medicamento",
    label: "Negativa de Medicamento de Alto Custo / Prótese (Stent)",
    category: "Direito à Saúde",
    urgency: "Crítica — Plantão Ativo",
    questions: [
      "O medicamento possui registro na Anvisa?",
      "A prótese/órtese foi expressamente solicitada pelo cirurgião?"
    ],
    whatsappTemplate: "Olá Dr. Fernando Maeda. Preciso de auxílio jurídico urgente: O plano de saúde recusou o fornecimento de medicamento de alto custo / prótese cirúrgica indicada pelo meu médico. Gostaria de analisar uma liminar."
  },
  {
    id: "banco-negativacao",
    label: "Negativação Indevida / Nome no Serasa / Protesto",
    category: "Direito Bancário",
    urgency: "Urgente",
    questions: [
      "A dívida já foi paga ou você desconhece a origem do débito?",
      "Você tentou solucionar diretamente com o banco ou cartório?"
    ],
    whatsappTemplate: "Olá Dr. Fernando Maeda. Gostaria de orientação para ação com pedido de liminar: Meu nome foi negativado indevidamente pelo banco/empresa no Serasa/SPC/Cartório de Protesto. Gostaria de retirar o apontamento e buscar indenização."
  },
  {
    id: "banco-juros",
    label: "Revisão de Juros Abusivos / Dívida de Empréstimo ou Financiamento",
    category: "Direito Bancário",
    urgency: "Estratégica",
    questions: [
      "Você possui cópia do contrato de financiamento/empréstimo?",
      "A parcela atual compromete desproporcionalmente sua renda ou caixa?"
    ],
    whatsappTemplate: "Olá Dr. Fernando Maeda. Gostaria de agendar uma análise contratual para REVISÃO DE JUROS ABUSIVOS e renegociação de dívida bancária. Possuo o contrato e gostaria de verificar o recálculo."
  },
  {
    id: "consumidor-voo",
    label: "Atraso Grave / Cancelamento de Voo ou Extravio de Bagagem",
    category: "Direito do Consumidor",
    urgency: "Moderada",
    questions: [
      "O atraso foi superior a 4 horas ou gerou perda de compromisso?",
      "Você guardou os comprovantes de despesas e bilhetes?"
    ],
    whatsappTemplate: "Olá Dr. Fernando Maeda. Tive um grave problema com companhia aérea (voo cancelado / atraso superior a 4h / extravio de bagagem) e gostaria de saber sobre a indenização por danos morais e materiais cabível."
  },
  {
    id: "imovel-distrato",
    label: "Atraso na Entrega de Imóvel na Planta / Distrato",
    category: "Direito Imobiliário",
    urgency: "Estratégica",
    questions: [
      "A construtora ultrapassou o prazo de 180 dias de tolerância?",
      "Você deseja a rescisão com devolução integral ou entrega das chaves?"
    ],
    whatsappTemplate: "Olá Dr. Fernando Maeda. Comprei um imóvel na planta e a construtora está atrasando a entrega da obra. Gostaria de analisar a rescisão (distrato) com restituição de 100% dos valores pagos mais multa."
  }
];
