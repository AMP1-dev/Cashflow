import React from 'react';
import { PalmeirenseProvider, usePalmeirense } from './context/PalmeirenseContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { ClubStats } from './components/ClubStats';
import { HistorySection } from './components/HistorySection';
import { SportsComplexSection } from './components/SportsComplexSection';
import { AquaticComplexSection } from './components/AquaticComplexSection';
import { EventsAndPartiesSection } from './components/EventsAndPartiesSection';
import { PublicationsSection } from './components/PublicationsSection';
import { MembershipSection } from './components/MembershipSection';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { AdminPanel } from './admin/AdminPanel';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function PalmeirenseContent() {
  const { toastMessage } = usePalmeirense();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* 1. Header Fixo com Topbar */}
      <Header />

      {/* 2. Hero Principal Grande & Impactante com Slider */}
      <HeroSlider />

      {/* 3. Barra de Estatísticas Centenárias */}
      <ClubStats />

      {/* 4. História & Tradição (Desde 1908) */}
      <HistorySection />

      {/* 5. Parque Aquático & Lazer Familiar */}
      <AquaticComplexSection />

      {/* 6. Complexo Esportivo, Quadras & Academia */}
      <SportsComplexSection />

      {/* 7. Bailes Tradicionais, Boate Gênesis & Shows */}
      <EventsAndPartiesSection />

      {/* 8. Seção de Publicações & Compartilhamento nas Redes Sociais */}
      <PublicationsSection />

      {/* 9. Seja Sócio (Planos & Adesão via WhatsApp) */}
      <MembershipSection />

      {/* 10. Rodapé Completo */}
      <Footer />

      {/* Modais Flutuantes de Compartilhamento e Painel Administrativo */}
      <ShareModal />
      <AdminPanel />

      {/* Notificação Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn max-w-sm">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 ${
            toastMessage.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-slate-100 border-slate-700'
              : 'bg-emerald-950 text-emerald-100 border-emerald-700'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : toastMessage.type === 'info' ? (
              <Info className="w-4 h-4 text-slate-300 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PalmeirenseApp() {
  return (
    <PalmeirenseProvider>
      <PalmeirenseContent />
    </PalmeirenseProvider>
  );
}
