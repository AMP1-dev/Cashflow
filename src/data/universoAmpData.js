export const initialAmpSiteConfig = {
  name: "Grupo AMP",
  subname: "Universo AMP",
  tagline: "40+ Anos de Excelência em TI Corporativa, Governança & Consultoria Estratégica",
  slogan: "Convergência tecnológica de alta performance e solidez econômico-fiscal para potencializar empresas em todo o Brasil.",
  shortDescription: "Com mais de quatro décadas de experiência e inovação ininterrupta, o Grupo AMP integra infraestrutura de TI avançada, segurança da informação, suporte remoto 24/7, contabilidade estratégica e inteligência financeira.",
  heroTitle: "40+ Anos de Inovação em TI Corporativa & Inteligência Estratégica",
  heroSubtitle: "Unimos gestão avançada de infraestrutura de TI, suporte remoto em tempo real, governança em nuvem e assessoria financeira de alta precisão em um ecossistema corporativo único.",
  aboutTitle: "Solidez, Vanguarda Tecnológica e Resultados Mensuráveis",
  aboutDescription: "O Grupo AMP nasceu e se consolidou como uma referência nacional em soluções corporativas integradas. Ao longo de 40 anos de trajetória, construímos um ecossistema completo de ativos que atende desde as demandas mais complexas de cibersegurança e suporte gerenciado até o planejamento tributário e financeiro de empresas líderes de mercado.",
  stats: {
    yearsActive: "40+ Anos",
    clientsServed: "500+",
    managedDevices: "15.000+",
    financialOptimization: "R$ 250M+",
    slaResponse: "< 15 min",
    uptimeGuarantee: "99.98%"
  },
  contact: {
    phone: "(11) 3250-8800",
    phoneSecondary: "(11) 3250-8801",
    whatsapp: "5511998887766",
    whatsappFormatted: "(11) 99888-7766",
    email: "contato@amp.ia.br",
    commercialEmail: "comercial@amp.ia.br",
    supportEmail: "suporte@amp.ia.br",
    address: "Av. Paulista, 1842 - 14º Andar - Bela Vista, São Paulo - SP",
    operatingHours: "Segunda a Sexta, das 08h00 às 18h30 (Suporte Crítico 24/7/365)",
    cnpj: "04.567.890/0001-12",
    registry: "Registro CREA-SP / CRC-SP / ITIL Certified"
  },
  social: {
    linkedin: "https://linkedin.com/company/grupo-amp-corporativo",
    instagram: "https://instagram.com/universoamp",
    youtube: "https://youtube.com/@universoamp",
    github: "https://github.com/grupo-amp"
  },
  theme: "navy-gold" // 'navy-gold' | 'tech-cyan' | 'emerald-corp' | 'graphite-dark'
};

