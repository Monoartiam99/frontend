import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function CarModel() {
  const { scene } = useGLTF('/car.glb');
  const group = useRef<THREE.Group>(null);
  
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshPhysicalMaterial({ 
        color: '#cbb7c1', 
        metalness: 0.62, 
        roughness: 0.29, 
        clearcoat: 0.5, 
        clearcoatRoughness: 0.22, 
        transparent: true 
      }),
      glass: new THREE.MeshPhysicalMaterial({ 
        color: '#281421', 
        metalness: 0.12, 
        roughness: 0.18, 
        transmission: 0.06, 
        transparent: true, 
        opacity: 0.86 
      }),
      tyre: new THREE.MeshStandardMaterial({ 
        color: '#20161e', 
        metalness: 0.16, 
        roughness: 0.58, 
        transparent: true 
      }),
      component: new THREE.MeshStandardMaterial({ 
        color: '#92717e', 
        metalness: 0.7, 
        roughness: 0.26, 
        transparent: true 
      }),
      wireframe: new THREE.LineBasicMaterial({ 
        color: '#d86a9d', 
        transparent: true, 
        opacity: 0.15,
        depthWrite: false, 
        depthTest: false 
      })
    };
  }, []);

  const { solid, wireframe } = useMemo(() => {
    const solidGroup = scene.clone(true);
    const wireframeGroup = new THREE.Group();

    solidGroup.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        let name = mesh.name.toLowerCase();
        let current = mesh.parent;
        while (current) {
          name += ` ${current.name.toLowerCase()}`;
          current = current.parent;
        }

        let mat: THREE.Material = materials.body;
        if (name.includes('glass')) mat = materials.glass;
        else if (name.includes('tyre') || name.includes('wheel')) mat = materials.tyre;
        else if (name.includes('hub') || name.includes('axle')) mat = materials.component;
        
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Add wireframe properly with renderOrder
        const wire = new THREE.LineSegments(
          new THREE.WireframeGeometry(mesh.geometry),
          materials.wireframe
        );
        wire.renderOrder = 2;
        wire.position.copy(mesh.position);
        wire.rotation.copy(mesh.rotation);
        wire.scale.copy(mesh.scale);
        wireframeGroup.add(wire);
      }
    });
    
    // Scale and center
    const box = new THREE.Box3().setFromObject(solidGroup);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Adjust scale so it fits beautifully in the frame
    const scale = 3.8 / Math.max(size.x, size.y, size.z);
    
    // Center it exactly at 0,0,0 based on its bounds
    solidGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    solidGroup.scale.setScalar(scale);

    wireframeGroup.position.copy(solidGroup.position);
    wireframeGroup.scale.copy(solidGroup.scale);
    
    return { solid: solidGroup, wireframe: wireframeGroup };
  }, [scene, materials]);

  // Gentle floating animation
  useFrame((state) => {
    if (group.current) {
      const elapsed = state.clock.elapsedTime;
      group.current.position.y = Math.sin(elapsed * 1.5) * 0.08;
      
      // Pulse the wireframe gently
      materials.wireframe.opacity = 0.1 + (Math.sin(elapsed * 3) * 0.5 + 0.5) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <primitive object={solid} />
      <primitive object={wireframe} />
    </group>
  );
}

export default function CarAnimation() {
  return (
    <div className="w-full h-80 relative">
      <Canvas camera={{ position: [4, 2, 6], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={3} color="#ffffff" />
        <directionalLight position={[-5, 2, -4]} intensity={2} color="#ef9bc2" />
        <pointLight position={[0, -2, 5]} intensity={4} color="#811143" distance={10} />
        
        {/* Environment adds beautiful reflections to the car's clearcoat */}
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <CarModel />
        </Suspense>

        {/* OrbitControls for smooth continuous rotation and interactivity */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/car.glb');
