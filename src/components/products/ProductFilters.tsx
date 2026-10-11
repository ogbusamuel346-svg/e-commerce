import React from 'react';
import { RotateCcw, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { BrandName, FilterState } from '../../types/product';
import { BRANDS_DATA } from '../../data/brands';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onClearAll: () => void;
  totalMatches: number;
}

const RAM_OPTIONS = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
const STORAGE_OPTIONS = ['128 GB', '256 GB', '512 GB', '1 TB'];
const OS_OPTIONS = ['iOS 18', 'Android 15', 'Android 14', 'Android 13'];
const RATING_OPTIONS = [
  { label: '4.5★ & above', value: 4.5 },
  { label: '4.0★ & above', value: 4.0 },
  { label: '3.5★ & above', value: 3.5 },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onClearAll,
  totalMatches,
}) => {
  const toggleBrand = (brand: BrandName) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ brands: nextBrands });
  };

  const toggleRam = (ramVal: string) => {
    const nextRam = filters.ram.includes(ramVal)
      ? filters.ram.filter((r) => r !== ramVal)
      : [...filters.ram, ramVal];
    onChange({ ram: nextRam });
  };

  const toggleStorage = (storageVal: string) => {
    const nextStorage = filters.storage.includes(storageVal)
      ? filters.storage.filter((s) => s !== storageVal)
      : [...filters.storage, storageVal];
    onChange({ storage: nextStorage });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.ram.length > 0 ||
    filters.storage.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2500 ||
    filters.minRating > 0 ||
    filters.minDiscount > 0 ||
    filters.inStockOnly ||
    filters.searchQuery !== '';

  return (
    <aside className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 p-4 text-xs">
      {/* Header with Title and Clear Action */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Filters</h3>
          <p className="text-[11px] text-slate-500">{totalMatches} phones found</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="py-3">
        <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS_DATA.map((brand) => {
            const checked = filters.brands.includes(brand.name);
            return (
              <label
                key={brand.name}
                className="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brand.name)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{brand.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">({brand.phoneCount})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="py-3">
        <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">
          Price Range
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Min ($)</label>
            <input
              type="number"
              min="0"
              max="2500"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ minPrice: Number(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Max ($)</label>
            <input
              type="number"
              min="0"
              max="2500"
              value={filters.maxPrice === 2500 ? '' : filters.maxPrice}
              onChange={(e) =>
                onChange({ maxPrice: e.target.value ? Number(e.target.value) : 2500 })
              }
              placeholder="2500"
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            onClick={() => onChange({ minPrice: 0, maxPrice: 300 })}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-medium text-slate-700 cursor-pointer"
          >
            Under $300
          </button>
          <button
            onClick={() => onChange({ minPrice: 300, maxPrice: 700 })}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-medium text-slate-700 cursor-pointer"
          >
            $300 - $700
          </button>
          <button
            onClick={() => onChange({ minPrice: 700, maxPrice: 2500 })}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-medium text-slate-700 cursor-pointer"
          >
            $700+
          </button>
        </div>
      </div>

      {/* RAM Filter */}
      <div className="py-3">
        <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">
          RAM
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {RAM_OPTIONS.map((ramVal) => {
            const isSelected = filters.ram.includes(ramVal);
            return (
              <label
                key={ramVal}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRam(ramVal)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{ramVal}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="py-3">
        <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">
          Internal Storage
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {STORAGE_OPTIONS.map((storageVal) => {
            const isSelected = filters.storage.includes(storageVal);
            return (
              <label
                key={storageVal}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleStorage(storageVal)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{storageVal}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Customer Rating */}
      <div className="py-3">
        <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((rate) => (
            <label
              key={rate.value}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none"
            >
              <input
                type="radio"
                name="rating_filter"
                checked={filters.minRating === rate.value}
                onChange={() => onChange({ minRating: rate.value })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span>{rate.label}</span>
            </label>
          ))}
          {filters.minRating > 0 && (
            <button
              onClick={() => onChange({ minRating: 0 })}
              className="text-[10px] text-blue-600 hover:underline pt-1 block cursor-pointer"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="py-3">
        <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">
          Special Discounts
        </h4>
        <div className="space-y-1.5">
          {[10, 15].map((disc) => (
            <label
              key={disc}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none"
            >
              <input
                type="radio"
                name="discount_filter"
                checked={filters.minDiscount === disc}
                onChange={() => onChange({ minDiscount: disc })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span>{disc}% or more off</span>
            </label>
          ))}
          {filters.minDiscount > 0 && (
            <button
              onClick={() => onChange({ minDiscount: 0 })}
              className="text-[10px] text-blue-600 hover:underline pt-1 block cursor-pointer"
            >
              Clear discount filter
            </button>
          )}
        </div>
      </div>

      {/* Stock availability */}
      <div className="py-3">
        <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Exclude Out of Stock</span>
        </label>
      </div>
    </aside>
  );
};
