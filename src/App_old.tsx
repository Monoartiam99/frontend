import { useState, type ChangeEvent, type DragEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Box,
  CheckCircle2,
  CloudUpload,
  Cpu,
  Factory,
  FileText,
  Layers3,
  Menu,
  MessageCircle,
  PenTool,
  ScanLine,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import HeroBuildingAnimation from './HeroBuildingAnimation';

function CadModelSvg({ dark = false }: { dark?: boolean }) {
  const stroke = dark ? '#f3a1c4' : '#dc6d9e';
  return (
    <svg viewBox="0 0 420 340" className="cad-assembly h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="cad-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3f8" stopOpacity="1" />
          <stop offset="22%" stopColor="#f3a1c4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d86a9d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cad-top-face" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#f6b2cf" stopOpacity="0.34" />
          <stop offset="1" stopColor="#8e174e" stopOpacity="0.52" />
        </linearGradient>
        <linearGradient id="cad-side-face" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#8e174e" stopOpacity="0.62" />
          <stop offset="1" stopColor="#4b0b2e" stopOpacity="0.54" />
        </linearGradient>
        <filter id="cad-neon" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g className="cad-radar">
        <ellipse cx="210" cy="184" rx="142" ry="65" fill="none" stroke={stroke} strokeOpacity="0.14" strokeWidth="1" />
        <ellipse cx="210" cy="184" rx="108" ry="49" fill="none" stroke={stroke} strokeOpacity="0.16" strokeWidth="1" />
        <path className="cad-radar-sweep" d="M210 184 L347 149 A142 65 0 0 1 349 186 Z" fill="#f3a1c4" />
      </g>

      <circle className="cad-core-halo" cx="210" cy="170" r="90" fill="url(#cad-core-glow)" />
      <g className="cad-top-face">
        <polygon points="210,70 310,120 210,170 110,120" fill="url(#cad-top-face)" stroke={stroke} strokeWidth="1.9" />
        <path className="cad-top-trace" d="M130 120 L210 80 L290 120 L210 160 Z" fill="none" stroke="#fff3f8" strokeOpacity="0.75" />
      </g>
      <g className="cad-left-face">
        <polygon points="110,120 210,170 210,250 110,200" fill="url(#cad-side-face)" stroke={stroke} strokeWidth="1.9" />
      </g>
      <g className="cad-right-face">
        <polygon points="210,170 310,120 310,200 210,250" fill="rgba(216, 106, 157, 0.48)" stroke={stroke} strokeWidth="1.9" />
      </g>

      <g className="cad-core" filter="url(#cad-neon)">
        <ellipse cx="210" cy="145" rx="28" ry="14" fill="rgba(255, 243, 248, 0.1)" stroke="#fff3f8" strokeWidth="1.7" />
        <path d="M182 145 V205" stroke="#f3a1c4" strokeWidth="1.7" />
        <path d="M238 145 V205" stroke="#f3a1c4" strokeWidth="1.7" />
        <ellipse cx="210" cy="205" rx="28" ry="14" fill="rgba(216, 106, 157, 0.16)" stroke="#fff3f8" strokeWidth="1.7" />
        <ellipse className="cad-core-scan" cx="210" cy="175" rx="27" ry="9" fill="none" stroke="#fff3f8" strokeWidth="1.4" />
      </g>

      <g className="cad-orbit" filter="url(#cad-neon)">
        <ellipse cx="210" cy="170" rx="118" ry="54" fill="none" stroke={stroke} strokeDasharray="3 9" strokeOpacity="0.72" />
        <circle cx="328" cy="170" r="4.5" fill="#fff3f8" />
        <circle cx="93" cy="170" r="3.5" fill="#f3a1c4" />
      </g>

      <g className="cad-data-points" fill="#f3a1c4">
        <circle cx="122" cy="91" r="2" /><circle cx="310" cy="91" r="2" />
        <circle cx="92" cy="224" r="2" /><circle cx="328" cy="224" r="2" />
      </g>
      <path className="cad-measure-line cad-measure-line-a" d="M110 265 H310" stroke={stroke} />
      <path className="cad-measure-line cad-measure-line-b" d="M95 112 L210 52 L325 112" stroke={stroke} />
    </svg>
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
  const [trialOpen, setTrialOpen] = useState(false);
  const openTrial = () => {
    setMenuOpen(false);
    setTrialOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (trialOpen) return <TrialUploadPage onBack={() => setTrialOpen(false)} />;

  return (
    <div className="page-shell min-h-screen overflow-x-hidden text-slate-950">
      <div className="mesh-grid" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <nav className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6">
          <a href="#home" className="brand-mark flex items-center" aria-label="Beekshan Technology home">
            <img src="/beekshan_logo.png" alt="Beekshan Technology" className="h-10 w-auto object-contain sm:h-11" />
          </a>

          <div className="hidden items-center gap-5 font-semibold text-[14px] text-slate-600 xl:flex">
            <a href="#home" className="nav-link is-active text-slate-950">
              Home
            </a>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <button
              type="button"
              onClick={openTrial}
              className="btn-glow rounded-xl bg-[#811143] text-white px-5 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-[#811143]/30 transition hover:scale-[1.03] hover:bg-[#5e0c32]"
            >
              Begin a trial
            </button>
            <a href="#trial" className="text-[14px] font-semibold text-slate-600 hover:text-[#811143]">
              Login
            </a>
          </div>

          <button
            className="rounded-lg p-2 text-slate-600 xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 xl:hidden">
            <div className="flex flex-col gap-3 font-semibold text-slate-600">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                className="mt-2 rounded-xl bg-[#811143] text-white px-4 py-3 text-center text-white"
                onClick={openTrial}
              >
                Begin a trial
              </button>
            </div>
          </div>
        )}
      </nav>

      <section
        id="home"
        className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-8 px-6 pt-12 pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:pt-16 lg:pb-24"
      >
        <div className="z-20 flex max-w-[590px] flex-col gap-6">
          <div className="reveal delay-1 inline-flex w-fit items-center gap-2 rounded-full border border-[#811143]/20 bg-white/70 px-3 py-1 text-sm font-semibold text-[#811143] shadow-sm">
            <Sparkles size={16} />
            AI-assisted, engineer-reviewed CAD
          </div>
          <h1 className="font-display reveal delay-2 max-w-[12ch] text-[2.7rem] leading-[1.08] font-extrabold tracking-tight text-slate-950 md:text-[3.4rem]">
            Turn technical drawings into ready-to-use 3D CAD
          </h1>
          <p className="reveal delay-3 text-[1.12rem] leading-7 text-slate-600">
            Beekshan Technology transforms <strong className="text-slate-600">engineering drawings into practical 3D models</strong>{' '}
            with AI-assisted interpretation and careful engineer review. Receive a STEP-ready result built for the
            work that follows.
          </p>
          <p className="reveal delay-4 text-lg font-bold text-slate-600">Clear inputs. Confident manufacturing decisions.</p>
          <div className="reveal delay-5 flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={openTrial}
              className="btn-glow inline-flex items-center gap-2 rounded-2xl bg-[#811143] text-white px-7 py-4 text-lg font-bold text-white shadow-xl shadow-[#811143]/30 transition hover:scale-[1.04] hover:bg-[#5e0c32]"
            >
              Begin your trial
              <ArrowRight size={20} />
            </button>
            <a href="#how-it-works" className="font-semibold text-slate-600 hover:text-[#811143]">
              Explore the process
            </a>
          </div>
        </div>

        <HeroBuildingAnimation />

      </section>

      <section id="how-it-works" className="relative z-10 mx-auto max-w-[1400px] px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold tracking-[0.2em] text-[#811143] uppercase">The process</p>
          <h2 className="font-display text-4xl font-extrabold text-slate-950 md:text-5xl">
            A direct path from drawing to digital model
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: PenTool,
              title: 'Send your source drawing',
              text: 'Share a PDF, scan, or DXF. Beekshan Technology identifies the essential geometry, dimensions, and notes.',
            },
            {
              icon: Cpu,
              title: 'Build the 3D model',
              text: 'The drawing is interpreted as a usable solid model with manufacturing-aware details and STEP output.',
            },
            {
              icon: ShieldCheck,
              title: 'Review with confidence',
              text: 'Engineering review checks the completed model before it is delivered for your downstream workflow.',
            },
          ].map((step, index) => (
            <article
              key={step.title}
              className="hover-lift relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="feature-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-[#811143] text-white">
                  <step.icon size={22} />
                </div>
                <span className="font-display text-3xl font-extrabold text-slate-200">0{index + 1}</span>
              </div>
              <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
              <p className="leading-7 text-slate-600">{step.text}</p>
              {index < 2 && <div className="step-line mt-8 hidden h-1 rounded-full lg:block" />}
            </article>
          ))}
        </div>
      </section>

      <section id="resources" className="relative z-10 bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-rose-300 uppercase">The Beekshan Technology advantage</p>
            <h2 className="font-display mb-6 text-4xl font-extrabold md:text-5xl">
              Bring archived engineering back into circulation
            </h2>
            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-300">
              Move beyond static paperwork. Beekshan Technology converts documented part intent into a dependable digital model
              for machining, analysis, and production planning.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ScanLine, title: 'Drawing awareness', text: 'Understands projections, sections, and annotations.' },
                { icon: Box, title: 'Usable solid output', text: 'A STEP model made for engineering work, not an approximate mesh.' },
                { icon: Layers3, title: 'Manufacturing features', text: 'Captures key openings, radii, pockets, and repeated details.' },
                { icon: BadgeCheck, title: 'Engineering review', text: 'A specialist checks the model before release.' },
              ].map((item) => (
                <div key={item.title} className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-5">
                  <item.icon className="mb-3 text-rose-300" size={22} />
                  <h3 className="mb-1 font-bold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-400/20 blur-3xl" />
            <CadModelSvg dark />
            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <span>Model review complete</span>
              <span className="font-semibold text-rose-300">Ready for engineering use</span>
            </div>
          </div>
        </div>
      </section>

      <section id="industries" className="relative z-10 mx-auto max-w-[1400px] px-6 py-24">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-[#811143] uppercase">Applications</p>
            <h2 className="font-display text-4xl font-extrabold text-slate-950">Made for complex part recovery</h2>
          </div>
          <p className="max-w-md text-slate-600">
            From stored print sets to discontinued components, Beekshan Technology helps teams regain working geometry without
            starting from scratch.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: 'Aerospace', text: 'Recreate documented components for airframe and propulsion work.' },
            { title: 'Automotive', text: 'Recover tooling, fixtures, and parts that no longer have usable files.' },
            { title: 'Heavy equipment', text: 'Create digital references for service parts and legacy machinery.' },
          ].map((item) => (
            <article
              key={item.title}
              className="hover-lift group rounded-3xl border border-slate-200 bg-white p-8"
            >
              <Factory className="mb-5 text-[#811143] transition group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-[1400px] px-6 pb-8">
        <div
          id="trial"
          className="overflow-hidden rounded-[36px] bg-gradient-to-r from-[#420928] via-[#811143] to-[#d66b9b] p-10 text-white shadow-2xl shadow-[#811143]/30 md:p-16"
        >
          <div className="max-w-2xl">
            <h2 className="font-display mb-4 text-4xl font-extrabold md:text-5xl">Put your drawings back to work</h2>
            <p className="mb-8 text-lg text-white/85">
              Submit a drawing, follow its transformation into a digital model, and receive a reviewed STEP file.
            </p>
            <button
              type="button"
              onClick={openTrial}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-lg font-bold text-[#811143] transition hover:scale-[1.03]"
            >
              Begin your trial
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <footer id="about" className="relative z-10 mx-auto max-w-[1400px] px-6 py-16">
        <div className="flex flex-col gap-6 border-t border-slate-200 pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <img src="/beekshan_logo.png" alt="Beekshan Technology" className="h-9 w-auto object-contain" />
            <p className="mt-2 text-sm text-slate-400">Engineering drawings, made useful again.</p>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Beekshan Technology. All rights reserved.</p>
        </div>
      </footer>

      <a
        href="#trial"
        className="chat-pulse fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#811143] text-white shadow-lg shadow-[#811143]/40 transition hover:scale-110"
        aria-label="Start a conversation"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}

function TrialUploadPage({ onBack }: { onBack: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectFile = (file?: File) => {
    if (file) setSelectedFile(file);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <main className="upload-page min-h-screen overflow-hidden text-slate-950">
      <div className="mesh-grid" />
      <div className="upload-page__orb upload-page__orb--one" />
      <div className="upload-page__orb upload-page__orb--two" />

      <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        <img src="/beekshan_logo.png" alt="Beekshan Technology" className="h-10 w-auto object-contain sm:h-11" />
        <div className="flex items-center gap-3">
          <span className="upload-security hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-bold sm:inline-flex"><BadgeCheck size={15} /> Secure workspace</span>
          <button type="button" onClick={onBack} className="upload-back inline-flex items-center gap-2 text-sm font-bold text-slate-600">
            <ArrowLeft size={18} />
            Back to site
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1160px] items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <div>
          <div className="upload-kicker inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold">
            <span /> Step 01 — source drawing
          </div>
          <h1 className="font-display mt-6 max-w-[12ch] text-4xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">
            Send the drawing. We’ll shape the model.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Add a technical drawing to start your Beekshan Technology workflow. PDFs, image scans, and DXF files are supported.
          </p>
          <div className="upload-assurance mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <span><BadgeCheck size={16} /> Private by default</span>
            <span><BadgeCheck size={16} /> Engineer-reviewed</span>
            <span><BadgeCheck size={16} /> STEP-ready output</span>
          </div>

          <label
            className={`upload-dropzone mt-8 block ${dragging ? 'is-dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input className="sr-only" type="file" accept=".pdf,.dxf,.dwg,.png,.jpg,.jpeg,.tif,.tiff" onChange={handleInput} />
            <span className="upload-dropzone__corner upload-dropzone__corner--tl" />
            <span className="upload-dropzone__corner upload-dropzone__corner--br" />
            <div className="upload-dropzone__icon"><CloudUpload size={28} /></div>
            {selectedFile ? (
              <div className="upload-dropzone__file">
                <CheckCircle2 size={22} />
                <div>
                  <strong>{selectedFile.name}</strong>
                  <span>{Math.max(1, Math.round(selectedFile.size / 1024))} KB · ready to review</span>
                </div>
              </div>
            ) : (
              <>
                <strong>Drop your drawing here</strong>
                <span>or choose a file from your device</span>
              </>
            )}
            <span className="upload-dropzone__formats">PDF · DXF · DWG · PNG · JPG · TIFF</span>
          </label>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#811143]" /> Up to 50 MB</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#811143]" /> Secure handling</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#811143]" /> Engineer-reviewed</span>
          </div>

          <div className="upload-flow mt-8 grid grid-cols-3 gap-3" aria-label="Beekshan Technology workflow steps">
            <div className="is-current"><b>01</b><span>Upload source</span></div>
            <div><b>02</b><span>Check geometry</span></div>
            <div><b>03</b><span>Preview CAD</span></div>
          </div>
        </div>

          <div className="upload-visual" aria-hidden="true">
          <div className="upload-visual__grid" />
          <div className="upload-visual__topline"><span>AXONOMETRIC VIEW</span><b><i /> LIVE</b></div>
          <div className="upload-visual__ring upload-visual__ring--one" />
          <div className="upload-visual__ring upload-visual__ring--two" />
          <div className="upload-visual__document">
            <div className="upload-visual__document-head"><FileText size={21} /><span>3D_CAD_PREVIEW</span><i /></div>
            <svg viewBox="0 0 360 240" className="upload-visual__blueprint">
              <g className="upload-visual__cad-solid">
                <polygon points="180,40 282,92 180,144 78,92" />
                <polygon points="78,92 180,144 180,207 78,155" />
                <polygon points="180,144 282,92 282,155 180,207" />
              </g>
              <g className="upload-visual__cad-core">
                <ellipse cx="180" cy="113" rx="29" ry="14" />
                <path d="M151 113 V168 M209 113 V168 M151 168 A29 14 0 0 0 209 168" />
                <ellipse cx="180" cy="168" rx="29" ry="14" />
              </g>
              <path className="upload-visual__path" d="M54 185 H306 M65 70 L180 16 L295 70" />
            </svg>
            <div className="upload-visual__scan" />
          </div>
          <div className="upload-visual__status"><span /> LIVE 3D CAD PREVIEW</div>
          <div className="upload-visual__specs"><span>STEP</span><i /><span>EDGE VIEW</span><i /><span>1:1 SCALE</span></div>
          <span className="upload-visual__particle upload-visual__particle--one" />
          <span className="upload-visual__particle upload-visual__particle--two" />
          <span className="upload-visual__particle upload-visual__particle--three" />
        </div>
      </section>
    </main>
  );
}



export default App;
