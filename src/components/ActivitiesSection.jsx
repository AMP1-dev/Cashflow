import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Palette, Music, Drama, Gamepad2, BookOpen, Sprout, Smile, Users, Sparkles } from 'lucide-react';

const iconMap = {
  Smile: Smile,
  Palette: Palette,
  Music: Music,
  Gamepad2: Gamepad2,
  BookOpen: BookOpen,
  Sprout: Sprout,
  Drama: Drama,
  Users: Users
};

export function ActivitiesSection() {
  const { activities, setIsVolunteerOpen, setIsDonationOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(activities.map(a => a.category))];

  const filteredActivities = selectedCategory === 'Todas'
    ? activities
    : activities.filter(a => a.category === selectedCategory);

  return (
    <section id="oficinas" className="py-20 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Metodologia & Desenvolvimento</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Nossas Oficinas Lúdicas e Interativas
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Atividades pensadas para desenvolver a criatividade, autoestima, coordenação motora e convivência harmoniosa através do brincar.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredActivities.map((act) => {
            const IconComponent = iconMap[act.icon] || Smile;

            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-terracotta-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                      {act.ageGroup}
                    </span>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-terracotta-500 mb-1.5">
                    {act.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-terracotta-600 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Atividade Contínua
                  </span>
                  <span>Sem Custo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ludic Callout Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-amber-600 text-white p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Quer apadrinhar uma oficina lúdica ou ser voluntário?
            </h3>
            <p className="text-terracotta-100 text-sm sm:text-base">
              Sua doação ou seu tempo transformam o dia a dia das crianças em momentos de puro aprendizado, arte e alegria.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => setIsVolunteerOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-white text-terracotta-800 font-bold text-sm hover:bg-terracotta-50 shadow-md transition-all"
            >
              Quero ser Voluntário
            </button>
            <button
              onClick={() => setIsDonationOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-terracotta-900/60 hover:bg-terracotta-900 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Doar Materiais / PIX
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
