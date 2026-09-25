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

import CashFlowApp from './CashFlowApp';
import DrywallApp from './drywall/DrywallApp';
import PalmeirenseApp from './palmeirense/PalmeirenseApp';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GlobalErrorBoundary caught error:', error, errorInfo);
  }

  handleLimparCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0F2B27',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 420,
            background: '#16352F',
            borderRadius: 16,
            border: '1px solid #234A42',
            padding: 28,
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#E8A33D',
              color: '#0F2B27',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 700,
              margin: '0 auto 16px',
              fontFamily: 'Georgia, serif'
            }}>
              R$
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FAF8F3', marginBottom: 8 }}>
              Recuperação do Sistema
            </div>
            <p style={{ fontSize: 13, color: '#9FBDB5', lineHeight: 1.5, marginBottom: 20 }}>
              Ocorreu uma pequena instabilidade ao carregar a interface. Clique abaixo para restabelecer o aplicativo.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: '#0B1E1B',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 11.5,
                color: '#E8A33D',
                fontFamily: 'monospace',
                marginBottom: 20,
                textAlign: 'left',
                overflowX: 'auto',
                maxHeight: 100
              }}>
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  background: '#E8A33D',
                  color: '#0F2B27',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Recarregar Página
              </button>
              <button
                type="button"
                onClick={this.handleLimparCache}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: 10,
                  background: 'transparent',
                  color: '#9FBDB5',
                  border: '1px solid #2C5048',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Limpar Cache e Entrar Novamente
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeMode, setActiveMode] = useState(() => {
    if (typeof window === 'undefined') return 'cashflow';
    const hostname = window.location.hostname.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    if (hostname.includes('palmeirense') || params.get('app') === 'palmeirense' || params.get('app') === 'ecp') {
      return 'palmeirense';
    }
    if (hostname.includes('drywall') || hostname.includes('dibrunelli') || params.get('app') === 'drywall') {
      return 'drywall';
    }
    if (hostname.includes('amplificadora') || params.get('app') === 'radio') {
      return 'radio';
    }
    if (params.get('app') === 'portal') {
      return 'portal';
    }
    // Default for dre.amp.ia.br, amp-flow.vercel.app, and general usage:
    return 'cashflow';
  });

  useEffect(() => {
    // Redirecionamento de conveniência se acessar pelo domínio da loja dibrunelli.com.br:
    if (typeof window !== 'undefined' && window.location.hostname.includes('dibrunelli.com.br')) {
      window.location.replace('https://drywalldistribuidora.com.br' + window.location.pathname + window.location.search);
      return;
    }

    const checkRoute = () => {
      const hostname = window.location.hostname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hostname.includes('palmeirense') || params.get('app') === 'palmeirense' || params.get('app') === 'ecp') {
        setActiveMode('palmeirense');
      } else if (hostname.includes('drywall') || hostname.includes('dibrunelli') || params.get('app') === 'drywall') {
        setActiveMode('drywall');
      } else if (hostname.includes('amplificadora') || params.get('app') === 'radio') {
        setActiveMode('radio');
      } else if (params.get('app') === 'portal') {
        setActiveMode('portal');
      } else {
        setActiveMode('cashflow');
      }
    };
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const favEl = document.getElementById('dynamic-favicon') || document.querySelector("link[rel*='icon']");

    if (activeMode === 'palmeirense') {
      document.title = 'Esporte Clube Palmeirense • Desde 1908 | Santa Cruz das Palmeiras';
    } else if (activeMode === 'drywall') {
      document.title = 'Drywall Distribuidora • Di Brunelli | Interior de SP';
      if (favEl) favEl.href = '/vite.svg';
    } else if (activeMode === 'radio') {
      document.title = 'Rádio Amplificadora • Ampliando sua onda musical';
      if (favEl) favEl.href = '/favicon-amplificadora.jpg';
    } else if (activeMode === 'portal') {
      document.title = 'AMP Institucional • Ecossistema Full-Stack';
      if (favEl) favEl.href = '/amp-mesh-logo.png';
    } else {
      document.title = 'AMP Flow — Fluxo de caixa e DRE sem mistério';
      if (favEl) favEl.href = '/vite.svg';
    }
  }, [activeMode]);

  return (
    <GlobalErrorBoundary>
      {activeMode === 'palmeirense' && <PalmeirenseApp />}
      {activeMode === 'drywall' && <DrywallApp />}
      {activeMode === 'radio' && <RadioApp />}
      {activeMode === 'portal' && (
        <AmpProvider>
          <MainPortal />
        </AmpProvider>
      )}
      {activeMode === 'cashflow' && <CashFlowApp />}
    </GlobalErrorBoundary>
  );
}
