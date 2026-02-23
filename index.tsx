
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

/**
 * --- Environment Bridge ---
 * Ensures 'process.env.API_KEY' is available for the Gemini SDK.
 * Checks standard Vite, Vercel, and React prefixes.
 */
const initEnvironment = () => {
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: {} };
  }

  const env = (import.meta as any).env || {};
  const potentialKeys = [
    env.VITE_API_KEY,
    env.API_KEY,
    (process.env as any).VITE_API_KEY,
    (process.env as any).API_KEY,
    // Add local fallback if any
    (window as any).__ENV__?.API_KEY
  ];

  const foundKey = potentialKeys.find(k => !!k && typeof k === 'string');

  if (foundKey) {
    (process.env as any).API_KEY = foundKey;
  }
};

initEnvironment();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (err) {
  console.error("Critical mount error:", err);
  rootElement.innerHTML = `
    <div style="color: white; padding: 20px; font-family: sans-serif; text-align: center; margin-top: 20vh;">
      <h2 style="font-size: 24px; color: #ff4d4d;">Celestial Connection Interrupted</h2>
      <p style="opacity: 0.6;">The stars were unable to align for this session.</p>
      <button onclick="window.location.reload()" style="background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 20px;">Try Reloading</button>
    </div>
  `;
}
