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
    title: "Manhã Premium • Pop & Soft Hits",
    slogan: "Ampliando sua onda musical",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    backupUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    genre: "Pop Internacional & Soft Hits",
    currentTrack: "Grandes Clássicos & Pop Internacional",
    artist: "Phil Collins, Sade, Coldplay, Elton John",
    badge: "06:00 - 10:00 • MANHÃ ALPHA",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-2",
    startHour: 10,
    endHour: 14,
    title: "Conexão Trabalho & Sucessos Pop",
    slogan: "A música nos acompanha",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    backupUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    genre: "Adult Contemporary • Pop Comercial",
    currentTrack: "Música com Estilo para o seu Expediente",
    artist: "Adele, Fleetwood Mac, George Michael, Michael Jackson",
    badge: "10:00 - 14:00 • EXPEDIENTE PREMIUM",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-3",
    startHour: 14,
    endHour: 18,
    title: "Tarde Sofisticada & Flashback de Ouro",
    slogan: "Ampliando sua onda musical",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    backupUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    genre: "Flashback 70s, 80s & 90s Hits",
    currentTrack: "Os Maiores Sucessos das Décadas de Ouro",
    artist: "Tears for Fears, A-ha, Simply Red, Whitney Houston",
    badge: "14:00 - 18:00 • TARDE RETRÔ & POP",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-4",
    startHour: 18,
    endHour: 22,
    title: "Sunset Drive & Love Songs",
    slogan: "A música nos acompanha",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    backupUrl: "https://ice1.somafm.com/groovesalad-128-mp3",
    genre: "Acoustic, Soft Rock & Pop",
    currentTrack: "Trilha Sonora Perfeita para a sua Noite",
    artist: "Ed Sheeran, Norah Jones, Eric Clapton, Bryan Adams",
    badge: "18:00 - 22:00 • SUNSET DRIVE",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "slot-5",
    startHour: 22,
    endHour: 6, // 22h às 06h
    title: "Tomorrowland One World Radio LIVE",
    slogan: "The Sound of Tomorrowland 24/7",
    streamUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
    backupUrl: "https://s10.streamingcloud.online:13192/stream",
    genre: "Tomorrowland • Melodic Techno • Future Rave • EDM",
    currentTrack: "Tomorrowland One World Radio Global Broadcast",
    artist: "Tomorrowland Mainstage • David Guetta • Armin van Buuren • Tiësto",
    badge: "22:00 - 06:00 • TOMORROWLAND SESSIONS",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
  }
];

export function getScheduledSlotForHour(hour) {
  if (hour >= 6 && hour < 10) return timeBasedSchedule[0];
  if (hour >= 10 && hour < 14) return timeBasedSchedule[1];
  if (hour >= 14 && hour < 18) return timeBasedSchedule[2];
  if (hour >= 18 && hour < 22) return timeBasedSchedule[3];
  return timeBasedSchedule[4]; // 22h to 06h (Tomorrowland Direct MP3)
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
    title: "Amplificadora Hits & Pop (Alpha / Melody)",
    desc: "A melhor seleção de Pop Internacional, Anos 80, 90 e Adult Contemporary.",
    badge: "ALPHA & MELODY STYLE",
    genre: "Pop Internacional & Soft Hits",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    color: "from-pink-600 to-purple-900"
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
    id: "ch-4",
    title: "Flashback & Clássicos de Ouro (80s & 90s)",
    desc: "Os maiores clássicos dos anos 70, 80, 90 e 2000 que marcaram época.",
    badge: "80s & 90s TIMELESS",
    genre: "Flashback 70s, 80s, 90s & 2000s",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    color: "from-blue-600 to-slate-900"
  }
];

export const initialShows = [
  {
    id: "show-1",
    title: "Tomorrowland Belgium 2024 / 2025 • Mainstage 4K",
    host: "Tomorrowland Official Stream",
    date: "Transmissão 4K • Set Completo",
    duration: "01:15:00",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    desc: "Assista ao show cinematográfico do palco principal da Tomorrowland em ultra alta definição.",
    audioPreviewUrl: "https://22733.live.streamtheworld.com/OWR_INTERNATIONAL.mp3",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Hhws7b94jE8?autoplay=1"
  },
  {
    id: "show-2",
    title: "Coldplay Live in São Paulo • Music of the Spheres",
    host: "Estúdio Alpha Live",
    date: "Concerto Especial HD",
    duration: "02:05:00",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    desc: "Os maiores sucessos da banda britânica com performances épicas de Viva La Vida, Fix You e Yellow.",
    audioPreviewUrl: "https://s10.streamingcloud.online:13192/stream",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/fJ9rUzIMcZQ?autoplay=1"
  },
  {
    id: "show-3",
    title: "Phil Collins • Live at Montreux (Flashback Gold)",
    host: "Clássicos Inesquecíveis",
    date: "Show Histórico dos Anos 80 e 90",
    duration: "01:45:00",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    desc: "Uma das apresentações mais aclamadas da carreira de Phil Collins com clássicos imortais.",
    audioPreviewUrl: "https://s10.streamingcloud.online:13192/stream",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/YkADj0TwpZ4?autoplay=1"
  },
  {
    id: "show-4",
    title: "Sade • Bring Me Home Live 4K",
    host: "Vozes de Veludo",
    date: "Tour Mundial Especial",
    duration: "01:30:00",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    desc: "A elegância e a sofisticação da diva do smooth soul e pop internacional ao vivo.",
    audioPreviewUrl: "https://s10.streamingcloud.online:13192/stream",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/S2qYJ-g3iHQ?autoplay=1"
  }
];

export const initialSchedule = [
  { day: "Segunda a Domingo", time: "06:00 - 10:00", show: "Manhã Alpha (Pop & Clássicos)", host: "Transmissão HD", genre: "Pop & Adult Contemporary" },
  { day: "Segunda a Domingo", time: "10:00 - 14:00", show: "Expediente Premium", host: "Seleção Diária", genre: "Hits Internacionais" },
  { day: "Segunda a Domingo", time: "14:00 - 18:00", show: "Tarde Sofisticada & Flashback", host: "Equipe Musical", genre: "Flashback & Pop 80s/90s" },
  { day: "Segunda a Domingo", time: "18:00 - 22:00", show: "Sunset Drive & Acústicos", host: "Vozes de Ouro", genre: "Acoustic & Soft Rock" },
  { day: "Segunda a Domingo", time: "22:00 - 06:00", show: "Tomorrowland One World Radio LIVE", host: "DJs Globais", genre: "Melodic Techno / Festival" },
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
    id: "b2b-1",
    name: "Bistrô & Café Vintage",
    slug: "bistro-vintage",
    segment: "Restaurante & Cafeteria",
    location: "São Paulo, SP",
    streamUrl: "https://ice1.somafm.com/groovesalad-128-mp3",
    genre: "Jazz, Bossa & Acoustic Lounge",
    slogan: "Sabor, sofisticação e música boa",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    spotsCount: 4,
    plan: "Plano Pro (2 Ambientes + Locução IA)",
    status: "Ativo"
  },
  {
    id: "b2b-2",
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
  },
  {
    id: "b2b-3",
    name: "Ateliê & Moda Urbana",
    slug: "atelie-moda",
    segment: "Varejo & Boutique",
    location: "Curitiba, PR",
    streamUrl: "https://s10.streamingcloud.online:13192/stream",
    genre: "Pop Sofisticado & Hits Globais",
    slogan: "Moda, elegância e ritmo envolvente",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
    spotsCount: 3,
    plan: "Plano Essencial Indoor",
    status: "Ativo"
  }
];

