export const initialSiteConfig = {
  name: "Aliança Empresarial",
  tagline: "Contabilidade Estratégica, Inteligência Tributária e BPO Financeiro",
  slogan: "A parceria contábil sólida que protege seu patrimônio e impulsiona o crescimento do seu negócio.",
  theme: "ruby-dark", // 'ruby-dark' (default) | 'graphite-red' | 'navy-corporate' | 'emerald-gold'
  logoUrl: "",
  faviconUrl: "",
  heroTitle: "Contabilidade Estratégica & Inteligência Tributária para Impulsionar o seu Negócio",
  heroSubtitle: "Assessoria contábil 360°, planejamento tributário sob medida e BPO financeiro para empresas que buscam segurança jurídica, redução legal de impostos e alta performance.",
  shortDescription: "Mais de 20 anos de tradição e tecnologia oferecendo soluções contábeis completas para empresas em todo o Brasil.",
  aboutTitle: "Solidez, Inovação e Parceria que Geram Resultados Reais",
  aboutDescription: "A Aliança Empresarial nasceu com o propósito de transformar a contabilidade tradicional em uma ferramenta estratégica de gestão e tomada de decisão. Com mais de duas décadas de atuação no mercado corporativo, combinamos tecnologia de ponta, processos ágeis e atendimento consultivo humanizado para garantir total conformidade fiscal, proteção patrimonial e máxima economia tributária para a sua empresa.",
  stats: {
    yearsActive: "20+ Anos",
    clientsServed: "500+",
    taxSavings: "R$ 15M+",
    complianceRate: "100%"
  },
  contact: {
    phone: "(11) 3250-8800",
    phoneSecondary: "(11) 3250-8801",
    whatsapp: "5511998887766",
    whatsappFormatted: "(11) 99888-7766",
    email: "contato@aliancaempresarial.net.br",
    commercialEmail: "comercial@aliancaempresarial.net.br",
    address: "Av. Paulista, 1842 - 14º Andar - Bela Vista, São Paulo - SP",
    crc: "CRC-SP 2SP024890/O-5",
    cnpj: "04.567.890/0001-12",
    serviceHours: "Segunda a Sexta, das 08h30 às 18h00"
  },
  clientPortal: {
    title: "Área do Cliente & Sistemas",
    subtitle: "Acesse suas guias de impostos, certidões, holerites e relatórios em tempo real.",
    questorUrl: "https://questor.aliancaempresarial.net.br",
    dominioUrl: "https://dominio.aliancaempresarial.net.br",
    contaAzulUrl: "https://app.contaazul.com",
    ombudsmanEmail: "ouvidoria@aliancaempresarial.net.br"
  },
  social: {
    instagram: "https://instagram.com/aliancaempresarialcontabil",
    linkedin: "https://linkedin.com/company/aliancaempresarial",
    facebook: "https://facebook.com/aliancaempresarialcontabilidade",
    youtube: "https://youtube.com/@aliancaempresarial"
  }
};

