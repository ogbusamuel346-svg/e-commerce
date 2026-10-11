import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Shield, RotateCcw, Truck, Headphones, Check } from 'lucide-react';
import { BRANDS_DATA } from '../../data/brands';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to NovaMobile smartphone drops!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Trust bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all orders above $150</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Phones</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct official brand warranties</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Replacement</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free verified returns</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Tech Concierge 24/7</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated smartphone support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Nova<span className="text-blue-400">Mobile</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your trusted destination for flagship smartphones, budget kings, and foldables.
              Compare specs side-by-side, explore authentic user reviews, and enjoy lightning-fast checkout.
            </p>

            <div className="pt-2">
              <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Stay updated on new phone launches
              </h5>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                  <Check className="w-4 h-4" />
                  <span>You are subscribed to exclusive launch deals!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Brands Column */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Top Brands
            </h5>
            <ul className="space-y-2 text-xs">
              {BRANDS_DATA.slice(0, 7).map((brand) => (
                <li key={brand.name}>
                  <Link
                    to={`/products?brand=${brand.name}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {brand.name} Phones
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=flagship" className="hover:text-blue-400 transition-colors">
                  Flagship Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=foldable" className="hover:text-blue-400 transition-colors">
                  Foldable &amp; Flip Phones
                </Link>
              </li>
              <li>
                <Link to="/products?category=gaming" className="hover:text-blue-400 transition-colors">
                  Gaming Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?maxPrice=300" className="hover:text-blue-400 transition-colors">
                  Budget Value Phones
                </Link>
              </li>
              <li>
                <Link to="/products?minDiscount=15" className="hover:text-blue-400 transition-colors">
                  Top Discounted Deals
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/checkout" className="hover:text-blue-400 transition-colors">
                  Delivery &amp; Shipping Guide
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-blue-400 transition-colors">
                  Track Demo Order
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Warranty Registration</span>
              </li>
              <li>
                <span className="text-slate-400">7-Day Return Policy</span>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Demo Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition-colors">
                  Create Demo Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} NovaMobile Inc. All rights reserved.</p>
          <p className="text-slate-500 text-center sm:text-right">
            Demonstration smartphone e-commerce catalog. All product prices and specifications are illustrative mock data.
          </p>
        </div>
      </div>
    </footer>
  );
};
