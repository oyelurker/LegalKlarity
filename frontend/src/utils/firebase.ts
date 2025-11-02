// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Only initialize Firebase if all required config values are present
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

import type { Auth } from 'firebase/auth';

// Check if Firebase app is already initialized to avoid duplicate initialization
let app;
let auth: Auth | null = null;

if (!getApps().length) {
  // Only initialize if we have a valid API key (not empty and not the example placeholder)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "" && firebaseConfig.apiKey !== "your-firebase-api-key-here") {
    try {
      app = initializeApp(firebaseConfig);
      // Only initialize auth if config is valid
      auth = getAuth(app);
    } catch (error: any) {
      console.warn("Firebase config error - invalid API key or config values:", error.message);
      // Don't initialize Firebase, just create a minimal app for basic functionality
      app = initializeApp({ projectId: "mock-project" });
    }
  } else {
    console.warn("Firebase not initialized - Missing or invalid API key. Using mock mode. Set VITE_FIREBASE_API_KEY in your .env file to enable Firebase.");
    // Create a mock app instance without calling getAuth to avoid errors
    app = initializeApp({ projectId: "mock-project" });
  }
} else {
  app = getApp();
  // Check if auth is already initialized before trying to get it
  // Skip auth initialization if we know config is invalid to avoid errors
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "" && firebaseConfig.apiKey !== "your-firebase-api-key-here") {
    try {
      auth = getAuth(app);
    } catch (error: any) {
      console.warn("Error getting existing Firebase Auth instance:", error.message);
      auth = null;
    }
  }
}

export { auth, app };
