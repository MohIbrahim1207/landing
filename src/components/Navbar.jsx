import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { images } from '../data/images';

export default function Navbar() {
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

  const navLinks = [
    { name: 'Systems', href: '#systems' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'About', href: '#about' },
    { name: 'Process', href: '#process' },
    { name: 'RFQ', href: '#rfq' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-[#0d1516]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <img 
              src={images.logo} 
              alt="Flow Force Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-mono text-sm tracking-wide text-on-surface-variant hover:text-primary-container transition-colors duration-300 uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <a
              href="#rfq"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00e0ff] hover:bg-[#00daf8] text-[#0d1516] font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,224,255,0.2)] hover:shadow-[0_0_25px_rgba(0,224,255,0.4)] text-sm group"
            >
              Request Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:text-[#00e0ff] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-[#0d1516]/95 backdrop-blur-2xl pt-28 px-8 flex flex-col gap-6 border-b border-white/5 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-sans text-2xl font-bold tracking-tight text-on-surface hover:text-primary-container transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-8">
              <a
                href="#rfq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary-container hover:bg-[#00daf8] text-[#0d1516] font-bold rounded-lg transition-all"
              >
                Request Quote
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