export const initialEcosystemAssets = [
  {
    id: "asset-alianca",
    name: "Aliança Empresarial",
    shortName: "Case Aliança",
    url: "https://aliancaempresarial.net.br",
    category: "Case Corporativo • Gestão de TI & Segurança",
    pillar: "TI, Nuvem & Cibersegurança",
    iconName: "ShieldCheck",
    color: "from-blue-600 to-indigo-900",
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    badge: "Case de Sucesso • Gestão de TI",
    tagline: "Desenvolvimento Web, Gestão de TI e Segurança Ativa",
    description: "Case corporativo de alta criticidade atendido pelo Grupo AMP. O Grupo AMP é responsável pela gestão completa do ambiente tecnológico da Aliança Empresarial: desenvolvimento e sustentação do portal web de alto desempenho, gestão de infraestrutura de TI, monitoramento proativo e proteção avançada contra ameaças cibernéticas.",
    highlights: [
      "Desenvolvimento e Hospedagem do Portal Corporativo",
      "Gerenciamento Completo de TI e Suporte de Infraestrutura",
      "Cibersegurança Avançada, Firewall e Defesa Ativa",
      "Monitoramento Contínuo e Backup Imutável 24/7"
    ],
    kpis: [
      { label: "Uptime do Portal", value: "99.9%" },
      { label: "Monitoramento", value: "NOC 24/7" },
      { label: "Gestão AMP", value: "TI & Cloud" }
    ],
    ctaText: "Ver Detalhes do Case",
    featured: true
  },
  {
    id: "asset-mesh",
    name: "MeshCentral Suporte Remoto",
    shortName: "AMP Cloud Remote",
    url: "https://remoto.amp.ia.br",
    category: "Operações de TI & Gestão Remota",
    pillar: "TI & Infraestrutura",
    iconName: "ShieldCheck",
    color: "from-cyan-600 to-blue-800",
    accentColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    badge: "Suporte 24/7 & NOC",
    tagline: "Plataforma Centralizada de Gestão e Acesso Remoto Seguro",
    description: "Central de monitoramento e controle de infraestrutura em tempo real. Acesso remoto ponto a ponto com criptografia AES-256 e TLS 1.3, inventário automático de hardware/software, automação de scripts e resposta ágil a incidentes.",
    highlights: [
      "Acesso Remoto Seguro P2P / WebRTC Criptografado",
      "Monitoramento Proativo de Servidores e Endpoints",
      "Implantação Remota de Softwares e Patches Críticos",
      "SLA de Atendimento Imediato para Chamados Críticos"
    ],
    kpis: [
      { label: "Endpoints Monitorados", value: "15.000+" },
      { label: "Tempo Médio Resposta", value: "< 12 min" },
      { label: "Uptime Garantido", value: "99.98%" }
    ],
    ctaText: "Acessar MeshCentral Suporte",
    featured: true
  },
  {
    id: "asset-joao-barro",
    name: "Projeto João de Barro",
    shortName: "João de Barro",
    url: "https://projetojoaodebarro.org.br",
    category: "Responsabilidade Socioambiental & ESG",
    pillar: "Impacto Social & Sustentabilidade",
    iconName: "HeartHandshake",
    color: "from-emerald-600 to-teal-800",
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    badge: "Iniciativa ESG",
    tagline: "Desenvolvimento Comunitário Sustentável e Inclusão Social",
    description: "Iniciativa socioambiental mantida e apoiada pelo Grupo AMP. Atua na capacitação profissional de jovens, formação em tecnologia, projetos de habitação sustentável, agroecologia e reflorestamento com total transparência.",
    highlights: [
      "Capacitação Profissional e Inclusão Digital de Jovens",
      "Projetos de Construção e Habitação Sustentável",
      "Ações de Reflorestamento e Preservação de Mananciais",
      "Governança ESG e Prestação de Contas Aberta"
    ],
    kpis: [
      { label: "Famílias Impactadas", value: "3.200+" },
      { label: "Jovens Capacitados", value: "1.450+" },
      { label: "Áreas Recuperadas", value: "25 Hectares" }
    ],
    ctaText: "Conhecer Projeto João de Barro",
    featured: true
  },
  {
    id: "asset-radio",
    name: "Rádio Amplificadora",
    shortName: "Amplificadora",
    url: "https://amplificadora.com.br",
    category: "Comunicação, Mídia & Cultura",
    pillar: "Mídia & Entretenimento",
    iconName: "Radio",
    color: "from-fuchsia-600 to-purple-800",
    accentColor: "text-fuchsia-400",
    borderColor: "border-fuchsia-500/30",
    badge: "Web Rádio HD 24h",
    tagline: "A Trilha Sonora da Inovação e dos Bons Momentos",
    description: "A rádio corporativa oficial do Grupo AMP. Transmissão contínua em alta definição sonora com uma curadoria sofisticada de Pop Internacional, Flashbacks dos anos 80/90, Drops de Notícias Corporativas e Tecnologia.",
    highlights: [
      "Streaming 24 Horas em Alta Resolução (320kbps)",
      "Curadoria Musical Premium sem Intervalos Abusivos",
      "Drops Diários de Negócios, Inovação e Tecnologia",
      "Player Web Interativo Integrado ao Portal"
    ],
    kpis: [
      { label: "Ouvintes Diários", value: "25.000+" },
      { label: "Cidades Conectadas", value: "120+" },
      { label: "Transmissão", value: "24/7 Ao Vivo" }
    ],
    streamUrl: "https://stream.zeno.fm/k2k047vuv0hvv",
    ctaText: "Sintonizar Amplificadora",
    featured: true
  }
];

