import { Check, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { formatarCpfInput, somenteDigitos } from '../utils/formatters';

export function LoginScreen({ onLogin, onIrParaAssinatura, onIrParaRecuperar, onIrParaAdmin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const [loading, setLoading] = useState(false);

  async function tentarEntrar() {
    if (!email.includes('@') || !senha) { setErro('Informe um e-mail válido e a senha.'); return; }
    setLoading(true);
    const resultado = await onLogin(email.trim(), senha);
    if (!resultado.ok) {
      setErro(resultado.erro);
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', minHeight: '100vh', background: '#0F2B27', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#E8A33D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Georgia, serif', fontSize: 26, color: '#0F2B27', fontWeight: 700 }}>R$</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#FAF8F3', letterSpacing: 0.2 }}>AMP flow</div>
          <div style={{ fontSize: 13, color: '#9FBDB5', marginTop: 4 }}>Fluxo de caixa e DRE sem mistério</div>
        </div>

        <div style={{ background: '#16352F', borderRadius: 16, padding: 24, border: '1px solid #234A42' }}>
          <AuthLabel>E-mail</AuthLabel>
          <AuthInput value={email} onChange={(v) => { setEmail(v); setErro(''); }} placeholder="seu@email.com.br" inputMode="email" type="email" autoCapitalize="none" />

          <AuthLabel>Senha</AuthLabel>
          <AuthInput type="password" value={senha} onChange={(v) => { setSenha(v); setErro(''); }} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && tentarEntrar()} last />

          <button onClick={onIrParaRecuperar} style={{ background: 'none', border: 'none', color: '#9FBDB5', fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: 14, textDecoration: 'underline' }}>
            Esqueci minha senha
          </button>

          {erro && <div style={{ fontSize: 12, color: '#F0A0A0', marginBottom: 12 }}>{erro}</div>}

          <button onClick={tentarEntrar} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: loading ? '#2C5048' : '#E8A33D', color: loading ? '#9FBDB5' : '#0F2B27', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ fontSize: 13, color: '#9FBDB5' }}>Ainda não é assinante? </span>
          <button onClick={onIrParaAssinatura} style={{ background: 'none', border: 'none', color: '#E8A33D', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
            Criar conta
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={onIrParaAdmin} style={{ background: 'none', border: 'none', color: '#4A655E', fontSize: 11.5, cursor: 'pointer' }}>
            Acesso administrativo
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#4A655E', marginTop: 10 }}>
          Protótipo — conta de teste: teste@ampflow.com.br / senha 123456
        </div>
      </div>
    </div>
  );
}

export function AssinaturaScreen({ onCriar, onVoltarLogin }) {
  const [empresa, setEmpresa] = useState('');
  const [cpf, setCpf] = useState('');
  const [fantasia, setFantasia] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  function cpfValido(v) { return somenteDigitos(v).length === 11; }

  async function handleCriar() {
    if (!empresa.trim()) { setErro('Informe o nome da empresa.'); return; }
    if (!cpfValido(cpf)) { setErro('Informe um CPF válido (11 dígitos).'); return; }
    if (!email || !email.includes('@')) { setErro('Informe um e-mail válido, ele será seu login.'); return; }
    if (!senha || senha.length < 6) { setErro('A senha precisa ter ao menos 6 caracteres.'); return; }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return; }

    const resultado = await onCriar({ empresa: empresa.trim(), cpf, fantasia: fantasia.trim(), nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), senha });
    if (!resultado.ok) setErro(resultado.erro);
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', minHeight: '100vh', background: '#0F2B27', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button onClick={onVoltarLogin} style={{ background: 'none', border: 'none', color: '#9FBDB5', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 18 }}>
          <ChevronLeft size={15} /> Voltar para login
        </button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#FAF8F3' }}>Criar assinatura</div>
          <div style={{ fontSize: 13, color: '#9FBDB5', marginTop: 4 }}>Comece a controlar seu fluxo de caixa hoje</div>
        </div>

        <div style={{ background: '#16352F', borderRadius: 16, padding: 24, border: '1px solid #234A42' }}>
          <AuthLabel>CPF do responsável *</AuthLabel>
          <AuthInput value={cpf} onChange={(v) => setCpf(formatarCpfInput(v))} placeholder="000.000.000-00" inputMode="numeric" />

          <AuthLabel>Nome da empresa *</AuthLabel>
          <AuthInput value={empresa} onChange={setEmpresa} placeholder="Razão social ou nome do negócio" />

          <AuthLabel>Nome fantasia</AuthLabel>
          <AuthInput value={fantasia} onChange={setFantasia} placeholder="Como o negócio é conhecido" />

          <AuthLabel>Seu nome</AuthLabel>
          <AuthInput value={nome} onChange={setNome} placeholder="Nome do responsável" />

          <AuthLabel>E-mail de acesso *</AuthLabel>
          <AuthInput value={email} onChange={setEmail} placeholder="seuemail@empresa.com.br" inputMode="email" type="email" autoCapitalize="none" />

          <AuthLabel>Telefone</AuthLabel>
          <AuthInput value={telefone} onChange={setTelefone} placeholder="(00) 00000-0000" inputMode="tel" />

          <AuthLabel>Crie uma senha *</AuthLabel>
          <AuthInput value={senha} onChange={setSenha} placeholder="Mínimo 6 caracteres" type="password" />

          <AuthLabel>Confirme a senha *</AuthLabel>
          <AuthInput value={confirmarSenha} onChange={setConfirmarSenha} placeholder="Repita a senha" type="password" last />

          {erro && <div style={{ fontSize: 12, color: '#F0A0A0', marginBottom: 12 }}>{erro}</div>}

          <button onClick={handleCriar} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#E8A33D', color: '#0F2B27', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Criar assinatura
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#4A655E', marginTop: 14 }}>
          * campos obrigatórios. Sua conta começa em período de teste.
        </div>
      </div>
    </div>
  );
}

