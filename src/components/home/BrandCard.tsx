import React from 'react';
import { Link } from 'react-router-dom';
import { BRANDS_DATA, BrandInfo } from '../../data/brands';
import { ArrowRight, Smartphone } from 'lucide-react';

export const BrandSection: React.FC = () => {
  return (
    <section className="my-8 sm:my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Shop by Official Brand
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore authentic flagship and budget offerings from top smartphone makers
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3 sm:gap-4">
        {BRANDS_DATA.map((brand: BrandInfo) => (
          <Link
            key={brand.name}
            to={`/products?brand=${brand.name}`}
            className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-3.5 flex flex-col items-center text-center cursor-pointer"
          >
            {/* Visual Brand Mark */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-800 group-hover:text-blue-600 flex items-center justify-center font-extrabold text-sm mb-2 transition-colors border border-slate-100">
              {brand.name.slice(0, 2).toUpperCase()}
            </div>

            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {brand.name}
            </span>

            <span className="text-[10px] text-slate-400 mt-0.5">
              {brand.phoneCount} models
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
