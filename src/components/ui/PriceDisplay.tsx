import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  discountPercentage,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      price: 'text-sm font-bold',
      original: 'text-xs',
      discount: 'text-xs',
    },
    md: {
      price: 'text-base font-bold',
      original: 'text-xs',
      discount: 'text-xs',
    },
    lg: {
      price: 'text-xl font-bold',
      original: 'text-sm',
      discount: 'text-sm',
    },
    xl: {
      price: 'text-2xl sm:text-3xl font-extrabold',
      original: 'text-base sm:text-lg',
      discount: 'text-sm sm:text-base',
    },
  }[size];

  return (
    <div className={`flex items-baseline flex-wrap gap-2 ${className}`}>
      <span className={`${sizeClasses.price} text-slate-900 tabular-nums`}>
        ${price.toLocaleString()}
      </span>

      {originalPrice && originalPrice > price && (
        <span
          className={`${sizeClasses.original} text-slate-400 line-through tabular-nums font-normal`}
        >
          ${originalPrice.toLocaleString()}
        </span>
      )}

      {discountPercentage && discountPercentage > 0 && (
        <span className={`${sizeClasses.discount} font-semibold text-emerald-600`}>
          {discountPercentage}% off
        </span>
      )}
    </div>
  );
};
