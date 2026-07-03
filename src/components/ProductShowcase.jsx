import { useRef, useState } from 'react';
import {
  ArrowRight, Gauge, Filter, Layers, RefreshCw,
  Wind, Database, Disc, Package, ArrowUpRight,
} from 'lucide-react';
import { images } from '../data/images';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Product Data ─── */
const PRODUCTS = [
  {
    id: 'homogenizer',
    name: 'High Pressure Homogenizer',
    category: 'PROCESSING',
    icon: Gauge,
    image: images.products.homogenizer,
    accent: '#00e0ff',
    description:
      'Advanced high-shear particle reduction for stable emulsions and cell disruption in chemical, food, and pharmaceutical sectors.',
    specs: [
      { label: 'Max Pressure', value: '1,500 bar' },
      { label: 'Drive Type', value: '3-plunger' },
      { label: 'Valve Seat', value: 'Cobalt alloy' },
      { label: 'Standard', value: 'CIP ready' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'selfCleaningFilter',
    name: 'Self Cleaning Filter',
    category: 'FILTRATION',
    icon: RefreshCw,
    image: images.products.selfCleaningFilter,
    accent: '#00b4d8',
    description:
      'Automatic scraper and backwash filters that eliminate downtime, clearing debris without interrupting process flow.',
    specs: [
      { label: 'Clean Method', value: 'Pneumatic scraper' },
      { label: 'Consumables', value: 'Zero waste' },
      { label: 'Trigger', value: 'DP automated' },
      { label: 'Material', value: 'SS316L' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'bagFilter',
    name: 'Bag Filter Housing',
    category: 'FILTRATION',
    icon: Layers,
    image: images.products.bagFilterHousing,
    accent: '#0096c7',
    description:
      'Heavy-duty ASME-compliant pressure vessels engineered for standard and high-capacity liquid filtration bags.',
    specs: [
      { label: 'Code', value: 'ASME Sec. VIII' },
      { label: 'Closure', value: 'Swing-bolt / clamp' },
      { label: 'Capacity', value: 'Up to 24 bags' },
      { label: 'Max Pressure', value: '10 bar g' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'cyclone',
    name: 'Cyclone Separator',
    category: 'SEPARATION',
    icon: Filter,
    image: images.products.cycloneSeparator,
    accent: '#48cae4',
    description:
      'High-efficiency centrifugal particle separation for dust and bulk material classification in pneumatic systems.',
    specs: [
      { label: 'Separation', value: 'Centrifugal' },
      { label: 'Media', value: 'Dry bulk / dust' },
      { label: 'Temp Range', value: 'Up to 250 °C' },
      { label: 'Material', value: 'SS304 / CS' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'pneumatic',
    name: 'Pneumatic Conveying System',
    category: 'CONVEYING',
    icon: Disc,
    image: images.products.pneumaticConveying,
    accent: '#90e0ef',
    description:
      'Dense and dilute phase systems for gentle or high-velocity bulk material transport across long distances.',
    specs: [
      { label: 'Phase Type', value: 'Dense / dilute' },
      { label: 'Feeders', value: 'Airlock rotary' },
      { label: 'Distance', value: 'Up to 500 m' },
      { label: 'Products', value: 'Fragile & abrasive' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'siloSystem',
    name: 'Silo Storage System',
    category: 'STORAGE',
    icon: Database,
    image: images.products.siloSystem,
    accent: '#00e0ff',
    description:
      'Dry bulk storage silos with integrated fluidizers, level telemetry, and explosion-safe venting installations.',
    specs: [
      { label: 'Material', value: 'SS304 / Aluminium' },
      { label: 'Level', value: 'Load cell / radar' },
      { label: 'Protection', value: 'Explosion vent panel' },
      { label: 'Discharge', value: 'Fluidized cone' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'dustCollector',
    name: 'Dust Collector Unit',
    category: 'DUST CONTROL',
    icon: Wind,
    image: images.products.dustCollector,
    accent: '#00b4d8',
    description:
      'Baghouse extraction systems capturing process particulate, dust, and fume to meet environmental compliance.',
    specs: [
      { label: 'Clean Method', value: 'Pulse-jet' },
      { label: 'Standard', value: 'ATEX rated' },
      { label: 'Post-filter', value: 'HEPA option' },
      { label: 'Filtration', value: '≥99.9% at 1µm' },
    ],
    href: 'https://flow-force.com',
  },
  {
    id: 'bigBag',
    name: 'Big Bag Handling',
    category: 'BULK HANDLING',
    icon: Package,
    image: images.products.bigBagHandling,
    accent: '#0096c7',
    description:
      'Integrated FIBC unloading and filling stations with dust containment, stretching rigs, and downstream transfer.',
    specs: [
      { label: 'Capacity', value: 'Up to 1,500 kg' },
      { label: 'Control', value: 'Dust hood clamp' },
      { label: 'Lifting', value: 'Pneumatic rig' },
      { label: 'Transfer', value: 'Screw / rotary' },
    ],
    href: 'https://flow-force.com',
  },
];

/* ─── Product Card ─── */
function ProductCard({ prod, index }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const Icon = prod.icon;

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((cy - y) / cy) * 7;
    const rotY = ((x - cx) / cx) * 7;

    // Move glow spot
    if (glowRef.current) {
      glowRef.current.style.left = `${x}px`;
      glowRef.current.style.top = `${y}px`;
    }

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      scale: 1.02,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1.07, duration: 0.6, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1, duration: 0.55, ease: 'power2.out' });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={`relative group rounded-2xl overflow-hidden border transition-colors duration-500 w-[88vw] sm:w-[380px] md:w-[420px] lg:w-[400px] shrink-0 flex flex-col
        ${hovered ? 'border-[#00e0ff]/35' : 'border-white/7'}
      `}
    >
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(22,29,31,0.92) 0%, rgba(13,21,22,0.98) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      />

      {/* Mouse-follow glow spot */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none rounded-full transition-opacity duration-300"
        style={{
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${prod.accent}22 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: hovered ? 1 : 0,
          zIndex: 0,
        }}
      />

      {/* Image zone */}
      <div
        className="relative overflow-hidden"
        style={{ height: 240, transform: 'translateZ(30px)', zIndex: 1 }}
      >
        <img
          ref={imgRef}
          src={prod.image}
          alt={prod.name}
          loading="lazy"
          className="w-full h-full object-cover will-change-transform"
          style={{ transformOrigin: 'center center' }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1516] via-[#0d1516]/20 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[9px] tracking-widest font-bold border"
            style={{
              backgroundColor: `${prod.accent}18`,
              borderColor: `${prod.accent}40`,
              color: prod.accent,
            }}
          >
            <span className="w-1 h-1 rounded-full" style={{ background: prod.accent }} />
            {prod.category}
          </span>
        </div>

        {/* Icon */}
        <div
          className="absolute top-4 right-4 p-2.5 rounded-xl border border-white/10"
          style={{
            background: 'rgba(13,21,22,0.8)',
            backdropFilter: 'blur(8px)',
            color: prod.accent,
            transform: 'translateZ(20px)',
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Content body */}
      <div
        className="relative flex-1 flex flex-col p-6 space-y-4 z-1"
        style={{ transform: 'translateZ(20px)', zIndex: 1 }}
      >
        <div>
          <h3
            className="font-sans text-xl font-black text-on-surface leading-tight transition-colors duration-300"
            style={{ color: hovered ? prod.accent : undefined }}
          >
            {prod.name}
          </h3>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed mt-2">
            {prod.description}
          </p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/6">
          {prod.specs.map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <p className="font-mono text-[9px] tracking-widest text-on-surface-variant uppercase opacity-60">
                {label}
              </p>
              <p
                className="font-mono text-xs font-bold"
                style={{ color: prod.accent }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

/* ─── ProductShowcase (main export) ─── */
export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const headerRef = useRef(null);

  useGSAP(() => {
    // Header slide-in
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 85%',
      },
    });

    // Match media: horizontal scroll on desktop only
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const getAmount = () => trackRef.current.scrollWidth - window.innerWidth + 120;

      const tween = gsap.to(trackRef.current, {
        x: () => -getAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: pinRef.current,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${getAmount()}`,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    });

    // Video player fade-in
    gsap.from(".product-video-card", {
      opacity: 0,
      y: 45,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ".product-video-card",
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="systems" className="relative bg-[#080f11] overflow-visible">

      {/* Pin container */}
      <div
        ref={pinRef}
        className="relative md:h-screen w-full flex flex-col justify-center py-24 md:py-0 overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/3 left-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,224,255,0.025) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,128,255,0.02) 0%, transparent 70%)',
          }}
        />

        {/* Section header */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full mb-10 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-8 bg-[#00e0ff]" />
                <span className="font-mono text-xs font-semibold tracking-widest text-[#00e0ff] uppercase">
                  Precision Hardware
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
                B2B Product Portfolio
              </h2>
              <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg max-w-xl">
                Engineered machinery built for continuous duty cycles in high-throughput industrial plants.
                Drag to explore.
              </p>
            </div>

          </div>
        </div>

        {/* Horizontal scroll track */}
        <div className="relative w-full overflow-x-auto md:overflow-visible scrollbar-none pb-6 md:pb-0">
          <div
            ref={trackRef}
            className="flex gap-8 pl-6 md:pl-[max(24px,calc((100vw-1280px)/2+48px))] pr-6 md:pr-16 w-fit"
          >
            {PRODUCTS.map((prod, i) => (
              <ProductCard key={prod.id} prod={prod} index={i} />
            ))}

            {/* End card — CTA */}
            <div className="flex items-center justify-center w-[260px] shrink-0">
              <div className="text-center p-8 rounded-2xl border border-white/8 bg-white/2 space-y-4">
                <div
                  className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
                  style={{ background: 'rgba(0,224,255,0.1)', border: '1px solid rgba(0,224,255,0.3)' }}
                >
                  <ArrowRight className="w-6 h-6 text-[#00e0ff]" />
                </div>
                <p className="font-sans text-sm font-bold text-on-surface">
                  Need a Custom Configuration?
                </p>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Our engineers will design the right system for your process.
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator (mobile desktop) */}
        <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2 z-10">
          <div className="h-px w-24 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-[#00e0ff]/60 rounded-full" style={{ transition: 'width 0.3s' }} />
          </div>
          <span className="font-mono text-[9px] text-on-surface-variant tracking-widest uppercase opacity-40">
            Scroll to explore
          </span>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="relative py-20 md:py-28 px-6 max-w-7xl mx-auto z-10 w-full flex flex-col items-center border-t border-white/5">
        
        {/* Glowing electric blue ambient circle behind video */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none rounded-full bg-[#00AEEF]/5 blur-[120px] z-0" />
        
        {/* Label */}
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#00AEEF] uppercase mb-6 z-10 text-center">
          ROTARY VALVE — PRODUCT HIGHLIGHT
        </span>

        {/* Video Card */}
        <div className="product-video-card w-full max-w-[900px] rounded-2xl border border-[#00AEEF] bg-[#0c1213]/90 shadow-[0_0_40px_rgba(0,174,239,0.25)] overflow-hidden z-10 relative">
          <video
            src="/Flow_Force_Rotary_Valve_highlight_202606261412_gwr_video_mvp.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-auto aspect-video object-cover"
          />
        </div>
        
      </div>
    </section>
  );
}
