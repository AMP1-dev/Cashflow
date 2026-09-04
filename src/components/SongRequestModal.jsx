import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { X, Music, Search, Send, CheckCircle2, Sparkles, Flame } from 'lucide-react';

export function SongRequestModal() {
  const { isRequestOpen, setIsRequestOpen, songLibrary, addRequest, showToast } = useRadio();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isRequestOpen) return null;

  const library = songLibrary || [];
  const filteredSongs = library.filter(s =>
    searchTerm.trim() === '' ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSong) {
      showToast('Selecione uma música da lista para fazer o pedido.', 'error');
      return;
    }

    addRequest({
      songTitle: selectedSong.title,
      songArtist: selectedSong.artist,
      userName: userName || 'Ouvinte da Amplificadora',
      userCity: userCity || 'Brasil',
      message: message || ''
    });

    setSubmitted(true);
    setTimeout(() => {
      setIsRequestOpen(false);
      setSubmitted(false);
      setSelectedSong(null);
      setSearchTerm('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#131120] border-2 border-pink-500/30 text-white rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsRequestOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2 border border-pink-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central de Pedidos • AutoDJ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Peça Sua Música na Amplificadora
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Escolha um grande sucesso do nosso acervo de Pop Internacional, Anos 80, 90 e Tomorrowland.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/30 shadow-lg shadow-pink-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Pedido Enviado com Sucesso! ⚡</h3>
            <p className="text-xs text-slate-300">
              Seu pedido foi registrado nos estúdios da Amplificadora e já está na fila da transmissão!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Search Track in Curated Library */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Escolha a Música no Acervo Oficial:
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar música, artista ou gênero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Scrollable Song List */}
              <div className="max-h-48 overflow-y-auto rounded-2xl bg-black/50 border border-white/10 p-2 space-y-1 scrollbar-thin">
                {filteredSongs.map((s) => {
                  const isSelected = selectedSong?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSong(s)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                          : 'hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold block truncate">{s.title}</span>
                        <span className="text-[11px] opacity-75 truncate">{s.artist}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 shrink-0">
                        {s.genre}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Listener Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Seu Nome / Apelido</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sua Cidade / Estado</label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo - SP"
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mensagem ou Alô para a Rádio (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Mandando um abraço para toda a equipe da Amplificadora!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedSong}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-pink-600/30 transition-all flex items-center justify-center gap-2 mt-4 border border-pink-400/40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido para a Transmissão ⚡</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
