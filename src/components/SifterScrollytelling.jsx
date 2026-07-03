import React, { useState, useEffect, useRef } from 'react';
import { Download, Sliders, Layers, ChevronDown } from 'lucide-react';

export default function SifterScrollytelling() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Array to cache loaded Image elements
  const imagesRef = useRef([]);

  useEffect(() => {
    // 1. Detect motion preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // 2. Preloading frames sequence (192 frames)
    const totalFrames = 192;
    let loadedCount = 0;
    const imageElements = [];

    // Preload Frame 1 immediately
    const firstFrame = new Image();
    firstFrame.src = `/sequence/ezgif-frame-001.jpg`;
    firstFrame.onload = () => {
      imagesRef.current[0] = firstFrame;
      loadedCount++;
      setPreloadProgress(Math.round((loadedCount / totalFrames) * 100));
      drawFrame(0); // draw frame 1 immediately

      // Batch load the remaining 191 frames asynchronously
      const promises = [];
      for (let i = 2; i <= totalFrames; i++) {
        promises.push(
          new Promise((resolve) => {
            const img = new Image();
            const frameIndex = String(i).padStart(3, '0');
            img.src = `/sequence/ezgif-frame-${frameIndex}.jpg`;
            img.onload = () => {
              imagesRef.current[i - 1] = img;
              loadedCount++;
              setPreloadProgress(Math.round((loadedCount / totalFrames) * 100));
              resolve();
            };
            img.onerror = () => {
              loadedCount++;
              resolve(); // resolve to not block
            };
          })
        );
      }

      Promise.all(promises).then(() => {
        setIsPreloaded(true);
      });
    };

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Aspect-ratio correction drawing utility
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index];
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const imgW = img.width;
    const imgH = img.height;

    // Scale to "cover" canvas
    const scale = Math.max(w / imgW, h / imgH);
    const x = (w - imgW * scale) / 2;
    const y = (h - imgH * scale) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, x, y, imgW * scale, imgH * scale);
  };

  // Scroll mapping event handler
  useEffect(() => {
    if (prefersReducedMotion) return;

    let rAF;
    const handleScroll = () => {
      const hero = containerRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      const currentScroll = -rect.top;
      
      const scrollPercent = Math.max(0, Math.min(1, currentScroll / scrollRange));
      
      rAF = requestAnimationFrame(() => {
        setProgress(scrollPercent);
        const frameIndex = Math.min(191, Math.round(scrollPercent * 191));
        drawFrame(frameIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(rAF);
    };
  }, [prefersReducedMotion]);

  // Helper function to compute smooth opacities for text overlays
  const getOverlayOpacity = (scroll, start, end) => {
    if (scroll < start || scroll > end) return 0;
    const range = end - start;
    const relative = scroll - start;
    const fadeInWindow = range * 0.15; // 15% fade-in
    const fadeOutWindow = range * 0.15; // 15% fade-out

    if (relative < fadeInWindow) {
      return relative / fadeInWindow;
    }
    if (relative > range - fadeOutWindow) {
      return (range - relative) / fadeOutWindow;
    }
    return 1;
  };

  const handleExploreClick = () => {
    const hero = containerRef.current;
    if (hero) {
      const heroHeight = hero.offsetHeight;
      window.scrollTo({ 
        top: heroHeight,
        behavior: prefersReducedMotion ? 'instant' : 'smooth' 
      });
    }
  };

  // Static stack layout for prefers-reduced-motion
  if (prefersReducedMotion) {
    return (
      <div className="w-full bg-[#120a03] text-left py-16 px-6 md:px-12 space-y-16 border-b border-[rgba(245,130,12,0.15)] relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 h-80 border border-[rgba(245,130,12,0.15)] rounded-2xl overflow-hidden shadow-lg bg-[#150a04] flex items-center justify-center">
            <img src="/sequence/ezgif-frame-001.jpg" alt="Centrifugal Sifter Complete" className="max-h-full object-contain" />
          </div>
          <div className="space-y-4">
            <h2 className="font-display font-black text-3xl text-white tracking-widest uppercase">Flow Force RG Sifter</h2>
            <p className="font-sans text-lg text-[#f5b866] font-bold">Precision, in every particle.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto border-t border-[rgba(245,130,12,0.08)] pt-12">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-white uppercase">Precision-engineered for throughput</h3>
            <p className="font-sans text-sm text-[#f5b866]/70 leading-relaxed">Tensioned mesh decks and double-sealed hygienic housing safeguard processing flows.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-white uppercase">Gyratory motion, redefined</h3>
            <p className="font-sans text-sm text-[#f5b866]/70 leading-relaxed">Advanced horizontal balanced drive delivers consistent grading without material degradation.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-white uppercase">Clean separation, every pass</h3>
            <p className="font-sans text-sm text-[#f5b866]/70 leading-relaxed">Hygienic tool-free access hatches enable screen inspection or mesh replacements in seconds.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-white uppercase">Screen everything. Compromise nothing.</h3>
            <div className="flex gap-4 pt-2">
              <button onClick={handleExploreClick} className="py-2.5 px-6 rounded-full bg-[#f5820c] hover:bg-[#ff9900] text-[#120a03] font-display text-[10px] font-bold tracking-widest uppercase cursor-pointer shadow-md">
                Experience RG Sifter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full z-10" 
      style={{ height: '300vh' }}
    >
      {/* Preloading Overlay Indicator */}
      {!isPreloaded && (
        <div className="absolute inset-0 bg-[#120a03] z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#f5820c] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs font-bold text-[#f5b866] uppercase tracking-widest">
              Buffering Cinematic Stream... {preloadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Sticky Canvas Viewport container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#120a03]">
        <div className="absolute inset-0 bg-blueprint-grid-gold opacity-15 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-vignette-ambient z-15" />

        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover opacity-85 z-0"
        />

        {/* Absolute scrollytelling text overlays */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pt-24 pointer-events-none select-none">
          
          {/* Section 1: 0% - 15% (Centered Hero Copy) */}
          <div 
            style={{ opacity: getOverlayOpacity(progress, 0.0, 0.15) }}
            className="text-center space-y-3 transition-opacity duration-100"
          >
            <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-widest uppercase">
              Flow Force RG Sifter
            </h2>
            <p className="font-sans text-base md:text-xl text-[#f5b866] font-bold tracking-wide">
              Precision, in every particle.
            </p>
          </div>

          {/* Section 2: 15% - 40% (Left-aligned Copy) */}
          <div 
            style={{ opacity: getOverlayOpacity(progress, 0.15, 0.40) }}
            className="absolute left-6 md:left-24 max-w-sm md:max-w-md text-left space-y-3 transition-opacity duration-100"
          >
            <h3 className="font-display text-2xl md:text-4xl font-black text-white uppercase tracking-wider">
              Precision-engineered for throughput.
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#f5b866]/80 leading-relaxed font-semibold">
              Tensioned mesh decks and double-sealed hygienic housing safeguard processing flows from external containment risks.
            </p>
          </div>

          {/* Section 3: 40% - 65% (Right-aligned Copy) */}
          <div 
            style={{ opacity: getOverlayOpacity(progress, 0.40, 0.65) }}
            className="absolute right-6 md:right-24 max-w-sm md:max-w-md text-left space-y-3 transition-opacity duration-100"
          >
            <h3 className="font-display text-2xl md:text-4xl font-black text-white uppercase tracking-wider">
              Gyratory motion, redefined.
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#f5b866]/80 leading-relaxed font-semibold">
              Advanced horizontally balanced drive delivers consistent centrifugal screening grading without material degradation.
            </p>
          </div>

          {/* Section 4: 65% - 85% (Focus Copy) */}
          <div 
            style={{ opacity: getOverlayOpacity(progress, 0.65, 0.85) }}
            className="absolute left-6 md:left-32 max-w-sm md:max-w-md text-left space-y-3 transition-opacity duration-100"
          >
            <h3 className="font-display text-2xl md:text-4xl font-black text-white uppercase tracking-wider">
              Clean separation, every pass.
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#f5b866]/80 leading-relaxed font-semibold">
              Hygienic tool-free access hatches enable quick classifier screen inspection or mesh replacements.
            </p>
          </div>

          {/* Section 5: 85% - 100% (Centered CTA Copy) */}
          <div 
            style={{ opacity: getOverlayOpacity(progress, 0.85, 1.0) }}
            className="text-center space-y-4 pointer-events-auto transition-opacity duration-100 flex flex-col items-center justify-center"
          >
            <h3 className="font-display font-black text-3xl md:text-5xl text-white tracking-widest uppercase">
              Screen everything. Compromise nothing.
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#f5b866] font-bold uppercase tracking-widest">
              Experience the RG Sifter Cockpit Below
            </p>
            <div className="flex justify-center gap-4.5 pt-2">
              <button 
                onClick={handleExploreClick}
                className="py-3 px-8 rounded-full bg-[#f5820c] hover:bg-[#ff9900] text-[#120a03] font-display text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_12px_rgba(245,130,12,0.5)] cursor-pointer"
              >
                Experience RG Sifter
              </button>
            </div>

            {/* Bouncing down-chevron explore cue */}
            <div 
              onClick={handleExploreClick}
              className="mt-6 flex flex-col items-center gap-1.5 cursor-pointer group pointer-events-auto"
            >
              <span className="font-display text-[9px] tracking-[0.2em] text-[#f5b866] uppercase font-black opacity-85 group-hover:text-white transition-colors">
                EXPLORE THE FULL SYSTEM
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-[#f5820c] group-hover:text-white transition-colors ${
                  prefersReducedMotion ? '' : 'animate-bounce'
                }`}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
