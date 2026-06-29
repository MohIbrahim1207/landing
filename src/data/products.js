import { images } from './images';

export const PRODUCTS = [
  {
    id: 'rotary-airlock',
    name: 'ROTARY AIRLOCK VALVE',
    category: 'BULK HANDLING',
    image: images.products.rotaryValve,
    highlights: [
      'High efficiency pressure sealing',
      'Cast Iron / SS304 / SS316 options',
      'Low maintenance direct drive setup',
      'Heavy-duty dust-tight construction',
      'Multiple inlet sizes from 100mm to 500mm'
    ],
    overview: 'High-efficiency rotary airlock valves engineered for continuous pressure sealing and dry bulk material handling. Ideal for metering discharge and conveying systems in dust-controlled environments.',
    features: [
      'Cantilevered rotor design for easy clean disassembly.',
      'Precision machined clearances down to 0.07mm.',
      'Outboard bearings to prevent process contamination.',
      'ATEX Zone 20/21/22 certification standard.',
      'Direct drive configuration for high torque reliability.'
    ],
    industries: [
      'Food Processing',
      'Pharmaceuticals',
      'Chemical Manufacturing',
      'Minerals & Mining'
    ],
    applications: [
      'Silo discharge control',
      'Dust collector collection bags',
      'Pneumatic conveying line feeding',
      'Bulk material metering'
    ],
    brochure: '/brochures/rotary_airlock_valve_datasheet.pdf',
    options: [
      { name: 'Ultrasonic Deblinding Kit', desc: 'Prevents fine powders from sticking to rotor pockets.' },
      { name: 'Sanitary SS316L Finish', desc: 'Electro-polished internal surfaces to Ra < 0.8µm.' },
      { name: 'High Temperature Seals', desc: 'Viton/PTFE lip seals rated up to 250°C.' },
      { name: 'Shear Protectors', desc: 'Inlet deflector to prevent product degradation.' }
    ],
    specs: [
      { label: 'Inlet Diameter', value: '100mm - 500mm' },
      { label: 'Pressure Limit', value: '1.5 bar Differential' },
      { label: 'Standard Material', value: 'SS304 / SS316L / Cast Iron' },
      { label: 'Drive Options', value: 'Inline Gearmotor / Chain Drive' },
      { label: 'Safety Compliance', value: 'ATEX Zone 21 II 2D' },
      { label: 'Noise Emission', value: '< 65 dBA' }
    ]
  },
  {
    id: 'centrifugal-sieving',
    name: 'CENTRIFUGAL SIEVING SYSTEM',
    category: 'SIFTING & SEPARATION',
    image: images.products.homogenizer, // using the sifter image or similar
    highlights: [
      'Uses a set of high-speed rotating paddles',
      'Offered in 3 sizes: 90-C, 180-C, and 360-C',
      'High-throughput check screening',
      'Tool-free screen changing design',
      'Dust-tight sanitary execution'
    ],
    overview: 'High-performance centrifugal sifter designed for gravity-fed check screening, de-dusting, and grading. Utilizes paddles to fluidize material and screen fragile powders without degradation.',
    features: [
      'Cantilever shaft allows screen changes in under 60 seconds.',
      'Tool-free disassembly for rapid hygiene washdown.',
      'Quiet operation under 70 dBA at maximum load.',
      'Dual-action seal design for dust protection.',
      'Robust direct earthing kit included as standard.'
    ],
    industries: [
      'Dairy Processing',
      'Bakery & Flour Mills',
      'Pharmaceuticals',
      'Additive Manufacturing'
    ],
    applications: [
      'Bag emptying check screening',
      'Raw material ingredient sifting',
      'Fines removal from granules',
      'Delumping processed material'
    ],
    brochure: '/brochures/sievmaster_rota_screener.pdf',
    options: [
      { name: 'Ultrasonic Deblinding System', desc: 'Prevents screen blinding on sticky or high-fat powders.' },
      { name: 'Mobile Wheeled Support Frame', desc: 'C-frame design for mobile integration in tight spaces.' },
      { name: 'Underscreen Magnet Drawer', desc: 'Rare-earth magnets rated at 12,000 Gauss.' },
      { name: 'Weir Flow Inlet', desc: 'Controls feed rate to protect screening mesh.' }
    ],
    specs: [
      { label: 'Throughput Capacity', value: 'Up to 35,000 kg/hr' },
      { label: 'Basket Models', value: '90-C / 180-C / 360-C' },
      { label: 'Mesh Range', value: '100µm to 8mm' },
      { label: 'Motor Power', value: '1.1kW - 5.5kW' },
      { label: 'Compliance', value: 'FDA, EC 1935/2004, CE' },
      { label: 'Material', value: 'SS316L Contact Parts' }
    ]
  },
  {
    id: 'pressure-homogenizer',
    name: 'HIGH PRESSURE HOMOGENIZER',
    category: 'PROCESSING',
    image: images.products.homogenizer,
    highlights: [
      'Ultra-fine particle size reduction',
      'Operating pressures up to 1,500 bar',
      'Sanitary CIP/SIP ready block design',
      'ASME-compliant pressure fluid end',
      'Double containment plunger assemblies'
    ],
    overview: 'Advanced high-pressure homogenizer designed for continuous particle size reduction and emulsion stabilization. Operates in high-throughput chemical, biotech, and food manufacturing systems.',
    features: [
      'High-shear particle dispersion down to nanometer range.',
      'Cobalt alloy valve seats with reversible wear surfaces.',
      'Pneumatic pressure adjustment with digital telemetry.',
      'Stainless steel monoblock pump head without welds.',
      'Hygienic plunger lubrication and water cooling loop.'
    ],
    industries: [
      'Biotechnology & Vaccines',
      'Dairy & Food processing',
      'Cosmetics Formulation',
      'Chemical Synthesis'
    ],
    applications: [
      'Cell disruption and rupture',
      'Stabilization of milk/beverage emulsions',
      'Preparation of liposomes and nanoparticles',
      'Dispersing cosmetic active ingredients'
    ],
    brochure: '/brochures/flowforce_homogenizer_specs.pdf',
    options: [
      { name: 'Aseptic Steam Jackets', desc: 'Steam sterilization barrier for biotech cleanrooms.' },
      { name: 'Dual-Stage Valve System', desc: 'Secondary valve to control emulsion viscosity.' },
      { name: 'Wear-Resistant Stellite Valves', desc: 'For highly abrasive slurry processing.' },
      { name: 'PLC Automated Control Cabinet', desc: 'Siemens HMI interface for flow control.' }
    ],
    specs: [
      { label: 'Max Pressure', value: '1,500 bar' },
      { label: 'Operating Flow Rate', value: '500 L/h - 8,000 L/h' },
      { label: 'Pump Drive', value: '3-Plunger Reciprocating' },
      { label: 'Lubrication', value: 'Forced Oil Circuit' },
      { label: 'Standards', value: '3-A Sanitary, ASME BPE' },
      { label: 'Drive Power', value: '15kW - 75kW' }
    ]
  },
  {
    id: 'self-cleaning-filter',
    name: 'AUTOMATIC SELF-CLEANING FILTER',
    category: 'FILTRATION',
    image: images.products.selfCleaningFilter,
    highlights: [
      'Continuous filtration without downtime',
      'Pneumatic scraper cleaning mechanism',
      'Zero consumable filter bag waste',
      'Differential pressure purge trigger',
      'Robust SS316L vessel construction'
    ],
    overview: 'High-performance automatic self-cleaning filter designed for continuous liquid filtration. Automatically clears debris using a scraper mechanism without interrupting process flow.',
    features: [
      'Online automated cleaning prevents process shutdowns.',
      'Stainless steel wedge-wire element is cleanable and reusable.',
      'Minimal product loss during sludge purging.',
      'Fully enclosed system prevents VOC emissions.',
      'ATEX rating standard for volatile solvent filtration.'
    ],
    industries: [
      'Paints & Ink Processing',
      'Chocolate & Confectionery',
      'Water Treatment & Recycling',
      'Chemical Processing'
    ],
    applications: [
      'Straining raw liquid chocolate',
      'Filtering cooling tower water lines',
      'Removing agglomerates from coatings',
      'Pre-filtration for RO membranes'
    ],
    brochure: '/brochures/automatic_filter_datasheet.pdf',
    options: [
      { name: 'Thermal Heating Jacket', desc: 'Keeps temperature-sensitive products like chocolate liquid.' },
      { name: 'Duplex Skid Assembly', desc: 'Allows parallel filtration or 100% duty cycle backup.' },
      { name: 'Magnetic Separation Core', desc: 'Pulls out sub-micron ferrous metal contamination.' },
      { name: 'Explosion-Proof Actuator', desc: 'Pneumatic drive for hazardous environments.' }
    ],
    specs: [
      { label: 'Filtration Rating', value: '25µm - 1500µm' },
      { label: 'Pressure Rating', value: '10 bar / 16 bar' },
      { label: 'Max Viscosity', value: 'Up to 60,000 cP' },
      { label: 'Purge Valve', value: 'Automated Pneumatic Ball Valve' },
      { label: 'Standards', value: 'ASME VIII / CE / FDA' },
      { label: 'Element Type', value: 'Heavy Duty Wedge Wire' }
    ]
  },
  {
    id: 'bag-filter-housing',
    name: 'BAG FILTER HOUSING',
    category: 'FILTRATION',
    image: images.products.bagFilterHousing,
    highlights: [
      'ASME Section VIII design code',
      'Swing-bolt quick opening cover',
      'Spring-assisted davit lid lift',
      'Accommodates 2 to 24 filter bags',
      'Sanitary SS316L internal construction'
    ],
    overview: 'Heavy-duty multi-bag pressure vessels designed for high-capacity liquid filtration applications. Equipped with an ergonomic swing-bolt closure and spring lift for operator safety and efficiency.',
    features: [
      'Spring-assisted lid allows single-operator opening.',
      'ASME code stamping available for chemical process lines.',
      'Zero bypass bag sealing collar design.',
      'Low fluid retention volume for fast batch changes.',
      'Corrosion-resistant epoxy outer paint coating.'
    ],
    industries: [
      'Chemical Refineries',
      'Water Desalination Plants',
      'Food & Beverage Bottling',
      'Power Generation'
    ],
    applications: [
      'Bulk liquid filtration',
      'Pre-RO membrane protection',
      'Cooling water loop filtering',
      'Catalyst recovery screening'
    ],
    brochure: '/brochures/multi_bag_filter_catalog.pdf',
    options: [
      { name: 'Duplex Valve Setup', desc: 'Allows switching bags without interrupting production flow.' },
      { name: 'Internal Magnet rods', desc: 'Traps metal scale before liquid enters bag.' },
      { name: 'Pressure Gauge Assembly', desc: 'Tees with isolation valves and DP transmitter.' },
      { name: 'Special Alloy Build', desc: 'Hastelloy C276 or Titanium option for acids.' }
    ],
    specs: [
      { label: 'Bag Size Compatibility', value: 'Standard Size 2 Bags' },
      { label: 'Housing Capacity', value: '2 to 24 Bags' },
      { label: 'Max Pressure Rating', value: '10 bar standard (16 bar optional)' },
      { label: 'Vessel Material', value: 'SS304, SS316L, Carbon Steel' },
      { label: 'Inlet/Outlet Size', value: '3" to 12" Flanged' },
      { label: 'Design Standard', value: 'ASME Sec VIII Div 1' }
    ]
  },
  {
    id: 'pneumatic-conveying',
    name: 'PNEUMATIC CONVEYING SYSTEM',
    category: 'CONVEYING',
    image: images.products.pneumaticConveying,
    highlights: [
      'Dense and dilute phase routing',
      'Low velocity gentle transportation',
      'Minimal pipeline and bend wear',
      'Acoustic blower enclosure option',
      'Dust-free closed loop operation'
    ],
    overview: 'Turnkey pneumatic conveying systems designed to transport dry bulk powders and granules across long distances. Specialized in low-velocity dense-phase transport to prevent product attrition.',
    features: [
      'Enclosed pipeline prevents dust escape and product spills.',
      'Pulsed air-injection booster nozzles prevent line plugs.',
      'Hygienic USDA-compliant receiver cyclones.',
      'Energy efficient rotary lobe or claw blower setups.',
      'Integrated scale cells for batch weight conveying.'
    ],
    industries: [
      'Dairy & Infant Formula',
      'Plastics & Polymers',
      'Cement & Dry Minerals',
      'Chemical Bulk Handling'
    ],
    applications: [
      'Infant formula dry blending feed',
      'Abrasive mineral transportation',
      'Silo loading and unloading loops',
      'Pneumatic bulk weighing systems'
    ],
    brochure: '/brochures/pneumatic_conveying_handbook.pdf',
    options: [
      { name: 'Ceramic Lined Piping', desc: 'Extends elbow life for highly abrasive materials.' },
      { name: 'Nitrogen Gas Recirculation', desc: 'For conveying flammable or hygroscopic powders.' },
      { name: 'Acoustic Sound Enclosure', desc: 'Reduces blower room noise to below 75 dBA.' },
      { name: 'Rotary Airlock Feeders', desc: 'Airlocks matched to conveyance pressures.' }
    ],
    specs: [
      { label: 'Transport Capacity', value: 'Up to 45,000 kg/hr' },
      { label: 'Conveying Distance', value: 'Up to 500m' },
      { label: 'Phase Style', value: 'Dense / Dilute / Vacuum' },
      { label: 'Control System', value: 'Rockwell ControlLogix PLC' },
      { label: 'Piping Material', value: 'SS304 / SS316 / Carbon Steel' },
      { label: 'Blower Power', value: '15kW - 90kW' }
    ]
  }
];
