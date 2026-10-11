import React, { useState } from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { Smartphone } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  onResetFilters?: () => void;
  pageSize?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode = 'grid',
  onResetFilters,
  pageSize = 12,
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Smartphone}
        title="No smartphones match your filters"
        description="Try adjusting your brand, price range, RAM, or storage selections to find matching models."
        actionText="Clear All Filters"
        onActionClick={onResetFilters}
      />
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="list" />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-4 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{visibleProducts.length}</strong> of{' '}
            <strong className="text-slate-800">{products.length}</strong> smartphones
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + pageSize)}
            className="px-6 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
          >
            Load More Smartphones
          </button>
        </div>
      )}
    </div>
  );
};
