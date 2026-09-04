import React from 'react';
import { TESTIMONIALS_DATA } from '../data/apaeData';
import { Quote, Heart, Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section aria-label="Depoimentos de Famílias e Voluntários" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-3">
            <Heart className="w-4 h-4 fill-current" />
            <span>Vozes de Quem Vive Esta Transformação</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Histórias Reais de <span className="text-apae-blue-600">Amor, Autonomia e Superação</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            O impacto da APAE não se mede apenas em números, mas nos sorrisos de cada família acolhida, no primeiro emprego conquistado e na esperança renovada todos os dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-apae-yellow-500/50 group-hover:text-apae-yellow-500 transition-colors" />

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-apae-blue-500"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900">{t.name}</h4>
                  <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
