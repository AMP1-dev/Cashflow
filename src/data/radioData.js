export function formatYouTubeEmbed(url) {
  if (!url) return '';
  if (url.includes('youtube-nocookie.com/embed/') || url.includes('youtube.com/embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1`;
  }
  return url;
}

export const timeBasedSchedule = [
  {
    id: "slot-1",
    startHour: 6,
    endHour: 10,
    title: "Manhã Alpha • Soft Pop & Clássicos",
    slogan: "A música nos acompanha",
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM.mp3",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFMAAC.aac",
    genre: "Adult Contemporary & Soft Pop",
    currentTrack: "Grandes Clássicos & Sucessos Consagrados",
    artist: "Phil Collins, Sade, George Michael, Elton John, Adele",
    badge: "06:00 - 10:00 • MANHÃ ALPHA",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-2",
    startHour: 10,
    endHour: 14,
    title: "Antena 1 Hits • O Melhor da Música Internacional",
    slogan: "A rádio dos melhores ouvintes",
    streamUrl: "https://antenaone.crossradio.com.br/stream/1",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM.mp3",
    genre: "Pop Internacional & Clássicos",
    currentTrack: "Grandes Sucessos Mundiais com Som Cristalino",
    artist: "Coldplay, Adele, Ed Sheeran, Bruno Mars, Dua Lipa",
    badge: "10:00 - 14:00 • ANTENA 1 HITS",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-3a",
    startHour: 14,
    endHour: 16.5,
    title: "Flashback Gold • Os Clássicos Consagrados",
    slogan: "A música nos acompanha",
    streamUrl: "https://antenaone.crossradio.com.br/stream/1",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFMAAC.aac",
    genre: "Flashback 70s, 80s & 90s Inesquecíveis",
    currentTrack: "As Músicas Mais Amadas da Antena 1 & Alpha FM",
    artist: "Tears for Fears, A-ha, George Michael, Phil Collins, Elton John, Sade",
    badge: "14:00 - 16:30 • FLASHBACK GOLD",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-3b",
    startHour: 16.5,
    endHour: 18,
    title: "Super Flashback Anos 80 & 90 • Pura Nostalgia",
    slogan: "Ampliando sua onda musical",
    streamUrl: "https://live.hunter.fm/80s_high",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/JBFMAAC.aac",
    genre: "Grandes Sucessos dos Anos 80 e 90",
    currentTrack: "O Melhor da Era de Ouro: Pop, Rock e Baladas",
    artist: "Michael Jackson, Madonna, Cyndi Lauper, Queen, Bon Jovi, Air Supply",
    badge: "16:30 - 18:00 • SUPER 80s & 90s",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-4a",
    startHour: 18,
    endHour: 20,
    title: "Sunset Drive & Love Songs • Som Cristalino HD",
    slogan: "A música nos acompanha",
    streamUrl: "https://antenaone.crossradio.com.br/stream/1",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM.mp3",
    genre: "Acoustic, Soft Rock & Pop Internacional",
    currentTrack: "Trilha Sonora Perfeita para o seu Fim de Tarde",
    artist: "Ed Sheeran, Norah Jones, Eric Clapton, Bryan Adams, Sade",
    badge: "18:00 - 20:00 • SUNSET DRIVE",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-4b",
    startHour: 20,
    endHour: 22,
    title: "Super Flashback Anos 70 • A Década de Ouro",
    slogan: "Ampliando sua onda musical",
    streamUrl: "http://strm112.1.fm/70s_mobile_mp3",
    backupUrl: "https://antenaone.crossradio.com.br/stream/1",
    genre: "Classic 70s Pop, Rock, Disco & Soul",
    currentTrack: "Os Maiores Clássicos dos Anos 70 em Alta Definição",
    artist: "Bee Gees, ABBA, Elton John, Earth Wind & Fire, Queen, Stevie Wonder, Fleetwood Mac",
    badge: "20:00 - 22:00 • SUPER ANOS 70",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-5",
    startHour: 22,
    endHour: 24, // 22h às 00h
    title: "Tomorrowland One World Radio LIVE",
    slogan: "The Sound of Tomorrowland 24/7",
    streamUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
    backupUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    genre: "Tomorrowland • Melodic Techno • Future Rave • EDM",
    currentTrack: "Tomorrowland One World Radio Global Broadcast (192 kbps HD)",
    artist: "Tomorrowland Mainstage • David Guetta • Armin van Buuren • Tiësto",
    badge: "22:00 - 00:00 • TOMORROWLAND SESSIONS",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-6",
    startHour: 0,
    endHour: 6, // 00h às 06h
    title: "amplificadora.club • Amnesia",
    slogan: "The Sound of Underground & Club Culture",
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/WEB12_AAC.aac",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/WEB12_MP3.mp3",
    genre: "Deep House • Tech House • Melodic Techno",
    currentTrack: "The Boom Room (SLAM!) • Madrugada Underground",
    artist: "The Boom Room Sets • Ibiza & Amsterdam Club Sounds",
    badge: "00:00 - 06:00 • AMNESIA CLUB",
    cover: "/amnesia-club.jpg"
  }
];

export function getScheduledSlotForHour(hour, minute = 0) {
  const current = hour + minute / 60;
  for (const slot of timeBasedSchedule) {
    if (slot.startHour < slot.endHour) {
      if (current >= slot.startHour && current < slot.endHour) return slot;
    } else {
      if (current >= slot.startHour || current < slot.endHour) return slot;
    }
  }
  return timeBasedSchedule[0];
}

export const initialRadioConfig = {
  name: "Amplificadora",
  shortName: "AMP",
  slogan: "Ampliando sua onda musical",
  subSlogan: "A música nos acompanha",
  tagline: "O melhor do pop internacional, anos 80, 90, clássicos inesquecíveis e festival vibes a partir das 22h.",
  badge: "Música com Estilo & Sofisticação 24h",
  logoUrl: "/logo-amplificadora.png",
  faviconUrl: "/favicon-amplificadora.jpg",
  streamUrl: "https://s10.streamingcloud.online:13192/stream",
  streamBackupUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
  currentShow: {
    title: "Manhã Premium • Pop & Soft Hits",
    host: "Equipe Amplificadora",
    currentTrack: "Pop Internacional & Clássicos Anos 80 e 90",
    artist: "Phil Collins, Sade, Coldplay, Elton John, Adele",
    genre: "Adult Contemporary • 80s & 90s Hits • Soft Pop",
    bpm: "118",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    listenersCount: 2450
  },
  featuredAlbums: [
    {
      title: "Diamond Life",
      artist: "Sade",
      year: "1984",
      genre: "Adult Contemporary / Smooth Pop",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "...But Seriously",
      artist: "Phil Collins",
      year: "1989",
      genre: "80s Pop & Soft Rock",
      cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "A Rush of Blood to the Head",
      artist: "Coldplay",
      year: "2002",
      genre: "Pop Internacional",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Tomorrowland Mainstage Anthem",
      artist: "Festival Sessions 22h",
      year: "2026",
      genre: "Melodic Techno / Future Rave",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
    }
  ],
  jingles: [
    { id: "j-1", title: "Vinheta 1 (Voz Feminina • Pop & Clássicos)", file: "/vinhetas/vinheta-1-alpha-pop.mp3", voice: "Locutora Francisca" },
    { id: "j-2", title: "Vinheta 2 (Voz Feminina • Melody Sofisticada)", file: "/vinhetas/vinheta-2-melody-sofisticada.mp3", voice: "Locutora Thalita" },
    { id: "j-3", title: "Vinheta 3 (Transição 22h • Tomorrowland)", file: "/vinhetas/vinheta-3-tomorrowland-22h.mp3", voice: "Locutora Francisca (Night)" },
    { id: "j-4", title: "Vinheta 4 (Carimbo Oficial • Slogan)", file: "/vinhetas/vinheta-4-carimbo-curto.mp3", voice: "Locutora Thalita (Assinatura)" }
  ],
  social: {
    instagram: "https://instagram.com/amplificadoraradio",
    youtube: "https://youtube.com/@amplificadoraradio",
    facebook: "https://facebook.com/amplificadoraradio",
    tiktok: "https://tiktok.com/@amplificadoraradio",
    whatsapp: "5511998887766"
  },
  ampLink: {
    enabled: true,
    badge: "COLEÇÃO OFICIAL",
    title: "AMP Ink - T Shirts",
    subtitle: "Camisetas & Estampas Exclusivas",
    desc: "Vista Amplificadora | Estampas Originais",
    imageUrl: "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/81dd341c4e72a0752694458f52856101.webp",
    gallery: [
      "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/81dd341c4e72a0752694458f52856101.webp",
      "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/d21771a197e6bd8be06e0987e9d573c3.webp",
      "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/09ae412fc013f9b26ff61c54aceb6742.webp",
      "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/fbb6d66dbd6ae67ab6b0becab4b3619b.webp",
      "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/07d5d5c5169d96f668a104e94cc797f4.webp",
      "https://gcp-images.majestic.ink.rsvcloud.com/images/product_v2/main_image/19ec0a47940659b18d1addf4d467fea1.webp"
    ],
    actionText: "Ver Coleção na Reserva INK 👕",
    actionUrl: "https://reserva.ink/amp"
  },
  themeColor: "#EC4899"
};

export const initialChannels = [
  {
    id: "ch-1",
    title: "Amplificadora Hits & Pop",
    desc: "A melhor seleção de Pop Internacional, Anos 80, 90 e Adult Contemporary.",
    badge: "ALPHA & MELODY STYLE",
    genre: "Pop Internacional & Soft Hits",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    backupUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    color: "from-pink-600 to-purple-900"
  },
  {
    id: "ch-alpha",
    title: "Alpha FM 101.7 SP",
    desc: "Sempre com você: o som clássico e sofisticado que conquistou São Paulo e o Brasil.",
    badge: "ALPHA FM • SÃO PAULO",
    genre: "Adult Contemporary • Soft Pop",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM.mp3",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFMAAC.aac",
    color: "from-blue-700 to-indigo-950"
  },
  {
    id: "ch-antena1",
    title: "Antena 1 SP",
    desc: "O melhor da música internacional com qualidade e elegância ininterruptas.",
    badge: "ANTENA 1 • HITS MUNDIAIS",
    genre: "Pop Internacional Contemporâneo",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://antenaone.crossradio.com.br/stream/1",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM.mp3",
    color: "from-sky-600 to-slate-900"
  },
  {
    id: "ch-mpb",
    title: "O Canal MPB • Hunter.FM",
    desc: "A fina flor da Música Popular Brasileira: Caetano, Gil, Djavan, Marisa Monte e Chico Buarque.",
    badge: "MPB • CLÁSSICOS & BOSSA",
    genre: "Música Popular Brasileira & Bossa Nova",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://live.hunter.fm/mpb_high",
    backupUrl: "https://live.hunter.fm/mpb_low",
    color: "from-emerald-600 to-teal-950"
  },
  {
    id: "ch-70s",
    title: "Super Flashback Anos 70 • Década de Ouro",
    desc: "Bee Gees, ABBA, Elton John, Earth Wind & Fire, Queen, Stevie Wonder e Fleetwood Mac em 256 kbps.",
    badge: "ANOS 70 CLÁSSICOS & DISCO",
    genre: "70s Pop, Rock, Disco & Soul",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    streamUrl: "http://strm112.1.fm/70s_mobile_mp3",
    backupUrl: "https://antenaone.crossradio.com.br/stream/1",
    color: "from-amber-600 to-yellow-950"
  },
  {
    id: "ch-pop",
    title: "O Canal Pop • Hunter.FM",
    desc: "Só os hits do pop internacional e aqueles throwbacks que você ama cantar!",
    badge: "CANAL POP • HUNTER FM",
    genre: "Pop Global & Billboard Hits",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://live.hunter.fm/pop_high",
    backupUrl: "https://live.hunter.fm/pop_normal",
    color: "from-fuchsia-600 to-purple-950"
  },
  {
    id: "ch-5",
    title: "Super 80s & Nostalgia • Hunter FM",
    desc: "Puro anos 80: Michael Jackson, Madonna, Cyndi Lauper, Queen, Bon Jovi e Air Supply.",
    badge: "ANOS 80 PURA NOSTALGIA",
    genre: "80s Pop, Rock & Ballads",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://live.hunter.fm/80s_high",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/JBFMAAC.aac",
    color: "from-amber-600 to-rose-950"
  },
  {
    id: "ch-slam10s",
    title: "SLAM! '10s (2010 - 2019)",
    desc: "A década de ouro do Dance Pop e EDM: Avicii, Calvin Harris, David Guetta e Swedish House Mafia.",
    badge: "SLAM! • DECADE 10's",
    genre: "Dance Pop • EDM • Club Hits 2010s",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/WEB14_MP3.mp3",
    backupUrl: "https://stream.slam.nl/web14_mp3",
    color: "from-violet-600 to-indigo-950"
  },
  {
    id: "ch-2",
    title: "Tomorrowland One World Radio LIVE",
    desc: "Transmissão 24h oficial dos palcos e residentes da Tomorrowland.",
    badge: "22:00 • TOMORROWLAND",
    genre: "Tomorrowland / EDM / Melodic Techno",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
    color: "from-purple-600 to-indigo-950"
  },
  {
    id: "ch-6",
    title: "amplificadora.club • Amnesia",
    desc: "The Sound of Underground & Club Culture. O melhor do Deep House, Tech House e Melodic Techno 24h (SLAM!).",
    badge: "AMNESIA • CLUB SESSIONS",
    genre: "Deep House • Tech House • Melodic Techno",
    cover: "/amnesia-club.jpg",
    streamUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/WEB12_AAC.aac",
    backupUrl: "https://playerservices.streamtheworld.com/api/livestream-redirect/WEB12_MP3.mp3",
    color: "from-pink-600 to-violet-950"
  },
  {
    id: "ch-3",
    title: "Acoustic, Jazz & Love Songs",
    desc: "Versões acústicas refinadas, Bossa Nova, Jazz e canções inesquecíveis.",
    badge: "RELAX & WORK",
    genre: "Acoustic / Lounge / Jazz",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://ice1.somafm.com/groovesalad-128-mp3",
    color: "from-rose-500 to-amber-900"
  },
  {
    id: "ch-gregorian",
    title: "Cantos Gregorianos • Contemplação",
    desc: "Canal liso de altíssima qualidade e 100% sem propaganda. A pureza atemporal do Canto Gregoriano e Música Sacra medieval.",
    badge: "GREGORIANO • SEM ANÚNCIOS",
    genre: "Canto Gregoriano • Sacro & Meditação",
    cover: "/gregorian.jpg",
    streamUrl: "https://esperance.streamakaci.com/gregorien.mp3",
    backupUrl: "http://streams.greenhost.nl:8080/gregoriaans",
    color: "from-amber-700 to-stone-950"
  },
  {
    id: "ch-classical",
    title: "Radio Swiss Classic • Som Audiófilo",
    desc: "Referência mundial na Suíça (SRG SSR). Transmissão contínua das maiores obras-primas da música clássica sem comerciais.",
    badge: "CLÁSSICA • 100% SEM COMERCIAIS",
    genre: "Música Clássica • Orquestral & Barroco",
    cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128",
    backupUrl: "https://stream.wqxr.org/wqxr",
    color: "from-blue-800 to-slate-950"
  },
  {
    id: "ch-liveshows",
    title: "Arena Shows • Concertos Ao Vivo 24h",
    desc: "Apenas áudio de shows e festivais ao vivo. Gravações históricas dos maiores palcos do mundo sem interrupções.",
    badge: "SHOWS AO VIVO • LIVE ARENA",
    genre: "Live Concerts • Rock & Pop Históricos",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://stream.laut.fm/alive",
    backupUrl: "https://strm112.1.fm/rockclassics_mobile_mp3",
    color: "from-red-600 to-zinc-950"
  }
];

export const initialShows = [
  {
    id: "show-queen",
    title: "Queen • Bohemian Rhapsody (Remastered 4K)",
    host: "Queen Official",
    date: "Concerto Clássico • 4K",
    duration: "00:06:00",
    cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    desc: "O lendário videoclipe e performance de Bohemian Rhapsody remasterizado em altíssima definição pelo canal oficial da banda.",
    audioPreviewUrl: "https://antenaone.crossradio.com.br/stream/1",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/fJ9rUzIMcZQ?autoplay=1"
  },
  {
    id: "show-tomorrowland",
    title: "Tomorrowland Belgium • Official Festival Film",
    host: "Tomorrowland Official Stream",
    date: "Transmissão 4K • Festival Oficial",
    duration: "00:32:00",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    desc: "O lendário aftermovie cinematográfico do maior festival de música eletrônica do mundo com mais de 180 milhões de visualizações.",
    audioPreviewUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/UWb5Qc-fBvk?autoplay=1"
  },
  {
    id: "show-coldplay",
    title: "Coldplay • Viva La Vida (Official Video)",
    host: "Estúdio Alpha Live",
    date: "Transmissão HD Oficial",
    duration: "00:04:02",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    desc: "A canção mais aclamada da carreira do Coldplay, vencedora de múltiplos prêmios Grammy e hino de estádios pelo mundo.",
    audioPreviewUrl: "https://s10.streamingcloud.online:13192/stream",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/dvgZkm1xWPE?autoplay=1"
  },
  {
    id: "show-phil-collins",
    title: "Phil Collins • In The Air Tonight (Official 4K)",
    host: "Clássicos Inesquecíveis",
    date: "Show Histórico dos Anos 80 e 90",
    duration: "00:04:56",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    desc: "O clássico imortal de Phil Collins com um dos solos de bateria mais famosos da história da música internacional.",
    audioPreviewUrl: "https://antenaone.crossradio.com.br/stream/1",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/YkADj0TPrJA?autoplay=1"
  },
  {
    id: "show-aha",
    title: "a-ha • Take On Me (Official 4K Remaster)",
    host: "Anos 80 de Ouro",
    date: "Remaster 4K Oficial",
    duration: "00:03:48",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    desc: "O videoclipe inovador em rotoscopia que definiu a geração anos 80 e atingiu mais de 1 bilhão de visualizações.",
    audioPreviewUrl: "https://live.hunter.fm/80s_high",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/djV11Xbc914?autoplay=1"
  },
  {
    id: "show-tears-for-fears",
    title: "Tears For Fears • Everybody Wants To Rule The World",
    host: "Vozes de Ouro",
    date: "Clássico dos Anos 80",
    duration: "00:04:52",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    desc: "A trilha sonora perfeita que sintetiza o synth-pop e o melhor da década de 80.",
    audioPreviewUrl: "https://antenaone.crossradio.com.br/stream/1",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/aGCdLKXNF3w?autoplay=1"
  }
];

export const initialSchedule = [
  { id: "sched-1", slotId: "slot-1", day: "Segunda a Domingo", time: "06:00 - 10:00", show: "Manhã Alpha • Soft Pop & Clássicos", host: "Alpha FM 101.7", genre: "Adult Contemporary & Soft Pop" },
  { id: "sched-2", slotId: "slot-2", day: "Segunda a Domingo", time: "10:00 - 14:00", show: "Antena 1 Hits • O Melhor da Música Internacional", host: "Antena 1 SP", genre: "Pop Internacional & Clássicos" },
  { id: "sched-3a", slotId: "slot-3a", day: "Segunda a Domingo", time: "14:00 - 16:30", show: "Flashback Gold (Antena 1 & Alpha)", host: "Vozes Consagradas", genre: "Flashback 70s, 80s & 90s" },
  { id: "sched-3b", slotId: "slot-3b", day: "Segunda a Domingo", time: "16:30 - 18:00", show: "Super Flashback Anos 80 & 90", host: "Hunter.FM 80s", genre: "Hits Consagrados 80s e 90s" },
  { id: "sched-4a", slotId: "slot-4a", day: "Segunda a Domingo", time: "18:00 - 20:00", show: "Sunset Drive & Love Songs", host: "Vozes de Ouro", genre: "Acoustic, Soft Rock & Pop Internacional" },
  { id: "sched-4b", slotId: "slot-4b", day: "Segunda a Domingo", time: "20:00 - 22:00", show: "Super Flashback Anos 70 • A Década de Ouro", host: "1.FM 70s Master HD", genre: "Classic 70s Pop, Rock, Disco & Soul" },
  { id: "sched-5", slotId: "slot-5", day: "Segunda a Domingo", time: "22:00 - 00:00", show: "Tomorrowland One World Radio LIVE", host: "Tomorrowland Oficial", genre: "Tomorrowland / EDM / Melodic Techno" },
  { id: "sched-6", slotId: "slot-6", day: "Segunda a Domingo", time: "00:00 - 06:00", show: "amplificadora.club • Amnesia", host: "The Boom Room (SLAM!)", genre: "Deep House / Melodic Techno / Underground" },
];

export const initialArticles = [
  {
    id: "art-1",
    title: "Grammy Awards 2026: Os destaques e as grandes apresentações que marcaram o ano",
    category: "Mundo da Música",
    date: "2026-08-28",
    author: "Redação Musical",
    summary: "As principais premiações da noite, os novos recordes históricos da indústria fonográfica e as turnês mais esperadas da temporada.",
    content: "A maior noite da música mundial celebrou a diversidade sonora, reunindo ícones do pop contemporâneo, lendas do rock e os produtores de música eletrônica mais influentes da atualidade.\n\nCom performances ao vivo de tirar o fôlego e homenagens emocionantes a lendas da música internacional, a edição deste ano reforçou o poder transformador da melodia e das composições atemporais.",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    likes: 412
  },
  {
    id: "art-2",
    title: "Do Pop Sofisticado ao Melodic Techno: A evolução das trilhas sonoras do dia a dia",
    category: "Tendências",
    date: "2026-08-25",
    author: "Curadoria Amplificadora",
    summary: "Como grandes emissoras do mundo integram ritmos elegantes durante o expediente e a energia dos festivais para a noite.",
    content: "A música é uma companhia constante que dita o humor das nossas horas. Durante o dia de trabalho, melodias suaves, vocais marcantes de piano e violão ajudam no foco e no bem-estar.\n\nÀ noite, quando o relógio marca 22h, as frequências baixas e as batidas de sintetizador do Melodic Techno convidam à desconexão e à celebração, criando uma jornada completa de 24 horas de som.",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
    likes: 388
  },
  {
    id: "art-3",
    title: "O retorno triunfal dos clássicos dos anos 80 e 90 nas paradas globais",
    category: "Flashback",
    date: "2026-08-20",
    author: "Arquivo Musical",
    summary: "Por que as produções analógicas e as melodias ricas do passado continuam conquistando todas as novas gerações.",
    content: "Artistas como Phil Collins, Fleetwood Mac, Sade e Michael Jackson continuam batendo recordes de reproduções em plataformas de streaming.\n\nA riqueza instrumental e os refrões inesquecíveis provam que a boa música nunca envelhece — ela apenas se consolida como parte da nossa memória afetiva.",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    likes: 295
  }
];

export const initialSongLibrary = [
  { id: "s-1", title: "Smooth Operator", artist: "Sade", genre: "Pop Internacional" },
  { id: "s-2", title: "In The Air Tonight", artist: "Phil Collins", genre: "80s Pop Classic" },
  { id: "s-3", title: "Viva La Vida", artist: "Coldplay", genre: "Pop Contemporâneo" },
  { id: "s-4", title: "Sacrifice", artist: "Elton John", genre: "Classic Hits" },
  { id: "s-5", title: "Rolling in the Deep", artist: "Adele", genre: "Adult Contemporary" },
  { id: "s-6", title: "Dreams", artist: "Fleetwood Mac", genre: "70s/80s Gold" },
  { id: "s-7", title: "Save Your Tears", artist: "The Weeknd", genre: "Pop Hits" },
  { id: "s-8", title: "As It Was", artist: "Harry Styles", genre: "Pop Global" },
  { id: "s-9", title: "Careless Whisper", artist: "George Michael", genre: "80s Timeless" },
  { id: "s-10", title: "Titanium (Festival Anthem)", artist: "David Guetta ft. Sia", genre: "Tomorrowland 22h" }
];

export const initialB2BClients = [
  {
    id: "b2b-caribu",
    name: "Caribu Burgers & Bistrô",
    slug: "caribu-burgers-bistro",
    segment: "Hamburgueria Gourmet & Bistrô",
    location: "São Paulo, SP",
    streamUrl: "https://radio.amplificadora.com.br/listen/caribu_burgers__bistr%C3%B4/radio.mp3",
    genre: "Vintage Chic • Jazz, Bossa & Acoustic Lounge",
    slogan: "Cortes nobres, pães artesanais e trilha sonora perfeita",
    logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    spotsCount: 3,
    plan: "Plano Pro Indoor (Locução IA + Smart Crossfade)",
    status: "Ativo",
    spotsList: [
      { title: "Caribu - Blend Artesanal (Emma • Sax Lounge)", url: "https://amplificadora.com.br/spots/caribu1_emma_lounge.mp3" },
      { title: "Caribu - Blend Artesanal (Vivienne • Sax Lounge)", url: "https://amplificadora.com.br/spots/caribu1_vivienne_lounge.mp3" },
      { title: "Caribu - Experiência Gourmet (Vivienne • Acústico Chic)", url: "https://amplificadora.com.br/spots/caribu2_vivienne_chic.mp3" }
    ]
  },
  {
    id: "b2b-donazeca",
    name: "Dona Zeca Vintage Café",
    slug: "dona-zeca-cafe",
    segment: "Doceria & Cafeteria Gourmet",
    location: "São Paulo, SP",
    streamUrl: "https://radio.amplificadora.com.br/spots/donazeca_vivienne_cafe.mp3",
    genre: "Café Bossa & Piano Jazz Lounge",
    slogan: "Café especial passado na hora e doces com sabor de infância",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    spotsCount: 1,
    plan: "Plano Essencial Indoor (Spots IA)",
    status: "Ativo",
    spotsList: [
      { title: "Dona Zeca - Doceria & Café Especial (Vivienne • Piano Jazz)", url: "https://amplificadora.com.br/spots/donazeca_vivienne_cafe.mp3" }
    ]
  },
  {
    id: "b2b-pulse",
    name: "Pulse Fitness Club",
    slug: "pulse-fitness",
    segment: "Academia & CrossFit",
    location: "Campinas, SP",
    streamUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
    genre: "Tomorrowland / EDM & High Energy",
    slogan: "Energia máxima para o seu treino",
    logo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    spotsCount: 6,
    plan: "Plano Multi-Unidades",
    status: "Ativo"
  }
];

