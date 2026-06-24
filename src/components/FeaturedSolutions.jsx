import { CheckCircle2, ChevronRight } from 'lucide-react';
import { images } from '../data/images';

export default function FeaturedSolutions() {
  const solutions = [
    {
      id: "SOL-1040",
      category: "Material Conveying",
      title: "Turnkey Dilute Phase Conveying Plant",
      image: images.solutions.turnkeyConveying,
      description: "A complete, closed-loop food-grade conveying installation designed to transport fragile dairy powders over 120 meters without product shearing or fines accumulation.",
      techSpecs: [
        { label: "Throughput Capacity", val: "12,000 kg/hr continuous duty" },
        { label: "Blower Configuration", val: "Acoustic-enclosed 45kW rotary lobes" },
        { label: "Hygienic Rating", val: "USDA & 3-A compliant sanitizing" }
      ],
      points: [
        "Dynamic air-to-material ratio control logic.",
        "Differential pressure sensors mapping line resistance.",
        "Fully CIP (Clean-In-Place) washdown assemblies."
      ]
    },
    {
      id: "SOL-2080",
      category: "Separation Systems",
      title: "Automated Magnetic Drum Separator Plant",
      image: images.solutions.automatedSeparation,
      description: "Continuous self-cleaning magnetic extraction plant engineered for high-tonnage mining slurry and mineral ore processing operations.",
      techSpecs: [
        { label: "Magnetic Intensity", val: "12,000 Gauss peak rare-earth magnet" },
        { label: "Drum Material", val: "Hardened titanium steel casing" },
        { label: "Slurry Concentration", val: "Up to 65% solids by weight load" }
      ],
      points: [
        "Automatic separation feedback tracking load fluctuations.",
        "Heavy-duty wear linings on inlet feed boxes.",
        "Zero downtime drum maintenance configuration."
      ]
    },
    {
      id: "SOL-3090",
      category: "Environmental Control",
      title: "Explosion-Proof Pulse-Jet Dust Collector",
      image: images.solutions.dustExtraction,
      description: "High-capacity environmental dust collector designed to extract combustible chemical powders and return clean air to the facility.",
      techSpecs: [
        { label: "Air Filtration Capacity", val: "25,000 CFM exhaust volume" },
        { label: "Explosion Protection", val: "ATEX venting panels & check valves" },
        { label: "Filtration Media", val: "Antistatic PTFE membrane bags" }
      ],
      points: [
        "Microprocessor pulse timing for online filter cleaning.",
        "Integrated explosion suppression canister nozzles.",
        "Continuous particle emission sensors monitoring exhaust."
      ]
    }
  ];

  return (
    <section id="solutions" className="py-32 bg-[#0c1213] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary-container/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mb-24">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            Custom Installations
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Featured Systems Engineering
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            A showcase of custom industrial plants designed, fabricated, and commissioned by Flow Force.
          </p>
        </div>

        {/* Alternate Showcase list */}
        <div className="space-y-32">
          {solutions.map((sol, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={sol.id} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
              >
                
                {/* Media Presentation side */}
                <div className={`lg:col-span-6 relative group ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                  <div className="absolute -inset-4 bg-primary-container/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="relative rounded-2xl overflow-hidden glass-panel p-2.5 transform transition-transform duration-700 group-hover:scale-[1.01]">
                    <img 
                      src={sol.image} 
                      alt={sol.title} 
                      className="w-full h-auto rounded-xl object-cover aspect-[4/3] select-none"
                      loading="lazy"
                    />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0d1516]/90 backdrop-blur-md rounded-md border border-white/15">
                      <span className="font-mono text-xs text-glow-accent text-primary-container font-semibold">{sol.id}</span>
                    </div>
                  </div>
                </div>

                {/* Technical description side */}
                <div className={`lg:col-span-6 space-y-8 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block">
                      {sol.category}
                    </span>
                    <h3 className="font-sans text-3xl font-black text-on-surface leading-tight tracking-tight">
                      {sol.title}
                    </h3>
                    <p className="font-sans text-on-surface-variant text-sm sm:text-base leading-relaxed">
                      {sol.description}
                    </p>
                  </div>

                  {/* Technical Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/5 py-6">
                    {sol.techSpecs.map((spec) => (
                      <div key={spec.label} className="space-y-1">
                        <p className="font-mono text-[10px] text-on-surface-variant/60 tracking-wider uppercase">{spec.label}</p>
                        <p className="font-sans text-sm font-bold text-on-surface">{sol.id === 'SOL-1040' && spec.label === 'Hygienic Rating' ? 'USDA & 3-A' : spec.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-3">
                    {sol.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#00e0ff] shrink-0 mt-0.5" />
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{pt}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-4">
                    <a
                      href="#rfq"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-outline/20 text-on-surface hover:border-[#00e0ff]/30 hover:bg-[#00e0ff]/5 rounded-lg font-bold transition-all text-sm group"
                    >
                      Inquire About This Solution
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
