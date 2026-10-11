import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { RatingStars } from '../components/ui/RatingStars';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save smartphones you have your eye on by clicking the heart icon on any product."
          actionText="Discover Smartphones"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'My Wishlist' }]} />

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have saved <strong className="text-slate-800">{wishlistCount}</strong> smartphones
          </p>
        </div>

        <button
          onClick={clearWishlist}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Wishlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between relative"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-3 right-3 p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Remove from wishlist"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div>
              {/* Image */}
              <Link
                to={`/products/${product.slug}`}
                className="block h-44 w-full bg-slate-50/60 rounded-lg p-3 mb-3 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {product.brand}
              </span>
              <Link
                to={`/products/${product.slug}`}
                className="block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1.5"
              >
                {product.name}
              </Link>

              <div className="mb-2">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              </div>

              <div className="mb-4">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discountPercentage={product.discountPercentage}
                  size="md"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  addToCart(
                    product,
                    product.availableColours[0],
                    product.storageOptions[0],
                    product.ramOptions[0],
                    1
                  );
                }}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
              <Link
                to={`/products/${product.slug}`}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
