import { images } from '../data/images';
import { PRODUCTS } from '../data/products';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#080f11] border-t border-white/5 w-full pt-16 pb-12 text-[#bac9cd]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12 text-left">
        
        {/* Company Pitch */}
        <div className="lg:col-span-5 space-y-6">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}
            className="flex items-center group w-fit cursor-pointer"
          >
            <img 
              src={images.logo} 
              alt="Flow Force Logo" 
              className="h-9 w-auto object-contain"
            />
          </a>
          <p className="font-sans text-xs leading-relaxed max-w-sm text-gray-400">
            Flow Force Engineering designs, manufactures, and integrates custom heavy-duty liquid handling, filtration, and bulk material conveying installations globally.
          </p>
          <div>
            <p className="font-mono text-[9px] text-gray-600 tracking-wider uppercase">
              © 2026 Flow Force Engineering. All rights reserved.
            </p>
          </div>
        </div>

        {/* Links Category 1 */}
        <div className="lg:col-span-3 space-y-4">
          <p className="font-mono text-[10px] text-[#00e0ff] uppercase tracking-wider font-bold">
            Product Portfolio
          </p>
          <ul className="space-y-2 text-xs">
            {PRODUCTS.map((prod) => (
              <li key={prod.id}>
                <a
                  className="text-gray-400 hover:text-[#00e0ff] transition-colors uppercase font-mono text-[10px] block"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('detail', prod.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {prod.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Headquarters & Workshop Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-[#00e0ff] uppercase tracking-wider font-bold">
              Jakarta Headquarters
            </p>
            <p className="font-sans text-xs text-gray-400 leading-relaxed">
              Kensington Office Tower, Level 7<br />
              Jl. Boulevard Raya No. 1, Kelapa Gading<br />
              Jakarta Utara 14240, Indonesia
            </p>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-gray-400">Phone: <span className="text-white font-semibold">+62 811-1779-7810</span></p>
            <p className="text-gray-400">Email: <span className="text-white font-semibold">sales@flowforceengineering.com</span></p>
          </div>
        </div>

      </div>

      {/* Code conformity compliance labels */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono text-gray-600">
        <div className="flex flex-wrap justify-center gap-6">
          <span>ASME SEC VIII COMPLIANT</span>
          <span>USDA HYGIENIC CONFORMITY</span>
          <span>3-A SANITARY STANDARDS REGISTERED</span>
          <span>ISO 9001:2015 CERTIFIED</span>
        </div>
        <div>
          <span>PRECISION INDUSTRIAL SYSTEMS • EST. 2021</span>
        </div>
      </div>
    </footer>
  );
}
