import React, { useState, useMemo } from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';
import { STATUS_ASSINATURA } from '../utils/constants';
import { ModalShell, FieldLabel, EmptyState } from '../components/UIComponents';

export function AdminLoginScreen({ onLogin, onVoltar }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function tentarEntrar() {
    if (!usuario.trim() || !senha) {
      setErro('Informe usuário e senha.');
      return;
    }
    setLoading(true);
    setErro('');
    const resultado = await onLogin(usuario, senha);
    setLoading(false);
    if (resultado && !resultado.ok) setErro(resultado.erro);
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', minHeight: '100vh', background: '#1A1D21', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button onClick={onVoltar} style={{ background: 'none', border: 'none', color: '#9298A3', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 18 }}>
          <ChevronLeft size={15} /> Voltar
        </button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F2F3F5' }}>Acesso administrativo</div>
          <div style={{ fontSize: 13, color: '#9298A3', marginTop: 4 }}>Gestão de assinantes — AMP Flow</div>
        </div>

        <div style={{ background: '#24282D', borderRadius: 16, padding: 24, border: '1px solid #363B42' }}>
          <label style={{ fontSize: 12, color: '#9298A3', display: 'block', marginBottom: 6 }}>Usuário</label>
          <input
            value={usuario}
            onChange={(e) => { setUsuario(e.target.value); setErro(''); }}
            placeholder="admin"
            autoCapitalize="off"
            autoCorrect="off"
            style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid #3D434B', background: '#1A1D21', color: '#F2F3F5', fontSize: 15, marginBottom: 14, boxSizing: 'border-box' }}
          />
          <label style={{ fontSize: 12, color: '#9298A3', display: 'block', marginBottom: 6 }}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErro(''); }}
            placeholder="••••••••"
            style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid #3D434B', background: '#1A1D21', color: '#F2F3F5', fontSize: 15, marginBottom: 14, boxSizing: 'border-box' }}
            onKeyDown={(e) => e.key === 'Enter' && tentarEntrar()}
          />

          {erro && <div style={{ fontSize: 12, color: '#F0A0A0', marginBottom: 12 }}>{erro}</div>}

          <button onClick={tentarEntrar} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#5B8AA6', color: '#10131A', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Entrar como admin
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#5C636D', marginTop: 14 }}>
          Protótipo — usuário: admin / senha: admin123
        </div>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11.5, color: '#5C636D', fontWeight: 600, letterSpacing: 0.5 }}>
          AMP Flow • Versão 2.5
        </div>
      </div>
    </div>
  );
}

