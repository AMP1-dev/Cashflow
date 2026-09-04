import React from 'react';
import { Scale, HeartPulse, Lock } from 'lucide-react';
import { FMA_PRACTICE_AREAS } from '../../data/fmaData';
import { useFma } from '../../context/FmaContext';

export function FmaFooter({ onOpenTriage }) {
  const { firmConfig, setIsAdminOpen } = useFma();

  return (
    <footer className="bg-[#07080B] border-t border-fma-border text-xs text-zinc-400">
      
      {/* Top Banner with Liminar Alert */}
      <div className="border-b border-zinc-800/80 py-4 px-6 bg-red-950/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-zinc-300">
            <HeartPulse className="w-4 h-4 text-red-400 animate-pulse" />
            <span><strong>Urgência Médica ou Bancária?</strong> Plantão ativo para liberação de cirurgias, remédios de alto custo e negativações.</span>
          </div>
          <button
            onClick={onOpenTriage}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] tracking-wide transition-colors"
          >
            Acessar Plantão 24h
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fma-surface border border-fma-border flex items-center justify-center text-fma-gold shadow">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-times text-lg font-bold tracking-tight text-white">
                  {firmConfig.name || 'FMA ADVOGADOS'}
                </span>
                <span className="block text-[10px] tracking-widest text-fma-textMuted uppercase font-mono">
                  {firmConfig.founder || 'Fernando Maeda'} • {firmConfig.oab || 'OAB/SP 210.374'}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Advocacia contemporânea e resolutiva. Mais de 20 anos de experiência pautados pelo rigor processual, transparência com o cliente e ética nos tribunais.
            </p>

            <blockquote className="p-3.5 rounded-xl bg-fma-surface border-l-2 border-fma-gold italic text-xs text-zinc-300 font-times">
              "{firmConfig.philosophicalQuote?.text || 'A justiça é a vontade constante e perpétua de dar a cada um o que é seu.'}"
              <span className="block text-[10px] text-fma-goldLight mt-1 font-mono not-italic font-semibold">
                — {firmConfig.philosophicalQuote?.author || 'Ulpiano'}
              </span>
            </blockquote>
          </div>

          {/* Col 2: Áreas de Atuação */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-times font-bold text-sm text-white uppercase tracking-wider">
              Áreas de Atuação
            </h4>
            <ul className="space-y-2 text-zinc-400">
              {FMA_PRACTICE_AREAS.map(a => (
                <li key={a.id}>
                  <a href="#atuacao" className="hover:text-fma-gold transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-fma-gold/50" />
                    <span>{a.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Institucional & Contato */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-times font-bold text-sm text-white uppercase tracking-wider">
              Atendimento & Registro
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="text-zinc-300">
                <strong>OAB/SP:</strong> {firmConfig.oab || '210.374'}
              </li>
              <li>
                <strong>Associação:</strong> {firmConfig.aasp || 'AASP (Associação dos Advogados de São Paulo)'}
              </li>
              <li>
                <strong>Telefone / WhatsApp:</strong> {firmConfig.contacts?.whatsappFormatted || '(11) 94890-0900'}
              </li>
              <li>
                <strong>E-mail:</strong> {firmConfig.contacts?.email || 'contato@fmadv.net'}
              </li>
              <li>
                <strong>Atendimento:</strong> {firmConfig.contacts?.address || 'São Paulo — SP'}
              </li>
              <li className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                  {firmConfig.disclaimerCriminal || 'Não atuamos na área criminal.'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & OAB compliance */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            © {new Date().getFullYear()} {firmConfig.name || 'FMA Advogados'} — {firmConfig.founder || 'Dr. Fernando Maeda'} ({firmConfig.oab || 'OAB/SP 210.374'}). Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#inicio" className="hover:text-zinc-300 transition-colors">Voltar ao topo</a>
            <span>•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-zinc-500 hover:text-fma-gold flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Painel do Escritório</span>
            </button>
            <span>•</span>
            <span className="text-zinc-600">Código de Ética da OAB</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
