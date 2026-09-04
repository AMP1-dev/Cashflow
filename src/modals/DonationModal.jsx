import React, { useState } from 'react';
import { useApae } from '../context/ApaeContext';
import { DONATION_AMOUNTS, INSTITUTION_DATA } from '../data/apaeData';
import { 
  X, 
  Heart, 
  QrCode, 
  CreditCard, 
  Barcode, 
  Copy, 
  Check, 
  Lock, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function DonationModal() {
  const { donationModalOpen, closeDonationModal, donationModalConfig, recordDonation, showToast } = useApae();
  
  const [selectedVal, setSelectedVal] = useState(donationModalConfig.amount || 60);
  const [customVal, setCustomVal] = useState('');
  const [payMethod, setPayMethod] = useState('pix');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);

  if (!donationModalOpen) return null;

  const currentVal = customVal ? Number(customVal) : selectedVal;

  const handleCopyPix = () => {
    const payload = `00020126580014br.gov.bcb.pix013612345678000190520400005303986540${currentVal.toFixed(2)}5802BR5925APAE ASSOC PAIS AMIGOS6009SAO PAULO62070503***6304E8A2`;
    navigator.clipboard.writeText(payload);
    setCopiedPix(true);
    showToast("Chave PIX e código Copia-e-Cola copiados!");
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleComplete = (e) => {
    e.preventDefault();
    if (!donorName.trim()) {
      showToast("Por favor, informe seu nome.", "error");
      return;
    }

    recordDonation({
      name: donorName,
      value: currentVal,
      method: payMethod.toUpperCase(),
      type: donationModalConfig.type === 'recorrente' ? 'Mensal' : 'Única',
      destination: donationModalConfig.projectName || "Fundo de Reabilitação Geral"
    });

    closeDonationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apae-yellow-500 text-slate-950 flex items-center justify-center font-black">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-black">Doação Online para a APAE</h3>
              <p className="text-xs text-slate-400">
                {donationModalConfig.projectName ? `Destino: ${donationModalConfig.projectName}` : 'Apoio aos atendimentos clínicos e pedagógicos'}
              </p>
            </div>
          </div>

          <button
            onClick={closeDonationModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Modal com Scroll */}
        <form onSubmit={handleComplete} className="p-6 space-y-6 overflow-y-auto">
          
          {/* Seletor de Valor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Escolha o valor da doação:</label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 120, 250].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setSelectedVal(v);
                    setCustomVal('');
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-black transition-all ${
                    selectedVal === v && !customVal
                      ? 'border-apae-blue-600 bg-blue-50 text-apae-blue-600 ring-2 ring-apae-blue-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  R$ {v},00
                </button>
              ))}
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Forma de pagamento:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pix', label: 'PIX', icon: QrCode },
                { id: 'cartao', label: 'Cartão', icon: CreditCard },
                { id: 'boleto', label: 'Boleto', icon: Barcode },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      payMethod === m.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dados do Doador */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Seu Nome *</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Nome completo"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Seu E-mail *</label>
              <input
                type="email"
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
              />
            </div>
          </div>

          {/* Área PIX no Modal */}
          {payMethod === 'pix' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Chave PIX (CNPJ):</span>
                <code className="font-mono text-emerald-600 font-bold">{INSTITUTION_DATA.cnpj}</code>
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedPix ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPix ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
              </button>
            </div>
          )}

          {/* Botão de Finalizar */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-apae-yellow-400 to-amber-500 hover:from-apae-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>CONFIRMAR DOAÇÃO DE R$ {currentVal},00</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transação Segura • APAE Oficial Certificada</span>
          </div>

        </form>

      </div>
    </div>
  );
}
