/**
 * Serviço de Leitura OCR & Auto-Preenchimento Inteligente de Comprovantes
 * Desenvolvido para AMP Flow — Padrão Enterprise
 * Utiliza Tesseract OCR com pré-processamento de imagem em Canvas e
 * motor de análise semântica para Cupons Fiscais, NFC-e, Recibos e Comprovantes PIX brasileiros.
 */

import { createWorker } from 'tesseract.js';

/**
 * Pré-processa a imagem para maximizar o contraste e nitidez do texto
 * térmico (cupons fiscais, papel de maquininha, recibos com sombra)
 */
export async function preProcessarImagem(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Redimensionar para tamanho ideal para OCR (máx 1600px na maior dimensão)
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar no canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Obter os dados de pixels
        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;

        // Converter para escala de cinza e aplicar aumento de contraste
        const contrastFactor = 1.35; // Aumenta 35% o contraste
        for (let i = 0; i < d.length; i += 4) {
          // Luminância padrão sRGB
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Ajuste de contraste
          const adjusted = Math.min(255, Math.max(0, (gray - 128) * contrastFactor + 128));

          d[i] = adjusted;     // R
          d[i + 1] = adjusted; // G
          d[i + 2] = adjusted; // B
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        // Se falhar o processamento em canvas (ex: segurança de origem), usa a original
        resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
      }
    };

    img.onerror = () => {
      resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
    };

    if (imageSource instanceof Blob || imageSource instanceof File) {
      img.src = URL.createObjectURL(imageSource);
    } else {
      img.src = imageSource;
    }
  });
}

/**
 * Executa o OCR na imagem com relatório de progresso em tempo real
 */
export async function extrairTextoComprovante(imageSource, onProgresso = () => {}) {
  let worker = null;
  try {
    onProgresso({ status: 'Otimizando imagem para leitura...', pct: 15 });
    const imagemOtimizada = await preProcessarImagem(imageSource);

    onProgresso({ status: 'Inicializando motor OCR neural...', pct: 30 });
    // Carrega o worker com idioma português e inglês
    worker = await createWorker('por');

    onProgresso({ status: 'Identificando caracteres e valores fiscais...', pct: 55 });
    const ret = await worker.recognize(imagemOtimizada);
    const texto = ret.data.text || '';

    onProgresso({ status: 'Interpretando dados fiscais e fornecedor...', pct: 90 });
    const dadosExtraidos = interpretarTextoComprovante(texto);

    onProgresso({ status: 'Leitura concluída com sucesso!', pct: 100 });
    return {
      sucesso: true,
      textoBruto: texto,
      ...dadosExtraidos,
    };
  } catch (error) {
    console.error('Erro na extração OCR:', error);
    return {
      sucesso: false,
      erro: error.message || 'Não foi possível ler o comprovante automaticamente.',
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (_) {}
    }
  }
}

/**
 * Interpreta o texto bruto do comprovante e extrai campos fiscais estruturados:
 * Valor, Data, Fornecedor, Forma de Pagamento, Categoria e Subcategoria.
 */
export function interpretarTextoComprovante(texto) {
  if (!texto || typeof texto !== 'string') {
    return {
      valor: null,
      valorFormatado: '',
      dia: null,
      mes: null,
      ano: null,
      fornecedor: '',
      descricaoSugerida: '',
      formaPagamento: 'Outros',
      tipo: 'despesa',
      categoriaSugerida: 'variavel',
      subcategoriaSugerida: '',
      confianca: 0,
    };
  }

  const linhas = texto
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // ── 1. EXTRAÇÃO DO VALOR ──
  const { valor, valorFormatado } = extrairValorFiscal(linhas, texto);

  // ── 2. EXTRAÇÃO DA DATA ──
  const { dia, mes, ano } = extrairDataFiscal(texto);

  // ── 3. EXTRAÇÃO DO FORNECEDOR / ESTABELECIMENTO ──
  const fornecedor = extrairNomeFornecedor(linhas);

  // ── 4. FORMA DE PAGAMENTO ──
  const formaPagamento = extrairFormaPagamento(texto);

  // ── 5. TIPO (DESPESA OU RECEITA) ──
  const tipo = extrairTipoOperacao(texto);

  // ── 6. CATEGORIA E SUBCATEGORIA SUGERIDA ──
  const { categoria, subcategoria, descricaoFinal } = sugerirCategoria(fornecedor, texto);

  return {
    valor,
    valorFormatado,
    dia,
    mes,
    ano,
    fornecedor,
    descricaoSugerida: descricaoFinal || fornecedor || 'Despesa com Comprovante',
    formaPagamento,
    tipo,
    categoriaSugerida: categoria,
    subcategoriaSugerida: subcategoria,
    confianca: valor ? 85 : 50,
  };
}

