import React, { useState, useEffect } from 'react';
import SifterScrollytelling from './components/SifterScrollytelling';
import ProductDetail from './pages/ProductDetail';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#120a03] relative">
      {/* Premium Viewport Scroll Progress Line */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#d97706] via-[#f5820c] to-[#f5b866] z-50 transition-all duration-75 shadow-[0_0_8px_rgba(245,130,12,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <SifterScrollytelling />
      <ProductDetail productId="sifter" onBack={() => {}} />
    </div>
  );
}

export default App;
