import { useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';

/**
 * LiveAxonometricPreview
 * 
 * High-performance, 60 FPS Canvas-driven 3D axonometric engineering visualization.
 * Renders a precision-machined CAD component with true 3D turntable rotation,
 * dynamic face shading, edge luminescence, a technical scanning laser beam,
 * concentric rotating ground rings, and pulsing coordinate datum nodes.
 *
 * Fully respects `prefers-reduced-motion` and pauses off-screen via IntersectionObserver.
 */
export default function LiveAxonometricPreview() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle high-DPI retina displays
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Pause animation when panel is scrolled offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 3D Geometry Definition for the Machined Engineering Block
    // Base block dimensions
    const BX = 52;
    const BY = 26;
    const BZ = 52;

    const baseVertices = [
      [-BX, -BY, -BZ], // 0: Bottom back left
      [BX, -BY, -BZ],  // 1: Bottom back right
      [BX, -BY, BZ],   // 2: Bottom front right
      [-BX, -BY, BZ],  // 3: Bottom front left
      [-BX, BY, -BZ],  // 4: Top back left
      [BX, BY, -BZ],   // 5: Top back right
      [BX, BY, BZ],    // 6: Top front right
      [-BX, BY, BZ],   // 7: Top front left
    ];

    // Stepped top collar / pocket
    const CX = 36;
    const CY = 36;
    const CZ = 36;
    const collarVertices = [
      [-CX, BY, -CZ], // 8
      [CX, BY, -CZ],  // 9
      [CX, BY, CZ],   // 10
      [-CX, BY, CZ],  // 11
      [-CX, CY, -CZ], // 12
      [CX, CY, -CZ],  // 13
      [CX, CY, CZ],   // 14
      [-CX, CY, CZ],  // 15
    ];

    // Central cylindrical through-bore (24 vertices top rim, 24 vertices bottom rim)
    const BORE_R = 20;
    const BORE_SEGS = 24;
    const boreTop: [number, number, number][] = [];
    const boreBottom: [number, number, number][] = [];

    for (let i = 0; i < BORE_SEGS; i++) {
      const angle = (i / BORE_SEGS) * Math.PI * 2;
      boreTop.push([Math.cos(angle) * BORE_R, CY, Math.sin(angle) * BORE_R]);
      boreBottom.push([Math.cos(angle) * BORE_R, -BY, Math.sin(angle) * BORE_R]);
    }

    // Faces with normals for lighting & backface culling
    interface Face {
      indices: number[];
      normal: [number, number, number];
      type: 'base_top' | 'base_bottom' | 'collar_top' | 'side' | 'collar_side';
    }

    const faces: Face[] = [
      { indices: [4, 5, 6, 7], normal: [0, 1, 0], type: 'base_top' },
      { indices: [3, 2, 1, 0], normal: [0, -1, 0], type: 'base_bottom' },
      { indices: [7, 6, 2, 3], normal: [0, 0, 1], type: 'side' },
      { indices: [5, 4, 0, 1], normal: [0, 0, -1], type: 'side' },
      { indices: [6, 5, 1, 2], normal: [1, 0, 0], type: 'side' },
      { indices: [4, 7, 3, 0], normal: [-1, 0, 0], type: 'side' },
      // Collar faces
      { indices: [12, 13, 14, 15], normal: [0, 1, 0], type: 'collar_top' },
      { indices: [15, 14, 10, 11], normal: [0, 0, 1], type: 'collar_side' },
      { indices: [13, 12, 8, 9], normal: [0, 0, -1], type: 'collar_side' },
      { indices: [14, 13, 9, 10], normal: [1, 0, 0], type: 'collar_side' },
      { indices: [12, 15, 11, 8], normal: [-1, 0, 0], type: 'collar_side' },
    ];

    // Wireframe edges to render with pink glow
    const edges: [number, number][] = [
      // Base bottom ring
      [0, 1], [1, 2], [2, 3], [3, 0],
      // Base top ring
      [4, 5], [5, 6], [6, 7], [7, 4],
      // Base verticals
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Collar top ring
      [12, 13], [13, 14], [14, 15], [15, 12],
      // Collar verticals
      [8, 12], [9, 13], [10, 14], [11, 15],
      // Collar base connection
      [8, 9], [9, 10], [10, 11], [11, 8],
    ];

    const allVertices = [...baseVertices, ...collarVertices];

    // Directional light vector (top-front-right)
    const L = [0.4, 0.75, 0.52];
    const L_len = Math.hypot(L[0], L[1], L[2]);
    const L_norm = [L[0] / L_len, L[1] / L_len, L[2] / L_len];

    let startTime = performance.now();

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const elapsed = (now - startTime) / 1000;

      // Rotation angles
      // If prefersReducedMotion, use static angle
      const yaw = prefersReducedMotion ? 0.785 : elapsed * 0.45; // ~14s full 360 turn
      const pitch = prefersReducedMotion ? 0.58 : 0.55 + Math.sin(elapsed * 0.6) * 0.04; // subtle 3D breathing
      const roll = -0.32; // -18 deg classic axonometric slant

      // Rotation matrix precomputation
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);

      const transformPoint = (p: [number, number, number]): [number, number, number] => {
        // Yaw (around Y)
        const x1 = p[0] * cosY + p[2] * sinY;
        const y1 = p[1];
        const z1 = -p[0] * sinY + p[2] * cosY;

        // Pitch (around X)
        const x2 = x1;
        const y2 = y1 * cosP - z1 * sinP;
        const z2 = y1 * sinP + z1 * cosP;

        // Roll (around Z)
        const x3 = x2 * cosR - y2 * sinR;
        const y3 = x2 * sinR + y2 * cosR;
        const z3 = z2;

        return [x3, y3, z3];
      };

      const w = canvas.width;
      const h = canvas.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 4 * dpr;
      const scale = Math.min(w, h) / 280;

      // 1. Technical Ground Radar Concentric Rings & Axes
      const groundY = -48;
      const ring1Radius = 118;
      const ring2Radius = 88;
      const ring1Angle = elapsed * 0.12; // slow clockwise
      const ring2Angle = -elapsed * 0.18; // counter-clockwise

      // Draw concentric elliptical ground plane
      ctx.save();
      // Outer calibration ring with tick marks
      ctx.strokeStyle = 'rgba(243, 161, 196, 0.22)';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      const ring1Steps = 48;
      for (let i = 0; i <= ring1Steps; i++) {
        const a = (i / ring1Steps) * Math.PI * 2;
        const [rx, ry] = transformPoint([Math.cos(a) * ring1Radius, groundY, Math.sin(a) * ring1Radius]);
        const px = cx + rx * scale;
        const py = cy - ry * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Outer ring rotating degree tick marks
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2 + ring1Angle;
        const isMajor = i % 6 === 0;
        const len = isMajor ? 7 : 4;
        const p1 = transformPoint([Math.cos(a) * ring1Radius, groundY, Math.sin(a) * ring1Radius]);
        const p2 = transformPoint([Math.cos(a) * (ring1Radius + len), groundY, Math.sin(a) * (ring1Radius + len)]);
        ctx.beginPath();
        ctx.moveTo(cx + p1[0] * scale, cy - p1[1] * scale);
        ctx.lineTo(cx + p2[0] * scale, cy - p2[1] * scale);
        ctx.strokeStyle = isMajor ? 'rgba(255, 230, 242, 0.45)' : 'rgba(243, 161, 196, 0.2)';
        ctx.lineWidth = (isMajor ? 1.5 : 1) * dpr;
        ctx.stroke();
      }

      // Inner dashed ground circle
      ctx.beginPath();
      const ring2Steps = 36;
      for (let i = 0; i <= ring2Steps; i++) {
        const a = (i / ring2Steps) * Math.PI * 2 + ring2Angle;
        const [rx, ry] = transformPoint([Math.cos(a) * ring2Radius, groundY, Math.sin(a) * ring2Radius]);
        const px = cx + rx * scale;
        const py = cy - ry * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.setLineDash([5 * dpr, 5 * dpr]);
      ctx.strokeStyle = 'rgba(243, 161, 196, 0.28)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Ground Datum Axis Crosshairs
      const axisLen = 130;
      const xEnd = transformPoint([axisLen, groundY, 0]);
      const xStart = transformPoint([-axisLen, groundY, 0]);
      const zEnd = transformPoint([0, groundY, axisLen]);
      const zStart = transformPoint([0, groundY, -axisLen]);

      ctx.beginPath();
      ctx.moveTo(cx + xStart[0] * scale, cy - xStart[1] * scale);
      ctx.lineTo(cx + xEnd[0] * scale, cy - xEnd[1] * scale);
      ctx.moveTo(cx + zStart[0] * scale, cy - zStart[1] * scale);
      ctx.lineTo(cx + zEnd[0] * scale, cy - zEnd[1] * scale);
      ctx.strokeStyle = 'rgba(243, 161, 196, 0.12)';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Transform all solid vertices to screen space
      const projectedVertices = allVertices.map((v) => {
        const [tx, ty, tz] = transformPoint(v as [number, number, number]);
        return {
          sx: cx + tx * scale,
          sy: cy - ty * scale,
          rawY: ty, // Y coordinate in camera frame for scan calculation
          rawZ: tz, // depth
        };
      });

      // Transform bore vertices
      const projBoreTop = boreTop.map((v) => {
        const [tx, ty, tz] = transformPoint(v);
        return { sx: cx + tx * scale, sy: cy - ty * scale, rawY: ty, rawZ: tz };
      });
      const projBoreBottom = boreBottom.map((v) => {
        const [tx, ty, tz] = transformPoint(v);
        return { sx: cx + tx * scale, sy: cy - ty * scale, rawY: ty, rawZ: tz };
      });

      // Calculate Scanning Plane position
      // Vertical scan travels from top (+45) to bottom (-45) in ~3.8s
      const scanPeriod = 3.8;
      const scanPhase = (elapsed % scanPeriod) / scanPeriod; // 0 to 1
      // Smooth sinusoidal bounce
      const scanRawY = Math.cos(scanPhase * Math.PI * 2) * 42;
      const scanScreenY = cy - scanRawY * scale;

      // 2. Render 3D Solid Faces (Depth Sorted Painter's Algorithm)
      const sortedFaces = faces
        .map((face) => {
          const transNorm = transformPoint(face.normal);
          // Center of face for depth sorting
          let avgZ = 0;
          face.indices.forEach((idx) => {
            avgZ += projectedVertices[idx].rawZ;
          });
          avgZ /= face.indices.length;

          // Camera looks down +Z toward -Z
          const isVisibleFace = transNorm[2] > 0;
          // Diffuse illumination
          const diff = Math.max(0.2, transNorm[0] * L_norm[0] + transNorm[1] * L_norm[1] + transNorm[2] * L_norm[2]);

          return { face, transNorm, avgZ, isVisibleFace, diff };
        })
        .filter((f) => f.isVisibleFace)
        .sort((a, b) => a.avgZ - b.avgZ); // back to front

      ctx.save();
      sortedFaces.forEach(({ face, diff }) => {
        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projectedVertices[idx];
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        });
        ctx.closePath();

        // Shading styles
        if (face.type === 'collar_top' || face.type === 'base_top') {
          // Top illuminated face
          ctx.fillStyle = `rgba(244, 114, 182, ${0.18 + diff * 0.16})`;
        } else if (face.type === 'collar_side') {
          ctx.fillStyle = `rgba(129, 17, 67, ${0.45 + diff * 0.25})`;
        } else {
          // Base side face
          ctx.fillStyle = `rgba(88, 12, 48, ${0.52 + diff * 0.28})`;
        }
        ctx.fill();
      });
      ctx.restore();

      // Draw Inner Cylindrical Bore Hollow
      ctx.save();
      ctx.beginPath();
      projBoreTop.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      // Gradient inside hole giving depth illusion
      const boreGrad = ctx.createRadialGradient(cx, cy - 20 * scale, 2 * scale, cx, cy - 10 * scale, 30 * scale);
      boreGrad.addColorStop(0, '#040714');
      boreGrad.addColorStop(0.7, '#180718');
      boreGrad.addColorStop(1, '#3b0d24');
      ctx.fillStyle = boreGrad;
      ctx.fill();
      ctx.restore();

      // 3. Render Luminous Pink Wireframe Edges with Proximity Glow to Scan Beam
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      edges.forEach(([i1, i2]) => {
        const p1 = projectedVertices[i1];
        const p2 = projectedVertices[i2];
        const midY = (p1.rawY + p2.rawY) / 2;

        // Distance from edge midpoint to scan beam
        const dist = Math.abs(midY - scanRawY);
        const scanProximity = Math.max(0, 1 - dist / 18); // 0 to 1

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);

        if (scanProximity > 0.05 && !prefersReducedMotion) {
          // Highlight edge as scanning laser passes
          ctx.strokeStyle = `rgba(255, 235, 245, ${0.7 + scanProximity * 0.3})`;
          ctx.shadowColor = 'rgba(255, 140, 200, 0.9)';
          ctx.shadowBlur = (6 + scanProximity * 14) * dpr;
          ctx.lineWidth = (1.6 + scanProximity * 1.2) * dpr;
        } else {
          // Standard resting pink wireframe edge
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.88)';
          ctx.shadowColor = 'rgba(244, 63, 94, 0.65)';
          ctx.shadowBlur = 4 * dpr;
          ctx.lineWidth = 1.4 * dpr;
        }
        ctx.stroke();
      });

      // Render Bore Rim Wireframe
      ctx.beginPath();
      projBoreTop.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      const boreDist = Math.abs(CY - scanRawY);
      const boreScanProximity = Math.max(0, 1 - boreDist / 16);
      if (boreScanProximity > 0.05 && !prefersReducedMotion) {
        ctx.strokeStyle = 'rgba(255, 240, 250, 0.95)';
        ctx.shadowColor = 'rgba(255, 150, 210, 0.95)';
        ctx.shadowBlur = 14 * dpr;
        ctx.lineWidth = 2 * dpr;
      } else {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.9)';
        ctx.shadowColor = 'rgba(244, 63, 94, 0.65)';
        ctx.shadowBlur = 5 * dpr;
        ctx.lineWidth = 1.5 * dpr;
      }
      ctx.stroke();

      // Lower bore bottom rim visible trace
      ctx.beginPath();
      projBoreBottom.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();
      ctx.restore();

      // 4. Render Scanning Laser Beam
      if (!prefersReducedMotion) {
        ctx.save();
        const beamHalfW = 125 * scale;
        const beamGrad = ctx.createLinearGradient(cx - beamHalfW, scanScreenY, cx + beamHalfW, scanScreenY);
        beamGrad.addColorStop(0, 'rgba(244, 63, 94, 0)');
        beamGrad.addColorStop(0.15, 'rgba(244, 63, 94, 0.35)');
        beamGrad.addColorStop(0.5, 'rgba(255, 245, 252, 0.95)');
        beamGrad.addColorStop(0.85, 'rgba(244, 63, 94, 0.35)');
        beamGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');

        ctx.beginPath();
        ctx.moveTo(cx - beamHalfW, scanScreenY);
        ctx.lineTo(cx + beamHalfW, scanScreenY);
        ctx.strokeStyle = beamGrad;
        ctx.shadowColor = 'rgba(255, 160, 210, 0.9)';
        ctx.shadowBlur = 12 * dpr;
        ctx.lineWidth = 1.8 * dpr;
        ctx.stroke();

        // Soft vertical light flare
        const flareGrad = ctx.createRadialGradient(cx, scanScreenY, 1 * dpr, cx, scanScreenY, 45 * dpr);
        flareGrad.addColorStop(0, 'rgba(255, 220, 240, 0.25)');
        flareGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.08)');
        flareGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.ellipse(cx, scanScreenY, 70 * dpr, 14 * dpr, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Pulsing Coordinate Datum Nodes
      const datumIndices = [6, 0, 14];
      datumIndices.forEach((idx, i) => {
        const pt = projectedVertices[idx];
        const pulseCycle = (elapsed * 1.5 + i * 0.8) % 2; // 0 to 2s
        const pulseRatio = pulseCycle / 2; // 0 to 1
        const pulseR = (3 + pulseRatio * 12) * dpr;
        const pulseAlpha = Math.max(0, 1 - pulseRatio);

        ctx.save();
        // Expanding radar beacon ring
        if (!prefersReducedMotion) {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 180, 220, ${pulseAlpha * 0.65})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }

        // Solid luminous center point
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 140, 200, 0.95)';
        ctx.shadowBlur = 8 * dpr;
        ctx.fill();
        ctx.restore();
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="upload-visual relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#14081c] via-[#090b1c] to-[#040612] shadow-2xl transition-all select-none min-h-[440px]"
      style={{
        boxShadow: '0 28px 70px rgba(47, 5, 28, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      }}
    >
      {/* Background Engineering Mesh Grid */}
      <div className="upload-visual__grid pointer-events-none absolute inset-0 opacity-25" />

      {/* Ambient Center Magenta Glow Core */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full blur-3xl opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(129, 17, 67, 0.2) 60%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Top Header Readout */}
      <div className="upload-visual__topline relative z-20 flex items-center justify-between px-6 pt-5 pb-2 text-[10px] font-mono font-bold tracking-[0.16em] text-rose-200/80">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1 w-2.5 rounded-xs bg-[#f43f5e] opacity-80" />
          AXONOMETRIC VIEW
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-2.5 py-0.5 text-[#fff0f7] shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f43f5e] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fb7185]" />
          </span>
          LIVE
        </span>
      </div>

      {/* Floating CAD Header Plate */}
      <div className="relative z-10 mx-auto mt-2 flex max-w-[280px] items-center justify-between rounded-xl border border-rose-300/20 bg-white/5 px-3.5 py-1.5 backdrop-blur-md text-[10px] font-mono font-semibold text-rose-100 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[#fb7185]" />
          <span className="tracking-wider">3D_CAD_PREVIEW</span>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-[#fb7185] shadow-[0_0_8px_#f43f5e]" />
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative mx-auto my-auto h-[280px] sm:h-[310px] w-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-contain"
          style={{ display: 'block' }}
          aria-label="Interactive live 3D CAD axonometric wireframe model preview"
          role="img"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-20 mt-auto w-full border-t border-white/10 bg-[#060a19]/80 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left side: glowing pink status indicator + LIVE 3D CAD PREVIEW label */}
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f43f5e] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]" />
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] font-extrabold tracking-[0.16em] sm:tracking-[0.18em] text-rose-200 uppercase whitespace-nowrap">
            LIVE 3D CAD PREVIEW
          </span>
        </div>

        {/* Right side: Three separate, evenly spaced badges (STEP, EDGE VIEW, 1:1 SCALE) */}
        <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 flex-wrap">
          <span className="inline-flex items-center justify-center h-6 rounded-md border border-white/15 bg-white/5 px-2.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-rose-200/90 shadow-2xs backdrop-blur-sm whitespace-nowrap">
            STEP
          </span>
          <span className="inline-flex items-center justify-center h-6 rounded-md border border-white/15 bg-white/5 px-2.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-rose-200/90 shadow-2xs backdrop-blur-sm whitespace-nowrap">
            EDGE VIEW
          </span>
          <span className="inline-flex items-center justify-center h-6 rounded-md border border-white/15 bg-white/5 px-2.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-rose-200/90 shadow-2xs backdrop-blur-sm whitespace-nowrap">
            1:1 SCALE
          </span>
        </div>
      </div>

      {/* Ambient Floating Particle Beacons */}
      <span className="upload-visual__particle upload-visual__particle--one pointer-events-none absolute top-[22%] left-[12%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_#f43f5e]" />
      <span className="upload-visual__particle upload-visual__particle--two pointer-events-none absolute bottom-[30%] right-[12%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_#f43f5e]" />
      <span className="upload-visual__particle upload-visual__particle--three pointer-events-none absolute top-[28%] right-[22%] h-1 w-1 rounded-full bg-rose-200 shadow-[0_0_8px_#f43f5e]" />
    </div>
  );
}
