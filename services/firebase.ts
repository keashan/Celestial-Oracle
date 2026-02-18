
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Access environment variables EXPLICITLY.
 * Vite requires direct access to import.meta.env.VARIABLE_NAME for static replacement.
 * Dynamic access (e.g. env[key]) often fails to load values from .env.
 */
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validation Logging
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Firebase Config Missing. Config state:", firebaseConfig);
  console.error("1. Ensure .env file is in the root directory.");
  console.error("2. Ensure variables start with 'VITE_'.");
  console.error("3. You MUST restart the dev server (npm run dev) after creating .env.");
} else {
  console.log("✅ Firebase Config Loaded for Project:", firebaseConfig.projectId);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
