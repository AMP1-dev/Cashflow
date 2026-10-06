import React from 'react';

/**
 * Logotipo Oficial Ferreira & Mello Advogados (FMA)
 * Extraído diretamente do cabeçalho da petição judicial oficial (PDF)
 * Tipografia autêntica:
 * - '/// fma ///' em caligrafia cursiva Edwardian Script ITC
 * - 'FERREIRA & MELLO ADVOGADOS' em Perpetua Titling MT / Felix Titling
 * 
 * Imagens transparentes em alta definição (PNG 400 DPI):
 * - /fma_logo_transparent.png (modo claro: tipografia escura elegante)
 * - /fma_logo_white.png (modo escuro: tipografia branca de alto contraste)
 */
export function FmaLogo({ className = '', variant = 'full', size = 'normal' }) {
  // size: 'small', 'normal', 'large'
  const heightClass = size === 'small' 
    ? 'h-6 sm:h-7' 
    : size === 'large' 
      ? 'h-14 sm:h-16' 
      : 'h-8 sm:h-9 md:h-10';

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      {/* Light Mode: Logotipo autêntico escuro com fundo transparente */}
      <img
        src="/fma_logo_transparent.png"
        alt="Ferreira & Mello Advogados"
        className={`${heightClass} w-auto object-contain dark:hidden transition-all`}
        loading="eager"
      />
      {/* Dark Mode: Logotipo autêntico branco com fundo transparente */}
      <img
        src="/fma_logo_white.png"
        alt="Ferreira & Mello Advogados"
        className={`${heightClass} w-auto object-contain hidden dark:block transition-all`}
        loading="eager"
      />
    </div>
  );
}

export default FmaLogo;