/**
 * Localiza o valor total em cupons, recibos e comprovantes bancários
 */
function extrairValorFiscal(linhas, textoCompleto) {
  // Padrões prioritários de total
  const regexTotalDireto = /(?:total\s*(?:r\$|a\s*pagar|pago|l[ií]quido|da\s*nota)?|valor\s*(?:total|pago|recebido|l[ií]quido|da\s*transfer[êe]ncia)?|v\.?\s*total|vlr\.?\s*total|total\s*geral|valor\s*r\$)\s*[:\s]*r?\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*[\,\.][0-9]{2})/i;
  
  // 1. Procurar nas linhas com palavra-chave de total
  for (const linha of linhas) {
    const match = linha.match(regexTotalDireto);
    if (match && match[1]) {
      const num = normalizarMoeda(match[1]);
      if (num > 0) {
        return {
          valor: num,
          valorFormatado: num.toFixed(2).replace('.', ','),
        };
      }
    }
  }

  // 2. Procurar em comprovante PIX ("Valor R$ 150,00" ou "Valor: R$ 150,00")
  const matchPix = textoCompleto.match(/(?:valor|quantia)\s*[:\s]*r?\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*[\,\.][0-9]{2})/i);
  if (matchPix && matchPix[1]) {
    const num = normalizarMoeda(matchPix[1]);
    if (num > 0) {
      return {
        valor: num,
        valorFormatado: num.toFixed(2).replace('.', ','),
      };
    }
  }

  // 3. Procurar qualquer padrão de R$ no texto e pegar o maior valor plausível
  const regexTodosValores = /r?\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*[\,\.][0-9]{2})/gi;
  const valoresEncontrados = [];
  let m;
  while ((m = regexTodosValores.exec(textoCompleto)) !== null) {
    if (m[1]) {
      const n = normalizarMoeda(m[1]);
      // Ignorar valores absurdos como números de protocolo ou CEP
      if (n > 0.5 && n < 500000) {
        valoresEncontrados.push(n);
      }
    }
  }

  if (valoresEncontrados.length > 0) {
    // Em cupons fiscais, o Total é quase sempre o maior valor da nota
    const maxVal = Math.max(...valoresEncontrados);
    return {
      valor: maxVal,
      valorFormatado: maxVal.toFixed(2).replace('.', ','),
    };
  }

  return { valor: null, valorFormatado: '' };
}

/**
 * Converte string brasileira "1.250,50" ou "1250.50" para número float
 */
function normalizarMoeda(str) {
  if (!str) return 0;
  // Se tem ponto e vírgula (ex: 1.250,50)
  if (str.includes('.') && str.includes(',')) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  }
  // Se tem apenas vírgula (ex: 1250,50)
  if (str.includes(',')) {
    return parseFloat(str.replace(',', '.'));
  }
  // Se tem apenas ponto
  return parseFloat(str);
}

/**
 * Extrai a data fiscal (dia, mês e ano)
 */
function extrairDataFiscal(texto) {
  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const mesHoje = hoje.getMonth() + 1;
  const anoHoje = hoje.getFullYear();

  // Padrão DD/MM/AAAA ou DD/MM/AA
  const regexData = /\b([0-3]?[0-9])[\/\.\-]([0-1]?[0-9])[\/\.\-](\d{2,4})\b/;
  const match = texto.match(regexData);

  if (match) {
    const diaNum = parseInt(match[1], 10);
    const mesNum = parseInt(match[2], 10);
    let anoNum = parseInt(match[3], 10);

    if (anoNum < 100) anoNum += 2000;

    if (diaNum >= 1 && diaNum <= 31 && mesNum >= 1 && mesNum <= 12) {
      return {
        dia: diaNum,
        mes: mesNum,
        ano: anoNum,
      };
    }
  }

  // Fallback para o dia e mês atuais se não encontrar data expressa
  return {
    dia: diaHoje,
    mes: mesHoje,
    ano: anoHoje,
  };
}

