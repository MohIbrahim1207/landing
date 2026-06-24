import { motion } from 'framer-motion';
import { ShieldCheck, HardHat, LineChart } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "ASME & ISO Standards",
      description: "Our pressure vessels, housings, and separation columns are fabricated in strict alignment with ASME Section VIII and ISO 9001 quality guidelines.",
      accent: "Certified Construction"
    },
    {
      icon: LineChart,
      title: "99.9% Expected Uptime",
      description: "By integrating precision-turned components, durable seals, and automatic flushing mechanisms, our setups reduce typical scheduled maintenance shutdowns.",
      accent: "Mechanical Reliability"
    },
    {
      icon: HardHat,
      title: "Direct Engineering Line",
      description: "No generic support agents. When you call, you discuss directly with the lead commissioning engineers who designed your systems.",
      accent: "Expert-Level Integration"
    }
  ];

  return (
    <section className="py-32 bg-[#0d1516] relative overflow-hidden">
      {/* Light spots */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-container/2.5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Hero Card (Large Bento Cell) */}
          <div className="lg:col-span-6 glass-panel p-10 md:p-12 rounded-3xl flex flex-col justify-between overflow-hidden relative group">
            {/* Subtle mesh/grid pattern overlay inside bento */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            
            <div className="space-y-6 relative z-10">
              <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block">
                The Flow Force Edge
              </span>
              <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
                Why Process Leaders Select Us
              </h2>
              <p className="font-sans text-on-surface-variant text-base leading-relaxed">
                We bridge the gap between high-torque heavy-duty mechanics and intelligent process telemetry. Every installation is designed to meet exact target specifications, minimizing energy draw and particle degradation.
              </p>
            </div>

            {/* Custom Interactive Telemetry Simulation Widget */}
            <div className="mt-12 p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-on-surface-variant tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e0ff] animate-ping"></span>
                  Active Telemetry Loop
                </span>
                <span className="font-mono text-xs text-[#00e0ff] font-semibold">ONLINE</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0c1213] p-4 rounded-xl border border-white/5 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant/60 tracking-wider">PRESSURE</p>
                  <p className="font-sans text-lg font-bold text-on-surface mt-1">45.2 bar</p>
                </div>
                <div className="bg-[#0c1213] p-4 rounded-xl border border-white/5 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant/60 tracking-wider">FLOW RATE</p>
                  <p className="font-sans text-lg font-bold text-on-surface mt-1">320 L/m</p>
                </div>
                <div className="bg-[#0c1213] p-4 rounded-xl border border-white/5 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant/60 tracking-wider">VIBRATION</p>
                  <p className="font-sans text-lg font-bold text-[#00e0ff] mt-1">NORMAL</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Bento Cells (Grid) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Standard Bento features */}
            {features.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-panel p-8 rounded-3xl flex flex-col justify-between hover:border-[#00e0ff]/20 transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-[#00e0ff]/10 border border-[#00e0ff]/20 flex items-center justify-center text-[#00e0ff] group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-5.5 h-5.5" />
                    </div>
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                        {feat.accent}
                      </span>
                      <h3 className="font-sans text-xl font-bold text-on-surface">
                        {feat.title}
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Micro bento card with certification compliance badges */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel p-8 rounded-3xl flex flex-col justify-between bg-gradient-to-br from-white/[0.01] to-[#00e0ff]/[0.02]"
            >
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-on-surface-variant/60 tracking-wider uppercase block">
                  Quality Marks
                </span>
                <h3 className="font-sans text-lg font-bold text-on-surface">
                  Code Conformity
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                    <span className="text-on-surface-variant font-mono">ASME Sec VIII</span>
                    <span className="text-[#00e0ff] font-semibold">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                    <span className="text-on-surface-variant font-mono">FDA / 3-A</span>
                    <span className="text-[#00e0ff] font-semibold">Hygienic standard</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className="text-on-surface-variant font-mono">ISO 9001:2015</span>
                    <span className="text-[#00e0ff] font-semibold">Registered</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
