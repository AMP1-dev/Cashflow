export const INSTITUTION_DATA = {
  name: "APAE — Associação de Pais e Amigos dos Excepcionais",
  shortName: "APAE",
  cnpj: "12.345.678/0001-90",
  foundationYear: 1974,
  yearsOfService: 52,
  address: "Av. da Solidariedade, 1250 - Bairro das Flores",
  city: "São Paulo - SP",
  zipCode: "04571-010",
  phone: "(11) 3456-7800",
  whatsapp: "(11) 98765-4321",
  email: "contato@apae-oficial.org.br",
  donationEmail: "doacoes@apae-oficial.org.br",
  openingHours: "Segunda a Sexta das 07:30 às 18:00",
  certifications: [
    { title: "CEBAS", subtitle: "Certificado de Entidade Beneficente de Assistência Social", tag: "Saúde & Educação" },
    { title: "CNAS", subtitle: "Conselho Nacional de Assistência Social", tag: "Inscrição Regular" },
    { title: "Utilidade Pública", subtitle: "Municipal, Estadual e Federal", tag: "Reconhecimento Oficial" },
    { title: "CMDCA", subtitle: "Conselho Municipal dos Direitos da Criança e do Adolescente", tag: "Aprovado" },
  ],
  stats: [
    { value: 1480, label: "Assistidos e Famílias", subtitle: "Atendimentos mensais contínuos", suffix: "+" },
    { value: 52, label: "Anos de História", subtitle: "Pioneirismo e dedicação", suffix: " anos" },
    { value: 45, label: "Especialistas Clínicos", subtitle: "Corpo técnico multidisciplinar", suffix: "" },
    { value: 28400, label: "Atendimentos Anuais", subtitle: "Sessões e aulas gratuitas", suffix: "+" },
    { value: 100, label: "Gratuidade Total", subtitle: "Acesso universal e humanizado", suffix: "%" },
  ],
  mission: "Promover e articular ações de defesa de direitos, prevenção, orientações, prestação de serviços e apoio à família, direcionadas à melhoria da qualidade de vida da pessoa com deficiência intelectual e múltipla e à construção de uma sociedade justa e solidária.",
  vision: "Ser reconhecida nacionalmente pela excelência, inovação técnica e pioneirismo na reabilitação, educação especial e inclusão social e profissional de pessoas com deficiência.",
  values: [
    { title: "Amor e Humanização", desc: "Acolhimento com empatia, escuta ativa e respeito singular a cada indivíduo e sua família." },
    { title: "Ética e Transparência", desc: "Gestão responsável, prestação de contas rigorosa e conformidade com todos os marcos legais." },
    { title: "Inovação Terapêutica", desc: "Técnicas baseadas em evidências científicas, tecnologia assistiva e modernização contínua." },
    { title: "Defesa dos Direitos PcD", desc: "Advocacy incansável pela dignidade, autonomia, acessibilidade e cidadania plena." },
  ],
  historyMilestones: [
    { year: 1974, title: "Fundação Pioneira", desc: "Um grupo de mães, pais e educadores visionários une forças para criar o primeiro núcleo de apoio a crianças especiais na região." },
    { year: 1985, title: "Credenciamento da Escola Especial", desc: "Reconhecimento oficial pelos órgãos de Educação, estruturando turmas de Estimulação Precoce e Alfabetização Adaptada." },
    { year: 1999, title: "Complexo de Reabilitação & Hidroterapia", desc: "Inauguração da clínica com piscina aquecida adaptada e setor de fisioterapia neuromotora com equipamentos importados." },
    { year: 2014, title: "Programa Jovem Aprendiz Inclusivo", desc: "Parceria com federações de indústrias e comércio para inserção formal de alunos PcD no mercado de trabalho." },
    { year: 2021, title: "Sala de Integração Sensorial Snoezelen", desc: "Entrega do mais moderno centro multissensorial para atendimento de indivíduos no Transtorno do Espectro Autista (TEA)." },
    { year: 2026, title: "Expansão e Era Digital Inclusiva", desc: "Lançamento da plataforma de transparência, teleconsultoria para famílias e ampliação de 30% na capacidade de atendimento." }
  ],
  board: [
    { name: "Drª. Maria Antônia Silveira", role: "Presidente da Diretoria Executiva", bio: "Advogada e mãe atípica com 25 anos de atuação pelos direitos humanos e terceiro setor." },
    { name: "Prof. Roberto Albuquerque", role: "Vice-Presidente", bio: "Educador e gestor público com mestrado em Educação Inclusiva." },
    { name: "Cláudia Rezende", role: "Diretora Financeira", bio: "Contadora e auditora especialista em gestão de ONGs e prestação de contas públicas." },
    { name: "Carlos Eduardo Prado", role: "Presidente do Conselho Fiscal", bio: "Economista e empresário engajado em ações de responsabilidade social corporativa." },
  ],
  staff: [
    {
      id: 1,
      name: "Drª. Helena Vasconcellos",
      role: "Neuropediatra Coordenadora Clínica",
      registry: "CRM/SP 142.890",
      category: "Medicina",
      experience: "16 anos de experiência",
      specialty: "Transtorno do Espectro Autista (TEA), Paralisia Cerebral e Síndromes Raras",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      quote: "Cada evolução, por menor que pareça ao mundo, é um salto gigante de autonomia para nossas crianças."
    },
    {
      id: 2,
      name: "Mariana Albuquerque",
      role: "Terapeuta Ocupacional Chefe",
      registry: "CREFITO-3 88.412-TO",
      category: "Terapia Ocupacional",
      experience: "12 anos de experiência",
      specialty: "Integração Sensorial de Ayres, Snoezelen e Tecnologia Assistiva",
      image: "https://images.unsplash.com/photo-1594824813533-5e729a6b9a89?auto=format&fit=crop&q=80&w=600",
      quote: "Trabalhar a independência nas atividades de vida diária é devolver o protagonismo para cada pessoa."
    },
    {
      id: 3,
      name: "Carlos Eduardo Ribeiro",
      role: "Fisioterapeuta Neurofuncional",
      registry: "CREFITO-3 71.930-F",
      category: "Fisioterapia",
      experience: "14 anos de experiência",
      specialty: "Conceito Bobath, Reabilitação Aquática (Hidroterapia) e Protocolo Pediasuit",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
      quote: "O movimento é a linguagem do corpo que liberta novas possibilidades de convivência."
    },
    {
      id: 4,
      name: "Beatriz Guimarães",
      role: "Fonoaudióloga Clínica",
      registry: "CRFa 2-22.105",
      category: "Fonoaudiologia",
      experience: "10 anos de experiência",
      specialty: "Comunicação Aumentativa e Alternativa (CAA), Apraxia de Fala e Deglutição/Disfagia",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      quote: "Dar voz a quem não fala verbalmente é abrir as portas do mundo para sua verdadeira essência."
    },
    {
      id: 5,
      name: "Rodrigo Mendes",
      role: "Psicólogo Comportamental",
      registry: "CRP 06/119.820",
      category: "Psicologia",
      experience: "9 anos de experiência",
      specialty: "Análise do Comportamento Aplicada (ABA), Regulação Emocional e Apoio Parental",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
      quote: "Cuidar da mente do assistido e oferecer suporte emocional à sua família é a chave da verdadeira inclusão."
    },
    {
      id: 6,
      name: "Patrícia Soares",
      role: "Coordenadora Pedagógica",
      registry: "Pedagoga Especialista em AEE",
      category: "Educação Especial",
      experience: "18 anos de experiência",
      specialty: "Currículo Funcional Adaptado, Alfabetização Lúdica e Formação Docente Inclusiva",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600",
      quote: "Todo indivíduo é capaz de aprender quando ensinamos no ritmo e na forma que ele se conecta."
    },
    {
      id: 7,
      name: "Camila Nogueira",
      role: "Assistente Social Coordenadora",
      registry: "CRESS 45.290/SP",
      category: "Serviço Social",
      experience: "11 anos de experiência",
      specialty: "Garantia de Direitos PcD, BPC/LOAS, Orientação Previdenciária e Redes de Proteção",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
      quote: "A assistência social não é caridade; é garantia constitucional de cidadania e dignidade."
    },
    {
      id: 8,
      name: "Lucas Fontes",
      role: "Educador Físico Adaptado",
      registry: "CREF 102.390-G/SP",
      category: "Educação Física",
      experience: "8 anos de experiência",
      specialty: "Bocha Paralímpica, Atletismo Adaptado, Psicomotricidade e Jogos Cooperativos",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
      quote: "No esporte adaptado não existem limites, apenas novas metas a serem superadas juntos."
    }
  ],
  facilities: [
    {
      title: "Centro de Reabilitação & Estimulação Precoce",
      desc: "Salas individuais de fisioterapia, fonoaudiologia, psicologia e consultórios médicos adaptados.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=700",
      tag: "Clínica Integrada"
    },
    {
      title: "Sala Snoezelen (Ambiente Multissensorial)",
      desc: "Espaço com colunas de água iluminadas, fibras ópticas, aromas e estímulos sonoros para regulação sensorial.",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=700",
      tag: "Tecnologia Terapêutica"
    },
    {
      title: "Complexo de Hidroterapia Aquecida",
      desc: "Piscina terapêutica adaptada com rampa de acesso, guincho hidráulico e temperatura controlada a 34°C.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=700",
      tag: "Hidroterapia"
    },
    {
      title: "Escola Especial Novo Horizonte",
      desc: "Salas de aula com lousas digitais, mobiliário ergonômico acessível e recursos pedagógicos adaptados.",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=700",
      tag: "Educação AEE"
    },
    {
      title: "Oficinas de Panificação & Culinária Adaptada",
      desc: "Cozinha experimental com bancadas rebaixadas para desenvolvimento de habilidades funcionais e profissionais.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=700",
      tag: "Capacitação Profissional"
    },
    {
      title: "Horta Sensorial & Jardim Terapêutico",
      desc: "Canteiros elevados para cadeirantes com ervas aromáticas, flores e contato direto com a natureza.",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=700",
      tag: "Sustentabilidade & Terapia"
    }
  ]
};

