import React from 'react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { RadioNavbar } from './components/RadioNavbar';
import { HeroLiveStream } from './components/HeroLiveStream';
import { ChannelsSection } from './components/ChannelsSection';
import { ShowsSection } from './components/ShowsSection';
import { B2BIndoorSection } from './components/B2BIndoorSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ArticlesSection } from './components/ArticlesSection';
import { StickyBottomPlayer } from './components/StickyBottomPlayer';
import { RadioFooter } from './components/RadioFooter';
import { SongRequestModal } from './components/SongRequestModal';
import { ShowDetailModal } from './components/ShowDetailModal';
import { ArticleModal } from './components/ArticleModal';
import { IndoorPlayerModal } from './components/IndoorPlayerModal';
import { RadioAdminPanel } from './admin/RadioAdminPanel';
import { Toast } from './components/Toast';

function MainRadioApp() {
  const { currentView, toast } = useRadio();

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0910] font-sans antialiased text-slate-100 selection:bg-pink-600 selection:text-white">
        <RadioAdminPanel />
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
            <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-black backdrop-blur-md ${
              toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-pink-950/90 border-pink-500/50 text-pink-200'
            }`}>
              {toast.message}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0910] font-sans antialiased text-slate-100 selection:bg-pink-600 selection:text-white">
      <RadioNavbar />
      <main>
        <HeroLiveStream />
        <ChannelsSection />
        <ShowsSection />
        <B2BIndoorSection />
        <ScheduleSection />
        <ArticlesSection />
      </main>
      <RadioFooter />

      {/* Floating Global Persistent Player */}
      <StickyBottomPlayer />

      {/* Interactive Modals */}
      <SongRequestModal />
      <ShowDetailModal />
      <ArticleModal />
      <IndoorPlayerModal />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 animate-fadeIn">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-black backdrop-blur-md ${
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-pink-950/90 border-pink-500/50 text-pink-200'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <RadioProvider>
      <MainRadioApp />
    </RadioProvider>
  );
}
