export const ADMIN_CREDENCIAIS = { usuario: 'admin', senha: 'admin123' };

export const STATUS_ASSINATURA = {
  ativo: { label: 'Ativo', color: '#1F5C52', bg: '#D9EBE6' },
  teste: { label: 'Em teste', color: '#8A6D1A', bg: '#F3EAC9' },
  suspenso: { label: 'Suspenso', color: '#B05A2E', bg: '#F5E4D8' },
  cancelado: { label: 'Cancelado', color: '#7A2E3D', bg: '#F2DDE1' },
};

export const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export const CATEGORIAS = {
  cmv: { label: 'Custo da Mercadoria (CMV)', short: 'CMV', color: '#B05A2E', bg: '#F5E4D8' },
  variavel: { label: 'Despesa Variável', short: 'Variável', color: '#8A6D1A', bg: '#F3EAC9' },
  fixa: { label: 'Despesa Fixa', short: 'Fixa', color: '#1F5C52', bg: '#D9EBE6' },
  financeira: { label: 'Despesa Financeira', short: 'Financeira', color: '#7A2E3D', bg: '#F2DDE1' },
};

export const SUBCATEGORIAS_SUGERIDAS = {
  cmv: ['Mercadoria para revenda', 'Matéria-prima', 'Embalagens do produto', 'Frete de compra de mercadoria'],
  variavel: ['Impostos sobre venda', 'Comissão sobre vendas', 'Taxa de cartão', 'Frete de entrega ao cliente', 'Mão de Obra Extra / Diárias de Pico'],
  fixa: ['Aluguel', 'Salários', 'Pró-labore', 'Água', 'Energia elétrica', 'Telefone e internet', 'Contador', 'Combustível (uso geral)', 'Manutenção de veículo', 'Material de escritório'],
  financeira: ['Juros bancários', 'Tarifa bancária', 'Amortização de empréstimo'],
};

export const PLANO_DE_CONTAS_SUGERIDO = [
  {
    id: 'custos_diretos',
    grupo: '📦 Custos Diretos (CMV / Insumos)',
    categoria: 'cmv',
    tipoLabel: 'Custo Direto (CMV)',
    badgeColor: '#B05A2E',
    badgeBg: '#F5E4D8',
    descricao: 'Gastos essenciais de produtos comprados para revender ou produzir',
    itens: [
      { nome: 'Mercadoria para revenda', sub: 'Mercadoria para revenda' },
      { nome: 'Matéria-prima / Ingredientes', sub: 'Matéria-prima' },
      { nome: 'Embalagens do produto', sub: 'Embalagens do produto' },
      { nome: 'Frete de compra de mercadoria', sub: 'Frete de compra de mercadoria' },
      { nome: 'Terceirização direta de produção', sub: 'Matéria-prima' },
    ]
  },
  {
    id: 'despesas_variaveis',
    grupo: '⚡ Despesas Variáveis de Vendas',
    categoria: 'variavel',
    tipoLabel: 'Despesa Variável',
    badgeColor: '#8A6D1A',
    badgeBg: '#F3EAC9',
    descricao: 'Gastos que oscilam diretamente de acordo com o volume de vendas',
    itens: [
      { nome: 'Impostos sobre venda (Simples / ICMS)', sub: 'Impostos sobre venda' },
      { nome: 'Taxa de cartão e maquininhas', sub: 'Taxa de cartão' },
      { nome: 'Comissão sobre vendas', sub: 'Comissão sobre vendas' },
      { nome: 'Taxas de plataformas / Apps de entrega', sub: 'Taxa de cartão' },
      { nome: 'Frete e entregas ao cliente (Motoboy)', sub: 'Frete de entrega ao cliente' },
      { nome: 'Mão de Obra Extra / Diárias de Pico', sub: 'Mão de Obra Extra / Diárias de Pico' },
    ]
  },
  {
    id: 'estrutura_ocupacao',
    grupo: '🏢 Despesas Fixas - Estrutura & Ocupação',
    categoria: 'fixa',
    tipoLabel: 'Despesa Fixa',
    badgeColor: '#1F5C52',
    badgeBg: '#D9EBE6',
    descricao: 'Gastos regulares de infraestrutura para manter as portas abertas',
    itens: [
      { nome: 'Aluguel do imóvel / ponto comercial', sub: 'Aluguel' },
      { nome: 'Condomínio e IPTU', sub: 'Aluguel' },
      { nome: 'Energia elétrica', sub: 'Energia elétrica' },
      { nome: 'Água e esgoto', sub: 'Água' },
      { nome: 'Telefone e internet', sub: 'Telefone e internet' },
      { nome: 'Segurança e monitoramento', sub: 'Material de escritório' },
      { nome: 'Limpeza e conservação predial', sub: 'Material de escritório' },
    ]
  },
  {
    id: 'pessoal_gestao',
    grupo: '👥 Despesas Fixas - Pessoal & Administrativo',
    categoria: 'fixa',
    tipoLabel: 'Despesa Fixa',
    badgeColor: '#1F5C52',
    badgeBg: '#D9EBE6',
    descricao: 'Folha de pagamento da equipe fixa, sócios e assessoria',
    itens: [
      { nome: 'Salários da equipe fixa', sub: 'Salários' },
      { nome: 'Pró-labore dos sócios', sub: 'Pró-labore' },
      { nome: 'Benefícios (VT, VR, Alimentação)', sub: 'Salários' },
      { nome: 'Honorários do contador', sub: 'Contador' },
      { nome: 'Sistemas e softwares de gestão', sub: 'Material de escritório' },
      { nome: 'Material de escritório e papelaria', sub: 'Material de escritório' },
      { nome: 'Combustível e manutenção de veículo', sub: 'Combustível (uso geral)' },
      { nome: 'Treinamentos e capacitações', sub: 'Material de escritório' },
    ]
  },
  {
    id: 'marketing_comercial',
    grupo: '📣 Despesas Fixas - Marketing & Divulgação',
    categoria: 'fixa',
    tipoLabel: 'Despesa Fixa',
    badgeColor: '#1F5C52',
    badgeBg: '#D9EBE6',
    descricao: 'Investimentos em anúncios, marcas e atração de clientes',
    itens: [
      { nome: 'Anúncios online (Meta / Google Ads)', sub: 'Material de escritório' },
      { nome: 'Agência / Gestão de redes sociais', sub: 'Material de escritório' },
      { nome: 'Material gráfico, brindes e fachada', sub: 'Material de escritório' },
      { nome: 'Eventos e feiras comerciais', sub: 'Material de escritório' },
    ]
  },
  {
    id: 'financeiras_bancos',
    grupo: '🏦 Despesas Financeiras & Bancárias',
    categoria: 'financeira',
    tipoLabel: 'Despesa Financeira',
    badgeColor: '#7A2E3D',
    badgeBg: '#F2DDE1',
    descricao: 'Taxas bancárias, juros de empréstimos e encargos',
    itens: [
      { nome: 'Tarifa de conta e pacotes bancários', sub: 'Tarifa bancária' },
      { nome: 'Juros de empréstimo / financiamento', sub: 'Juros bancários' },
      { nome: 'Parcela / Amortização de empréstimo', sub: 'Amortização de empréstimo' },
      { nome: 'IOF e taxas de antecipação', sub: 'Tarifa bancária' },
    ]
  },
];

