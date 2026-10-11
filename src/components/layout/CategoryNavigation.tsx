import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Zap, Flame, Smartphone, Layers } from 'lucide-react';

interface CategoryItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string;
}

const CATEGORIES: CategoryItem[] = [
  { label: 'All Smartphones', path: '/products' },
  { label: 'Apple iPhones', path: '/products?brand=Apple' },
  { label: 'Samsung Galaxy', path: '/products?brand=Samsung' },
  { label: 'Flagship Series', path: '/products?category=flagship' },
  { label: 'Foldables', path: '/products?category=foldable' },
  { label: 'Budget Pick', path: '/products?maxPrice=300' },
  { label: 'Gaming Phones', path: '/products?category=gaming' },
  {
    label: 'Special Offers',
    path: '/products?minDiscount=15',
    badge: 'Up to 20% Off',
  },
];

export const CategoryNavigation: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2 text-xs sm:text-sm font-medium">
          {CATEGORIES.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
