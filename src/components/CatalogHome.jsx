import React from 'react';
import { PRODUCTS } from '../data/products';
import { FileText, Eye } from 'lucide-react';

export default function CatalogHome({ onViewProduct }) {
  const handleDownload = (e, brochurePath, productName) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Downloading brochure for ${productName}: ${brochurePath}`);
  };

  const singleProduct = PRODUCTS[0];

  if (!singleProduct) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#1a2123] py-20 px-6 md:px-12 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-8 mb-16 text-center">
          <span className="font-mono text-xs tracking-wider text-gray-500 uppercase block mb-2 font-bold">
            B2B INDUSTRIAL CATALOG
          </span>
          <h1 className="font-sans text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight leading-tight uppercase">
            FLOW FORCE EQUIPMENT PORTFOLIO
          </h1>
        </div>

        {/* Centered Single Product Card */}
        <div className="flex justify-center">
          <div
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden max-w-lg w-full text-left"
          >
            {/* Centered Product Image Panel */}
            <div className="bg-gray-50 h-72 w-full flex items-center justify-center p-8 border-b border-gray-100 select-none">
              <img
                src={singleProduct.image}
                alt={singleProduct.name}
                className="max-h-full max-w-full object-contain mx-auto"
                loading="lazy"
              />
            </div>

            {/* Product Info Block */}
            <div className="p-8 flex flex-col flex-grow justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] text-[#005f6d] tracking-widest uppercase font-bold block mb-2">
                  Featured Equipment
                </span>
                <h2 className="font-sans text-[22px] font-bold text-gray-900 tracking-tight uppercase mb-4 leading-snug">
                  {singleProduct.name}
                </h2>
                <ul className="space-y-3 mb-6">
                  {singleProduct.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[15px] text-gray-600 leading-[1.6]">
                      <span className="text-[#005f6d] font-bold mt-1 text-xs">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Panel */}
              <div className="flex flex-col gap-3 pt-6 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => onViewProduct(singleProduct.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#005f6d] hover:bg-[#00363f] text-white font-bold rounded text-[15px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Product</span>
                </button>
                <button
                  onClick={(e) => handleDownload(e, singleProduct.brochure, singleProduct.name)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded text-[15px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Brochure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
