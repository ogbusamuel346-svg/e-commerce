import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Camera, Gamepad2 } from 'lucide-react';
import foldableImg from '../../assets/images/banner_foldable_phone_1791586376261.jpg';
import cameraImg from '../../assets/images/banner_camera_zoom_1791586386113.jpg';
import gamingImg from '../../assets/images/banner_budget_gaming_1791586396458.jpg';

export const PromoSection: React.FC = () => {
  return (
    <section className="my-8 sm:my-12 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Curated Smartphone Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Engineered for photographers, mobile gamers, and multithreaded professionals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Foldable Phones */}
        <div className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={foldableImg}
              alt="Next-Gen Foldable & Flip Phones"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-purple-600/90 backdrop-blur-xs px-2 py-0.5 rounded">
              Foldable Era
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                Dual-Screen Foldables
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Galaxy Z Fold 6, Motorola Razr 50 Ultra, and Tecno Phantom V Fold. Desktop productivity in your pocket.
              </p>
            </div>

            <Link
              to="/products?category=foldable"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Explore Foldables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Professional Optics */}
        <div className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={cameraImg}
              alt="Leica & ZEISS co-engineered mobile cameras"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded">
              Pro Imaging
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                1-Inch &amp; Periscope Optics
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Xiaomi 14 Ultra with Leica Summilux and vivo X100 Pro with ZEISS APO telephoto. Shoot magazine-cover portraits.
              </p>
            </div>

            <Link
              to="/products?category=flagship"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Discover Camera Kings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Mobile Gaming */}
        <div className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={gamingImg}
              alt="High-FPS Gaming Smartphones"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-orange-600/90 backdrop-blur-xs px-2 py-0.5 rounded">
              144Hz Esports
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                Esports &amp; High-FPS Gaming
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Infinix GT 20 Pro and Tecno Pova 6 Pro with bypass charging and dedicated display interpolation chips.
              </p>
            </div>

            <Link
              to="/products?category=gaming"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Shop Gaming Phones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
