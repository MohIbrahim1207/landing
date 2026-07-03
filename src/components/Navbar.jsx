import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { images } from '../data/images';

export default function Navbar({ onNavigate, currentPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (target === 'products') {
      onNavigate('catalog');
    } else if (target === 'about') {
      alert("Flow Force is a leading provider of high-performance B2B process and filtration systems.");
    }
  };

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${isScrolled
            ? 'py-3 bg-[#0d1516] border-b border-gray-800 shadow-lg'
            : 'py-5 bg-[#0d1516] border-b border-gray-800'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}
            className="flex items-center group cursor-pointer"
          >
            <img
              src={images.logo}
              alt="Flow Force Logo"
              className="h-9 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, 'products')}
              className={`font-sans text-xs tracking-wider font-bold transition-colors uppercase ${currentPage === 'catalog' ? 'text-[#00e0ff]' : 'text-gray-300 hover:text-white'
                }`}
            >
              Products
            </a>
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, 'about')}
              className="font-sans text-xs tracking-wider font-bold text-gray-300 hover:text-white transition-colors uppercase"
            >
              About
            </a>
          </div>

          <div className="hidden md:block w-[120px]"></div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="bg-[#0d1516] border-b border-gray-800 py-6 px-8 flex flex-col gap-4 md:hidden">
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, 'products')}
            className="font-sans text-sm font-bold text-gray-300 hover:text-white uppercase"
          >
            Products
          </a>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, 'about')}
            className="font-sans text-sm font-bold text-gray-300 hover:text-white uppercase"
          >
            About
          </a>
        </div>
      )}
    </>
  );
}
