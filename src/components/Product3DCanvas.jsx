import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, ContactShadows, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 1. HIGH-FIDELITY SCENE TIMELINE DATA ─── */
const SCENE_TIMELINE_DATA = {
  rotary_valve: {
    name: "USDA Rotary Airlock Valve",
    category: "Bulk Material Metering",
    accent: "#00e0ff",
    scenes: [
      {
        title: "USDA Rotary Valve",
        subtitle: "Sanitary Airlock Design",
        desc: "Designed for gravity feed and high-precision volumetric metering of dry bulk solids in food and dairy loops.",
        cameraPos: [0, 2.5, 7.5],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "Engineering Specs",
        desc: "Engineered to withstand heavy pressure drops while maintaining strict sanitary clearances.",
        specs: [
          { label: "Design Pressure", value: "Up to 1.5 bar g" },
          { label: "Sanitary Rating", value: "USDA Dairy & 3-A Certified" },
          { label: "Clearance Tolerance", value: "0.079 mm (0.003 in)" },
          { label: "Rotational Speed", value: "15 - 28 RPM" }
        ],
        standards: "FDA Compliant, 3-A Sanitary standard 09-13",
        cameraPos: [4.5, 1.2, 4.0],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "Core Mechanics",
        desc: "X-Ray mode reveals the inner rotor spinning. Dry powder is pocketed and metered through the airtight chamber without leakage.",
        coreTitle: "8-Vane Open End Rotor",
        coreDesc: "Precision bevel-edged rotor blades rotate continuously inside a machined cylindrical chamber, ensuring volumetric containment.",
        cameraPos: [0, 0.2, 3.8],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "Component Diagnostics",
        desc: "Select a mechanical component below to fly the camera directly to its coordinates for close inspection.",
        features: [
          {
            name: "Sanitary Rotor",
            position: [0.3, 0.3, 0.8],
            anchor: [0, 0, 0],
            desc: "SS316L rotor with 8 beveled vanes, polished to a 0.8µm Ra finish to eliminate bacterial harborages."
          },
          {
            name: "High-Torque Drive Motor",
            position: [0.5, 2.5, 0.5],
            anchor: [0, 2.2, 0],
            desc: "Direct-drive gearmotor providing continuous torque under dense powder load with cooling fin casings."
          },
          {
            name: "Sanitary Shaft Seal",
            position: [0.5, 1.8, 0.2],
            anchor: [0, 1.6, 0],
            desc: "Purged shaft seal assembly with quick-release split packing rings for rapid cleaning and zero product ingress."
          }
        ],
        cameraPos: [1.2, 2.2, 2.8],
        cameraTarget: [0, 1.2, 0],
      },
      {
        title: "Operational Metrics",
        desc: "Measured performance telemetry gathered during full-load powder conveying simulations.",
        metrics: [
          { label: "Gas Leakage Rate", value: "< 0.02 m³/min" },
          { label: "Volumetric Yield", value: "99.8%" },
          { label: "Maintenance Interval", value: "8,000 hrs" },
          { label: "Cleaning Speedup", value: "45%" }
        ],
        cameraPos: [-4.2, 0.8, 4.2],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "System Integration",
        desc: "Configure this airlock valve directly into your pneumatic conveying pipeline layout. Talk to our systems division.",
        cameraPos: [4.2, 2.2, 4.8],
        cameraTarget: [0, 0, 0],
      }
    ]
  },
  cyclone: {
    name: "High-Efficiency Cyclone Separator",
    category: "Centrifugal Separation",
    accent: "#00e0ff",
    scenes: [
      {
        title: "Cyclone Separator",
        subtitle: "High-Velocity Filtration",
        desc: "Utilizes high-speed centrifugal force to separate dry particles and bulk powder from conveying gas streams.",
        cameraPos: [0, 3.2, 7.8],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "Separation Specs",
        desc: "Engineered to remove up to 99% of dusty particulate prior to secondary baghouse filters.",
        specs: [
          { label: "Collection Efficiency", value: "99.2% (≥ 10µm)" },
          { label: "Operating Temp", value: "-20°C to 250°C" },
          { label: "Max Air Flow", value: "4,500 Nm³/hr" },
          { label: "Material Grade", value: "Heavy Wall SS304 / CS" }
        ],
        standards: "ASME Sec. VIII Division 1, ATEX Certified",
        cameraPos: [-4.8, 1.5, 3.8],
        cameraTarget: [0, 0.5, 0],
      },
      {
        title: "Vortex Mechanics",
        desc: "X-Ray mode exposes the high-speed swirling dust particle stream spiraling downward to the discharge cone.",
        coreTitle: "Dual-Vortex Flow Path",
        coreDesc: "Air spirals down the conical wall, throwing solids outward, while clean air rebounds upward in a narrow central vortex core.",
        cameraPos: [0, 0.8, 3.8],
        cameraTarget: [0, 0.8, 0],
      },
      {
        title: "Component Diagnostics",
        desc: "Select a cyclone feature to reposition the camera and review fluid dynamic designs.",
        features: [
          {
            name: "Tangential Feed Inlet",
            position: [-1.4, 2.3, 0.4],
            anchor: [-0.9, 2.0, 0],
            desc: "Incline helical inlet design that converts linear pneumatic flow into a high-velocity rotational spiral."
          },
          {
            name: "Primary Cyclone Chamber",
            position: [0.3, 1.6, 1.2],
            anchor: [0, 1.25, 0],
            desc: "Heavy-duty cylindrical drum where high-G centrifugal separation throws solid dust against the inner walls."
          },
          {
            name: "Dust Discharge Cone",
            position: [0.3, -1.5, 1.0],
            anchor: [0, -1.25, 0],
            desc: "Gradual conical slope designed to funnel separated bulk powders smoothly into the rotary airlock below."
          }
        ],
        cameraPos: [-2.0, 1.8, 2.5],
        cameraTarget: [-0.4, 1.0, 0],
      },
      {
        title: "Operational Metrics",
        desc: "Centrifugal performance ratings recorded under continuous catalyst conveying runs.",
        metrics: [
          { label: "Separation G-Force", value: "1,200 G" },
          { label: "Pressure Drop", value: "12 mbar" },
          { label: "Filter Life Ext.", value: "3.5x" },
          { label: "ATEX Zone Rating", value: "Zone 20/21" }
        ],
        cameraPos: [4.2, 0.5, 4.5],
        cameraTarget: [0, 0.5, 0],
      },
      {
        title: "System Integration",
        desc: "Integrate this high-efficiency separator into your chemical reactor or dust collection loops.",
        cameraPos: [-4.2, 2.0, 5.2],
        cameraTarget: [0, 0, 0],
      }
    ]
  },
  homogenizer: {
    name: "Triplex High Pressure Homogenizer",
    category: "High-Shear Micronization",
    accent: "#00e0ff",
    scenes: [
      {
        title: "BOS Homogenizer",
        subtitle: "Fluid Emulsification",
        desc: "Engineered for high-shear particle reduction, delivering ultra-stable emulsions and cell disruption in chemical and dairy plants.",
        cameraPos: [0, 2.2, 6.8],
        cameraTarget: [0, -0.4, 0],
      },
      {
        title: "Mechanical Specs",
        desc: "Forged block construction capable of running continuous duty cycles under extreme hydraulic load.",
        specs: [
          { label: "Maximum Pressure", value: "1,500 bar (21,750 psi)" },
          { label: "Pump Capacity", value: "3,200 L/hr" },
          { label: "Piston Type", value: "Ceramic / Tungsten Carbide" },
          { label: "Motor Power", value: "45 kW High-Eff" }
        ],
        standards: "ASME BPE, EHEDG Sanitary, CE Compliant",
        cameraPos: [4.5, 1.0, 3.8],
        cameraTarget: [0, -0.4, 0],
      },
      {
        title: "Piston Dynamics",
        desc: "X-Ray mode reveals the triplex reciprocating plungers driving fluid sequentially through the high-shear homogenizing valve.",
        coreTitle: "Triplex Reciprocating Pistons",
        coreDesc: "Three phase-shifted ceramic plungers pump in a continuous sinusoidal sequence to eliminate pressure pulsations.",
        cameraPos: [0, 0.8, 2.8],
        cameraTarget: [0, 0.6, 0.2],
      },
      {
        title: "Component Diagnostics",
        desc: "Select a component below to inspect the high-pressure manifold block and telemetry.",
        features: [
          {
            name: "Homogenizing Valve",
            position: [0.3, 1.4, 0.8],
            anchor: [0, 1.2, 0.4],
            desc: "Stellite high-shear valve seat where massive fluid acceleration disrupts particles down to sub-micron scales."
          },
          {
            name: "Digital Pressure Gauge",
            position: [0.3, -0.2, 1.5],
            anchor: [0, -0.4, 1.15],
            desc: "Telemetry-enabled high-pressure gauge monitoring manifold pressure with a vibrating sensor needle."
          },
          {
            name: "Reciprocating Plungers",
            position: [1.2, 0.8, 0.5],
            anchor: [1.0, 0.6, 0],
            desc: "Solid tungsten-carbide coated plunger rods reciprocating inside sanitary packed sleeves."
          }
        ],
        cameraPos: [1.0, 1.6, 2.2],
        cameraTarget: [0, 0.6, 0.4],
      },
      {
        title: "Operational Metrics",
        desc: "High-pressure diagnostic readings during continuous emulsion processing tests.",
        metrics: [
          { label: "Piston Phase Shift", value: "120°" },
          { label: "Shear Rate", value: "1.2x10⁶ s⁻¹" },
          { label: "Emulsion Stability", value: "99.6%" },
          { label: "Pulsation Damp", value: "98.5%" }
        ],
        cameraPos: [-3.8, 0.8, 4.2],
        cameraTarget: [0, -0.4, 0],
      },
      {
        title: "System Integration",
        desc: "Incorporate this high-pressure homogenizer block into your continuous inline emulsion processing plants.",
        cameraPos: [4.2, 1.8, 4.8],
        cameraTarget: [0, -0.4, 0],
      }
    ]
  },
  filter: {
    name: "Sanitary Bag Filter Housing",
    category: "Precision Liquid Filtration",
    accent: "#00e0ff",
    scenes: [
      {
        title: "Sanitary Bag Filter",
        subtitle: "Liquid Polishing Housing",
        desc: "Heavy-duty, ASME pressure-rated vertical liquid filter housing engineered for standard and high-capacity bag elements.",
        cameraPos: [0, 3.2, 7.2],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "Pressure Vessel Specs",
        desc: "Engineered to deliver high flow rates with minimum differential pressure drop.",
        specs: [
          { label: "Max Pressure Rating", value: "10 bar g at 150°C" },
          { label: "Liquid Capacity", value: "Up to 45 m³/hr" },
          { label: "Filter Bag Size", value: "Size 2 (x1 Element)" },
          { label: "Vessel Material", value: "SS316L Electro-polished" }
        ],
        standards: "ASME Section VIII, PED 2014/68/EU",
        cameraPos: [-4.8, 1.5, 3.8],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "Internal Elements",
        desc: "X-Ray mode exposes the internal stainless steel support basket holding the liquid filter bag in place.",
        coreTitle: "SS316 Mesh Support Basket",
        coreDesc: "Heavy perforated basket providing full mechanical support for the filter fabric bag under high hydraulic flow.",
        cameraPos: [0.2, -0.2, 3.4],
        cameraTarget: [0, -0.6, 0],
      },
      {
        title: "Component Diagnostics",
        desc: "Select a pressure vessel component below to examine clamp rings and sanitary inlets.",
        features: [
          {
            name: "Quick-Release Clamp Ring",
            position: [0.3, 1.8, 1.4],
            anchor: [0, 1.6, 0],
            desc: "Heavy-duty sanitary swing-bolt collar clamp providing rapid, tool-free opening for filter bag swaps."
          },
          {
            name: "Differential Pressure Sensor",
            position: [0.3, 2.2, 0.4],
            anchor: [0, 2.0, 0],
            desc: "Telemetry-enabled transmitter that monitors filter clogging by measuring the pressure drop."
          },
          {
            name: "Vessel Drain Valve",
            position: [0.3, -2.3, 0.5],
            anchor: [0, -2.1, 0],
            desc: "Sanitary flush-mounted drain port for rapid evacuation of residual liquids prior to filter changes."
          }
        ],
        cameraPos: [1.0, 2.0, 2.2],
        cameraTarget: [0, 1.6, 0],
      },
      {
        title: "Operational Metrics",
        desc: "Vessel flow telemetry gathered under nominal water polishing trials.",
        metrics: [
          { label: "Filtration Rating", value: "≥ 1.0 µm" },
          { label: "Clean Pressure Drop", value: "0.15 bar" },
          { label: "Bag Swap Downtime", value: "< 3 mins" },
          { label: "Surface Finish", value: "0.4µm Ra EP" }
        ],
        cameraPos: [3.8, 0.8, 4.2],
        cameraTarget: [0, 0, 0],
      },
      {
        title: "System Integration",
        desc: "Integrate this high-capacity sanitary filter housing directly into your beverage or pharmaceutical process loops.",
        cameraPos: [-4.2, 2.0, 5.0],
        cameraTarget: [0, 0, 0],
      }
    ]
  }
};

