import { motion } from 'framer-motion';
import { ShieldCheck, Factory, Cpu } from 'lucide-react';
import { images } from '../data/images';

export default function AboutSection() {
  const capabilities = [
    {
      icon: Cpu,
      title: "Design Engineering",
      description: "Custom flow schematics and 3D CAD modeling. We engineer process equipment to solve fluid mechanics, pressure limits, and particle integration challenge areas.",
    },
    {
      icon: Factory,
      title: "Manufacturing Workshop",
      description: "Equipped for custom steel fabrication, precise assembly, and quality verification. All systems are assembled under compliance to strict industrial guidelines.",
    },
    {
      icon: ShieldCheck,
      title: "Process Optimization",
      description: "Continuous testing and quality assurance protocols. Our configurations are designed to optimize plant uptime, product consistency, and flow dynamics.",
    }
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-[#0d1516]">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block">
                Engineering Authority
              </span>
              <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
                Pioneering Precision Process Integration
              </h2>
              <p className="font-sans text-on-surface-variant text-base sm:text-lg leading-relaxed">
                Flow Force is a dedicated B2B engineering partner. We design, manufacture, and integrate high-end fluid handling, mixing, filtration, and conveying machinery. Our equipment operates in some of the most challenging manufacturing settings globally.
              </p>
            </div>

            {/* Capability Blocks */}
            <div className="space-y-6">
              {capabilities.map((cap, idx) => {
                const IconComponent = cap.icon;
                return (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-5 p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-300"
                  >
                    <div className="p-3 bg-[#00e0ff]/10 rounded-lg border border-[#00e0ff]/20 h-fit">
                      <IconComponent className="w-6 h-6 text-[#00e0ff]" />
                    </div>
                    <div>
                      <h3 className="font-sans text-lg font-bold text-on-surface mb-1">{cap.title}</h3>
                      <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{cap.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Visual Presentation / Media Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden glass-panel p-1.5 aspect-[3/4]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url('${images.about.engineering}')` }}
                ></div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                <p className="font-sans text-4xl font-black text-primary-container">2021</p>
                <p className="font-mono text-xs text-on-surface-variant tracking-wider uppercase mt-1">Established Year</p>
              </div>
            </div>

            <div className="space-y-4 pt-12">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                <p className="font-sans text-4xl font-black text-primary-container">100%</p>
                <p className="font-mono text-xs text-on-surface-variant tracking-wider uppercase mt-1">Custom Engineered</p>
              </div>
              <div className="rounded-2xl overflow-hidden glass-panel p-1.5 aspect-[3/4]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url('${images.about.manufacturing}')` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
