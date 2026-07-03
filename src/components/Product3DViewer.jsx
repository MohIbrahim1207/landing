import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html, useProgress, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { RefreshCw, Compass, Volume2 } from 'lucide-react';

/* ─── FLOATING DUST PARTICLES ─── */
function FloatingDust() {
  const pointsRef = useRef();
  
  const [positions, speeds] = useMemo(() => {
    const coords = [];
    const velocity = [];
    for (let i = 0; i < 150; i++) {
      coords.push(
        (Math.random() - 0.5) * 8, // X range
        (Math.random() - 0.5) * 5, // Y range
        (Math.random() - 0.5) * 8  // Z range
      );
      velocity.push(Math.random() * 0.05 + 0.02);
    }
    return [new Float32Array(coords), new Float32Array(velocity)];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < 150; i++) {
      // Drift particles slowly upwards
      const yIdx = i * 3 + 1;
      array[yIdx] += speeds[i] * delta;
      
      // Reset position if it drifts out of sight
      if (array[yIdx] > 3.0) {
        array[yIdx] = -2.5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.015; // gentle rotational drift
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#FFB347"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── PROCEDURAL PBR 3D SIFTER ASSEMBLY ─── */
function SifterModel3D({ 
  viewMode, 
  isRunning, 
  isExploded, 
  isSectionCut 
}) {
  const shaftRef = useRef();
  const casingRef = useRef();
  const motorRef = useRef();
  
  // Exploded & clipping animation references
  const explodedProgress = useRef(0);
  const clipProgress = useRef(5);
  const particleOffset = useRef(0);
  
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, -1), 5));
  const planes = useMemo(() => [planeRef.current], []);

  useFrame((state, delta) => {
    // 1. Exploded view offsets interpolation
    const targetExploded = isExploded ? 1.0 : 0.0;
    explodedProgress.current = THREE.MathUtils.lerp(explodedProgress.current, targetExploded, 0.06);

    // 2. Section cut clipping plane interpolation
    const targetClip = isSectionCut ? 0.0 : 5.0;
    clipProgress.current = THREE.MathUtils.lerp(clipProgress.current, targetClip, 0.06);
    planeRef.current.constant = clipProgress.current;

    // 3. Operational vibrations & rotations
    if (isRunning) {
      if (shaftRef.current) {
        shaftRef.current.rotation.x += delta * 6.5; // High speed rotation
      }
      
      particleOffset.current = (particleOffset.current + delta * 0.95) % 1.0;

      // Casing high frequency micro-vibrations
      if (casingRef.current) {
        casingRef.current.position.y = Math.sin(state.clock.elapsedTime * 70) * 0.007;
        casingRef.current.position.x = Math.cos(state.clock.elapsedTime * 55) * 0.0035;
      }
      if (motorRef.current) {
        motorRef.current.position.y = -0.9 + Math.sin(state.clock.elapsedTime * 85) * 0.012;
      }
    } else {
      if (shaftRef.current) {
        shaftRef.current.rotation.x += delta * 0.25; // idle cooling drift
      }
      if (casingRef.current) {
        casingRef.current.position.y = 0;
        casingRef.current.position.x = 0;
      }
      if (motorRef.current) {
        motorRef.current.position.y = -0.9;
      }
    }
  });

  const wire = viewMode === 'wireframe';
  const sectionActive = isSectionCut || clipProgress.current < 4.9;

  // PBR Physical Material Presets
  const matPowderOrange = {
    metalness: 0.25,
    roughness: 0.35,
    color: '#D97706', // Powder coated orange sifter casing
    wireframe: wire,
    side: THREE.DoubleSide,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  const matBrushedStainless = {
    metalness: 0.92,
    roughness: 0.22,
    color: '#a1a1aa', // Titanium/Steel flanges
    wireframe: wire,
    side: THREE.DoubleSide,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  const matCopperAccent = {
    metalness: 0.95,
    roughness: 0.25,
    color: '#ff9900', // Glowing copper flanges & locks
    wireframe: wire,
    clippingPlanes: sectionActive ? planes : undefined,
  };

  const matScreenMeshGold = {
    color: '#FFB347', // Champagne gold screening mesh basket
    wireframe: true,
    transparent: true,
    opacity: 0.45,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  const ep = explodedProgress.current;
  const inletOffset = ep * 1.5;
  const outletOffset = ep * -1.2;
  const screenOffset = ep * -1.6;
  const motorOffset = ep * 1.2;
  const paddleOffset = ep * -0.6;

  return (
    <group ref={casingRef} position={[0, 0, 0]}>
      {/* ─── Main Casing Chamber (Powder Coated Orange) ─── */}
      <group position={[screenOffset * 0.5, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.3, 3.4, 32, 1, false, 0, sectionActive ? Math.PI * 1.55 : Math.PI * 2]} />
          <meshStandardMaterial {...matPowderOrange} />
        </mesh>
        
        {/* Quick Access Latches */}
        <mesh position={[-0.7, 0, 1.3]} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.1]} />
          <meshStandardMaterial {...matBrushedStainless} />
        </mesh>
        <mesh position={[0.5, 0, 1.3]} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.1]} />
          <meshStandardMaterial {...matBrushedStainless} />
        </mesh>

        <mesh position={[-0.7, 0, 1.35]} castShadow>
          <boxGeometry args={[1.0, 0.1, 0.05]} />
          <meshStandardMaterial {...matCopperAccent} />
        </mesh>
        <mesh position={[0.5, 0, 1.35]} castShadow>
          <boxGeometry args={[1.0, 0.1, 0.05]} />
          <meshStandardMaterial {...matCopperAccent} />
        </mesh>
      </group>

      {/* ─── Top Material Inlet (Slides Up) ─── */}
      <mesh position={[0.5, 1.4 + inletOffset, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.45, 0.7, 16]} />
        <meshStandardMaterial {...matBrushedStainless} />
      </mesh>

      {/* ─── Bottom Discharge Hoppers (Slide Down) ─── */}
      <mesh position={[-1.4, -1.3 + outletOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.5, 0.22, 1.0, 16]} />
        <meshStandardMaterial {...matBrushedStainless} />
      </mesh>
      <mesh position={[-0.3, -1.3 + outletOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.75, 0.35, 1.0, 16]} />
        <meshStandardMaterial {...matBrushedStainless} />
      </mesh>

      {/* ─── Sifting Screen Basket (Slides out left) ─── */}
      <mesh position={[screenOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 3.0, 32]} />
        <meshStandardMaterial {...matScreenMeshGold} />
      </mesh>

      {/* ─── Rotor Shaft and Classifier Paddles ─── */}
      <group ref={shaftRef} position={[paddleOffset, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.0, 16]} />
          <meshStandardMaterial {...matCopperAccent} />
        </mesh>
        
        {/* Helical paddle fins */}
        {[-1.1, -0.4, 0.4, 1.1].map((xLoc, idx) => {
          const angle = (idx * Math.PI) / 2;
          return (
            <group key={idx} rotation={[angle, 0, 0]} position={[xLoc, 0, 0]}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[0.22, 0.06, 0.85]} />
                <meshStandardMaterial {...matBrushedStainless} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ─── Drive Motor (Copper Fin Details) ─── */}
      <group ref={motorRef} position={[1.1 + motorOffset, -0.9, 0.75]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 1.1, 16]} />
          <meshStandardMaterial color="#2d2216" metalness={0.92} roughness={0.3} />
        </mesh>
        {[0.3, 0.1, -0.1, -0.3].map((xOff, i) => (
          <mesh key={i} position={[xOff, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
            <meshStandardMaterial {...matCopperAccent} />
          </mesh>
        ))}
      </group>

      {/* ─── Amber/Gold Sifting Particle Simulation ─── */}
      {isRunning && (
        <group>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
            const offset = (particleOffset.current + idx / 10) % 1.0;
            const x = 0.5 - offset * 1.8;
            const y = 1.3 - offset * 2.5 + Math.sin(offset * Math.PI * 5) * 0.18;
            const z = Math.cos(offset * Math.PI * 5) * 0.45;

            return (
              <mesh key={idx} position={[x, y, z]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color="#FF9F1A" transparent opacity={0.8} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

/* ─── CAMERA CONTROLS RIG ─── */
function CameraRigController({ activeTab, activeHotspot, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    let targetCam = { x: 5.2, y: 3.5, z: 5.2 };
    let targetLook = { x: 0, y: 0, z: 0 };

    if (activeTab === 'features') {
      targetCam = { x: 3.5, y: 2.0, z: 3.5 };
      targetLook = { x: -0.4, y: 0.2, z: 0 };
    } else if (activeTab === 'specs') {
      targetCam = { x: 0.1, y: 1.0, z: 6.2 };
      targetLook = { x: 0, y: 0, z: 0 };
    } else if (activeTab === 'apps') {
      targetCam = { x: -4.5, y: 2.5, z: 4.5 };
      targetLook = { x: -0.2, y: -0.2, z: 0 };
    } else if (activeTab === 'downloads') {
      targetCam = { x: 6.5, y: 4.5, z: 6.5 };
      targetLook = { x: 0, y: 0, z: 0 };
    } else if (activeTab === 'video') {
      targetCam = { x: 2.8, y: 0.9, z: 2.8 };
      targetLook = { x: 0.5, y: 0.4, z: 0.5 };
    }

    if (activeHotspot) {
      const [hx, hy, hz] = activeHotspot.pos;
      targetLook = { x: hx, y: hy, z: hz };
      targetCam = { x: hx + 2.0, y: hy + 1.2, z: hz + 2.0 };
    }

    gsap.killTweensOf(camera.position);
    if (controlsRef.current) {
      gsap.killTweensOf(controlsRef.current.target);
    }

    gsap.to(camera.position, {
      x: targetCam.x,
      y: targetCam.y,
      z: targetCam.z,
      duration: 1.8,
      ease: 'power3.inOut'
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: targetLook.x,
        y: targetLook.y,
        z: targetLook.z,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.update();
          }
        }
      });
    }

    return () => {
      gsap.killTweensOf(camera.position);
      if (controlsRef.current) {
        gsap.killTweensOf(controlsRef.current.target);
      }
    };
  }, [activeTab, activeHotspot, camera, controlsRef]);

  return null;
}

/* ─── LOADING SCREEN FALLBACK ─── */
function LoaderHTML() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#150a04] z-10">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-[#FF9F1A] animate-spin" />
        <span className="font-mono text-xs font-bold text-[#FFD48A] uppercase tracking-widest">
          Rendering Unreal Cockpit... {Math.round(progress)}%
        </span>
        <div className="w-48 h-1.5 bg-[#2d170a] rounded-full overflow-hidden mt-1 border border-[rgba(255,159,26,0.12)]">
          <div
            className="h-full bg-[#FF9F1A] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN WEBGL 3D CANVAS COMPONENT ─── */
export default function Product3DViewer({ 
  activeTab = 'overview',
  activeHotspot = null,
  onSelectHotspot = () => {},
  isExploded = false,
  isSectionCut = false,
  isRunning = false
}) {
  const [viewMode, setViewMode] = useState('shaded');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const timerRef = useRef(null);

  // 3D placement coordinates
  const hotspots = [
    { id: 'inlet', name: 'Material Inlet', pos: [0.5, 1.7, 0] },
    { id: 'rotor', name: 'Paddle Rotor', pos: [0, 0.5, 0.6] },
    { id: 'chamber', name: 'Screening Basket', pos: [-0.1, 0, 1.45] },
    { id: 'outlet', name: 'Discharge Chute', pos: [-0.85, -1.8, 0] },
    { id: 'motor', name: 'Drive Motor', pos: [1.1, -1.0, 1.1] }
  ];

  const handleStart = () => {
    setIsInteracting(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleEnd = () => {
    timerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative select-none bg-[#150a04]/40">
      <Suspense fallback={<LoaderHTML />}>
        <Canvas
          shadows
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
            antialias: true,
            localClippingEnabled: true
          }}
          camera={{ position: [5.2, 3.5, 5.2], fov: 38 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={['#150a04']} />

          {/* Warm volumetric-style orange ambient lights */}
          <ambientLight intensity={0.6} color="#ffe6b3" />
          <hemisphereLight skyColor="#ffe6b3" groundColor="#150a04" intensity={0.4} />
          
          {/* Key lights casting warm gold & copper reflections */}
          <directionalLight
            position={[6, 12, 6]}
            intensity={2.2}
            color="#FFC857"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-6, 4, 3]} intensity={1.2} color="#FF9F1A" />
          <directionalLight position={[0, 4, -6]} intensity={0.8} color="#ffe6b3" />

          {/* Floating dust particle cloud */}
          <FloatingDust />

          {/* scaled-up sifter model (+50% size increase) */}
          <group scale={[1.5, 1.5, 1.5]} position={[0, 0.4, 0]}>
            <SifterModel3D 
              viewMode={viewMode}
              isRunning={isRunning}
              isExploded={isExploded}
              isSectionCut={isSectionCut}
            />
          </group>

          <CameraRigController 
            activeTab={activeTab} 
            activeHotspot={activeHotspot} 
            controlsRef={controlsRef} 
          />

          <Environment preset="studio" />

          {/* Polished metallic ground reflector plate */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial color="#1f1107" roughness={0.15} metalness={0.95} />
          </mesh>

          <ContactShadows
            position={[0, -2.18, 0]}
            opacity={0.6}
            scale={12}
            blur={2.8}
            far={4.5}
          />

          {/* Hotspots mapped in 3D scale-offset */}
          {hotspots.map((hot, idx) => {
            const isSelected = activeHotspot?.id === hot.id;
            // Adjusted hotspot coordinates to align with the 1.5 scale-up
            const scaledPos = [hot.pos[0] * 1.5, hot.pos[1] * 1.5 + 0.4, hot.pos[2] * 1.5];
            
            return (
              <Html key={hot.id} position={scaledPos} center distanceFactor={8.5}>
                <button
                  onClick={() => {
                    const match = hotspots.find(h => h.id === hot.id);
                    onSelectHotspot(match);
                  }}
                  className={`w-6.5 h-6.5 rounded-full border-2 border-white text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FF9F1A] scale-125 shadow-[0_0_18px_rgba(255,159,26,0.9)]' 
                      : 'bg-[#2d170a]/90 text-[#FFB347] border-[#FFB347] hover:bg-[#FF9F1A] hover:text-[#150a04]'
                  }`}
                >
                  {idx + 1}
                </button>
              </Html>
            );
          })}

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate && !isInteracting && !activeHotspot && activeTab === 'overview'}
            autoRotateSpeed={0.8}
            onStart={handleStart}
            onEnd={handleEnd}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
