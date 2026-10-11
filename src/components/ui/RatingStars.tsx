import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  showBadge?: boolean;
  size?: 'sm' | 'md';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  showBadge = true,
  size = 'sm',
}) => {
  const getBadgeColor = (val: number) => {
    if (val >= 4.5) return 'bg-emerald-600 text-white';
    if (val >= 4.0) return 'bg-emerald-500 text-white';
    if (val >= 3.5) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="inline-flex items-center gap-1.5 text-xs">
      {showBadge ? (
        <span
          className={`inline-flex items-center gap-0.5 font-bold rounded px-1.5 py-0.5 text-[11px] leading-tight ${getBadgeColor(
            rating
          )}`}
        >
          <span>{rating.toFixed(1)}</span>
          <Star className="w-2.5 h-2.5 fill-current" />
        </span>
      ) : (
        <div className="flex items-center text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= Math.round(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
        </div>
      )}

      {reviewCount !== undefined && (
        <span className="text-slate-500 text-xs tabular-nums font-normal">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
