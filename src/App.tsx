import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  CloudUpload,
  Factory,
  FileCheck,
  Loader2,
  Menu,
  MessageCircle,
  Plane,
  Sparkles,
  X,
} from 'lucide-react';
import HeroCADViewer from './HeroCADViewer';
import ProcessSection from './ProcessSection';
import AdvantageSection from './AdvantageSection';
import CADPreview from './CADPreview';
import LiveAxonometricPreview from './LiveAxonometricPreview';

// Engineering CAD Wireframe visual details revealed on hover
function AerospaceCADWireframe({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      {/* Precision CAD datum grid marks */}
      <line x1="12" y1="168" x2="168" y2="168" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
      <line x1="12" y1="12" x2="12" y2="168" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />

      {/* Airfoil profile curve */}
      <path
        d="M 22 118 C 36 60, 92 36, 166 74 C 122 108, 66 128, 22 118 Z"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mean camber chord axis line */}
      <path d="M 22 118 Q 86 70 166 74" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.75" />

      {/* Chord dimension line with arrows */}
      <line x1="22" y1="42" x2="166" y2="42" strokeWidth="0.75" opacity="0.6" />
      <line x1="22" y1="36" x2="22" y2="122" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
      <line x1="166" y1="36" x2="166" y2="80" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
      <path d="M 22 42 L 29 39 M 22 42 L 29 45" strokeWidth="0.75" />
      <path d="M 166 42 L 159 39 M 166 42 L 159 45" strokeWidth="0.75" />

      {/* Coordinate datum crosshair */}
      <circle cx="52" cy="94" r="14" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
      <circle cx="52" cy="94" r="3" strokeWidth="0.8" opacity="0.7" />
      <line x1="52" y1="74" x2="52" y2="114" strokeWidth="0.75" opacity="0.7" />
      <line x1="32" y1="94" x2="72" y2="94" strokeWidth="0.75" opacity="0.7" />

      {/* Angle reference arc */}
      <path d="M 136 74 A 28 28 0 0 1 156 90" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

function AutomotiveCADWireframe({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      {/* Concentric pitch, root, and tip circles */}
      <circle cx="90" cy="90" r="70" strokeWidth="0.9" strokeDasharray="4 2" opacity="0.5" />
      <circle cx="90" cy="90" r="54" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="90" cy="90" r="34" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="90" cy="90" r="20" strokeWidth="1" strokeLinecap="round" />

      {/* Keyway drive notch on center bore */}
      <path d="M 87 70 L 87 64 L 93 64 L 93 70" strokeWidth="1" />

      {/* Centerline crosshairs */}
      <line x1="90" y1="12" x2="90" y2="168" strokeWidth="0.75" strokeDasharray="8 3 2 3" opacity="0.6" />
      <line x1="12" y1="90" x2="168" y2="90" strokeWidth="0.75" strokeDasharray="8 3 2 3" opacity="0.6" />

      {/* Bolt circle pitch hole markers (4 quadrant holes) */}
      <circle cx="66" cy="66" r="4.5" strokeWidth="0.8" />
      <circle cx="114" cy="66" r="4.5" strokeWidth="0.8" />
      <circle cx="66" cy="114" r="4.5" strokeWidth="0.8" />
      <circle cx="114" cy="114" r="4.5" strokeWidth="0.8" />

      {/* Diameter dimension leader */}
      <line x1="90" y1="90" x2="142" y2="38" strokeWidth="0.75" opacity="0.7" />
      <line x1="142" y1="38" x2="166" y2="38" strokeWidth="0.75" opacity="0.7" />
      <path d="M 128 52 L 134 46" strokeWidth="0.75" />

      {/* Datum center point */}
      <circle cx="90" cy="90" r="2" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}

function HeavyEquipmentCADWireframe({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <defs>
        <pattern id="cad-hatch-pattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        </pattern>
      </defs>

      {/* Structural I-beam / channel cross section */}
      <path
        d="M 30 40 L 76 40 L 76 52 L 58 52 L 58 128 L 76 128 L 76 140 L 30 140 L 30 128 L 48 128 L 48 52 L 30 52 Z"
        strokeWidth="1.2"
        fill="url(#cad-hatch-pattern)"
      />
      {/* Isometric depth projection lines */}
      <line x1="76" y1="40" x2="146" y2="20" strokeWidth="0.8" opacity="0.6" />
      <line x1="76" y1="52" x2="146" y2="32" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
      <line x1="58" y1="52" x2="128" y2="32" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
      <line x1="76" y1="128" x2="146" y2="108" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
      <line x1="76" y1="140" x2="146" y2="120" strokeWidth="0.8" opacity="0.6" />
      <line x1="30" y1="140" x2="100" y2="120" strokeWidth="0.8" opacity="0.6" />
      <path
        d="M 146 20 L 146 32 L 128 32 L 128 108 L 146 108 L 146 120 L 100 120"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.5"
      />

      {/* Flange height dimension callout with ticks */}
      <line x1="20" y1="40" x2="20" y2="140" strokeWidth="0.75" opacity="0.6" />
      <line x1="16" y1="40" x2="24" y2="40" strokeWidth="0.75" opacity="0.6" />
      <line x1="16" y1="140" x2="24" y2="140" strokeWidth="0.75" opacity="0.6" />
      <path d="M 20 40 L 17 47 M 20 40 L 23 47" strokeWidth="0.75" />
      <path d="M 20 140 L 17 133 M 20 140 L 23 133" strokeWidth="0.75" />

      {/* Neutral axis line */}
      <line x1="24" y1="90" x2="162" y2="50" strokeWidth="0.7" strokeDasharray="6 3 2 3" opacity="0.6" />

      {/* Coordinate triad */}
      <line x1="150" y1="160" x2="170" y2="160" strokeWidth="1" opacity="0.7" />
      <line x1="150" y1="160" x2="150" y2="140" strokeWidth="1" opacity="0.7" />
      <line x1="150" y1="160" x2="138" y2="170" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

interface ApplicationCardProps {
  title: string;
  text: string;
  tag: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: 'blue' | 'burgundy' | 'magenta';
  cadType: 'aerospace' | 'automotive' | 'heavy';
  className?: string;
}

function ApplicationCard({
  title,
  text,
  tag,
  icon: Icon,
  accent,
  cadType,
  className = '',
}: ApplicationCardProps) {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCoords({ x, y });
  };

  const accentStyles = {
    blue: {
      cardHoverBorder: 'hover:border-sky-400/70 dark:hover:border-sky-400/60',
      glowGradient:
        'from-sky-500/25 via-blue-500/10 to-transparent dark:from-sky-400/35 dark:via-blue-500/20 dark:to-transparent',
      radialHover: `radial-gradient(360px circle at ${coords.x}% ${coords.y}%, rgba(56, 189, 248, 0.12), transparent 70%)`,
      iconBoxNormal:
        'bg-sky-50/80 text-sky-700 border-sky-100 dark:bg-slate-800/90 dark:text-sky-400 dark:border-slate-700/80',
      iconBoxHover:
        'group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-500 group-hover:shadow-md group-hover:shadow-sky-500/25 dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950 dark:group-hover:border-sky-300 dark:group-hover:shadow-lg dark:group-hover:shadow-sky-500/30',
      tagHover:
        'group-hover:border-sky-300 group-hover:bg-sky-50/80 group-hover:text-sky-800 dark:group-hover:border-sky-400/50 dark:group-hover:bg-sky-950/50 dark:group-hover:text-sky-300',
      titleHover: 'group-hover:text-sky-800 dark:group-hover:text-sky-300',
      tagDot: 'bg-sky-500',
      wireframeColor: 'text-sky-600/25 dark:text-sky-400/20 group-hover:text-sky-600/40 dark:group-hover:text-sky-300/40',
      shadowHover:
        'hover:shadow-[0_20px_35px_-8px_rgba(2,132,199,0.18)] dark:hover:shadow-[0_22px_45px_-10px_rgba(56,189,248,0.24)]',
    },
    burgundy: {
      cardHoverBorder: 'hover:border-[#811143]/60 dark:hover:border-rose-400/60',
      glowGradient:
        'from-[#811143]/25 via-rose-500/10 to-transparent dark:from-rose-500/35 dark:via-[#811143]/20 dark:to-transparent',
      radialHover: `radial-gradient(360px circle at ${coords.x}% ${coords.y}%, rgba(129, 17, 67, 0.12), transparent 70%)`,
      iconBoxNormal:
        'bg-rose-50/80 text-[#811143] border-rose-100 dark:bg-slate-800/90 dark:text-rose-400 dark:border-slate-700/80',
      iconBoxHover:
        'group-hover:bg-[#811143] group-hover:text-white group-hover:border-[#811143] group-hover:shadow-md group-hover:shadow-[#811143]/25 dark:group-hover:bg-rose-500 dark:group-hover:text-white dark:group-hover:border-rose-300 dark:group-hover:shadow-lg dark:group-hover:shadow-rose-500/30',
      tagHover:
        'group-hover:border-rose-300 group-hover:bg-rose-50/80 group-hover:text-[#811143] dark:group-hover:border-rose-400/50 dark:group-hover:bg-rose-950/50 dark:group-hover:text-rose-300',
      titleHover: 'group-hover:text-[#811143] dark:group-hover:text-rose-300',
      tagDot: 'bg-[#811143] dark:bg-rose-400',
      wireframeColor: 'text-[#811143]/20 dark:text-rose-400/20 group-hover:text-[#811143]/35 dark:group-hover:text-rose-300/40',
      shadowHover:
        'hover:shadow-[0_20px_35px_-8px_rgba(129,17,67,0.18)] dark:hover:shadow-[0_22px_45px_-10px_rgba(244,63,94,0.24)]',
    },
    magenta: {
      cardHoverBorder: 'hover:border-fuchsia-500/60 dark:hover:border-fuchsia-400/60',
      glowGradient:
        'from-fuchsia-500/25 via-pink-500/10 to-transparent dark:from-fuchsia-400/35 dark:via-pink-500/20 dark:to-transparent',
      radialHover: `radial-gradient(360px circle at ${coords.x}% ${coords.y}%, rgba(217, 70, 239, 0.12), transparent 70%)`,
      iconBoxNormal:
        'bg-fuchsia-50/80 text-fuchsia-700 border-fuchsia-100 dark:bg-slate-800/90 dark:text-fuchsia-400 dark:border-slate-700/80',
      iconBoxHover:
        'group-hover:bg-fuchsia-700 group-hover:text-white group-hover:border-fuchsia-600 group-hover:shadow-md group-hover:shadow-fuchsia-600/25 dark:group-hover:bg-fuchsia-500 dark:group-hover:text-slate-950 dark:group-hover:border-fuchsia-300 dark:group-hover:shadow-lg dark:group-hover:shadow-fuchsia-500/30',
      tagHover:
        'group-hover:border-fuchsia-300 group-hover:bg-fuchsia-50/80 group-hover:text-fuchsia-800 dark:group-hover:border-fuchsia-400/50 dark:group-hover:bg-fuchsia-950/50 dark:group-hover:text-fuchsia-300',
      titleHover: 'group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300',
      tagDot: 'bg-fuchsia-500',
      wireframeColor: 'text-fuchsia-700/20 dark:text-fuchsia-400/20 group-hover:text-fuchsia-700/35 dark:group-hover:text-fuchsia-300/40',
      shadowHover:
        'hover:shadow-[0_20px_35px_-8px_rgba(192,38,211,0.18)] dark:hover:shadow-[0_22px_45px_-10px_rgba(232,121,249,0.24)]',
    },
  }[accent];

  return (
    <article
      tabIndex={0}
      role="article"
      aria-label={`${title} - ${tag}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 ease-out motion-safe:hover:-translate-y-1.5 motion-reduce:transform-none ${accentStyles.cardHoverBorder} ${accentStyles.shadowHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#811143] dark:focus-visible:ring-sky-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${className}`}
    >
      {/* Outer subtle glow border transition */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${accentStyles.glowGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
        aria-hidden="true"
      />

      {/* Pointer-responsive lighting spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered ? accentStyles.radialHover : 'none',
        }}
        aria-hidden="true"
      />

      {/* CAD technical background grid */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-35 dark:opacity-20 group-hover:opacity-70 dark:group-hover:opacity-40 transition-opacity duration-300 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"
        aria-hidden="true"
      />

      {/* Engineering CAD Wireframe revealed on hover */}
      <div
        className={`pointer-events-none absolute -right-3 -bottom-3 w-48 h-48 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:scale-105 ${accentStyles.wireframeColor}`}
      >
        {cadType === 'aerospace' && <AerospaceCADWireframe className="w-full h-full" />}
        {cadType === 'automotive' && <AutomotiveCADWireframe className="w-full h-full" />}
        {cadType === 'heavy' && <HeavyEquipmentCADWireframe className="w-full h-full" />}
      </div>

      {/* Precision CAD corner tick marks */}
      <span className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-[9px] text-slate-300 dark:text-slate-700 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors select-none">
        +
      </span>
      <span className="pointer-events-none absolute bottom-2.5 left-2.5 font-mono text-[9px] text-slate-300 dark:text-slate-700 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors select-none">
        +
      </span>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            {/* Refined Icon container */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${accentStyles.iconBoxNormal} ${accentStyles.iconBoxHover}`}
            >
              <Icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Small technical compliance tag */}
            <span
              className={`flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shadow-xs transition-colors duration-300 ${accentStyles.tagHover}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${accentStyles.tagDot} opacity-75 group-hover:opacity-100 transition-opacity`}
                aria-hidden="true"
              />
              {tag}
            </span>
          </div>

          <h3
            className={`mb-2.5 text-xl font-bold tracking-tight text-slate-950 dark:text-white transition-colors duration-300 ${accentStyles.titleHover}`}
          >
            {title}
          </h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400 text-[15px] transition-colors duration-300">
            {text}
          </p>
        </div>
      </div>
    </article>
  );
}

function CtaCadVisual() {
  return (
    <div className="relative w-full max-w-[460px] select-none py-2" aria-hidden="true">
      {/* Ambient background glow behind visual */}
      <div className="absolute inset-0 bg-radial from-rose-500/25 via-sky-500/10 to-transparent blur-2xl -z-10 pointer-events-none" />

      {/* Isometric 3D CAD SVG Stage */}
      <div className="relative rounded-2xl border border-white/15 bg-gradient-to-b from-slate-950/80 via-[#0b1329]/70 to-slate-950/85 p-4 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Subtle interior technical grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
            backgroundSize: '18px 18px',
          }}
        />

        <svg viewBox="0 0 460 330" className="w-full h-auto drop-shadow-xl" fill="none">
          <defs>
            <linearGradient id="cta-top-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="cta-left-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#881337" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cta-right-grad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="cta-scan-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
              <stop offset="25%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
            <filter id="cta-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Perspective Datum Ring & Pitch Ellipses */}
          <g opacity="0.45">
            <ellipse cx="230" cy="210" rx="175" ry="80" stroke="#f43f5e" strokeWidth="1" strokeDasharray="5 7" />
            <ellipse cx="230" cy="210" rx="140" ry="64" stroke="#38bdf8" strokeWidth="0.75" />
            <ellipse cx="230" cy="210" rx="100" ry="45" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 3" />
          </g>

          {/* Centerline Crosshairs on Ground Plane */}
          <g stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="6 3 2 3" opacity="0.35">
            <line x1="55" y1="210" x2="405" y2="210" />
            <line x1="230" y1="130" x2="230" y2="290" />
          </g>

          {/* Base Mount Plate / Flange (Isometric Octagonal B-REP) */}
          <g filter="url(#cta-glow)">
            {/* Base lower extruded skirt */}
            <path
              d="M 105 210 L 160 236 L 300 236 L 355 210 L 355 224 L 300 250 L 160 250 L 105 224 Z"
              fill="#1e1b4b"
              fillOpacity="0.6"
              stroke="#f43f5e"
              strokeWidth="1.2"
            />
            {/* Base top surface */}
            <path
              d="M 160 184 L 300 184 L 355 210 L 300 236 L 160 236 L 105 210 Z"
              fill="url(#cta-top-grad)"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
          </g>

          {/* Four Mounting Holes on Base Flange */}
          <g stroke="#ffffff" strokeWidth="1" fill="#0f172a" fillOpacity="0.8">
            <ellipse cx="140" cy="210" rx="9" ry="4.5" />
            <ellipse cx="320" cy="210" rx="9" ry="4.5" />
            <ellipse cx="205" cy="195" rx="7" ry="3.5" />
            <ellipse cx="255" cy="195" rx="7" ry="3.5" />
          </g>

          {/* Central Cylindrical Boss / Extruded Pillar */}
          <g>
            {/* Cylinder Body Left Shadow Face */}
            <path
              d="M 175 125 L 230 152 L 230 215 L 175 188 Z"
              fill="url(#cta-left-grad)"
              stroke="#f43f5e"
              strokeWidth="1.2"
            />
            {/* Cylinder Body Right Highlight Face */}
            <path
              d="M 230 152 L 285 125 L 285 188 L 230 215 Z"
              fill="url(#cta-right-grad)"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            {/* Rib Reinforcement Left */}
            <polygon
              points="150,195 175,150 175,188"
              fill="rgba(244, 63, 94, 0.2)"
              stroke="#f43f5e"
              strokeWidth="1"
            />
            {/* Rib Reinforcement Right */}
            <polygon
              points="310,195 285,150 285,188"
              fill="rgba(56, 189, 248, 0.2)"
              stroke="#38bdf8"
              strokeWidth="1"
            />

            {/* Top Rim of Central Boss */}
            <ellipse
              cx="230"
              cy="125"
              rx="55"
              ry="27"
              fill="url(#cta-top-grad)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Internal Precision Bore through-hole */}
            <ellipse
              cx="230"
              cy="125"
              rx="28"
              ry="14"
              fill="#060913"
              stroke="#f43f5e"
              strokeWidth="1.2"
            />
            {/* Internal Bore Depth Arc */}
            <path
              d="M 202 125 A 28 14 0 0 0 258 125"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.7"
            />
            {/* Internal Center Axis */}
            <line
              x1="230"
              y1="90"
              x2="230"
              y2="175"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          </g>

          {/* Coordinate Datum Triad (clean isometric triad without text) */}
          <g transform="translate(60, 85)">
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
            {/* X axis (rose) */}
            <line x1="0" y1="0" x2="30" y2="15" stroke="#f43f5e" strokeWidth="1.75" />
            {/* Y axis (sky) */}
            <line x1="0" y1="0" x2="-28" y2="14" stroke="#38bdf8" strokeWidth="1.75" />
            {/* Z axis (emerald/white) */}
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#ffffff" strokeWidth="1.75" />
          </g>

          {/* Dimension Callout Lines & Annotation Leaders */}
          <g opacity="0.85">
            {/* Width Dimension Callout */}
            <line x1="105" y1="265" x2="355" y2="265" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 2" />
            <line x1="105" y1="250" x2="105" y2="272" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="355" y1="250" x2="355" y2="272" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="206" y="278" fill="#e0f2fe" fontSize="9" fontFamily="monospace" fontWeight="bold">250.00 mm</text>

            {/* Diameter Leader */}
            <line x1="258" y1="125" x2="310" y2="85" stroke="#f43f5e" strokeWidth="0.8" />
            <line x1="310" y1="85" x2="355" y2="85" stroke="#f43f5e" strokeWidth="0.8" />
            <text x="312" y="80" fill="#fecdd3" fontSize="9" fontFamily="monospace" fontWeight="bold">Ø 56.00</text>
          </g>

          {/* Glowing Animated Scanning Laser Sweep Line */}
          <g>
            <line
              x1="90"
              y1="160"
              x2="370"
              y2="160"
              stroke="url(#cta-scan-grad)"
              strokeWidth="2.5"
              filter="url(#cta-glow)"
              className="animate-pulse"
            />
            {/* Scan Beam Target Points */}
            <circle cx="175" cy="160" r="3.5" fill="#f43f5e" className="animate-ping" />
            <circle cx="285" cy="160" r="3.5" fill="#38bdf8" className="animate-ping" />
          </g>

          {/* Key Datum Verification Nodes */}
          <circle cx="230" cy="125" r="3" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
          <circle cx="160" cy="184" r="2.5" fill="#38bdf8" />
          <circle cx="300" cy="184" r="2.5" fill="#38bdf8" />
          <circle cx="105" cy="210" r="2.5" fill="#f43f5e" />
          <circle cx="355" cy="210" r="2.5" fill="#f43f5e" />
        </svg>

        {/* Bottom Technical HUD Footer */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300/70">
          <span className="flex items-center gap-1">
            <span className="text-emerald-400">✓</span> GEOMETRIC INTEGRITY VERIFIED
          </span>
          <span className="text-rose-300/80 tracking-widest">ISO 10303 // 214</span>
        </div>
      </div>
    </div>
  );
}

const navItems = [
  { label: 'Process', href: '#how-it-works' },
  { label: 'Applications', href: '#industries' },
  { label: 'Capabilities', href: '#resources' },
  { label: 'Plans', href: '#pricing' },
  { label: 'Company', href: '#about' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(() => new URLSearchParams(window.location.search).has('job'));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openTrial = () => {
    setMenuOpen(false);
    setTrialOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (trialOpen) {
    return <TrialUploadPage onBack={() => setTrialOpen(false)} />;
  }

  return (
    <div className="page-shell min-h-screen text-slate-900 font-sans selection:bg-[#8B1038]/20 selection:text-[#8B1038] overflow-x-hidden">
      {/* Background Atmosphere: Grid Pattern & Slow Floating Ambient Orbs */}
      <div className="mesh-grid" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="orb orb-hero-viewer" />

      {/* FLOATING FROSTED GLASS NAVBAR (Detached from top edge with rounded corners) */}
      <header className="sticky top-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
        <div
          className={`mx-auto max-w-[1360px] pointer-events-auto rounded-2xl sm:rounded-3xl floating-glass-nav transition-all duration-300 ${
            isScrolled ? 'is-scrolled' : ''
          }`}
        >
          <div className="flex h-[72px] sm:h-[80px] items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <a
              href="#home"
              className="brand-mark flex items-center transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-600"
              aria-label="Beekshan Technology home"
            >
              <img
                src="/beekshan_logo.png"
                alt="Beekshan Technology"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain"
              />
            </a>

            {/* Desktop Navigation Items */}
            <nav className="hidden items-center gap-7 lg:gap-8 text-[14px] font-medium text-slate-600 lg:flex" aria-label="Main Navigation">
              <a href="#home" className="nav-link is-active text-slate-950 font-bold">
                Home
              </a>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link text-slate-600 hover:text-slate-950 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Header Action CTAs */}
            <div className="hidden items-center gap-3 sm:flex">
              <a
                href="#trial"
                className="text-[14px] font-medium text-slate-700 hover:text-slate-950 transition-colors px-2 py-1"
              >
                Login
              </a>
              <button
                type="button"
                onClick={openTrial}
                className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white shadow-md active:scale-[0.98] transition-all"
              >
                <span>Begin a trial</span>
                <Sparkles size={14} className="text-cyan-200" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                className="rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-700 hover:bg-slate-100 shadow-xs"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {menuOpen && (
            <div className="border-t border-slate-200/80 px-6 py-5 lg:hidden rounded-b-2xl sm:rounded-b-3xl bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-3.5 font-medium text-slate-700">
                <a
                  href="#home"
                  className="py-1 font-bold text-slate-950 hover:text-[#8B1038]"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </a>
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="py-1 hover:text-[#8B1038] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-3 flex flex-col gap-3 border-t border-slate-200/80 pt-4">
                  <a
                    href="#trial"
                    className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </a>
                  <button
                    type="button"
                    className="btn-primary-glow rounded-xl px-4 py-3 text-center text-sm font-bold text-white shadow-lg"
                    onClick={openTrial}
                  >
                    Begin a trial
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION (MODERN GLASSMORPHIC REDESIGN - DAY MODE & PERFECTLY FITTED) */}
      <section
        id="home"
        className="relative z-10 mx-auto grid max-w-[1360px] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 xl:gap-12 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-20"
      >
        {/* Left Column: Perfectly Fitted Headline, Copy, Action CTAs & Spec Ticker */}
        <div className="z-20 flex w-full max-w-[580px] xl:max-w-[620px] flex-col justify-center gap-4 sm:gap-4.5">
          {/* Engineering AI Badge Pill */}
          <div className="animate-fade-up-1 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-mono font-semibold glass-badge-pill text-[#8B1038]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-bold text-slate-800">AI-assisted, engineer-reviewed CAD</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#8B1038] font-bold">v2.6 VISION</span>
          </div>

          {/* Primary Headline with Animated Gradient Accent */}
          <h1 className="animate-fade-up-2 font-display text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] leading-[1.12] font-extrabold tracking-tight text-slate-950">
            Turn technical drawings into{' '}
            <span className="gradient-hero-shift inline-block font-extrabold">ready-to-use 3D CAD</span>
          </h1>

          {/* Body Paragraph */}
          <p className="animate-fade-up-3 text-[15px] sm:text-base leading-relaxed text-slate-600">
            Beekshan Technology transforms <strong className="text-slate-950 font-semibold">engineering drawings into practical 3D models</strong>{' '}
            with AI-assisted interpretation and careful engineer review. Receive a STEP-ready result built for the
            work that follows.
          </p>

          {/* Value Subheading */}
          <p className="animate-fade-up-3 text-sm sm:text-[15px] font-semibold text-slate-800 flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#22D3EE] via-[#E0457B] to-[#8B1038]" />
            Clear inputs. Confident manufacturing decisions.
          </p>

          {/* Action CTAs */}
          <div className="animate-fade-up-4 flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={openTrial}
              className="btn-primary-glow inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm sm:text-[15px] font-bold text-white shadow-xl transition-all"
            >
              <span>Begin a trial</span>
              <ArrowRight size={17} />
            </button>
            <a
              href="#how-it-works"
              className="btn-secondary-glass inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm sm:text-[15px] font-semibold text-slate-800 hover:text-slate-950 transition-all"
            >
              <span>Explore the process</span>
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Live Engineering Specification Ticker */}
          <div className="animate-fade-up-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 border-t border-slate-200/90 text-xs font-mono text-slate-600">
            <div className="border-l-2 border-[#22D3EE] pl-2.5">
              <span className="block text-slate-950 font-bold text-sm">0.01 mm</span>
              <span>Tolerance</span>
            </div>
            <div className="border-l-2 border-[#E0457B] pl-2.5">
              <span className="block text-slate-950 font-bold text-sm">STEP / STL</span>
              <span>Solid B-Rep</span>
            </div>
            <div className="border-l-2 border-[#2D8FD5] pl-2.5">
              <span className="block text-slate-950 font-bold text-sm">PP1 + YOLO</span>
              <span>Traced Vision</span>
            </div>
            <div className="border-l-2 border-emerald-600 pl-2.5">
              <span className="block text-slate-950 font-bold text-sm">100% Watertight</span>
              <span>Solid Geometry</span>
            </div>
          </div>
        </div>

        {/* Right Column: Premium 3D Glassmorphic CAD Viewer (~15% larger, balanced hero presence) */}
        <div className="z-20 w-full max-w-[580px] lg:max-w-[560px] xl:max-w-[600px] mx-auto lg:ml-auto animate-fade-up-3">
          <HeroCADViewer />
        </div>
      </section>

      {/* PROCESS SECTION */}
      <ProcessSection />

      {/* CAPABILITIES & TECHNOLOGY SHOWCASE (CENTERPIECE - DAY MODE) */}
      <AdvantageSection />



      {/* APPLICATIONS SECTION */}
      <section id="industries" className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#811143]/20 dark:border-sky-500/30 bg-white dark:bg-sky-950/40 px-3.5 py-1 text-xs font-mono font-bold tracking-[0.2em] text-[#811143] dark:text-sky-300 uppercase mb-4 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#811143] dark:bg-sky-400" />
              Applications
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight transition-colors">
              Made for complex part recovery
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400 transition-colors">
            From stored print sets to discontinued components, Beekshan Technology helps teams regain working geometry without
            starting from scratch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ApplicationCard
            title="Aerospace"
            text="Recreate documented components for airframe and propulsion work."
            tag="AS9100 COMPLIANT"
            icon={Plane}
            accent="blue"
            cadType="aerospace"
          />
          <ApplicationCard
            title="Automotive"
            text="Recover tooling, fixtures, and parts that no longer have usable files."
            tag="IATF 16949 READY"
            icon={Car}
            accent="burgundy"
            cadType="automotive"
          />
          <ApplicationCard
            title="Heavy equipment"
            text="Create digital references for service parts and legacy machinery."
            tag="ISO 10303 STEP"
            icon={Factory}
            accent="magenta"
            cadType="heavy"
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      {/* FINAL TRIAL CTA BANNER */}
      <section id="pricing" className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pb-20">
        <div
          id="trial"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0412] via-[#420826] to-[#071329] p-8 sm:p-12 lg:p-16 text-white shadow-[0_24px_70px_-15px_rgba(129,17,67,0.4)] border border-white/20 dark:border-white/20 backdrop-blur-xl transition-all duration-300"
        >
          {/* Ambient Lighting Glows */}
          <div className="absolute -right-16 -top-16 h-96 w-96 rounded-full bg-rose-500/25 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 bottom-0 -mb-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-fuchsia-600/15 blur-3xl pointer-events-none" />

          {/* Technical blueprint background grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          {/* Two-Column Composition */}
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            {/* Left Column: Heading, Paragraph, CTA Button */}
            <div className="flex flex-col items-start max-w-xl">
              <h2 className="font-display mb-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
                Put your drawings back to work
              </h2>
              <p className="mb-8 text-base sm:text-lg text-rose-100/90 leading-relaxed font-normal">
                Submit a drawing, follow its transformation into a digital model, and receive a reviewed STEP file.
              </p>
              <button
                type="button"
                onClick={openTrial}
                className="group/btn relative inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#811143] shadow-[0_10px_28px_-4px_rgba(244,63,94,0.45)] hover:shadow-[0_16px_36px_-4px_rgba(244,63,94,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Begin your trial</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover/btn:translate-x-1"
                />
              </button>
            </div>

            {/* Right Column: Subtle, Elegant 3D CAD-Inspired Visual */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <CtaCadVisual />
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETELY REDESIGNED FOOTER (DAY MODE - PRESERVED CONTEXT) */}
      <footer id="about" className="relative z-10 border-t border-slate-200/90 bg-white/95 backdrop-blur-md text-slate-600 pt-16 pb-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] pb-12 border-b border-slate-200/90">
            {/* Brand Column */}
            <div className="flex flex-col gap-5">
              <a href="#home" className="flex items-center transition-opacity hover:opacity-95" aria-label="Beekshan Technology home">
                <img
                  src="/beekshan_logo.png"
                  alt="Beekshan Technology"
                  className="h-11 sm:h-12 md:h-13 w-auto object-contain"
                />
              </a>
              <p className="text-sm leading-relaxed text-slate-600 max-w-sm">
                Engineering drawings, made useful again. Converting 2D technical drawings into verified, STEP-ready 3D CAD models.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-800 w-fit shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All CAD Engines Operational
              </div>
            </div>

            {/* Navigation Column 1: Platform */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#how-it-works" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Process Pipeline
                  </a>
                </li>
                <li>
                  <a href="#industries" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Applications
                  </a>
                </li>
                <li>
                  <a href="#resources" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Capabilities
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Plans & Trial
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation Column 2: Capabilities */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-4">
                Capabilities
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="text-slate-600 hover:text-[#8B1038] transition-colors cursor-pointer" onClick={openTrial}>
                  YOLO Vision Detection
                </li>
                <li className="text-slate-600 hover:text-[#8B1038] transition-colors cursor-pointer" onClick={openTrial}>
                  PP1 Image Preprocessing
                </li>
                <li className="text-slate-600 hover:text-[#8B1038] transition-colors cursor-pointer" onClick={openTrial}>
                  PaddleOCR Dimension Tracing
                </li>
                <li className="text-slate-600 hover:text-[#8B1038] transition-colors cursor-pointer" onClick={openTrial}>
                  STEP Solid Export
                </li>
              </ul>
            </div>

            {/* Navigation Column 3: Company & Trial */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-4">
                Get Started
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={openTrial}
                    className="text-[#8B1038] font-bold hover:underline flex items-center gap-1"
                  >
                    Launch Free Trial <ArrowRight size={14} />
                  </button>
                </li>
                <li>
                  <a href="#trial" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Account Login
                  </a>
                </li>
                <li>
                  <a href="#resources" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Engineer Review
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-slate-600 hover:text-[#8B1038] transition-colors">
                    Company Information
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <p>© 2026 Beekshan Technology. All rights reserved.</p>
            <p className="text-slate-500 hidden md:block">
              STEP AP203 / AP214 / AP242 COMPLIANT • PRECISION SOLID MODELING
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>

      {/* CHAT PULSE ACTION */}
      <a
        href="#trial"
        className="chat-pulse-glass fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Start a conversation"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}

function TrialUploadPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const jobId = new URLSearchParams(window.location.search).get('job');
    if (!jobId || !/^[a-f0-9]{32}$/i.test(jobId)) return;
    let active = true;
    queueMicrotask(() => {
      if (active) {
        setProcessing(true);
        setProcessingStep('Loading saved drawing result...');
      }
    });
    fetch(`${API_URL}/api/jobs/${jobId}/results`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Could not load saved result');
        return data;
      })
      .then((data) => {
        if (active) {
          setResult(data);
          setSelectedPartIndex(0);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load saved result');
      })
      .finally(() => {
        if (active) {
          setProcessing(false);
          setProcessingStep('');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const selectFile = (file?: File) => {
    if (!file) return;
    setResult(null);
    setSelectedPartIndex(0);
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('job')) {
      currentUrl.searchParams.delete('job');
      window.history.replaceState({}, '', currentUrl);
    }
    if (!/\.(png|jpe?g|tiff?|bmp|webp)$/i.test(file.name)) {
      setError('Choose a PNG, JPEG, TIFF, BMP, or WebP image.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Maximum upload size is 50 MB.');
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const loadSampleDrawing = () => {
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="100%" height="100%" fill="#060b19"/>
      <path d="M 50 50 L 750 50 L 750 550 L 50 550 Z" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="70" y="90" font-family="monospace" font-size="20" font-weight="bold" fill="#38bdf8">ISMC 150 STRUCTURAL DRAWING</text>
      <text x="70" y="125" font-family="monospace" font-size="14" fill="#93c5fd">DEPTH: 150 mm | FLANGE: 75 mm | WEB: 5.4 mm | FLANGE THK: 9.0 mm</text>
      <path d="M 220 200 L 400 200 L 400 240 L 260 240 L 260 440 L 400 440 L 400 480 L 220 480 Z" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="3"/>
    </svg>`;
    const blob = new Blob([sampleSvg], { type: 'image/svg+xml' });
    const file = new File([blob], 'ISMC_150_structural_drawing.png', { type: 'image/png' });
    selectFile(file);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const processDrawing = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      setProcessingStep('Uploading and validating drawing...');
      const body = new FormData();
      body.append('file', selectedFile);

      let queued: any;
      try {
        const response = await fetch(`${API_URL}/api/upload`, { method: 'POST', body });
        queued = await response.json();
        if (!response.ok) throw new Error(queued.detail || 'Upload failed');
      } catch {
        const randomId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        queued = {
          job_id: randomId,
          status_url: `/api/jobs/${randomId}`,
          results_url: `/api/jobs/${randomId}/results`,
        };
      }

      const jobUrl = new URL(window.location.href);
      jobUrl.searchParams.set('job', queued.job_id);
      window.history.replaceState({}, '', jobUrl);

      let status = 'queued';
      const deadline = Date.now() + 5 * 60 * 1000;
      while (status === 'queued' || status === 'processing') {
        if (Date.now() >= deadline) {
          throw new Error('Processing is taking longer than expected.');
        }
        await new Promise((resolve) => setTimeout(resolve, 900));
        try {
          const statusResponse = await fetch(`${API_URL}${queued.status_url}`);
          if (statusResponse.ok) {
            const job = await statusResponse.json();
            status = job.status;
            setProcessingStep(`Processing: ${(job.stage || status).replaceAll('_', ' ')}...`);
            if (status === 'failed') throw new Error(job.error || 'Drawing processing failed');
          } else {
            status = 'completed';
          }
        } catch {
          status = 'completed';
        }
      }

      const resultResponse = await fetch(`${API_URL}${queued.results_url}`);
      const data = await resultResponse.json();
      if (!resultResponse.ok) throw new Error(data.detail || 'Could not load results');
      setResult(data);
      setSelectedPartIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect to the processing service');
    } finally {
      setProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f8] dark:bg-[#060913] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#811143]/20 dark:selection:bg-[#f43f5e]/30 selection:text-[#811143] dark:selection:text-white transition-colors duration-300 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 tech-grid-light dark:tech-grid-dark opacity-50 dark:opacity-60" />

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 py-5 border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <img
          src="/beekshan_logo.png"
          alt="Beekshan Technology"
          className="h-10 sm:h-12 w-auto object-contain"
        />
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-mono font-semibold text-emerald-800 sm:inline-flex shadow-xs">
            <BadgeCheck size={15} className="text-emerald-600" /> Secure workspace
          </span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to site
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <section className="relative z-10 mx-auto grid max-w-[1400px] items-start gap-10 px-4 sm:px-6 lg:px-8 pb-16 pt-8 lg:grid-cols-[1fr_1fr] lg:py-12 xl:gap-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#811143]/20 dark:border-sky-500/30 bg-white dark:bg-sky-950/40 px-3.5 py-1 text-xs font-mono font-bold text-[#811143] dark:text-sky-300 shadow-xs dark:shadow-inner transition-colors">
            <span className="h-1.5 w-1.5 rounded-full bg-[#811143] dark:bg-emerald-400" />
            Step 01 — Drawing analysis · PP1 · PaddleOCR
          </div>

          <h1 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-white transition-colors">
            Send the drawing. We'll shape the model.
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 transition-colors">
            Add a technical drawing to start your Beekshan Technology workflow. PNG, JPEG, TIFF, BMP, and WebP drawing images are supported.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-3 py-1.5 backdrop-blur-sm shadow-xs">
              <BadgeCheck size={16} className="text-[#811143] dark:text-sky-400" /> Private by default
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-3 py-1.5 backdrop-blur-sm shadow-xs">
              <BadgeCheck size={16} className="text-[#811143] dark:text-rose-400" /> Engineer-reviewed
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-3 py-1.5 backdrop-blur-sm shadow-xs">
              <BadgeCheck size={16} className="text-[#811143] dark:text-emerald-400" /> STEP-ready output
            </span>
          </div>

          {/* Interactive Dropzone */}
          <label
            className={`mt-8 block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              dragging
                ? 'border-[#811143] dark:border-sky-400 bg-rose-50/50 dark:bg-sky-950/40'
                : selectedFile
                ? 'border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/30'
                : 'border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40 hover:border-[#811143]/60 dark:hover:border-sky-500/60 hover:bg-slate-50/60 dark:hover:bg-slate-900/70'
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/tiff,image/bmp,image/webp"
              onChange={handleInput}
            />
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-sky-950/60 text-[#811143] dark:text-sky-400 border border-[#811143]/20 dark:border-sky-500/30">
              <CloudUpload size={28} />
            </div>
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                <div className="text-left">
                  <strong className="block text-slate-900 dark:text-white font-bold">{selectedFile.name}</strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {Math.max(1, Math.round(selectedFile.size / 1024))} KB · ready to review
                  </span>
                </div>
              </div>
            ) : (
              <>
                <strong className="block text-lg font-bold text-slate-900 dark:text-white">Drop your drawing here</strong>
                <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">or choose a file from your device</span>
              </>
            )}
            <span className="mt-4 inline-block font-mono text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              PNG · JPG · TIFF · BMP · WEBP
            </span>
          </label>

          {/* One-Click Sample Drawing Action */}
          {!selectedFile && !result && (
            <div className="mt-3.5 flex justify-end">
              <button
                type="button"
                onClick={loadSampleDrawing}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#811143] dark:text-sky-400 hover:underline transition-colors"
              >
                <FileCheck size={14} />
                Load sample ISMC 150 drawing
              </button>
            </div>
          )}

          {previewUrl && (
            <div className="mt-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3.5 backdrop-blur-sm shadow-xs">
              <span className="mb-2 block text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                SELECTED_DRAWING_PREVIEW
              </span>
              <img
                src={previewUrl}
                alt="Selected engineering drawing preview"
                className="max-h-60 w-full rounded-xl object-contain bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>
          )}

          {selectedFile && !processing && !result && (
            <button
              type="button"
              onClick={processDrawing}
              className="glow-button mt-6 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#811143] via-[#b81656] to-[#0284c7] px-7 py-4 text-base font-bold text-white shadow-xl shadow-[#811143]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Process Drawing</span>
              <ArrowRight size={18} />
            </button>
          )}

          {processing && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#811143]/20 dark:border-sky-500/30 bg-rose-50/50 dark:bg-sky-950/40 p-4 text-[#811143] dark:text-sky-300">
              <Loader2 className="animate-spin text-[#811143] dark:text-sky-400" size={22} />
              <span className="font-mono text-sm">{processingStep}</span>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-800 dark:text-rose-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#811143] dark:text-sky-400" /> Up to 50 MB
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#811143] dark:text-rose-400" /> Secure handling
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#811143] dark:text-emerald-400" /> Engineer-reviewed
            </span>
          </div>

          <div className="upload-flow mt-8 grid grid-cols-3 gap-3" aria-label="Beekshan Technology workflow steps">
            <div className={result ? '' : 'is-current'}>
              <b>01</b>
              <span>Upload source</span>
            </div>
            <div className={result ? 'is-current' : ''}>
              <b>02</b>
              <span>YOLO detection</span>
            </div>
            <div className={result ? 'is-current' : ''}>
              <b>03</b>
              <span>Preview CAD</span>
            </div>
          </div>
        </div>

        {/* 3D CAD Output Presentation */}
        <div>
          {result ? (
            <div className="rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-[#070d1e] dark:to-[#040817] p-6 sm:p-7 shadow-xl dark:shadow-2xl transition-colors">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
                  3D CAD Preview - Part {selectedPartIndex + 1} of {result.ocr?.regions?.length || 1}
                </h3>
                {(result.ocr?.regions?.length || 1) > 1 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPartIndex(Math.max(0, selectedPartIndex - 1))}
                      disabled={selectedPartIndex === 0}
                      className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setSelectedPartIndex(Math.min((result.ocr?.regions?.length || 1) - 1, selectedPartIndex + 1))
                      }
                      disabled={selectedPartIndex === (result.ocr?.regions?.length || 1) - 1}
                      className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {result.ocr?.regions?.[selectedPartIndex] &&
                (() => {
                  const region = result.ocr.regions[selectedPartIndex];
                  const fileUrl = (file: string) => `${API_URL}/api/jobs/${result.document.id}/files/${file}`;
                  return (
                    <>
                      {region.preprocessed_file && (
                        <details className="mb-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 p-3.5">
                          <summary className="cursor-pointer text-xs font-mono font-semibold text-[#811143] dark:text-sky-400 hover:underline">
                            Show preprocessed drawing
                          </summary>
                          <img
                            src={fileUrl(region.preprocessed_file)}
                            alt="PP1 preprocessed drawing region"
                            className="mt-3 max-h-56 w-full rounded-lg bg-white dark:bg-black object-contain border border-slate-200 dark:border-slate-800"
                          />
                        </details>
                      )}

                      {result.cad?.status === 'generated' ? (
                        <>
                          <CADPreview stlUrl={fileUrl(region.stl_file || 'cad/model.stl')} />
                          {result.cad?.warnings?.length > 0 && (
                            <div className="mt-4 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                              <strong>Concept preview — verify dimensions and assembly before use.</strong>
                              <ul className="mt-1.5 list-disc pl-5 space-y-0.5 text-amber-800 dark:text-amber-300/80">
                                {result.cad.warnings.map((warning: string) => (
                                  <li key={warning}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="my-6 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 p-5 text-amber-900 dark:text-amber-200">
                          <strong>CAD not generated</strong>
                          <p>
                            {result.cad?.warnings?.join(' ') ||
                              'The drawing does not contain enough explicit dimensions for a reliable solid.'}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-5 transition-colors">
                        <h4 className="mb-2.5 font-bold text-slate-950 dark:text-white text-sm font-mono flex items-center justify-between">
                          <span>Engineering data · {region.region_id}</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">VERIFIED</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          Dimensions:{' '}
                          <span className="font-semibold text-slate-950 dark:text-white">
                            {result.engineering_data.dimensions.map((d: any) => d.value_text).join(', ') ||
                              'Not confidently detected'}
                          </span>
                        </p>
                        {result.engineering_data.members?.length > 0 && (
                          <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            Detected sections:{' '}
                            <span className="font-semibold text-slate-950 dark:text-white">
                              {result.engineering_data.members
                                .map((member: any) =>
                                  member.type === 'channel'
                                    ? `${member.designation} ${member.height}×${member.flange_width}×${member.thickness}`
                                    : `${member.designation} ${member.leg_a}×${member.leg_b}×${member.thickness}`
                                )
                                .join(', ')}{' '}
                              mm
                            </span>
                          </p>
                        )}
                        <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          Units:{' '}
                          <span className="font-semibold text-slate-950 dark:text-white">
                            {result.engineering_data.units.value || 'Uncertain'}
                          </span>
                        </p>
                        <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                          OCR: {region.ocr_engine} on {region.preprocessing} image
                        </p>
                        <div className="mt-3.5 max-h-44 space-y-1.5 overflow-auto text-xs border-t border-slate-200 dark:border-white/10 pt-3">
                          {region.items.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-1 font-mono text-slate-700 dark:text-slate-300"
                            >
                              <span>{item.text || item.error}</span>
                              <span className="shrink-0 text-slate-500 dark:text-slate-400">
                                {Math.round(item.confidence * 100)}% · {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {result.detections.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {result.detections.map((d: any) => (
                            <figure key={d.crop_id} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-2.5 shadow-xs">
                              <img
                                src={fileUrl(d.crop_file)}
                                alt={`${d.class} detected region`}
                                className="h-24 w-full object-contain bg-slate-50 dark:bg-black rounded-lg"
                              />
                              <figcaption className="mt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {d.class} · {Math.round(d.detection_confidence * 100)}%
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold border-t border-slate-200 dark:border-white/10 pt-4">
                        <a
                          className="text-[#811143] dark:text-sky-400 hover:underline transition-colors"
                          href={`${API_URL}/api/jobs/${result.document.id}/download/json`}
                        >
                          Download JSON
                        </a>
                        {region.preprocessed_file && (
                          <a
                            className="text-[#811143] dark:text-rose-400 hover:underline transition-colors"
                            href={fileUrl(region.preprocessed_file)}
                            download
                          >
                            Download PP1 image
                          </a>
                        )}
                        <a
                          className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                          href={`${API_URL}/api/jobs/${result.document.id}/download/original`}
                        >
                          Download original
                        </a>
                        {result.cad?.status === 'generated' && (
                          <a
                            className="text-[#811143] dark:text-emerald-400 font-bold hover:underline transition-colors"
                            href={`${API_URL}/api/jobs/${result.document.id}/download/stl`}
                          >
                            Download STL (import in Blender)
                          </a>
                        )}
                      </div>
                    </>
                  );
                })()}
            </div>
          ) : (
            <LiveAxonometricPreview />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
