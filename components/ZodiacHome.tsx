
import React from 'react';
import { Language, ZODIAC_SIGNS } from '../types.ts';

interface ZodiacHomeProps {
  language: Language;
  onSignSelect: (id: string) => void;
  onLanguageChange: (lang: Language) => void;
}

const ZodiacHome: React.FC<ZodiacHomeProps> = ({ language, onSignSelect, onLanguageChange }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-[length:var(--fs-heading-main)] font-bold tracking-tight">
          {language === 'en' ? 'Choose Your Sign' : 'ඔබේ ලග්නය තෝරන්න'}
        </h2>
        <p className="text-white/40 tracking-[0.2em] uppercase text-xs">
          {language === 'en' ? 'Explore the cosmic energies of the 12 signs' : 'ලග්න 12 හි විශ්වීය ශක්තීන් ගවේෂණය කරන්න'}
        </p>

        <div className="flex justify-center mt-6">
          <div className="bg-white/5 p-1 rounded-xl border border-white/5 flex">
            <button 
              onClick={() => onLanguageChange('en')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40'}`}
            >
              English
            </button>
            <button 
              onClick={() => onLanguageChange('si')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${language === 'si' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40'}`}
            >
              සිංහල
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
        {ZODIAC_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => onSignSelect(sign.id)}
            className="group glass p-8 rounded-[2rem] flex flex-col items-center justify-center space-y-4 transition-all hover:scale-[1.05] hover:bg-white/10 active:scale-95 border border-white/5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/5 group-hover:to-purple-500/10 transition-all"></div>
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {sign.symbol}
            </span>
            <div className="text-center relative z-10">
              <div className="text-white font-bold tracking-widest uppercase text-sm">{sign.en}</div>
              <div className="text-purple-400 font-medium text-xs mt-1">{sign.si}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ZodiacHome;
