import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './lib/supabase';
import { ADMIN_CREDENCIAIS } from './utils/constants';
import { daysInMonth, somenteDigitos } from './utils/formatters';

import { BottomNav, TopBar } from './components/Navigation';
import { NovoLancamentoModal } from './components/NovoLancamentoModal';

import { AdminLoginScreen, AdminPanel } from './screens/AdminScreens';
import { AnualScreen } from './screens/AnualScreen';
import { AssinaturaScreen, LoginScreen, RecuperarSenhaScreen, RedefinirSenhaScreen } from './screens/AuthScreens';
import { Dashboard } from './screens/DashboardScreen';
import { DiagnosticoScreen } from './screens/DiagnosticoScreen';
import { DREScreen } from './screens/DREScreen';
import { FichasTecnicasScreen } from './screens/FichasTecnicasScreen';
import { FluxoCaixa } from './screens/FluxoCaixaScreen';
import { FormacaoPrecoScreen } from './screens/FormacaoPrecoScreen';
import { GestaoAVistaScreen } from './screens/GestaoAVistaScreen';

export default function CashFlowApp() {
  const [sessao, setSessao] = useState(null);
  const [empresaAtualObj, setEmpresaAtualObj] = useState(null);
  const [telaAuth, setTelaAuth] = useState('login');
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  const isNovoCadastroRef = useRef(false);

  const [tela, setTela] = useState('dashboard');
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual] = useState(new Date().getFullYear());

  const [lancamentosGeral, setLancamentosGeral] = useState([]);
  const [showLancamentoModal, setShowLancamentoModal] = useState(false);
  const [tipoNovoLancamento, setTipoNovoLancamento] = useState('despesa');
  const [lancamentoEditando, setLancamentoEditando] = useState(null);

  // Admin state
  const [assinantesAdmin, setAssinantesAdmin] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) carregarDadosIniciais(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) carregarDadosIniciais(session.user.id);
      else { setSessao(null); setEmpresaAtualObj(null); setLancamentosGeral([]); }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (sessao?.tipo === 'cliente' && empresaAtualObj) {
      carregarLancamentos(empresaAtualObj.id);
    }
  }, [sessao, empresaAtualObj, mesAtual, anoAtual]);

  async function carregarDadosIniciais(userId) {
    // Para ganhar tempo, fazemos as duas buscas (perfil e empresas) ao mesmo tempo!
    const [reqProfile, reqVinculadas] = await Promise.all([
      supabase.from('profiles').select('eh_admin, nome, cpf').eq('id', userId).single(),
      supabase.from('empresa_usuarios').select('empresa_id, empresas (*)').eq('usuario_id', userId)
    ]);

    const profile = reqProfile.data;

    if (profile?.eh_admin) {
      setSessao({ tipo: 'admin' });
      carregarPainelAdmin();
      return;
    }

    const vinculadas = reqVinculadas.data;

    if (vinculadas && vinculadas.length > 0) {
      const empresa = vinculadas[0].empresas;
      setSessao({ tipo: 'cliente', empresaId: empresa.id });
      // Injetamos o nome do profile na empresa pra TopBar usar
      setEmpresaAtualObj({ ...empresa, nome: profile?.nome });

      if (isNovoCadastroRef.current) {
        isNovoCadastroRef.current = false;
        setTela('diagnostico');
      }
    }
  }

  async function carregarLancamentos(empresaId) {
    const dataInicio = new Date(anoAtual, 0, 1).toISOString().split('T')[0];
    const dataFim = new Date(anoAtual, 11, 31).toISOString().split('T')[0];

    const { data } = await supabase
      .from('lancamentos')
      .select('*')
      .eq('empresa_id', empresaId)
      .gte('data_lancamento', dataInicio)
      .lte('data_lancamento', dataFim);

    if (data) {
      const mapeados = data.map(l => {
        const dateObj = new Date(l.data_lancamento + 'T12:00:00');
        return {
          id: l.id,
          tipo: l.tipo,
          descricao: l.descricao,
          valor: parseFloat(l.valor),
          dia: dateObj.getDate(),
          mes: dateObj.getMonth(),
          ano: dateObj.getFullYear(),
          categoria: l.categoria,
          subcategoria: l.subcategoria,
          formaRecebimento: l.forma_recebimento === 'avista' ? 'À vista/PIX' : (l.forma_recebimento === 'aprazo' ? 'À prazo' : null),
          qtdVendas: l.qtd_vendas,
          banco: l.banco || null,
        };
      });
      setLancamentosGeral(mapeados);
    }
  }

  async function carregarPainelAdmin() {
    const { data } = await supabase.from('empresas').select('*').order('criado_em', { ascending: false });
    if (data) {
      setAssinantesAdmin(data.map(e => ({
        id: e.id, empresa: e.razao_social, fantasia: e.nome_fantasia, cpf: e.cpf_titular,
        email: e.email_contato, telefone: e.telefone_contato, status: e.status, criadoEm: new Date(e.criado_em).toLocaleDateString('pt-BR'),
        vencimento: e.vencimento, valor_assinatura: e.valor_assinatura
      })));
    }
  }

  const lancamentosEmpresa = useMemo(() => {
    return lancamentosGeral.filter(l => l.mes === mesAtual);
  }, [lancamentosGeral, mesAtual]);

  const lancamentosAno = useMemo(() => {
    return lancamentosGeral;
  }, [lancamentosGeral]);

  async function addLancamento(novo) {
    const dataStr = new Date(anoAtual, mesAtual, novo.dia).toISOString().split('T')[0];
    const { data, error } = await supabase.from('lancamentos').insert({
      empresa_id: empresaAtualObj.id,
      tipo: novo.tipo,
      descricao: novo.descricao,
      valor: novo.valor,
      data_lancamento: dataStr,
      categoria: novo.categoria || null,
      subcategoria: novo.subcategoria || null,
      forma_recebimento: novo.formaRecebimento ? (novo.formaRecebimento.includes('vista') ? 'avista' : 'aprazo') : null,
      qtd_vendas: novo.qtdVendas || null,
      banco: novo.banco || null,
    }).select().single();

    if (!error && data) {
      carregarLancamentos(empresaAtualObj.id);
    }
  }

  async function removeLancamento(id) {
    const { error } = await supabase.from('lancamentos').delete().eq('id', id);
    if (!error) {
      setLancamentosGeral(prev => prev.filter(l => l.id !== id));
    }
  }

  async function updateLancamento(id, dados) {
    const dataStr = new Date(anoAtual, mesAtual, dados.dia).toISOString().split('T')[0];
    const { error } = await supabase.from('lancamentos').update({
      tipo: dados.tipo,
      descricao: dados.descricao,
      valor: dados.valor,
      data_lancamento: dataStr,
      categoria: dados.categoria || null,
      subcategoria: dados.subcategoria || null,
      forma_recebimento: dados.formaRecebimento ? (dados.formaRecebimento.includes('vista') ? 'avista' : 'aprazo') : null,
      qtd_vendas: dados.qtdVendas || null,
      banco: dados.banco || null,
    }).eq('id', id);

    if (!error) {
      carregarLancamentos(empresaAtualObj.id);
    }
  }

  async function salvarEstoqueMensal(estoqueInicial, estoqueFinal) {
    const dataInicial = new Date(anoAtual, mesAtual, 1).toISOString().split('T')[0];
    const dataFinal = new Date(anoAtual, mesAtual, daysInMonth(mesAtual, anoAtual)).toISOString().split('T')[0];

    const idsParaDeletar = lancamentosEmpresa.filter(l => l.tipo === 'estoque').map(l => l.id);
    if (idsParaDeletar.length > 0) {
      await supabase.from('lancamentos').delete().in('id', idsParaDeletar);
    }

    if (estoqueInicial !== null && estoqueInicial !== '') {
      await supabase.from('lancamentos').insert({
        empresa_id: empresaAtualObj.id, tipo: 'estoque', categoria: 'inicial', descricao: 'Estoque Inicial', valor: parseFloat(estoqueInicial), data_lancamento: dataInicial
      });
    }
    if (estoqueFinal !== null && estoqueFinal !== '') {
      await supabase.from('lancamentos').insert({
        empresa_id: empresaAtualObj.id, tipo: 'estoque', categoria: 'final', descricao: 'Estoque Final', valor: parseFloat(estoqueFinal), data_lancamento: dataFinal
      });
    }
    carregarLancamentos(empresaAtualObj.id);
  }

  function abrirEdicao(lancamento) {
    setLancamentoEditando(lancamento);
    setShowLancamentoModal(true);
  }

  function fecharModal() {
    setShowLancamentoModal(false);
    setLancamentoEditando(null);
  }

  async function fazerLogin(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: senha });
    if (error) {
      if (error.message.includes('Invalid login')) return { ok: false, erro: 'E-mail ou senha incorretos.' };
      return { ok: false, erro: error.message };
    }
    return { ok: true };
  }

  async function fazerLoginAdmin(usuario, senha) {
    if (usuario.trim().toLowerCase() === ADMIN_CREDENCIAIS.usuario && senha.trim() === ADMIN_CREDENCIAIS.senha) {
      setSessao({ tipo: 'admin' });
      carregarPainelAdmin();
      return { ok: true };
    }
    return { ok: false, erro: 'Usuário ou senha incorretos.' };
  }

  async function criarAssinatura(dados) {
    const cpfLimpo = somenteDigitos(dados.cpf);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dados.email,
      password: dados.senha,
      options: {
        data: { nome: dados.nome || '', cpf: cpfLimpo, telefone: dados.telefone || '' }
      }
    });

    if (authError) return { ok: false, erro: authError.message };

    // Se a conta já existir ou por algum motivo a sessão vier vazia:
    if (!authData.session) {
      return { ok: false, erro: 'Conta criada, mas não foi possível fazer login automático. Tente usar um e-mail diferente (este pode já estar em uso).' };
    }

    const novaEmpresaId = crypto.randomUUID();

    const { error: empError } = await supabase.from('empresas').insert({
      id: novaEmpresaId,
      razao_social: dados.empresa,
      nome_fantasia: dados.fantasia || dados.empresa,
      cpf_titular: cpfLimpo,
      email_contato: dados.email || '',
      telefone_contato: dados.telefone || '',
      status: 'teste'
    });

    if (empError) return { ok: false, erro: 'Erro banco de dados (Empresa): ' + empError.message };

    const { error: vincError } = await supabase.from('empresa_usuarios').insert({
      empresa_id: novaEmpresaId,
      usuario_id: authData.user.id,
      papel: 'dono'
    });

    if (vincError) return { ok: false, erro: 'Erro ao vincular: ' + vincError.message };

    isNovoCadastroRef.current = true;
    return { ok: true };
  }

  async function redefinirSenha(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      alert('Erro ao enviar recuperação: ' + error.message);
    } else {
      alert('Um e-mail de recuperação foi enviado para ' + email);
    }
  }

  async function atualizarDadosAssinante(id, dados) {
    const { error } = await supabase.from('empresas').update(dados).eq('id', id);
    if (!error) {
      setAssinantesAdmin(prev => prev.map(a => a.id === id ? { ...a, ...dados } : a));
      return { ok: true };
    } else {
      return { ok: false, erro: error.message };
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    setSessao(null);
    setTelaAuth('login');
    setTela('dashboard');
  }

  if (!sessao) {
    if (telaAuth === 'assinatura') {
      return <AssinaturaScreen onCriar={criarAssinatura} onVoltarLogin={() => setTelaAuth('login')} />;
    }
    if (telaAuth === 'recuperar') {
      return <RecuperarSenhaScreen onEnviar={(email) => { redefinirSenha(email); setTelaAuth('login'); }} onVoltarLogin={() => setTelaAuth('login')} />;
    }
    if (telaAuth === 'redefinir') {
      return <RedefinirSenhaScreen email={emailRecuperacao} onRedefinir={() => { }} />;
    }
    if (telaAuth === 'admin-login') {
      return <AdminLoginScreen onLogin={fazerLoginAdmin} onVoltar={() => setTelaAuth('login')} />;
    }
    return <LoginScreen onLogin={fazerLogin} onIrParaAssinatura={() => setTelaAuth('assinatura')} onIrParaRecuperar={() => setTelaAuth('recuperar')} onIrParaAdmin={() => setTelaAuth('admin-login')} />;
  }

  if (sessao.tipo === 'admin') {
    return <AdminPanel assinantes={assinantesAdmin} onAtualizarDados={atualizarDadosAssinante} onSair={sair} />;
  }

  if (!empresaAtualObj) { return <div style={{ padding: 20, color: '#1C2421' }}>Carregando empresa...</div>; }

  return (
    <div className="app-container" style={{ fontFamily: 'var(--font-sans, system-ui)', background: '#FAF8F3', minHeight: '100vh', position: 'relative', color: '#1C2421', display: 'flex', flexDirection: 'column' }}>
      <TopBar empresa={{ nome: empresaAtualObj.fantasia || empresaAtualObj.razao_social }} usuario={empresaAtualObj.nome || empresaAtualObj.email_contato} onLogout={sair} mesAtual={mesAtual} setMesAtual={setMesAtual} />

      <div style={{ flex: 1, paddingBottom: 88, overflowY: 'auto' }}>
        {tela === 'dashboard' && <Dashboard lancamentos={lancamentosEmpresa} mesAtual={mesAtual} anoAtual={anoAtual} onNovo={(tipo) => { setTipoNovoLancamento(tipo); setShowLancamentoModal(true); }} onEditar={abrirEdicao} onIrGestaoAVista={() => setTela('gestaoavista')} />}
        {tela === 'fluxo' && <FluxoCaixa lancamentos={lancamentosEmpresa} mesAtual={mesAtual} anoAtual={anoAtual} onRemove={removeLancamento} onEditar={abrirEdicao} />}
        {tela === 'dre' && <DREScreen lancamentos={lancamentosEmpresa} lancamentosAno={lancamentosAno} mesAtual={mesAtual} anoAtual={anoAtual} empresaId={empresaAtualObj.id} onSalvarEstoque={salvarEstoqueMensal} />}
        {tela === 'anual' && <AnualScreen lancamentosAno={lancamentosAno} anoAtual={anoAtual} mesAtual={mesAtual} setTela={setTela} setMesAtual={setMesAtual} />}
        {tela === 'preco' && <FormacaoPrecoScreen lancamentos={lancamentosEmpresa} />}
        {tela === 'fichas' && <FichasTecnicasScreen empresaId={empresaAtualObj.id} />}
        {tela === 'diagnostico' && <DiagnosticoScreen onVoltar={() => setTela('dashboard')} />}
        {tela === 'gestaoavista' && <GestaoAVistaScreen lancamentosAno={lancamentosAno} mesAtual={mesAtual} anoAtual={anoAtual} pctCmv={pctCmv} onVoltar={() => setTela('dashboard')} />}
      </div>

      <BottomNav tela={tela} setTela={setTela} onAdd={() => { setLancamentoEditando(null); setShowLancamentoModal(true); }} />

      {showLancamentoModal && (
        <NovoLancamentoModal
          tipoInicial={tipoNovoLancamento}
          diasNoMes={daysInMonth(mesAtual, anoAtual)}
          lancamentoEditando={lancamentoEditando}
          historicoCompleto={lancamentosGeral}
          onClose={fecharModal}
          onSave={(l) => { addLancamento(l); fecharModal(); }}
          onUpdate={(dados) => { updateLancamento(lancamentoEditando.id, dados); fecharModal(); }}
          onDelete={() => { removeLancamento(lancamentoEditando.id); fecharModal(); }}
        />
      )}
    </div>
  );
}
