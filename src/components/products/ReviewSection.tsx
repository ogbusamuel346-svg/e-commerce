import React, { useState } from 'react';
import { Review } from '../../types/product';
import { RatingStars } from '../ui/RatingStars';
import { ThumbsUp, CheckCircle2, MessageSquarePlus, Star } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';

interface ReviewSectionProps {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
  productName: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews: initialReviews,
  overallRating,
  reviewCount,
  productName,
}) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const { showToast } = useToast();

  const handleHelpful = (reviewId: string) => {
    if (helpfulMap[reviewId]) {
      showToast('You already voted helpful on this review', 'info');
      return;
    }

    setHelpfulMap((prev) => ({ ...prev, [reviewId]: true }));
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Marked review as helpful', 'success');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim() || !userName.trim()) {
      showToast('Please complete all review fields', 'warning');
      return;
    }

    const newRev: Review = {
      id: `rev-custom-${Date.now()}`,
      userName: userName.trim(),
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim(),
      comment: newComment.trim(),
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsWriteModalOpen(false);
    setNewTitle('');
    setNewComment('');
    setUserName('');
    showToast('Your verified review was published!', 'success');
  };

  // Mock breakdown calculation
  const total5 = Math.round(reviewCount * 0.72);
  const total4 = Math.round(reviewCount * 0.18);
  const total3 = Math.round(reviewCount * 0.06);
  const total2 = Math.round(reviewCount * 0.02);
  const total1 = Math.round(reviewCount * 0.02);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Ratings &amp; Customer Reviews</h3>
          <p className="text-xs text-slate-500">
            Real feedback from verified purchasers of {productName}
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Score Summary & Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 p-5 rounded-xl border border-slate-100">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
            {overallRating.toFixed(1)}
          </div>
          <div className="my-1.5">
            <RatingStars rating={overallRating} showBadge={false} size="md" />
          </div>
          <div className="text-xs text-slate-500">
            Based on {reviewCount.toLocaleString()} verified ratings
          </div>
        </div>

        <div className="md:col-span-2 space-y-2 text-xs">
          {[
            { star: 5, count: total5, pct: 72 },
            { star: 4, count: total4, pct: 18 },
            { star: 3, count: total3, pct: 6 },
            { star: 2, count: total2, pct: 2 },
            { star: 1, count: total1, pct: 2 },
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-3">
              <span className="w-7 text-right font-semibold text-slate-700 flex items-center justify-end gap-0.5">
                {bar.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-12 text-slate-400 text-[11px] tabular-nums text-right">
                {bar.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review items */}
      <div className="space-y-4 divide-y divide-slate-100">
        {reviewsList.map((review) => (
          <div key={review.id} className="pt-4 first:pt-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{review.userName}</span>
                {review.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">{review.date}</span>
            </div>

            <div className="mb-2">
              <RatingStars rating={review.rating} />
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{review.title}</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              {review.comment}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => handleHelpful(review.id)}
                className={`flex items-center gap-1 text-xs hover:text-slate-700 transition-colors cursor-pointer ${
                  helpfulMap[review.id] ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({review.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write review modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Write a Customer Review"
        maxWidth="md"
      >
        <form onSubmit={handleAddReview} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Rachel Adams"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                    newRating >= star
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Review Headline</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Exceptional camera quality and battery"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Detailed Feedback</label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell other shoppers what you loved about the display, performance, or battery..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-xs"
            >
              Post Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
