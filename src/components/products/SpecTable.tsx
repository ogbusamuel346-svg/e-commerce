import React from 'react';
import { Product } from '../../types/product';
import { Cpu, Smartphone, Camera, Battery, Wifi, Shield, Sliders } from 'lucide-react';

interface SpecTableProps {
  product: Product;
}

export const SpecTable: React.FC<SpecTableProps> = ({ product }) => {
  const specs = product.specifications;

  const specCategories = [
    {
      category: 'Display & Design',
      icon: <Smartphone className="w-4 h-4 text-blue-600" />,
      items: [
        { label: 'Display Features', value: specs.display },
        { label: 'Screen Size', value: product.screenSize },
        { label: 'Weight', value: specs.weight },
      ],
    },
    {
      category: 'Processor & System',
      icon: <Cpu className="w-4 h-4 text-blue-600" />,
      items: [
        { label: 'Processor (SoC)', value: specs.processor },
        { label: 'Operating System', value: specs.os },
        { label: 'RAM Configurations', value: product.ramOptions.join(', ') },
        { label: 'Internal Storage', value: product.storageOptions.join(', ') },
      ],
    },
    {
      category: 'Camera System',
      icon: <Camera className="w-4 h-4 text-blue-600" />,
      items: [
        { label: 'Rear Camera Array', value: specs.rearCamera },
        { label: 'Front / Selfie Camera', value: specs.frontCamera },
        { label: 'Camera Highlights', value: product.cameraSpecification },
      ],
    },
    {
      category: 'Battery & Power',
      icon: <Battery className="w-4 h-4 text-blue-600" />,
      items: [
        { label: 'Battery Capacity', value: specs.battery },
        { label: 'Charging Speed', value: specs.charging },
      ],
    },
    {
      category: 'Connectivity & Network',
      icon: <Wifi className="w-4 h-4 text-blue-600" />,
      items: [
        { label: 'Network Support', value: specs.network },
        { label: 'SIM Card Slot', value: specs.sim },
      ],
    },
    {
      category: 'Warranty & Support',
      icon: <Shield className="w-4 h-4 text-blue-600" />,
      items: [
        { label: 'Warranty Summary', value: specs.warranty },
        { label: 'Replacement Policy', value: '7-Day Return & Replacement for hardware defects' },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Detailed Technical Specifications</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Model: {product.name}</span>
      </div>

      {specCategories.map((cat, idx) => (
        <div key={idx} className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3 font-bold text-slate-800 text-sm">
            {cat.icon}
            <span>{cat.category}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {cat.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between py-1.5 border-b border-slate-50 sm:border-0"
              >
                <span className="text-slate-500 text-xs sm:w-2/5 shrink-0">{item.label}</span>
                <span className="text-slate-900 font-semibold text-xs sm:text-sm sm:w-3/5 break-words">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
