import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { Calendar, Clock, Radio, Play, Sparkles, Music } from 'lucide-react';

export function ScheduleSection() {
  const { schedule, togglePlay } = useRadio();
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const [activeDay, setActiveDay] = useState('Segunda');

  const filteredSchedule = schedule.filter(s => s.day === activeDay);

  return (
    <section id="grade" className="py-20 bg-[#0A0910] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-wider mb-3 border border-purple-500/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>Grade Oficial da Semana</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Programação Semanal Amplificadora
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Confira os horários dos programas, sets ao vivo e sessões diárias do AutoDJ.
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shrink-0 ${
                activeDay === day
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="max-w-4xl mx-auto bg-[#131120] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-bold">
              Programação contínua AutoDJ Amplificadora Mainstage 24/7.
            </div>
          ) : (
            filteredSchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="px-3.5 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono text-xs font-bold shrink-0 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-white group-hover:text-pink-300 transition-colors">
                      {item.show}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Apresentado por <span className="text-slate-200 font-bold">{item.host}</span> • <span className="text-pink-400">{item.genre}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => togglePlay()}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-600 text-slate-300 hover:text-white text-xs font-bold transition-all self-start sm:self-auto flex items-center gap-1.5 shrink-0 border border-white/10"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Sintonizar</span>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
