
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * --- Environment Bridge ---
 * Modern bundlers like Vite do not provide 'process.env' by default and require 
 * the 'VITE_' prefix for client-side injection. This bridge ensures that 
 * 'process.env.API_KEY' is available for the Gemini SDK and app logic.
 */
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

// Map Vite-style env vars to process.env for standard access
const viteKey = (import.meta as any).env?.VITE_API_KEY;
if (viteKey && !process.env.API_KEY) {
  (process.env as any).API_KEY = viteKey;
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
