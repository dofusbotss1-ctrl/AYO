export interface Product {
  id: string;
  name: string;
  description: string;
  descriptionImage?: string;
  price: number;
  images: string[];
  category: string;
  size?: string;
  finish?: 'raw' | 'painted';
  baseStyle?: string;
  variants: ProductVariant[];
  features: string[];
  inStock: boolean;
  createdAt: Date;
  discount?: number;
  originalPrice?: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  finish: 'raw' | 'painted';
  price: number;
  stock: number;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
  createdAt: Date;
  read: boolean;
  orderStatus?: 'pending' | 'confirmed' | 'sent' | 'received' | 'returned' | 'cancelled';
  orderPrice?: number;
}

export interface CustomOrder {
  id: string;
  category: string;
  description: string;
  referenceImages: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'approved' | 'printing' | 'finished' | 'shipped' | 'delivered';
  price?: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'printing' | 'finished' | 'shipped' | 'delivered';
  paymentMethod: 'paypal' | 'bank_transfer';
  bankTransferProof?: string;
  createdAt: Date;
  statusHistory: StatusEvent[];
}

export interface OrderItem {
  id: string;
  productId?: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  kind: 'standard' | 'custom';
  customSpec?: CustomSpec;
}

export interface CustomSpec {
  category: string;
  notes: string;
  referenceImages: string[];
}

export interface StatusEvent {
  id: string;
  code: string;
  message: string;
  createdAt: Date;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  addedAt: Date;
}