export const initialServices = [
  {
    id: "srv-1",
    title: "Abertura, Alteração & Societário",
    category: "Legalização",
    shortDesc: "Abra sua empresa com agilidade, no melhor enquadramento tributário e com contrato social blindado.",
    fullDesc: "Cuidamos de todo o processo de constituição, alteração contratual, regularização de alvarás, licenças e encerramento de empresas junto à Receita Federal, JUCESP e órgãos reguladores. Analisamos a melhor estrutura societária para proteger o patrimônio dos sócios.",
    icon: "Building2",
    highlights: ["Abertura ágil em dias", "Análise societária preventiva", "Licenciamento e alvarás inclusos", "Emissão de certificado digital"]
  },
  {
    id: "srv-2",
    title: "Gestão Fiscal & Planejamento Tributário",
    category: "Tributário",
    shortDesc: "Redução legal de impostos através do estudo aprofundado do Simples Nacional, Lucro Presumido e Lucro Real.",
    fullDesc: "Nossos especialistas tributários realizam diagnósticos minuciosos para identificar a melhor opção de regime de tributação para seu modelo de negócio, evitando bitributações, aproveitando incentivos fiscais e gerando economia real de caixa.",
    icon: "Calculator",
    highlights: ["Enquadramento tributário ideal", "Apuração rigorosa de tributos", "Revisão e compliance fiscal", "Elisão fiscal 100% legal"]
  },
  {
    id: "srv-3",
    title: "BPO Financeiro & Gestão de Fluxo de Caixa",
    category: "Financeiro",
    shortDesc: "Terceirize o contas a pagar, receber, conciliação bancária e faturamento com relatórios diários.",
    fullDesc: "Ganhe tempo para focar nas vendas e no crescimento do seu negócio. Nossa equipe assume a rotina operacional financeira com tecnologia em nuvem, controle rigoroso de inadimplência e conciliação bancária automatizada.",
    icon: "TrendingUp",
    highlights: ["Controle de contas a pagar e receber", "Emissão de NF-e e boletos", "Conciliação bancária diária", "DRE gerencial mensal"]
  },
  {
    id: "srv-4",
    title: "Folha de Pagamento & RH Trabalhista",
    category: "Trabalhista",
    shortDesc: "Processamento seguro de folha, eSocial, admissões, rescisões e assessoria preventiva contra passivos.",
    fullDesc: "Gestão integral das rotinas de Departamento Pessoal: admissão, férias, rescisão, FGTS, cálculo de pró-labore dos sócios e envio tempestivo de todos os eventos do eSocial, com consultoria trabalhista especializada para sua equipe.",
    icon: "Users",
    highlights: ["100% conformidade no eSocial", "Cálculo preciso de pró-labore e folha", "Gestão de benefícios e férias", "Prevenção de riscos trabalhistas"]
  },
  {
    id: "srv-5",
    title: "Contabilidade Consultiva & DRE Estratégica",
    category: "Gestão",
    shortDesc: "Balanços, balancetes e indicadores financeiros interpretados para orientar as decisões dos diretores.",
    fullDesc: "Transformamos dados contábeis em inteligência de negócios. Apresentamos relatórios claros com margem de lucro, ponto de equilíbrio, liquidez e EBITDA para você tomar decisões estratégicas com embasamento sólido.",
    icon: "PieChart",
    highlights: ["Demonstrações contábeis completas", "Indicadores de rentabilidade", "Reuniões periódicas de alinhamento", "Auditoria interna preventiva"]
  },
  {
    id: "srv-6",
    title: "Recuperação de Créditos & Holding Familiar",
    category: "Especialidades",
    shortDesc: "Auditoria de tributos pagos a maior nos últimos 5 anos e estruturação de holdings para proteção patrimonial.",
    fullDesc: "Serviço especializado de levantamento e compensação administrativa de créditos tributários acumulados (PIS/COFINS, ICMS, etc.) e constituição de Holdings Familiares e Patrimoniais para planejamento sucessório com economia de ITCMD e IR.",
    icon: "ShieldAlert",
    highlights: ["Levantamento dos últimos 60 meses", "Compensação rápida e homologada", "Planejamento sucessório seguro", "Blindagem patrimonial lícita"]
  }
];

