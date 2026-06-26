import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
import Product3DCanvas from './Product3DCanvas';
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
        video: "/Flow_Force_Rotary_Valve_highlight_202606261412_gwr_video_mvp.mp4",
        hotspots: [
          { x: 35, y: 40, dx: 4, dy: -4, label: "Rotary Airlock Valve", desc: "25L/rev capacity" },
          { x: 50, y: 60, dx: 4, dy: 4, label: "Sanitary Design", desc: "USDA / 3-A certified" },
          { x: 65, y: 35, dx: -4, dy: -4, label: "Pressure Differential", desc: "1.5 bar max" }
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

// Reusable technical specifications and descriptions for all 30 product slides in the Digital Showroom
const SLIDE_METADATA = {
  // Food & Beverage
  "Main Process Plant": {
    category: "SYSTEM INTEGRATION",
    desc: "Complete processing line integrating multi-stage separation, filtration, and pneumatic conveying.",
    specs: [
      { label: "Throughput", value: "25 t/h" },
      { label: "Control", value: "PLC Integrated" },
      { label: "Standard", value: "ATEX / OSHA" }
    ]
  },
  "Pneumatic Conveying": {
    category: "MATERIAL CONVEYING",
    desc: "Dilute or dense-phase pneumatic conveying system designed for dust-free powder transport.",
    specs: [
      { label: "Phase Type", value: "Dense / Dilute" },
      { label: "Line Size", value: "150 mm" },
      { label: "Distance", value: "Up to 500 m" }
    ]
  },
  "Rotary Airlock": {
    category: "PRESSURE METERING",
    desc: "USDA-compliant rotary airlock valve metering dry ingredients while maintaining pressure differentials.",
    specs: [
      { label: "Rotor Vol", value: "25 L/rev" },
      { label: "Pressure Diff", value: "1.5 bar" },
      { label: "Sanitary", value: "USDA / 3-A" }
    ]
  },
  "Centrifugal Separator": {
    category: "CYCLONE SEPARATION",
    desc: "Centrifugal air-material separator designed for high-efficiency powder collection.",
    specs: [
      { label: "Efficiency", value: "99.8%" },
      { label: "Gas Flow", value: "8,500 m³/h" },
      { label: "Pressure Drop", value: "800 Pa" }
    ]
  },
  "Bag Filter": {
    category: "PRESSURE FILTRATION",
    desc: "Sanitary stainless steel pressure vessel housing high-efficiency liquid or powder filter bags.",
    specs: [
      { label: "Filter Area", value: "45 m²" },
      { label: "Bag Qty", value: "6 bags" },
      { label: "Max Pressure", value: "10 bar g" }
    ]
  },
  "Dust Extraction": {
    category: "DUST CONTROL",
    desc: "Pulse-jet dust collector extraction hopper maintaining clean and safe ambient processing air.",
    specs: [
      { label: "Air Volume", value: "12,000 m³/h" },
      { label: "Fan Power", value: "15 kW" },
      { label: "Filter Media", value: "PTFE Membrane" }
    ]
  },
  // Dairy Processing
  "Dairy Plant Overview": {
    category: "SYSTEM INTEGRATION",
    desc: "Sanitary dairy processing loop optimized for pasteurization, storage, and thermal control.",
    specs: [
      { label: "Capacity", value: "50,000 L/h" },
      { label: "CIP Loop", value: "Fully Auto" },
      { label: "Material", value: "SS316L" }
    ]
  },
  "BOS Homogenizer": {
    category: "EMULSIFICATION",
    desc: "High-pressure homogenizer reducing fat globule sizes for stable milk and cream emulsions.",
    specs: [
      { label: "Pressure", value: "1,500 bar" },
      { label: "Drive Type", value: "3-plunger" },
      { label: "Standard", value: "3-A Sanitary" }
    ]
  },
  "Sanitary Filtration": {
    category: "LIQUID FILTRATION",
    desc: "Wedge-wire inline filtration system protecting pasteurizers and filling lines.",
    specs: [
      { label: "Rating", value: "50 µm" },
      { label: "Design", value: "EHEDG Compliant" },
      { label: "Flow Rate", value: "30 m³/h" }
    ]
  },
  "Aseptic Silo": {
    category: "STERILE STORAGE",
    desc: "Pressure-rated sterile storage silo featuring integrated CIP spray balls and temperature jackets.",
    specs: [
      { label: "Volume", value: "100,000 L" },
      { label: "Blanketing", value: "N2 Inert Gas" },
      { label: "Isolation", value: "Aseptic Valves" }
    ]
  },
  "Sanitary Bag Vessel": {
    category: "LIQUID POLISHING",
    desc: "Quick-bolt clamp sanitary bag filter housing for high-flow liquid polishing before packaging.",
    specs: [
      { label: "Bag Qty", value: "4 bags" },
      { label: "Material", value: "SS316L" },
      { label: "Connection", value: "Tri-Clamp" }
    ]
  },
  "Sanitary Conveyor": {
    category: "POWDER CONVEYING",
    desc: "Enclosed sanitary tubular conveyor moving dairy powder additives without dust emissions.",
    specs: [
      { label: "Convey Rate", value: "5 t/h" },
      { label: "Drive Power", value: "5.5 kW" },
      { label: "Sanitary", value: "USDA Approved" }
    ]
  },
  // Pharmaceutical
  "Pharmaceutical Suite": {
    category: "SYSTEM INTEGRATION",
    desc: "Potent API containment suite integrating sterile filtration, ASME reactors, and split butterfly airlocks.",
    specs: [
      { label: "Containment", value: "OEB 5 (<1 µg/m³)" },
      { label: "Standard", value: "cGMP / FDA" },
      { label: "Finish", value: "Ra < 0.38 µm" }
    ]
  },
  "Sterile Filtration": {
    category: "STERILE FILTRATION",
    desc: "Absolute-rated cartridge filter housing engineered for critical sterile drug filtration loops.",
    specs: [
      { label: "Rating", value: "0.22 µm Absolute" },
      { label: "Housing", value: "ASME BPE" },
      { label: "Testable", value: "Integrity Testable" }
    ]
  },
  "ASME Reaction Tank": {
    category: "REACTION VESSELS",
    desc: "High-grade 316L stainless steel reaction vessel with ultra-low surface roughness.",
    specs: [
      { label: "Design Code", value: "ASME BPE" },
      { label: "Jacket Temp", value: "-20 to 150 °C" },
      { label: "Surface Finish", value: "Electropolished" }
    ]
  },
  "Containment Airlock": {
    category: "API METERING",
    desc: "High-precision containment split butterfly valve dosing active pharmaceutical ingredients safely.",
    specs: [
      { label: "Leak Rate", value: "Zero Leakage" },
      { label: "Operation", value: "Pneumatic / Manual" },
      { label: "Material", value: "Hastelloy C22" }
    ]
  },
  "Additives Conveyor": {
    category: "API CONVEYING",
    desc: "Polished stainless steel conveying lines designed for zero-leak dry powder transport.",
    specs: [
      { label: "Convey Phase", value: "Vacuum Dilute" },
      { label: "Finish", value: "Ra < 0.4 µm" },
      { label: "Cleanability", value: "WIP / CIP Ready" }
    ]
  },
  "HEPA Dust Collector": {
    category: "HAZARDOUS DUST",
    desc: "Explosion-proof HEPA filtration unit capturing hazardous active airborne drug dust.",
    specs: [
      { label: "Efficiency", value: "99.97% at 0.3 µm" },
      { label: "Ex-Rating", value: "ATEX Zone 21/22" },
      { label: "Containment", value: "Bag-In/Bag-Out HEPA" }
    ]
  },
  // Chemical
  "Chemical Plant Floor": {
    category: "SYSTEM INTEGRATION",
    desc: "Heavy-duty chemical plant layout featuring Teflon-lined reactors and ATEX-certified silos.",
    specs: [
      { label: "Standard", value: "ATEX / ISO 9001" },
      { label: "Materials", value: "Hastelloy / PTFE" },
      { label: "Control", value: "DCS Integrated" }
    ]
  },
  "ASME Chemical Silo": {
    category: "CHEMICAL STORAGE",
    desc: "Reinforced storage tank with rupture discs and inert gas purge manifolds for volatile polymers.",
    specs: [
      { label: "Design Code", value: "ASME Sec. VIII" },
      { label: "Protection", value: "Rupture Disc / N2" },
      { label: "Volume", value: "150 m³" }
    ]
  },
  "Self-Cleaning Filter": {
    category: "VISCOUS FILTRATION",
    desc: "Pneumatic scraper filter continuously removing solids from viscous polymers without flow interruption.",
    specs: [
      { label: "Scraper Type", value: "Pneumatic Blade" },
      { label: "Viscosity", value: "Up to 50,000 cP" },
      { label: "Losses", value: "Ultra-Low Waste" }
    ]
  },
  "ATEX Rotary Valve": {
    category: "FLAMEPROOF AIRLOCK",
    desc: "ATEX Zone 0/20 certified airlock acting as a flame barrier in conveying lines.",
    specs: [
      { label: "ATEX Cert", value: "Zone 0/20 / Ex d" },
      { label: "Pressure Shock", value: "10 bar g resistant" },
      { label: "Clearance", value: "Tight Tolerance" }
    ]
  },
  "Catalyst Conveyor": {
    category: "ABRASIVE CONVEYING",
    desc: "Enclosed conveyor constructed of high-durability alloy to resist aggressive chemical wear.",
    specs: [
      { label: "Abrasive Index", value: "Very High" },
      { label: "Material", value: "Hardened Steel" },
      { label: "Enclosure", value: "Gas-Tight N2 Purged" }
    ]
  },
  "Explosion Collector": {
    category: "EXPLOSION COLLECTOR",
    desc: "ATEX-rated dust collector featuring spark detection, water-mist suppression, and isolation valves.",
    specs: [
      { label: "Protection", value: "Spark / Mist / Vent" },
      { label: "Air-To-Cloth", value: "1.2 m/min" },
      { label: "ATEX Class", value: "St2 Dust Rated" }
    ]
  },
  // Industrial Manufacturing
  "Heavy Manufacturing Line": {
    category: "SYSTEM INTEGRATION",
    desc: "Continuous heavy-duty mineral processing loop with dense phase conveying and bulk bag discharging.",
    specs: [
      { label: "Duty Cycle", value: "24/7 Continuous" },
      { label: "Conveying Type", value: "Dense Phase" },
      { label: "Standards", value: "OSHA Combustible" }
    ]
  },
  "Pulse-Jet Baghouse": {
    category: "HIGH-FLOW DUST",
    desc: "Large-volume pulse-jet baghouse collector filtering flue gas and exhaust dust in steel mills.",
    specs: [
      { label: "Airflow", value: "45,000 m³/h" },
      { label: "Filter Bags", value: "144 Bags" },
      { label: "Rating", value: "99.9% at 1 µm" }
    ]
  },
  "FIBC Bag Discharger": {
    category: "BULK BAG HANDLING",
    desc: "Bulk bag unloading station featuring pneumatic massage paddles for sticky raw materials.",
    specs: [
      { label: "Unload Cap", value: "1.5 t" },
      { label: "Massage", value: "Pneumatic Paddles" },
      { label: "Containment", value: "Dust-Tight Seal" }
    ]
  },
  "Raw Materials Conveyor": {
    category: "HIGH-VOLUME CONVEYING",
    desc: "Heavy-duty conveying pipeline transferring tons of dry bulk solids per hour.",
    specs: [
      { label: "Throughput", value: "40 t/h" },
      { label: "Pipe Diameter", value: "200 mm" },
      { label: "Air Source", value: "Root Blowers" }
    ]
  },
  "High-Pressure Airlock": {
    category: "WEAR-TREATED AIRLOCK",
    desc: "Hard-chrome plated rotor blades designed to meter high-abrasion bulk minerals under high pressure.",
    specs: [
      { label: "Rotor Hardness", value: "65 HRC" },
      { label: "Pressure", value: "2.0 bar g" },
      { label: "Material", value: "Hard-Chrome Plated" }
    ]
  },
  "Storage Silo Loop": {
    category: "HIGH-TONNAGE STORAGE",
    desc: "High-tonnage steel storage silos featuring fluidizing cones to prevent material bridging.",
    specs: [
      { label: "Capacity", value: "250 tons" },
      { label: "Fluidization", value: "Cone Aerators" },
      { label: "Access", value: "Continuous Telemetry" }
    ]
  },
  // Water Treatment
  "Water Treatment Plant": {
    category: "SYSTEM INTEGRATION",
    desc: "Automated municipal water treatment loop with auto-backwash strainers and parallel polishing.",
    specs: [
      { label: "Flow Rate", value: "1,200 m³/h" },
      { label: "Standards", value: "NSF/ANSI 61" },
      { label: "Control", value: "SCADA / Remote" }
    ]
  },
  "Backwash Strainer": {
    category: "AUTO STRAINERS",
    desc: "Motorized self-cleaning strainer continuously removing sand and organic debris without flow stoppage.",
    specs: [
      { label: "Screen Type", value: "Wedge-Wire SS316" },
      { label: "Rating", value: "100 µm" },
      { label: "Cleaning", value: "Automatic DP Trigger" }
    ]
  },
  "Cyclone Grit Separator": {
    category: "CENTRIFUGAL GRIT",
    desc: "Centrifugal grit separator extracting sand and silt from raw intake waters before fine filtration.",
    specs: [
      { label: "Flow Capacity", value: "350 m³/h" },
      { label: "Grit Removal", value: "95% > 50 µm" },
      { label: "Material", value: "Polymer-Lined Steel" }
    ]
  },
  "Multi-Bag Vessel": {
    category: "HIGH-FLOW POLISHING",
    desc: "High-flow multi-bag liquid filter vessel providing polishing of plant effluent.",
    specs: [
      { label: "Max Flow", value: "400 m³/h" },
      { label: "Bag Qty", value: "12 Bags" },
      { label: "Design Code", value: "ASME Sec. VIII" }
    ]
  },
  "Gas-Liquid Separator": {
    category: "DEGASSING VESSEL",
    desc: "Industrial degassing vessel removing entrained air, carbon dioxide, or hydrogen sulfide gases.",
    specs: [
      { label: "Removal", value: "Entrained Gas" },
      { label: "Vacuum", value: "Available Option" },
      { label: "Inlet Type", value: "Low-Turbulence" }
    ]
  },
  "Pumping Pipeline Loop": {
    category: "CHEMICAL DOSING",
    desc: "Enclosed chemical dosing piping loop injecting chlorine or flocculant additives safely.",
    specs: [
      { label: "Dosing Pump", value: "Dual Diaphragm" },
      { label: "Safety", value: "Double Containment" },
      { label: "Controls", value: "Flow-Proportional" }
    ]
  }
};

// Reusable data-driven media configuration mapping to enrich slideshow definitions dynamically
const ENRICHED_INDUSTRIES_DATA = INDUSTRIES_DATA.map((industry) => ({
  ...industry,
  slides: industry.slides.map((slide) => {
    // Generate standard id (e.g., 'Rotary Airlock' -> 'rotary-valve')
    const id = slide.id || (slide.name === "Rotary Airlock" ? "rotary-valve" : slide.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    return {
      id,
      poster: slide.poster || slide.image, // Fallback image poster
      ...slide
    };
  })
}));

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

// Stats Circular Progress Rings Subcomponent
function StatCircle({ value, label, index }) {
  const numericVal = parseFloat(value);
  const isPercent = value.includes('%');
  
  // Circle properties
  const radius = 26;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(numericVal / 100, 0), 1);
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#080f11]/40 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-[#00e0ff]/20 transition-all duration-300">
      {/* Ambient hover glow */}
      <div className="absolute inset-0 bg-[#00e0ff]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#00e0ff"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(0,224,255,0.4)]"
          />
        </svg>
        <div className={`text-sm sm:text-base font-black text-white tracking-tight stat-number-${index}`}>
          0%
        </div>
      </div>
      <div className="text-[8px] sm:text-[9px] text-on-surface-variant/70 font-semibold uppercase tracking-wider text-center mt-3 leading-tight group-hover:text-white transition-colors duration-300">
        {label}
      </div>
    </div>
  );
}

