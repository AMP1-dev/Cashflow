import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, X, Calendar } from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { MESES } from '../utils/constants';

export function CalculadoraRH({ mesAtual, anoAtual, onClose, onUsarValor }) {
  const [salarioBrutoStr, setSalarioBrutoStr] = useState('1000');
  
  // Parametros fixos conforme planilha
  const horasMensal = 183.33; // Mensalista 220h, mas aqui na planilha deu 183,33 horas total.
  
  // Novo: Regime Tributário
  const [regime, setRegime] = useState('simples'); // 'mei', 'simples', 'lucro'
  
  // Parametros de Tempo
  const [diasNoMes, setDiasNoMes] = useState(30);
  const [sabados, setSabados] = useState(0);
  const [domingos, setDomingos] = useState(0);
  const [feriados, setFeriados] = useState(0);
  
  const [horasDia, setHorasDia] = useState(7.33);
  const [horasNaoTrabalhadas, setHorasNaoTrabalhadas] = useState(1);
  const [trabalhaSabado, setTrabalhaSabado] = useState(false);
  
  const [tempoProducaoMinutosStr, setTempoProducaoMinutosStr] = useState('60');
  
  // Ao montar ou mudar o mês, calcula os dias do mês, sábados e domingos
  useEffect(() => {
    if (mesAtual === undefined || anoAtual === undefined) return;
    
    const d = new Date(anoAtual, mesAtual + 1, 0); // Último dia do mês
    const totalDias = d.getDate();
    setDiasNoMes(totalDias);
    
    let contaSab = 0;
    let contaDom = 0;
    
    for (let dia = 1; dia <= totalDias; dia++) {
      const data = new Date(anoAtual, mesAtual, dia);
      const diaSemana = data.getDay();
      if (diaSemana === 6) contaSab++;
      else if (diaSemana === 0) contaDom++;
    }
    
    setSabados(contaSab);
    setDomingos(contaDom);
    setFeriados(0); // Zera feriados ao mudar o mês
  }, [mesAtual, anoAtual]);

  const salarioBruto = parseFloat(salarioBrutoStr) || 0;
  
  const calc = useMemo(() => {
    // CÁLCULO salário
    const baseCalculo = salarioBruto;
    const ferias112 = baseCalculo / 12;
    const ferias13 = ferias112 / 3;
    const decimoTerceiro = baseCalculo / 12;
    const totalBase = baseCalculo + ferias112 + ferias13 + decimoTerceiro;
    
    const fgts8 = totalBase * 0.08;
    const fgtsMulta = fgts8 * 0.40;
    const totalSalario = totalBase + fgts8 + fgtsMulta;
    const pctAumento = salarioBruto > 0 ? ((totalSalario / salarioBruto) - 1) * 100 : 0;

    // ENCARGOS SOCIAIS baseados no Regime
    let totalEncargosPct = 0;
    let encargoSoma = 0;
    
    if (regime === 'lucro') {
      // SA / Lucro Real / Lucro Presumido
      totalEncargosPct = 28.80; // INSS 20% + RAT 3% + Terceiros 5.8%
    } else if (regime === 'mei') {
      // MEI paga 3% INSS Patronal
      totalEncargosPct = 3.00;
    } else {
      // Simples Nacional Anexo I, II, III não paga INSS Patronal
      totalEncargosPct = 0.00;
    }
    
    encargoSoma = (totalSalario * (totalEncargosPct / 100));

    // Dias Úteis e Horas
    const diasInativos = (trabalhaSabado ? 0 : sabados) + domingos + feriados;
    const diasUteis = Math.max(diasNoMes - diasInativos, 0);

    const horasProdutivas = horasDia - horasNaoTrabalhadas;
    const custoDia = diasUteis > 0 ? (totalSalario + encargoSoma) / diasUteis : 0;
    const custoHora = horasProdutivas > 0 ? custoDia / horasProdutivas : 0;
    
    const tempoProducaoMinutos = parseFloat(tempoProducaoMinutosStr) || 0;
    const custoMinuto = custoHora / 60;
    const custoServico = tempoProducaoMinutos * custoMinuto;
    
    return {
      baseCalculo, ferias112, ferias13, decimoTerceiro, totalBase,
      fgts8, fgtsMulta, totalSalario, pctAumento,
      totalEncargosPct, encargoSoma,
      diasUteis, custoDia, custoHora, horasProdutivas,
      custoServico
    };
  }, [salarioBruto, regime, diasNoMes, sabados, domingos, feriados, horasDia, horasNaoTrabalhadas, trabalhaSabado, tempoProducaoMinutosStr]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#FAF8F3', borderRadius: 16, width: '100%', maxWidth: 900, maxHeight: '95vh', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #EFEBE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1C2421', fontWeight: 600, fontSize: 18 }}>
            <Calculator size={22} color="#1F5C52" />
            Cálculo de Hora Técnica (RH)
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C9A8F' }}><X size={24} /></button>
        </div>

        {/* Header com opções gerais */}
        <div style={{ padding: '16px 24px', background: '#FBF3E5', borderBottom: '1px solid #E8C896', display: 'flex', gap: 24, alignItems: 'center' }}>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8A6D1A', marginBottom: 6, textTransform: 'uppercase' }}>Regime Tributário da Empresa</div>
            <select value={regime} onChange={e => setRegime(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E8C896', background: '#fff', fontSize: 14, fontWeight: 500, color: '#1C2421' }}>
              <option value="simples">Simples Nacional (Sem INSS Patronal)</option>
              <option value="mei">MEI (3% INSS Patronal)</option>
              <option value="lucro">Lucro Presumido/Real / SA (~28,8% INSS Patronal)</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8A6D1A', marginBottom: 6, textTransform: 'uppercase' }}>Período Base</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 8, color: '#5C5A4F', fontSize: 14, fontWeight: 500 }}>
              <Calendar size={18} />
              {MESES[mesAtual]} de {anoAtual} ({diasNoMes} dias)
            </div>
          </div>
        </div>

        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          {/* Lado Esquerdo - Cálculos e Encargos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', overflow: 'hidden' }}>
              <div style={{ background: '#F5F2E8', padding: '10px 16px', fontWeight: 600, fontSize: 13, color: '#5C5A4F', textAlign: 'center', textTransform: 'uppercase' }}>Cálculo do Salário e Provisões</div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Valor Salário Bruto (Mês)</span>
                  <input type="number" value={salarioBrutoStr} onChange={e => setSalarioBrutoStr(e.target.value)} style={{ width: 100, textAlign: 'right', padding: '4px 8px', border: '1px solid #D1CFC7', borderRadius: 6, fontWeight: 600 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4 }}>
                  <span>Base de Cálculo</span><span>{formatBRL(calc.baseCalculo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5C5A4F' }}><span>Férias 1/12</span><span>{formatBRL(calc.ferias112)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5C5A4F' }}><span>Terço de Férias 1/3</span><span>{formatBRL(calc.ferias13)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5C5A4F' }}><span>13º Salário 1/12</span><span>{formatBRL(calc.decimoTerceiro)}</span></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4 }}>
                  <span>Subtotal</span><span>{formatBRL(calc.totalBase)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5C5A4F' }}><span>FGTS 8%</span><span>{formatBRL(calc.fgts8)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5C5A4F' }}><span>Multa Rescisória (FGTS 40%)</span><span>{formatBRL(calc.fgtsMulta)}</span></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1C2421', borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4, fontSize: 14 }}>
                  <span>Salário + Provisões Base</span><span>{formatBRL(calc.totalSalario)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', overflow: 'hidden' }}>
              <div style={{ background: '#F5F2E8', padding: '10px 16px', fontWeight: 600, fontSize: 13, color: '#5C5A4F', textAlign: 'center', textTransform: 'uppercase' }}>
                Encargos Sociais Adicionais ({calc.totalEncargosPct.toFixed(1)}%)
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                {regime === 'lucro' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>INSS Patronal (20%)</span><span>20,00%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Salário Educação (2,5%)</span><span>2,50%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seguro Acidente (RAT)</span><span>3,00%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 11 }}><span>SESI/SENAI/SEBRAE/INCRA</span><span>3,30%</span></div>
                  </>
                ) : regime === 'mei' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>INSS Patronal (MEI)</span><span>3,00%</span></div>
                ) : (
                  <div style={{ color: '#9C9A8F', textAlign: 'center', padding: '4px 0' }}>Empresas do Simples Nacional não possuem encargos adicionais sobre a folha. O custo é resumido ao FGTS e provisões acima.</div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#B05A2E', borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4, fontSize: 14 }}>
                  <span>Custo Encargos (R$)</span><span>{formatBRL(calc.encargoSoma)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', overflow: 'hidden' }}>
              <div style={{ background: '#F5F2E8', padding: '10px 16px', fontWeight: 600, fontSize: 13, color: '#5C5A4F', textAlign: 'center', textTransform: 'uppercase' }}>Custo por Serviço / Produto</div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Tempo para produzir 1 item (minutos)</span>
                  <input type="number" value={tempoProducaoMinutosStr} onChange={e => setTempoProducaoMinutosStr(e.target.value)} style={{ width: 80, textAlign: 'right', padding: '4px 8px', border: '1px solid #D1CFC7', borderRadius: 6, fontWeight: 600 }} />
                </div>
                <div style={{ fontSize: 11, color: '#9C9A8F', marginTop: 2 }}>
                  Informe os minutos gastos para descobrir o custo exato da mão de obra que vai no produto final.
                </div>
              </div>
            </div>
            
          </div>

          {/* Lado Direito - Horas e Custo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', overflow: 'hidden' }}>
              <div style={{ background: '#F5F2E8', padding: '10px 16px', fontWeight: 600, fontSize: 13, color: '#5C5A4F', textAlign: 'center', textTransform: 'uppercase' }}>Jornada de Trabalho (Calculada)</div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Total de Dias no Mês</span>
                  <span style={{ fontWeight: 600 }}>{diasNoMes} dias</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9C9A8F' }}>
                  <span>Domingos</span>
                  <span>{domingos} dias</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9C9A8F' }}>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Sábados <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 11 }}><input type="checkbox" checked={trabalhaSabado} onChange={e => setTrabalhaSabado(e.target.checked)} /> Trabalha sábado</label></span>
                  <span>{sabados} dias</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Feriados / Faltas / Dispensas</span>
                  <input type="number" value={feriados} onChange={e => setFeriados(Number(e.target.value))} style={{ width: 60, textAlign: 'right', padding: '4px', border: '1px solid #D1CFC7', borderRadius: 6 }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4 }}>
                  <span>= Dias Úteis no mês</span>
                  <span style={{ color: '#1F5C52', fontSize: 14 }}>{calc.diasUteis} dias</span>
                </div>

                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #EFEBE0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Horas/dia de expediente</span>
                    <input type="number" step="0.1" value={horasDia} onChange={e => setHorasDia(Number(e.target.value))} style={{ width: 60, textAlign: 'right', padding: '4px', border: '1px solid #D1CFC7', borderRadius: 6 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Horas não trabalhadas/dia (pausas)</span>
                    <input type="number" step="0.1" value={horasNaoTrabalhadas} onChange={e => setHorasNaoTrabalhadas(Number(e.target.value))} style={{ width: 60, textAlign: 'right', padding: '4px', border: '1px solid #D1CFC7', borderRadius: 6 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4 }}>
                    <span>Horas Produtivas / dia</span>
                    <span style={{ color: '#1F5C52' }}>{calc.horasProdutivas.toFixed(2)}h</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#0F2B27', borderRadius: 12, overflow: 'hidden', color: '#FAF8F3', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#9FBDB5', textTransform: 'uppercase' }}>Custo Total por Dia</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#CFEEE2' }}>{formatBRL(calc.custoDia)}</div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                  <div style={{ fontSize: 13, color: '#9FBDB5', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Custo da Hora Técnica</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#9FE0C8', fontFamily: 'Georgia, serif' }}>{formatBRL(calc.custoHora)}</div>
                  <div style={{ fontSize: 12, color: '#9FBDB5', marginTop: 4 }}>Custo que você deve embutir na precificação base hora.</div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                  <div style={{ fontSize: 13, color: '#F5D5B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Custo do Serviço/Item</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#F0BE94', fontFamily: 'Georgia, serif' }}>{formatBRL(calc.custoServico)}</div>
                  <div style={{ fontSize: 12, color: '#E8C896', marginTop: 4 }}>Proporcional ao tempo de produção ({tempoProducaoMinutosStr} min).</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div style={{ padding: 24, background: '#fff', borderTop: '1px solid #EFEBE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ fontSize: 13, color: '#9C9A8F' }}>
            O Custo Total do funcionário para a empresa nesse mês foi de <strong style={{ color: '#1C2421' }}>{formatBRL(calc.totalSalario + calc.encargoSoma)}</strong>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #D1CFC7', background: '#fff', fontWeight: 600, color: '#5C5A4F', cursor: 'pointer' }}>
              Fechar
            </button>
            {onUsarValor && (
              <button onClick={() => onUsarValor(calc.custoServico > 0 ? calc.custoServico : calc.custoHora)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1F5C52', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Usar Valor ({formatBRL(calc.custoServico > 0 ? calc.custoServico : calc.custoHora)})
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
