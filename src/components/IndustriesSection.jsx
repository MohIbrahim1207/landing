import { useRef } from 'react';
import { 
  Utensils, 
  FlaskConical, 
  Building2, 
  Droplet, 
  Milk,
  Boxes
} from 'lucide-react';
import { images } from '../data/images';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Subcomponent for 3D tilt and hover effects
function IndustryCard({ ind }) {
  const cardRef = useRef(null);
  const IconComponent = ind.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // rotation angle (max 10 degrees tilt)
    const rotateX = ((centerY - y) / centerY) * 10; 
    const rotateY = ((x - centerX) / centerX) * 10; 

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="industry-card group relative h-72 rounded-2xl overflow-hidden glass-panel p-1 flex flex-col justify-end border-white/5 border hover:border-[#00e0ff]/20 transition-colors duration-500 will-change-transform"
    >
      {/* Background Image with Zoom and overlay */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" style={{ transform: 'translateZ(-10px)' }}>
        <img 
          src={ind.image} 
          alt={ind.name} 
          loading="lazy" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1516] via-[#0d1516]/70 to-[#0d1516]/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-6 space-y-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#00e0ff]/10 rounded-lg border border-[#00e0ff]/20 text-[#00e0ff]">
            <IconComponent className="w-5.5 h-5.5" />
          </div>
          <h3 className="font-sans text-xl font-bold text-on-surface group-hover:text-primary-container transition-colors duration-300">
            {ind.name}
          </h3>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
          {ind.description}
        </p>
      </div>
    </div>
  );
}

export default function IndustriesSection() {
  const containerRef = useRef(null);

  const industries = [
    {
      name: "Food & Beverage",
      icon: Utensils,
      image: images.industries.foodProcessing,
      description: "Hygienic product conveying, particle size reduction, and precise filtration for food-safe systems."
    },
    {
      name: "Dairy Processing",
      icon: Milk,
      image: images.industries.dairy,
      description: "Homogenizers and sanitary filtration systems complying with top sanitary certification standards."
    },
    {
      name: "Pharmaceutical",
      icon: FlaskConical,
      image: images.industries.pharmaceutical,
      description: "Ultra-pure liquid filtration and containment solutions engineered to prevent process cross-contamination."
    },
    {
      name: "Chemical & Polymer",
      icon: Boxes,
      image: images.industries.chemical,
      description: "Corrosion-resistant vessels, self-cleaning filtration, and specialized powder handling."
    },
    {
      name: "Industrial Manufacturing",
      icon: Building2,
      image: images.industries.manufacturing,
      description: "Heavy-duty dust collection, pneumatic conveying lines, and bulk bag packaging plants."
    },
    {
      name: "Water Treatment",
      icon: Droplet,
      image: images.industries.waterTreatment,
      description: "Automatic self-cleaning filters and strainer installations for large-scale municipal or factory water loops."
    }
  ];

  useGSAP(() => {
    gsap.from('.industry-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-[#0c1213] relative overflow-hidden">
      {/* Subtle lighting overlay */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00e0ff]/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            Versatility By Design
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Supporting Core Industries
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            Our systems are tailored to perform under the exact hygienic, chemical, and physical demands of target sectors.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => (
            <IndustryCard key={ind.name} ind={ind} />
          ))}
        </div>
      </div>
    </section>
  );
}

