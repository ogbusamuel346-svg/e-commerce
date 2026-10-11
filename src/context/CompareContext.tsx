import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types/product';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);

  const addToCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }

    if (compareList.length >= 4) {
      showToast('You can compare up to 4 smartphones simultaneously', 'warning');
      return;
    }

    setCompareList((prev) => [...prev, product]);
    showToast(`Added ${product.name} to comparison`, 'info');
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareModalOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
