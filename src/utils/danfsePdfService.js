// src/utils/danfsePdfService.js
// Gerador nativo e fiel do Documento Auxiliar da NFS-e (DANFSe v2.0) em PDF
// Compatível com navegadores e pronto para anexo em Base64 nos disparos de e-mail.

import { jsPDF } from 'jspdf';

function formatarMoeda(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarCpfCnpj(doc) {
  if (!doc) return '-';
  const limpo = String(doc).replace(/\D/g, '');
  if (limpo.length === 11) {
    return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (limpo.length === 14) {
    return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc;
}

export function gerarDanfsePdfBase64(nota = {}, empresa = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2); // 190mm

  let y = margin;

  const emissor = nota.emissor || empresa || {};
  const tomador = nota.tomador || {};
  const servico = nota.servico || {};
  const isProducao = nota.ambiente === '1' || nota.isOficialReceita;

  const dataObj = nota.dataEmissao ? new Date(nota.dataEmissao) : new Date();
  const dataFormatada = dataObj.toLocaleString('pt-BR');
  const chaveFormatada = nota.chaveAcesso || `354630626${(emissor.cnpj || '10682233000175').replace(/\D/g, '')}70000${String(nota.numero || 1).padStart(15, '0')}0014324`;
  const mesCompetencia = String((nota.competenciaMes !== undefined ? Number(nota.competenciaMes) + 1 : dataObj.getMonth() + 1)).padStart(2, '0');
  const anoCompetencia = nota.competenciaAno || dataObj.getFullYear();

  // Helper para desenhar caixa de seção com título cinza
  function desenharCaixaSecao(titulo, x, topoY, w, h) {
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.3);
    doc.rect(x, topoY, w, 5, 'FD'); // barra cinza de título
    doc.rect(x, topoY + 5, w, h - 5, 'D'); // corpo

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 30, 30);
    doc.text(titulo, x + 2, topoY + 3.6);
  }

  // ── 1. CABEÇALHO OFICIAL ──
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, contentWidth, 22);

  // Logo / Sigla NFS-e
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 104, 55); // Verde oficial
  doc.text('NFS', margin + 3, y + 9);
  doc.setTextColor(0, 159, 227); // Azul oficial
  doc.text('e', margin + 17, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Nota Fiscal de Serviço eletrônica', margin + 3, y + 13);
  doc.text('Padrão Nacional • Receita Federal', margin + 3, y + 16.5);

  // Título Central
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('DANFSe v2.0', margin + (contentWidth / 2), y + 8, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento Auxiliar da Nota Fiscal de Serviços Eletrônica', margin + (contentWidth / 2), y + 12.5, { align: 'center' });

  // Informações do Município à Direita
  doc.setFontSize(7);
  doc.text(`Município: Santa Cruz das Palmeiras - SP`, margin + contentWidth - 3, y + 6, { align: 'right' });
  doc.text(`Ambiente: ${isProducao ? '1 (Produção Oficial)' : '2 (Homologação / Teste)'}`, margin + contentWidth - 3, y + 10, { align: 'right' });
  doc.text(`Data/Hora Emissão: ${dataFormatada}`, margin + contentWidth - 3, y + 14, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`NÚMERO: ${nota.numero || '1'}`, margin + contentWidth - 3, y + 18.5, { align: 'right' });

  y += 24;

  // ── 2. CHAVE DE ACESSO ──
  desenharCaixaSecao('CHAVE DE ACESSO DA NFS-e', margin, y, contentWidth, 12);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(chaveFormatada, margin + 4, y + 9.5);
  y += 14;

  // ── 3. DADOS DA NOTA / DPS ──
  desenharCaixaSecao('DADOS DA NFS-e E DECLARAÇÃO DE PRESTAÇÃO DE SERVIÇO (DPS)', margin, y, contentWidth, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);

  const colW = contentWidth / 4;
  doc.text(`Número NFS-e: ${nota.numero || '1'}`, margin + 3, y + 9);
  doc.text(`Série: ${nota.serie || '1'}`, margin + 3, y + 12.5);

  doc.text(`Competência: ${mesCompetencia}/${anoCompetencia}`, margin + colW + 3, y + 9);
  doc.text(`Regime: Simples Nacional (ME)`, margin + colW + 3, y + 12.5);

  doc.text(`Nº DPS: ${nota.dpsNumero || nota.numero || '1'}`, margin + (colW * 2) + 3, y + 9);
  doc.text(`Série DPS: 1`, margin + (colW * 2) + 3, y + 12.5);

  doc.text(`Exigibilidade ISS: Exigível`, margin + (colW * 3) + 3, y + 9);
  doc.text(`Local Prestação: Sta. Cruz Palmeiras/SP`, margin + (colW * 3) + 3, y + 12.5);

  y += 16;

  // ── 4. PRESTADOR DE SERVIÇOS ──
  const prestadorNome = emissor.razaoSocial || emissor.nomeFantasia || 'AMP DO BRASIL SOLUÇÕES ADMINISTRATIVAS E TECNOLÓGICAS LTDA';
  const prestadorCnpj = formatarCpfCnpj(emissor.cnpj || '10682233000175');
  const prestadorEnd = emissor.endereco || 'RUA CONSTANTE BIAZOTTO, 46 - CENTRO';
  const prestadorCidade = `${emissor.municipio || 'SANTA CRUZ DAS PALMEIRAS'} - ${emissor.uf || 'SP'}`;
  const prestadorEmail = emissor.email || 'atendimento@amp.adm.br';
  const prestadorTel = emissor.telefone || '(19) 99448-7795';

  desenharCaixaSecao('PRESTADOR DE SERVIÇOS', margin, y, contentWidth, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Razão Social: ${prestadorNome}`, margin + 3, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`CNPJ: ${prestadorCnpj}`, margin + 3, y + 13);
  doc.text(`Inscrição Municipal: ${emissor.inscricaoMunicipal || '10682'}`, margin + 90, y + 13);
  doc.text(`Telefone: ${prestadorTel}`, margin + 140, y + 13);

  doc.text(`Endereço: ${prestadorEnd}`, margin + 3, y + 17);
  doc.text(`Município/UF: ${prestadorCidade}`, margin + 90, y + 17);
  doc.text(`E-mail: ${prestadorEmail}`, margin + 140, y + 17);

  y += 24;

  // ── 5. TOMADOR DE SERVIÇOS ──
  const tomadorNome = tomador.razaoSocial || tomador.nomeFantasia || 'Cliente';
  const tomadorDoc = formatarCpfCnpj(tomador.cpfCnpj || tomador.cnpj || tomador.cpf || '');
  const tomadorEnd = tomador.endereco || '-';
  const tomadorCidade = `${tomador.municipio || '-'} - ${tomador.uf || ''}`;
  const tomadorEmail = tomador.email || '-';

  desenharCaixaSecao('TOMADOR DE SERVIÇOS', margin, y, contentWidth, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Nome / Razão Social: ${tomadorNome}`, margin + 3, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`CPF / CNPJ: ${tomadorDoc}`, margin + 3, y + 13);
  doc.text(`Inscrição Municipal: ${tomador.inscricaoMunicipal || 'Isento'}`, margin + 90, y + 13);
  doc.text(`Telefone: ${tomador.telefone || '-'}`, margin + 140, y + 13);

  doc.text(`Endereço: ${tomadorEnd}`, margin + 3, y + 17);
  doc.text(`Município/UF: ${tomadorCidade}`, margin + 90, y + 17);
  doc.text(`E-mail: ${tomadorEmail}`, margin + 140, y + 17);

  y += 24;

  // ── 6. DISCRIMINAÇÃO DOS SERVIÇOS ──
  const descTexto = servico.discriminacao || nota.discriminacao || 'Prestação de serviços administrativos e tecnológicos de consultoria e gestão empresarial.';
  const linhasDesc = doc.splitTextToSize(descTexto, contentWidth - 6);
  const alturaCaixaDesc = Math.max(30, 10 + (linhasDesc.length * 4));

  desenharCaixaSecao('DISCRIMINAÇÃO DOS SERVIÇOS PRESTADOS', margin, y, contentWidth, alturaCaixaDesc);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(linhasDesc, margin + 3, y + 9);

  y += alturaCaixaDesc + 2;

  // ── 7. CÓDIGO DE TRIBUTAÇÃO & ITENS LC 116 ──
  desenharCaixaSecao('CÓDIGO DE TRIBUTAÇÃO E CLASSIFICAÇÃO', margin, y, contentWidth, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const codTrib = servico.codigoTributacaoNacional || '17.01.01';
  const itemLc = servico.itemListaServico || '17.01 - Assessoria ou consultoria de qualquer natureza';
  doc.text(`Código de Tributação Nacional: ${codTrib}`, margin + 3, y + 9);
  doc.text(`Subitem LC 116/2003: ${itemLc}`, margin + 3, y + 12.5);

  y += 16;

  // ── 8. VALORES E RETENÇÕES FISCAIS ──
  const valorTotal = servico.valorTotal || nota.valor || 0;
  const aliquota = servico.aliquotaIss || 2.01;
  const valorIss = servico.valorIss || (valorTotal * (aliquota / 100));
  const valorLiquido = servico.valorLiquido || valorTotal;

  desenharCaixaSecao('CÁLCULO DO IMPOSTO SOBRE SERVIÇOS (ISSQN) E TOTAIS', margin, y, contentWidth, 26);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Valor dos Serviços: ${formatarMoeda(valorTotal)}`, margin + 3, y + 9);
  doc.text(`Desconto Incondicionado: ${formatarMoeda(0)}`, margin + 65, y + 9);
  doc.text(`Desconto Condicionado: ${formatarMoeda(0)}`, margin + 130, y + 9);

  doc.text(`Base de Cálculo ISS: ${formatarMoeda(valorTotal)}`, margin + 3, y + 13.5);
  doc.text(`Alíquota ISS: ${Number(aliquota).toFixed(2)}%`, margin + 65, y + 13.5);
  doc.text(`Valor do ISS: ${formatarMoeda(valorIss)}`, margin + 130, y + 13.5);

  doc.text(`PIS: ${formatarMoeda(servico.pis || 0)}`, margin + 3, y + 18);
  doc.text(`COFINS: ${formatarMoeda(servico.cofins || 0)}`, margin + 40, y + 18);
  doc.text(`INSS: ${formatarMoeda(servico.inss || 0)}`, margin + 75, y + 18);
  doc.text(`IR: ${formatarMoeda(servico.ir || 0)}`, margin + 110, y + 18);
  doc.text(`CSLL: ${formatarMoeda(servico.csll || 0)}`, margin + 145, y + 18);

  // Linha de Destaque: VALOR LÍQUIDO
  doc.setFillColor(235, 245, 240);
  doc.rect(margin + 1, y + 20, contentWidth - 2, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 104, 55);
  doc.text(`VALOR LÍQUIDO DA NFS-e: ${formatarMoeda(valorLiquido)}`, margin + 3, y + 23.8);

  y += 28;

  // ── 9. INFORMAÇÕES COMPLEMENTARES / RODAPÉ LEGAL ──
  if (y < pageHeight - 22) {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    doc.rect(margin, y, contentWidth, pageHeight - margin - y - 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text('OUTRAS INFORMAÇÕES E REGIME TRIBUTÁRIO', margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('I - Documento emitido por ME ou EPP optante pelo Simples Nacional;', margin + 3, y + 8.5);
    doc.text('II - Não gera direito a crédito fiscal de IPI ou ICMS;', margin + 3, y + 12);
    doc.text('III - A autenticidade desta NFS-e pode ser confirmada no Portal Nacional da Receita Federal com a Chave de Acesso acima.', margin + 3, y + 15.5);
  }

  // Rodapé da Página
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(120, 120, 120);
  doc.text(`Gerado automaticamente pelo Sistema AMP Flow em ${dataFormatada} • www.amp.adm.br`, margin, pageHeight - 3);

  // Retorna o PDF puramente como string Base64 (sem cabeçalho data:...)
  const dataUri = doc.output('datauristring');
  return dataUri.split(',')[1];
}
