import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types/product';

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  recommended: 'Recommended',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'rating-desc': 'Highest Rated',
  newest: 'Newest Arrivals',
  'discount-desc': 'Highest Discount',
};

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs text-slate-500 font-medium">Sort By:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          aria-label="Sort products"
        >
          {Object.entries(SORT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