export const initialCorporateServices = [
  // IT Division
  {
    id: "srv-ti-1",
    division: "ti",
    divisionLabel: "TI Corporativa & Cloud",
    title: "Gestão de Infraestrutura & Cloud Híbrida",
    category: "Infraestrutura",
    iconName: "Server",
    shortDesc: "Arquitetura, dimensionamento e gestão contínua de ambientes em nuvem (AWS/Azure) e servidores locais de alta disponibilidade.",
    fullDesc: "Projetamos, migramos e sustentamos infraestruturas de TI híbridas e em nuvem para ambientes críticos de médias e grandes empresas. Com foco em redundância, tolerância a falhas e otimização contínua de custos (FinOps), garantimos que seus sistemas de ERP, bancos de dados e aplicações corporativas operem com máxima velocidade e 99.98% de disponibilidade.",
    highlights: [
      "Migração assistida para AWS, Azure e GCP sem paralisação",
      "Virtualização corporativa de alto desempenho (VMware / Proxmox)",
      "Gestão de Redes Corporativas, VPNs e SD-WAN corporativo",
      "Otimização de custos de instâncias e armazenamento em nuvem"
    ],
    targetAudience: "Empresas com múltiplos servidores, filiais integradas ou que necessitam de migração para nuvem com segurança."
  },
  {
    id: "srv-ti-2",
    division: "ti",
    divisionLabel: "TI Corporativa & Cloud",
    title: "Cibersegurança, SOC & Backup Imutável",
    category: "Segurança",
    iconName: "ShieldAlert",
    shortDesc: "Proteção contra ransomware, monitoramento proativo de ameaças em tempo real e backup imutável à prova de sequestro de dados.",
    fullDesc: "Blindagem digital completa para os ativos críticos da sua empresa. Implementamos defesa em camadas com antivírus corporativo gerenciado (EDR/XDR), firewall de última geração (NGFW), testes periódicos de vulnerabilidade e sistema de backup imutável que impede qualquer alteração ou criptografia por criminosos virtuais.",
    highlights: [
      "Proteção em tempo real contra Ransomware e invasões",
      "Backup Imutável em nuvem com retenção geo-redundante",
      "Adequação técnica completa às exigências da LGPD",
      "Planos de Continuidade de Negócios e Disaster Recovery (DR)"
    ],
    targetAudience: "Organizações que manipulam dados sensíveis, transações financeiras e precisam de garantia contra perdas de dados."
  },
  {
    id: "srv-ti-3",
    division: "ti",
    divisionLabel: "TI Corporativa & Cloud",
    title: "Suporte Gerenciado 24/7 & MeshCentral",
    category: "Suporte & NOC",
    iconName: "Headset",
    shortDesc: "Central de atendimento Helpdesk N1, N2 e N3 com SLA contratual agressivo e gestão remota via MeshCentral.",
    fullDesc: "Elimine o tempo ocioso da sua equipe decorrente de falhas técnicas. Nosso time de especialistas atua com monitoramento preditivo e suporte ágil remoto e presencial, gerenciando estações de trabalho, notebooks e servidores através da nossa plataforma segura MeshCentral.",
    highlights: [
      "SLA de atendimento em menos de 15 minutos para ocorrências críticas",
      "Inventário automático de hardware, licenças e saúde de discos",
      "Aplicação automatizada de atualizações e patches de segurança",
      "Relatórios gerenciais mensais de volumetria e qualidade de chamados"
    ],
    targetAudience: "Empresas de 10 a 500+ colaboradores que necessitam de suporte técnico de nível enterprise sem os altos custos de uma equipe interna."
  },
  {
    id: "srv-ti-4",
    division: "ti",
    divisionLabel: "TI Corporativa & Cloud",
    title: "Governança de TI, Licenciamento & IA Corporativa",
    category: "Governança & Inovação",
    iconName: "Cpu",
    shortDesc: "Auditoria de licenças Microsoft/Google, governança estruturada (ITIL) e integração de fluxos inteligentes de Inteligência Artificial.",
    fullDesc: "Alinhamos a tecnologia da sua empresa aos objetivos estratégicos do negócio. Apoiamos a diretoria em compliance de licenciamento corporativo (economizando milhares de reais em multas ou excessos), desenho de políticas internas de uso e implantação de agentes de Inteligência Artificial para automatizar tarefas repetitivas.",
    highlights: [
      "Gestão centralizada de licenças Microsoft 365, Google Workspace e ERPs",
      "Auditoria de conformidade e governança baseada em ITIL/COBIT",
      "Implementação de fluxos automatizados com IA e IA Generativa segura",
      "Assessoria estratégica para o comitê de tecnologia e diretoria (vCIO)"
    ],
    targetAudience: "Diretoria e gestores de TI que buscam modernização estruturada, conformidade e redução de custos com licenças."
  },

  // Financial Division
  {
    id: "srv-fin-1",
    division: "finance",
    divisionLabel: "Consultoria Financeira & Estratégica",
    title: "BPO Financeiro Integral & Tesouraria",
    category: "Gestão Financeira",
    iconName: "TrendingUp",
    shortDesc: "Terceirização completa das rotinas de contas a pagar, receber, faturamento, conciliação bancária diária e fluxo de caixa.",
    fullDesc: "Liberte o tempo da sua liderança para focar na estratégia e vendas. Nossa equipe especializada em BPO Financeiro assume toda a operação financeira com segregação rigorosa de funções, tecnologia em nuvem, controle rigoroso de inadimplência e envio diário de relatórios de previsibilidade de caixa.",
    highlights: [
      "Operação diária de contas a pagar e cobrança de inadimplentes",
      "Emissão ágil de Notas Fiscais e boletos bancários integrados",
      "Conciliação bancária diária de todas as contas e cartões",
      "Painel gerencial de fluxo de caixa com projeção futura de saldo"
    ],
    targetAudience: "Empresas que necessitam de processos financeiros organizados, sem erros operacionais e com custo inferior ao de manter equipe própria."
  },
  {
    id: "srv-fin-2",
    division: "finance",
    divisionLabel: "Consultoria Financeira & Estratégica",
    title: "Planejamento Tributário & Elisão Fiscal",
    category: "Inteligência Tributária",
    iconName: "Calculator",
    shortDesc: "Estudo aprofundado entre Simples, Lucro Presumido e Lucro Real para redução lícita de até 35% na carga de tributos.",
    fullDesc: "O sistema tributário brasileiro é um dos mais complexos do mundo. Nossos auditores e contadores tributaristas realizam diagnósticos minuciosos para identificar o regime de tributação mais vantajoso para a sua operação, eliminando bitributações e usufruindo de todos os benefícios e incentivos fiscais legais.",
    highlights: [
      "Simulação comparativa detalhada de regimes tributários",
      "Revisão fiscal de cadastros de produtos (NCM/CEST/ICMS-ST)",
      "Recuperação administrativa de créditos tributários pagos a maior (60 meses)",
      "Preparação e blindagem para as novas regras da Reforma Tributária"
    ],
    targetAudience: "Indústrias, comércios, clínicas e prestadores de serviços que buscam otimizar margens e pagar apenas o imposto justo."
  },
  {
    id: "srv-fin-3",
    division: "finance",
    divisionLabel: "Consultoria Financeira & Estratégica",
    title: "DRE Gerencial, Valuation & Controladoria",
    category: "Controladoria",
    iconName: "PieChart",
    shortDesc: "Demonstrativos analíticos de resultados, margem de contribuição, EBITDA e avaliação econômico-financeira de empresas.",
    fullDesc: "Transformamos dados contábeis em inteligência prática de negócios. Apresentamos relatórios executivos mensais com margem de lucro por linha de produto/serviço, ponto de equilíbrio operacional, necessidade de capital de giro e valuation detalhado para orientar decisões de expansão ou captação de sócios.",
    highlights: [
      "DRE Gerencial mensal estruturada por centro de custos",
      "Cálculo de EBITDA, margem líquida e indicadores de liquidez",
      "Laudos de Valuation por Fluxo de Caixa Descontado",
      "Reuniões estratégicas mensais de alinhamento com a diretoria"
    ],
    targetAudience: "Sócios, diretores e investidores que exigem clareza absoluta sobre a real rentabilidade e saúde financeira do negócio."
  },
  {
    id: "srv-fin-4",
    division: "finance",
    divisionLabel: "Consultoria Financeira & Estratégica",
    title: "Holding Patrimonial & Reestruturação Societária",
    category: "Societário & Sucessão",
    iconName: "Building2",
    shortDesc: "Proteção lícita do patrimônio dos sócios, planejamento sucessório sem litígios e economia substancial em ITCMD e IR.",
    fullDesc: "Constituição de Holdings Familiares e Imobiliárias estruturadas para blindar os bens da família contra riscos da atividade empresarial operacional, além de planejar a herança em vida com economia de até 70% nos impostos de transmissão de bens (ITCMD) e agilidade sem inventário judicial.",
    highlights: [
      "Constituição de Holdings Familiares e Administradoras de Bens",
      "Proteção patrimonial preventiva 100% legal",
      "Cláusulas restritivas de inalienabilidade, incomunicabilidade e impenhorabilidade",
      "Estruturação societária para fusões, cisões e acordos de acionistas"
    ],
    targetAudience: "Empresários, famílias detentoras de patrimônio imobiliário e sócios que desejam segurança jurídica e perpetuidade dos bens."
  }
];