export const PROJECTS_DATA = [
  {
    id: "estimulacao-precoce",
    category: "Saúde & Reabilitação",
    area: "saude",
    title: "Passos da Vida — Estimulação Precoce (0 a 3 anos)",
    summary: "Intervenção intensiva e neurodesenvolvimento para bebês e crianças com diagnóstico precoce de deficiências, síndromes genéticas ou atrasos no desenvolvimento.",
    fullDescription: "O Projeto Passos da Vida foca na chamada 'janela de plasticidade cerebral', atendendo bebês e crianças de até 3 anos com equipe integrada de fisioterapia neurofuncional, fonoaudiologia, terapia ocupacional e apoio à amamentação. Nosso objetivo é potencializar as conexões neurais desde os primeiros meses de vida, prevenindo deformidades e estimulando habilidades motoras e cognitivas essenciais.",
    beneficiaries: "140 bebês e familiares atendidos semanalmente",
    budgetYear: "R$ 210.000 / ano",
    fundedPercent: 82,
    targetMonthlyPerChild: 120,
    impactMetric: "94% dos bebês apresentam ganho motor significativo nos primeiros 6 meses",
    features: [
      "Protocolo de triagem precoce e avaliação multidisciplinar",
      "Estimulação sensorial e proprioceptiva em sala Snoezelen",
      "Treinamento e empoderamento da família para estímulos domiciliares",
      "Fornecimento de adaptações posturais e órteses iniciais"
    ],
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800",
    badge: "Prioridade Clínica"
  },
  {
    id: "educacao-especial-aee",
    category: "Educação Especial",
    area: "educacao",
    title: "Educar para Incluir — Alfabetização e AEE",
    summary: "Currículo adaptado, atendimento educacional especializado, letramento digital e recursos de tecnologia assistiva para alunos com deficiência intelectual e múltipla.",
    fullDescription: "Nossa Escola Especial oferece turmas de Educação Infantil, Ensino Fundamental adaptado e Atendimento Educacional Especializado (AEE). Cada aluno possui um Plano de Desenvolvimento Individualizado (PDI), com foco não apenas no conteúdo escolar, mas no desenvolvimento de autonomia pessoal, comunicação e raciocínio lógico prático.",
    beneficiaries: "260 alunos matriculados gratuitamente",
    budgetYear: "R$ 380.000 / ano",
    fundedPercent: 75,
    targetMonthlyPerChild: 150,
    impactMetric: "88% dos alunos atingem nível pleno de autonomia para higiene e alimentação",
    features: [
      "Uso de softwares de comunicação alternativa e robótica pedagógica",
      "Material didático em alto relevo, contrastes e símbolos pictográficos",
      "Atividades de artes plásticas, teatro e musicalização inclusiva",
      "Acompanhamento conjunto com a rede regular de ensino em regime de contra-turno"
    ],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    badge: "Aprovado MEC"
  },
  {
    id: "comunicacao-alternativa",
    category: "Saúde & Tecnologia",
    area: "saude",
    title: "Vozes da Autonomia — Comunicação Aumentativa (CAA)",
    summary: "Implementação de tablets assistivos, pranchas pictográficas e treino vocal para assistidos não-verbais poderem se expressar com liberdade.",
    fullDescription: "A comunicação é um direito humano fundamental. O projeto 'Vozes da Autonomia' adquire licenças de softwares avançados de CAA, tablets adaptados e confecciona pranchas personalizadas para que alunos que não utilizam a fala oral possam expressar seus desejos, sentimentos, dores e escolhas cotidianas em casa, na escola e na sociedade.",
    beneficiaries: "95 crianças e jovens não-verbais",
    budgetYear: "R$ 145.000 / ano",
    fundedPercent: 90,
    targetMonthlyPerChild: 80,
    impactMetric: "Redução de 70% nas crises de frustração e ansiedade com o uso da CAA",
    features: [
      "Avaliação de rastreamento ocular e acionadores mecânicos",
      "Capacitação de pais e professores no uso diário dos dispositivos",
      "Personalização dos símbolos conforme o contexto cultural da família",
      "Doação de tablets adaptados com proteção anti-queda para uso contínuo"
    ],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800",
    badge: "Inovação Tecnológica"
  },
  {
    id: "jovem-aprendiz-pcd",
    category: "Assistência Social & Emprego",
    area: "assistencia",
    title: "Jovem Protagonista — Inclusão no Trabalho e Oficinas",
    summary: "Formação pré-profissional, oficinas de panificação, artesanato e mediação de vagas em empresas parceiras através da Lei de Cotas (Lei 8.213).",
    fullDescription: "Preparamos jovens e adultos com deficiência para ingressarem com segurança no mercado de trabalho formal. Realizamos simulações de entrevistas, oficinas práticas de rotinas administrativas, panificação artesanal e jardinagem, além de sensibilizar e treinar equipes de RH das empresas contratantes com o método de Emprego Apoiado.",
    beneficiaries: "120 jovens em capacitação contínua",
    budgetYear: "R$ 190.000 / ano",
    fundedPercent: 68,
    targetMonthlyPerChild: 100,
    impactMetric: "46 jovens contratados com carteira assinada no último ano letivo",
    features: [
      "Acompanhamento com tutor/mentor (Job Coach) nas primeiras semanas de trabalho",
      "Certificado de conclusão de curso reconhecido pelo SENAI/SENAC parceiros",
      "Educação financeira prática e autonomia com transporte público",
      "Apoio jurídico e psicológico para a família no processo de emancipação"
    ],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    badge: "Impacto ESG"
  },
  {
    id: "hidroterapia-neurofuncional",
    category: "Saúde & Reabilitação",
    area: "saude",
    title: "Águas da Cura — Hidroterapia e Reabilitação Motora",
    summary: "Sessões terapêuticas em piscina aquecida a 34°C para redução de espasticidade muscular, melhora do equilíbrio e alívio de dores crônicas.",
    fullDescription: "A água aquecida proporciona relaxamento muscular imediato e diminuição da gravidade aparente, permitindo que crianças com paralisia cerebral grave e distrofias musculares executem movimentos impossíveis no solo seco. É um dos tratamentos mais aguardados e amados pelos nossos assistidos.",
    beneficiaries: "180 assistidos em atendimento semanal",
    budgetYear: "R$ 160.000 / ano",
    fundedPercent: 88,
    targetMonthlyPerChild: 90,
    impactMetric: "85% de redução no uso de analgésicos e relaxantes musculares pesados",
    features: [
      "Piscina com tratamento de ozônio (antialérgico para peles sensíveis)",
      "Guincho automatizado para transferência segura de cadeirantes",
      "Fisioterapeutas pós-graduados nos métodos Halliwick e Bad Ragaz",
      "Vestiários totalmente climatizados e com bancadas de apoio"
    ],
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800",
    badge: "Bem-estar & Saúde"
  },
  {
    id: "familia-acolhida",
    category: "Assistência Social & Cuidadores",
    area: "assistencia",
    title: "Cuidando de Quem Cuida — Apoio Integral às Famílias",
    summary: "Acolhimento psicológico, rodas de conversa com mães atípicas, orientação jurídica sobre direitos e oficinas de geração de renda familiar.",
    fullDescription: "Sabemos que a sobrecarga sobre as mães e cuidadoras atípicas é imensa. Este projeto oferece suporte psicoterápico em grupo, consultoria para obtenção do BPC/LOAS, passe livre interestadual e oficinas de artesanato para que essas mães possam produzir em casa e gerar renda complementar.",
    beneficiaries: "320 mães e cuidadores diretos",
    budgetYear: "R$ 115.000 / ano",
    fundedPercent: 92,
    targetMonthlyPerChild: 50,
    impactMetric: "Redução de 65% nos sintomas relatados de depressão e esgotamento materno",
    features: [
      "Plantão psicológico e rodas de escuta terapêutica",
      "Assistência jurídica gratuita para defesa de direitos PcD",
      "Cestas de alimentos e kits de higiene para famílias em vulnerabilidade extrema",
      "Feira das Mães Empreendedoras da APAE no pátio da instituição"
    ],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    badge: "Acolhimento Humano"
  }
];

