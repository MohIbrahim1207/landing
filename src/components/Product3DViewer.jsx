import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, FileDown, RefreshCw, Layers, ShieldAlert, Sparkles } from 'lucide-react';

/* ─── PROCEDURAL 3D MODELS ─── */

// 1. ROTARY AIRLOCK VALVE MODEL
function RotaryValve3D({ mode, explodedOffset }) {
  const rotorRef = useRef();

  useFrame((state) => {
    if (rotorRef.current && mode !== 'exploded') {
      rotorRef.current.rotation.z += 0.008;
    }
  });

  const wire = mode === 'wireframe';
  const xray = mode === 'xray';
  const colorHousing = xray ? '#00e0ff' : '#475569';
  const colorRotor = xray ? '#baf2ff' : '#1e293b';
  const opacityHousing = xray ? 0.35 : 1.0;
  const opacityRotor = xray ? 0.6 : 1.0;
  const transparent = xray;

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Housing Cylindrical Shell */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 3, 32, 1, mode === 'section']} />
        <meshStandardMaterial
          color={colorHousing}
          wireframe={wire}
          roughness={0.2}
          metalness={0.8}
          transparent={transparent}
          opacity={opacityHousing}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flanged Inlet Top */}
      <mesh position={[0, 1.5 + explodedOffset, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial
          color={colorHousing}
          wireframe={wire}
          roughness={0.2}
          metalness={0.8}
          transparent={transparent}
          opacity={opacityHousing}
        />
      </mesh>

      {/* Flanged Outlet Bottom */}
      <mesh position={[0, -1.5 - explodedOffset, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial
          color={colorHousing}
          wireframe={wire}
          roughness={0.2}
          metalness={0.8}
          transparent={transparent}
          opacity={opacityHousing}
        />
      </mesh>

      {/* Internal Rotating Rotor Vanes */}
      <group ref={rotorRef} position={[0, 0, 0]}>
        {/* Rotor Core Shaft */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 3.4, 16]} />
          <meshStandardMaterial
            color={colorRotor}
            wireframe={wire}
            roughness={0.1}
            metalness={0.95}
            transparent={transparent}
            opacity={opacityRotor}
          />
        </mesh>
        {/* Vanes */}
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * Math.PI) / 4;
          const dist = 0.9 + explodedOffset * 0.5;
          return (
            <group key={idx} rotation={[0, 0, angle]}>
              <mesh position={[dist, 0, 0]} castShadow>
                <boxGeometry args={[1.0, 0.05, 2.9]} />
                <meshStandardMaterial
                  color={colorRotor}
                  wireframe={wire}
                  roughness={0.15}
                  metalness={0.9}
                  transparent={transparent}
                  opacity={opacityRotor}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Motor & Drive Module on side */}
      <mesh position={[0, 0, 1.8 + explodedOffset]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 16]} />
        <meshStandardMaterial color="#27272a" wireframe={wire} roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Fin elements for motor */}
      <mesh position={[0, 0, 2.4 + explodedOffset]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.6, 16]} />
        <meshStandardMaterial color="#18181b" wireframe={wire} roughness={0.6} />
      </mesh>

      {/* Bearings side housing */}
      <mesh position={[0, 0, -1.7 - explodedOffset]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#3f3f46" wireframe={wire} roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}

// 2. CENTRIFUGAL SIFTER MODEL
function CentrifugalSifter3D({ mode, explodedOffset }) {
  const shaftRef = useRef();

  useFrame((state) => {
    if (shaftRef.current && mode !== 'exploded') {
      shaftRef.current.rotation.x += 0.012;
    }
  });

  const wire = mode === 'wireframe';
  const xray = mode === 'xray';
  const colorOuter = xray ? '#00b4d8' : '#71717a';
  const colorInner = xray ? '#baf2ff' : '#27272a';
  const opacityOuter = xray ? 0.3 : 1.0;
  const transparent = xray;

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* Main horizontal sieving chamber barrel */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 4, 32, 1, mode === 'section']} />
        <meshStandardMaterial
          color={colorOuter}
          wireframe={wire}
          roughness={0.3}
          metalness={0.7}
          transparent={transparent}
          opacity={opacityOuter}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inlet hopper on top */}
      <mesh position={[-1.4, 1.2 + explodedOffset, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.3, 1, 16]} />
        <meshStandardMaterial
          color={colorOuter}
          wireframe={wire}
          roughness={0.3}
          transparent={transparent}
          opacity={opacityOuter}
        />
      </mesh>

      {/* Outlet discharge cone at bottom left */}
      <mesh position={[-1.4, -1.2 - explodedOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.5, 0.2, 1.2, 16]} />
        <meshStandardMaterial
          color={colorOuter}
          wireframe={wire}
          roughness={0.3}
          transparent={transparent}
          opacity={opacityOuter}
        />
      </mesh>
      {/* Fines discharge funnel bottom right */}
      <mesh position={[1.0, -1.2 - explodedOffset, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <cylinderGeometry args={[0.5, 0.15, 1.2, 16]} />
        <meshStandardMaterial
          color={colorOuter}
          wireframe={wire}
          roughness={0.3}
          transparent={transparent}
          opacity={opacityOuter}
        />
      </mesh>

      {/* Cantilever shaft with paddles inside */}
      <group ref={shaftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 4.4, 16]} />
          <meshStandardMaterial color={colorInner} wireframe={wire} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Paddles along shaft */}
        {[-1.2, -0.4, 0.4, 1.2].map((xOffset, idx) => {
          const angleOffset = (idx * Math.PI) / 2;
          return (
            <group key={idx} position={[0, 0, 0]}>
              <mesh
                position={[xOffset, Math.cos(angleOffset) * (0.6 + explodedOffset * 0.4), Math.sin(angleOffset) * (0.6 + explodedOffset * 0.4)]}
                rotation={[angleOffset, 0, 0]}
                castShadow
              >
                <boxGeometry args={[0.3, 0.08, 1.1]} />
                <meshStandardMaterial color="#00e0ff" wireframe={wire} emissive="#00e0ff" emissiveIntensity={xray ? 1.0 : 0.05} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Heavy Drive Motor on right end */}
      <mesh position={[2.5 + explodedOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 1.4, 16]} />
        <meshStandardMaterial color="#1e293b" wireframe={wire} roughness={0.4} />
      </mesh>
    </group>
  );
}

// 3. GENERIC INDUSTRIAL BLOCK (Homogenizer, Filters, etc.)
function GenericIndustrial3D({ mode, explodedOffset, type }) {
  const innerRef = useRef();

  useFrame(() => {
    if (innerRef.current && mode !== 'exploded') {
      innerRef.current.rotation.y += 0.01;
    }
  });

  const wire = mode === 'wireframe';
  const xray = mode === 'xray';
  const color = xray ? '#00e0ff' : '#4b5563';
  const opacity = xray ? 0.3 : 1.0;
  const transparent = xray;

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Shell Block / Cylinder */}
      {type === 'homogenizer' ? (
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 2.2, 2.2]} />
          <meshStandardMaterial
            color={color}
            wireframe={wire}
            roughness={0.2}
            metalness={0.8}
            transparent={transparent}
            opacity={opacity}
          />
        </mesh>
      ) : (
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.1, 3.2, 32, 1, mode === 'section']} />
          <meshStandardMaterial
            color={color}
            wireframe={wire}
            roughness={0.2}
            metalness={0.8}
            transparent={transparent}
            opacity={opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Flanged Inlet Top */}
      <mesh position={[0, 1.6 + explodedOffset, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
        <meshStandardMaterial color={color} wireframe={wire} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Outlet Bottom */}
      <mesh position={[0, -1.6 - explodedOffset, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
        <meshStandardMaterial color={color} wireframe={wire} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Internal working element (Pistons / Filter core) */}
      <group ref={innerRef} position={[0, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.4, 16]} />
          <meshStandardMaterial
            color={xray ? '#baf2ff' : '#00e0ff'}
            wireframe={wire}
            roughness={0.1}
            metalness={0.9}
            emissive="#00e0ff"
            emissiveIntensity={xray ? 1.0 : 0.05}
          />
        </mesh>
        {/* Radial discs */}
        {[-0.8, 0, 0.8].map((yLoc, idx) => (
          <mesh key={idx} position={[0, yLoc, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
            <meshStandardMaterial color="#1f2937" wireframe={wire} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Motor Block on side */}
      <mesh position={[1.6 + explodedOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />
        <meshStandardMaterial color="#1f2937" wireframe={wire} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ─── HOTSPOT ANCHORS ─── */
const HOTSPOTS_DATA = {
  'rotary-airlock': [
    { name: 'Rotor', pos: [0, 0.2, 0.5], mat: 'Stainless Steel 316L', desc: '8-vane precision bevelled rotor providing volumetric sealing.' },
    { name: 'Housing', pos: [-1.4, 0, 0], mat: 'Cast Iron / SS316', desc: 'CNC machined cylindrical barrel with strict tolerances.' },
    { name: 'Motor', pos: [0, 0, 2.3], mat: 'Alloy Fin Casing', desc: 'High-torque direct-drive gearmotor for continuous operations.' },
    { name: 'Bearings', pos: [0, 0, -2.1], mat: 'Outboard Roller Bearings', desc: 'Double row bearings isolated from fluid chamber to prevent contamination.' },
    { name: 'Inlet', pos: [0, 1.9, 0], mat: 'Flanged ANSI/DIN', desc: 'Inlet chute with shear protector deflector.' },
    { name: 'Outlet', pos: [0, -1.9, 0], mat: 'Flanged ANSI/DIN', desc: 'Discharge throat for gravity conveying lines.' }
  ],
  'centrifugal-sieving': [
    { name: 'Rotor', pos: [0, 0.6, 0.5], mat: 'Hygienic Paddles', desc: 'Rotating paddle assembly fluidizing dry bulk material.' },
    { name: 'Housing', pos: [-1.2, 0, 0], mat: 'SS316L Sheet Finish', desc: 'Cantilevered door and barrel shell for tool-free cleaning.' },
    { name: 'Motor', pos: [2.9, 0, 0], mat: 'Aluminium Enclosure', desc: 'Continuous duty high-speed motor rated under 70 dBA.' },
    { name: 'Bearings', pos: [1.8, 0, 0.4], mat: 'Sealed Double Bearings', desc: 'Heavy duty shaft support bearings.' },
    { name: 'Inlet', pos: [-1.4, 1.8, 0], mat: 'FDA Tri-Clamp', desc: 'Weir flow hopper feed controller.' },
    { name: 'Outlet', pos: [-1.4, -1.9, 0], mat: 'Discharge funnel', desc: 'Clean product oversize collection channel.' }
  ]
};

// Default hotspots for other blocks
const DEFAULT_HOTSPOTS = [
  { name: 'Rotor', pos: [0, 0.5, 0.4], mat: 'Sanitary SS316L', desc: 'Core mechanical process element.' },
  { name: 'Housing', pos: [-1.1, 0, 0], mat: 'SS316L Pressure Grade', desc: 'Pressure vessel barrel shell compliant with ASME Sec VIII.' },
  { name: 'Motor', pos: [1.9, 0, 0], mat: 'Direct-Drive Module', desc: 'Industrial drive with integrated safety guards.' },
  { name: 'Inlet', pos: [0, 1.8, 0], mat: 'Threaded / Tri-clamp', desc: 'Fluid feed line connection point.' },
  { name: 'Outlet', pos: [0, -1.8, 0], mat: 'Threaded / Tri-clamp', desc: 'Process discharge outlet piping.' }
];

export default function Product3DViewer({ productId }) {
  const [viewMode, setViewMode] = useState('shaded'); // shaded, wireframe, exploded, section, xray
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const containerRef = useRef(null);

  const hotspots = HOTSPOTS_DATA[productId] || DEFAULT_HOTSPOTS;
  const explodedOffset = viewMode === 'exploded' ? 0.6 : 0.0;

  const handleReset = () => {
    setViewMode('shaded');
    setAutoRotate(true);
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

  return (
    <div
      ref={containerRef}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col relative w-full h-[400px] md:h-[500px] shadow-xs"
    >
      {/* 3D Canvas area */}
      <div className="w-full flex-grow relative bg-gray-50">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 z-10">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 text-[#005f6d] animate-spin" />
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                  Loading 3D CAD...
                </span>
              </div>
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [4, 3, 5], fov: 45 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={viewMode === 'xray' ? 0.8 : 0.5} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-5, 5, -5]} intensity={0.4} />

            {/* Render model depending on id */}
            {productId === 'rotary-airlock' && (
              <RotaryValve3D mode={viewMode} explodedOffset={explodedOffset} />
            )}
            {productId === 'centrifugal-sieving' && (
              <CentrifugalSifter3D mode={viewMode} explodedOffset={explodedOffset} />
            )}
            {productId !== 'rotary-airlock' && productId !== 'centrifugal-sieving' && (
              <GenericIndustrial3D mode={viewMode} explodedOffset={explodedOffset} type={productId} />
            )}

            {/* Hotspots */}
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
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
            />
          </Canvas>
        </Suspense>

        {/* Active Hotspot Dialog */}
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

      {/* 3D View Modes Panel */}
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

        {/* Engineering 3D Toolbar */}
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
  );
}
