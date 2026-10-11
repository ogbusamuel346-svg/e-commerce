import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { ProductColor } from '../../types/product';

interface VariantSelectorProps {
  colours: ProductColor[];
  selectedColor: ProductColor;
  onSelectColor: (c: ProductColor) => void;
  ramOptions: string[];
  selectedRam: string;
  onSelectRam: (r: string) => void;
  storageOptions: string[];
  selectedStorage: string;
  onSelectStorage: (s: string) => void;
  stockQuantity: number;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  colours,
  selectedColor,
  onSelectColor,
  ramOptions,
  selectedRam,
  onSelectRam,
  storageOptions,
  selectedStorage,
  onSelectStorage,
  stockQuantity,
}) => {
  return (
    <div className="space-y-4 py-3 border-y border-slate-100 text-xs">
      {/* Colour selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Colour:
          </span>
          <span className="font-semibold text-slate-900">{selectedColor.name}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {colours.map((color) => {
            const isSelected = selectedColor.name === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelectColor(color)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-2xs ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                title={color.name}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-2.5 h-2.5 ${
                        color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#f0efe9'
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </span>
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Options */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Internal Storage:
          </span>
          <span className="font-semibold text-slate-900">{selectedStorage}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((storage) => {
            const isSelected = selectedStorage === storage;
            return (
              <button
                key={storage}
                type="button"
                onClick={() => onSelectStorage(storage)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {storage}
              </button>
            );
          })}
        </div>
      </div>

      {/* RAM Options */}
      {ramOptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              RAM:
            </span>
            <span className="font-semibold text-slate-900">{selectedRam}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ramOptions.map((ram) => {
              const isSelected = selectedRam === ram;
              return (
                <button
                  key={ram}
                  type="button"
                  onClick={() => onSelectRam(ram)}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {ram}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      <div className="pt-1 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            stockQuantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />
        <span className="text-xs font-semibold text-slate-700">
          {stockQuantity > 10 ? (
            <span className="text-emerald-700">In Stock ({stockQuantity} units available)</span>
          ) : stockQuantity > 0 ? (
            <span className="text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Only {stockQuantity} units remaining in stock!
            </span>
          ) : (
            <span className="text-rose-600">Currently Out of Stock</span>
          )}
        </span>
      </div>
    </div>
  );
};
