import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { FilterState } from '../../types/product';
import { ProductFilters } from './ProductFilters';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onClearAll: () => void;
  totalMatches: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onClearAll,
  totalMatches,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Filters &amp; Refinements</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ProductFilters
            filters={filters}
            onChange={onChange}
            onClearAll={onClearAll}
            totalMatches={totalMatches}
          />
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <button
            onClick={onClearAll}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply ({totalMatches})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