export function RecuperarSenhaScreen({ onEnviar, onVoltarLogin }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', minHeight: '100vh', background: '#0F2B27', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button onClick={onVoltarLogin} style={{ background: 'none', border: 'none', color: '#9FBDB5', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 18 }}>
          <ChevronLeft size={15} /> Voltar para login
        </button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#FAF8F3' }}>Recuperar senha</div>
          <div style={{ fontSize: 13, color: '#9FBDB5', marginTop: 4 }}>Informe o e-mail de acesso da sua assinatura</div>
        </div>

        <div style={{ background: '#16352F', borderRadius: 16, padding: 24, border: '1px solid #234A42' }}>
          {!enviado ? (
            <>
              <AuthLabel>E-mail cadastrado</AuthLabel>
              <AuthInput value={email} onChange={setEmail} placeholder="seu@email.com" inputMode="email" type="email" autoCapitalize="none" last />
              <button
                onClick={() => email.includes('@') && setEnviado(true)}
                style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#E8A33D', color: '#0F2B27', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
              >
                Enviar link de recuperação
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Check size={28} color="#9FE0C8" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, color: '#FAF8F3', marginBottom: 6 }}>Recuperação enviada</div>
              <div style={{ fontSize: 12.5, color: '#9FBDB5', lineHeight: 1.5, marginBottom: 18 }}>
                Se o e-mail <strong style={{ color: '#FAF8F3' }}>{email}</strong> estiver cadastrado, você receberá um link seguro para redefinir sua senha.
              </div>
              <button
                onClick={() => onEnviar(email)}
                style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#E8A33D', color: '#0F2B27', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Enviar e-mail de recuperação
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RedefinirSenhaScreen({ email, onRedefinir }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');

  async function handleRedefinir() {
    if (!novaSenha || novaSenha.length < 6) { setErro('A senha precisa ter ao menos 6 caracteres.'); return; }
    if (novaSenha !== confirmar) { setErro('As senhas não coincidem.'); return; }
    await onRedefinir(novaSenha);
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans, system-ui)', minHeight: '100vh', background: '#0F2B27', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#FAF8F3' }}>Nova senha</div>
          <div style={{ fontSize: 13, color: '#9FBDB5', marginTop: 4 }}>Defina uma nova senha para sua conta</div>
        </div>

        <div style={{ background: '#16352F', borderRadius: 16, padding: 24, border: '1px solid #234A42' }}>
          <AuthLabel>Nova senha</AuthLabel>
          <AuthInput value={novaSenha} onChange={setNovaSenha} placeholder="Mínimo 6 caracteres" type="password" />
          <AuthLabel>Confirme a nova senha</AuthLabel>
          <AuthInput value={confirmar} onChange={setConfirmar} placeholder="Repita a senha" type="password" last />

          {erro && <div style={{ fontSize: 12, color: '#F0A0A0', marginBottom: 12 }}>{erro}</div>}

          <button onClick={handleRedefinir} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#E8A33D', color: '#0F2B27', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Salvar nova senha
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuthLabel({ children }) {
  return <label style={{ fontSize: 12, color: '#9FBDB5', display: 'block', marginBottom: 6 }}>{children}</label>;
}

export function AuthInput({ value, onChange, placeholder, type = 'text', inputMode, last, onKeyDown }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      inputMode={inputMode}
      style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid #2C5048', background: '#0F2B27', color: '#FAF8F3', fontSize: 15, marginBottom: last ? 18 : 14, boxSizing: 'border-box' }}
    />
  );
}
