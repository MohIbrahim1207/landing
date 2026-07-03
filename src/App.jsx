import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import SifterScrollytelling from './components/SifterScrollytelling';
import ProductDetail from './pages/ProductDetail';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleBack = () => {
    // Back logic
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col">
      {/* Scroll Progress Line */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[60] transition-all duration-75 shadow-[0_0_8px_rgba(245,130,12,0.8)]"
        style={{ width: `${scrollProgress}%`, background: 'linear-gradient(to right, #d97706, var(--accent))' }}
      />

      {/* SINGLE HEADER SOURCE */}
      <header 
        ref={headerRef} 
        className="sticky top-0 left-0 right-0 h-20 z-50 px-6 md:px-12 flex items-center justify-between gap-6"
        style={{ 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(16px)', 
          borderBottom: '1px solid var(--glass-border)' 
        }}
      >
        {/* Left Logo / Wordmark */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={handleBack}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-display font-black text-xl shadow-[0_0_15px_rgba(245,130,12,0.5)]" style={{ backgroundColor: 'var(--accent)', color: 'var(--text-heading)' }}>
            FF
          </div>
          <div className="text-left leading-tight">
            <span className="font-display font-black text-base tracking-widest block uppercase" style={{ color: 'var(--text-heading)' }}>
              FLOW FORCE
            </span>
            <span className="font-display text-[9px] tracking-[0.15em] uppercase font-bold block mt-0.5" style={{ color: 'var(--accent)' }}>
              ENGINEERING EXCELLENCE
            </span>
          </div>
        </div>

        {/* Center Title / Subtitle */}
        <div className="text-center hidden md:block">
          <h1 className="font-display font-black text-4xl lg:text-5xl tracking-widest uppercase leading-none" style={{ color: 'var(--text-heading)' }}>
            CENTRIFUGAL SIFTER
          </h1>
          <div className="text-xs tracking-[0.2em] font-display uppercase font-bold mt-2">
            <span style={{ color: 'var(--text-body)' }}>PRECISION</span>
            <span style={{ color: 'var(--accent)' }}> SEPARATION. MAXIMUM PERFORMANCE.</span>
          </div>
        </div>

        {/* Right Icon Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleFullscreen}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-transparent cursor-pointer hover:scale-105"
            style={{ color: 'var(--text-heading)', border: '1px solid var(--glass-border)' }}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-transparent cursor-pointer hover:scale-105"
            style={{ color: 'var(--text-heading)', border: '1px solid var(--glass-border)' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Child Components - Header is strictly defined above */}
      <SifterScrollytelling headerHeight={80} />
      <ProductDetail productId="sifter" onBack={handleBack} />
    </div>
  );
}

export default App;
