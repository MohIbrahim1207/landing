import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Gauge, Filter, Database, Wrench, 
  ArrowRight, Settings, Info, RefreshCw, Zap
} from 'lucide-react';

const INDUSTRIES = [
  { name: "Food & Beverage", id: "food" },
  { name: "Dairy Processing", id: "dairy" },
  { name: "Pharmaceutical", id: "pharma" },
  { name: "Chemical & Polymer", id: "chemical" },
  { name: "Industrial Manufacturing", id: "manufacturing" },
  { name: "Water Treatment", id: "water" }
];

const PROCESS_GOALS = [
  { 
    id: "conveying", 
    name: "Fluid & Powder Conveying", 
    icon: Cpu,
    category: "Conveying Systems"
  },
  { 
    id: "mixing", 
    name: "High-Shear Mixing", 
    icon: RefreshCw,
    category: "High Pressure Homogenizers"
  },
  { 
    id: "filtration", 
    name: "Liquid & Particulate Filtration", 
    icon: Filter,
    category: "Liquid Filtration Systems"
  },
  { 
    id: "storage", 
    name: "Silo Storage & Feeding", 
    icon: Database,
    category: "Silo Systems"
  }
];

export default function ProcessConfigurator() {
  const [selectedIndustry, setSelectedIndustry] = useState("food");
  const [selectedGoal, setSelectedGoal] = useState("conveying");
  const [flowRate, setFlowRate] = useState(15000); // L/h
  const [viscosity, setViscosity] = useState(100); // cP
  const [pressure, setPressure] = useState(16); // bar
  const [isCopied, setIsCopied] = useState(false);

  // Dynamic calculations based on sliders
  const isLaminar = viscosity > 1000;
  const reynoldsNumber = Math.round((flowRate * 0.8) / (viscosity + 1));
  
  // Calculate recommended system
  const getRecommendation = () => {
    switch (selectedGoal) {
      case "mixing":
        if (pressure > 80) {
          return {
            model: "BOS-3 Premium Homogenizer",
            desc: "Designed for ultra-high-pressure homogenization up to 1,500 bar with aseptic CIP-ready valve blocks.",
            category: "High Pressure Homogenizers"
          };
        }
        return {
          model: "BOS-1 Standard Homogenizer",
          desc: "Versatile industrial liquid emulsification and particle sizing up to 600 bar.",
          category: "High Pressure Homogenizers"
        };
      case "conveying":
        if (flowRate > 25000) {
          return {
            model: "Dense Phase Pneumatic Conveyor (DP-Heavy)",
            desc: "High-throughput powder and granule transport featuring acoustic enclosure blower configurations.",
            category: "Conveying Systems"
          };
        }
        return {
          model: "Dilute Phase Pneumatic System (DP-Light)",
          desc: "Gentle, high-velocity conveying of fragile food and chemical powders over long distances.",
          category: "Conveying Systems"
        };
      case "filtration":
        if (viscosity > 500) {
          return {
            model: "Pneumatic Scraper Self-Cleaning Filter",
            desc: "Automatic scraper mechanism removes high-viscosity solids without interrupting process flow.",
            category: "Self Cleaning Filters"
          };
        }
        return {
          model: "ASME Multi-Bag Filter Housing",
          desc: "Swing-bolt multi-bag pressure vessel for high-capacity liquid clarification.",
          category: "Bag Filter Housing"
        };
      case "storage":
        return {
          model: "Dry Bulk Silo with Fluidized Cone",
          desc: "Premium storage silos equipped with pneumatic fluidizers, radar level telemetry, and ATEX explosion vents.",
          category: "Silo Systems"
        };
      default:
        return {
          model: "Custom Scoped Process Loop",
          desc: "Specialized engineering configuration custom-tailored to unique plant specifications.",
          category: "Conveying Systems"
        };
    }
  };

  const rec = getRecommendation();

  // Dynamic efficiency calculations
  const efficiency = Math.min(98, Math.max(82, Math.round(96 - (viscosity > 2000 ? 5 : 0) - (pressure > 100 ? 4 : 0) + (flowRate > 30000 ? 2 : 0))));
  const uptime = "99.9%";

  // Animation speed factor based on flow rate (for the visual twin)
  const animSpeed = Math.max(0.3, (flowRate / 15000) * 1.2);

  // Apply configuration to the RFQ form
  const applyToRFQ = () => {
    const text = `=== AUTOMATED DIGITAL TWIN CONFIGURATION ===
Industry Sector: ${INDUSTRIES.find(i => i.id === selectedIndustry)?.name}
Process Area: ${PROCESS_GOALS.find(g => g.id === selectedGoal)?.name}
Target Flow Rate: ${flowRate.toLocaleString()} L/h
Fluid Viscosity: ${viscosity.toLocaleString()} cP (${isLaminar ? 'Laminar Flow regime' : 'Turbulent Flow regime'})
Operating Pressure: ${pressure} bar
Calculated Reynolds Index: ${reynoldsNumber}
Recommended Equipment: ${rec.model} (${rec.category})
Estimated Loop Efficiency: ${efficiency}%

[Engineering Scoping Request]: Please review this dynamically sized configuration and provide technical datasheet scoping.`;

    // Dispatch custom event to populate RFQ Form
    const event = new CustomEvent('apply-config', {
      detail: {
        category: rec.category,
        text: text
      }
    });
    window.dispatchEvent(event);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);

    // Smooth scroll to RFQ section
    const rfqSec = document.getElementById('rfq');
    if (rfqSec) {
      rfqSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="configurator" className="py-32 bg-[#080f11] relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00e0ff]/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            Dynamic Scoping Deck
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Interactive Process Configurator
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            Size your machinery, calculate flow diagnostics, and dynamically formulate your system specifications in real-time.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* Left: Input parameters */}
          <div className="lg:col-span-7 space-y-8 bg-white/[0.01] border border-white/5 p-6 md:p-10 rounded-2xl">
            
            {/* Step 1: Industry Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#00e0ff]/10 border border-[#00e0ff]/30 flex items-center justify-center font-mono text-[10px] text-[#00e0ff] font-bold">1</span>
                <h3 className="font-sans text-base font-bold text-on-surface">Select Target Industry</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={`px-4 py-3 rounded-xl border font-sans text-xs font-semibold transition-all duration-300 ${
                      selectedIndustry === ind.id 
                        ? 'bg-[#00e0ff]/8 border-[#00e0ff]/40 text-[#00e0ff] shadow-[0_0_15px_rgba(0,224,255,0.05)]' 
                        : 'bg-white/[0.01] border-white/5 text-on-surface-variant hover:border-white/10 hover:text-on-surface'
                    }`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Process Goal */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#00e0ff]/10 border border-[#00e0ff]/30 flex items-center justify-center font-mono text-[10px] text-[#00e0ff] font-bold">2</span>
                <h3 className="font-sans text-base font-bold text-on-surface">Choose Process Goal</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROCESS_GOALS.map((goal) => {
                  const GoalIcon = goal.icon;
                  const isActive = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`flex gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#00e0ff]/8 border-[#00e0ff]/40 text-[#00e0ff] shadow-[0_0_15px_rgba(0,224,255,0.05)]' 
                          : 'bg-white/[0.01] border-white/5 text-on-surface-variant hover:border-white/10'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg border h-fit ${
                        isActive ? 'bg-[#00e0ff]/10 border-[#00e0ff]/20 text-[#00e0ff]' : 'bg-white/5 border-white/10 text-on-surface-variant'
                      }`}>
                        <GoalIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-sans text-sm font-bold ${isActive ? 'text-[#00e0ff]' : 'text-on-surface'}`}>{goal.name}</h4>
                        <p className="font-sans text-[11px] text-on-surface-variant leading-normal mt-0.5">Sizing parameters configured.</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Parameters sliders */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#00e0ff]/10 border border-[#00e0ff]/30 flex items-center justify-center font-mono text-[10px] text-[#00e0ff] font-bold">3</span>
                <h3 className="font-sans text-base font-bold text-on-surface">Adjust Loop Parameters</h3>
              </div>

              <div className="space-y-6">
                {/* Flow Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-xs font-semibold text-on-surface">Target Flow Rate</span>
                    <span className="font-mono text-xs text-[#00e0ff] font-bold">{flowRate.toLocaleString()} L/h</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="50000" 
                    step="500"
                    value={flowRate}
                    onChange={(e) => setFlowRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00e0ff]"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/50">
                    <span>500 L/h</span>
                    <span>25,000 L/h</span>
                    <span>50,000 L/h</span>
                  </div>
                </div>

                {/* Viscosity */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-xs font-semibold text-on-surface">Fluid Viscosity</span>
                    <span className="font-mono text-xs text-[#00e0ff] font-bold">{viscosity.toLocaleString()} cP</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10000" 
                    step="50"
                    value={viscosity}
                    onChange={(e) => setViscosity(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00e0ff]"
                  />
                  <div className="flex justify-between font-sans text-[9px] text-on-surface-variant">
                    <span className={viscosity <= 100 ? 'text-[#00e0ff] font-bold' : 'text-on-surface-variant/40'}>Water-like (Low)</span>
                    <span className={viscosity > 100 && viscosity <= 2000 ? 'text-[#00e0ff] font-bold' : 'text-on-surface-variant/40'}>Oil-like (Medium)</span>
                    <span className={viscosity > 2000 ? 'text-[#00e0ff] font-bold' : 'text-on-surface-variant/40'}>Paste-like (High)</span>
                  </div>
                </div>

                {/* Pressure */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-xs font-semibold text-on-surface">Required Operating Pressure</span>
                    <span className="font-mono text-xs text-[#00e0ff] font-bold">{pressure} bar</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="150" 
                    step="1"
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00e0ff]"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/50">
                    <span>1 bar</span>
                    <span>75 bar</span>
                    <span>150 bar</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Diagnostics & Simulated Visual Twin */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual twin animation */}
            <div className="glass-panel p-6 rounded-2xl border border-white/8 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[9px] text-on-surface-variant/65 tracking-widest uppercase">Live Fluid Flow Twin</span>
                <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${
                  isLaminar ? 'border-amber-500/20 bg-amber-500/5 text-amber-400' : 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                }`}>
                  {isLaminar ? 'Laminar Flow' : 'Turbulent'}
                </span>
              </div>

              {/* Animated Pipeline Simulation Box */}
              <div className="h-28 bg-[#0c1213] rounded-xl flex items-center justify-center relative overflow-hidden border border-white/5">
                <div className="absolute inset-x-0 h-8 bg-gradient-to-r from-transparent via-[#00e0ff]/5 to-transparent border-y border-white/5 flex items-center relative overflow-hidden">
                  
                  {/* Flow Particles moving at dynamic speed */}
                  <motion.div 
                    animate={{ x: [-100, 400] }}
                    transition={{ 
                      duration: 4 / animSpeed, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="flex gap-12 absolute left-0"
                  >
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3.5 h-3.5 rounded-full blur-[2px] ${
                          isLaminar ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-[#00e0ff] to-[#0080ff]'
                        }`} 
                      />
                    ))}
                  </motion.div>

                  {/* Secondary particle offset */}
                  <motion.div 
                    animate={{ x: [-100, 400] }}
                    transition={{ 
                      duration: 4 / animSpeed, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: 2 / animSpeed
                    }}
                    className="flex gap-12 absolute left-0"
                  >
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3.5 h-3.5 rounded-full blur-[2px] ${
                          isLaminar ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-[#00e0ff] to-[#0080ff]'
                        }`} 
                      />
                    ))}
                  </motion.div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none">
                  <span className="font-mono text-[9px] text-[#00e0ff]/60">Re = {reynoldsNumber}</span>
                  <span className="font-mono text-[9px] text-on-surface-variant/50 self-end">Flow Velocity: {(animSpeed * 1.5).toFixed(1)} m/s</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Sizing Results */}
            <div className="glass-panel p-6 rounded-2xl border border-white/8 space-y-6">
              <div className="space-y-1 text-left">
                <span className="font-mono text-[9px] text-[#00e0ff] tracking-widest uppercase">Size Recommendation</span>
                <h4 className="font-sans text-xl font-black text-on-surface">{rec.model}</h4>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-1">{rec.desc}</p>
              </div>

              {/* Technical indicators */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1 text-left">
                  <span className="font-mono text-[8px] text-on-surface-variant/50 tracking-widest uppercase block">Loop Efficiency</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-2xl font-black text-on-surface">{efficiency}%</span>
                    <span className="font-sans text-[10px] text-green-400 font-bold">Optimized</span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <span className="font-mono text-[8px] text-on-surface-variant/50 tracking-widest uppercase block">Uptime Reliability</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-2xl font-black text-on-surface">{uptime}</span>
                    <span className="font-sans text-[10px] text-[#00e0ff] font-bold">Continuous</span>
                  </div>
                </div>
              </div>

              {/* Inject Config CTA */}
              <button
                onClick={applyToRFQ}
                className="w-full inline-flex items-center justify-between gap-3 px-6 py-4 bg-[#00e0ff] hover:bg-[#00daf8] text-[#0d1516] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,224,255,0.15)] group text-sm"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 animate-spin-slow text-[#0d1516]" />
                  <span>{isCopied ? "Config Applied!" : "Apply to RFQ Quote"}</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
