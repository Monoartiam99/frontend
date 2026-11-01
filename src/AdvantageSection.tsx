import React, { useState, useRef, useEffect } from 'react';
import { Scan, Box, Layers3, BadgeCheck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  accent: 'blue' | 'magenta' | 'cyan' | 'green';
  index: number;
}

const ACCENT_STYLES = {
  blue: {
    color: '#2D8FD5',
    bg: 'rgba(45, 143, 213, 0.12)',
    border: 'rgba(45, 143, 213, 0.3)',
    glow: 'rgba(45, 143, 213, 0.25)',
    hoverBorder: 'hover:border-[#2D8FD5]/60',
  },
  magenta: {
    color: '#E0457B',
    bg: 'rgba(224, 69, 123, 0.12)',
    border: 'rgba(224, 69, 123, 0.3)',
    glow: 'rgba(224, 69, 123, 0.25)',
    hoverBorder: 'hover:border-[#E0457B]/60',
  },
  cyan: {
    color: '#0891B2',
    bg: 'rgba(34, 211, 238, 0.14)',
    border: 'rgba(34, 211, 238, 0.35)',
    glow: 'rgba(34, 211, 238, 0.25)',
    hoverBorder: 'hover:border-[#0891B2]/60',
  },
  green: {
    color: '#059669',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    glow: 'rgba(16, 185, 129, 0.25)',
    hoverBorder: 'hover:border-[#059669]/60',
  },
};

function FeatureCard({ icon: Icon, title, description, accent }: FeatureCardProps) {
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = ACCENT_STYLES[accent];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-start rounded-[22px] p-6 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 cursor-default overflow-hidden ${theme.hoverBorder}`}
      style={{
        background: 'rgba(255, 255, 255, 0.60)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.40)',
        boxShadow:
          '0 12px 32px -8px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02), inset 0 1px 2px 0 rgba(255, 255, 255, 1)',
      }}
    >
      {/* Dynamic Cursor Spotlight Highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[22px] transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(180px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255, 255, 255, 0.75), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Outer Glow on Hover */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 20px 40px -10px ${theme.glow}, 0 0 0 1px rgba(255, 255, 255, 0.8)`,
        }}
        aria-hidden="true"
      />

      {/* Light Sheen Sweep on Hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-tr from-transparent via-white/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon Tile with Gradient Tint & Accent Glow */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3"
          style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            color: theme.color,
            boxShadow: `0 4px 14px -2px ${theme.glow}`,
          }}
        >
          <Icon size={22} className="stroke-[2.1]" />
        </div>
      </div>

      {/* Title */}
      <h3 className="relative z-10 mb-2 text-[17px] sm:text-lg font-bold tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-[#8B1038]">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-[14px] sm:text-[15px] leading-relaxed text-slate-600 font-normal">
        {description}
      </p>
    </div>
  );
}

