import { useRef } from 'react';
import { 
  FileText, 
  PenTool, 
  Wrench, 
  ShieldAlert, 
  Truck, 
  Gauge, 
  HelpCircle 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { images } from '../data/images';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessWorkflow() {
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "01",
      title: "Consultation",
      icon: FileText,
      description: "Thorough scoping of fluid viscosity, pressure drops, and plant volume flow requirements."
    },
    {
      number: "02",
      title: "Design",
      icon: PenTool,
      description: "Drafting complete 3D CAD configurations and executing fluid dynamics simulations."
    },
    {
      number: "03",
      title: "Fabrication",
      icon: Wrench,
      description: "Precision steel machining and welding in our ASME/ISO-certified manufacturing workshop."
    },
    {
      number: "04",
      title: "Testing",
      icon: ShieldAlert,
      description: "Hydrostatic, dye penetrant, and pneumatic pressure checks under strict load simulations."
    },
    {
      number: "05",
      title: "Installation",
      icon: Truck,
      description: "On-site structural integration, pipe matching, and physical system positioning."
    },
    {
      number: "06",
      title: "Commissioning",
      icon: Gauge,
      description: "VFD calibrations, instrument checks, and flow optimization at operational load."
    },
    {
      number: "07",
      title: "Support",
      icon: HelpCircle,
      description: "Post-install support, maintenance schedules, and telemetry dashboard review."
    }
  ];

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop horizontal timeline
    mm.add("(min-width: 1024px)", () => {
      // Progress line drawing linked to scroll
      gsap.fromTo(".desktop-progress-line", 
        { scaleX: 0 }, 
        { 
          scaleX: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 75%",
            scrub: 0.5,
          }
        }
      );

      // Step bubbles staggered entrance
      gsap.from(".desktop-step-item", {
        opacity: 0,
        y: 40,
        scale: 0.85,
        stagger: 0.12,
        duration: 0.8,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none none"
        }
      });
    });

    // Mobile vertical timeline
    mm.add("(max-width: 1023px)", () => {
      // Progress line drawing linked to scroll
      gsap.fromTo(".mobile-progress-line", 
        { scaleY: 0 }, 
        { 
          scaleY: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 80%",
            scrub: 0.5,
          }
        }
      );

      // Step items reveal
      gsap.from(".mobile-step-item", {
        opacity: 0,
        x: -25,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="process" className="py-32 bg-[#0c1213] relative overflow-hidden">
      {/* Background workflow image */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen bg-cover bg-center select-none"
        style={{ backgroundImage: `url(${images.workflow})` }}
      ></div>

      {/* Background gradients */}
      <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary-container/2 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            Execution Roadmap
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Our Engineering Process
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            From initial parameters to active site operations—how we ensure predictable system execution.
          </p>
        </div>

        {/* Desktop Timeline (Horizontal) */}
        <div className="hidden lg:block relative py-8">
          {/* Inactive connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 z-0 -translate-y-1/2"></div>
          {/* Active progress line */}
          <div className="desktop-progress-line absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-[#00e0ff] to-[#00b0ff] z-0 -translate-y-1/2 origin-left scale-x-0 will-change-transform"></div>
          
          <div className="grid grid-cols-7 gap-6 relative z-10">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.title}
                  className="desktop-step-item group flex flex-col items-center text-center space-y-4 will-change-transform"
                >
                  {/* Step bubble */}
                  <div className="w-14 h-14 rounded-full bg-[#0d1516] border border-white/10 group-hover:border-[#00e0ff]/30 text-[#00e0ff] flex items-center justify-center transition-all duration-300 relative shadow-[0_0_15px_rgba(13,21,22,0.8)]">
                    <IconComponent className="w-5.5 h-5.5" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-on-surface-variant">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-bold text-on-surface group-hover:text-[#00e0ff] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed max-w-[150px] mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="lg:hidden relative space-y-8 pl-8">
          {/* Inactive connecting line */}
          <div className="absolute left-3.5 top-4 bottom-4 w-[2px] bg-white/10 z-0"></div>
          {/* Active progress line */}
          <div className="mobile-progress-line absolute left-3.5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#00e0ff] to-[#00b0ff] z-0 origin-top scale-y-0 will-change-transform"></div>

          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.title}
                className="mobile-step-item relative flex gap-5 group will-change-transform"
              >
                {/* Bubble */}
                <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-[#0d1516] border border-white/15 text-[#00e0ff] flex items-center justify-center z-10 group-hover:border-[#00e0ff] transition-colors shadow-[0_0_10px_rgba(13,21,22,0.8)]">
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="space-y-1 bg-white/[0.01] border border-white/5 rounded-xl p-5 w-full">
                  <span className="font-mono text-[10px] text-glow-accent text-primary-container font-semibold">{step.number}</span>
                  <h3 className="font-sans text-lg font-bold text-on-surface">{step.title}</h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