export const NEWS_DATA = [
  {
    id: 1,
    title: "APAE inaugura novo Espaço de Integração Sensorial de Alta Tecnologia para Crianças com TEA",
    category: "Saúde & Inovação",
    date: "28 de Agosto de 2026",
    readTime: "4 min de leitura",
    summary: "Com recursos obtidos via doações da comunidade e destinação de imposto de renda, novo ambiente Snoezelen amplia atendimento em 40%.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=900",
    author: "Assessoria de Comunicação APAE",
    featured: true,
    content: `A APAE entregou oficialmente à comunidade seu novo Espaço de Integração Sensorial Snoezelen, equipado com o que há de mais moderno na neurociência aplicada ao desenvolvimento infantil.

O espaço conta com colunas de bolhas iluminadas por LED com controle de vibração, projetores de cenas relaxantes, piscina de bolas transparentes com iluminação interna e fibras ópticas interativas. Esse ambiente seguro e controlado é fundamental para crianças no Transtorno do Espectro Autista (TEA) e com distúrbios do processamento sensorial.

"Este espaço representa um marco para nossa instituição. Aqui, crianças que antes entravam em sobrecarga sensorial encontram calma, organização neural e abrem portas para a aprendizagem", destacou a Drª. Helena Vasconcellos, neuropediatra coordenadora.

A obra foi viabilizada graças a 340 doadores individuais e à parceria com empresas solidárias através do Fundo Municipal da Criança e do Adolescente.`
  },
  {
    id: 2,
    title: "Festival 'Arte Sem Barreiras' reúne mais de 500 pessoas em noite memorável no Teatro Municipal",
    category: "Cultura & Inclusão",
    date: "20 de Agosto de 2026",
    readTime: "3 min de leitura",
    summary: "Assistidos da APAE emocionaram a plateia com apresentações de dança inclusiva, teatro de fantoches e coral em Libras.",
    image: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=900",
    author: "Coordenação de Artes e Expressão",
    featured: false,
    content: `Em uma noite marcada por aplausos de pé e muita emoção, o Teatro Municipal foi palco do 18º Festival 'Arte Sem Barreiras' da APAE. Mais de 80 alunos assistidos subiram ao palco para apresentar coreografias de dança contemporânea adaptada, teatro e peças musicais.

O espetáculo teve como tema "Onde o Amor Faz Morada", retratando as histórias de superação e as conexões construídas entre terapeutas, alunos e famílias. A renda dos ingressos solidários foi 100% revertida para a compra de instrumentos musicais terapêuticos.

Agradecemos imensamente a todos os voluntários, técnicos de iluminação e ao público presente que lotou a casa.`
  },
  {
    id: 3,
    title: "Parceria com Indústrias Locais viabiliza a contratação formal de 18 jovens assistidos pela APAE",
    category: "Empregabilidade",
    date: "12 de Agosto de 2026",
    readTime: "5 min de leitura",
    summary: "Através do programa Jovem Aprendiz e da metodologia do Emprego Apoiado, alunos conquistam o primeiro emprego com carteira assinada.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900",
    author: "Setor de Serviço Social e Inclusão",
    featured: true,
    content: `Mais 18 jovens assistidos pela APAE deram um passo histórico em suas vidas ao assinarem seus contratos de trabalho formal em empresas dos setores de logística, varejo e tecnologia da nossa cidade.

O processo de inclusão segue o rigoroso protocolo de Emprego Apoiado, onde psicólogos e assistentes sociais da APAE mapeiam as habilidades do jovem, analisam os postos de trabalho e acompanham presencialmente a adaptação nas primeiras semanas.

"Ter minha própria renda e ajudar minha mãe com as compras do mês era meu maior sonho. Hoje me sinto respeitado e realizado", declarou Lucas Gabriel, 21 anos, recém-contratado como auxiliar de estoque.`
  },
  {
    id: 4,
    title: "Prestação de Contas do 1º Semestre 2026 é publicada com aprovação unânime do Conselho Fiscal",
    category: "Transparência & Gestão",
    date: "01 de Agosto de 2026",
    readTime: "3 min de leitura",
    summary: "Relatório detalha arrecadação de doações, convênios públicos e aplicação de 94% dos recursos diretamente nos setores de atendimento.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=900",
    author: "Diretoria Financeira e Conselho",
    featured: false,
    content: `Em estrito cumprimento aos princípios de transparência pública e à Lei 13.019 (Marco Regulatório do Terceiro Setor), a APAE disponibilizou na íntegra o balanço financeiro e o relatório de impacto do 1º semestre de 2026.

Os dados mostram que foram realizados 14.210 atendimentos de saúde e 130 alunos receberam merenda escolar adaptada diariamente. A auditoria independente emitiu parecer limpo e sem ressalvas sobre os demonstrativos contábeis.

Todos os cidadãos podem baixar os relatórios em formato PDF e planilha aberta na seção 'Transparência' do nosso portal.`
  }
];

