import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
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
    } else if (target === 'contact') {
      // scroll to contact form
      const contactSec = document.getElementById('quote-form-section');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate('catalog');
        setTimeout(() => {
          const contactSecCatalog = document.getElementById('quote-form-section');
          if (contactSecCatalog) contactSecCatalog.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isScrolled
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
              className={`font-sans text-xs tracking-wider font-bold transition-colors uppercase ${
                currentPage === 'catalog' ? 'text-[#00e0ff]' : 'text-gray-300 hover:text-white'
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
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="font-sans text-xs tracking-wider font-bold text-gray-300 hover:text-white transition-colors uppercase"
            >
              Contact
            </a>
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <a
              href="#"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#00e0ff] hover:bg-[#00daf8] text-[#0d1516] font-bold rounded transition-colors text-xs uppercase tracking-wider cursor-pointer"
            >
              Request Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

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
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="font-sans text-sm font-bold text-gray-300 hover:text-white uppercase"
          >
            Contact
          </a>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#00e0ff] hover:bg-[#00daf8] text-[#0d1516] font-bold rounded text-xs uppercase tracking-wider transition-colors mt-2"
          >
            Request Quote
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </>
  );
}
