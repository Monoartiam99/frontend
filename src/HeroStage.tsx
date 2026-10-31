import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function smoothstep(start: number, end: number, value: number) {
  const progress = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function BuildingModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2());
  
  const foundationRef = useRef<THREE.Mesh>(null);
  const wall1Ref = useRef<THREE.Mesh>(null);
  const wall2Ref = useRef<THREE.Mesh>(null);
  const wall3Ref = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const col1Ref = useRef<THREE.Mesh>(null);
  const col2Ref = useRef<THREE.Mesh>(null);
  const roofRef = useRef<THREE.Mesh>(null);

  const materials = useMemo(() => ({
    floorPlan: new THREE.LineBasicMaterial({ color: '#d86a9d', transparent: true, opacity: 0 }),
    foundation: new THREE.MeshStandardMaterial({ color: '#8a174b', transparent: true }),
    wall: new THREE.MeshPhysicalMaterial({ color: '#cbb7c1', roughness: 0.4, transparent: true }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#281421', metalness: 0.12, roughness: 0.18, transmission: 0.06, transparent: true, opacity: 0.86 }),
    roof: new THREE.MeshStandardMaterial({ color: '#420928', transparent: true }),
  }), []);

  // Floor plan geometry (blueprint lines)
  const floorPlanGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const addLine = (x1: number, z1: number, x2: number, z2: number) => {
      points.push(new THREE.Vector3(x1, 0, z1));
      points.push(new THREE.Vector3(x2, 0, z2));
    };
    
    // Outline
    addLine(-2.5, -2, 2.5, -2);
    addLine(2.5, -2, 2.5, 2);
    addLine(2.5, 2, -2.5, 2);
    addLine(-2.5, 2, -2.5, -2);

    // Grid
    for(let i = -2; i <= 2; i++) {
        addLine(i, -2, i, 2);
    }
    for(let i = -1.5; i <= 1.5; i+=0.5) {
        addLine(-2.5, i, 2.5, i);
    }
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const timeline = reducedMotion ? 15 : elapsed % 15;
    
    const planAnim = smoothstep(0, 2, timeline) - smoothstep(13, 14, timeline);
    const foundationAnim = smoothstep(2, 4, timeline) - smoothstep(13, 14, timeline);
    const wallAnim = smoothstep(4, 6, timeline) - smoothstep(13, 14, timeline);
    const glassAnim = smoothstep(6, 8, timeline) - smoothstep(13, 14, timeline);
    const roofAnim = smoothstep(8, 10, timeline) - smoothstep(13, 14, timeline);

    materials.floorPlan.opacity = planAnim * 0.6;
    materials.foundation.opacity = Math.max(0, foundationAnim);
    materials.wall.opacity = Math.max(0, wallAnim);
    materials.glass.opacity = Math.max(0, glassAnim * 0.86);
    materials.roof.opacity = Math.max(0, roofAnim);

    if (foundationRef.current) {
      foundationRef.current.scale.y = Math.max(0.001, foundationAnim);
      foundationRef.current.position.y = 0.1 * foundationAnim;
    }

    const updateWall = (ref: any, yBase: number, h: number, anim: number) => {
      if (ref.current) {
        ref.current.scale.y = Math.max(0.001, anim);
        ref.current.position.y = yBase + (h * anim) / 2;
      }
    };

    updateWall(wall1Ref, 0.2, 1, wallAnim);
    updateWall(wall2Ref, 0.2, 1, wallAnim);
    updateWall(wall3Ref, 0.2, 1, wallAnim);
    updateWall(col1Ref, 0.2, 1, wallAnim);
    updateWall(col2Ref, 0.2, 1, wallAnim);
    updateWall(glassRef, 0.2, 1, glassAnim);

    if (roofRef.current) {
      roofRef.current.position.y = 1.3 + (1 - roofAnim) * 1.5;
    }

    if (groupRef.current) {
      const mobile = state.size.width < 720;
      const pointerTargetX = mobile || reducedMotion ? 0 : state.pointer.x;
      const pointerTargetY = mobile || reducedMotion ? 0 : state.pointer.y;
      pointer.current.x = THREE.MathUtils.damp(pointer.current.x, pointerTargetX, 3.8, delta);
      pointer.current.y = THREE.MathUtils.damp(pointer.current.y, pointerTargetY, 3.8, delta);
      
      const intensity = mobile ? 0.55 : 1;
      groupRef.current.rotation.y = 0.5 + elapsed * 0.1 * intensity + pointer.current.x * 0.5;
      groupRef.current.rotation.x = 0.3 + pointer.current.y * 0.2;
      groupRef.current.position.y = -0.5 + Math.sin(elapsed * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Blueprint */}
      <lineSegments geometry={floorPlanGeo} material={materials.floorPlan} />

      {/* Foundation */}
      <mesh ref={foundationRef}>
        <boxGeometry args={[4.8, 0.2, 3.8]} />
        <primitive object={materials.foundation} attach="material" />
      </mesh>

      {/* Walls */}
      <mesh ref={wall1Ref} position={[-2.3, 0.7, 0]}>
        <boxGeometry args={[0.2, 1, 3.8]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      <mesh ref={wall2Ref} position={[2.3, 0.7, 0]}>
        <boxGeometry args={[0.2, 1, 3.8]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      <mesh ref={wall3Ref} position={[0, 0.7, -1.8]}>
        <boxGeometry args={[4.4, 1, 0.2]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Glass */}
      <mesh ref={glassRef} position={[0, 0.7, 1.8]}>
        <boxGeometry args={[4.4, 1, 0.1]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* Columns */}
      <mesh ref={col1Ref} position={[-1, 0.7, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      <mesh ref={col2Ref} position={[1, 0.7, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Roof */}
      <mesh ref={roofRef} position={[0, 1.3, 0]}>
        <boxGeometry args={[5.0, 0.2, 4.0]} />
        <primitive object={materials.roof} attach="material" />
      </mesh>
    </group>
  );
}

function Studio({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={['#fff8fb']} />
      <fog attach="fog" args={['#fff8fb', 8, 17]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[5, 8, 5]} intensity={3.4} color="#ffffff" />
      <directionalLight position={[-5, 2, -4]} intensity={2.1} color="#ef9bc2" />
      <pointLight position={[0, -2, 5]} intensity={6} color="#811143" distance={10} />
      <BuildingModel reducedMotion={reducedMotion} />
      <mesh position={[0, -1.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#c86695" transparent opacity={0.12} />
      </mesh>
    </>
  );
}

class StageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <StageFallback />;
    return this.props.children;
  }
}

function StageFallback() {
  return (
    <div className="vehicle-fallback" role="img" aria-label="Building visualization unavailable">
      <span>BEEKSHAN TECHNOLOGY</span>
      <strong>Building model</strong>
      <i />
    </div>
  );
}

function StageLoader() {
  return <Html center><div className="vehicle-loader">Preparing building geometry…</div></Html>;
}

export default function HeroStage() {
  const reducedMotion = useReducedMotion();

  return (
    <StageErrorBoundary>
      <div className="vehicle-stage" aria-label="Interactive building digital twin visualization">
        <div className="vehicle-stage__halo" />
        <div className="vehicle-stage__grid" />
        <Canvas camera={{ position: [0, 0.25, 7], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} fallback={<StageFallback />}>
          <Suspense fallback={<StageLoader />}>
            <Studio reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
        <div className="vehicle-stage__caption"><span>MODEL IN PROGRESS</span><i /> <b>Engineering visualization</b></div>
      </div>
    </StageErrorBoundary>
  );
}
