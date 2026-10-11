import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export const CompareFloatingBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, setIsCompareModalOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 shrink-0">
          <Scale className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Compare</span>
          <span>({compareList.length}/4)</span>
        </div>

        <div className="flex items-center gap-2">
          {compareList.map((product) => (
            <div
              key={product.id}
              className="relative flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-contain"
              />
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[80px] sm:max-w-[120px]">
                {product.name}
              </span>
              <button
                type="button"
                onClick={() => removeFromCompare(product.id)}
                className="p-0.5 text-slate-400 hover:text-rose-600 rounded"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={clearCompare}
          className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => setIsCompareModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
