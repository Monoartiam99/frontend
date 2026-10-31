import { useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';

interface CADPreviewProps {
  stlUrl?: string;
  onError?: () => void;
}

function STLModel({ stlUrl, onError, onLoaded }: { stlUrl: string; onError?: () => void; onLoaded: (radius: number) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!stlUrl) return;
    let active = true;
    fetch(stlUrl)
      .then(response => {
        if (!response.ok) throw new Error('Could not download STL');
        return response.arrayBuffer();
      })
      .then(buffer => {
        const geometry = new STLLoader().parse(buffer);
        geometry.computeVertexNormals();
        if (active && meshRef.current) {
          geometry.computeBoundingBox();
          const center = geometry.boundingBox?.getCenter(new THREE.Vector3()) ?? new THREE.Vector3();
          geometry.translate(-center.x, -center.y, -center.z);
          geometry.computeBoundingSphere();
          meshRef.current.geometry = geometry;
          // Engineering CAD models are Z-up; Three.js scenes here use Y-up.
          meshRef.current.rotation.x = -Math.PI / 2;
          onLoaded(Math.max(geometry.boundingSphere?.radius ?? 1, 1));
        }
      })
      .catch(error => {
        console.error('Error loading STL:', error);
        onError?.();
      });
    return () => { active = false; };
  }, [stlUrl, onError, onLoaded]);

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial
        color="#bdc9d5"
        metalness={0.12}
        roughness={0.55}
      />
    </mesh>
  );
}

function CADScene({ stlUrl, onError, controlsRef }: { stlUrl: string; onError?: () => void; controlsRef: React.RefObject<any> }) {
  const three = useThree();
  const onLoaded = useCallback((radius: number) => {
    const cam = three.camera;
    const distance = radius * 2.8;
    cam.position.set(distance, distance * 0.75, distance);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    if (controlsRef.current && 'target' in controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [three, controlsRef]);
  return (
    <>
      <color attach="background" args={['#151515']} />
      <hemisphereLight args={['#ffffff', '#68758a', 1.1]} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[120, 180, 140]} intensity={2.2} />
      <directionalLight position={[-120, 80, -100]} intensity={1.2} />
      <STLModel stlUrl={stlUrl} onError={onError} onLoaded={onLoaded} />
      <gridHelper args={[1000, 20]} position={[0, 0, 0]} />
      <OrbitControls ref={controlsRef} target={[0, 0, 0]} enableDamping />
    </>
  );
}

export default function CADPreview({ stlUrl, onError }: CADPreviewProps) {
  const controlsRef = useRef<any>(null);
  if (!stlUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 rounded-2xl">
        <p className="text-slate-500">No CAD model to display</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200">
      <Canvas camera={{ position: [190, 190, 210], fov: 42, near: 0.1, far: 10000 }}>
        <CADScene stlUrl={stlUrl} onError={onError} controlsRef={controlsRef} />
      </Canvas>
      <button type="button" onClick={() => controlsRef.current?.reset()} className="absolute right-3 top-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold shadow">Reset view</button>
    </div>
  );
}

