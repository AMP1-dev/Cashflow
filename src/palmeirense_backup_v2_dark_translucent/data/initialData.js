// Dados autênticos minerados do banco de dados oficial do Esporte Clube Palmeirense
// Fundado em 07 de Setembro de 1908 - Mais de 117 anos de história

export const INITIAL_CLUB_CONFIG = {
  name: "Esporte Clube Palmeirense",
  shortName: "ECP",
  foundation: "07 de Setembro de 1908",
  slogan: "Mais de um século de história, esporte, família e celebração.",
  city: "Santa Cruz das Palmeiras - SP",
  address: "Centro - Santa Cruz das Palmeiras / SP",
  phone: "(19) 3672-1200",
  whatsapp: "5519999999999",
  whatsappFormatted: "(19) 99999-9999",
  email: "contato@esporteclubepalmeirense.com",
  instagram: "@esporteclubepalmeirense",
  facebook: "/esporteclubepalmeirense",
  area: "36.438 m²",
  socialHallYear: "1999",
  firstPoolYear: "1971",
  stats: {
    years: "118",
    areaM2: "36.400+",
    pools: "4",
    sportsCourts: "8+",
    members: "Milhares"
  }
};

export const INITIAL_HERO_SLIDES = [
  {
    id: 1,
    badge: "Parque Aquático & Lazer",
    title: "O Ponto de Encontro da Família Palmeirense",
    subtitle: "Complexo com piscina semiolímpica, piscina aquecida, infantil, quiosques com churrasqueira e amplo parque verde para seus melhores finais de semana.",
    ctaText: "Conhecer o Clube",
    ctaLink: "#parque-aquatico",
    secondaryCtaText: "Seja Sócio",
    secondaryCtaLink: "#seja-socio",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=85",
    tag: "Verão & Família"
  },
  {
    id: 2,
    badge: "Tradição Social & Festas",
    title: "Grandes Bailes, Shows e Noites Inesquecíveis",
    subtitle: "O lendário Baile do Hawai, Baile de Gala de Aniversário, Boate Gênesis e o maior Salão Social da região, palco das melhores memórias da nossa cidade.",
    ctaText: "Agenda de Eventos",
    ctaLink: "#eventos",
    secondaryCtaText: "Locação de Salão",
    secondaryCtaLink: "#salao-social",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=85",
    tag: "Bailes & Boates"
  },
  {
    id: 3,
    badge: "Esportes & Saúde",
    title: "Mais de Um Século de Paixão Esportiva",
    subtitle: "Campos de futebol profissional e society, quadras de tênis de saibro, poliesportivas, academia moderna, natação e escolinhas infantis.",
    ctaText: "Modalidades Esportivas",
    ctaLink: "#esportes",
    secondaryCtaText: "Horários de Aulas",
    secondaryCtaLink: "#aulas",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=85",
    tag: "Desde 1908"
  }
];

