import React, { useState } from 'react';
import { FmaProvider, useFma } from '../context/FmaContext';
import { FmaNavbarLight } from '../components/fma/FmaNavbarLight';
import { FmaHeroLight } from '../components/fma/FmaHeroLight';
import { FmaPurposeLight } from '../components/fma/FmaPurposeLight';
import { FmaPracticeAreasLight } from '../components/fma/FmaPracticeAreasLight';
import { FmaTeamLight } from '../components/fma/FmaTeamLight';
import { FmaContactLight } from '../components/fma/FmaContactLight';
import { FmaFooterLight } from '../components/fma/FmaFooterLight';
import { FmaInteractiveTriage } from '../components/fma/FmaInteractiveTriage';
import { FmaPracticeDetailModal } from '../components/fma/FmaPracticeDetailModal';
import { FmaAdminPanel } from '../components/fma/FmaAdminPanel';
import { Phone } from 'lucide-react';

function FmaPortalLight() {
  const { isAdminOpen, setIsAdminOpen, firmConfig, toast } = useFma();
  const [selectedArea, setSelectedArea] = useState(null);
  const [isTriageOpen, setIsTriageOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#06172B] text-[#14233C] dark:text-[#CFD4DB] font-sans antialiased selection:bg-[#EAE5DF] selection:text-[#14233C] transition-colors duration-300">
      
      {/* 1. Header Minimalista com Botão de Modo Escuro / Claro */}
      <FmaNavbarLight />

      <main className="w-full">
        {/* 2. Hero Section (Idêntico ao Screenshot 1 do Eid) */}
        <FmaHeroLight />

        {/* 3. Manifesto & Propósito (Idêntico ao Screenshot 2 do Eid) */}
        <FmaPurposeLight />

        {/* 4. Áreas de Atuação (Idêntico aos Screenshots 2 e 3 do Eid) */}
        <FmaPracticeAreasLight 
          onSelectArea={(area) => setSelectedArea(area)}
          onOpenTriage={() => setIsTriageOpen(true)}
        />

        {/* 5. Nossa Equipe & Dr. Fernando Maeda (Idêntico ao Bloco 3 do Eid) */}
        <FmaTeamLight />

        {/* 6. Entre em Contato Conosco (Idêntico ao Bloco 4 do Eid) */}
        <FmaContactLight onOpenTriage={() => setIsTriageOpen(true)} />
      </main>

      {/* 7. Rodapé Minimalista (Idêntico ao Bottom-Bar do Eid) */}
      <FmaFooterLight />

      {/* Botão Flutuante Discreto de WhatsApp */}
      <a
        href={`https://wa.me/${firmConfig.contacts?.whatsapp || '5511948900900'}?text=${encodeURIComponent('Olá Dr. Fernando Maeda, gostaria de uma consulta jurídica.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#14233C] hover:bg-[#8E7A66] dark:bg-[#0E2238] dark:hover:bg-[#152E4B] dark:border dark:border-white/15 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105"
        title="Falar no WhatsApp"
      >
        <Phone className="w-5 h-5 text-white dark:text-[#D9C8A6]" />
      </a>

      {/* Modal de Triagem Rápida de Liminares */}
      {isTriageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1A2F] rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10">
            <div className="p-4 bg-[#14233C] dark:bg-[#06172B] text-white flex items-center justify-between border-b dark:border-white/10">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#D9C8A6]">Plantão de Liminares e Triagem</span>
              <button onClick={() => setIsTriageOpen(false)} className="text-white/70 hover:text-white text-sm">✕ Fechar</button>
            </div>
            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <FmaInteractiveTriage onClose={() => setIsTriageOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Área de Atuação */}
      {selectedArea && (
        <FmaPracticeDetailModal 
          area={selectedArea} 
          onClose={() => setSelectedArea(null)}
          onOpenTriage={() => {
            setSelectedArea(null);
            setIsTriageOpen(true);
          }} 
        />
      )}

      {/* Painel Administrativo CMS */}
      {isAdminOpen && (
        <FmaAdminPanel onClose={() => setIsAdminOpen(false)} />
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 animate-fadeIn">
          <div className="px-5 py-3 rounded-lg shadow-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0E2238] text-xs font-semibold text-[#14233C] dark:text-[#D9C8A6]">
            {toast.message}
          </div>
        </div>
      )}

    </div>
  );
}

export default function FmaApp() {
  return (
    <FmaProvider>
      <FmaPortalLight />
    </FmaProvider>
  );
}