export const initialSuccessCases = [
  {
    id: "case-1",
    client: "Rede Hospitalar & Centro Diagnóstico Santa Helena",
    industry: "Saúde & Medicina Diagnóstica",
    period: "Parceria há 8 anos",
    logoPlaceholder: "SH",
    challenge: "Ambiente de TI instável com lentidão nos prontuários eletrônicos e alta carga tributária sobre serviços hospitalares.",
    solution: "Modernização completa dos servidores com arquitetura de alta disponibilidade em nuvem híbrida, monitoramento 24/7 com MeshCentral e equiparação tributária hospitalar pela Aliança Empresarial.",
    results: [
      "Zero paradas não programadas em 36 meses consecutivos de operação",
      "Redução comprovada de 32% na carga tributária com equiparação hospitalar legal",
      "Economia anual superior a R$ 1.4 Milhão em tributos e custos de TI",
      "Atendimento a chamados clínicos em menos de 8 minutos"
    ],
    quote: "A sinergia entre TI rápida e inteligência contábil da AMP nos deu a segurança necessária para expandirmos mais 4 unidades no estado.",
    author: "Dr. Marcelo Fagundes — Diretor Geral"
  },
  {
    id: "case-2",
    client: "Indústria Metalúrgica Alvorada",
    industry: "Indústria & Manufatura Pesada",
    period: "Parceria há 12 anos",
    logoPlaceholder: "IMA",
    challenge: "Risco iminente de perda de dados de engenharia por backup defasado, além de controles financeiros manuais em planilhas sem conciliação.",
    solution: "Implantação de Backup Imutável em nuvem com defesa EDR contra ransomware, migração do ERP para Cloud dedicada e terceirização integral da tesouraria via BPO Financeiro.",
    results: [
      "Tentativa de ataque de Ransomware neutralizada em tempo real sem impacto",
      "Redução da inadimplência de clientes de 14% para 2.1% no primeiro ano",
      "Fechamento contábil e DRE antecipados do dia 25 para o 5º dia útil do mês",
      "Recuperação de R$ 920.000 em créditos tributários de PIS/COFINS sobre insumos"
    ],
    quote: "Ter a infraestrutura e o financeiro geridos pelo Grupo AMP é como ter uma diretoria de multinacional dentro da nossa fábrica.",
    author: "Renata Vasconcellos — CFO"
  },
  {
    id: "case-3",
    client: "TransLogística Nacional Express",
    industry: "Logística & Transporte Rodoviário",
    period: "Parceria há 6 anos",
    logoPlaceholder: "TLN",
    challenge: "Dificuldade de suporte a mais de 400 computadores espalhados em 18 centros de distribuição e complexidade extrema com ICMS-ST e fretes.",
    solution: "Padronização do parque tecnológico com MeshCentral Suporte Remoto centralizado e assessoria fiscal contínua com parametrização de documentos fiscais eletrônicos (CT-e / MDF-e).",
    results: [
      "Redução de 65% nos custos com deslocamento de técnicos de informática",
      "Tempo médio de solução de chamados reduzido de 4 horas para 18 minutos",
      "Eliminação total de autos de infração e multas fiscais de transporte",
      "Constituição de Holding Imobiliária para os 18 galpões da família fundadora"
    ],
    quote: "O suporte remoto deles é instantâneo. Nossos galpões não param de faturar um minuto sequer.",
    author: "Carlos Eduardo Menezes — Diretor de Operações"
  }
];

