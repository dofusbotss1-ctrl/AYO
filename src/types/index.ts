export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  stock: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  productId?: string;
  productName?: string;
  quantity?: number;
  deliveryAddress?: string;
  orderStatus?: 'pending' | 'confirmed' | 'sent' | 'delivered' | 'returned' | 'cancelled';
  orderPrice?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CustomOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  referenceImages: string[];
  budget: number;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface Charge {
  id: string;
  title: string;
  category: 'Machine' | 'Materials' | 'Marketing' | 'Logistics' | 'Other';
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Investment {
  id: string;
  title: string;
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Revenue {
  id: string;
  category: string;
  amount: number;
  date: Date;
  source: 'order' | 'manual';
  orderId?: string;
  productName?: string;
  createdAt: Date;
}