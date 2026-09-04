import React from 'react';
import { 
  Sparkles, 
  Globe, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { COMPANY_INFO } from '../data/drywallData';

export function DrywallDiBrunelliNotice() {
  return (
    <section id="dibrunelli" className="py-20 bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-[#0B0F19] dark:via-[#0F172A] dark:to-[#0B0F19] transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-slate-900 via-[#0A2540] to-[#003B99] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Brand Notice & Details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Registro de Marca &bull; Nova Identidade Corporativa</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Drywall Distribuidora é <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">Di Brunelli</span>.
              </h2>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Estamos registrando formalmente a marca <strong className="text-white font-bold">Di Brunelli (com dois 'L')</strong>. Mais do que uma distribuidora local, estamos construindo a principal rede integrada de soluções em construção a seco do estado de São Paulo.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-cyan-400/20 text-cyan-300 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Domínio Oficial e E-commerce em Preparação</h4>
                    <p className="text-xs text-slate-300">
                      O endereço <span className="font-mono text-cyan-300 font-semibold">{COMPANY_INFO.domain}</span> está sendo estruturado para ser a futura loja virtual da distribuidora, permitindo compras diretas, consulta de estoque em tempo real e recompra rápida para instaladores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-cyan-400/20 text-cyan-300 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Loja Conceito & Showroom Técnico</h4>
                    <p className="text-xs text-slate-300">
                      Espaço físico dedicado para demonstração prática de placas acústicas, sistemas corta-fogo, Steel Framing e iluminação embutida em forros para arquitetos e engenheiros.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-cyan-400/20 text-cyan-300 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Clube do Instalador e Benefícios PJ</h4>
                    <p className="text-xs text-slate-300">
                      Tabela de fidelidade progressiva, faturamento faturado estendido e suporte de especificação técnica para licitações e obras corporativas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de cadastrar minha empresa ou cadastro profissional na futura loja e distribuidora Di Brunelli.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-cyan-300 hover:bg-cyan-200 shadow-lg shadow-cyan-300/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Pré-Cadastrar Minha Empresa na Di Brunelli</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Right Column: Visual Domain & Brand Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-300" />
                    <span className="text-xs font-mono font-bold text-cyan-300">dibrunelli.com.br</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                    Domínio Registrado
                  </span>
                </div>

                <div className="text-center py-4 space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0052D9] to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Layers className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    DI BRUNELLI
                  </h3>
                  <p className="text-xs font-semibold text-blue-200 tracking-widest uppercase">
                    Distribuidora &bull; Sistemas Construtivos
                  </p>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    A evolução da sua fornecedora de drywall no interior de São Paulo.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-200">
                    <span>Fase do Projeto Digital:</span>
                    <span className="text-white">Homologação Técnica</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 w-3/4 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>Registro & Identidade (Concluído)</span>
                    <span>Loja Virtual (Em breve)</span>
                  </div>
                </div>

                <div className="text-center text-[11px] text-slate-300">
                  Transição transparente &bull; Atendimento comercial 100% ativo pelos canais habituais.
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
