import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ShieldCheck, 
  Truck, 
  Award,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { COMPARISON_DATA, COMPANY_INFO } from '../data/drywallData';
import { useDrywall } from '../context/DrywallContext';

export function DrywallAboutSection() {
  const { theme } = useDrywall();

  return (
    <section id="sobre" className="py-20 bg-slate-50 dark:bg-[#0E131F] transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0052D9] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Quem Somos & Nosso Posicionamento</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Por que o interior de SP precisava de uma <span className="text-[#0052D9] dark:text-blue-400">Distribuidora Real</span>?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Durante anos, gesseiros, empreiteiras e construtoras do interior paulista foram forçados a pagar a alta margem de pequenas lojas varejistas ou enfrentar atrasos no frete vindo de capitais distantes. Nascemos para mudar esse cenário.
          </p>
        </div>

        {/* Story & Value Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Drywall Distribuidora &bull; A Força da Marca <span className="text-[#0052D9] dark:text-blue-400">Di Brunelli</span>
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Com sede estratégica no interior paulista e fácil acesso às principais rodovias do estado (Anhanguera, Bandeirantes, D. Pedro I, Washington Luís e Castello Branco), operamos como o elo direto entre as maiores fabricantes de placas e aço do Brasil e o canteiro de obras da sua região.
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Nossa operação está em contínua expansão com a marca <strong className="text-slate-900 dark:text-white">Di Brunelli (com dois 'L')</strong>, que já prepara a abertura de centros de atendimento adicionais e a plataforma digital de e-commerce <span className="font-mono text-xs bg-blue-50 dark:bg-blue-950/60 text-[#0052D9] dark:text-blue-300 px-2 py-1 rounded">dibrunelli.com.br</span> para facilitar cotações instantâneas a qualquer hora do dia.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Estoque Contínuo sem Ruptura</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nunca mais pare sua obra por falta de montantes, placas verdes ou parafusos GN 25.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Suporte Técnico para Projetos</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Equipe que entende de modulação a seco, acústica de laudos e rotas de fuga com placa RF.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Faturamento Faturado para Empresas</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Prazos e limites no boleto bancário para construtoras e montadores cadastrados.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#produtos"
                className="inline-flex items-center gap-2 font-semibold text-sm text-[#0052D9] dark:text-blue-400 hover:gap-3 transition-all"
              >
                <span>Conheça as linhas de produtos disponíveis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80"
                alt="Galpão e Centro de Distribuição de Drywall"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                    Centro de Distribuição Interior SP
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Capacidade: +5.000 Paletes</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Infraestrutura de Distribuição em Escala
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Pátio com docas de carregamento rápido para caminhões e carretas, pontes rolantes para manuseio seguro de perfis de 3 metros e armazenamento coberto climatizado para integridade total das placas de gesso.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <div className="text-lg font-black text-[#0052D9] dark:text-blue-400">100%</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Origem Certificada</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">Zero</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Intermediários</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Comparison Matrix (Distribuidora vs Loja Varejo) */}
        <div id="diferenciais" className="mt-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tabela Comparativa: <span className="text-[#0052D9] dark:text-blue-400">Distribuidora vs. Loja Comum</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Veja por que migrar seu fornecimento para a Drywall Distribuidora gera economia direta e pontualidade na sua obra:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">
                    Critério de Fornecimento
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#0052D9] dark:text-blue-400 uppercase tracking-wider bg-blue-50/70 dark:bg-blue-950/40 w-5/12">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Drywall Distribuidora | Di Brunelli</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-4/12">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Lojas Tradicionais de Varejo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs sm:text-sm">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-200">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium bg-blue-50/30 dark:bg-blue-950/20">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                        <span>{row.distributor}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                        <span>{row.retailStore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
