
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
    <div className="space-y-10">
      <div className="glass p-12 md:p-16 rounded-[4rem] relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 text-[15rem] opacity-[0.05] pointer-events-none select-none">
          {prediction.symbol}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-8 mb-10">
            <span className="text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{prediction.symbol}</span>
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">{prediction.zodiacSign}</h2>
          </div>
          <p className="text-white/90 text-2xl leading-relaxed mb-10 max-w-3xl">
            {intro}
          </p>
          <div className="border-l-[8px] border-purple-500/40 pl-10 my-12 bg-white/5 py-10 rounded-r-[3rem]">
            <p className="text-3xl md:text-4xl italic text-purple-50 font-light leading-snug">
              "{prediction.prediction}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prediction.monthlyBreakdown.map((item, index) => (
          <div key={index} className="glass p-10 rounded-[2.5rem] hover:bg-white/10 transition-all border border-white/10 hover:scale-[1.03] duration-300 group shadow-lg">
            <h3 className="text-purple-400 font-bold text-2xl mb-4 group-hover:text-purple-300 transition-colors uppercase tracking-[0.2em]">{item.month}</h3>
            <p className="text-white/85 text-xl leading-relaxed">{item.highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionDisplay;
