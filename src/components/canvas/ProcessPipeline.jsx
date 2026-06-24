import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Static random pool for particle offsets (complies with React 19 purity rules)
const RANDOM_POOL = Array.from({ length: 1200 }, () => Math.random());

// Interactive hotspot marker with HTML overlays
function NodeHotspot({ position, title, subtitle, specs }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Invisible collider sphere for easy hovering */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Pulsing visual core */}
      <mesh scale={hovered ? 1.4 : 1.0}>
        <ringGeometry args={[0.0, 0.05, 16]} />
        <meshBasicMaterial color="#00e0ff" transparent opacity={0.9} />
      </mesh>

      {/* Rotating outer ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.08, 0.12, 6, 1]} />
        <meshBasicMaterial color="#00e0ff" transparent opacity={0.6} />
      </mesh>

      {/* Overlay Specs Card */}
      <Html distanceFactor={8} position={[0.25, 0.25, 0]}>
        <div
          className={`transition-all duration-300 transform origin-bottom-left select-none pointer-events-none ${
            hovered ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-2'
          }`}
        >
          <div className="glass-panel p-4 rounded-xl shadow-2xl border border-[#00e0ff]/30 w-56 pointer-events-auto bg-[#0d1516]/95 text-on-surface select-none">
            <span className="font-mono text-[9px] text-[#00e0ff] uppercase tracking-wider block mb-1">
              Active Node
            </span>
            <h4 className="font-sans text-xs font-black tracking-tight">{title}</h4>
            <p className="font-sans text-[10px] text-on-surface-variant mt-1 mb-2 leading-relaxed">{subtitle}</p>
            <div className="border-t border-white/10 pt-2 space-y-1.5">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between items-center text-[9px]">
                  <span className="font-mono text-on-surface-variant uppercase">{spec.label}</span>
                  <span className="font-mono text-[#00e0ff] font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function ProcessPipeline({ animationRef }) {
  const pointsRef = useRef(null);
  
  // Animation refs for rotating parts
  const piston1Ref = useRef(null);
  const piston2Ref = useRef(null);
  const piston3Ref = useRef(null);
  const rotaryValveRef = useRef(null);
  const fanRef = useRef(null);

  // 1. Continuous curve spline mapping through the factory nodes
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, -2.2, 0.0),  // Inlet pipe entry
      new THREE.Vector3(-3.0, -2.2, 0.0),  // Node 1: Homogenizer
      new THREE.Vector3(-1.5, -1.0, -0.4), // Node 2: Bag Filter
      new THREE.Vector3(0.0, 0.4, 0.0),    // Node 3: Self Cleaning Filter
      new THREE.Vector3(1.5, 1.8, 0.4),    // Node 4: Cyclone Separator
      new THREE.Vector3(3.0, 3.0, 0.0),    // Node 5: Dust Collector
      new THREE.Vector3(4.5, 3.0, 0.0),    // Outlet pipe exit
    ]);
  }, []);

  // 2. Setup particle offsets along the spline path
  const particleCount = 180;
  const particleData = useMemo(() => {
    const data = [];
    let rIdx = 0;
    for (let i = 0; i < particleCount; i++) {
      data.push({
        progress: RANDOM_POOL[rIdx++ % RANDOM_POOL.length],
        offset: new THREE.Vector3(
          (RANDOM_POOL[rIdx++ % RANDOM_POOL.length] - 0.5) * 0.12,
          (RANDOM_POOL[rIdx++ % RANDOM_POOL.length] - 0.5) * 0.12,
          (RANDOM_POOL[rIdx++ % RANDOM_POOL.length] - 0.5) * 0.12
        )
      });
    }
    return data;
  }, [particleCount]);

  const tempPosition = useMemo(() => new THREE.Vector3(), []);

  // 3. Render tick updates (Pistons, impellers, and fluid flow particles)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // Pistons stroke animation (Homogenizer) - Out of phase by 120 deg
    if (piston1Ref.current) piston1Ref.current.position.y = -2.2 + Math.sin(t * 8) * 0.25;
    if (piston2Ref.current) piston2Ref.current.position.y = -2.2 + Math.sin(t * 8 + (Math.PI * 2) / 3) * 0.25;
    if (piston3Ref.current) piston3Ref.current.position.y = -2.2 + Math.sin(t * 8 + (Math.PI * 4) / 3) * 0.25;

    // Spin Cyclone airlock rotary valve
    if (rotaryValveRef.current) rotaryValveRef.current.rotation.z = t * 3.5;

    // Spin dust collector exhaust fan
    if (fanRef.current) fanRef.current.rotation.y = t * 6;

    // Flow particles animation
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const baseSpeed = 0.35;
      
      // Speed increases slightly when user scrolls fast
      const scrollSpeed = animationRef?.current?.explode || 0;
      const speed = baseSpeed + scrollSpeed * 0.3;

      particleData.forEach((p, idx) => {
        p.progress += dt * speed;
        if (p.progress > 1) {
          p.progress = 0;
        }

        curve.getPointAt(p.progress, tempPosition);

        const tangent = curve.getTangentAt(p.progress);
        const normal = new THREE.Vector3(1, 0, 0).cross(tangent).normalize();
        if (normal.lengthSq() < 0.001) {
          normal.set(0, 0, 1).cross(tangent).normalize();
        }
        const binormal = tangent.clone().cross(normal).normalize();

        tempPosition.addScaledVector(normal, p.offset.x);
        tempPosition.addScaledVector(binormal, p.offset.y);

        positions[idx * 3] = tempPosition.x;
        positions[idx * 3 + 1] = tempPosition.y;
        positions[idx * 3 + 2] = tempPosition.z;
      });

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positionsArr = useMemo(() => {
    return new Float32Array(particleCount * 3);
  }, [particleCount]);

  return (
    <group>
      {/* ==================== A. Transparent Pipeline ==================== */}
      <mesh>
        <tubeGeometry args={[curve, 80, 0.22, 12, false]} />
        <meshPhysicalMaterial
          color="#00e0ff"
          transparent
          opacity={0.16}
          roughness={0.1}
          metalness={0.2}
          transmission={0.9}
          ior={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flange Join Rings along the pipeline */}
      {[-4.0, -2.2, -0.75, 0.8, 2.3, 3.8].map((x, i) => (
        <mesh key={i} position={[x, curve.getPointAt((x + 4.5) / 9).y, curve.getPointAt((x + 4.5) / 9).z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 16]} />
          <meshStandardMaterial color="#0f191b" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* ==================== B. Node 1: High Pressure Homogenizer ==================== */}
      <group position={[-3.0, 0, 0.0]}>
        {/* Base Block */}
        <mesh position={[0, -2.7, 0]}>
          <boxGeometry args={[1.0, 0.6, 0.8]} />
          <meshStandardMaterial color="#2a3f42" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Piston Cylinders */}
        <mesh position={[-0.3, -2.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.0, -2.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.3, -2.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Stroke Piston Shafts */}
        <mesh ref={piston1Ref} position={[-0.3, -2.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh ref={piston2Ref} position={[0.0, -2.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh ref={piston3Ref} position={[0.3, -2.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ==================== C. Node 2: Bag Filter Housing ==================== */}
      <group position={[-1.5, -1.0, -0.4]}>
        {/* Cylindrical Shell */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.9, 24]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Domed Lid */}
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0f191b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Support Legs */}
        <mesh position={[-0.35, -0.8, 0.2]} rotation={[0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#0f191b" metalness={0.8} />
        </mesh>
        <mesh position={[0.35, -0.8, 0.2]} rotation={[0.1, 0, -0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#0f191b" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.8, -0.38]} rotation={[-0.1, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#0f191b" metalness={0.8} />
        </mesh>
      </group>

      {/* ==================== D. Node 3: Self Cleaning Filter ==================== */}
      <group position={[0.0, 0.4, 0.0]}>
        {/* Core Cylinder */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.1, 24]} />
          <meshStandardMaterial color="#2a3f42" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Scraper Motor Housing on top */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.45, 0.35, 0.45]} />
          <meshStandardMaterial color="#0f191b" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Piston Actuator rod */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ==================== E. Node 4: Pneumatic Cyclone Separator ==================== */}
      <group position={[1.5, 1.8, 0.4]}>
        {/* Upper Cylinder */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.5, 16]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Lower Inverted Cone */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.36, 0.7, 16, 1, true]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.9} roughness={0.15} side={THREE.DoubleSide} />
        </mesh>
        {/* Airlock Valve Wheel at bottom */}
        <mesh ref={rotaryValveRef} position={[0, -0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ==================== F. Node 5: Dust Collector (Baghouse) ==================== */}
      <group position={[3.0, 3.0, 0.0]}>
        {/* Box Collector Chamber */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.9, 0.8]} />
          <meshStandardMaterial color="#2a3f42" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Hopper discharge cone below */}
        <mesh position={[0, -0.45, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.38, 0.4, 4]} />
          <meshStandardMaterial color="#1e2d30" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Air Stack Cylinder */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
          <meshStandardMaterial color="#0f191b" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Exhaust Fan Blades (Inside Stack) */}
        <mesh ref={fanRef} position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.01, 6]} />
          <meshStandardMaterial color="#00e0ff" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ==================== G. Fluid Flow Particles ==================== */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionsArr, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00e0ff"
          size={0.065}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ==================== H. Interactive Hotspots ==================== */}
      <NodeHotspot
        position={[-3.0, -1.7, 0.3]}
        title="High Pressure Homogenizer"
        subtitle="Triplex piston high-shear fluid reduction assembly for continuous emulsion stability."
        specs={[
          { label: "Piston Count", value: "3 Valves" },
          { label: "Pressure Max", value: "1,500 Bar" },
          { label: "Material", value: "316L Steel" },
        ]}
      />

      <NodeHotspot
        position={[-1.5, -0.4, 0.15]}
        title="Bag Filter Housing"
        subtitle="ASME VIII compliant dome pressure vessel housing multi-basket synthetic filters."
        specs={[
          { label: "Basket Count", value: "4 Bags" },
          { label: "Delta-P Drop", value: "0.08 Bar" },
          { label: "Compliance", value: "ASME VIII" },
        ]}
      />

      <NodeHotspot
        position={[0.0, 1.0, 0.45]}
        title="Self Cleaning Filter"
        subtitle="Automated wedge-wire liquid filtration featuring mechanical scraping triggers."
        specs={[
          { label: "Operation", value: "Pneumatic" },
          { label: "Scraper Stroke", value: "220 mm" },
          { label: "Waste Target", value: "Zero Loss" },
        ]}
      />

      <NodeHotspot
        position={[1.5, 2.5, 0.85]}
        title="Pneumatic Cyclone"
        subtitle="Tangential vortex bulk solids separator linked with rotary lock feeding valves."
        specs={[
          { label: "Vortex Rate", value: "32 m/s" },
          { label: "Rotary Speed", value: "45 RPM" },
          { label: "Feed Mode", value: "Airlock" },
        ]}
      />

      <NodeHotspot
        position={[3.0, 3.8, 0.4]}
        title="Industrial Dust Collector"
        subtitle="Pulse-jet baghouse collector stack capturing sub-micron process dust particles."
        specs={[
          { label: "Bag Area", value: "48 sq.m" },
          { label: "Fan Power", value: "7.5 kW" },
          { label: "ATEX Rating", value: "Zone 21" },
        ]}
      />
    </group>
  );
}
