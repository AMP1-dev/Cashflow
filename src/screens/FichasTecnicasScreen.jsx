import { AlertCircle, ChevronLeft, ChevronRight, Plus, Scale, X, HelpCircle, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState, FieldLabel, inputStyle, ModalShell } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { formatBRL } from '../utils/formatters';
import { ConceitoAjudaModal } from '../components/ConceitoAjudaModal';
import * as XLSX from 'xlsx';

// ---------- Constantes e cálculo (puro, sem dependência de banco) ----------

const UNIDADES_INGREDIENTE = ['kg', 'g', 'l', 'ml', 'un', 'h', 'min'];
const FATOR_PARA_BASE = { kg: 1, g: 0.001, l: 1, ml: 0.001, un: 1, h: 60, min: 1 };

function converterParaBase(quantidade, unidade) {
    const fator = FATOR_PARA_BASE[unidade] ?? 1;
    return (parseFloat(quantidade) || 0) * fator;
}

export function calcularFatorCorrecao(pesoBruto, pesoLiquido) {
    const bruto = parseFloat(pesoBruto) || 0;
    const liquido = parseFloat(pesoLiquido) || 0;
    if (bruto <= 0 || liquido <= 0) return 1;
    return bruto / liquido;
}

function calcularCustoPorBase(ing) {
    const precoCompra = parseFloat(ing.precoCompra) || 0;
    const fretePct = parseFloat(ing.pctFrete) || 0;
    const precoReal = precoCompra * (1 + (fretePct / 100));
    const qtdCompraBase = converterParaBase(ing.qtdCompra, ing.unidadeCompra);
    if (qtdCompraBase <= 0) return 0;
    return precoReal / qtdCompraBase;
}

export function calcularIngrediente(ing) {
    const brutaBase = converterParaBase(ing.qtdBruta, ing.unidadeUso || ing.unidadeCompra);
    const fator = parseFloat(ing.fatorCorrecao) || 1;
    const custoPorBase = calcularCustoPorBase(ing);
    const qtdLiquidaBase = fator > 0 ? brutaBase / fator : brutaBase;
    const custoTotal = qtdLiquidaBase * custoPorBase;
    const unidadeExibicao = ing.unidadeUso || ing.unidadeCompra || 'g';
    const qtdLiquida = unidadeExibicao === 'un' ? qtdLiquidaBase : qtdLiquidaBase / (FATOR_PARA_BASE[unidadeExibicao] ?? 1);
    return { qtdLiquida, custoTotal, custoPorBase };
}

export function calcularFicha(ficha) {
    const ingredientesCalc = (ficha.ingredientes || []).map(ing => ({ ...ing, ...calcularIngrediente(ing) }));
    const custoReceita = ingredientesCalc.reduce((s, i) => s + i.custoTotal, 0);
    const rendimento = parseFloat(ficha.rendimentoPorcoes) || 0;
    const custoPorcao = rendimento > 0 ? custoReceita / rendimento : 0;
    const margem = parseFloat(ficha.margemDesejada) || 0;
    const precoSugerido = margem < 100 ? custoPorcao / (1 - margem / 100) : 0;
    const precoVenda = parseFloat(ficha.precoVenda) || 0;
    const cmvPct = precoVenda > 0 ? (custoPorcao / precoVenda) * 100 : 0;
    return { ingredientesCalc, custoReceita, custoPorcao, precoSugerido, cmvPct };
}

export function classificarCmv(cmvPct) {
    if (cmvPct === 0) return { label: 'Sem dados', color: '#9C9A8F', bg: '#F0EDE3' };
    if (cmvPct <= 30) return { label: 'Saudável', color: '#1F5C52', bg: '#D9EBE6' };
    if (cmvPct <= 40) return { label: 'Atenção', color: '#8A6D1A', bg: '#F3EAC9' };
    return { label: 'Alto', color: '#B05A2E', bg: '#F5E4D8' };
}

function uid() { return Math.random().toString(36).slice(2, 10); }