export const initialPosts = [
  {
    id: "post-1",
    title: "Planejamento Tributário 2026: Estratégias Legais para Reduzir Carga Fiscal",
    slug: "planejamento-tributario-2026-estrategias",
    category: "Tributário",
    date: "2026-08-20",
    author: "Diretoria Tributária Aliança",
    summary: "Como a escolha estratégica entre Lucro Real, Presumido e Simples Nacional pode economizar até 30% no caixa da sua empresa.",
    content: "O planejamento tributário preventivo é o principal diferencial competitivo das empresas bem-sucedidas no Brasil.\n\nCom a complexidade da legislação tributária nacional, manter a empresa no mesmo regime tributário ano após ano sem uma revisão técnica detalhada é um dos maiores causadores de perda silenciosa de rentabilidade.\n\nNossa equipe analisa minuciosamente a margem de lucro real da operação, despesas com folha de pagamento, créditos de insumos e faturamento projetado para indicar a opção mais vantajosa e 100% segura perante o Fisco.",
    coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true
  },
  {
    id: "post-2",
    title: "BPO Financeiro: Por que Terceirizar a Gestão de Caixa Alavanca o Crescimento",
    slug: "bpo-financeiro-terceirizacao-gestao-caixa",
    category: "Gestão & BPO",
    date: "2026-08-15",
    author: "Equipe de Gestão Financeira",
    summary: "Descubra como empresas de serviços e comércio estão reduzindo custos fixos e ganhando precisão financeira com o BPO.",
    content: "Muitos empresários gastam horas preciosas da semana realizando rotinas operacionais de agendamento de pagamentos, conciliação de extratos e emissão de notas fiscais.\n\nAo terceirizar o setor financeiro através do BPO (Business Process Outsourcing) da Aliança Empresarial, sua empresa conta com especialistas dedicados, softwares em nuvem e relatórios diários de previsibilidade de caixa, reduzindo custos trabalhistas de um departamento interno e eliminando falhas operacionais.",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    featured: true
  },
  {
    id: "post-3",
    title: "Reforma Tributária e Transição: O Que os Empresários Devem Preparar",
    slug: "reforma-tributaria-transicao-empresas",
    category: "Legislação & Fiscal",
    date: "2026-07-28",
    author: "Consultoria Jurídico-Tributária",
    summary: "Entenda os impactos do IVA dual, CBS e IBS nos contratos comerciais e formação de preços de serviços e mercadorias.",
    content: "O processo de transição da Reforma Tributária exige que as organizações comecem a revisar seus sistemas emissores, formação de preços de venda e contratos de fornecimento desde já.\n\nA Aliança Empresarial acompanha diariamente as regulamentações complementares para orientar nossos clientes com segurança e antecedência.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    featured: false
  },
  {
    id: "post-4",
    title: "Holding Familiar e Proteção Patrimonial: Blindagem e Sucessão Eficiente",
    slug: "holding-familiar-protecao-patrimonial",
    category: "Societário & Patrimônio",
    date: "2026-07-10",
    author: "Diretoria de Novos Negócios",
    summary: "Como organizar os bens da família em uma estrutura jurídica para economizar impostos de herança e evitar inventários litigiosos.",
    content: "A constituição de uma holding familiar patrimonial permite concentrar imóveis, quotas e investimentos sob uma sociedade controlada pela família, usufruindo de alíquotas de tributação significativamente menores na locação e alienação de bens, além de garantir a sucessão patrimonial pacífica e planejada.",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
    gallery: [],
    featured: false
  }
];

export const initialTestimonials = [
  {
    id: "t-1",
    name: "Dr. Roberto Guimarães",
    role: "Diretor Clínico",
    company: "Centro Médico Paulista",
    content: "A Aliança Empresarial reestruturou toda a parte societária e tributária da nossa rede de clínicas. Conseguimos uma redução de mais de 25% na carga tributária legal com total respaldo técnico.",
    rating: 5
  },
  {
    id: "t-2",
    name: "Mariana Costa e Silva",
    role: "CEO & Fundadora",
    company: "Nexus Tech Solutions",
    content: "O BPO Financeiro da Aliança nos deu tranquilidade total. Relatórios impecáveis, conciliação no prazo e reuniões mensais com consultores que realmente entendem do nosso mercado de tecnologia.",
    rating: 5
  },
  {
    id: "t-3",
    name: "Carlos Alberto Menezes",
    role: "Sócio Diretor",
    company: "Menezes & Filhos Logística",
    content: "São mais de 12 anos de parceria com a Aliança. Atendimento rápido pelo WhatsApp, segurança total no eSocial e suporte impecável nas fiscalizações. Recomendo de olhos fechados.",
    rating: 5
  }
];

export const initialSegments = [
  { id: "seg-1", title: "Saúde & Clínicas Médicas", desc: "Equiparação hospitalar, livro caixa e regimes tributários médicos.", icon: "Stethoscope" },
  { id: "seg-2", title: "Tecnologia & Startups", desc: "Fator R, retenções de PIS/COFINS, exportação de serviços e incentivos de inovação.", icon: "Cpu" },
  { id: "seg-3", title: "Comércio, Varejo & E-commerce", desc: "ICMS-ST, DIFAL, conciliação de marketplaces e gestão de estoques.", icon: "ShoppingBag" },
  { id: "seg-4", title: "Prestadores de Serviços", desc: "Consultorias, agências, engenharia e arquitetura com otimização no Simples ou Presumido.", icon: "Briefcase" },
  { id: "seg-5", title: "Construção Civil & Imobiliário", desc: "Patrimônio de afetação (RET), loteamentos e holdings imobiliárias.", icon: "Building" }
];
