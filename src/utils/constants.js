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
  variavel: ['Impostos sobre venda', 'Comissão sobre vendas', 'Taxa de cartão', 'Frete de entrega ao cliente'],
  fixa: ['Aluguel', 'Salários', 'Pró-labore', 'Água', 'Energia elétrica', 'Telefone e internet', 'Contador', 'Combustível (uso geral)', 'Manutenção de veículo', 'Material de escritório'],
  financeira: ['Juros bancários', 'Tarifa bancária', 'Amortização de empréstimo'],
};

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
      { texto: 'Não, esse valor é parecido todo mês', proximo: 'fim_fixa' },
    ],
  },
  fim_cmv: { categoria: 'cmv' },
  fim_variavel: { categoria: 'variavel' },
  fim_fixa: { categoria: 'fixa' },
  fim_financeira: { categoria: 'financeira' },
};

export const DESPESAS_FIXAS_PADRAO = [
  'Simples Nacional', 'Pró-labore', 'Energia Elétrica', 'Material de escritório',
  'Telefonia e Internet', 'Água', 'Manutenção Veículos', 'Combustível', 'Tarifa bancária',
];
