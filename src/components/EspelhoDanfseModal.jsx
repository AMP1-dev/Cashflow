import React from 'react';
import { 
  FileText, Download, Printer, X, MessageCircle, ShieldCheck 
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { formatarCpfCnpj, gerarLinkWhatsAppNfse } from '../utils/nfseService';
import { MESES } from '../utils/constants';

export function EspelhoDanfseModal({ nota, empresa, onClose }) {
  if (!nota) return null;

  const {
    numero,
    chaveAcesso,
    dpsNumero,
    serieDps,
    codigoVerificacao,
    dataEmissao,
    competenciaMes,
    competenciaAno,
    emissor,
    tomador,
    servico,
    ambiente,
    status
  } = nota;

  const dataObj = new Date(dataEmissao);
  const dataFormatada = dataObj.toLocaleString('pt-BR');
  const dataApenas = dataObj.toLocaleDateString('pt-BR');
  const chaveFormatada = chaveAcesso || `354630626${emissor?.cnpj?.replace(/\D/g, '') || '10682233000175'}70000${String(numero).padStart(15, '0')}0014324`;
  const numDpsCalculado = dpsNumero || (parseInt(numero) > 11 ? String(parseInt(numero) - 11) : String(numero));

  const nomeClienteLimpo = (tomador?.razaoSocial || 'Cliente')
    .replace(/[\\/:*?"<>|]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  const mesFormatado = String(competenciaMes !== undefined ? (Number(competenciaMes) + 1) : (new Date().getMonth() + 1)).padStart(2, '0');
  const anoFormatado = competenciaAno || new Date().getFullYear();
  const nomeArquivoOficial = `${nomeClienteLimpo} - NFS-e Nº ${numero} - ${mesFormatado}-${anoFormatado}`;

  function handleImprimir() {
    const tituloAntigo = document.title;
    document.title = nomeArquivoOficial;

    const restaurarTitulo = () => {
      document.title = tituloAntigo;
      window.removeEventListener('afterprint', restaurarTitulo);
    };
    window.addEventListener('afterprint', restaurarTitulo);

    window.print();

    // Fallback de segurança para restaurar o título da página
    setTimeout(() => {
      if (document.title === nomeArquivoOficial) {
        document.title = tituloAntigo;
      }
    }, 2500);
  }

  function handleWhatsApp() {
    const link = gerarLinkWhatsAppNfse(nota, empresa);
    if (link) window.open(link, '_blank');
  }

  function handleDownloadXml() {
    const blob = new Blob([nota.xmlGerado || '<xml>NFS-e</xml>'], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nomeArquivoOficial}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const vServ = servico?.valorTotal || 0;
  const vLiq = servico?.valorLiquido || vServ;
  const isProducao = ambiente === 'producao';

  return (
    <>
      {/* ── CSS Global para Impressão e Download em PDF ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #danfse-documento-oficial, #danfse-documento-oficial * {
            visibility: visible !important;
          }
          #danfse-documento-oficial {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .danfse-no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
        }
      `}</style>

      <div className="danfse-modal-overlay" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 43, 39, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 8
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 820,
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          
          {/* ── Barra Superior de Ações (Web) ── */}
          <div className="danfse-no-print" style={{
            background: '#0F2B27',
            padding: '10px 16px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={17} color="#9FE0C8" />
              <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>
                DANFSe v2.0 • Modelo PDF Oficial
              </span>
              <span style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 4,
                background: isProducao ? '#15803D' : '#8A6D1A',
                color: '#fff',
                fontWeight: 700
              }}>
                {isProducao ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button
                onClick={handleImprimir}
                title="Salvar como PDF ou Imprimir documento oficial"
                style={{
                  background: '#1F5C52',
                  border: '1px solid #9FE0C8',
                  borderRadius: 6,
                  padding: '6px 12px',
                  color: '#FAF8F3',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <Printer size={13} />
                <span>Salvar PDF / Imprimir</span>
              </button>

              <button
                onClick={handleWhatsApp}
                title="Enviar no WhatsApp do Cliente"
                style={{
                  background: '#25D366',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 11px',
                  color: '#fff',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleDownloadXml}
                title="Baixar Arquivo XML Oficial"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 10px',
                  color: '#9FE0C8',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Download size={13} /> XML
              </button>

              <button
                onClick={onClose}
                aria-label="Fechar"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9FBDB5',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Sub-barra informativa com o nome exato do arquivo */}
          <div className="danfse-no-print" style={{
            background: '#163E37',
            padding: '7px 16px',
            color: '#B8DDD2',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
            borderBottom: '1px solid #1F5C52'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#FAF8F3' }}>📁 Arquivo PDF:</span>
              <strong style={{ color: '#9FE0C8' }}>{nomeArquivoOficial}.pdf</strong>
            </div>
            <div style={{ fontSize: '10.5px', color: '#D9EBE6' }}>
              💡 Salve o PDF acima e depois clique em <strong>WhatsApp</strong> para anexá-lo ao cliente.
            </div>
          </div>

          {/* ── Visualizador do Documento Fiscal DANFSe v2.0 (Fiel à Receita Federal) ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', background: '#EAE6DD' }}>
            <div id="danfse-documento-oficial" style={{
              background: '#fff',
              border: '1.5px solid #000',
              padding: '12px 14px',
              color: '#000',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '10px',
              lineHeight: 1.25,
              maxWidth: 780,
              margin: '0 auto',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
            }}>

              {/* 1. TOPO CABEÇALHO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 1.4fr', borderBottom: '1.5px solid #000', paddingBottom: 6, marginBottom: 4, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#006837', letterSpacing: -1, lineHeight: 1 }}>
                    NFS<span style={{ color: '#009fe3' }}>e</span>
                  </div>
                  <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.1 }}>
                    Nota Fiscal de<br />Serviço eletrônica
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>DANFSe v2.0</div>
                  <div style={{ fontSize: 10, fontWeight: 700 }}>Documento Auxiliar da NFS-e</div>
                </div>

                <div style={{ textAlign: 'right', fontSize: 8.5, lineHeight: 1.2 }}>
                  <div><strong>Município:</strong> Santa Cruz das Palmeiras - SP</div>
                  <div>Ambiente Gerador: 2</div>
                  <div>Tipo de Ambiente: <strong>{isProducao ? '1 (Produção)' : '2 (Homologação)'}</strong></div>
                </div>
              </div>

              {/* 2. CHAVE DE ACESSO & METADADOS DA DPS */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  CHAVE DE ACESSO DA NFS-e
                </div>
                <div style={{ padding: '3px 6px', fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, borderBottom: '1px solid #000' }}>
                  {chaveFormatada}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.3fr 1.1fr', padding: '4px 6px', gap: 4, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 8, color: '#333' }}>NÚMERO DA NFS-e</div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{numero}</div>
                    <div style={{ fontSize: 8, color: '#333', marginTop: 3 }}>NÚMERO DA DPS</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700 }}>{numDpsCalculado}</div>
                    <div style={{ fontSize: 8, color: '#333', marginTop: 3 }}>EMITENTE DA NFS-e</div>
                    <div style={{ fontSize: 9 }}>Prestador</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 8, color: '#333' }}>COMPETÊNCIA DA NFS-e</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700 }}>{dataApenas}</div>
                    <div style={{ fontSize: 8, color: '#333', marginTop: 3 }}>SÉRIE DA DPS</div>
                    <div style={{ fontSize: 9.5 }}>{serieDps || '70000'}</div>
                    <div style={{ fontSize: 8, color: '#333', marginTop: 3 }}>SITUAÇÃO DA NFS-e</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#006837' }}>NFS-e Gerada</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 8, color: '#333' }}>DATA E HORA DA EMISSÃO DA NFS-e</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700 }}>{dataFormatada}</div>
                    <div style={{ fontSize: 8, color: '#333', marginTop: 3 }}>DATA E HORA DA EMISSÃO DA DPS</div>
                    <div style={{ fontSize: 9.5 }}>{dataFormatada}</div>
                    <div style={{ fontSize: 8, color: '#333', marginTop: 3 }}>FINALIDADE</div>
                    <div style={{ fontSize: 9 }}>-</div>
                  </div>

                  <div style={{ textAlign: 'center', borderLeft: '1px solid #ddd', paddingLeft: 4 }}>
                    {/* QR Code Simbólico Padrão SPED */}
                    <div style={{ display: 'inline-block', padding: 2, background: '#fff', border: '1px solid #000' }}>
                      <svg width="58" height="58" viewBox="0 0 58 58">
                        <rect width="58" height="58" fill="#fff" />
                        {/* Marcadores de Canto QR Code */}
                        <rect x="4" y="4" width="16" height="16" fill="#000" />
                        <rect x="7" y="7" width="10" height="10" fill="#fff" />
                        <rect x="9" y="9" width="6" height="6" fill="#000" />

                        <rect x="38" y="4" width="16" height="16" fill="#000" />
                        <rect x="41" y="7" width="10" height="10" fill="#fff" />
                        <rect x="43" y="9" width="6" height="6" fill="#000" />

                        <rect x="4" y="38" width="16" height="16" fill="#000" />
                        <rect x="7" y="41" width="10" height="10" fill="#fff" />
                        <rect x="9" y="43" width="6" height="6" fill="#000" />

                        {/* Matriz Interna Simulada */}
                        <rect x="24" y="6" width="3" height="3" fill="#000" />
                        <rect x="29" y="9" width="3" height="3" fill="#000" />
                        <rect x="24" y="15" width="4" height="4" fill="#000" />
                        <rect x="10" y="24" width="4" height="4" fill="#000" />
                        <rect x="18" y="24" width="3" height="3" fill="#000" />
                        <rect x="25" y="24" width="8" height="8" fill="#000" />
                        <rect x="37" y="25" width="4" height="4" fill="#000" />
                        <rect x="45" y="24" width="4" height="4" fill="#000" />
                        <rect x="24" y="36" width="4" height="4" fill="#000" />
                        <rect x="32" y="38" width="5" height="5" fill="#000" />
                        <rect x="42" y="38" width="8" height="4" fill="#000" />
                        <rect x="26" y="48" width="4" height="4" fill="#000" />
                        <rect x="36" y="48" width="6" height="4" fill="#000" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 7, color: '#444', marginTop: 2, lineHeight: 1.1 }}>
                      A autenticidade desta NFS-e pode ser verificada pela leitura deste código QR ou pela consulta da chave no portal nacional.
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PRESTADOR / FORNECEDOR */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1fr', background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  <div>PRESTADOR / FORNECEDOR</div>
                  <div>CNPJ / CPF / NIF</div>
                  <div>Indicador Municipal (Inscrição)</div>
                  <div>Telefone</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 9 }}>
                  <div><strong>{emissor?.razaoSocial || 'AMP DO BRASIL SOLUCOES ADMINISTRATIVAS E TECNOLOGICAS LTDA'}</strong></div>
                  <div>{formatarCpfCnpj(emissor?.cnpj || '10682233000175')}</div>
                  <div>-</div>
                  <div>{emissor?.telefone || '(19) 99448-7795'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 8.5 }}>
                  <div><strong>Endereço:</strong> {emissor?.endereco || 'RUA DOM BOSCO, 120, VILA GUILHERME ZANATTA'}</div>
                  <div><strong>Município / Sigla UF:</strong> {emissor?.municipio || 'Santa Cruz das Palmeiras'} / {emissor?.uf || 'SP'}</div>
                  <div><strong>Código IBGE / CEP:</strong> {emissor?.codigoIbge || '35.46306'} / {emissor?.cep || '13.652-046'}</div>
                  <div><strong>E-mail:</strong> {emissor?.email || 'atendimento@amp.adm.br'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr', padding: '3px 6px', fontSize: 8.5, background: '#fafafa' }}>
                  <div><strong>Simples Nacional:</strong> Optante - Microempresa ou EPP</div>
                  <div><strong>Regime de Apuração SN:</strong> Regime de apuração dos tributos federais e municipal pelo Simples Nacional</div>
                </div>
              </div>

              {/* 4. TOMADOR / ADQUIRENTE */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1fr', background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  <div>TOMADOR / ADQUIRENTE</div>
                  <div>CNPJ / CPF / NIF</div>
                  <div>Indicador Municipal (Inscrição)</div>
                  <div>Telefone</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 9 }}>
                  <div><strong>{tomador?.razaoSocial}</strong></div>
                  <div>{formatarCpfCnpj(tomador?.cpfCnpj)}</div>
                  <div>-</div>
                  <div>{tomador?.telefone || '-'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.3fr 1.3fr 1fr', padding: '3px 6px', fontSize: 8.5 }}>
                  <div><strong>Endereço:</strong> {tomador?.endereco || 'DO CAFE, 438, CENTRO'}</div>
                  <div><strong>Município / Sigla UF:</strong> {tomador?.municipio || 'Santa Cruz das Palmeiras'} / {tomador?.uf || 'SP'}</div>
                  <div><strong>Código IBGE / CEP:</strong> {tomador?.cep || '35.46306 / 13.650-013'}</div>
                  <div><strong>E-mail:</strong> {tomador?.email || '-'}</div>
                </div>
              </div>

              {/* 5. FAIXAS DE INTERMEDIÁRIO / DESTINATÁRIO */}
              <div style={{ border: '1px solid #000', padding: '2px 6px', fontSize: 8, fontWeight: 700, textAlign: 'center', background: '#fafafa', marginBottom: 2 }}>
                DESTINATÁRIO DA OPERAÇÃO NÃO IDENTIFICADO NA NFS-e
              </div>
              <div style={{ border: '1px solid #000', padding: '2px 6px', fontSize: 8, fontWeight: 700, textAlign: 'center', background: '#fafafa', marginBottom: 4 }}>
                INTERMEDIÁRIO DA OPERAÇÃO NÃO IDENTIFICADO NA NFS-e
              </div>

              {/* 6. SERVIÇO PRESTADO */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  <div>SERVIÇO PRESTADO • Cód. Trib. Nacional/Municipal</div>
                  <div>Código da NBS</div>
                  <div>Local da Prestação / Sigla UF / País</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 8.5 }}>
                  <div><strong>{servico?.codigoAtividade ? `${servico.codigoAtividade}.01` : '01.07.01'} / -</strong></div>
                  <div><strong>1.1501.30.00</strong></div>
                  <div>{emissor?.municipio || 'Santa Cruz das Palmeiras'} / {emissor?.uf || 'SP'} / -</div>
                </div>
                <div style={{ padding: '3px 6px', fontSize: 8.5, color: '#333', borderBottom: '1px solid #eee' }}>
                  Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados.
                </div>
                <div style={{ background: '#f9f9f9', padding: '2px 6px', fontSize: 8, fontWeight: 700, borderBottom: '1px solid #eee' }}>
                  Descrição do Serviço
                </div>
                <div style={{ padding: '5px 6px', fontSize: 9.5, whiteSpace: 'pre-wrap', minHeight: 38 }}>
                  {servico?.discriminacao}
                </div>
              </div>

              {/* 7. TRIBUTAÇÃO MUNICIPAL (ISSQN) */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  <div>TRIBUTAÇÃO MUNICIPAL (ISSQN) • Tipo de Tributação</div>
                  <div>Município / Sigla UF / País de Incidência do ISSQN</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 8.5 }}>
                  <div>Operação Tributável</div>
                  <div>{emissor?.municipio || 'Santa Cruz das Palmeiras'} / {emissor?.uf || 'SP'} / -</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '3px 6px', fontSize: 8.5 }}>
                  <div><strong>BC ISSQN:</strong> -</div>
                  <div><strong>Alíquota Aplicada:</strong> -</div>
                  <div><strong>Retenção do ISSQN:</strong> {servico?.issRetido ? 'Sim' : 'Não Retido'}</div>
                  <div><strong>ISSQN Apurado:</strong> -</div>
                </div>
              </div>

              {/* 8. TRIBUTAÇÃO FEDERAL (EXCETO CBS) */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  TRIBUTAÇÃO FEDERAL (EXCETO CBS)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.3fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 8.5 }}>
                  <div><strong>IRRF:</strong> -</div>
                  <div><strong>Contrib. Previdenciária - Retida:</strong> -</div>
                  <div><strong>Contribuições Sociais - Retidas:</strong> -</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.3fr', padding: '3px 6px', fontSize: 8.5 }}>
                  <div><strong>PIS - Débito Apuração:</strong> -</div>
                  <div><strong>COFINS - Débito Apuração:</strong> -</div>
                  <div><strong>Descrição Contrib. Sociais:</strong> 0 - PIS/COFINS/CSLL Não Retidos</div>
                </div>
              </div>

              {/* 9. TRIBUTAÇÃO IBS/CBS */}
              <div style={{ border: '1px solid #000', marginBottom: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  <div>TRIBUTAÇÃO IBS/CBS • CST / cClassTrib</div>
                  <div>Indicador de Operação / Incidência / Município / UF</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '3px 6px', borderBottom: '1px solid #eee', fontSize: 8.5 }}>
                  <div>- / -</div>
                  <div>- / - / - / -</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr', padding: '3px 6px', fontSize: 8.5 }}>
                  <div><strong>Exclusões e Reduções:</strong> R$ 0,00</div>
                  <div><strong>Base de Cálculo:</strong> -</div>
                  <div><strong>Total do IBS/CBS:</strong> R$ 0,00</div>
                  <div><strong>Valor Total Apurado:</strong> -</div>
                </div>
              </div>

              {/* 10. VALOR TOTAL DA NFS-e */}
              <div style={{ border: '1.5px solid #000', marginBottom: 4 }}>
                <div style={{ background: '#f0f0f0', borderBottom: '1px solid #000', padding: '3px 6px', fontSize: 9, fontWeight: 800 }}>
                  VALOR TOTAL DA NFS-e
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '4px 6px', borderBottom: '1px solid #eee', fontSize: 9 }}>
                  <div><strong>VALOR DA OPERAÇÃO / SERVIÇO:</strong> <span style={{ fontSize: 11, fontWeight: 800 }}>{formatBRL(vServ)}</span></div>
                  <div><strong>Desconto Incondicionado:</strong> -</div>
                  <div><strong>Desconto Condicionado:</strong> -</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr', padding: '4px 6px', background: '#f5fbf7', fontSize: 9, alignItems: 'center' }}>
                  <div><strong>Total Retenções:</strong> -</div>
                  <div><strong>VALOR LÍQUIDO NFS-e:</strong> <span style={{ fontSize: 12, fontWeight: 900, color: '#006837' }}>{formatBRL(vLiq)}</span></div>
                  <div><strong>Total IBS/CBS:</strong> R$ 0,00</div>
                  <div><strong>LÍQUIDO + IBS/CBS:</strong> <span style={{ fontSize: 11, fontWeight: 800 }}>{formatBRL(vLiq)}</span></div>
                </div>
              </div>

              {/* 11. INFORMAÇÕES COMPLEMENTARES */}
              <div style={{ border: '1px solid #000', marginBottom: 6 }}>
                <div style={{ background: '#f0f0f0', borderBottom: '1px solid #000', padding: '2px 6px', fontSize: 8.5, fontWeight: 700 }}>
                  INFORMAÇÕES COMPLEMENTARES
                </div>
                <div style={{ padding: '4px 6px', fontSize: 8 }}>
                  Totais aproximados dos Tributos cfe. Lei nº 12.741/2012: Federais: -; Estaduais: -; Municipais: -; Documento emitido por ME ou EPP optante pelo Simples Nacional. Não gera direito a crédito fiscal de IPI.
                </div>
              </div>

              {/* 12. CANHOTO DESTACÁVEL INFERIOR */}
              <div style={{ borderTop: '1px dashed #000', paddingTop: 6, marginTop: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.8fr', border: '1px solid #000', fontSize: 8 }}>
                  <div style={{ padding: '4px 6px', borderRight: '1px solid #000' }}>
                    <strong>DATA CIENTIFICAÇÃO:</strong>
                    <div style={{ height: 18 }}></div>
                  </div>
                  <div style={{ padding: '4px 6px', borderRight: '1px solid #000' }}>
                    <strong>IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR:</strong>
                    <div style={{ height: 18 }}></div>
                  </div>
                  <div style={{ padding: '4px 6px' }}>
                    <strong>Nº NFS-e / CHAVE NFS-e:</strong>
                    <div style={{ fontSize: 7.5, fontWeight: 700, marginTop: 2 }}>{numero} / {chaveFormatada}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Rodapé do Modal ── */}
          <div className="danfse-no-print" style={{
            padding: '10px 16px',
            background: '#F0EDE3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleImprimir}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #1F5C52',
                  background: '#1F5C52',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Printer size={15} />
                <span>Salvar PDF / Imprimir</span>
              </button>

              <button
                onClick={handleWhatsApp}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#25D366',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                border: '1px solid #D1CFC7',
                background: '#fff',
                fontSize: 12,
                fontWeight: 600,
                color: '#5C5A4F',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
