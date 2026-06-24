import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RFQSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: '',
    details: ''
  });

  useEffect(() => {
    const handleApplyConfig = (e) => {
      const { category, text } = e.detail;
      setFormData((prev) => ({
        ...prev,
        interest: category,
        details: text
      }));
    };
    window.addEventListener('apply-config', handleApplyConfig);
    return () => window.removeEventListener('apply-config', handleApplyConfig);
  }, []);

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const productCategories = [
    "High Pressure Homogenizers",
    "Liquid Filtration Systems",
    "Bag Filter Housing",
    "Self Cleaning Filters",
    "Silo Systems",
    "Conveying Systems",
    "Dust Collectors",
    "Big Bag Handling Systems"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.name || !formData.company || !formData.email || !formData.interest || !formData.details) {
      setStatus({ submitting: false, success: false, error: 'Please fill in all required fields.' });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    // Simulate API request
    setTimeout(() => {
      setStatus({
        submitting: false,
        success: true,
        error: null
      });
      // Clear form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        interest: '',
        details: ''
      });
    }, 1500);
  };

  return (
    <section id="rfq" className="py-32 bg-[#0d1516] relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-container/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#00e0ff] uppercase block mb-3">
            B2B Procurement
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
            Request Consultation / RFQ
          </h2>
          <p className="font-sans text-on-surface-variant mt-4 text-base sm:text-lg">
            Submit your fluid dynamics, pressure limits, and space parameters to receive a technical scoping response within 24 business hours.
          </p>
        </div>

        {/* RFQ Form Container */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl relative">
          <AnimatePresence mode="wait">
            {!status.success ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Error Alert */}
                {status.error && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{status.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 bg-[#0c1213] border border-white/10 focus:border-[#00e0ff] text-on-surface placeholder-on-surface-variant/40 rounded-lg outline-none transition-colors text-sm"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="block font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Alfa Chemical Ltd"
                      className="w-full px-4 py-3 bg-[#0c1213] border border-white/10 focus:border-[#00e0ff] text-on-surface placeholder-on-surface-variant/40 rounded-lg outline-none transition-colors text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. jdoe@company.com"
                      className="w-full px-4 py-3 bg-[#0c1213] border border-white/10 focus:border-[#00e0ff] text-on-surface placeholder-on-surface-variant/40 rounded-lg outline-none transition-colors text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                      Direct Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 555-0199"
                      className="w-full px-4 py-3 bg-[#0c1213] border border-white/10 focus:border-[#00e0ff] text-on-surface placeholder-on-surface-variant/40 rounded-lg outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Product Interest Selector */}
                <div className="space-y-2">
                  <label htmlFor="interest" className="block font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                    Product Category Interest *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0c1213] border border-white/10 focus:border-[#00e0ff] text-on-surface rounded-lg outline-none transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-on-surface-variant/40">Select category...</option>
                    {productCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0d1516] text-on-surface">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <label htmlFor="details" className="block font-mono text-[10px] text-[#00e0ff] tracking-wider uppercase font-semibold">
                    System Parameters & Scope Details *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Describe flow rate, viscosity, space constraints, explosive environment status, or custom installation needs..."
                    className="w-full px-4 py-3 bg-[#0c1213] border border-white/10 focus:border-[#00e0ff] text-on-surface placeholder-on-surface-variant/40 rounded-lg outline-none transition-colors text-sm resize-y"
                  ></textarea>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#00e0ff] hover:bg-[#00daf8] disabled:bg-white/10 disabled:text-on-surface-variant text-[#0d1516] font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,224,255,0.2)] hover:shadow-[0_0_30px_rgba(0,224,255,0.4)] text-sm group shrink-0"
                  >
                    {status.submitting ? "Transmitting Scope..." : "Submit Technical Scoping"}
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#00e0ff]/10 border border-[#00e0ff]/20 flex items-center justify-center mx-auto text-[#00e0ff]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-2xl font-black text-on-surface">RFQ Scoping Received</h3>
                  <p className="font-sans text-on-surface-variant max-w-md mx-auto text-sm">
                    Thank you. Your parameters have been transmitted directly to our lead engineering division. A senior applications specialist will contact you with diagnostic scoping feedback.
                  </p>
                </div>
                <button
                  onClick={() => setStatus({ submitting: false, success: false, error: null })}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface rounded-lg font-bold transition-all text-xs"
                >
                  Submit Another Inbound Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
