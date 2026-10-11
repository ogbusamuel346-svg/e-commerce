import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleError = (idx: number) => {
    setImageErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const activeImage = images[selectedIndex] || images[0];
  const isCurrentError = imageErrors[selectedIndex];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar pb-1 md:pb-0 shrink-0">
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            const hasError = imageErrors[idx];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1.5 bg-slate-50 border-2 transition-all shrink-0 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                {!hasError ? (
                  <img
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={() => handleError(idx)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Smartphone className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Display */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center relative min-h-[340px] sm:min-h-[420px]">
        {!isCurrentError ? (
          <img
            src={activeImage}
            alt={productName}
            referrerPolicy="no-referrer"
            onError={() => handleError(selectedIndex)}
            className="max-h-[380px] max-w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-6">
            <Smartphone className="w-16 h-16 text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-600">{productName}</p>
            <p className="text-[11px] text-slate-400">Official Product Showcase</p>
          </div>
        )}
      </div>
    </div>
  );
};
