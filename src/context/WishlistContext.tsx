import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types/product';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = 'novamobile_wishlist_ids';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['apple-iphone-16-pro-max', 'samsung-galaxy-s25-ultra'];
    } catch {
      return ['apple-iphone-16-pro-max', 'samsung-galaxy-s25-ultra'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // storage quota or private browsing
    }
  }, [wishlistIds]);

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const productName = product ? product.name : 'Item';

    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast(`${productName} removed from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`${productName} added to wishlist!`, 'success');
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast(`${product ? product.name : 'Item'} removed from wishlist`, 'info');
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast('Wishlist cleared', 'info');
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
