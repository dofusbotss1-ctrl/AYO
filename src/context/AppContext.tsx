import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, Category, ContactMessage, User, CartItem, CustomOrder, Order, Charge, Investment, Revenue } from '../types';
import { productsService, categoriesService, messagesService } from '../services/firebaseService';

interface AppState {
  products: Product[];
  categories: Category[];
  messages: ContactMessage[];
  customOrders: CustomOrder[];
  orders: Order[];
  charges: Charge[];
  investments: Investment[];
  revenues: Revenue[];
  cart: {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedVariant?: string;
    addedAt: Date;
  }[];
  user: User;
  searchQuery: string;
  selectedCategory: string;
  loading: {
    products: boolean;
    categories: boolean;
    messages: boolean;
    financial: boolean;
  };
}

type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_MESSAGES'; payload: ContactMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ContactMessage }
  | { type: 'UPDATE_MESSAGE'; payload: ContactMessage }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'SET_CUSTOM_ORDERS'; payload: CustomOrder[] }
  | { type: 'ADD_CUSTOM_ORDER'; payload: CustomOrder }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_CHARGES'; payload: Charge[] }
  | { type: 'ADD_CHARGE'; payload: Charge }
  | { type: 'UPDATE_CHARGE'; payload: Charge }
  | { type: 'DELETE_CHARGE'; payload: string }
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'SET_REVENUES'; payload: Revenue[] }
  | { type: 'ADD_REVENUE'; payload: Revenue }
  | { type: 'DELETE_REVENUE'; payload: string }
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; selectedVariant?: string } }
  | { type: 'SET_CART'; payload: any[] }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: { type: 'products' | 'categories' | 'messages' | 'financial'; loading: boolean } };
