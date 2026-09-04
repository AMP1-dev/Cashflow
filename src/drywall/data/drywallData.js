/**
 * Base de Dados Oficial da Drywall Distribuidora | Di Brunelli
 * Foco: Distribuição de produtos para construção a seco no interior de SP
 */

export const COMPANY_INFO = {
  name: "Drywall Distribuidora",
  brandTransition: "Di Brunelli Store",
  brandSub: "Sistemas Construtivos & Drywall",
  domain: "dibrunelli.com.br",
  secondaryDomain: "drywalldistribuidora.com.br",
  tagline: "A distribuidora especializada de drywall e construção a seco do interior de São Paulo",
  shortDesc: "Distribuição direta de placas, perfis e isolamentos para construtoras, gesseiros e instaladores com frota própria e entrega ágil no interior paulista.",
  phone: "(19) 3876-9200",
  whatsapp: "5519998452030",
  whatsappDisplay: "(19) 99845-2030",
  email: "contato@dibrunelli.com.br",
  cotacaoEmail: "cotacao@dibrunelli.com.br",
  address: "Rodovia Anhanguera, km 112 - Distrito Industrial",
  city: "Campinas e Interior de São Paulo",
  cep: "13069-000",
  hours: "Segunda a Sexta: 07:30 às 18:00 | Sábado: 08:00 às 12:30",
  socials: {
    instagram: "@dibrunelli.drywall",
    facebook: "/dibrunellidrywall",
    linkedin: "/company/di-brunelli-distribuidora"
  }
};

// 4 Grandes Utilidades Práticas do Drywall
export const DRYWALL_UTILITIES = [
  {
    id: "divisorias",
    title: "Paredes Divisórias & Acústicas",
    tag: "Rapidez & Silêncio",
    desc: "Substitui a alvenaria tradicional com montagem até 3x mais rápida, ganho de até 5% de área útil no cômodo e isolamento de som até 50% superior com miolo de lã acústica.",
    benefits: [
      "Instalação 100% seca sem entulho ou poeira de cimento",
      "Perfeito para escritórios, clínicas e dormitórios",
      "Passagem fácil e oculta de fios elétricos e canos"
    ],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "forros",
    title: "Forros Rebaixados, Sancas & Iluminação",
    tag: "Design & Conforto",
    desc: "Permite rebaixar tetos com estética minimalista, criando sancas abertas ou invertidas, rasgos de luz em LED, cortineiros embutidos e conforto térmico sob a laje.",
    benefits: [
      "Estruturação leve e segura com canaletas F530",
      "Efeito de teto flutuante com tabicas metálicas",
      "Facilidade total na distribuição de spots e pendentes"
    ],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "moveis-nichos",
    title: "Nichos Embutidos & Painéis de TV",
    tag: "Decoração Sob Medida",
    desc: "Criação de estantes iluminadas, cabeceiras, bancadas e nichos sob medida com gesso acartonado e cantoneiras de reforço, prontos para pintura fina ou revestimento.",
    benefits: [
      "Acabamento liso milimétrico sem imperfeições",
      "Custo muito inferior à marcenaria pesada",
      "Personalização total do layout de salas e quartos"
    ],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "areas-umidas",
    title: "Áreas Úmidas & Proteção Corta-Fogo",
    tag: "Resistência Especial",
    desc: "Solução ideal para banheiros, lavabos e cozinhas com as placas verdes hidrófugas (RU), além de placas rosa (RF) para proteção contra incêndio e laudos de bombeiros.",
    benefits: [
      "Resistente à umidade, vapor e fungos",
      "Pronto para receber pisos cerâmicos e porcelanatos",
      "Retarda chamas por até 120 minutos (Classe A)"
    ],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
  }
];

// Notícias, Guias e Links Válidos sobre Drywall
export const DRYWALL_NEWS = [
  {
    id: "guia-abnt",
    title: "Manual Técnico Oficial: Normas ABNT para Drywall no Brasil",
    source: "Associação Brasileira do Drywall",
    url: "https://drywall.org.br/manuais-tecnicos/",
    date: "Referência Oficial",
    summary: "Guia completo com os padrões ABNT NBR 14715 e 15758 para instalação de paredes, forros e revestimentos estruturados.",
    tag: "Normas Técnicas"
  },
  {
    id: "economia-obra",
    title: "Construção a Seco reduz até 30% dos custos indiretos de obra",
    source: "Portal da Construção & Drywall",
    url: "https://drywall.org.br/vantagens-do-drywall/",
    date: "Economia na Prática",
    summary: "Estudo comparativo demonstra a drástica redução de entulho, velocidade de execução e alívio de peso estrutural.",
    tag: "Produtividade"
  },
  {
    id: "acustica-nbr",
    title: "Isolamento Acústico: Como atingir os índices da NBR 15575",
    source: "Engenharia Acústica",
    url: "https://drywall.org.br/desempenho-acustico/",
    date: "Conforto Sonoro",
    summary: "Como a combinação de placas duplas e lã mineral supera o desempenho sonoro da alvenaria comum em edifícios residenciais.",
    tag: "Isolamento Acústico"
  }
];

