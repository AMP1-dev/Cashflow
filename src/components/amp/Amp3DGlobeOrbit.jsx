import React, { useState, useEffect, useRef } from 'react';
import { useAmp } from '../../context/AmpContext';
import {
  Calculator,
  ShieldCheck,
  Users,
  Radio,
  ExternalLink,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  TrendingUp,
  CreditCard,
  Gift,
  ArrowUpRight
} from 'lucide-react';

export function Amp3DGlobeOrbit() {
  const { assets, setIsAssetDetailOpen, toggleRadioPlay, isRadioPlaying } = useAmp();

  // Full-width orbit rotation state
  const [angle, setAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedAtFocal, setIsPausedAtFocal] = useState(false);
  const pauseTimerRef = useRef(null);
  const requestRef = useRef();

  // 6 Ecosystem Apps & Systems built by AMP for the panoramic rotating showcase
  const appItems = [
    {
      id: "asset-mesh",
      name: "MeshCentral Remote Support",
      shortName: "MeshCentral NOC",
      sub: "Acesso Remoto Seguro & NOC 24/7",
      badge: "TI & Infraestrutura",
      tagline: "Telemetria em tempo real & SLA < 15min",
      icon: ShieldCheck,
      image: "/public/amp-mesh-logo.png",
      fallbackImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      accent: "text-cyan-400",
      border: "border-cyan-400/40",
      glow: "shadow-cyan-950/60",
      kpi: "15.000+ Endpoints",
      stat: "99.98% Uptime",
      url: "https://remoto.amp.ia.br"
    },
    {
      id: "asset-alianca",
      name: "Aliança Empresarial",
      shortName: "Case Aliança",
      sub: "Presença Web, Gestão de TI & Segurança",
      badge: "Case de Sucesso • TI",
      tagline: "Hospedagem & Infraestrutura Crítica",
      icon: ShieldCheck,
      image: "/public/banners/banner_outdoor_amp_loyalty.png",
      fallbackImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      accent: "text-blue-400",
      border: "border-blue-400/40",
      glow: "shadow-blue-950/60",
      kpi: "Alta Criticidade",
      stat: "99.9% Uptime",
      url: "https://aliancaempresarial.net.br"
    },
    {
      id: "asset-joao-barro",
      name: "Projeto João de Barro",
      shortName: "João de Barro ESG",
      sub: "Responsabilidade Socioambiental",
      badge: "Iniciativa ESG",
      tagline: "Inclusão Digital & Habitação Sustentável",
      icon: Users,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      accent: "text-emerald-400",
      border: "border-emerald-400/40",
      glow: "shadow-emerald-950/60",
      kpi: "3.200+ Famílias",
      stat: "25 Hectares Reflorestados",
      url: "https://projetojoaodebarro.org.br"
    },
    {
      id: "asset-radio",
      name: "Rádio Amplificadora",
      shortName: "Rádio AMP",
      sub: "Mídia & Web Rádio Corporativa HD",
      badge: "Transmissão 24h",
      tagline: "Pop Internacional & Drops Tech",
      icon: Radio,
      image: "/public/amplificadora-story.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      accent: "text-fuchsia-400",
      border: "border-fuchsia-400/40",
      glow: "shadow-fuchsia-950/60",
      kpi: "320kbps HD",
      stat: "25.000+ Ouvintes",
      url: "https://amplificadora.com.br"
    },
    {
      id: "asset-amp-flow",
      name: "AMP Flow Gestão Financeira",
      shortName: "AMP Flow",
      sub: "Fluxo de Caixa & DRE Gerencial",
      badge: "SaaS Corporativo",
      tagline: "Controle financeiro diário & Conciliação",
      icon: TrendingUp,
      image: "/public/banners/banner_ciclo_consumo.png",
      fallbackImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      accent: "text-sky-400",
      border: "border-sky-400/40",
      glow: "shadow-sky-950/60",
      kpi: "DRE em Tempo Real",
      stat: "Multiempresa & Multi-usuário",
      url: "https://aliancaempresarial.net.br"
    },
    {
      id: "asset-amp-loyalty",
      name: "AMP Loyalty & Fidelidade",
      shortName: "AMP Loyalty",
      sub: "Engajamento & Retenção de Clientes",
      badge: "Marketing & Fidelização",
      tagline: "Ciclo de consumo inteligente & Roleta",
      icon: Gift,
      image: "/public/banners/banner_loja_fidelidade.png",
      fallbackImage: "https://images.unsplash.com/photo-1556742049-0a67e557b561?auto=format&fit=crop&w=600&q=80",
      accent: "text-yellow-400",
      border: "border-yellow-400/40",
      glow: "shadow-yellow-950/60",
      kpi: "Campanhas Gamificadas",
      stat: "+38% Retenção",
      url: "https://aliancaempresarial.net.br"
    },
    {
      id: "asset-backup",
      name: "Painel de Backup Imutável",
      shortName: "Backup WORM",
      sub: "Disaster Recovery & Anti-Ransomware",
      badge: "Proteção de Dados",
      tagline: "Armazenamento imutável & Restauração bare-metal",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
      accent: "text-indigo-400",
      border: "border-indigo-400/40",
      glow: "shadow-indigo-950/60",
      kpi: "RTO < 1h / RPO Zero",
      stat: "100% Imutável",
      url: "https://remoto.amp.ia.br"
    },
    {
      id: "asset-erp",
      name: "AMP Enterprise ERP",
      shortName: "ERP Corporativo",
      sub: "Gestão Integrada & Emissão Fiscal",
      badge: "ERP & Faturamento",
      tagline: "NF-e, NFS-e, MDF-e, Estoque & Financeiro",
      icon: Calculator,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      accent: "text-teal-400",
      border: "border-teal-400/40",
      glow: "shadow-teal-950/60",
      kpi: "Emissão em 3 Segundos",
      stat: "SPED & Sintegra 100%",
      url: "https://aliancaempresarial.net.br"
    }
  ];

  const totalApps = appItems.length;
  const stepAngle = 360 / totalApps;

  // 3D Canvas Wireframe Globe Animation
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let globeAngle = 0;
    let animId;

    const renderGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 180;

      // Soft ambient celestial glow
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.35);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
      grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer Silhouette Rim
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 3D Latitudes
      const latCount = 9;
      for (let i = 1; i < latCount; i++) {
        const lat = (i / latCount) * Math.PI - Math.PI / 2;
        const y = cy + Math.sin(lat) * radius;
        const rLat = Math.cos(lat) * radius;
        
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.ellipse(cx, y, rLat, rLat * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3D Longitudes (Rotating Meridian Lines)
      const lonCount = 12;
      for (let i = 0; i < lonCount; i++) {
        const lon = (i / lonCount) * Math.PI + globeAngle;
        const rx = Math.cos(lon) * radius;
        const isFrontHemisphere = Math.sin(lon) > 0;
        
        ctx.strokeStyle = isFrontHemisphere ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.1)';
        ctx.lineWidth = isFrontHemisphere ? 1.2 : 0.8;
        
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(rx), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Digital Matrix Grid Nodes on Globe Surface
      const dotRows = 11;
      const dotCols = 20;
      for (let r = 1; r < dotRows; r++) {
        const phi = (r / dotRows) * Math.PI - Math.PI / 2;
        const y = cy + Math.sin(phi) * radius;
        const rPhi = Math.cos(phi) * radius;

        for (let c = 0; c < dotCols; c++) {
          const theta = (c / dotCols) * Math.PI * 2 + globeAngle;
          const x = cx + Math.cos(theta) * rPhi;
          const z = Math.sin(theta);

          if (z > -0.15) {
            const alpha = Math.max(0.1, (z + 0.15) / 1.15);
            ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(x, y, z > 0.6 ? 1.8 : 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      globeAngle += 0.003;
      animId = requestAnimationFrame(renderGlobe);
    };

    renderGlobe();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Orbital movement loop with "Spin, Pause at Front, Highlight and Resume"
  useEffect(() => {
    let lastTime = performance.now();
    let currentAngle = angle;
    let targetPauseAngle = null;

    const animateOrbit = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isAutoRotating && !isHovered && !isPausedAtFocal) {
        // Continuous smooth rotation
        const nextAngle = (currentAngle + delta * 14) % 360;
        currentAngle = nextAngle;
        setAngle(nextAngle);

        // Check if any app card has reached the front focal position (90 deg in orbital coordinates)
        for (let i = 0; i < totalApps; i++) {
          const itemDeg = (nextAngle + i * stepAngle) % 360;
          // When item is centered at ~90 deg (front peak of the inclined orbit)
          if (Math.abs(itemDeg - 90) < 1.2 && !targetPauseAngle) {
            targetPauseAngle = i;
            setIsPausedAtFocal(true);
            setActiveAppIndex(i);

            // Pause for 2.8 seconds to display and highlight the app, then resume spinning
            pauseTimerRef.current = setTimeout(() => {
              setIsPausedAtFocal(false);
              targetPauseAngle = null;
            }, 2800);
            break;
          }
        }
      }

      requestRef.current = requestAnimationFrame(animateOrbit);
    };

    requestRef.current = requestAnimationFrame(animateOrbit);

    return () => {
      cancelAnimationFrame(requestRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [isAutoRotating, isHovered, isPausedAtFocal, totalApps, stepAngle]);

  // Bring any clicked app to the front focal position immediately
  const focusOnApp = (index) => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setActiveAppIndex(index);
    // Position app at 90 deg (front center)
    const target = (90 - index * stepAngle + 720) % 360;
    setAngle(target);
    setIsPausedAtFocal(true);
    pauseTimerRef.current = setTimeout(() => {
      setIsPausedAtFocal(false);
    }, 4000);
  };

  const handleCardClick = (appItem) => {
    const fullAsset = assets.find(a => a.id === appItem.id) || appItem;
    setIsAssetDetailOpen(fullAsset);
  };

  const activeApp = appItems[activeAppIndex] || appItems[0];

  return (
    <div className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col items-center justify-center select-none overflow-hidden">
      
      {/* 1. Panoramic Full-Width 3D Light Glow Horizon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Full-width Wide Inclined Orbital Ellipse 1 (Outer Radiant Path) */}
        <div
          className="w-[780px] h-[780px] sm:w-[980px] sm:h-[980px] lg:w-[1180px] lg:h-[1180px] rounded-full border border-sky-400/20 absolute"
          style={{
            transform: 'rotateX(72deg) rotateY(-14deg)',
            boxShadow: '0 0 60px rgba(56, 189, 248, 0.12), inset 0 0 40px rgba(56, 189, 248, 0.08)'
          }}
        >
          {/* Orbit Pulse Particle */}
          <div className="w-3 h-3 rounded-full bg-cyan-300 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_16px_#38bdf8] animate-ping"></div>
        </div>

        {/* Inclined Orbital Ellipse 2 (Inner Precision Track) */}
        <div
          className="w-[660px] h-[660px] sm:w-[820px] sm:h-[820px] lg:w-[980px] lg:h-[980px] rounded-full border border-slate-700/40 border-dashed absolute"
          style={{
            transform: 'rotateX(72deg) rotateY(-14deg)'
          }}
        ></div>

        {/* Ambient Horizontal Soft Ray */}
        <div className="w-[85%] h-[120px] bg-gradient-to-r from-transparent via-sky-500/10 to-transparent rounded-full blur-3xl absolute top-1/2 -translate-y-1/2"></div>
      </div>

      {/* 2. Central 3D Rotating Wireframe World Canvas */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="drop-shadow-[0_0_40px_rgba(56,189,248,0.22)]"
        />
      </div>

      {/* 3. The 6 Full-Width Inclined Orbiting Application Cards */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {appItems.map((app, idx) => {
          const itemAngleDeg = (angle + idx * stepAngle) % 360;
          const itemAngleRad = (itemAngleDeg * Math.PI) / 180;

          // Full-width wide elliptical coordinate expansion (a = 380px to 540px)
          const a = typeof window !== 'undefined' && window.innerWidth > 1024 ? 490 : 360; // wide horizontal spread
          const b = typeof window !== 'undefined' && window.innerWidth > 1024 ? 125 : 95;   // vertical depth

          const x = Math.cos(itemAngleRad) * a;
          const y = Math.sin(itemAngleRad) * b;

          // Depth z from -1 (behind world) to +1 (in front of world)
          const z = Math.sin(itemAngleRad);
          const isFront = z > 0.65;
          const isBehind = z < -0.25;

          const scale = 0.72 + (z + 1) * 0.22; // 0.72 to 1.16
          const opacity = isBehind ? 0.35 : 0.55 + (z + 1) * 0.25;

          return (
            <div
              key={app.id}
              onClick={() => {
                focusOnApp(idx);
                handleCardClick(app);
              }}
              className="absolute pointer-events-auto cursor-pointer transition-all duration-300 ease-out"
              style={{
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                zIndex: isBehind ? 5 : Math.round((z + 1) * 30) + 15,
                opacity: opacity,
              }}
            >
              <div
                className={`w-48 sm:w-56 lg:w-64 rounded-2xl backdrop-blur-xl border transition-all duration-500 shadow-2xl overflow-hidden group ${
                  isFront
                    ? `bg-[#0B1124]/95 ${app.border} ${app.glow} ring-2 ring-sky-400/40 scale-105`
                    : 'bg-[#080C18]/85 border-white/10 hover:border-white/25 hover:bg-[#0B1020]'
                }`}
                style={{
                  transform: 'rotateZ(-2.5deg) rotateY(4deg)',
                }}
              >
                {/* App Screenshot / Banner Preview Strip */}
                <div className="relative h-24 sm:h-28 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={app.image}
                    alt={app.name}
                    onError={(e) => { e.target.src = app.fallbackImage; }}
                    className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1124] via-transparent to-black/30"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className={`text-[8.5px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md ${app.accent} border border-white/15`}>
                      {app.badge}
                    </span>
                    
                    <div className="p-1 rounded-lg bg-black/50 text-slate-300 backdrop-blur-md">
                      <app.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-1.5 text-left">
                  <h4 className="text-xs sm:text-sm font-light text-slate-100 tracking-tight group-hover:text-sky-300 transition-colors truncate">
                    {app.name}
                  </h4>
                  
                  <p className="text-[10.5px] text-slate-400 font-light line-clamp-1">
                    {app.tagline}
                  </p>

                  {/* KPI Bar */}
                  <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-light">
                    <span className="text-slate-300 font-normal">{app.kpi}</span>
                    <span className="text-sky-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-normal">
                      Acessar <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Active Spotlight Spotlight Card (When Pausing at Front) */}
      {isPausedAtFocal && (
        <div className="absolute bottom-16 z-30 animate-fadeIn pointer-events-auto">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#090E1F]/90 border border-sky-400/40 shadow-2xl backdrop-blur-xl text-left max-w-lg">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-300 shrink-0">
              <activeApp.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-slate-100 truncate">{activeApp.name}</span>
                <span className="text-[9px] text-sky-400 font-mono px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/20 uppercase">
                  {activeApp.stat}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-light truncate">{activeApp.sub}</p>
            </div>

            <button
              onClick={() => handleCardClick(activeApp)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-normal transition-all shrink-0 flex items-center gap-1"
            >
              <span>Dossiê</span>
              <ChevronRight className="w-3 h-3 text-sky-400" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Minimalist Panoramic Orbit Controls & App Selector Strip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#080C18]/90 border border-white/10 backdrop-blur-md text-xs text-slate-400 shadow-2xl">
        
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title={isAutoRotating ? "Pausar rotação contínua" : "Iniciar rotação automática"}
        >
          {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <span className="text-slate-700">|</span>

        {/* 6 App Selector Buttons */}
        <div className="flex items-center gap-1.5">
          {appItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => focusOnApp(i)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-light tracking-wide transition-all ${
                activeAppIndex === i
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {item.shortName}
            </button>
          ))}
        </div>

        <span className="text-slate-700">|</span>

        <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
          ÓRBITA 3D
        </span>
      </div>

    </div>
  );
}
