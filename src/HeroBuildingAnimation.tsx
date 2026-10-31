import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function BuildingBlock({
  position,
  scale,
  color,
  delay,
  duration,
  loopDuration,
  wireframe,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  delay: number;
  duration: number;
  loopDuration: number;
  wireframe: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const loopedElapsed = elapsed % loopDuration;
    const progress = Math.max(0, Math.min(1, (loopedElapsed - delay) / duration));

    const currentScale = scale.map((s) => s * Math.max(progress, 0.001)) as [number, number, number];
    meshRef.current.scale.set(...currentScale);

    if (meshRef.current.material) {
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = Math.max(progress * 0.95, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0}
        wireframe={wireframe}
        roughness={0.25}
        metalness={0.65}
      />
    </mesh>
  );
}

// Laser scan plane that sweeps through the CAD model
function ScanLaser({ loopDuration }: { loopDuration: number }) {
  const planeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!planeRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const t = (elapsed % (loopDuration / 2)) / (loopDuration / 2);
    // Oscillate between y = -1 and y = 7
    const y = -1 + Math.sin(t * Math.PI) * 8;
    planeRef.current.position.y = y;
  });

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[16, 14]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function BuildingScene({ autoRotate, wireframe }: { autoRotate: boolean; wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const loopDuration = 18;

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  const buildingBlocks = useMemo<
    Array<{
      position: [number, number, number];
      scale: [number, number, number];
      color: string;
      delay: number;
      duration: number;
    }>
  >(
    () => [
      // Foundation slab (Precision Steel Plinth)
      { position: [0, -0.8, 0], scale: [8, 0.4, 6], color: '#334155', delay: 0, duration: 1.8 },
      // Ground floor structural columns & shear walls
      { position: [-3.5, 0.6, 0], scale: [0.35, 2.4, 6], color: '#e11d48', delay: 1.8, duration: 1.4 },
      { position: [3.5, 0.6, 0], scale: [0.35, 2.4, 6], color: '#e11d48', delay: 2.2, duration: 1.4 },
      { position: [0, 0.6, -2.6], scale: [7, 2.4, 0.35], color: '#9f1239', delay: 2.6, duration: 1.4 },
      { position: [0, 0.6, 2.6], scale: [7, 2.4, 0.35], color: '#9f1239', delay: 3.0, duration: 1.4 },
      // First mezzanine floor plate
      { position: [0, 1.9, 0], scale: [8.2, 0.3, 6.2], color: '#0284c7', delay: 4.4, duration: 1.6 },
      // Level 1 precision walls
      { position: [-3.5, 3.1, 0], scale: [0.35, 2.1, 6], color: '#0369a1', delay: 5.8, duration: 1.4 },
      { position: [3.5, 3.1, 0], scale: [0.35, 2.1, 6], color: '#0369a1', delay: 6.2, duration: 1.4 },
      { position: [0, 3.1, -2.6], scale: [7, 2.1, 0.35], color: '#0284c7', delay: 6.6, duration: 1.4 },
      { position: [0, 3.1, 2.6], scale: [7, 2.1, 0.35], color: '#0284c7', delay: 7.0, duration: 1.4 },
      // Level 2 intermediate floor plate
      { position: [0, 4.3, 0], scale: [8.2, 0.3, 6.2], color: '#38bdf8', delay: 8.2, duration: 1.6 },
      // Level 2 cantilevered structural walls
      { position: [-3.5, 5.4, 0], scale: [0.35, 1.9, 6], color: '#be123c', delay: 9.6, duration: 1.4 },
      { position: [3.5, 5.4, 0], scale: [0.35, 1.9, 6], color: '#be123c', delay: 10.0, duration: 1.4 },
      { position: [0, 5.4, -2.6], scale: [7, 1.9, 0.35], color: '#e11d48', delay: 10.4, duration: 1.4 },
      { position: [0, 5.4, 2.6], scale: [7, 1.9, 0.35], color: '#e11d48', delay: 10.8, duration: 1.4 },
      // Top parapet & engineering canopy
      { position: [0, 6.5, 0], scale: [8.8, 0.35, 6.8], color: '#0f172a', delay: 12.0, duration: 1.8 },
      // Feature aperture windows with cyan reflection
      { position: [-2, 0.6, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 3.5, duration: 0.8 },
      { position: [0, 0.6, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 3.7, duration: 0.8 },
      { position: [2, 0.6, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 3.9, duration: 0.8 },
      { position: [-2, 3.1, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 7.3, duration: 0.8 },
      { position: [0, 3.1, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 7.5, duration: 0.8 },
      { position: [2, 3.1, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 7.7, duration: 0.8 },
      { position: [-2, 5.4, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 11.1, duration: 0.8 },
      { position: [0, 5.4, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 11.3, duration: 0.8 },
      { position: [2, 5.4, 2.62], scale: [1.2, 1.2, 0.08], color: '#38bdf8', delay: 11.5, duration: 0.8 },
    ],
    []
  );

  return (
    <>
      <group ref={groupRef}>
        {buildingBlocks.map((block, index) => (
          <BuildingBlock
            key={index}
            {...block}
            loopDuration={loopDuration}
            wireframe={wireframe}
          />
        ))}
      </group>
      <ScanLaser loopDuration={loopDuration} />
      <gridHelper args={[24, 24, '#38bdf8', '#1e293b']} position={[0, -1.02, 0]} />
    </>
  );
}

export default function HeroBuildingAnimation() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] lg:h-[520px] bg-gradient-to-b from-[#060a16] via-[#090f22] to-[#040711] overflow-hidden select-none">
      {/* Interactive CAD Viewport Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 shadow-lg">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
            autoRotate
              ? 'bg-[#811143] text-white font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle rotation"
        >
          {autoRotate ? 'ROTATING' : 'PAUSED'}
        </button>
        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
            wireframe
              ? 'bg-sky-500 text-white font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle wireframe mode"
        >
          {wireframe ? 'WIREFRAME' : 'SOLID'}
        </button>
        <button
          type="button"
          onClick={resetCamera}
          className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          title="Reset Camera Angle"
        >
          RESET
        </button>
      </div>

      {/* Axis Gizmo Indicator (Top-Left) */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 text-[10px] font-mono text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1 text-rose-400">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> +X
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> +Y
        </span>
        <span className="flex items-center gap-1 text-sky-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> +Z (UP)
        </span>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [14, 10, 14], fov: 42, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[15, 25, 10]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-15, -10, -10]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[0, 4, 0]} intensity={1.5} color="#f43f5e" />
        <BuildingScene autoRotate={autoRotate} wireframe={wireframe} />
        <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.06} maxPolarAngle={Math.PI / 2 + 0.05} />
      </Canvas>

      {/* Technical coordinate readout at bottom */}
      <div className="absolute bottom-2.5 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-slate-500 pointer-events-none">
        <span>ORBIT: DRAG TO ROTATE • SCROLL TO ZOOM</span>
        <span className="text-sky-400 font-semibold tracking-wider">3D SCAN: ACTIVE</span>
      </div>
    </div>
  );
}
