
import React, { useEffect } from 'react';
import { Language } from '../../types.ts';

interface AdOverlayProps {
  onComplete: () => void;
  onClose: () => void;
  language: Language;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ onComplete, onClose, language }) => {
  
  // Listen for the click message from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'ad-clicked') {
        onComplete();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  const t = language === 'si' ? {
    title: "විශ්වීය අනුග්‍රහය",
    subtitle: "ඔබේ අනාවැකිය සක්‍රීය කිරීමට සූදානම්...",
    btn: "අනාවැකිය විවෘත කරන්න",
    close: "පසුව බලමු"
  } : {
    title: "Celestial Sponsorship",
    subtitle: "The stars have aligned. Unlock your cosmic insight now.",
    btn: "Reveal My Destiny",
    close: "Maybe later"
  };

  // Construct the iframe content.
  // We embed the ad script inside this isolated document.
  // The button takes up the full space.
  const iframeSrc = `
    <!DOCTYPE html>
    <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background: transparent; 
            height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center;
          }
          button {
            width: 100%;
            height: 100%;
            border: none;
            background: linear-gradient(to right, #9333ea, #2563eb);
            color: white;
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          button:hover {
            opacity: 0.9;
          }
          button:active {
            opacity: 0.95;
          }
        </style>
        <!-- Ad Script Injected Here - Isolated to Iframe -->
        <script src="https://anniversaryvacuumambassador.com/76/26/c8/7626c8accddf9d88bd96515b19c81840.js"></script>
      </head>
      <body>
        <button id="actionBtn">${t.btn}</button>
        <script>
          const btn = document.getElementById('actionBtn');
          btn.onclick = function() {
            // Notify parent app
            window.parent.postMessage('ad-clicked', '*');
          };
        </script>
      </body>
    </html>
  `;

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a1a]/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full glass p-10 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.2)] text-center space-y-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full"></div>

        <div className="space-y-4 relative z-10">
          <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white">{t.title}</h2>
          <p className="text-white/50 text-sm leading-relaxed min-h-[40px]">{t.subtitle}</p>
        </div>

        <div className="relative pt-4 z-10">
          {/* 
            Iframe Container 
            We use an iframe to contain the ad script so it doesn't pollute the main window.
            The ad script inside the iframe will trigger a popunder (allowed by sandbox flags) 
            only when the button inside the iframe is clicked.
          */}
          <div className="w-full h-16 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform relative bg-gradient-to-r from-purple-600 to-blue-600">
            <iframe
              srcDoc={iframeSrc}
              title="Reveal Destiny Action"
              className="w-full h-full border-0"
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            />
          </div>
        </div>

        <button 
          onClick={onClose}
          className="text-white/20 text-[10px] uppercase tracking-widest hover:text-white/40 transition-colors pt-4 block w-full relative z-10"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

export default AdOverlay;
