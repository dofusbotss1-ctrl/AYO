import { 
  collection, 
  doc, 
  getDoc,
  setDoc,
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Category, ContactMessage } from '../types';

// Collections
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const MESSAGES_COLLECTION = 'messages';
const SETTINGS_COLLECTION = 'settings';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Products Service
export const productsService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Add product
  async add(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const productData = { ...product };
      // Calculate discounted price if discount is provided
      if (productData.discount && productData.discount > 0) {
        const originalPrice = productData.price;
        const discountedPrice = originalPrice * (1 - productData.discount / 100);
        productData.originalPrice = originalPrice;
        productData.price = Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
      }
      
      // Ensure createdAt is a valid Date
      if (!productData.createdAt || !(productData.createdAt instanceof Date)) {
        productData.createdAt = new Date();
      }
      
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        createdAt: Timestamp.fromDate(productData.createdAt)
      });
      console.log('Produit ajouté avec succès, ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  async update(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const updateData = { ...product };
      
      // Calculate discounted price if discount is provided
      if (updateData.discount !== undefined) {
        if (updateData.discount && updateData.discount > 0 && updateData.price) {
          const originalPrice = updateData.originalPrice || updateData.price;
          const discountedPrice = originalPrice * (1 - updateData.discount / 100);
          updateData.originalPrice = originalPrice;
          updateData.price = Math.round(discountedPrice * 100) / 100;
        } else if (updateData.discount === 0 || !updateData.discount) {
          // Remove discount
          if (updateData.originalPrice) {
            updateData.price = updateData.originalPrice;
            delete updateData.originalPrice;
          }
          delete updateData.discount;
        }
      }
      
      if (updateData.createdAt) {
        updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
      }
      
      await updateDoc(docRef, updateData);
      console.log('Produit mis à jour avec succès');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      console.log('Firebase: Suppression du produit avec ID:', id);
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
      console.log('Firebase: Produit supprimé avec succès de Firestore');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Listen to products changes
  onSnapshot(callback: (products: Product[]) => void) {
    return onSnapshot(
      query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as Product[];
        callback(products);
      },
      (error) => {
        console.error('Error listening to products:', error);
      }
    );
  }
};

// Categories Service
export const categoriesService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    try {
      const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Add category
  async add(category: Omit<Category, 'id'>): Promise<string> {
    try {
      const categoryData = { ...category };
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryData);
      console.log('Catégorie ajoutée avec succès, ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Update category
  async update(id: string, category: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await updateDoc(docRef, category);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Listen to categories changes
  onSnapshot(callback: (categories: Category[]) => void) {
    return onSnapshot(
      collection(db, CATEGORIES_COLLECTION),
      (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        callback(categories);
      },
      (error) => {
        console.error('Error listening to categories:', error);
      }
    );
  }
};

// Messages Service
export const messagesService = {
  // Get all messages
  async getAll(): Promise<ContactMessage[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, MESSAGES_COLLECTION), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as ContactMessage[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Add message
  async add(message: Omit<ContactMessage, 'id'>): Promise<string> {
    try {
      const messageData = { ...message };
      
      // Ensure createdAt is a valid Date
      if (!messageData.createdAt || !(messageData.createdAt instanceof Date)) {
        messageData.createdAt = new Date();
      }
      
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        ...messageData,
        createdAt: Timestamp.fromDate(messageData.createdAt)
      });
      console.log('Message ajouté avec succès, ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Update message
  async update(id: string, message: Partial<ContactMessage>): Promise<void> {
    try {
      const docRef = doc(db, MESSAGES_COLLECTION, id);
      const updateData = { ...message };
      if (updateData.createdAt) {
        updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
      }
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Delete message
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MESSAGES_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Listen to messages changes
  onSnapshot(callback: (messages: ContactMessage[]) => void) {
    return onSnapshot(
      query(collection(db, MESSAGES_COLLECTION), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as ContactMessage[];
        callback(messages);
      },
      (error) => {
        console.error('Error listening to messages:', error);
      }
    );
  }
};

// Settings Service
export const settingsService = {
  // Save admin credentials
  async saveAdminCredentials(credentials: { username: string; password: string }): Promise<void> {
    try {
      console.log('Tentative de sauvegarde des identifiants:', credentials);
      const settingsData = {
        adminCredentials: credentials,
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      // Use a fixed document ID for admin credentials
      const docRef = doc(db, SETTINGS_COLLECTION, 'admin_credentials');
      
      try {
        // Try to update existing document
        await updateDoc(docRef, settingsData);
        console.log('Identifiants mis à jour avec succès');
      } catch (updateError) {
        console.log('Document n\'existe pas, création d\'un nouveau document');
        // If document doesn't exist, create it using setDoc
        await setDoc(docRef, settingsData);
        console.log('Nouveau document créé avec succès');
      }
      
      console.log('Identifiants admin sauvegardés en base de données Firebase');
    } catch (error) {
      console.error('Error saving admin credentials:', error);
      throw error;
    }
  },

  // Get admin credentials
  async getAdminCredentials(): Promise<{ username: string; password: string } | null> {
    try {
      console.log('Récupération des identifiants depuis Firebase...');
      const docRef = doc(db, SETTINGS_COLLECTION, 'admin_credentials');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().adminCredentials) {
        console.log('Identifiants récupérés depuis Firebase');
        return docSnap.data().adminCredentials;
      }
      
      console.log('Aucun identifiant trouvé dans Firebase');
      return null;
    } catch (error) {
      console.error('Error getting admin credentials:', error);
      return null;
    }
  }
};