export const initialClientPortalLinks = [
  {
    id: "portal-mesh",
    title: "MeshCentral Suporte Remoto",
    subtitle: "Acesso remoto corporativo e abertura de chamados técnicos de TI",
    url: "https://remoto.amp.ia.br",
    iconName: "ShieldCheck",
    badge: "TI & Helpdesk",
    color: "from-cyan-600 to-blue-700",
    buttonText: "Acessar MeshCentral"
  },
  {
    id: "portal-alianca",
    title: "Portal do Cliente Aliança",
    subtitle: "Acesse guias de impostos, certidões negativas, holerites e DREs",
    url: "https://aliancaempresarial.net.br",
    iconName: "Calculator",
    badge: "Contábil & Fiscal",
    color: "from-amber-600 to-amber-700",
    buttonText: "Acessar Portal Aliança"
  },
  {
    id: "portal-joao-barro",
    title: "Portal ESG João de Barro",
    subtitle: "Acompanhe relatórios de impacto socioambiental e prestação de contas",
    url: "https://projetojoaodebarro.org.br",
    iconName: "HeartHandshake",
    badge: "ESG & Sustentabilidade",
    color: "from-emerald-600 to-teal-700",
    buttonText: "Acessar João de Barro"
  },
  {
    id: "portal-radio",
    title: "Rádio Amplificadora Ao Vivo",
    subtitle: "Transmissão contínua em alta fidelidade com notícias de negócios",
    url: "https://amplificadora.com.br",
    iconName: "Radio",
    badge: "Mídia Corporativa",
    color: "from-fuchsia-600 to-purple-700",
    buttonText: "Ouvir Amplificadora"
  },
  {
    id: "portal-bpo",
    title: "Central de BPO Financeiro",
    subtitle: "Envio de notas fiscais, autorizações de pagamentos e fluxo de caixa",
    url: "https://aliancaempresarial.net.br#portal",
    iconName: "TrendingUp",
    badge: "Financeiro & Tesouraria",
    color: "from-blue-600 to-indigo-700",
    buttonText: "Acessar Tesouraria"
  },
  {
    id: "portal-backup",
    title: "Painel de Backup Imutável",
    subtitle: "Monitoramento centralizado de rotinas, proteção WORM anti-ransomware e restauração instantânea",
    url: "https://remoto.amp.ia.br#backup",
    iconName: "ShieldCheck",
    badge: "Disaster Recovery",
    color: "from-sky-600 to-blue-800",
    buttonText: "Acessar Painel Backup"
  },
  {
    id: "portal-loyalty",
    title: "Aplicativo de Fidelidade (AMP Loyalty)",
    subtitle: "Gestão de programas de pontos, cashback, roleta de benefícios e engajamento omnichannel",
    url: "https://aliancaempresarial.net.br#loyalty",
    iconName: "Gift",
    badge: "Fidelidade & Campanhas",
    color: "from-amber-500 to-yellow-700",
    buttonText: "Acessar Loyalty"
  },
  {
    id: "portal-erp",
    title: "ERP Empresarial Integrado",
    subtitle: "Emissão de NF-e/NFS-e/MDF-e, controle de estoque, faturamento e integração contábil nativa",
    url: "https://aliancaempresarial.net.br#erp",
    iconName: "Calculator",
    badge: "Gestão & Emissão Fiscal",
    color: "from-emerald-600 to-teal-800",
    buttonText: "Acessar ERP"
  },
  {
    id: "portal-peso",
    title: "Aplicativo de Pesagem & Balança",
    subtitle: "Controle de pesagem de frotas, tíquetes de balança industrial/rodoviária e conciliação de cargas",
    url: "https://remoto.amp.ia.br#pesagem",
    iconName: "TrendingUp",
    badge: "Logística & Pesagem",
    color: "from-cyan-600 to-teal-700",
    buttonText: "Acessar Balança"
  },
  {
    id: "portal-cheques",
    title: "Módulo Banco & Controle de Cheques",
    subtitle: "Gestão de custódia de cheques pré-datados, conciliação bancária, repasse e liquidação de títulos",
    url: "https://aliancaempresarial.net.br#banco",
    iconName: "Calculator",
    badge: "Bancário & Custódia",
    color: "from-blue-600 to-indigo-800",
    buttonText: "Acessar Módulo Cheques"
  },
  {
    id: "portal-demandas-consultores",
    title: "Gestão de Demandas de Consultores",
    subtitle: "Plataforma de alocação de horas, controle de entregas técnicas, SLA e honorários para autônomos",
    url: "https://remoto.amp.ia.br#consultores",
    iconName: "HeartHandshake",
    badge: "Consultoria & Autônomos",
    color: "from-purple-600 to-slate-800",
    buttonText: "Acessar Demandas"
  },
  {
    id: "portal-ouvidoria",
    title: "Ouvidoria & Presidência",
    subtitle: "Canal direto de governança, compliance e atendimento executivo VIP",
    url: "mailto:presidencia@amp.ia.br",
    iconName: "Mail",
    badge: "Governança VIP",
    color: "from-slate-700 to-slate-900",
    buttonText: "Enviar Mensagem Direta"
  }
];

