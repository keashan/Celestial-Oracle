
import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';

interface AdOverlayProps {
  onComplete: () => void;
  onClose: () => void;
  language: Language;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ onComplete, onClose, language }) => {
  const [isAdLoading, setIsAdLoading] = useState(true);

  useEffect(() => {
    // Simulate a "Ritual" delay instead of an actual AdSense Video call
    // This maintains the "Celestial Sponsorship" experience requested without the rewarded ad format.
    const timer = setTimeout(() => {
      setIsAdLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const t = language === 'si' ? {
    title: "විශ්වීය අනුග්‍රහය",
    subtitle: isAdLoading ? "විශ්වීය සංඥා සම්බන්ධ කරමින්..." : "ඔබේ අනාවැකිය සක්‍රීය කිරීමට සූදානම්...",
    btn: "අනාවැකිය විවෘත කරන්න",
    close: "පසුව බලමු"
  } : {
    title: "Celestial Sponsorship",
    subtitle: isAdLoading ? "Connecting to celestial signals..." : "The stars have aligned. Unlock your cosmic insight now.",
    btn: "Reveal My Destiny",
    close: "Maybe later"
  };

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
          {isAdLoading ? (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <span className="text-[10px] text-white/20 uppercase tracking-widest animate-pulse">Synchronizing...</span>
            </div>
          ) : (
            <button 
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-white animate-fade-in"
            >
              {t.btn}
            </button>
          )}
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
