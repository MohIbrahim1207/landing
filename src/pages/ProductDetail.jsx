import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import CountUp from '../components/CountUp';
import { 
  ArrowLeft, FileText, Play, Eye, 
  Settings, Maximize2, Volume2, Info,
  Compass, ShieldCheck, Zap, AlertTriangle,
  RotateCw, RefreshCw, Layers, Shield,
  Award, PlayCircle, RotateCcw, Activity,
  Sliders, Database, Download, ChevronDown
} from 'lucide-react';

// Premium Error Boundary wrapper to catch rendering failures and show a reboot utility
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Cockpit system rendering crash caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 text-center bg-[#1a0e03] border border-[#f5820c]/40 rounded-2xl m-6 max-w-2xl mx-auto z-50 relative">
          <h2 className="text-xl font-bold text-[#f5820c] uppercase tracking-widest mb-2">Cockpit System Offline</h2>
          <p className="text-sm text-red-400 font-mono mb-6">{this.state.error?.toString()}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 bg-[#f5820c] text-[#120a03] rounded font-bold uppercase tracking-widest text-xs cursor-pointer hover:bg-[#ff9900] transition-all"
          >
            Reboot Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TIMELINE_STEPS = [
  {
    id: 'inlet',
    num: 1,
    name: 'FEED INLET',
    desc: 'Material enters the sifter through the inlet.',
    x: 50,
    y: 20,
    connectorEnd: { x: 35, y: 14 }
  },
  {
    id: 'chamber',
    num: 2,
    name: 'SCREENING CHAMBER',
    desc: 'Material is separated using high-speed centrifugal force.',
    x: 50,
    y: 42,
    connectorEnd: { x: 32, y: 45 }
  },
  {
    id: 'outlet',
    num: 3,
    name: 'FINE MATERIAL DISCHARGE',
    desc: 'Fine particles pass through the screen and exit.',
    x: 42,
    y: 68,
    connectorEnd: { x: 25, y: 78 }
  },
  {
    id: 'coarse',
    num: 4,
    name: 'COARSE DISCHARGE',
    desc: 'Oversize particles are discharged separately.',
    x: 58,
    y: 68,
    connectorEnd: { x: 75, y: 78 }
  },
  {
    id: 'motor',
    num: 5,
    name: 'MOTOR DRIVE',
    desc: 'High-performance motor powers the rotor.',
    x: 68,
    y: 52,
    connectorEnd: { x: 85, y: 48 }
  }
];

function ProductDetailCockpit({ productId, onBack }) {
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [activeStep, setActiveStep] = useState(0); // 0 to 4
  const [hoveredStep, setHoveredStep] = useState(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isSectionCut, setIsSectionCut] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);


  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;

    // Enforce video loops programmatically
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener('ended', handleEnded);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => {
            console.log("Telemetry video play deferred:", err);
          });
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
  }, [isMuted]);



  // Auto-cycle timeline progress when running
  const autoPlayInterval = useRef(null);
  useEffect(() => {
    if (isRunning) {
      autoPlayInterval.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % TIMELINE_STEPS.length);
      }, 4000);
    } else {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    }
    return () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    };
  }, [isRunning]);

  const handleSelectThumb = (thumbId) => {
    if (thumbId === 'complete') {
      setActiveStep(0);
      setIsExploded(false);
      setIsSectionCut(false);
    } else {
      const idx = TIMELINE_STEPS.findIndex(h => h.id === thumbId);
      if (idx !== -1) setActiveStep(idx);
    }
  };

  const handleDownload = () => {
    alert(`Downloading complete CAD specifications & Brochure for: ${product.name}`);
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleRestart = () => {
    setActiveStep(0);
    setIsRunning(false);
    setIsExploded(false);
    setIsSectionCut(false);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="bg-[#120a03] min-h-screen text-[#ffffff] flex flex-col justify-between font-sans overflow-x-hidden relative selection:bg-[#f5820c] selection:text-[#120a03] pb-6 z-20" style={{ marginTop: '-100vh', paddingTop: '100vh' }}>
      {/* Volumetric background grid overlays for dark theme */}
      <div className="absolute inset-0 bg-blueprint-grid-gold opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-blueprint-subgrid-gold opacity-10 pointer-events-none z-0" />
      <div className="light-beam-overlay z-0" />
      <div className="absolute inset-0 bg-vignette-ambient z-10" />

      {/* ─── BODY (12-COLUMN DASHBOARD) ─── */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-6 z-20 relative">
        
        {/* ─── LEFT: PROCESS FLOW (3 COLS) ─── */}
        <div className="lg:col-span-3 flex flex-col justify-between glass-panel-gold rounded-2xl p-5 relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-[#f5b866]/30">FLOW_SYS</div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-display text-base md:text-lg tracking-wider text-[#ffffff] font-extrabold uppercase">
                PROCESS FLOW
              </span>
            </div>
            
            {/* Live simulation banner */}
            <div className="flex items-center gap-1.5 mb-6">
              <span className={`w-2 h-2 rounded-full bg-[#f5820c] ${isRunning ? 'animate-pulse' : ''}`} />
              <span className="font-mono text-xs text-[#f5b866] uppercase font-bold tracking-widest">
                {isRunning ? 'Live Simulation Active' : 'Simulation Paused'}
              </span>
            </div>

            {/* Vertical timeline steps */}
            <div className="relative space-y-7 text-left pl-3">
              <div className="absolute left-[25px] top-4 bottom-4 w-0.5 bg-[rgba(245,130,12,0.18)] z-0" />
              
              {TIMELINE_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div 
                    key={step.id} 
                    onClick={() => setActiveStep(idx)}
                    className="flex gap-4 items-start relative z-10 cursor-pointer group"
                  >
                    {/* Circle badge */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0 ${
                      isActive 
                        ? 'bg-[#f5820c] border-[#f5820c] text-[#120a03] shadow-[0_0_8px_rgba(245,130,12,0.55)]'
                        : 'border-[rgba(245,130,12,0.35)] text-[#f5b866] bg-[#120a03] group-hover:border-[#f5820c]'
                    }`}>
                      {step.num}
                    </div>

                    <div className="text-left">
                      <span className={`font-display text-sm md:text-base tracking-wider block font-bold transition-colors ${
                        isActive ? 'text-[#f5820c]' : 'text-[#ffffff] group-hover:text-[#f5b866]'
                      }`}>
                        {step.name}
                      </span>
                      <p className="font-sans text-xs md:text-sm text-[#f5b866]/70 leading-normal mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="border-t border-[rgba(245,130,12,0.15)] pt-4 mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleTogglePlay}
              className="py-3 px-4 rounded border border-[rgba(245,130,12,0.25)] hover:border-[#f5820c] bg-transparent text-[#ffffff] hover:text-[#f5820c] font-display text-xs tracking-widest font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <button
              onClick={handleRestart}
              className="py-3 px-4 rounded border border-[rgba(245,130,12,0.25)] hover:border-[#f5820c] bg-transparent text-[#ffffff] hover:text-[#f5820c] font-display text-xs tracking-widest font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </button>
          </div>
        </div>

        {/* ─── CENTER: MEDIA STAGE (6 COLS) ─── */}
        <div className="lg:col-span-6 flex flex-col gap-4 relative justify-center">
          
          {/* Glowing Circular turntable platform */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-[rgba(245,130,12,0.15)] bottom-22 left-1/2 -translate-x-1/2 flex items-center justify-center z-0 animate-turntable-glow pointer-events-none">
            <div className="absolute w-[390px] h-[390px] rounded-full border border-[rgba(245,130,12,0.06)]" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(245,130,12,0.08)_100%)]" />
          </div>

          {/* Expanded Video Telemetry Frame */}
          <div className="w-full h-[520px] border border-[rgba(245,130,12,0.15)] rounded-2xl overflow-hidden shadow-2xl relative glass-panel-gold z-10">
            <div className="absolute top-2.5 left-4.5 z-10 flex items-center gap-1.5 bg-[#120a03]/60 px-2.5 py-1.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5820c] animate-pulse" />
              <span className="font-mono text-[9px] text-[#f5b866] font-bold uppercase tracking-widest">
                TELEMETRY FEED // PROCESS LABS ANIMATION
              </span>
            </div>
            
            {/* Absolute positioned callout badges & connectors over center frame */}
            {!isRunning && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                
                {/* SVG Connector Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isActive = activeStep === idx;
                    const isHovered = hoveredStep === idx;
                    const isHighlighted = isActive || isHovered;

                    return (
                      <g key={`line-${step.id}`} className="transition-all duration-300">
                        <line
                          x1={`${step.x}%`}
                          y1={`${step.y}%`}
                          x2={`${step.connectorEnd.x}%`}
                          y2={`${step.connectorEnd.y}%`}
                          stroke={isHighlighted ? '#f5820c' : 'rgba(245, 130, 12, 0.25)'}
                          strokeWidth={isHighlighted ? '1.8' : '0.8'}
                          strokeDasharray={isHighlighted ? 'none' : '3 3'}
                          fill="none"
                        />
                        <circle
                          cx={`${step.x}%`}
                          cy={`${step.y}%`}
                          r="3.5"
                          fill="#f5820c"
                          className={isHighlighted ? 'animate-ping' : ''}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Hotspot Interactive badges, labels and tooltips */}
                {TIMELINE_STEPS.map((step, idx) => {
                  const isActive = activeStep === idx;
                  const isHovered = hoveredStep === idx;
                  const showOverlay = isActive || isHovered;

                  return (
                    <div key={step.id}>
                      {/* Numbered Badge Button */}
                      <button
                        onClick={() => setActiveStep(idx)}
                        onMouseEnter={() => setHoveredStep(idx)}
                        onMouseLeave={() => setHoveredStep(null)}
                        style={{
                          top: `${step.y}%`,
                          left: `${step.x}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-black shadow-lg transition-all duration-300 cursor-pointer z-30 ${
                          isActive 
                            ? 'bg-[#f5820c] text-[#120a03] scale-110 shadow-[0_0_15px_rgba(245,130,12,0.85)] border border-white' 
                            : 'bg-white text-[#120a03] hover:scale-105 border border-[rgba(245,130,12,0.4)]'
                        }`}
                      >
                        {step.num}
                      </button>

                      {/* Floating Text Label */}
                      <div
                        onClick={() => setActiveStep(idx)}
                        onMouseEnter={() => setHoveredStep(idx)}
                        onMouseLeave={() => setHoveredStep(null)}
                        style={{
                          top: `${step.connectorEnd.y}%`,
                          left: `${step.connectorEnd.x}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute pointer-events-auto px-2.5 py-1 rounded border font-display text-[9px] tracking-[0.15em] font-black uppercase cursor-pointer transition-all duration-300 z-20 ${
                          isActive
                            ? 'bg-[#f5820c] text-[#120a03] border-[#f5820c] shadow-[0_0_10px_rgba(245,130,12,0.4)]'
                            : 'bg-[#120a03]/80 text-[#f5b866] border-[rgba(245,130,12,0.35)] hover:border-[#f5820c] hover:text-[#f5820c]'
                        }`}
                      >
                        {step.name}
                      </div>

                      {/* Tooltip Description */}
                      <div
                        style={{
                          top: `${step.connectorEnd.y - 7}%`,
                          left: `${step.connectorEnd.x}%`,
                          transform: 'translateX(-50%)',
                          opacity: showOverlay ? 1 : 0,
                          visibility: showOverlay ? 'visible' : 'hidden',
                        }}
                        className="absolute max-w-[200px] bg-[#1a0e03] border border-[#f5820c] rounded-lg p-2.5 shadow-2xl transition-all duration-300 z-40 text-left pointer-events-none border-t-2"
                      >
                        <span className="font-display text-[10px] font-black text-[#f5820c] uppercase tracking-wider block mb-1">
                          {step.name}
                        </span>
                        <p className="font-sans text-[10px] text-[#f5b866]/80 leading-normal">
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

          <div className="text-center font-mono text-[10px] md:text-xs text-[#f5b866]/40 uppercase tracking-[0.2em] mt-8 mb-6 select-none animate-pulse">
            Images to be added soon. Please stay tuned.
          </div>
        </div>

        {/* ─── RIGHT: HIGHLIGHTS & OVERVIEW (3 COLS) ─── */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4 text-left">
          
          {/* Card 1: Key Highlights */}
          <div className="glass-panel-gold rounded-2xl p-5 relative">
            <span className="font-display text-sm md:text-base tracking-wider text-[#ffffff] font-extrabold block mb-4 uppercase">
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
                  <div className="w-9 h-9 rounded-md border border-[rgba(245,130,12,0.35)] flex items-center justify-center shrink-0 bg-[#120a03]">
                    {item.icon}
                  </div>
                  <div className="text-left leading-normal">
                    <span className="font-display text-xs md:text-sm tracking-wide block font-black text-[#ffffff]">{item.title}</span>
                    <span className="font-sans text-xs text-[#f5b866]/70 block mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Machine Overview */}
          <div className="glass-panel-gold rounded-2xl p-5 relative flex flex-col justify-between gap-4">
            <div>
              <span className="font-display text-sm md:text-base tracking-wider text-[#ffffff] font-extrabold block mb-4 uppercase">
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
                  <div key={i} className="flex justify-between py-1.5 border-b border-[rgba(245,130,12,0.08)] last:border-0">
                    <span className="text-gray-400 uppercase font-semibold">{spec.label}</span>
                    <span className="text-[#f5820c] font-black uppercase">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pinned tagline */}
          <div className="text-right select-none pr-2">
            <h4 className="font-display text-base md:text-lg font-black text-white leading-none tracking-widest">BUILT FOR PRECISION.</h4>
            <h4 className="font-display text-base md:text-lg font-black text-[#f5820c] leading-none tracking-widest mt-1">ENGINEERED TO PERFORM.</h4>
          </div>
          
        </div>
      </main>

      {/* ─── BOTTOM ACTION BAR ─── */}
      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 mt-6 z-20 flex justify-center">
        <div className="bg-[rgba(20,12,4,0.7)] border border-[rgba(245,130,12,0.35)] rounded-full p-2.5 flex flex-wrap justify-center gap-3.5 shadow-lg max-w-full overflow-x-auto scrollbar-none">
          {[
            { id: '360', name: '360° VIEW', icon: <RotateCw className="w-4 h-4" />, action: () => handleSelectThumb('complete') },
            { id: 'exploded', name: 'EXPLODED VIEW', icon: <Layers className="w-4 h-4" />, action: () => setIsExploded(!isExploded) },
            { id: 'apps', name: 'APPLICATIONS', icon: <Activity className="w-4 h-4" />, action: () => setActiveStep(1) },
            { id: 'specs', name: 'SPECS', icon: <Sliders className="w-4 h-4" />, action: () => setActiveStep(2) },
            { id: 'downloads', name: 'DOWNLOADS', icon: <Download className="w-4 h-4" />, action: handleDownload }
          ].map((btn) => {
            const isExplodedActive = btn.id === 'exploded' && isExploded;
            
            return (
              <button
                key={btn.id}
                onClick={btn.action}
                className={`py-2.5 px-8 rounded-full border font-display text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all cursor-pointer ${
                  isExplodedActive 
                    ? 'bg-[#f5820c] text-[#120a03] border-[#f5820c] shadow-[0_0_10px_rgba(245,130,12,0.35)]'
                    : 'border-[rgba(245,130,12,0.25)] hover:border-[#f5820c] bg-transparent text-[#ffffff] hover:text-[#f5820c]'
                }`}
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

export default function ProductDetail({ productId, onBack }) {
  return (
    <ErrorBoundary>
      <ProductDetailCockpit productId={productId} onBack={onBack} />
    </ErrorBoundary>
  );
}
