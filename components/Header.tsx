
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center space-y-2 pointer-events-none select-none">
      <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-2">
        <div className="bg-[#1a1a2e] rounded-full px-4 py-1 text-xs tracking-widest text-white/80 uppercase font-semibold">
          Ethereal Wisdom
        </div>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
        Cosmic Oracle
      </h1>
      <p className="text-white/40 tracking-[0.3em] uppercase text-sm font-light">
        Written in the Stars
      </p>
    </header>
  );
};

export default Header;
