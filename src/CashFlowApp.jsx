import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './lib/supabase';
import { ADMIN_CREDENCIAIS } from './utils/constants';
import { daysInMonth, somenteDigitos } from './utils/formatters';

import { BottomNav, TopBar } from './components/Navigation';
import { NovoLancamentoModal } from './components/NovoLancamentoModal';
import { AvisoRegimeCaixaModal } from './components/AvisoRegimeCaixaModal';
import { ImportarExtratoModal } from './components/ImportarExtratoModal';
import { GestaoEquipeModal } from './components/GestaoEquipeModal';
import { ErrorBoundary } from './components/UIComponents';

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
  const [showAvisoModal, setShowAvisoModal] = useState(false);
  const [showImportarModal, setShowImportarModal] = useState(false);
  const [showEquipeModal, setShowEquipeModal] = useState(false);

  // Admin state
  const [assinantesAdmin, setAssinantesAdmin] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !window.location.hash.includes('type=recovery')) {
        carregarDadosIniciais(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'PASSWORD_RECOVERY') {
        setSessao(null); // For├ºa a ficar na tela de auth
        setTelaAuth('redefinir');
      } else if (session && !window.location.hash.includes('type=recovery')) {
        carregarDadosIniciais(session.user.id);
      } else if (!session) {
        setSessao(null); setEmpresaAtualObj(null); setLancamentosGeral([]);
      }
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
      supabase.from('empresa_usuarios').select('papel, empresa_id, empresas (*)').eq('usuario_id', userId)
    ]);

    const profile = reqProfile.data;

    if (profile?.eh_admin) {
      setSessao({ tipo: 'admin' });
      carregarPainelAdmin();
      return;
    }

    const vinculadas = reqVinculadas.data;

    if (vinculadas && vinculadas.length > 0) {
      const vinculo = vinculadas[0];
      const empresa = vinculo.empresas;
      const papel = vinculo.papel || 'dono';
      setSessao({ tipo: 'cliente', empresaId: empresa.id, papel });
      // Injetamos o nome do profile e papel na empresa pra TopBar e BottomNav usarem
      setEmpresaAtualObj({ ...empresa, nome: profile?.nome, papel });

      if (!localStorage.getItem('avisoRegimeCaixaVisto')) {
        setShowAvisoModal(true);
      }

      if (isNovoCadastroRef.current) {
        isNovoCadastroRef.current = false;
        setTela('diagnostico');
      }
    }
  }

  function formatDataISO(ano, mesZeroIndex, dia) {
    const m = String(mesZeroIndex + 1).padStart(2, '0');
    const d = String(dia).padStart(2, '0');
    return `${ano}-${m}-${d}`;
  }

  async function carregarLancamentos(empresaId) {
    const dataInicio = `${anoAtual}-01-01`;
    const dataFim = `${anoAtual}-12-31`;

    const { data } = await supabase
      .from('lancamentos')
      .select('*')
      .eq('empresa_id', empresaId)
      .is('deletado_em', null)
      .gte('data_lancamento', dataInicio)
      .lte('data_lancamento', dataFim);

    if (data) {
      const mapeados = data.map(l => {
        const dateObj = new Date(l.data_lancamento + 'T12:00:00');
        let compObj = null;
        if (l.data_competencia) {
          compObj = new Date(l.data_competencia + 'T12:00:00');
        }
        return {
          id: l.id,
          tipo: l.tipo,
          descricao: l.descricao,
          valor: parseFloat(l.valor),
          dia: dateObj.getDate(),
          mes: dateObj.getMonth(),
          ano: dateObj.getFullYear(),
          dataLancamento: l.data_lancamento,
          dataCompetencia: l.data_competencia || l.data_lancamento,
          mesCompetencia: compObj ? compObj.getMonth() : dateObj.getMonth(),
          anoCompetencia: compObj ? compObj.getFullYear() : dateObj.getFullYear(),
          categoria: l.categoria,
          subcategoria: l.subcategoria,
          formaRecebimento: l.forma_recebimento === 'avista' ? 'À vista/PIX' : (l.forma_recebimento === 'aprazo' ? 'À prazo' : null),
          qtdVendas: l.qtd_vendas,
          banco: l.banco || null,
          meioPagamento: l.meio_pagamento || null,
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
    const repeticoes = Math.max(1, parseInt(novo.repeticoes) || 1);
    const payloads = [];

    for (let i = 0; i < repeticoes; i++) {
      const mesBase = novo.mes !== undefined ? novo.mes : mesAtual;
      const dataObj = new Date(anoAtual, mesBase + i, 1);
      const anoItem = dataObj.getFullYear();
      const mesItem = dataObj.getMonth();
      const maxDiasMes = daysInMonth(mesItem, anoItem);
      const diaItem = Math.min(novo.dia, maxDiasMes);

      const dataStr = formatDataISO(anoItem, mesItem, diaItem);
      const dataCompStr = novo.personalizarCompetencia && novo.mesCompetencia !== undefined
        ? formatDataISO(anoItem, (novo.mesCompetencia + i) % 12, 1)
        : dataStr;

      payloads.push({
        empresa_id: empresaAtualObj.id,
        tipo: novo.tipo,
        descricao: repeticoes > 1 ? `${novo.descricao} (${i + 1}/${repeticoes})` : novo.descricao,
        valor: novo.valor,
        data_lancamento: dataStr,
        data_competencia: dataCompStr,
        categoria: novo.categoria || null,
        subcategoria: novo.subcategoria || null,
        forma_recebimento: novo.formaRecebimento ? (novo.formaRecebimento.includes('vista') ? 'avista' : 'aprazo') : null,
        qtd_vendas: novo.qtdVendas || null,
        banco: novo.banco || null,
        meio_pagamento: novo.meio_pagamento || null,
      });
    }

    let { data, error } = await supabase.from('lancamentos').insert(payloads);

    if (error && error.message && error.message.includes('data_competencia')) {
      const semComp = payloads.map(p => {
        const copy = { ...p };
        delete copy.data_competencia;
        return copy;
      });
      const res = await supabase.from('lancamentos').insert(semComp);
      error = res.error;
    }

    if (!error) {
      carregarLancamentos(empresaAtualObj.id);
    } else {
      alert('Erro ao registrar lançamento: ' + (error?.message || 'Falha desconhecida.'));
    }
  }

  async function removeLancamento(id) {
    const { error } = await supabase.from('lancamentos').update({ deletado_em: new Date().toISOString() }).eq('id', id);
    if (!error) {
      setLancamentosGeral(prev => prev.filter(l => l.id !== id));
    }
  }

  async function updateLancamento(id, dados) {
    const mesAlvo = dados.mes !== undefined ? dados.mes : mesAtual;
    const dataStr = formatDataISO(anoAtual, mesAlvo, dados.dia);
    const dataCompStr = dados.dataCompetencia || (dados.mesCompetencia !== undefined 
      ? formatDataISO(dados.anoCompetencia || anoAtual, dados.mesCompetencia, 1) 
      : dataStr);

    const payload = {
      tipo: dados.tipo,
      descricao: dados.descricao,
      valor: dados.valor,
      data_lancamento: dataStr,
      data_competencia: dataCompStr,
      categoria: dados.categoria || null,
      subcategoria: dados.subcategoria || null,
      forma_recebimento: dados.formaRecebimento ? (dados.formaRecebimento.includes('vista') ? 'avista' : 'aprazo') : null,
      qtd_vendas: dados.qtdVendas || null,
      banco: dados.banco || null,
      meio_pagamento: dados.meio_pagamento || null,
    };

    let { error } = await supabase.from('lancamentos').update(payload).eq('id', id);

    if (error && error.message && error.message.includes('data_competencia')) {
      delete payload.data_competencia;
      const res = await supabase.from('lancamentos').update(payload).eq('id', id);
      error = res.error;
    }

    if (!error) {
      carregarLancamentos(empresaAtualObj.id);
    }
  }

  async function importarLoteLancamentos(lista) {
    if (!lista || lista.length === 0) return;
    
    const payloads = lista.map(item => {
      const mesAlvo = item.mes !== undefined ? item.mes : mesAtual;
      const dataStr = formatDataISO(item.ano || anoAtual, mesAlvo, item.dia);
      return {
        empresa_id: empresaAtualObj.id,
        tipo: item.tipo,
        descricao: item.descricao,
        valor: item.valor,
        data_lancamento: dataStr,
        data_competencia: dataStr,
        categoria: item.categoria || null,
        subcategoria: item.subcategoria || null,
        forma_recebimento: item.formaRecebimento ? (item.formaRecebimento.includes('vista') ? 'avista' : 'aprazo') : null,
        qtd_vendas: item.qtdVendas || null,
        banco: item.banco || null,
        meio_pagamento: item.meio_pagamento || null,
      };
    });

    let { error } = await supabase.from('lancamentos').insert(payloads);

    if (error && error.message && error.message.includes('data_competencia')) {
      const semComp = payloads.map(p => {
        const copy = { ...p };
        delete copy.data_competencia;
        return copy;
      });
      const res = await supabase.from('lancamentos').insert(semComp);
      error = res.error;
    }

    if (!error) {
      carregarLancamentos(empresaAtualObj.id);
    } else {
      alert('Erro ao importar lote: ' + (error?.message || 'Falha desconhecida.'));
    }
  }

  async function salvarEstoqueMensal(estoqueInicial, estoqueFinal) {
    const dataInicial = formatDataISO(anoAtual, mesAtual, 1);
    const dataFinal = formatDataISO(anoAtual, mesAtual, daysInMonth(mesAtual, anoAtual));

    const idsParaDeletar = lancamentosEmpresa.filter(l => l.tipo === 'estoque').map(l => l.id);
    if (idsParaDeletar.length > 0) {
      await supabase.from('lancamentos').update({ deletado_em: new Date().toISOString() }).in('id', idsParaDeletar);
    }

    if (estoqueInicial !== null && estoqueInicial !== '') {
      const { error: errIni } = await supabase.from('lancamentos').insert({
        empresa_id: empresaAtualObj.id, tipo: 'estoque', categoria: 'inicial', descricao: 'Estoque Inicial', valor: parseFloat(estoqueInicial), data_lancamento: dataInicial
      });
      if (errIni) alert('Erro ao salvar estoque inicial: ' + errIni.message);
    }
    if (estoqueFinal !== null && estoqueFinal !== '') {
      const { error: errFim } = await supabase.from('lancamentos').insert({
        empresa_id: empresaAtualObj.id, tipo: 'estoque', categoria: 'final', descricao: 'Estoque Final', valor: parseFloat(estoqueFinal), data_lancamento: dataFinal
      });
      if (errFim) alert('Erro ao salvar estoque final: ' + errFim.message);
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

  function fecharAvisoModal() {
    localStorage.setItem('avisoRegimeCaixaVisto', 'true');
    setShowAvisoModal(false);
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
    return { ok: false, erro: 'Usu├írio ou senha incorretos.' };
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

    // Se a conta j├í existir ou por algum motivo a sess├úo vier vazia:
    if (!authData.session) {
      return { ok: false, erro: 'Conta criada, mas n├úo foi poss├¡vel fazer login autom├ítico. Tente usar um e-mail diferente (este pode j├í estar em uso).' };
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
    
    // For├ºar o recarregamento da sess├úo agora que a empresa j├í existe no banco.
    // Isso evita o bug de a tela ficar travada esperando o evento do Auth.
    await carregarDadosIniciais(authData.user.id);
    
    return { ok: true };
  }

  async function redefinirSenha(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      alert('Erro ao enviar recupera├º├úo: ' + error.message);
    } else {
      alert('Um e-mail de recupera├º├úo foi enviado para ' + email);
    }
  }

  async function salvarNovaSenha(novaSenha) {
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) {
      alert('Erro ao redefinir a senha: ' + error.message);
    } else {
      alert('Senha alterada com sucesso! Voc├¬ j├í pode acessar a plataforma.');
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        carregarDadosIniciais(data.session.user.id);
      } else {
        setTelaAuth('login');
      }
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
      return <RedefinirSenhaScreen email={emailRecuperacao} onRedefinir={salvarNovaSenha} />;
    }
    if (telaAuth === 'admin-login') {
      return <AdminLoginScreen onLogin={fazerLoginAdmin} onVoltar={() => setTelaAuth('login')} />;
    }
    return <LoginScreen onLogin={fazerLogin} onIrParaAssinatura={() => setTelaAuth('assinatura')} onIrParaRecuperar={() => setTelaAuth('recuperar')} onIrParaAdmin={() => setTelaAuth('admin-login')} />;
  }

  if (sessao.tipo === 'admin') {
    return <AdminPanel assinantes={assinantesAdmin} onAtualizarDados={atualizarDadosAssinante} onSair={sair} onRecuperarSenha={redefinirSenha} />;
  }

  if (!empresaAtualObj) { return <div style={{ padding: 20, color: '#1C2421' }}>Carregando empresa...</div>; }

  const ehDono = empresaAtualObj?.papel !== 'funcionario';

  return (
    <div className="app-container" style={{ fontFamily: 'var(--font-sans, system-ui)', background: '#FAF8F3', minHeight: '100vh', position: 'relative', color: '#1C2421', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        empresa={{ nome: empresaAtualObj.fantasia || empresaAtualObj.razao_social }}
        usuario={empresaAtualObj.nome || empresaAtualObj.email_contato}
        onLogout={sair}
        mesAtual={mesAtual}
        setMesAtual={setMesAtual}
        onAbrirEquipe={() => setShowEquipeModal(true)}
        ehDono={ehDono}
      />

      <div style={{ flex: 1, paddingBottom: 88, overflowY: 'auto' }}>
        <ErrorBoundary onReset={() => setTela('dashboard')}>
          {tela === 'dashboard' && (
            <Dashboard
              lancamentos={lancamentosEmpresa}
              mesAtual={mesAtual}
              anoAtual={anoAtual}
              empresaId={empresaAtualObj.id}
              papel={empresaAtualObj.papel}
              onNovo={(tipo) => { setTipoNovoLancamento(tipo); setShowLancamentoModal(true); }}
              onEditar={abrirEdicao}
              onIrGestaoAVista={() => setTela('gestaoavista')}
              onAbrirImportacao={() => setShowImportarModal(true)}
            />
          )}
          {tela === 'fluxo' && (
            <FluxoCaixa
              lancamentos={lancamentosEmpresa}
              mesAtual={mesAtual}
              anoAtual={anoAtual}
              onRemove={removeLancamento}
              onEditar={abrirEdicao}
              onAbrirImportacao={() => setShowImportarModal(true)}
            />
          )}
          {tela === 'dre' && ehDono && (
            <DREScreen
              lancamentos={lancamentosEmpresa}
              lancamentosAno={lancamentosAno}
              mesAtual={mesAtual}
              anoAtual={anoAtual}
              empresaId={empresaAtualObj.id}
              onSalvarEstoque={salvarEstoqueMensal}
            />
          )}
          {tela === 'anual' && ehDono && (
            <AnualScreen
              lancamentosAno={lancamentosAno}
              anoAtual={anoAtual}
              mesAtual={mesAtual}
              setTela={setTela}
              setMesAtual={setMesAtual}
            />
          )}
          {tela === 'preco' && ehDono && (
            <FormacaoPrecoScreen
              lancamentos={lancamentosEmpresa}
              mesAtual={mesAtual}
              anoAtual={anoAtual}
              empresaId={empresaAtualObj.id}
            />
          )}
          {tela === 'fichas' && ehDono && (
            <FichasTecnicasScreen empresaId={empresaAtualObj.id} />
          )}
          {tela === 'diagnostico' && ehDono && (
            <DiagnosticoScreen onVoltar={() => setTela('dashboard')} />
          )}
          {tela === 'gestaoavista' && ehDono && (
            <GestaoAVistaScreen
              lancamentosAno={lancamentosAno}
              mesAtual={mesAtual}
              anoAtual={anoAtual}
              empresaId={empresaAtualObj.id}
              onVoltar={() => setTela('dashboard')}
            />
          )}
        </ErrorBoundary>
      </div>

      <BottomNav tela={tela} setTela={setTela} onAdd={() => { setLancamentoEditando(null); setShowLancamentoModal(true); }} papel={empresaAtualObj.papel || 'dono'} />

      {showLancamentoModal && (
        <NovoLancamentoModal
          tipoInicial={tipoNovoLancamento}
          diasNoMes={daysInMonth(mesAtual, anoAtual)}
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          lancamentoEditando={lancamentoEditando}
          historicoCompleto={lancamentosGeral}
          onClose={fecharModal}
          onSave={(l) => { addLancamento(l); fecharModal(); }}
          onUpdate={(dados) => { updateLancamento(lancamentoEditando.id, dados); fecharModal(); }}
          onDelete={() => { removeLancamento(lancamentoEditando.id); fecharModal(); }}
        />
      )}

      {showImportarModal && (
        <ImportarExtratoModal
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          historicoExistente={lancamentosGeral}
          onImportarLote={importarLoteLancamentos}
          onClose={() => setShowImportarModal(false)}
        />
      )}

      {showEquipeModal && (
        <GestaoEquipeModal
          empresaId={empresaAtualObj.id}
          papelUsuarioAtual={empresaAtualObj.papel || 'dono'}
          onClose={() => setShowEquipeModal(false)}
        />
      )}

      {showAvisoModal && <AvisoRegimeCaixaModal onClose={fecharAvisoModal} />}
    </div>
  );
}
