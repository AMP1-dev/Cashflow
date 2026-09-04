import React, { useState } from 'react';
import { VOLUNTEER_AREAS, PARTNER_COMPANIES } from '../data/apaeData';
import { useApae } from '../context/ApaeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Users, 
  Building2, 
  Heart, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Briefcase, 
  Send, 
  FileText, 
  Handshake,
  Volume2
} from 'lucide-react';

export function VolunteerAndPartnershipSection() {
  const { registerVolunteer, registerPartner, showToast } = useApae();
  const { speakText } = useAccessibility();

  const [activeTab, setActiveTab] = useState('voluntariado'); // 'voluntariado' | 'empresas'

  // Form Voluntário
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volArea, setVolArea] = useState('recreacao');
  const [volAvailability, setVolAvailability] = useState('');
  const [volMotivation, setVolMotivation] = useState('');
  const [volTerms, setVolTerms] = useState(false);

  // Form Empresa
  const [empCompany, setEmpCompany] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');
  const [empContact, setEmpContact] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empModality, setEmpModality] = useState('lei_cotas');
  const [empMessage, setEmpMessage] = useState('');

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    if (!volTerms) {
      showToast("Por favor, aceite os termos da Lei do Voluntariado para continuar.", "error");
      return;
    }

    registerVolunteer({
      name: volName,
      email: volEmail,
      phone: volPhone,
      area: volArea,
      availability: volAvailability,
      motivation: volMotivation
    });

    setVolName('');
    setVolEmail('');
    setVolPhone('');
    setVolAvailability('');
    setVolMotivation('');
    setVolTerms(false);
  };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();

    registerPartner({
      company: empCompany,
      cnpj: empCnpj,
      contactName: empContact,
      email: empEmail,
      phone: empPhone,
      modality: empModality,
      message: empMessage
    });

    setEmpCompany('');
    setEmpCnpj('');
    setEmpContact('');
    setEmpEmail('');
    setEmpPhone('');
    setEmpMessage('');
  };

  return (
    <section id="participe" aria-label="Voluntariado e Parcerias Empresariais da APAE" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200 mb-3">
            <Handshake className="w-4 h-4 text-purple-600" />
            <span>Faça Parte Desta Causa</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Voluntariado e <span className="text-apae-blue-600">Parcerias Empresariais ESG</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Seja doando seu tempo e talento como voluntário ou associando sua empresa à nossa causa através de incentivos fiscais e contratação inclusiva.
          </p>

          <button
            onClick={() => speakText("Seção de voluntariado e parcerias empresariais. Inscreva-se para ser um voluntário da APAE ou torne sua empresa parceira através de programas de responsabilidade social e Lei de Cotas.")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-apae-blue-600 transition-colors"
            title="Ouvir descrição da seção"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir este resumo</span>
          </button>
        </div>

        {/* Seletor de Abas */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab('voluntariado')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all ${
              activeTab === 'voluntariado'
                ? 'bg-apae-blue-600 text-white shadow-lg shadow-apae-blue-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quero Ser Voluntário</span>
          </button>

          <button
            onClick={() => setActiveTab('empresas')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all ${
              activeTab === 'empresas'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Empresas Parceiras (ESG)</span>
          </button>
        </div>

        {/* Aba Voluntariado */}
        {activeTab === 'voluntariado' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-fade-in">
            
            {/* Benefícios e Áreas */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-7 space-y-4">
                <h3 className="text-xl font-black text-slate-900">
                  Por que ser voluntário na APAE?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  O trabalho voluntário na APAE é regido pela Lei Federal nº 9.608/98. Oferecemos capacitação inicial, acompanhamento com terapeutas e emissão de certificado oficial com horas complementares.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Ambiente acolhedor, seguro e com impacto humano direto.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Flexibilidade de horários: diário, semanal ou pontual para eventos.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Certificado de horas de extensão e responsabilidade social.</span>
                  </div>
                </div>
              </div>

              {/* Áreas Disponíveis */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-3">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Áreas com Vagas Abertas
                </h4>
                <div className="space-y-2">
                  {VOLUNTEER_AREAS.map((a) => (
                    <div key={a.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900">{a.label}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário de Inscrição */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-2">Formulário de Cadastro de Voluntário</h3>
              <p className="text-xs text-slate-500 mb-6">Preencha seus dados para que nossa coordenação entre em contato para uma entrevista de alinhamento.</p>

              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">E-mail *</label>
                    <input
                      type="email"
                      required
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp / Telefone *</label>
                    <input
                      type="tel"
                      required
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Área de Maior Interesse *</label>
                    <select
                      value={volArea}
                      onChange={(e) => setVolArea(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                    >
                      {VOLUNTEER_AREAS.map((a) => (
                        <option key={a.id} value={a.id}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Disponibilidade de Dias e Horários *</label>
                  <input
                    type="text"
                    required
                    value={volAvailability}
                    onChange={(e) => setVolAvailability(e.target.value)}
                    placeholder="Ex: Sábados pela manhã ou terças à tarde"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Conte um pouco sobre sua motivação:</label>
                  <textarea
                    rows="3"
                    value={volMotivation}
                    onChange={(e) => setVolMotivation(e.target.value)}
                    placeholder="O que te motiva a ser voluntário na APAE?"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-apae-blue-600 outline-none"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="volTerms"
                    checked={volTerms}
                    onChange={(e) => setVolTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-apae-blue-600 focus:ring-apae-blue-600"
                  />
                  <label htmlFor="volTerms" className="text-[11px] text-slate-600 leading-tight">
                    Estou ciente de que o serviço voluntário não gera vínculo empregatício, sendo regido pela Lei 9.608/98 e pelos princípios éticos da APAE.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-apae-blue-600 hover:bg-apae-blue-700 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR CANDIDATURA DE VOLUNTÁRIO</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Aba Parcerias Empresariais */}
        {activeTab === 'empresas' && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Vitrine de Modalidades Corporativas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Selo Empresa Amiga da APAE</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reconhecimento institucional para empresas que realizam doações contínuas, programas de troco solidário ou campanhas internas de arrecadação.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-apae-blue-700 flex items-center justify-center font-black">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Lei de Cotas PcD (Lei 8.213)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assessoria completa em Emprego Apoiado, seleção de jovens formados na APAE e treinamento de equipes para cumprimento da cota com inclusão de verdade.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Renúncia Fiscal PRONAS & Fundo da Criança</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Destine até 1% do Imposto de Renda devido da sua empresa (Lucro Real) para equipar clínicas e adquirir tecnologia assistiva sem custos adicionais.
                </p>
              </div>

            </div>

            {/* Vitrine de Empresas Parceiras */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-slate-900">Empresas que Apoiam Nossa Causa</h3>
                <p className="text-xs text-slate-500">Unindo a força do setor produtivo com o impacto social da APAE</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {PARTNER_COMPANIES.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 hover:border-apae-blue-400 transition-colors">
                    <div className="text-3xl">{comp.logo}</div>
                    <div className="text-xs font-black text-slate-900 line-clamp-1">{comp.name}</div>
                    <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      {comp.seal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário Corporativo */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-black text-white mb-2">Cadastrar Proposta de Parceria Corporativa</h3>
              <p className="text-xs text-slate-400 mb-6">Nossa equipe de Captação e Relações Institucionais entrará em contato para apresentar um plano personalizado para sua empresa.</p>

              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Razão Social / Nome Fantasia *</label>
                    <input
                      type="text"
                      required
                      value={empCompany}
                      onChange={(e) => setEmpCompany(e.target.value)}
                      placeholder="Empresa Ltda"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">CNPJ *</label>
                    <input
                      type="text"
                      required
                      value={empCnpj}
                      onChange={(e) => setEmpCnpj(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Nome do Responsável *</label>
                    <input
                      type="text"
                      required
                      value={empContact}
                      onChange={(e) => setEmpContact(e.target.value)}
                      placeholder="Nome e Cargo"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      placeholder="contato@empresa.com.br"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Telefone Comercial *</label>
                    <input
                      type="tel"
                      required
                      value={empPhone}
                      onChange={(e) => setEmpPhone(e.target.value)}
                      placeholder="(11) 3333-4444"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Modalidade de Interesse:</label>
                  <select
                    value={empModality}
                    onChange={(e) => setEmpModality(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                  >
                    <option value="lei_cotas">Contratação Inclusiva PcD (Lei 8.213 / Emprego Apoiado)</option>
                    <option value="selo_amigo">Selo Empresa Amiga da APAE (Doação Recorrente / ESG)</option>
                    <option value="incentivo_fiscal">Patrocínio com Renúncia Fiscal (PRONAS / FIA)</option>
                    <option value="voluntariado_corporativo">Ação de Voluntariado Corporativo</option>
                    <option value="doacao_equipamentos">Doação de Equipamentos ou Insumos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mensagem ou Proposta:</label>
                  <textarea
                    rows="3"
                    value={empMessage}
                    onChange={(e) => setEmpMessage(e.target.value)}
                    placeholder="Descreva detalhes sobre como sua empresa gostaria de colaborar..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-apae-yellow-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-apae-yellow-400 to-amber-500 hover:from-apae-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Handshake className="w-5 h-5" />
                  <span>SOLICITAR CONTATO INSTITUCIONAL ESG</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