const getProductKey = (id) => {
  const lowercaseId = id.toLowerCase();
  if (lowercaseId.includes('rotary') || lowercaseId.includes('airlock') || lowercaseId.includes('valve')) return 'rotary_valve';
  if (lowercaseId.includes('cyclone') || lowercaseId.includes('separator')) return 'cyclone';
  if (lowercaseId.includes('homogenizer') || lowercaseId.includes('emulsifier')) return 'homogenizer';
  return 'filter';
};

/* ─── 2. CINEMATIC CAMERA CONTROLLER ─── */
function CinematicCameraController({ activeScene, activeFeatureIndex, productId, isManualMode, controlsRef }) {
  const { camera } = useThree();
  const productKey = getProductKey(productId);
  const timeline = SCENE_TIMELINE_DATA[productKey];
  const sceneData = timeline.scenes[activeScene];

  const targetPos = useRef(new THREE.Vector3(0, 1.5, 7.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  // Determine targeted coordinates based on active scene and active feature highlights
  useEffect(() => {
    if (isManualMode) return;

    // Default overview vectors
    let pos = sceneData.cameraPos;
    let target = sceneData.cameraTarget;

    // Scene 4: If focusing on a specific component, override position and target
    if (activeScene === 3 && activeFeatureIndex !== null && sceneData.features) {
      const feature = sceneData.features[activeFeatureIndex];
      if (feature) {
        target = feature.anchor;
        // Position camera relative to the component
        const offset = new THREE.Vector3(1.6, 0.8, 2.0);
        const hp = new THREE.Vector3(...feature.position);
        pos = hp.clone().add(offset).toArray();
      }
    }

    targetPos.current.set(...pos);
    targetLook.current.set(...target);
  }, [activeScene, activeFeatureIndex, productId, isManualMode, sceneData]);

  useFrame(() => {
    if (isManualMode) return;

    // Cinematic smooth interpolation (lerping)
    camera.position.lerp(targetPos.current, 0.045);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.045);
      controlsRef.current.update();
    }
  });

  return null;
}

