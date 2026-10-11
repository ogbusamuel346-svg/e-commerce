import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 overflow-x-auto whitespace-nowrap ${className}`}>
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-blue-600 transition-colors text-slate-500"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1.5 shrink-0" />
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-blue-600 transition-colors text-slate-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
