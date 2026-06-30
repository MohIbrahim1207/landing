import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { FileText, Eye, Maximize2 } from 'lucide-react';

export default function CatalogHome({ onViewProduct }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});

  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  const handleDownload = (e, brochurePath, productName) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Downloading brochure for ${productName}: ${brochurePath}`);
  };

  const singleProduct = PRODUCTS[0];

  useEffect(() => {
    if (isLightboxOpen) {
      triggerRef.current = document.activeElement;
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        }
        if (e.key === 'Tab') {
          const modalElement = document.getElementById('lightbox-modal');
          if (!modalElement) return;
          const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length === 0) return;
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        triggerRef.current?.focus();
      };
    }
  }, [isLightboxOpen]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 8; // gentle rotation
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  if (!singleProduct) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#1a2123] py-20 px-6 md:px-12 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-8 mb-16 text-center">
          <span className="font-mono text-xs tracking-wider text-gray-500 uppercase block mb-2 font-bold">
            B2B INDUSTRIAL CATALOG
          </span>
          <h1 className="font-sans text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight leading-tight uppercase">
            FLOW FORCE EQUIPMENT PORTFOLIO
          </h1>
        </div>

        {/* Centered Single Product Card */}
        <div className="flex justify-center">
          <div
            className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden max-w-3xl w-full text-left"
          >
            {/* Dark Studio-style Centered Product Image Panel */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
              style={tiltStyle}
              className="relative bg-radial from-[#1e293b] to-[#0f172a] h-96 md:h-[550px] w-full flex items-center justify-center p-8 border-b border-white/10 select-none cursor-zoom-in group overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label={`View full resolution image of ${singleProduct.name}`}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setIsLightboxOpen(true);
                }
              }}
            >
              {/* Premium soft overlay lighting effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
              
              <img
                src={singleProduct.image}
                srcSet={`${singleProduct.image} 1x, ${singleProduct.image} 2x, ${singleProduct.image} 3x`}
                alt={singleProduct.name}
                className="max-w-[85%] max-h-[85%] object-contain mx-auto transition-transform duration-300 pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                style={{ imageRendering: 'high-quality' }}
                loading="lazy"
              />

              {/* Hover Indicator for zooming */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-[#baf2ff] border border-[#baf2ff]/30 text-xs font-mono py-1.5 px-3 rounded flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>CLICK TO ZOOM</span>
              </div>
            </div>

            {/* Product Info Block */}
            <div className="p-8 flex flex-col flex-grow justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] text-[#005f6d] tracking-widest uppercase font-bold block mb-2">
                  Featured Equipment
                </span>
                <h2 className="font-sans text-[22px] font-bold text-gray-900 tracking-tight uppercase mb-4 leading-snug">
                  {singleProduct.name}
                </h2>
                <ul className="space-y-3 mb-6">
                  {singleProduct.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[15px] text-gray-600 leading-[1.6]">
                      <span className="text-[#005f6d] font-bold mt-1 text-xs">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Panel */}
              <div className="flex flex-col gap-3 pt-6 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => onViewProduct(singleProduct.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#005f6d] hover:bg-[#00363f] text-white font-bold rounded text-[15px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Product</span>
                </button>
                <button
                  onClick={(e) => handleDownload(e, singleProduct.brochure, singleProduct.name)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded text-[15px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Brochure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          id="lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${singleProduct.name} full screen view`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full h-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close image zoom"
              className="absolute top-0 right-0 md:top-4 md:right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#baf2ff]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={singleProduct.image}
              srcSet={`${singleProduct.image} 1x, ${singleProduct.image} 2x, ${singleProduct.image} 3x`}
              alt={singleProduct.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
              style={{ imageRendering: 'high-quality' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

