
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Access environment variables EXPLICITLY.
 * Vite requires direct access to import.meta.env.VARIABLE_NAME for static replacement.
 * Node.js (Vercel Cron) requires process.env.
 */
const getEnv = (key: string) => {
  return (import.meta as any).env?.[key] || process.env[key];
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID')
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
