import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { useToast } from './ToastContext';

interface StoreCoupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
}

interface StoreManageContextType {
  products: Product[];
  orders: Order[];
  coupons: StoreCoupon[];
  headerTickerText: string;
  setHeaderTickerText: (text: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  updateProductImage: (productId: string, newImageUrl: string) => void;
  toggleProductFeatured: (productId: string) => void;
  toggleProductBestSeller: (productId: string) => void;
  addNewProduct: (newProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addCoupon: (coupon: StoreCoupon) => void;
  deleteCoupon: (code: string) => void;
}

const PRODUCTS_STORAGE_KEY = 'novamobile_custom_products';
const ORDERS_STORAGE_KEY = 'novamobile_orders_store';
const COUPONS_STORAGE_KEY = 'novamobile_store_coupons';
const TICKER_STORAGE_KEY = 'novamobile_header_ticker_text';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'NOVA-918231',
    customerName: 'Alex Rivers',
    email: 'alex.rivers@novamobile.demo',
    phone: '+1 (555) 019-2834',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    items: [
      {
        productId: 'apple-iphone-16-pro-max',
        name: 'Apple iPhone 16 Pro Max',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        color: 'Desert Titanium',
        storage: '256 GB',
        ram: '8 GB',
        unitPrice: 1199,
        quantity: 1,
      },
    ],
    subtotal: 1199,
    discount: 119,
    shippingCost: 0,
    total: 1080,
    deliveryMethod: 'express',
    paymentMethod: 'cod',
    status: 'Shipped',
    createdAt: 'Today, 11:32 AM',
  },
  {
    id: 'NOVA-774102',
    customerName: 'Samantha Lee',
    email: 'samantha.lee@client.com',
    phone: '+1 (555) 881-9921',
    address: '102 Marina Boulevard',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94123',
    items: [
      {
        productId: 'samsung-galaxy-s25-ultra',
        name: 'Samsung Galaxy S25 Ultra 5G',
        brand: 'Samsung',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        color: 'Titanium Silverblue',
        storage: '512 GB',
        ram: '16 GB',
        unitPrice: 1299,
        quantity: 1,
      },
      {
        productId: 'redmi-13c-5g',
        name: 'Redmi 13C 5G',
        brand: 'Redmi',
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
        color: 'Starlight Silver',
        storage: '128 GB',
        ram: '6 GB',
        unitPrice: 139,
        quantity: 2,
      },
    ],
    subtotal: 1577,
    discount: 50,
    shippingCost: 0,
    total: 1527,
    deliveryMethod: 'standard',
    paymentMethod: 'upi',
    status: 'Processing',
    createdAt: 'Yesterday, 3:15 PM',
  },
  {
    id: 'NOVA-619280',
    customerName: 'Marcus Sterling',
    email: 'marcus.s@luxuryphoto.com',
    phone: '+1 (555) 441-2091',
    address: '45 Lexington Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10017',
    items: [
      {
        productId: 'xiaomi-14-ultra',
        name: 'Xiaomi 14 Ultra 5G',
        brand: 'Xiaomi',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
        color: 'Black Vegan Leather',
        storage: '512 GB',
        ram: '16 GB',
        unitPrice: 1149,
        quantity: 1,
      },
    ],
    subtotal: 1149,
    discount: 0,
    shippingCost: 0,
    total: 1149,
    deliveryMethod: 'express',
    paymentMethod: 'card',
    status: 'Delivered',
    createdAt: 'Oct 08, 2026',
  },
];

const INITIAL_COUPONS: StoreCoupon[] = [
  { code: 'NOVA10', type: 'percent', value: 10, description: '10% instant discount on smartphones' },
  { code: 'SUPERPHONE', type: 'flat', value: 50, description: '$50 off on orders above $400' },
  { code: 'WELCOME20', type: 'flat', value: 20, description: '$20 welcome voucher' },
  { code: 'FLASHSALE', type: 'percent', value: 15, description: '15% weekend flash discount' },
];

const StoreManageContext = createContext<StoreManageContextType | undefined>(undefined);

export const StoreManageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<StoreCoupon[]>(() => {
    try {
      const stored = localStorage.getItem(COUPONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [headerTickerText, setHeaderTickerTextState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(TICKER_STORAGE_KEY);
      return stored || 'Official Smartphone Festival · Free Express Shipping on orders over $150 · Use promo code NOVA10 for 10% off';
    } catch {
      return 'Official Smartphone Festival · Free Express Shipping on orders over $150 · Use promo code NOVA10 for 10% off';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    } catch {
      // ignore
    }
  }, [coupons]);

  const setHeaderTickerText = (text: string) => {
    setHeaderTickerTextState(text);
    try {
      localStorage.setItem(TICKER_STORAGE_KEY, text);
      showToast('Header motion announcement updated!', 'success');
    } catch {
      // ignore
    }
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: Math.max(0, newStock) } : p))
    );
    showToast('Inventory stock updated', 'success');
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: Math.max(1, newPrice) } : p))
    );
    showToast('Product price updated', 'success');
  };

  const updateProductImage = (productId: string, newImageUrl: string) => {
    if (!newImageUrl.trim()) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              images: [newImageUrl.trim(), ...(Array.isArray(p.images) ? p.images.slice(1) : [])],
            }
          : p
      )
    );
    showToast('Product smartphone image updated with Cloudinary asset!', 'success');
  };

  const toggleProductFeatured = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, featured: !p.featured } : p))
    );
    showToast('Updated featured status', 'info');
  };

  const toggleProductBestSeller = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, bestSeller: !p.bestSeller } : p))
    );
    showToast('Updated best seller status', 'info');
  };

  const addNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added ${newProduct.name} to catalogue!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from store catalogue', 'info');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} marked as ${status}`, 'success');
  };

  const addCoupon = (coupon: StoreCoupon) => {
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);
    showToast(`Coupon "${coupon.code}" added!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon "${code}" removed`, 'info');
  };

  return (
    <StoreManageContext.Provider
      value={{
        products,
        orders,
        coupons,
        headerTickerText,
        setHeaderTickerText,
        updateProductStock,
        updateProductPrice,
        updateProductImage,
        toggleProductFeatured,
        toggleProductBestSeller,
        addNewProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </StoreManageContext.Provider>
  );
};

export const useStoreManage = () => {
  const context = useContext(StoreManageContext);
  if (!context) {
    throw new Error('useStoreManage must be used within a StoreManageProvider');
  }
  return context;
};
