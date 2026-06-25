import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  FlaskConical, 
  Building2, 
  Droplet, 
  Milk,
  Boxes,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Cpu,
  Filter,
  Sliders,
  Layers,
  Activity,
  Zap,
  Gauge,
  Play,
  Pause,
  Shield,
  RefreshCw,
  Wind
} from 'lucide-react';
import { images } from '../data/images';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Extended high-fidelity dataset for the Interactive B2B Capability Dashboard
const INDUSTRIES_DATA = [
  {
    name: "Food & Beverage",
    subtext: "Hygienic handling & processing",
    icon: Utensils,
    standards: "FDA, 3-A Sanitary, USDA",
    focus: "End-to-end solutions for hygienic handling, processing, and packaging with maximum safety and efficiency.",
    slides: [
      {
        name: "Main Process Plant",
        image: images.industries.foodProcessing,
        hotspots: [
          { x: 67, y: 21.5, dx: 5, dy: 0, label: "Cyclone Separator", desc: "Centrifugal air-material separator designed for high-efficiency powder collection without filter media." },
          { x: 42.5, y: 33.5, dx: 4, dy: 4, label: "Bag Filter Housing", desc: "Sanitary stainless steel pressure vessel housing multiple fabric filter bags for liquid polishing." },
          { x: 34.5, y: 55.5, dx: 5, dy: 0, label: "Rotary Valve", desc: "USDA-compliant rotary airlock valve metering ingredients while maintaining pressure differentials." },
          { x: 46, y: 55, dx: 4, dy: -4, label: "Pneumatic Conveying", desc: "Enclosed, sanitary dilute-phase conveying pipelines for dust-free powder transfer." },
          { x: 70.5, y: 54, dx: 0, dy: 6, label: "Dust Collector", desc: "Pulse-jet dust collector extraction hopper maintaining clean and safe ambient processing air." }
        ]
      },
      {
        name: "Pneumatic Conveying",
        image: images.products.pneumaticConveying,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Hygienic Conveying Line", desc: "Enclosed vacuum-pressure piping system optimized for fragile or abrasive dry bulk ingredients." }
        ]
      },
      {
        name: "Rotary Airlock",
        image: images.products.rotaryValve,
        hotspots: [
          { x: 50, y: 50, dx: 5, dy: 0, label: "USDA Rotary Valve", desc: "Quick-clean design with slide rails, ensuring zero bacterial growth and rapid disassembly." }
        ]
      },
      {
        name: "Centrifugal Separator",
        image: images.products.cycloneSeparator,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "High-Volume Cyclone", desc: "Removes up to 99% of bulk particulates before secondary filtration, extending filter lifecycle." }
        ]
      },
      {
        name: "Bag Filter",
        image: images.products.bagFilterHousing,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Filter Housing Vessel", desc: "Precision quick-bolt clamp design for rapid bag changes and minimal operational downtime." }
        ]
      },
      {
        name: "Dust Extraction",
        image: images.products.dustCollector,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "Pulse-Jet Extraction Unit", desc: "High-capacity dust collector with reverse-pulse cleaning, compliant with OSHA combustible dust rules." }
        ]
      }
    ],
    keySolutions: [
      { title: "Hygienic Conveying", desc: "Dust-free transfer of powders & granules", icon: Wind },
      { title: "Filtration & Dust Collection", desc: "Maintain clean & safe production environments", icon: Filter },
      { title: "Automation & Control", desc: "Smart systems for real-time monitoring & control", icon: Sliders },
      { title: "Bulk Handling Components", desc: "Valves, feeders, hoppers & connectors", icon: Layers }
    ],
    benefits: [
      { value: "98%", label: "System Reliability" },
      { value: "35%", label: "Reduced Downtime" },
      { value: "40%", label: "Energy Efficiency" },
      { value: "100%", label: "Export Quality" }
    ]
  },
  {
    name: "Dairy Processing",
    subtext: "Reliable & efficient dairy loops",
    icon: Milk,
    standards: "EHEDG, 3-A Sanitary, FDA",
    focus: "Ultra-hygienic processing loops and advanced emulsification systems engineered to optimize dairy product safety and shelf-life.",
    slides: [
      {
        name: "Dairy Plant Overview",
        image: images.industries.dairy,
        hotspots: [
          { x: 45, y: 40, dx: 5, dy: 0, label: "Homogenizer", desc: "BOS Series high-pressure homogenizer reducing fat globule sizes for stable milk emulsions." },
          { x: 60, y: 30, dx: 5, dy: 0, label: "EHEDG Filter", desc: "Sanitary inline filtration system protecting pasteurizers and filling lines." },
          { x: 30, y: 60, dx: -5, dy: 0, label: "Thermal Control", desc: "Double-wall thermal control units for precise pasteurization temperature regulation." },
          { x: 75, y: 50, dx: 0, dy: 6, label: "Storage Silo", desc: "Aseptic product storage silos featuring inert nitrogen gas blanketing." }
        ]
      },
      {
        name: "BOS Homogenizer",
        image: images.products.homogenizer,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "BOS Emulsifier", desc: "High-pressure micronization block delivering consistent particle size distribution." }
        ]
      },
      {
        name: "Sanitary Filtration",
        image: images.products.filtration,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Sanitary Filter Unit", desc: "Wedge-wire or mesh element designed for sterile liquid filtration and easy backwashing." }
        ]
      },
      {
        name: "Aseptic Silo",
        image: images.products.siloSystem,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "Sterile Product Storage", desc: "Pressure-rated storage silo with integrated CIP spray balls and temperature jackets." }
        ]
      },
      {
        name: "Sanitary Bag Vessel",
        image: images.products.bagFilterHousing,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Polishing Vessel", desc: "Removes trace particulate, ensuring milk, whey, or yoghurt clarity before packaging." }
        ]
      },
      {
        name: "Sanitary Conveyor",
        image: images.products.conveying,
        hotspots: [
          { x: 50, y: 50, dx: 5, dy: 0, label: "Enclosed Tubing Loop", desc: "Hygienic screw or drag conveyor moving powder additives without dust emissions." }
        ]
      }
    ],
    keySolutions: [
      { title: "Aseptic Processing", desc: "Ultra-hygienic loops for raw milk & cream", icon: RefreshCw },
      { title: "Sanitary Emulsification", desc: "High-pressure fat globule reduction", icon: Activity },
      { title: "Thermal Management", desc: "Double-wall precise temperature controls", icon: Gauge },
      { title: "Sterile Storage", desc: "Aseptic silos with nitrogen blanketing", icon: Layers }
    ],
    benefits: [
      { value: "99.2%", label: "Emulsion Stability" },
      { value: "45%", label: "Cleaning Speedup" },
      { value: "25%", label: "Thermal Savings" },
      { value: "100%", label: "USDA Compliance" }
    ]
  },
  {
    name: "Pharmaceutical",
    subtext: "Precision sterile filtration",
    icon: FlaskConical,
    standards: "USP Class VI, ASME BPE, cGMP",
    focus: "Total sterile isolation, absolute particulate filtration, and high-containment material transfer to prevent API cross-contamination.",
    slides: [
      {
        name: "Pharmaceutical Suite",
        image: images.industries.pharmaceutical,
        hotspots: [
          { x: 50, y: 35, dx: 5, dy: 0, label: "Sterile Liquid Filter", desc: "Absolute-rated cartridge filter housing for sterile drug product filtration." },
          { x: 68, y: 25, dx: 5, dy: 0, label: "ASME BPE Vessel", desc: "High-grade 316L stainless steel reaction vessel with ultra-low surface roughness." },
          { x: 35, y: 58, dx: -5, dy: 0, label: "Powder Airlock", desc: "High-containment split butterfly valve or airlock for potent API powder transfers." },
          { x: 42, y: 65, dx: 0, dy: 6, label: "Tri-Clamp Assembly", desc: "Crevice-free hygienic clamp connection preventing bacterial harborages." }
        ]
      },
      {
        name: "Sterile Filtration",
        image: images.products.filtration,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Absolute Cartridge Filter", desc: "Validatable multi-cartridge housing engineered for critical sterile drug filtration loops." }
        ]
      },
      {
        name: "ASME Reaction Tank",
        image: images.products.gasLiquidSeparator,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Hygienic Reaction Vessel", desc: "Jacketed vessel conforming to strict ASME BPE standards for biotech applications." }
        ]
      },
      {
        name: "Containment Airlock",
        image: images.products.rotaryValve,
        hotspots: [
          { x: 50, y: 50, dx: 5, dy: 0, label: "Micro-Feeder Airlock", desc: "High-precision containment valve dosing active pharmaceutical ingredients safely." }
        ]
      },
      {
        name: "Additives Conveyor",
        image: images.products.conveying,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Ultra-Pure Conveyor", desc: "Polished stainless steel conveying lines designed for zero-leak dry powder transport." }
        ]
      },
      {
        name: "HEPA Dust Collector",
        image: images.products.dustCollector,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "API Dust Collector", desc: "Explosion-proof HEPA filtration unit capturing hazardous active airborne drug dust." }
        ]
      }
    ],
    keySolutions: [
      { title: "Sterile Filtration", desc: "Absolute particulate capture under GMP", icon: Filter },
      { title: "Containment Transfer", desc: "High-containment active API airlocks", icon: Shield },
      { title: "ASME BPE Piping", desc: "Ultra-smooth tri-clamp weld assemblies", icon: Sliders },
      { title: "CIP/SIP Loops", desc: "Fully automated self-sterilization loops", icon: RefreshCw }
    ],
    benefits: [
      { value: "99.99%", label: "Sterile Assurance" },
      { value: "0%", label: "API Contamination" },
      { value: "50%", label: "Validation Speed" },
      { value: "100%", label: "FDA/cGMP Conformity" }
    ]
  },
  {
    name: "Chemical & Polymer",
    subtext: "Safe handling of chemicals",
    icon: Boxes,
    standards: "ATEX Zone 0/1, ASME Sec. VIII, ISO 9001",
    focus: "Conveying, blending, and filtering aggressive, corrosive, abrasive, or explosive chemical compounds under extreme parameters.",
    slides: [
      {
        name: "Chemical Plant Floor",
        image: images.industries.chemical,
        hotspots: [
          { x: 40, y: 30, dx: -5, dy: 0, label: "ASME Reactor", desc: "Teflon-lined ASME chemical reactor vessel resistant to highly acidic mixtures." },
          { x: 62, y: 25, dx: 5, dy: 0, label: "Self-Cleaning Filter", desc: "Pneumatic scraper filter continuously removing solids from viscous polymers." },
          { x: 30, y: 58, dx: 0, dy: 6, label: "Screw Conveyor", desc: "Heavy-duty abrasion-resistant screw conveyor conveying bulk raw catalysts." },
          { x: 70, y: 52, dx: 5, dy: 0, label: "ATEX Silo", desc: "Explosion-vented silo system with ATEX-certified grounding controls." }
        ]
      },
      {
        name: "ASME Chemical Silo",
        image: images.products.siloSystem,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Explosion-Vented Silo", desc: "Reinforced storage tank with rupture discs and inert gas purge manifolds." }
        ]
      },
      {
        name: "Self-Cleaning Filter",
        image: images.products.filtration,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Industrial Scraper Filter", desc: "Automatic self-cleaning mechanism prevents media clogging without flow interruption." }
        ]
      },
      {
        name: "ATEX Rotary Valve",
        image: images.products.rotaryValve,
        hotspots: [
          { x: 50, y: 50, dx: 5, dy: 0, label: "Flameproof Airlock", desc: "ATEX Zone 0/20 certified airlock acting as a flame barrier in conveying lines." }
        ]
      },
      {
        name: "Catalyst Conveyor",
        image: images.products.conveying,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Heavy-Duty Drag Link", desc: "Enclosed conveyor constructed of high-durability alloy to resist chemical wear." }
        ]
      },
      {
        name: "Explosion Collector",
        image: images.products.dustCollector,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "ATEX Dust Collector", desc: "Features spark detection, water-mist suppression, and explosion isolation valves." }
        ]
      }
    ],
    keySolutions: [
      { title: "Corrosion Resistance", desc: "Hastelloy & Teflon-lined ASME reactors", icon: Shield },
      { title: "ATEX-Rated Handling", desc: "Explosion-proof powder silos & feeders", icon: Zap },
      { title: "Self-Cleaning Filtration", desc: "Pneumatic scraper systems for slurries", icon: Filter },
      { title: "Heavy-Duty Conveying", desc: "Abrasive drag & screw conveyor setups", icon: Sliders }
    ],
    benefits: [
      { value: "100%", label: "ATEX Zone Safety" },
      { value: "60%", label: "Maintenance Drop" },
      { value: "30%", label: "Process Yield Gain" },
      { value: "99.8%", label: "Material Purity" }
    ]
  },
  {
    name: "Industrial Manufacturing",
    subtext: "Heavy-duty bulk bag plants",
    icon: Building2,
    standards: "OSHA Combustible Dust, ISO 9001",
    focus: "Large-scale continuous raw material transport, heavy-duty scrap separation, and facility safety through high-capacity dust extraction.",
    slides: [
      {
        name: "Heavy Manufacturing Line",
        image: images.industries.manufacturing,
        hotspots: [
          { x: 65, y: 30, dx: 5, dy: 0, label: "Baghouse Collector", desc: "Pulse-jet baghouse collector filtering large-volume flue gas and exhaust dust." },
          { x: 40, y: 55, dx: -5, dy: 0, label: "Conveying Pipeline", desc: "Dense phase pneumatic conveying pipeline transferring sand, cement, or minerals." },
          { x: 30, y: 40, dx: 0, dy: -6, label: "FIBC Unloader", desc: "Bulk bag unloading station featuring pneumatic massage paddles for sticky solids." },
          { x: 48, y: 60, dx: 5, dy: 0, label: "Rotary Airlock", desc: "Heavy-duty wear-resistant rotary feeder handling abrasive powders." }
        ]
      },
      {
        name: "Pulse-Jet Baghouse",
        image: images.products.dustCollector,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Heavy Baghouse Plant", desc: "Large filter area with high dust capacity, ideal for heavy minerals or steel mills." }
        ]
      },
      {
        name: "FIBC Bag Discharger",
        image: images.products.bulk_material_handling,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Bulk Bag Station", desc: "Dust-tight bag clamp and integrated hoist, ensuring clean discharge of raw materials." }
        ]
      },
      {
        name: "Raw Materials Conveyor",
        image: images.products.conveying,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "High-Capacity Line", desc: "Dilute or dense-phase conveyor transferring tons of dry bulk solids per hour." }
        ]
      },
      {
        name: "High-Pressure Airlock",
        image: images.products.rotaryValve,
        hotspots: [
          { x: 50, y: 50, dx: 5, dy: 0, label: "Wear-Treated Valve", desc: "Hard-chrome plated rotor blades designed to meter high-abrasion bulk solids." }
        ]
      },
      {
        name: "Storage Silo Loop",
        image: images.products.siloSystem,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "Bulk Material Silo", desc: "High-tonnage steel storage silos with fluidizing cones to prevent bridging." }
        ]
      }
    ],
    keySolutions: [
      { title: "Dense Phase Conveying", desc: "High-capacity low-velocity bulk pipeline transfer", icon: Wind },
      { title: "Baghouse Dust Capture", desc: "Pulse-jet dust and fume extraction plants", icon: Filter },
      { title: "Bulk Bag Discharging", desc: "Dust-tight FIBC big bag unloading stations", icon: Layers },
      { title: "Heavy-Duty Airlocks", desc: "Wear-resistant high-pressure rotary feeders", icon: Cpu }
    ],
    benefits: [
      { value: "99.9%", label: "Dust Capture Efficiency" },
      { value: "40%", label: "Equipment Life Bump" },
      { value: "20%", label: "Throughput Increase" },
      { value: "100%", label: "OSHA Dust Compliance" }
    ]
  },
  {
    name: "Water Treatment",
    subtext: "Automated municipal water loops",
    icon: Droplet,
    standards: "NSF/ANSI 61, AWWA Standards",
    focus: "High-volume filtration of intake water, process water loop treatment, and automated particle extraction to protect downstream capital equipment.",
    slides: [
      {
        name: "Water Treatment Plant",
        image: images.industries.waterTreatment,
        hotspots: [
          { x: 50, y: 35, dx: 5, dy: 0, label: "Backwash Strainer", desc: "Automatic backwashing strainer continuously removing sand and organic debris." },
          { x: 65, y: 25, dx: 5, dy: 0, label: "Multi-Bag Housing", desc: "Parallel liquid filter vessels providing high-flow polishing of plant effluent." },
          { x: 35, y: 55, dx: -5, dy: 0, label: "Cyclone Well", desc: "Grit separators extracting heavy sand and silt from raw intake waters." },
          { x: 72, y: 50, dx: 0, dy: 6, label: "DP Manifold", desc: "Differential pressure transmitter manifold triggers automated backwash cycles." }
        ]
      },
      {
        name: "Backwash Strainer",
        image: images.products.filtration,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Auto Self-Cleaning Strainer", desc: "Motorized internal backwash arm cleans the screen without interrupting primary flow." }
        ]
      },
      {
        name: "Cyclone Grit Separator",
        image: images.products.cycloneSeparator,
        hotspots: [
          { x: 50, y: 40, dx: 5, dy: 0, label: "Hydrocyclone Well", desc: "Uses centrifugal force to separate dense sand particles from incoming water streams." }
        ]
      },
      {
        name: "Multi-Bag Vessel",
        image: images.products.bagFilterHousing,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Multi-Bag Liquid Vessel", desc: "High-capacity filtration house with up to 12 filter bags for high-volume polishing." }
        ]
      },
      {
        name: "Gas-Liquid Separator",
        image: images.products.gasLiquidSeparator,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Degassing Vessel", desc: "Removes entrained air, carbon dioxide, or hydrogen sulfide gases from treated water." }
        ]
      },
      {
        name: "Pumping Pipeline Loop",
        image: images.products.conveying,
        hotspots: [
          { x: 50, y: 45, dx: 5, dy: 0, label: "Chemical Dosing Loop", desc: "Enclosed piping loop injecting precise chlorine or flocculant additives safely." }
        ]
      }
    ],
    keySolutions: [
      { title: "Auto-Backwash Strainers", desc: "Self-cleaning municipal intake filtration", icon: RefreshCw },
      { title: "High-Volume Separation", desc: "Cyclone separators for heavy grit removal", icon: Gauge },
      { title: "Multi-Bag Housings", desc: "Parallel high-flow water polishing systems", icon: Layers },
      { title: "DP Manifold Controls", desc: "Smart pressure differential monitoring loops", icon: Sliders }
    ],
    benefits: [
      { value: "98.5%", label: "Membrane Protection" },
      { value: "70%", label: "Less Water Waste" },
      { value: "15%", label: "Chemical Savings" },
      { value: "100%", label: "NSF/ANSI 61 Compliant" }
    ]
  }
];

