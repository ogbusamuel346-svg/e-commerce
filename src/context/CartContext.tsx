import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product, ProductColor } from '../types/product';
import { useToast } from './ToastContext';
import { PRODUCTS } from '../data/products';

interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedColor: ProductColor,
    selectedStorage: string,
    selectedRam: string,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  finalTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CART_STORAGE_KEY = 'novamobile_cart_items';

const VALID_COUPONS: Record<string, Coupon> = {
  NOVA10: {
    code: 'NOVA10',
    type: 'percent',
    value: 10,
    description: '10% instant discount on smartphones',
  },
  SUPERPHONE: {
    code: 'SUPERPHONE',
    type: 'flat',
    value: 50,
    description: '$50 off on order above $400',
  },
  WELCOME20: {
    code: 'WELCOME20',
    type: 'flat',
    value: 20,
    description: '$20 welcome store voucher',
  },
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initial realistic default cart item for demo convenience
      const defaultProduct = PRODUCTS[0];
      return [
        {
          id: `${defaultProduct.id}-${defaultProduct.availableColours[0].name}-${defaultProduct.storageOptions[0]}-${defaultProduct.ramOptions[0]}`,
          productId: defaultProduct.id,
          product: defaultProduct,
          selectedColor: defaultProduct.availableColours[0],
          selectedStorage: defaultProduct.storageOptions[0],
          selectedRam: defaultProduct.ramOptions[0],
          unitPrice: defaultProduct.price,
          quantity: 1,
        },
      ];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (
    product: Product,
    selectedColor: ProductColor,
    selectedStorage: string,
    selectedRam: string,
    quantity = 1
  ) => {
    const itemId = `${product.id}-${selectedColor.name}-${selectedStorage}-${selectedRam}`;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);

      if (existing) {
        const updatedQty = Math.min(existing.quantity + quantity, product.stockQuantity);
        if (updatedQty === existing.quantity) {
          showToast(`Maximum stock available (${product.stockQuantity}) already in cart`, 'warning');
          return prevItems;
        }
        showToast(`Updated ${product.name} quantity to ${updatedQty}`, 'success');
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedQty } : item
        );
      } else {
        const safeQty = Math.min(quantity, product.stockQuantity);
        showToast(`Added ${product.name} to cart!`, 'success');
        return [
          ...prevItems,
          {
            id: itemId,
            productId: product.id,
            product,
            selectedColor,
            selectedStorage,
            selectedRam,
            unitPrice: product.price,
            quantity: safeQty,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast(`Removed ${item ? item.product.name : 'item'} from cart`, 'info');
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const max = item.product.stockQuantity || 10;
            const clamped = Math.max(1, Math.min(newQuantity, max));
            return { ...item, quantity: clamped };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    showToast('Shopping cart cleared', 'info');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[clean];

    if (!coupon) {
      showToast('Invalid promo code. Try NOVA10 or SUPERPHONE', 'error');
      return { success: false, message: 'Invalid promo code' };
    }

    setAppliedCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    // Free shipping on orders over $150
    return subtotal > 150 ? 0 : 15;
  }, [items.length, subtotal]);

  const discountTotal = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  const finalTotal = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal - discountTotal + shippingFee);
  }, [items.length, subtotal, discountTotal, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discountTotal,
        shippingFee,
        finalTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
