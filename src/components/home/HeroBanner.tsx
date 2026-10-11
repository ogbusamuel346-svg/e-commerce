import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Shield, Truck, Zap } from 'lucide-react';
import heroImg from '../../assets/images/hero_smartphone_showcase_1791586363600.jpg';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl my-4 sm:my-6">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Copy */}
        <div className="max-w-xl text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Gen 2025 Flagships &amp; Foldables</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4 text-balance">
            The Ultimate Smartphone Destination
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Experience next-generation titanium designs, 200MP camera systems, and lightning AI performance.
            Compare specifications side-by-side and shop with verified brand warranties.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Shop All Smartphones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products?minDiscount=10"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Explore Deals</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-800 text-center lg:text-left">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">24+</div>
              <div className="text-[11px] text-slate-400">Curated Models</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">9</div>
              <div className="text-[11px] text-slate-400">Leading Brands</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">100%</div>
              <div className="text-[11px] text-slate-400">Authentic Units</div>
            </div>
          </div>
        </div>

        {/* Right High-Fidelity Showcase Image */}
        <div className="relative w-full max-w-lg lg:max-w-xl shrink-0 z-10 flex items-center justify-center">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900/60 p-2 group">
            <img
              src={heroImg}
              alt="Titanium Flagship Smartphone Showcase"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800/60 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  Featured Device
                </span>
                <p className="font-bold text-white">Apple iPhone 16 Pro Max</p>
              </div>
              <Link
                to="/products/apple-iphone-16-pro-max"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
