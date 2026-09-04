import React, { useState, useEffect } from 'react';
import RadioApp from './RadioApp';
import { AmpProvider, useAmp } from './context/AmpContext';
import { AmpNavbar } from './components/amp/AmpNavbar';
import { AmpHero } from './components/amp/AmpHero';
import { AmpFullStackSection } from './components/amp/AmpFullStackSection';
import { AmpEcosystemSection } from './components/amp/AmpEcosystemSection';
import { AmpSolutionsAndCasesSection } from './components/amp/AmpSolutionsAndCasesSection';
import { AmpLeadershipUptimeSection } from './components/amp/AmpLeadershipUptimeSection';
import { AmpDiagnosticSection } from './components/amp/AmpDiagnosticSection';
import { AmpClientPortalSection } from './components/amp/AmpClientPortalSection';
import { AmpFooter } from './components/amp/AmpFooter';
import { AmpModals } from './components/amp/AmpModals';
import { AmpRadioBar } from './components/amp/AmpRadioBar';
import { AmpAdminPanel } from './components/amp/AmpAdminPanel';

function MainPortal() {
  const { currentView, toast, themeMode } = useAmp();
  const isDark = themeMode === 'dark';

  if (currentView === 'admin') {
    return (
      <div className={`min-h-screen font-sans antialiased ${
        isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <AmpAdminPanel />
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
            <div className={`px-5 py-3 rounded-xl shadow-lg border text-xs font-normal ${
              toast.type === 'error' ? 'bg-rose-900 text-white border-rose-700' :
              toast.type === 'warning' ? 'bg-amber-800 text-white border-amber-600' :
              'bg-[#0052D9] text-white border-[#003B99]'
            }`}>
              {toast.message}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] text-slate-100 selection:bg-[#0052D9] selection:text-white' : 'bg-white text-slate-900 selection:bg-blue-100 selection:text-[#0052D9]'
    }`}>
      {/* 1. Header & Navigation */}
      <AmpNavbar />

      {/* Main Flow: Exact Scroll Sequence */}
      <main>
        {/* Hero Section with Cropped AMP Globe Watermark & 100vw Fluid Wave */}
        <AmpHero />

        {/* Full-Stack Layered Architecture */}
        <AmpFullStackSection />

        {/* Ecosystem Catalog & Hairline Grid */}
        <AmpEcosystemSection />

        {/* End-to-End Solutions & Fluid Organic Industry Cases */}
        <AmpSolutionsAndCasesSection />

        {/* Leadership Status, Social Proof & 24/7 Continuous Operation */}
        <AmpLeadershipUptimeSection />

        {/* Interactive 360° Diagnostic Simulator */}
        <AmpDiagnosticSection />

        {/* Client Portal Hub (Continuous Hairline Grid) */}
        <AmpClientPortalSection />
      </main>

      {/* Multi-Column Enterprise Footer */}
      <AmpFooter />

      {/* Modals & Live Radio Player Dock */}
      <AmpModals />
      <AmpRadioBar />

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 animate-fadeIn">
          <div className={`px-5 py-3 rounded-xl shadow-xl border text-xs font-normal ${
            toast.type === 'error' ? 'bg-rose-900 text-white border-rose-700' :
            toast.type === 'warning' ? 'bg-amber-800 text-white border-amber-600' :
            'bg-[#0052D9] text-white border-[#003B99]'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isRadio, setIsRadio] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return hostname.includes('amplificadora') || params.get('app') === 'radio';
  });

  useEffect(() => {
    const checkRoute = () => {
      const hostname = window.location.hostname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      setIsRadio(hostname.includes('amplificadora') || params.get('app') === 'radio');
    };
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  if (isRadio) {
    return <RadioApp />;
  }

  return (
    <AmpProvider>
      <MainPortal />
    </AmpProvider>
  );
}
