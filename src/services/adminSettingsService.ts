import { 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const SETTINGS_COLLECTION = 'settings';

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