// Subcomponent for 3D tilt and hover effects on the main page grid cards
function IndustryCard({ ind, index, onClick }) {
  const cardRef = useRef(null);
  const IconComponent = ind.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // rotation angle (max 10 degrees tilt)
    const rotateX = ((centerY - y) / centerY) * 10; 
    const rotateY = ((x - centerX) / centerX) * 10; 

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(index)}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="industry-card group relative h-72 rounded-2xl overflow-hidden glass-panel p-1 flex flex-col justify-end border-white/5 border hover:border-[#00e0ff]/30 transition-colors duration-500 will-change-transform cursor-pointer shadow-lg hover:shadow-[#00e0ff]/5"
    >
      {/* Background Image with Zoom and overlay */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" style={{ transform: 'translateZ(-10px)' }}>
        <img 
          src={ind.slides[0].image} 
          alt={ind.name} 
          loading="lazy" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1516] via-[#0d1516]/85 to-[#0d1516]/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-6 space-y-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#00e0ff]/10 rounded-lg border border-[#00e0ff]/20 text-[#00e0ff]">
            <IconComponent className="w-5.5 h-5.5" />
          </div>
          <h3 className="font-sans text-xl font-bold text-on-surface group-hover:text-[#00e0ff] transition-colors duration-300">
            {ind.name}
          </h3>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
          {ind.focus}
        </p>
        <span className="font-mono text-[9px] text-[#00e0ff]/60 tracking-wider uppercase block pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to open interactive showroom →
        </span>
      </div>
    </div>
  );
}

