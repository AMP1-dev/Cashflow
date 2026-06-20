export function uid() { return Math.random().toString(36).slice(2, 10); }

export function formatBRL(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatCompactoBRL(v) {
  const abs = Math.abs(v);
  const sinal = v < 0 ? '-' : '';
  if (abs >= 1000) return sinal + (abs / 1000).toFixed(1).replace('.0', '') + 'k';
  return sinal + Math.round(abs).toString();
}

export function formatCompacto(v) {
  if (v === 0) return null;
  if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  return Math.round(v).toString();
}

export function daysInMonth(monthIndex, year) { return new Date(year, monthIndex + 1, 0).getDate(); }

export function somenteDigitos(v) { return (v || '').replace(/\D/g, ''); }

export function formatarCpfInput(v) {
  const digitos = somenteDigitos(v).slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function construirSugestoesDescricao(historico, tipo) {
  const porNome = new Map();
  historico
    .filter(l => l.tipo === tipo)
    .forEach((l) => {
      const chave = l.descricao.trim().toLowerCase();
      if (!chave) return;
      porNome.set(chave, { descricao: l.descricao.trim(), categoria: l.categoria || null, subcategoria: l.subcategoria || null });
    });
  return Array.from(porNome.values());
}
