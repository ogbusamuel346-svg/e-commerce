import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Explore the latest smartphones from Apple, Samsung, Xiaomi, and more to add devices to your cart."
          actionText="Shop Smartphones"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <strong className="text-slate-800">{itemCount}</strong> items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          {/* Continue Shopping Footer */}
          <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <span className="text-slate-500">
              Free delivery unlocks at $150
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};