// Premium 3D-Style Animated CAD Visual Panel
function AdvantageCadVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cycleProgress, setCycleProgress] = useState(0); // 0 to 1 loop over 8 seconds

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const LOOP_DURATION = 8000; // 8 seconds per loop

    const tick = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) % LOOP_DURATION;
      setCycleProgress(elapsed / LOOP_DURATION);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Orbital positions (animated smoothly based on cycleProgress)
  const angle1 = cycleProgress * Math.PI * 2;
  const angle2 = -cycleProgress * Math.PI * 2 * 1.25;

  // Orbit 1: rx=148, ry=74, rotated -24deg around (230, 175)
  const rot1 = (-24 * Math.PI) / 180;
  const ox1 = Math.cos(angle1) * 148;
  const oy1 = Math.sin(angle1) * 74;
  const node1X = 230 + (ox1 * Math.cos(rot1) - oy1 * Math.sin(rot1));
  const node1Y = 175 + (ox1 * Math.sin(rot1) + oy1 * Math.cos(rot1));

  // Orbit 2: rx=156, ry=78, rotated +26deg around (230, 175)
  const rot2 = (26 * Math.PI) / 180;
  const ox2 = Math.cos(angle2) * 156;
  const oy2 = Math.sin(angle2) * 78;
  const node2X = 230 + (ox2 * Math.cos(rot2) - oy2 * Math.sin(rot2));
  const node2Y = 175 + (ox2 * Math.sin(rot2) + oy2 * Math.cos(rot2));

  // 2D to 3D morphing factor: 0 -> 0.45 (blueprint wireframe), 0.45 -> 0.85 (solid glossy 3D), 0.85 -> 1.0 (settled & cycle restart)
  const isSolidStage = cycleProgress > 0.42;
  const solidOpacity = Math.min(1, Math.max(0, (cycleProgress - 0.38) * 4));

  // Scan line Y position: sweeps down during blueprint phase
  const scanLineY = 80 + (cycleProgress % 0.5) * 2 * 140;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-8 md:p-9 transition-all duration-500 ease-out"
      style={{
        background:
          'linear-gradient(145deg, rgba(8, 13, 34, 0.94) 0%, rgba(11, 20, 48, 0.90) 50%, rgba(7, 11, 26, 0.96) 100%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow:
          '0 28px 70px -15px rgba(2, 6, 23, 0.45), 0 0 0 1px rgba(45, 143, 213, 0.25), inset 0 1px 2px 0 rgba(255, 255, 255, 0.25), inset 0 0 30px rgba(34, 211, 238, 0.08)',
      }}
    >
      {/* Moving Sheen Sweep across Panel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 -z-0"
        style={{
          background:
            'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.15) 45%, rgba(34, 211, 238, 0.25) 50%, transparent 65%)',
          backgroundSize: '250% 250%',
          animation: 'sheenSweep 12s ease-in-out infinite',
        }}
      />

      {/* Ambient Corner Lighting Glows (Cyan & Magenta Key Lights) */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(224, 69, 123, 0.5) 0%, rgba(139, 16, 56, 0.2) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(45, 143, 213, 0.2) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Blueprint Ground Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Glass Chips with Thin Leader Lines */}
      {/* Chip 1: Projections (Top-Left) */}
      <div
        className="absolute top-8 left-8 hidden sm:flex items-center gap-2 z-20 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 0.2}px, ${Math.sin(cycleProgress * Math.PI * 4) * 4}px, 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-950/70 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-sky-200 shadow-[0_4px_12px_rgba(34,211,238,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Projections</span>
        </div>
        <div className="h-px w-6 bg-gradient-to-r from-sky-400/60 to-transparent" />
      </div>

      {/* Chip 2: STEP AP242 (Top-Right) */}
      <div
        className="absolute top-8 right-8 hidden sm:flex items-center gap-2 z-20 pointer-events-none flex-row-reverse"
        style={{
          transform: `translate3d(${mousePos.x * -0.2}px, ${Math.cos(cycleProgress * Math.PI * 4) * 4}px, 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-pink-950/70 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-pink-200 shadow-[0_4px_12px_rgba(224,69,123,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
          <span>STEP AP242</span>
        </div>
        <div className="h-px w-6 bg-gradient-to-l from-pink-400/60 to-transparent" />
      </div>

      {/* Chip 3: Sections (Bottom-Left above footer) */}
      <div
        className="absolute bottom-20 left-8 hidden sm:flex items-center gap-2 z-20 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 0.15}px, ${-Math.sin(cycleProgress * Math.PI * 3) * 3}px, 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/70 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-emerald-200 shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Sections</span>
        </div>
        <div className="h-px w-5 bg-gradient-to-r from-emerald-400/60 to-transparent" />
      </div>

      {/* Main Interactive CAD Composition */}
      <div
        className="relative mx-auto aspect-[4/3] w-full max-w-[520px] flex items-center justify-center transition-transform duration-300 ease-out z-10"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg) translateZ(12px)`,
        }}
      >
        <svg
          viewBox="0 0 460 360"
          className="w-full h-full select-none overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Core Cyan & Blue Radial Core Glow */}
            <radialGradient id="advCoreCyanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#2D8FD5" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#0B1430" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#070B1A" stopOpacity="0" />
            </radialGradient>

            {/* Glowing Translucent Plate Gradient */}
            <linearGradient id="advPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0457B" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#2D8FD5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
            </linearGradient>

            {/* Solid 3D Top Facet Gloss Gradient */}
            <linearGradient id="solidGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="75%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.95" />
            </linearGradient>

            {/* Solid 3D Left Facet Shading */}
            <linearGradient id="solidLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.95" />
            </linearGradient>

            {/* Solid 3D Right Facet Shading */}
            <linearGradient id="solidRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0457B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8B1038" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing node blur filter */}
            <filter id="advNodeGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Central Pulsing Volumetric Cyan Halo */}
          <circle
            cx="230"
            cy="175"
            r="85"
            fill="url(#advCoreCyanGlow)"
            className="animate-pulse"
            style={{ animationDuration: '3.5s' }}
          />

          {/* Holographic Scan Line (Sweeps across drawing -> solid) */}
          <g opacity={isSolidStage ? 0.3 : 0.75}>
            <line
              x1="100"
              y1={scanLineY}
              x2="360"
              y2={scanLineY}
              stroke="#22D3EE"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
            <rect
              x="100"
              y={scanLineY - 12}
              width="260"
              height="24"
              fill="url(#advCoreCyanGlow)"
              opacity="0.25"
            />
          </g>

          {/* Orbit Ring 1: Tilted Dotted Crimson/Magenta Ellipse with Travelling Node */}
          <g
            className="origin-[230px_175px]"
            style={{
              transform: 'rotate(-24deg)',
            }}
          >
            <ellipse
              cx="230"
              cy="175"
              rx="148"
              ry="74"
              stroke="#E0457B"
              strokeWidth="1.25"
              strokeDasharray="4 5"
              strokeOpacity="0.55"
            />
          </g>

          {/* Orbit Ring 2: Tilted Cyan/Blue Ellipse with Travelling Node */}
          <g
            className="origin-[230px_175px]"
            style={{
              transform: 'rotate(26deg)',
            }}
          >
            <ellipse
              cx="230"
              cy="175"
              rx="156"
              ry="78"
              stroke="#2D8FD5"
              strokeWidth="1.25"
              strokeDasharray="3 4"
              strokeOpacity="0.55"
            />
          </g>

          {/* Travelling Magenta Node 1 with Soft Trail */}
          <g filter="url(#advNodeGlow)">
            <circle cx={node1X} cy={node1Y} r="5" fill="#E0457B" />
            <circle cx={node1X} cy={node1Y} r="8.5" fill="#E0457B" fillOpacity="0.45" />
          </g>

          {/* Travelling Blue/Cyan Node 2 with Soft Trail */}
          <g filter="url(#advNodeGlow)">
            <circle cx={node2X} cy={node2Y} r="5" fill="#22D3EE" />
            <circle cx={node2X} cy={node2Y} r="9" fill="#2D8FD5" fillOpacity="0.5" />
          </g>

          {/* Animated 3D Floating Diamond Plate & Holographic Part */}
          <g
            className="transition-transform duration-700 ease-out"
            style={{
              transform: `translateY(${Math.sin(cycleProgress * Math.PI * 2) * 5}px)`,
            }}
          >
            {/* 1. Translucent Floating Glass Plate (From reference screenshot) */}
            <polygon
              points="230,82 328,124 230,166 132,124"
              fill="url(#advPlateGrad)"
              stroke="#E0457B"
              strokeWidth="1.4"
              strokeOpacity="0.8"
            />

            {/* Inverted lower glass prism lines */}
            <line x1="132" y1="124" x2="230" y2="204" stroke="#22D3EE" strokeWidth="1.2" strokeOpacity="0.75" />
            <line x1="328" y1="124" x2="230" y2="204" stroke="#22D3EE" strokeWidth="1.2" strokeOpacity="0.75" />
            <line x1="230" y1="166" x2="230" y2="204" stroke="#2D8FD5" strokeWidth="1.4" strokeOpacity="0.85" />

            {/* 2. Blueprint Wireframe Overlay (Visible in early loop phase) */}
            <g opacity={1 - solidOpacity}>
              {/* Construction centerlines */}
              <line x1="230" y1="65" x2="230" y2="225" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="6 3 2 3" opacity="0.6" />
              <line x1="110" y1="124" x2="350" y2="124" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="6 3 2 3" opacity="0.6" />

              {/* 2D dimension callout arrows */}
              <line x1="120" y1="96" x2="230" y2="48" stroke="#22D3EE" strokeWidth="0.8" opacity="0.7" />
              <circle cx="120" cy="96" r="2" fill="#22D3EE" />
              <circle cx="230" cy="48" r="2" fill="#22D3EE" />
              <text x="160" y="66" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.85">R45.0</text>
            </g>

            {/* 3. Solid Glossy 3D Geometry (Fades in during solid stage) */}
            <g opacity={solidOpacity} className="transition-opacity duration-500">
              {/* 3D Solid Extruded Top Cap */}
              <polygon
                points="230,100 300,132 230,164 160,132"
                fill="url(#solidGlossGrad)"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                filter="url(#advNodeGlow)"
              />

              {/* Left Extruded Solid Wall */}
              <polygon
                points="160,132 230,164 230,196 160,164"
                fill="url(#solidLeftGrad)"
                stroke="#38BDF8"
                strokeWidth="1"
              />

              {/* Right Extruded Solid Wall */}
              <polygon
                points="230,164 300,132 300,164 230,196"
                fill="url(#solidRightGrad)"
                stroke="#E0457B"
                strokeWidth="1"
              />

              {/* Specular Edge Highlights */}
              <line x1="160" y1="132" x2="230" y2="164" stroke="#FFFFFF" strokeWidth="1.25" opacity="0.9" />
              <line x1="230" y1="164" x2="300" y2="132" stroke="#FFFFFF" strokeWidth="1.25" opacity="0.9" />
            </g>
          </g>

          {/* Floating Technical Coordinate Points */}
          <circle cx="178" cy="112" r="2.5" fill="#38BDF8" opacity="0.85" />
          <circle cx="140" cy="225" r="2" fill="#38BDF8" opacity="0.7" />
          <circle cx="370" cy="225" r="2.5" fill="#38BDF8" opacity="0.7" />
          <circle cx="230" cy="204" r="3.5" fill="#22D3EE" filter="url(#advNodeGlow)" />
        </svg>
      </div>

      {/* Bottom Technical Status Bar with Live Transformation Progress */}
      <div className="relative z-10 mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px] font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Model review complete</span>
          </div>

          <div className="font-semibold tracking-wide bg-gradient-to-r from-sky-300 via-pink-300 to-rose-400 bg-clip-text text-transparent">
            <span>Ready for engineering use</span>
          </div>
        </div>

        {/* Thin Animated 8s Cycle Progress Indicator Line */}
        <div className="mt-3 h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B1038] via-[#2D8FD5] to-[#22D3EE] transition-all duration-100 ease-linear"
            style={{ width: `${cycleProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AdvantageSection() {
  return (
    <section
      id="resources"
      className="relative z-10 py-24 sm:py-28 lg:py-32 overflow-hidden border-t border-b border-slate-200/80"
      style={{
        background: '#FAFAFC',
      }}
    >
      {/* Blueprint Grid Overlay that Fades Toward the Edges */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      {/* Large Blurred Slowly Floating Gradient Orbs Behind Content */}
      <div
        className="pointer-events-none absolute -top-16 left-1/4 h-[440px] w-[440px] rounded-full blur-[115px] opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 16, 56, 0.16) 0%, rgba(224, 69, 123, 0.08) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 h-[460px] w-[460px] rounded-full blur-[120px] opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(45, 143, 213, 0.18) 0%, rgba(34, 211, 238, 0.10) 55%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 h-[420px] w-[420px] rounded-full blur-[110px] opacity-65"
        style={{
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.14) 0%, rgba(45, 143, 213, 0.08) 55%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 xl:gap-16">
          {/* Left Column: Glass Eyebrow Pill, Headline with Gradient Shift, Paragraph, 2x2 Feature Cards */}
          <div>
            {/* Glass Eyebrow Pill with Pulsing Status Dot */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-white/70 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold tracking-[0.2em] text-[#0284c7] uppercase mb-4 shadow-[0_2px_10px_rgba(2,132,199,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7] animate-pulse" />
              The Beekshan Technology advantage
            </div>

            {/* Headline with tight letter spacing and maroon->blue gradient text */}
            <h2 className="font-display mb-5 text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.14]">
              Bring archived engineering{' '}
              <span className="gradient-hero-shift">
                back into circulation
              </span>
            </h2>

            {/* Paragraph with comfortable line height and 52ch max width */}
            <p className="mb-9 max-w-[52ch] text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
              Move beyond static paperwork. Beekshan Technology converts documented part intent into a dependable digital model for machining, analysis, and production planning.
            </p>

            {/* 2x2 Feature Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={Scan}
                title="Drawing awareness"
                description="Understands projections, sections, and annotations."
                accent="blue"
                index={0}
              />
              <FeatureCard
                icon={Box}
                title="Usable solid output"
                description="A STEP model made for engineering work, not an approximate mesh."
                accent="magenta"
                index={1}
              />
              <FeatureCard
                icon={Layers3}
                title="Manufacturing features"
                description="Captures key openings, radii, pockets, and repeated details."
                accent="cyan"
                index={2}
              />
              <FeatureCard
                icon={BadgeCheck}
                title="Engineering review"
                description="A specialist checks the model before release."
                accent="green"
                index={3}
              />
            </div>
          </div>

          {/* Right Column: Premium Animated 3D-Style CAD Visual Panel */}
          <div className="w-full">
            <AdvantageCadVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvantageSection;
