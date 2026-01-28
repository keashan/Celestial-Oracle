
import React from 'react';
import { Language } from '../types.ts';

interface HeaderProps {
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ language }) => {
  const badgeText = language === 'si' ? 'දිව්‍යමය ප්‍රඥාව' : 'Ethereal Wisdom';
  const tagline = language === 'si' ? 'තරු අතර සටහන් වූ ‌දෛවය' : 'Destiny written in the Stars';
  const brandName = 'Cosmic Oracle'; // Brand name remains in English to establish primary language

  return (
    <header className="text-center space-y-2 pointer-events-none select-none">
      <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-2">
        <div className="bg-[#1a1a2e] rounded-full px-4 py-1 text-xs tracking-widest text-white/80 uppercase font-semibold">
          {badgeText}
        </div>
      </div>
      <h1 className="font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 text-5xl md:text-7xl">
        {brandName}
      </h1>
      <p className="text-white/40 tracking-[0.3em] uppercase text-sm font-light">
        {tagline}
      </p>
    </header>
  );
};

export default Header;
