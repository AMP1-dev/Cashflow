import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ArrowRight, Building2, Calculator, TrendingUp, Users, PieChart, ShieldAlert, Briefcase, MessageCircle } from 'lucide-react';

const iconMap = {
  Building2,
  Calculator,
  TrendingUp,
  Users,
  PieChart,
  ShieldAlert,
  Briefcase
};

export function ServiceDetailModal() {
  const { selectedService, setSelectedService, setIsProposalOpen, setProposalPrefill, siteConfig } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedService(null);
    };
    if (selectedService) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService, setSelectedService]);

  if (!selectedService) return null;

  const IconComponent = iconMap[selectedService.icon] || Building2;

  const handleHire = () => {
    const srv = selectedService;
    setSelectedService(null);
    setProposalPrefill({ service: srv.title });
    setIsProposalOpen(true);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá! Gostaria de conversar com um especialista sobre o serviço: *${selectedService.title}*`);
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-10 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shadow-sm">
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                {selectedService.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {selectedService.title}
              </h2>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-3">
            <p className="font-semibold text-slate-800">
              {selectedService.shortDesc}
            </p>
            <p>
              {selectedService.fullDesc}
            </p>
          </div>

          {selectedService.highlights && selectedService.highlights.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                O que está incluso nesta assessoria:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleHire}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Solicitar Proposta para este Serviço</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tirar Dúvidas no WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
