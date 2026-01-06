
import React from 'react';
import { PredictionData, Language } from '../types.ts';

interface PredictionDisplayProps {
  prediction: PredictionData;
  userName: string;
  language: Language;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, userName, language }) => {
  const intro = language === 'si' 
    ? `ආයුබෝවන්, ${userName}. තරු පවසන පරිදි මෙය ඔබට සුවිශේෂී සහ පරිවර්තනීය වසරක් වනු ඇත.`
    : `Greetings, ${userName}. The celestial currents suggest a year of transformation.`;

  return (
    <div className="space-y-12">
      <div className="glass p-14 md:p-20 rounded-[4rem] relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-16 text-[20rem] opacity-[0.04] pointer-events-none select-none">
          {prediction.symbol}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-10 mb-12">
            <span className="text-8xl md:text-9xl drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">{prediction.symbol}</span>
            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-none">{prediction.zodiacSign}</h2>
          </div>
          <p className="text-white/90 text-3xl md:text-4xl leading-relaxed mb-12 max-w-4xl font-light">
            {intro}
          </p>
          <div className="border-l-[12px] border-purple-500/30 pl-12 my-14 bg-white/5 py-14 rounded-r-[4rem]">
            <p className="text-4xl md:text-5xl italic text-purple-50 font-light leading-snug">
              "{prediction.prediction}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {prediction.monthlyBreakdown.map((item, index) => (
          <div key={index} className="glass p-12 rounded-[3rem] hover:bg-white/10 transition-all border border-white/10 hover:scale-[1.04] duration-300 group shadow-xl">
            <h3 className="text-purple-400 font-bold text-3xl mb-6 group-hover:text-purple-300 transition-colors uppercase tracking-[0.25em]">{item.month}</h3>
            <p className="text-white/90 text-2xl md:text-3xl leading-relaxed font-light">{item.highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionDisplay;