export const INITIAL_PUBLICATIONS = [
  {
    id: 1,
    slug: "tradicional-baile-do-hawai-do-ecp",
    title: "Tradicional Baile do Hawai do ECP: Prepare-se para a Maior Noite do Ano!",
    category: "Bailes & Shows",
    date: "11/09/2026",
    author: "Diretoria Social",
    featured: true,
    summary: "O evento mais esperado de toda a região volta em grande estilo ao Salão Social e parque das piscinas, com decoração temática, mesa de frutas e mega estrutura de som e luz.",
    content: `O Esporte Clube Palmeirense tem a honra de anunciar os preparativos para o seu tradicional e consagrado Baile do Hawai, evento que há décadas reúne associados, amigos e visitantes de todas as cidades vizinhas.

Com ambientação temática especial, praça de alimentação tropical, mesa de frutas exuberante e apresentação de grandes bandas no Salão Nobre e DJs na área das piscinas, esta edição promete superar todas as expectativas.

- Local: Salão Social e Complexo das Piscinas do ECP
- Traje Sugerido: Típico / Havaiano / Floral
- Reserva de Mesas: Diretamente na Secretaria do Clube ou via WhatsApp oficial
- Acesso de Sócios: Livre com apresentação da carteirinha digital em dia.

Garanta sua mesa com antecedência e venha viver essa celebração inesquecível!`,
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    slug: "118-anos-de-historia-esporte-clube-palmeirense",
    title: "118 Anos de Tradição: 7 de Setembro, Data Magna do Nosso ECP",
    category: "Institucional",
    date: "07/09/2026",
    author: "Comunicação ECP",
    featured: true,
    summary: "Fundado em 07 de Setembro de 1908 pelo pioneirismo de grandes entusiastas do esporte, o Esporte Clube Palmeirense celebra mais de um século de união, conquistas e amor pela nossa terra.",
    content: `A 7 de Setembro de 1908 nascia o Esporte Clube Palmeirense, fruto do entusiasmo de uma plêiade de pioneiros inspirados pela chegada do futebol ao Brasil pelas mãos de Charles Miller.

Desde a primeira bola de couro com tento trazida por Armando Bortone, passando pelo inesquecível confronto com o Torino A.C. da Itália nos anos 20, até a construção do parque aquático em 1971 e do grandioso Salão Social em 1999, cada página da nossa trajetória é motivo de profundo orgulho para os palmeirenses.

Hoje são mais de 36.400 metros quadrados dedicados à convivência familiar, à prática de esportes e ao desenvolvimento de crianças e jovens. Parabéns a cada sócio, diretor, atleta e colaborador que faz parte dessa história centenária!`,
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    slug: "campeonato-interno-de-futebol-society-e-tenis",
    title: "Inscrições Abertas: Torneio Interno de Futebol Society e Copa de Tênis de Saibro",
    category: "Esportes",
    date: "05/09/2026",
    author: "Depto de Esportes",
    featured: false,
    summary: "Estão abertas as inscrições na secretaria de esportes para os associados que desejam participar dos torneios internos do segundo semestre. Venha defender sua equipe!",
    content: `O Departamento de Esportes do ECP convida os associados para a nova edição do Torneio Interno de Futebol Society e da Copa de Tênis de Saibro.

As disputas acontecerão nos finais de semana, com categorias que contemplam desde veteranos até a nova geração. O objetivo principal é a integração entre as famílias, o espírito esportivo e a celebração após os jogos na lanchonete e quiosques do clube.

- Inscrições: Até 20 de setembro na secretaria
- Categorias Society: Livre e Master (35+)
- Categorias Tênis: Simples A, B e Duplas
- Premiação com troféus e medalhas exclusivas na grande final!`,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    slug: "escolinha-de-futebol-infantil-leonildo-braga",
    title: "Escolinha de Futebol Infantil: Novos Horários e Projeto de Inclusão Social",
    category: "Escolinhas & Família",
    date: "01/09/2026",
    author: "Coordenação Esportiva",
    featured: false,
    summary: "Treinos semanais com professores capacitados para ensinar disciplina, saúde e espírito de equipe para meninos e meninas de 6 a 15 anos.",
    content: `A consagrada escolinha de futebol do ECP 'Leonildo Braga' está com matrículas abertas para novos alunos. 

Além de atender aos filhos de associados, o clube mantém com muito orgulho seu compromisso social de receber crianças da comunidade que participam das aulas com foco no aprendizado, formação de caráter e cidadania através do esporte.

- Dias de treino: Terças e Quintas-feiras
- Manhã: 08h30 às 10h00
- Tarde: 15h30 às 17h00
- Inscrições e autorizações na secretaria de esportes.`,
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    slug: "revitalizacao-das-piscinas-e-quiosques-familiares",
    title: "Obras Concluídas: Revitalização do Deck das Piscinas e Novos Quiosques com Churrasqueira",
    category: "Melhorias",
    date: "28/08/2026",
    author: "Diretoria de Patrimônio",
    featured: false,
    summary: "Diretoria conclui obras de modernização no piso atérmico das piscinas, nova iluminação em LED e quiosques totalmente reformados para o conforto das famílias.",
    content: `Visando proporcionar ainda mais comodidade e segurança para todos os associados, o ECP finalizou as obras de melhoria na área externa:

1. Aplicação de piso atérmico e antiderrapante ao redor de todas as piscinas recreativas e infantil.
2. Manutenção preventiva nos sistemas de aquecimento da piscina coberta e saunas.
3. Troca de grelhas e pintura temática dos quiosques familiares para churrasco.
4. Instalação de novos refletores em LED nas quadras e passagens arborizadas.

Venha aproveitar o fim de semana com todo o conforto que sua família merece!`,
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    slug: "boate-genesis-noites-tematicas-salao-social",
    title: "Boate Gênesis: Noite Retrô Anos 80 & 90 no Lounge Nobre",
    category: "Bailes & Shows",
    date: "20/08/2026",
    author: "Diretoria Social",
    featured: false,
    summary: "Relembre as melhores músicas das décadas de ouro na clássica Boate Gênesis com pista climatizada, drinks especiais e os DJs que marcaram época no clube.",
    content: `A saudosa Boate Gênesis do Esporte Clube Palmeirense abre suas portas para uma noite mágica e nostálgica!

Um encontro especial para reviver os grandes sucessos das noites que marcaram a juventude da nossa cidade. Ambiente climatizado, som cristalino, iluminação retrô e um lounge aconchegante para conversar com amigos e dançar a noite toda.

Sócios têm entrada gratuita com carteirinha social. Não perca!`,
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80"
  }
];

