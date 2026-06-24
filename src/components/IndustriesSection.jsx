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
  Check
} from 'lucide-react';
import { images } from '../data/images';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Extended B2B Industry details for the 3D presentation slides (PPT style)
const INDUSTRIES_DATA = [
  {
    name: "Food & Beverage",
    icon: Utensils,
    image: images.industries.foodProcessing,
    description: "Hygienic product conveying, particle size reduction, and precise filtration for food-safe systems.",
    standards: "FDA, 3-A Sanitary, USDA",
    focus: "Sanitary raw material conveying, precise particle size classification, and closed-loop dust extraction to prevent cross-contamination and guarantee food safety compliance.",
    systems: [
      "Sanitary Dilute Phase Conveyors",
      "USDA-Compliant Rotary Valves",
      "Automated Clean-in-Place Loops",
      "High-Efficiency Cyclone Separators"
    ]
  },
  {
    name: "Dairy Processing",
    icon: Milk,
    image: images.industries.dairy,
    description: "Homogenizers and sanitary filtration systems complying with top sanitary certification standards.",
    standards: "EHEDG, 3-A Sanitary, FDA",
    focus: "High-pressure fat globule reduction, inline sanitary filtration, and automated thermal control loops engineered to optimize dairy emulsion stability and shelf-life.",
    systems: [
      "BOS Series High-Pressure Homogenizers",
      "EHEDG-Certified Sanitary Filters",
      "Double-Wall Thermal Control Units",
      "Aseptic Product Storage Silos"
    ]
  },
  {
    name: "Pharmaceutical",
    icon: FlaskConical,
    image: images.industries.pharmaceutical,
    description: "Ultra-pure liquid filtration and containment solutions engineered to prevent process contamination.",
    standards: "USP Class VI, ASME BPE, cGMP",
    focus: "Total sterile isolation, absolute particulate filtration, and high-containment material transfer to prevent active pharmaceutical ingredient (API) cross-contamination.",
    systems: [
      "Sterile Liquid Filtration Housings",
      "ASME BPE Swing-Bolt Vessels",
      "High-Containment Powder Airlocks",
      "CIP-Validated Tri-Clamp Assemblies"
    ]
  },
  {
    name: "Chemical & Polymer",
    icon: Boxes,
    image: images.industries.chemical,
    description: "Corrosion-resistant vessels, self-cleaning filtration, and specialized powder handling.",
    standards: "ATEX Zone 0/1, ASME Sec. VIII, ISO 9001",
    focus: "Conveying, blending, and filtering aggressive, corrosive, highly abrasive, or explosive compounds under extreme pressure and thermal operational parameters.",
    systems: [
      "Corrosion-Resistant ASME Reactors",
      "Pneumatic Scraper Self-Cleaning Filters",
      "Heavy-Duty Screw & Drag Conveyors",
      "ATEX-Certified Pressure Silos"
    ]
  },
  {
    name: "Industrial Manufacturing",
    icon: Building2,
    image: images.industries.manufacturing,
    description: "Heavy-duty dust collection, pneumatic conveying lines, and bulk bag packaging plants.",
    standards: "OSHA Combustible Dust, ISO 9001",
    focus: "Large-scale continuous raw material transport, heavy-duty scrap separation, and facility safety through high-capacity pulse-jet explosion dust extraction.",
    systems: [
      "Pulse-Jet Baghouse Dust Collectors",
      "Dense Phase Conveying Pipelines",
      "FIBC Big Bag Unloading Stations",
      "Heavy-Duty Rotary Airlock Valves"
    ]
  },
  {
    name: "Water Treatment",
    icon: Droplet,
    image: images.industries.waterTreatment,
    description: "Automatic self-cleaning filters and strainer installations for municipal or factory water loops.",
    standards: "NSF/ANSI 61, AWWA Standards",
    focus: "High-volume filtration of intake water, process water loop treatment, and automated particle extraction to protect downstream capital equipment from fouling.",
    systems: [
      "Automatic Backwash Strainers",
      "Multi-Bag Liquid Filtration Housings",
      "High-Volume Cyclone Separator Wells",
      "Automated Differential Pressure Manifolds"
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
          src={ind.image} 
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
          {ind.description}
        </p>
        <span className="font-mono text-[9px] text-[#00e0ff]/60 tracking-wider uppercase block pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to open presentation →
        </span>
      </div>
    </div>
  );
}

export default function IndustriesSection() {
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

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

  // Open modal at selected index
  const openModal = (index) => {
    setActiveIndex(index);
    setDirection(0);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent main page scrolling
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % INDUSTRIES_DATA.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + INDUSTRIES_DATA.length) % INDUSTRIES_DATA.length);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const activeSlide = INDUSTRIES_DATA[activeIndex];
  const ActiveIcon = activeSlide.icon;

  // Widescreen 3D PPT Slide transition variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 350 : dir < 0 ? -350 : 0,
      rotateY: dir > 0 ? 45 : dir < 0 ? -45 : 0,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        rotateY: { duration: 0.6, ease: "easeOut" },
        scale: { duration: 0.5, ease: "easeOut" }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 350 : dir > 0 ? -350 : 0,
      rotateY: dir < 0 ? 45 : dir > 0 ? -45 : 0,
      opacity: 0,
      scale: 0.92,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        rotateY: { duration: 0.5, ease: "easeIn" },
        scale: { duration: 0.4, ease: "easeIn" }
      }
    })
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

      {/* ─── PowerPoint-Style Widescreen Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080f11]/97 backdrop-blur-2xl p-4 md:p-8 overflow-hidden select-none"
          >
            {/* Modal Wrapper Frame */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-5xl bg-gradient-to-br from-[#0c1213]/95 to-[#080f11]/98 border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between aspect-auto min-h-[90vh] lg:min-h-0 lg:aspect-[16/10]"
            >
              {/* Top Bar with Brand and Close Button */}
              <div className="flex items-center justify-between px-8 md:px-12 py-6 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00e0ff] animate-pulse" />
                  <span className="font-mono text-xs text-glow-accent text-[#00e0ff] font-semibold tracking-widest uppercase">
                    Interactive Capability Deck
                  </span>
                </div>

                <button 
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-[#00e0ff]/10 hover:border-[#00e0ff]/30 text-on-surface-variant hover:text-[#00e0ff] flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slide Content Area (Dynamic 3D Transition) */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden py-8 px-8 md:px-12" style={{ perspective: 1200 }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  >
                    {/* Left: Text Technical Specs */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                      <div className="space-y-4">
                        {/* Index Indicator */}
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-[#00e0ff] tracking-widest uppercase">
                            Slide {String(activeIndex + 1).padStart(2, '0')} of 06
                          </span>
                          <div className="h-px w-8 bg-white/20" />
                          <span className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">
                            SYSTEM DESIGN
                          </span>
                        </div>

                        {/* Title with Icon */}
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#00e0ff]/10 rounded-xl border border-[#00e0ff]/25 text-[#00e0ff]">
                            <ActiveIcon className="w-7 h-7" />
                          </div>
                          <h3 className="font-sans text-3xl md:text-4xl font-black text-on-surface tracking-tight leading-tight">
                            {activeSlide.name}
                          </h3>
                        </div>

                        {/* Standards Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/8 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff]" />
                          <span className="font-mono text-[9px] text-on-surface-variant tracking-wider uppercase">
                            STANDARDS: {activeSlide.standards}
                          </span>
                        </div>
                      </div>

                      {/* Focus Description */}
                      <div className="space-y-2">
                        <p className="font-mono text-[10px] text-on-surface-variant/55 tracking-widest uppercase">
                          Engineering Focus
                        </p>
                        <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed font-normal">
                          {activeSlide.focus}
                        </p>
                      </div>

                      {/* Systems List */}
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <p className="font-mono text-[10px] text-on-surface-variant/55 tracking-widest uppercase">
                          Typical Systems Installed
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeSlide.systems.map((system) => (
                            <div key={system} className="flex items-center gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-[#00e0ff]/10 border border-[#00e0ff]/20 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-[#00e0ff]" />
                              </div>
                              <span className="font-sans text-xs text-on-surface font-medium">
                                {system}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: 3D Image Presentation */}
                    <div className="lg:col-span-6 flex justify-center items-center">
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0],
                          rotateX: [0, 2, 0],
                          rotateY: [0, -3, 0]
                        }}
                        transition={{ 
                          duration: 6, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden glass-panel p-2 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <img 
                          src={activeSlide.image} 
                          alt={activeSlide.name} 
                          className="w-full h-full object-cover rounded-xl select-none"
                        />
                        {/* Atmospheric lighting gradient overlay on top of image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#080f11]/60 via-transparent to-[#00e0ff]/5 pointer-events-none rounded-xl" />
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation Control Bar */}
              <div className="flex items-center justify-between border-t border-white/5 px-8 md:px-12 py-6 bg-[#080f11]/60 shrink-0 select-none">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-white/10 bg-[#0d1516]/80 hover:bg-[#00e0ff]/10 hover:border-[#00e0ff]/30 text-[#00e0ff] flex items-center justify-center transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Progress Indicators (Dots) */}
                <div className="flex gap-2">
                  {INDUSTRIES_DATA.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > activeIndex ? 1 : -1);
                        setActiveIndex(i);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex 
                          ? 'w-8 bg-[#00e0ff]' 
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-white/10 bg-[#0d1516]/80 hover:bg-[#00e0ff]/10 hover:border-[#00e0ff]/30 text-[#00e0ff] flex items-center justify-center transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
