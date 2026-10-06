import React from 'react';
import { Lock } from 'lucide-react';
import { useFma } from '../../context/FmaContext';
import { FmaLogo } from './FmaLogo';

export function FmaFooterLight() {
  const { firmConfig, setIsAdminOpen } = useFma();

  return (
    <footer className="w-full bg-white dark:bg-[#040E1B] border-t border-zinc-200/80 dark:border-white/10 text-xs text-[#556377] dark:text-[#8E7A66] transition-colors duration-300">
      
      {/* Upper Navigation Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Logo Oficial Ferreira & Mello Advogados */}
          <div className="flex items-center gap-4">
            <FmaLogo size="small" variant="full" />
            <div className="border-l border-zinc-200 dark:border-white/10 pl-4 hidden sm:block">
              <span className="block text-[11px] font-semibold text-[#14233C] dark:text-white">
                {firmConfig.firmName || 'Ferreira & Mello Advogados'}
              </span>
              <span className="block text-[10px] text-[#8E7A66] dark:text-[#D9C8A6]">
                Santa Cruz das Palmeiras – SP • Fone: (19) 3672-4554
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#14233C] dark:text-zinc-300 font-medium tracking-wider uppercase">
            <a href="#inicio" className="hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] transition-colors">Início</a>
            <a href="#escritorio" className="hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] transition-colors">Escritório</a>
            <a href="#atuacao" className="hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] transition-colors">Atuação</a>
            <a href="#equipe" className="hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] transition-colors">Equipe</a>
            <a href="#contato" className="hover:text-[#8E7A66] dark:hover:text-[#D9C8A6] transition-colors">Contato</a>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-100 dark:border-white/5 py-6 px-6 sm:px-12 bg-[#F9F8F6] dark:bg-[#030B15] transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8E7A66] dark:text-[#8E7A66]">
          <p>
            {firmConfig.name || 'FMA Advogados'} - Todos os direitos reservados © {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-[#14233C] dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-[#8E7A66] dark:text-[#D9C8A6]" />
              <span>Painel do Escritório</span>
            </button>
            <span>•</span>
            <span className="text-[#8E7A66]">Código de Ética da OAB</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
