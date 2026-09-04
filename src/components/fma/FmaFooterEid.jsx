import React from 'react';
import { Scale, Lock } from 'lucide-react';
import { useFma } from '../../context/FmaContext';

export function FmaFooterEid() {
  const { firmConfig, setIsAdminOpen } = useFma();

  return (
    <footer className="bg-[#040E1B] text-[#CFD4DB] text-xs border-t border-white/10">
      
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0E2238] border border-eid-gold/30 flex items-center justify-center text-eid-gold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-work text-base font-bold text-white">
                {firmConfig.name || 'FMA ADVOGADOS'}
              </span>
              <span className="block text-[10px] text-[#8E7A66] font-mono">
                {firmConfig.founder || 'Dr. Fernando Maeda'} • {firmConfig.oab || 'OAB/SP 210.374'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#CFD4DB]">
            <a href="#inicio" className="hover:text-eid-gold transition-colors">Início</a>
            <a href="#escritorio" className="hover:text-eid-gold transition-colors">Escritório</a>
            <a href="#atuacao" className="hover:text-eid-gold transition-colors">Atuação</a>
            <a href="#equipe" className="hover:text-eid-gold transition-colors">Equipe</a>
            <a href="#artigos" className="hover:text-eid-gold transition-colors">Artigos</a>
            <a href="#contato" className="hover:text-eid-gold transition-colors">Contato</a>
          </div>

        </div>
      </div>

      {/* Bottom Bar (Idêntico ao bottom-bar do Eid Advogados) */}
      <div className="border-t border-white/5 py-6 px-6 sm:px-8 bg-[#030B15]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8E7A66]">
          <p>
            {firmConfig.name || 'FMA Advogados'} - Todos os direitos reservados © {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 text-[#8E7A66]"
            >
              <Lock className="w-3 h-3" />
              <span>Painel do Escritório</span>
            </button>
            <span>•</span>
            <span className="text-zinc-600">Código de Ética e Disciplina da OAB</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
