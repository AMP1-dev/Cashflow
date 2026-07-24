import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, X, Calendar, HelpCircle, AlertTriangle } from 'lucide-react';
import { formatBRL } from '../utils/formatters';
import { MESES } from '../utils/constants';
import { ConceitoAjudaModal } from './ConceitoAjudaModal';

export function CalculadoraRH({ mesAtual, anoAtual, empresaId, onClose }) {
  const getStorage = (key, defaultVal) => {
    const val = localStorage.getItem(`rh_calc_${empresaId}_${key}`);
    return val !== null ? val : defaultVal;
  };

  const [salarioBrutoStr, setSalarioBrutoStr] = useState(() => getStorage('salario', '1000'));
  const [regime, setRegime] = useState(() => getStorage('regime', 'simples'));
  const [feriados, setFeriados] = useState(() => Number(getStorage('feriados', 0)));
  const [horasDia, setHorasDia] = useState(() => Number(getStorage('horasDia', 7.33)));
  const [horasNaoTrabalhadas, setHorasNaoTrabalhadas] = useState(() => Number(getStorage('pausas', 1)));
  const [horasOciosas, setHorasOciosas] = useState(() => Number(getStorage('ociosidade', 1.0)));
  const [escala, setEscala] = useState(() => getStorage('escala', '6x1'));
  const [isAjudaOpen, setIsAjudaOpen] = useState(false);
  
  const [diasNoMes, setDiasNoMes] = useState(30);
  const [sabados, setSabados] = useState(0);
  const [domingos, setDomingos] = useState(0);
  
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
  }, [mesAtual, anoAtual]);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(`rh_calc_${empresaId}_salario`, salarioBrutoStr);
    localStorage.setItem(`rh_calc_${empresaId}_regime`, regime);
    localStorage.setItem(`rh_calc_${empresaId}_feriados`, feriados);
    localStorage.setItem(`rh_calc_${empresaId}_horasDia`, horasDia);
    localStorage.setItem(`rh_calc_${empresaId}_pausas`, horasNaoTrabalhadas);
    localStorage.setItem(`rh_calc_${empresaId}_ociosidade`, horasOciosas);
    localStorage.setItem(`rh_calc_${empresaId}_escala`, escala);
  }, [empresaId, salarioBrutoStr, regime, feriados, horasDia, horasNaoTrabalhadas, horasOciosas, escala]);

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
    const trabalhaSab = escala === '6x1';
    const diasInativos = (trabalhaSab ? 0 : sabados) + domingos + feriados;
    const diasUteis = Math.max(diasNoMes - diasInativos, 0);

    const horasProdutivas = horasDia - horasNaoTrabalhadas;
    const custoDia = diasUteis > 0 ? (totalSalario + encargoSoma) / diasUteis : 0;
    const custoHora = horasProdutivas > 0 ? custoDia / horasProdutivas : 0;
    const custoMinuto = custoHora / 60;
    
    // Cálculo do Prejuízo por Ociosidade (Horas Paradas)
    const prejuizoOciosidadeDia = Math.max(horasOciosas, 0) * custoHora;
    const prejuizoOciosidadeMes = prejuizoOciosidadeDia * diasUteis;

    // Salvar custoHora e custoMinuto globalmente
    localStorage.setItem(`amp_rh_custos_${empresaId}`, JSON.stringify({ custoHora, custoMinuto, prejuizoOciosidadeMes }));
    
    return {
      baseCalculo, ferias112, ferias13, decimoTerceiro, totalBase,
      fgts8, fgtsMulta, totalSalario, pctAumento,
      totalEncargosPct, encargoSoma,
      diasUteis, custoDia, custoHora, horasProdutivas,
      prejuizoOciosidadeDia, prejuizoOciosidadeMes
    };
  }, [salarioBruto, regime, diasNoMes, sabados, domingos, feriados, horasDia, horasNaoTrabalhadas, horasOciosas, escala, empresaId]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#FAF8F3', borderRadius: 16, width: '100%', maxWidth: 900, maxHeight: '95vh', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #EFEBE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1C2421', fontWeight: 600, fontSize: 18 }}>
            <Calculator size={22} color="#1F5C52" />
            <span>Cálculo de Hora Técnica (RH)</span>
            <button
              onClick={() => setIsAjudaOpen(true)}
              style={{ background: '#E6F4F1', border: '1px solid #B8E0D7', borderRadius: 8, padding: '4px 10px', color: '#1F5C52', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
            >
              <HelpCircle size={15} />
              <span>Guia Conceitual</span>
            </button>
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
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 12 }}>
                  <span>Base de Cálculo</span>
                  <span>{formatBRL(calc.baseCalculo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 12 }}>
                  <span>Férias 1/12</span>
                  <span>{formatBRL(calc.ferias112)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 12 }}>
                  <span>Terço de Férias 1/3</span>
                  <span>{formatBRL(calc.ferias13)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 12 }}>
                  <span>13º Salário 1/12</span>
                  <span>{formatBRL(calc.decimoTerceiro)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid #EFEBE0', paddingTop: 6, marginTop: 2 }}>
                  <span>Subtotal</span>
                  <span>{formatBRL(calc.totalBase)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 12 }}>
                  <span>FGTS 8%</span>
                  <span>{formatBRL(calc.fgts8)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F', fontSize: 12 }}>
                  <span>Multa Rescisória (FGTS 40%)</span>
                  <span>{formatBRL(calc.fgtsMulta)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1F5C52', borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4, fontSize: 14 }}>
                  <span>Salário + Provisões Base</span>
                  <span>{formatBRL(calc.totalSalario)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', overflow: 'hidden' }}>
              <div style={{ background: '#F5F2E8', padding: '10px 16px', fontWeight: 600, fontSize: 13, color: '#5C5A4F', textAlign: 'center', textTransform: 'uppercase' }}>
                Encargos Sociais Adicionais ({calc.totalEncargosPct.toFixed(1)}%)
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                {regime === 'lucro' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>INSS Patronal (20%)</span><span>20,00%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Salário Educação (2,5%)</span><span>2,50%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seguro Acidente (RAT)</span><span>3,00%</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9C9A8F' }}><span>SESI/SENAI/SEBRAE/INCRA</span><span>3,30%</span></div>
                  </>
                ) : regime === 'mei' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>INSS Patronal (MEI)</span><span>3,00%</span></div>
                ) : (
                  <div style={{ color: '#9C9A8F', textAlign: 'center', padding: '4px 0' }}>Empresas do Simples Nacional não possuem encargos adicionais sobre a folha.</div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#B05A2E', borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4, fontSize: 14 }}>
                  <span>Custo Encargos (R$)</span><span>{formatBRL(calc.encargoSoma)}</span>
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
                  <span>Escala Semanal</span>
                  <div style={{ display: 'flex', gap: 4, background: '#EFEBE0', padding: 3, borderRadius: 8 }}>
                    <button 
                      onClick={() => setEscala('6x1')} 
                      style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', background: escala === '6x1' ? '#fff' : 'transparent', color: escala === '6x1' ? '#1F5C52' : '#9C9A8F', boxShadow: escala === '6x1' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
                      6x1
                    </button>
                    <button 
                      onClick={() => setEscala('5x2')} 
                      style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', background: escala === '5x2' ? '#fff' : 'transparent', color: escala === '5x2' ? '#1F5C52' : '#9C9A8F', boxShadow: escala === '5x2' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
                      5x2
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9C9A8F' }}>
                  <span>Sábados ({escala === '6x1' ? 'Trabalhados' : 'Folga'})</span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#B05A2E' }}>
                    <span>Horas inativas / ociosas por dia</span>
                    <input type="number" step="0.1" min="0" value={horasOciosas} onChange={e => setHorasOciosas(Number(e.target.value))} style={{ width: 60, textAlign: 'right', padding: '4px', border: '1px solid #E8C896', borderRadius: 6, fontWeight: 600, background: '#FFFDF9' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid #EFEBE0', paddingTop: 8, marginTop: 4 }}>
                    <span>Horas Produtivas / dia</span>
                    <span style={{ color: '#1F5C52' }}>{calc.horasProdutivas.toFixed(2)}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Card: Custo Hora Técnica */}
            <div style={{ background: '#0F2B27', borderRadius: 12, overflow: 'hidden', color: '#FAF8F3', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#9FBDB5', textTransform: 'uppercase' }}>Custo Total por Dia</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#CFEEE2' }}>{formatBRL(calc.custoDia)}</div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
                  <div style={{ fontSize: 13, color: '#9FBDB5', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Custo da Hora Técnica</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#9FE0C8', fontFamily: 'Georgia, serif' }}>{formatBRL(calc.custoHora)}</div>
                  <div style={{ fontSize: 11, color: '#9FBDB5', marginTop: 4 }}>Esse valor agora pode ser usado nas suas Fichas Técnicas.</div>
                </div>
              </div>
            </div>

            {/* Card Simulador de Ociosidade & Prejuízo */}
            <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9B2C2C', fontWeight: 700, fontSize: 13 }}>
                <AlertTriangle size={18} color="#E53E3E" />
                <span>Simulador de Prejuízo por Ociosidade</span>
              </div>
              <div style={{ fontSize: 12, color: '#742A2A', lineHeight: 1.4 }}>
                Se o funcionário ficar inativo <strong>{horasOciosas}h/dia</strong> (sem produzir):
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FED7D7', paddingTop: 8, marginTop: 2 }}>
                <span style={{ fontSize: 12, color: '#9B2C2C' }}>Prejuízo Direto/Dia:</span>
                <strong style={{ fontSize: 14, color: '#C53030' }}>{formatBRL(calc.prejuizoOciosidadeDia)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9B2C2C' }}>Prejuízo Acumulado/Mês:</span>
                <strong style={{ fontSize: 18, color: '#9B2C2C', fontWeight: 800 }}>{formatBRL(calc.prejuizoOciosidadeMes)}</strong>
              </div>
              <div style={{ fontSize: 11, color: '#9B2C2C', opacity: 0.85, fontStyle: 'italic', marginTop: 2 }}>
                💡 Reduzir {horasOciosas}h de ociosidade gera uma economia de {formatBRL(calc.prejuizoOciosidadeMes)}/mês no caixa da empresa.
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
              Fechar e Salvar
            </button>
          </div>
        </div>

      </div>

      <ConceitoAjudaModal
        isOpen={isAjudaOpen}
        onClose={() => setIsAjudaOpen(false)}
        titulo="Cálculo do Custo da Hora Técnica (RH) & Ociosidade"
        conceito="O Custo da Hora Técnica representa quanto cada hora trabalhada de um colaborador custa de fato para a empresa, incluindo salário base, férias, 13º, FGTS, provisões rescisórias e encargos sociais."
        porQueImporta="Sem saber o custo real da hora do colaborador, a empresa corre o risco de vender serviços ou produtos com prejuízo disfarçado, além de ignorar quanto dinheiro é perdido quando o funcionário fica parado sem produzir."
        exemplo={`• Salário + Provisões + Encargos: R$ 2.789,27/mês\n• Dias úteis no mês: 26 dias\n• Horas produtivas/dia: 5,03 horas\n➜ Custo por Hora Técnica = R$ 21,33/hora\n\n🔴 Impacto da Ociosidade: Se o colaborador fica 1 hora parado por dia sem produzir, o prejuízo acumulado no mês é de 26 dias x R$ 21,33 = R$ 554,58 de perda direta no caixa.`}
      />
    </div>
  );
}