export const EVENTS_DATA = [
  {
    id: 1,
    title: "Semana Nacional da Pessoa com Deficiência Intelectual e Múltipla 2026",
    date: "21 a 28 de Setembro de 2026",
    targetDate: "2026-09-21T08:00:00",
    location: "Sede da APAE & Centro de Convenções Municipal",
    schedule: "08:00 às 17:30",
    category: "Oficial & Conscientização",
    summary: "Ciclo de palestras abertas, oficinas práticas com neurocientistas, exposições artísticas e caminhada inclusiva pela cidade.",
    badge: "Evento Principal",
    freeEntry: true
  },
  {
    id: 2,
    title: "5ª Corrida & Caminhada Solidária 'Apaixonados pela Inclusão'",
    date: "18 de Outubro de 2026",
    targetDate: "2026-10-18T07:00:00",
    location: "Parque da Cidade - Portão Principal",
    schedule: "07:00 (Concentração e Aquecimento Guiado)",
    category: "Esporte & Solidariedade",
    summary: "Percursos de 5km (corrida), 3km (caminhada) e 1km (caminhada adaptada para cadeirantes e assistidos com seus familiares).",
    badge: "Inscrições Abertas",
    freeEntry: false,
    price: "R$ 45 (Kit com Camiseta + Medalha Solidária)"
  },
  {
    id: 3,
    title: "43ª Noite da Pizza Beneficente da APAE",
    date: "14 de Novembro de 2026",
    targetDate: "2026-11-14T19:30:00",
    location: "Salão Paroquial São José & Drive-Thru APAE",
    schedule: "19:30 às 22:30",
    category: "Gastronomia Solidária",
    summary: "Tradicional rodízio de pizzas artesanais e entrega de vouchers drive-thru para retirada. Música ao vivo com a banda inclusiva da APAE.",
    badge: "Vagas Limitadas",
    freeEntry: false,
    price: "R$ 50 (Pizza Grande Família com cupom)"
  },
  {
    id: 4,
    title: "Bazar Beneficente Especial de Fim de Ano",
    date: "05 de Dezembro de 2026",
    targetDate: "2026-12-05T09:00:00",
    location: "Pátio Central da APAE",
    schedule: "09:00 às 16:00",
    category: "Bazar & Sustentabilidade",
    summary: "Roupas, calçados, livros e peças de artesanato confeccionadas pelos assistidos com preços simbólicos a partir de R$ 5.",
    badge: "Entrada Franca",
    freeEntry: true
  }
];

