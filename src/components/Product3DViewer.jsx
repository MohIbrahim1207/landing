import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, RefreshCw, FileText, Info } from 'lucide-react';
import { PRODUCTS } from '../data/products';

/* ─── CUSTOM ERROR BOUNDARY ─── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/* ─── PROCEDURAL CENTRIFUGAL SIFTER MODEL ─── */
function SifterModel3D({ mode, isLowEnd }) {
  const shaftRef = useRef();
  
  // Animation state values for smooth transitions
  const explodedProgress = useRef(0);
  const clipProgress = useRef(5); // start unclipped (constant = 5)
  
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, -1), 5));
  const planes = useMemo(() => [planeRef.current], []);

  useFrame((state, delta) => {
    // Rotation of internal paddles
    if (shaftRef.current && mode !== 'exploded') {
      shaftRef.current.rotation.x += 0.015;
    }

    // Smoothly lerp exploded animation progress
    const targetExploded = mode === 'exploded' ? 1.0 : 0.0;
    explodedProgress.current = THREE.MathUtils.lerp(explodedProgress.current, targetExploded, 0.08);

    // Smoothly lerp clipping plane constant for Section View
    const targetClip = mode === 'section' ? 0.0 : 5.0;
    clipProgress.current = THREE.MathUtils.lerp(clipProgress.current, targetClip, 0.08);
    planeRef.current.constant = clipProgress.current;
  });

  const wire = mode === 'wireframe';
  const xray = mode === 'xray';
  const sectionActive = mode === 'section' || clipProgress.current < 4.9;

  // High-fidelity PBR Stainless Steel (Brushed: metalness 0.95, roughness 0.25)
  const matStainless = {
    metalness: 0.95,
    roughness: 0.25,
    color: '#cbd5e1',
    wireframe: wire,
    side: THREE.DoubleSide,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  const matPainted = {
    metalness: 0.35,
    roughness: 0.45,
    color: '#005f6d', // Brand industrial teal
    wireframe: wire,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  const matRubber = {
    metalness: 0.1,
    roughness: 0.8,
    color: '#1f2937',
    wireframe: wire,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  const matScreenMesh = {
    color: '#9ca3af',
    wireframe: true,
    transparent: true,
    opacity: 0.45,
    clippingPlanes: sectionActive ? planes : undefined,
    clipShadows: true
  };

  // Animation values distributed over components
  const eVal = explodedProgress.current;
  const housingOffset = eVal * -1.8;
  const screenOffset = eVal * -0.9;
  const motorOffset = eVal * 1.2;
  const inletOffset = eVal * 0.9;
  const outletOffset = eVal * -0.9;
  const paddleOffset = eVal * 0.45;

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* Support Stand / Base Frame (remains stationary) */}
      <group position={[0, -1.7, 0]}>
        {/* Floor Base Plates */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.15, 2.0]} />
          <meshStandardMaterial {...matPainted} />
        </mesh>
        {/* Support Pillar Left */}
        <mesh position={[-1.6, 0.8, 0]} castShadow>
          <boxGeometry args={[0.3, 1.6, 0.3]} />
          <meshStandardMaterial {...matPainted} />
        </mesh>
        {/* Support Pillar Right */}
        <mesh position={[1.6, 0.8, 0]} castShadow>
          <boxGeometry args={[0.3, 1.6, 0.3]} />
          <meshStandardMaterial {...matPainted} />
        </mesh>
      </group>

      {/* Main Sieve Housing (slides out to the left) */}
      <group position={[housingOffset, 0, 0]}>
        {xray ? (
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[1.3, 1.3, 3.4, 32]} />
              <meshPhysicalMaterial
                transmission={0.9}
                thickness={0.5}
                roughness={0.1}
                ior={1.4}
                color="#0d9488"
                emissive="#0d9488"
                emissiveIntensity={0.1}
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
                clippingPlanes={sectionActive ? planes : undefined}
                clipShadows={true}
              />
            </mesh>
          </group>
        ) : (
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              {/* Cutaway layout exposing interior components */}
              <cylinderGeometry args={[1.3, 1.3, 3.4, 32, 1, false, 0, Math.PI * 1.55]} />
              <meshStandardMaterial {...matStainless} />
            </mesh>

            {/* Boxy mounting bracket / rear support structure on the right side of the main body */}
            <mesh position={[1.65, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 2.6, 2.6]} />
              <meshStandardMaterial {...matStainless} />
            </mesh>

            {/* Door 1 (left side door on the front face of housing) */}
            <group position={[-0.7, 0, 1.25]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 0.9, 0.15]} />
                <meshStandardMaterial {...matStainless} roughness={0.3} />
              </mesh>
              {/* Blue border/frame around the door representing the seal/latch plate */}
              <mesh position={[0, 0, -0.06]} castShadow>
                <boxGeometry args={[1.0, 1.0, 0.05]} />
                <meshStandardMaterial color="#005f6d" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Lever handles/latches */}
              <mesh position={[-0.4, 0, 0.09]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
              <mesh position={[0.4, 0, 0.09]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            </group>

            {/* Door 2 (right side door on the front face of housing) */}
            <group position={[0.5, 0, 1.25]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 0.9, 0.15]} />
                <meshStandardMaterial {...matStainless} roughness={0.3} />
              </mesh>
              {/* Blue border/frame around the door */}
              <mesh position={[0, 0, -0.06]} castShadow>
                <boxGeometry args={[1.0, 1.0, 0.05]} />
                <meshStandardMaterial color="#005f6d" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Lever handles/latches */}
              <mesh position={[-0.4, 0, 0.09]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
              <mesh position={[0.4, 0, 0.09]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            </group>
          </group>
        )}

        {/* Solid Section Cap (closes hollow visual interior during Section View) */}
        {sectionActive && !wire && (
          <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 2.6]} />
            <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* Top Inlet Hopper / Port (moves up in exploded mode) */}
      <mesh position={[0.5, 1.4 + inletOffset, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.45, 0.7, 16]} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Hopper 1: Small discharge hopper on the far left (moves down in exploded mode) */}
      <mesh position={[-1.4, -1.3 - outletOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.5, 0.22, 1.0, 16]} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Hopper 2: Large discharge hopper in the middle-left (moves down in exploded mode) */}
      <mesh position={[-0.3, -1.3 - outletOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.75, 0.35, 1.0, 16]} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Internal Sifting Screen Mesh Basket (slides out left) */}
      <mesh position={[screenOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 3.0, 32]} />
        <meshStandardMaterial {...matScreenMesh} />
      </mesh>

      {/* Rotor Shaft & Paddle assembly (opaque internals in X-Ray) */}
      <group ref={shaftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.0, 16]} />
          <meshStandardMaterial
            color={xray ? '#00daf8' : '#e2e8f0'}
            metalness={0.95}
            roughness={0.15}
            clippingPlanes={sectionActive ? planes : undefined}
            clipShadows={true}
          />
        </mesh>
        
        {/* Paddles */}
        {[-1.1, -0.4, 0.4, 1.1].map((xLoc, idx) => {
          const angle = (idx * Math.PI) / 2;
          const rad = 0.6 + paddleOffset;
          return (
            <group key={idx} rotation={[angle, 0, 0]} position={[xLoc, 0, 0]}>
              <mesh position={[0, rad, 0]} castShadow>
                <boxGeometry args={[0.22, 0.06, 0.85]} />
                <meshStandardMaterial
                  color={xray ? '#00daf8' : '#005f6d'}
                  metalness={0.95}
                  roughness={0.2}
                  emissive={xray ? '#00daf8' : '#000000'}
                  emissiveIntensity={xray ? 1.2 : 0}
                  clippingPlanes={sectionActive ? planes : undefined}
                  clipShadows={true}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Drive Motor (moves horizontally parallel under the right side of main chamber) */}
      <group position={[1.1 + motorOffset, -0.9, 0.75]} rotation={[0, 0, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 1.1, 16]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Fins */}
        {[0.3, 0.1, -0.1, -0.3].map((xOffset, i) => (
          <mesh key={i} position={[xOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} />
          </mesh>
        ))}
        {/* Connection bracket to main chamber / mounting plate */}
        <mesh position={[0, 0.4, -0.1]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial {...matPainted} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── LOADING PROGRESS COMPONENT ─── */
function LoaderHTML() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f8f9fa] z-10">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-[#005f6d] animate-spin" />
        <span className="font-sans text-sm font-bold text-gray-800 uppercase tracking-wider">
          Loading 3D Model... {Math.round(progress)}%
        </span>
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-[#005f6d] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN 3D VIEWER CONTAINER ─── */
export default function Product3DViewer() {
  const [viewMode, setViewMode] = useState('shaded');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  const containerRef = useRef(null);
  const interactionTimer = useRef(null);

  const product = PRODUCTS[0];

  useEffect(() => {
    const checkPerformance = () => {
      const concurrency = navigator.hardwareConcurrency || 4;
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      if (concurrency <= 4 || isTouch) {
        setIsLowEnd(true);
      }
    };
    checkPerformance();
  }, []);

  // Hotspot details
  const hotspots = [
    { name: 'Material Inlet', pos: [0.5, 1.7, 0], mat: 'Sanitary FDA Tri-Clamp', desc: 'Conical feed hopper inlet fitted with quick-release tri-clamp couplings.' },
    { name: 'Paddle Assembly', pos: [0, 0.5, 0.6], mat: 'Stainless Steel 316L (Polished)', desc: 'High-speed rotating paddles that fluidize powder against the screen mesh.' },
    { name: 'Tool-Free Screen Access', pos: [-0.1, 0, 1.45], mat: 'ASME-Grade SS316L', desc: 'Dual quick-access latch doors on the front face allowing inspection and screen swap.' },
    { name: 'Discharge Outlet', pos: [-0.85, -1.8, 0], mat: 'Stainless Steel 316L', desc: 'Separate gravity-fed discharge funnels for fines and oversize product.' },
    { name: 'Industrial Drive Motor', pos: [1.1, -1.0, 1.1], mat: 'Painted Alloy Casing', desc: 'Continuous duty motor configured horizontally underneath the chamber.' },
    { name: 'Outboard Bearing Assembly', pos: [1.65, 0, 0.6], mat: 'Outboard Roller Unit', desc: 'Double-sealed and gas-purged shaft seal housing preventing product contamination.' }
  ];

  // Handle interaction pause & delay resume auto-rotate
  const handleStart = () => {
    setIsInteracting(true);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  };

  const handleEnd = () => {
    interactionTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 5000); // Resume auto-rotate after 5 seconds of inactivity
  };

  useEffect(() => {
    return () => {
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, []);

  const handleReset = () => {
    setViewMode('shaded');
    setAutoRotate(true);
    setIsInteracting(false);
    setActiveHotspot(null);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        alert(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Fallback view when model fails to load
  const fallbackUI = (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-lg text-center shadow-xs">
      <img
        src={product.image}
        alt={product.name}
        className="max-h-[220px] object-contain mb-4 opacity-80"
      />
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs font-semibold max-w-sm">
        ⚠️ Interactive 3D model is currently unavailable.
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI}>
      <div
        ref={containerRef}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col relative w-full h-[400px] md:h-[500px] shadow-xs"
      >
        {/* Canvas Area */}
        <div className="w-full flex-grow relative bg-[#f3f4f6]">
          <Suspense fallback={<LoaderHTML />}>
            <Canvas
              shadows
              gl={{
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.SRGBColorSpace,
                antialias: true,
                localClippingEnabled: true
              }}
              // 3/4 Studio angle framing view on load
              camera={{ position: [4.5, 3.0, 4.5], fov: 40 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              <color attach="background" args={['#0d1516']} />

              {/* STUDIO LIGHTING CONFIGURATION */}
              <ambientLight intensity={viewMode === 'xray' ? 0.9 : 0.4} />
              <hemisphereLight skyColor="#ffffff" groundColor="#0f172a" intensity={0.3} />
              
              <directionalLight
                position={[6, 12, 6]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-6, 4, 3]} intensity={0.5} />
              <directionalLight position={[0, 4, -6]} intensity={0.7} />

              {/* 3D Model */}
              <SifterModel3D mode={viewMode} isLowEnd={isLowEnd} />

              {/* HDRI reflections preset (studio) - gated for higher end devices */}
              {!isLowEnd && <Environment preset="studio" />}

              {/* Soft Contact Shadow element */}
              <ContactShadows
                position={[0, -1.72, 0]}
                opacity={0.4}
                scale={10}
                blur={2.5}
                far={4}
              />

              {/* Interactive Numbered HTML Hotspots */}
              {hotspots.map((hot, idx) => (
                <Html key={hot.name} position={hot.pos} center distanceFactor={8}>
                  <div className="relative group">
                    <button
                      onClick={() => setActiveHotspot(hot)}
                      onMouseEnter={() => setHoveredHotspot(hot.name)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                      className={`w-6 h-6 rounded-full border-2 border-white text-white font-mono text-xs font-bold flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
                        activeHotspot?.name === hot.name ? 'bg-[#00daf8] scale-110' : 'bg-[#005f6d] hover:bg-[#00daf8]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                    
                    {/* Tooltip */}
                    {(hoveredHotspot === hot.name || activeHotspot?.name === hot.name) && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900/95 text-white text-xs font-sans font-bold uppercase tracking-wider rounded shadow-md whitespace-nowrap pointer-events-none border border-white/10 z-50">
                        {hot.name}
                      </div>
                    )}
                  </div>
                </Html>
              ))}

              <OrbitControls
                enableDamping
                dampingFactor={0.05}
                autoRotate={autoRotate && !isInteracting}
                autoRotateSpeed={0.8}
                onStart={handleStart}
                onEnd={handleEnd}
              />
            </Canvas>
          </Suspense>

          {/* Active Hotspot info panel */}
          {activeHotspot && (
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white border border-gray-200 rounded p-4.5 shadow-md z-10 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex justify-between items-start mb-2.5 border-b border-gray-100 pb-2">
                <div>
                  <h4 className="font-sans text-base font-bold text-gray-900 uppercase">
                    {activeHotspot.name}
                  </h4>
                  <span className="font-mono text-xs text-[#005f6d] font-bold uppercase">
                    Material: {activeHotspot.mat}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-normal">
                {activeHotspot.desc}
              </p>
            </div>
          )}
        </div>

        {/* View Mode controls bottom panel */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-wrap gap-2.5 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-600 uppercase tracking-wider font-black mr-1">
              Mode:
            </span>
            {[
              { id: 'shaded', label: 'Shaded' },
              { id: 'wireframe', label: 'Wireframe' },
              { id: 'exploded', label: 'Exploded' },
              { id: 'section', label: 'Section' },
              { id: 'xray', label: 'X-Ray' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`py-2 px-4 rounded text-xs font-sans font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  viewMode === mode.id
                    ? 'bg-[#005f6d] text-white border-[#005f6d]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* 3D Action Toolbar */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1.5 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotate"
              className={`p-1.5 rounded border cursor-pointer ${
                autoRotate ? 'bg-[#005f6d]/10 border-[#005f6d] text-[#005f6d]' : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-1.5 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

