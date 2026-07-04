import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { Play, Settings, ShieldCheck, RefreshCw, Layers, Shield, Award, Activity, Sliders, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 'inlet', num: 1, name: 'FEED INLET', desc: 'Material enters the sifter through the inlet.', x: 50, y: 20, connectorEnd: { x: 35, y: 14 } },
  { id: 'chamber', num: 2, name: 'SCREENING CHAMBER', desc: 'Material is separated using high-speed centrifugal force.', x: 50, y: 42, connectorEnd: { x: 32, y: 45 } },
  { id: 'outlet', num: 3, name: 'FINE MATERIAL DISCHARGE', desc: 'Fine particles pass through the screen and exit.', x: 42, y: 68, connectorEnd: { x: 25, y: 78 } },
  { id: 'coarse', num: 4, name: 'COARSE DISCHARGE', desc: 'Oversize particles are discharged separately.', x: 58, y: 68, connectorEnd: { x: 75, y: 78 } },
  { id: 'motor', num: 5, name: 'MOTOR DRIVE', desc: 'High-performance motor powers the rotor.', x: 68, y: 52, connectorEnd: { x: 85, y: 48 } }
];

export default function ProductDetail({ productId, onBack }) {
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const GALLERY_IMAGES = [
    { id: 1, label: "Component View 1" },
    { id: 2, label: "Component View 2" },
    { id: 3, label: "Component View 3" }
  ];

  const videoRef = useRef(null);
  const cockpitRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener('ended', handleEnded);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => console.log("Video play deferred:", err));
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(video);

    return () => {
      if (video) {
        observer.unobserve(video);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  useEffect(() => {
    const element = cockpitRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.12 }
    );
    observer.observe(element);
    return () => { if (element) observer.unobserve(element); };
  }, []);

  const autoPlayInterval = useRef(null);
  useEffect(() => {
    if (isRunning) {
      autoPlayInterval.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % TIMELINE_STEPS.length);
      }, 4000);
    } else {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    }
    return () => { if (autoPlayInterval.current) clearInterval(autoPlayInterval.current); };
  }, [isRunning]);

  const handleSelectThumb = (thumbId) => {
    if (thumbId === 'complete') {
      setActiveStep(0);
      setIsExploded(false);
    } else {
      const idx = TIMELINE_STEPS.findIndex(h => h.id === thumbId);
      if (idx !== -1) setActiveStep(idx);
    }
  };

  const handleDownload = () => alert(`Downloading complete CAD specifications for: ${product.name}`);
  const handleTogglePlay = () => setIsRunning(!isRunning);
  const handleRestart = () => { setActiveStep(0); setIsRunning(false); setIsExploded(false); };

  return (
    <div className="w-full relative z-20 pb-12 bg-transparent">
      <main ref={cockpitRef} className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-6 md:gap-12 relative pt-8 md:pt-12">
        
        {/* ─── TOP SECTION: IMAGE GALLERY & HIGHLIGHTS ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
          
          {/* Left/Center: Image Gallery Grid Placeholder (9 cols) */}
          <div className={`lg:col-span-9 flex flex-col gap-4 scroll-reveal delay-100 ${isVisible ? 'active' : ''}`}>
            
            {/* Primary Image Gallery Area */}
            <div className="glass-panel w-full flex-grow min-h-[400px] flex items-center justify-center p-4 relative overflow-hidden group">
               <div className="w-full h-full min-h-[400px] rounded-xl border-2 border-dashed border-[var(--glass-border)] flex flex-col items-center justify-center bg-[rgba(255,255,255,0.2)]">
                   <span className="font-display text-xl md:text-3xl tracking-widest uppercase text-center font-black" style={{ color: 'var(--text-body)' }}>
                     {GALLERY_IMAGES[currentImageIndex].label}
                   </span>
                   <span className="font-sans text-xs md:text-sm tracking-wider uppercase mt-2 opacity-70" style={{ color: 'var(--text-body)' }}>
                     Gallery Placeholder
                   </span>
               </div>
               
               {/* Navigation Arrows */}
               <button 
                 type="button"
                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(prev => prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1); }}
                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-3 text-gray-800 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white z-20 cursor-pointer pointer-events-auto"
               >
                 <ChevronLeft className="w-6 h-6 pointer-events-none" />
               </button>
               <button 
                 type="button"
                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(prev => prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1); }}
                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-3 text-gray-800 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white z-20 cursor-pointer pointer-events-auto"
               >
                 <ChevronRight className="w-6 h-6 pointer-events-none" />
               </button>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
               {GALLERY_IMAGES.map((img, idx) => {
                   const isActive = currentImageIndex === idx;
                   return (
                   <button 
                     type="button"
                     key={img.id} 
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(idx); }}
                     className={`glass-panel w-full h-24 md:h-32 flex items-center justify-center rounded-xl p-2 cursor-pointer transition-colors group ${isActive ? 'border-[#f5820c] shadow-[0_0_15px_rgba(245,130,12,0.3)]' : 'hover:border-[#f5820c]'}`}
                   >
                        <div className={`pointer-events-none w-full h-full rounded-lg border flex items-center justify-center transition-colors ${isActive ? 'border-[#f5820c] bg-[rgba(245,130,12,0.1)]' : 'border-dashed border-[var(--glass-border)] bg-[rgba(255,255,255,0.1)] group-hover:bg-[rgba(245,130,12,0.05)]'}`}>
                             <span className="font-mono text-xs uppercase font-bold" style={{ color: isActive ? '#f5820c' : 'var(--text-body)' }}>Thumb {idx + 1}</span>
                        </div>
                   </button>
                   );
               })}
            </div>
          </div>

          {/* Right: Highlights & Overview (3 cols) */}
          <div className={`lg:col-span-3 flex flex-col justify-between gap-6 text-left scroll-reveal delay-300 ${isVisible ? 'active' : ''}`}>
            
            {/* Key Highlights */}
            <div className="glass-panel p-6 relative">
              <span className="font-display text-sm md:text-base tracking-wider font-extrabold block mb-5 uppercase" style={{ color: 'var(--text-heading)' }}>
                KEY HIGHLIGHTS
              </span>
              <div className="space-y-4">
                {[
                  { title: 'HIGH SCREENING EFFICIENCY', desc: 'Up to 99% separation accuracy.', icon: <Award className="w-5 h-5 text-[#f5820c]" /> },
                  { title: 'LOW MAINTENANCE', desc: 'Minimal moving parts for long-term use.', icon: <Settings className="w-5 h-5 text-[#f5820c]" /> },
                  { title: 'HYGIENIC DESIGN', desc: 'FDA-compliant contact assemblies.', icon: <ShieldCheck className="w-5 h-5 text-[#f5820c]" /> },
                  { title: 'EASY & QUICK CLEANING', desc: 'Hygienic tool-free access hatch doors.', icon: <RefreshCw className="w-5 h-5 text-[#f5820c]" /> },
                  { title: 'FOOD & PHARMA GRADE', desc: 'SS316L high polish sanitary standard.', icon: <Shield className="w-5 h-5 text-[#f5820c]" /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-md border flex items-center justify-center shrink-0" style={{ borderColor: 'var(--glass-border)', backgroundColor: '#fff' }}>
                      {item.icon}
                    </div>
                    <div className="text-left leading-normal">
                      <span className="font-display text-xs tracking-wide block font-black" style={{ color: 'var(--text-heading)' }}>{item.title}</span>
                      <span className="font-sans text-[11px] block mt-0.5" style={{ color: 'var(--text-body)' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Machine Overview */}
            <div className="glass-panel p-6 relative flex flex-col justify-between gap-4">
              <div>
                <span className="font-display text-sm md:text-base tracking-wider font-extrabold block mb-4 uppercase" style={{ color: 'var(--text-heading)' }}>
                  MACHINE OVERVIEW
                </span>
                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { label: 'Model', val: 'FF-CS-1200' },
                    { label: 'Motor Power', val: '7.5 kW' },
                    { label: 'Screen Diameter', val: '1200 mm' },
                    { label: 'Screen Layers', val: '1 to 5' },
                    { label: 'Capacity', val: '500 - 5000 kg/hr' },
                    { label: 'Material', val: 'SS 304 / 316' }
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--glass-border)' }}>
                      <span className="uppercase font-semibold" style={{ color: 'var(--text-body)' }}>{spec.label}</span>
                      <span className="font-black uppercase" style={{ color: 'var(--accent)' }}>{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── BOTTOM SECTION: PROCESS FLOW & VIDEO ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
          
          {/* Left: Process Flow (4 cols) */}
          <div className={`lg:col-span-4 flex flex-col justify-between glass-panel p-6 relative overflow-hidden select-none scroll-reveal delay-500 ${isVisible ? 'active' : ''}`}>
            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] uppercase" style={{ color: 'var(--text-body)', opacity: 0.5 }}>FLOW_SYS</div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-base md:text-lg tracking-wider font-extrabold uppercase" style={{ color: 'var(--text-heading)' }}>
                  PROCESS FLOW
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-8">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'var(--accent)' }} />
                <span className="font-mono text-[10px] md:text-xs uppercase font-bold tracking-widest" style={{ color: 'var(--accent)' }}>
                  {isRunning ? 'Live Simulation Active' : 'Simulation Paused'}
                </span>
              </div>

              <div className="relative space-y-7 text-left pl-3">
                <div className="absolute left-[25px] top-4 bottom-4 w-0.5 z-0" style={{ backgroundColor: 'var(--glass-border)' }} />

                {TIMELINE_STEPS.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <div key={step.id} onClick={() => setActiveStep(idx)} className="flex gap-5 items-start relative z-10 cursor-pointer group">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0`}
                        style={{ 
                          backgroundColor: isActive ? 'var(--accent)' : 'var(--glass-bg)', 
                          borderColor: isActive ? 'var(--accent)' : 'var(--glass-border)',
                          color: isActive ? '#fff' : 'var(--text-body)',
                          boxShadow: isActive ? '0 0 8px rgba(245,130,12,0.6)' : 'none'
                        }}>
                        {step.num}
                      </div>
                      <div className="text-left pt-0.5">
                        <span className="font-display text-sm md:text-base tracking-wider block font-bold transition-colors" 
                          style={{ color: isActive ? 'var(--accent)' : 'var(--text-heading)' }}>
                          {step.name}
                        </span>
                        <p className="font-sans text-[11px] md:text-xs leading-relaxed mt-1" style={{ color: 'var(--text-body)' }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-5 mt-8 grid grid-cols-2 gap-4" style={{ borderColor: 'var(--glass-border)' }}>
              <button onClick={handleTogglePlay} className="py-3 px-4 rounded border bg-transparent font-display text-xs tracking-widest font-black uppercase transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-[#f5820c]" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-heading)' }}>
                <Play className="w-3.5 h-3.5" />
                <span>{isRunning ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button onClick={handleRestart} className="py-3 px-4 rounded border bg-transparent font-display text-xs tracking-widest font-black uppercase transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-[#f5820c]" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-heading)' }}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RESTART</span>
              </button>
            </div>
          </div>

          {/* Right: Media Stage (8 cols) */}
          <div className={`lg:col-span-8 flex flex-col gap-4 relative justify-center scroll-reveal delay-700 ${isVisible ? 'active' : ''}`}>
            
            <div className="w-full h-full min-h-[500px] md:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ backgroundColor: 'var(--media-plate)', border: '1px solid var(--glass-border)' }}>
              <div className="absolute top-4 left-5 z-10 flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fff' }}>
                  TELEMETRY FEED // PROCESS LABS ANIMATION
                </span>
              </div>

              {!isRunning && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isActive = activeStep === idx;
                      const isHovered = hoveredStep === idx;
                      const isHighlighted = isActive || isHovered;

                      return (
                        <g key={`line-${step.id}`} className="transition-all duration-300">
                          <line x1={`${step.x}%`} y1={`${step.y}%`} x2={`${step.connectorEnd.x}%`} y2={`${step.connectorEnd.y}%`} stroke={isHighlighted ? 'var(--accent)' : 'rgba(255,255,255,0.3)'} strokeWidth={isHighlighted ? '1.8' : '0.8'} strokeDasharray={isHighlighted ? 'none' : '3 3'} fill="none" />
                          <circle cx={`${step.x}%`} cy={`${step.y}%`} r="3.5" fill="var(--accent)" className={isHighlighted ? 'animate-ping' : ''} />
                        </g>
                      );
                    })}
                  </svg>

                  {TIMELINE_STEPS.map((step, idx) => {
                    const isActive = activeStep === idx;
                    const isHovered = hoveredStep === idx;
                    const showOverlay = isActive || isHovered;

                    return (
                      <div key={step.id}>
                        <button
                          onClick={() => setActiveStep(idx)}
                          onMouseEnter={() => setHoveredStep(idx)}
                          onMouseLeave={() => setHoveredStep(null)}
                          style={{ top: `${step.y}%`, left: `${step.x}%`, transform: 'translate(-50%, -50%)', backgroundColor: isActive ? 'var(--accent)' : '#fff', color: isActive ? '#fff' : 'var(--text-heading)' }}
                          className={`absolute pointer-events-auto w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-mono font-black shadow-lg transition-all duration-300 cursor-pointer z-30 ${isActive ? 'scale-110 shadow-[0_0_15px_rgba(245,130,12,0.85)] border border-white' : 'hover:scale-105 border border-transparent'}`}
                        >
                          {step.num}
                        </button>

                        <div
                          onClick={() => setActiveStep(idx)}
                          onMouseEnter={() => setHoveredStep(idx)}
                          onMouseLeave={() => setHoveredStep(null)}
                          style={{ top: `${step.connectorEnd.y}%`, left: `${step.connectorEnd.x}%`, transform: 'translate(-50%, -50%)', backgroundColor: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.9)', color: isActive ? '#fff' : 'var(--text-body)' }}
                          className="absolute pointer-events-auto px-3 py-1.5 rounded border font-display text-[9px] md:text-[10px] tracking-[0.15em] font-black uppercase cursor-pointer transition-all duration-300 z-20 shadow-md border-transparent hover:border-[#f5820c]"
                        >
                          {step.name}
                        </div>

                        <div
                          style={{ top: `${step.connectorEnd.y - 7}%`, left: `${step.connectorEnd.x}%`, transform: 'translateX(-50%)', opacity: showOverlay ? 1 : 0, visibility: showOverlay ? 'visible' : 'hidden', backgroundColor: 'var(--glass-bg)' }}
                          className="absolute max-w-[200px] border border-[#f5820c] backdrop-blur-md rounded-lg p-3 shadow-2xl transition-all duration-300 z-40 text-left pointer-events-none"
                        >
                          <span className="font-display text-[11px] font-black uppercase tracking-wider block mb-1" style={{ color: 'var(--accent)' }}>
                            {step.name}
                          </span>
                          <p className="font-sans text-[10px] md:text-[11px] leading-relaxed" style={{ color: 'var(--text-heading)' }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <video
                ref={videoRef}
                src="/Centrifugal_sifter_product_animation_202607031211_gwr_video_mvp.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

        </section>
      </main>

      {/* ─── BOTTOM ACTION BAR ─── */}
      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 mt-12 z-20 flex justify-center relative">
        <div className="glass-panel rounded-full p-2.5 flex flex-wrap justify-center gap-3.5 max-w-full overflow-x-auto scrollbar-none">
          {[
            { id: '360', name: '360° VIEW', icon: <Activity className="w-4 h-4" />, action: () => handleSelectThumb('complete') },
            { id: 'exploded', name: 'EXPLODED VIEW', icon: <Layers className="w-4 h-4" />, action: () => setIsExploded(!isExploded) },
            { id: 'specs', name: 'SPECS', icon: <Sliders className="w-4 h-4" />, action: () => setActiveStep(2) },
            { id: 'downloads', name: 'DOWNLOADS', icon: <Download className="w-4 h-4" />, action: handleDownload }
          ].map((btn) => {
            const isExplodedActive = btn.id === 'exploded' && isExploded;
            return (
              <button
                key={btn.id}
                onClick={btn.action}
                className={`py-2.5 px-8 rounded-full border font-display text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all cursor-pointer`}
                style={{
                  backgroundColor: isExplodedActive ? 'var(--accent)' : 'transparent',
                  color: isExplodedActive ? '#fff' : 'var(--text-heading)',
                  borderColor: isExplodedActive ? 'var(--accent)' : 'var(--glass-border)',
                  boxShadow: isExplodedActive ? '0 0 10px rgba(245,130,12,0.4)' : 'none'
                }}
              >
                {btn.icon}
                <span>{btn.name}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
