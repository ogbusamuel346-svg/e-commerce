import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types/product';
import { Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import { PriceDisplay } from '../ui/PriceDisplay';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const maxStock = item.product.stockQuantity || 10;
  const isMaxReached = item.quantity >= maxStock;

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 last:border-0">
      {/* Product info with image */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Link
          to={`/products/${item.product.slug}`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden hover:opacity-90"
        >
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {item.product.brand}
          </span>
          <Link
            to={`/products/${item.product.slug}`}
            className="block text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors truncate"
          >
            {item.product.name}
          </Link>

          {/* Variant specs */}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span
                className="w-3 h-3 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: item.selectedColor.hex }}
              />
              {item.selectedColor.name}
            </span>
            <span>·</span>
            <span>{item.selectedStorage}</span>
            <span>·</span>
            <span>{item.selectedRam} RAM</span>
          </div>

          <div className="mt-2 sm:hidden">
            <PriceDisplay price={item.unitPrice * item.quantity} size="sm" />
          </div>
        </div>
      </div>

      {/* Quantity Stepper & Price & Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Stepper */}
        <div className="flex flex-col items-center">
          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-800 tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isMaxReached}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {isMaxReached && (
            <span className="text-[10px] text-amber-600 mt-1 font-medium flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" /> Max stock
            </span>
          )}
        </div>

        {/* Item Total Price */}
        <div className="hidden sm:block text-right min-w-[90px]">
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            ${(item.unitPrice * item.quantity).toLocaleString()}
          </span>
          {item.quantity > 1 && (
            <div className="text-[10px] text-slate-400">
              ${item.unitPrice.toLocaleString()} each
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
