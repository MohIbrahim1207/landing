import { images } from '../data/images';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 w-full pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Company Pitch */}
        <div className="lg:col-span-5 space-y-6">
          <a href="#" className="flex items-center group w-fit">
            <img 
              src={images.logo} 
              alt="Flow Force Logo" 
              className="h-10 w-auto object-contain"
            />
          </a>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-sm">
            Flow Force Engineering designs, manufactures, and integrates custom heavy-duty liquid handling, filtration, and bulk material conveying installations globally.
          </p>
          <div className="pt-2">
            <p className="font-mono text-[10px] text-on-surface-variant/40 tracking-wider uppercase">
              © 2026 Flow Force Engineering. All rights reserved.
            </p>
          </div>
        </div>

        {/* Links Category 1 */}
        <div className="lg:col-span-2 space-y-4">
          <p className="font-mono text-[10px] text-[#00e0ff] uppercase tracking-wider font-semibold">
            Product Scope
          </p>
          <ul className="space-y-2 text-xs">
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#systems">Homogenizers</a></li>
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#systems">Liquid Filtration</a></li>
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#systems">Conveying Systems</a></li>
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#systems">Dust Collectors</a></li>
          </ul>
        </div>

        {/* Links Category 2 */}
        <div className="lg:col-span-2 space-y-4">
          <p className="font-mono text-[10px] text-[#00e0ff] uppercase tracking-wider font-semibold">
            Information
          </p>
          <ul className="space-y-2 text-xs">
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#about">About Flow Force</a></li>
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#process">Our Process</a></li>
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#solutions">Featured Solutions</a></li>
            <li><a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#rfq">Request Consultation</a></li>
          </ul>
        </div>

        {/* Headquarters & Workshop Info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-[#00e0ff] uppercase tracking-wider font-semibold">
              Jakarta Headquarters
            </p>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Kensington Office Tower, Level 7<br />
              Jl. Boulevard Raya No. 1, Kelapa Gading<br />
              Jakarta Utara 14240, Indonesia
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-[#00e0ff] uppercase tracking-wider font-semibold">
              Cikarang Workshop
            </p>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Delta Silicon Industrial Park, Jl. Meranti I<br />
              Cikarang Selatan, Bekasi 17530<br />
              Jawa Barat, Indonesia
            </p>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-on-surface-variant">Phone: <span className="text-on-surface font-semibold">+62 811-1779-7810</span></p>
            <p className="text-on-surface-variant">Email: <span className="text-on-surface font-semibold">sales@flowforceengineering.com</span></p>
          </div>
        </div>

      </div>

      {/* Code conformity compliance labels */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-on-surface-variant/40">
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
