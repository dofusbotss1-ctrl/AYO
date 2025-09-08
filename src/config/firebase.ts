import { initializeApp } from 'firebase/app';
import { getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXvbgECGXoXoJIOdoNSSqaMz0HeaCYcGs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ayofigurin.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ayofigurin",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ayofigurin.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "953548652701",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:953548652701:web:ec5304555d917ee9491474",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6JRX1FYLNB"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Test Firebase connection
console.log('Firebase initialisé avec succès');
console.log('Project ID: ayofigurin');
export default app;