/**
 * Identifica o nome do fornecedor ou estabelecimento
 */
function extrairNomeFornecedor(linhas) {
  // Palavras que não são nome de empresa
  const ignorar = [
    'documento auxiliar', 'danfe', 'nfc-e', 'nf-e', 'cupom fiscal',
    'extrato', 'via consumidor', 'cnpj', 'ie:', 'im:', 'endereço',
    'endereco', 'rua', 'av.', 'avenida', 'cep', 'telefone', 'tel',
    'data', 'emissao', 'chave de acesso', 'protocolo', 'comprovante',
    'banco', 'transferencia', 'pix', 'autenticacao', 'hora',
  ];

  // Primeiras 5 linhas costumam ter a razão social ou nome fantasia
  for (let i = 0; i < Math.min(6, linhas.length); i++) {
    const linha = linhas[i].trim();
    const lLower = linha.toLowerCase();

    // Se é muito curta ou tem só números/símbolos, pula
    if (linha.length < 3 || /^[\d\s\.\-\/\:]+$/.test(linha)) continue;

    // Se contém termos de cabeçalho fiscal puro, pula
    const temIgnorado = ignorar.some(ig => lLower.includes(ig));
    if (temIgnorado) continue;

    // Se parece com nome de empresa (letras maiúsculas ou nome razoável)
    // Limpar caracteres estranhos
    const limpo = linha.replace(/[^a-zA-Z0-9À-ÿ\s\.\&\-]/g, '').trim();
    if (limpo.length >= 4) {
      return limpo;
    }
  }

  // Busca rápida por redes ou marcas famosas no texto
  const marcas = [
    { termo: 'ipiranga', nome: 'Posto Ipiranga' },
    { termo: 'shell', nome: 'Posto Shell' },
    { termo: 'petrobras', nome: 'Posto Petrobras' },
    { termo: 'kalunga', nome: 'Kalunga' },
    { termo: 'leroy merlin', nome: 'Leroy Merlin' },
    { termo: 'mercado livre', nome: 'Mercado Livre' },
    { termo: 'amazon', nome: 'Amazon' },
    { termo: 'carrefour', nome: 'Carrefour' },
    { termo: 'pao de acucar', nome: 'Pão de Açúcar' },
    { termo: 'drogasil', nome: 'Drogasil' },
    { termo: 'droga raia', nome: 'Droga Raia' },
    { termo: 'cpfl', nome: 'CPFL Energia' },
    { termo: 'enel', nome: 'Enel Energia' },
    { termo: 'sabesp', nome: 'Sabesp' },
    { termo: 'uber', nome: 'Uber' },
    { termo: 'ifood', nome: 'iFood' },
    { termo: 'sem parar', nome: 'Sem Parar' },
  ];

  const tLower = linhas.join(' ').toLowerCase();
  for (const m of marcas) {
    if (tLower.includes(m.termo)) {
      return m.nome;
    }
  }

  return '';
}

/**
 * Extrai a forma de pagamento (Pix, Cartão, Boleto, etc.)
 */
function extrairFormaPagamento(texto) {
  const t = texto.toLowerCase();

  if (t.includes('pix')) return 'Pix';
  if (t.includes('cartao de credito') || t.includes('crédito') || t.includes('credito') || t.includes('visa') || t.includes('mastercard')) return 'Cartão de Crédito';
  if (t.includes('cartao de debito') || t.includes('débito') || t.includes('debito')) return 'Cartão de Débito';
  if (t.includes('boleto')) return 'Boleto';
  if (t.includes('dinheiro') || t.includes('espécie')) return 'Dinheiro';
  if (t.includes('ted') || t.includes('doc') || t.includes('transferência') || t.includes('transferencia')) return 'Transferência Bancária';

  return 'Outros';
}

/**
 * Identifica se é despesa ou receita
 */
function extrairTipoOperacao(texto) {
  const t = texto.toLowerCase();
  if (t.includes('comprovante de recebimento') || t.includes('transferência recebida') || t.includes('valor creditado') || t.includes('nota fiscal de serviço prestado')) {
    return 'receita';
  }
  return 'despesa';
}

/**
 * Sugere categoria e subcategoria baseada no contexto do estabelecimento
 */
