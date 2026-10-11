import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-48 bg-slate-100 rounded-lg mb-4" />
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-5 bg-slate-200 rounded w-4/5 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-12 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded" />
        </div>
      </div>
      <div>
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-3" />
        <div className="h-9 bg-slate-200 rounded-lg w-full" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};
