import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStoreManage } from '../context/StoreManageContext';
import { BrandName, FilterState, Product, SortOption } from '../types/product';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { MobileFilterDrawer } from '../components/products/MobileFilterDrawer';
import { SortDropdown } from '../components/products/SortDropdown';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  brands: [],
  minPrice: 0,
  maxPrice: 2500,
  ram: [],
  storage: [],
  operatingSystem: [],
  screenSize: [],
  minRating: 0,
  minDiscount: 0,
  inStockOnly: false,
  category: '',
  sortBy: 'recommended',
};

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useStoreManage();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse filters from URL search params
  const currentFilters: FilterState = useMemo(() => {
    const brandsParam = searchParams.get('brand');
    const brands = brandsParam ? (brandsParam.split(',') as BrandName[]) : [];

    const ramParam = searchParams.get('ram');
    const ram = ramParam ? ramParam.split(',') : [];

    const storageParam = searchParams.get('storage');
    const storage = storageParam ? storageParam.split(',') : [];

    return {
      searchQuery: searchParams.get('search') || '',
      brands,
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 2500,
      ram,
      storage,
      operatingSystem: searchParams.get('os') ? searchParams.get('os')!.split(',') : [],
      screenSize: searchParams.get('screen') ? searchParams.get('screen')!.split(',') : [],
      minRating: Number(searchParams.get('minRating')) || 0,
      minDiscount: Number(searchParams.get('minDiscount')) || 0,
      inStockOnly: searchParams.get('inStock') === 'true',
      category: searchParams.get('category') || '',
      sortBy: (searchParams.get('sortBy') as SortOption) || 'recommended',
    };
  }, [searchParams]);

  // Sync state changes back to URL search params
  const updateFilters = (updated: Partial<FilterState>) => {
    const merged = { ...currentFilters, ...updated };
    const nextParams = new URLSearchParams();

    if (merged.searchQuery) nextParams.set('search', merged.searchQuery);
    if (merged.brands.length > 0) nextParams.set('brand', merged.brands.join(','));
    if (merged.minPrice > 0) nextParams.set('minPrice', merged.minPrice.toString());
    if (merged.maxPrice < 2500) nextParams.set('maxPrice', merged.maxPrice.toString());
    if (merged.ram.length > 0) nextParams.set('ram', merged.ram.join(','));
    if (merged.storage.length > 0) nextParams.set('storage', merged.storage.join(','));
    if (merged.minRating > 0) nextParams.set('minRating', merged.minRating.toString());
    if (merged.minDiscount > 0) nextParams.set('minDiscount', merged.minDiscount.toString());
    if (merged.inStockOnly) nextParams.set('inStock', 'true');
    if (merged.category) nextParams.set('category', merged.category);
    if (merged.sortBy !== 'recommended') nextParams.set('sortBy', merged.sortBy);

    setSearchParams(nextParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.processor.toLowerCase().includes(q) ||
          p.cameraSpecification.toLowerCase().includes(q) ||
          p.operatingSystem.toLowerCase().includes(q)
      );
    }

    // Brands
    if (currentFilters.brands.length > 0) {
      result = result.filter((p) => currentFilters.brands.includes(p.brand));
    }

    // Category
    if (currentFilters.category) {
      result = result.filter((p) => p.category === currentFilters.category);
    }

    // Price range
    result = result.filter(
      (p) => p.price >= currentFilters.minPrice && p.price <= currentFilters.maxPrice
    );

    // RAM
    if (currentFilters.ram.length > 0) {
      result = result.filter((p) =>
        p.ramOptions.some((r) => currentFilters.ram.includes(r))
      );
    }

    // Storage
    if (currentFilters.storage.length > 0) {
      result = result.filter((p) =>
        p.storageOptions.some((s) => currentFilters.storage.includes(s))
      );
    }

    // Rating
    if (currentFilters.minRating > 0) {
      result = result.filter((p) => p.rating >= currentFilters.minRating);
    }

    // Discount
    if (currentFilters.minDiscount > 0) {
      result = result.filter((p) => p.discountPercentage >= currentFilters.minDiscount);
    }

    // Stock
    if (currentFilters.inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // Sorting
    switch (currentFilters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount-desc':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'recommended':
      default:
        // Featured and Bestsellers first
        result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [currentFilters]);

  // Title calculation
  const pageTitle = currentFilters.brands.length === 1
    ? `${currentFilters.brands[0]} Smartphones`
    : currentFilters.category
    ? `${currentFilters.category.charAt(0).toUpperCase() + currentFilters.category.slice(1)} Smartphones`
    : currentFilters.searchQuery
    ? `Search results for "${currentFilters.searchQuery}"`
    : 'All Smartphones';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Smartphones', path: '/products' },
          ...(currentFilters.brands.length === 1
            ? [{ label: currentFilters.brands[0] }]
            : currentFilters.category
            ? [{ label: currentFilters.category }]
            : []),
        ]}
      />

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> matching devices
          </p>
        </div>

        {/* Controls: Sort & Mobile filter trigger & View mode */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Mobile filter button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
            {currentFilters.brands.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {currentFilters.brands.length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <SortDropdown
            value={currentFilters.sortBy}
            onChange={(sort) => updateFilters({ sortBy: sort })}
          />

          {/* Grid vs List view switcher */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(currentFilters.brands.length > 0 ||
        currentFilters.ram.length > 0 ||
        currentFilters.storage.length > 0 ||
        currentFilters.minRating > 0 ||
        currentFilters.minDiscount > 0 ||
        currentFilters.searchQuery ||
        currentFilters.inStockOnly) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Applied:</span>

          {currentFilters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium">
              &quot;{currentFilters.searchQuery}&quot;
              <button
                onClick={() => updateFilters({ searchQuery: '' })}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentFilters.brands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md font-medium"
            >
              {b}
              <button
                onClick={() =>
                  updateFilters({
                    brands: currentFilters.brands.filter((item) => item !== b),
                  })
                }
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {currentFilters.ram.map((r) => (
            <span
              key={r}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium"
            >
              {r} RAM
              <button
                onClick={() =>
                  updateFilters({
                    ram: currentFilters.ram.filter((item) => item !== r),
                  })
                }
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {currentFilters.storage.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium"
            >
              {s} ROM
              <button
                onClick={() =>
                  updateFilters({
                    storage: currentFilters.storage.filter((item) => item !== s),
                  })
                }
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {currentFilters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-medium">
              {currentFilters.minRating}★ &amp; above
              <button
                onClick={() => updateFilters({ minRating: 0 })}
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start pt-2">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            filters={currentFilters}
            onChange={updateFilters}
            onClearAll={clearAllFilters}
            totalMatches={filteredProducts.length}
          />
        </div>

        {/* Product Grid / List */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            viewMode={viewMode}
            onResetFilters={clearAllFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={currentFilters}
        onChange={updateFilters}
        onClearAll={clearAllFilters}
        totalMatches={filteredProducts.length}
      />
    </div>
  );
};