export const initialBlogArticles = [
  {
    id: "art-1",
    title: "Cibersegurança Corporativa em 2026: Por Que o Backup Imutável é a Única Salvação Contra Ransomware",
    slug: "ciberseguranca-backup-imutavel-ransomware-2026",
    category: "TI & Cibersegurança",
    date: "2026-08-28",
    author: "Diretoria de Segurança da Informação AMP",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    summary: "Como criminosos digitais aperfeiçoaram os ataques para destruir backups convencionais e como o armazenamento imutável protege a continuidade do negócio.",
    content: `Os ataques cibernéticos deixaram de ser incidentes isolados e se tornaram operações organizadas que visam paralisar completamente a operação de médias e grandes empresas.

Nos últimos anos, a tática dos invasores mudou radicalmente: antes de sequestrarem os dados principais, eles passam semanas infiltrados na rede buscando credenciais de administradores para destruir e formatar os backups locais e sincronizados em nuvens convencionais.

### O Que é o Backup Imutável?
O Backup Imutável utiliza a tecnologia WORM (*Write Once, Read Many*). Uma vez gravado o bloco de dados, nem mesmo a conta com maiores privilégios de administrador do sistema ou um vírus com permissão de 'root' consegue apagar, alterar ou criptografar esse arquivo até que o período de retenção predeterminado expire.

### Vantagens Estratégicas para a Diretoria:
1. **Recuperação Garantida em Horas:** Mesmo na pior hipótese de desastre, a empresa restaura a última imagem íntegra dos servidores sem pagar resgate ilegal.
2. **Conformidade com LGPD e Seguradoras:** Empresas que possuem backup imutável obtêm melhores condições em apólices de seguro contra riscos cibernéticos.
3. **Paz de Espírito para os Sócios:** Os dados vitais de faturamento, engenharia e clientes permanecem protegidos contra chantagens.

O Grupo AMP implementa a arquitetura de Backup Imutável com testes periódicos de restauração automática, garantindo que o seu plano de Disaster Recovery realmente funcione quando for necessário.`
  },
  {
    id: "art-2",
    title: "Reforma Tributária e Transição dos Impostos: O Roteiro Estratégico para Empresas Não Perderem Margem",
    slug: "reforma-tributaria-transicao-empresas-estrategia",
    category: "Gestão Fiscal & Tributária",
    date: "2026-08-18",
    author: "Consultoria Tributária Aliança / AMP",
    readTime: "7 min",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    summary: "Entenda como a substituição do PIS, COFINS, IPI, ICMS e ISS pelo IVA Dual (CBS/IBS) exigirá revisão imediata de contratos, formação de preços e sistemas emissores.",
    content: `O período de transição da Reforma Tributária traz profundas alterações na forma como os preços de venda de mercadorias e prestações de serviços são calculados no Brasil.

### Os 3 Pilares da Mudança:
- **Não Cumulatividade Plena:** Todo imposto pago na aquisição de insumos, softwares e serviços gerará crédito financeiro, exigindo controle fiscal muito mais rigoroso.
- **Tributação no Destino:** A arrecadação do IBS migra para o local de consumo do cliente, encerrando a antiga guerra fiscal entre estados e municípios.
- **Adequação dos ERPs e Sistemas:** Softwares de emissão de NF-e e ERPs precisam ser atualizados com antecedência para processar o cálculo concomitante das alíquotas de transição.

### O Que a Diretoria Deve Fazer Agora:
A equipe de consultoria tributária da Aliança Empresarial e do Grupo AMP recomenda a realização de um diagnóstico fiscal preventivo para recalcular a margem líquida de cada produto e rever cláusulas de reajuste em contratos de longo prazo.`
  },
  {
    id: "art-3",
    title: "BPO Financeiro vs. Departamento Interno: Análise Real de Custo, Produtividade e Mitigação de Riscos",
    slug: "bpo-financeiro-vs-departamento-interno-analise-custos",
    category: "Consultoria Financeira & BPO",
    date: "2026-08-05",
    author: "Equipe de Controladoria AMP",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
    summary: "Descubra por que empresas modernas estão terceirizando contas a pagar, conciliação e tesouraria para ganhar escalabilidade e governança.",
    content: `Manter um departamento financeiro interno estruturado com analistas de contas a pagar, receber, tesouraria e supervisores acarreta altos custos com encargos trabalhistas, softwares, treinamento e vulnerabilidade a rotatividade de pessoal.

Ao migrar para o modelo de BPO Financeiro com a Aliança Empresarial / Grupo AMP:
- A empresa reduz custos fixos operacionais em até 50%;
- Ganha processos padronizados com segregação de funções (quem lança não autoriza pagamento no banco);
- Recebe conciliação bancária diária e relatórios de DRE e fluxo de caixa pontuais no início do mês.`
  },
  {
    id: "art-4",
    title: "ESG na Prática Empresarial: Como o Projeto João de Barro Conecta Tecnologia, Educação e Sustentabilidade",
    slug: "esg-projeto-joao-de-barro-sustentabilidade-grupo-amp",
    category: "ESG & Responsabilidade Social",
    date: "2026-07-22",
    author: "Comitê de Sustentabilidade Grupo AMP",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
    summary: "A responsabilidade corporativa não é apenas discurso: saiba como o Grupo AMP investe no Projeto João de Barro para gerar transformação social real e mensurável.",
    content: `A sigla ESG (Environmental, Social, Governance) tornou-se critério determinante para atração de investimentos, fechamento de contratos com grandes corporações e retenção de talentos.

O Grupo AMP orgulha-se de ser o mantenedor e parceiro de tecnologia do **Projeto João de Barro**, uma iniciativa que atua na capacitação tecnológica de jovens em situação de vulnerabilidade, bioarquitetura sustentável e reflorestamento de áreas degradadas.`
  }
];

