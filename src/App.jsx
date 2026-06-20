import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import { ADMIN_CREDENCIAIS } from './utils/constants';
import { somenteDigitos, daysInMonth } from './utils/formatters';

import { TopBar, BottomNav } from './components/Navigation';
import { NovoLancamentoModal } from './components/NovoLancamentoModal';

import { LoginScreen, AssinaturaScreen, RecuperarSenhaScreen, RedefinirSenhaScreen } from './screens/AuthScreens';
import { AdminLoginScreen, AdminPanel } from './screens/AdminScreens';
import { Dashboard } from './screens/DashboardScreen';
import { FluxoCaixa } from './screens/FluxoCaixaScreen';
import { DREScreen } from './screens/DREScreen';
import { AnualScreen } from './screens/AnualScreen';
import { FormacaoPrecoScreen } from './screens/FormacaoPrecoScreen';

export default function CashFlowApp() {
  const [sessao, setSessao] = useState(null);
  const [empresaAtualObj, setEmpresaAtualObj] = useState(null);
  const [telaAuth, setTelaAuth] = useState('login');
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

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
    const { data: profile } = await supabase.from('profiles').select('eh_admin, nome, cpf').eq('id', userId).single();
    if (profile?.eh_admin) {
      setSessao({ tipo: 'admin' });
      carregarPainelAdmin();
      return;
    }

    const { data: vinculadas } = await supabase.from('empresa_usuarios')
      .select('empresa_id, empresas (*)')
      .eq('usuario_id', userId);
    
    if (vinculadas && vinculadas.length > 0) {
      const empresa = vinculadas[0].empresas;
      setSessao({ tipo: 'cliente', empresaId: empresa.id });
      // Injetamos o nome do profile na empresa pra TopBar usar
      setEmpresaAtualObj({ ...empresa, nome: profile?.nome });
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
          qtdVendas: l.qtd_vendas
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
        email: e.email_contato, telefone: e.telefone_contato, status: e.status, criadoEm: new Date(e.criado_em).toLocaleDateString('pt-BR')
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
      qtd_vendas: novo.qtdVendas || null
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
      qtd_vendas: dados.qtdVendas || null
    }).eq('id', id);

    if (!error) {
      carregarLancamentos(empresaAtualObj.id);
    }
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
    
    const { data: empData, error: empError } = await supabase.from('empresas').insert({
      razao_social: dados.empresa,
      nome_fantasia: dados.fantasia || dados.empresa,
      cpf_titular: cpfLimpo,
      email_contato: dados.email || '',
      telefone_contato: dados.telefone || '',
      status: 'teste'
    }).select('id').single();

    if (empError) return { ok: false, erro: 'Erro ao criar empresa: ' + empError.message };

    const { error: vincError } = await supabase.from('empresa_usuarios').insert({
      empresa_id: empData.id,
      usuario_id: authData.user.id,
      papel: 'dono'
    });

    if (vincError) return { ok: false, erro: 'Erro ao vincular: ' + vincError.message };
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

  async function atualizarStatusAssinante(id, novoStatus) {
    // Como a política RLS restringe isso apenas para "eh_admin()",
    // Precisaríamos ter um token de admin ou algo assim. 
    // Por enquanto, tentamos. O Supabase deve recusar se a session não for de profile admin.
    // Mas no protótipo o AdminLoginScreen bypassa o Supabase (usa ADMIN_CREDENCIAIS).
    // O ideal é que o admin exista no auth.users também.
    // Se o admin não estiver autenticado via Supabase, vai dar erro de RLS.
    const { error } = await supabase.from('empresas').update({ status: novoStatus }).eq('id', id);
    if (!error) {
      setAssinantesAdmin(prev => prev.map(a => a.id === id ? { ...a, status: novoStatus } : a));
    } else {
      alert('Erro RLS: O admin precisa estar autenticado via Supabase para alterar o status.');
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
      return <RedefinirSenhaScreen email={emailRecuperacao} onRedefinir={() => {}} />;
    }
    if (telaAuth === 'admin-login') {
      return <AdminLoginScreen onLogin={fazerLoginAdmin} onVoltar={() => setTelaAuth('login')} />;
    }
    return <LoginScreen onLogin={fazerLogin} onIrParaAssinatura={() => setTelaAuth('assinatura')} onIrParaRecuperar={() => setTelaAuth('recuperar')} onIrParaAdmin={() => setTelaAuth('admin-login')} />;
  }

  if (sessao.tipo === 'admin') {
    return <AdminPanel assinantes={assinantesAdmin} onAtualizarStatus={atualizarStatusAssinante} onSair={sair} />;
  }

  if (!empresaAtualObj) { return <div style={{padding: 20, color: '#1C2421'}}>Carregando empresa...</div>; }

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', background: '#FAF8F3', minHeight: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative', color: '#1C2421', display: 'flex', flexDirection: 'column' }}>
      <TopBar empresa={{ nome: empresaAtualObj.fantasia || empresaAtualObj.razao_social }} usuario={empresaAtualObj.nome || empresaAtualObj.email_contato} onLogout={sair} mesAtual={mesAtual} setMesAtual={setMesAtual} />

      <div style={{ flex: 1, paddingBottom: 88, overflowY: 'auto' }}>
        {tela === 'dashboard' && <Dashboard lancamentos={lancamentosEmpresa} mesAtual={mesAtual} anoAtual={anoAtual} onNovo={(tipo) => { setTipoNovoLancamento(tipo); setShowLancamentoModal(true); }} onEditar={abrirEdicao} />}
        {tela === 'fluxo' && <FluxoCaixa lancamentos={lancamentosEmpresa} mesAtual={mesAtual} anoAtual={anoAtual} onRemove={removeLancamento} onEditar={abrirEdicao} />}
        {tela === 'dre' && <DREScreen lancamentos={lancamentosEmpresa} mesAtual={mesAtual} />}
        {tela === 'anual' && <AnualScreen lancamentosAno={lancamentosAno} anoAtual={anoAtual} mesAtual={mesAtual} setTela={setTela} setMesAtual={setMesAtual} />}
        {tela === 'preco' && <FormacaoPrecoScreen lancamentos={lancamentosEmpresa} />}
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