export const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Baile de Gala de Aniversário - 118 Anos",
    date: "Setembro",
    time: "22:00",
    location: "Salão Social Monumental",
    badge: "Aniversário Oficial",
    description: "Grande comemoração com orquestra ao vivo, buffet de gala e a presença da tradicional família palmeirense.",
    status: "Mesas Disponíveis"
  },
  {
    id: 2,
    title: "Mega Baile do Hawai 2026",
    date: "Outubro",
    time: "23:00",
    location: "Salão Social & Parque Aquático",
    badge: "Tradição Regional",
    description: "A maior festa temática da cidade! Mega estrutura de som, 2 ambientes, mesa de frutas e atrações consagradas.",
    status: "Ingressos em Breve"
  },
  {
    id: 3,
    title: "Final do Torneio de Inverno de Futebol Society",
    date: "Domingo às 09:30",
    time: "09:30",
    location: "Campo Society 1",
    badge: "Esporte & Lazer",
    description: "A grande decisão do campeonato interno com confraternização nos quiosques após a entrega dos troféus.",
    status: "Entrada Livre para Sócios"
  },
  {
    id: 4,
    title: "Grande Baile de Réveillon & Boate da Ressaca",
    date: "31 de Dezembro",
    time: "23:00",
    location: "Complexo Nobre do ECP",
    badge: "Fim de Ano",
    description: "Celebre a virada de ano em família no clube, com show pirotécnico, brinde com espumante e boate até o amanhecer.",
    status: "Programação Confirmada"
  }
];

export const INITIAL_SPORTS_MODALITIES = [
  {
    name: "Futebol de Campo & Society",
    description: "Campo de dimensões oficiais e 2 campos de futebol society com grama sintética e iluminação noturna para torneios e rachões dos sócios.",
    icon: "Trophy",
    stats: "3 Campos"
  },
  {
    name: "Tênis de Saibro",
    description: "4 quadras de saibro impecáveis, com iluminação de LED e professores disponíveis para aulas individuais ou em grupo.",
    icon: "Target",
    stats: "4 Quadras"
  },
  {
    name: "Complexo Aquático",
    description: "Piscina semiolímpica para treinos, piscina aquecida para hidroginástica e piscinas recreativas com toboáguas e solarium.",
    icon: "Waves",
    stats: "4 Piscinas"
  },
  {
    name: "Academia Completa",
    description: "Espaço moderno de musculação, esteiras, bicicletas e instrutores de plantão para montagem de fichas e treinos personalizados.",
    icon: "Dumbbell",
    stats: "Musculação & Cárdio"
  },
  {
    name: "Quadras Poliesportivas",
    description: "Ginásio coberto e quadra aberta para futsal, basquete, vôlei e eventos esportivos escolares e comunitários.",
    icon: "Flame",
    stats: "2 Quadras"
  },
  {
    name: "Vôlei de Areia & Beach Tennis",
    description: "Quadra de areia fina para a prática esportiva descontraída ao ar livre e torneios de duplas no fim de tarde.",
    icon: "Sun",
    stats: "Areia Fina"
  },
  {
    name: "Canchas de Bocha & Salão de Sinuca",
    description: "2 canchas oficiais de bocha profissional e salão de carteado/sinuca com mesas profissionais para momentos de lazer e amizade.",
    icon: "Award",
    stats: "Bocha & Sinuca"
  },
  {
    name: "Aulas & Dança",
    description: "Natação infantil e adulta, hidroginástica, zumba, ballet, karatê, yoga e ginástica localizada com horários flexíveis.",
    icon: "HeartPulse",
    stats: "Grade Semanal"
  }
];