export const TRANSPARENCY_DATA = {
  lastAuditDate: "30 de Junho de 2026",
  auditorCompany: "BDO Brasil Auditores Independentes",
  auditOpinion: "Parecer Limpo e Sem Ressalvas",
  revenueDistribution: [
    { name: "Convênios Públicos (SUS/MEC/SUAS)", value: 42, color: "#004B87" },
    { name: "Doações de Pessoas Físicas (PIX/Boleto)", value: 26, color: "#0B63E5" },
    { name: "Doações Corporativas & Leis de Incentivo", value: 18, color: "#F5A623" },
    { name: "Eventos Beneficentes & Bazar Solidário", value: 10, color: "#00875A" },
    { name: "Outras Rendas Próprias", value: 4, color: "#64748B" }
  ],
  expenseDistribution: [
    { name: "Atendimento Clínico & Saúde Especializada", value: 48, color: "#004B87" },
    { name: "Educação Especial & Oficinas Pedagógicas", value: 32, color: "#00875A" },
    { name: "Assistência Social & Apoio às Famílias", value: 14, color: "#F5A623" },
    { name: "Administração & Manutenção Institucional", value: 6, color: "#64748B" }
  ],
  documents: [
    {
      year: 2026,
      category: "Balanço & DRE",
      title: "Demonstrativo Contábil e DRE do 1º Semestre de 2026",
      date: "15/07/2026",
      size: "2.4 MB",
      format: "PDF",
      status: "Auditado",
      code: "BAL-2026-S1"
    },
    {
      year: 2025,
      category: "Relatório de Atividades",
      title: "Relatório Anual de Gestão e Impacto Social 2025",
      date: "28/02/2026",
      size: "8.1 MB",
      format: "PDF",
      status: "Publicado",
      code: "REL-2025-ANUAL"
    },
    {
      year: 2025,
      category: "Balanço & DRE",
      title: "Balanço Patrimonial e Parecer de Auditoria Externa 2025",
      date: "20/03/2026",
      size: "3.2 MB",
      format: "PDF",
      status: "Aprovado",
      code: "BAL-2025-AUDIT"
    },
    {
      year: 2026,
      category: "Certidões",
      title: "Certidão Negativa de Débitos Federais e Previdenciários (CND)",
      date: "05/08/2026",
      size: "450 KB",
      format: "PDF",
      status: "Vigente",
      code: "CND-FED-2026"
    },
    {
      year: 2026,
      category: "Certidões",
      title: "Certificado de Regularidade do FGTS (CRF)",
      date: "10/08/2026",
      size: "380 KB",
      format: "PDF",
      status: "Vigente",
      code: "CRF-FGTS-2026"
    },
    {
      year: 2026,
      category: "Termos de Fomento",
      title: "Termo de Colaboração SMS Nº 014/2026 — Atendimento Especializado SUS",
      date: "10/01/2026",
      size: "4.8 MB",
      format: "PDF",
      status: "Em Execução",
      code: "TC-SMS-014-26"
    },
    {
      year: 2026,
      category: "Estatuto & Atas",
      title: "Estatuto Social Consolidado da APAE Registrado em Cartório",
      date: "12/04/2024",
      size: "1.9 MB",
      format: "PDF",
      status: "Permanente",
      code: "ESTATUTO-REG-APAE"
    },
    {
      year: 2024,
      category: "Estatuto & Atas",
      title: "Ata de Eleição e Posse da Diretoria Executiva (Gestão 2024-2027)",
      date: "15/12/2023",
      size: "1.2 MB",
      format: "PDF",
      status: "Vigente",
      code: "ATA-ELEICAO-24-27"
    }
  ]
};