const initialState: AppState = {
  products: [],
  categories: [],
  messages: [],
  customOrders: [],
  orders: [],
  charges: [],
  investments: [],
  revenues: [],
  cart: [],
  user: { username: '', isAuthenticated: false },
  searchQuery: '',
  selectedCategory: '',
  loading: {
    products: true,
    categories: true,
    messages: true,
    financial: true,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload,
        loading: { ...state.loading, products: false }
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { 
        ...state, 
        categories: action.payload,
        loading: { ...state.loading, categories: false }
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    case 'SET_MESSAGES':
      return { 
        ...state, 
        messages: action.payload,
        loading: { ...state.loading, messages: false }
      };
    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.payload),
      };
    case 'MARK_MESSAGE_READ':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload ? { ...m, read: true } : m
        ),
      };
    case 'SET_CUSTOM_ORDERS':
      return { ...state, customOrders: action.payload };
    case 'ADD_CUSTOM_ORDER':
      return { ...state, customOrders: [action.payload, ...state.customOrders] };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case 'SET_CHARGES':
      return { 
        ...state, 
        charges: action.payload,
        loading: { ...state.loading, financial: false }
      };
    case 'ADD_CHARGE':
      return { ...state, charges: [action.payload, ...state.charges] };
    case 'UPDATE_CHARGE':
      return {
        ...state,
        charges: state.charges.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CHARGE':
      return {
        ...state,
        charges: state.charges.filter(c => c.id !== action.payload),
      };
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
    case 'ADD_INVESTMENT':
      return { ...state, investments: [action.payload, ...state.investments] };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(i =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(i => i.id !== action.payload),
      };
    case 'SET_REVENUES':
      return { ...state, revenues: action.payload };
    case 'ADD_REVENUE':
      return { ...state, revenues: [action.payload, ...state.revenues] };
    case 'DELETE_REVENUE':
      return {
        ...state,
        revenues: state.revenues.filter(r => r.id !== action.payload),
      };
    case 'LOGIN':
      return {
        ...state,
        user: { username: action.payload, isAuthenticated: true },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: { username: '', isAuthenticated: false },
      };
    case 'SET_SEARCH':
      console.log('AppContext SET_SEARCH:', action.payload);
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategory: action.payload };
    case 'ADD_TO_CART':
      const newItem = {
        id: `${action.payload.product.id}-${action.payload.selectedVariant || 'default'}-${Date.now()}`,
        productId: action.payload.product.id,
        productName: action.payload.product.name,
        productImage: action.payload.product.images[0],
        price: action.payload.product.price,
        quantity: action.payload.quantity,
        selectedVariant: action.payload.selectedVariant,
        addedAt: new Date()
      };
      
      // Vérifier si le produit existe déjà
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === action.payload.product.id && 
                item.selectedVariant === action.payload.selectedVariant
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + action.payload.quantity
        };
        return { ...state, cart: updatedCart };
      } else {
        return { ...state, cart: [...state.cart, newItem] };
      }
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading
        }
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Firebase operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addMessage: (message: Omit<ContactMessage, 'id'>) => Promise<void>;
  updateMessage: (id: string, message: Partial<ContactMessage>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  addCustomOrder: (order: Omit<CustomOrder, 'id'>) => Promise<string>;
  // Financial operations
  addCharge: (charge: Omit<Charge, 'id'>) => Promise<void>;
  updateCharge: (id: string, charge: Partial<Charge>) => Promise<void>;
  deleteCharge: (id: string) => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
  updateInvestment: (id: string, investment: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  addRevenue: (revenue: Omit<Revenue, 'id'>) => Promise<void>;
  getFinancialSummary: () => {
    totalRevenue: number;
    totalCharges: number;
    totalInvestments: number;
    netProfit: number;
    monthlyData: any[];
  };
  // Cart operations
  addToCart: (product: Product, selectedVariant?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize data and set up listeners
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeCategories: (() => void) | undefined;
    let unsubscribeMessages: (() => void) | undefined;

    const initializeData = async () => {
      try {
        // Test Firebase connection first
        await productsService.getAll();
        
        // If successful, set up real-time listeners
        try {
          unsubscribeProducts = productsService.onSnapshot((products) => {
            dispatch({ type: 'SET_PRODUCTS', payload: products });
          });

          unsubscribeCategories = categoriesService.onSnapshot((categories) => {
            dispatch({ type: 'SET_CATEGORIES', payload: categories });
          });

          unsubscribeMessages = messagesService.onSnapshot((messages) => {
            dispatch({ type: 'SET_MESSAGES', payload: messages });
          });

          // Initialize with default data if collections are empty
          const [products, categories] = await Promise.all([
            productsService.getAll(),
            categoriesService.getAll()
          ]);

          if (products.length === 0) {
            // Add initial products - will be added manually through admin interface
            console.log('No products found, please add products through admin interface');
          }

          if (categories.length === 0) {
            // Add initial categories - will be added manually through admin interface  
            console.log('No categories found, please add categories through admin interface');
          }
        } catch (listenerError) {
          console.warn('Firebase listeners failed, using local data:', listenerError);
          throw listenerError;
        }
      } catch (error) {
        console.warn('Firebase not available, using local storage fallback:', error);
        
        // Fallback to localStorage when Firebase fails
        const savedProducts = localStorage.getItem('ayoFigurine_products');
        const savedCategories = localStorage.getItem('voyagePro_categories');
        const savedMessages = localStorage.getItem('voyagePro_messages');

        if (savedProducts) {
          dispatch({
            type: 'SET_PRODUCTS',
            payload: JSON.parse(savedProducts).map((p: any) => ({
              ...p,
              createdAt: new Date(p.createdAt),
            })),
          });
        } else {
          dispatch({ type: 'SET_PRODUCTS', payload: [] });
        }

        if (savedCategories) {
          dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(savedCategories) });
        } else {
          dispatch({ type: 'SET_CATEGORIES', payload: [] });
        }

        if (savedMessages) {
          dispatch({
            type: 'SET_MESSAGES',
            payload: JSON.parse(savedMessages).map((m: any) => ({
              ...m,
              createdAt: new Date(m.createdAt),
            })),
          });
        } else {
          dispatch({ type: 'SET_MESSAGES', payload: [] });
        }

        if (savedMessages) {
          dispatch({
            type: 'SET_MESSAGES',
            payload: JSON.parse(savedMessages).map((m: any) => ({
              ...m,
              createdAt: new Date(m.createdAt),
            })),
          });
        }
      }
    };

    initializeData();

    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, []);

  // Firebase operations
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      console.log('AppContext: Ajout du produit', product);
      const id = await productsService.add(product);
      console.log('Produit ajouté avec succès:', id);
    } catch (error) {
      console.error('Error adding product:', error);
      // Ne pas relancer l'erreur pour éviter les doublons d'erreur
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      console.log('AppContext: Mise à jour du produit', id, product);
      await productsService.update(id, product);
      console.log('Produit mis à jour avec succès');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      console.log('AppContext: Suppression du produit', id);
      await productsService.delete(id);
      console.log('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      console.log('AppContext: Ajout de la catégorie', category);
      const id = await categoriesService.add(category);
      console.log('Catégorie ajoutée avec succès:', id);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      await categoriesService.update(id, category);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesService.delete(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const addMessage = async (message: Omit<ContactMessage, 'id'>) => {
    try {
      console.log('AppContext: Ajout du message', message);
      const id = await messagesService.add(message);
      console.log('Message ajouté avec succès:', id);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };

  const updateMessage = async (id: string, message: Partial<ContactMessage>) => {
    try {
      // Check if order status is being updated to 'received'
      const currentMessage = state.messages.find(m => m.id === id);
      const isOrderConfirmed = message.orderStatus === 'confirmed' && currentMessage?.orderStatus !== 'confirmed';
      
      await messagesService.update(id, message);
      
      // If order is confirmed, add revenue automatically
      if (isOrderConfirmed && currentMessage?.orderPrice) {
        // Add revenue
        const productName = currentMessage?.productName || 'Figurine';
        await addRevenue({
          category: productName,
          amount: currentMessage.orderPrice,
          date: new Date(),
          source: 'order',
          orderId: id,
          productName: productName
        });
      }
      
      // Update stock when order is delivered
      if (message.orderStatus === 'delivered' && currentMessage?.orderStatus !== 'delivered' && currentMessage?.productId) {
        const product = state.products.find(p => p.id === currentMessage.productId);
        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - (currentMessage.quantity || 1));
          await updateProduct(currentMessage.productId, {
            stock: newStock,
            inStock: newStock > 0
          });
        }
      }
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      // Find the message to get order details before deletion
      const messageToDelete = state.messages.find(m => m.id === id);
      
      // Delete the message first
      await messagesService.delete(id);
      
      // If the deleted message was a confirmed order with revenue, delete associated revenue
      if (messageToDelete?.orderStatus === 'delivered' && messageToDelete?.orderPrice) {
        // Find and delete associated revenue
        const associatedRevenue = state.revenues.find(r => r.orderId === id);
        if (associatedRevenue) {
          await deleteRevenue(associatedRevenue.id);
          console.log('Revenue associé supprimé:', associatedRevenue.id);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const addCustomOrder = async (order: Omit<CustomOrder, 'id'>) => {
    try {
      console.log('AppContext: Ajout de la commande personnalisée', order);
      
      // Créer la commande personnalisée avec un ID
      const customOrderWithId = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      // Ajouter à l'état local
      dispatch({ type: 'ADD_CUSTOM_ORDER', payload: customOrderWithId });
      
      // Sauvegarder dans localStorage
      const savedCustomOrders = JSON.parse(localStorage.getItem('ayoFigurine_customOrders') || '[]');
      savedCustomOrders.unshift(customOrderWithId);
      localStorage.setItem('ayoFigurine_customOrders', JSON.stringify(savedCustomOrders));
      
      // Aussi créer un message pour l'admin
      const customOrderMessage = {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone || '',
        message: `COMMANDE PERSONNALISÉE\n\nCatégorie: ${order.category}\n\nDescription:\n${order.description}\n\nImages de référence:\n${order.referenceImages.filter(img => img).join('\n')}`,
        deliveryAddress: '',
        productName: `Commande personnalisée - ${order.category}`,
        quantity: 1,
        orderStatus: 'pending' as const,
        createdAt: new Date(),
        read: false,
      };
      
      await addMessage(customOrderMessage);
      
      console.log('Commande personnalisée ajoutée avec succès');
      return customOrderWithId.id;
    } catch (error) {
      console.error('Error adding custom order:', error);
      throw error;
    }
  };

  // Financial operations
  const addCharge = async (charge: Omit<Charge, 'id'>) => {
    try {
      console.log('AppContext: Ajout de la charge', charge);
      // For now, we'll use localStorage as fallback
      const chargeWithId = {
        ...charge,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_CHARGE', payload: chargeWithId });
      
      // Save to localStorage
      const savedCharges = JSON.parse(localStorage.getItem('ayoFigurine_charges') || '[]');
      savedCharges.unshift(chargeWithId);
      localStorage.setItem('ayoFigurine_charges', JSON.stringify(savedCharges));
      
      console.log('Charge ajoutée avec succès');
    } catch (error) {
      console.error('Error adding charge:', error);
      throw error;
    }
  };

  const updateCharge = async (id: string, charge: Partial<Charge>) => {
    try {
      const updatedCharge = { ...state.charges.find(c => c.id === id), ...charge };
      dispatch({ type: 'UPDATE_CHARGE', payload: updatedCharge as Charge });
      
      // Update localStorage
      const savedCharges = JSON.parse(localStorage.getItem('ayoFigurine_charges') || '[]');
      const updatedCharges = savedCharges.map((c: Charge) => c.id === id ? updatedCharge : c);
      localStorage.setItem('ayoFigurine_charges', JSON.stringify(updatedCharges));
    } catch (error) {
      console.error('Error updating charge:', error);
      throw error;
    }
  };

  const deleteCharge = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_CHARGE', payload: id });
      
      // Update localStorage
      const savedCharges = JSON.parse(localStorage.getItem('ayoFigurine_charges') || '[]');
      const filteredCharges = savedCharges.filter((c: Charge) => c.id !== id);
      localStorage.setItem('ayoFigurine_charges', JSON.stringify(filteredCharges));
    } catch (error) {
      console.error('Error deleting charge:', error);
      throw error;
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    try {
      const investmentWithId = {
        ...investment,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_INVESTMENT', payload: investmentWithId });
      
      // Save to localStorage
      const savedInvestments = JSON.parse(localStorage.getItem('ayoFigurine_investments') || '[]');
      savedInvestments.unshift(investmentWithId);
      localStorage.setItem('ayoFigurine_investments', JSON.stringify(savedInvestments));
    } catch (error) {
      console.error('Error adding investment:', error);
      throw error;
    }
  };

  const updateInvestment = async (id: string, investment: Partial<Investment>) => {
    try {
      const updatedInvestment = { ...state.investments.find(i => i.id === id), ...investment };
      dispatch({ type: 'UPDATE_INVESTMENT', payload: updatedInvestment as Investment });
      
      // Update localStorage
      const savedInvestments = JSON.parse(localStorage.getItem('ayoFigurine_investments') || '[]');
      const updatedInvestments = savedInvestments.map((i: Investment) => i.id === id ? updatedInvestment : i);
      localStorage.setItem('ayoFigurine_investments', JSON.stringify(updatedInvestments));
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_INVESTMENT', payload: id });
      
      // Update localStorage
      const savedInvestments = JSON.parse(localStorage.getItem('ayoFigurine_investments') || '[]');
      const filteredInvestments = savedInvestments.filter((i: Investment) => i.id !== id);
      localStorage.setItem('ayoFigurine_investments', JSON.stringify(filteredInvestments));
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  };

  const addRevenue = async (revenue: Omit<Revenue, 'id'>) => {
    try {
      const revenueWithId = {
        ...revenue,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_REVENUE', payload: revenueWithId });
      
      // Save to localStorage
      const savedRevenues = JSON.parse(localStorage.getItem('ayoFigurine_revenues') || '[]');
      savedRevenues.unshift(revenueWithId);
      localStorage.setItem('ayoFigurine_revenues', JSON.stringify(savedRevenues));
    } catch (error) {
      console.error('Error adding revenue:', error);
      throw error;
    }
  };

  const deleteRevenue = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_REVENUE', payload: id });
      
      // Update localStorage
      const savedRevenues = JSON.parse(localStorage.getItem('ayoFigurine_revenues') || '[]');
      const filteredRevenues = savedRevenues.filter((r: Revenue) => r.id !== id);
      localStorage.setItem('ayoFigurine_revenues', JSON.stringify(filteredRevenues));
      
      console.log('Revenue supprimé:', id);
    } catch (error) {
      console.error('Error deleting revenue:', error);
      throw error;
    }
  };

  const getFinancialSummary = () => {
    const totalRevenue = state.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalCharges = state.charges.reduce((sum, c) => sum + c.amount, 0);
    const totalInvestments = state.investments.reduce((sum, i) => sum + i.amount, 0);
    const netProfit = totalRevenue - totalCharges - totalInvestments;

    // Generate monthly data for the last 6 months
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRevenue = state.revenues
        .filter(r => r.date >= monthStart && r.date <= monthEnd)
        .reduce((sum, r) => sum + r.amount, 0);
        
      const monthCharges = state.charges
        .filter(c => c.date >= monthStart && c.date <= monthEnd)
        .reduce((sum, c) => sum + c.amount, 0);
        
      monthlyData.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        charges: monthCharges,
        profit: monthRevenue - monthCharges
      });
    }

    return {
      totalRevenue,
      totalCharges,
      totalInvestments,
      netProfit,
      monthlyData
    };
  };

  // Cart operations
  const addToCart = (product: Product, selectedVariant?: string, quantity: number = 1) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity, selectedVariant } 
    });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    console.log('Panier vidé avec succès');
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('ayoFigurine_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        dispatch({ type: 'SET_CART', payload: cartItems });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
    
    // Load financial data from localStorage
    const loadFinancialData = () => {
      try {
        // Load custom orders
        const savedCustomOrders = localStorage.getItem('ayoFigurine_customOrders');
        if (savedCustomOrders) {
          const customOrders = JSON.parse(savedCustomOrders).map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt)
          }));
          dispatch({ type: 'SET_CUSTOM_ORDERS', payload: customOrders });
        } else {
          dispatch({ type: 'SET_CUSTOM_ORDERS', payload: [] });
        }
        
        const savedCharges = localStorage.getItem('ayoFigurine_charges');
        if (savedCharges) {
          const charges = JSON.parse(savedCharges).map((c: any) => ({
            ...c,
            date: new Date(c.date),
            createdAt: new Date(c.createdAt)
          }));
          dispatch({ type: 'SET_CHARGES', payload: charges });
        } else {
          dispatch({ type: 'SET_CHARGES', payload: [] });
        }

        const savedInvestments = localStorage.getItem('ayoFigurine_investments');
        if (savedInvestments) {
          const investments = JSON.parse(savedInvestments).map((i: any) => ({
            ...i,
            date: new Date(i.date),
            createdAt: new Date(i.createdAt)
          }));
          dispatch({ type: 'SET_INVESTMENTS', payload: investments });
        } else {
          dispatch({ type: 'SET_INVESTMENTS', payload: [] });
        }

        const savedRevenues = localStorage.getItem('ayoFigurine_revenues');
        if (savedRevenues) {
          const revenues = JSON.parse(savedRevenues).map((r: any) => ({
            ...r,
            date: new Date(r.date),
            createdAt: new Date(r.createdAt)
          }));
          dispatch({ type: 'SET_REVENUES', payload: revenues });
        } else {
          dispatch({ type: 'SET_REVENUES', payload: [] });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données financières:', error);
      }
    };
    
    loadFinancialData();
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    console.log('Saving cart to localStorage:', state.cart);
    localStorage.setItem('ayoFigurine_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addMessage,
      updateMessage,
      deleteMessage,
      addCustomOrder,
      addCharge,
      updateCharge,
      deleteCharge,
      addInvestment,
      updateInvestment,
      deleteInvestment,
      addRevenue,
      deleteRevenue,
      getFinancialSummary,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};