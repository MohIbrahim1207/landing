import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProcessPipeline from './ProcessPipeline';

// Camera controller rig that tracks the GSAP ScrollTrigger state
function CameraRig({ animationRef }) {
  const { viewport } = useThree();

  useFrame((state) => {
    // scroll progress (0 to 1) representing the Hero scroll displacement
    const scroll = animationRef?.current?.explode || 0;
    const isMobile = viewport.width < 6.8;

    // Const ternary assignments resolve the lints and improve code quality
    const targetX = isMobile ? 0.0 : THREE.MathUtils.lerp(-2.0, 2.0, scroll);
    const targetY = isMobile ? 0.4 : THREE.MathUtils.lerp(-1.0, 1.2, scroll);
    const targetZ = isMobile ? 6.8 : THREE.MathUtils.lerp(5.2, 4.0, scroll);

    // Smooth camera inertia lerps
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    // Look-at centers track the pipeline movement
    const lookAtX = THREE.MathUtils.lerp(-1.2, 1.2, scroll);
    const lookAtY = THREE.MathUtils.lerp(-0.5, 0.8, scroll);
    state.camera.lookAt(lookAtX, isMobile ? 0.4 : lookAtY * 0.5, 0);
  });

  return null;
}

export default function FlowCanvas({ animationRef }) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6.0], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        
        {/* Key lights for chrome and metal surface reflections */}
        <directionalLight 
          position={[5, 8, 4]} 
          intensity={2.2} 
          color="#ffffff" 
        />
        
        {/* Glow-cyan accent fill lights */}
        <pointLight position={[-4, 2, -2]} intensity={1.8} color="#00e0ff" />
        <pointLight position={[0, -1, 3.5]} intensity={2.5} color="#00e0ff" />
        <pointLight position={[3, -3, -2]} intensity={1.2} color="#0080ff" />

        {/* Camera Scroll Rig */}
        <CameraRig animationRef={animationRef} />

        {/* Connected Process Pipeline Assembly */}
        <ProcessPipeline animationRef={animationRef} />

        {/* Restrict Orbit angles for intuitive web browsing */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
