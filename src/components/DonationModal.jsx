import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Copy, Check, QrCode, Building2, Package, Sparkles, ShieldCheck } from 'lucide-react';

export function DonationModal() {
  const { isDonationOpen, setIsDonationOpen, siteConfig, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('pix');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDonationOpen(false);
    };
    if (isDonationOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDonationOpen, setIsDonationOpen]);

  if (!isDonationOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(siteConfig.pix.key);
    setCopiedKey(true);
    showToast('Chave PIX copiada para a área de transferência!');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleCopyBank = () => {
    const bankDetails = `Banco: ${siteConfig.pix.bank}\nAgência: ${siteConfig.pix.agency}\nConta: ${siteConfig.pix.account}\nFavorecido: ${siteConfig.pix.receiver}\nCNPJ: ${siteConfig.contact.cnpj}`;
    navigator.clipboard.writeText(bankDetails);
    setCopiedAccount(true);
    showToast('Dados bancários copiados!');
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(siteConfig.pix.key)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col border border-gray-100">
        
        {/* Header with warm banner */}
        <div className="bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-amber-600 p-6 text-white relative">
          <button
            onClick={() => setIsDonationOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold">Apoie o Projeto João de Barro</h2>
              <p className="text-xs text-terracotta-100">Sua contribuição transforma sorrisos e garante oficinas lúdicas.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-white/20">
            <button
              onClick={() => setActiveTab('pix')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pix' ? 'bg-white text-terracotta-800 shadow' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              PIX Instantâneo
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bank' ? 'bg-white text-terracotta-800 shadow' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Conta Bancária
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'items' ? 'bg-white text-terracotta-800 shadow' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Doar Materiais
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'pix' && (
            <div className="space-y-6">
              {/* Suggested Amounts */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Sugestão de valor para transformar o mês de uma criança:
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                        selectedAmount === amt
                          ? 'bg-terracotta-50 border-terracotta-600 text-terracotta-700 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      R$ {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code & Key Box */}
              <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-44 h-44 rounded-2xl bg-white p-2 border border-gray-200 shadow-sm shrink-0 flex items-center justify-center">
                  <img src={qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
                </div>
                
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div className="text-xs font-bold text-gray-500 uppercase">Chave PIX Oficial ({siteConfig.pix.type})</div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200 text-sm font-mono font-bold text-gray-800 break-all select-all shadow-inner">
                    {siteConfig.pix.key}
                  </div>
                  
                  <button
                    onClick={handleCopyPix}
                    className="w-full py-3 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedKey ? 'Chave Copiada!' : 'Copiar Chave PIX'}
                  </button>
                </div>
              </div>

              {/* Titular info */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Favorecido Homologado:
                </div>
                <p><strong>Nome:</strong> {siteConfig.pix.receiver}</p>
                <p><strong>CNPJ:</strong> {siteConfig.contact.cnpj}</p>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">Banco</span>
                    <span className="font-bold text-gray-900">{siteConfig.pix.bank}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Agência</span>
                    <span className="font-bold text-gray-900">{siteConfig.pix.agency}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Conta Corrente</span>
                    <span className="font-bold text-gray-900">{siteConfig.pix.account}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">CNPJ da Associação</span>
                    <span className="font-bold text-gray-900">{siteConfig.contact.cnpj}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500 block">Razão Social / Titular</span>
                  <span className="font-bold text-gray-900">{siteConfig.pix.receiver}</span>
                </div>
              </div>

              <button
                onClick={handleCopyBank}
                className="w-full py-3.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {copiedAccount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedAccount ? 'Dados Bancários Copiados!' : 'Copiar Todos os Dados Bancários'}
              </button>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-amber-900 text-sm mb-2">Itens que Mais Precisamos no Momento:</h4>
                <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
                  <li>Tintas guache, pincéis, folhas sulfite e cartolinas</li>
                  <li>Jogos educativos de tabuleiro, dominó e quebra-cabeças</li>
                  <li>Livros infantis ilustrados e gibis em bom estado</li>
                  <li>Bolas esportivas (futebol, vôlei, basquete) e cordas</li>
                  <li>Alimentos não-perecíveis para os lanches das crianças</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-3">
                <p className="text-xs text-gray-600">
                  Ponto de Entrega: <strong>{siteConfig.contact.address}</strong><br />
                  Horário: {siteConfig.contact.serviceHours}
                </p>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de agendar a doação de materiais/brinquedos para o Projeto João de Barro.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Agendar Entrega via WhatsApp
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
