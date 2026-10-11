import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useStoreManage } from '../context/StoreManageContext';
import { Order } from '../types/order';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Info,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discountTotal, finalTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { addOrder } = useStoreManage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');

  // Confirmation modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  const shippingCost = deliveryMethod === 'express' ? 15 : subtotal > 150 ? 0 : 15;
  const calculatedTotal = Math.max(0, subtotal - discountTotal + shippingCost);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !address.trim() || !postalCode.trim()) {
      showToast('Please complete all delivery information', 'warning');
      return;
    }

    if (items.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    const orderNum = `NOVA-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderId(orderNum);

    // Record order to store management so it immediately appears in /admin
    const newOrder: Order = {
      id: orderNum,
      customerName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      items: items.map((it) => ({
        productId: it.productId,
        name: it.product.name,
        brand: it.product.brand,
        image: it.product.images[0],
        color: it.selectedColor.name,
        storage: it.selectedStorage,
        ram: it.selectedRam,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })),
      subtotal,
      discount: discountTotal,
      shippingCost,
      total: calculatedTotal,
      deliveryMethod,
      paymentMethod,
      status: 'Processing',
      createdAt: 'Just now',
    };
    addOrder(newOrder);

    setIsSuccessModalOpen(true);
    showToast('Demo order successfully simulated & logged!', 'success');
    clearCart();
  };

  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mb-6">
          Add at least one smartphone to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <span>Shop Smartphones</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Shopping Cart', path: '/cart' }, { label: 'Checkout' }]} />

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Checkout Demonstration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Frontend demonstration order flow · No actual transaction or payment gateway
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* Step 1: Contact Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Contact &amp; Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">State / Province *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Postal / ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shipping Option */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Delivery Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery_opt"
                  checked={deliveryMethod === 'standard'}
                  onChange={() => setDeliveryMethod('standard')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Standard Express</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Estimated 2-3 business days
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    {subtotal > 150 ? 'FREE' : '$15.00'}
                  </div>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery_opt"
                  checked={deliveryMethod === 'express'}
                  onChange={() => setDeliveryMethod('express')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Priority 24-Hour Air</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Guaranteed next-business-day delivery
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">$15.00</div>
                </div>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Simulation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>Payment Method (Demo Simulation)</span>
            </h2>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Demonstration Note:</strong> No payment details will be charged. Select your preferred test simulation method below.
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_opt"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-blue-600"
                  />
                  <Banknote className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-bold text-slate-900">Pay on Delivery (Cash / Card at Doorstep)</div>
                    <div className="text-[11px] text-slate-500">Pay securely once your smartphone is inspected</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_opt"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-blue-600"
                  />
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-bold text-slate-900">Instant UPI &amp; Bank Transfer (Simulation)</div>
                    <div className="text-[11px] text-slate-500">Simulate instant approval with mock digital ID</div>
                  </div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pay_opt"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-blue-600"
                  />
                  <Lock className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-bold text-slate-900">Credit / Debit Card (Simulation)</div>
                    <div className="text-[11px] text-slate-500">Demo sandbox test card token</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 text-sm sm:text-base font-extrabold text-white bg-orange-600 hover:bg-orange-500 rounded-2xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Place Demonstration Order (${calculatedTotal.toLocaleString()})</span>
          </button>
        </form>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 sticky top-24">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs text-slate-500 font-normal">{items.length} smartphone items</span>
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain rounded bg-slate-50 p-1 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {item.selectedStorage} · {item.selectedColor.name} · Qty: {item.quantity}
                  </p>
                </div>
                <div className="font-bold text-slate-900 tabular-nums">
                  ${(item.unitPrice * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ${subtotal.toLocaleString()}
              </span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher Discount</span>
                <span className="tabular-nums">-${discountTotal.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Shipping ({deliveryMethod === 'express' ? 'Priority 24h' : 'Standard'})</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-extrabold text-slate-900">
              <span>Final Total</span>
              <span className="text-blue-700 tabular-nums">${calculatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 space-y-1">
            <p>✓ 100% Guaranteed Official Stock</p>
            <p>✓ 7-Day Hassle-Free Replacement</p>
            <p>✓ Demonstration mode — No card charged</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/');
        }}
        title="Order Confirmation Simulation"
        maxWidth="lg"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Demo Order Placed Successfully
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              Order #{confirmedOrderId}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Thank you, {fullName}! A simulated order confirmation has been logged.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient:</span>
              <span className="font-bold text-slate-800">{fullName} ({phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destination:</span>
              <span className="font-bold text-slate-800">{address}, {city}, {state} {postalCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Method:</span>
              <span className="font-bold text-slate-800">
                {deliveryMethod === 'express' ? 'Priority 24h Air' : 'Standard Express'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-700">
                {paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Simulated Test Approved'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 text-left">
            <strong>Demonstration Notice:</strong> This completes the frontend purchasing journey. No physical product will be shipped and no banking credentials were stored.
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
