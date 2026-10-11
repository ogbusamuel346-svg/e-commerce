import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStoreManage } from '../context/StoreManageContext';
import { Product, ProductColor } from '../types/product';
import { ProductGallery } from '../components/products/ProductGallery';
import { VariantSelector } from '../components/products/VariantSelector';
import { SpecTable } from '../components/products/SpecTable';
import { ReviewSection } from '../components/products/ReviewSection';
import { ProductCard } from '../components/products/ProductCard';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { RatingStars } from '../components/ui/RatingStars';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  Zap,
  Heart,
  Scale,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products } = useStoreManage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const { showToast } = useToast();

  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [slug, products]);

  // Selected variant state
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.availableColours[0] || { name: 'Default', hex: '#000' }
  );
  const [selectedStorage, setSelectedStorage] = useState<string>(
    product?.storageOptions[0] || '128 GB'
  );
  const [selectedRam, setSelectedRam] = useState<string>(
    product?.ramOptions[0] || '8 GB'
  );
  const [quantity, setQuantity] = useState(1);

  // Delivery check state (interactive simulation)
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.availableColours[0]);
      setSelectedStorage(product.storageOptions[0]);
      setSelectedRam(product.ramOptions[0]);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Smartphone Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The requested phone URL does not correspond to any active model in our inventory.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <span>Browse All Smartphones</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedStorage, selectedRam, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedStorage, selectedRam, quantity);
    navigate('/checkout');
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 4) {
      showToast('Please enter a valid 5-6 digit postal code', 'warning');
      return;
    }
    const days = 2 + (pincode.charCodeAt(0) % 2);
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    setDeliveryEstimate(`Express Delivery by ${dateStr} · Free with NovaMobile Prime`);
    showToast(`Delivery available for ${pincode}`, 'success');
  };

  // Related products from same brand or category
  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category)
  ).slice(0, 4);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Smartphones', path: '/products' },
          { label: product.brand, path: `/products?brand=${product.brand}` },
          { label: product.name },
        ]}
      />

      {/* Main PDP Grid: Gallery on left, Purchase Module on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 sticky top-24">
          <ProductGallery images={product.images} productName={product.name} />

          {/* Quick trust badges under gallery on desktop */}
          <div className="hidden sm:grid grid-cols-3 gap-4 mt-6 p-4 bg-white rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>7 Days Free Replacement</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Free Delivery Eligible</span>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Link
                to={`/products?brand=${product.brand}`}
                className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline"
              >
                {product.brand} Official Store
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addToCompare(product)}
                  className={`p-2 rounded-lg border transition-colors ${
                    inCompare
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title={inCompare ? 'In Comparison' : 'Compare'}
                >
                  <Scale className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-rose-500'
                  }`}
                  title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                {product.reviewCount.toLocaleString()} Verified Ratings
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercentage={product.discountPercentage}
              size="xl"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Inclusive of all taxes · No cost EMI available starting at $
              {Math.round(product.price / 12)}/month
            </p>
          </div>

          {/* Tagline / Pitch */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-l-2 border-blue-500 pl-3 italic">
            &quot;{product.tagline}&quot;
          </p>

          {/* Variant Selector */}
          <VariantSelector
            colours={product.availableColours}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            ramOptions={product.ramOptions}
            selectedRam={selectedRam}
            onSelectRam={setSelectedRam}
            storageOptions={product.storageOptions}
            selectedStorage={selectedStorage}
            onSelectStorage={setSelectedStorage}
            stockQuantity={product.stockQuantity}
          />

          {/* Delivery Estimator */}
          <div className="pt-2">
            <span className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Check Delivery Availability</span>
            </span>
            <form onSubmit={handleCheckDelivery} className="flex gap-2 text-xs">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 5 or 6-digit postal code"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Check
              </button>
            </form>
            {deliveryEstimate && (
              <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{deliveryEstimate}</span>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-800 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md shadow-orange-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <SpecTable product={product} />

      {/* Customer Reviews Section */}
      <ReviewSection
        reviews={product.reviews}
        overallRating={product.rating}
        reviewCount={product.reviewCount}
        productName={product.name}
      />

      {/* Related Smartphones */}
      {relatedProducts.length > 0 && (
        <section className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Similar Smartphones You Might Like
            </h3>
            <Link
              to={`/products?brand=${product.brand}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              More from {product.brand}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
