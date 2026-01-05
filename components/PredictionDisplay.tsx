
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
    <div className="space-y-6">
      <div className="glass p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none select-none">
          {prediction.symbol}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl">{prediction.symbol}</span>
            <h2 className="text-3xl font-bold text-white">{prediction.zodiacSign}</h2>
          </div>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            {intro}
          </p>
          <div className="border-l-4 border-purple-500 pl-6 my-8">
            <p className="text-xl italic text-purple-200 leading-relaxed">
              "{prediction.prediction}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prediction.monthlyBreakdown.map((item, index) => (
          <div key={index} className="glass p-5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
            <h3 className="text-purple-400 font-bold mb-1">{item.month}</h3>
            <p className="text-white/70 text-sm leading-snug">{item.highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionDisplay;
