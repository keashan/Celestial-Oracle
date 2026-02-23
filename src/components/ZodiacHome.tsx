
import React from 'react';
import { Language, ZODIAC_SIGNS } from '../../types.ts';

interface ZodiacHomeProps {
  language: Language;
  onSignSelect: (id: string) => void;
}

const ZodiacHome: React.FC<ZodiacHomeProps> = ({ language, onSignSelect }) => {
  return (
    <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-4xl mx-auto border border-white/10 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-[length:var(--fs-heading-main)] font-bold tracking-tight text-white">
          {language === 'en' ? 'Choose Your Sign' : 'ඔබේ ලග්නය තෝරන්න'}
        </h2>
        <p className="text-white/40 tracking-[0.2em] uppercase text-xs">
          {language === 'en' ? 'Explore the cosmic energies of the 12 signs' : 'ලග්න 12 හි විශ්වීය ශක්තීන් ගවේෂණය කරන්න'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {ZODIAC_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => onSignSelect(sign.id)}
            className="group glass p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-3 transition-all hover:scale-[1.05] hover:bg-white/10 active:scale-95 border border-white/5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/5 group-hover:to-purple-500/10 transition-all"></div>
            <span className="text-5xl group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {sign.symbol}
            </span>
            <div className="text-center relative z-10">
              <div className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">{sign.en}</div>
              <div className="text-purple-400 font-medium text-[10px] md:text-xs mt-0.5">{sign.si}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ZodiacHome;
