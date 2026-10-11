import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ShieldCheck, ArrowRight, X, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ showCheckoutButton = true }) => {
  const {
    itemCount,
    subtotal,
    discountTotal,
    shippingFee,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponCode('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
      <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
        Order Summary ({itemCount} {itemCount === 1 ? 'phone' : 'phones'})
      </h3>

      {/* Coupon input */}
      {!appliedCoupon ? (
        <form onSubmit={handleApply} className="flex gap-2 text-xs">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Promo code (e.g. NOVA10)"
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Apply
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
          <div>
            <div className="font-bold text-emerald-800">{appliedCoupon.code} Applied</div>
            <div className="text-[11px] text-emerald-600">{appliedCoupon.description}</div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="p-1 text-emerald-700 hover:text-emerald-900 rounded"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="space-y-2.5 text-xs sm:text-sm border-t border-slate-100 pt-3">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            ${subtotal.toLocaleString()}
          </span>
        </div>

        {discountTotal > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Coupon Discount</span>
            <span className="tabular-nums">-${discountTotal.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span className="flex items-center gap-1">
            <span>Delivery Fee</span>
            {subtotal > 150 && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                FREE
              </span>
            )}
          </span>
          <span className="font-semibold text-slate-900 tabular-nums">
            {shippingFee === 0 ? 'Free' : `$${shippingFee}`}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between text-sm sm:text-base font-extrabold text-slate-900">
          <span>Total Amount</span>
          <span className="tabular-nums text-blue-700 text-lg">
            ${finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-center"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {/* Trust guarantees */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>100% Secure Checkout Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Fast Doorstep Delivery with live dispatch updates</span>
        </div>
      </div>
    </div>
  );
};
