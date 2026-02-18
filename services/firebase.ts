
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx39jX2WUHzx3pwKSSweoNbHIqs_e9xtk",
  authDomain: "cosmicoracle-4b604.firebaseapp.com",
  projectId: "cosmicoracle-4b604",
  storageBucket: "cosmicoracle-4b604.firebasestorage.app",
  messagingSenderId: "181825365245",
  appId: "1:181825365245:web:6e90042dfe558b7c9e8a94",
  measurementId: "G-XEMFQCD157"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