export function AdminPanel({ assinantes, onAtualizarDados, onSair, onRecuperarSenha, onVoltarEmpresa, onAcessarEmpresa }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);
  const [mostrarCancelados, setMostrarCancelados] = useState(false);

  const filtrados = useMemo(() => {
    return assinantes.filter(a => {
      const bate = !busca.trim() || a.empresa.toLowerCase().includes(busca.toLowerCase()) || a.cpf.includes(busca) || (a.email || '').toLowerCase().includes(busca.toLowerCase());
      let bateStatus = false;
      if (filtroStatus === 'todos') {
        bateStatus = a.status !== 'cancelado';
      } else {
        bateStatus = a.status === filtroStatus;
      }
      return bate && bateStatus;
    });
  }, [assinantes, busca, filtroStatus]);

  const cancelados = useMemo(() => {
    if (filtroStatus !== 'todos') return [];
    return assinantes.filter(a => {
      const bate = !busca.trim() || a.empresa.toLowerCase().includes(busca.toLowerCase()) || a.cpf.includes(busca) || (a.email || '').toLowerCase().includes(busca.toLowerCase());
      return bate && a.status === 'cancelado';
    });
  }, [assinantes, busca, filtroStatus]);

  const contagem = useMemo(() => {
    const c = { ativo: 0, teste: 0, suspenso: 0, cancelado: 0 };
    assinantes.forEach(a => { c[a.status] = (c[a.status] || 0) + 1; });
    return c;
  }, [assinantes]);

  const assinanteSelecionado = selecionado ? assinantes.find(a => a.id === selecionado) : null;

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', background: '#F3F4F6', minHeight: '100vh', color: '#1C2421' }}>
      <div style={{ background: '#1A1D21', color: '#F2F3F5', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#9298A3' }}>Painel administrativo</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>Assinantes — AMP Flow</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onVoltarEmpresa && (
            <button
              onClick={onVoltarEmpresa}
              style={{
                background: '#E8A33D',
                border: 'none',
                borderRadius: 8,
                color: '#0F2B27',
                padding: '7px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>🚀 Acessar AMP Flow</span>
            </button>
          )}
          <button onClick={onSair} aria-label="Sair" style={{ background: 'none', border: 'none', color: '#9298A3', cursor: 'pointer', padding: 8 }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
          {Object.entries(STATUS_ASSINATURA).map(([key, st]) => (
            <button
              key={key}
              onClick={() => setFiltroStatus(filtroStatus === key ? 'todos' : key)}
              style={{ background: filtroStatus === key ? st.bg : '#fff', border: `1px solid ${filtroStatus === key ? st.color : '#E1E3E6'}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer' }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: st.color }}>{contagem[key] || 0}</div>
              <div style={{ fontSize: 10.5, color: st.color }}>{st.label}</div>
            </button>
          ))}
        </div>

        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por empresa, CPF ou email..."
          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #E1E3E6', fontSize: 14, marginBottom: 14, boxSizing: 'border-box', background: '#fff' }}
        />

        {filtroStatus !== 'todos' && (
          <div style={{ marginBottom: 10, fontSize: 12, color: '#6B7280' }}>
            Filtrando por: <strong style={{ color: STATUS_ASSINATURA[filtroStatus].color }}>{STATUS_ASSINATURA[filtroStatus].label}</strong>
            {' · '}<button onClick={() => setFiltroStatus('todos')} style={{ background: 'none', border: 'none', color: '#5B8AA6', cursor: 'pointer', textDecoration: 'underline', fontSize: 12, padding: 0 }}>limpar</button>
          </div>
        )}

        {filtrados.length === 0 ? (
          <EmptyState text="Nenhum assinante encontrado." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtrados.map(a => {
              const st = STATUS_ASSINATURA[a.status];
              return (
                <button
                  key={a.id}
                  onClick={() => setSelecionado(a.id)}
                  style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: 12, border: '1px solid #E1E3E6', padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{a.fantasia || a.empresa}</span>
                      {a.modulo_nfse && (
                        <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0F2B27', background: '#9FE0C8', padding: '1px 6px', borderRadius: 4, letterSpacing: 0.3 }}>
                          🧾 NFS-e ATIVA
                        </span>
                      )}
                      {a.modulo_tradutor && (
                        <span style={{ fontSize: 9.5, fontWeight: 800, color: '#064E3B', background: '#A7F3D0', padding: '1px 6px', borderRadius: 4, letterSpacing: 0.3 }}>
                          ✨ TRADUTOR IA
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>{a.cpf} · {a.email || 'sem email'} · desde {a.criadoEm}</div>
                    {a.vencimento && <div style={{ fontSize: 11, color: '#D97706', marginTop: 2, fontWeight: 500 }}>Vencimento: {new Date(a.vencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</div>}
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: st.color, background: st.bg, padding: '3px 9px', borderRadius: 7, flexShrink: 0, marginLeft: 10 }}>
                    {st.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {filtroStatus === 'todos' && cancelados.length > 0 && (
          <div style={{ marginTop: 24, borderTop: '1px solid #E1E3E6', paddingTop: 16 }}>
            <button 
              onClick={() => setMostrarCancelados(!mostrarCancelados)}
              style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 0', color: '#6B7280', fontSize: 13, fontWeight: 600 }}
            >
              <span>Ver clientes cancelados ({cancelados.length})</span>
              <span>{mostrarCancelados ? '▲' : '▼'}</span>
            </button>
            {mostrarCancelados && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {cancelados.map(a => {
                  const st = STATUS_ASSINATURA[a.status];
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelecionado(a.id)}
                      style={{ width: '100%', textAlign: 'left', background: '#fff', borderRadius: 12, border: '1px solid #E1E3E6', padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}
                    >
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.fantasia || a.empresa}</div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>{a.cpf} · {a.email || 'sem email'} · desde {a.criadoEm}</div>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: st.color, background: st.bg, padding: '3px 9px', borderRadius: 7, flexShrink: 0, marginLeft: 10 }}>
                        {st.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {assinanteSelecionado && (
        <AdminDetalheAssinante
          assinante={assinanteSelecionado}
          onAtualizarDados={onAtualizarDados}
          onClose={() => setSelecionado(null)}
          onRecuperarSenha={onRecuperarSenha}
          onAcessarEmpresa={onAcessarEmpresa}
        />
      )}
    </div>
  );
}

export function AdminDetalheAssinante({ assinante, onAtualizarDados, onClose, onRecuperarSenha, onAcessarEmpresa }) {
  const [status, setStatus] = useState(assinante.status);
  const [vencimento, setVencimento] = useState(assinante.vencimento || '');
  const [valor, setValor] = useState(assinante.valor_assinatura || '');
  const [moduloNfse, setModuloNfse] = useState(assinante.modulo_nfse ?? false);
  const [moduloTradutor, setModuloTradutor] = useState(assinante.modulo_tradutor ?? false);
  const [ultimoNumeroNfse, setUltimoNumeroNfse] = useState(assinante.nfse_ultimo_numero || '');
  const [salvando, setSalvando] = useState(false);
  const [enviandoLink, setEnviandoLink] = useState(false);
  const [msgLink, setMsgLink] = useState('');
  const [erroLink, setErroLink] = useState('');

  async function handleSalvar() {
    setSalvando(true);
    // Também salva no localStorage como fallback para testes imediatos
    localStorage.setItem(`amp_modulo_nfse_${assinante.id}`, moduloNfse ? 'true' : 'false');
    localStorage.setItem(`amp_modulo_tradutor_${assinante.id}`, moduloTradutor ? 'true' : 'false');

    const resultado = await onAtualizarDados(assinante.id, {
      status,
      vencimento: vencimento || null,
      valor_assinatura: valor ? parseFloat(valor) : null,
      modulo_nfse: moduloNfse,
      modulo_tradutor: moduloTradutor,
      nfse_ultimo_numero: ultimoNumeroNfse ? parseInt(ultimoNumeroNfse) : 0,
    });
    setSalvando(false);
    if (!resultado.ok) alert('Erro ao salvar: ' + resultado.erro);
    else onClose();
  }

  async function handleRecuperarSenha() {
    if (!assinante.email || !assinante.email.includes('@')) {
      setErroLink('Este assinante não possui e-mail cadastrado.');
      return;
    }
    setEnviandoLink(true);
    setMsgLink('');
    setErroLink('');
    try {
      const res = await onRecuperarSenha(assinante.email.trim());
      if (res && !res.ok) {
        setErroLink('Erro ao enviar: ' + (res.erro || 'Falha no envio'));
      } else {
        setMsgLink(`✅ Link enviado com sucesso para ${assinante.email}!`);
      }
    } catch (e) {
      setErroLink('Erro inesperado: ' + (e.message || String(e)));
    } finally {
      setEnviandoLink(false);
    }
  }

  return (
    <ModalShell onClose={onClose} titulo={assinante.fantasia || assinante.empresa}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        <DetalheLinha label="Razão social / Nome" valor={assinante.empresa} />
        <DetalheLinha label="Nome fantasia" valor={assinante.fantasia || '—'} />
        <DetalheLinha label="CPF" valor={assinante.cpf} />
        <DetalheLinha label="Responsável" valor={assinante.nome || '—'} />
        <DetalheLinha label="Email" valor={assinante.email || '—'} />
        <DetalheLinha label="Telefone" valor={assinante.telefone || '—'} />
        <DetalheLinha label="Assinante desde" valor={assinante.criadoEm} />
      </div>

      <FieldLabel>Status da assinatura</FieldLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {Object.entries(STATUS_ASSINATURA).map(([key, st]) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            style={{
              padding: '9px 14px', borderRadius: 9, fontSize: 13, cursor: 'pointer',
              border: `1px solid ${status === key ? st.color : '#E5E0D5'}`,
              background: status === key ? st.bg : '#fff',
              color: status === key ? st.color : '#5C5A4F',
              fontWeight: status === key ? 600 : 400,
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <FieldLabel>Vencimento do plano</FieldLabel>
          <input
            type="date"
            value={vencimento}
            onChange={e => setVencimento(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E1E3E6', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FieldLabel>Valor (R$)</FieldLabel>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={e => setValor(e.target.value)}
            placeholder="0.00"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E1E3E6', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* ── CHAVE DE ATIVAÇÃO DO MÓDULO NFS-E & RECORRÊNCIA (ADD-ON COBRADO) ── */}
      <div style={{ background: '#FAF8F3', border: '1.5px solid #1F5C52', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2B27' }}>
              🧾 Módulo NFS-e & Emissão Recorrente
            </div>
            <div style={{ fontSize: 11, color: '#5C5A4F', marginTop: 2 }}>
              Habilita a aba de emissão fiscal, leitura de A1 e contratos no app do cliente
            </div>
          </div>
          <input
            type="checkbox"
            checked={moduloNfse}
            onChange={e => setModuloNfse(e.target.checked)}
            style={{ accentColor: '#1F5C52', width: 20, height: 20, cursor: 'pointer' }}
          />
        </label>

        {moduloNfse && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #D1CFC7' }}>
            <FieldLabel>Último número de NFS-e emitida (Sequencial)</FieldLabel>
            <input
              type="number"
              value={ultimoNumeroNfse}
              onChange={e => setUltimoNumeroNfse(e.target.value)}
              placeholder="Ex: 45 (a próxima nota emitida será a 46)"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E1E3E6', fontSize: 13, boxSizing: 'border-box', background: '#fff' }}
            />
            <div style={{ fontSize: 10.5, color: '#7A7868', marginTop: 3 }}>
              Se o cliente já emitiu notas no portal da prefeitura, informe aqui para continuar a sequência exata.
            </div>
          </div>
        )}
      </div>

      {/* ── CHAVE DE ATIVAÇÃO DO MÓDULO ANÁLISE HUMANIZADA (ADD-ON COBRADO) ── */}
      <div style={{ background: '#FAF8F3', border: '1.5px solid #10B981', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2B27', display: 'flex', alignItems: 'center', gap: 6 }}>
              ✨ Análise Humanizada & WhatsApp
              <span style={{ fontSize: 9.5, background: '#25D366', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>PREMIUM</span>
            </div>
            <div style={{ fontSize: 11, color: '#5C5A4F', marginTop: 2 }}>
              Habilita o Tradutor Financeiro (PE, DRE vs Caixa, Reconciliação e Comparativo)
            </div>
          </div>
          <input
            type="checkbox"
            checked={moduloTradutor}
            onChange={e => setModuloTradutor(e.target.checked)}
            style={{ accentColor: '#10B981', width: 20, height: 20, cursor: 'pointer' }}
          />
        </label>
      </div>

      {onAcessarEmpresa && (
        <button
          type="button"
          onClick={() => onAcessarEmpresa(assinante)}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 10,
            border: 'none',
            background: '#E8A33D',
            color: '#0F2B27',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7
          }}
        >
          <span>🚀 Entrar no AMP Flow desta empresa</span>
        </button>
      )}

      <button
        onClick={handleSalvar}
        disabled={salvando}
        style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: salvando ? '#D1D5DB' : '#1F5C52', color: salvando ? '#6B7280' : '#fff', fontSize: 15, fontWeight: 600, cursor: salvando ? 'wait' : 'pointer', marginBottom: 12 }}
      >
        {salvando ? 'Salvando...' : 'Salvar alterações'}
      </button>

      {msgLink && (
        <div style={{ padding: '12px 14px', background: '#E6F4EA', color: '#137333', border: '1px solid #CEEAD6', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>
          {msgLink}
        </div>
      )}

      {erroLink && (
        <div style={{ padding: '12px 14px', background: '#FCE8E6', color: '#C5221F', border: '1px solid #FAD2CF', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>
          {erroLink}
        </div>
      )}

      <button
        onClick={handleRecuperarSenha}
        disabled={enviandoLink}
        style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #CBD5E1', background: enviandoLink ? '#F1F5F9' : '#fff', color: enviandoLink ? '#94A3B8' : '#1F5C52', fontSize: 14, fontWeight: 600, cursor: enviandoLink ? 'wait' : 'pointer' }}
      >
        {enviandoLink ? 'Enviando e-mail de recuperação...' : 'Enviar link de redefinição de senha'}
      </button>
    </ModalShell>
  );
}

export function DetalheLinha({ label, valor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #F0EDE3', paddingBottom: 8 }}>
      <span style={{ color: '#9C9A8F' }}>{label}</span>
      <span style={{ color: '#1C2421', fontWeight: 500, textAlign: 'right' }}>{valor}</span>
    </div>
  );
}
