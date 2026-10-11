import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Search,
  Heart,
  ShoppingBag,
  User,
  Scale,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Package,
  Database,
  Cloud,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { useStoreManage } from '../../context/StoreManageContext';
import { SearchBar } from '../ui/SearchBar';
import { FirebaseSetupModal } from '../ui/FirebaseSetupModal';
import { CloudinarySetupModal } from '../ui/CloudinarySetupModal';

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareList, setIsCompareModalOpen } = useCompare();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { headerTickerText } = useStoreManage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top motion announcement ticker bar */}
      <div className="bg-blue-600 text-white text-[11px] sm:text-xs py-1.5 overflow-hidden whitespace-nowrap select-none border-b border-blue-700/50">
        <div className="animate-ticker flex items-center">
          {/* First loop of announcement items */}
          <div className="flex items-center space-x-8 px-4 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <strong>{headerTickerText}</strong>
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>🚚</span>
              <strong>Free Express Shipping</strong> on all orders over $150
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>🏷️</span>
              Use promo code <strong className="underline decoration-white/60 tracking-wider bg-blue-700 px-1.5 py-0.5 rounded">NOVA10</strong> for 10% instant discount
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>✨</span>
              <strong>Newly Updated:</strong> Samsung Galaxy S25 Ultra &amp; iPhone 16 Pro Max restocked
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>🛡️</span>
              <strong>100% Genuine Devices</strong> · 7-Day Hassle-Free Replacement &amp; Brand Warranty
            </span>
          </div>

          {/* Duplicate loop for seamless infinite motion */}
          <div className="flex items-center space-x-8 px-4 font-medium" aria-hidden="true">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <strong>{headerTickerText}</strong>
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>🚚</span>
              <strong>Free Express Shipping</strong> on all orders over $150
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>🏷️</span>
              Use promo code <strong className="underline decoration-white/60 tracking-wider bg-blue-700 px-1.5 py-0.5 rounded">NOVA10</strong> for 10% instant discount
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>✨</span>
              <strong>Newly Updated:</strong> Samsung Galaxy S25 Ultra &amp; iPhone 16 Pro Max restocked
            </span>
            <span className="text-blue-200">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span>🛡️</span>
              <strong>100% Genuine Devices</strong> · 7-Day Hassle-Free Replacement &amp; Brand Warranty
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-16">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-blue-900 leading-none">
                Nova<span className="text-blue-600">Mobile</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-tight">
                Smartphones & Tech
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <SearchBar />
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Compare Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Compare Smartphones"
              >
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Compare</span>
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Account dropdown / Login */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                aria-expanded={accountMenuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline text-xs font-semibold">
                  {currentUser ? currentUser.name : 'Sign In'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span className="truncate">{currentUser ? currentUser.name : 'Guest Customer'}</span>
                      {isAdmin && (
                        <span className="text-[9px] uppercase font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          ADMIN
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser ? currentUser.email : 'Browse & shop freely'}
                    </p>
                  </div>

                  <Link
                    to="/cart"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    <span>My Cart ({itemCount})</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span>My Wishlist ({wishlistCount})</span>
                  </Link>

                  <Link
                    to="/checkout"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Checkout Flow</span>
                  </Link>

                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setIsCloudinaryModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border-t border-blue-100 cursor-pointer text-left"
                  >
                    <Cloud className="w-4 h-4 text-blue-600" />
                    <span>Cloudinary Storage Setup</span>
                  </button>

                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setIsFirebaseModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50/70 hover:bg-amber-100/70 border-t border-amber-100 cursor-pointer text-left"
                  >
                    <Database className="w-4 h-4 text-amber-600" />
                    <span>Firebase Credentials Setup</span>
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    {currentUser ? (
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <div className="space-y-1 px-2 py-1">
                        <Link
                          to="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center justify-center text-xs text-slate-600 hover:text-blue-600 py-1"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Wishlist"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-white text-blue-700 text-[11px] font-extrabold flex items-center justify-center">
                {itemCount}
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 pt-1">
            Explore Categories
          </div>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            All Smartphones
          </Link>
          <Link
            to="/products?brand=Apple"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            Apple iPhones
          </Link>
          <Link
            to="/products?brand=Samsung"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            Samsung Galaxy
          </Link>
          <Link
            to="/products?category=flagship"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            Flagship Smartphones
          </Link>
          <Link
            to="/products?category=gaming"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            Gaming Phones
          </Link>
          <Link
            to="/products?minDiscount=15"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50"
          >
            Deals &amp; Special Offers
          </Link>

          <div className="border-t border-slate-100 pt-2 flex items-center justify-around">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
            >
              <Heart className="w-4 h-4 text-orange-500" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            {compareList.length > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCompareModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Compare ({compareList.length})</span>
              </button>
            )}
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name.split(' ')[0]})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          <div className="pt-1 space-y-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCloudinaryModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-800 font-bold text-xs rounded-lg border border-blue-200 cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-blue-600" />
              <span>Cloudinary Storage Setup</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsFirebaseModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-50 text-amber-800 font-bold text-xs rounded-lg border border-amber-200 cursor-pointer"
            >
              <Database className="w-4 h-4 text-amber-600" />
              <span>Firebase Credentials Setup</span>
            </button>
          </div>
        </div>
      )}

      {/* Cloudinary Setup Modal Dialog */}
      <CloudinarySetupModal
        isOpen={isCloudinaryModalOpen}
        onClose={() => setIsCloudinaryModalOpen(false)}
      />

      {/* Firebase Setup Modal Dialog */}
      <FirebaseSetupModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </header>
  );
};
