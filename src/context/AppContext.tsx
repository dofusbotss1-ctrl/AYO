import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, Category, ContactMessage, User, CartItem, CustomOrder, Order } from '../types';
import { productsService, categoriesService, messagesService } from '../services/firebaseService';

interface AppState {
  products: Product[];
  categories: Category[];
  messages: ContactMessage[];
  customOrders: CustomOrder[];
  orders: Order[];
  cart: CartItem[];
  user: User;
  searchQuery: string;
  selectedCategory: string;
  loading: {
    products: boolean;
    categories: boolean;
    messages: boolean;
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
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: { type: 'products' | 'categories' | 'messages'; loading: boolean } };

const initialState: AppState = {
  products: [],
  categories: [],
  messages: [],
  customOrders: [],
  orders: [],
  cart: [],
  user: { username: '', isAuthenticated: false },
  searchQuery: '',
  selectedCategory: '',
  loading: {
    products: true,
    categories: true,
    messages: true,
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
      // Vérifier si le produit avec la même taille existe déjà
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === action.payload.product.id && 
                item.selectedVariant?.id === action.payload.selectedVariant?.id
      );
      
      if (existingItemIndex >= 0) {
        // Augmenter la quantité si l'item existe déjà
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      } else {
        // Ajouter un nouvel item
        return { ...state, cart: [...state.cart, action.payload] };
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
  addCustomOrder: (order: Omit<CustomOrder, 'id'>) => Promise<void>;
  // Cart operations
  addToCart: (product: Product, selectedVariant?: any, quantity?: number) => void;
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
      await messagesService.update(id, message);
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await messagesService.delete(id);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const addCustomOrder = async (order: Omit<CustomOrder, 'id'>) => {
    try {
      console.log('AppContext: Ajout de la commande personnalisée', order);
      // This would use a custom orders service
      console.log('Commande personnalisée ajoutée avec succès');
    } catch (error) {
      console.error('Error adding custom order:', error);
      throw error;
    }
  };

  // Cart operations
  const addToCart = (product: Product, selectedVariant?: any, quantity: number = 1) => {
    // Vérifier si le produit avec la même variante existe déjà
    const existingItemIndex = state.cart.findIndex(
      item => item.product.id === product.id && item.selectedVariant?.id === selectedVariant?.id
    );
    
    if (existingItemIndex >= 0) {
      // Si l'item existe déjà, augmenter la quantité
      const updatedCart = [...state.cart];
      updatedCart[existingItemIndex].quantity += quantity;
      
      // Mettre à jour le state
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { 
          id: updatedCart[existingItemIndex].id, 
          quantity: updatedCart[existingItemIndex].quantity 
        } 
      });
      
      // Sauvegarder dans localStorage
      localStorage.setItem('shoesParadise_cart', JSON.stringify(updatedCart));
      return;
    }
    
    // Si l'item n'existe pas, créer un nouveau
    const cartItem: CartItem = {
      id: `${product.id}-${selectedVariant?.id || 'no-variant'}-${Date.now()}`,
      product,
      selectedVariant,
      quantity,
      addedAt: new Date()
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    
    // Sauvegarder dans localStorage
    setTimeout(() => {
      const currentCart = JSON.parse(localStorage.getItem('voyagePro_cart') || '[]');
      const newCart = [...currentCart, cartItem];
      localStorage.setItem('ayoFigurine_cart', JSON.stringify(newCart));
    }, 100);
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    
    // Mettre à jour localStorage
    const updatedCart = state.cart.filter(item => item.id !== itemId);
    localStorage.setItem('ayoFigurine_cart', JSON.stringify(updatedCart));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity } });
    
    // Mettre à jour localStorage
    const updatedCart = state.cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    localStorage.setItem('ayoFigurine_cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('ayoFigurine_cart');
  };

  const getCartTotal = () => {
    const total = state.cart.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
    return Math.round(total * 100) / 100; // Arrondir à 2 décimales
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
        // Charger tous les items en une seule fois
        dispatch({ type: 'SET_CART', payload: cartItems });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

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