export const initialTestimonials = [
  {
    id: "t-1",
    name: "Dr. Arthur Albuquerque",
    role: "Presidente do Conselho",
    company: "Complexo Hospitalar Veredas",
    content: "O Grupo AMP atende nossa infraestrutura de TI e a contabilidade estratégica da Aliança há mais de 10 anos. A confiabilidade e o tempo de resposta em situações críticas não encontram paralelo no mercado.",
    rating: 5,
    city: "São Paulo, SP"
  },
  {
    id: "t-2",
    name: "Helena Siqueira",
    role: "Diretora Financeira & Administrativa",
    company: "Nexus Distribuidora & Logística",
    content: "O BPO Financeiro e o suporte remoto MeshCentral transformaram nossa rotina. Cortamos custos operacionais e hoje temos relatórios precisos no quinto dia útil para apresentar aos acionistas.",
    rating: 5,
    city: "Campinas, SP"
  },
  {
    id: "t-3",
    name: "Guilherme Prado Fontes",
    role: "CEO & Fundador",
    company: "Prado & Associados Engenharia",
    content: "A segurança de saber que nossos projetos estão em servidores seguros com backup imutável e que nossos impostos estão 100% planejados e protegidos não tem preço. São mais de 40 anos de solidez comprovada.",
    rating: 5,
    city: "Ribeirão Preto, SP"
  }
];

