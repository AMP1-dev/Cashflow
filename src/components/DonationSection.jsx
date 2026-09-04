import React, { useState, useEffect } from 'react';
import { DONATION_AMOUNTS, INSTITUTION_DATA } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Heart, 
  QrCode, 
  CreditCard, 
  Barcode, 
  Receipt, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Calendar, 
  Clock, 
  Download, 
  FileText, 
  Smile,
  Volume2
} from 'lucide-react';

export function DonationSection() {
  const { recordDonation, showToast } = useApae();
  const { speakText } = useAccessibility();

  const [donationType, setDonationType] = useState('recorrente'); // 'recorrente' | 'unica'
  const [selectedAmount, setSelectedAmount] = useState(60);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'cartao' | 'boleto' | 'cupom'
  
  // Doador info
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorCpf, setDonorCpf] = useState('');

  // Cartão info
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Estado PIX
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState(900); // 15 min

  const currentAmountValue = customAmount ? Number(customAmount) : selectedAmount;

  // Timer PIX
  useEffect(() => {
    if (paymentMethod !== 'pix') return;
    const timer = setInterval(() => {
      setPixTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopyPixPayload = () => {
    const pixPayload = `00020126580014br.gov.bcb.pix013612345678000190520400005303986540${currentAmountValue.toFixed(2)}5802BR5925APAE ASSOC PAIS AMIGOS6009SAO PAULO62070503***6304E8A2`;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    showToast("Código PIX Copia-e-Cola copiado para a área de transferência!");
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmDonation = (e) => {
    if (e) e.preventDefault();

    if (!donorName.trim()) {
      showToast("Por favor, preencha seu nome para identificação da doação.", "error");
      return;
    }

    recordDonation({
      name: donorName,
      value: currentAmountValue,
      method: paymentMethod.toUpperCase(),
      type: donationType === 'recorrente' ? 'Mensal' : 'Única',
      destination: "Fundo de Atendimento Clínico e Pedagógico"
    });

    // Limpar campos
    setDonorName('');
    setDonorEmail('');
    setDonorCpf('');
    setCardNumber('');
    setCardHolder('');
  };

  return (
    <section id="doacoes" aria-label="Módulo de Doações Online da APAE" className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-apae-yellow-100 text-apae-yellow-900 border border-apae-yellow-300 mb-3">
            <Heart className="w-4 h-4 fill-apae-yellow-600 text-apae-yellow-600" />
            <span>Sua Solidariedade Transforma Histórias</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Faça sua <span className="text-apae-blue-600">Doação Online com Segurança</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Escolha como prefere contribuir: PIX instantâneo, cartão de crédito, boleto bancário ou cupom fiscal sem CPF. Cada centavo é investido na autonomia de nossos assistidos.
          </p>

          <button
            onClick={() => speakText("Módulo de doações da APAE. Escolha o valor da contribuição e o método de pagamento preferido: PIX, Cartão de Crédito ou Boleto. Sua ajuda mantém nossos atendimentos 100% gratuitos.")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-apae-blue-600 transition-colors"
            title="Ouvir instruções de doação"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir instruções de doação</span>
          </button>
        </div>

        {/* Card Central de Doação */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Topo do Card: Seletor Recorrente vs Única */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-apae-yellow-400 uppercase tracking-wider block">
                Tipo de Apoio
              </span>
              <h3 className="text-xl font-black text-white">
                Como você deseja apoiar a APAE?
              </h3>
            </div>

            <div className="bg-slate-800 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-700 w-full sm:w-auto">
              <button
                onClick={() => setDonationType('recorrente')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                  donationType === 'recorrente'
                    ? 'bg-apae-yellow-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Mensal (Recorrente)</span>
              </button>

              <button
                onClick={() => setDonationType('unica')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                  donationType === 'unica'
                    ? 'bg-apae-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Doação Única</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Passo 1: Seleção de Valores */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                1. Escolha o valor da sua contribuição:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {DONATION_AMOUNTS.map((amt) => {
                  const isSelected = selectedAmount === amt.value && !customAmount;
                  return (
                    <button
                      key={amt.value}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt.value);
                        setCustomAmount('');
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-apae-blue-600 bg-blue-50/80 ring-2 ring-apae-blue-600 shadow-md transform scale-105'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      {amt.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white shadow-sm">
                          Mais Escolhido
                        </span>
                      )}
                      <div className="text-xl sm:text-2xl font-black text-slate-900">{amt.label}</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-2">{amt.impact}</div>
                    </button>
                  );
                })}
              </div>

              {/* Valor Personalizado */}
              <div className="pt-2">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600">Ou digite outro valor:</span>
                  <div className="relative flex-1 max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500">R$</span>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Ex: 80,00"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-black text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 2: Método de Pagamento */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                2. Selecione a forma de pagamento:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'pix', label: 'PIX Instantâneo', icon: QrCode, badge: 'Instantâneo' },
                  { id: 'cartao', label: 'Cartão de Crédito', icon: CreditCard, badge: 'Em até 12x' },
                  { id: 'boleto', label: 'Boleto Bancário', icon: Barcode, badge: 'Venc. 3 dias' },
                  { id: 'cupom', label: 'Cupom Fiscal', icon: Receipt, badge: 'Sem CPF' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-apae-blue-600 bg-apae-blue-600 text-white shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-apae-yellow-400' : 'text-apae-blue-600'}`} />
                      <div className="text-xs font-black">{m.label}</div>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {m.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passo 3: Dados do Doador & Área de Pagamento */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Identificação do Doador */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nome Completo ou Razão Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    E-mail para Comprovante *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    CPF ou CNPJ
                  </label>
                  <input
                    type="text"
                    value={donorCpf}
                    onChange={(e) => setDonorCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Conteúdo Específico: PIX */}
              {paymentMethod === 'pix' && (
                <div className="space-y-6 animate-fade-in border-t border-slate-200 pt-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-6">
                    
                    {/* QR Code SVG Dinâmico */}
                    <div className="w-44 h-44 bg-slate-900 p-2.5 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        {/* QR Code Patterns */}
                        <rect x="5" y="5" width="30" height="30" rx="3" fill="#FFF" />
                        <rect x="10" y="10" width="20" height="20" rx="2" fill="#000" />
                        <rect x="14" y="14" width="12" height="12" rx="1" fill="#FFF" />

                        <rect x="65" y="5" width="30" height="30" rx="3" fill="#FFF" />
                        <rect x="70" y="10" width="20" height="20" rx="2" fill="#000" />
                        <rect x="74" y="14" width="12" height="12" rx="1" fill="#FFF" />

                        <rect x="5" y="65" width="30" height="30" rx="3" fill="#FFF" />
                        <rect x="10" y="70" width="20" height="20" rx="2" fill="#000" />
                        <rect x="14" y="74" width="12" height="12" rx="1" fill="#FFF" />

                        {/* Middle Pixels */}
                        <rect x="42" y="10" width="6" height="12" fill="#FFF" />
                        <rect x="42" y="28" width="6" height="6" fill="#FFF" />
                        <rect x="52" y="18" width="6" height="18" fill="#FFF" />

                        <rect x="40" y="42" width="20" height="20" rx="4" fill="#F5A623" />
                        <text x="50" y="55" fontSize="10" fontWeight="900" textAnchor="middle" fill="#000">PIX</text>

                        <rect x="68" y="44" width="8" height="8" fill="#FFF" />
                        <rect x="80" y="52" width="12" height="6" fill="#FFF" />
                        <rect x="42" y="68" width="8" height="24" fill="#FFF" />
                        <rect x="56" y="74" width="16" height="8" fill="#FFF" />
                        <rect x="76" y="68" width="16" height="16" fill="#FFF" />
                      </svg>
                    </div>

                    {/* Instruções do PIX */}
                    <div className="space-y-3 flex-1 text-center md:text-left">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500">
                          Valor da Doação: <strong className="text-slate-900 text-sm">R$ {currentAmountValue},00</strong>
                        </span>
                        <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Expira em: {formatTime(pixTimeLeft)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Abra o app do seu banco, escolha <strong>Pagar com PIX</strong> e aponte a câmera para o QR Code ao lado ou clique no botão abaixo para copiar o código.
                      </p>

                      <button
                        type="button"
                        onClick={handleCopyPixPayload}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                          copiedPix
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedPix ? 'Código PIX Copiado com Sucesso!' : 'Copiar Código PIX (Copia e Cola)'}</span>
                      </button>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmDonation}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>JÁ FIZ O PIX / CONFIRMAR DOAÇÃO</span>
                  </button>
                </div>
              )}

              {/* Conteúdo Específico: Cartão de Crédito */}
              {paymentMethod === 'cartao' && (
                <div className="space-y-4 animate-fade-in border-t border-slate-200 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nome Impresso no Cartão</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Como está no cartão"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Validade (MM/AA)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength="5"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          maxLength="4"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Ambiente Criptografado com Certificado SSL 256 bits</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmDonation}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-apae-blue-600 to-blue-700 hover:from-apae-blue-500 hover:to-blue-600 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                    <span>DOAR R$ {currentAmountValue},00 NO CARTÃO</span>
                  </button>
                </div>
              )}

              {/* Conteúdo Específico: Boleto */}
              {paymentMethod === 'boleto' && (
                <div className="space-y-4 animate-fade-in border-t border-slate-200 pt-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Linha Digitável do Boleto:</span>
                      <span className="text-xs text-slate-400">Banco do Brasil</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold tracking-wider break-all">
                      34191.79001 01043.510047 91020.150008 8 9845000000{String(currentAmountValue).padStart(4, '0')}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      O boleto possui vencimento para 3 dias úteis. A compensação bancária ocorre em até 48 horas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmDonation}
                    className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>GERAR E BAIXAR BOLETO BANCÁRIO</span>
                  </button>
                </div>
              )}

              {/* Conteúdo Específico: Cupom Fiscal */}
              {paymentMethod === 'cupom' && (
                <div className="space-y-4 animate-fade-in border-t border-slate-200 pt-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-sm font-black text-slate-900">
                      Como doar seus cupons fiscais da Nota Fiscal Paulista / Cidadã para a APAE:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="w-6 h-6 rounded-full bg-apae-blue-600 text-white flex items-center justify-center font-bold text-xs">1</div>
                        <strong>No app da Nota Fiscal:</strong>
                        <p>Acesse a opção 'Doação Automática com CPF'.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="w-6 h-6 rounded-full bg-apae-blue-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                        <strong>Selecione a APAE:</strong>
                        <p>Busque pelo CNPJ: <code>12.345.678/0001-90</code>.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="w-6 h-6 rounded-full bg-apae-blue-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                        <strong>Pronto!</strong>
                        <p>Todas as suas compras acumulam créditos automáticos para a APAE sem você gastar nada.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
