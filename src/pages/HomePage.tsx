import React from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/home/HeroBanner';
import { BrandSection } from '../components/home/BrandCard';
import { PromoSection } from '../components/home/PromoSection';
import { ProductCard } from '../components/products/ProductCard';
import { useStoreManage } from '../context/StoreManageContext';
import { ArrowRight, Flame, Sparkles, Award, Wallet, ShieldCheck, RefreshCw } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products } = useStoreManage();
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const flagships = products.filter((p) => p.category === 'flagship').slice(0, 4);
  const budgetPhones = products.filter((p) => p.price <= 300).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      {/* Hero Section */}
      <HeroBanner />

      {/* Brands Section */}
      <BrandSection />

      {/* Best Sellers Section */}
      <section className="my-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Best-Selling Smartphones
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Most popular customer choices with verified satisfaction ratings
              </p>
            </div>
          </div>
          <Link
            to="/products?sortBy=recommended"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Promo Collections */}
      <PromoSection />

      {/* Flagship Tier Section */}
      <section className="my-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Premium Flagship Lineup
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Uncompromising titanium hardware, pro camera systems, and extreme processing power
              </p>
            </div>
          </div>
          <Link
            to="/products?category=flagship"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {flagships.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Budget Kings Section */}
      <section className="my-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Budget Champions (Under $300)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Incredible 5G speeds, 120Hz displays, and massive batteries without breaking the bank
              </p>
            </div>
          </div>
          <Link
            to="/products?maxPrice=300"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {budgetPhones.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Shop with NovaMobile */}
      <section className="my-12 p-8 sm:p-10 rounded-2xl bg-white border border-slate-200">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Hundreds of Thousands Choose NovaMobile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built with a commitment to authentic smartphone inventory and transparent specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Guaranteed Original</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every device comes sealed from certified brand distributors with authentic serial number verification.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">7-Day Replacement Policy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Experience total peace of mind with prompt replacement should any unexpected hardware fault occur.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Easily evaluate processors, battery capacities, and camera megapixels across competing brands before buying.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