// Produtos Essenciais da Distribuidora (Catálogo Enxuto e Limpo)
export const ESSENTIAL_PRODUCTS = [
  {
    id: "placa-st",
    title: "Placa Drywall Standard ST 12.5mm",
    subtitle: "Uso geral para paredes divisórias e forros em áreas secas",
    badge: "Mais Vendido",
    category: "Placas",
    specs: "1,20m x 1,80m / 2,40m &bull; 12.5mm",
    unit: "Chapa",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "placa-ru",
    title: "Placa Drywall Resistente à Umidade RU (Verde)",
    subtitle: "Núcleo siliconado hidrófugo para banheiros, lavabos e cozinhas",
    badge: "Áreas Úmidas",
    category: "Placas",
    specs: "1,20m x 1,80m / 2,40m &bull; 12.5mm",
    unit: "Chapa",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "perfis-montantes-guias",
    title: "Perfis Estruturais Montantes & Guias 48 / 70 (3m)",
    subtitle: "Aço galvanizado Z275 certificado com furos para instalações",
    badge: "Aço Z275 Certificado",
    category: "Estruturas",
    specs: "Barras 3,00m &bull; NBR 15217",
    unit: "Barra / Fardo",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "canaleta-f530-tabica",
    title: "Canaleta F530 & Tabica Branca para Forro",
    subtitle: "Sustentação de forros suspensos e acabamento com junta de dilatação",
    badge: "Teto Flutuante",
    category: "Forros",
    specs: "Barras de 3,00m &bull; Pintura Epóxi",
    unit: "Barra",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "la-de-vidro-acustica",
    title: "Lã de Vidro Wallfelt 50mm / 70mm",
    subtitle: "Absorção acústica e térmica para miolo de paredes e forros",
    badge: "Alto Isolamento",
    category: "Isolamento",
    specs: "Rolos de 15m² &bull; Incombustível",
    unit: "Rolo",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "massa-fitas-fixacao",
    title: "Massa para Drywall (Balde) & Fitas Microperfuradas",
    subtitle: "Tratamento de juntas sem trincas e parafusos GN 25 / GN 35",
    badge: "Acabamento Perfeito",
    category: "Insumos",
    specs: "Balde 15kg/28kg &bull; Rolo 150m",
    unit: "Kit / Unidade",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"
  }
];

// Modelo de Exemplo para a Futura Loja Virtual Di Brunelli (Captar Pedidos)
export const SAMPLE_STORE_ITEMS = [
  {
    id: "di-placa-st",
    name: "Placa Drywall Standard ST 12.5mm (1,20 x 1,80m)",
    refPrice: "R$ 39,90",
    unit: "chapa",
    stock: "Pronta-entrega",
    category: "Placas de Gesso"
  },
  {
    id: "di-placa-ru",
    name: "Placa Drywall Resistente à Umidade RU Verde (1,20 x 1,80m)",
    refPrice: "R$ 54,90",
    unit: "chapa",
    stock: "Pronta-entrega",
    category: "Placas Especiais"
  },
  {
    id: "di-montante-48",
    name: "Montante Metálico 48mm Galvanizado (Barra 3,00m)",
    refPrice: "R$ 18,50",
    unit: "barra",
    stock: "Estoque alto",
    category: "Perfis Estruturais"
  },
  {
    id: "di-canaleta-f530",
    name: "Canaleta F530 para Forro (Barra 3,00m)",
    refPrice: "R$ 14,90",
    unit: "barra",
    stock: "Estoque alto",
    category: "Perfis de Forro"
  },
  {
    id: "di-massa-28kg",
    name: "Massa Pronta para Drywall Balde 28kg",
    refPrice: "R$ 89,00",
    unit: "balde",
    stock: "Pronta-entrega",
    category: "Massas & Juntas"
  },
  {
    id: "di-la-vidro",
    name: "Lã de Vidro Acústica Wallfelt 50mm (Rolo 15m²)",
    refPrice: "R$ 145,00",
    unit: "rolo",
    stock: "Disponível",
    category: "Isolamento"
  }
];

export const CITIES_SERVED = [
  { region: "RMC / Campinas", main: "Campinas, Americana, Sumaré, Indaiatuba, Hortolândia", time: "24h" },
  { region: "Polo Sorocaba", main: "Sorocaba, Itu, Votorantim, Salto, Boituva", time: "24h a 48h" },
  { region: "Polo Piracicaba", main: "Piracicaba, Limeira, Rio Claro, Santa Bárbara", time: "24h a 48h" },
  { region: "Ribeirão Preto & Região", main: "Ribeirão Preto, Sertãozinho, Cravinhos, Araraquara", time: "48h" },
  { region: "Vale do Paraíba", main: "São José dos Campos, Jacareí, Taubaté, Jundiaí", time: "24h a 48h" }
];

export const PRODUCTS = ESSENTIAL_PRODUCTS;
