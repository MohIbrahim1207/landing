import React, { useState, useEffect, useRef, Suspense } from 'react';
import { PRODUCTS } from '../data/products';
import { ArrowLeft, FileText, Send, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Product3DViewer = React.lazy(() => import('../components/Product3DViewer'));

export default function ProductDetail({ productId, onBack, onNavigateProduct }) {
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen text-[#1a2123] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-bold">Product not found.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded">
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // Media Tab state: 'image' or '3d'
  const [mediaTab, setMediaTab] = useState('image');

  // Configurable options state
  const [selectedOptions, setSelectedOptions] = useState({});
  // Form submission state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    additionalInfo: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Initialize selected options
  useEffect(() => {
    const initial = {};
    product.options.forEach((opt) => {
      initial[opt.name] = true; // default select all
    });
    setSelectedOptions(initial);
    setSubmitted(false);
    setMediaTab('image'); // reset media tab to default image on product change
  }, [productId]);

  // Section refs for sticky scrolling
  const sectionRefs = {
    overview: useRef(null),
    features: useRef(null),
    brochure: useRef(null),
    industries: useRef(null),
    applications: useRef(null),
    options: useRef(null),
    specifications: useRef(null)
  };

  const handleScrollToSection = (sectionKey) => {
    const ref = sectionRefs[sectionKey];
    if (ref && ref.current) {
      const headerOffset = 130;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleOptionToggle = (name) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownload = () => {
    alert(`Downloading brochure for ${product.name}: ${product.brochure}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        additionalInfo: ''
      });
    }, 4000);
  };

  // Filter out current product for related products
  const relatedProducts = PRODUCTS.filter((p) => p.id !== productId);

  // Build current configuration summary string
  const getSelectedOptionsString = () => {
    return Object.entries(selectedOptions)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name)
      .join(', ');
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#1a2123]">
      {/* Back button and quick header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[#005f6d] font-semibold hover:text-[#00363f] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>
          <span className="font-mono text-xs font-bold text-gray-500 hidden sm:inline uppercase">
            FLOW FORCE INDUSTRIAL CATALOG
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Top Product Header section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left: Product Image / 3D Switcher Module (45-50% width on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Switcher segmented tabs */}
            <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-2xs">
              <button
                onClick={() => setMediaTab('image')}
                className={`flex-grow py-2 text-center text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  mediaTab === 'image'
                    ? 'bg-[#005f6d] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                📷 Product Image
              </button>
              <button
                onClick={() => setMediaTab('3d')}
                className={`flex-grow py-2 text-center text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  mediaTab === '3d'
                    ? 'bg-[#005f6d] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                🧊 Interactive 3D
              </button>
            </div>

            {/* Display View */}
            <div className="relative">
              {mediaTab === 'image' ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[400px] shadow-xs select-none">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[350px] max-w-full object-contain"
                  />
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="bg-white border border-gray-200 rounded-lg flex items-center justify-center min-h-[400px] shadow-xs text-gray-500 font-mono text-xs uppercase tracking-widest">
                      Loading 3D Canvas...
                    </div>
                  }
                >
                  <Product3DViewer productId={product.id} />
                </Suspense>
              )}
            </div>
          </div>

          {/* Right: Info and Primary CTA Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <span className="font-mono text-xs text-[#005f6d] tracking-widest uppercase font-bold">
                {product.category}
              </span>
              <h1 className="font-sans text-[44px] md:text-[48px] font-bold text-gray-900 tracking-tight uppercase leading-tight">
                {product.name}
              </h1>
              <p className="font-sans text-[16px] md:text-[18px] text-gray-600 leading-[1.7] font-normal">
                {product.overview}
              </p>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 mt-8">
              <button
                onClick={() => {
                  const formElement = document.getElementById('quote-form-section');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="py-3 px-8 bg-[#005f6d] hover:bg-[#00363f] text-white font-bold rounded shadow-sm hover:shadow transition-all text-[15px] uppercase tracking-wider cursor-pointer"
              >
                Request Quote
              </button>
              <button
                onClick={handleDownload}
                className="py-3 px-8 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded transition-all text-[15px] uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Brochure</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Tab Navigation (Locks to top as you scroll) */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs sticky top-[58px] z-20 mb-12 overflow-x-auto scrollbar-none">
          <div className="flex min-w-[640px]">
            {Object.keys(sectionRefs).map((key) => (
              <button
                key={key}
                onClick={() => handleScrollToSection(key)}
                className="flex-1 py-4 text-center font-sans text-xs font-bold tracking-wider text-gray-600 hover:text-[#005f6d] hover:bg-gray-50 border-r border-gray-100 last:border-0 transition-colors uppercase cursor-pointer"
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Section Contents with generous whitespace */}
        <div className="space-y-20 text-left">
          {/* Overview Section */}
          <div ref={sectionRefs.overview} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Overview
            </h2>
            <p className="font-sans text-[16px] md:text-[18px] text-gray-600 leading-[1.7] font-normal">
              {product.overview} Flow Force heavy-duty industrial systems are precision engineered to provide reliable containment, continuous throughput, and seamless mechanical interface matching. Configured to align directly with plant layout parameters.
            </p>
          </div>

          {/* Features Section */}
          <div ref={sectionRefs.features} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Features & Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-gray-50 rounded border border-gray-100 items-start">
                  <span className="text-[#005f6d] font-bold text-lg leading-none">✓</span>
                  <p className="font-sans text-sm text-gray-700 leading-relaxed font-semibold">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brochure Section */}
          <div ref={sectionRefs.brochure} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Brochure
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#005f6d]/10 rounded border border-[#005f6d]/20 text-[#005f6d]">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-gray-900 uppercase">
                    TECHNICAL DATA SHEET & PRODUCT SPECIFICATION
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Format: PDF Document • Detailed dimension drawing blueprints.</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="py-2.5 px-6 bg-[#005f6d] hover:bg-[#00363f] text-white font-bold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Download PDF Brochure
              </button>
            </div>
          </div>

          {/* Industries Section */}
          <div ref={sectionRefs.industries} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Industries
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.industries.map((ind, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
                  <span className="font-sans text-xs font-bold text-gray-800 uppercase block">{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applications Section */}
          <div ref={sectionRefs.applications} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Applications Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {product.applications.map((app, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-4 flex flex-col justify-between">
                  <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 font-mono text-[9px] uppercase tracking-wider select-none border border-gray-200">
                    Application Layout {idx + 1}
                  </div>
                  <span className="font-sans text-xs font-bold text-gray-700 uppercase leading-snug">{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Options Section */}
          <div ref={sectionRefs.options} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Configurable Product Options
            </h2>
            <p className="text-xs text-gray-500 mb-6 font-semibold">Select your process modifications below to automatically include them in your technical RFQ scoping brief.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.options.map((opt) => {
                const isSelected = !!selectedOptions[opt.name];
                return (
                  <div
                    key={opt.name}
                    onClick={() => handleOptionToggle(opt.name)}
                    className={`p-4 rounded border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#005f6d]/5 border-[#005f6d] shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-sans text-sm font-bold text-gray-900 uppercase">{opt.name}</h4>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-[#005f6d] border-[#005f6d] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specifications Section */}
          <div ref={sectionRefs.specifications} className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
              Specifications
            </h2>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-[15px] font-mono">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-600">Technical Parameter</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-600">Specification Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.specs.map((spec, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-4 px-5 text-gray-500 uppercase font-semibold">{spec.label}</td>
                      <td className="py-4 px-5 font-black text-gray-900 uppercase">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs mt-16 text-left">
          <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onNavigateProduct(prod.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gray-50 hover:bg-white border border-gray-200 hover:border-[#005f6d] rounded p-4 text-left cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-32 bg-white rounded border border-gray-100 flex items-center justify-center p-3 mb-4">
                    <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <h3 className="font-sans text-xs font-black text-gray-900 uppercase mb-1">{prod.name}</h3>
                  <span className="font-mono text-[9px] text-[#005f6d] uppercase font-bold">{prod.category}</span>
                </div>
                <span className="text-[#005f6d] font-sans text-xs font-bold uppercase mt-4 block">View Specifications →</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div id="quote-form-section" className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs mt-16 text-left">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-sans text-[28px] md:text-[32px] font-semibold text-gray-900 uppercase border-b border-gray-200 pb-3 mb-6 text-center">
              Request Technical Quote
            </h2>
            <p className="text-xs text-gray-500 text-center mb-8">
              Submit your project parameters and options below to receive an engineering datasheet proposal response.
            </p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h3 className="font-sans text-base font-bold text-green-800 uppercase">Enquiry Submitted Successfully</h3>
                <p className="text-xs text-green-600 text-center font-semibold">
                  Flow Force engineers will review your selected options ({getSelectedOptionsString() || 'None'}) and contact you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Contact Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-[#005f6d] focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Company *</label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-[#005f6d] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-[#005f6d] focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-[#005f6d] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Product Selected</label>
                  <input
                    type="text"
                    readOnly
                    value={product.name}
                    className="w-full py-2.5 px-3 bg-gray-100 border border-gray-200 rounded text-sm text-gray-500 font-bold uppercase focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Configured Upgrades</label>
                  <textarea
                    readOnly
                    rows="2"
                    value={getSelectedOptionsString() || 'No upgrades selected.'}
                    className="w-full py-2.5 px-3 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 leading-normal focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase font-bold block">Process Details / Application Notes</label>
                  <textarea
                    name="additionalInfo"
                    rows="3"
                    value={formData.additionalInfo}
                    onChange={handleFormChange}
                    placeholder="Enter pressure limits, chemical attributes, operating duty cycles, etc."
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-[#005f6d] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#005f6d] hover:bg-[#00363f] text-white font-bold rounded uppercase text-[15px] tracking-wider transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Engineering RFQ</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