export const DONATION_AMOUNTS = [
  {
    value: 30,
    label: "R$ 30",
    impact: "Fornece 1 Kit de Estimulação Visual e Material Sensorial",
    color: "from-blue-500 to-apae-blue-600"
  },
  {
    value: 60,
    label: "R$ 60",
    impact: "Garante 1 Sessão Completa de Fonoaudiologia Especializada",
    color: "from-emerald-500 to-apae-green-600",
    popular: true
  },
  {
    value: 120,
    label: "R$ 120",
    impact: "Garante 1 Mês de Hidroterapia com Piscina Aquecida Adaptada",
    color: "from-amber-500 to-apae-yellow-600"
  },
  {
    value: 250,
    label: "R$ 250",
    impact: "Apadrinha a Reabilitação Integral de 1 Criança por Mês",
    color: "from-indigo-600 to-blue-700"
  },
  {
    value: 500,
    label: "R$ 500",
    impact: "Financia Insumos e Equipamentos para Oficinas de Trabalho PcD",
    color: "from-purple-600 to-indigo-700"
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Juliana Meirelles",
    role: "Mãe do Theo, 4 anos (Assistido da Estimulação Precoce)",
    text: "Quando recebemos o diagnóstico de Síndrome de Down, o medo do futuro paralisou nossa família. A APAE abriu os braços com um amor que nunca tínhamos visto. Hoje o Theo anda, fala, sorri e evolui a cada dia graças aos terapeutas.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Gabriel Santos",
    role: "Assistido e Aluno da Oficina Profissionalizante (22 anos)",
    text: "Na APAE eu aprendi informática e panificação. Hoje eu trabalho no mercado do meu bairro e ganho meu salário. Tenho orgulho de ser independente e mostrar que nós somos capazes!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "Renata Fagundes",
    role: "Voluntária há 6 anos nas Oficinas de Arte",
    text: "Ser voluntária na APAE me ensinou o real significado da empatia. O amor que recebemos de volta a cada abraço e sorriso é impagável. É o dia mais feliz da minha semana.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    name: "Dr. Marcelo Castilho",
    role: "Diretor de ESG do Banco Regional (Empresa Parceira)",
    text: "A seriedade e a transparência com que a APAE conduz cada projeto nos dá total segurança para investir continuamente via leis de incentivo e doações corporativas.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
  }
];

