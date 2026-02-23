
import React from 'react';
import { Language } from '../../types.ts';

interface HeaderProps {
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ language }) => {
  const tagline = language === 'si' ? 'තරු අතර සටහන් වූ ‌දෛවය' : 'Destiny written in the Stars';
  const badgeText = language === 'si' ? 'විශ්වීය ඥානය' : 'ETHEREAL WISDOM';

  return (
    <header className="flex flex-row items-center justify-center gap-4 md:gap-8 pointer-events-none select-none py-2">
      {/* Column 1: Logo */}
      <div className="relative group cursor-default shrink-0">
        {/* Subtle background glow for the logo */}
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>
        
        <img 
          src="/logo.png" 
          alt="Cosmic Oracle" 
          className="relative z-10 w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Column 2: Text Content */}
      <div className="flex flex-col items-start justify-center space-y-3">
        {/* Ethereal Wisdom Badge */}
        <div className="relative p-[1px] md:p-[2px] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-fade-in">
          <div className="bg-[#0a0a1a] rounded-full px-5 py-1.5 md:px-8 md:py-2 relative">
             <span className="text-white font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs drop-shadow-md whitespace-nowrap">
               {badgeText}
             </span>
          </div>
        </div>
        
        {/* Tagline */}
        <p className="text-white/40 tracking-[0.3em] uppercase text-[9px] md:text-[10px] font-light relative z-10 pl-1">
          {tagline}
        </p>
      </div>
    </header>
  );
};

export default Header;