export const diagnosticWizardQuestions = [
  {
    id: "q1",
    title: "Qual é o principal foco de otimização que sua empresa busca hoje?",
    subtitle: "Selecione o pilar estratégico mais urgente no momento.",
    options: [
      { id: "ti_infra", label: "TI, Infraestrutura & Cibersegurança", icon: "Server", desc: "Estabilidade de servidores, nuvem, backup e suporte rápido aos colaboradores." },
      { id: "fin_fiscal", label: "Consultoria Financeira & Gestão Tributária", icon: "Calculator", desc: "Redução de impostos, BPO financeiro, DRE gerencial e holding patrimonial." },
      { id: "both_360", label: "Diagnóstico 360° Completo (TI + Finanças)", icon: "Sparkles", desc: "Avaliação integrada de tecnologia, segurança de dados e eficiência fiscal/financeira." }
    ]
  },
  {
    id: "q2_ti",
    conditional: "ti_infra",
    title: "Quais são os principais desafios técnicos de TI enfrentados?",
    subtitle: "Pode selecionar as situações que mais impactam sua operação.",
    multiSelect: true,
    options: [
      { id: "lentidao_quedas", label: "Lentidão ou quedas recorrentes em sistemas/ERP", icon: "AlertTriangle" },
      { id: "backup_inseguro", label: "Incerteza sobre a eficácia do backup contra Ransomware", icon: "ShieldAlert" },
      { id: "suporte_demorado", label: "Suporte de TI atual é lento ou desorganizado", icon: "Clock" },
      { id: "custo_cloud", label: "Custos com nuvem (AWS/Azure) subindo descontroladamente", icon: "TrendingDown" },
      { id: "lgpd_seguranca", label: "Dúvidas quanto à conformidade de segurança e LGPD", icon: "Lock" }
    ]
  },
  {
    id: "q2_fin",
    conditional: "fin_fiscal",
    title: "Quais são as principais oportunidades financeiras que busca?",
    subtitle: "Selecione as metas prioritárias da sua gestão.",
    multiSelect: true,
    options: [
      { id: "reduzir_impostos", label: "Redução lícita da carga tributária (revisão de regime)", icon: "Percent" },
      { id: "terceirizar_financeiro", label: "Terceirizar contas a pagar/receber e conciliação (BPO)", icon: "Users" },
      { id: "dre_indicadores", label: "Ter relatórios executivos com DRE, margem e EBITDA", icon: "BarChart3" },
      { id: "holding_protecao", label: "Proteger patrimônio dos sócios e estruturar Holding", icon: "ShieldCheck" },
      { id: "creditos_tributarios", label: "Recuperar impostos pagos a maior nos últimos 5 anos", icon: "Coins" }
    ]
  },
  {
    id: "q3_scale",
    title: "Qual é o porte atual da sua organização?",
    subtitle: "Isso ajuda nossos especialistas a dimensionar a recomendação correta.",
    options: [
      { id: "scale_1", label: "10 a 30 Colaboradores / Faturamento até R$ 360k/mês", badge: "Pequeno/Médio Porte" },
      { id: "scale_2", label: "31 a 100 Colaboradores / Faturamento de R$ 360k a R$ 1.5M/mês", badge: "Médio Porte" },
      { id: "scale_3", label: "101 a 300 Colaboradores / Faturamento de R$ 1.5M a R$ 5M/mês", badge: "Médio/Grande Porte" },
      { id: "scale_4", label: "Mais de 300 Colaboradores / Faturamento acima de R$ 5M/mês", badge: "Corporativo Enterprise" }
    ]
  }
];
