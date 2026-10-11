import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Scale, Check, Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { PriceDisplay } from '../ui/PriceDisplay';
import { RatingStars } from '../ui/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      product,
      product.availableColours[0],
      product.storageOptions[0],
      product.ramOptions[0],
      1
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 relative">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-44 bg-slate-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-3">
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-2 text-center rounded">
              <span className="text-xs font-semibold text-slate-600">{product.brand}</span>
              <span className="text-[11px] truncate">{product.name}</span>
            </div>
          )}

          {/* Quick Badges */}
          {product.bestSeller && (
            <span className="absolute top-2 left-2 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              Best Seller
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleCompare}
                  aria-label="Compare phone"
                  className={`p-1.5 rounded-md transition-colors ${
                    inCompare
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title={inCompare ? 'Remove from compare' : 'Add to compare'}
                >
                  <Scale className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleWishlist}
                  aria-label="Toggle wishlist"
                  className={`p-1.5 rounded-md transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-500'
                      : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                  }`}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <Link
              to={`/products/${product.slug}`}
              className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1"
            >
              {product.name}
            </Link>

            <div className="mb-2">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* Spec highlights */}
            <div className="text-xs text-slate-500 space-y-0.5 mb-3">
              <p>· {product.ramOptions.join('/')} RAM · {product.storageOptions.join('/')} ROM</p>
              <p>· {product.screenSize} Display · {product.cameraSpecification}</p>
              <p>· {product.batteryCapacity} Battery · {product.processor}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercentage={product.discountPercentage}
              size="md"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
              </button>
              <Link
                to={`/products/${product.slug}`}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between relative">
      {/* Top badges & action buttons */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div>
          {product.bestSeller ? (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded shadow-2xs">
              Best Seller
            </span>
          ) : product.featured ? (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shadow-2xs">
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={handleToggleCompare}
            aria-label="Compare phone"
            className={`p-1.5 rounded-md transition-colors ${
              inCompare
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-400 hover:text-slate-700 shadow-2xs border border-slate-200'
            }`}
            title={inCompare ? 'In comparison' : 'Compare'}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
            className={`p-1.5 rounded-md transition-colors ${
              inWishlist
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-slate-400 hover:text-rose-500 shadow-2xs border border-slate-200'
            }`}
            title={inWishlist ? 'In wishlist' : 'Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative w-full h-44 sm:h-48 bg-slate-50/50 rounded-lg overflow-hidden p-3 mb-3 cursor-pointer"
      >
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-2 text-center rounded">
            <span className="text-xs font-semibold text-slate-600">{product.brand}</span>
            <span className="text-[11px] truncate">{product.name}</span>
          </div>
        )}
      </Link>

      {/* Info details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
            <span>{product.brand}</span>
            <span className="font-normal lowercase text-slate-400">
              {product.storageOptions[0]}
            </span>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          <div className="mb-2">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          {/* Key spec row */}
          <div className="text-[11px] text-slate-500 line-clamp-1 mb-3">
            {product.screenSize} · {product.cameraSpecification.split('+')[0]} · {product.batteryCapacity}
          </div>
        </div>

        {/* Pricing and Action */}
        <div>
          <div className="mb-3">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercentage={product.discountPercentage}
              size="md"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              className={`w-full py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
            </button>
            <Link
              to={`/products/${product.slug}`}
              className="w-full py-2 px-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors flex items-center justify-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
