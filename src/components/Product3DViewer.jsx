import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, ContactShadows } from '@react-three/drei';
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
function SifterModel3D({ mode, explodedOffset }) {
  const shaftRef = useRef();

  useFrame(() => {
    if (shaftRef.current && mode !== 'exploded') {
      shaftRef.current.rotation.x += 0.01;
    }
  });

  const wire = mode === 'wireframe';
  const xray = mode === 'xray';
  
  // Materials specs matching client guidelines:
  // Stainless Steel: Metalness: 0.9, Roughness: 0.15
  // Painted Surfaces: Metalness: 0.3, Roughness: 0.45
  // Rubber Components: Metalness: 0, Roughness: 0.85
  const matStainless = {
    metalness: 0.9,
    roughness: 0.15,
    color: xray ? '#00e0ff' : '#e2e8f0', // bright polished look
    transparent: xray,
    opacity: xray ? 0.4 : 1.0,
    wireframe: wire,
    side: THREE.DoubleSide
  };

  const matPainted = {
    metalness: 0.3,
    roughness: 0.45,
    color: xray ? '#00b4d8' : '#64748b', // steel blue painted look
    transparent: xray,
    opacity: xray ? 0.3 : 1.0,
    wireframe: wire
  };

  const matRubber = {
    metalness: 0,
    roughness: 0.85,
    color: '#1e293b', // deep carbon grey (not black)
    wireframe: wire
  };

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* 1. Main outer screen chamber housing (ASME pressure-rated cylinder) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 3.8, 32, 1, mode === 'section']} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Flanged Inlet Hopper Top (Inlet) */}
      <mesh position={[-1.3, 1.3 + explodedOffset, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.4, 0.9, 16]} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Oversize Discharge Chute Bottom Left */}
      <mesh position={[-1.3, -1.3 - explodedOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.55, 0.3, 1.0, 16]} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Fines Funnel Discharge Bottom Right */}
      <mesh position={[1.1, -1.3 - explodedOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.55, 0.25, 1.0, 16]} />
        <meshStandardMaterial {...matStainless} />
      </mesh>

      {/* Rubber anti-vibration isolation mount rings */}
      <mesh position={[-1.3, 0.85, 0]} castShadow>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial {...matRubber} />
      </mesh>
      <mesh position={[1.1, -0.85, 0]} castShadow>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial {...matRubber} />
      </mesh>

      {/* 2. Cantilever shaft with sifting paddles inside */}
      <group ref={shaftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 4.2, 16]} />
          <meshStandardMaterial {...matStainless} color="#94a3b8" />
        </mesh>
        
        {/* Sifter paddles */}
        {[-1.1, -0.4, 0.4, 1.1].map((xLoc, idx) => {
          const angle = (idx * Math.PI) / 2;
          const rad = 0.65 + explodedOffset * 0.4;
          return (
            <group key={idx} rotation={[angle, 0, 0]} position={[xLoc, 0, 0]}>
              <mesh position={[0, rad, 0]} castShadow>
                <boxGeometry args={[0.25, 0.05, 0.9]} />
                <meshStandardMaterial
                  color={xray ? '#00e0ff' : '#005f6d'}
                  metalness={0.9}
                  roughness={0.15}
                  emissive={xray ? '#00e0ff' : '#000000'}
                  emissiveIntensity={xray ? 1.0 : 0}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 3. Heavy Duty Drive Motor (Painted finish) */}
      <mesh position={[2.4 + explodedOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 1.3, 16]} />
        <meshStandardMaterial {...matPainted} />
      </mesh>
      {/* Motor cooling fins */}
      <mesh position={[3.1 + explodedOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.58, 0.58, 0.2, 16]} />
        <meshStandardMaterial {...matRubber} />
      </mesh>
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
  const containerRef = useRef(null);
  const interactionTimer = useRef(null);

  const product = PRODUCTS[0]; // Centrifugal Sieving System

  // Hotspot details
  const hotspots = [
    { name: 'Rotor', pos: [0, 0.6, 0.5], mat: 'Stainless Steel 316L (Polished)', desc: 'Rotating paddle assembly that fluidizes raw powder against the mesh.' },
    { name: 'Housing', pos: [-1.2, 0, 0], mat: 'ASME-Grade SS316L', desc: 'Main cantilevered chamber barrel shell with quick-release door clamps.' },
    { name: 'Motor', pos: [2.8, 0, 0], mat: 'Painted Alloy Casing', desc: '1.5kW to 5.5kW continuous-duty industrial drive motor (<70 dBA).' },
    { name: 'Bearings', pos: [1.8, 0, 0.4], mat: 'Outboard Roller Assembly', desc: 'Double-sealed, dust-isolated bearing modules to prevent product ingress.' },
    { name: 'Inlet', pos: [-1.3, 1.8, 0], mat: 'Sanitary FDA Tri-Clamp', desc: 'Product feed connection point fitted with weir flow controller.' },
    { name: 'Outlet', pos: [-1.3, -1.8, 0], mat: 'Stainless Steel 316L', desc: 'Fines and oversize discharge funnel outputs.' }
  ];

  const explodedOffset = viewMode === 'exploded' ? 0.6 : 0.0;

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
                antialias: true
              }}
              // Centered camera offset slightly tilted for 3/4 engineering view
              camera={{ position: [3.8, 2.5, 4.2], fov: 45 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* Clean light studio coloring */}
              <color attach="background" args={['#f3f4f6']} />

              {/* STUDIO LIGHTING CONFIGURATION */}
              {/* 1. Ambient Light */}
              <ambientLight intensity={viewMode === 'xray' ? 0.9 : 0.45} />
              
              {/* 2. Hemisphere Light */}
              <hemisphereLight skyColor="#ffffff" groundColor="#cbd5e1" intensity={0.4} />

              {/* 3. Directional Key Light */}
              <directionalLight
                position={[6, 12, 6]}
                intensity={1.3}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
              />

              {/* 4. Fill Light */}
              <directionalLight position={[-6, 4, 3]} intensity={0.6} />

              {/* 5. Rim Light */}
              <directionalLight position={[0, 4, -6]} intensity={0.8} />

              {/* 3D Model */}
              <SifterModel3D mode={viewMode} explodedOffset={explodedOffset} />

              {/* Soft Contact Shadow element */}
              <ContactShadows
                position={[0, -1.8, 0]}
                opacity={0.3}
                scale={10}
                blur={2.4}
                far={4}
              />

              {/* Interactive HTML Hotspots */}
              {hotspots.map((hot) => (
                <Html key={hot.name} position={hot.pos} center distanceFactor={8}>
                  <button
                    onClick={() => setActiveHotspot(hot)}
                    className="w-5 h-5 rounded-full bg-[#005f6d] border-2 border-white text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    i
                  </button>
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
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white border border-gray-200 rounded p-4 shadow-md z-10 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex justify-between items-start mb-2 border-b border-gray-100 pb-1.5">
                <div>
                  <h4 className="font-sans text-sm font-bold text-gray-900 uppercase">
                    {activeHotspot.name}
                  </h4>
                  <span className="font-mono text-[9px] text-[#005f6d] font-bold uppercase">
                    Material: {activeHotspot.mat}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-600 leading-normal">
                {activeHotspot.desc}
              </p>
            </div>
          )}
        </div>

        {/* View Mode controls bottom panel */}
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-bold mr-1">
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
                className={`py-1 px-3 rounded text-[10px] font-sans font-bold uppercase tracking-wider border transition-all cursor-pointer ${
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
