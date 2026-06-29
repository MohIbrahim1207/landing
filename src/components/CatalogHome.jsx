import React from 'react';
import { PRODUCTS } from '../data/products';
import { FileText, Eye } from 'lucide-react';

export default function CatalogHome({ onViewProduct }) {
  const handleDownload = (e, brochurePath, productName) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Downloading brochure for ${productName}: ${brochurePath}`);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#1a2123] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header section with brief catalog title */}
        <div className="border-b border-gray-200 pb-6 mb-12 text-left">
          <span className="font-mono text-xs tracking-wider text-gray-500 uppercase block mb-1">
            B2B INDUSTRIAL CATALOG
          </span>
          <h1 className="font-sans text-3xl font-black text-gray-900 tracking-tight">
            FLOW FORCE EQUIPMENT PORTFOLIO
          </h1>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden h-full"
            >
              {/* Product Image Panel */}
              <div className="bg-gray-50 h-56 w-full flex items-center justify-center p-6 border-b border-gray-100 select-none">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Product Info Block */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h2 className="font-sans text-lg font-black text-gray-900 tracking-tight uppercase mb-4">
                    {prod.name}
                  </h2>
                  <ul className="space-y-2 mb-6">
                    {prod.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 leading-normal">
                        <span className="text-[#005f6d] font-bold mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => onViewProduct(prod.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#005f6d] hover:bg-[#00363f] text-white font-bold rounded text-sm transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Product</span>
                  </button>
                  <button
                    onClick={(e) => handleDownload(e, prod.brochure, prod.name)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded text-sm transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Brochure</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