export default function IndustriesSection() {
  const containerRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const videoRef = useRef(null);
  const isFirstRender = useRef(true);

  // Showroom active indexes and states
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [hoveredHotspotIndex, setHoveredHotspotIndex] = useState(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('scrub'); // 'scrub' or '3d'
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  // Fullscreen video modal states
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);

  // Drag interaction states
  const [dragStartX, setDragStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const activeIndustry = ENRICHED_INDUSTRIES_DATA[activeIndex];
  const activeSlide = activeIndustry.slides[activeSlideIndex];
  const shouldReduceMotion = useReducedMotion();

  // 1. Cinematic Intro GSAP ScrollTrigger Sequence
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    // Fade in panel from black
    tl.fromTo('.showroom-panel',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Ken Burns slow zoom-out effect on the product image
    tl.fromTo('.viewport-media-zoom',
      { scale: 1.05 },
      { scale: 1.0, duration: 3.0, ease: 'power2.out' },
      '-=0.5'
    );

    // Slide in HUD overlays from left with stagger
    tl.fromTo(['.hud-overlay-top', '.hud-overlay-bottom'],
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
      '-=2.8'
    );

    // Staggered simultaneous count-up for the stats
    const statsObj = { val0: 0, val1: 0, val2: 0, val3: 0 };
    const target0 = parseFloat(activeIndustry.benefits[0].value) || 98;
    const target1 = parseFloat(activeIndustry.benefits[1].value) || 35;
    const target2 = parseFloat(activeIndustry.benefits[2].value) || 40;
    const target3 = parseFloat(activeIndustry.benefits[3].value) || 100;

    tl.fromTo(statsObj,
      { val0: 0, val1: 0, val2: 0, val3: 0 },
      {
        val0: target0,
        val1: target1,
        val2: target2,
        val3: target3,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          for (let i = 0; i < 4; i++) {
            const el = document.querySelector(`.stat-number-${i}`);
            if (el) {
              const val = i === 0 ? statsObj.val0 : i === 1 ? statsObj.val1 : i === 2 ? statsObj.val2 : statsObj.val3;
              const originalVal = activeIndustry.benefits[i].value;
              const isPercent = originalVal.includes('%');
              const isDecimal = originalVal.includes('.');
              el.innerText = (isDecimal ? val.toFixed(1) : Math.round(val)) + (isPercent ? '%' : '');
            }
          }
        }
      },
      '-=2.8'
    );
  }, { scope: containerRef });

  // 2. Animate stats count-up on subsequent industry switches
  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const statsObj = { val0: 0, val1: 0, val2: 0, val3: 0 };
    const target0 = parseFloat(activeIndustry.benefits[0].value) || 0;
    const target1 = parseFloat(activeIndustry.benefits[1].value) || 0;
    const target2 = parseFloat(activeIndustry.benefits[2].value) || 0;
    const target3 = parseFloat(activeIndustry.benefits[3].value) || 0;

    gsap.fromTo(statsObj, 
      { val0: 0, val1: 0, val2: 0, val3: 0 },
      {
        val0: target0,
        val1: target1,
        val2: target2,
        val3: target3,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          for (let i = 0; i < 4; i++) {
            const el = document.querySelector(`.stat-number-${i}`);
            if (el) {
              const val = i === 0 ? statsObj.val0 : i === 1 ? statsObj.val1 : i === 2 ? statsObj.val2 : statsObj.val3;
              const originalVal = activeIndustry.benefits[i].value;
              const isPercent = originalVal.includes('%');
              const isDecimal = originalVal.includes('.');
              el.innerText = (isDecimal ? val.toFixed(1) : Math.round(val)) + (isPercent ? '%' : '');
            }
          }
        }
      }
    );
  }, [activeIndex]);

  // Autoplay Effect (4 seconds slide advance)
  useEffect(() => {
    if (!isAutoplay || viewMode === '3d') return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoplay, activeSlideIndex, viewMode]);

  // Keyboard Navigation & Fullscreen Close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreenOpen) {
        if (e.key === 'Escape') setIsFullscreenOpen(false);
        return;
      }
      if (is3DFullscreen) {
        if (e.key === 'Escape') setIs3DFullscreen(false);
        return;
      }
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePrevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen, is3DFullscreen, activeSlideIndex]);

  // Synthesize a high-tech "powering up" sound sweep using native Web Audio API
  const playPowerUpSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      
      const now = ctx.currentTime;
      // Frequency sweep from 80Hz up to 520Hz over 0.8s
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.8);
      
      // Lowpass filter opening up with resonance
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(8, now);
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(2000, now + 0.8);
      
      // Volume envelope: slight swell and clean decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
      gain.gain.setValueAtTime(0.15, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.0);
    } catch (err) {
      console.warn('Web Audio API blocked or not supported:', err);
    }
  };

  // Trigger sound effect on entering 3D mode
  useEffect(() => {
    if (viewMode === '3d') {
      playPowerUpSound();
    }
  }, [viewMode]);

  // Reset video loading states when slide changes
  useEffect(() => {
    setIsVideoLoaded(false);
    setIsVideoError(false);
  }, [activeSlideIndex]);

  // Handle Video Playback in background slide
  useEffect(() => {
    if (videoRef.current) {
      const activeSlide = activeIndustry.slides[activeSlideIndex];
      if (activeSlide.video && viewMode === 'scrub' && !isFullscreenOpen) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeSlideIndex, viewMode, activeIndustry, isFullscreenOpen]);

  // Auto-scroll the active thumbnail into view without scrolling the parent browser window
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const activeChild = container.children[activeSlideIndex];
      if (activeChild) {
        const containerWidth = container.offsetWidth;
        const childOffsetLeft = activeChild.offsetLeft;
        const childWidth = activeChild.offsetWidth;
        
        // Center the active thumbnail in the scrollable gallery
        const targetScrollLeft = childOffsetLeft - (containerWidth / 2) + (childWidth / 2);
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSlideIndex]);

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % activeIndustry.slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + activeIndustry.slides.length) % activeIndustry.slides.length);
  };

  // Viewport Parallax Mouse Events
  const handleMouseMoveViewport = (e, viewportEl) => {
    if (viewMode === '3d') return;
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
    if (viewMode === '3d') return;
    setDragStartX(clientX);
    setIsDragging(true);
    setIsAutoplay(false); // Pause autoplay on interaction
  };

  const handleDragMove = (clientX) => {
    if (viewMode === '3d') return;
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
    if (viewMode === '3d') return;
    setIsDragging(false);
    setDragStartX(null);
  };

  return (
    <section ref={containerRef} className="py-32 bg-[#0c1213] relative overflow-hidden">
      {/* Custom Keyframe Styles for Pulsing Hotspots and Scanlines */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hotspot-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
            box-shadow: 0 0 0 0 rgba(0, 224, 255, 0.7);
          }
          70% {
            transform: scale(1.8);
            opacity: 0;
            box-shadow: 0 0 0 10px rgba(0, 224, 255, 0);
          }
          100% {
            transform: scale(1);
            opacity: 0;
            box-shadow: 0 0 0 0 rgba(0, 224, 255, 0);
          }
        }
        .pulsing-hotspot-ring {
          animation: hotspot-pulse 2s infinite cubic-bezier(0.25, 0, 0, 1);
        }
        .hud-scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
        }
      `}} />

      {/* Subtle lighting overlay */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00e0ff]/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            Versatility By Design
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Supporting Core Industries
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            Our systems are engineered to perform under the exact hygienic, chemical, and physical demands of key global sectors.
          </p>
        </div>

        {/* ─── Ultra-Premium Digital Showroom Interactive Dashboard ─── */}
        <div className="showroom-panel relative w-full bg-gradient-to-br from-[#0c1213]/80 to-[#080f11]/90 border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-auto lg:h-[750px] cursor-default">
          
          {/* Main Three-Column Dashboard Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-auto lg:h-full">
            
            {/* ─── Column 1: Left Panel - Industry Solutions Selector ─── */}
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/5 p-5 md:p-6 overflow-y-auto bg-[#080f11]/30 scrollbar-none h-auto lg:h-full">
              <h5 className="font-mono text-[10px] text-[#00e0ff] tracking-widest uppercase font-semibold mb-5 text-left block">
                Industry Solutions
              </h5>
              <div className="space-y-3">
                {ENRICHED_INDUSTRIES_DATA.map((ind, index) => {
                  const IconComponent = ind.icon;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={ind.name}
                      onClick={() => {
                        setActiveIndex(index);
                        setActiveSlideIndex(0); // Reset slide on sector switch
                      }}
                      className={`relative w-full flex items-center gap-4 p-4 rounded-xl text-left border transition-all duration-500 group overflow-hidden cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#00e0ff]/10 to-[#00e0ff]/2 border-l-[3px] border-[#00e0ff] shadow-[0_0_20px_rgba(0,224,255,0.08)]'
                          : 'bg-white/1 border-white/5 hover:bg-white/3 hover:border-white/10'
                      }`}
                    >
                      {/* Active Left Neon Progress Bar */}
                      {isActive && (
                        <motion.div
                          key={`progress-${activeIndex}`}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 5, ease: "linear" }}
                          onAnimationComplete={() => {
                            setActiveIndex((prev) => (prev + 1) % ENRICHED_INDUSTRIES_DATA.length);
                            setActiveSlideIndex(0);
                          }}
                          style={{ originY: 0 }}
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00e0ff] z-10"
                        />
                      )}

                      {/* Hover Slide-in Overlay */}
                      {!isActive && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                          className="absolute inset-0 bg-[#00e0ff]/5 pointer-events-none"
                        />
                      )}

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

            {/* Column 2 & 3 wrapper (9/12) */}
            <div className="lg:col-span-9 overflow-hidden relative h-auto lg:h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full grid grid-cols-1 lg:grid-cols-9 bg-transparent"
                >
                  
                  {/* ─── Column 2: Center Panel - Viewport & Gallery ─── */}
                  <div className="lg:col-span-6 p-5 md:p-6 flex flex-col justify-between overflow-y-auto bg-[#080f11]/15 scrollbar-none border-b lg:border-b-0 lg:border-r border-white/5 h-auto lg:h-full">
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
                      className={`relative w-full bg-[#080f11] border border-white/10 rounded-2xl overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] group transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        viewMode === '3d'
                          ? 'h-[500px] min-h-[500px] cursor-default'
                          : 'aspect-[16/10] md:aspect-[16/9.5] cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      {/* Scanlines HUD overlay */}
                      <div className="absolute inset-0 hud-scanlines opacity-[0.03] pointer-events-none z-20" />

                      {/* Mode Toggle Button (2D vs 3D) */}
                      <div className="absolute top-3 right-3 z-30 flex items-center p-0.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                        <button
                          onClick={() => {
                            setViewMode('scrub');
                            setIsAutoplay(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                            viewMode === 'scrub'
                              ? 'bg-[#00e0ff] text-[#0d1516] shadow-[0_0_15px_rgba(0,224,255,0.3)] border border-[#00e0ff]'
                              : 'bg-transparent border border-[#00e0ff]/30 text-[#00e0ff] hover:bg-[#00e0ff]/5'
                          }`}
                        >
                          📸 2D SCRUB
                        </button>
                        <button
                          onClick={() => {
                            setViewMode('3d');
                            setIsAutoplay(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                            viewMode === '3d'
                              ? 'bg-[#00e0ff] text-[#0d1516] shadow-[0_0_15px_rgba(0,224,255,0.3)] border border-[#00e0ff]'
                              : 'bg-transparent border border-[#00e0ff]/30 text-[#00e0ff] hover:bg-[#00e0ff]/5'
                          }`}
                        >
                          🌐 INTERACTIVE 3D
                        </button>
                      </div>

                      {/* Fullscreen Button for 3D */}
                      {viewMode === '3d' && (
                        <button
                          onClick={() => setIs3DFullscreen(true)}
                          className="absolute top-3 right-[230px] z-30 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[#00e0ff] hover:bg-[#00e0ff]/25 hover:border-[#00e0ff] flex items-center justify-center text-lg transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
                          title="Fullscreen 3D Viewer"
                        >
                          ⛶
                        </button>
                      )}

                      {/* 3D Canvas Container - smooth crossfade and scale morph */}
                      <div 
                        className={`absolute inset-0 w-full h-full transition-all duration-[600ms] ease-out ${
                          viewMode === '3d'
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        <Product3DCanvas
                          productId={activeSlide.name}
                          accentColor={activeIndustry.accent || '#00e0ff'}
                        />
                      </div>

                      {/* 2D Media Container - smooth crossfade and scale morph */}
                      <div 
                        className={`absolute inset-0 w-full h-full transition-all duration-[600ms] ease-out ${
                          viewMode === 'scrub'
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        {/* Viewport Media Render (Image or Video Background) */}
                        <div 
                          onClick={() => setIsFullscreenOpen(true)}
                          className="viewport-media-container absolute inset-0 w-full h-full overflow-hidden bg-[#080f11] cursor-zoom-in"
                        >
                          <AnimatePresence>
                            {activeSlide.video ? (
                              <motion.div
                                key={`vid-${activeSlideIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 w-full h-full overflow-hidden"
                              >
                                {/* Shimmer loader */}
                                {!isVideoLoaded && !isVideoError && (
                                  <div className="absolute inset-0 bg-[#080f11] flex items-center justify-center z-10">
                                    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#00e0ff] animate-spin" />
                                  </div>
                                )}
                                <div className="viewport-media-zoom w-full h-full origin-center">
                                  <video
                                    ref={videoRef}
                                    src={activeSlide.video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    onLoadedData={() => setIsVideoLoaded(true)}
                                    onError={() => setIsVideoError(true)}
                                    className="w-full h-full object-cover select-none pointer-events-none"
                                    style={{
                                      transform: `translate(${-parallaxOffset.x}px, ${-parallaxOffset.y}px)`,
                                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                  />
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key={`img-${activeSlideIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 w-full h-full overflow-hidden"
                              >
                                <div className="viewport-media-zoom w-full h-full origin-center">
                                  <img
                                    src={activeSlide.image}
                                    alt={activeSlide.name}
                                    className="w-full h-full object-cover select-none pointer-events-none"
                                    style={{
                                      transform: `translate(${-parallaxOffset.x}px, ${-parallaxOffset.y}px)`,
                                      transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Dark gradient vignette over viewport */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none z-10" />

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
                                  <div className="absolute w-6 h-6 -left-1 -top-1 rounded-full bg-[#00e0ff]/30 pulsing-hotspot-ring pointer-events-none" />
                                  {/* Central Button */}
                                  <div className="w-4 h-4 rounded-full border border-white/40 bg-[#00e0ff] group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(0,224,255,0.8)]" />
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
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff]" />
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

                        {/* Premium HUD Overlay (Product Title, Specs, etc.) */}
                        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-5">
                          
                          {/* Top-Left Panel: Title & Label */}
                          <motion.div
                            key={`hud-title-${activeSlideIndex}`}
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="hud-overlay-top pointer-events-auto flex flex-col gap-1 max-w-[260px] sm:max-w-[340px] p-4 rounded-xl bg-[#080f11]/60 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-left"
                          >
                            <span className="font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase font-bold flex items-center gap-1.5 leading-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff] animate-pulse" />
                              PERFORMANCE TELEMETRY — {SLIDE_METADATA[activeSlide.name]?.category || "EQUIPMENT"}
                            </span>
                            <h4 className="font-sans text-xs sm:text-sm font-black text-white tracking-tight mt-1 leading-tight uppercase">
                              {activeSlide.name}
                            </h4>
                            <p className="font-sans text-[10px] text-on-surface-variant/80 leading-normal mt-1.5 font-normal">
                              {SLIDE_METADATA[activeSlide.name]?.desc || `${activeSlide.name} high-end B2B industrial component.`}
                            </p>
                          </motion.div>

                          {/* Bottom-Left Panel: Technical Specifications */}
                          <motion.div
                            key={`hud-specs-${activeSlideIndex}`}
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                            className="hud-overlay-bottom pointer-events-auto flex flex-col gap-2 p-4 rounded-xl bg-[#080f11]/60 backdrop-blur-md border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] max-w-[260px] sm:max-w-[300px] text-left"
                          >
                            <span className="font-mono text-[8px] text-on-surface-variant/70 tracking-widest uppercase font-bold border-b border-white/5 pb-1 block">
                              OPERATIONAL METRICS
                            </span>
                            <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                              {(SLIDE_METADATA[activeSlide.name]?.specs || [{ label: "Standard", value: "ASME / ISO" }]).map((spec, sIdx) => (
                                <motion.div 
                                  key={sIdx}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.3 + sIdx * 0.1 }}
                                  className="flex items-center justify-between gap-4 text-[9px]"
                                >
                                  <span className="font-mono text-on-surface-variant/60 uppercase">{spec.label}</span>
                                  <span className="font-mono font-bold text-[#00e0ff]">{spec.value}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                        </div>

                        {/* Ambient Cinematic Effects */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                          {/* Moving Light Sweep */}
                          <motion.div 
                            className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/3 to-transparent"
                            animate={{
                              x: ['-100%', '100%'],
                              y: ['-100%', '100%']
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear",
                              repeatDelay: 4
                            }}
                          />
                          {/* Ambient pulsing blue glow */}
                          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00e0ff]/2.5 rounded-full blur-3xl animate-pulse" />
                          
                          {/* Floating Dust Particles */}
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-white/10"
                              style={{
                                left: `${20 + i * 15}%`,
                                bottom: `${-5}%`
                              }}
                              animate={{
                                y: ['100%', '-110%'],
                                x: ['0%', `${(i % 2 === 0 ? 1 : -1) * 20}px`],
                                opacity: [0, 0.4, 0.4, 0]
                              }}
                              transition={{
                                duration: 12 + i * 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 1.5
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Viewport Playback Control Bar */}
                    <div className="flex items-center justify-between mt-4 px-2 select-none shrink-0">
                      {/* Gesture Prompt */}
                      <div className="flex items-center gap-2 text-on-surface-variant/50 text-[9px] font-mono animate-pulse">
                        <svg className="w-3.5 h-3.5 text-[#00e0ff]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{viewMode === '3d' ? 'Drag to orbit • Scroll to zoom' : 'Drag image to scrub views'}</span>
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

                      {/* Slide counter with digit flip */}
                      <div className="text-on-surface-variant/50 text-[9px] font-mono flex items-center gap-1">
                        <span>VIEW</span>
                        <div className="h-[12px] overflow-hidden relative flex">
                          <AnimatePresence mode="popLayout">
                            <motion.span
                              key={activeSlideIndex}
                              initial={{ y: 12, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -12, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="inline-block"
                            >
                              {String(activeSlideIndex + 1).padStart(2, '0')}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span>/ 06</span>
                      </div>
                    </div>

                    {/* Thumbnail Gallery Carousel */}
                    <div className="mt-5 space-y-2 shrink-0">
                      <div 
                        ref={thumbnailContainerRef}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x"
                      >
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
                  <div className="lg:col-span-3 p-5 md:p-6 overflow-y-auto flex flex-col justify-between bg-[#080f11]/30 gap-6 scrollbar-none h-auto lg:h-full">
                    {/* Key Solutions List */}
                    <div className="space-y-4 text-left">
                      <div className="relative inline-block mb-1">
                        <h5 className="font-mono text-[10px] text-[#00e0ff] tracking-widest uppercase font-semibold">
                          Key Solutions
                        </h5>
                        <motion.div
                          key={`underline-${activeIndex}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ originX: 0 }}
                          className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#00e0ff] shadow-[0_0_8px_rgba(0,224,255,0.8)]"
                        />
                      </div>
                      
                      <motion.div
                        key={`solutions-${activeIndex}`}
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.08
                            }
                          }
                        }}
                        initial="hidden"
                        animate="show"
                        className="space-y-4 pt-4"
                      >
                        {activeIndustry.keySolutions.map((sol, i) => {
                          const SolIcon = sol.icon;
                          return (
                            <motion.div 
                              key={i} 
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                              }}
                              className="flex items-start gap-3"
                            >
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
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>

                    {/* Industry Benefits 2x2 Grid with Progress Rings */}
                    <div className="space-y-4 text-left pt-6 border-t border-white/5">
                      <h5 className="font-mono text-[10px] text-[#00e0ff] tracking-widest uppercase font-semibold mb-3">
                        Industry Benefits
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        {activeIndustry.benefits.map((ben, i) => (
                          <StatCircle 
                            key={i} 
                            value={ben.value} 
                            label={ben.label} 
                            index={i} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </div>

      {/* Fullscreen Media Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFullscreenOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-xl p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreenOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-[110] cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container (80% size) */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[80vw] h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#080f11]/50 cursor-default"
            >
              {/* Scanlines HUD effect inside the modal */}
              <div className="absolute inset-0 hud-scanlines opacity-[0.03] pointer-events-none z-10" />

              {activeSlide.video ? (
                <video
                  src={activeSlide.video}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              ) : (
                <img
                  src={activeSlide.image}
                  alt={activeSlide.name}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen 3D Viewer Modal */}
      <AnimatePresence>
        {is3DFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[120] flex flex-col bg-[#080f11]/98 backdrop-blur-md w-screen h-screen overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setIs3DFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-[130] cursor-pointer shadow-lg"
              aria-label="Close fullscreen view"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Huge 3D Canvas */}
            <div className="w-full h-full">
              <Product3DCanvas
                productId={activeSlide.name}
                accentColor={activeIndustry.accent || '#00e0ff'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
