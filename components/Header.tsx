
import React from 'react';
import { Language } from '../types.ts';

interface HeaderProps {
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ language }) => {
  const tagline = language === 'si' ? 'තරු අතර සටහන් වූ ‌දෛවය' : 'Destiny written in the Stars';
  const badgeText = language === 'si' ? 'විශ්වීය ඥානය' : 'ETHEREAL WISDOM';

  // Function to handle image load error by trying alternative paths
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const currentSrc = target.getAttribute('src');
    
    // If we tried /public/logo.png and it failed, try /logo.png
    if (currentSrc?.includes('/public/logo.png')) {
       target.src = '/logo.png';
    } 
    // If we tried /logo.png and it failed (and we haven't tried public yet), try logo.png relative
    else if (currentSrc === '/logo.png') {
       target.src = 'logo.png';
    }
  };

  return (
    <header className="text-center flex flex-col items-center justify-center space-y-6 pointer-events-none select-none">
      <div className="relative group cursor-default">
        {/* Subtle background glow for the logo */}
        <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>
        
        {/* Logo Image - Tries /public/logo.png first based on user's folder structure */}
        <img 
          src="/public/logo.png" 
          onError={handleImageError}
          alt="Cosmic Oracle" 
          className="relative z-10 w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Ethereal Wisdom Badge */}
      <div className="relative p-[2px] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-fade-in">
        <div className="bg-[#0a0a1a] rounded-full px-8 py-2 relative">
           <span className="text-white font-bold tracking-[0.2em] uppercase text-xs md:text-sm drop-shadow-md">
             {badgeText}
           </span>
        </div>
      </div>
      
      <p className="text-white/40 tracking-[0.3em] uppercase text-[10px] md:text-xs font-light relative z-10">
        {tagline}
      </p>
    </header>
  );
};

export default Header;