export const WIZARD = {
  start: {
    pergunta: 'Essa despesa está ligada a empréstimo, financiamento, juros ou tarifa de banco?',
    ajuda: 'Pense em algo que você paga por ter pego dinheiro emprestado ou por usar serviços bancários — não pelo seu produto em si.',
    opcoes: [
      { texto: 'Sim, é sobre dívida ou banco', proximo: 'fim_financeira' },
      { texto: 'Não', proximo: 'pergunta_cmv' },
    ],
  },
  pergunta_cmv: {
    pergunta: 'Essa despesa é algo que você só paga porque vendeu (ou vai vender) um produto específico? Ex: a mercadoria que você compra para revender, ou a matéria-prima de um produto.',
    ajuda: 'O teste do CMV: se você não vendesse nada, esse gasto não existiria. Ex: o pão que a padaria compra para fazer o sanduíche é CMV. O aluguel da padaria não é — ele existe mesmo num mês sem vendas.',
    opcoes: [
      { texto: 'Sim, é o custo direto do que eu vendo', proximo: 'fim_cmv' },
      { texto: 'Não, é diferente disso', proximo: 'pergunta_variavel' },
    ],
  },
  pergunta_variavel: {
    pergunta: 'O valor dessa despesa sobe ou desce dependendo de quanto você vende? Ex: comissão de vendedor, taxa da maquininha de cartão, imposto sobre a venda.',
    ajuda: 'Diferença para o CMV: aqui você não está comprando o produto em si, mas paga um "pedágio" sobre a venda. Quanto mais vende, mais paga.',
    opcoes: [
      { texto: 'Sim, varia com as vendas', proximo: 'fim_variavel' },
      { texto: 'Não, não tem relação com as vendas', proximo: 'pergunta_fixa_tipo' },
    ],
  },
  pergunta_fixa_tipo: {
    pergunta: 'Essa despesa acontece todo mês ou foi pontual / esporádica?',
    ajuda: 'Despesas regulares voltam todo mês com valores parecidos — aluguel, salário, contador. Despesas eventuais são únicas ou esporádicas — um jantar, uma manutenção, uma viagem. As duas entram como Despesa Fixa no DRE, mas vamos sugerir subcategorias diferentes.',
    opcoes: [
      { texto: 'Acontece todo mês (regular)', proximo: 'fim_fixa_recorrente' },
      { texto: 'Foi pontual ou não se repete com frequência', proximo: 'fim_fixa_eventual' },
    ],
  },
  fim_cmv: { categoria: 'cmv' },
  fim_variavel: { categoria: 'variavel' },
  fim_fixa_recorrente: {
    categoria: 'fixa',
    subcategorias: ['Aluguel', 'Salários', 'Pró-labore', 'Água', 'Energia elétrica', 'Telefone e internet', 'Contador', 'Combustível (uso geral)', 'Manutenção de veículo', 'Material de escritório'],
  },
  fim_fixa_eventual: {
    categoria: 'fixa',
    subcategorias: ['Despesa eventual', 'Jantar / confraternização', 'Representação comercial', 'Viagem a trabalho', 'Treinamento / capacitação', 'Consultoria pontual', 'Manutenção eventual', 'Brinde / presente'],
  },
  fim_financeira: { categoria: 'financeira' },
};

export const DESPESAS_FIXAS_PADRAO = [
  'Simples Nacional', 'Pró-labore', 'Energia Elétrica', 'Material de escritório',
  'Telefonia e Internet', 'Água', 'Manutenção Veículos', 'Combustível', 'Tarifa bancária',
];

export const BANCOS = [
  'Nubank', 'Itaú', 'Bradesco', 'Santander', 'Banco do Brasil',
  'Caixa Econômica Federal', 'BTG Pactual', 'Inter', 'C6 Bank', 'XP',
  'Sicoob', 'Sicredi', 'Safra', 'BV', 'Banrisul', 'Agibank', 'Neon',
  'Original', 'PicPay', 'Mercado Pago', 'PagSeguro', 'Cresol',
  'Daycoval', 'Bmg', 'Modal', 'Sofisa', 'Fibra', 'Pine', 'Outro',
];
