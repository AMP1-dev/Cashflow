import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, ShieldAlert, Trash2, Mail, Check, AlertCircle } from 'lucide-react';
import { ModalShell } from './UIComponents';
import { supabase } from '../lib/supabase';
import { somenteDigitos } from '../utils/formatters';

export function GestaoEquipeModal({ empresaId, onClose, papelUsuarioAtual }) {
  const [membros, setMembros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [cpfOuEmail, setCpfOuEmail] = useState('');
  const [papelNovo, setPapelNovo] = useState('funcionario');
  const [adicionando, setAdicionando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    carregarMembros();
  }, [empresaId]);

  async function carregarMembros() {
    setCarregando(true);
    // Buscar vinculações da empresa com profiles
    const { data, error } = await supabase
      .from('empresa_usuarios')
      .select('id, papel, usuario_id, profiles (id, nome, cpf)')
      .eq('empresa_id', empresaId);

    if (!error && data) {
      setMembros(data);
    }
    setCarregando(false);
  }

  async function handleAdicionarColaborador() {
    const termo = cpfOuEmail.trim();
    if (!termo) return;

    setAdicionando(true);
    setMensagem(null);

    try {
      const digitos = somenteDigitos(termo);
      let usuarioAlvo = null;

      if (digitos.length === 11) {
        // Busca por CPF no profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, nome, cpf')
          .eq('cpf', digitos)
          .maybeSingle();

        usuarioAlvo = profile;
      }

      if (!usuarioAlvo) {
        setMensagem({
          tipo: 'erro',
          texto: 'Usuário não encontrado. O colaborador precisa criar uma conta gratuita no aplicativo com seu CPF antes de ser vinculado.',
        });
        setAdicionando(false);
        return;
      }

      // Inserir vinculação
      const { error: errInsert } = await supabase.from('empresa_usuarios').insert({
        empresa_id: empresaId,
        usuario_id: usuarioAlvo.id,
        papel: papelNovo,
      });

      if (errInsert) {
        if (errInsert.message.includes('unique') || errInsert.code === '23505') {
          setMensagem({ tipo: 'erro', texto: 'Este usuário já faz parte da equipe desta empresa.' });
        } else {
          setMensagem({ tipo: 'erro', texto: 'Erro ao vincular: ' + errInsert.message });
        }
      } else {
        setMensagem({ tipo: 'sucesso', texto: `Colaborador ${usuarioAlvo.nome || ''} vinculado com sucesso!` });
        setCpfOuEmail('');
        carregarMembros();
      }
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: 'Falha: ' + e.message });
    } finally {
      setAdicionando(false);
    }
  }

  async function handleAlterarPapel(vinculoId, novoPapel) {
    const { error } = await supabase
      .from('empresa_usuarios')
      .update({ papel: novoPapel })
      .eq('id', vinculoId);

    if (!error) {
      setMembros(prev => prev.map(m => m.id === vinculoId ? { ...m, papel: novoPapel } : m));
    } else {
      alert('Erro ao alterar papel: ' + error.message);
    }
  }

  async function handleRemoverMembro(vinculoId, nome) {
    if (!confirm(`Deseja remover ${nome || 'este membro'} do acesso à empresa?`)) return;

    const { error } = await supabase
      .from('empresa_usuarios')
      .delete()
      .eq('id', vinculoId);

    if (!error) {
      setMembros(prev => prev.filter(m => m.id !== vinculoId));
    } else {
      alert('Erro ao remover membro: ' + error.message);
    }
  }

  return (
    <ModalShell onClose={onClose} titulo="Gestão de Equipe e Permissões">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 12.5, color: '#5C5A4F', lineHeight: 1.4 }}>
          Controle quem pode acessar os dados da empresa. Funcionários e operadores só realizam lançamentos e consultas de fluxo, sem acesso a resultados de lucros, DRE contábil ou diagnóstico.
        </div>

        {/* Formulário de convite */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E0D5', padding: '14px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserPlus size={16} color="#1F5C52" />
            Adicionar Membro à Equipe
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>
                CPF do Colaborador (apenas números)
              </label>
              <input
                value={cpfOuEmail}
                onChange={e => setCpfOuEmail(e.target.value)}
                placeholder="Ex: 12345678900"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 13.5, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5C5A4F', marginBottom: 4 }}>
                Papel / Nível de Acesso
              </label>
              <select
                value={papelNovo}
                onChange={e => setPapelNovo(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1CFC7', fontSize: 13.5, background: '#fff', boxSizing: 'border-box' }}
              >
                <option value="funcionario">Funcionário / Operador (Apenas Fluxo de Caixa e Lançamentos)</option>
                <option value="dono">Dono / Administrador (Acesso total a DRE, Lucros e Diagnósticos)</option>
              </select>
            </div>

            {mensagem && (
              <div style={{
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 11.5,
                lineHeight: 1.3,
                background: mensagem.tipo === 'sucesso' ? '#D9EBE6' : '#FDF2F4',
                color: mensagem.tipo === 'sucesso' ? '#1F5C52' : '#991B1B',
                border: `1px solid ${mensagem.tipo === 'sucesso' ? '#A3D4C7' : '#FECACA'}`,
              }}>
                {mensagem.texto}
              </div>
            )}

            <button
              onClick={handleAdicionarColaborador}
              disabled={adicionando || !cpfOuEmail.trim()}
              style={{
                width: '100%',
                marginTop: 4,
                padding: '10px',
                borderRadius: 8,
                border: 'none',
                background: '#1F5C52',
                color: '#FAF8F3',
                fontSize: 13,
                fontWeight: 600,
                cursor: (adicionando || !cpfOuEmail.trim()) ? 'not-allowed' : 'pointer',
                opacity: (adicionando || !cpfOuEmail.trim()) ? 0.6 : 1,
              }}
            >
              {adicionando ? 'Vinculando...' : 'Vincular Colaborador'}
            </button>
          </div>
        </div>

        {/* Lista de Membros Atuais */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2421', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={16} color="#5C5A4F" />
            Membros com Acesso ({membros.length})
          </div>

          {carregando ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#9C9A8F', fontSize: 12 }}>Carregando membros...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {membros.map(m => {
                const nome = m.profiles?.nome || 'Usuário Sem Nome';
                const cpf = m.profiles?.cpf || '---';
                const ehDono = m.papel === 'dono' || m.papel === 'admin';

                return (
                  <div
                    key={m.id}
                    style={{
                      background: '#fff',
                      borderRadius: 10,
                      border: '1px solid #E5E0D5',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1C2421' }}>{nome}</div>
                      <div style={{ fontSize: 10.5, color: '#9C9A8F' }}>CPF: {cpf}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <select
                        value={m.papel}
                        onChange={e => handleAlterarPapel(m.id, e.target.value)}
                        style={{
                          fontSize: 11,
                          padding: '4px 6px',
                          borderRadius: 6,
                          border: `1px solid ${ehDono ? '#1F5C52' : '#C9C5B6'}`,
                          background: ehDono ? '#D9EBE6' : '#F4F3EF',
                          color: ehDono ? '#1F5C52' : '#5C5A4F',
                          fontWeight: 600,
                        }}
                      >
                        <option value="funcionario">Funcionário</option>
                        <option value="dono">Dono</option>
                      </select>

                      <button
                        onClick={() => handleRemoverMembro(m.id, nome)}
                        title="Remover acesso"
                        style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
