import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { Play, Settings, ShieldCheck, RefreshCw, Layers, Shield, Award, Activity, Sliders, Download } from 'lucide-react';

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
      <main ref={cockpitRef} className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
        
        {/* ─── LEFT: PROCESS FLOW ─── */}
        <div className={`lg:col-span-3 flex flex-col justify-between glass-panel p-5 relative overflow-hidden select-none scroll-reveal delay-100 ${isVisible ? 'active' : ''}`}>
          <div className="absolute top-0 right-0 p-2 font-mono text-[8px] uppercase" style={{ color: 'var(--text-body)', opacity: 0.5 }}>FLOW_SYS</div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-display text-base md:text-lg tracking-wider font-extrabold uppercase" style={{ color: 'var(--text-heading)' }}>
                PROCESS FLOW
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-6">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'var(--accent)' }} />
              <span className="font-mono text-xs uppercase font-bold tracking-widest" style={{ color: 'var(--accent)' }}>
                {isRunning ? 'Live Simulation Active' : 'Simulation Paused'}
              </span>
            </div>

            <div className="relative space-y-7 text-left pl-3">
              <div className="absolute left-[25px] top-4 bottom-4 w-0.5 z-0" style={{ backgroundColor: 'var(--glass-border)' }} />

              {TIMELINE_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div key={step.id} onClick={() => setActiveStep(idx)} className="flex gap-4 items-start relative z-10 cursor-pointer group">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0`}
                      style={{ 
                        backgroundColor: isActive ? 'var(--accent)' : 'var(--glass-bg)', 
                        borderColor: isActive ? 'var(--accent)' : 'var(--glass-border)',
                        color: isActive ? '#fff' : 'var(--text-body)',
                        boxShadow: isActive ? '0 0 8px rgba(245,130,12,0.6)' : 'none'
                      }}>
                      {step.num}
                    </div>
                    <div className="text-left">
                      <span className="font-display text-sm md:text-base tracking-wider block font-bold transition-colors" 
                        style={{ color: isActive ? 'var(--accent)' : 'var(--text-heading)' }}>
                        {step.name}
                      </span>
                      <p className="font-sans text-xs md:text-sm leading-normal mt-0.5" style={{ color: 'var(--text-body)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4 mt-6 grid grid-cols-2 gap-3" style={{ borderColor: 'var(--glass-border)' }}>
            <button onClick={handleTogglePlay} className="py-3 px-4 rounded border bg-transparent font-display text-xs tracking-widest font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#f5820c]" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-heading)' }}>
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <button onClick={handleRestart} className="py-3 px-4 rounded border bg-transparent font-display text-xs tracking-widest font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#f5820c]" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-heading)' }}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </button>
          </div>
        </div>

        {/* ─── CENTER: MEDIA STAGE ─── */}
        <div className={`lg:col-span-6 flex flex-col gap-4 relative justify-center scroll-reveal delay-300 ${isVisible ? 'active' : ''}`}>
          
          <div className="w-full h-[520px] rounded-2xl overflow-hidden shadow-2xl relative z-10" style={{ backgroundColor: 'var(--media-plate)', border: '1px solid var(--glass-border)' }}>
            <div className="absolute top-2.5 left-4.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: '#fff' }}>
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
                        className={`absolute pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-black shadow-lg transition-all duration-300 cursor-pointer z-30 ${isActive ? 'scale-110 shadow-[0_0_15px_rgba(245,130,12,0.85)] border border-white' : 'hover:scale-105 border border-transparent'}`}
                      >
                        {step.num}
                      </button>

                      <div
                        onClick={() => setActiveStep(idx)}
                        onMouseEnter={() => setHoveredStep(idx)}
                        onMouseLeave={() => setHoveredStep(null)}
                        style={{ top: `${step.connectorEnd.y}%`, left: `${step.connectorEnd.x}%`, transform: 'translate(-50%, -50%)', backgroundColor: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.9)', color: isActive ? '#fff' : 'var(--text-body)' }}
                        className="absolute pointer-events-auto px-2.5 py-1 rounded border font-display text-[9px] tracking-[0.15em] font-black uppercase cursor-pointer transition-all duration-300 z-20 shadow-md border-transparent hover:border-[#f5820c]"
                      >
                        {step.name}
                      </div>

                      <div
                        style={{ top: `${step.connectorEnd.y - 7}%`, left: `${step.connectorEnd.x}%`, transform: 'translateX(-50%)', opacity: showOverlay ? 1 : 0, visibility: showOverlay ? 'visible' : 'hidden', backgroundColor: 'var(--glass-bg)' }}
                        className="absolute max-w-[200px] border border-[#f5820c] backdrop-blur-md rounded-lg p-2.5 shadow-2xl transition-all duration-300 z-40 text-left pointer-events-none"
                      >
                        <span className="font-display text-[10px] font-black uppercase tracking-wider block mb-1" style={{ color: 'var(--accent)' }}>
                          {step.name}
                        </span>
                        <p className="font-sans text-[10px] leading-normal" style={{ color: 'var(--text-heading)' }}>
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

        {/* ─── RIGHT: HIGHLIGHTS ─── */}
        <div className={`lg:col-span-3 flex flex-col justify-between gap-4 text-left scroll-reveal delay-500 ${isVisible ? 'active' : ''}`}>
          
          <div className="glass-panel p-5 relative">
            <span className="font-display text-sm md:text-base tracking-wider font-extrabold block mb-4 uppercase" style={{ color: 'var(--text-heading)' }}>
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
                    <span className="font-display text-xs md:text-sm tracking-wide block font-black" style={{ color: 'var(--text-heading)' }}>{item.title}</span>
                    <span className="font-sans text-xs block mt-0.5" style={{ color: 'var(--text-body)' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 relative flex flex-col justify-between gap-4">
            <div>
              <span className="font-display text-sm md:text-base tracking-wider font-extrabold block mb-4 uppercase" style={{ color: 'var(--text-heading)' }}>
                MACHINE OVERVIEW
              </span>
              <div className="space-y-2.5 font-mono text-xs md:text-sm">
                {[
                  { label: 'Model', val: 'FF-CS-1200' },
                  { label: 'Motor Power', val: '7.5 kW' },
                  { label: 'Screen Diameter', val: '1200 mm' },
                  { label: 'Screen Layers', val: '1 to 5' },
                  { label: 'Capacity', val: '500 - 5000 kg/hr' },
                  { label: 'Material', val: 'SS 304 / SS 316' }
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
      </main>

      {/* ─── BOTTOM ACTION BAR ─── */}
      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 mt-6 z-20 flex justify-center relative">
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