// ---------- Mapeamento Supabase <-> formato do app ----------
// (mesmo espírito do mapeamento de lancamentos que já existe no App.jsx)

function mapearFichaDoBanco(f) {
    return {
        id: f.id,
        nome: f.nome,
        precoVenda: parseFloat(f.preco_venda) || 0,
        rendimentoPorcoes: f.rendimento_porcoes,
        margemDesejada: parseFloat(f.margem_desejada) || 0,
        pesoPorcao: f.peso_porcao ? parseFloat(f.peso_porcao) : null,
        ingredientes: f.ingredientes || [],
    };
}

function mapearFichaParaBanco(dados, empresaId) {
    return {
        empresa_id: empresaId,
        nome: dados.nome,
        preco_venda: dados.precoVenda,
        rendimento_porcoes: dados.rendimentoPorcoes,
        margem_desejada: dados.margemDesejada,
        peso_porcao: dados.pesoPorcao,
        ingredientes: dados.ingredientes,
    };
}

// ---------- Tela principal (lista + roteamento para o formulário) ----------

export function FichasTecnicasScreen({ empresaId }) {
    const [fichas, setFichas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [criando, setCriando] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        if (empresaId) carregarFichas();
    }, [empresaId]);

    async function carregarFichas() {
        setCarregando(true);
        const { data, error } = await supabase
            .from('fichas_tecnicas')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('criado_em', { ascending: false });

        if (!error && data) setFichas(data.map(mapearFichaDoBanco));
        setCarregando(false);
    }

    async function addFichaTecnica(dados) {
        const { data, error } = await supabase
            .from('fichas_tecnicas')
            .insert(mapearFichaParaBanco(dados, empresaId))
            .select()
            .single();

        if (error) { alert('Erro ao salvar ficha técnica: ' + error.message); return null; }
        const nova = mapearFichaDoBanco(data);
        setFichas(prev => [nova, ...prev]);
        return nova.id;
    }

    async function updateFichaTecnica(id, dados) {
        const { error } = await supabase
            .from('fichas_tecnicas')
            .update(mapearFichaParaBanco(dados, empresaId))
            .eq('id', id);

        if (error) { alert('Erro ao salvar alterações: ' + error.message); return; }
        setFichas(prev => prev.map(f => f.id === id ? { ...f, ...dados } : f));
    }

    async function removeFichaTecnica(id) {
        const { error } = await supabase.from('fichas_tecnicas').update({ deletado_em: new Date().toISOString() }).eq('id', id);
        if (error) { alert('Erro ao excluir: ' + error.message); return; }
        setFichas(prev => prev.filter(f => f.id !== id));
    }

    const fichaEditando = editandoId ? fichas.find(f => f.id === editandoId) : null;

    if (criando || fichaEditando) {
        return (
            <FichaTecnicaForm
                ficha={fichaEditando}
                empresaId={empresaId}
                onSalvarEContinuar={async (dados) => {
                    if (fichaEditando) {
                        await updateFichaTecnica(fichaEditando.id, dados);
                    } else {
                        const novoId = await addFichaTecnica(dados);
                        setCriando(false);
                        if (novoId) setEditandoId(novoId);
                    }
                }}
                onSalvarEFechar={async (dados) => {
                    if (fichaEditando) await updateFichaTecnica(fichaEditando.id, dados);
                    else await addFichaTecnica(dados);
                    setCriando(false);
                    setEditandoId(null);
                }}
                onCancelar={() => { setCriando(false); setEditandoId(null); }}
                onExcluir={fichaEditando ? async () => { await removeFichaTecnica(fichaEditando.id); setEditandoId(null); } : null}
            />
        );
    }

    if (carregando) {
        return <div style={{ padding: 16, color: '#9C9A8F', fontSize: 13 }}>Carregando fichas técnicas...</div>;
    }

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#5C5A4F' }}>Fichas técnicas</div>
                    <div style={{ fontSize: 11.5, color: '#9C9A8F' }}>Custo por porção e custo da receita</div>
                </div>
                <button
                    onClick={() => setCriando(true)}
                    style={{ background: '#0F2B27', border: 'none', borderRadius: 10, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#FAF8F3', fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}
                >
                    <Plus size={14} /> Nova
                </button>
            </div>

            <div style={{ marginTop: 16 }}>
                {fichas.length === 0 ? (
                    <EmptyState text="Nenhuma ficha técnica cadastrada ainda. Toque em 'Nova' para criar a primeira." />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {fichas.map(f => {
                            const calc = calcularFicha(f);
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setEditandoId(f.id)}
                                    style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', padding: '12px 14px', cursor: 'pointer' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1C2421' }}>{f.nome}</div>
                                            <div style={{ fontSize: 11.5, color: '#9C9A8F', marginTop: 2 }}>
                                                Custo/porção {formatBRL(calc.custoPorcao)}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                                            <div style={{ fontSize: 10.5, color: '#9C9A8F' }}>Custo da receita</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421' }}>{formatBRL(calc.custoReceita)}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------- Formulário de Ficha Técnica ----------

function FichaTecnicaForm({ ficha, empresaId, onSalvarEContinuar, onSalvarEFechar, onCancelar, onExcluir }) {
    const editando = !!ficha;
    const [nome, setNome] = useState(editando ? ficha.nome : '');
    const [rendimentoPorcoes, setRendimentoPorcoes] = useState(editando ? String(ficha.rendimentoPorcoes) : '1');
    const [pesoPorcao, setPesoPorcao] = useState(editando ? String(ficha.pesoPorcao || '') : '');
    const [ingredientes, setIngredientes] = useState(editando ? (ficha.ingredientes || []) : []);
    const [wizardIngredienteId, setWizardIngredienteId] = useState(null);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [expandidos, setExpandidos] = useState(new Set());
    const [salvando, setSalvando] = useState(false);
    const [salvoRecentemente, setSalvoRecentemente] = useState(false);
    const [isAjudaFichaOpen, setIsAjudaFichaOpen] = useState(false);

    const rhCustosString = localStorage.getItem(`amp_rh_custos_${empresaId}`);
    const rhCustos = rhCustosString ? JSON.parse(rhCustosString) : { custoHora: 0, custoMinuto: 0 };

    const fichaAtual = { rendimentoPorcoes, ingredientes };
    const calc = useMemo(() => calcularFicha(fichaAtual), [rendimentoPorcoes, ingredientes]);

    function addIngrediente() {
        const novo = {
            id: uid(), nome: '',
            precoCompra: '', qtdCompra: '', unidadeCompra: 'kg',
            qtdBruta: '', unidadeUso: 'g',
            fatorCorrecao: 1,
        };
        setIngredientes(prev => [novo, ...prev]);
        setExpandidos(prev => new Set(prev).add(novo.id));
    }

    function toggleExpandido(id) {
        setExpandidos(prev => {
            const novo = new Set(prev);
            if (novo.has(id)) novo.delete(id);
            else novo.add(id);
            return novo;
        });
    }

    function atualizarIngrediente(id, campo, valor) {
        setIngredientes(prev => prev.map(i => {
            if (i.id !== id) return i;
            
            if (campo === 'unidadeCompra' && (valor === 'h' || valor === 'min')) {
                const preco = valor === 'h' ? rhCustos.custoHora : rhCustos.custoMinuto;
                return { 
                    ...i, 
                    [campo]: valor, 
                    precoCompra: preco > 0 ? preco.toFixed(2).replace('.', ',') : '', 
                    qtdCompra: '1', 
                    unidadeUso: valor,
                    nome: i.nome ? i.nome : 'Mão de obra'
                };
            }
            
            return { ...i, [campo]: valor };
        }));
    }

    function removerIngrediente(id) {
        setIngredientes(prev => prev.filter(i => i.id !== id));
    }

    function montarDados() {
        return {
            nome: nome.trim(),
            rendimentoPorcoes: parseInt(rendimentoPorcoes) || 1,
            pesoPorcao: parseFloat((pesoPorcao || '0').replace(',', '.')) || null,
            ingredientes,
        };
    }

    async function handleSalvarEContinuar() {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        await onSalvarEContinuar(montarDados());
        setSalvando(false);
        setSalvoRecentemente(true);
        setTimeout(() => setSalvoRecentemente(false), 2000);
    }

    async function handleSalvarEFechar() {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        await onSalvarEFechar(montarDados());
        setSalvando(false);
    }

    function exportarParaExcel() {
        const dadosExcel = [
            { A: 'Ficha Técnica:', B: nome || 'Sem Nome' },
            { A: 'Rendimento (porções):', B: rendimentoPorcoes },
            { A: 'Peso da Porção (g):', B: pesoPorcao || 'N/A' },
            { A: '' },
            { A: 'Custo da Receita:', B: formatBRL(calc.custoReceita) },
            { A: 'Custo por Porção:', B: formatBRL(calc.custoPorcao) },
            { A: '' },
            { A: 'Ingrediente', B: 'Qtd Bruta', C: 'Unidade', D: 'Fator Correção', E: 'Qtd Líquida', F: 'Custo Total' }
        ];

        calc.ingredientesCalc.forEach(ing => {
            dadosExcel.push({
                A: ing.nome || 'Sem Nome',
                B: ing.qtdBruta || '0',
                C: ing.unidadeUso || ing.unidadeCompra || 'g',
                D: parseFloat(ing.fatorCorrecao || 1).toFixed(2),
                E: ing.qtdLiquida.toFixed(2),
                F: formatBRL(ing.custoTotal)
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(dadosExcel, { skipHeader: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ficha Técnica");
        XLSX.writeFile(workbook, `Ficha_Tecnica_${(nome || 'Nova').replace(/\s+/g, '_')}.xlsx`);
    }

    const podeSalvar = nome.trim().length > 0 && !salvando;

    const ingredienteWizard = wizardIngredienteId ? ingredientes.find(i => i.id === wizardIngredienteId) : null;
    if (ingredienteWizard) {
        return (
            <FatorCorrecaoWizard
                ingrediente={ingredienteWizard}
                onCancel={() => setWizardIngredienteId(null)}
                onConcluir={(fator) => { atualizarIngrediente(ingredienteWizard.id, 'fatorCorrecao', fator); setWizardIngredienteId(null); }}
            />
        );
    }

    return (
        <div style={{ paddingBottom: 88 }}>
            <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <button onClick={onCancelar} style={{ background: 'none', border: 'none', color: '#9C9A8F', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14, padding: 0 }}>
                        <ChevronLeft size={15} /> Voltar para fichas técnicas
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: 19 }}>{editando ? 'Editar ficha técnica' : 'Nova ficha técnica'}</span>
                        <button
                            onClick={() => setIsAjudaFichaOpen(true)}
                            style={{ background: '#E6F4F1', border: '1px solid #B8E0D7', borderRadius: 8, padding: '3px 8px', color: '#1F5C52', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                            <HelpCircle size={14} />
                            <span>Guia Conceitual</span>
                        </button>
                    </div>
                </div>
                {editando && (
                    <button onClick={exportarParaExcel} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #1F5C52', background: '#D9EBE6', color: '#1F5C52', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        Exportar Excel
                    </button>
                )}
            </div>

            {/* Resultado calculado fica fixo no topo, sempre visível em telas de celular */}
            <div style={{ position: 'sticky', top: 0, zIndex: 4, background: '#FAF8F3', padding: '0 16px 12px', borderBottom: '1px solid #EFEBE0' }}>
                <div style={{ background: '#EAF6EE', border: '1px solid #CFEAD9', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: '#5C5A4F', marginBottom: 8 }}>Resultado calculado</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 11.5, color: '#5C8A71' }}>Custo/porção</div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: '#1C2421' }}>{formatBRL(calc.custoPorcao)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11.5, color: '#5C8A71' }}>Custo da receita</div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: '#1C2421' }}>{formatBRL(calc.custoReceita)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '16px 16px 0' }}>
                <FieldLabel>Nome do produto/prato</FieldLabel>
                <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Frango Caipira, X-Burguer, Bolo de Cenoura..." style={inputStyle} />

                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                        <FieldLabel>Rendimento (porções)</FieldLabel>
                        <input value={rendimentoPorcoes} onChange={e => setRendimentoPorcoes(e.target.value.replace(/[^0-9]/g, ''))} placeholder="1" inputMode="numeric" style={{ ...inputStyle, marginTop: 0 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FieldLabel>Peso da porção (g) — opcional</FieldLabel>
                        <input value={pesoPorcao} onChange={e => setPesoPorcao(e.target.value.replace(/[^0-9,.-]/g, ''))} placeholder="150" inputMode="decimal" style={{ ...inputStyle, marginTop: 0 }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>Ingredientes {ingredientes.length > 0 && `(${ingredientes.length})`}</span>
                    <button onClick={addIngrediente} style={{ background: 'none', border: '1px dashed #C9C5B6', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#5C5A4F', fontSize: 11.5 }}>
                        <Plus size={12} /> ingrediente
                    </button>
                </div>

                {ingredientes.length === 0 ? (
                    <EmptyState text="Adicione os ingredientes que compõem a receita." />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ingredientes.map(ing => (
                            <IngredienteRow
                                key={ing.id}
                                ingrediente={ing}
                                expandido={expandidos.has(ing.id)}
                                onToggleExpandido={() => toggleExpandido(ing.id)}
                                onChange={(campo, valor) => atualizarIngrediente(ing.id, campo, valor)}
                                onRemover={() => removerIngrediente(ing.id)}
                                onAbrirWizard={() => setWizardIngredienteId(ing.id)}
                            />
                        ))}
                    </div>
                )}

                {onExcluir && (
                    confirmandoExclusao ? (
                        <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: '#F2DDE1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ fontSize: 12.5, color: '#7A2E3D' }}>Excluir esta ficha técnica?</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => setConfirmandoExclusao(false)} style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid #7A2E3D', background: '#fff', color: '#7A2E3D', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
                                <button onClick={onExcluir} style={{ padding: '6px 10px', borderRadius: 7, border: 'none', background: '#7A2E3D', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Excluir</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setConfirmandoExclusao(true)} style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#B05A2E', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>
                            Excluir ficha técnica
                        </button>
                    )
                )}
            </div>

            {/* Botões fixos sempre visíveis no fundo */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, background: '#FAF8F3', borderTop: '1px solid #EFEBE0', padding: '12px 16px', display: 'flex', gap: 8 }}>
                <button
                    onClick={handleSalvarEContinuar}
                    disabled={!podeSalvar}
                    style={{ flex: 1, padding: '14px', borderRadius: 10, border: `1px solid ${podeSalvar ? '#0F2B27' : '#E5E0D5'}`, background: '#fff', color: podeSalvar ? '#0F2B27' : '#C9C5B6', fontSize: 13.5, fontWeight: 600, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}
                >
                    {salvoRecentemente ? '✓ Salvo' : (salvando ? 'Salvando...' : 'Salvar e continuar')}
                </button>
                <button
                    onClick={handleSalvarEFechar}
                    disabled={!podeSalvar}
                    style={{ flex: 1, padding: '14px', borderRadius: 10, border: 'none', background: podeSalvar ? '#0F2B27' : '#E5E0D5', color: podeSalvar ? '#FAF8F3' : '#9C9A8F', fontSize: 13.5, fontWeight: 600, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}
                >
                    {salvando ? 'Salvando...' : 'Salvar e fechar'}
                </button>
            </div>

            <ConceitoAjudaModal
                isOpen={isAjudaFichaOpen}
                onClose={() => setIsAjudaFichaOpen(false)}
                titulo="Ficha Técnica & Rateio de Frete de Insumos"
                conceito="A Ficha Técnica é a receita padronizada do seu produto ou serviço. Ela detalha cada ingrediente ou matéria-prima utilizada, as quantidades brutas, perdas (fator de correção) e o frete de entrega do insumo."
                porQueImporta="Ignorar o valor do frete e as perdas da matéria-prima causa o erro mais comum na precificação: achar que o produto custou R$ 10,00 quando na verdade custou R$ 13,50, destruindo a sua margem de lucro."
                exemplo={`• Ingrediente A: R$ 20,00 por kg\n• Rateio de Frete do Lote: +10%\n➜ Custo Real com Frete = R$ 22,00 por kg\n\n• Quantidade em uso na porção: 200g (0,2 kg)\n• Perda no pré-preparo: 10% (Fator 1,11)\n➜ Custo Efetivo do Insumo na Porção = R$ 4,88.`}
            />
        </div>
    );
}

// ---------- Linha de ingrediente (colapsável) ----------

function IngredienteRow({ ingrediente, expandido, onToggleExpandido, onChange, onRemover, onAbrirWizard }) {
    const { qtdLiquida, custoTotal, custoPorBase } = calcularIngrediente(ingrediente);
    const temPerda = (parseFloat(ingrediente.fatorCorrecao) || 1) > 1;
    const unidadeUso = ingrediente.unidadeUso || 'g';
    const baseLabel = ingrediente.unidadeCompra === 'un' ? 'un' 
                    : (['l', 'ml'].includes(ingrediente.unidadeCompra) ? 'l' 
                    : (['h', 'min'].includes(ingrediente.unidadeCompra) ? 'min' : 'kg'));

    if (!expandido) {
        return (
            <button
                onClick={onToggleExpandido}
                style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: 12, border: '1px solid #EFEBE0', padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ingrediente.nome ? '#1C2421' : '#C9C5B6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ingrediente.nome || 'Ingrediente sem nome'}
                    </div>
                    <div style={{ fontSize: 11, color: '#9C9A8F', marginTop: 2 }}>
                        {ingrediente.qtdBruta || '0'} {unidadeUso}{temPerda ? ` · perda informada` : ''}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 8 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5C5A4F' }}>{formatBRL(custoTotal)}</span>
                    <ChevronRight size={14} color="#C9C5B6" />
                </div>
            </button>
        );
    }

    return (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #1F5C52', padding: 12 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                <input
                    value={ingrediente.nome}
                    onChange={e => onChange('nome', e.target.value)}
                    placeholder="Nome do ingrediente"
                    style={{ ...inputStyle, marginTop: 0, flex: 1, padding: '9px 10px', fontSize: 13.5 }}
                    autoFocus={!ingrediente.nome}
                />
                <button onClick={onToggleExpandido} aria-label="Colapsar ingrediente" style={{ background: '#F0EDE3', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#5C5A4F', flexShrink: 0 }}>
                    <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <button onClick={onRemover} aria-label="Remover ingrediente" style={{ background: 'none', border: 'none', color: '#C9C5B6', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                    <X size={15} />
                </button>
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 600, color: '#9C9A8F', marginBottom: 5 }}>Preço de compra</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11.5, color: '#9C9A8F' }}>R$</span>
                    <input
                        value={ingrediente.precoCompra}
                        onChange={e => onChange('precoCompra', e.target.value.replace(/[^0-9,.-]/g, ''))}
                        placeholder="Paguei"
                        inputMode="decimal"
                        style={{ ...inputStyle, marginTop: 0, padding: '9px 10px 9px 26px', fontSize: 13 }}
                    />
                </div>
                <span style={{ alignSelf: 'center', fontSize: 11.5, color: '#9C9A8F' }}>por</span>
                <input
                    value={ingrediente.qtdCompra}
                    onChange={e => onChange('qtdCompra', e.target.value.replace(/[^0-9,.-]/g, ''))}
                    placeholder="Qtd"
                    inputMode="decimal"
                    style={{ ...inputStyle, marginTop: 0, width: 56, padding: '9px 8px', fontSize: 13 }}
                />
                <select
                    value={ingrediente.unidadeCompra}
                    onChange={e => onChange('unidadeCompra', e.target.value)}
                    style={{ ...inputStyle, marginTop: 0, width: 60, padding: '9px 4px', fontSize: 13 }}
                >
                    {UNIDADES_INGREDIENTE.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
            {custoPorBase > 0 && (
                <div style={{ fontSize: 10.5, color: '#9C9A8F', marginTop: -4, marginBottom: 8 }}>
                    ≈ {formatBRL(custoPorBase)} por {baseLabel} {ingrediente.pctFrete > 0 ? `(inclui +${ingrediente.pctFrete}% de frete/taxas)` : ''}
                </div>
            )}

            {/* Rateio de Frete & Taxas do Insumo */}
            <div style={{ background: '#FFFDF9', border: '1px solid #E8C896', borderRadius: 8, padding: '6px 10px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: '#8A6D1A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Truck size={14} color="#C05621" />
                    <span>Rateio Frete/Taxas do Lote (%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                        value={ingrediente.pctFrete || ''}
                        onChange={e => onChange('pctFrete', e.target.value.replace(/[^0-9,.-]/g, ''))}
                        placeholder="Ex: 10"
                        inputMode="decimal"
                        style={{ ...inputStyle, marginTop: 0, width: 60, padding: '4px 6px', fontSize: 12, textAlign: 'right', border: '1px solid #E8C896', background: '#fff' }}
                    />
                    <span style={{ fontSize: 11, color: '#8A6D1A', fontWeight: 600 }}>%</span>
                </div>
            </div>
            
            {['h', 'min'].includes(ingrediente.unidadeCompra) && (
                <div style={{ background: '#EAF6EE', padding: '6px 10px', borderRadius: 6, fontSize: 11, color: '#1F5C52', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={12} /> Valor inicial importado da sua Calculadora RH (editável)
                </div>
            )}

            <div style={{ fontSize: 10.5, fontWeight: 600, color: '#9C9A8F', marginBottom: 5 }}>Quanto usa nesta receita</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <input
                    value={ingrediente.qtdBruta}
                    onChange={e => onChange('qtdBruta', e.target.value.replace(/[^0-9,.-]/g, ''))}
                    placeholder="Quantidade"
                    inputMode="decimal"
                    style={{ ...inputStyle, marginTop: 0, flex: 1, padding: '9px 10px', fontSize: 13 }}
                />
                <select
                    value={unidadeUso}
                    onChange={e => onChange('unidadeUso', e.target.value)}
                    style={{ ...inputStyle, marginTop: 0, width: 64, padding: '9px 6px', fontSize: 13 }}
                >
                    {UNIDADES_INGREDIENTE.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>

            {!['h', 'min'].includes(ingrediente.unidadeCompra) && (
                <button
                    onClick={onAbrirWizard}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: `1px solid ${temPerda ? '#C9A063' : '#E5E0D5'}`, background: temPerda ? '#FBF3E5' : '#FBFAF6', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span style={{ fontSize: 11.5, color: temPerda ? '#8A6D1A' : '#9C9A8F', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Scale size={12} />
                        {temPerda ? `Tem perda no preparo (fator ${(parseFloat(ingrediente.fatorCorrecao) || 1).toFixed(2)})` : 'Sem perda informada'}
                    </span>
                    <span style={{ fontSize: 10.5, color: '#5C5A4F', textDecoration: 'underline' }}>{temPerda ? 'ajustar' : 'verificar perda'}</span>
                </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#9C9A8F' }}>
                <span>Qtd líquida: {qtdLiquida.toFixed(2)} {unidadeUso}</span>
                <span style={{ fontWeight: 600, color: '#5C5A4F' }}>Custo: {formatBRL(custoTotal)}</span>
            </div>
        </div>
    );
}

// ---------- Wizard do Fator de Correção ----------

function FatorCorrecaoWizard({ ingrediente, onCancel, onConcluir }) {
    const [etapa, setEtapa] = useState('pergunta');
    const [pesoBruto, setPesoBruto] = useState(ingrediente.qtdBruta || '');
    const [pesoLiquido, setPesoLiquido] = useState('');

    const fatorCalculado = calcularFatorCorrecao(pesoBruto, pesoLiquido);
    const percPerda = pesoBruto > 0 ? Math.max(0, 100 - (parseFloat(pesoLiquido || 0) / parseFloat(pesoBruto || 1)) * 100) : 0;

    if (etapa === 'pergunta') {
        return (
            <ModalShell onClose={onCancel} titulo="Esse ingrediente tem perda?">
                <div style={{ fontSize: 16, fontWeight: 500, color: '#1C2421', marginBottom: 10, lineHeight: 1.4 }}>
                    Ao preparar "{ingrediente.nome || 'este ingrediente'}", você descasca, limpa, tira osso/talo, ou perde peso/volume de alguma forma antes dele ir pra receita?
                </div>
                <div style={{ display: 'flex', gap: 8, background: '#F0EDE3', borderRadius: 10, padding: '10px 12px', marginBottom: 18 }}>
                    <AlertCircle size={15} color="#9C9A8F" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 12.5, color: '#7A7868', lineHeight: 1.5 }}>
                        Exemplos comuns: casca de batata, osso de carne, talo de verdura, água que evapora no cozimento. Se você compra e usa exatamente a mesma quantidade, não tem perda.
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => setEtapa('medir')} style={{ textAlign: 'left', padding: '13px 14px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', fontSize: 14, color: '#1C2421', cursor: 'pointer' }}>
                        Sim, tem perda no preparo
                    </button>
                    <button onClick={() => onConcluir(1)} style={{ textAlign: 'left', padding: '13px 14px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', fontSize: 14, color: '#1C2421', cursor: 'pointer' }}>
                        Não, uso a mesma quantidade que comprei
                    </button>
                </div>
            </ModalShell>
        );
    }

    if (etapa === 'medir') {
        return (
            <ModalShell onClose={onCancel} titulo="Vamos calcular a perda">
                <div style={{ fontSize: 13.5, color: '#5C5A4F', marginBottom: 16, lineHeight: 1.5 }}>
                    Pegue como referência uma quantidade desse ingrediente (por exemplo, 100g ou 1kg) e informe quanto sobrou depois de limpar/preparar.
                </div>

                <FieldLabel>Quanto você comprou (peso bruto)</FieldLabel>
                <input value={pesoBruto} onChange={e => setPesoBruto(e.target.value.replace(/[^0-9,.-]/g, ''))} placeholder={`Ex: 100 (${ingrediente.unidadeUso || 'g'})`} inputMode="decimal" style={inputStyle} />

                <FieldLabel>Quanto sobrou pronto para usar (peso líquido)</FieldLabel>
                <input value={pesoLiquido} onChange={e => setPesoLiquido(e.target.value.replace(/[^0-9,.-]/g, ''))} placeholder={`Ex: 75 (${ingrediente.unidadeUso || 'g'})`} inputMode="decimal" style={inputStyle} />

                {parseFloat(pesoBruto) > 0 && parseFloat(pesoLiquido) > 0 && (
                    <div style={{ background: '#FBF3E5', borderRadius: 10, padding: 12, marginTop: 14 }}>
                        <div style={{ fontSize: 12, color: '#8A6D1A' }}>Perda estimada: <strong>{percPerda.toFixed(1)}%</strong></div>
                        <div style={{ fontSize: 11.5, color: '#8A6D1A', marginTop: 2 }}>Fator de correção: {fatorCalculado.toFixed(2)}</div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                    <button onClick={() => setEtapa('pergunta')} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E5E0D5', background: '#fff', color: '#5C5A4F', fontSize: 13.5, cursor: 'pointer' }}>
                        Voltar
                    </button>
                    <button
                        onClick={() => onConcluir(fatorCalculado)}
                        disabled={!(parseFloat(pesoBruto) > 0 && parseFloat(pesoLiquido) > 0)}
                        style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: (parseFloat(pesoBruto) > 0 && parseFloat(pesoLiquido) > 0) ? '#0F2B27' : '#E5E0D5', color: (parseFloat(pesoBruto) > 0 && parseFloat(pesoLiquido) > 0) ? '#FAF8F3' : '#9C9A8F', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                        Usar este fator
                    </button>
                </div>
            </ModalShell>
        );
    }

    return null;
}
