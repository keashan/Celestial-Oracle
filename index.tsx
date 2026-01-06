
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * --- Environment Bridge ---
 * Ensures 'process.env.API_KEY' is available for the Gemini SDK.
 * Checks standard Vite, Vercel, and React prefixes.
 */
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const env = (import.meta as any).env || {};
const potentialKeys = [
  env.VITE_API_KEY,
  env.API_KEY,
  (process.env as any).VITE_API_KEY,
  (process.env as any).API_KEY
];

const foundKey = potentialKeys.find(k => !!k && typeof k === 'string');

if (foundKey) {
  (process.env as any).API_KEY = foundKey;
}
/** --- End Bridge --- */

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
