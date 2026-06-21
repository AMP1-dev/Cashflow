import React, { useState, useMemo } from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';
import { STATUS_ASSINATURA } from '../utils/constants';
import { ModalShell, FieldLabel, EmptyState } from '../components/UIComponents';

export function AdminLoginScreen({ onLogin, onVoltar }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function tentarEntrar() {
    const resultado = onLogin(usuario, senha);
    if (!resultado.ok) setErro(resultado.erro);
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
      </div>
    </div>
  );
}

export function AdminPanel({ assinantes, onAtualizarDados, onSair }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);

  const filtrados = useMemo(() => {
    return assinantes.filter(a => {
      const bate = !busca.trim() || a.empresa.toLowerCase().includes(busca.toLowerCase()) || a.cpf.includes(busca) || (a.email || '').toLowerCase().includes(busca.toLowerCase());
      const bateStatus = filtroStatus === 'todos' || a.status === filtroStatus;
      return bate && bateStatus;
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
        <button onClick={onSair} aria-label="Sair" style={{ background: 'none', border: 'none', color: '#9298A3', cursor: 'pointer', padding: 8 }}>
          <LogOut size={18} />
        </button>
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
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.fantasia || a.empresa}</div>
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
      </div>

      {assinanteSelecionado && (
        <AdminDetalheAssinante
          assinante={assinanteSelecionado}
          onAtualizarDados={onAtualizarDados}
          onClose={() => setSelecionado(null)}
        />
      )}
    </div>
  );
}

export function AdminDetalheAssinante({ assinante, onAtualizarDados, onClose }) {
  const [status, setStatus] = useState(assinante.status);
  const [vencimento, setVencimento] = useState(assinante.vencimento || '');
  const [valor, setValor] = useState(assinante.valor_assinatura || '');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    setSalvando(true);
    const resultado = await onAtualizarDados(assinante.id, {
      status,
      vencimento: vencimento || null,
      valor_assinatura: valor ? parseFloat(valor) : null
    });
    setSalvando(false);
    if (!resultado.ok) alert('Erro ao salvar: ' + resultado.erro);
    else onClose();
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
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

      <button
        onClick={handleSalvar}
        disabled={salvando}
        style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: salvando ? '#D1D5DB' : '#1F5C52', color: salvando ? '#6B7280' : '#fff', fontSize: 15, fontWeight: 600, cursor: salvando ? 'wait' : 'pointer' }}
      >
        {salvando ? 'Salvando...' : 'Salvar alterações'}
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
