import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import {
  Sparkles,
  X,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

interface UpdatedProductAlert {
  product: Product;
  updateTag: string;
  updateMessage: string;
  timeAgo: string;
  accentColor: string;
  badgeBg: string;
}

export const NewlyUpdatedPopup: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Pick top newly updated / restocked items
  const updatedItems: UpdatedProductAlert[] = [
    {
      product: PRODUCTS.find((p) => p.id === 'samsung-galaxy-s25-ultra') || PRODUCTS[0],
      updateTag: 'Restock Alert',
      updateMessage: 'Titanium Silverblue & Whitesilver restocked · 18 units remaining',
      timeAgo: '4 mins ago',
      accentColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      product: PRODUCTS.find((p) => p.id === 'xiaomi-14-ultra') || PRODUCTS[1],
      updateTag: 'New Arrival',
      updateMessage: 'Leica 1-inch LYT-900 camera series now dispatching immediately',
      timeAgo: '12 mins ago',
      accentColor: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      product: PRODUCTS.find((p) => p.id === 'apple-iphone-16-pro-max') || PRODUCTS[0],
      updateTag: 'Trending Flagship',
      updateMessage: 'Desert Titanium A18 Pro 256GB batch verified & available',
      timeAgo: '28 mins ago',
      accentColor: 'text-slate-800',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    {
      product: PRODUCTS.find((p) => p.id === 'redmi-note-14-pro-plus') || PRODUCTS[2],
      updateTag: 'Price Drop Update',
      updateMessage: '14% instant promotional discount active on 6200mAh King Kong build',
      timeAgo: '45 mins ago',
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      product: PRODUCTS.find((p) => p.id === 'motorola-razr-50-ultra') || PRODUCTS[3],
      updateTag: 'Newly Updated',
      updateMessage: 'Pantone Peach Fuzz 4.0-inch cover screen edition restocked',
      timeAgo: '1 hour ago',
      accentColor: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Initial popup trigger after brief dwell on site
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  // Automatic cycling of newly updated phones every 11 seconds
  useEffect(() => {
    if (!isVisible || isDismissed || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updatedItems.length);
    }, 11000);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed, isPaused, updatedItems.length]);

  const current = updatedItems[currentIndex];
  const { product } = current;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % updatedItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + updatedItems.length) % updatedItems.length);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
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

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  // If user dismissed, provide a discrete re-open pill in the bottom-left corner
  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-lg border border-slate-200 transition-all cursor-pointer hover:border-blue-300"
        title="View newly updated smartphone launches and restocks"
        aria-label="Open newly updated products popup"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
        </span>
        <Bell className="w-3.5 h-3.5 text-blue-600" />
        <span>Updates ({updatedItems.length})</span>
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Newly updated smartphones notification"
      className="fixed bottom-4 left-4 z-40 max-w-[340px] sm:max-w-[360px] w-full transition-all duration-300 animate-in slide-in-from-bottom-6 fade-in"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        onClick={handleCardClick}
        className="group relative bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 hover:border-blue-400 p-3.5 sm:p-4 text-xs transition-all duration-200 cursor-pointer overflow-hidden"
      >
        {/* Subtle top cycling progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
          <div
            key={currentIndex}
            className={`h-full bg-blue-600 transition-all ${
              isPaused ? 'w-full' : 'w-full animate-[progress_11s_linear]'
            }`}
            style={{
              animation: isPaused ? 'none' : 'marqueeProgress 11s linear infinite',
            }}
          />
        </div>

        {/* Top Header of Popup */}
        <div className="flex items-center justify-between gap-2 mb-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${current.badgeBg}`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>{current.updateTag}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">· {current.timeAgo}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Prev / Next buttons */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              aria-label="Previous update"
              title="Previous update"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentIndex + 1}/{updatedItems.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              aria-label="Next update"
              title="Next update"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="p-1 ml-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Product Row */}
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-tl">
                {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {product.brand}
              </span>
              <span className="font-extrabold text-slate-900 text-xs tabular-nums">
                ${product.price.toLocaleString()}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 truncate text-xs group-hover:text-blue-600 transition-colors">
              {product.name}
            </h4>

            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
              {current.updateMessage}
            </p>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-blue-600 font-bold group-hover:underline flex items-center gap-1">
            <span>View specifications</span>
            <ArrowRight className="w-3 h-3" />
          </span>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
            }`}
          >
            {isAdded ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
            <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