export const PARTNER_COMPANIES = [
  { name: "Banco Cooperativo Sicredi", category: "Patrocinador Master", seal: "Selo Ouro", logo: "🏦" },
  { name: "Supermercados Estrela", category: "Programa Troco Solidário", seal: "Selo Ouro", logo: "🛒" },
  { name: "TechInclusão Software", category: "Doação de Tecnologia", seal: "Selo Prata", logo: "💻" },
  { name: "Indústria Metalúrgica União", category: "Contratação PcD (Lei 8.213)", seal: "Selo Ouro", logo: "⚙️" },
  { name: "Farmácias Vida & Saúde", category: "Campanha de Medicamentos", seal: "Selo Prata", logo: "💊" },
  { name: "Construtora Horizonte Verde", category: "Obras e Acessibilidade", seal: "Selo Bronze", logo: "🏗️" }
];

export const VOLUNTEER_AREAS = [
  { id: "recreacao", label: "Recreação e Atividades Lúdicas", desc: "Apoio em jogos, festas comemorativas e contação de histórias" },
  { id: "artes", label: "Oficinas de Artes e Artesanato", desc: "Auxílio em pintura, modelagem e confecção de peças" },
  { id: "eventos", label: "Apoio em Eventos e Bazares", desc: "Organização, recepção, montagem de kits e vendas beneficentes" },
  { id: "administrativo", label: "Suporte Administrativo e TI", desc: "Organização de arquivos, digitação, manutenção de computadores" },
  { id: "saude", label: "Profissionais de Saúde e Terapia", desc: "Atuação voluntária para fisioterapeutas, fonoaudiólogos, psicólogos e dentistas" },
  { id: "musica", label: "Música, Dança e Esportes", desc: "Aulas de ritmo, instrumentos musicais e esportes adaptados" }
];