/* ─── 3. SUBCOMPONENTS FOR INDIVIDUAL MODELS ─── */

// A. Rotary Valve Model
function RotaryValve3D({ accentColor, xRayMode }) {
  const rotorRef = useRef();

  useFrame((state) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x = state.clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Housing Casing */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 3.2, 32]} />
        <meshStandardMaterial
          color="#1e2a38"
          metalness={0.9}
          roughness={0.15}
          side={THREE.DoubleSide}
          transparent={xRayMode}
          opacity={xRayMode ? 0.15 : 1.0}
        />
      </mesh>

      {/* Flanges */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[2.3, 2.3, 0.2, 32]} />
        <meshStandardMaterial
          color="#2d3e50"
          metalness={0.9}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.15 : 1.0}
        />
      </mesh>
      <mesh position={[0, -1.6, 0]} castShadow>
        <cylinderGeometry args={[2.3, 2.3, 0.2, 32]} />
        <meshStandardMaterial
          color="#2d3e50"
          metalness={0.9}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.15 : 1.0}
        />
      </mesh>

      {/* Top Inlet Flange */}
      <group position={[0, 0, 1.9]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.2, 2.2, 0.4]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.95}
            roughness={0.2}
            transparent={xRayMode}
            opacity={xRayMode ? 0.15 : 1.0}
          />
        </mesh>
        <mesh position={[0, 0, 0.25]} castShadow rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.6, 2.6, 0.15]} />
          <meshStandardMaterial
            color="#2d3e50"
            metalness={0.9}
            roughness={0.15}
            transparent={xRayMode}
            opacity={xRayMode ? 0.15 : 1.0}
          />
        </mesh>
      </group>

      {/* Bottom Outlet Flange */}
      <group position={[0, 0, -1.9]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.2, 2.2, 0.4]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.95}
            roughness={0.2}
            transparent={xRayMode}
            opacity={xRayMode ? 0.15 : 1.0}
          />
        </mesh>
        <mesh position={[0, 0, -0.25]} castShadow rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.6, 2.6, 0.15]} />
          <meshStandardMaterial
            color="#2d3e50"
            metalness={0.9}
            roughness={0.15}
            transparent={xRayMode}
            opacity={xRayMode ? 0.15 : 1.0}
          />
        </mesh>
      </group>

      {/* Side Drive Motor & Gearbox */}
      <group position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.8, 1.4, 1.4]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.8}
            roughness={0.3}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
        <mesh castShadow position={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.6, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.85}
            roughness={0.25}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
        {[0.2, 0.5, 0.8, 1.1, 1.4].map((y, idx) => (
          <mesh key={idx} position={[y, 0, 0]} castShadow>
            <cylinderGeometry args={[0.76, 0.76, 0.05, 24]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={xRayMode ? 0.6 : 0.05}
            />
          </mesh>
        ))}
      </group>

      {/* Internal Rotating Rotor (Fully opaque and glowing in X-ray) */}
      <group ref={rotorRef}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 3.1, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
        </mesh>
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * Math.PI) / 4;
          return (
            <group key={idx} rotation={[0, 0, angle]}>
              <mesh position={[0.9, 0, 0]} castShadow>
                <boxGeometry args={[1.5, 0.08, 2.8]} />
                <meshStandardMaterial
                  color={xRayMode ? accentColor : "#334155"}
                  metalness={0.9}
                  roughness={0.15}
                  emissive={accentColor}
                  emissiveIntensity={xRayMode ? 0.6 : 0.0}
                />
              </mesh>
              <mesh position={[1.65, 0, 0]}>
                <boxGeometry args={[0.06, 0.08, 2.8]} />
                <meshStandardMaterial
                  color={accentColor}
                  emissive={accentColor}
                  emissiveIntensity={1.5}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// B. Cyclone Separator Model
function Cyclone3D({ accentColor, xRayMode }) {
  const particleCount = 130;
  const particlesRef = useRef();

  const particleData = useRef(
    Array.from({ length: particleCount }).map((_, i) => ({
      angle: (i * Math.PI * 2) / 15 + Math.random() * 0.5,
      y: 2.5 - (i * 5) / particleCount,
      speed: 0.025 + Math.random() * 0.015,
      radiusOffset: Math.random() * 0.12,
    }))
  );

  useFrame(() => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const p = particleData.current[i];
      p.angle += p.speed;

      let radius = 0.9;
      if (p.y < 0) {
        radius = 0.9 * (1 + (p.y / 2.5) * 0.72);
      }
      radius += p.radiusOffset;

      const x = Math.cos(p.angle) * radius;
      const z = Math.sin(p.angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = z;

      p.y -= 0.03;
      if (p.y < -2.5) {
        p.y = 2.5;
        p.angle = Math.random() * Math.PI * 2;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Upper Drum Casing */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 2.5, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={xRayMode ? 0.08 : 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Conical Lower Section */}
      <mesh position={[0, -1.25, 0]} castShadow>
        <cylinderGeometry args={[1.2, 0.35, 2.5, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={xRayMode ? 0.08 : 0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Exhaust Pipe */}
      <mesh position={[0, 2.9, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 24]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.9}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.2 : 1.0}
        />
      </mesh>

      {/* Tangential Inlet */}
      <mesh position={[-0.9, 2.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 24]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.9}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.2 : 1.0}
        />
      </mesh>

      {/* Bottom Flange */}
      <mesh position={[0, -2.6, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 24]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.95}
          roughness={0.1}
          transparent={xRayMode}
          opacity={xRayMode ? 0.2 : 1.0}
        />
      </mesh>

      {/* Animated Cyclone Particles (Brighter in X-ray) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(particleCount * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={accentColor}
          size={xRayMode ? 0.12 : 0.08}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner Central Vortex Core */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 5, 8]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={xRayMode ? 0.65 : 0.25}
        />
      </mesh>
    </group>
  );
}

// C. High Pressure Homogenizer Model
function Homogenizer3D({ accentColor, xRayMode }) {
  const piston1 = useRef();
  const piston2 = useRef();
  const piston3 = useRef();
  const dialRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * (xRayMode ? 8.0 : 5.5);
    if (piston1.current) piston1.current.position.y = Math.sin(time) * 0.45;
    if (piston2.current) piston2.current.position.y = Math.sin(time + (2 * Math.PI) / 3) * 0.45;
    if (piston3.current) piston3.current.position.y = Math.sin(time + (4 * Math.PI) / 3) * 0.45;

    if (dialRef.current) {
      dialRef.current.rotation.z = Math.PI / 4 + Math.sin(time * 2.0) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Main Frame */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[3.6, 1.6, 2.2]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.85}
          roughness={0.3}
          transparent={xRayMode}
          opacity={xRayMode ? 0.15 : 1.0}
        />
      </mesh>

      {/* Cover Plate */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[3.4, 0.4, 2.0]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.15 : 1.0}
        />
      </mesh>

      {/* 3 Pistons (Plungers) - Highlighted and fully opaque in X-ray */}
      {[-1.0, 0, 1.0].map((x, idx) => {
        const refs = [piston1, piston2, piston3];
        return (
          <group key={idx} position={[x, 0.6, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.8, 24]} />
              <meshStandardMaterial
                color="#334155"
                metalness={0.95}
                roughness={0.1}
                transparent={xRayMode}
                opacity={xRayMode ? 0.3 : 1.0}
              />
            </mesh>
            <mesh ref={refs[idx]} position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.9, 24]} />
              <meshStandardMaterial
                color={xRayMode ? accentColor : "#f8fafc"}
                metalness={0.99}
                roughness={0.05}
                emissive={accentColor}
                emissiveIntensity={xRayMode ? 0.8 : 0.0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Hydraulic Pipeline Manifold */}
      <mesh position={[0, 1.2, 0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 2.6, 16]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.98} roughness={0.05} />
      </mesh>
      {[-1.0, 0, 1.0].map((x, idx) => (
        <mesh key={idx} position={[x, 1.0, 0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.98} roughness={0.05} />
        </mesh>
      ))}

      {/* Pressure Telemetry Gauge */}
      <group position={[0, -0.4, 1.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.2, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.1, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 24]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} />
        </mesh>
        <group ref={dialRef} position={[0, 0.1, 0.13]} rotation={[0, 0, Math.PI / 4]}>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.03, 0.36, 0.01]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
        <mesh position={[0, -0.2, 0.12]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={2.5} />
        </mesh>
      </group>
    </group>
  );
}

// D. Sanitary Filter Vessel Model
function FilterVessel3D({ accentColor, xRayMode }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Vessel Body Tube */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 3.2, 32]} />
        <meshStandardMaterial
          color="#1e2a38"
          metalness={0.92}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.12 : 1.0}
        />
      </mesh>

      {/* Hemispherical Top Cap */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1e2a38"
          metalness={0.92}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.12 : 1.0}
        />
      </mesh>

      {/* Hemispherical Bottom Cap */}
      <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1e2a38"
          metalness={0.92}
          roughness={0.15}
          transparent={xRayMode}
          opacity={xRayMode ? 0.12 : 1.0}
        />
      </mesh>

      {/* Quick-release Flange Clamp Ring */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.18, 32]} />
        <meshStandardMaterial
          color="#2d3e50"
          metalness={0.95}
          roughness={0.1}
          transparent={xRayMode}
          opacity={xRayMode ? 0.2 : 1.0}
        />
      </mesh>
      {Array.from({ length: 8 }).map((_, idx) => {
        const angle = (idx * Math.PI) / 4;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        return (
          <mesh key={idx} position={[x, 1.6, z]} castShadow>
            <boxGeometry args={[0.08, 0.24, 0.08]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.99}
              roughness={0.1}
              transparent={xRayMode}
              opacity={xRayMode ? 0.2 : 1.0}
            />
          </mesh>
        );
      })}

      {/* Sanitary Side Inlet */}
      <group position={[-1.0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.8, 24]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.15}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.95}
            roughness={0.1}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
      </group>

      {/* Drainage Pipe on Bottom Cap */}
      <group position={[0, -2.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.8, 24]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.15}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.95}
            roughness={0.1}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
      </group>

      {/* Differential Pressure Sensor */}
      <group position={[0, 2.0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 12]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.95}
            roughness={0.1}
            transparent={xRayMode}
            opacity={xRayMode ? 0.2 : 1.0}
          />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Internal Filter Element Mesh Basket (Fully visible and glowing in X-ray) */}
      <group position={[0, -0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.92, 0.92, 2.0, 24, 1, true]} />
          <meshStandardMaterial
            color={xRayMode ? accentColor : "#64748b"}
            metalness={0.9}
            roughness={0.2}
            wireframe={true}
            emissive={accentColor}
            emissiveIntensity={xRayMode ? 1.0 : 0.0}
          />
        </mesh>
        {/* Support rings */}
        {[1.0, 0, -1.0].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <cylinderGeometry args={[0.93, 0.93, 0.05, 24, 1, true]} />
            <meshStandardMaterial
              color={accentColor}
              metalness={0.9}
              emissive={accentColor}
              emissiveIntensity={xRayMode ? 0.8 : 0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ─── 4. MAIN PRODUCT 3D CANVAS COMPONENT ─── */
export default function Product3DCanvas({ productId, accentColor }) {
  const [activeScene, setActiveScene] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isHoveredOverCanvas, setIsHoveredOverCanvas] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const controlsRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  const productKey = getProductKey(productId);
  const timeline = SCENE_TIMELINE_DATA[productKey];
  const activeSceneData = timeline.scenes[activeScene];

  // Synthesize a radial gradient alpha map for a premium ground plane fade-out
  const alphaMap = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Map slide name to render correct 3D model
  const renderModel = () => {
    const xRayMode = activeScene === 2; // Scene 3 is index 2

    switch (productKey) {
      case 'rotary_valve':
        return <RotaryValve3D accentColor={accentColor} xRayMode={xRayMode} />;
      case 'cyclone':
        return <Cyclone3D accentColor={accentColor} xRayMode={xRayMode} />;
      case 'homogenizer':
        return <Homogenizer3D accentColor={accentColor} xRayMode={xRayMode} />;
      default:
        return <FilterVessel3D accentColor={accentColor} xRayMode={xRayMode} />;
    }
  };

  // 1. Dynamic coordinates map for billboard label tags
  const LABEL_COORDINATES = {
    rotary_valve: {
      inlet: [0, 1.9, 0],
      shaft: [1.2, 2.2, 0],
      chamber: [0, 0, 0]
    },
    cyclone: {
      inlet: [-0.9, 2.0, 0],
      shaft: [0, 2.9, 0],
      chamber: [0, 1.25, 0]
    },
    homogenizer: {
      inlet: [0, 1.2, 0.4],
      shaft: [1.2, 0.8, 0.5],
      chamber: [0, 0.4, 0]
    },
    filter: {
      inlet: [-1.0, 0.8, 0],
      shaft: [0, 2.0, 0],
      chamber: [0, 0, 0]
    }
  };

  const coords = LABEL_COORDINATES[productKey] || LABEL_COORDINATES.filter;

  // 2. Fade in labels 1s after entering 3D mode
  useEffect(() => {
    setShowLabels(false);
    const timer = setTimeout(() => {
      setShowLabels(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [productId]);

  // 3. Programmatic Zoom UI Handlers
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const dir = new THREE.Vector3().subVectors(controls.object.position, controls.target).normalize();
      const newDist = Math.max(3.5, controls.object.position.distanceTo(controls.target) - 0.8);
      
      gsap.to(controls.object.position, {
        x: controls.target.x + dir.x * newDist,
        y: controls.target.y + dir.y * newDist,
        z: controls.target.z + dir.z * newDist,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => controls.update()
      });
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const dir = new THREE.Vector3().subVectors(controls.object.position, controls.target).normalize();
      const newDist = Math.min(12.0, controls.object.position.distanceTo(controls.target) + 0.8);
      
      gsap.to(controls.object.position, {
        x: controls.target.x + dir.x * newDist,
        y: controls.target.y + dir.y * newDist,
        z: controls.target.z + dir.z * newDist,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => controls.update()
      });
    }
  };

  // 4. Manual Orbit Interrupt & Auto-Resume Inactivity Timer
  const handleControlsStart = () => {
    setIsManualMode(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  };

  const handleControlsEnd = () => {
    resetInactivityTimer();
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setIsManualMode(false);
    }, 8000); // 8-second auto-resume timer
  };

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Jump directly to a scene via side dots
  const handleDotClick = (idx) => {
    setActiveScene(idx);
    setActiveFeatureIndex(null);
    setIsManualMode(false);
    resetInactivityTimer();
  };

  const handleFeatureClick = (idx) => {
    setActiveFeatureIndex(idx);
    setIsManualMode(false);
    resetInactivityTimer();
  };

  const activeFeature = activeScene === 3 && activeFeatureIndex !== null && activeSceneData.features
    ? activeSceneData.features[activeFeatureIndex]
    : null;

  return (
    <div
      onMouseEnter={() => setIsHoveredOverCanvas(true)}
      onMouseLeave={() => {
        setIsHoveredOverCanvas(false);
        setIsPointerDown(false);
      }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
      className={`w-full h-full relative bg-[#080f11] overflow-hidden select-none transition-all duration-300 ${
        isPointerDown ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* ─── WebGL Canvas ─── */}
      <Canvas
        camera={{ position: [0, 1.5, 7.5], fov: 45 }}
        shadows
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.4} />

        {/* Dynamic Studio Key Light */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Back Light */}
        <directionalLight
          position={[-5, 2, -5]}
          intensity={0.8}
          color={accentColor}
        />

        {/* Rim Light from below for dramatic industrial visual quality */}
        <directionalLight
          position={[0, -10, 0]}
          intensity={1.5}
          color="#00AEEF"
        />

        {/* Studio Stage */}
        <Stage
          intensity={0.5}
          environment="studio"
          adjustCamera={false}
          shadows={{ type: 'contact', opacity: 0.5, blur: 2.5 }}
        >
          {renderModel()}

          {/* WebGL 3D Leader Line */}
          {activeFeature && (
            <Line
              points={[activeFeature.anchor, activeFeature.position]}
              color={accentColor}
              lineWidth={1.5}
              transparent
              opacity={0.8}
            />
          )}

          {/* Floating 3D Hotspot Rings inside WebGL */}
          {activeScene === 3 && activeSceneData.features?.map((f, i) => {
            const isHighlighted = activeFeatureIndex === i;
            return (
              <group key={i} position={f.position}>
                <mesh>
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshBasicMaterial color={accentColor} />
                </mesh>
                
                <Html distanceFactor={5.5} center>
                  <button
                    onClick={() => handleFeatureClick(i)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isHighlighted
                        ? 'bg-[#00e0ff] scale-125 shadow-[0_0_15px_#00e0ff]'
                        : 'bg-[#080f11]/90 border border-[#00e0ff]/50 hover:bg-[#00e0ff]/25 hover:border-[#00e0ff] shadow-md'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full border border-[#00e0ff] animate-ping opacity-75 pointer-events-none" />
                    <span className={`text-[10px] font-black ${isHighlighted ? 'text-black' : 'text-[#00e0ff]'}`}>+</span>
                  </button>
                </Html>
              </group>
            );
          })}

          {/* Floating projected HUD labels in 3D Mode */}
          {showLabels && (
            <>
              {/* 1. INLET PORT */}
              <Html position={coords.inlet} center distanceFactor={6}>
                <div className="px-2.5 py-1 rounded-md bg-[#080f11]/90 backdrop-blur-sm border border-[#00e0ff]/40 text-[9px] font-bold text-white tracking-widest whitespace-nowrap shadow-[0_0_10px_rgba(0,224,255,0.25)] transition-all duration-1000 ease-out opacity-100 animate-fade-in uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff] inline-block mr-1.5 animate-pulse" />
                  INLET PORT
                </div>
              </Html>

              {/* 2. DRIVE SHAFT */}
              <Html position={coords.shaft} center distanceFactor={6}>
                <div className="px-2.5 py-1 rounded-md bg-[#080f11]/90 backdrop-blur-sm border border-[#00e0ff]/40 text-[9px] font-bold text-white tracking-widest whitespace-nowrap shadow-[0_0_10px_rgba(0,224,255,0.25)] transition-all duration-1000 ease-out opacity-100 animate-fade-in uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff] inline-block mr-1.5 animate-pulse" />
                  DRIVE SHAFT
                </div>
              </Html>

              {/* 3. SEALING CHAMBER */}
              <Html position={coords.chamber} center distanceFactor={6}>
                <div className="px-2.5 py-1 rounded-md bg-[#080f11]/90 backdrop-blur-sm border border-[#00e0ff]/40 text-[9px] font-bold text-white tracking-widest whitespace-nowrap shadow-[0_0_10px_rgba(0,224,255,0.25)] transition-all duration-1000 ease-out opacity-100 animate-fade-in uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff] inline-block mr-1.5 animate-pulse" />
                  SEALING CHAMBER
                </div>
              </Html>
            </>
          )}
        </Stage>

        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.6}
          scale={12}
          blur={2.4}
        />

        {/* Ground plane grid helper & reflection plane with radial fade-out */}
        <gridHelper args={[15, 15, "#00e0ff", "#1e293b"]} position={[0, -2.79, 0]} opacity={0.15} transparent />
        <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15, 15]} />
          <meshStandardMaterial
            color="#080f11"
            roughness={0.4}
            metalness={0.8}
            transparent
            opacity={0.6}
            alphaMap={alphaMap || undefined}
          />
        </mesh>

        {/* Orbit Camera Controls - autoRotate pauses on hover and resumes on leave */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          minDistance={3.5}
          maxDistance={12.0}
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={!isManualMode && activeScene !== 3 && !isHoveredOverCanvas}
          autoRotateSpeed={3.0} // Slow auto-rotation (0.3 deg/frame at 60fps)
          onStart={handleControlsStart}
          onEnd={handleControlsEnd}
        />

        {/* Cinematic Camera manager */}
        <CinematicCameraController
          activeScene={activeScene}
          activeFeatureIndex={activeFeatureIndex}
          productId={productId}
          isManualMode={isManualMode}
          controlsRef={controlsRef}
        />
      </Canvas>

      {/* ─── MINIMALIST UI OVERLAYS ─── */}

      {/* 1. Side-Dot Progress Navigation (Floating Left) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4.5 z-30">
        {Array.from({ length: 6 }).map((_, idx) => {
          const isActive = activeScene === idx;
          const labels = ["Reveal", "Specs", "X-Ray View", "Diagnostics", "Telemetry", "Showcase"];
          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="group relative flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            >
              <div 
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'border-[#00e0ff] bg-[#00e0ff]/10 shadow-[0_0_8px_rgba(0,224,255,0.5)]' 
                    : 'border-white/20 group-hover:border-white/50 bg-transparent'
                }`}
              >
                <div 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-[#00e0ff]' : 'bg-white/35 group-hover:bg-white/75'
                  }`}
                />
              </div>
              
              <span className="absolute left-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase bg-[#080f11]/95 border border-[#00e0ff]/20 py-1.5 px-3 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                {labels[idx]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Zoom UI Controls in bottom-right corner */}
      <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-30">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-[#080f11]/85 border border-white/10 text-[#00e0ff] hover:bg-[#00e0ff]/20 hover:border-[#00e0ff] transition-all duration-300 flex items-center justify-center font-black text-base cursor-pointer shadow-md"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-[#080f11]/85 border border-white/10 text-[#00e0ff] hover:bg-[#00e0ff]/20 hover:border-[#00e0ff] transition-all duration-300 flex items-center justify-center font-black text-base cursor-pointer shadow-md"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* 3. Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-30">
        <div 
          className="h-full bg-[#00e0ff] transition-all duration-500 shadow-[0_0_10px_rgba(0,224,255,0.6)]"
          style={{ width: `${(activeScene / 5) * 100}%` }}
        />
      </div>

      {/* 4. Dynamic Narrative Glassmorphic Panels (Slide-In) */}
      
      {/* SCENE 1: Hero Reveal Title Overlay */}
      {activeScene === 0 && (
        <div className="absolute bottom-10 left-10 right-10 md:left-1/2 md:right-auto md:-translate-x-1/2 text-left md:text-center pointer-events-none animate-fade-in z-20">
          <span className="font-mono text-xs text-[#00e0ff] tracking-widest uppercase mb-2.5 block font-bold">
            Digital Showroom • Flagship Model
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
            {timeline.name}
          </h1>
          <p className="text-on-surface-variant/80 text-xs md:text-sm max-w-md mx-auto mt-3 font-normal leading-relaxed">
            {activeSceneData.desc}
          </p>
        </div>
      )}

      {/* SCENE 2: Specifications Panel (Left Slide-in) */}
      {activeScene === 1 && activeSceneData.specs && (
        <div className="absolute left-6 top-20 bottom-16 w-80 bg-[#080f11]/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl overflow-y-auto scrollbar-none z-20 flex flex-col justify-between text-left transition-all duration-500 animate-slide-in">
          <div>
            <span className="font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase font-bold">
              Technical Datasheet
            </span>
            <h3 className="text-lg font-black text-white mt-1 uppercase">
              {activeSceneData.title}
            </h3>
            <p className="text-[11px] text-on-surface-variant/80 mt-2 leading-relaxed font-normal">
              {activeSceneData.desc}
            </p>
            
            <div className="space-y-4 mt-6">
              {activeSceneData.specs.map((spec, i) => (
                <div key={i} className="border-b border-white/5 pb-2">
                  <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase block">
                    {spec.label}
                  </span>
                  <span className="font-sans text-sm font-bold text-[#00e0ff] block mt-0.5">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <span className="font-mono text-[9px] text-on-surface-variant/50 uppercase block">
              Compliance Standards
            </span>
            <span className="font-mono text-[10px] text-white font-bold block mt-1">
              {activeSceneData.standards}
            </span>
          </div>
        </div>
      )}

      {/* SCENE 3: X-Ray Diagnostic Panel (Left Slide-in) */}
      {activeScene === 2 && (
        <div className="absolute left-6 top-20 bottom-16 w-80 bg-[#080f11]/85 backdrop-blur-md border border-[#00e0ff]/20 rounded-2xl p-6 shadow-2xl z-20 flex flex-col justify-between text-left transition-all duration-500 animate-slide-in">
          <div>
            <span className="font-mono text-[9px] text-red-500 tracking-widest uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              X-Ray Diagnostic Mode
            </span>
            <h3 className="text-lg font-black text-white mt-1 uppercase">
              {activeSceneData.title}
            </h3>
            <p className="text-[11px] text-on-surface-variant/80 mt-3 leading-relaxed font-normal">
              {activeSceneData.desc}
            </p>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 mt-6">
              <h4 className="text-xs font-bold text-[#00e0ff] uppercase">
                {activeSceneData.coreTitle}
              </h4>
              <p className="text-[10px] text-on-surface-variant/90 leading-relaxed font-normal">
                {activeSceneData.coreDesc}
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-[#00e0ff]/5 border border-[#00e0ff]/20 rounded-xl">
            <span className="font-mono text-[9px] text-[#00e0ff] uppercase font-bold block">
              Diagnostic Status
            </span>
            <span className="font-sans text-[11px] text-white font-bold block mt-0.5">
              Outer Shell: 15% Opacity • Core: Active
            </span>
          </div>
        </div>
      )}

      {/* SCENE 4: Component Highlight Diagnostics Panel (Left Slide-in) */}
      {activeScene === 3 && activeSceneData.features && (
        <div className="absolute left-6 top-20 bottom-16 w-80 bg-[#080f11]/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl z-20 flex flex-col justify-between text-left transition-all duration-500 animate-slide-in">
          <div>
            <span className="font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase font-bold">
              Engineering Diagnostics
            </span>
            <h3 className="text-lg font-black text-white mt-1 uppercase">
              {activeSceneData.title}
            </h3>
            <p className="text-[11px] text-on-surface-variant/80 mt-2 leading-relaxed font-normal">
              {activeSceneData.desc}
            </p>
            
            <div className="space-y-2.5 mt-6">
              {activeSceneData.features.map((feature, i) => (
                <button
                  key={i}
                  onClick={() => handleFeatureClick(i)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeFeatureIndex === i
                      ? 'bg-[#00e0ff]/10 border-[#00e0ff]/40 text-white shadow-sm'
                      : 'bg-white/1 border-white/5 text-on-surface-variant hover:border-white/15 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      activeFeatureIndex === i ? 'bg-[#00e0ff] animate-pulse' : 'bg-white/30'
                    }`} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {feature.name}
                    </span>
                  </div>
                  {activeFeatureIndex === i && (
                    <p className="text-[10px] text-on-surface-variant/90 mt-2 leading-relaxed font-normal">
                      {feature.desc}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-[9px] text-on-surface-variant/40 font-mono uppercase">
            Interactive CAD Mode • Select to Inspect
          </div>
        </div>
      )}

      {/* SCENE 5: Performance Telemetry Panel (Left Slide-in) */}
      {activeScene === 4 && activeSceneData.metrics && (
        <div className="absolute left-6 top-20 bottom-16 w-80 bg-[#080f11]/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl z-20 flex flex-col justify-between text-left transition-all duration-500 animate-slide-in">
          <div>
            <span className="font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase font-bold">
              Performance Telemetry
            </span>
            <h3 className="text-lg font-black text-white mt-1 uppercase">
              {activeSceneData.title}
            </h3>
            <p className="text-[11px] text-on-surface-variant/80 mt-2 leading-relaxed font-normal">
              {activeSceneData.desc}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              {activeSceneData.metrics.map((metric, i) => (
                <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-xl flex flex-col justify-between">
                  <span className="text-2xl font-black text-[#00e0ff] tracking-tight text-glow-accent leading-none">
                    {metric.value}
                  </span>
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold uppercase tracking-wider mt-2.5 leading-tight">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3.5 bg-green-500/5 border border-green-500/25 rounded-xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
            <div>
              <span className="text-[9px] font-mono text-green-500 uppercase font-bold block leading-none">
                SYSTEM HEALTH: NOMINAL
              </span>
              <span className="text-[8px] font-mono text-on-surface-variant/60 block mt-1 leading-none">
                Continuous Duty Rating: 100%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 6: Final Showcase CTA Panel (Right Slide-in) */}
      {activeScene === 5 && (
        <div className="absolute right-6 top-20 bottom-16 w-80 bg-[#080f11]/85 backdrop-blur-md border border-[#00e0ff]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,224,255,0.08)] z-20 flex flex-col justify-between text-left transition-all duration-500 animate-slide-in-right">
          <div>
            <span className="font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase font-bold">
              Showroom Final
            </span>
            <h3 className="text-lg font-black text-white mt-1 uppercase">
              {activeSceneData.title}
            </h3>
            <p className="text-[11px] text-on-surface-variant/80 mt-2 leading-relaxed font-normal">
              {activeSceneData.desc}
            </p>
            
            <div className="space-y-3 mt-8">
              <button 
                onClick={() => window.location.hash = 'rfq'}
                className="w-full py-3 px-4 rounded-xl bg-[#00e0ff] hover:bg-[#00daf8] text-[#0d1516] font-bold text-xs transition-all duration-300 shadow-[0_0_15px_rgba(0,224,255,0.2)] flex items-center justify-between group cursor-pointer"
              >
                <span>Request Technical Quote</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
              
              <a 
                href="https://flow-force.com/brochure.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/2 hover:border-[#00e0ff]/30 hover:bg-[#00e0ff]/5 text-white hover:text-[#00e0ff] font-bold text-xs transition-all duration-300 flex items-center justify-between group cursor-pointer"
              >
                <span>Download PDF Brochure</span>
                <span>↓</span>
              </a>
              
              <button 
                onClick={() => window.location.hash = 'rfq'}
                className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/2 hover:border-white/25 text-on-surface-variant hover:text-white font-bold text-xs transition-all duration-300 flex items-center justify-between group cursor-pointer"
              >
                <span>Talk to Systems Engineer</span>
                <span>☎</span>
              </button>
            </div>
          </div>
          
          <div className="text-[9px] text-on-surface-variant/40 font-mono uppercase">
            Flow Force Engineering • Precision Hardware
          </div>
        </div>
      )}
    </div>
  );
}