function sugerirCategoria(fornecedor, textoCompleto) {
  const t = (fornecedor + ' ' + textoCompleto).toLowerCase();

  // 1. Combustível / Transporte
  if (t.includes('posto') || t.includes('combustivel') || t.includes('combustível') || t.includes('gasolina') || t.includes('etanol') || t.includes('diesel') || t.includes('shell') || t.includes('ipiranga') || t.includes('petrobras') || t.includes('abastecimento')) {
    return {
      categoria: 'variavel',
      subcategoria: 'Combustível',
      descricaoFinal: fornecedor ? `Combustível - ${fornecedor}` : 'Abastecimento de Combustível',
    };
  }

  // 2. Viagens / Táxi / Aplicativo
  if (t.includes('uber') || t.includes('99 app') || t.includes('taxi') || t.includes('táxi') || t.includes('pedagio') || t.includes('pedágio') || t.includes('sem parar') || t.includes('estacionamento')) {
    return {
      categoria: 'variavel',
      subcategoria: 'Transporte & Deslocamento',
      descricaoFinal: fornecedor ? `${fornecedor} - Transporte` : 'Transporte & Deslocamento',
    };
  }

  // 3. Alimentação / Refeições
  if (t.includes('restaurante') || t.includes('lanchonete') || t.includes('padaria') || t.includes('churrascaria') || t.includes('pizzaria') || t.includes('ifood') || t.includes('refeicao') || t.includes('refeição') || t.includes('almoco') || t.includes('almoço') || t.includes('cafe') || t.includes('café')) {
    return {
      categoria: 'variavel',
      subcategoria: 'Alimentação / Refeições',
      descricaoFinal: fornecedor ? `Alimentação - ${fornecedor}` : 'Refeição / Alimentação',
    };
  }

  // 4. Material de Escritório / Informática
  if (t.includes('kalunga') || t.includes('papelaria') || t.includes('toner') || t.includes('impressao') || t.includes('cartucho') || t.includes('informatica') || t.includes('computador') || t.includes('software')) {
    return {
      categoria: 'fixa',
      subcategoria: 'Material de Escritório & TI',
      descricaoFinal: fornecedor ? `${fornecedor} - Suprimentos` : 'Material de Escritório',
    };
  }

  // 5. Utilidades / Contas de Consumo
  if (t.includes('cpfl') || t.includes('enel') || t.includes('energia') || t.includes('luz') || t.includes('sabesp') || t.includes('agua') || t.includes('água') || t.includes('vivo') || t.includes('claro') || t.includes('tim') || t.includes('internet') || t.includes('telefonia')) {
    return {
      categoria: 'fixa',
      subcategoria: 'Energia / Água / Internet',
      descricaoFinal: fornecedor ? `Conta - ${fornecedor}` : 'Utilidades / Contas de Consumo',
    };
  }

  // 6. Manutenção e Peças
  if (t.includes('oficina') || t.includes('mecanica') || t.includes('mecânica') || t.includes('auto pecas') || t.includes('peças') || t.includes('conserto') || t.includes('manutencao') || t.includes('manutenção') || t.includes('ferragens') || t.includes('tintas')) {
    return {
      categoria: 'variavel',
      subcategoria: 'Manutenção & Peças',
      descricaoFinal: fornecedor ? `Manutenção - ${fornecedor}` : 'Manutenção & Peças',
    };
  }

  // 7. Farmácia
  if (t.includes('farmacia') || t.includes('farmácia') || t.includes('drogaria') || t.includes('drogasil') || t.includes('raia')) {
    return {
      categoria: 'variavel',
      subcategoria: 'Farmácia / Saúde',
      descricaoFinal: fornecedor ? `Farmácia - ${fornecedor}` : 'Medicamentos / Farmácia',
    };
  }

  // 8. Supermercado geral
  if (t.includes('supermercado') || t.includes('mercado') || t.includes('atacadista') || t.includes('carrefour') || t.includes('assai') || t.includes('atacadao')) {
    return {
      categoria: 'variavel',
      subcategoria: 'Mercado & Limpeza',
      descricaoFinal: fornecedor ? `Compras - ${fornecedor}` : 'Mercado & Suprimentos',
    };
  }

  return {
    categoria: 'variavel',
    subcategoria: '',
    descricaoFinal: fornecedor || '',
  };
}
