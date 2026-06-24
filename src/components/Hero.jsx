import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { images } from '../data/images';
import HeroPipeline from './HeroPipeline';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const bgRef = useRef(null);
  const pipelineRef = useRef(null);

  useGSAP(() => {
    if (!headlineRef.current) return;

    // 1. Character-by-character headline reveal
    const text = new SplitType(headlineRef.current, { types: 'chars' });
    gsap.from(text.chars, {
      opacity: 0,
      y: 40,
      rotateX: -60,
      stagger: 0.018,
      duration: 0.9,
      ease: 'power4.out',
    });

    // 2. Pipeline visual — fade + scale up
    if (pipelineRef.current) {
      gsap.from(pipelineRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 1.2,
        delay: 0.4,
        ease: 'power3.out',
      });
    }

    // 3. Parallax bg on scroll
    gsap.to(bgRef.current, {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // 4. Mouse-follow depth parallax
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const xP = (clientX / w - 0.5) * 2;
      const yP = (clientY / h - 0.5) * 2;

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          x: -xP * 12,
          y: -yP * 12,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (pipelineRef.current) {
        gsap.to(pipelineRef.current, {
          x: xP * 6,
          y: yP * 4,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden"
      id="hero"
    >
      {/* ── Background image with parallax ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgRef}
          src={images.hero.background}
          alt="Industrial processing equipment"
          className="w-full h-full object-cover scale-110 will-change-transform"
          style={{ transformOrigin: 'center center' }}
          onError={(e) => {
            // Fallback to dark industrial pipes Unsplash
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920';
          }}
        />
        {/* Multi-layer dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1516] via-[#0d1516]/96 to-[#0d1516]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1516] via-transparent to-transparent" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        {/* Subtle cyan vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 80% 50%, rgba(0,224,255,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Main layout grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 relative z-10 py-8 items-center">

        {/* Left: text content */}
        <div className="flex flex-col justify-center space-y-8 lg:col-span-6 xl:col-span-5">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00e0ff]/8 border border-[#00e0ff]/20 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff] animate-pulse" />
            <span className="font-mono text-xs font-semibold tracking-widest text-[#00e0ff] uppercase">
              Flow Force Engineering
            </span>
          </motion.div>

          {/* Headline — SplitType target */}
          <h1
            ref={headlineRef}
            className="font-sans text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-on-surface leading-[1.05] tracking-tight will-change-transform"
            style={{ perspective: '600px' }}
          >
            Engineering the Future of Industrial Processing
          </h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-sans text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed"
          >
            Precision-engineered homogenizers, filtration systems, and bulk material
            handling equipment — built for continuous industrial operations since 2004.
          </motion.p>

          {/* Stat chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { value: '20+', label: 'Years Experience' },
              { value: '500+', label: 'Installations' },
              { value: '12', label: 'Industries Served' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="font-mono text-2xl font-black text-[#00e0ff] leading-none tracking-tight">
                  {value}
                </span>
                <span className="font-sans text-xs text-on-surface-variant mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#rfq"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#00e0ff] text-[#0d1516] font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,224,255,0.3)] hover:shadow-[0_0_50px_rgba(0,224,255,0.5)] group text-sm"
            >
              Request Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="#systems"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/15 text-on-surface hover:border-[#00e0ff]/40 rounded-lg font-bold backdrop-blur-sm hover:bg-white/5 transition-all duration-300 text-sm"
            >
              View Product Systems
            </a>
          </motion.div>
        </div>

        {/* Right: Process Pipeline Visual */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 items-center justify-center relative">
          <motion.div
            ref={pipelineRef}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative will-change-transform"
            style={{ height: '460px', minWidth: 0 }}
          >
            {/* Glass panel frame */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(22,29,31,0.7) 0%, rgba(13,21,22,0.9) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Top bar with data readout */}
              <div className="absolute top-0 left-0 right-0 h-9 border-b border-white/6 flex items-center px-4 gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00e0ff] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase">
                    Live Process Line
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="font-mono text-[9px] text-on-surface-variant tracking-wider">
                    FLOW: 850 L/H
                  </span>
                  <span className="font-mono text-[9px] text-on-surface-variant tracking-wider">
                    PRESSURE: 1,200 bar
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              {/* Pipeline SVG component */}
              <div className="absolute inset-0 top-9 bottom-10">
                <HeroPipeline />
              </div>

              {/* Bottom instruction hint */}
              <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 flex items-center justify-center">
                <p className="font-mono text-[9px] text-on-surface-variant tracking-wider opacity-60">
                  TAP A NODE TO INSPECT PRODUCT
                </p>
              </div>
            </div>

            {/* Ambient glow under the panel */}
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(0,224,255,0.15) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="font-mono text-[9px] text-on-surface-variant tracking-[0.2em] uppercase opacity-50">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-[#00e0ff] opacity-50 animate-bounce" />
      </motion.div>
    </section>
  );
}
