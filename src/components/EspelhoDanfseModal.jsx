import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle, ShieldCheck, Printer, X, ExternalLink, 
  Building2, User, Calendar, Hash, KeyRound, MessageCircle 
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { formatarCpfCnpj, gerarLinkWhatsAppNfse } from '../utils/nfseService';
import { MESES } from '../utils/constants';

export function EspelhoDanfseModal({ nota, empresa, onClose }) {
  if (!nota) return null;

  const {
    numero,
    codigoVerificacao,
    dataEmissao,
    competenciaMes,
    competenciaAno,
    emissor,
    tomador,
    servico,
    ambiente,
    certificadoInfo
  } = nota;

  const dataFormatada = new Date(dataEmissao).toLocaleString('pt-BR');
  const compLabel = `${MESES[competenciaMes] || ''} de ${competenciaAno}`;

  function handleImprimir() {
    window.print();
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
    a.download = `NFSe_${numero}_${tomador.razaoSocial.replace(/\s+/g, '_')}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 43, 39, 0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 12
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 680,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        {/* Barra superior de Ações */}
        <div style={{
          background: '#0F2B27',
          padding: '12px 18px',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color="#9FE0C8" />
            <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.2 }}>
              DANFSE • Documento Auxiliar da NFS-e
            </span>
            <span style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              background: ambiente === 'producao' ? '#1F5C52' : '#8A6D1A',
              color: '#fff',
              fontWeight: 700
            }}>
              {ambiente === 'producao' ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={handleWhatsApp}
              title="Compartilhar no WhatsApp do Cliente"
              style={{
                background: '#25D366',
                border: 'none',
                borderRadius: 8,
                padding: '6px 11px',
                color: '#fff',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <MessageCircle size={13} /> WhatsApp
            </button>
            <button
              onClick={handleImprimir}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: 8,
                padding: '6px 10px',
                color: '#FAF8F3',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Printer size={13} /> Imprimir
            </button>
            <button
              onClick={handleDownloadXml}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: 8,
                padding: '6px 10px',
                color: '#9FE0C8',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Download size={13} /> XML
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#9FBDB5',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Corpo do Documento Fiscal (Imprimível) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#FAF8F3' }}>
          <div style={{
            background: '#fff',
            border: '1.5px solid #1C2421',
            borderRadius: 6,
            padding: 16,
            fontSize: 12,
            color: '#1C2421',
            fontFamily: 'Arial, sans-serif'
          }}>
            {/* Cabeçalho Oficial */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 1.2fr',
              borderBottom: '1.5px solid #1C2421',
              paddingBottom: 12,
              marginBottom: 12
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
                  NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e
                </div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                  Padrão Nacional • Ambiente de Dados Nacional (ADN)
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4 }}>
                  Município de {emissor.municipio} - {emissor.uf}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#555' }}>Número da Nota</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0F2B27' }}>
                  Nº {numero}
                </div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                  Emissão: {dataFormatada}
                </div>
              </div>
            </div>

            {/* Código de Verificação e Competência */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#F5F5F0',
              padding: '8px 12px',
              borderRadius: 4,
              marginBottom: 12,
              border: '1px solid #DDD'
            }}>
              <div>
                <span style={{ fontSize: 10.5, color: '#666' }}>CÓDIGO DE VERIFICAÇÃO: </span>
                <strong style={{ fontSize: 12, letterSpacing: 0.5, color: '#1C2421' }}>{codigoVerificacao}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10.5, color: '#666' }}>COMPETÊNCIA: </span>
                <strong style={{ fontSize: 12, color: '#1C2421' }}>{compLabel}</strong>
              </div>
            </div>

            {/* Prestador de Serviços (Emitente) */}
            <div style={{ border: '1px solid #CCC', borderRadius: 4, padding: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1F5C52', borderBottom: '1px solid #EEE', paddingBottom: 4, marginBottom: 6 }}>
                PRESTADOR DE SERVIÇOS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 6 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{emissor.razaoSocial}</div>
                  <div style={{ fontSize: 11, color: '#555' }}>CNPJ: {formatarCpfCnpj(emissor.cnpj)}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: '#555' }}>
                  <div>Regime: <strong>{emissor.regime?.toUpperCase()}</strong></div>
                  <div>{emissor.municipio} - {emissor.uf}</div>
                </div>
              </div>
            </div>

            {/* Tomador de Serviços (Cliente) */}
            <div style={{ border: '1px solid #CCC', borderRadius: 4, padding: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1F5C52', borderBottom: '1px solid #EEE', paddingBottom: 4, marginBottom: 6 }}>
                TOMADOR DE SERVIÇOS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 6 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{tomador.razaoSocial}</div>
                  <div style={{ fontSize: 11, color: '#555' }}>CPF/CNPJ: {formatarCpfCnpj(tomador.cpfCnpj)}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: '#555' }}>
                  {tomador.email && <div>{tomador.email}</div>}
                  <div>{tomador.municipio || emissor.municipio} - {tomador.uf || emissor.uf}</div>
                </div>
              </div>
            </div>

            {/* Discriminação dos Serviços */}
            <div style={{ border: '1px solid #CCC', borderRadius: 4, padding: 10, marginBottom: 12, minHeight: 90 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1F5C52', borderBottom: '1px solid #EEE', paddingBottom: 4, marginBottom: 6 }}>
                DISCRIMINAÇÃO DOS SERVIÇOS
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: '#1C2421' }}>
                {servico.discriminacao}
              </div>
              <div style={{ marginTop: 10, fontSize: 10.5, color: '#777', borderTop: '1px dashed #DDD', paddingTop: 6 }}>
                Atividade / Item LC 116: {servico.codigoAtividade}
              </div>
            </div>

            {/* Valores e Tributos */}
            <div style={{ border: '1.5px solid #1C2421', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#F5F5F0', padding: 8, textAlign: 'center', borderBottom: '1px solid #CCC' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#666' }}>Valor dos Serviços</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{formatBRL(servico.valorTotal)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#666' }}>Alíquota ISS</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{servico.aliquotaIss ? `${servico.aliquotaIss}%` : '0%'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#666' }}>Valor do ISS</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{formatBRL(servico.valorIss)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#666' }}>ISS Retido</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{servico.issRetido ? 'Sim' : 'Não'}</div>
                </div>
              </div>
              <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EAF4F0' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2B27' }}>VALOR LÍQUIDO DA NFS-e</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0F2B27', fontFamily: 'Georgia, serif' }}>
                  {formatBRL(servico.valorLiquido)}
                </span>
              </div>
            </div>

            {/* Rodapé de Autenticidade Digital */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#666' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={14} color="#1F5C52" />
                <span>Assinado digitalmente via Certificado ICP-Brasil ({certificadoInfo?.arquivo || 'A1'})</span>
              </div>
              <span>Emitido via AMP Flow Fiscal</span>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div style={{ padding: '12px 18px', background: '#F0EDE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleWhatsApp}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#25D366',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              boxShadow: '0 2px 6px rgba(37, 211, 102, 0.35)'
            }}
          >
            <MessageCircle size={17} />
            <span>Enviar no WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1px solid #D1CFC7',
              background: '#fff',
              fontSize: 13,
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
  );
}