export default function IndustriesSection() {
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [hoveredHotspotIndex, setHoveredHotspotIndex] = useState(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Drag interaction states
  const [dragStartX, setDragStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndustry = INDUSTRIES_DATA[activeIndex];
  const activeSlide = activeIndustry.slides[activeSlideIndex];

  useGSAP(() => {
    gsap.from('.industry-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }, { scope: containerRef });

  // Autoplay Effect
  useEffect(() => {
    if (!isAutoplay || !isModalOpen) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoplay, isModalOpen, activeSlideIndex]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePrevSlide();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, activeSlideIndex]);

  // Open modal
  const openModal = (index) => {
    setActiveIndex(index);
    setActiveSlideIndex(0);
    setIsAutoplay(true);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % activeIndustry.slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + activeIndustry.slides.length) % activeIndustry.slides.length);
  };

  // Viewport Parallax Mouse Events
  const handleMouseMoveViewport = (e, viewportEl) => {
    if (!viewportEl) return;
    const rect = viewportEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offset = {
      x: ((x - centerX) / centerX) * 8,
      y: ((y - centerY) / centerY) * 8
    };
    setParallaxOffset(offset);
  };

  const handleMouseLeaveViewport = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  // Drag-to-Scrub Handlers
  const handleDragStart = (clientX) => {
    setDragStartX(clientX);
    setIsDragging(true);
    setIsAutoplay(false); // Pause autoplay on interaction
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || dragStartX === null) return;
    const deltaX = clientX - dragStartX;
    if (Math.abs(deltaX) > 85) { // 85px drag threshold
      if (deltaX > 0) {
        handlePrevSlide();
      } else {
        handleNextSlide();
      }
      setDragStartX(clientX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartX(null);
  };

  return (
    <section ref={containerRef} className="py-32 bg-[#0c1213] relative overflow-hidden">
      {/* Subtle lighting overlay */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00e0ff]/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            Versatility By Design
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Supporting Core Industries
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            Our systems are engineered to perform under the exact hygienic, chemical, and physical demands of key global sectors. Click any card to view detailed specifications.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES_DATA.map((ind, index) => (
            <IndustryCard 
              key={ind.name} 
              ind={ind} 
              index={index} 
              onClick={openModal} 
            />
          ))}
        </div>
      </div>

      {/* ─── Ultra-Premium Digital Showroom Interactive Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080f11]/98 backdrop-blur-2xl p-0 md:p-4 overflow-hidden select-none"
          >
            {/* Modal Wrapper Frame */}
            <motion.div 
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-full h-full md:h-auto md:max-w-7xl bg-gradient-to-br from-[#0c1213]/98 to-[#080f11]/99 border-0 md:border border-white/10 rounded-none md:rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between aspect-auto md:min-h-[90vh] lg:min-h-0 lg:aspect-[16/9.5]"
            >
              {/* Top Bar with Brand, Navigation and Close Button */}
              <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-white/5 shrink-0 bg-[#080f11]/65">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                  <img 
                    src={images.logo} 
                    alt="Flow Force Logo" 
                    className="h-8 w-auto object-contain"
                  />
                  <div className="h-4 w-px bg-white/10 hidden sm:block" />
                  <span className="font-mono text-[9px] text-glow-accent text-[#00e0ff] font-semibold tracking-widest uppercase hidden sm:inline-block">
                    DIGITAL SHOWROOM
                  </span>
                </div>

                {/* Center Navigation Links */}
                <div className="hidden lg:flex items-center gap-8">
                  {['SYSTEMS', 'SOLUTIONS', 'ABOUT', 'PROCESS', 'RFQ'].map((link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      onClick={closeModal}
                      className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-[#00e0ff] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  ))}
                </div>

                {/* Action and Close Controls */}
                <div className="flex items-center gap-4">
                  <a
                    href="#rfq"
                    onClick={closeModal}
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-[#00e0ff] hover:bg-[#00daf8] text-[#0d1516] font-bold rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,224,255,0.2)] text-xs group"
                  >
                    Request Quote
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <button 
                    onClick={closeModal}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-on-surface-variant hover:text-red-500 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    aria-label="Close showroom"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Main Three-Column Dashboard Grid */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100%-76px)]">
                
                {/* ─── Column 1: Left Panel - Industry Solutions Selector ─── */}
                <div className="lg:col-span-3 border-r border-white/5 p-5 md:p-6 overflow-y-auto bg-[#080f11]/30 scrollbar-none">
                  <h5 className="font-mono text-[10px] text-[#00e0ff] tracking-widest uppercase font-semibold mb-5 text-left block">
                    Industry Solutions
                  </h5>
                  <div className="space-y-3">
                    {INDUSTRIES_DATA.map((ind, index) => {
                      const IconComponent = ind.icon;
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={ind.name}
                          onClick={() => {
                            setActiveIndex(index);
                            setActiveSlideIndex(0); // Reset slide on sector switch
                          }}
                          className={`relative w-full flex items-center gap-4 p-4 rounded-xl text-left border transition-all duration-500 group cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#00e0ff]/10 to-[#00e0ff]/2 border-[#00e0ff]/30 shadow-[0_0_20px_rgba(0,224,255,0.08)]'
                              : 'bg-white/1 border-white/5 hover:bg-white/3 hover:border-white/10'
                          }`}
                        >
                          {/* Active Left Neon Marker */}
                          <div className={`absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-md transition-all duration-500 ${
                            isActive ? 'bg-[#00e0ff] h-1/2' : 'bg-transparent h-0'
                          }`} />

                          {/* Icon Container */}
                          <div className={`p-2.5 rounded-lg border transition-all duration-500 ${
                            isActive 
                              ? 'bg-[#00e0ff]/10 border-[#00e0ff]/30 text-[#00e0ff] shadow-[0_0_10px_rgba(0,224,255,0.15)]' 
                              : 'bg-white/3 border-white/8 text-on-surface-variant group-hover:text-[#00e0ff] group-hover:border-[#00e0ff]/20'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>

                          {/* Info Text */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs md:text-sm font-bold tracking-tight transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-on-surface group-hover:text-[#00e0ff]'
                            }`}>
                              {ind.name}
                            </h4>
                            <p className="text-[10px] text-on-surface-variant/60 truncate mt-0.5">
                              {ind.subtext}
                            </p>
                          </div>

                          {/* Active Neon Caret pointing to viewport */}
                          {isActive && (
                            <div 
                              className="absolute -right-[13px] top-1/2 -translate-y-1/2 w-3.5 h-6 bg-[#00e0ff] z-20 hidden lg:block"
                              style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ─── Column 2: Center Panel - Viewport & Gallery ─── */}
                <div className="lg:col-span-6 p-5 md:p-6 flex flex-col justify-between overflow-y-auto bg-[#080f11]/15 scrollbar-none border-r lg:border-r-0 border-white/5">
                  {/* Title Header */}
                  <div className="mb-4 text-left">
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {activeIndustry.name} Industry
                    </h3>
                    <p className="text-xs text-on-surface-variant/80 mt-1 max-w-xl leading-relaxed">
                      {activeIndustry.focus}
                    </p>
                  </div>

                  {/* 3D-Like Viewport */}
                  <div 
                    id="showroom-viewport"
                    onMouseMove={(e) => handleMouseMoveViewport(e, e.currentTarget)}
                    onMouseLeave={handleMouseLeaveViewport}
                    onMouseDown={(e) => handleDragStart(e.clientX)}
                    onMouseMoveCapture={(e) => handleDragMove(e.clientX)}
                    onMouseUp={handleDragEnd}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                    className="relative aspect-[16/10] md:aspect-[16/9.5] w-full bg-[#080f11] border border-white/10 rounded-2xl overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing group"
                  >
                    {/* Viewport Image Render */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeSlideIndex}
                          src={activeSlide.image}
                          alt={activeSlide.name}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1.05 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full object-cover select-none pointer-events-none"
                          style={{
                            transform: `scale(1.05) translate(${-parallaxOffset.x}px, ${-parallaxOffset.y}px)`,
                            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        />
                      </AnimatePresence>
                    </div>

                    {/* Dark gradient vignette over viewport */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />

                    {/* SVG Connector Lines */}
                    <svg 
                      className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                      viewBox="0 0 100 100" 
                      preserveAspectRatio="none"
                      style={{
                        transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {activeSlide.hotspots?.map((h, i) => (
                        <motion.line
                          key={`${activeSlideIndex}-${i}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.4 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          x1={h.x}
                          y1={h.y}
                          x2={h.x + (h.dx || 0)}
                          y2={h.y + (h.dy || 0)}
                          stroke="#00e0ff"
                          strokeWidth="0.3"
                          strokeDasharray="1, 1"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </svg>

                    {/* Hotspot Target Markers & Tooltips */}
                    <div 
                      className="absolute inset-0 z-20 pointer-events-none"
                      style={{
                        transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {activeSlide.hotspots?.map((h, i) => {
                        const isHovered = hoveredHotspotIndex === i;
                        return (
                          <div
                            key={`${activeSlideIndex}-${i}`}
                            className="absolute pointer-events-auto"
                            style={{
                              left: `${h.x}%`,
                              top: `${h.y}%`,
                            }}
                          >
                            {/* Plus Target Node */}
                            <div 
                              className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                              onMouseEnter={() => setHoveredHotspotIndex(i)}
                              onMouseLeave={() => setHoveredHotspotIndex(null)}
                              onClick={() => setHoveredHotspotIndex(hoveredHotspotIndex === i ? null : i)}
                            >
                              {/* Pulsing Outer Ring */}
                              <div className="absolute inset-0 rounded-full bg-[#00e0ff]/30 scale-150 animate-ping group-hover:bg-[#00e0ff]/50 duration-1000" />
                              {/* Central Button */}
                              <div className="w-5 h-5 rounded-full border border-white/20 bg-[#080f11]/90 group-hover:bg-[#00e0ff]/20 group-hover:border-[#00e0ff]/50 flex items-center justify-center text-white transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                <span className="text-[10px] font-bold text-[#00e0ff] group-hover:text-white">+</span>
                              </div>
                            </div>

                            {/* Floating Description Tooltip */}
                            <AnimatePresence>
                              {isHovered && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-60 p-3.5 rounded-xl bg-[#080f11]/95 backdrop-blur-md border border-[#00e0ff]/30 text-left shadow-[0_15px_35px_rgba(0,0,0,0.6)] z-40 pointer-events-none"
                                >
                                  <h5 className="text-xs font-bold text-white mb-1 tracking-tight flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-[#00e0ff]" />
                                    {h.label}
                                  </h5>
                                  <p className="text-[10px] text-on-surface-variant/80 leading-relaxed font-normal">
                                    {h.desc}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      {/* Hotspot Target Text Labels */}
                      {activeSlide.hotspots?.map((h, i) => (
                        <div
                          key={`lbl-${activeSlideIndex}-${i}`}
                          className="absolute pointer-events-auto select-none"
                          style={{
                            left: `${h.x + (h.dx || 0)}%`,
                            top: `${h.y + (h.dy || 0)}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <div className="px-2.5 py-1 rounded-md bg-[#080f11]/75 backdrop-blur-sm border border-white/5 text-[9px] font-bold text-white tracking-wide whitespace-nowrap shadow-md">
                            {h.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Viewport Playback Control Bar */}
                  <div className="flex items-center justify-between mt-4 px-2 select-none shrink-0">
                    {/* Gesture Prompt */}
                    <div className="flex items-center gap-2 text-on-surface-variant/50 text-[9px] font-mono">
                      <svg className="w-3.5 h-3.5 text-[#00e0ff]/60 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Drag image to scrub views</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrevSlide}
                        className="w-8 h-8 rounded-full border border-white/10 bg-[#0d1516]/80 flex items-center justify-center text-on-surface-variant hover:text-[#00e0ff] hover:border-[#00e0ff]/30 transition-all cursor-pointer"
                        aria-label="Previous view"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setIsAutoplay(!isAutoplay)}
                        className="w-10 h-10 rounded-full border border-[#00e0ff]/30 bg-[#00e0ff]/10 flex items-center justify-center text-[#00e0ff] hover:bg-[#00e0ff]/20 transition-all cursor-pointer"
                        aria-label={isAutoplay ? "Pause" : "Play"}
                      >
                        {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-[#00e0ff]" />}
                      </button>

                      <button
                        onClick={handleNextSlide}
                        className="w-8 h-8 rounded-full border border-white/10 bg-[#0d1516]/80 flex items-center justify-center text-on-surface-variant hover:text-[#00e0ff] hover:border-[#00e0ff]/30 transition-all cursor-pointer"
                        aria-label="Next view"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Slide counter */}
                    <div className="text-on-surface-variant/50 text-[9px] font-mono">
                      VIEW {String(activeSlideIndex + 1).padStart(2, '0')} / 06
                    </div>
                  </div>

                  {/* Thumbnail Gallery Carousel */}
                  <div className="mt-5 space-y-2 shrink-0">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                      {activeIndustry.slides.map((slide, idx) => {
                        const isSlideActive = idx === activeSlideIndex;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveSlideIndex(idx);
                              setIsAutoplay(false); // Halt autoplay on manual pick
                            }}
                            className={`relative w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden shrink-0 border transition-all duration-300 cursor-pointer snap-start ${
                              isSlideActive
                                ? 'border-[#00e0ff] shadow-[0_0_10px_rgba(0,224,255,0.25)] scale-102'
                                : 'border-white/10 hover:border-white/20 hover:scale-102'
                            }`}
                          >
                            <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${
                              isSlideActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-30'
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Horizontal progress scrollbar */}
                    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute top-0 bottom-0 bg-[#00e0ff] transition-all duration-500"
                        style={{
                          left: `${(activeSlideIndex / activeIndustry.slides.length) * 100}%`,
                          width: `${(1 / activeIndustry.slides.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ─── Column 3: Right Panel - Technical Specs & Benefits ─── */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-white/5 p-5 md:p-6 overflow-y-auto flex flex-col justify-between bg-[#080f11]/30 gap-6 scrollbar-none">
                  {/* Key Solutions List */}
                  <div className="space-y-4 text-left">
                    <h5 className="font-mono text-[10px] text-[#00e0ff] tracking-widest uppercase font-semibold">
                      Key Solutions
                    </h5>
                    <div className="space-y-4">
                      {activeIndustry.keySolutions.map((sol, i) => {
                        const SolIcon = sol.icon;
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full border border-[#00e0ff]/20 bg-[#00e0ff]/5 text-[#00e0ff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,224,255,0.03)]">
                              <SolIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h6 className="text-xs font-bold text-white tracking-tight leading-none">
                                {sol.title}
                              </h6>
                              <p className="text-[10px] text-on-surface-variant/80 mt-1.5 leading-normal font-normal">
                                {sol.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Industry Benefits 2x2 Grid */}
                  <div className="space-y-4 text-left pt-6 border-t border-white/5">
                    <h5 className="font-mono text-[10px] text-[#00e0ff] tracking-widest uppercase font-semibold">
                      Industry Benefits
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      {activeIndustry.benefits.map((ben, i) => (
                        <div key={i} className="space-y-1 p-3 bg-white/1 border border-white/5 rounded-xl">
                          <div className="text-2xl font-black text-[#00e0ff] text-glow-accent tracking-tight leading-none">
                            {ben.value}
                          </div>
                          <div className="text-[9px] text-on-surface-variant/70 font-semibold uppercase tracking-wider leading-tight">
                            {ben.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
