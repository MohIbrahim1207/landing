import React, { useState, useEffect, useRef } from 'react';

const TOTAL_FRAMES = 192;
const SCROLL_TRACK_HEIGHT = '400vh'; // Total scrollable height for the sequence

const getFramePath = (index) => {
  const num = (index + 1).toString().padStart(3, '0');
  return `/sequence/ezgif-frame-${num}.jpg`;
};

function SifterScrollytelling({ headerHeight = 80 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  
  const imagesRef = useRef([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const images = [];
    imagesRef.current = images;

    const loadFrame = (idx) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = getFramePath(idx);
        img.onload = () => {
          images[idx] = img;
          resolve(img);
        };
        img.onerror = reject;
      });
    };

    const initSequence = async () => {
      try {
        const firstFrame = await loadFrame(0);
        if (!isMounted) return;
        
        drawFrameToCanvas(firstFrame);
        
        if (prefersReducedMotion) {
          setIsPreloaded(true);
          return;
        }

        let loadedCount = 1;
        const promises = [];
        for (let i = 1; i < TOTAL_FRAMES; i++) {
          promises.push(
            loadFrame(i).then(() => {
              if (isMounted) {
                loadedCount++;
                setPreloadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
              }
            })
          );
        }

        await Promise.all(promises);
        if (isMounted) {
          setIsPreloaded(true);
        }
      } catch (err) {
        console.error('Error loading frame sequence:', err);
        if (isMounted) setIsPreloaded(true);
      }
    };

    initSequence();
    return () => { isMounted = false; };
  }, [prefersReducedMotion]);

  const drawFrameToCanvas = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const { width: w, height: h } = canvas;
    const { naturalWidth: imgW, naturalHeight: imgH } = img;
    const scale = Math.max(w / imgW, h / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const x = (w - drawW) / 2;
    const y = (h - drawH) / 2;

    ctx.fillStyle = '#120a03';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, x, y, drawW, drawH);
  };

  useEffect(() => {
    const handleResize = () => {
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1)));
      if (imagesRef.current[frameIndex]) {
        drawFrameToCanvas(imagesRef.current[frameIndex]);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [progress]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rAF;
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollRange = rect.height - window.innerHeight;
      const currentScroll = -rect.top + headerHeight; // Offset the calculation by header height so stickiness starts correctly

      // Clamp progress
      const currentProgress = Math.max(0, Math.min(1, currentScroll / scrollRange));

      rAF = requestAnimationFrame(() => {
        setProgress(currentProgress);
        const frameIndex = Math.round(currentProgress * (TOTAL_FRAMES - 1));
        const img = imagesRef.current[frameIndex];
        if (img) {
          drawFrameToCanvas(img);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rAF);
    };
  }, [prefersReducedMotion, headerHeight]);

  const getOverlayOpacity = (scroll, start, end) => {
    if (scroll < start || scroll > end) return 0;
    const fadeWindow = 0.05;
    if (scroll < start + fadeWindow) return (scroll - start) / fadeWindow;
    if (scroll > end - fadeWindow) return (end - scroll) / fadeWindow;
    return 1;
  };

  const handleExploreClick = () => {
    if (containerRef.current) {
       const rect = containerRef.current.getBoundingClientRect();
       window.scrollBy({ top: rect.bottom - headerHeight, behavior: 'smooth' });
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className="relative w-full flex flex-col items-center" style={{ paddingTop: headerHeight, paddingBottom: 48 }}>
        <div className="w-full h-[60vh] relative mb-12" style={{ backgroundColor: 'var(--media-plate)' }}>
           <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 space-y-16 text-center">
          <div className="glass-panel p-8">
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-widest uppercase mb-4" style={{ color: 'var(--text-heading)' }}>
              Sievmaster Rota Range
            </h2>
            <p className="font-mono text-sm md:text-base tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--accent)' }}>
              Precision, in every particle.
            </p>
          </div>
          
          <div className="text-left space-y-3 glass-panel p-8">
            <h3 className="font-display text-2xl md:text-4xl font-black uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>
              Precision-engineered for throughput.
            </h3>
            <p className="font-sans text-sm leading-relaxed font-semibold max-w-2xl" style={{ color: 'var(--text-body)' }}>
              Tensioned mesh decks and double-sealed hygienic housing safeguard processing flows from external containment risks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full z-10"
      style={{ height: SCROLL_TRACK_HEIGHT }}
    >
      {!isPreloaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-500" style={{ background: 'var(--bg-base-start)' }}>
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--accent)' }} />
            <p className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Loading Sequence {preloadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Sticky Viewport - padding-top set dynamically to the header height */}
      <div 
        className="sticky top-0 w-full h-screen overflow-hidden" 
        style={{ paddingTop: headerHeight, backgroundColor: 'var(--media-plate)' }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full z-0 object-cover opacity-80"
          />

          {/* Text Overlays Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none p-6">
            
            {/* Section 1 */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-100"
              style={{ opacity: getOverlayOpacity(progress, 0.0, 0.15) }}
            >
              <div className="glass-panel p-6 md:p-10 inline-flex flex-col items-center pointer-events-auto">
                <h2 className="font-display font-black text-4xl md:text-7xl tracking-widest uppercase mb-4" style={{ color: 'var(--text-heading)' }}>
                  Sievmaster Rota Range
                </h2>
                <p className="font-mono text-sm md:text-lg tracking-[0.25em] uppercase font-bold" style={{ color: 'var(--accent)' }}>
                  Precision, in every particle.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div
              className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 max-w-sm md:max-w-xl text-left space-y-4 transition-opacity duration-100"
              style={{ opacity: getOverlayOpacity(progress, 0.15, 0.40) }}
            >
              <div className="glass-panel p-6 md:p-8 pointer-events-auto">
                <h3 className="font-display text-2xl md:text-5xl font-black uppercase tracking-wider mb-4" style={{ color: 'var(--text-heading)' }}>
                  Precision-engineered for throughput.
                </h3>
                <p className="font-sans text-sm md:text-base leading-relaxed font-semibold" style={{ color: 'var(--text-body)' }}>
                  Tensioned mesh decks and double-sealed hygienic housing safeguard processing flows from external containment risks.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div
              className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 max-w-sm md:max-w-xl text-right space-y-4 transition-opacity duration-100 flex flex-col items-end"
              style={{ opacity: getOverlayOpacity(progress, 0.40, 0.65) }}
            >
              <div className="glass-panel p-6 md:p-8 pointer-events-auto">
                <h3 className="font-display text-2xl md:text-5xl font-black uppercase tracking-wider mb-4" style={{ color: 'var(--text-heading)' }}>
                  Gyratory motion, redefined.
                </h3>
                <p className="font-sans text-sm md:text-base leading-relaxed font-semibold" style={{ color: 'var(--text-body)' }}>
                  Advanced horizontally balanced drive delivers consistent centrifugal screening grading without material degradation.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div
              className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 max-w-sm md:max-w-xl text-left space-y-4 transition-opacity duration-100"
              style={{ opacity: getOverlayOpacity(progress, 0.65, 0.85) }}
            >
              <div className="glass-panel p-6 md:p-8 pointer-events-auto">
                <h3 className="font-display text-2xl md:text-5xl font-black uppercase tracking-wider mb-4" style={{ color: 'var(--text-heading)' }}>
                  Clean separation, every pass.
                </h3>
                <p className="font-sans text-sm md:text-base leading-relaxed font-semibold" style={{ color: 'var(--text-body)' }}>
                  Hygienic tool-free access hatches enable quick classifier screen inspection or mesh replacements for rapid changeovers.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 transition-opacity duration-100"
              style={{ opacity: getOverlayOpacity(progress, 0.85, 1.0) }}
            >
              <div className="glass-panel p-8 md:p-12 !rounded-[2rem] inline-flex flex-col items-center pointer-events-auto">
                <h3 className="font-display font-black text-3xl md:text-6xl tracking-widest uppercase px-4 mb-6" style={{ color: 'var(--text-heading)' }}>
                  Screen everything.<br/>Compromise nothing.
                </h3>
                
                <div className="flex flex-col items-center gap-4 pt-2">
                  <button
                    onClick={handleExploreClick}
                    className="py-4 px-10 rounded-full font-display text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                  >
                    Experience the Rota Range
                  </button>
                  <a href="#" className="font-mono text-[10px] uppercase tracking-widest underline underline-offset-4 transition-colors mt-2" style={{ color: 'var(--text-body)' }}>
                    See full specs
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SifterScrollytelling;
