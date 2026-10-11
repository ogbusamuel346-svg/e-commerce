export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  color: string;
  storage: string;
  ram: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'cod' | 'upi' | 'card';
  status: OrderStatus;
  createdAt: string;
}
